# Tooling and the gate

> The maintenance scripts behind riskmandate.ai, which of them run in CI, and the five steps a change takes from a branch to the live site.
> Source: https://riskmandate.ai/admin/tooling/ · noindex · written by scripts/site/build-admin.mjs

`site/` is what is served, byte for byte. The scripts under `scripts/site/` derive the files that must agree with the pages, and every one with a `--check` runs in CI so a page cannot ship with a stale twin, a hand-edited delta or a missing licence line.

| Script | Does | In CI |
|---|---|---|

| `generate.mjs` | The markdown twin of every page, `sitemap.xml`, `llms.txt`, `robots.txt`, `404.html`, `versions.md`; injects the menu from `pages.json` | yes |
| `build-admin.mjs` | This console: every page under `site/admin/` and its twin, read off the repository | yes |
| `release.mjs` | Cuts a version: the notes stub, the index entry, the version chip on every page, the package version | no |
| `new-page.mjs` | Scaffolds a page with the current chrome copied from a donor page, so a new page cannot drift from the site it joins | no |
| `build-abp-vault.mjs` | Derives one behaviour-policy vault from its inputs: the documents, the delta, the validity statement, a deterministic zip, the loader, the history. Refuses to write a delta it cannot reproduce | yes, every vault |
| `build-abp-pages.mjs` | The library page and one page per vault, from the catalogue and each vault's data; stamps the download manifest | yes |
| `render-lab-pdfs.mjs` | Cuts a dated PDF edition of a Lab page when its content moved, and registers its digest | check only |
| `add-licence-chrome.mjs` | The GitHub link in every header and the licence line in every footer | yes |
| `sync-modules.mjs` | Pushes a change to a shared JS module into every page that inlines it | yes |
| `render-abp-vault-pdf.mjs, render-booth-panel.mjs, render-business-card.mjs, render-brand-exports.mjs` | Print and download assets, rendered from the pages with a headless browser | no |

## The gate

- **The tests** are `node --test tests/site/*.mjs`: whole documents, every internal link and anchor, one version and one menu everywhere, the sitemap, the registers against their digests, no read key on a mockup, no write credential anywhere, every document under `docs/` rendered here.

- **The pipeline** is `.github/workflows/ci-pipeline.yml`: on a push to `dev`, `qa` or `main` it runs the checks, tags the commit with the version the record declares, and deploys `site/` to GitHub Pages. Any of the three deploys the one live site.

- **Locally**, `bash scripts/run-locally__riskmandate_ai.sh` serves the site on `localhost`, which matters: the vault pages decrypt in the browser and need a secure context.

- **Everything CI runs** is one command, `npm run check`. If it is not green, the change is not done.

## How a change ships

- **Branch from `dev`, and say what you are doing**

One file in `.claude/work/` names the branch, its scope, the files it will touch and the vaults it will push. Other agents read it before they start.

- **Edit the page, then regenerate**

The page is the source; its twin, the sitemap and the index are derived. Generated files are never hand-edited and never hand-merged.

- **Check**

`npm run check` is the gate, locally and in CI.

- **Merge `dev` in, then cut the release last**

The version restamps every page, so it is the final commit before the merge and the number is claimed at merge time. Move the third number by default. The note says what changed, why, and what was deliberately not done.

- **Merge into `dev`, which is live**

CI checks, tags `v<version>`, and deploys. A wrong deploy is fixed forward with the next release; nothing is force-pushed.
