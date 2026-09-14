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

// C — the statement, which is the one chosen. The panel is the front of the
// stand at knee-to-waist height, so it is a shopfront: the sentence stops
// somebody, and the band underneath has to say that the thing being described
// is for sale, at this stand, now. Without it the panel is an advertisement for
// an idea rather than for a product.
//
// No exclamation mark. Nothing else this company publishes uses one, and at a
// square metre it reads as a market stall rather than as a claim we stand
// behind. It is a one-character change if that judgement is wrong.
const statement = (sizePct) => `<div style="font-family:${SANS};font-size:${u(sizePct)};font-weight:700;
    letter-spacing:-0.035em;line-height:1.1;color:${PAPER};white-space:nowrap">
  You know what you<br>asked for.<br>
  <span style="color:${GREEN}">You don't know<br>what it can do.</span>
</div>`;

// The offer, as a filled band. Filled rather than set in rules, because at two
// to five metres and below waist height a solid block of colour is read before
// any of the type on it.
const band = () => `<div style="width:100%;background:${GREEN};border-radius:${u(1.2)};
    padding:${u(3.4)} ${u(4)};box-sizing:border-box;display:flex;align-items:baseline">
  <div style="font-family:${MONO};font-size:${u(3.5)};font-weight:700;letter-spacing:${u(0.25)};
              text-transform:uppercase;color:${DARK};line-height:1;white-space:nowrap">Buy an Agent Behaviour Policy here</div>
</div>`;

const C = (opts = {}) => `<div class="board" style="justify-content:space-between;align-items:flex-start;
    padding:${u(8)};box-sizing:border-box;background:${DARK}">
  ${lockup(7, PAPER)}
  ${statement(opts.big ?? 7.4)}
  <div style="width:100%;display:flex;flex-direction:column;gap:${u(2.6)}">
    ${opts.band === false ? '' : band()}
    <div style="display:flex;align-items:baseline;gap:${u(3)};width:100%">
      ${opts.band === false ? `<div style="font-family:${MONO};font-size:${u(3.2)};font-weight:700;
          letter-spacing:${u(0.3)};text-transform:uppercase;color:${GREEN};white-space:nowrap">Buy an Agent Behaviour Policy here</div>` : ''}
      <div style="flex:1;height:${u(0.2)};background:rgba(247,246,242,.25)"></div>
      <div style="font-family:${MONO};font-size:${u(3.2)};color:rgba(247,246,242,.7);white-space:nowrap">riskmandate.ai</div>
    </div>
  </div>
</div>`;

const doc = (inner, px, bg) => `<!doctype html><meta charset="utf-8"><style>
  html,body{margin:0;padding:0;width:${px}px;height:${px}px;overflow:hidden;background:${bg}}
  .board{container-type:inline-size;width:${px}px;height:${px}px;display:flex;flex-direction:column}
  svg{width:100%;height:100%;display:block}
</style>${inner}`;

const OPTIONS = [
  { id: 'a-logo',      px: 2000, bg: 'transparent', html: A(INK),         label: 'the logo, corrected' },
  { id: 'b-descriptor',px: 2000, bg: PAPER,         html: B(INK, '#6B6862'), label: 'logo + product line' },
  { id: 'c-statement', px: 2000, bg: DARK, html: C(),                          label: 'statement + offer band' },
];

const b = await chromium.launch({ args: ['--no-sandbox'] });

for (const o of OPTIONS) {
  const pg = await b.newPage({ viewport: { width: o.px, height: o.px }, deviceScaleFactor: 1 });
  await pg.setContent(doc(o.html, o.px, o.bg), { waitUntil: 'load' });
  await pg.waitForTimeout(250);

  // The check the previous deliverable did not have: does the content actually
  // fit the board? Anything wider or taller than the artboard is clipped at
  // print, and on a square metre of MDF that is not recoverable.
  const fitsOk = await pg.evaluate((px) => {
    const why = [];
    for (const e of document.querySelectorAll('.board *')) {
      const r = e.getBoundingClientRect();
      // (a) the element's box sits outside the artboard
      if (r.left < -0.5 || r.top < -0.5 || r.right > px + 0.5 || r.bottom > px + 0.5)
        why.push(`${e.tagName} box to ${Math.round(r.right)}`);
      // (b) the element's box fits but its INK does not. A nowrap child of a
      // flex row gets shrunk to fit the row, so its rect stays inside the board
      // while the text runs out of it — which is how the priced band passed (a)
      // and still printed clipped. scrollWidth is what catches that.
      // SVG elements report scroll/client sizes that do not mean overflow, and
      // an element with no box (clientWidth 0) cannot be measured this way.
      if (e instanceof SVGElement || e.clientWidth === 0) continue;
      if (e.scrollWidth > e.clientWidth + 1)
        why.push(`${e.tagName} text ${e.scrollWidth} wide in a ${e.clientWidth} box`);
    }
    return { overflow: why.length, worst: why.slice(0, 2) };
  }, o.px);

  await pg.screenshot({ path: join(PREV, `panel-${o.id}.png`), omitBackground: o.bg === 'transparent' });
  await pg.pdf({ path: join(PREV, `panel-${o.id}.pdf`), width: '200mm', height: '200mm',
                 printBackground: true, pageRanges: '1' })
    .catch(() => {});            // pdf() needs headless chromium; previews still render
  console.log(`  panel-${o.id}  ${o.label.padEnd(24)} ${fitsOk.overflow ? `OVERFLOWS by ${fitsOk.worst}` : 'fits'}`);
  await pg.close();
}

// ─────────────────────────────────── the chosen design, as the files to upload
//
// C is the panel. It is written to the canonical names so there is exactly one
// pair of files to send, produced from the same source as the preview above.
// The lockup and mark files are left alone: "booth-panel" means the panel
// design, "lockup" and "mark" mean the logo, and the two are not the same
// request.
const canon = await b.newPage({ viewport: { width: 2000, height: 2000 }, deviceScaleFactor: 1 });
await canon.setContent(doc(C(), 2000, DARK), { waitUntil: 'load' });
await canon.waitForTimeout(250);
await canon.screenshot({ path: join(OUT, 'riskmandate-booth-panel-2000.png') });
await canon.pdf({ path: join(OUT, 'riskmandate-booth-panel.pdf'), width: '200mm', height: '200mm',
                  printBackground: true, pageRanges: '1' });
await canon.close();
console.log('\n  riskmandate-booth-panel.pdf       200×200mm, the file to upload');
console.log('  riskmandate-booth-panel-2000.png 2000×2000px, if they want a raster');

await b.close();
console.log(`  previews in site/assets/brand/panel-options/`);
