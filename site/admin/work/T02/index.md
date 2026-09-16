# T02 — The grant as edges, one per path

> Rendered from .claude/briefs/T02-edges-per-path.md in the repository. The text below is that file.
> Source: https://riskmandate.ai/admin/work/T02/ · noindex · written by scripts/site/build-admin.mjs

**From:** the graph brief §3 and §4 item 3; the n8n review §3 (*barrier class is not a property
of a capability*). **Size:** a day. **Touches:** `scripts/site/build-abp-vault.mjs`,
`site/vaults/*/data/edges.json` (new, derived), `site/vaults/_app/index.html` (the renderer,
if it shows paths), `docs/briefs/` (a short implementation note).

## The task
Derive `data/edges.json` in every vault from `data/grant.json`: one edge per *path*, not per row.
An edge is policy → behaviour with `via` (one door), `barrier`, `evidence`, `material`, `undo`,
and the mandate's stance. A grant row with two `via` entries becomes two edges, and where the
row's note records that the barrier differs by door, the edges carry different barriers.

The grant row format is upstream's (`abp/profile/v1`) and has one `barrier` per row. Do not fork
it. Add an optional per-path override on the row (`paths: [{via, barrier, evidence, note}]`) that
the generator reads when present and falls back from when absent; write the ask for a first-class
version of it into Lab 03 (T07).

## Constraints
- Derived: the build writes it, `--check` compares it, nobody edits it.
- The delta's counts are unchanged by this: unbounded excess is still per row (a row is unbounded
  if any path to it is). Say so in the file's note.
- The n8n vault is the worked example: `read.credential.host` open through MCP and shut through
  REST by the measuring environment's gateway. Its edges must show two paths with the note
  saying which side the barrier is on.

## Done means
- Every vault has `data/edges.json`; CI's per-vault check covers it.
- The n8n vault's edges show the two doors.
- The renderer or the vault page shows paths where a row has more than one (optional if the
  renderer change is out of your reach; then it is an item in the work file).
- Lab 03 carries the ask (with T07 or alone).
