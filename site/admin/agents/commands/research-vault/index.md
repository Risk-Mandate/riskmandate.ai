# research-vault

> Rendered from .claude/commands/research-vault.md in the repository. The text below is that file.
> Source: https://riskmandate.ai/admin/agents/commands/research-vault/ · noindex · written by scripts/site/build-admin.mjs

---
description: Settle the open questions in a connector vault's RESEARCH-NEEDED.md by reading, quoting and dating vendor pages — never by testing
argument-hint: <vault slug>
---

Work `site/vaults/$ARGUMENTS/RESEARCH-NEEDED.md` following §2 of
`docs/briefs/research__connector-grants-open-questions.md`. For each question:

1. Read, do not test. Settle it from the vendor's published page, or not at all. Never connect
   anything to an account to see what happens.
2. Quote: a sentence from the page, its URL, and today's date as the date read.
3. Record it in `data/grant.json`: move the row's `evidence` to the tier the answer supports
   (`documented` for a vendor page; `self-reported` for a vendor claim no page substantiates),
   put the quote in the row's `note`, delete the entry from `research_needed`. A silent page is
   an answer too: add it to `contradictions` with `state: "undocumented"` and delete the question.
4. `node scripts/site/build-abp-vault.mjs <slug>` then `--check`; the history records whether
   the counts moved. `build-abp-pages.mjs`, `generate.mjs`, `npm run check`.

Report: questions settled, questions still open and why, rows whose tier moved, and whether
the counts on the tile changed. The vault push is the lead's; say it is owed.
