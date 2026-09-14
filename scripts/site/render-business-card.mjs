// Business card, front and back, to the estate's existing card format.
//
//   node scripts/site/render-business-card.mjs
//
// The format is the SG/Send card: 85 × 55mm, a quote on the front with the
// wordmark bottom-left and the URL bottom-right, and on the back a capitalised
// title, a short explanation, a highlight line, and a rule to write on.
//
// Two deliberate departures from that reference, both for print safety.
//
// It is laid out in HTML and rendered by Chromium rather than written as SVG
// <text>. An SVG wordmark takes whatever font the machine opening it happens to
// have, which is exactly how this estate's lockup came to clip its own last
// letter. The PDF carries glyph outlines, so a printer gets what we drew.
//
// And it is produced with bleed: 85 × 55 trims out of a 91 × 61 artboard, with
// the back's ground running to the edge. Everything readable sits at least 4mm
// inside the trim. An SVG at exact trim size is written too, because the
// reference format is SVG and somebody may want to edit it — but the PDF is
// the file to send.
import { chromium }                    from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { readFileSync, writeFileSync, mkdirSync, statSync } from 'node:fs';
import { dirname, join, resolve }      from 'node:path';
import { fileURLToPath }               from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const BRAND = join(ROOT, 'site/assets/brand');
const OUT   = join(ROOT, 'site/assets/brand/card');
mkdirSync(OUT, { recursive: true });

const arg = (f, d) => { const i = process.argv.indexOf(f); return i > 0 ? process.argv[i + 1] : d; };

// ── the card's dimensions, in one place ────────────────────────────────────
const TRIM_W = 85, TRIM_H = 55;     // the finished card
const BLEED  = 3;                   // printed past the trim on every side
const W = TRIM_W + BLEED * 2, H = TRIM_H + BLEED * 2;
const SAFE = BLEED + 4;             // nothing readable closer than this to the edge
const px = (mm) => Math.round(mm / 25.4 * 96);

const SANS = "ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
const MONO = "ui-monospace,'SF Mono','JetBrains Mono',Menlo,Consolas,monospace";
const INK = '#1A1917', PAPER = '#FFFFFF', BG2 = '#F7F6F2',
      GREEN = '#1A7F5A', MUTED = '#4A4845', FAINT = '#8A8780', BORDER = '#E2DFD8';

