// capture-home-diff.mjs — screenshots of the current home page and the proposed one, section by section,
// with the boxes that changed worked out from the page text, for site/home-diff.html.
//
//   (cd site && python3 -m http.server 8414 &)   then   node scripts/review/capture-home-diff.mjs [--base http://localhost:8414]
//
// For each pair of sections it takes an element screenshot of the same section on both pages at the same
// width, pads the shorter one so the two are the same size (the slider and the four-step view need that),
// and records every piece of text that is on one side and not the other, with its box. The review page
// draws its highlights and arrows from those boxes, so what is marked as changed is what changed, not a
// guess. Animations are switched off for the capture, so two runs give the same pictures.
//
// Writes site/assets/review/home-diff/<id>-before.webp, <id>-after.webp and diff.json. Run it again after
// either page changes; the review page reads diff.json at load.

import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { writeFileSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const OUT  = join(ROOT, 'site/assets/review/home-diff');
const arg  = (f, d) => { const i = process.argv.indexOf(f); return i > 0 ? process.argv[i + 1] : d; };
const BASE = arg('--base', 'http://localhost:8414');
const W = 1280;
mkdirSync(OUT, { recursive: true });

// before selector, after selector; null before means the section is new
const PAIRS = [
  { id: 'hero',    title: 'The hero',                     before: 'section#top', after: 'section#top' },
  { id: 'stage',   title: 'The stage',                    before: 'section[aria-label^="How"]', after: 'section[aria-label^="How"]' },
  { id: 'builder', title: 'Pick a system, set the rules', before: '#builder', after: '#builder' },
  { id: 'byo',     title: 'Bring your policy',            before: '#byo', after: '#byo' },
  { id: 'prompt',  title: 'A prompt asks',                before: 'h2:text("A prompt asks")', after: 'h2:text("A prompt asks")', up: 'section' },
  { id: 'alerts',  title: 'Know the moment',              before: 'h2:text("Know the moment")', after: 'h2:text("Know the moment")', up: 'section' },
  { id: 'roles',   title: 'Who does what (new)',          before: null, after: '#roles' },
  { id: 'questions', title: 'Ten hard questions (new)',   before: null, after: '#questions' },
];

const STILL = `*,*::before,*::after{animation:none !important;transition:none !important}
header.top,.rmx-note{display:none !important}.rmx .dot{opacity:0 !important}.fadeIn,.pop{opacity:1 !important}`;

// every element with its own text, as {t, x, y, w, h} relative to the section
const TEXTS = (el) => {
  const box = el.getBoundingClientRect(), out = [];
  const walk = (n) => {
    for (const c of n.children) {
      const own = [...c.childNodes].filter((x) => x.nodeType === 3).map((x) => x.textContent).join(' ').replace(/\s+/g, ' ').trim();
      const cs = getComputedStyle(c);
      if (cs.display === 'none' || cs.visibility === 'hidden') continue;
      if (own && own.length > 2) {   // two letters or fewer is a logo, not a sentence
        const r = c.getBoundingClientRect();
        if (r.width > 2 && r.height > 2) out.push({ t: c.textContent.replace(/\s+/g, ' ').trim(), x: r.left - box.left, y: r.top - box.top, w: r.width, h: r.height });
      }
      walk(c);
    }
  };
  walk(el);
  return { w: box.width, h: box.height, texts: out };
};

async function grab(page, url, sel, up, file) {
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.addStyleTag({ content: STILL });
  await page.waitForTimeout(300);
  let loc = page.locator(sel).first();
  if (up) loc = loc.locator(`xpath=ancestor::${up}[1]`);
  await loc.scrollIntoViewIfNeeded();
  await page.waitForTimeout(150);
  const info = await loc.evaluate(TEXTS);
  await loc.screenshot({ path: file });
  return info;
}

// merge boxes that overlap or nearly touch, so a changed paragraph is one box, not twelve
function merge(boxes, gap = 10) {
  const bs = boxes.map((b) => ({ ...b, ts: [b.t] }));
  let changed = true;
  while (changed) {
    changed = false;
    for (let i = 0; i < bs.length; i++) for (let j = i + 1; j < bs.length; j++) {
      const a = bs[i], b = bs[j];
      if (a.x - gap < b.x + b.w && b.x - gap < a.x + a.w && a.y - gap < b.y + b.h && b.y - gap < a.y + a.h) {
        const x = Math.min(a.x, b.x), y = Math.min(a.y, b.y);
        bs[i] = { x, y, w: Math.max(a.x + a.w, b.x + b.w) - x, h: Math.max(a.y + a.h, b.y + b.h) - y, ts: [...a.ts, ...b.ts] };
        bs.splice(j, 1); changed = true; break;
      }
      if (changed) break;
    }
  }
  return bs.map((b) => ({ x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.w), h: Math.round(b.h), text: [...new Set(b.ts)].sort((p, q) => q.length - p.length)[0] }));
}

