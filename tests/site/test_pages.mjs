// Structural checks on site/ — the tree that is deployed, unchanged, to Pages.
// These are the invariants that stopped being enforced by a build when v1.0.0
// removed the build: nothing generates these pages now, so something has to
// notice when one of them drifts.
//
// Run: node --test tests/site/*.mjs
import { test }                                  from 'node:test';
import assert                                    from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { createHash }                                from 'node:crypto';
import { join, dirname }                         from 'node:path';
import { fileURLToPath }                         from 'node:url';

const SITE  = join(dirname(fileURLToPath(import.meta.url)), '../../site');
const read  = (f) => readFileSync(join(SITE, f), 'utf8');
const html  = readdirSync(SITE).filter(f => f.endsWith('.html'));
const index = JSON.parse(read('versions/index.json'));
const listed = JSON.parse(read('pages.json')).pages.filter(p => !p.link);   // a `link` entry is a menu entry to a folder, not a page

// `private` pages are working pages for us: no markdown twin, nothing that
// advertises them. They are still real pages and still have to hold together,
// so every other check below applies to them.
const secret = new Set(listed.filter(p => p.private).map(p => p.file));
// a redirect stub (a renamed page's old address) carries no menu and no chrome, on purpose
const isStub = (f) => /<meta http-equiv="refresh"/i.test(readFileSync(join(SITE, f), 'utf8'));
const pages  = html.filter(f => f !== '404.html' && !isStub(f));
const pub    = pages.filter(f => !secret.has(f));

test('every page is a whole document, not a fragment loaded into a frame', () => {
  for (const f of pages) {
    const s = read(f);
    assert.match(s, /^<!doctype html>/i,           `${f} has no doctype`);
    assert.match(s, /<title>[^<]+<\/title>/,       `${f} has no title`);
    assert.match(s, /<meta name="description"/,    `${f} has no description`);
  }
});

test('every page ends once — nothing trails the document close', () => {
  // The scaffolder used to copy the donor page's own closing sequence in with
  // its last JS module, so pages shipped with two </html> and a stray `})();`
  // between them. Text after </html> is not ignored: the parser reparents it
  // into <body>, which put a line of JavaScript at the foot of nine pages.
  for (const f of pages) {
    const s = read(f);
    assert.equal(s.split('</html>').length - 1, 1, `${f} closes the document more than once`);
    assert.match(s, /<\/html>\s*$/,                `${f} has content after </html>`);
  }
});

