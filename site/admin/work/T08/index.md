# T08 — Bring docs/how-the-website-works.md to the current site

> Rendered from .claude/briefs/T08-docs-refresh.md in the repository. The text below is that file.
> Source: https://riskmandate.ai/admin/work/T08/ · noindex · written by scripts/site/build-admin.mjs

**Size:** half a day. **Touches:** `docs/how-the-website-works.md` only (and the map line for it).

## The task
The document is the best explanation of how a page is put together and it is written at
v1.0.0: 24 pages, 17 tests, four pages that fetch. The addendum at the top names what came
after. Rewrite the body so it describes the site as it is: the ABP pages and the vault tooling
(`build-abp-vault.mjs`, `build-abp-pages.mjs`, `scripts/site/abp/`), the app vault and the
loader, the Lab editions and their hash rule, the licence chrome, the brief register, the admin
page, the current test list and CI steps. Keep §9 (*what is not here any more*) as history.

## Constraints
- Every number in it must be true on the day it is committed; prefer *see `pages.json`* to a
  count that rots.
- Keep the voice: explanatory, specific, and honest about what is derived and what is hand-made.
- Do not move the vault mechanics out of the architecture brief; link to it.

## Done means
- A reader can go from this document to any file in `site/` or `scripts/site/` and know why it
  exists. The "Current as of" line names the version. `01-map.md`'s line for it is updated.
