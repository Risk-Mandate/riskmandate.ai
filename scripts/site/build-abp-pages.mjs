// build-abp-pages.mjs — the behaviour-policy vault directory and one page per vault.
//
//   node scripts/site/build-abp-pages.mjs           # write site/abp-vaults.html and site/abp-vault-<slug>.html
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
  return { vault: d('vault.json'), grant: d('data/grant.json'), mandate: d('data/mandate.json'), delta: d('data/delta.json') };
};
const words = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];
const W = (n) => words[n] ?? String(n);
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// ----------------------------------------------------------------- the shared script, with the catalogue in it
const built = catalogue.vaults.filter(v => v.vid && v.key);
const VAULTS_JS = JSON.stringify(built.map(v => ({ slug: v.slug, vid: v.vid, key: v.key, title: v.title, shape: v.shape, page: `abp-vault-${v.slug}.html`, status: 'template', app: v.app })), null, 2);
const sharedWithCatalogue = shared.replace('/*__VAULTS__*/[]', VAULTS_JS).replace('/*__APP_VAULT__*/null', JSON.stringify(catalogue.app_vault ? { vault_id: catalogue.app_vault.vault_id, key: catalogue.app_vault.key, entry: catalogue.app_vault.entry || 'index.html' } : null));
if (!shared.includes('/*__VAULTS__*/[]')) { console.error('abp-vaults.js has no /*__VAULTS__*/[] marker'); process.exit(1); }

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

