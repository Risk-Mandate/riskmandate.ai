// capture.mjs — take the screenshots and render the covers that scripts/linkedin/items.mjs names.
//
//   bash scripts/run-locally__riskmandate_ai.sh   (or any static server for site/ on :8414)
//   node scripts/linkedin/capture.mjs [--only <item id>] [--force | --covers]
//
// riskmandate.ai is captured from the working copy at http://localhost:8414/, so a picture shows what will be live.
// Other sites (the customers site, the newsroom) are fetched for the browser by curl, which checks each certificate
// against the system's CA bundle; nothing is posted and no form is filled. Files go to site/assets/linkedin/, as
// JPEG: covers at 1280 by 720, LinkedIn's article cover; shots at the size the item asks for. An existing file is
// kept unless --force, so a picture of a page on the day it was published stays that picture.

import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { execFile } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ITEMS } from './items.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const OUT = join(ROOT, 'site/assets/linkedin'); mkdirSync(OUT, { recursive: true });
const arg = (f) => { const i = process.argv.indexOf(f); return i > 0 ? process.argv[i + 1] : null; };
const ONLY = arg('--only'), FORCE = process.argv.includes('--force'), COVERS = process.argv.includes('--covers');   // --covers: redraw the covers only

async function viaCurl(page) {
  await page.route(/^https:\/\//, (route) => {
    const req = route.request(); if (req.method() !== 'GET') return route.abort();
    execFile('curl', ['-sS', '-L', '--max-time', '25', '-D', '-', req.url()], { encoding: 'buffer', maxBuffer: 64 << 20 }, (err, out) => {
      if (err) return route.abort();
      let i = 0; for (;;) { const j = out.indexOf('\r\n\r\n', i); if (j < 0 || !/^HTTP\//.test(out.subarray(i, i + 5).toString())) break; i = j + 4; }
      const head = out.subarray(0, i).toString().split('\r\n\r\n').filter(Boolean).pop() || '';
      const status = +(/^HTTP\/\S+ (\d+)/.exec(head) || [0, 200])[1], ct = (/^content-type:\s*(.+)$/im.exec(head) || [0, 'application/octet-stream'])[1].trim();
      route.fulfill({ status, headers: { 'content-type': ct }, body: out.subarray(i) });
    });
  });
}

const mark = readFileSync(join(ROOT, 'site/assets/brand/riskmandate-mark.svg'), 'utf8');
const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const coverHtml = (c) => `<!doctype html><html><head><meta charset="utf-8"><style>
html,body{margin:0;width:1280px;height:720px}body{background:#07140F;color:#E8F0EC;font-family:"Inter",ui-sans-serif,system-ui,sans-serif;display:flex;flex-direction:column;justify-content:space-between;padding:72px 84px;box-sizing:border-box;background-image:radial-gradient(rgba(232,240,236,.07) 1px,transparent 1px);background-size:24px 24px}
.k{font:600 20px/1.3 ui-monospace,Menlo,monospace;letter-spacing:.08em;text-transform:uppercase;color:#4BE3A2}
h1{margin:22px 0 0;font-size:${c.title.length > 44 ? 68 : 84}px;line-height:1.02;letter-spacing:-.045em;font-weight:700;max-width:16em;color:#FFFFFF}
.f{display:flex;align-items:center;gap:18px;font-size:24px;color:rgba(232,240,236,.8)}.f svg{width:56px;height:56px;background:#E8F0EC;border-radius:14px;padding:5px;box-sizing:border-box}.f b{color:#fff;font-weight:700}.f span{margin-left:auto;color:#4BE3A2;font-weight:600}
</style></head><body><div><div class="k">${esc(c.kicker)}</div><h1>${esc(c.title)}</h1></div><div class="f">${mark}<div><b>RiskMandate</b> · riskmandate.ai</div><span>Try it: customers.riskmandate.ai</span></div></body></html>`;

const b = await chromium.launch();
let n = 0, kept = 0;
for (const it of ITEMS.filter((x) => !ONLY || x.id === ONLY)) {
  if (it.cover) {
    const f = join(OUT, `${it.id}-cover.jpg`);
    if (FORCE || COVERS || !existsSync(f)) { const p = await b.newPage({ viewport: { width: 1280, height: 720 } }); await p.setContent(coverHtml(it.cover)); await p.screenshot({ path: f, type: 'jpeg', quality: 88 }); await p.close(); n++; } else kept++;
  }
  for (const s of COVERS ? [] : it.shots || []) {
    const f = join(OUT, s.file); if (!FORCE && existsSync(f)) { kept++; continue; }
    const [w, h] = s.viewport || [1280, 720];
    const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
    if (!s.url.startsWith('http://localhost')) await viaCurl(p);
    await p.goto(s.url, { waitUntil: 'networkidle', timeout: 60000 }); await p.waitForTimeout(900);
    await p.addStyleTag({ content: 'header.top,.top{position:static!important} .rv-bar{display:none!important}' }).catch(() => {});
    if (s.selector || s.heading) {
      const el = s.selector ? p.locator(s.selector).first() : p.locator('section').filter({ has: p.locator(`h2:text-matches("^${s.heading}", "i")`) }).last();
      await el.scrollIntoViewIfNeeded(); await p.waitForTimeout(600); await el.screenshot({ path: f, type: 'jpeg', quality: 86 });
    } else {
      if (s.scroll) { await p.evaluate((y) => scrollTo(0, y), s.scroll); await p.waitForTimeout(500); }
      await p.screenshot({ path: f, type: 'jpeg', quality: 86 });
    }
    await p.close(); n++;
  }
}
await b.close();
console.log(`${n} written, ${kept} kept, in site/assets/linkedin/`);
