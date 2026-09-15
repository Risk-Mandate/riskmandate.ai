'use strict';
// abp/abp-vaults.js — behaviour-policy vaults, read live on the page. Page-specific (scripts/site/abp/), not a shared module.
//
// The page reads an encrypted SG/Vault directly: derive the ref id from the
// published READ key with HMAC-SHA256, fetch ciphertext over CORS from the vault
// API (plain GETs, no auth header), decrypt with Web Crypto, walk ref → commit →
// tree → blob. The reader is copied from sgit.ai's assets/vault-embed.js (house
// code, published to be copied rather than fetched across origins), trimmed to
// the read path and the app mount.
//
// The rule this file follows, from sgit.ai's site-pages brief: THE VIEWER IS THE
// SITE'S, THE DATA IS THE VAULT'S. Every vault string lands in textContent through
// dom.el; nothing from the vault reaches innerHTML. The vault's own app runs only
// inside a sandboxed frame (allow-scripts, opaque origin) and is served its reads
// over postMessage. Objects whose id carries -imm- are immutable and cached; the
// ref never is, because a stale ref renders an older commit from valid ciphertext
// and nothing errors.
//
// If the vault cannot be reached the page falls back to the copy served from this
// site under vaults/<slug>/ and SAYS SO, in the status chip. A page that reads live
// in one panel and from a snapshot in the next without telling anyone is the
// failure mode the brief warns about.
//
// The read keys below are PUBLIC BY DESIGN: derived one-way, read and nothing else,
// printed where a human can copy them. No write credential is anywhere in site/.

