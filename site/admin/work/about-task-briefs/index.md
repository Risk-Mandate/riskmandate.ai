# Task briefs — written to be picked up by one agent each

> Rendered from .claude/briefs/README.md in the repository. The text below is that file.
> Source: https://riskmandate.ai/admin/work/about-task-briefs/ · noindex · written by scripts/site/build-admin.mjs

Each brief is a unit of work sized for one branch, with the files it touches named so two agents
can see at a glance whether they would collide. Read `../onboarding/04-rules-of-engagement.md`
before claiming one, then write your `.claude/work/<branch>.md` naming the brief.

| Brief | Task | Touches | Size |
|---|---|---|---|
| `T01-behaviour-pages.md` | one page per behaviour, generated | `scripts/site/build-abp-pages.mjs`, `scripts/site/abp/`, `site/behaviour-*.html` (new), `site/pages.json` | a day |
| `T02-edges-per-path.md` | the grant as edges, one per path | `scripts/site/build-abp-vault.mjs`, `site/vaults/*/data/edges.json` (new, derived), the renderer | a day |
| `T03-metrics-and-links.md` | metrics and outward links on the 23 | `site/vaults/_template/data/vocabulary/` extension, the behaviour pages, Lab 03 | a day and a half |
| `T04-views-and-projections.md` | audiences as views; prompts and projections in the vault | the generator, `site/vaults/*/data/views/`, `prompts/`, `projections/`, the renderer | several days |
| `T05-research-open-questions.md` | settle the 18 open questions | `site/vaults/<slug>/data/grant.json`, one slug at a time | a day per vault |
| `T06-next-connector-vaults.md` | the next five connectors, then the three business functions | `site/vaults/<new-slug>/`, `site/vaults/index.json` | half a day each |
| `T07-lab-03-asks.md` | the request list against the model site, brought up to date | `site/lab-abp-requests.html`, an edition | two hours |
| `T08-docs-refresh.md` | bring `docs/how-the-website-works.md` to the current site | `docs/how-the-website-works.md` | half a day |
| `T09-stop-deploying-the-vault.md` | inputs in the repository, the product in the vault; drop the snapshot fallback | the two build scripts, `abp-vaults.js`, `site/vaults/`, tests, CI | half a day |
| `T10-use-case-vaults.md` | the two Voice Debrief use-case vaults, and a use-case group on the library | `site/vaults/voice-debrief-*/`, `index.json`, the library page | a day |
| `T11-consequences-and-assets.md` | the consequence layer: assets, consequences, routes out, open consequences on the delta; first for `oc433z3m` | `site/vaults/claude-gmail-connector/data/{assets,consequences}.json` (new), `build-abp-vault.mjs`, the renderer, `_template/data/` | a day |
| `T12-standards-mini-graphs.md` | GDPR, EU AI Act and ATT&CK as nodes inside the vault, titles only, for consequences and behaviours to link to | `_template/data/standards/` (new), `build-abp-vault.mjs`, the renderer, Lab 03 | a day, with T03 |

A brief is done when its *Done means* list is true, `npm run check` is green, the state file is
updated, and the branch is merged or handed over with its work file saying what is left.
