// Extracts the artboards out of the .dc.html sources into ONE plain,
// self-contained HTML page — no editor, no canvas runtime. Something you can
// open in a browser or hand to another agent to read.
import { readFileSync, writeFileSync } from 'node:fs';

const canvas = JSON.parse(readFileSync('canvas.json', 'utf8'));

const pageOf = (f) => canvas.artboards.find(a => a.file === f)?.page ?? 'page-1';
const order = canvas.artboards.map(a => a.file);

// pull the <helmet> CSS and the markup between </helmet> and </x-dc>
function extract(file) {
  const src = readFileSync(file, 'utf8');
  const css = (src.match(/<helmet>\s*<style>([\s\S]*?)<\/style>\s*<\/helmet>/) || [, ''])[1];
  const body = (src.match(/<\/helmet>([\s\S]*?)<\/x-dc>/) || [, ''])[1];
  return { css: css.trim(), body: body.trim() };
}

const LABELS = {
  'Main.dc.html': 'Concept chooser — all eight marks',
  'ConceptA.dc.html': 'Concept A — RM Refined',
  'ConceptB.dc.html': 'Concept B — Interval',
  'ConceptC.dc.html': 'Concept C — Aperture',
  'ConceptD.dc.html': 'Concept D — Index',
  'ConceptE.dc.html': 'Concept E — Seal',
  'ConceptF.dc.html': 'Concept F — Containment',
  'ConceptG.dc.html': 'Concept G — Countersign',
  'ConceptH.dc.html': 'Concept H — Record',
  'LogoUsage.dc.html': 'Guidelines 01 — Logo usage',
  'Palette.dc.html': 'Guidelines 02 — Colour',
  'Typography.dc.html': 'Guidelines 03 — Typography',
  'Components.dc.html': 'Guidelines 04 — Components',
  'Voice.dc.html': 'Guidelines 05 — Voice',
  'Collateral.dc.html': 'Guidelines 06 — Summit collateral',
};

const seen = new Set();
let allCss = '';
const sections = [];

for (const file of order) {
  const { css, body } = extract(file);
  // the artboards share most of their helmet CSS (.mono/.cap identical
  // everywhere); dedupe by rule text so the merged sheet stays small
  for (const rule of css.split(/\n(?=\s*[.\w@#])/)) {
    const r = rule.trim();
    if (r && !seen.has(r)) { seen.add(r); allCss += r + '\n'; }
  }
  sections.push({ file, page: pageOf(file), label: LABELS[file] || file, body });
}

const pages = canvas.pages || [{ id: 'page-1', name: 'Designs' }];
const notes = canvas.annotations || [];

const pageBlock = (p) => {
  const mine = sections.filter(s => s.page === p.id);
  const myNotes = notes.filter(n => (n.page || pages[0].id) === p.id);
  return `
  <h2 class="rmx-h2" id="${p.id}">${p.name}</h2>
  ${myNotes.map(n => `<div class="rmx-note">${n.text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\n/g, '<br>')}</div>`).join('\n')}
  ${mine.map(s => `
  <section class="rmx-section">
    <div class="rmx-label"><span class="rmx-label-t">${s.label}</span><span class="rmx-label-f">${s.file}</span></div>
    <div class="rmx-frame">${s.body}</div>
  </section>`).join('\n')}`;
};

const out = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>RiskMandate — brand designs</title>
<style>
/* ---- page chrome (added for this standalone export) ---- */
.rmx-body { margin: 0; background: #EFEDE7; color: #1A1917;
  font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
.rmx-wrap { max-width: 1280px; margin: 0 auto; padding: 40px 24px 80px; }
.rmx-mono { font-family: ui-monospace, "SF Mono", "JetBrains Mono", "Roboto Mono", Menlo, Consolas, monospace; }
.rmx-head { border-bottom: 1px solid #D9D5CC; padding-bottom: 24px; margin-bottom: 32px; }
.rmx-title { font-size: 32px; font-weight: 700; letter-spacing: -0.02em; margin: 8px 0 10px; }
.rmx-lede { font-size: 14px; color: #4A4845; line-height: 1.6; max-width: 720px; }
.rmx-h2 { font-size: 13px; letter-spacing: 0.14em; text-transform: uppercase; color: #1A7F5A;
  font-family: ui-monospace, "SF Mono", Menlo, monospace; margin: 44px 0 18px; }
.rmx-section { margin-bottom: 34px; }
.rmx-label { display: flex; align-items: baseline; gap: 12px; margin-bottom: 8px; }
.rmx-label-t { font-size: 14px; font-weight: 700; }
.rmx-label-f { font-size: 11px; color: #8A8780;
  font-family: ui-monospace, "SF Mono", Menlo, monospace; }
.rmx-frame { overflow-x: auto; border: 1px solid #D9D5CC; border-radius: 10px; background: #FFF; }
.rmx-frame > div { flex: none; }
.rmx-note { background: #FFF8DC; border: 1px solid #E8DFB8; border-radius: 8px;
  padding: 14px 16px; font-size: 13px; line-height: 1.55; color: #4A4845;
  max-width: 640px; margin-bottom: 20px; }
.rmx-foot { margin-top: 48px; border-top: 1px solid #D9D5CC; padding-top: 20px;
  font-size: 12.5px; color: #4A4845; line-height: 1.6; max-width: 760px; }

/* ---- merged artboard CSS (from the .dc.html sources, deduped) ---- */
${allCss}
</style>
</head>
<body class="rmx-body">
<div class="rmx-wrap">

  <div class="rmx-head">
    <div class="rmx-mono" style="font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: #1A7F5A;">RiskMandate · brand designs</div>
    <div class="rmx-title">Eight logo concepts, plus brand &amp; design guidelines</div>
    <div class="rmx-lede">Produced for the startupsummit.io exhibit. Every colour, radius and type stack is taken from the live site's v0.12 <span class="rmx-mono">:root</span> tokens — nothing invented. Each concept is drawn from something the product does (an interval, a boundary, an index, a countersignature) rather than decoration, and is shown at the sizes that actually decide whether a mark works: as a lockup on both grounds, as an app icon, knocked out with no container, in a UI bar, and at 24/20/16px.</div>
  </div>

${pages.map(pageBlock).join('\n')}

  <div class="rmx-foot">
    <strong>Notes for whoever picks this up.</strong> The guidelines pages use concept <strong>B (Interval)</strong> as a stand-in so the system reads as complete — every rule holds for whichever mark wins; swap the glyph and nothing else changes. Deliberate placeholders: <span class="rmx-mono">[NAME] [ROLE] [EMAIL]</span> on the business card, and collateral dimensions are indicative until the stand's real measurements are confirmed. The marks are plain inline SVG on a 64×64 viewBox — lift them straight out of this file. Source of truth for these designs is <span class="rmx-mono">.design-work/*.dc.html</span> in the riskmandate.ai repo (branch <span class="rmx-mono">claude/dev-session-setup-a5wcc5</span>); the concept sheets are generated by <span class="rmx-mono">gen-concepts.mjs</span>, where the glyph definitions live.
  </div>

</div>
</body>
</html>
`;

writeFileSync('riskmandate-brand-designs.html', out);
console.log(`wrote riskmandate-brand-designs.html — ${sections.length} artboards, ${(out.length / 1024).toFixed(0)} KB`);
