// Generates ConceptA..H.dc.html — one sheet per logo concept.
// Each glyph is authored once and rendered in two modes:
//   tile  = ink rounded square + glyph        (for light grounds)
//   knock = glyph alone, no container         (for dark grounds)
import { writeFileSync } from 'node:fs';

const GREEN = '#1A7F5A', FG = '#F7F6F2', INK = '#0D0D0C';
const F2 = 'rgba(247,246,242,.30)', F3 = 'rgba(247,246,242,.55)';
const MONO = 'ui-monospace, SF Mono, Menlo, monospace';

// glyph(scaleStroke) -> svg inner content on a 64x64 viewBox
const glyphs = {
  A: () => `<text x="32" y="41" text-anchor="middle" font-family="${MONO}" font-size="23" font-weight="700" fill="${GREEN}" letter-spacing="-1">RM</text>`,
  B: () => `<path d="M22 19 h-7 v26 h7" stroke="${GREEN}" stroke-width="3" fill="none"/><path d="M42 19 h7 v26 h-7" stroke="${GREEN}" stroke-width="3" fill="none"/><rect x="23" y="30" width="12" height="4" fill="${FG}"/><rect x="35" y="30" width="7" height="4" fill="rgba(247,246,242,.26)"/>`,
  C: () => `<path d="M13 21 L31 32 L13 43" stroke="${GREEN}" stroke-width="3.2" fill="none" stroke-linejoin="round"/><path d="M51 21 L33 32 L51 43" stroke="rgba(247,246,242,.62)" stroke-width="3.2" fill="none" stroke-linejoin="round"/>`,
  D: () => `<rect x="13" y="38" width="6" height="9" fill="rgba(247,246,242,.24)"/><rect x="22" y="32" width="6" height="15" fill="rgba(247,246,242,.34)"/><rect x="31" y="26" width="6" height="21" fill="rgba(247,246,242,.46)"/><rect x="40" y="20" width="6" height="27" fill="${GREEN}"/><rect x="49" y="14" width="6" height="33" fill="${GREEN}"/>`,
  E: () => `<circle cx="32" cy="32" r="19" stroke="${GREEN}" stroke-width="2.6" fill="none"/><circle cx="32" cy="32" r="13.5" stroke="rgba(247,246,242,.22)" stroke-width="1" fill="none"/><g stroke="${GREEN}" stroke-width="2"><line x1="32" y1="9" x2="32" y2="14"/><line x1="32" y1="50" x2="32" y2="55"/><line x1="9" y1="32" x2="14" y2="32"/><line x1="50" y1="32" x2="55" y2="32"/></g><text x="32" y="37" text-anchor="middle" font-family="${MONO}" font-size="13" font-weight="700" fill="${FG}" letter-spacing="-0.5">RM</text>`,
  F: () => `<circle cx="32" cy="32" r="5" fill="${GREEN}"/><circle cx="32" cy="32" r="12.5" stroke="rgba(247,246,242,.30)" stroke-width="1.6" fill="none"/><circle cx="32" cy="32" r="20" stroke="${GREEN}" stroke-width="2.6" fill="none"/>`,
  G: () => `<path d="M14 37 C21 21, 27 41, 34 27 S 45 31, 50 23" stroke="${GREEN}" stroke-width="3" fill="none" stroke-linecap="round"/><line x1="13" y1="46" x2="51" y2="46" stroke="rgba(247,246,242,.55)" stroke-width="2"/>`,
  H: () => `<rect x="13" y="19" width="9" height="9" rx="2" fill="${GREEN}"/><rect x="26" y="21" width="25" height="4.5" rx="2" fill="${FG}"/><rect x="13" y="34" width="38" height="3.5" rx="1.75" fill="rgba(247,246,242,.30)"/><rect x="13" y="43" width="24" height="3.5" rx="1.75" fill="rgba(247,246,242,.30)"/>`,
};

