# The map

One line per thing. Paths are from the repository root; site pages are also live at
`https://riskmandate.ai/<file>` with a markdown twin at `<file>.md`.

## Documents in the repository (`docs/`)

| File | What it is | Read when |
|---|---|---|
| `docs/how-the-website-works.md` | How a page is put together, the shared modules, generated files, the pipeline, the tests. Written at v1.0.0 with an addendum for what came after | touching chrome, modules, menu, CI |
| `docs/briefs/direction__abp-at-the-centre.md` | 11 Sept. The ABP becomes the primitive the site sells; the label/record/prescription stack; naming rules; what is honest to say | any ABP work; the naming rules live here |
| `docs/briefs/direction__abp-as-a-graph-and-stakeholder-views.md` | 15 Sept. Behaviours are addressable nodes; barrier per path; views per audience; projections regenerable from a shipped prompt. The build order | building the graph, views, projections |
| `docs/briefs/architecture__vaults-in-vaults-for-behaviour-policies.md` | 15 Sept. The renderer lives once in an app vault; every application vault carries a loader; the sub-vault link format | touching the vault app, the loader, or `_app/` |
| `docs/briefs/review__first-measured-abp-n8n-owner-key.md` | 15 Sept. The first measured grant read against the model; where the write-up and the vocabulary disagree; two asks for the model site | writing a measured vault; understanding evidence tiers |
| `docs/briefs/research__connector-grants-open-questions.md` | 15 Sept. Five connector vaults at the documented tier; the brief for the research agent; the queue of five more | researching a vault; adding a connector vault |
| `docs/briefs/vaults__what-to-add-to-the-site.md` | 9 Sept. Which of the 26 public sgit vaults belong on the site and why the rest do not | adding a demo |
| `docs/briefs/review__design-studio-mvps-vs-the-selling-workflow.md` | 14 Sept. The storefront concepts read against the selling workflow | storefront, checkout, pricing |
| `docs/briefs/summit__lisbon-2026-strategy.md` | 9 Sept, partly superseded. Event logistics, the graph vault, the two days | summit pages |
| `docs/briefs/summit__lisbon-2026-messaging.md` | 11 Sept. What to say in the room now there is something to sell | summit pages, booth materials |
| `docs/briefs/architecture__structure-content-decoupling.md` | July. Structure in the repo, content in vaults, decrypted in the browser | `/scenarios/`, content vaults |
| `docs/briefs/implementation__scenarios-pilot.md` | July. The pilot as built at `site/scenarios/` | `/scenarios/` |
| `docs/briefs/process__agent-onboarding-and-parallel-work.md` | 15 Sept. Why this folder exists and the rules for agents working in parallel | you are reading its product |
| `docs/marketing/linkedin-company-page.md` | Every field of the company page, ready to paste | LinkedIn |

Brief naming: `<kind>__<slug>.md` with kind one of `direction`, `architecture`, `implementation`,
`review`, `research`, `summit`, `vaults`, `process`. Header block: date, author `@website-agent`,
trigger, what it reads against. Numbered sections. End with what it does not settle, or decisions
needed.

## The site (`site/`), by family

| Family | Files | Source of truth |
|---|---|---|
| Home | `index.html` | hand-authored. Leads with the ABP; the ladder says we are on rung one |
| The problem | `plug`, `acceptable`, `acceptance`, `grant-gap` | hand-authored, older voice |
| The model | `abp.html` (the ABP page), `how-it-works`, `agents` (llms.txt etc.), `ramm`, `scenarios`, `statics` | hand-authored |
| Behaviour policies | `agent-behaviour-policy.html` (the library, top-level), `agent-behaviour-policy-next.html` (asked for, vote, suggest), `abp-vault-<slug>.html` ×15 | **generated** by `build-abp-pages.mjs` from `site/vaults/index.json` and each vault's data. `abp-vaults.html` and `abp/` redirect |
| Vaults | `site/vaults/<slug>/` ×15, `_template/`, `_app/` | inputs: `vault.json`, `data/grant.json`, `data/mandate.json`, `data/scenarios.json`, `data/vocabulary/`. Everything else **generated** by `build-abp-vault.mjs` |
| Live demos | `demos.html`, `demo-*.html` ×6 | hand-authored; each embeds an sgit vault with a public read key |
| Lab | `lab.html`, `lab-*.html` ×7 | hand-authored; every meaningful state cut as a dated PDF in `assets/lab/`, registered in `lab-editions.json` |
| Summit | `summit.html`, `summit-booth.html` (private) | hand-authored |
| More | `questions`, `briefs` (the register page), `work`, `work-abp-power-user`, `library`, `partners`, `feedback`, `brand`, `pricing`, `admin` | hand-authored |
| Records | `versions.html` + `versions/index.json` + `versions/<v>.md`; `briefs.html` + `briefs-register.json` + `assets/briefs/`; `lab-editions.json`; `vaults/index.json` | append-only. Never rewrite an entry |
| Machine-readable | `llms.txt`, `llms-full.txt`, `.well-known/agent-content.json`, `sitemap.xml`, `robots.txt`, `404.html`, every `<page>.md` | **generated** by `generate.mjs` (the manifest and full text are partly hand-written and restamped) |
| Scenarios pilot | `site/scenarios/` | reads vault `dm42qcaw` in the browser; needs `localhost` |

