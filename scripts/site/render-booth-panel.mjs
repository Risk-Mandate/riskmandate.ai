// Render the booth front panel, as options to choose between.
//
//   node scripts/site/render-booth-panel.mjs
//
// The panel is 1000 × 1000mm — the front face of the stand, floor to table
// height. Two facts about it decide every choice here. It is BELOW waist level,
// so it is read at two to five metres by somebody walking past and not standing
// still; and the organiser prints it centrally from whatever single file we
// upload. So: very few words, very large, and a square artboard that still
// reads correctly if they place it smaller than the full metre.
//
// Everything is proportional to the artboard. The earlier version of this
// deliverable set absolute millimetres — a 40mm mark, a 14mm gap and a 29mm
// wordmark — which comes to roughly 240mm of content on a 200mm page, so it
// overflowed and was clipped at both edges. Nothing here carries a fixed
// dimension: sizes are fractions of the board, and each render is measured
// afterwards to check the content actually fits inside it.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { readFileSync, mkdirSync }           from 'node:fs';
import { dirname, join, resolve }            from 'node:path';
import { fileURLToPath }                     from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const OUT  = join(ROOT, 'site/assets/brand');
const PREV = join(ROOT, 'site/assets/brand/panel-options');
mkdirSync(PREV, { recursive: true });

