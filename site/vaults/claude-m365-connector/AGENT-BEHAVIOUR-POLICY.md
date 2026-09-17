# AGENT BEHAVIOUR POLICY — Claude's Microsoft 365 connector

> For one agent in one deployment: everything it can do, what you authorised, the gap between the two, and what actually stands in the way. It describes and it does not judge, so it carries no score.

**Vault** `claude-m365-connector` · **status** template · **shape** `anthropic/microsoft-365-connector/default` · **grant** 2026-09-15 · **mandate** 2026-09-15 · **vocabulary** abp.sgit.ai v0.3.0 · **as at** 2026-09-15

---


## Four objects, and the verb attached to each

| Object | What it is | How it is obtained | Here |
| --- | --- | --- | --- |
| The mandate | What the agent is authorised and expected to do | **Elicited** — you already know it | `MANDATE.md` — 2 wanted, 2 refused, 19 unstated |
| The grant | Everything the agent can do | **Measured** — from the shape, the account, the credentials | `GRANT.md` — 5 capabilities, 0 measured |
| The delta | Excess and shortfall | **Derived** — recomputed whenever either input moves, never edited | `DELTA.md` — 3 excess, 1 unbounded, 0 shortfall |
| The barrier | What stands between the agent and each capability | **Recorded** per row, one of four kinds | the third column of every table |

## The deployment

**Claude's Microsoft 365 connector (Outlook, SharePoint, OneDrive, Teams)**, Anthropic. "An Anthropic-hosted integration that enables Claude to securely access Microsoft 365 services (Outlook, SharePoint, OneDrive, Teams) through user-delegated permissions." A Global Administrator consents once for the tenant; each user then reaches only what they already have permission for, over OAuth 2.0 On-Behalf-Of. The rows are the connector's tool tables read as capabilities. Lab 01 read this page on 12 September as read-only; on 15 September it lists write tools too, and both readings are recorded.

## The mandate, in one paragraph

We connected Claude to Microsoft 365 so people could search their mail, their chats and SharePoint. Reading is what we wanted. Nobody asked for it to send mail or post in Teams as them, and the administrator who consented read the page when it said read-only.

## The whole grant, with the mandate beside it

Irreversible rows first. ✓ marks a measured row.

| Capability | What it is | Barrier | Undo | Evidence | Mandate |
| --- | --- | --- | --- | --- | --- |
| `read.message.tenant` | Read mail or chat it is connected to | ○ boundary | no | documented | in the mandate |
| `send.message.world` | Send a message to anyone | ○ boundary | no | documented | refused by the mandate |
| `read.file.host` | Read any file the account can reach | ○ boundary | no | documented | in the mandate |
| `authenticate-as.credential.tenant` | Act in accounts with the credentials it holds | ○ boundary | no | documented | unstated by the mandate |
| `read.credential.host` | Read credentials stored where it runs | ● none | no | inferred | refused by the mandate |

## The delta

**3 in the grant that the mandate did not ask for.** 2 of those it refused; 1 it never mentioned. **1 have nothing but a setting, a sentence or nothing at all in the way.** Nothing wanted is missing.

Unbounded excess:

- `read.credential.host` — Read credentials stored where it runs — ● none


## Prohibitions, each with its barrier

Every line an agent is asked to observe, next to what enforces it. A prohibition shown without its barrier is a claim this document cannot support.

| Line | Barrier | Enforced by |
| --- | --- | --- |
| Do not `send.message.world` — send a message to anyone | ○ boundary | Mail.Send, delegated; "Revoke … in Entra" is the off switch, and it is the administrator's, not the user's |
| Do not `authenticate-as.credential.tenant` — act in accounts with the credentials it holds | ○ boundary | delegated permissions; "Multi-tenant isolation is cryptographically enforced through digitally signed access tokens" |
| Do not `read.credential.host` — read credentials stored where it runs | ● none | **nothing** |
| Stop and report if a task needs anything above | ◉ expectation | **nothing** — and this is the line that makes the rest useful |

## What is blocked, and who holds the block

Everything above is what the agent can do once every block is applied. These are the things something withholds — and the record says what, because a ceiling the credential itself enforces and a tool a vendor has not shipped are different objects with different lifespans.

- **personal Microsoft accounts** — blocked by Microsoft's tenancy rule for the connector — a work or school account is required. "Personal Microsoft accounts (@outlook.com, @hotmail.com) can't be used" _(https://support.claude.com/en/articles/12684923-microsoft-365-connector-security-guide)_
- **other users' private files or emails** — blocked by the delegated permission model — the connector reaches what the signed-in user already reaches, and no more. "Users can't access other users' private files or emails"; delegated permissions reach only what the user already can _(https://support.claude.com/en/articles/12684923-microsoft-365-connector-security-guide)_
- **the Online Archive mailbox** — blocked by Microsoft's search — the archive is a separate store the connector's search does not cover. "Email search doesn't reach a user's separate Online Archive (In-Place Archive) mailbox" _(https://support.claude.com/en/articles/12684923-microsoft-365-connector-security-guide)_
- **a single SharePoint site** — blocked by the connector's design — the underlying search is tenant-wide, so *.Selected permissions are not supported. "Site-specific permissioning (using *.Selected permissions) is not supported because the underlying search is tenant-wide" _(https://support.claude.com/en/articles/12684923-microsoft-365-connector-security-guide)_
- **writing SharePoint or OneDrive files** — blocked by the connector's tool surface — the write tools are mail and Teams, and no file-write tool is listed. no write tool for files is listed; the write tools are mail and Teams _(https://support.claude.com/en/articles/12684923-microsoft-365-connector-security-guide)_

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

