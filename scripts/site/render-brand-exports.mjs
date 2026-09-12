// Render the mark and lockup to the exact sizes the booth portal and LinkedIn
// want.
//
// The mark comes straight from the SVG the site serves. The LOCKUP does not:
// its wordmark is an SVG <text> element, so its width depends on whichever
// font the renderer happens to have, and it clips its own viewBox in anything
// wider than the face it was drawn against. For a deliverable going to a
// printer that is unacceptable, so the lockup is composed here in HTML with
// the site's real font stack and let Chromium lay it out — no viewBox, nothing
// to clip. The PDF route embeds glyph outlines, which is what a printer needs.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { readFileSync, mkdirSync } from 'node:fs';

const SITE = '/home/user/riskmandate.ai/site';
const OUT  = `${SITE}/assets/brand`;
mkdirSync(OUT, { recursive: true });

const svg = (f) => readFileSync(`${OUT}/${f}`, 'utf8');

// Drop the declared size from the ROOT <svg> only, so it fills its box. Doing
// this globally also strips the container rect's own width/height, which
// silently deletes the seal's dark tile and leaves the monogram invisible.
const fill = (s) => s.replace(/<svg\b[^>]*>/, (tag) => tag.replace(/\s(width|height)="[^"]*"/g, ''));

const SANS = "ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

// mark + wordmark, laid out as type rather than as a fixed-width drawing.
// markPx sets the scale; everything else is proportional to it, per the brand
// rule that clear space is half the mark's height.
const lockup = (markPx, ink) => `
  <div style="display:flex;align-items:center;gap:${Math.round(markPx * 0.35)}px">
    <div style="width:${markPx}px;height:${markPx}px;flex:none">${fill(svg('riskmandate-mark.svg'))}</div>
    <div style="font-family:${SANS};font-size:${Math.round(markPx * 0.72)}px;font-weight:700;
                letter-spacing:-0.03em;color:${ink};line-height:1;white-space:nowrap">RiskMandate</div>
  </div>`;

const page = (body, w, h, bg) => `<!doctype html><meta charset="utf-8">
<style>html,body{margin:0;padding:0;background:${bg};width:${w}px;height:${h}px;overflow:hidden}
 svg{width:100%;height:100%;display:block}</style>${body}`;

const centred = (inner, w, h) =>
  `<div style="width:${w}px;height:${h}px;display:flex;align-items:center;justify-content:center">${inner}</div>`;

const jobs = [
  // LinkedIn company logo: 300×300. Square, so the mark and not the lockup.
  { out: 'riskmandate-mark-300.png', w: 300, h: 300, bg: 'transparent',
    body: `<div style="width:300px;height:300px">${fill(svg('riskmandate-mark.svg'))}</div>` },

  // LinkedIn cover: 1128×191, on the site's ink ground. Left-aligned with real
  // clear space, because LinkedIn crowds the left edge with the logo tile.
  { out: 'riskmandate-linkedin-cover-1128x191.png', w: 1128, h: 191, bg: '#0D0D0C',
    body: `<div style="width:1128px;height:191px;display:flex;align-items:center;padding-left:300px;box-sizing:border-box">
             ${lockup(72, '#F7F6F2')}</div>` },

  // The booth front panel is 1000×1000mm and the organiser prints it, so give
  // them a square artboard with the lockup centred. 2000px over 1m is ~50dpi —
  // ample at a metre's viewing distance, and the vector PDF beside it is what a
  // printer should actually use.
  { out: 'riskmandate-booth-panel-2000.png', w: 2000, h: 2000, bg: 'transparent',
    body: centred(lockup(230, "#1A1917"), 2000, 2000) },
];

const b = await chromium.launch({ args: ['--no-sandbox'] });
for (const j of jobs) {
  const pg = await b.newPage({ viewport: { width: j.w, height: j.h }, deviceScaleFactor: 1 });
  await pg.setContent(page(j.body, j.w, j.h, j.bg), { waitUntil: 'load' });
  await pg.waitForTimeout(300);
  await pg.screenshot({ path: `${OUT}/${j.out}`, omitBackground: j.bg === 'transparent' });
  console.log(`  ${j.out}  ${j.w}×${j.h}  ${j.bg === 'transparent' ? 'transparent' : j.bg}`);
  await pg.close();
}

// Print-quality vector PDF for the portal: 200×200mm square artboard (the front
// panel's proportions), lockup 140mm wide, glyph outlines embedded by Chromium.
const pdf = await b.newPage();
await pdf.setContent(`<!doctype html><meta charset="utf-8">
<style>@page{size:200mm 200mm;margin:0}
 html,body{margin:0;padding:0;width:200mm;height:200mm}
 svg{width:100%;height:100%;display:block}
 .c{width:200mm;height:200mm;display:flex;align-items:center;justify-content:center}</style>
<div class="c">
  <div style="display:flex;align-items:center;gap:14mm">
    <div style="width:40mm;height:40mm;flex:none">${fill(svg('riskmandate-mark.svg'))}</div>
    <div style="font-family:${SANS};font-size:29mm;font-weight:700;letter-spacing:-0.03em;
                color:#1A1917;line-height:1;white-space:nowrap">RiskMandate</div>
  </div>
</div>`, { waitUntil: 'load' });
await pdf.pdf({ path: `${OUT}/riskmandate-booth-panel.pdf`, width: '200mm', height: '200mm',
                printBackground: true, pageRanges: '1' });
console.log('  riskmandate-booth-panel.pdf  200×200mm vector, outlines embedded');
await pdf.close();
await b.close();
