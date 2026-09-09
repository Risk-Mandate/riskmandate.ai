# Brand canvas — working files

Source for the **RiskMandate Brand** design canvas:
<https://claude.ai/code/artifact/d94a8a29-9f68-4286-9bbc-f2e4253a8903>

Eight logo concepts (page 1) plus brand & design guidelines (page 2), produced
for the startupsummit.io exhibit. All colours, radii and type stacks are lifted
from the live site's tokens (`v0/v0.12/…` `:root`), not invented.

## Files

| File | Role |
|---|---|
| `Main.dc.html` | the concept chooser — all eight marks side by side |
| `ConceptA…H.dc.html` | one sheet per concept (generated — see below) |
| `gen-concepts.mjs` | generator for the eight concept sheets; the glyphs live here |
| `LogoUsage / Palette / Typography / Components / Voice / Collateral` | the guidelines pages |
| `canvas.json` | canvas layout, pages, sticky notes |
| `riskmandate-brand.html` | **generated, gitignored** — the published canvas (~2.6 MB; embeds the editor) |

## Changing the design

Edit the `.dc.html` sources (for the concept sheets, edit `gen-concepts.mjs` and
re-run `node gen-concepts.mjs`), then re-seed and republish to the **same file
path** — that keeps the artifact URL above:

```bash
B="<design skill base dir>"
node "$B/seed-canvas.mjs" --template "$B/payload.template.html" \
  --out riskmandate-brand.html --title "RiskMandate Brand" \
  --artboard Main.dc.html --artboard ConceptA.dc.html … \
  --canvas canvas.json
node "$B/seed-canvas.mjs" --check riskmandate-brand.html
```

## Note on the marks

The guidelines pages use **concept B (Interval)** as a stand-in so the system
reads as complete. Once a direction is chosen, swap the glyph — every rule in
the guidelines holds for any of the eight marks.

Placeholders left deliberately: `[NAME]`, `[ROLE]`, `[EMAIL]` on the card, and
the collateral dimensions are indicative until the stand's real measurements are
confirmed.
