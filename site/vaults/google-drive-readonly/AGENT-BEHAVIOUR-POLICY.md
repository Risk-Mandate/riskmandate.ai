# AGENT BEHAVIOUR POLICY — An assistant on a personal Google Drive

> For one agent in one deployment: everything it can do, what you authorised, the gap between the two, and what actually stands in the way. It describes and it does not judge, so it carries no score.

**Vault** `google-drive-readonly` · **status** template · **shape** `google/drive/readonly-connector` · **grant** 2026-09-15 · **mandate** 2026-09-15 · **vocabulary** abp.sgit.ai v0.3.0 · **as at** 2026-09-15

---


## Four objects, and the verb attached to each

| Object | What it is | How it is obtained | Here |
| --- | --- | --- | --- |
| The mandate | What the agent is authorised and expected to do | **Elicited** — you already know it | `MANDATE.md` — 1 wanted, 3 refused, 19 unstated |
| The grant | Everything the agent can do | **Measured** — from the shape, the account, the credentials | `GRANT.md` — 3 capabilities, 0 measured |
| The delta | Excess and shortfall | **Derived** — recomputed whenever either input moves, never edited | `DELTA.md` — 2 excess, 1 unbounded, 0 shortfall |
| The barrier | What stands between the agent and each capability | **Recorded** per row, one of four kinds | the third column of every table |

## The deployment

**An assistant connected to a personal Google Drive with drive.readonly**, Google (the scope); the assistant's vendor holds the token. Any assistant a person connects to their own Drive with the read-only scope. Google classes drive.readonly as a restricted scope — "View and download all your Drive files" — and the per-file alternative, drive.file, reaches only files the user opened with the app. An assistant that searches needs the restricted one. The corpus it then searches defaults to the user corpus: files owned by or shared to the user.

## The mandate, in one paragraph

I connected my drive so it could find documents and answer questions about them. My drive has other people's files in it — everything a colleague or a client ever shared — and I did not think about that when I clicked.

## The whole grant, with the mandate beside it

Irreversible rows first. ✓ marks a measured row.

| Capability | What it is | Barrier | Undo | Evidence | Mandate |
| --- | --- | --- | --- | --- | --- |
| `read.file.host` | Read any file the account can reach | ○ boundary | no | documented | in the mandate |
| `authenticate-as.credential.tenant` | Act in accounts with the credentials it holds | ○ boundary | no | documented | unstated by the mandate |
| `read.credential.host` | Read credentials stored where it runs | ● none | no | inferred | refused by the mandate |

## The delta

**2 in the grant that the mandate did not ask for.** 1 of those it refused; 1 it never mentioned. **1 have nothing but a setting, a sentence or nothing at all in the way.** Nothing wanted is missing.

Unbounded excess:

- `read.credential.host` — Read credentials stored where it runs — ● none


## Prohibitions, each with its barrier

Every line an agent is asked to observe, next to what enforces it. A prohibition shown without its barrier is a claim this document cannot support.

| Line | Barrier | Enforced by |
| --- | --- | --- |
| Do not `authenticate-as.credential.tenant` — act in accounts with the credentials it holds | ○ boundary | Google's consent screen; the assistant's vendor holds the refresh token |
| Do not `read.credential.host` — read credentials stored where it runs | ● none | **nothing** |
| Stop and report if a task needs anything above | ◉ expectation | **nothing** — and this is the line that makes the rest useful |

## What is blocked, and who holds the block

Everything above is what the agent can do once every block is applied. These are the things something withholds — and the record says what, because a ceiling the credential itself enforces and a tool a vendor has not shipped are different objects with different lifespans.

- **writing, moving, sharing or deleting files** — blocked by the scope the deployer asked for — drive.readonly is view and download, and drive and drive.file are separate scopes this credential does not carry. drive.readonly is "View and download"; drive and drive.file are separate scopes and are not in this grant _(https://developers.google.com/workspace/drive/api/guides/api-specific-auth)_
- **your machine** — blocked by the API itself — a drive credential reaches a drive. a drive connector reaches a drive, not a disk _(https://developers.google.com/workspace/drive/api/guides/api-specific-auth)_

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

