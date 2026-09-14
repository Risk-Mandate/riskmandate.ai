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

];

// The booth panel used to be made here, as a 200×200mm square. It is not any
// more: scripts/site/render-booth-panel.mjs owns it, and the portal turned out
// to want 500×400mm at 5906×4724. Those jobs wrote to the SAME filenames the
// new generator uses, so running this script would have quietly replaced the
// panel that was actually uploaded with the old wrong-shaped one. Removed
// rather than renamed — two scripts claiming one deliverable is the bug.

// ── the lockups ────────────────────────────────────────────────────────────
//
// These two PNGs are the og:image for every page on the site and the file
// anybody uploads when a form asks for a logo, and BOTH WERE CLIPPED: 780×192
// is 4.06:1 rendered out of artwork that is 5:1, so the renderer cropped the
// sides and took the last letter of the wordmark with it.
//
// The fix is not a wider canvas. It is to stop declaring a canvas at all: the
// lockup is composed in HTML, screenshotted by its own bounding box, and comes
// out whatever size the type actually needs. Clear space is half the mark's
// height, per the brand rule, and it is padding on that same box.
const lockups = [
  { out: 'riskmandate-lockup-light.png', ink: '#1A1917', bg: 'transparent' },
  { out: 'riskmandate-lockup-dark.png',  ink: '#F7F6F2', bg: 'transparent' },
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

const MARK = 200;                       // sets the scale; everything follows it
const PAD  = Math.round(MARK / 2);      // clear space = half the mark's height

for (const j of lockups) {
  const pg = await b.newPage({ viewport: { width: 2400, height: 800 }, deviceScaleFactor: 2 });
  await pg.setContent(page(
    `<div class="lk" style="display:inline-flex;padding:${PAD}px">${lockup(MARK, j.ink)}</div>`,
    2400, 800, 'transparent'), { waitUntil: 'load' });
  await pg.waitForTimeout(300);

  // The same measured check the card and the panel needed. A wordmark whose box
  // fits while its ink does not is invisible until somebody prints it, or until
  // it is the logo on an exhibitor listing.
  const bad = await pg.evaluate(() => {
    const w = document.querySelector('.lk div:last-child');
    return w.scrollWidth > w.clientWidth + 1
      ? `wordmark ink ${w.scrollWidth}px in a ${w.clientWidth}px box` : null;
  });
  const box = await pg.locator('.lk').boundingBox();
  await pg.locator('.lk').screenshot({ path: `${OUT}/${j.out}`, omitBackground: true });
  console.log(`  ${j.out}  ${Math.round(box.width * 2)}×${Math.round(box.height * 2)}  ` +
              `transparent  ${bad ? `OVERFLOWS — ${bad}` : 'fits'}`);
  await pg.close();
}

await b.close();
