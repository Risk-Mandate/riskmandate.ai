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
  var LOGOS = /*__LOGOS__*/{};              // product marks: { name: { kind: 'fill'|'stroke', d } } — CC0 Simple Icons paths, and stroke icons drawn here
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
  var OPTIONAL = { scenarios: 'data/scenarios.json' };   // absent on a vault pushed before scenarios existed; the page carries on without
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
        for (var ko in OPTIONAL) { try { out.data[ko] = JSON.parse(await reader.readText(OPTIONAL[ko])); } catch (_) { out.data[ko] = null; } }
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
        for (var ko2 in OPTIONAL) { try { var r2 = await fetch('vaults/' + slug + '/' + OPTIONAL[ko2], { cache: 'no-store' }); out.data[ko2] = r2.ok ? await r2.json() : null; } catch (_) { out.data[ko2] = null; } }
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
  var STATUS_LABEL = { want: 'wanted', refused: 'told not to', unstated: 'unstated' };   // "told not to": the mandate refuses it and the grant still permits it
  function statusCell(L, id) { var s = statusOf(L, id); return dom.el('td', null, [dom.el('span', { class: 'ab-pill ' + s }, [STATUS_LABEL[s]])]); }
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
            dom.el('span', null, [dom.el('span', { class: 'ab-chip ' + v.status }, [v.status])].concat((g.research_needed || []).length ? [' ', dom.el('span', { class: 'ab-chip research' }, [(g.research_needed || []).length + ' open questions'])] : []))
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

  // The holder classes, as data/barrier-holders.json names them. A label, never a grade.
  var HOLDER_LABEL = { deployer: 'you', 'org-owner': 'an owner above you', 'vendor-with-consent': 'a vendor, against a consent you gave', 'vendor-product': 'a vendor, as a product decision', agent: 'the agent itself', environment: 'the environment it runs in' };
  function holderLabel(id) { return HOLDER_LABEL[id] || id; }

  // ---- <rm-abp-table data-vault data-view="grant|delta|licence|mandate|blocked|held"> ----
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
          [['Wanted', m.want, 'want'], ['Told not to — refused by the mandate, still permitted by the grant', m.do_not_want, 'refused'], ['Unstated', m.unstated, 'unstated']].forEach(function (s) {
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
        } else if (view === 'blocked') {
          // The grant is what the agent can do AFTER the blocks. These are what something
          // withholds — and the blocker is named, because a ceiling the credential enforces and
          // a tool a vendor has not shipped are different objects with different lifespans.
          var held = (g.blocked || []).filter(function (n) { return n.holder; });
          out.push(dom.el('div', { class: 'tw' }, [dom.el('table', { class: 't' }, [
            dom.el('thead', null, [dom.el('tr', null, ['Permitted, and blocked', 'Blocked by', 'Who holds the block', 'Moves without you', 'Source'].map(function (t) { return dom.el('th', null, [t]); }))]),
            dom.el('tbody', null, (g.blocked || []).map(function (n) {
              return dom.el('tr', null, [dom.el('td', null, [n.what]), dom.el('td', null, [n.blocked_by || n.why]),
                dom.el('td', null, [n.holder ? holderLabel(n.holder.held_by) : 'not yet recorded']),
                dom.el('td', null, [n.holder ? dom.el('b', null, [n.holder.moves_without_you]) : '—']),
                dom.el('td', { class: 'k' }, [n.source])]);
            }))
          ])]));
          if (held.length) out.push(dom.el('p', { class: 'ab-sub' }, ['Who holds a block decides how long it lasts. One held by a vendor as a product decision moves in a release, with no consent screen and nothing for the deployer to click; one that is the credential\u2019s own ceiling moves only if somebody consents to a wider credential. Neither is rated here \u2014 both are recorded.']));
        } else if (view === 'held') {
          // Seven answers per barrier: who holds it, what it rests on, whether it moves without
          // you, whether you would be told, whether you can check, what removes it, and what the
          // credential would still allow. Facts, each with a source. Never a grade.
          var rows = (g.grant || []).filter(function (r) { return r.holder; });
          if (!rows.length) { out.push(dom.el('p', { class: 'ab-sub' }, ['Who holds each barrier has not been recorded for this shape yet.'])); }
          else out.push(dom.el('div', { class: 'tw' }, [dom.el('table', { class: 't' }, [
            dom.el('thead', null, [dom.el('tr', null, ['Capability', 'Barrier', 'Who holds it', 'Moves without you', 'Would you be told', 'What removes it'].map(function (t) { return dom.el('th', null, [t]); }))]),
            dom.el('tbody', null, rows.map(function (r) {
              return dom.el('tr', null, [dom.el('td', null, [dom.el('span', { class: 'k' }, [r.capability])]), barrierCell(L, r.capability),
                dom.el('td', null, [holderLabel(r.holder.held_by)]), dom.el('td', null, [dom.el('b', null, [r.holder.moves_without_you])]),
                dom.el('td', null, [r.holder.you_would_be_told]), dom.el('td', null, [r.holder.removed_by])]);
            }))
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

  // ---- <rm-abp-host data-vault data-mode="app|vault"> : the official SG/Vault interface, embedded ----
  // The host's own embed protocol, the same one the demo pages use: load /en-gb/app/ (App Mode)
  // or /en-gb/vault/ (the vault browser: files, history, the app) with ?embed=1&parent=<origin>,
  // wait for {sg:'vault-embed-ready'} FROM THAT FRAME, then post {sg:'vault-open', key, mode} with
  // the target origin pinned to the host. The key never enters a URL and never touches the host's
  // storage, which is partitioned inside a cross-site frame and would lose it. What the frame shows
  // is read from the vault by the host, not from this site: this page holds nothing but the key.
  var hostRegistry = [], hostListening = false;
  function hostListen() {
    if (hostListening) return; hostListening = true;
    window.addEventListener('message', function (e) {
      if (e.origin !== UI) return;
      var d = e.data || {}, entry = null;
      for (var i = 0; i < hostRegistry.length; i++) { try { if (hostRegistry[i].frame.contentWindow === e.source) { entry = hostRegistry[i]; break; } } catch (err) { /* detached */ } }
      if (!entry || !e.source) return;
      if (d.sg === 'vault-embed-ready') { e.source.postMessage({ sg: 'vault-open', key: entry.key, mode: entry.mode }, UI); entry.set('opening', 'Key handed over · opening…'); }
      else if (d.sg === 'vault-ready') { var m = []; if (d.vaultName) m.push(d.vaultName); if (d.fileCount) m.push(d.fileCount + ' files'); entry.set('live', 'Live · read-only' + (m.length ? ' · ' + m.join(' · ') : '')); }
      else if (d.sg === 'vault-error') { entry.set('stall', 'The host could not open it: ' + String(d.message || d.error || 'unknown')); }
    });
  }
  RM.components.AbpHost = class extends HTMLElement {
    connectedCallback() {
      var v = bySlug(this.dataset.vault); if (!v) return;
      var mode = this.dataset.mode === 'vault' ? 'vault' : 'app';
      hostListen();
      var status = dom.el('span', { class: 'vd-status wait' }, ['Connecting…']);
      var frame  = dom.el('iframe', { class: 'vd-frame', title: (mode === 'vault' ? 'The vault browser' : 'The vault’s app') + ' — ' + v.app + ', opened read-only', sandbox: 'allow-scripts allow-same-origin allow-popups allow-forms', loading: 'lazy', referrerpolicy: 'no-referrer' });
      frame.src = UI + (mode === 'vault' ? '/en-gb/vault/' : '/en-gb/app/') + '?embed=1&parent=' + encodeURIComponent(location.origin);
      var entry = { frame: frame, key: v.key + ':' + v.vid, mode: mode, set: function (c, t) { status.className = 'vd-status ' + c; status.textContent = t; } };
      hostRegistry.push(entry);
      var label = mode === 'vault' ? 'SG/Vault · the vault browser: every file, the history, the app · ' + v.vid : 'SG/App · the vault’s own app, opened by the host · ' + v.vid;
      this.appendChild(dom.el('div', { class: 'ab-appbar' }, [dom.el('span', { class: 'ab-applabel' }, [label]), status, dom.el('a', { class: 'ab-open', href: UI + '/en-gb/#' + v.key + ':' + v.vid, target: '_blank', rel: 'noopener' }, ['open in its own tab ↗'])]));
      this.appendChild(dom.el('div', { class: 'vd-stage' + (mode === 'vault' ? ' tall' : '') }, [frame]));
      setTimeout(function () { if (status.classList.contains('wait')) entry.set('stall', 'Not loading here? Open it in its own tab ↗'); }, 20000);
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

  // ---- product marks: an inline SVG per tile, built with the DOM (createElementNS), never markup ----
  var SVG_NS = 'http://www.w3.org/2000/svg';
  function logoEl(name, brand, size) {
    var spec = LOGOS[name], box = dom.el('span', { class: 'ab-logo', style: 'width:' + size + 'px;height:' + size + 'px;background:' + hexA(brand, .10) + ';border-color:' + hexA(brand, .2) });
    if (!spec) { box.appendChild(dom.el('b', null, [String(name || '?').slice(0, 2).toUpperCase()])); return box; }
    var svg = document.createElementNS(SVG_NS, 'svg'); svg.setAttribute('viewBox', '0 0 24 24'); svg.setAttribute('width', Math.round(size / 2)); svg.setAttribute('height', Math.round(size / 2)); svg.setAttribute('aria-hidden', 'true');
    var path = document.createElementNS(SVG_NS, 'path'); path.setAttribute('d', spec.d);
    if (spec.kind === 'stroke') { path.setAttribute('fill', 'none'); path.setAttribute('stroke', brand); path.setAttribute('stroke-width', '1.8'); path.setAttribute('stroke-linecap', 'round'); path.setAttribute('stroke-linejoin', 'round'); }
    else path.setAttribute('fill', brand);
    svg.appendChild(path); box.appendChild(svg); return box;
  }
  function hexA(hex, a) { var n = parseInt(String(hex || '#0D0D0C').slice(1), 16); return 'rgba(' + (n >> 16) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')'; }

  // ---- the delta, abp.delta/v1, for any mandate against a loaded grant: scenarios reuse it ----
  function computeDelta(L, want, dnw) {
    var ids = L.data.grant.grant.map(function (r) { return r.capability; });
    var W = {}, D = {}; want.forEach(function (i) { W[i] = 1; }); dnw.forEach(function (i) { D[i] = 1; });
    var excess = ids.filter(function (i) { return !W[i]; });
    var d = { excess: excess, refused: excess.filter(function (i) { return D[i]; }), unstated: excess.filter(function (i) { return !D[i]; }),
              unbounded: excess.filter(function (i) { return L.row[i].barrier !== 'boundary'; }), shortfall: want.filter(function (i) { return !L.row[i]; }), aligned: ids.filter(function (i) { return W[i]; }) };
    d.counts = { grant: ids.length, wanted: want.length, excess: d.excess.length, unbounded: d.unbounded.length, shortfall: d.shortfall.length, aligned: d.aligned.length };
    return d;
  }

  // ---- the label: what a capability could do to you, in the words a label on a box would use ----
  var WARN = {
    'delete.file.host': 'could delete files anywhere the account can reach', 'write.file.host': 'could change any file the account can reach',
    'read.file.host': 'reads every file the account can reach — other people\'s included', 'read.message.tenant': 'reads mail and chat, most of it written by other people',
    'send.message.world': 'could send mail or messages to anyone, as you', 'send.endpoint.world': 'could send data to any host on the internet — the exfiltration route',
    'send.endpoint.allowed': 'reaches a permitted list of hosts', 'read.credential.host': 'could read stored credentials — keys, tokens, the codes that arrive by mail',
    'authenticate-as.credential.tenant': 'could act in your accounts with the credentials it holds', 'authenticate-as.credential.signing': 'could sign commits as you',
    'grant.credential.self': 'could change its own permission settings', 'create.record.world': 'could publish packages, pages or links under your name',
    'write.budget.tenant': 'could spend money or tokens against an account you hold', 'create.schedule.host': 'could leave something running after it stops',
    'create.schedule.tenant': 'could create thousands of scheduled entries, events or jobs — and keep running without you', 'execute.process.host': 'could run any program as the account',
    'execute.process.self': 'runs programs only inside its own sandbox', 'read.record.history': 'reads retained records — shell history, past sessions',
    'read.record.browsing': 'reads every page you visit', 'write.repository.tenant': 'could push to any repository it can reach on the code host',
    'write.repository.project': 'could commit to the repository it was pointed at', 'write.file.project': 'could change the project it is working on', 'read.file.project': 'reads the project it is working on'
  };
  // the lethal trifecta (Willison): private data, exposure to untrusted content, a way to communicate out.
  // All three present and nothing in the way of the third is the shape that leaks.
  var TRIFECTA = [
    { id: 'private', name: 'Private data', caps: ['read.file.host', 'read.message.tenant', 'read.credential.host', 'read.record.history', 'read.record.browsing', 'read.file.project'] },
    { id: 'untrusted', name: 'Untrusted content', caps: ['read.message.tenant', 'read.record.browsing', 'read.file.host', 'send.endpoint.world', 'send.endpoint.allowed'] },
    { id: 'exfil', name: 'A way out', caps: ['send.message.world', 'send.endpoint.world', 'create.record.world', 'write.repository.tenant', 'send.endpoint.allowed'] },
  ];
  function legState(L, leg) { var rows = leg.caps.filter(function (c) { return L.row[c]; }); if (!rows.length) return { has: false, bounded: false, rows: rows }; return { has: true, bounded: rows.every(function (c) { return L.row[c].barrier === 'boundary'; }), rows: rows }; }
  function labelBox(L, d, W, D) {
    var g = L.data.grant, sideEffects = d.unbounded.slice().sort(function (a, b) { return L.undoRank[L.row[a].undo] - L.undoRank[L.row[b].undo]; });
    var toldNot = d.refused.filter(function (id) { return L.row[id].barrier !== 'boundary'; });
    var box = dom.el('div', { class: 'ab-lab' }, [
      dom.el('span', { class: 't' }, ['What this agent could do to you']),
      dom.el('div', { class: 'l' }, [dom.el('span', null, ['capabilities in the grant']), dom.el('b', null, [String(d.counts.grant)])]),
      dom.el('div', { class: 'l' }, [dom.el('span', null, ['wanted by this mandate']), dom.el('b', null, [String(d.counts.wanted)])]),
      dom.el('div', { class: 'l' }, [dom.el('span', null, ['not asked for, nothing in the way']), dom.el('b', null, [String(d.counts.unbounded)])]),
      dom.el('span', { class: 'h' }, ['Side effects — not asked for, and nothing real stops it']),
    ]);
    // One list, not two. "Told not to, and only told" used to follow this one, and by
    // construction it could never hold anything new: the refused rows are a subset of the
    // excess, and both lists dropped anything behind a boundary, so every line in it was
    // already printed above. What it actually carried was the distinction between a row the
    // mandate refused and one it never mentioned — so that is a mark on each line here, and
    // the reader gets it once. The count of each is stated under the list.
    //
    // The mark says what the mandate said, and nothing else. It used to read "told not to —
    // and only told", which put the enforcement twice more on a panel that has already said
    // it twice: the counter above reads "not asked for, nothing in the way", and the heading
    // reads "nothing real stops it". Only the first half was news. A reader who has to be
    // told four times that nothing stops it stops reading any of them.
    box.appendChild(sideEffects.length ? dom.el('ul', null, sideEffects.map(function (id) {
      var told = D[id];
      return dom.el('li', { class: L.row[id].undo === 'no' ? '' : 'e' }, [dom.el('i'), dom.el('span', null, [
        WARN[id] || gloss(L, id), ' ',
        dom.el('code', null, [id + (L.row[id].undo === 'no' ? ' · cannot be undone' : '')]), ' ',
        dom.el('span', { class: 'ab-said ' + (told ? 'no' : 'un') }, [told ? 'refused in words' : 'never mentioned']),
      ])]);
    })) : dom.el('p', { class: 'none' }, ['none — everything not asked for sits behind a boundary']));
    if (sideEffects.length) box.appendChild(dom.el('p', { class: 'ab-saidsum' }, [
      String(toldNot.length) + ' of these the mandate refused in words; ' +
      String(sideEffects.length - toldNot.length) + ' it never mentioned at all.',
    ]));
    box.appendChild(dom.el('span', { class: 'h' }, ['The lethal trifecta']));
    var legs = TRIFECTA.map(function (leg) { return { leg: leg, st: legState(L, leg) }; });
    box.appendChild(dom.el('div', { class: 'ab-tri' }, legs.map(function (x) { return dom.el('span', { class: !x.st.has ? 'n' : x.st.bounded ? 'b' : 'y' }, [dom.el('b', null, [x.leg.name]), dom.el('span', null, [!x.st.has ? 'not in the grant' : x.st.bounded ? 'present · behind a boundary' : 'present · ' + x.st.rows.length + (x.st.rows.length === 1 ? ' row' : ' rows') + ', unbounded'])]); })));
    var all = legs.every(function (x) { return x.st.has; }), outOpen = legs[2].st.has && !legs[2].st.bounded;
    box.appendChild(dom.el('p', { class: 'ab-triv' + (all ? '' : ' ok') }, [dom.el('b', null, [all ? (outOpen ? 'All three, and the way out is unbounded. ' : 'All three present; the way out sits behind a boundary. ') : 'Not all three. ']), all ? 'Private data plus untrusted content plus a way to communicate is the shape that leaks. The mandate cannot change this; only a barrier on one leg does.' : 'The shape that leaks needs all three legs; this grant is missing at least one.']));
    return box;
  }
  // the diagram: one cell per capability in the grant, coloured by what the mandate says and what stands in the way; shortfall drawn outside
  var SVG = 'http://www.w3.org/2000/svg';
  function svgEl(tag, attrs, text) { var e = document.createElementNS(SVG, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); if (text != null) e.textContent = text; return e; }
  function diagram(L, d, W, D) {
    var ids = sortRows(L, L.data.grant.grant.map(function (r) { return r.capability; })), short = d.shortfall;
    var n = ids.length + short.length, cw = 100 / Math.max(n, 8), H = 36;
    var svg = svgEl('svg', { viewBox: '0 0 100 ' + H, preserveAspectRatio: 'none', role: 'img', 'aria-label': 'The grant as cells, coloured by mandate and barrier' });
    var C = { want: '#1A7F5A', unb: '#B45309', bnd: '#EBF5F0', short: '#1D4ED8' };
    ids.forEach(function (id, i) { var r = L.row[id], st = W[id] ? 'want' : (r.barrier === 'boundary' ? 'bnd' : 'unb');
      var g = svgEl('g'); g.appendChild(svgEl('title', {}, id + ' — ' + (W[id] ? 'wanted' : D[id] ? 'told not to' : 'unstated') + ' · ' + r.barrier));
      g.appendChild(svgEl('rect', { x: i * cw + 0.4, y: 4, width: cw - 0.8, height: 26, rx: 1.2, fill: C[st], stroke: st === 'bnd' ? '#1A7F5A' : 'none', 'stroke-width': .5, 'stroke-dasharray': st === 'bnd' ? '1 1' : 'none', 'vector-effect': 'non-scaling-stroke' }));
      if (D[id]) g.appendChild(svgEl('rect', { x: i * cw + 0.4, y: 32, width: cw - 0.8, height: 3, fill: '#C0392B' }));
      svg.appendChild(g); });
    short.forEach(function (id, j) { var i = ids.length + j; var g = svgEl('g'); g.appendChild(svgEl('title', {}, id + ' — wanted, not granted'));
      g.appendChild(svgEl('rect', { x: i * cw + 0.4, y: 4, width: cw - 0.8, height: 26, rx: 1.2, fill: 'none', stroke: C.short, 'stroke-width': 1, 'stroke-dasharray': '2 1.5', 'vector-effect': 'non-scaling-stroke' })); svg.appendChild(g); });
    var caption = dom.el('span', { class: 'ab-diagcap' }, ['one cell per capability in the grant → ' + ids.length + (short.length ? '   ·   wanted, not granted → ' + short.length : '')]);
    var legend = dom.el('div', { class: 'ab-diaglegend' }, [
      dom.el('span', null, [dom.el('i', { style: 'background:' + C.want }), 'wanted']), dom.el('span', null, [dom.el('i', { style: 'background:' + C.unb }), 'not asked for · nothing in the way']),
      dom.el('span', null, [dom.el('i', { style: 'background:' + C.bnd + ';border:1px dashed ' + C.want }), 'not asked for · behind a boundary']), dom.el('span', null, [dom.el('i', { style: 'background:#C0392B;height:3px' }), 'told not to']),
      dom.el('span', null, [dom.el('i', { style: 'border:1px dashed ' + C.short }), 'wanted, not granted'])]);
    return dom.el('div', { class: 'ab-diag' }, [svg, caption, legend]);
  }

  // ---- <rm-abp-library> : the directory as one thing — search, filters, grid or list, and the preview panel ----
  // Progressive: the tiles and rows are static links; this wires them to the panel, the toggle, the
  // filters and the search box, and the panel is rendered from the vault as it is read.
  RM.components.AbpLibrary = class extends HTMLElement {
    connectedCallback() {
      var self = this;
      this.panel  = this.querySelector('.ab-panel');
      this.search = this.querySelector('.ab-search input');
      this.items  = Array.prototype.slice.call(this.querySelectorAll('[data-slug]'));
      this.groups = Array.prototype.slice.call(this.querySelectorAll('[data-groupname]'));
      this.filter = 'all'; this.q = ''; this.beh = ''; this.rowFilter = 'all';
      // the panel is resizable: a vertical bar between the views and the panel, width kept on this device
      this.resizer = this.querySelector('.ab-resize');
      try { var pw = parseInt(localStorage.getItem('rm-abp-panel-w'), 10); if (pw >= 340 && pw <= 900) this.style.setProperty('--panel-w', pw + 'px'); } catch (_) {}
      if (this.resizer) {
        this.resizer.addEventListener('pointerdown', function (e) { e.preventDefault(); self.resizer.setPointerCapture(e.pointerId); self.classList.add('resizing'); self.resizer.classList.add('on'); self._drag = { x: e.clientX, w: self.panel.getBoundingClientRect().width }; });
        this.resizer.addEventListener('pointermove', function (e) { if (!self._drag) return; var w = Math.max(340, Math.min(900, self._drag.w - (e.clientX - self._drag.x))); self.style.setProperty('--panel-w', w + 'px'); });
        var end = function () { if (!self._drag) return; self._drag = null; self.classList.remove('resizing'); self.resizer.classList.remove('on'); try { localStorage.setItem('rm-abp-panel-w', parseInt(self.panel.getBoundingClientRect().width, 10)); } catch (_) {} };
        this.resizer.addEventListener('pointerup', end); this.resizer.addEventListener('pointercancel', end);
        this.resizer.addEventListener('dblclick', function () { self.style.removeProperty('--panel-w'); try { localStorage.removeItem('rm-abp-panel-w'); } catch (_) {} });
      }
      this.behSel = this.querySelector('.ab-beh select');
      if (this.behSel) this.behSel.addEventListener('change', function () { self.beh = self.behSel.value; self.apply(); });
      this.addEventListener('click', function (e) {
        if (e.target.closest('a.ab-topen, .ab-t h3 a, .ab-lname a')) return;   // the policy's own link: let it navigate
        var t = e.target.closest('[data-view], [data-filter], [data-slug], [data-close], [data-scenario], [data-copy], [data-rowfilter]');
        if (!t || !self.contains(t)) return;
        if (t.dataset.view) { self.setView(t.dataset.view); e.preventDefault(); return; }
        if (t.dataset.filter !== undefined) { self.filter = t.dataset.filter; self.apply(); e.preventDefault(); return; }
        if (t.dataset.close !== undefined) { self.close(); e.preventDefault(); return; }
        if (t.dataset.scenario !== undefined) { self.scenario = t.dataset.scenario; self.renderPanel(); e.preventDefault(); return; }
        if (t.dataset.rowfilter !== undefined) { self.rowFilter = t.dataset.rowfilter; self.renderPanel(); e.preventDefault(); return; }
        if (t.dataset.copy !== undefined) { self.copy(t.dataset.copy, t); e.preventDefault(); return; }
        if (t.dataset.slug && !t.dataset.off) { if (e.metaKey || e.ctrlKey || e.shiftKey) return; e.preventDefault(); self.select(t.dataset.slug); }
      });
      this.addEventListener('keydown', function (e) { if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[data-slug][role="button"]')) { e.preventDefault(); self.select(e.target.dataset.slug); } });
      if (this.search) {
        this.search.addEventListener('input', function () { self.q = self.search.value.trim().toLowerCase(); self.apply(); });
        document.addEventListener('keydown', function (e) { if (e.key === '/' && document.activeElement !== self.search && !/input|textarea/i.test(document.activeElement.tagName)) { e.preventDefault(); self.search.focus(); } if (e.key === 'Escape' && self.classList.contains('open')) self.close(); });
      }
      var m = /(?:^|[#&])policy=([a-z0-9-]+)/.exec(location.hash || '');
      if (m && bySlug(m[1])) this.select(m[1], true);
      else this.hint();
    }
    setView(v) { this.dataset.view = v; this.querySelectorAll('[data-view]').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.view === v ? 'true' : 'false'); }); }
    apply() {
      var self = this, f = this.filter, q = this.q, shown = {};
      this.items.forEach(function (it) {
        var ok = (f === 'all' || (f.indexOf('group:') === 0 ? it.dataset.group === f.slice(6) : f.indexOf('ev:') === 0 ? it.dataset.ev === f.slice(3) : true))
              && (!q || (it.dataset.search || '').indexOf(q) !== -1)
              && (!self.beh || (' ' + (it.dataset.caps || '') + ' ').indexOf(' ' + self.beh + ' ') !== -1);
        it.hidden = !ok; if (ok) shown[it.dataset.group] = (shown[it.dataset.group] || 0) + 1;
      });
      this.groups.forEach(function (g) { g.hidden = !shown[g.dataset.groupname]; });
      this.querySelectorAll('[data-filter]').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.filter === f ? 'true' : 'false'); });
      var none = this.querySelector('.ab-none'); if (none) none.hidden = Object.keys(shown).length > 0;
    }
    hint() {
      if (!this.panel) return; this.panel.textContent = '';
      this.panel.appendChild(dom.el('div', { class: 'ab-panelhint' }, [dom.el('b', null, ['Click a policy to preview it here.']), ' The card, the grant against the mandate, and the scenarios — without leaving this page. Then open its vault or its page.']));
    }
    select(slug, quiet) {
      var self = this; this.slug = slug; this.scenario = 'stored';
      this.items.forEach(function (it) { it.classList.toggle('sel', it.dataset.slug === slug); });
      if (!quiet) { try { history.replaceState(null, '', '#policy=' + slug); } catch (_) {} }
      this.classList.add('open');
      this.panel.textContent = ''; this.panel.appendChild(dom.el('p', { class: 'ab-loading' }, ['reading vault ' + (bySlug(slug) || {}).vid + '…']));
      load(slug).then(function (L) { if (self.slug === slug) { self.L = L; self.renderPanel(); } }).catch(function (e) { fail(self.panel, e); });
    }
    close() { this.classList.remove('open'); this.items.forEach(function (it) { it.classList.remove('sel'); }); this.slug = null; this.hint(); try { history.replaceState(null, '', location.pathname + location.search); } catch (_) {} }
    copy(text, btn) { var done = function () { btn.textContent = 'copied'; setTimeout(function () { btn.textContent = 'copy'; }, 1400); }; if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, function () { window.prompt('Copy the key', text); }); else window.prompt('Copy the key', text); }
    mandateFor(L) {
      var m = L.data.mandate, sc = (L.data.scenarios && L.data.scenarios.scenarios) || [];
      if (this.scenario === 'stored') return { label: m.label || 'As stored', want: m.want, do_not_want: m.do_not_want, description: m.description };
      for (var i = 0; i < sc.length; i++) if (sc[i].id === this.scenario) return sc[i];
      return { label: m.label || 'As stored', want: m.want, do_not_want: m.do_not_want, description: m.description };
    }
    renderPanel() {
      var self = this, L = this.L, v = L.vault, g = L.data.grant, vj = L.data.vault, panel = this.panel;
      var sc = (L.data.scenarios && L.data.scenarios.scenarios) || [], cur = this.mandateFor(L), d = computeDelta(L, cur.want, cur.do_not_want);
      var measured = g.grant.filter(function (r) { return L.measured[r.evidence]; }).length;
      var evLabel = measured ? 'measured ' + measured + ' of ' + g.grant.length : (g.grant.every(function (r) { return r.evidence === 'documented' || r.evidence === 'inferred'; }) ? 'documented' : 'derived');
      var evClass = measured ? 'live' : (evLabel === 'documented' ? 'doc' : 'der');
      function chipFor(s, id) { var dd = computeDelta(L, s.want, s.do_not_want); var on = self.scenario === id;
        return dom.el('button', { type: 'button', class: 'ab-scen' + (on ? ' on' : ''), 'data-scenario': id, title: s.description || '' }, [dom.el('b', null, [s.label]), dom.el('span', null, [dd.counts.wanted + ' wanted · ' + dd.counts.unbounded + ' unbounded' + (dd.counts.shortfall ? ' · ' + dd.counts.shortfall + ' shortfall' : '')])]); }
      var normal = sc.filter(function (s) { return s.tier === 'normal'; }), adv = sc.filter(function (s) { return s.tier !== 'normal'; });
      var W = {}, D = {}; cur.want.forEach(function (i) { W[i] = 1; }); cur.do_not_want.forEach(function (i) { D[i] = 1; });
      function st(id) { return W[id] ? 'want' : D[id] ? 'refused' : 'unstated'; }
      var ids = sortRows(L, g.grant.map(function (r) { return r.capability; }));
      panel.textContent = '';
      panel.appendChild(dom.el('div', { class: 'ab-ph' }, [
        logoEl(v.logo, v.brand, 52),
        dom.el('div', { class: 'ab-pht' }, [dom.el('b', null, [vj.title || v.title]), dom.el('span', { class: 'ab-meta' }, [g.id + ' · grant ' + g.profile_version + (L.source === 'live' ? ' · live' : ' · snapshot')]),
          dom.el('span', { class: 'ab-pills' }, [dom.el('span', { class: 'ab-pill ' + (vj.status === 'template' ? 'unstated' : 'want') }, [vj.status]), dom.el('span', { class: 'ab-pill ev-' + evClass }, [evLabel])].concat((g.research_needed || []).length ? [dom.el('span', { class: 'ab-pill unstated' }, [(g.research_needed || []).length + ' open questions'])] : []))]),
        dom.el('button', { type: 'button', class: 'ab-x', 'data-close': '', 'aria-label': 'Close the preview' }, ['×']),
      ]));
      panel.appendChild(dom.el('p', { class: 'ab-pblurb' }, [v.blurb || g.description]));
      var scen = dom.el('div', { class: 'ab-scens' }, [dom.el('div', { class: 'ab-scenhead' }, [dom.el('span', { class: 'ab-tag' }, ['Scenario']), dom.el('span', null, ['changes the mandate, never the grant'])]),
        dom.el('div', { class: 'ab-scenrow one' }, [chipFor({ label: 'As stored — ' + (L.data.mandate.label || 'the starting mandate'), want: L.data.mandate.want, do_not_want: L.data.mandate.do_not_want, description: L.data.mandate.description }, 'stored')])]);
      if (normal.length) { scen.appendChild(dom.el('span', { class: 'ab-scentier' }, ['Normal use'])); scen.appendChild(dom.el('div', { class: 'ab-scenrow' }, normal.map(function (s) { return chipFor(s, s.id); }))); }
      if (adv.length) { scen.appendChild(dom.el('span', { class: 'ab-scentier' }, ['Advanced'])); scen.appendChild(dom.el('div', { class: 'ab-scenrow' }, adv.map(function (s) { return chipFor(s, s.id); }))); }
      panel.appendChild(scen);
      panel.appendChild(dom.el('p', { class: 'ab-scendesc' }, [dom.el('b', null, [cur.label + '. ']), cur.description || '']));
      panel.appendChild(dom.el('div', { class: 'ab-pcounts' }, [[d.counts.grant, 'it can do', ''], [d.counts.wanted, 'wanted', 'ok'], [d.counts.excess, 'not asked', 'ex'], [d.counts.unbounded, 'unbounded', 'un'], [d.counts.shortfall, 'shortfall', d.counts.shortfall ? 'sf' : '']].map(function (c) { return dom.el('span', { class: 'ab-pc ' + c[2] }, [dom.el('b', null, [String(c[0])]), dom.el('span', null, [c[1]])]); })));
      panel.appendChild(diagram(L, d, W, D));
      panel.appendChild(labelBox(L, d, W, D));
      var RF = [['all', 'all'], ['want', 'wanted'], ['refused', 'told not to'], ['unstated', 'unstated'], ['unbounded', 'unbounded'], ['boundary', 'behind a boundary'], ['irreversible', 'cannot be undone']];
      var rf = self.rowFilter, keep = function (id) { var r = L.row[id], s = st(id); return rf === 'all' || rf === s || (rf === 'unbounded' && !W[id] && r.barrier !== 'boundary') || (rf === 'boundary' && r.barrier === 'boundary') || (rf === 'irreversible' && r.undo === 'no'); };
      var shown = ids.filter(keep);
      var rows = dom.el('div', { class: 'ab-gm' }, [dom.el('div', { class: 'ab-scenhead' }, [dom.el('span', { class: 'ab-tag' }, ['The grant, against this mandate · ' + shown.length + ' of ' + ids.length]), dom.el('span', null, ['○ boundary · ◐ setting · ◉ rule · ● none'])]),
        dom.el('div', { class: 'ab-rf' }, RF.map(function (f) { return dom.el('button', { type: 'button', 'data-rowfilter': f[0], 'aria-pressed': rf === f[0] ? 'true' : 'false' }, [f[1]]); }))]);
      shown.forEach(function (id) { var r = L.row[id], s = st(id); rows.appendChild(dom.el('div', { class: 'ab-gmrow' }, [dom.el('span', { class: 'ab-g ' + r.barrier, title: r.barrier }, [GLYPH[r.barrier]]), dom.el('span', { class: 'ab-gmid' }, [dom.el('b', null, [id]), dom.el('span', null, [r.note || gloss(L, id)])]), dom.el('span', { class: 'ab-pill ' + s, title: s === 'refused' ? 'the mandate refuses it; the grant still permits it' : '' }, [STATUS_LABEL[s]])])); });
      if (rf === 'all' || rf === 'want') d.shortfall.forEach(function (id) { rows.appendChild(dom.el('div', { class: 'ab-gmrow short' }, [dom.el('span', { class: 'ab-g' }, ['·']), dom.el('span', { class: 'ab-gmid' }, [dom.el('b', null, [id]), dom.el('span', null, [gloss(L, id) + ' — not in the grant'])]), dom.el('span', { class: 'ab-pill short' }, ['wanted · not granted'])])); });
      if (!shown.length) rows.appendChild(dom.el('p', { class: 'ab-none' }, ['no row matches this filter']));
      panel.appendChild(rows);
      panel.appendChild(dom.el('div', { class: 'ab-pbtns' }, [dom.el('a', { class: 'btn btn-green', href: v.page }, ['Open the policy page →']), dom.el('a', { class: 'btn btn-ghost dark', href: UI + '/en-gb/#' + v.key + ':' + v.vid, target: '_blank', rel: 'noopener' }, ['Open the vault ↗'])]));
      panel.appendChild(dom.el('div', { class: 'ab-pkey' }, [dom.el('span', null, ['read key ']), dom.el('code', null, [publicKey(v)]), dom.el('button', { type: 'button', class: 'ab-copy', 'data-copy': publicKey(v) }, ['copy'])]));
    }
  };
  customElements.define('rm-abp-library', RM.components.AbpLibrary);
  customElements.define('rm-abp-mini',  RM.components.AbpMini);
  customElements.define('rm-abp-card',  RM.components.AbpCard);
  customElements.define('rm-abp-table', RM.components.AbpTable);
  customElements.define('rm-abp-files', RM.components.AbpFiles);
  customElements.define('rm-abp-key',   RM.components.AbpKey);
  customElements.define('rm-abp-app',   RM.components.AbpApp);
  customElements.define('rm-abp-host',  RM.components.AbpHost);

  return { VAULTS: VAULTS, bySlug: bySlug, publicKey: publicKey, load: load, Reader: Reader, ENDPOINT: ENDPOINT, UI: UI, computeDelta: computeDelta, logoEl: logoEl };
})();
