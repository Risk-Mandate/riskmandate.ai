# claude/dev-session-setup-a5wcc5

> Rendered from .claude/work/claude-dev-session-setup-a5wcc5.md in the repository. The text below is that file.
> Source: https://riskmandate.ai/admin/work/branches/claude-dev-session-setup-a5wcc5/ · noindex · written by scripts/site/build-admin.mjs

**Started:** 2026-09-26 · **Agent session:** the lead's long-running session · **Task brief:** ad hoc, from the lead's memo after v1.34.18

## Scope
Move the stories under `site/stories/` (served as `/stories/`), with a *Reading* entry in the header
beside Articles and redirect stubs at the old addresses; make the generator, the tests and the menu
module folder-aware; seed the stories vault (Email-FS-lite: folders, briefs, first messages and tasks,
the board and its app) under `stories-vault/seed/` with the tooling in `scripts/stories/mail.mjs`;
write the architecture brief; render the board on the stories page. Not in scope: the vault's birth
(needs the key), the scheduled check-in (needs the key and a token in the environment), stories.sgit.ai.

## Files and surfaces I expect to touch
- `site/stories/**` (data, images, generated pages and twins, `board.json`); stubs `site/stories.html`, `site/story-*.html`
- `scripts/site/build-stories.mjs`, `scripts/site/generate.mjs`, `tests/site/test_pages.mjs`, `site/pages.json`
- **every page**: `scripts/site/modules/menu.js` (a base for pages in a folder) via `sync-modules.mjs` — merge fast
- `scripts/stories/mail.mjs`, `stories-vault/**`, `docs/briefs/architecture__the-stories-vault-…md`, onboarding, the register's D29 links, `site/articles.html`

## External state
- Vaults built and unpushed: none. The stories vault does not exist yet; the seed waits for the key.
- Lab editions I will cut: none
- Release I will claim at merge: yes, 1.34.19

## Status
- [x] stories under `/stories/`, menu, stubs, tests, generator
- [x] seed, tooling, board, brief
- [ ] release, merge, deploy

## Notes for whoever merges after me
The menu module changed on every page (`RM.data.base`); rerun every builder after merging `dev` in,
then `sync-modules.mjs`, then `generate.mjs`.