RM.services.abpVaults = (function () {
  var dom = RM.components.dom;
  var ENDPOINT = 'https://dev.send.sgraph.ai';
  var UI       = 'https://dev.vault.sgraph.ai';

  var VAULTS = /*__VAULTS__*/[];
  var APP_VAULT = /*__APP_VAULT__*/null;   // the renderer's own vault: { vault_id, key, entry }
  var appReaderP = null;
  function appReader() { if (!APP_VAULT) return Promise.reject(new Error('no app vault in the catalogue')); if (!appReaderP) appReaderP = new Reader({ endpoint: ENDPOINT, vault_id: APP_VAULT.vault_id, read_key: APP_VAULT.key }).init().then(function (r) { return r.open(); }); return appReaderP; }
  function bySlug(slug) { for (var i = 0; i < VAULTS.length; i++) if (VAULTS[i].slug === slug) return VAULTS[i]; return null; }
  function publicKey(v) { return 'sgit_public_read_' + v.key + ':' + v.vid; }

  // ---- the reader (sgit.ai assets/vault-embed.js, read path only) ----
  var enc = new TextEncoder(), dec = new TextDecoder();
  function hexToBytes(hex) { var out = new Uint8Array(hex.length / 2); for (var i = 0; i < out.length; i++) out[i] = parseInt(hex.substr(i * 2, 2), 16); return out; }
  function bytesToHex(b) { var s = ''; for (var i = 0; i < b.length; i++) s += b[i].toString(16).padStart(2, '0'); return s; }
  function b64ToBytes(b64) { var bin = atob(b64), out = new Uint8Array(bin.length); for (var i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i); return out; }

  function Reader(cfg) { this.endpoint = cfg.endpoint.replace(/\/$/, ''); this.vaultId = cfg.vault_id; this.readKey = cfg.read_key; this.mem = new Map(); }
  Reader.prototype.init = async function () {
    if (!(window.crypto && window.crypto.subtle)) throw new Error('Web Crypto unavailable: a secure context (https or localhost) is needed');
    var raw = hexToBytes(this.readKey);
    this.aesKey  = await crypto.subtle.importKey('raw', raw, 'AES-GCM', false, ['decrypt']);
    this.hmacKey = await crypto.subtle.importKey('raw', raw, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    return this;
  };
  Reader.prototype.fileId = async function (domain) { var mac = await crypto.subtle.sign('HMAC', this.hmacKey, enc.encode(domain)); return bytesToHex(new Uint8Array(mac)).slice(0, 12); };
  Reader.prototype.decrypt = async function (bytes) { var pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: bytes.slice(0, 12), tagLength: 128 }, this.aesKey, bytes.slice(12)); return new Uint8Array(pt); };
  Reader.prototype.raw = async function (path) {
    var r = await fetch(this.endpoint + '/api/vault/read/' + this.vaultId + '/' + path, { cache: path.indexOf('-imm-') !== -1 ? 'default' : 'no-store' });
    if (!r.ok) throw new Error('HTTP ' + r.status + ' for ' + path);
    return new Uint8Array(await r.arrayBuffer());
  };
  Reader.prototype.obj = async function (id) { if (this.mem.has(id)) return this.mem.get(id); var plain = await this.decrypt(await this.raw('bare/data/' + id)); this.mem.set(id, plain); return plain; };
  Reader.prototype.objJson = async function (id) { return JSON.parse(dec.decode(await this.obj(id))); };
  Reader.prototype.decB64 = async function (b64) { return b64 ? dec.decode(await this.decrypt(b64ToBytes(b64))) : ''; };
  Reader.prototype.open = async function () {
    var refId = 'ref-pid-muw-' + await this.fileId('sg-vault-v1:file-id:ref:' + this.vaultId);
    var ref = JSON.parse(dec.decode(await this.decrypt(await this.raw('bare/refs/' + refId))));
    this.commitId = ref.commit_id;
    var commit = await this.objJson(ref.commit_id);
    this.commit = commit;
    this.files = {};
    await this.walk(commit.tree_id, '');
    return this;
  };
  Reader.prototype.walk = async function (treeId, prefix) {
    var tree = await this.objJson(treeId);
    for (var i = 0; i < (tree.entries || []).length; i++) {
      var e = tree.entries[i], name = await this.decB64(e.name_enc), full = prefix ? prefix + '/' + name : name;
      if (e.tree_id) await this.walk(e.tree_id, full); else this.files[full] = e.blob_id;
    }
  };
  Reader.prototype.readBytes = async function (path) { path = path.replace(/^\.?\//, ''); if (!this.files[path]) throw new Error('not in vault: ' + path); return this.obj(this.files[path]); };
  Reader.prototype.readText  = async function (path) { return dec.decode(await this.readBytes(path)); };

  // ---- load one vault's data: live, or the snapshot served from this site ----
  var PATHS = { vault: 'vault.json', grant: 'data/grant.json', mandate: 'data/mandate.json', delta: 'data/delta.json', validity: 'data/validity.json', history: 'history/index.json',
                capabilities: 'data/vocabulary/capabilities.json', barriers: 'data/vocabulary/barriers.json', undo: 'data/vocabulary/undo-classes.json', tiers: 'data/vocabulary/evidence-tiers.json' };
  var loads = {};
  function load(slug) {
    if (loads[slug]) return loads[slug];
    var v = bySlug(slug);
    loads[slug] = (async function () {
      var out = { vault: v, data: {}, source: 'live', files: [], commit: null, error: null };
      try {
        var reader = await new Reader({ endpoint: ENDPOINT, vault_id: v.vid, read_key: v.key }).init();
        await reader.open();
        for (var k in PATHS) out.data[k] = JSON.parse(await reader.readText(PATHS[k]));
        out.files = Object.keys(reader.files).sort();
        out.commit = reader.commitId;
        out.reader = reader;
      } catch (e) {
        out.source = 'snapshot'; out.error = String(e && e.message || e);
        for (var k2 in PATHS) {
          var r = await fetch('vaults/' + slug + '/' + PATHS[k2], { cache: 'no-store' });
          if (!r.ok) throw new Error('snapshot missing: ' + PATHS[k2]);
          out.data[k2] = await r.json();
        }
      }
      var d = out.data;
      out.cap = {}; d.capabilities.capabilities.forEach(function (c) { out.cap[c.id] = c; });
      out.undoRank = {}; d.undo.order.forEach(function (u, i) { out.undoRank[u] = i; });
      out.measured = {}; d.tiers.counted_as_measured.forEach(function (t) { out.measured[t] = true; });
      out.row = {}; d.grant.grant.forEach(function (r) { out.row[r.capability] = r; });
      return out;
    })();
    return loads[slug];
  }

  // ---- rendering helpers: every vault string goes through dom.el / textContent ----
  var GLYPH = { none: '●', expectation: '◉', setting: '◐', boundary: '○' };
  function gloss(L, id) { return (L.cap[id] && L.cap[id].gloss) || id; }
  function statusOf(L, id) { var m = L.data.mandate; return m.want.indexOf(id) >= 0 ? 'want' : m.do_not_want.indexOf(id) >= 0 ? 'refused' : 'unstated'; }
  function sortRows(L, ids) {
    var order = L.data.grant.grant.map(function (r) { return r.capability; });
    return ids.slice().sort(function (a, b) { return (L.undoRank[L.row[a].undo] - L.undoRank[L.row[b].undo]) || (order.indexOf(a) - order.indexOf(b)); });
  }
  function barrierCell(L, id) { var r = L.row[id]; return dom.el('td', null, [dom.el('span', { class: 'ab-g ' + r.barrier }, [GLYPH[r.barrier] + ' ' + r.barrier])]); }
  function evidenceCell(L, id) { var r = L.row[id], m = !!L.measured[r.evidence]; return dom.el('td', null, [dom.el('span', { class: 'ab-ev' + (m ? ' m' : '') }, [r.evidence + (m ? ' ✓' : '')])]); }
  function statusCell(L, id) { var s = statusOf(L, id); return dom.el('td', null, [dom.el('span', { class: 'ab-pill ' + s }, [{ want: 'want', refused: 'do not want', unstated: 'unstated' }[s]])]); }
  function capTable(L, ids, control) {
    var head = ['Capability', 'What it is', 'Barrier', 'Undo', 'Evidence'].concat(control ? ['What stands in the way'] : []).concat(['Mandate']);
    return dom.el('div', { class: 'tw' }, [dom.el('table', { class: 't' }, [
      dom.el('thead', null, [dom.el('tr', null, head.map(function (t) { return dom.el('th', null, [t]); }))]),
      dom.el('tbody', null, ids.map(function (id) {
        var r = L.row[id];
        return dom.el('tr', null, [dom.el('td', { class: 'k' }, [id]), dom.el('td', null, [gloss(L, id)]), barrierCell(L, id), dom.el('td', null, [r.undo]), evidenceCell(L, id)]
          .concat(control ? [dom.el('td', null, [r.control || '—'])] : []).concat([statusCell(L, id)]));
      }))
    ])]);
  }
  function statusChip(L) {
    var d = L.data.delta;
    var text = L.source === 'live'
      ? 'Live from vault ' + L.vault.vid + ' · commit ' + (L.commit || '').slice(0, 24) + ' · delta computed ' + d.computed_at
      : 'Snapshot served from this site · the vault could not be reached (' + L.error + ')';
    return dom.el('span', { class: 'ab-status ' + L.source }, [text]);
  }
  function fail(el, err) {
    el.textContent = '';
    el.appendChild(dom.el('div', { class: 'ab-fail' }, ['This vault could not be read, live or from the snapshot on this site: ' + String(err && err.message || err) + '. The files are still linked from this page.']));
    if (window.console) console.error('abp vault:', err);
  }

  // ---- <rm-abp-card data-vault="slug"> : the four counts, and no score ----
  RM.components.AbpCard = class extends HTMLElement {
    connectedCallback() {
      var self = this, slug = this.dataset.vault;
      this.appendChild(dom.el('div', { class: 'ab-card wait' }, [dom.el('p', { class: 'ab-loading' }, ['reading vault ' + (bySlug(slug) || {}).vid + '… deriving ids, fetching ciphertext, decrypting'])]));
      load(slug).then(function (L) {
        var d = L.data.delta, g = L.data.grant, m = L.data.mandate, v = L.data.vault;
        var measured = g.grant.filter(function (r) { return L.measured[r.evidence]; }).length;
        var by = ['none', 'expectation', 'setting', 'boundary'].map(function (b) { return d.excess.filter(function (id) { return L.row[id].barrier === b; }).length; });
        var total = Math.max(1, d.excess.length);
        function count(n, label, cls) { return dom.el('div', { class: 'ab-count' + (cls ? ' ' + cls : '') }, [dom.el('b', null, [String(n)]), dom.el('span', null, [label])]); }
        var card = dom.el('div', { class: 'ab-card' }, [
          dom.el('div', { class: 'ab-head' }, [
            dom.el('div', null, [dom.el('span', { class: 'ab-org' }, [v.organisation || v.title]), dom.el('span', { class: 'ab-meta' }, [g.product + ' · grant ' + g.profile_version + ' · mandate ' + m.authored + ' · as at ' + v.as_at])]),
            dom.el('span', { class: 'ab-chip ' + v.status }, [v.status])
          ]),
          dom.el('div', { class: 'ab-counts' }, [
            count(g.grant.length, 'capabilities in the grant'), count(m.want.length, 'wanted by the mandate', 'ok'),
            count(d.counts.excess, 'excess — granted, not asked for', 'ex'), count(d.counts.unbounded_excess, 'unbounded — nothing in the way', 'un')
          ]),
          dom.el('div', { class: 'ab-rowsline' }, [measured + ' of ' + g.grant.length + ' rows measured', d.counts.shortfall + ' shortfall', d.counts.aligned + ' aligned'].map(function (t) { return dom.el('span', null, [t]); })),
          dom.el('div', { class: 'ab-bar' }, [dom.el('span', null, ['excess, by barrier']), dom.el('span', { class: 'ab-track' }, by.map(function (n, i) { return dom.el('i', { class: 'b' + i, style: 'width:' + (n / total * 100) + '%', title: n + ' at ' + ['none', 'expectation', 'setting', 'boundary'][i] }); })), dom.el('span', { class: 'k' }, [String(d.excess.length)])]),
          dom.el('div', { class: 'ab-legend' }, ['● none', '◉ expectation', '◐ setting', '○ boundary — the only control'].map(function (t) { return dom.el('span', null, [t]); })),
          dom.el('div', { class: 'ab-noscore' }, [dom.el('b', null, ['No score. ']), 'A behaviour policy describes; it does not judge. The number a buyer can move is the unbounded excess, and only a real control moves it.']),
          dom.el('div', { class: 'ab-foot' }, [statusChip(L)])
        ]);
        self.textContent = ''; self.appendChild(card);
      }).catch(function (e) { fail(self, e); });
    }
  };

  // ---- <rm-abp-table data-vault data-view="grant|delta|licence|mandate|notreach"> ----
  RM.components.AbpTable = class extends HTMLElement {
    connectedCallback() {
      var self = this, slug = this.dataset.vault, view = this.dataset.view;
      load(slug).then(function (L) {
        var d = L.data.delta, g = L.data.grant, m = L.data.mandate, v = L.data.vault, out = [];
        var ids = g.grant.map(function (r) { return r.capability; });
        function h3(t) { return dom.el('h3', { class: 'ab-h3' }, [t]); }
        function sub(t) { return dom.el('p', { class: 'ab-sub' }, [t]); }
        if (view === 'grant') {
          out.push(capTable(L, sortRows(L, ids), true));
        } else if (view === 'delta') {
          [['Excess you refused', d.excess_refused, 'You said no. The last column says what, if anything, enforces the no.'],
           ['Excess you never mentioned', d.excess_unstated, 'Authority nobody scoped. Not wrong — unstated. These are the rows to read twice.'],
           ['Unbounded excess', d.unbounded_excess, 'The excess whose barrier is anything but a boundary. Every real control moves one row out of this list; nothing else does.'],
           ['Aligned', d.aligned, 'Wanted and granted.']].forEach(function (s) {
            out.push(h3(s[0] + ' (' + s[1].length + ')')); out.push(sub(s[2]));
            out.push(s[1].length ? capTable(L, sortRows(L, s[1]), true) : sub('none'));
          });
          out.push(h3('Shortfall (' + d.shortfall.length + ')'));
          out.push(sub(d.shortfall.length ? d.shortfall.map(function (id) { return id + ' — ' + gloss(L, id); }).join('; ') : 'none — everything wanted is granted.'));
        } else if (view === 'mandate') {
          out.push(dom.el('p', { class: 'ab-quote' }, [m.description]));
          out.push(sub('Elicited — ' + m.status + ', authored ' + m.authored + ' by ' + m.authored_by + '. The only authored file in the vault.'));
          [['Wanted', m.want, 'want'], ['Explicitly not wanted', m.do_not_want, 'refused'], ['Unstated', m.unstated, 'unstated']].forEach(function (s) {
            out.push(h3(s[0] + ' (' + s[1].length + ')'));
            out.push(dom.el('div', { class: 'ab-pills' }, s[1].map(function (id) { return dom.el('span', { class: 'ab-pill ' + s[2], title: gloss(L, id) }, [id]); })));
          });
        } else if (view === 'licence') {
          var conds = sortRows(L, d.excess), template = v.status === 'template';
          function kv(k, val) { return dom.el('tr', null, [dom.el('td', { class: 'k' }, [k]), dom.el('td', null, [val])]); }
          out.push(dom.el('div', { class: 'tw' }, [dom.el('table', { class: 't' }, [dom.el('tbody', null, [
            kv('Licensee', (v.agent || g.product) + ' — shape ' + g.id + ', grant ' + g.profile_version),
            kv('Authority', v.organisation || (template ? '— not yet issued to anyone —' : '—')),
            kv('Accountable owner', v.owner || (template ? '— unassigned —' : '—')),
            kv('Instrument', 'mandate ' + m.id + ' (' + m.authored + '), delta ' + d.id + ', vocabulary abp.sgit.ai ' + v.vocabulary_version),
            kv('Issued', v.issued || (template ? '— not issued: this is a template —' : '—')),
            kv('Valid until', v.valid_until || '— an interval is set when it is issued; a licence with no expiry is not a decision —')
          ])])]));
          out.push(h3('Conditions — asked not to, and what enforces each (' + conds.length + ')'));
          out.push(dom.el('div', { class: 'tw' }, [dom.el('table', { class: 't' }, [
            dom.el('thead', null, [dom.el('tr', null, ['Condition', 'Asked because', 'Barrier', 'Enforced by'].map(function (t) { return dom.el('th', null, [t]); }))]),
            dom.el('tbody', null, conds.map(function (id) {
              return dom.el('tr', null, [dom.el('td', null, [dom.el('span', { class: 'k' }, ['Do not ' + id]), ' — ' + gloss(L, id).toLowerCase()]),
                dom.el('td', null, [statusOf(L, id) === 'refused' ? 'the mandate refuses it' : 'the mandate never authorised it']), barrierCell(L, id),
                dom.el('td', null, [L.row[id].control ? L.row[id].control : dom.el('b', null, ['nothing — a line in prose'])])]);
            }))
          ])]));
        } else if (view === 'notreach') {
          out.push(dom.el('div', { class: 'tw' }, [dom.el('table', { class: 't' }, [
            dom.el('thead', null, [dom.el('tr', null, ['Not reachable', 'Why', 'Source'].map(function (t) { return dom.el('th', null, [t]); }))]),
            dom.el('tbody', null, (g.not_reachable || []).map(function (n) { return dom.el('tr', null, [dom.el('td', null, [n.what]), dom.el('td', null, [n.why]), dom.el('td', { class: 'k' }, [n.source])]); }))
          ])]));
        }
        out.push(dom.el('p', { class: 'ab-src' }, [statusChip(L)]));
        self.textContent = ''; out.forEach(function (n) { self.appendChild(n); });
      }).catch(function (e) { fail(self, e); });
    }
  };

  // ---- <rm-abp-files data-vault> : what is in the vault, from the live tree ----
  RM.components.AbpFiles = class extends HTMLElement {
    connectedCallback() {
      var self = this, slug = this.dataset.vault;
      load(slug).then(function (L) {
        var files = L.files.length ? L.files : Object.keys(PATHS).map(function (k) { return PATHS[k]; });
        var list = dom.el('ul', { class: 'ab-files' }, files.map(function (f) {
          return dom.el('li', null, [dom.el('a', { href: 'vaults/' + slug + '/' + f }, [f])]);
        }));
        var note = L.source === 'live' ? files.length + ' files in the vault tree, read live; each link opens the copy served from this site' : 'the file list is the snapshot’s; the vault could not be reached';
        self.textContent = ''; self.appendChild(list); self.appendChild(dom.el('p', { class: 'ab-src' }, [note]));
      }).catch(function (e) { fail(self, e); });
    }
  };

  // ---- <rm-abp-key data-vault> : the read key, printed where a human can copy it ----
  RM.components.AbpKey = class extends HTMLElement {
    connectedCallback() {
      var v = bySlug(this.dataset.vault), pk = publicKey(v);
      function row(label, value) { return dom.el('div', { class: 'ab-keyrow' }, [dom.el('span', { class: 'ab-keylabel' }, [label]), dom.el('code', { class: 'ab-key' }, [value])]); }
      this.appendChild(row('vault', v.vid));
      this.appendChild(row('endpoint', ENDPOINT));
      this.appendChild(row('read key', pk));
      this.appendChild(row('clone it', 'sgit clone ' + pk));
      this.appendChild(dom.el('div', { class: 'ab-keyrow' }, [dom.el('span', { class: 'ab-keylabel' }, ['open it']), dom.el('a', { class: 'ab-open', href: UI + '/en-gb/#' + v.key + ':' + v.vid, target: '_blank', rel: 'noopener' }, ['the vault browser at dev.vault.sgraph.ai, read-only ↗'])]));
    }
  };

  // ---- <rm-abp-app data-vault> : the vault's own app, mounted in a sandboxed frame ----
  // The frame is srcdoc with sandbox="allow-scripts" only: opaque origin, no cookies, no
  // storage, no reach into this page. It gets a window.sg shim whose every read is served
  // by this page's reader over postMessage. Nothing else is served, because there is
  // nothing else: the page holds a read key.
  var SHIM = "(function(){'use strict';var seq=0,pending={};" +
    "function rpc(op,path){return new Promise(function(res,rej){var id=++seq;pending[id]=[res,rej];parent.postMessage({sgvEmbed:1,id:id,op:op,path:path},'*');});}" +
    "window.addEventListener('message',function(ev){var m=ev.data;if(!m||m.sgvEmbed!==1||!pending[m.id])return;var p=pending[m.id];delete pending[m.id];m.ok?p[0](m.data):p[1](new Error(m.error||'embed rpc failed'));});" +
    "window.sg={embedded:true,readOnly:true,vfs:{readText:function(p){return rpc('readText',p);}}};" +
    "document.addEventListener('click',function(e){var a=e.target&&e.target.closest&&e.target.closest('a[href]');if(!a)return;var h=a.getAttribute('href');" +
    "if(/^#/.test(h)){e.preventDefault();var t=document.getElementById(h.slice(1));if(t)t.scrollIntoView({behavior:'smooth'});return;}" +
    "if(!/^(https?:|mailto:)/.test(h)){e.preventDefault();parent.postMessage({sgvEmbed:1,open:h},'*');}},true);})();";
  RM.components.AbpApp = class extends HTMLElement {
    connectedCallback() {
      var self = this, slug = this.dataset.vault, v = bySlug(slug);
      var status = dom.el('span', { class: 'vd-status wait' }, ['Connecting…']);
      var stage  = dom.el('div', { class: 'vd-stage' });
      var bar    = dom.el('div', { class: 'ab-appbar' }, [dom.el('span', { class: 'ab-applabel' }, ['The vault’s own app · ' + v.vid + ' · sandboxed, read-only']), status]);
      this.appendChild(bar); this.appendChild(stage);
      load(slug).then(async function (L) {
        if (L.source !== 'live' || !L.reader) throw new Error('the app runs from the live vault only; the vault could not be reached (' + L.error + ')');
        var html = await L.reader.readText('index.html');
        html = /<head[^>]*>/i.test(html) ? html.replace(/<head[^>]*>/i, function (m) { return m + '\n<script>' + SHIM + '<\/script>'; }) : '<script>' + SHIM + '<\/script>' + html;
        var frame = dom.el('iframe', { class: 'vd-frame', title: 'Agent Behaviour Policy — the vault’s app, read-only', sandbox: 'allow-scripts', referrerpolicy: 'no-referrer' });
        window.addEventListener('message', async function (ev) {
          if (ev.source !== frame.contentWindow) return;
          var m = ev.data; if (!m || m.sgvEmbed !== 1) return;
          if (typeof m.open === 'string') {                              // a file link inside the app: open the copy on this site
            var p = m.open.replace(/^\.?\//, '');
            if (L.files.indexOf(p) >= 0) window.open('vaults/' + slug + '/' + p, '_blank', 'noopener');
            return;
          }
          if (!m.id || typeof m.path !== 'string') return;
          var reply = { sgvEmbed: 1, id: m.id, ok: false };
          try {
            if (m.op !== 'readText') reply.error = 'unknown op: ' + m.op;
            else if (/^\.?\/?app\//.test(m.path)) { var ar = await appReader(); reply.data = await ar.readText(m.path.replace(/^\.?\/?app\//, '')); reply.ok = true; }   // the sub-vault link, resolved by this host
            else { reply.data = await L.reader.readText(m.path); reply.ok = true; }
          }
          catch (e) { reply.error = String(e && e.message || e); }
          ev.source.postMessage(reply, '*');
          if (m.op === 'readText' && reply.ok) { status.className = 'vd-status live'; status.textContent = 'Live · read-only · ' + L.files.length + ' files · served over postMessage'; }
        });
        window.addEventListener('message', function (ev) { if (ev.source === frame.contentWindow && ev.data && ev.data.type === 'sg-app-ready') { status.className = 'vd-status live'; status.textContent = 'Live · read-only · ' + L.files.length + ' files'; } });
        frame.srcdoc = html;
        stage.appendChild(frame);
        setTimeout(function () { if (status.classList.contains('wait')) { status.className = 'vd-status stall'; status.textContent = 'Not loading here? Open the vault in its own tab ↗'; } }, 20000);
      }).catch(function (e) {
        status.className = 'vd-status stall'; status.textContent = 'Unavailable';
        stage.classList.add('error'); stage.appendChild(dom.el('p', null, [String(e && e.message || e) + ' The static copy of the app is on this site: ']), dom.el('a', { href: 'vaults/' + slug + '/index.html' }, ['vaults/' + slug + '/index.html']));
      });
    }
  };


  // ---- <rm-abp-mini data-vault> : four live counts for a directory tile ----
  RM.components.AbpMini = class extends HTMLElement {
    connectedCallback() {
      var self = this, slug = this.dataset.vault;
      load(slug).then(function (L) {
        var d = L.data.delta.counts, g = L.data.grant, m = L.data.mandate;
        self.textContent = '';
        self.appendChild(dom.el('span', { class: 'ab-mini ' + L.source }, [
          (L.source === 'live' ? 'live \u00b7 ' : 'snapshot \u00b7 ') + g.grant.length + ' \u00b7 ' + m.want.length + ' \u00b7 ' + d.excess + ' \u00b7 ' + d.unbounded_excess
        ]));
      }).catch(function () { self.textContent = ''; });
    }
  };

  customElements.define('rm-abp-mini',  RM.components.AbpMini);
  customElements.define('rm-abp-card',  RM.components.AbpCard);
  customElements.define('rm-abp-table', RM.components.AbpTable);
  customElements.define('rm-abp-files', RM.components.AbpFiles);
  customElements.define('rm-abp-key',   RM.components.AbpKey);
  customElements.define('rm-abp-app',   RM.components.AbpApp);

  return { VAULTS: VAULTS, bySlug: bySlug, publicKey: publicKey, load: load, Reader: Reader, ENDPOINT: ENDPOINT, UI: UI };
})();
