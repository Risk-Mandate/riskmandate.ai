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
- Vault built and unpushed: `claude-gmail-connector` — the push is owed by the lead (write key)
- No release cut yet

## Status
- [ ] research Anthropic's Gmail connector docs
- [ ] build the vault
- [ ] check, regenerate
- [ ] store.sgit.ai/lab/product/ reviewed; materials produced
- [ ] release + merge
