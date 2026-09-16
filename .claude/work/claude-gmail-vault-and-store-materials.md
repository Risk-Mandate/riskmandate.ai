# claude/gmail-vault-and-store-materials

**Started:** 2026-09-16 · **Task brief:** ad hoc — "a) a specific vault example: Claude chat
connected to a Gmail inbox; b) better materials and screenshots for the product page at
store.sgit.ai/lab/product/"

## Scope
(a) A new documented-tier vault, `claude-gmail-connector`: Claude.ai chat with the official
Gmail connector enabled (not the raw `gmail.readonly` OAuth scope already covered by
`gmail-readonly`, not the generic `claude-web-connectors` shape). Researched from Anthropic's
own connector documentation, dated, quoted. Moves `claude-google-workspace-connector` in
`asked_for` — or adds a narrower sibling — per what the vendor page actually documents.

(b) Screenshots and copy for store.sgit.ai's product lab page. The store is a separate site
maintained by a different agent; this branch produces the material (screenshots of the new
vault and the library, copy blocks) rather than editing that repository, unless it turns out
to be in GitHub scope and the lead wants direct edits.

## Files and surfaces I expect to touch
- `site/vaults/claude-gmail-connector/` (new)
- `site/vaults/index.json` (new vault entry; possibly split/rename the `claude-google-workspace-connector` asked_for row)
- generated: `site/agent-behaviour-policy.html`, `site/abp-vault-claude-gmail-connector.html`, twins, sitemap, llms.txt
- no price anywhere (the store owns prices as of v1.22.0 — the boundary)
- scratchpad only for the store materials, unless told to push into the store's repo

## External state
- Vaults pushed by this branch with the session token: `claude-gmail-connector` → `oc433z3m` (public, read key in the catalogue); the customer instance → `xjir6m0c` (private; vault key handed to the lead in the session, nowhere in the repository)
- Releases: v1.22.1 (merged); v1.23.0 (the console)

## Status
- [x] researched: Anthropic's help article, Google's MCP reference and configure guide, Google's scope list; the lead's twelve screens and the sent message's .eml
- [x] template vault `claude-gmail-connector` built and checked — 6 rows, 4 measured, 5 contradictions, 6 open questions, `evidence/` with the screens transcribed and the .eml redacted; on the *next* page as built, awaiting a push
- [x] instance `vaults-instances/claude-gmail-connector--customer-draft/` built with `ABP_VAULT_DIR` (one-line change to the build script); status draft; a question on every mandate line
- [x] the workflow brief `docs/briefs/workflow__buying-a-policy-for-claude-on-gmail.md`; register I6; admin link; map and state
- [x] store materials: two real captures for the empty slots (App Mode, History) plus three extras and a handover note, in the scratchpad, sent to the lead
- [x] release v1.22.1 + merge to dev
- [x] both pushes made from the session (`oc433z3m` public, `xjir6m0c` private); catalogue entry moved to `vaults`; page and tile live
- [x] the admin console: `scripts/site/build-admin.mjs`, `site/admin/**`, `tests/site/test_admin.mjs`, a `link` entry in `pages.json`, `admin.html` a redirect; CLAUDE.md, map, rules, workflows, state, how-the-website-works updated; release v1.23.0
- [ ] owed by the lead: the screenshots as files for redaction into `evidence/`; the customer's correction call

## Notes for whoever merges after me
`ABP_VAULT_DIR` is new in `build-abp-vault.mjs`: unset, nothing changes. `vaults-instances/` is not
deployed and not built by CI. The Gmail vault sits in `asked_for` with `note` saying it is built —
the next-page tile still says *not yet researched* because `nextTile()` ignores the note; a
one-word fix (`x.note || kind`) I did not make, because the sibling agent owns that page's copy
this week. Done: the entry is in `vaults` with `vid` and `key`.
