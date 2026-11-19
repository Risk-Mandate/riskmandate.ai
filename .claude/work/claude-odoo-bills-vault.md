# claude/odoo-bills-vault

**Started:** 2026-11-19 · **Agent session:** https://claude.ai/code/session_018yvwtR5QXpatuyNUw5q8jz · **Task brief:** ad hoc, the lead's instruction to publish the Odoo demo as a RiskMandate example

## Scope
Add one behaviour-policy template vault, `odoo-bills-integration-user`: an agent holding the API
key of a narrow integration user on a self-hosted Odoo 20 Community database, for turning supplier
documents into draft vendor bills. The grant is measured, on an ephemeral Odoo 20.0-20261112
Community instance we stood up and ran ourselves on 16 November 2026 and then tore down; the
session record is in the vault's `history/`. Documented rows and open questions quote Odoo's own
pages, dated. Catalogue entry added without `vid`/`key`. No change to the renderer, the library
page code or any other vault.

## Files and surfaces I expect to touch
- `site/vaults/odoo-bills-integration-user/` — inputs (`vault.json`, `data/grant.json`, `data/mandate.json`, `data/scenarios.json`, `history/grant-measured--2026-11-16.md`); everything else derived
- `site/vaults/index.json` — one new entry, no `vid`/`key`
- `scripts/site/abp/logos.json` — one icon added (`odoo`)
- `agent-behaviour-policy.html` and its twin, regenerated
- `.claude/onboarding/03-state-and-next.md` — one line

## External state
- Vaults built and unpushed: `odoo-bills-integration-user` — the push is owed by the lead, then `vid` and `key` go into `site/vaults/index.json` and the pages are rebuilt
- Lab editions I will cut: none
- Release I will claim at merge: yes, a patch

## Status
- [x] vault inputs written
- [x] built and `--check` green: grant 7 (7 measured), mandate 4, excess 3, unbounded 3, shortfall 0, aligned 4
- [x] catalogue entry (no `vid`/`key`), pages, generate, `npm run check` green
- [x] onboarding line
- Open questions in the vault: **4** (`research_needed`); contradictions: 2

**The vault is built and unpushed.** The push to sgit is owed by the lead: then `vid` and `key` go
into its catalogue entry, `build-abp-pages.mjs`, `generate.mjs`, and the counts move from sixteen to
seventeen (the home page test lists `seventeen` already).

## Notes for whoever merges after me
Four scripts treated every catalogue entry as published, which contradicts the workflow's own rule
that an entry without `vid` and `key` is built and unpushed. Each now counts pushed entries only,
the way `build-abp-pages.mjs` already did: the home page count test (`tests/site/test_pages.mjs`),
the rules page coverage (`build-rules.mjs`), the pitch deck's shape count (`render-pitch-deck.mjs`)
and the admin console's vault table (`build-admin.mjs`, which now links an unpushed vault to its
folder and says *not pushed*). No published number changed.

The measuring session was a cloud agent working for the lead (Dinis Cruz), on its own instance of
Odoo Community (LGPL-3), never on anybody else's system. Odoo's AI agents and MCP server are
Enterprise modules and were not run; everything said about them is documented, quoted and dated,
or an open question.
