# Connector grants: the open questions, written to be handed to an agent

**Date:** 2026-09-15 · **Author:** @website-agent
**Trigger:** project lead's note of 15 September — *"create more ABP, now focused on the connectors … it is ok to create an ABP with reference that 'need more research' on grant, which I can then assign to a different agent"*
**Reads against:** Lab 01 (the grant is user-shaped), Lab 03 request 2 (the four connector shapes), the vendor pages listed in each vault's `RESEARCH-NEEDED.md`

---

## 1. What was built

Five behaviour-policy vaults for connector shapes, in the directory at `abp-vaults.html` and each
with its own page. None of these shapes is published at abp.sgit.ai; the grants were read from the
vendors' own pages on 15 September 2026, quoted rather than paraphrased, and stand at the
**documented** evidence tier (never *measured*: nothing was tested, and probing somebody else's
system is out of bounds here with no research exemption).

| Vault | Shape | Rows | Open questions | Pages disagree |
|---|---|---|---|---|
| `google-workspace-mcp` | Google's own Workspace MCP servers (Gmail, Drive, Docs, Sheets, Slides, Calendar, Chat) | 6 | 4 | 3 |
| `gmail-readonly` | an assistant on a personal Gmail mailbox, `gmail.readonly` — Lab 03 shape 1 | 4 | 3 | 1 |
| `google-drive-readonly` | an assistant on a personal Google Drive, `drive.readonly` — Lab 03 shape 3 | 3 | 3 | 1 |
| `claude-m365-connector` | Claude's Microsoft 365 connector: Outlook, SharePoint, OneDrive, Teams — Lab 03 shapes 2 and 4 | 5 | 4 | 3 |
| `dropbox-mcp` | the official Dropbox MCP server, eight scopes | 5 | 4 | 2 |

Three things a documented grant carries that a measured one does not, and the generator now
writes for any vault whose `data/grant.json` has them:

- **`research_needed`** → `RESEARCH-NEEDED.md`: one question per row the pages could not settle,
  with how to settle it and where to look. Counted on the directory tile, the card and the app's
  first screen as *open questions*. **This is the file to hand to the research agent.**
- **`contradictions`** → *Where the vendor's own pages disagree*: advertised in one place,
  permitted in another, published **unresolved** on purpose — the section Lab 03 said every
  connector shape needs.
- **`not_in_grammar`** → *Granted, and not in the grammar*: permissions none of the 23
  primitives names (trash a mail thread, read a calendar), recorded so the grant is not silently
  narrower than the consent screen.

And one property on every row: **`material`** — `own`, `organisation`, `third_party` or
`mixed` — the Lab 01 finding as data, asked of the model site as Lab 03 request 1. Almost every
connector row is `mixed`, and no setting the vendors offer makes it `own`.

## 2. The brief for the research agent

Take one vault. Open its `RESEARCH-NEEDED.md`. For each question:

1. **Read, do not test.** Settle it from the vendor's published page, from a system you are
   entitled to run, or not at all. Never connect an assistant to an account to see what happens.
2. **Quote.** The answer is a sentence from a page, its URL and the date read.
3. **Record it in the grant.** In `data/grant.json`: move the row's `evidence` to the tier the
   answer supports (`documented` for a vendor page; `self-reported` for a vendor's claim about
   its own behaviour that no page substantiates), put the quote in the row's `note`, and delete
   the entry from `research_needed`. If the page is silent, that is an answer too: add it to
   `contradictions` with `state: "undocumented"` and delete the question.
4. **Rebuild and check.** `node scripts/site/build-abp-vault.mjs <slug>` then `--check`; the
   history records whether the counts moved. Push the vault with its key from the keys vault.

The five `RESEARCH-NEEDED.md` files hold 18 questions between them. The ones most likely to move a
row: whether the Gmail MCP server exposes a *send* tool (the scope permits it; the page advertises
drafts); whether Claude's Microsoft 365 write tools are on by default or gated behind a separate
consent of `Mail.Send`; the default audience of a Dropbox `CreateSharedLink`.

## 3. The queue

Five more connectors are listed on the directory as *not yet researched*, in the order a stranger
recognises them: Claude's own Google Workspace connector, Slack, GitHub, Notion, Salesforce. Each
becomes a vault the same way: read the connector's own scope or permission page, write
`data/grant.json` with a row per capability the scopes permit (`material` on each), a starting
mandate, the contradictions, the open questions; the generator and the site do the rest. The
authoring script that produced the five is in the session's scratchpad and is not the source of
truth — the JSON in `site/vaults/<slug>/` is.

## 4. What this does not claim

Every row in these vaults could be wrong the way documentation is wrong: the page moved (Anthropic's
Microsoft 365 guide read as read-only on 12 September and lists ten write tools on 15 September,
and both readings are in the vault), the advertised capability and the granted scope disagree, or
the connector does less than its scope permits. That is the condition a behaviour policy exists to
surface, not a defect in it. A row moves to *measured* only from a system we are entitled to run.
