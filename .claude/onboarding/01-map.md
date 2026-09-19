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
| `docs/briefs/direction__use-case-driven-policies-and-the-prompt-workflow.md` | 15 Sept. A policy per use case (Voice Debrief first); the £500 level is a prompt the customer runs, in seven steps; what the store and the site must both say | pricing, the store, use-case vaults |
| `docs/briefs/review__vault-pages-vs-the-vault.md` | 15 Sept. The vault pages read against the vault: the two host frames, and why the site should stop deploying the vault (T09) | touching the vault pages or `site/vaults/` |
| `docs/briefs/workflow__buying-a-policy-for-claude-on-gmail.md` | 16 Sept. The purchase workflow made concrete for one customer: the steps, the vault mapped, the settings, the prompts, what a measured run taught | delivering a level-3 or level-4 policy; any connector vault |
| `docs/briefs/direction__mvp-vault-and-the-reading-app.md` | 16 Sept. `oc433z3m` as the first MVP vault: the store's mock-up read for the vault's left navigation and positioning; the feature list per level; the dual licence as `LICENCE.md` + a `licence` block; the reading app redrawn; four decisions for the lead | the renderer, the vault page, the licence |
| `docs/briefs/direction__consequences-assets-and-the-vault-as-a-website.md` | 16 Sept. A grant is a union of capabilities; the reader needs consequences, explicit, each with the asset that makes it real; routes out counted; standards as mini-graphs in the vault; *Who are you?* in the app (T11, T12; amends T04) | the grant, the consequence layer, the audiences |
| `docs/briefs/direction__the-grant-has-storeys-and-the-vault-opens-on-the-audience.md` | 16 Sept. The grant has storeys: what the credential permits, what the client exposes, what practice allows, then the consequences; latent capability is the gap between the first two; every barrier gains who holds it and whether it moves without you; the vault opens on Executive · Operator · Risk | the grant model, the reading app, any connector vault |
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
| Insurance, the answer page | `insure-a-program.html` | hand-authored, 18 Sept 2026; every claim dated and linked to its source; the AIUC blueprint (July 2026) and RAND RR-A5130-1 (16 Sept 2026) are the two anchors |
| The model | `abp.html` (the ABP page), `how-it-works`, `agents` (llms.txt etc.), `ramm`, `scenarios`, `statics` | hand-authored |
| Behaviour policies | `agent-behaviour-policy.html` (the library, top-level), `agent-behaviour-policy-next.html` (asked for, vote, suggest), `abp-vault-<slug>.html` ×15 | **generated** by `build-abp-pages.mjs` from `site/vaults/index.json` and each vault's data. `abp-vaults.html` and `abp/` redirect |
| Vaults | `site/vaults/<slug>/` ×15 pushed + `claude-gmail-connector` built and unpushed, `_template/`, `_app/`; instances (a customer's copy, anonymised) under `vaults-instances/`, built with `ABP_VAULT_DIR=…` and never deployed | inputs: `vault.json`, `data/grant.json`, `data/mandate.json`, `data/scenarios.json`, `data/vocabulary/`. Everything else **generated** by `build-abp-vault.mjs` |
| Live demos | `demos.html`, `demo-*.html` ×6 | hand-authored; each embeds an sgit vault with a public read key |
| Lab | `lab.html` (in *More*), `lab-*.html` ×7 (unlisted, linked from `lab.html`) | hand-authored; every meaningful state cut as a dated PDF in `assets/lab/`, registered in `lab-editions.json` |
| Summit | `summit.html`, `summit-booth.html` (private) | hand-authored |
| More | `lab` (the Lab moved here from the top level in v1.19.0), `questions`, `briefs` (the register page), `work`, `work-abp-power-user`, `library`, `partners`, `feedback`, `brand`, `admin/` (a `link` entry: a folder, not a page) | hand-authored |
| Pricing | `pricing.html` | hand-authored; the store's four levels, each linked to `store.sgit.ai/d/t<n>/`; the level-3 prompt workflow; the plus-one-thing rule and a definition of done per level (v1.19.1) |
| After payment | `paid-t1.html` … `paid-t4.html` (unlisted, noindex) | hand-authored (scaffolded with `new-page.mjs`); one per level, the payment link's success address: what arrives and when, what you do next, how the key reaches you, the definition of done, who to write to. `paid-t1.html` is the download: its zip manifest (`/*__DIST__*/`) is **stamped** by `build-abp-pages.mjs` from `site/vaults/*/dist/`. `after-payment.html` (in *More*) is the debrief for the store team: the link contract and what the store has to do. Brief D9 |
| Records | `versions.html` + `versions/index.json` + `versions/<v>.md`; `briefs.html` + `briefs-register.json` + `assets/briefs/`; `lab-editions.json`; `vaults/index.json` | append-only. Never rewrite an entry |
| Machine-readable | `llms.txt`, `llms-full.txt`, `.well-known/agent-content.json`, `sitemap.xml`, `robots.txt`, `404.html`, every `<page>.md` | **generated** by `generate.mjs` (the manifest and full text are partly hand-written and restamped) |
| Scenarios pilot | `site/scenarios/` | reads vault `dm42qcaw` in the browser; needs `localhost` |
| Admin console | `site/admin/**` (53 pages + twins) and `site/admin/console.css` | **generated** by `build-admin.mjs` from `docs/`, `.claude/`, the brief register, the state file, the catalogue and each vault's data; public, noindex, not in `pages.json`, its own rail. `admin.html` is a redirect stub. Adopted from `store.sgit.ai/admin/` |

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
no read key on a Lab mockup, no write credential anywhere, Admin beside Versions in every footer.
`test_admin.mjs`: the console exists, every `docs/**/*.md` has a console page, every console page
is noindex with a twin and a rail, every console link resolves, the console is in no sitemap or
llms file, no write credential there either, `admin.html` redirects to `admin/`.
`test_scenarios_schema.mjs`: the scenarios content contract.

## CI (`.github/workflows/ci-pipeline.yml`)

On push to `qa`, `dev`, `main`: check (tests + every `--check`) → tag `v<latest>` if untagged →
upload `site/` → deploy to Pages. **Any of the three branches deploys the one live site.**

## Outside the repository

| Thing | Where | Ours to write? |
|---|---|---|
| The ABP model, vocabulary, five worked examples | `https://abp.sgit.ai/` (v0.3.0 pinned in every vault) | no; Lab 03 is our request list against it |
| The store: four levels, `/policies/` by application, `/p/<slug>/` (our slugs), `/d/t1..t4/` per level | `https://store.sgit.ai/` (v0.1.7, live 15 Sept) | no; a separate agent maintains it |
| The research home | `https://risks.sgit.ai/` | no |
| The 15 application vaults + the app vault `fl3i7lu4` | sgit, endpoint in `site/vaults/index.json` | yes, with write keys the lead holds |
| The scenarios content vault `dm42qcaw` | sgit | content agents |
| The demo vaults | sgit, public read keys on the demo pages | no |
| The vault host the buyer opens a vault in | `dev.vault.sgraph.ai` | no |
| Design canvases (brand, concepts) | `.design-work/` | yes |
