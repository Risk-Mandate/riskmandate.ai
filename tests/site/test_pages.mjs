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
const listed = JSON.parse(read('pages.json')).pages;

// `private` pages are working pages for us: no markdown twin, nothing that
// advertises them. They are still real pages and still have to hold together,
// so every other check below applies to them.
const secret = new Set(listed.filter(p => p.private).map(p => p.file));
const pages  = html.filter(f => f !== '404.html');
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
      const [path, anchor] = href.split('#');
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
