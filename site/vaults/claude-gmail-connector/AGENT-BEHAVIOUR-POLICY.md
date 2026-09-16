# AGENT BEHAVIOUR POLICY — Claude's Gmail connector

> For one agent in one deployment: everything it can do, what you authorised, the gap between the two, and what actually stands in the way. It describes and it does not judge, so it carries no score.

**Vault** `claude-gmail-connector` · **status** template · **shape** `anthropic/gmail-connector/default` · **grant** 2026-09-16 · **mandate** 2026-09-16 · **vocabulary** abp.sgit.ai v0.3.0 · **as at** 2026-09-16

---


## Four objects, and the verb attached to each

| Object | What it is | How it is obtained | Here |
| --- | --- | --- | --- |
| The mandate | What the agent is authorised and expected to do | **Elicited** — you already know it | `MANDATE.md` — 1 wanted, 3 refused, 19 unstated |
| The grant | Everything the agent can do | **Measured** — from the shape, the account, the credentials | `GRANT.md` — 6 capabilities, 4 measured |
| The delta | Excess and shortfall | **Derived** — recomputed whenever either input moves, never edited | `DELTA.md` — 5 excess, 4 unbounded, 0 shortfall |
| The barrier | What stands between the agent and each capability | **Recorded** per row, one of four kinds | the third column of every table |

## The deployment

**Claude, with the Gmail connector enabled**, Google (the MCP server at gmailmcp.googleapis.com, and the account); Anthropic (Claude, the client, the directory listing and the approval prompt). The Gmail connector in Claude's directory: "MADE BY Google", connector URL https://gmailmcp.googleapis.com/mcp/v1, "ADDED March 2026", category Communication, sign-in required. It is one of three Google Workspace connectors (Gmail, Calendar, Drive) that Anthropic's help article says are "available for all users on Claude and Claude Desktop", toggled individually — so a deployment can run Gmail alone, which is this shape. Three surfaces were read and they do not agree: Anthropic's help article (read 2026-09-16, "Updated over a month ago"), Google's own MCP reference for the server (read 2026-09-16, page dated 2026-07-21, Developer Preview), and the directory listing plus Google's consent screens as captured by the deployer on 2026-09-16 (evidence/). Nothing was tested from this site. The directory's own footer: "Only use connectors from developers you trust. Anthropic does not control which tools developers make available and cannot verify that they will work as intended or that they won't change." Four rows were then measured on 2026-09-16 by the deployer, on an account they run: the sign-in, a read of the inbox, one message sent to an address the deployer named for the purpose, and the label inventory; the record and the screens are in evidence/. Two more were then measured: the message as sent carries nothing that names the client, and permanent deletion is refused — a boundary at Google's scope, not a setting in Claude.

## The mandate, in one paragraph

We connected Gmail to Claude so it could find things in the inbox, answer questions about it, and draft replies for a person to send themselves. Reading is what was wanted. Nobody asked it to send mail as them — Google's own consent screen already permits it, and only the per-action approval prompt stands between the two.

## The whole grant, with the mandate beside it

Irreversible rows first. ✓ marks a measured row.

| Capability | What it is | Barrier | Undo | Evidence | Mandate |
| --- | --- | --- | --- | --- | --- |
| `read.message.tenant` | Read mail or chat it is connected to | ○ boundary | no | measured ✓ | in the mandate |
| `send.message.world` | Send a message to anyone | ◐ setting | no | measured ✓ | refused by the mandate |
| `authenticate-as.credential.tenant` | Act in accounts with the credentials it holds | ○ boundary | no | measured ✓ | unstated by the mandate |
| `read.credential.host` | Read credentials stored where it runs | ● none | no | inferred | refused by the mandate |
| `read.record.history` | Read a retained record: shell history, past sessions | ● none | no | measured ✓ | unstated by the mandate |
| `create.schedule.tenant` | Create something that outlives the session, on the platform (a routine, a scheduled trigger, a new session) | ◐ setting | with-effort | documented | refused by the mandate |

## The delta

**5 in the grant that the mandate did not ask for.** 3 of those it refused; 2 it never mentioned. **4 have nothing but a setting, a sentence or nothing at all in the way.** Nothing wanted is missing.

Unbounded excess:

- `send.message.world` — Send a message to anyone — ◐ setting
- `create.schedule.tenant` — Create something that outlives the session, on the platform (a routine, a scheduled trigger, a new session) — ◐ setting
- `read.credential.host` — Read credentials stored where it runs — ● none
- `read.record.history` — Read a retained record: shell history, past sessions — ● none


## Prohibitions, each with its barrier

Every line an agent is asked to observe, next to what enforces it. A prohibition shown without its barrier is a claim this document cannot support.

