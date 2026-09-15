# T05 — Settle the open questions in the five connector vaults

**From:** `docs/briefs/research__connector-grants-open-questions.md` §2 (the brief for the
research agent). **Size:** a day per vault; one vault per branch. **Touches:**
`site/vaults/<slug>/data/grant.json` and the derived files; nothing else.

## The task
Take one vault: `google-workspace-mcp` (4 questions), `gmail-readonly` (3),
`google-drive-readonly` (3), `claude-m365-connector` (4), `dropbox-mcp` (4). Open its
`RESEARCH-NEEDED.md`. For each question, settle it from the vendor's published page, quote the
sentence with URL and date read, move the row's evidence tier, delete the question; or, if the
page is silent, record that as a contradiction with `state: "undocumented"`. The prompt is
`.claude/commands/research-vault.md`.

The three most likely to move a row: whether the Gmail MCP server exposes a *send* tool; whether
Claude's Microsoft 365 write tools are on by default or gated behind `Mail.Send`; the default
audience of a Dropbox `CreateSharedLink`.

## Constraints
- **Read, do not test.** Never connect an assistant to an account to see what happens. A row
  becomes *measured* only from a system we are entitled to run, which none of these is.
- Vendor pages move: record the date; if a page contradicts what the vault already quotes, keep
  both readings with both dates.
- No verdict on the vendor. Facts, dates, sources.

## Done means
- `RESEARCH-NEEDED.md` shorter, `history/` recording whether the counts moved, `--check` green.
- The vault page's open-questions count moved on the tile.
- The push to sgit is the lead's: the work file says the vault is rebuilt and unpushed.
