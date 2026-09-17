# AGENT BEHAVIOUR POLICY — A self-hosted n8n instance, owner API key

> For one agent in one deployment: everything it can do, what you authorised, the gap between the two, and what actually stands in the way. It describes and it does not judge, so it carries no score.

**Vault** `n8n-owner-api-key` · **status** template · **shape** `n8n/self-hosted/owner-api-key` · **grant** 2026-09-13 · **mandate** 2026-09-13 · **vocabulary** abp.sgit.ai v0.3.0 · **as at** 2026-09-15

---


## Four objects, and the verb attached to each

| Object | What it is | How it is obtained | Here |
| --- | --- | --- | --- |
| The mandate | What the agent is authorised and expected to do | **Elicited** — you already know it | `MANDATE.md` — 4 wanted, 2 refused, 17 unstated |
| The grant | Everything the agent can do | **Measured** — from the shape, the account, the credentials | `GRANT.md` — 8 capabilities, 7 measured |
| The delta | Excess and shortfall | **Derived** — recomputed whenever either input moves, never edited | `DELTA.md` — 4 excess, 4 unbounded, 0 shortfall |
| The barrier | What stands between the agent and each capability | **Recorded** per row, one of four kinds | the third column of every table |

## The deployment

**A self-hosted n8n instance, reached with an owner-scoped API key**, n8n (self-hosted). An agent holding an owner-scoped API key for a self-hosted workflow-automation platform, reaching it over its REST API and its MCP interface. The first grant on this site measured on a live instance rather than read from a page: a sandbox stood up for the exercise, with nothing else on it, probed on 13 September 2026 by an early beta user's agent. It built and ran a real AI-agent workflow against a real model credential, created and deleted one test workflow to measure create-change-delete and activation, and probed the edges — every account visible, an outbound node accepted with no restriction on target host, and credential metadata readable through one door and not through another. The rows are that write-up, translated row for row into the v0.3.0 vocabulary; where its barrier reading and the vocabulary's differ, the note says so.

## The mandate, in one paragraph

A sandbox stood up for this exercise, with nothing else authorised: build and run one real AI-agent workflow against one real model credential, and measure what else the key can do. No production workflows, no real data, no other users' workflows are in scope. Everything beyond that — arbitrary automations, arbitrary external targets, the credential store, the account roster — is not mandated; it does not exist here yet.

## The whole grant, with the mandate beside it

Irreversible rows first. ✓ marks a measured row.

| Capability | What it is | Barrier | Undo | Evidence | Mandate |
| --- | --- | --- | --- | --- | --- |
| `send.endpoint.world` | Reach any host on the internet | ● none | no | measured ✓ | refused by the mandate |
| `read.credential.host` | Read credentials stored where it runs | ● none | no | measured ✓ | refused by the mandate |
| `authenticate-as.credential.tenant` | Act in accounts with the credentials it holds | ● none | no | measured ✓ | unstated by the mandate |
| `write.budget.tenant` | Spend money or tokens against an account it holds | ● none | no | measured ✓ | in the mandate |
| `read.record.history` | Read a retained record: shell history, past sessions | ● none | no | measured ✓ | in the mandate |
| `write.file.project` | Change the project it is working on | ● none | with-effort | measured ✓ | in the mandate |
| `execute.process.host` | Run programs as the account | ● none | with-effort | derived | unstated by the mandate |
| `create.schedule.tenant` | Create something that outlives the session, on the platform (a routine, a scheduled trigger, a new session) | ● none | yes | measured ✓ | in the mandate |

## The delta

**4 in the grant that the mandate did not ask for.** 2 of those it refused; 2 it never mentioned. **4 have nothing but a setting, a sentence or nothing at all in the way.** Nothing wanted is missing.

Unbounded excess:

- `send.endpoint.world` — Reach any host on the internet — ● none
- `read.credential.host` — Read credentials stored where it runs — ● none
- `authenticate-as.credential.tenant` — Act in accounts with the credentials it holds — ● none
- `execute.process.host` — Run programs as the account — ● none


## Prohibitions, each with its barrier

Every line an agent is asked to observe, next to what enforces it. A prohibition shown without its barrier is a claim this document cannot support.

| Line | Barrier | Enforced by |
| --- | --- | --- |
| Do not `send.endpoint.world` — reach any host on the internet | ● none | **nothing** |
| Do not `read.credential.host` — read credentials stored where it runs | ● none | **nothing** |
| Do not `authenticate-as.credential.tenant` — act in accounts with the credentials it holds | ● none | **nothing** |
| Do not `execute.process.host` — run programs as the account | ● none | **nothing** |
| Stop and report if a task needs anything above | ◉ expectation | **nothing** — and this is the line that makes the rest useful |

## What is blocked, and who holds the block

Everything above is what the agent can do once every block is applied. These are the things something withholds — and the record says what, because a ceiling the credential itself enforces and a tool a vendor has not shipped are different objects with different lifespans.

- **activating a workflow with no trigger, webhook or polling node** — blocked by the platform's structural check on the workflow's shape, applied after the API has accepted the call. permitted by the API and rejected by the platform: a structural check on the workflow's shape, not on what it does once triggered _(an independent measured check, 13 September 2026, run by an early beta user's agent against a sandbox instance stood up for the purpose; the write-up is held by RiskMandate)_
- **the credentials endpoint over the direct REST path — from the measuring environment** — blocked by the measuring environment's own egress gateway, which intercepts any path naming credentials — a barrier in the investigator's environment, not the platform's. blocked before it reached the platform by the measuring environment's own egress gateway, which intercepts any path naming "credentials". A barrier in the investigator's environment, not the platform's; the same operation was open through the MCP interface _(an independent measured check, 13 September 2026, run by an early beta user's agent against a sandbox instance stood up for the purpose; the write-up is held by RiskMandate)_

## What is not settled

**4 open questions** the grant cannot answer from published pages — listed in `RESEARCH-NEEDED.md` with how each is settled. **2 places where the vendor's own pages disagree** — in `GRANT.md`, published unresolved. A row with an open question against it stands at the evidence tier it shows; nothing here was obtained by probing anybody else's system.

## Validity

This describes the deployment shape as at this date. If the risk changed, the deployment changed — not this document. As at **2026-09-15**, against grant 2026-09-13, mandate 2026-09-13, vocabulary v0.3.0. Void when: the grant version changes — a product release, a setting, a connector enabled or removed; the mandate changes — the deployer authorises more or less; the vocabulary version changes — a primitive is added, split or renamed; a barrier moves — a setting becomes a boundary, or a boundary is removed.

## Where a score would live, and why it is not here

The same behaviour policy is dangerous in one deployment and harmless in another, and nothing about the document changed. A score needs the assets and the consequences, and this document has neither. That is not a preference; it is where the information is.

---

_This describes the deployment shape as at this date. If the risk changed, the deployment changed — not this document._ 
No score, rating, level or traffic light appears in this vault or in its data, and none will. The behaviour policy describes; it does not judge. 
Generated by `scripts/site/build-abp-vault.mjs` from `data/grant.json`, `data/mandate.json` and the pinned vocabulary; `data/mandate.json` is the only file a person writes. Licence: the published template is CC BY 4.0; a paid copy carries a commercial licence to the buyer. See LICENCE.md.