`site/pages.json` lists every page with its menu group. `unlisted` = real page, not in the menu.
`private` = also out of the sitemap, llms.txt and the twins, and noindex. At most 7 top-level
menu entries (a group counts as one).

## Scripts (`scripts/site/`)

| Script | Does | Idempotent | In CI |
|---|---|---|---|
| `generate.mjs [--check]` | twins, sitemap, llms.txt, robots, 404, versions.md, menu injection | yes | yes |
| `release.mjs <v> "<title>"` | notes stub, index.json entry, restamp every page, `riskmandate_ai/version`, `pyproject.toml` | no — once per version | no |
| `new-page.mjs <name> --title --desc [--css] [--body] [--donor]` | scaffold a page with the current chrome | once | no |
| `build-abp-vault.mjs <slug> [--check]` | derive one vault from its inputs; deterministic zip; refuses if it cannot reproduce an upstream delta | yes | yes, every vault |
| `build-abp-pages.mjs [--check]` | the library page and one page per vault from the catalogue | yes | yes |
| `render-abp-vault-pdf.mjs` | the PDF in a vault's `dist/` (Playwright) | yes | no |
| `add-licence-chrome.mjs [--check]` | GitHub link in the header, licence line in the footer, every page | yes | yes |
| `sync-modules.mjs [--check]` | push `scripts/site/modules/*.js` into every page that inlines it | yes | yes |
| `render-lab-pdfs.mjs [slug] [--all] [--check]` | cut a dated PDF edition of a Lab page when its content hash moved; register it | yes | yes (check) |
| `render-booth-panel.mjs`, `render-business-card.mjs`, `render-brand-exports.mjs` | print assets | yes | no |
| `scripts/site/abp/` | the library page's CSS and JS, and the product marks; live once, injected at build | — | — |
| `scripts/site/modules/` | the shared page modules, one source each | — | — |
| `scripts/run-locally__riskmandate_ai.sh [PORT]` | serve `site/` on localhost after regenerating | — | no |
| `scripts/migrate/` | the one-off that made v1.0.0 from the vault. History | — | no |

`npm run check` runs everything CI runs. `npm run editions` cuts editions then regenerates.

## Tests (`tests/site/`)

`node --test tests/site/*.mjs`. `test_pages.mjs`: whole documents, one close, no host frame,
every internal link and anchor resolves, canonical + twin, private pages hidden, one version
everywhere, one menu everywhere, version record shape, sitemap = published pages, pages.json =
site/, Lab editions match digests and are linked, brief register matches digests and archive,
no read key on a Lab mockup, no write credential anywhere, every doc linked from admin.html,
Admin beside Versions in every footer. `test_scenarios_schema.mjs`: the scenarios content contract.

## CI (`.github/workflows/ci-pipeline.yml`)

On push to `qa`, `dev`, `main`: check (tests + every `--check`) → tag `v<latest>` if untagged →
upload `site/` → deploy to Pages. **Any of the three branches deploys the one live site.**

## Outside the repository

| Thing | Where | Ours to write? |
|---|---|---|
| The ABP model, vocabulary, five worked examples | `https://abp.sgit.ai/` (v0.3.0 pinned in every vault) | no; Lab 03 is our request list against it |
| The store and its tiers | `https://store.sgit.ai/` | no |
| The research home | `https://risks.sgit.ai/` | no |
| The 15 application vaults + the app vault `fl3i7lu4` | sgit, endpoint in `site/vaults/index.json` | yes, with write keys the lead holds |
| The scenarios content vault `dm42qcaw` | sgit | content agents |
| The demo vaults | sgit, public read keys on the demo pages | no |
| The vault host the buyer opens a vault in | `dev.vault.sgraph.ai` | no |
| Design canvases (brand, concepts) | `.design-work/` | yes |
