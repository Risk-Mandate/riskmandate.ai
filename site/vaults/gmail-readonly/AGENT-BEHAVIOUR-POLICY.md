# AGENT BEHAVIOUR POLICY — An assistant on a personal Gmail mailbox

> For one agent in one deployment: everything it can do, what you authorised, the gap between the two, and what actually stands in the way. It describes and it does not judge, so it carries no score.

**Vault** `gmail-readonly` · **status** template · **shape** `google/gmail/readonly-connector` · **grant** 2026-09-15 · **mandate** 2026-09-15 · **vocabulary** abp.sgit.ai v0.3.0 · **as at** 2026-09-15

---


## Four objects, and the verb attached to each

| Object | What it is | How it is obtained | Here |
| --- | --- | --- | --- |
| The mandate | What the agent is authorised and expected to do | **Elicited** — you already know it | `MANDATE.md` — 1 wanted, 2 refused, 20 unstated |
| The grant | Everything the agent can do | **Measured** — from the shape, the account, the credentials | `GRANT.md` — 4 capabilities, 0 measured |
| The delta | Excess and shortfall | **Derived** — recomputed whenever either input moves, never edited | `DELTA.md` — 3 excess, 2 unbounded, 0 shortfall |
| The barrier | What stands between the agent and each capability | **Recorded** per row, one of four kinds | the third column of every table |

## The deployment

**An assistant connected to a personal Gmail mailbox with gmail.readonly**, Google (the scope); the assistant's vendor holds the token. Any assistant a person connects to their own Gmail with the read-only scope — the shape Lab 01 found first. The finding is that the grant is user-shaped: the narrowest scope that returns a message body returns every body, and nothing in the scope list narrows it by sender, label or date. Whose mail it is, is the question: most of a mailbox was written by other people.

## The mandate, in one paragraph

I connected it to my mailbox so it could find things and summarise threads. It is my personal mail, and most of it was written by other people who never agreed to this.

## The whole grant, with the mandate beside it

Irreversible rows first. ✓ marks a measured row.

| Capability | What it is | Barrier | Undo | Evidence | Mandate |
| --- | --- | --- | --- | --- | --- |
| `read.message.tenant` | Read mail or chat it is connected to | ○ boundary | no | documented | in the mandate |
| `authenticate-as.credential.tenant` | Act in accounts with the credentials it holds | ○ boundary | no | documented | unstated by the mandate |
| `read.credential.host` | Read credentials stored where it runs | ● none | no | inferred | refused by the mandate |
| `read.record.history` | Read a retained record: shell history, past sessions | ● none | no | inferred | unstated by the mandate |

## The delta

**3 in the grant that the mandate did not ask for.** 1 of those it refused; 2 it never mentioned. **2 have nothing but a setting, a sentence or nothing at all in the way.** Nothing wanted is missing.

Unbounded excess:

- `read.credential.host` — Read credentials stored where it runs — ● none
- `read.record.history` — Read a retained record: shell history, past sessions — ● none


## Prohibitions, each with its barrier

Every line an agent is asked to observe, next to what enforces it. A prohibition shown without its barrier is a claim this document cannot support.

| Line | Barrier | Enforced by |
| --- | --- | --- |
| Do not `authenticate-as.credential.tenant` — act in accounts with the credentials it holds | ○ boundary | Google's consent screen; the assistant's vendor holds the refresh token |
| Do not `read.credential.host` — read credentials stored where it runs | ● none | **nothing** |
| Do not `read.record.history` — read a retained record: shell history, past sessions | ● none | **nothing** |
| Stop and report if a task needs anything above | ◉ expectation | **nothing** — and this is the line that makes the rest useful |

## What is not reachable

- **sending, forwarding or drafting mail** — gmail.readonly grants no send; gmail.send, gmail.compose and gmail.modify are separate scopes and are not in this grant _(https://developers.google.com/workspace/gmail/api/auth/scopes)_
- **deleting or labelling mail** — no write scope; gmail.labels and gmail.modify are separate _(https://developers.google.com/workspace/gmail/api/auth/scopes)_
- **your machine, your drive** — a mailbox connector reaches a mailbox _(https://developers.google.com/workspace/gmail/api/auth/scopes)_

## What is not settled

**3 open questions** the grant cannot answer from published pages — listed in `RESEARCH-NEEDED.md` with how each is settled. **1 places where the vendor's own pages disagree** — in `GRANT.md`, published unresolved. A row with an open question against it stands at the evidence tier it shows; nothing here was obtained by probing anybody else's system.

## Validity

This describes the deployment shape as at this date. If the risk changed, the deployment changed — not this document. As at **2026-09-15**, against grant 2026-09-15, mandate 2026-09-15, vocabulary v0.3.0. Void when: the grant version changes — a product release, a setting, a connector enabled or removed; the mandate changes — the deployer authorises more or less; the vocabulary version changes — a primitive is added, split or renamed; a barrier moves — a setting becomes a boundary, or a boundary is removed.

## Where a score would live, and why it is not here

The same behaviour policy is dangerous in one deployment and harmless in another, and nothing about the document changed. A score needs the assets and the consequences, and this document has neither. That is not a preference; it is where the information is.

---

_This describes the deployment shape as at this date. If the risk changed, the deployment changed — not this document._ 
No score, rating, level or traffic light appears in this vault or in its data, and none will. The behaviour policy describes; it does not judge. 
Generated by `scripts/site/build-abp-vault.mjs` from `data/grant.json`, `data/mandate.json` and the pinned vocabulary; `data/mandate.json` is the only file a person writes. Licence: the published template is CC BY 4.0; a paid copy carries a commercial licence to the buyer. See LICENCE.md.

