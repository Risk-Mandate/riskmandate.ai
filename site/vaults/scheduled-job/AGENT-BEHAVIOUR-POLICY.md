# AGENT BEHAVIOUR POLICY — A scheduled job running as a service account

> For one agent in one deployment: everything it can do, what you authorised, the gap between the two, and what actually stands in the way. It describes and it does not judge, so it carries no score.

**Vault** `scheduled-job` · **status** template · **shape** `generic/scheduled-job/service-account` · **grant** 2026-09-05 · **mandate** 2026-09-09 · **vocabulary** abp.sgit.ai v0.3.0 · **as at** 2026-09-15

---


## Four objects, and the verb attached to each

| Object | What it is | How it is obtained | Here |
| --- | --- | --- | --- |
| The mandate | What the agent is authorised and expected to do | **Elicited** — you already know it | `MANDATE.md` — 4 wanted, 2 refused, 17 unstated |
| The grant | Everything the agent can do | **Measured** — from the shape, the account, the credentials | `GRANT.md` — 7 capabilities, 0 measured |
| The delta | Excess and shortfall | **Derived** — recomputed whenever either input moves, never edited | `DELTA.md` — 4 excess, 4 unbounded, 1 shortfall |
| The barrier | What stands between the agent and each capability | **Recorded** per row, one of four kinds | the third column of every table |

## The deployment

**A scheduled job running as a service account**, generic. A cron job or scheduled task on a server, under an account that is not a person's, with a credential nobody rotates. It runs when nobody is watching and no person's judgement stands in front of it. DERIVED; not measured on any instance.

## The mandate, in one paragraph

Run on schedule, read its own data, talk to the APIs it was built for with the account it was given, and stop. I did not want it spending money unattended or reaching arbitrary hosts.

## The whole grant, with the mandate beside it

Irreversible rows first. ✓ marks a measured row.

| Capability | What it is | Barrier | Undo | Evidence | Mandate |
| --- | --- | --- | --- | --- | --- |
| `authenticate-as.credential.tenant` | Act in accounts with the credentials it holds | ● none | no | derived | in the mandate |
| `read.file.host` | Read any file the account can reach | ● none | no | derived | in the mandate |
| `send.endpoint.world` | Reach any host on the internet | ● none | no | derived | refused by the mandate |
| `write.budget.tenant` | Spend money or tokens against an account it holds | ● none | no | derived | refused by the mandate |
| `execute.process.host` | Run programs as the account | ● none | with-effort | derived | in the mandate |
| `write.file.host` | Change any file the account can reach | ● none | with-effort | derived | unstated by the mandate |
| `create.schedule.host` | Create something that outlives the turn where it runs (a cron, a service) | ● none | yes | derived | unstated by the mandate |

## The delta

**4 in the grant that the mandate did not ask for.** 2 of those it refused; 2 it never mentioned. **4 have nothing but a setting, a sentence or nothing at all in the way.** 1 wanted and not granted.

Unbounded excess:

- `send.endpoint.world` — Reach any host on the internet — ● none
- `write.budget.tenant` — Spend money or tokens against an account it holds — ● none
- `write.file.host` — Change any file the account can reach — ● none
- `create.schedule.host` — Create something that outlives the turn where it runs (a cron, a service) — ● none


## Prohibitions, each with its barrier

Every line an agent is asked to observe, next to what enforces it. A prohibition shown without its barrier is a claim this document cannot support.

| Line | Barrier | Enforced by |
| --- | --- | --- |
| Do not `send.endpoint.world` — reach any host on the internet | ● none | **nothing** |
| Do not `write.budget.tenant` — spend money or tokens against an account it holds | ● none | **nothing** |
| Do not `write.file.host` — change any file the account can reach | ● none | **nothing** |
| Do not `create.schedule.host` — create something that outlives the turn where it runs (a cron, a service) | ● none | **nothing** |
| Stop and report if a task needs anything above | ◉ expectation | **nothing** — and this is the line that makes the rest useful |

## What is not reachable

- **your machine** — it runs on a server _(by construction)_

## Validity

This describes the deployment shape as at this date. If the risk changed, the deployment changed — not this document. As at **2026-09-15**, against grant 2026-09-05, mandate 2026-09-09, vocabulary v0.3.0. Void when: the grant version changes — a product release, a setting, a connector enabled or removed; the mandate changes — the deployer authorises more or less; the vocabulary version changes — a primitive is added, split or renamed; a barrier moves — a setting becomes a boundary, or a boundary is removed.

## Where a score would live, and why it is not here

The same behaviour policy is dangerous in one deployment and harmless in another, and nothing about the document changed. A score needs the assets and the consequences, and this document has neither. That is not a preference; it is where the information is.

---

_This describes the deployment shape as at this date. If the risk changed, the deployment changed — not this document._ 
No score, rating, level or traffic light appears in this vault or in its data, and none will. The behaviour policy describes; it does not judge. 
Generated by `scripts/site/build-abp-vault.mjs` from `data/grant.json`, `data/mandate.json` and the pinned vocabulary; `data/mandate.json` is the only file a person writes. Licence: the published template is CC BY 4.0; a paid copy carries a commercial licence to the buyer. See LICENCE.md.