const svg  = (f) => readFileSync(join(OUT, f), 'utf8');
const fill = (s) => s.replace(/<svg\b[^>]*>/, (t) => t.replace(/\s(width|height)="[^"]*"/g, ''));

const SANS = "ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
const MONO = "ui-monospace,'SF Mono','JetBrains Mono',Menlo,Consolas,monospace";
const INK = '#1A1917', PAPER = '#F7F6F2', DARK = '#0D0D0C', GREEN = '#1A7F5A';

// One board unit = 1% of the artboard's width, so every size below is a
// percentage and the whole thing scales to any output resolution.
const u = (n) => `${n}cqw`;

const mark = (pct) => `<div style="width:${u(pct)};height:${u(pct)};flex:none">${fill(svg('riskmandate-mark.svg'))}</div>`;

const wordmark = (pct, ink) => `<div style="font-family:${SANS};font-size:${u(pct)};font-weight:700;
  letter-spacing:-0.03em;color:${ink};line-height:1;white-space:nowrap">RiskMandate</div>`;

const lockup = (markPct, ink) => `<div style="display:flex;align-items:center;gap:${u(markPct * 0.35)}">
  ${mark(markPct)}${wordmark(markPct * 0.72, ink)}</div>`;

// ─────────────────────────────────────────────────────────────── the options

// A — the logo, corrected. What the organiser literally asked for: a logo,
// centred, nothing else. The safest thing to upload and the least use of a
// square metre.
const A = (ink) => `<div class="board" style="justify-content:center;align-items:center">
  ${lockup(11.5, ink)}
</div>`;

// B — logo plus the product line. Reads as a logo with a descriptor, which is
// an ordinary thing to supply and cannot be mistaken for us uploading a poster
// in place of artwork. The descriptor is the category we want a stranger to
// leave knowing.
const B = (ink, faint) => `<div class="board" style="justify-content:center;align-items:center;gap:${u(7)}">
  ${lockup(10.5, ink)}
  <div style="width:${u(62)};height:${u(0.35)};background:${GREEN}"></div>
  <div style="font-family:${MONO};font-size:${u(4.4)};font-weight:700;letter-spacing:${u(0.5)};
              text-transform:uppercase;color:${ink};line-height:1;white-space:nowrap">Agent Behaviour Policy</div>
  <div style="font-family:${MONO};font-size:${u(2.7)};color:${faint};line-height:1">riskmandate.ai</div>
</div>`;

// The panel: the buy action, and nothing else.
//
// It is the front of the stand at knee-to-waist height, read at two to five
// metres by somebody walking past. One instruction, very large, is what that
// distance and that angle can carry. The statement reads well on a screen and
// asks for more attention than an aisle gives it — so it moves to the tabletop
// sign at eye level, where somebody has already stopped, and the panel does the
// one job a shopfront does.
const buy = (opts = {}) => `<div class="board" style="justify-content:space-between;align-items:flex-start;
    padding:${u(8)};box-sizing:border-box;background:${DARK}">
  ${lockup(7, PAPER)}
  <div style="font-family:${SANS};font-size:${u(11)};font-weight:700;letter-spacing:-0.035em;
              line-height:1.06;color:${PAPER};white-space:nowrap">
    Buy an<br>
    <span style="color:${GREEN}">Agent<br>Behaviour<br>Policy</span><br>
    here
  </div>
  <div style="display:flex;align-items:baseline;gap:${u(3)};width:100%">
    <div style="flex:1;height:${u(0.2)};background:rgba(247,246,242,.25)"></div>
    <div style="font-family:${MONO};font-size:${u(3.4)};color:rgba(247,246,242,.7);white-space:nowrap">riskmandate.ai</div>
  </div>
</div>`;

// Kept because it is the better artefact away from an aisle — this is the one
// for the tabletop sign, the slide and the social card.
const statement = (sizePct) => `<div style="font-family:${SANS};font-size:${u(sizePct)};font-weight:700;
    letter-spacing:-0.035em;line-height:1.1;color:${PAPER};white-space:nowrap">
  You know what you<br>asked for.<br>
  <span style="color:${GREEN}">You don't know<br>what it can do.</span>
</div>`;

const band = () => `<div style="width:100%;background:${GREEN};border-radius:${u(1.2)};
    padding:${u(3.4)} ${u(4)};box-sizing:border-box;display:flex;align-items:baseline">
  <div style="font-family:${MONO};font-size:${u(3.5)};font-weight:700;letter-spacing:${u(0.25)};
              text-transform:uppercase;color:${DARK};line-height:1;white-space:nowrap">Buy an Agent Behaviour Policy here</div>
</div>`;

const C = () => `<div class="board" style="justify-content:space-between;align-items:flex-start;
    padding:${u(8)};box-sizing:border-box;background:${DARK}">
  ${lockup(7, PAPER)}
  ${statement(7.4)}
  <div style="width:100%;display:flex;flex-direction:column;gap:${u(2.6)}">
    ${band()}
    <div style="display:flex;align-items:baseline;gap:${u(3)};width:100%">
      <div style="flex:1;height:${u(0.2)};background:rgba(247,246,242,.25)"></div>
      <div style="font-family:${MONO};font-size:${u(3.2)};color:rgba(247,246,242,.7);white-space:nowrap">riskmandate.ai</div>
    </div>
  </div>
</div>`;

// Two documents, and the difference between them is the bug that clipped the
// last PDF. page.pdf() re-lays the page out at the paper size — 200mm is about
// 756px — while the board was hardcoded at 2000px, so every cqw resolved
// against a container two and a half times wider than the paper and the content
// ran off it. A screenshot never sees that, which is why checking the PNG and
// inferring the PDF missed it twice. So the print document sizes the board in
// millimetres, and the check below runs against the PRINT layout.
const doc = (inner, px, bg) => `<!doctype html><meta charset="utf-8"><style>
  html,body{margin:0;padding:0;width:${px}px;height:${px}px;overflow:hidden;background:${bg}}
  .board{container-type:inline-size;width:${px}px;height:${px}px;display:flex;flex-direction:column}
  svg{width:100%;height:100%;display:block}
</style>${inner}`;

const printDoc = (inner, mm, bg) => `<!doctype html><meta charset="utf-8"><style>
  @page{size:${mm}mm ${mm}mm;margin:0}
  html,body{margin:0;padding:0;width:${mm}mm;height:${mm}mm;background:${bg}}
  .board{container-type:inline-size;width:${mm}mm;height:${mm}mm;display:flex;flex-direction:column}
  svg{width:100%;height:100%;display:block}
</style>${inner}`;

// 200mm at 96dpi. Laying the print document out at exactly this width means the
// fit check sees the same boxes the PDF will.
const MM200_PX = Math.round(200 / 25.4 * 96);

const OPTIONS = [
  { id: 'a-logo',       bg: 'transparent', html: A(INK),            label: 'the logo, corrected' },
  { id: 'b-descriptor', bg: PAPER,         html: B(INK, '#6B6862'), label: 'logo + product line' },
  { id: 'c-statement',  bg: DARK,          html: C(),               label: 'the statement + band' },
  { id: 'd-buy',        bg: DARK,          html: buy(),             label: 'the buy action alone' },
];

const b = await chromium.launch({ args: ['--no-sandbox'] });

// Does the content fit the board? Two ways it can fail, and the second one is
// the one that has bitten twice: (a) an element's box sits outside the board,
// and (b) the box fits but its ink does not, because a nowrap child of a flex
// row gets shrunk to fit the row while its text keeps its width.
const fits = async (pg, px) => pg.evaluate((px) => {
  const why = [];
  for (const e of document.querySelectorAll('.board *')) {
    if (e instanceof SVGElement || e.clientWidth === 0) continue;
    const r = e.getBoundingClientRect();
    if (r.left < -0.5 || r.top < -0.5 || r.right > px + 0.5 || r.bottom > px + 0.5)
      why.push(`${e.tagName} box to ${Math.round(r.right)}/${Math.round(r.bottom)} of ${px}`);
    if (e.scrollWidth > e.clientWidth + 1)
      why.push(`${e.tagName} text ${e.scrollWidth} wide in a ${e.clientWidth} box`);
  }
  return why;
}, px);

async function render(html, bg, pngPath, pdfPath) {
  const notes = [];

  // the raster, laid out at its own size
  const shot = await b.newPage({ viewport: { width: 2000, height: 2000 }, deviceScaleFactor: 1 });
  await shot.setContent(doc(html, 2000, bg), { waitUntil: 'load' });
  await shot.waitForTimeout(250);
  notes.push(...(await fits(shot, 2000)).map((w) => `png: ${w}`));
  if (pngPath) await shot.screenshot({ path: pngPath, omitBackground: bg === 'transparent' });
  await shot.close();

  // the print file, laid out at the PAPER size and checked there
  const pr = await b.newPage({ viewport: { width: MM200_PX, height: MM200_PX }, deviceScaleFactor: 1 });
  await pr.emulateMedia({ media: 'print' });
  await pr.setContent(printDoc(html, 200, bg === 'transparent' ? '#ffffff' : bg), { waitUntil: 'load' });
  await pr.waitForTimeout(250);
  notes.push(...(await fits(pr, MM200_PX)).map((w) => `pdf: ${w}`));
  if (pdfPath) await pr.pdf({ path: pdfPath, width: '200mm', height: '200mm',
                             printBackground: true, pageRanges: '1' });
  await pr.close();
  return notes;
}

for (const o of OPTIONS) {
  const notes = await render(o.html, o.bg,
    join(PREV, `panel-${o.id}.png`), join(PREV, `panel-${o.id}.pdf`));
  console.log(`  panel-${o.id.padEnd(13)} ${o.label.padEnd(24)} ${notes.length ? 'OVERFLOWS — ' + notes.join('; ') : 'fits, png and pdf'}`);
}

// ─────────────────────────────────── the chosen design, as the files to upload
const chosen = buy();
const notes = await render(chosen, DARK,
  join(OUT, 'riskmandate-booth-panel-2000.png'), join(OUT, 'riskmandate-booth-panel.pdf'));
console.log(`\n  riskmandate-booth-panel.pdf       200x200mm  ${notes.length ? 'OVERFLOWS — ' + notes.join('; ') : 'fits'}`);
console.log('  riskmandate-booth-panel-2000.png 2000x2000px');

await b.close();
console.log('  previews in site/assets/brand/panel-options/');
