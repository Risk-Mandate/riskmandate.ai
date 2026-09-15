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
const VAULTS_JS = JSON.stringify(built.map(v => ({ slug: v.slug, vid: v.vid, key: v.key, title: v.title, shape: v.shape, page: `abp-vault-${v.slug}.html`, status: 'template', app: v.app, blurb: v.blurb, group: v.group, logo: v.logo, brand: v.brand })), null, 2);
const LOGOS = JSON.parse(readFileSync(join(HERE, 'logos.json'), 'utf8')).icons;
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
  return `<a class="ab-t" href="abp-vault-${v.slug}.html" data-slug="${v.slug}" data-group="${esc(v.group)}" data-ev="${ev.key}" data-caps="${g.grant.map(r => r.capability).join(' ')}" data-search="${esc(searchIndex(v, data))}">
  <span class="ab-thead">${logoHtml(v.logo, v.brand, 44)}<span class="ab-pills">${q ? `<span class="ab-pill unstated">${q} open</span>` : ''}<span class="ab-pill ev-${ev.cls}">${ev.label}</span></span></span>
  <span><h3>${esc(v.app)}</h3><p>${esc(v.blurb)}</p></span>
  <span class="ab-tfoot"><span><b>${g.grant.length}</b> it can do</span><span><b class="${d.unbounded_excess ? 'un' : 'ok'}">${d.unbounded_excess}</b> unbounded</span>${meter(d)}<span>${sc ? sc + ' scenarios' : ''}</span><rm-abp-mini data-vault="${v.slug}"></rm-abp-mini></span>
</a>`;
}
const offTile = (x, kind) => `<a class="ab-t off" href="#ask" data-slug="${esc(x.slug)}" data-off="1" data-group="${kind}" data-ev="asked" data-search="${esc([x.app, x.slug, x.blurb, kind].join(' ').toLowerCase())}">
  <span class="ab-thead">${logoHtml(x.logo, x.brand, 44)}<span class="ab-pill asked">${kind === 'Business functions' ? 'asked for' : 'not yet researched'}</span></span>
  <span><h3>${esc(x.app)}</h3><p>${esc(x.blurb)}</p></span>
  <span class="ab-ask">${kind === 'Business functions' ? 'a policy for the function, whichever product holds it →' : 'ask for this →'}</span>
</a>`;
function row(v, data) {
  const d = data.delta.counts, g = data.grant, ev = evOf(data), q = (g.research_needed || []).length;
  return `<a class="ab-lrow" href="abp-vault-${v.slug}.html" data-slug="${v.slug}" data-group="${esc(v.group)}" data-ev="${ev.key}" data-caps="${g.grant.map(r => r.capability).join(' ')}" data-search="${esc(searchIndex(v, data))}">
  <span class="ab-lname">${logoHtml(v.logo, v.brand, 30)}<span><b>${esc(v.app)}</b><small>${esc(v.slug)}</small></span></span>
  <span><span class="ab-pill ev-${ev.cls}">${ev.label}</span></span>
  <span class="n r">${g.grant.length}</span><span class="n r">${data.mandate.want.length}</span><span class="n r">${d.excess}</span>
  <span class="un"><b class="${d.unbounded_excess ? 'y' : 'z'}">${d.unbounded_excess}</b>${meter(d)}</span>
  <span class="open ${q ? 'y' : ''}">${q ? q + ' open' : '—'}</span><span class="arrow">→</span>
</a>`;
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
  const chips = ['all', ...groups.map(g => 'group:' + g), 'group:Business functions'].map(f => `<button type="button" class="ab-f" data-filter="${esc(f)}" aria-pressed="${f === 'all' ? 'true' : 'false'}">${esc(f === 'all' ? `All · ${on.length}` : f.slice(6))}</button>`).join('') + '<span class="sep"></span>' + ['measured', 'documented'].map(e => `<button type="button" class="ab-f" data-filter="ev:${e}" aria-pressed="false">${e}</button>`).join('');
  return `<div class="labstrip"><b>The behaviour-policy library</b> · ${on.length} template policies, one per target application, read live in your browser with published keys · ${asked.length + fns.length} asked for. <a href="abp.html">The model</a> · <a href="lab-vault-delivered.html">Lab 07</a></div>

<main class="phero">
  <div class="wrap">
    <span class="eyebrow"><span class="d"></span> The behaviour-policy library</span>
    <h1>Every policy we have, <span class="it">as building blocks.</span></h1>
    <p class="sub">One template policy per target application, and one per business function. Click any of them to preview it here — the card, the grant against the mandate, the scenarios — then open its vault or its page. A real deployment is a combination of these, and the combination is what we sell.</p>
    <div class="cta-row">
      <button class="btn btn-green" data-to="library">The library ↓</button>
      <a class="btn btn-ghost" href="abp-vault-${on[0].slug}.html">${esc(on[0].app)} →</a>
    </div>
  </div>
</main>

<div class="paper">

  <section class="psection" id="library">
    <div class="wrap">
      <div class="shead">
        <span class="tag">${on.length} built · ${rows} capability rows · ${measured} measured on the thing itself · ${openQ} open questions</span>
        <h2>Pick a policy. <span class="g">Preview it here. Open its vault.</span></h2>
        <p>Every tile is a vault: a measured or documented grant for that application, a starting mandate written to be corrected, six scenarios that change the mandate and never the grant, and the files you hand the agent. The counts are read from the vault as you look. Grid or list, same set; search matches names, vendors, scopes, tool names and the 23 capability ids, so <code>send.message.world</code> finds every policy that can send mail whatever the product calls it.</p>
      </div>
      <rm-abp-library class="ab-lib" data-view="grid">
        <div class="ab-tools">
          <label class="ab-search"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="M20 20l-3.5-3.5"></path></svg><input type="search" placeholder="Search a policy, a scope, a capability…" aria-label="Search the library"><kbd>/</kbd></label>
          <div class="ab-filters">${chips}</div>
          <label class="ab-beh"><span>by behaviour</span><select aria-label="Filter by behaviour"><option value="">any of the 23</option>${caps.map(c => `<option value="${c.id}">${esc(c.id)} — ${esc(c.gloss)}</option>`).join('')}</select></label>
          <div class="ab-toggle" role="group" aria-label="View"><button type="button" data-view="grid" aria-pressed="true" aria-label="Grid view"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="3" width="8" height="8" rx="1.5"></rect><rect x="13" y="3" width="8" height="8" rx="1.5"></rect><rect x="3" y="13" width="8" height="8" rx="1.5"></rect><rect x="13" y="13" width="8" height="8" rx="1.5"></rect></svg></button><button type="button" data-view="list" aria-pressed="false" aria-label="List view"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"></path></svg></button></div>
        </div>
        <div class="ab-body">
          <div class="ab-views">
            <div class="ab-gridv">
              <span class="ab-supertitle">By target application</span>
${gridGroups}
              <div class="ab-group" data-groupname="Not yet researched"><div class="ab-grouphead"><b>Not yet researched</b><span>${asked.length} in the queue · each becomes a vault once its vendor pages have been read and quoted</span></div><div class="ab-grid2">${asked.map(x => offTile(x, 'Not yet researched')).join('\n')}</div></div>
              <span class="ab-supertitle">By business function</span>
              <div class="ab-group" data-groupname="Business functions"><div class="ab-grouphead"><b>What the agent is for, not what it runs on</b><span>${fns.length} asked for · the mandate is the same whichever product holds the data</span></div><div class="ab-grid2">${fns.map(x => offTile(x, 'Business functions')).join('\n')}</div></div>
              <p class="ab-none" hidden>Nothing matches. Search matches names, vendors, scopes, tools and capability ids — try a shorter word.</p>
            </div>
            <div class="ab-list">
              <div class="ab-lhead"><span>Policy</span><span>Evidence</span><span class="r">Can</span><span class="r">Want</span><span class="r">Excess</span><span>Unbounded · by barrier</span><span>Open</span><span></span></div>
${listGroups}
              <div class="ab-lgroup" data-groupname="Business functions"><b>Business functions</b><span>${fns.length} asked for</span></div>
${fns.map(x => offRow(x, 'Business functions')).join('\n')}
              <div class="ab-lgroup" data-groupname="Not yet researched"><b>Not yet researched</b><span>${asked.length}</span></div>
${asked.map(x => offRow(x, 'Not yet researched')).join('\n')}
            </div>
          </div>
          <div class="ab-backdrop" data-close hidden></div>
          <aside class="ab-panel" aria-live="polite"></aside>
        </div>
      </rm-abp-library>
      <div class="ab-legend" style="margin-top:18px"><span>■ unbounded excess — a rule in prose, a setting, or nothing</span><span style="color:var(--green)">■ excess behind a boundary — the only control</span><span>no score, anywhere — a policy describes, it does not judge</span></div>
    </div>
  </section>

  <section class="psection alt" id="ask">
    <div class="wrap">
      <div class="shead">
        <span class="tag">Asked for · ${asked.length + fns.length}</span>
        <h2>The next policies, <span class="g">and what each one waits for.</span></h2>
        <p>A vault is built from a measured or documented grant, never typed. The connectors above marked <em>not yet researched</em> become vaults once their vendor pages have been read and quoted, the way the five connector vaults were. The business functions are a different axis: a policy for what the agent is <em>for</em> — the CRM, the service desk, the finance data — whichever product holds it. The mandate is the same across products; the grant is per product; each becomes a vault once one product's grant is documented for it. Nothing here is invented to fill a grid.</p>
      </div>
      <ul class="plist">
        <li><strong>A documented grant is not a measured one.</strong> The connector vaults stand at the <em>documented</em> tier: every row quotes a vendor page and names its date, nothing was tested, and the rows a page could not settle are counted on the tile as open questions. A measured row needs a system we are entitled to run, and probing somebody else's is out of bounds here with no research exemption.</li>
        <li><strong>Every deployment is a combination.</strong> An agent's own policy, plus one per connector it holds, plus the business function it serves. The templates are the building blocks; the combination — with its merged grant and a corrected mandate — is what a deployment's policy is made of, and what is sold.</li>
        <li><strong>Run something that is not here?</strong> Every vault carries <code>MAP-A-GRANT.md</code>: give it to an agent that already holds the credential and it measures its own grant and drafts the first policy. Send us what it finds; that is how a new application gets its tile.</li>
      </ul>
    </div>
  </section>

  <section class="psection" id="how">
    <div class="wrap">
      <div class="shead">
        <span class="tag">How this page reads a vault</span>
        <h2>Ciphertext in, <span class="g">decrypted here, and always the current commit.</span></h2>
        <p>The vault API answers plain cross-origin GETs with no auth header, because what it returns is ciphertext under a key the server has never held. This page derives each vault's HEAD address from its read key, fetches the ref, the commit, the tree and the blobs it needs, and decrypts them in your browser. A push to a vault is live on the next page load — no rebuild of this site.</p>
      </div>
      <ul class="plist">
        <li><strong>The viewer is the site's. The data is the vault's.</strong> Every string from a vault is rendered as text, never as markup. A vault's app runs only inside a sandboxed frame with an opaque origin, served its reads over a message channel, and never sees a key.</li>
        <li><strong>Immutable objects are cached; the ref never is.</strong> A stale ref would render an older commit from perfectly valid ciphertext and nothing would error, so the page fetches it fresh every time.</li>
        <li><strong>The read keys are printed, on purpose.</strong> Each is derived one-way from its vault's write key and cannot be turned back into it. Anyone can clone a vault with it and check what its page says against the bytes.</li>
        <li><strong>The reader is copied, not fetched.</strong> It is sgit.ai's house reader, about ninety lines, in each page's own source — the brief that documents it says to copy it rather than load it across origins at runtime.</li>
      </ul>
      <p class="src">The mechanism is written up at <a href="https://sgit.ai/docs/vault/reading-a-vault-file.html" target="_blank" rel="noopener">sgit.ai — reading one file out of a vault</a>, the rules for a site page that embeds a vault at <a href="https://sgit.ai/docs/guidance/index.html" target="_blank" rel="noopener">sgit.ai — guidance</a>.</p>
    </div>
  </section>

</div>

<section class="pcta">
  <div class="wrap">
    <span class="eyebrow"><span class="d"></span> The behaviour-policy library</span>
    <h2>Pick the policies your deployment is made of. Then correct the mandate.</h2>
    <p>Everything else in the vault is derived. The correction is the elicitation, and the corrected combination — with a name on the licence and no public key — is what is sold.</p>
    <div class="cta-row">
      <a class="btn btn-green" href="abp-vault-${on[0].slug}.html">${esc(on[0].app)} →</a>
      <a class="btn btn-ghost" href="pricing.html">What it costs</a>
    </div>
  </div>
</section>`;
}