| Line | Barrier | Enforced by |
| --- | --- | --- |
| Do not `send.message.world` — send a message to anyone | ◐ setting | two layers. At consent, Google's screen asks for "Manage drafts and send emails." (gmail.compose) and "Read, compose and send emails from your Gmail account." (gmail.modify), each with its own tick box, all pre-ticked under "Select all" — unticked, sending would be a boundary; this shape assumes the default. After consent, the per-action approval prompt: "By default, Claude asks for your approval before each of these actions. On Team and Enterprise plans, owners decide whether members can allow these actions to run without asking each time." A switch the account, or an org owner, can flip. On the screen the prompt reads "Claude wants to use Send email message from Gmail" with three buttons: Deny · Always allow · Allow once. "Always allow" is the switch — one click by the account holder, and the prompt is gone for good. |
| Do not `authenticate-as.credential.tenant` — act in accounts with the credentials it holds | ○ boundary | the Google OAuth consent; "You must authenticate directly with your Google account before using these connectors." Revocable from the Google account ("To make changes at any time, go to your Google Account.") and from Claude's Connectors settings. |
| Do not `read.credential.host` — read credentials stored where it runs | ● none | **nothing** |
| Do not `read.record.history` — read a retained record: shell history, past sessions | ● none | **nothing** |
| Do not `create.schedule.tenant` — create something that outlives the session, on the platform (a routine, a scheduled trigger, a new session) | ◐ setting | the per-action approval prompt: "By default, each action Claude takes on your behalf requires your explicit approval. On Team and Enterprise plans, owners decide whether members can allow certain actions to run without asking each time." |
| Stop and report if a task needs anything above | ◉ expectation | **nothing** — and this is the line that makes the rest useful |

## What is not reachable

- **Google Calendar and Google Drive** — "You can enable or disable specific connectors from below the chat interface... Toggle individual connectors on or off." This shape has only the Gmail toggle on; the directory lists Gmail, Google Drive and Google Calendar as three connectors. _(https://support.claude.com/en/articles/10166901-use-google-workspace-connectors)_
- **attachment content** — "Attachment content is not directly accessible through Gmail (metadata only)." _(https://support.claude.com/en/articles/10166901-use-google-workspace-connectors)_
- **another Google account, or anything the account holder cannot already open** — "Claude can only access the Gmail, Calendar, and Drive data for the Google account you've connected" and "Claude mirrors your existing permissions — you cannot access information you don't already have access to in Google Workspace." _(https://support.claude.com/en/articles/10166901-use-google-workspace-connectors)_
- **permanent deletion of mail** — the widest scope on the consent screen is gmail.modify — "Read, compose, and send emails from your Gmail account. This scope does not allow immediate, permanent deletion of threads and messages, bypassing Trash"; the full https://mail.google.com/ scope ("Read, compose, send, and permanently delete all your email from Gmail") is not asked for. Measured 2026-09-16: asked to delete a trashed message or empty the Trash, Claude reported "I don't have a tool for permanent deletion or emptying Trash — only moving messages/threads to Trash". A boundary at Google, and the thirty-day Bin is Google's rule. _(https://developers.google.com/workspace/gmail/api/auth/scopes)_

## What is not settled

**6 open questions** the grant cannot answer from published pages — listed in `RESEARCH-NEEDED.md` with how each is settled. **5 places where the vendor's own pages disagree** — in `GRANT.md`, published unresolved. A row with an open question against it stands at the evidence tier it shows; nothing here was obtained by probing anybody else's system.

## Validity

This describes the deployment shape as at this date. If the risk changed, the deployment changed — not this document. As at **2026-09-16**, against grant 2026-09-16, mandate 2026-09-16, vocabulary v0.3.0. Void when: the grant version changes — a product release, a setting, a connector enabled or removed; the mandate changes — the deployer authorises more or less; the vocabulary version changes — a primitive is added, split or renamed; a barrier moves — a setting becomes a boundary, or a boundary is removed.

## Where a score would live, and why it is not here

The same behaviour policy is dangerous in one deployment and harmless in another, and nothing about the document changed. A score needs the assets and the consequences, and this document has neither. That is not a preference; it is where the information is.

---

_This describes the deployment shape as at this date. If the risk changed, the deployment changed — not this document._ 
No score, rating, level or traffic light appears in this vault or in its data, and none will. The behaviour policy describes; it does not judge. 
Generated by `scripts/site/build-abp-vault.mjs` from `data/grant.json`, `data/mandate.json` and the pinned vocabulary; `data/mandate.json` is the only file a person writes. Licence: the published template is CC BY 4.0; a paid copy carries a commercial licence to the buyer. See LICENCE.md.