// On a LIGHT ground the glyph needs its ink tile (its light-coloured parts
// would otherwise vanish); on a DARK ground it is knocked straight out.
const svg = (id, px, mode) => {
  const inner = glyphs[id]();
  const tile = mode === 'tile' ? `<rect width="64" height="64" rx="17" fill="${INK}"/>` : '';
  return `<svg viewBox="0 0 64 64" width="${px}" height="${px}" style="display:block;flex:none">${tile}${inner}</svg>`;
};

const lockup = (id, mode, markPx, typePx, color) => `
      <div style="display: flex; align-items: center; gap: ${Math.round(markPx * 0.34)}px;">
        ${svg(id, markPx, mode)}
        <div style="font-size: ${typePx}px; font-weight: 700; letter-spacing: -0.02em; color: ${color};">RiskMandate</div>
      </div>`;

const concepts = [
  { id: 'A', name: 'RM Refined', idea: 'The existing monogram, optically tightened.',
    why: 'Nothing to re-learn. Every asset you already have stays valid, and the mono letterforms carry the product’s record-keeping feel.',
    watch: 'It is a two-letter box — the least ownable shape in software. It will not be remembered from across a summit hall.' },
  { id: 'B', name: 'Interval', idea: 'Brackets around a part-elapsed bar.',
    why: 'This is the product in one glyph: acceptance is bracketed and it expires. The brackets also echo the mono voice used throughout the site.',
    watch: 'Brackets are common in developer tooling; the meaning needs the tagline beside it the first few times.' },
  { id: 'C', name: 'Aperture', idea: 'Two blades closing on a window.',
    why: 'Motion built in — the acceptance window is closing. Reads at any size and animates naturally for the site and booth loop.',
    watch: 'Converging chevrons can read as “compress” or “merge”. Directionally ambiguous without context.' },
  { id: 'D', name: 'Index', idea: 'Five ascending levels.',
    why: 'Maps directly onto RAMM’s five levels and the Insurability Index. It borrows the posture of a ratings agency, which is exactly the category you are claiming.',
    watch: 'Ascending bars are the most common chart-shape in the sector. Distinctiveness has to come from the exact rhythm and the two-tone cut.' },
  { id: 'E', name: 'Seal', idea: 'An underwriter’s stamp.',
    why: 'The most institutional option. It signals counter-signature and provenance immediately to a GRC or insurance audience.',
    watch: 'Detail dies below 24px, and seals skew traditional — it can make a young company look like a compliance vendor.' },
  { id: 'F', name: 'Containment', idea: 'A core, its reach, and a hard boundary.',
    why: 'Blast radius made visible: the agent acts, and the mandate bounds it. Strong at every size and easy to extend into diagrams.',
    watch: 'Concentric circles are heavily used in security branding — the closest to generic of the eight.' },
  { id: 'G', name: 'Countersign', idea: 'A signature over a rule.',
    why: 'The only option with a human in it. Someone accepts, someone signs, someone owns it — the emotional core of the pitch.',
    watch: 'The most fragile at small sizes and the least reproducible in one colour or embroidery. Needs a simplified 16px variant.' },
  { id: 'H', name: 'Record', idea: 'The receipt an acceptance leaves behind.',
    why: 'Quiet and very ownable. It says the output of the product is an auditable record, and it sits naturally beside the mono type.',
    watch: 'Abstract without the name attached; it earns meaning over time rather than on first sight.' },
];

