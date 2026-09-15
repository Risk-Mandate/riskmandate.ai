# T06 — The next five connector vaults, then the three business functions

**From:** the research brief §3 (the queue) and the library page's *not yet researched* tiles.
**Size:** half a day per vault; one or two vaults per branch. **Touches:** `site/vaults/<slug>/`
(new), `site/vaults/index.json` (move the entry from `asked_for` to `vaults`), the generated
pages.

## The task
In the order a stranger recognises them: **Claude's Google Workspace connector, Slack, GitHub,
Notion, Salesforce.** Each becomes a vault the way the five connector vaults were: read the
connector's own scope or permission page, write `data/grant.json` with a row per capability the
scopes permit (`material` on each), a starting mandate in the deployer's words, six scenarios,
the contradictions, the open questions. The generator and the site do the rest. The prompt is
`.claude/commands/new-vault.md`.

Then the business functions, a different axis: **the CRM, the customer-service desk, finance
data.** The mandate is the same across products; the grant is per product; each becomes a vault
once one product's grant is documented for it (Salesforce for the CRM is the natural first).

## Constraints
- Documented tier only. Nothing is tested. Every row quotes a page with URL and date.
- The catalogue entry has no `vid`/`key` until the lead pushes the vault; the tile lists as
  *asked for* until then. Remove the slug from `asked_for` only when it moves to `vaults`.
- The library page's copy for the tile (`blurb`) is one or two sentences in the site's voice:
  what the shape is, and the one thing the pages said that a reader would not expect.
- Slack and GitHub have two connector models each (bot token vs user token; fine-grained token
  vs OAuth app). Pick the one the assistant vendors actually use and say so in `shape_note`.

## Done means
- The vault builds and `--check`s; the pages regenerate; `npm run check` green.
- The work file lists the vault as built and unpushed with its open-questions count.
- `03-state-and-next.md` moves the connector from *asked for* to *built, unpushed*.
