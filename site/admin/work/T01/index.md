# T01 — One page per behaviour

> Rendered from .claude/briefs/T01-behaviour-pages.md in the repository. The text below is that file.
> Source: https://riskmandate.ai/admin/work/T01/ · noindex · written by scripts/site/build-admin.mjs

**From:** `docs/briefs/direction__abp-as-a-graph-and-stakeholder-views.md` §4 item 2.
**Size:** a day. **Touches:** `scripts/site/build-abp-pages.mjs`, `scripts/site/abp/abp.css` and
`abp-vaults.js`, `site/behaviour-<id>.html` ×23 (new, generated), `site/pages.json` (unlisted
entries), `site/agent-behaviour-policy.html` (the facet links out).

## The task
The 23 capability primitives are the behaviour nodes. Give each its own page,
`behaviour-<id>.html` (dots in the id become dashes in the file name; the id stays as written on
the page): the gloss, the reach and its meaning, the undo class, and **every policy in the
library that has the edge**, each with its barrier and its door(s) (`via`), its evidence tier,
its material, and whether the mandate wants, refuses or leaves it unstated. One click from the
library's *by behaviour* facet answers *which policies can delete files*; this page is where the
click lands. Generated from the catalogue and the vault data at build time, like the vault pages.

## Constraints
- Generated, never hand-edited; `build-abp-pages.mjs --check` covers them.
- No score, no ordering by severity. Order rows by barrier (none first), then by vault as the
  library orders them.
- Where the same vault reaches the behaviour through two doors with different barriers (the n8n
  lesson), show both, one line each.
- Metrics and outward links (T03) get a placeholder section that says *not yet recorded*, not
  invented values.
- The facet on the library page links to these pages; the reverse link from each page goes to
  the library with `#behaviour=<id>` if that anchor exists, else to the library.

## Done means
- 23 pages exist, are in `pages.json` as unlisted, have twins, and pass every test.
- The library's facet entries link to them.
- A release note describes it as the graph's second visible edge; `03-state-and-next.md` moves
  row 2 to done.
