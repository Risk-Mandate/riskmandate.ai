// build-abp-pages.mjs — the behaviour-policy vault directory and one page per vault.
//
//   node scripts/site/build-abp-pages.mjs           # write site/agent-behaviour-policy.html and site/abp-vault-<slug>.html
//   node scripts/site/build-abp-pages.mjs --check   # fail if any of them is stale
//
// One catalogue, site/vaults/index.json, is the single source: which vaults exist, their
// vault id and PUBLIC read key, their target application, and which shapes are asked
// for but not built. Everything else on these pages is read from the vault directory at
// build time (counts, product, measured rows) or from the vault itself at runtime.
//
// The pages share the site's chrome by being cut from a donor page (lab-abp-requests.html),
// the same way new-page.mjs works; the page-specific CSS and the components live in
// scripts/site/abp/ so they exist once. pages.json gains an entry per page if missing.
//
// A read key on these pages is public by design; a write credential never is, and the
// site's tests fail the build if one lands anywhere in site/.

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join, resolve }                                 from 'node:path';
import { fileURLToPath }                                          from 'node:url';

const ROOT  = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const SITE  = join(ROOT, 'site');
const HERE  = join(ROOT, 'scripts', 'site', 'abp');
const CHECK = process.argv.includes('--check');
const ORIGIN = 'https://riskmandate.ai';