// ----------------------------------------------------------------- the directory
function tile(v, data) {
  const d = data?.delta.counts, g = data?.grant, m = data?.mandate;
  const live = data ? `<rm-abp-mini data-vault="${v.slug}"></rm-abp-mini>` : '';
  const counts = data ? `<span class="ab-tilecounts">${g.grant.length} it can do · ${m.want.length} wanted · ${d.excess} not · ${d.unbounded_excess} unbounded${(g.research_needed || []).length ? ` · <em>${g.research_needed.length} open questions</em>` : ''}</span>` : `<span class="ab-tilecounts">${esc(v.note || 'no grant measured or documented yet')}</span>`;
  const action = data ? `<a class="ab-plus" href="abp-vault-${v.slug}.html" aria-label="Open ${esc(v.app)}">+</a>` : `<span class="ab-plus off" aria-hidden="true">·</span>`;
  return `<article class="ab-tile ${data ? 'on' : 'off'}">
  <span class="ab-glyph ${v.family}" aria-hidden="true">${esc(v.glyph)}</span>
  <div class="ab-tilebody">
    <h3>${data ? `<a href="abp-vault-${v.slug}.html">${esc(v.app)}</a>` : esc(v.app)} ${data ? '<span class="ab-verified" title="template vault, derived from published data">✓</span>' : ''}</h3>
    <p>${esc(v.blurb)}</p>
    ${counts}${live}
  </div>
  ${action}
</article>`;
}
function directory() {
  const on = catalogue.vaults.filter(v => v.vid && v.key), asked = catalogue.asked_for || [];
  return `<div class="labstrip"><b>Behaviour-policy vaults</b> · One per target application. Every vault here is read live in your browser with a published read key. <a href="abp.html">The model</a> · <a href="lab-vault-delivered.html">How the first one was built</a></div>

<main class="phero">
  <div class="wrap">
    <span class="eyebrow"><span class="d"></span> Agent Behaviour Policies, one per application</span>
    <h1>Which agent <span class="it">do you run?</span></h1>
    <p class="sub">Pick the application closest to yours. Each is a vault: a measured grant for that application, a starting mandate written to be corrected, the delta between them, and the files you hand the agent — with its own app, its own history, and a read key you can hand to anyone who asks how you govern it. The ones below are <strong>templates</strong>: free, public, derived from published data, and never scored. Yours is one of these with the mandate corrected, a name on the licence, and no public key.</p>
    <div class="cta-row">
      <button class="btn btn-green" data-to="directory">The applications ↓</button>
      <a class="btn btn-ghost" href="abp-vault-${on[0].slug}.html">${esc(on[0].app)} →</a>
    </div>
  </div>
</main>

<div class="paper">

  <section class="psection" id="directory">
    <div class="wrap">
      <div class="shead">
        <span class="tag">Available now · ${on.length}</span>
        <h2>One vault per application. <span class="g">Derived, never authored, and the numbers are live.</span></h2>
        <p>Every tile is a deployment shape published at abp.sgit.ai and built into a vault by one command. The counts are read from the vault as you look: grant, wanted, excess, unbounded. Where a vault cannot be reached the tile says so and falls back to the copy served from this site.</p>
      </div>
      <div class="ab-grid">
${on.map(v => tile(v, vaultData(v.slug))).join('\n')}
      </div>
    </div>
  </section>

  <section class="psection alt" id="asked">
    <div class="wrap">
      <div class="shead">
        <span class="tag">Not yet researched · ${asked.length}</span>
        <h2>The next connectors, <span class="g">and what each one waits for.</span></h2>
        <p>A vault is built from a measured or documented grant, never typed. The four connector shapes <a href="lab-abp-requests.html">Lab 03</a> asked the model site for are built above, ahead of the model site, from the vendors' own pages read and quoted on a date — and each carries the questions those pages could not settle in its <code>RESEARCH-NEEDED.md</code>, written to be handed to an agent. These are the connectors whose pages have not been read yet. Nothing here is invented to fill a grid.</p>
      </div>
      <div class="ab-grid">
${asked.map(v => tile(v, null)).join('\n')}
      </div>
      <ul class="plist">
        <li><strong>Mandates are per application, not per agent — to begin with.</strong> The mandate in a template is really the mandate for a resource: a repository attached to a coding agent, a mailbox connected to an assistant. That is what makes the library reusable, and why the directory is organised by application rather than by model.</li>
        <li><strong>A documented grant is not a measured one.</strong> The connector vaults stand at the <em>documented</em> tier: every row quotes a vendor page and names its date, nothing was tested, and the rows a page could not settle are counted on the tile as open questions. A measured row needs a system we are entitled to run, and probing somebody else's is out of bounds here with no research exemption.</li>
        <li><strong>Run something that is not here?</strong> The generator takes a grant and a mandate and does the rest. Ask the agent to check its own grant with the block at the end of any GRANT.md, and send us what it finds: that is how a new application gets its row.</li>
      </ul>
    </div>
  </section>

  <section class="psection" id="ladder">
    <div class="wrap">
      <div class="shead">
        <span class="tag">From simple to complete</span>
        <h2>The same vault, <span class="g">at four altitudes.</span></h2>
        <p>Not every reader needs the tables. Each vault renders the same files at four levels of detail, and every level is derived from the same bytes — so the tile above and the row in an underwriter's spreadsheet cannot disagree.</p>
      </div>
      <div class="ab-ladder">
        <div class="ab-rung"><span class="n">01 · THE CARD</span><h3>Four counts, no score</h3><p>Grant, wanted, excess, unbounded — and the excess split by barrier. The shape of the Index card on the home page, with the one number that is not allowed removed.</p></div>
        <div class="ab-rung"><span class="n">02 · THE TABLES</span><h3>Every row, with its barrier</h3><p>The grant irreversible-first, the delta in its three lists, the licence's conditions next to what enforces each. On each vault's page, rendered live.</p></div>
        <div class="ab-rung"><span class="n">03 · THE APP</span><h3>The vault's own interface</h3><p>Opens on Start here: what this is, where the pieces go, what we want the agent to do beside what we do not, and three ways to hand it over — copy-and-paste, a zip, a PDF. Embedded on each vault's page in a sandboxed frame.</p></div>
        <div class="ab-rung"><span class="n">04 · THE FILES</span><h3>The bytes themselves</h3><p>Markdown for people, JSON for machines, the pinned vocabulary, the history, and the two files you hand the agent. Cloned with one command from the read key.</p></div>
      </div>
    </div>
  </section>

  <section class="psection alt" id="how">
    <div class="wrap">
      <div class="shead">
        <span class="tag">How this page reads a vault</span>
        <h2>Ciphertext in, <span class="g">decrypted here, and always the current commit.</span></h2>
        <p>The vault API answers plain cross-origin GETs with no auth header, because what it returns is ciphertext under a key the server has never held. This page derives each vault's HEAD address from its read key, fetches the ref, the commit, the trees and the blobs it needs, and decrypts them in your browser. A push to a vault is live on the next page load — no rebuild of this site, no redeploy.</p>
      </div>
      <ul class="plist">
        <li><strong>The viewer is the site's. The data is the vault's.</strong> Every string from a vault is rendered as text, never as markup. A vault's app runs only inside a sandboxed frame with an opaque origin, served its reads over a message channel. A vault can change what is shown; it can never change what the page does.</li>
        <li><strong>Immutable objects are cached; the ref never is.</strong> A stale ref would render an older commit from perfectly valid ciphertext and nothing would error, so the page fetches it fresh every time.</li>
        <li><strong>The read keys are printed, on purpose.</strong> Each is derived one-way from its vault's write key and cannot be turned back into it. Anyone can clone a vault with it and check what its page says against what is there. No write credential is anywhere in this site, and a test fails the build if one lands.</li>
        <li><strong>The reader is copied, not fetched.</strong> It is sgit.ai's house reader, about ninety lines, in each page's own source — the brief that documents it says to copy it rather than load it across origins at runtime.</li>
      </ul>
      <p class="src">The mechanism is written up at <a href="https://sgit.ai/docs/vault/reading-a-vault-file.html" target="_blank" rel="noopener">sgit.ai — reading one file out of a vault</a>, the rules for a site page at <a href="https://sgit.ai/docs/briefs/sgit-ai-site-pages.html" target="_blank" rel="noopener">reading a vault from a site page</a>. The template, the generator and the catalogue behind every vault here are in this site's repository; <a href="lab-vault-delivered.html">Lab 07</a> is the record of the first one.</p>
    </div>
  </section>

</div>

<section class="pcta">
  <div class="wrap">
    <span class="eyebrow"><span class="d"></span> Behaviour-policy vaults</span>
    <h2>Pick the application closest to yours. Then correct the mandate.</h2>
    <p>Everything else in the vault is derived. The correction is the elicitation, and the corrected vault — with a name on the licence and no public key — is what is sold.</p>
    <div class="cta-row">
      <a class="btn btn-green" href="abp-vault-${on[0].slug}.html">${esc(on[0].app)} →</a>
      <a class="btn btn-ghost" href="pricing.html">What it costs</a>
    </div>
  </div>
</section>`;
}