// keep the outermost text only: a box whose text is wholly inside a bigger changed box goes
const outermost = (list) => list.filter((a) => !list.some((b) => b !== a && b.t.length > a.t.length && b.t.includes(a.t) && b.x <= a.x + 1 && b.y <= a.y + 1 && b.x + b.w >= a.x + a.w - 1 && b.y + b.h >= a.y + a.h - 1));

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: W, height: 1000 }, deviceScaleFactor: 1 });
const out = { captured: new Date().toISOString(), width: W, before: '/', after: '/home-next.html', pairs: [] };
for (const p of PAIRS) {
  const rec = { id: p.id, title: p.title, isNew: !p.before };
  const af = await grab(page, `${BASE}/home-next.html`, p.after, p.up, join(OUT, `${p.id}-after.png`));
  if (p.before) {
    const bf = await grab(page, `${BASE}/index.html`, p.before, p.up, join(OUT, `${p.id}-before.png`));
    const norm = (t) => t.toLowerCase().replace(/[^a-z0-9£$]+/g, ' ').trim();
    const inB = new Set(bf.texts.map((t) => norm(t.t))), inA = new Set(af.texts.map((t) => norm(t.t)));
    const gone = outermost(bf.texts.filter((t) => !inA.has(norm(t.t))));
    const came = outermost(af.texts.filter((t) => !inB.has(norm(t.t))));
    rec.beforeBoxes = merge(gone); rec.afterBoxes = merge(came);
    rec.h = Math.round(Math.max(bf.h, af.h)); rec.hb = Math.round(bf.h); rec.ha = Math.round(af.h);
  } else { rec.h = Math.round(af.h); rec.ha = rec.h; rec.afterBoxes = []; }
  out.pairs.push(rec);
  console.log(`${p.id}: ${rec.isNew ? 'new' : `${rec.beforeBoxes.length} out, ${rec.afterBoxes.length} in`}, height ${rec.h}`);
}
await browser.close();

// pad each pair to one height on the page's own ground, and write webp
const py = `
import json, sys
from PIL import Image
out, pairs = sys.argv[1], json.loads(sys.argv[2])
for p in pairs:
    for side in (['before', 'after'] if not p['isNew'] else ['after']):
        im = Image.open(f"{out}/{p['id']}-{side}.png").convert('RGB')
        if im.height < p['h']:
            bg = im.getpixel((4, im.height - 4))
            pad = Image.new('RGB', (im.width, p['h']), bg); pad.paste(im, (0, 0)); im = pad
        im.save(f"{out}/{p['id']}-{side}.webp", 'WEBP', quality=80, method=6)
`;
execFileSync('python3', ['-c', py, OUT, JSON.stringify(out.pairs)], { stdio: 'inherit' });
execFileSync('sh', ['-c', `rm -f "${OUT}"/*.png`]);
writeFileSync(join(OUT, 'diff.json'), JSON.stringify(out, null, 1) + '\n');
console.log(`wrote ${out.pairs.length} pairs to site/assets/review/home-diff/`);
