---
description: Add a behaviour-policy template vault for a new deployment shape, from the vendor's own pages or a measured grant
argument-hint: <slug> <shape, e.g. slack/bot-token/default> [measured|documented]
---

Add the vault $ARGUMENTS following `.claude/onboarding/05-workflows.md` → *Add a vault* and the
model in `.claude/onboarding/02-abp-model.md`. Read `site/vaults/gmail-readonly/data/grant.json`
as the example of a documented grant and `site/vaults/n8n-owner-api-key/data/grant.json` as the
example of a measured one.

Rules that decide whether the vault is publishable:

- Never test somebody else's system. A documented row quotes the vendor's page with URL and the
  date read, in the row's `note`. A measured row exists only for a system we are entitled to run,
  with the session record in `history/`.
- The credential is the grant, not a barrier. `material` on every row. Note the door: one row,
  several `via`. What the pages could not settle goes in `research_needed`; where the vendor's
  own pages disagree, `contradictions`, unresolved; what the grammar cannot name, `not_in_grammar`.
- The mandate is a starting point in the deployer's words, sorted over the 23 primitives.
  Six scenarios, three normal and three advanced, none wanting and refusing the same row.
- No score, anywhere.

Then: `build-abp-vault.mjs <slug>` and `--check`; add the catalogue entry to
`site/vaults/index.json` without `vid`/`key` (the lead pushes and fills them);
`build-abp-pages.mjs`; `generate.mjs`; `npm run check`. Record in `.claude/work/<branch>.md`
that the vault is built and unpushed, and list the open questions count. Add a line to
`.claude/onboarding/03-state-and-next.md`.