test('the host frame is gone — no page talks to a parent window', () => {
  const banned = [/data-nav="/, /data-back[\s>]/, /<rm-version-switcher/, /type:\s*'rm-nav'/, /type:\s*'rm-back'/,
                  /postMessage\(\s*\{\s*type:\s*'rm-/, /<iframe id="stage"/];
  for (const f of html) {
    const s = read(f);
    for (const re of banned) assert.doesNotMatch(s, re, `${f} still uses ${re}`);
  }
});

test('every internal link resolves — the file, and the anchor if it names one', () => {
  const misses = [];
  const ids    = new Map();   // file → the ids it defines
  const idsOf  = (f) => {
    if (!ids.has(f)) ids.set(f, new Set([...read(f).matchAll(/\sid="([^"]+)"/g)].map(m => m[1])));
    return ids.get(f);
  };
  for (const f of html) {
    for (const [, href] of read(f).matchAll(/href="([^"#:][^":]*)"/g)) {
      const [target, anchor] = href.split('#');
      const path = target.split('?')[0];   // a query string (the after-payment pages read ?order= and ?shape=) is not part of the file
      if (!existsSync(join(SITE, path))) { misses.push(`${f} → ${href} (no such file)`); continue; }
      // an anchor into another page only works if that page defines the id
      if (anchor && path.endsWith('.html') && !idsOf(path).has(anchor)) {
        misses.push(`${f} → ${href} (${path} has no id="${anchor}")`);
      }
    }
  }
  assert.deepEqual(misses, []);
});

test('every published page carries a canonical URL and a markdown twin', () => {
  for (const f of pub) {
    const s    = read(f);
    const twin = f.replace(/\.html$/, '.md');
    assert.match(s, /<link rel="canonical" href="https:\/\/riskmandate\.ai\//, `${f} has no canonical URL`);
    assert.match(s, new RegExp(`<link rel="alternate" type="text/markdown" href="${twin}"`), `${f} does not link its twin`);
    assert.ok(existsSync(join(SITE, twin)), `${twin} is missing`);
  }
});

test('a private page is marked noindex, has no twin, and is disallowed in robots', () => {
  const robots = read('robots.txt');
  for (const f of secret) {
    assert.match(read(f), /<meta name="robots" content="noindex,nofollow">/, `${f} is not noindex`);
    assert.ok(!existsSync(join(SITE, f.replace(/\.html$/, '.md'))), `${f} should have no markdown twin`);
    assert.match(robots, new RegExp(`^Disallow: /${f.replace('.', '\\.')}$`, 'm'), `robots.txt does not disallow ${f}`);
    assert.doesNotMatch(read('llms.txt'), new RegExp(f.replace('.', '\\.')), `llms.txt names ${f}`);
  }
});

test('every page shows the current version and links it to the record', () => {
  for (const f of [...pages, 'scenarios/index.html']) {
    assert.match(read(f), new RegExp(`<a class="version" href="/?versions\\.html"[^>]*>v${index.latest}</a>`),
                 `${f} does not show v${index.latest}`);
  }
});

test('every place that names a version names the same one', () => {
  const at  = (p) => readFileSync(join(SITE, '..', p), 'utf8');
  const tag = at('riskmandate_ai/version').trim();
  const pkg = at('pyproject.toml').match(/^version\s*=\s*"(v[\d.]+)"/m)?.[1];
  assert.equal(tag, `v${index.latest}`, 'riskmandate_ai/version disagrees with versions/index.json');
  assert.equal(pkg, `v${index.latest}`, 'pyproject.toml disagrees with versions/index.json');
});

test('the menu is the same list on every page, and every entry is a real page', () => {
  const menus = new Set();
  for (const f of pages) {
    const m = read(f).match(/RM\.data\.pages=(\[[\s\S]*?\]);/);
    assert.ok(m, `${f} has no page list`);
    menus.add(m[1]);
    for (const p of JSON.parse(m[1])) {
      assert.ok(existsSync(join(SITE, p.file)), `${f} menu points at missing ${p.file}`);
    }
  }
  assert.equal(menus.size, 1, 'pages disagree about the menu');
});

test('the version record: newest first, every entry has its notes file', () => {
  assert.equal(index.releases[0].version, index.latest, 'index.latest is not the first release');
  for (const r of index.releases) {
    assert.ok(existsSync(join(SITE, 'versions', r.file)), `versions/${r.file} is missing`);
    assert.ok(r.source, `v${r.version} does not name what it was built from`);
  }
});

test('releases carried over from the vault are labelled reconstructed', () => {
  for (const r of index.releases.filter(r => r.source.startsWith('sgit://7rfetjwz/'))) {
    assert.equal(r.reconstructed, true, `v${r.version} came from the vault but is not labelled`);
  }
});

test('the sitemap lists every published page and nothing that is not one', () => {
  const inMap = [...read('sitemap.xml').matchAll(/<loc>https:\/\/riskmandate\.ai\/([^<]*)<\/loc>/g)]
    .map(m => m[1] || 'index.html');
  assert.deepEqual(inMap.sort(), [...pub].sort());
});

test('pages.json accounts for every page in site/, and vice versa', () => {
  assert.deepEqual(listed.map(p => p.file).sort(), [...pages].sort());
});

test('every Lab edition exists, matches its digest, and is listed on its page', () => {
  // The editions are the point of the Lab: a page holds current thinking and
  // changes, and the dated PDFs are what survives that. A register entry
  // pointing at a missing or altered file would break the only promise these
  // artefacts make.
  const reg = JSON.parse(read('lab-editions.json')).entries;
  assert.ok(reg.length, 'no Lab editions recorded');
  for (const entry of reg) {
    assert.ok(existsSync(join(SITE, entry.file)), `${entry.file} is in the edition register and not in site/`);
    const page = read(entry.file);
    let last = 0;
    for (const ed of entry.editions) {
      const path = join(SITE, ed.file);
      assert.ok(existsSync(path), `${ed.file} is registered and not on disk`);
      assert.equal(createHash('sha256').update(readFileSync(path)).digest('hex'), ed.sha256,
                   `${ed.file} does not match its recorded digest`);
      assert.equal(ed.v, last + 1, `${entry.slug} edition numbers are not consecutive`);
      last = ed.v;
      assert.match(page, new RegExp(ed.file.replace(/[.+]/g, '\\$&')),
                   `${entry.file} does not link its own edition ${ed.file}`);
    }
  }
});

test('the brief register accounts for every archived document, by digest', () => {
  // The register's whole value is that somebody else can check it: an agent that
  // produced a brief hashes its copy and looks for the digest. A register entry
  // pointing at a missing or altered file, or a file sitting in assets/briefs/
  // that no entry mentions, is the one failure that would make it worthless.
  //
  // (The 64-hex strings on briefs.html are these digests, not read keys — which
  // is why the read-key test below is scoped to the Lab pages.)
  const reg  = JSON.parse(read('briefs-register.json'));
  const page = read('briefs.html');
  assert.ok(reg.documents.length, 'no documents recorded');

  const listedFiles = new Set();
  for (const d of reg.documents) {
    const path = join(SITE, d.file);
    assert.ok(existsSync(path), `${d.id} names ${d.file}, which is not in site/`);
    const bytes = readFileSync(path);
    assert.equal(createHash('sha256').update(bytes).digest('hex'), d.sha256,
                 `${d.id} does not match its recorded digest — the archived copy has changed`);
    assert.equal(bytes.length, d.bytes, `${d.id} does not match its recorded size`);
    assert.ok(reg.statuses[d.status], `${d.id} has status "${d.status}", which is not defined`);
    assert.ok(d.received?.length, `${d.id} does not say when it arrived`);
    assert.match(page, new RegExp(d.sha256), `briefs.html does not show ${d.id}'s digest`);
    // A processed document must name something that exists; a received one must not.
    for (const p of d.produced) {
      if (/^https?:/.test(p.url)) continue;
      assert.ok(existsSync(join(SITE, p.url.split('#')[0])), `${d.id} claims ${p.url}, which does not exist`);
    }
    if (d.status === 'received') assert.equal(d.produced.length, 0,
      `${d.id} is marked received and names outputs — it is processed or partly`);
    if (d.status === 'processed') assert.ok(d.produced.length,
      `${d.id} is marked processed and names no output`);
    listedFiles.add(d.file);
  }

  // Nothing may sit in the archive unaccounted for.
  for (const f of readdirSync(join(SITE, 'assets/briefs'))) {
    assert.ok(listedFiles.has(`assets/briefs/${f}`),
              `assets/briefs/${f} is archived and not in the register`);
  }
});

test('a Lab mockup never carries a real read key', () => {
  // A mockup that needed a key once got filled in with a real published one —
  // the Licence to Operate vault's — paired with an invented vault id. Public
  // or not, sample data must be obviously sample data, so key-shaped strings
  // are allowed only on the pages that genuinely open a vault.
  const keyish = /\b[0-9a-f]{64}\b/;
  for (const f of pages.filter(f => f.startsWith('lab'))) {
    assert.doesNotMatch(read(f), keyish, `${f} contains something shaped like a read key`);
  }
});

test('no write credential ships in the deployed tree', () => {
  // Demo read keys are public by design and are meant to be here. A write token,
  // passphrase or private key is not — the vault embedded one at
  // .vault/access-token.json, and nothing from there may reach site/.
  const banned = [/access[-_]?token/i, /passphrase/i, /BEGIN [A-Z ]*PRIVATE KEY/, /sgit_write/i, /vault[-_]?key/i];
  for (const f of [...html, ...readdirSync(SITE).filter(f => f.endsWith('.txt') || f.endsWith('.json'))]) {
    const s = read(f);
    for (const re of banned) assert.doesNotMatch(s, re, `${f} contains something matching ${re}`);
  }
});

test('every footer that links Versions also links Admin', () => {
  // The admin section is meant to be visible from every page, not found. The two
  // links sit together in the footer; a page scaffolded from an older donor would
  // carry one without the other.
  for (const f of pages) {
    const s = read(f);
    if (!/class="footlink" href="versions\.html"/.test(s)) continue;
    assert.match(s, /class="footlink" href="admin\/"/, `${f} links Versions in its footer but not Admin`);
  }
});

test('the home page counts come from the vault, and the shape count from the catalogue', () => {
  // The hero once carried an invented company and a score. It now carries a real
  // template policy, which is only worth more than the invention if the numbers on
  // it are the vault's own. Both halves are checked: the four counts against the
  // delta the generator wrote, and the number of published shapes against the
  // catalogue — the design this page was built from said "fifteen" and the
  // sixteenth vault had already shipped.
  const home = read('index.html');
  const c    = JSON.parse(read('vaults/claude-code-web/data/delta.json')).counts;
  const n    = JSON.parse(read('vaults/index.json')).vaults.length;

  const hero = home.match(/<div class="counts">[\s\S]*?<p class="hcap">[\s\S]*?<\/p>/)?.[0];
  assert.ok(hero, 'the home page has no hero counts block');
  const shown = [...hero.matchAll(/<b class="cn[^"]*">(\d+)<\/b>/g)].map((m) => Number(m[1]));
  assert.deepEqual(shown,
    [c.aligned + c.excess, c.aligned + c.shortfall, c.excess, c.unbounded_excess],
    'the hero counts are not reach, mandate, gap and unbounded gap from the vault');
  assert.match(hero, /Claude Code on the web/, 'the counts do not name the policy they came from');

  // the count of published shapes, in digits and in words, wherever the page states it
  const words = { 15: 'fifteen', 16: 'sixteen', 17: 'seventeen' }[n];
  assert.ok(words, `no word for ${n} shapes — extend this test`);
  assert.match(home, new RegExp(`${n} templates, published free`),
    `the home page does not say there are ${n} templates`);
  for (const m of home.matchAll(/\b(fifteen|sixteen|seventeen)\b/gi))
    assert.equal(m[1].toLowerCase(), words,
      `the home page says "${m[1]}" where the catalogue has ${n} vaults`);

  assert.match(home, /abp-vault-claude-code-web\.html/, 'the hero does not link the policy it reports');
  assert.doesNotMatch(hero, /\d+\s*(?:\/|out of)\s*100|\bL[1-6]\b|\b(?:rated|scored)\b/i,
    'a behaviour policy carries no score');
});

test('every inline script parses — a page that throws on load is a broken page', () => {
  // A page here is one self-contained file, so a stray brace in one of them takes
  // the menu, the drawer and every component on that page down with it and nothing
  // else notices: the HTML still renders, the tests still pass, and the only signal
  // is an error in a console nobody is looking at. Two pages shipped that way before
  // this existed, and a synthetic-user run driving a real browser is what caught it.
  // Anchor to a real tag: several pages carry the literal string '<script>' inside
  // their own JavaScript, and a naive indexOf starts reading from the middle of it.
  for (const f of pages) {
    const s = read(f);
    for (const m of s.matchAll(/^[ \t]*<script>$/gm)) {
      const a = m.index + m[0].length;
      const b = s.indexOf('</script>', a);            // in-source ones are escaped <\/script>
      assert.doesNotThrow(() => new Function(s.slice(a, b)),
        `${f} has an inline script that does not parse`);
    }
  }
});

test('a behaviour-policy vault page names the level and never the price, and its buy link is one the store serves', () => {
  // The store owns the cart, the order and every price (its boundary, 16 September); this site
  // owns the shapes, the policies and the vaults. A vault page shipped "from £10" on its buy
  // button for four releases after that line was drawn, and every price the store moved would
  // have had to be chased across sixteen generated pages. Naming the level instead is what the
  // boundary asks for, and this is the check that keeps it true.
  const catalogue = JSON.parse(read('vaults/index.json'));
  const byPage = new Map(catalogue.vaults.map(v => [`abp-vault-${v.slug}.html`, v]));
  for (const [file, v] of byPage) {
    if (!existsSync(join(SITE, file))) continue;
    const s = read(file);
    assert.doesNotMatch(s, /£\s?\d/, `${file} carries a price — the store owns those`);
    // and the buy link must be a store address this site has reason to believe resolves:
    // the per-shape page, or the store's list of shapes while it has not built one yet.
    const expected = v.store_page === false
      ? 'https://store.sgit.ai/policies/'
      : `https://store.sgit.ai/p/${v.slug}/`;
    for (const [, href] of s.matchAll(/href="(https:\/\/store\.sgit\.ai\/[^"]*)"/g)) {
      assert.equal(href, expected, `${file} links ${href}; the catalogue says it should link ${expected}`);
    }
  }
});