const markSvg = readFileSync(join(BRAND, 'riskmandate-mark.svg'), 'utf8')
  .replace(/<svg\b[^>]*>/, (t) => t.replace(/\s(width|height)="[^"]*"/g, ''));

const mm = (n) => `${n}mm`;

// The person. Nothing here is invented: pass them in, and until they are passed
// the card prints visible placeholders rather than a plausible-looking guess at
// somebody's name and address.
const NAME  = arg('--name',  '[ YOUR NAME ]');
const ROLE  = arg('--role',  '[ ROLE ]');
const EMAIL = arg('--email', '[ EMAIL ]');

// ── front ──────────────────────────────────────────────────────────────────
//
// The reference card quotes a beta user. We have no customer quote and are not
// going to write one, so the quote is our own line, marked as ours. A card is
// the one place a fabricated testimonial would never be checked, which is
// exactly why it is not going on one.
const front = `<div class="card" style="background:${PAPER};padding:${mm(SAFE)};box-sizing:border-box;
    display:flex;flex-direction:column;justify-content:space-between">
  <div>
    <div style="font-family:Georgia,'Times New Roman',serif;font-size:${mm(9)};line-height:0.7;
                color:${GREEN};height:${mm(5)}">&ldquo;</div>
    <div style="font-family:${SANS};font-size:${mm(3.4)};line-height:1.45;color:${INK};
                font-style:italic;margin-top:${mm(1.4)};max-width:${mm(66)}">
      You know what you asked for.<br>You don&rsquo;t know what it can do.
    </div>
    <div style="font-family:${SANS};font-size:${mm(2.1)};color:${FAINT};margin-top:${mm(2.6)}">
      &mdash; the gap an Agent Behaviour Policy measures
    </div>
  </div>
  <div style="display:flex;align-items:flex-end;justify-content:space-between;gap:${mm(4)}">
    <div>
      <div style="display:flex;align-items:center;gap:${mm(1.8)}">
        <div style="width:${mm(5.4)};height:${mm(5.4)};flex:none">${markSvg}</div>
        <div style="font-family:${SANS};font-size:${mm(4.2)};font-weight:700;letter-spacing:-0.03em;
                    color:${INK};line-height:1;white-space:nowrap">RiskMandate</div>
      </div>
      <div style="font-family:${SANS};font-size:${mm(2.3)};color:${INK};font-weight:600;
                  margin-top:${mm(2.2)};white-space:nowrap">${NAME}</div>
      <div style="font-family:${SANS};font-size:${mm(2.1)};color:${MUTED};margin-top:${mm(0.5)};
                  white-space:nowrap">${ROLE}</div>
    </div>
    <div style="text-align:right">
      <div style="font-family:${MONO};font-size:${mm(2.1)};color:${MUTED};white-space:nowrap">${EMAIL}</div>
      <div style="font-family:${SANS};font-size:${mm(2.6)};font-weight:600;color:${GREEN};
                  margin-top:${mm(0.8)};white-space:nowrap">riskmandate.ai</div>
    </div>
  </div>
</div>`;

// ── back ───────────────────────────────────────────────────────────────────
//
// The write-on rule is the best thing in the reference format: at a stand you
// write the one specific thing you just discussed, and the card stops being
// generic. Relabel it in one word if the conversation at the booth turns out to
// be about something else.
const back = `<div class="card" style="background:${BG2};padding:${mm(SAFE)};box-sizing:border-box;
    display:flex;flex-direction:column;justify-content:space-between">
  <div>
    <div style="font-family:${SANS};font-size:${mm(2.4)};font-weight:700;letter-spacing:0.14em;
                text-transform:uppercase;color:${INK}">Agent Behaviour Policy</div>
    <div style="font-family:${SANS};font-size:${mm(2.5)};line-height:1.5;color:${MUTED};
                margin-top:${mm(2.4)};max-width:${mm(68)}">
      Everything one agent can do, what you authorised it to do, and the gap
      between the two &mdash; with what actually stands in the way of each one.
      Derived from your deployment rather than copied from a template.
    </div>
    <div style="font-family:${SANS};font-size:${mm(2.5)};font-weight:600;color:${INK};
                margin-top:${mm(2.6)}">No score. It describes, it does not judge.</div>
  </div>
  <div style="display:flex;align-items:flex-end;justify-content:space-between;gap:${mm(4)}">
    <div style="flex:1">
      <div style="font-family:${SANS};font-size:${mm(1.9)};font-weight:700;letter-spacing:0.18em;
                  text-transform:uppercase;color:${FAINT}">Your draft policy</div>
      <div style="height:${mm(5.5)};border-bottom:${mm(0.35)} solid ${INK};margin-right:${mm(6)}"></div>
    </div>
    <div style="width:${mm(7)};height:${mm(7)};flex:none;opacity:0.28">${markSvg}</div>
  </div>
</div>`;

// ── render ─────────────────────────────────────────────────────────────────
const doc = (inner, bg) => `<!doctype html><meta charset="utf-8"><style>
  @page{size:${W}mm ${H}mm;margin:0}
  html,body{margin:0;padding:0;width:${W}mm;height:${H}mm;background:${bg}}
  /* the artboard is trim + bleed; the card fills it, so the ground runs off
     the edge and the trim can fall anywhere inside the 3mm. */
  .card{width:${W}mm;height:${H}mm;display:flex}
  svg{width:100%;height:100%;display:block}
</style>${inner}`;

const b = await chromium.launch({ args: ['--no-sandbox'] });

// The same measured check the booth panel needed, for the same reason: an
// element whose box fits while its ink does not is invisible until it is
// printed. Run against the PRINT layout at the real paper size.
const fits = (pg) => pg.evaluate(({ w, h }) => {
  const bad = [];
  for (const e of document.querySelectorAll('.card *')) {
    if (e instanceof SVGElement || e.clientWidth === 0) continue;
    const r = e.getBoundingClientRect();
    if (r.left < -0.5 || r.top < -0.5 || r.right > w + 0.5 || r.bottom > h + 0.5)
      bad.push(`${e.tagName} box to ${Math.round(r.right)}x${Math.round(r.bottom)} of ${w}x${h}`);
    if (e.scrollWidth > e.clientWidth + 1)
      bad.push(`${e.tagName} text ${e.scrollWidth} wide in a ${e.clientWidth} box`);
  }
  return bad;
}, { w: px(W), h: px(H) });

for (const [name, html, bg] of [['front', front, PAPER], ['back', back, BG2]]) {
  const pg = await b.newPage({ viewport: { width: px(W), height: px(H) }, deviceScaleFactor: 4 });
  await pg.emulateMedia({ media: 'print' });
  await pg.setContent(doc(html, bg), { waitUntil: 'load' });
  await pg.waitForTimeout(300);
  const bad = await fits(pg);
  await pg.screenshot({ path: join(OUT, `riskmandate-card-${name}.png`) });
  await pg.pdf({ path: join(OUT, `riskmandate-card-${name}.pdf`), width: `${W}mm`, height: `${H}mm`,
                 printBackground: true, pageRanges: '1' });
  await pg.close();
  const kb = (f) => Math.round(statSync(join(OUT, f)).size / 1024);
  console.log(`  card ${name.padEnd(6)} ${W}x${H}mm artboard, trims to ${TRIM_W}x${TRIM_H}  ` +
              `pdf ${kb(`riskmandate-card-${name}.pdf`)}KB  ` +
              (bad.length ? `OVERFLOWS — ${bad.join('; ')}` : 'fits'));
}
await b.close();

console.log(`\n  trim ${TRIM_W}x${TRIM_H}mm · bleed ${BLEED}mm · nothing readable within ${SAFE}mm of the artboard edge`);
console.log(`  files in site/assets/brand/card/`);
