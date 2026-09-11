# How riskmandate.ai actually works

How a page is put together, what happens when the browser loads one, and where
each thing lives. Current as of **v1.0.0**.

## The one-paragraph version

`site/` is the website. GitHub Pages serves that directory byte for byte —
there is no build step, no framework, no bundler and no server. Each page is a
single self-contained HTML document: its own `<style>`, its own `<script>`, its
own data inlined at the top. Open one with `file://` and it renders. Navigation
between pages is `<a href>`; the shared header is drawn by one small custom
element that every page carries a copy of. Four pages fetch something at
runtime, and only from the same origin.

Before v1.0.0 all of this lived in an SG/Vault and was served through a host
`<iframe>`. [`site/versions/1.0.0.md`](../site/versions/1.0.0.md) is the record
of that change.

---

## 1. What the browser does

```
GET https://riskmandate.ai/plug.html
  └─ Pages serves site/plug.html — one document, ~58KB, nothing else required
       <style>   the whole page's CSS, tokens first
       <body>    the markup, including <rm-menu> and any page components
       <script>  one IIFE: RM.data (inlined), then each component, then boot

  1. custom elements self-register as the script runs
  2. boot.js calls RM.components.nav.wire(document)
  3. <rm-menu> renders the header from RM.data.pages  → <a href> per page
  4. page components render their own content
```

No page waits on anything to become readable: the prose is in the document the
server sent. Components add the interactive parts on top.

## 2. The anatomy of a page

Every page is the same five things in the same order.

| | What | Why it is inline |
|---|---|---|
| `<head>` | title, description, canonical URL, Open Graph, favicon, and a `<link rel="alternate">` to the page's markdown twin | crawlers and link unfurls read the document, not a manifest |
| `<style>` | design tokens on `:root`, then the shared header rules, then this page's own | one request per page; a page can't render half-styled |
| `<body>` | `<header class="top">` with `<rm-menu>` and the version link, the content, the footer | — |
| `<script>` | `RM.data` — this page's name and the site's page list, as JSON | the menu is identical everywhere and needs no fetch |
| | the components, then `boot.js` | plain concatenation, source order matters |

### Design tokens

Declared on `:root` in every page, identical everywhere:

```
--bg #F7F6F2   --bg2 #EFEDE7   --card #FFFFFF  --ink #0D0D0C   --canvas #0A0A09
--text #1A1917 --muted #4A4845 --faint #8A8780 --border #E2DFD8
--green #1A7F5A --green-2 #22c55e --greenBg #EBF5F0
--gold #B45309 --red #C0392B --blue #1D4ED8
--wrap 1000px  --r 10px  --r-sm 8px
```

Colours in a page are tokens. A literal hex outside `:root` is a bug, except
inside the brand SVG, which is a fixed artwork.

## 3. The components

Four are on every page. The rest are on the one or two pages that need them.

**On all 24 pages**

- `components/dom.js` — `el()` builds an element with attributes and children;
  text always goes in through `textContent`. `renderMarkdownInto()` turns
  markdown tokens into DOM nodes, never an HTML string, so fetched content
  cannot inject markup. Links are scheme-checked before they become `<a href>`.
- `components/nav.js` — the two behaviours that are not links: `[data-to]`
  scrolls in-page, `[data-demo]` opens a pre-filled mailto. It also injects the
  mobile drawer, so every page gets a working menu under 880px from one file.
- `components/menu.js` — `<rm-menu>`. Renders the header from `RM.data.pages`:
  an `<a>` per page, contiguous pages sharing a `group` collapsing into a
  dropdown. The group header is the only `<button>` in the menu, because it
  opens a panel rather than going anywhere.
- `boot.js` — `nav.wire(document)`, on DOMContentLoaded.

**Where needed**

| Component | Pages | What it does |
|---|---|---|
| `registry`, `vault-demos`, `vault-page` | the 6 demo pages + `demos.html` | the demo catalogue and the embed that opens each demo's own SG/Vault with its own public read key |
| `risk-queue`, `data` | `index`, `acceptance`, `grant-gap` | the acceptance-queue figure |
| `io` | `feedback`, `library`, `versions` | `RM.services.siteIo` — a same-origin `fetch`, and the only runtime IO in the site |
| `markdown`, `version`, `versions` | `versions` | the version record |
| `library`, `media` | `library` | articles from `assets/library/library.json`, talks and the deck from `assets/media/media.json` |
| `insurability` | `index` | the Insurability Index card |
| `plug-profile`, `state-grid`, `scenarios`, `statics`, `ramm-figure`, `ramm-pyramid`, `brand`, `options`, `loop`, `prompt`, `window-picker` | one page each | that page's figure or interaction |

