# claude/upbeat-fermi-vgsy7c

**Started:** 2026-09-15 · **Task brief:** ad hoc — "improve the onboarding of new agents; link the docs from the home page; make the admin section visible; rules of engagement for parallel agents"

## Scope
Land the `.claude/` onboarding tree and `CLAUDE.md`; a public `admin.html` that indexes the
docs, the records, the tooling and the agent front door; an Admin link beside Versions in every
footer and in the More menu; two tests that keep the admin page honest; a process brief in
`docs/briefs/`; and the v1.17.0 release. No ABP data changes, no vault pushes.

## Files and surfaces I expect to touch
- `CLAUDE.md`, `.claude/**` (new)
- `site/admin.html` (new) + `site/pages.json` + regenerated twins, sitemap, llms.txt, 404
- **every page**: the footer gains `· Admin` beside `Versions` (one small commit; merge fast)
- `scripts/site/new-page.mjs` (FOOTER constant), `tests/site/test_pages.mjs` (two tests)
- `docs/briefs/process__agent-onboarding-and-parallel-work.md` (new), `README.md`,
  `docs/how-the-website-works.md` (addendum)
- `site/versions/1.17.0.md` + `index.json`, the version restamp

## External state
- Vaults built and unpushed: none
- Lab editions: none (chrome change only; the hash rule strips the footer)
- Release claimed at merge: **v1.18.0** (dev took 1.17.0 first; re-cut per the rules)

## Status
- [x] onboarding tree and CLAUDE.md
- [x] admin page, footer link, menu entry, tests
- [x] process brief, README and docs pointers
- [x] release v1.18.0 on top of dev's v1.17.0, checks green
- [x] merged into dev (the lead asked for it)
- [x] second wave, v1.19.0: home page to the ABP (view / buy), the store linked, Lab out of the top level, pricing as the four levels, the vault pages on the two host frames, the use-case brief, the UX review brief, D7 and D8 registered
- [ ] not verified from this container: the host's vault-browser embed (the container cannot reach dev.vault.sgraph.ai). Check one vault page in a browser after deploy.

## Notes for whoever merges after me
The footer change touches every page. If your branch also edits footers, take mine and re-apply
yours; if you scaffolded a page from a pre-Admin donor, `new-page.mjs` now carries the link and
the test will tell you.
