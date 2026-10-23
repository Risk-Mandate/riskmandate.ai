// build.mjs — build the LinkedIn desk, site/linkedin.html, from scripts/linkedin/items.mjs.
//
//   node scripts/linkedin/build.mjs            write site/assets/linkedin/items.json and rebuild the page
//   node scripts/linkedin/build.mjs --check    fail if the page or its data is stale, or a picture is missing
//   node scripts/linkedin/build.mjs --todo     list the site's articles that have no LinkedIn item yet
//
// The desk is a private working page: the order to publish in on the left, the selected item on the right, with
// buttons that copy it the way LinkedIn takes it (rich text with its pictures for an article, plain text for a
// post, field by field for a profile) and the HTML itself. The page reads site/assets/linkedin/items.json; this
// script writes that file from items.mjs and assembles the page from the pricing page's chrome with
// scripts/review/flat-page.py. Pictures come from capture.mjs.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { ITEMS, PAGE } from './items.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const CHECK = process.argv.includes('--check'), TODO = process.argv.includes('--todo');
const pages = JSON.parse(readFileSync(join(ROOT, 'site/pages.json'), 'utf8'));
const allPages = (pages.pages || pages).flatMap((p) => p.children ? p.children : [p]);

// the site's articles that no LinkedIn item covers yet: an item covers a page when it links it or retells it
function todo() {
  const seen = JSON.stringify(ITEMS);
  return allPages.filter((p) => /^article-/.test(p.name || '') && !p.private && !seen.includes(p.file)).map((p) => ({ file: p.file, label: p.label }));
}
if (TODO) { const t = todo(); console.log(t.length ? t.map((x) => `${x.file}  ${x.label}`).join('\n') : 'every article has a LinkedIn item'); process.exit(0); }

const plain = (h) => h.replace(/<li>/g, '\n• ').replace(/<\/(p|h2|h3|blockquote|ol|ul)>/g, '\n\n').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/\n{3,}/g, '\n\n').trim();
const missing = [];
const data = {
  type: 'riskmandate/linkedin-desk/v1', page: PAGE,
  note: 'Generated from scripts/linkedin/items.mjs by scripts/linkedin/build.mjs. Edit the items, not this file.',
  items: ITEMS.map((it) => {
    const imgs = [...(it.cover ? [{ file: `${it.id}-cover.jpg`, alt: `Cover: ${it.cover.title}`, cover: true }] : []), ...(it.shots || []).map((s) => ({ file: s.file, alt: s.alt, from: s.url.replace('http://localhost:8414/', 'https://riskmandate.ai/') }))];
    imgs.forEach((i) => { if (!existsSync(join(ROOT, 'site/assets/linkedin', i.file))) missing.push(i.file); });
    return { ...it, shots: undefined, images: imgs, chars: it.text ? it.text.length : it.html ? plain(it.html).length : null, words: it.html ? plain(it.html).split(/\s+/).length : null };
  }),
  todo: todo(),
};
const json = JSON.stringify(data, null, 1) + '\n';
const jf = join(ROOT, 'site/assets/linkedin/items.json');
if (missing.length) { console.error(`pictures missing (run scripts/linkedin/capture.mjs): ${missing.join(', ')}`); process.exit(1); }
if (CHECK) {
  const cur = existsSync(jf) ? readFileSync(jf, 'utf8') : '';
  if (cur !== json) { console.error('site/assets/linkedin/items.json is stale: run node scripts/linkedin/build.mjs'); process.exit(1); }
  console.log(`linkedin desk: ${ITEMS.length} items, current`); process.exit(0);
}
writeFileSync(jf, json);
execFileSync('python3', [join(ROOT, 'scripts/review/flat-page.py'), join(ROOT, 'scripts/linkedin/desk/page.json')], { cwd: ROOT, stdio: 'inherit' });
console.log(`linkedin desk: ${ITEMS.length} items, ${data.todo.length} site articles not yet on LinkedIn`);