Components never use `innerHTML`. Everything is built with `dom.el` and
`textContent` — which is what makes it safe to render a markdown file that was
fetched at runtime.

## 4. The four pages that fetch

Everything else is complete in the document. These four are not, and each has a
reason:

- **`library.html`** — articles and their artwork come from `assets/library/`,
  so the copy can change without touching the page. Images load lazily as cards
  scroll in.
- **`versions.html`** — reads `versions/index.json`, then each release's notes
  on demand. Inlining 36 notes would make a 100KB page whose contents you could
  only read by reading the page; this way every entry links to the bytes it was
  rendered from.
- **`feedback.html`** — its interview prompt lives in `assets/`.
- **`/scenarios/`** — the pilot. Unlike the rest of the site it reads an
  **SG/Vault** (`dm42qcaw`) directly in the browser, decrypting with Web Crypto.
  That needs a secure context, which is why local development uses `localhost`
  and not `127.0.0.1`. See `docs/briefs/implementation__scenarios-pilot.md`.

The live demos also load vaults — but in their own `<iframe>`, from
`dev.vault.sgraph.ai`, each with its own published read key. Those keys are
public by design. No write credential of any kind belongs in `site/`, and a
test asserts none is there.

## 5. Versions

The number in the header is the site version. It links to `versions.html`,
which renders `versions/index.json` plus one markdown note per release —
36 of them, 35 carried over from the vault and flagged `reconstructed` because
the builds they describe are not in this repository.

Cutting a release is deliberate:

```bash
node scripts/site/release.mjs 1.0.1 "What changed, in a line"
# writes site/versions/1.0.1.md, updates index.json, restamps every page's
# version chip, and updates riskmandate_ai/version
```

Then write the notes, commit, push. CI checks the three places agree, tags that
commit `v1.0.1`, and deploys. Nothing increments the version on your behalf — a
release is a note somebody wrote, and the tag is what lets `versions/index.json`
name the commit each release was built from.

## 6. Generated files

`node scripts/site/generate.mjs` rebuilds everything in `site/` that is derived
from something else:

| File | Derived from |
|---|---|
| `<page>.md` | that page's prose. Anything a component renders at runtime is in the page, not the twin. |
| `sitemap.xml`, `404.html` | the page list in `index.html` |
| `llms.txt` | the page list plus each page's title and description |
| `robots.txt` | fixed |
| `versions.md` | `versions/index.json` |

They are committed, not built at deploy time — `site/` is served exactly as it
is in the repository. `generate.mjs --check` fails if any of them is stale, and
runs as a CI gate, so a page cannot ship with a twin that contradicts it.

## 7. The pipeline

`.github/workflows/ci-pipeline.yml`, on push to `qa`/`dev`/`main` or manual
dispatch:

```
check          node --test tests/site/*.mjs
               node scripts/site/generate.mjs --check
   ↓
tag            tag this commit v<versions/index.json:latest>, if not already tagged
   ↓
build          touch site/.nojekyll, upload site/ as the Pages artifact
   ↓
deploy         actions/deploy-pages
```

The deploy always follows the tag, so the live site never claims a version that
resolves to nothing.

## 8. Tests

`node --test tests/site/*.mjs` — 17 checks, no dependencies:

- every page is a whole document with a title and description
- no page talks to a parent window (the host frame is gone and stays gone)
- every internal link resolves to a file that exists
- every page has a canonical URL and a markdown twin, and the twin is there
- every page shows the same version, and it matches `versions/index.json` and
  `riskmandate_ai/version`
- the menu is the same list everywhere and every entry is a real page
- the version record is newest-first, every entry has its notes and names its
  source, and vault-era entries are labelled reconstructed
- the sitemap lists every page and nothing else
- no write credential ships in `site/`
- the scenarios content contract (6 checks against a real vault fixture)

## 9. What is not here any more

- **`vault_publisher/`** — cloned `7rfetjwz` and published it. Nothing publishes
  from a vault now.
- **`web_overlay/`** — pages overlaid onto the publisher's output. `site/` is
  the output; there is nothing to overlay onto. The scenarios pilot moved to
  `site/scenarios/`.
- **`site/v0/`** — twelve frozen design snapshots, ~759KB, reachable through a
  dropdown. They are in vault `7rfetjwz`, which is kept.
- **the host shell** — a 9KB `index.html` that loaded a version page into an
  `<iframe srcdoc>` and routed navigation over `postMessage`. It gave the whole
  site one URL. Deep links, bookmarks, opening in a new tab and search indexing
  all now work because it is gone.

`scripts/migrate/collapse-to-v1.mjs` is the one-off that did the conversion. It
is kept as the statement of what "reconstructed" means for v1.0.0 — run it
against a fresh clone of the vault and it reproduces the snapshot. Nothing in
CI runs it.
