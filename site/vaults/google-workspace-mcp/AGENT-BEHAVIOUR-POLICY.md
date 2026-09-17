# AGENT BEHAVIOUR POLICY — The Google Workspace MCP servers

> For one agent in one deployment: everything it can do, what you authorised, the gap between the two, and what actually stands in the way. It describes and it does not judge, so it carries no score.

**Vault** `google-workspace-mcp` · **status** template · **shape** `google/workspace-mcp/default` · **grant** 2026-09-15 · **mandate** 2026-09-15 · **vocabulary** abp.sgit.ai v0.3.0 · **as at** 2026-09-15

---


## Four objects, and the verb attached to each

| Object | What it is | How it is obtained | Here |
| --- | --- | --- | --- |
| The mandate | What the agent is authorised and expected to do | **Elicited** — you already know it | `MANDATE.md` — 2 wanted, 3 refused, 18 unstated |
| The grant | Everything the agent can do | **Measured** — from the shape, the account, the credentials | `GRANT.md` — 6 capabilities, 0 measured |
| The delta | Excess and shortfall | **Derived** — recomputed whenever either input moves, never edited | `DELTA.md` — 4 excess, 1 unbounded, 0 shortfall |
| The barrier | What stands between the agent and each capability | **Recorded** per row, one of four kinds | the third column of every table |

## The deployment

**The Google Workspace MCP servers (Gmail, Drive, Docs, Sheets, Slides, Calendar, Chat)**, Google. Google's own MCP servers, one per Workspace product, used from an MCP client such as an IDE or an agent. Each server "inherits the same permissions and data governance controls as the user": it acts as the person who consented, over everything that person can reach. The rows below are the OAuth scopes the setup page tells you to add to the project, read as capabilities; the client that holds the token has a grant of its own, which is a separate shape.

## The mandate, in one paragraph

I wanted it to search my mail, find files and tell me what is on my calendar. I did not want it sending mail or changing documents; I asked for a reader.

## The whole grant, with the mandate beside it

Irreversible rows first. ✓ marks a measured row.

| Capability | What it is | Barrier | Undo | Evidence | Mandate |
| --- | --- | --- | --- | --- | --- |
| `read.message.tenant` | Read mail or chat it is connected to | ○ boundary | no | documented | in the mandate |
| `send.message.world` | Send a message to anyone | ○ boundary | no | documented | refused by the mandate |
| `read.file.host` | Read any file the account can reach | ○ boundary | no | documented | in the mandate |
| `authenticate-as.credential.tenant` | Act in accounts with the credentials it holds | ○ boundary | no | documented | unstated by the mandate |
| `read.credential.host` | Read credentials stored where it runs | ● none | no | inferred | refused by the mandate |
| `write.file.host` | Change any file the account can reach | ○ boundary | with-effort | documented | refused by the mandate |

## The delta

**4 in the grant that the mandate did not ask for.** 3 of those it refused; 1 it never mentioned. **1 have nothing but a setting, a sentence or nothing at all in the way.** Nothing wanted is missing.

Unbounded excess:

- `read.credential.host` — Read credentials stored where it runs — ● none


## Prohibitions, each with its barrier

Every line an agent is asked to observe, next to what enforces it. A prohibition shown without its barrier is a claim this document cannot support.

| Line | Barrier | Enforced by |
| --- | --- | --- |
| Do not `send.message.world` — send a message to anyone | ○ boundary | the OAuth scope |
| Do not `authenticate-as.credential.tenant` — act in accounts with the credentials it holds | ○ boundary | Google's consent screen and the project's scope list; the token is held by the MCP client |
| Do not `read.credential.host` — read credentials stored where it runs | ● none | **nothing** |
| Do not `write.file.host` — change any file the account can reach | ○ boundary | the OAuth scopes |
| Stop and report if a task needs anything above | ◉ expectation | **nothing** — and this is the line that makes the rest useful |

## What is blocked, and who holds the block

Everything above is what the agent can do once every block is applied. These are the things something withholds — and the record says what, because a ceiling the credential itself enforces and a tool a vendor has not shipped are different objects with different lifespans.

- **your machine's files** — blocked by the hosting — the servers are Google's, and what the MCP client itself reaches is a separate shape. the servers are hosted by Google; what the MCP client itself can reach is that client's own grant, a separate shape _(https://developers.google.com/workspace/guides/configure-mcp-servers)_
- **permanent deletion of mail** — blocked by Google's scope ceiling — only https://mail.google.com/ permits it, and it is not on the list. only the https://mail.google.com/ scope permits it ("Read, compose, send, and permanently delete all your email"), and it is not on the list _(https://developers.google.com/workspace/gmail/api/auth/scopes)_
- **labelling or unlabelling mail** — blocked by the scopes on the list — gmail.labels exists and was not requested. gmail.labels ("See and edit your email labels") exists and is not on the list _(https://developers.google.com/workspace/gmail/api/auth/scopes)_
- **creating or changing calendar events** — blocked by the three Calendar scopes requested, all of them read-only. the three Calendar scopes requested are calendarlist.readonly, events.readonly and events.freebusy; "schedule meetings" is advertised on the same page _(https://developers.google.com/workspace/guides/configure-mcp-servers)_

## What is not settled

**4 open questions** the grant cannot answer from published pages — listed in `RESEARCH-NEEDED.md` with how each is settled. **3 places where the vendor's own pages disagree** — in `GRANT.md`, published unresolved. A row with an open question against it stands at the evidence tier it shows; nothing here was obtained by probing anybody else's system.

## Validity

This describes the deployment shape as at this date. If the risk changed, the deployment changed — not this document. As at **2026-09-15**, against grant 2026-09-15, mandate 2026-09-15, vocabulary v0.3.0. Void when: the grant version changes — a product release, a setting, a connector enabled or removed; the mandate changes — the deployer authorises more or less; the vocabulary version changes — a primitive is added, split or renamed; a barrier moves — a setting becomes a boundary, or a boundary is removed.

## Where a score would live, and why it is not here

The same behaviour policy is dangerous in one deployment and harmless in another, and nothing about the document changed. A score needs the assets and the consequences, and this document has neither. That is not a preference; it is where the information is.

---

_This describes the deployment shape as at this date. If the risk changed, the deployment changed — not this document._ 
No score, rating, level or traffic light appears in this vault or in its data, and none will. The behaviour policy describes; it does not judge. 
Generated by `scripts/site/build-abp-vault.mjs` from `data/grant.json`, `data/mandate.json` and the pinned vocabulary; `data/mandate.json` is the only file a person writes. Licence: the published template is CC BY 4.0; a paid copy carries a commercial licence to the buyer. See LICENCE.md.

