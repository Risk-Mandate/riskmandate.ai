// Structural checks on site/ — the tree that is deployed, unchanged, to Pages.
// These are the invariants that stopped being enforced by a build when v1.0.0
// removed the build: nothing generates these pages now, so something has to
// notice when one of them drifts.
//
// Run: node --test tests/site/*.mjs
import { test }                                  from 'node:test';
import assert                                    from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname }                         from 'node:path';
import { fileURLToPath }                         from 'node:url';

const SITE  = join(dirname(fileURLToPath(import.meta.url)), '../../site');
const read  = (f) => readFileSync(join(SITE, f), 'utf8');
const html  = readdirSync(SITE).filter(f => f.endsWith('.html'));
const pages = html.filter(f => f !== '404.html');
const index = JSON.parse(read('versions/index.json'));

test('every page is a whole document, not a fragment loaded into a frame', () => {
  for (const f of pages) {
    const s = read(f);
    assert.match(s, /^<!doctype html>/i,           `${f} has no doctype`);
    assert.match(s, /<title>[^<]+<\/title>/,       `${f} has no title`);
    assert.match(s, /<meta name="description"/,    `${f} has no description`);
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

test('every internal link resolves to a file that exists', () => {
  const misses = [];
  for (const f of html) {
    for (const [, href] of read(f).matchAll(/href="([^"#:][^":]*)"/g)) {
      if (!existsSync(join(SITE, href))) misses.push(`${f} → ${href}`);
    }
  }
  assert.deepEqual(misses, []);
});

test('every page carries a canonical URL, a markdown twin, and the twin exists', () => {
  for (const f of pages) {
    const s    = read(f);
    const twin = f.replace(/\.html$/, '.md');
    assert.match(s, /<link rel="canonical" href="https:\/\/riskmandate\.ai\//, `${f} has no canonical URL`);
    assert.match(s, new RegExp(`<link rel="alternate" type="text/markdown" href="${twin}"`), `${f} does not link its twin`);
    assert.ok(existsSync(join(SITE, twin)), `${twin} is missing`);
  }
});

test('every page shows the current version and links it to the record', () => {
  for (const f of [...pages, 'scenarios/index.html']) {
    assert.match(read(f), new RegExp(`<a class="version" href="/?versions\\.html"[^>]*>v${index.latest}</a>`),
                 `${f} does not show v${index.latest}`);
  }
});

test('the pages, the record and the tag file name the same version', () => {
  const tag = readFileSync(join(SITE, '../riskmandate_ai/version'), 'utf8').trim();
  assert.equal(tag, `v${index.latest}`, 'riskmandate_ai/version disagrees with versions/index.json');
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

test('the sitemap lists every page and nothing that is not one', () => {
  const listed = [...read('sitemap.xml').matchAll(/<loc>https:\/\/riskmandate\.ai\/([^<]*)<\/loc>/g)]
    .map(m => m[1] || 'index.html');
  assert.deepEqual([...listed].sort(), [...pages].sort());
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
