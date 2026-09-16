# T11 — Consequences and assets: what follows when a capability meets what is in the deployment

> **Done** v1.24.0 — built for `oc433z3m` and the template. See `docs/briefs/direction__mvp-vault-and-the-reading-app.md` and the v1.24.0 notes.

**From:** `docs/briefs/direction__consequences-assets-and-the-vault-as-a-website.md` §3 and §5 items 1 and 5. **Size:** a day. **Touches:** `site/vaults/claude-gmail-connector/data/assets.json` and `data/consequences.json` (new, authored), `scripts/site/build-abp-vault.mjs` (derives `CONSEQUENCES.md`, the routes-out table, the open-consequence view on the delta), `site/vaults/_app/index.html` (the *What follows* view under Evidence), `site/vaults/_template/data/` (empty files with the schema, so every vault carries the layer), `data/scenarios.json` (two scenarios).

## The task
The grant is a union of capabilities; the reader needs the consequences, each explicit and in the
deployment's own words, with the asset that makes it real. Author the eleven consequences and five
assets drafted in the brief for `oc433z3m`, with evidence tier, source and date on every one, and
the open questions in the file. Derive `CONSEQUENCES.md` and a routes-out table (one row per
exfiltration consequence: door, barrier, outlives the session, told not to). Recompute *open
consequences* from the delta: every required capability in the excess or unstated, every required
asset present or assumed. Add the two mandate scenarios the memo asks for.

## Constraints
- **No score.** A consequence has a kind, a barrier, an undo class and an evidence tier. Never a
  severity, a rating or a colour that ranks one above another.
- **Every claim is about the shape, none about Google.** Facts, dates, sources. Suspension and
  sending limits are documented from Google's pages or left open; nothing is provoked (rule 4).
- **Explicit, second person, the mailbox's own words.** "You can read any password-reset link
  that arrives in this mailbox", not "credential exposure".
- **`present: assumed` is its own word** in every rendering; never silently present.
- The schema is this site's extension, declared as such in the file (`type`, `_what_this_is`,
  `provenance`), until the model site sanctions one (Lab 03 ask).
- Every existing grant row gets at least one child consequence or a line saying none was found.

## Done means
- `data/assets.json` and `data/consequences.json` exist in the Gmail vault and validate against
  the schema the build enforces; `_template/` carries empty ones.
- `CONSEQUENCES.md` is derived, lists the routes-out table, and the count of open consequences
  moves when `mandate.json` moves (checked by `--check`, like the delta).
- The app shows *What follows* with the consequences grouped by kind, each with its requirements
  as links to the grant rows and assets, its evidence and its questions.
- Two scenarios added; six existing unchanged.
- `npm run check` green; the vault rebuilt; a note in `RESEARCH-NEEDED.md` for every open
  question the file raises.
