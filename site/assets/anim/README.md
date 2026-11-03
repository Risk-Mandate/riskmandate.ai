# The animations, self-hosted

Four animated slides, copied on 3 November 2026 so that this site loads nothing from another origin. Each is one
1280×720 canvas on a small slide engine, with the data it reads beside it. `embed.js` and `embed.css` are this site's
own: they put a slide in a page, play it when it scrolls into view, and give it a replay button.

| Piece | Here | Where it came from | Licence | Changed here |
|---|---|---|---|---|
| E09, mandate against grant | `studio/lab/e09/v1/` | the-ultimate-insider.presentation.sgit.ai, same path | CC BY 4.0, Dinis Cruz | yes: "delta" reads "gap"; the first stop is named "the ABP" |
| The ABP gate, Ruflo default against the ABP in enforce | `studio-ports/lab/policy-gate/` | the-ultimate-insider.presentation.sgit.ai, a port of ruv.sgit.ai's studio v4 | Apache-2.0 (`studio-ports/LICENSE-ruv-sgit.txt`) | no |
| E11, the kernel was told first | `studio/lab/e11/v1/` | the-ultimate-insider.presentation.sgit.ai, same path | CC BY 4.0, Dinis Cruz | yes: "the policy" reads "the PBP"; the footnote names RiskMandate as SHarness's maintainer |
| E12, the radius contained | `studio/lab/e12/v1/` | the-ultimate-insider.presentation.sgit.ai, same path | CC BY 4.0, Dinis Cruz | yes: "policy" reads "PBP" |
| The slide engine | `talk/engine/` | the-ultimate-insider.presentation.sgit.ai | Apache-2.0 (its own header) | no |
| The colour tokens | `assets/tokens.css` | the-ultimate-insider.presentation.sgit.ai | CC BY 4.0, Dinis Cruz | no |
| The data | `studio/data/`, `studio-ports/data/` | as above; `studio-ports/data/SOURCES.md` traces the ports' data to SGit-AI/SGit-AI__Website__Ruv at commit 47b4475 | as above | no |

Every changed file says so in a comment at the top of its `<head>`. The layout under this folder is the source's own,
so the relative paths inside each slide resolve unchanged.

What the pieces show is what their sources measured and dated: `sharness-ai hello`, six of six held, 25 October 2026,
in five environments; POC1 on Ruflo 3.56.10, eleven actions, four denied and two held for approval under the ABP. The
launcher above the agent is still the design, and E12 says so in its title. RiskMandate did not rerun any of it for
this copy.

Ruflo and its policy engine are MIT, by rUv / ruvnet. To bring another piece in: copy it with its engine, tokens and
data at the same relative paths, read every file, record it in this table, and note any change in the file itself.