for (const c of concepts) {
  const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
  <style>
    body { margin: 0; font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Helvetica, Arial, sans-serif; }
    a { color: ${GREEN}; } a:hover { color: #146349; }
    .mono { font-family: ui-monospace, "SF Mono", "JetBrains Mono", "Roboto Mono", Menlo, Consolas, monospace; }
    .cap { font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; }
  </style>
</helmet>

<div style="width: 860px; height: 680px; background: #F7F6F2; color: #1A1917; box-sizing: border-box; display: flex; flex-direction: column;">

  <div style="padding: 30px 34px 22px; display: flex; align-items: flex-end; justify-content: space-between; gap: 24px; border-bottom: 1px solid #E2DFD8;">
    <div style="display: flex; flex-direction: column; gap: 7px;">
      <div class="mono cap" style="color: ${GREEN};">Concept ${c.id}</div>
      <div style="font-size: 27px; font-weight: 700; letter-spacing: -0.02em;">${c.name}</div>
      <div style="font-size: 13.5px; color: #4A4845;">${c.idea}</div>
    </div>
    ${svg(c.id, 64, 'tile')}
  </div>

  <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); flex-grow: 1;">

    <div style="padding: 26px 34px; display: flex; flex-direction: column; gap: 22px; border-right: 1px solid #E2DFD8;">
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <div class="mono cap" style="color: #8A8780;">Lockup · document surface</div>
        ${lockup(c.id, 'tile', 38, 23, '#1A1917')}
      </div>
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <div class="mono cap" style="color: #8A8780;">App icon</div>
        <div style="display: flex; align-items: flex-end; gap: 16px;">
          ${svg(c.id, 64, 'tile')}${svg(c.id, 40, 'tile')}${svg(c.id, 28, 'tile')}
        </div>
      </div>
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <div class="mono cap" style="color: #8A8780;">Small-size test</div>
        <div style="display: flex; align-items: center; gap: 18px;">
          <div style="display: flex; align-items: center; gap: 7px;">${svg(c.id, 24, 'tile')}<span class="mono" style="font-size: 10px; color: #8A8780;">24</span></div>
          <div style="display: flex; align-items: center; gap: 7px;">${svg(c.id, 20, 'tile')}<span class="mono" style="font-size: 10px; color: #8A8780;">20</span></div>
          <div style="display: flex; align-items: center; gap: 7px;">${svg(c.id, 16, 'tile')}<span class="mono" style="font-size: 10px; color: #8A8780;">16</span></div>
        </div>
      </div>
    </div>

    <div style="background: #0A0A09; color: ${FG}; padding: 26px 34px; display: flex; flex-direction: column; gap: 22px;">
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <div class="mono cap" style="color: rgba(247,246,242,.32);">Lockup · hero surface</div>
        ${lockup(c.id, 'knock', 38, 23, FG)}
      </div>
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <div class="mono cap" style="color: rgba(247,246,242,.32);">Knockout · no container</div>
        <div style="display: flex; align-items: flex-end; gap: 16px;">
          ${svg(c.id, 56, 'knock')}${svg(c.id, 32, 'knock')}${svg(c.id, 20, 'knock')}
        </div>
      </div>
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <div class="mono cap" style="color: rgba(247,246,242,.32);">In a UI bar</div>
        <div style="display: flex; align-items: center; gap: 14px; background: #0D0D0C; border: 1px solid ${'rgba(247,246,242,.10)'}; border-radius: 10px; padding: 10px 14px;">
          ${lockup(c.id, 'knock', 22, 14, FG)}
          <div style="margin-left: auto; display: flex; gap: 14px; font-size: 11.5px; color: ${F3};"><span>Index</span><span>RAMM</span><span>Pricing</span></div>
        </div>
      </div>
    </div>

  </div>

  <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); border-top: 1px solid #E2DFD8;">
    <div style="padding: 20px 34px; display: flex; flex-direction: column; gap: 7px; border-right: 1px solid #E2DFD8;">
      <div class="mono cap" style="color: ${GREEN};">Why</div>
      <div style="font-size: 13px; line-height: 1.5; color: #1A1917;">${c.why}</div>
    </div>
    <div style="padding: 20px 34px; display: flex; flex-direction: column; gap: 7px;">
      <div class="mono cap" style="color: #B45309;">Watch-out</div>
      <div style="font-size: 13px; line-height: 1.5; color: #4A4845;">${c.watch}</div>
    </div>
  </div>

</div>
</x-dc>
</body>
</html>
`;
  writeFileSync(`Concept${c.id}.dc.html`, html);
}
console.log('wrote', concepts.length, 'concept artboards');