// ----------------------------------------------------------------- one vault page
function vaultPage(v) {
  const { vault, grant, mandate, delta } = vaultData(v.slug);
  const c = delta.counts, n = grant.grant.length, wanted = mandate.want.length;
  const measured = vault.measured_rows || `${grant.rows.measured} of ${grant.rows.total}`;
  const bounded = c.excess - c.unbounded_excess;
  const headline = c.excess === 0
    ? `${cap(W(n))} it can do. ${cap(W(wanted))} you asked for. <span class="g">Nothing left over.</span>`
    : `${cap(W(n))} it can do. ${cap(W(wanted))} you asked for. <span class="g">${cap(W(c.unbounded_excess))} nothing bounds.</span>`;
  return `<div class="labstrip"><b>Behaviour-policy vault</b> · <span class="state proposal">Template</span> · Read live from vault <b>${esc(v.vid)}</b> with the key printed on this page. <a href="abp-vaults.html">All applications</a> · <a href="lab-vault-delivered.html">How the first one was built</a></div>

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
      <rm-abp-app data-vault="${v.slug}"></rm-abp-app>
      <p class="src">Prefer the whole product? <a href="https://dev.vault.sgraph.ai/en-gb/" target="_blank" rel="noopener">Open the vault browser</a> and paste the read key from the next section; it opens read-only with the files, the history and the app. A static copy of the app is also served from this site at <a href="vaults/${v.slug}/index.html">vaults/${v.slug}/index.html</a>, and says so in its top bar.</p>
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
      <a class="btn btn-ghost" href="abp-vaults.html">All applications</a>
    </div>
  </div>
</section>`;
}

// ----------------------------------------------------------------- write, or check
const outputs = {};
outputs['abp-vaults.html'] = cut('abp-vaults', 'RiskMandate — Agent Behaviour Policies, one vault per application',
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
// pages.json: the directory listed under Live demos, every vault page unlisted
const pagesPath = join(SITE, 'pages.json');
const pages = JSON.parse(readFileSync(pagesPath, 'utf8'));
const names = new Set(pages.pages.map(p => p.name));
let added = 0;
if (!names.has('abp-vaults')) { const i = pages.pages.findIndex(p => p.name === 'demo-agent-permission-games') + 1; pages.pages.splice(i, 0, { name: 'abp-vaults', label: 'Behaviour-policy vaults', file: 'abp-vaults.html', group: 'Live demos' }); added++; }
for (const v of built) {
  const name = `abp-vault-${v.slug}`;
  if (!names.has(name)) { const i = pages.pages.findIndex(p => p.name === 'abp-vaults') + 1; pages.pages.splice(i, 0, { name, file: `${name}.html`, label: `Vault · ${v.app}`, unlisted: true }); added++; }
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
