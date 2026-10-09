// build-dashboard.mjs — rebuild the review vault's dashboard from what has been drained into it.
//
//   node scripts/review/build-dashboard.mjs --vault <clone of the review vault>
//   (read-feedback.mjs runs it after every drain; then commit and push the clone)
//
// Reads <vault>/feedback/*.json (one record per message), <vault>/feedback/log.jsonl (when each arrived, why it was
// sent, its signature check) and <vault>/review-lane/browsers/*.json (the pinned keys), takes the section titles
// from site/assets/review/home-diff/diff.json, and writes into the vault:
//   index.html         the dashboard, a vault app, with the data inlined (scripts/review/dashboard/)
//   app.json           the launch file: open the dashboard when the vault opens, minimal host chrome, no grants
//   data/feedback.json the same data, for anything else that wants it
// Screenshots stay where the drain wrote them, feedback/<file>-<id>.<ext>; the page reads them through the bridge.
// Nothing here needs a key: it reads files already decrypted in the clone.

import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const arg = (f, d) => { const i = process.argv.indexOf(f); return i > 0 ? process.argv[i + 1] : d; };
const VAULT = arg('--vault', 'review-feedback');
const SRC = join(ROOT, 'scripts/review/dashboard');
const VERSIONS = [
  { version: 'v0.1.0', date: '9 October 2026', note: 'The first dashboard: overview, choices, comments with screenshots, readers, sessions replayed, events, the drain log. The family\'s layout and four themes.' }
];

const fb = join(VAULT, 'feedback');
const log = existsSync(join(fb, 'log.jsonl')) ? readFileSync(join(fb, 'log.jsonl'), 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l)) : [];
const meta = Object.fromEntries(log.map((m) => [m.file, m]));
const records = [];
for (const f of existsSync(fb) ? readdirSync(fb).filter((x) => x.endsWith('.json')) : []) {
  const id = f.replace(/\.json$/, ''), rec = JSON.parse(readFileSync(join(fb, f), 'utf8')), m = meta[id] || {};
  records.push({
    file: id, received: m.received || rec.started, send: m.send || '', seq: rec.seq || m.seq || null, sig: m.sig || (rec.from ? 'not checked' : 'unsigned'),
    browser: rec.from?.browser || null, sid: rec.sid, page: rec.page, who: rec.who || {}, answers: rec.answers || {}, comments: rec.comments || {}, mode: rec.mode,
    events: rec.events || [], shots: (rec.shots || []).map(({ data, ...s }) => s).filter((s) => s.file)
  });
}
const bdir = join(VAULT, 'review-lane/browsers'), browsers = {};
for (const f of existsSync(bdir) ? readdirSync(bdir).filter((x) => x.endsWith('.json')) : []) {
  const { sign_pub, box_pub, ...pin } = JSON.parse(readFileSync(join(bdir, f), 'utf8')); browsers[pin.browser] = pin;
}
// section titles, from the review page's own data, so the dashboard names what the reader saw
const diff = JSON.parse(readFileSync(join(ROOT, 'site/assets/review/home-diff/diff.json'), 'utf8'));
const titles = Object.fromEntries(diff.pairs.map((p) => [p.id, p.title.replace(' (new)', '') + (p.isNew ? ' (new)' : '')]));
const rv = readFileSync(join(ROOT, 'site/assets/review/review.js'), 'utf8');
const inv = [...rv.matchAll(/\['([a-z]+)', '([^']+)'\]/g)].filter((m) => !/^(side|slider|steps|B|A|same|keep|remove|change|name)$/.test(m[1]));
const data = {
  built: new Date().toISOString(), version: VERSIONS.at(-1).version, versions: VERSIONS.slice().reverse(), vault: JSON.parse(readFileSync(join(ROOT, 'site/assets/review/lane.json'), 'utf8')).vault,
  titles, order: diff.pairs.map((p) => p.id), inventory: Object.fromEntries(inv.map((m) => [m[1], m[2]])), inventoryOrder: inv.map((m) => m[1]),
  records, browsers
};

const json = JSON.stringify(data).replace(/</g, '\\u003c');
const html = readFileSync(join(SRC, 'index.src.html'), 'utf8')
  .replace('/*__THEME_JS__*/', () => readFileSync(join(SRC, 'theme.js'), 'utf8'))
  .replace('/*__THEMES_CSS__*/', () => readFileSync(join(SRC, 'themes.css'), 'utf8'))
  .replace('/*__DATA__*/{}', () => json)
  .replace('/*__APP_JS__*/', () => readFileSync(join(SRC, 'app.js'), 'utf8'))
  .replaceAll('__VERSION__', data.version);
writeFileSync(join(VAULT, 'index.html'), html);
writeFileSync(join(VAULT, 'app.json'), JSON.stringify({ entry: 'index.html', present: true, auto_open: true, title: 'Review feedback', hud: { mode: 'minimal' }, permissions: {} }) + '\n');
mkdirSync(join(VAULT, 'data'), { recursive: true });
writeFileSync(join(VAULT, 'data/feedback.json'), JSON.stringify(data, null, 1) + '\n');
console.log(`dashboard ${data.version}: ${records.length} messages, ${Object.keys(browsers).length} pinned browsers → ${join(VAULT, 'index.html')} (${Math.round(html.length / 1024)} KB)`);