const catalogue = JSON.parse(readFileSync(join(SITE, 'vaults', 'index.json'), 'utf8'));
const donor  = readFileSync(join(SITE, 'lab-abp-requests.html'), 'utf8');
const css    = readFileSync(join(HERE, 'abp.css'), 'utf8');
const shared = readFileSync(join(HERE, 'abp-vaults.js'), 'utf8');

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const vaultData = (slug) => {
  const d = (p) => JSON.parse(readFileSync(join(SITE, 'vaults', slug, p), 'utf8'));
  const sp = join(SITE, 'vaults', slug, 'data/scenarios.json');
  return { vault: d('vault.json'), grant: d('data/grant.json'), mandate: d('data/mandate.json'), delta: d('data/delta.json'), tiers: d('data/vocabulary/evidence-tiers.json'), scenarios: existsSync(sp) ? d('data/scenarios.json') : null };
};
const words = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];
const W = (n) => words[n] ?? String(n);
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// ----------------------------------------------------------------- the shared script, with the catalogue in it
const built = catalogue.vaults.filter(v => v.vid && v.key);
const VAULTS = join(SITE, 'vaults');
const VAULTS_JS = JSON.stringify(built.map(v => ({ slug: v.slug, vid: v.vid, key: v.key, title: v.title, shape: v.shape, page: `abp-vault-${v.slug}.html`, status: 'template', app: v.app, blurb: v.blurb, group: v.group, logo: v.logo, brand: v.brand })), null, 2);
const LOGOS = JSON.parse(readFileSync(join(HERE, 'logos.json'), 'utf8')).icons;
// where a suggestion goes, for now: the project lead's own address, by their instruction of 15 September
const DEMO_TO = 'dinis.cruz@owasp.org';
const sharedWithCatalogue = shared.replace('/*__VAULTS__*/[]', VAULTS_JS).replace('/*__APP_VAULT__*/null', JSON.stringify(catalogue.app_vault ? { vault_id: catalogue.app_vault.vault_id, key: catalogue.app_vault.key, entry: catalogue.app_vault.entry || 'index.html' } : null)).replace('/*__LOGOS__*/{}', JSON.stringify(LOGOS));
for (const m of ['/*__VAULTS__*/[]', '/*__APP_VAULT__*/null', '/*__LOGOS__*/{}']) if (!shared.includes(m)) { console.error(`abp-vaults.js has no ${m} marker`); process.exit(1); }
// a product mark as static markup, for the tiles the page ships with (the component draws the same one live)
const hexA = (hex, a) => { const n = parseInt(String(hex || '#0D0D0C').slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };
function logoHtml(name, brand, size) {
  const sp = LOGOS[name], inner = sp ? `<svg viewBox="0 0 24 24" width="${Math.round(size / 2)}" height="${Math.round(size / 2)}" aria-hidden="true"><path d="${sp.d}" ${sp.kind === 'stroke' ? `fill="none" stroke="${brand}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"` : `fill="${brand}"`}></path></svg>` : `<b>${esc(String(name || '?').slice(0, 2).toUpperCase())}</b>`;
  return `<span class="ab-logo" style="width:${size}px;height:${size}px;background:${hexA(brand, .10)};border-color:${hexA(brand, .2)}">${inner}</span>`;
}

// ----------------------------------------------------------------- cut a page from the donor
function cut(page, title, desc, body) {
  let head = donor.slice(0, donor.indexOf('<body'));
  head = head.replace(/<title>.*?<\/title>/s, `<title>${esc(title)}</title>`);
  head = head.replace(/(<meta name="description" content=")[^"]*(")/, `$1${esc(desc)}$2`);
  head = head.replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${esc(title)}$2`);
  head = head.replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${esc(desc)}$2`);
  head = head.split('lab-abp-requests').join(page);
  head = head.replace('</style>', '\n' + css + '</style>');
  const bodyStart = donor.indexOf('<body'), scriptAt = donor.indexOf('<script>', bodyStart);
  const donorBody = donor.slice(bodyStart, scriptAt);
  const hdr  = donorBody.match(/<header class="top">.*?<\/header>/s)[0];
  const foot = donorBody.match(/<footer class="foot">.*?<\/footer>/s)[0];
  let tail = donor.slice(scriptAt).replace('RM.data.currentPage="lab-abp-requests"', `RM.data.currentPage="${page}"`);
  const marker = "'use strict';\n// boot.js";
  const i = tail.lastIndexOf(marker); if (i < 0) { console.error('donor has no boot.js block'); process.exit(1); }
  tail = tail.slice(0, i) + sharedWithCatalogue + '\n' + tail.slice(i);   // our block keeps its own header; boot.js keeps its own
  return head + '<body id="top">\n\n' + hdr + '\n\n' + body + '\n\n' + foot + '\n\n' + tail;
}

// ----------------------------------------------------------------- the library
// Grid and list are two views of one set, wired by <rm-abp-library>; the markup here is static so
// the page works without JS (every tile is a link to its page) and the search index is built at
// build time from each vault's grant: names, shape, vendor, scopes and tools (via), capability ids.
const evOf = (data) => { const g = data.grant, tiers = data.tiers.counted_as_measured; const m = g.grant.filter(r => tiers.includes(r.evidence)).length; return m ? { cls: 'live', label: `measured ${m} of ${g.grant.length}`, key: 'measured' } : g.grant.every(r => r.evidence === 'documented' || r.evidence === 'inferred') ? { cls: 'doc', label: 'documented', key: 'documented' } : { cls: 'der', label: 'derived', key: 'derived' }; };
const searchIndex = (v, data) => { const g = data.grant; return [v.app, v.title, v.slug, v.shape, v.group, v.blurb, g.vendor, g.product, ...(g.tools || []), ...g.grant.flatMap(r => [r.capability, ...(r.via || [])]), ...(g.research_needed || []).map(q => q.question)].join(' ').toLowerCase(); };
const meter = (d) => { const tot = Math.max(1, d.excess), u = d.unbounded_excess; return `<span class="ab-meter"><i class="u" style="width:${u / tot * 100}%"></i><i class="b" style="width:${(d.excess - u) / tot * 100}%"></i></span>`; };
function tile(v, data) {
  const d = data.delta.counts, g = data.grant, ev = evOf(data), q = (g.research_needed || []).length, sc = (data.scenarios?.scenarios || []).length;
  return `<article class="ab-t" data-slug="${v.slug}" data-group="${esc(v.group)}" data-ev="${ev.key}" data-caps="${g.grant.map(r => r.capability).join(' ')}" data-search="${esc(searchIndex(v, data))}" tabindex="0" role="button" aria-label="Preview ${esc(v.app)}">
  <span class="ab-thead">${logoHtml(v.logo, v.brand, 44)}<span class="ab-pills">${q ? `<span class="ab-pill unstated">${q} open</span>` : ''}<span class="ab-pill ev-${ev.cls}">${ev.label}</span></span></span>
  <span><h3><a href="abp-vault-${v.slug}.html">${esc(v.app)}</a></h3><p>${esc(v.blurb)}</p></span>
  <span class="ab-tfoot"><span><b>${g.grant.length}</b> it can do</span><span><b class="${d.unbounded_excess ? 'un' : 'ok'}">${d.unbounded_excess}</b> unbounded</span>${meter(d)}<span>${sc ? sc + ' scenarios' : ''}</span><rm-abp-mini data-vault="${v.slug}"></rm-abp-mini><a class="ab-topen" href="abp-vault-${v.slug}.html">Open the behaviour policy →</a></span>
</article>`;
}
const offTile = (x, kind) => `<a class="ab-t off" href="#ask" data-slug="${esc(x.slug)}" data-off="1" data-group="${kind}" data-ev="asked" data-search="${esc([x.app, x.slug, x.blurb, kind].join(' ').toLowerCase())}">
  <span class="ab-thead">${logoHtml(x.logo, x.brand, 44)}<span class="ab-pill asked">${kind === 'Business functions' ? 'asked for' : 'not yet researched'}</span></span>
  <span><h3>${esc(x.app)}</h3><p>${esc(x.blurb)}</p></span>
  <span class="ab-ask">${kind === 'Business functions' ? 'a behaviour policy for the function, whichever product holds it →' : 'ask for this →'}</span>
</a>`;
function row(v, data) {
  const d = data.delta.counts, g = data.grant, ev = evOf(data), q = (g.research_needed || []).length;
  return `<div class="ab-lrow" data-slug="${v.slug}" data-group="${esc(v.group)}" data-ev="${ev.key}" data-caps="${g.grant.map(r => r.capability).join(' ')}" data-search="${esc(searchIndex(v, data))}" tabindex="0" role="button" aria-label="Preview ${esc(v.app)}">
  <span class="ab-lname">${logoHtml(v.logo, v.brand, 30)}<span><b><a href="abp-vault-${v.slug}.html">${esc(v.app)}</a></b><small>${esc(v.slug)}</small></span></span>
  <span><span class="ab-pill ev-${ev.cls}">${ev.label}</span></span>
  <span class="n r">${g.grant.length}</span><span class="n r">${data.mandate.want.length}</span><span class="n r">${d.excess}</span>
  <span class="un"><b class="${d.unbounded_excess ? 'y' : 'z'}">${d.unbounded_excess}</b>${meter(d)}</span>
  <span class="open ${q ? 'y' : ''}">${q ? q + ' open' : '—'}</span><a class="arrow ab-topen" href="abp-vault-${v.slug}.html" aria-label="Open the policy page for ${esc(v.app)}" title="Open the policy page">→</a>
</div>`;
}
const offRow = (x, kind) => `<a class="ab-lrow off" href="#ask" data-slug="${esc(x.slug)}" data-off="1" data-group="${kind}" data-ev="asked" data-search="${esc([x.app, x.slug, x.blurb, kind].join(' ').toLowerCase())}"><span class="ab-lname">${logoHtml(x.logo, x.brand, 30)}<span><b>${esc(x.app)}</b></span></span><span><span class="ab-pill asked">${kind === 'Business functions' ? 'asked for' : 'not researched'}</span></span><span class="ab-lblurb">${esc(x.blurb)}</span><span class="arrow">→</span></a>`;
function directory() {
  const on = catalogue.vaults.filter(v => v.vid && v.key), asked = catalogue.asked_for || [], fns = catalogue.functions || [];
  const groups = [...new Set(on.map(v => v.group))];
  const data = Object.fromEntries(on.map(v => [v.slug, vaultData(v.slug)]));
  const caps = JSON.parse(readFileSync(join(SITE, 'vaults', on[0].slug, 'data/vocabulary/capabilities.json'), 'utf8')).capabilities;
  const rows = Object.values(data).reduce((n, x) => n + x.grant.grant.length, 0), measured = Object.values(data).reduce((n, x) => n + x.grant.grant.filter(r => x.tiers.counted_as_measured.includes(r.evidence)).length, 0);
  const openQ = Object.values(data).reduce((n, x) => n + (x.grant.research_needed || []).length, 0);
  const gridGroups = groups.map(gname => `<div class="ab-group" data-groupname="${esc(gname)}"><div class="ab-grouphead"><b>${esc(gname)}</b><span>${on.filter(v => v.group === gname).length} policies</span></div><div class="ab-grid2">${on.filter(v => v.group === gname).map(v => tile(v, data[v.slug])).join('\n')}</div></div>`).join('\n');
  const listGroups = groups.map(gname => `<div class="ab-lgroup" data-groupname="${esc(gname)}"><b>${esc(gname)}</b><span>${on.filter(v => v.group === gname).length}</span></div>${on.filter(v => v.group === gname).sort((a, b) => data[b.slug].delta.counts.unbounded_excess - data[a.slug].delta.counts.unbounded_excess).map(v => row(v, data[v.slug])).join('\n')}`).join('\n');
  const chips = ['all', ...groups.map(g => 'group:' + g)].map(f => `<button type="button" class="ab-f" data-filter="${esc(f)}" aria-pressed="${f === 'all' ? 'true' : 'false'}">${esc(f === 'all' ? `All · ${on.length}` : f.slice(6))}</button>`).join('') + '<span class="sep"></span>' + ['measured', 'documented'].map(e => `<button type="button" class="ab-f" data-filter="ev:${e}" aria-pressed="false">${e}</button>`).join('');
  const SEARCH_SVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="M20 20l-3.5-3.5"></path></svg>`;
  return `<div class="labstrip"><b>Agent Behaviour Policies</b> · ${on.length} example policies, one per target application, read live in your browser with published keys. <a href="abp.html">What an Agent Behaviour Policy is</a> · <a href="agent-behaviour-policy-next.html">Which one next? Vote or suggest</a></div>

<main class="phero">
  <div class="wrap">
    <span class="eyebrow"><span class="d"></span> Agent Behaviour Policies · the examples</span>
    <h1>Agent Behaviour Policies, <span class="it">as building blocks.</span></h1>
    <p class="sub">An <strong>Agent Behaviour Policy</strong> describes one AI agent in one deployment: everything it can do (the grant), what you actually authorised (the mandate), the gap between the two (the delta), and what really stands in the way of each thing (the barrier). It describes and it does not judge, so it carries no score. Below are the example policies we have built, one per target application — for most people the first they will have seen. Click one to read it here; a real deployment is a combination of several.</p>
    <div class="cta-row">
      <a class="btn btn-ghost" href="abp.html">What is an Agent Behaviour Policy? →</a>
    </div>
  </div>
</main>

<div class="paper">

  <section class="psection" id="library">
    <div class="wrap ab-wide">
      <div class="shead">
        <span class="tag">${on.length} example policies · ${rows} capability rows · ${measured} measured on the thing itself · ${openQ} open questions</span>
        <h2>Pick a behaviour policy. <span class="g">Read it here. Open its vault.</span></h2>
        <p>Every tile is one Agent Behaviour Policy, delivered as a vault: a measured or documented grant for that application, a starting mandate written to be corrected, six scenarios that change the mandate and never the grant, and the files you hand the agent. The counts are read from the vault as you look. Grid or list, same set; search matches names, vendors, scopes, tool names and the 23 capability ids, so <code>send.message.world</code> finds every policy that can send mail whatever the product calls it. Not here yet? <a href="agent-behaviour-policy-next.html">See what is next, vote, or suggest one</a>.</p>
      </div>
      <rm-abp-library class="ab-lib" data-view="grid">
        <div class="ab-tools">
          <label class="ab-search">${SEARCH_SVG}<input type="search" placeholder="Search a behaviour policy, a scope, a capability…" aria-label="Search the policies"><kbd>/</kbd></label>
          <div class="ab-filters">${chips}</div>
          <label class="ab-beh"><span>by behaviour</span><select aria-label="Filter by behaviour"><option value="">any of the 23</option>${caps.map(c => `<option value="${c.id}">${esc(c.id)} — ${esc(c.gloss)}</option>`).join('')}</select></label>
          <div class="ab-toggle" role="group" aria-label="View"><button type="button" data-view="grid" aria-pressed="true" aria-label="Grid view"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="3" width="8" height="8" rx="1.5"></rect><rect x="13" y="3" width="8" height="8" rx="1.5"></rect><rect x="3" y="13" width="8" height="8" rx="1.5"></rect><rect x="13" y="13" width="8" height="8" rx="1.5"></rect></svg></button><button type="button" data-view="list" aria-pressed="false" aria-label="List view"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"></path></svg></button></div>
        </div>
        <div class="ab-body">
          <div class="ab-views">
            <div class="ab-gridv">
${gridGroups}
              <p class="ab-none" hidden>Nothing matches. Search matches names, vendors, scopes, tools and capability ids — try a shorter word.</p>
            </div>
            <div class="ab-list">
              <div class="ab-lhead"><span>Policy</span><span>Evidence</span><span class="r">Can</span><span class="r">Want</span><span class="r">Excess</span><span>Unbounded · by barrier</span><span>Open</span><span></span></div>
${listGroups}
            </div>
            <p class="src" style="margin-top:18px">Missing the one you run? <a href="agent-behaviour-policy-next.html">${asked.length + fns.length} are asked for — vote on which is next, or suggest one</a>. Every vault also carries <code>MAP-A-GRANT.md</code>: give it to an agent that already holds the credential and it measures its own grant.</p>
          </div>
          <div class="ab-resize" role="separator" aria-orientation="vertical" aria-label="Resize the preview panel" title="Drag to resize · double-click to reset"></div>
          <div class="ab-backdrop" data-close hidden></div>
          <aside class="ab-panel" aria-live="polite"></aside>
        </div>
      </rm-abp-library>
      <div class="ab-legend" style="margin-top:18px"><span>■ unbounded excess — a rule in prose, a setting, or nothing</span><span style="color:var(--green)">■ excess behind a boundary — the only control</span><span>no score, anywhere — a policy describes, it does not judge</span><span>read live from each vault with its published key · <a href="https://sgit.ai/docs/vault/reading-a-vault-file.html" target="_blank" rel="noopener">how</a> · <a href="lab-vault-delivered.html">Lab 07</a></span></div>
    </div>
  </section>

</div>

<section class="pcta">
  <div class="wrap">
    <span class="eyebrow"><span class="d"></span> Agent Behaviour Policies</span>
    <h2>Pick the policies your deployment is made of. Then correct the mandate.</h2>
    <p>Everything else in the vault is derived. The correction is the elicitation, and the corrected combination — with a name on the licence and no public key — is what is sold.</p>
    <div class="cta-row">
      <a class="btn btn-green" href="abp.html">What an Agent Behaviour Policy is →</a>
      <a class="btn btn-ghost" href="pricing.html">What it costs</a>
    </div>
  </div>
</section>`;
}

// ----------------------------------------------------------------- the next page: the queue, the vote, the suggestion
function nextTile(x, kind) {
  return `<article class="ab-nt">
  <span class="ab-thead">${logoHtml(x.logo, x.brand, 44)}<span class="ab-pill asked">${kind}</span></span>
  <h3>${esc(x.app)}</h3><p>${esc(x.blurb)}</p>
  <div class="ab-vote"><button type="button" disabled title="Voting is coming soon">▲ Vote</button><span>coming soon · for now, say so in the form below</span></div>
</article>`;
}
function nextPage() {
  const asked = catalogue.asked_for || [], fns = catalogue.functions || [], on = catalogue.vaults.filter(v => v.vid && v.key);
  const subject = encodeURIComponent('Agent Behaviour Policy suggestion');
  return `<div class="labstrip"><b>Agent Behaviour Policies · what is next</b> · ${asked.length + fns.length} asked for, none invented to fill a grid. <a href="agent-behaviour-policy.html">Back to the ${on.length} examples</a></div>

<main class="phero">
  <div class="wrap">
    <span class="eyebrow"><span class="d"></span> Agent Behaviour Policies · the queue</span>
    <h1>Which Agent Behaviour Policy <span class="it">next?</span></h1>
    <p class="sub">An Agent Behaviour Policy is built from a measured or documented grant, never typed. These are the applications and business functions people have asked for. Each becomes a vault once its vendor pages have been read and quoted, or once one product's grant is documented for the function. Voting is coming; for now, the form at the bottom reaches us directly.</p>
  </div>
</main>

<div class="paper">

  <section class="psection" id="queue">
    <div class="wrap">
      <div class="shead">
        <span class="tag">Not yet researched · ${asked.length}</span>
        <h2>By target application, <span class="g">and what each one waits for.</span></h2>
        <p>The connector shapes below become policies the way the five connector examples were: the connector's own scope or permission page read and quoted on a date, a row per capability the scopes permit, the contradictions between what is advertised and what is granted published unresolved, and the open questions handed to whoever researches next.</p>
      </div>
      <div class="ab-next">
${asked.map(x => nextTile(x, 'not yet researched')).join('\n')}
      </div>
    </div>
  </section>

  <section class="psection alt" id="functions">
    <div class="wrap">
      <div class="shead">
        <span class="tag">By business function · ${fns.length}</span>
        <h2>What the agent is for, <span class="g">not what it runs on.</span></h2>
        <p>A different axis: a policy for the CRM, the service desk or the finance data, whichever product holds it. The mandate is the same across products; the grant is per product; the policy is built once one product's grant is documented for the function.</p>
      </div>
      <div class="ab-next">
${fns.map(x => nextTile(x, 'asked for')).join('\n')}
      </div>
    </div>
  </section>

  <section class="psection" id="suggest">
    <div class="wrap">
      <div class="shead">
        <span class="tag">Suggest one</span>
        <h2>Run something that is not here? <span class="g">Tell us.</span></h2>
        <p>The form opens a message in your mail client with what you typed; nothing is stored on this site. Say which application or connector, what it is connected to, and why it matters to you. If your agent already holds the credential, every vault carries <code>MAP-A-GRANT.md</code>: give it to the agent and it measures its own grant and drafts the first policy — send us what it finds and the policy gets a tile.</p>
      </div>
      <form class="ab-form" action="mailto:${DEMO_TO}?subject=${subject}" method="post" enctype="text/plain">
        <label>The application or connector<input name="application" type="text" placeholder="e.g. Slack, Notion, HubSpot, Home Assistant" required></label>
        <label>What it is connected to<input name="connected_to" type="text" placeholder="e.g. our workspace, a personal account, the CRM"></label>
        <label class="full">Why this one, and what you would want it to do<textarea name="why" placeholder="One or two sentences. The mandate is the part only you can write."></textarea></label>
        <label>Your email, if you want a reply<input name="email" type="email" placeholder="you@example.com"></label>
        <label>Vote for one already listed<select name="vote"><option value="">— none —</option>${[...asked, ...fns].map(x => `<option value="${esc(x.slug)}">${esc(x.app)}</option>`).join('')}</select></label>
        <div class="row"><button class="btn btn-green" type="submit">Send the suggestion →</button><span class="note">Opens your mail client · voting on this page is coming soon</span></div>
      </form>
    </div>
  </section>

</div>

<section class="pcta">
  <div class="wrap">
    <span class="eyebrow"><span class="d"></span> Agent Behaviour Policies</span>
    <h2>The ${on.length} we have are on the library page.</h2>
    <p>Each one read live from its vault, with its scenarios, its open questions and the files you hand the agent.</p>
    <div class="cta-row">
      <a class="btn btn-green" href="agent-behaviour-policy.html">The examples →</a>
      <a class="btn btn-ghost" href="abp.html">What an Agent Behaviour Policy is</a>
    </div>
  </div>
</section>`;
}

// Where "buy" goes, and what it may say.
//
// The store owns the cart, the order and every price (its boundary, published 16 September); this
// site owns the shapes, the policies and the vaults, and holds no price anywhere. So a buy link
// here names the level, never the number, and points at the store's own page for this shape.
//
// The store builds a page per shape by promoting this catalogue at ITS build time, so a shape
// added here has no /p/<slug>/ until the store next builds. A catalogue entry says so with
// `store_page: false`, and until it flips the button points at the store's index of shapes
// rather than at a 404. Checked against store.sgit.ai v0.3.17, 16 September 2026.
const STORE = 'https://store.sgit.ai';
const storeBuy = (v) => v.store_page === false
  ? { href: `${STORE}/policies/`, label: 'See the levels at the store ↗' }
  : { href: `${STORE}/p/${v.slug}/`, label: 'Buy this policy ↗' };

function vaultPage(v) {
  const { vault, grant, mandate, delta } = vaultData(v.slug);
  const buy = storeBuy(v);
  const c = delta.counts, n = grant.grant.length, wanted = mandate.want.length;
  const measured = vault.measured_rows || `${grant.rows.measured} of ${grant.rows.total}`;
  const bounded = c.excess - c.unbounded_excess;
  const headline = c.excess === 0
    ? `${cap(W(n))} it can do. ${cap(W(wanted))} you asked for. <span class="g">Nothing left over.</span>`
    : `${cap(W(n))} it can do. ${cap(W(wanted))} you asked for. <span class="g">${cap(W(c.unbounded_excess))} nothing bounds.</span>`;
  return `<div class="labstrip"><b>Behaviour-policy vault</b> · <span class="state proposal">Template</span> · Read live from vault <b>${esc(v.vid)}</b> with the key printed on this page. <a href="agent-behaviour-policy.html">All applications</a> · <a href="lab-vault-delivered.html">How the first one was built</a></div>

<main class="phero">
  <div class="wrap">
    <span class="eyebrow"><span class="d"></span> Agent Behaviour Policy · ${esc(v.shape)}</span>
    <h1>${esc(v.title_lead || v.app)}<span class="it">${esc(v.title_tail ? ' ' + v.title_tail : '')}</span></h1>
    <p class="sub">${esc(grant.description.split('. ').slice(0, 2).join('. '))}. This is the template vault for that shape: the grant ${grant.rows && grant.rows.measured ? 'measured on the thing itself' : grant.research_needed ? 'read from the vendor\'s own pages on ' + grant.profile_version + ' and quoted, with ' + grant.research_needed.length + ' open questions it could not settle' : 'derived from what the shape architecturally is and from published documentation'}, the starting mandate ${grant.research_needed ? 'written here to be argued with' : 'the model site published'}, and everything else derived. Every number on this page is decrypted from the vault as you read it.</p>
    <div class="cta-row">
      <button class="btn btn-green" data-to="live">See it live ↓</button>
      <a class="btn btn-ghost" href="${buy.href}" target="_blank" rel="noopener">${buy.label}</a>
      <button class="btn btn-ghost" data-to="key">The read key ↓</button>
    </div>
  </div>
</main>

<div class="paper">

  <section class="psection" id="live">
    <div class="wrap">
      <div class="shead">
        <span class="tag">01 · See it live</span>
        <h2>Open the vault. <span class="g">See what you get.</span></h2>
        <p>Reading app · files · keys · history. Two frames, both the official SG/Vault interface opened read-only with the key printed at the bottom of this page, both reading the vault and not this site. The first is the vault's own app, which is what whoever is handed the policy sees. The second is the vault browser: every file in the tree, its history, and the same app one click away. Between them is what you are buying at every level — the app is the reading, the tree is the record.</p>
      </div>
      <div class="ab-live">
        <div>
          <h3 class="ab-live-h">The app</h3>
          <p class="ab-live-p">Opens on <em>Start here</em>. A left navigation: the record it can do, what you do with it, and what you hold — the mandate to correct, the consequences that follow, your keys, and the licence.</p>
          <rm-abp-host data-vault="${v.slug}" data-mode="app"></rm-abp-host>
        </div>
        <div>
          <h3 class="ab-live-h">The vault</h3>
          <p class="ab-live-p">The tree on the left is the whole product: the markdown for people, the JSON for machines, the pinned vocabulary, the scenarios, the consequence layer, the history of every recompute. Click a file to read it; the same app is under <em>index.html</em>.</p>
          <rm-abp-host data-vault="${v.slug}" data-mode="vault"></rm-abp-host>
        </div>
      </div>
      <div class="ab-claims">
        <div><b>Your keys.</b> A working copy you control; hand the read key on and the reader sees what you see.</div>
        <div><b>Multiple formats.</b> Markdown for people, JSON for machines, the whole thing as a zip with its sha256.</div>
        <div><b>Version history.</b> Every recompute keeps the basis of the revision, and the vault keeps every commit.</div>
      </div>
      <p class="src">The read key travels to the host over a same-page handshake, never in a URL. Nothing you do in either frame touches the vault: it is opened read-only, and the write key is not published. Not loading? <a href="https://dev.vault.sgraph.ai/en-gb/#${v.key}:${v.vid}" target="_blank" rel="noopener">Open it in its own tab ↗</a>.</p>
    </div>
  </section>

  <section class="psection alt" id="card">
    <div class="wrap">
      <div class="shead">
        <span class="tag">02 · The card</span>
        <h2>${headline}</h2>
        <p>Four counts and no score. The bar splits the excess by what stands in the way of each row: nothing, a rule in prose, a setting the agent's own account can flip, or a boundary enforced above it. Only the last is a control. ${measured} rows ${grant.rows && grant.rows.measured ? 'were observed on the thing itself' : grant.research_needed ? 'were measured; every row was read from a vendor page on a date, and the open questions are the rows a page could not settle' : 'were measured; the rest are derived, and the provenance line on every row says so'}.</p>
      </div>
      <rm-abp-card data-vault="${v.slug}"></rm-abp-card>
    </div>
  </section>

  <section class="psection" id="mandate">
    <div class="wrap">
      <div class="shead">
        <span class="tag">03 · The mandate</span>
        <h2>What you asked it to do, <span class="g">and what you did not.</span></h2>
        <p>Elicited, and the only authored file in the vault. This is the draft asserting a conservative mandate so that the correction goes upward: most people authorised less than they think, and never mentioned the rest.</p>
      </div>
      <rm-abp-table data-vault="${v.slug}" data-view="mandate"></rm-abp-table>
    </div>
  </section>

  <section class="psection alt" id="grant">
    <div class="wrap">
      <div class="shead">
        <span class="tag">04 · The grant</span>
        <h2>Everything the agent can do, <span class="g">irreversible rows first.</span></h2>
        <p>Measured from the shape, not from your account and not by you. Each row says how it is known (✓ marks a row observed on the thing itself), what stands in the way, and whether the effect can be undone. What host, tenant and world mean in this shape is stated on the vault's Grant view, because for an agent in a vendor's container the host is the container and not your machine.</p>
      </div>
      <rm-abp-table data-vault="${v.slug}" data-view="grant"></rm-abp-table>
      <div class="shead" style="margin-top:34px">
        <h2>The grant above is what it can do <span class="g">after the blocks.</span></h2>
        <p>A capability the credential authorises and something else withholds is not a grant row, and it is not out of reach either: it is blocked, and the record names the blocker. Some of these are the credential's own ceiling. Some are a vendor choosing not to ship a tool the credential would authorise — which moves in a release, with no consent screen and nothing for anyone to click. Under one heading those two look alike; they are not.</p>
      </div>
      <rm-abp-table data-vault="${v.slug}" data-view="blocked"></rm-abp-table>
      <div class="shead" style="margin-top:34px">
        <h2>Who holds each barrier, <span class="g">in answers that need no adjective.</span></h2>
        <p>The barrier column says what stands in the way. These say who holds it, whether it can move without you, whether you would be told, and what would remove it — each a fact with a source, and none of them a rating. How much a barrier is worth depends on the deployment, which is the same reason nothing on this site is scored.</p>
      </div>
      <rm-abp-table data-vault="${v.slug}" data-view="held"></rm-abp-table>
      <div class="notice">
        <strong>A control bounds a grant only if it is enforced by something the grant does not include.</strong> A setting the agent's own account could change is not a control, because the grant includes the ability to remove the bound. A boundary enforced above it is one, because it does not. ${bounded ? `${cap(W(bounded))} of the ${W(c.excess)} excess rows here sit behind a boundary; the other ${W(c.unbounded_excess)} are only asked.` : c.excess ? 'None of the excess here sits behind a boundary: every row is only asked.' : 'There is no excess in this shape to bound.'}
      </div>
    </div>
  </section>

  <section class="psection" id="delta">
    <div class="wrap">
      <div class="shead">
        <span class="tag">05 · The delta</span>
        <h2>What it can do <span class="g">that nobody asked for.</span></h2>
        <p>Derived from the grant and the mandate, never authored, stored with both inputs pinned. Split three ways: the part you refused, the part you never mentioned, and the part with no boundary in the way — which is the only list a real control shortens.</p>
      </div>
      <rm-abp-table data-vault="${v.slug}" data-view="delta"></rm-abp-table>
    </div>
  </section>

  <section class="psection alt" id="licence">
    <div class="wrap">
      <div class="shead">
        <span class="tag">06 · Licence to Operate</span>
        <h2>The organisation authorises the agent, <span class="g">for an interval, on conditions.</span></h2>
        <p>The organisation is the authority, the behaviour policy is the instrument, the agent is the licensee. A template is unsigned and unissued; a corrected vault carries a name, a date and an interval — and each condition sits next to what enforces it, so the person signing knows what they are accepting with their eyes open.</p>
      </div>
      <rm-abp-table data-vault="${v.slug}" data-view="licence"></rm-abp-table>
    </div>
  </section>

  <section class="psection" id="files">
    <div class="wrap">
      <div class="shead">
        <span class="tag">07 · The files</span>
        <h2>The bytes themselves, <span class="g">listed from the live tree.</span></h2>
        <p>Markdown for people, JSON for machines, the pinned vocabulary, the history, and the two files you hand the agent — <code>AGENTS.md</code> for a CLAUDE.md, a ROLE.md or a skill, and <code>SKILL.md</code> in the portable skill format. The list is read from the vault's live tree; the vault browser above opens any of them from the vault itself, and each link here opens the copy this site keeps for the build.</p>
      </div>
      <rm-abp-files data-vault="${v.slug}"></rm-abp-files>
    </div>
  </section>

  <section class="psection alt" id="key">
    <div class="wrap">
      <div class="shead">
        <span class="tag">08 · The read key</span>
        <h2>Published on purpose. <span class="g">Read, and nothing else.</span></h2>
        <p>Derived one-way from the vault's write key, which is not published and never will be. With the key below anyone can clone this vault, open it in the vault browser, or read it from their own page — and check every number above against the bytes it came from. That is what makes a template free: the library is the argument, and it is public. A buyer's corrected vault has no public key.</p>
      </div>
      <rm-abp-key data-vault="${v.slug}"></rm-abp-key>
      <p class="src">sgit prints the same key with a prefix that declares its intent; the public form is the one shown. This page reads the vault at <code>dev.send.sgraph.ai</code> over plain cross-origin GETs and decrypts in your browser; the site never proxies it and holds no credential beyond the key you can see.</p>
    </div>
  </section>

</div>

<section class="pcta">
  <div class="wrap">
    <span class="eyebrow"><span class="d"></span> Behaviour-policy vault</span>
    <h2>Run this? <span class="it">Buy the one for your deployment.</span></h2>
    <p>This template is free and public, and you are reading it with the key printed above. Yours is this vault with the mandate corrected, a name on the licence, and no public key on it — and it recomputes when the grant moves. Four levels at the store: the pack as a download, a working vault you hold the keys to, that vault corrected for your situation by a named professional, or the same with two sessions and their signature. The store owns the prices, the cart and the order; this page holds none of them.${v.store_page === false ? ' This shape is new here, so the store has not built its page yet — the link goes to its list of shapes until it does.' : ''}</p>
    <div class="cta-row">
      <a class="btn btn-green" href="${buy.href}" target="_blank" rel="noopener">${buy.label}</a>
      <a class="btn btn-ghost" href="pricing.html">The four levels</a>
      <a class="btn btn-ghost" href="agent-behaviour-policy.html">All applications</a>
    </div>
  </div>
</section>`;
}

// ----------------------------------------------------------------- write, or check
const outputs = {};
outputs['agent-behaviour-policy-next.html'] = cut('agent-behaviour-policy-next', 'RiskMandate — which Agent Behaviour Policy next?', 'The applications and business functions people have asked an Agent Behaviour Policy for, and a form to suggest or vote for the next one.', nextPage());
outputs['agent-behaviour-policy.html'] = cut('agent-behaviour-policy', 'RiskMandate — Agent Behaviour Policies, one vault per application',
  'A directory of behaviour-policy template vaults, one per target application, each read live in the browser from the encrypted vault with a published read key: the four counts, every row with its barrier, the vault’s own app, and the files you hand the agent.', directory());
for (const v of built) {
  outputs[`abp-vault-${v.slug}.html`] = cut(`abp-vault-${v.slug}`, `RiskMandate — the behaviour-policy vault for ${v.app}`,
    `The template Agent Behaviour Policy vault for ${v.app} (${v.shape}), rendered live from vault ${v.vid}: the card, the mandate, the grant with a barrier per row, the delta, the Licence to Operate, the vault’s own app in a sandboxed frame, the file list and the public read key.`, vaultPage(v));
}

// paid-t1.html is hand-authored: the page a £10 buyer lands on. It carries a manifest of every
// template's zip (path, bytes, sha256, and the PDF where one exists) between the /*__DIST__*/
// markers, so the page can offer the file for the shape bought and print the hash the buyer
// checks against. Stamped here, from the bytes in site/vaults/<slug>/dist/, so it cannot drift.
{
  const paidPath = join(SITE, 'paid-t1.html');
  if (existsSync(paidPath)) {
    const page = readFileSync(paidPath, 'utf8');
    const m = page.match(/const DIST = \/\*__DIST__\*\/\[[\s\S]*?\];\n/);
    if (!m) { console.error('paid-t1.html has no /*__DIST__*/ marker'); process.exit(1); }
    const dist = built.map(v => {
      const zipPath = join(VAULTS, v.slug, 'dist', `${v.slug}.zip`);
      const pdfPath = join(VAULTS, v.slug, 'dist', `${v.slug}.pdf`);
      if (!existsSync(zipPath)) { console.error(`${v.slug}: no dist zip — run build-abp-vault.mjs`); process.exit(1); }
      const zip = readFileSync(zipPath);
      return { slug: v.slug, app: v.app, title: v.title, zip: `vaults/${v.slug}/dist/${v.slug}.zip`, bytes: zip.length,
               sha256: createHash('sha256').update(zip).digest('hex'), ...(existsSync(pdfPath) ? { pdf: `vaults/${v.slug}/dist/${v.slug}.pdf` } : {}) };
    });
    outputs['paid-t1.html'] = page.replace(m[0], 'const DIST = /*__DIST__*/' + JSON.stringify(dist) + ';\n');
  }
}

let stale = [];
for (const [file, html] of Object.entries(outputs)) {
  const p = join(SITE, file);
  if (CHECK) { if (!existsSync(p) || readFileSync(p, 'utf8') !== html) stale.push(file); continue; }
  writeFileSync(p, html);
}
// pages.json: the library is a top-level entry after The model, every vault page unlisted
const pagesPath = join(SITE, 'pages.json');
const pages = JSON.parse(readFileSync(pagesPath, 'utf8'));
const names = new Set(pages.pages.map(p => p.name));
let added = 0;
const oldIdx = pages.pages.findIndex(p => p.name === 'abp-vaults'); if (oldIdx >= 0) { pages.pages.splice(oldIdx, 1); added++; }   // the library's old name and address; abp-vaults.html is a redirect now
if (!names.has('agent-behaviour-policy')) { let i = -1; pages.pages.forEach((p, k) => { if (p.group === 'The model') i = k; }); pages.pages.splice(i + 1, 0, { name: 'agent-behaviour-policy', label: 'Agent Behaviour Policies', file: 'agent-behaviour-policy.html' }); added++; }
{ const lib = pages.pages.find(p => p.name === 'agent-behaviour-policy'); if (lib && lib.label !== 'Agent Behaviour Policies') { lib.label = 'Agent Behaviour Policies'; added++; } }
if (!names.has('agent-behaviour-policy-next')) { const i = pages.pages.findIndex(p => p.name === 'agent-behaviour-policy') + 1; pages.pages.splice(i, 0, { name: 'agent-behaviour-policy-next', file: 'agent-behaviour-policy-next.html', label: 'Which Agent Behaviour Policy next?', unlisted: true }); added++; }
for (const v of built) {
  const name = `abp-vault-${v.slug}`;
  if (!names.has(name)) { const i = pages.pages.findIndex(p => p.name === 'agent-behaviour-policy') + 1; pages.pages.splice(i, 0, { name, file: `${name}.html`, label: `Vault · ${v.app}`, unlisted: true }); added++; }
}
if (added) {
  if (CHECK) stale.push('pages.json');
  else writeFileSync(pagesPath, JSON.stringify(pages, null, 2) + '\n');
}
if (CHECK) {
  if (stale.length) { console.error(`stale: ${stale.join(', ')} — run build-abp-pages.mjs`); process.exit(1); }
  console.log(`abp pages: ${Object.keys(outputs).length} up to date`);
} else {
  console.log(`abp pages: wrote ${Object.keys(outputs).length}${added ? `, pages.json +${added}` : ''} — now run generate.mjs`);
}