function vaultPage(v) {
  const { vault, grant, mandate, delta } = vaultData(v.slug);
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
      <button class="btn btn-green" data-to="app">Open the vault's app ↓</button>
      <button class="btn btn-ghost" data-to="key">The read key ↓</button>
    </div>
  </div>
</main>

<div class="paper">

  <section class="psection" id="card">
    <div class="wrap">
      <div class="shead">
        <span class="tag">01 · The card</span>
        <h2>${headline}</h2>
        <p>Four counts and no score. The bar splits the excess by what stands in the way of each row: nothing, a rule in prose, a setting the agent's own account can flip, or a boundary enforced above it. Only the last is a control. ${measured} rows ${grant.rows && grant.rows.measured ? 'were observed on the thing itself' : grant.research_needed ? 'were measured; every row was read from a vendor page on a date, and the open questions are the rows a page could not settle' : 'were measured; the rest are derived, and the provenance line on every row says so'}.</p>
      </div>
      <rm-abp-card data-vault="${v.slug}"></rm-abp-card>
    </div>
  </section>

  <section class="psection alt" id="mandate">
    <div class="wrap">
      <div class="shead">
        <span class="tag">02 · The mandate</span>
        <h2>What you asked it to do, <span class="g">and what you did not.</span></h2>
        <p>Elicited, and the only authored file in the vault. This is the draft asserting a conservative mandate so that the correction goes upward: most people authorised less than they think, and never mentioned the rest.</p>
      </div>
      <rm-abp-table data-vault="${v.slug}" data-view="mandate"></rm-abp-table>
    </div>
  </section>

  <section class="psection" id="grant">
    <div class="wrap">
      <div class="shead">
        <span class="tag">02 · The grant</span>
        <h2>Everything the agent can do, <span class="g">irreversible rows first.</span></h2>
        <p>Measured from the shape, not from your account and not by you. Each row says how it is known (✓ marks a row observed on the thing itself), what stands in the way, and whether the effect can be undone. What host, tenant and world mean in this shape is stated on the vault's Grant view, because for an agent in a vendor's container the host is the container and not your machine.</p>
      </div>
      <rm-abp-table data-vault="${v.slug}" data-view="grant"></rm-abp-table>
      <rm-abp-table data-vault="${v.slug}" data-view="notreach"></rm-abp-table>
      <div class="notice">
        <strong>A control bounds a grant only if it is enforced by something the grant does not include.</strong> A setting the agent's own account could change is not a control, because the grant includes the ability to remove the bound. A boundary enforced above it is one, because it does not. ${bounded ? `${cap(W(bounded))} of the ${W(c.excess)} excess rows here sit behind a boundary; the other ${W(c.unbounded_excess)} are only asked.` : c.excess ? 'None of the excess here sits behind a boundary: every row is only asked.' : 'There is no excess in this shape to bound.'}
      </div>
    </div>
  </section>

  <section class="psection alt" id="delta">
    <div class="wrap">
      <div class="shead">
        <span class="tag">02 · The delta</span>
        <h2>What it can do <span class="g">that nobody asked for.</span></h2>
        <p>Derived from the grant and the mandate, never authored, stored with both inputs pinned. Split three ways: the part you refused, the part you never mentioned, and the part with no boundary in the way — which is the only list a real control shortens.</p>
      </div>
      <rm-abp-table data-vault="${v.slug}" data-view="delta"></rm-abp-table>
    </div>
  </section>

  <section class="psection" id="licence">
    <div class="wrap">
      <div class="shead">
        <span class="tag">02 · Licence to Operate</span>
        <h2>The organisation authorises the agent, <span class="g">for an interval, on conditions.</span></h2>
        <p>The organisation is the authority, the behaviour policy is the instrument, the agent is the licensee. A template is unsigned and unissued; a corrected vault carries a name, a date and an interval — and each condition sits next to what enforces it, so the person signing knows what they are accepting with their eyes open.</p>
      </div>
      <rm-abp-table data-vault="${v.slug}" data-view="licence"></rm-abp-table>
    </div>
  </section>

  <section class="psection alt" id="app">
    <div class="wrap">
      <div class="shead">
        <span class="tag">03 · The app</span>
        <h2>The vault's own interface, <span class="g">running here from the vault.</span></h2>
        <p>The vault carries a single self-contained page that renders itself from the files beside it, and opens on Start here: what this is, where the pieces go, what we want the agent to do beside what we do not, and three ways to hand it over. Below it is booted inside a sandboxed frame with an opaque origin and served its reads by this page over a message channel — the app never sees a key, and this page never runs the app's code in its own origin.</p>
      </div>
      <div class="cta-row ab-openrow">
        <a class="btn btn-green" href="vaults/${v.slug}/index.html" target="_blank" rel="noopener">Open the app in a new window ↗</a>
        <a class="btn btn-ghost" href="https://dev.vault.sgraph.ai/en-gb/#${v.key}:${v.vid}" target="_blank" rel="noopener">Open in the vault browser ↗</a>
      </div>
      <p class="src">On a phone, open it in its own window: the frame below is the same app, sandboxed, and small. The vault browser is the whole product — files, history and the app — and the button carries the public read key, so it opens read-only without a paste. The copy this site serves at <a href="vaults/${v.slug}/index.html">vaults/${v.slug}/index.html</a> says in its top bar which route it loaded the app by.</p>
      <rm-abp-app data-vault="${v.slug}"></rm-abp-app>
    </div>
  </section>

  <section class="psection" id="files">
    <div class="wrap">
      <div class="shead">
        <span class="tag">04 · The files</span>
        <h2>The bytes themselves, <span class="g">listed from the live tree.</span></h2>
        <p>Markdown for people, JSON for machines, the pinned vocabulary, the history, and the two files you hand the agent — <code>AGENTS.md</code> for a CLAUDE.md, a ROLE.md or a skill, and <code>SKILL.md</code> in the portable skill format. The list is the vault's; each link opens the copy this site serves.</p>
      </div>
      <rm-abp-files data-vault="${v.slug}"></rm-abp-files>
    </div>
  </section>

  <section class="psection alt" id="key">
    <div class="wrap">
      <div class="shead">
        <span class="tag">The read key</span>
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
    <h2>Run this? Correct the mandate.</h2>
    <p>Open the app above, move the rows that are wrong, and send us the export. Your vault is this one with the mandate corrected, a name on the licence, and no public key — and it recomputes when the grant moves.</p>
    <div class="cta-row">
      <a class="btn btn-green" href="vaults/${v.slug}/MANDATE.md">Read the mandate ↗</a>
      <a class="btn btn-ghost" href="agent-behaviour-policy.html">All applications</a>
    </div>
  </div>
</section>`;
}

// ----------------------------------------------------------------- write, or check
const outputs = {};
outputs['agent-behaviour-policy.html'] = cut('agent-behaviour-policy', 'RiskMandate — Agent Behaviour Policies, one vault per application',
  'A directory of behaviour-policy template vaults, one per target application, each read live in the browser from the encrypted vault with a published read key: the four counts, every row with its barrier, the vault’s own app, and the files you hand the agent.', directory());
for (const v of built) {
  outputs[`abp-vault-${v.slug}.html`] = cut(`abp-vault-${v.slug}`, `RiskMandate — the behaviour-policy vault for ${v.app}`,
    `The template Agent Behaviour Policy vault for ${v.app} (${v.shape}), rendered live from vault ${v.vid}: the card, the mandate, the grant with a barrier per row, the delta, the Licence to Operate, the vault’s own app in a sandboxed frame, the file list and the public read key.`, vaultPage(v));
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
if (!names.has('agent-behaviour-policy')) { let i = -1; pages.pages.forEach((p, k) => { if (p.group === 'The model') i = k; }); pages.pages.splice(i + 1, 0, { name: 'agent-behaviour-policy', label: 'Behaviour policies', file: 'agent-behaviour-policy.html' }); added++; }
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
