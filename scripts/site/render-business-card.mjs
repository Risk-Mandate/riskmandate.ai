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
const NAME = arg('--name', 'Dinis Cruz');
const ROLE = arg('--role', 'Founder');
const SITE = 'RiskMandate.ai';

// ── front ──────────────────────────────────────────────────────────────────
//
// The reference card quotes a beta user. We have no customer quote and are not
// writing one, so the quote is our own line and the attribution says so. A
// business card is the one place a fabricated testimonial would never be
// checked, which is why there isn't one on it.
const front = `<div class="card" style="background:${PAPER};padding:${mm(SAFE)};box-sizing:border-box;
    display:flex;flex-direction:column;justify-content:space-between">
  <div>
    <div style="font-family:Georgia,'Times New Roman',serif;font-size:${mm(9)};line-height:0.7;
                color:${GREEN};height:${mm(5)}">&ldquo;</div>
    <div style="font-family:${SANS};font-size:${mm(3.5)};line-height:1.42;color:${INK};
                font-style:italic;margin-top:${mm(1.2)};max-width:${mm(68)}">
      You know what you asked for.<br>You don&rsquo;t know what it can do.
    </div>
    <div style="font-family:${SANS};font-size:${mm(2.1)};color:${FAINT};margin-top:${mm(2.4)}">
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
      <div style="font-family:${SANS};font-size:${mm(2.4)};color:${INK};font-weight:600;
                  margin-top:${mm(2.2)};white-space:nowrap">${NAME}</div>
      <div style="font-family:${SANS};font-size:${mm(2.1)};color:${MUTED};margin-top:${mm(0.5)};
                  white-space:nowrap">${ROLE}</div>
    </div>
    <div style="font-family:${SANS};font-size:${mm(2.9)};font-weight:700;color:${GREEN};
                white-space:nowrap">${SITE}</div>
  </div>
</div>`;

// ── back ───────────────────────────────────────────────────────────────────
//
// The four objects, because the whole product is the difference between them
// and a card is where somebody meets those words for the first time.
//
// An earlier cut of this card put a verb beside each row — measured, elicited,
// derived, recorded — and a line saying only the mandate is written by a person.
// That is wrong, and it undersells the product. Three of the four CAN be written
// down by the people who run the agent, out of what they understand today; the
// policy is a draft that goes to several stakeholders to be argued with and
// corrected, and it is re-corrected as reality changes. Only the delta is not
// authorable, because it is computed from the other two. So the verb column is
// gone and one honest line carries the point instead.
//
// They are BARRIERS, not blockers. The model, the data at abp.sgit.ai and every
// page on the site use that word, and a printed artefact is the worst place to
// introduce a second name for the same thing.
const row = (term, what) => `
  <div style="display:grid;grid-template-columns:${mm(16)} 1fr;gap:${mm(2.2)};align-items:baseline">
    <div style="font-family:${MONO};font-size:${mm(2.15)};font-weight:700;color:${GREEN};
                text-transform:uppercase;letter-spacing:0.04em">${term}</div>
    <div style="font-family:${SANS};font-size:${mm(2.35)};color:${INK};line-height:1.3">${what}</div>
  </div>`;

const back = `<div class="card" style="background:${BG2};padding:${mm(SAFE)};box-sizing:border-box;
    display:flex;flex-direction:column;justify-content:space-between">
  <div>
    <div style="font-family:${SANS};font-size:${mm(2.3)};font-weight:700;letter-spacing:0.13em;
                text-transform:uppercase;color:${INK}">Know what your agents can actually do</div>
    <div style="font-family:${SANS};font-size:${mm(2.25)};line-height:1.45;color:${MUTED};
                margin-top:${mm(1.5)};max-width:${mm(70)}">
      One agent, one deployment, four things.
    </div>
    <div style="display:flex;flex-direction:column;gap:${mm(1.5)};margin-top:${mm(2.2)}">
      ${row('Grant',   'Everything it can reach')}
      ${row('Mandate', 'What you authorised it to do')}
      ${row('Delta',   'The gap between the two')}
      ${row('Barrier', 'What actually stands in the way')}
    </div>
    <div style="font-family:${SANS};font-size:${mm(2.15)};line-height:1.45;color:${MUTED};
                margin-top:${mm(2.4)};max-width:${mm(72)}">
      Three of these you can write down. The fourth is worked out, and it is
      usually the one nobody has looked at.
    </div>
  </div>
  <div style="display:flex;align-items:center;justify-content:space-between;gap:${mm(3)}">
    <div style="background:${GREEN};border-radius:${mm(1)};padding:${mm(1.9)} ${mm(3)};
                font-family:${SANS};font-size:${mm(2.5)};font-weight:700;color:${PAPER};
                white-space:nowrap">Buy one &middot; ${SITE}</div>
    <div style="width:${mm(6.6)};height:${mm(6.6)};flex:none;opacity:0.3">${markSvg}</div>
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
