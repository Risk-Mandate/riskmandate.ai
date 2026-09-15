# T03 — Metrics and outward links on the 23 behaviours

**From:** the graph brief §3 (`data/behaviours/`), §4 items 4 and 5, §5. **Size:** a day and a
half. **Touches:** `site/vaults/_template/data/vocabulary/` (a new extension file, copied into
every vault by the build), the behaviour pages (T01), `site/lab-abp-requests.html` (the ask).

## The task
Two properties per primitive, in a **sanctioned extension namespace** rather than a fork of the
grammar, authored once and copied into every vault:

- **Metrics**, coarse ordinals, never numbers that read as a score: `speed` (`fast` / `slow`),
  `volume` (`one` / `some` / `many`), `blast` (`self` / `project` / `host` / `tenant` / `world`,
  which is the reach and may simply reference it). The debrief's example: a calendar with five
  thousand entries added or deleted, and what backups exist.
- **Outward links**: MITRE ATT&CK technique ids and GDPR articles per behaviour, each with the
  URL it was read from and the date. Standards bodies whose text may not be reproduced are
  linked by title and number only.

## Constraints
- This is data, so it carries provenance like the rest of the vocabulary: source, retrieved date,
  licence, and a note that the extension is this site's and not the model site's.
- No ordering that reads as a severity ranking. Metrics describe the action.
- The behaviour pages (T01) render them; until T01 lands, the vault README can list them.
- Write the ask for the model site (metrics and links as properties on the primitives, or the
  extension namespace) into Lab 03 and cut an edition.

## Done means
- One extension file, pinned by version, present in every vault after a rebuild; `--check` green.
- Every behaviour has at least the metrics; links where a source exists, `[]` with a note where
  none was found (never invented).
- Lab 03 carries the ask.
