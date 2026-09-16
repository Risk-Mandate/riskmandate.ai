// The admin console under site/admin/ — written by scripts/site/build-admin.mjs, never by hand.
// It is not in pages.json (it is public but not advertised), so the checks in test_pages.mjs
// that walk the published site do not see it. These do.
//
// Run: node --test tests/site/*.mjs
import { test }                                  from 'node:test';
import assert                                    from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, dirname, resolve }                from 'node:path';
import { fileURLToPath }                         from 'node:url';

const ROOT  = join(dirname(fileURLToPath(import.meta.url)), '../..');
const SITE  = join(ROOT, 'site');
const ADMIN = join(SITE, 'admin');
const walk  = (dir, re) => readdirSync(dir, { recursive: true }).map(String).filter(f => re.test(f)).map(f => join(dir, f));
const pages = walk(ADMIN, /\.html$/);
const read  = (p) => readFileSync(p, 'utf8');
const docs  = walk(join(ROOT, 'docs'), /\.md$/).map(p => p.slice(ROOT.length + 1).split('\\').join('/'));

test('the console exists and has its front page, its stylesheet and a page per section', () => {
  for (const f of ['index.html', 'console.css', 'work/index.html', 'memos/index.html', 'briefs/index.html', 'agents/index.html', 'vaults/index.html', 'records/index.html', 'tooling/index.html']) {
    assert.ok(existsSync(join(ADMIN, f)), `site/admin/${f} is missing — run node scripts/site/build-admin.mjs`);
  }
});

test('every document under docs/ has a console page, so nothing decided is unreachable from the site', () => {
  // docs/ is not served. The console renders each file as a page; a brief added without
  // rerunning the build fails here, and build-admin.mjs --check fails in CI for the same reason.
  const missing = docs.filter(d => {
    const rel = d.replace(/^docs\/briefs\//, '').replace(/^docs\//, '').replace(/\.md$/, '').replace(/\//g, '--');
    return !existsSync(join(ADMIN, 'briefs', rel, 'index.html'));
  });
  assert.deepEqual(missing, [], 'these documents have no console page');
});

test('every console page is noindex, links its markdown twin, carries the rail and the strip', () => {
  for (const f of pages) {
    const s = read(f);
    assert.match(s, /<meta name="robots" content="noindex,follow">/, `${f} is not noindex`);
    assert.match(s, /<link rel="alternate" type="text\/markdown" href="index\.md"/, `${f} does not link its twin`);
    assert.ok(existsSync(join(dirname(f), 'index.md')), `${f} has no index.md beside it`);
    assert.match(s, /<nav class="rail"/, `${f} has no rail`);
    assert.match(s, /class="c-strip"/, `${f} has no strip`);
    assert.match(s, /<\/html>\s*$/, `${f} does not end the document`);
  }
});

test('every internal link on the console resolves — to a file, or to a folder with an index', () => {
  const misses = [];
  for (const f of pages) {
    for (const [, href] of read(f).matchAll(/href="([^"#:][^":]*)"/g)) {
      const target = href.split('#')[0].split('?')[0];
      if (!target) continue;
      let p = resolve(dirname(f), target);
      if (!p.startsWith(SITE)) { misses.push(`${f} → ${href} (leaves site/)`); continue; }
      if (existsSync(p) && statSync(p).isDirectory()) p = join(p, 'index.html');
      if (!existsSync(p)) misses.push(`${f.slice(SITE.length + 1)} → ${href}`);
    }
  }
  assert.deepEqual(misses, []);
});

test('the console is public but not advertised: not in the sitemap, not in llms.txt, not in the 404 list', () => {
  for (const [file, what] of [['sitemap.xml', 'the sitemap'], ['llms.txt', 'llms.txt'], ['llms-full.txt', 'llms-full.txt'], ['404.html', 'the 404 list']]) {
    assert.doesNotMatch(readFileSync(join(SITE, file), 'utf8'), /riskmandate\.ai\/admin\/|href="\/admin\//, `${what} advertises the console`);
  }
});

test('no write credential ships in the console either', () => {
  const banned = [/access[-_]?token/i, /passphrase/i, /BEGIN [A-Z ]*PRIVATE KEY/, /sgit_write/i, /sgit_private_vault/i, /vault[-_]?key/i];
  for (const f of [...pages, ...walk(ADMIN, /\.md$/)]) {
    const s = read(f);
    for (const re of banned) assert.doesNotMatch(s, re, `${f.slice(SITE.length + 1)} contains something matching ${re}`);
  }
});

test('every footer that links Versions links the console, and the old address redirects to it', () => {
  const stub = read(join(SITE, 'admin.html'));
  assert.match(stub, /<meta http-equiv="refresh" content="0; url=admin\/">/, 'admin.html is not a redirect to admin/');
  for (const f of readdirSync(SITE).filter(f => f.endsWith('.html'))) {
    const s = read(join(SITE, f));
    if (!/class="footlink" href="versions\.html"/.test(s)) continue;
    assert.match(s, /class="footlink" href="admin\/"/, `${f} links Versions in its footer but not the console`);
  }
});
