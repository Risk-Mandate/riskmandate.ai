# GRANT — everything the agent can do

> Measured from the deployment shape, not from your account and not by you. Every row says how it is known, what stands in the way, and whether it can be undone. Irreversible rows first.

**Vault** `n8n-owner-api-key` · **status** template · **shape** `n8n/self-hosted/owner-api-key` · **grant** 2026-09-13 · **mandate** 2026-09-13 · **vocabulary** abp.sgit.ai v0.3.0 · **as at** 2026-09-15

---


**Shape** A self-hosted n8n instance, reached with an owner-scoped API key (n8n (self-hosted)) · **surface** api · **grant version** 2026-09-13 · **rows** 8, of which **7 measured** and 1 derived · **widest reach** world

## What the words mean here

An agent holding an owner-scoped API key for a self-hosted workflow-automation platform, reaching it over its REST API and its MCP interface. The first grant on this site measured on a live instance rather than read from a page: a sandbox stood up for the exercise, with nothing else on it, probed on 13 September 2026 by an early beta user's agent. It built and ran a real AI-agent workflow against a real model credential, created and deleted one test workflow to measure create-change-delete and activation, and probed the edges — every account visible, an outbound node accepted with no restriction on target host, and credential metadata readable through one door and not through another. The rows are that write-up, translated row for row into the v0.3.0 vocabulary; where its barrier reading and the vocabulary's differ, the note says so.

| Reach | In this shape means |
| --- | --- |
| project | the workflows on the instance — the thing the key was given to build |
| host | the instance itself: its accounts, its credential store, its execution records |
| tenant | the platform as an account holder: activation, schedules, the model credential it spends against |
| world | any host an outbound node can be pointed at — accepted on creation; what the platform's own server can reach was not tested |

## The rows

| Capability | What it is | Barrier | Undo | Evidence | Via | What stands in the way | Whose material |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `send.endpoint.world` | Reach any host on the internet | ● none | no | measured ✓ | REST API: an outbound-HTTP node on creation | — | mixed |
| `read.credential.host` | Read credentials stored where it runs | ● none | no | measured ✓ | the MCP interface: list credentials, REST API: credentials (blocked at the investigator's gateway) | — | organisation |
| `authenticate-as.credential.tenant` | Act in accounts with the credentials it holds | ● none | no | measured ✓ | the owner-scoped API key | — | organisation |
| `write.budget.tenant` | Spend money or tokens against an account it holds | ● none | no | measured ✓ | the AI Agent workflow, against a real model credential | — | organisation |
| `read.record.history` | Read a retained record: shell history, past sessions | ● none | no | measured ✓ | REST API: executions | — | organisation |
| `write.file.project` | Change the project it is working on | ● none | with-effort | measured ✓ | REST API: workflows | — | organisation |
| `execute.process.host` | Run programs as the account | ● none | with-effort | derived | a Code node, not created | — | organisation |
| `create.schedule.tenant` | Create something that outlives the session, on the platform (a routine, a scheduled trigger, a new session) | ● none | yes | measured ✓ | REST API: activate, the MCP interface: publish | — | organisation |

**Whose material** is not in the published grammar. It is the property Lab 01 found a connector shape needs — `own`, `organisation`, `third_party` or `mixed` — and is asked of the model site as Lab 03 request 1. `mixed` is the finding: no setting any of these vendors offers makes it `own`.

## The notes behind the rows

- **`send.endpoint.world`** — the API accepted a generic outbound-HTTP node pointed at an external URL with no restriction on target host; no allow-list observed. No workflow was executed against a non-public target, so what the platform's own server can reach on the network is not tested and is an open question below.
- **`read.credential.host`** — the identical operation was blocked through the REST path — by the measuring environment's own gateway, not the platform — and returned full credential metadata through the MCP interface. Metadata only; nothing was exported. The write-up's own lesson: the barrier class of a capability can depend on which door was used to ask.
- **`authenticate-as.credential.tenant`** — owner level on the account's personal project; the key was held for the session only and never persisted. Everything below it follows from it.
- **`write.budget.tenant`** — a real model credential was added by the deployer through the UI and a real execution returned a model response through the node — spend against that account, as the workflow's author. The first attempt failed with "does not have access to the credential": a wrong reference from ambiguous name matching between two credentials of the same type, not a barrier, found only once the MCP interface could list them.
- **`read.record.history`** — execution records read: the zero-execution baseline, then the one real execution with its status and the model's response.
- **`write.file.project`** — full create-change-delete confirmed: created, deactivated and deleted one real test workflow in the session. The write-up records the API key as "the technical gate — broad, but a real gate, not a prose rule"; in this vocabulary a key that permits a thing is the grant, not a barrier, so the row stands at none.
- **`execute.process.host`** — a workflow can carry a code node that runs on the platform's own server. Not tested in the session; derived from what the platform is, and an open question below.
- **`create.schedule.tenant`** — a webhook-triggered workflow was built, activated and executed. Activation is refused for a workflow with no trigger — a check on shape, not on risk — so the platform bounds nothing about what an activated workflow does.

## Not reachable from this shape

| What | Why | Source |
| --- | --- | --- |
| activating a workflow with no trigger, webhook or polling node | permitted by the API and rejected by the platform: a structural check on the workflow's shape, not on what it does once triggered | an independent measured check, 13 September 2026, run by an early beta user's agent against a sandbox instance stood up for the purpose; the write-up is held by RiskMandate |
| the credentials endpoint over the direct REST path — from the measuring environment | blocked before it reached the platform by the measuring environment's own egress gateway, which intercepts any path naming "credentials". A barrier in the investigator's environment, not the platform's; the same operation was open through the MCP interface | an independent measured check, 13 September 2026, run by an early beta user's agent against a sandbox instance stood up for the purpose; the write-up is held by RiskMandate |

## Where the vendor's own pages disagree

Advertised in one place, permitted in another, and the two do not match. Published unresolved on purpose: settling any of these by connecting an assistant and trying would mean probing somebody else's system, which is out of bounds here. If the vendor says which page is right, this table changes and says so.

| What is advertised | What the grant permits | State |
| --- | --- | --- |
| the write-up classes the API key as a "setting" barrier — "the API key itself is the technical gate: broad, but a real gate, not a prose rule" | in the v0.3.0 vocabulary a setting is "a switch the agent's own account can flip" and the enforcer test says a control bounds a grant only if enforced by something the grant does not include; the key is the grant, so every row it permits stands at none | **unresolved** |,| the platform's documented authorisation model: credential management is owner-level (from the write-up, "unconfirmed from outside") | credential metadata was readable through the MCP interface; whether the same key can create, change or delete credentials was not tested | **undocumented** |

Sources: <https://abp.sgit.ai/data/barriers.json>

## Granted, and not in the grammar

The connector permits these and none of the 23 primitives names them. They are recorded here so the grant is not silently narrower than the consent screen, and asked of the model site.

| What the connector can do | Permission | Why no row |
| --- | --- | --- |
| see every account on the instance | the owner-scoped key; no scoping beyond that observed | no primitive reads the user directory of a platform; the nearest, read.record.history, is a retained record, not a roster. Measured: a handful of accounts, one owner created the day of the session. |,| read the instance's health | the owner-scoped key | no primitive; measured as healthy, recorded for completeness |

## Open questions

**4** things this grant cannot settle from the pages it was read from. Each is in `RESEARCH-NEEDED.md` with how to settle it, and can be handed to a separate agent. Until it is answered, the row it belongs to stands at the evidence tier shown.

## The four barriers, and the test

| | Barrier | What stands in the way | Is it a control |
| --- | --- | --- | --- |
| ● | none | nothing in the way | no |
| ◉ | expectation | a rule in prose, enforced by nobody | no |
| ◐ | setting | a switch the agent's own account can flip | no |
| ○ | boundary | enforced above the grant, out of the agent's reach | **yes** |

> A control bounds a grant only if it is enforced by something the grant does not include.

A setting the agent's own account can change is not a control, because the grant includes the ability to remove the bound. A boundary enforced above it is one, because it does not.

## Evidence tiers

| Tier | Means |
| --- | --- |
| derived | from what the thing architecturally is; a claim until somebody runs the probes |
| inferred | from another row or another profile, by reasoning rather than by observation |
| self-reported | reported by the operator, the harness or the tool itself, without an independent probe |
| documented | the vendor, or a published tool, says so |
| measured ✓ | a probe run on an instance, dated, with an evidence file |
| observed ✓ | seen directly, on the thing itself, by the thing itself |

✓ marks the tiers this vault counts as measured. Nothing here was obtained by probing anybody else's system: a row is measured only from a system we are entitled to run, or from the vendor's own published documentation.

## Ask the agent to check it

The agent is running in the deployment this file describes, so it can look. What it reports is a claim until a log held outside it agrees — but a claim from inside the deployment is a better starting point than a template. Paste this into a session running in the shape above:

```
You are running inside the deployment described in GRANT.md. Compare each row with what you
can actually reach from here, and report — do not change any file except the one named below.

For every row: PRESENT, ABSENT or CANNOT TELL; which tool reaches it; one line of evidence
(a command's output, a tool's own description, a documentation sentence with its URL).
Never exercise a capability whose undo class is "no" to prove it exists: presence of a
credential file is evidence; using it is not permitted.
Add a row for anything you can reach that is not listed, in verb.object.reach form, using
only the 23 primitives in data/vocabulary/capabilities.json. A new path, host or mailbox is
an instance of an existing primitive, not a new one.
Do not touch MANDATE.md or data/mandate.json — that file is the deployer's, not yours.
Write the result to history/grant-check--<today>.md with the date and the tool versions
you can see. Everything in it is self-report; say so at the top.
```

---

_This describes the deployment shape as at this date. If the risk changed, the deployment changed — not this document._ 
No score, rating, level or traffic light appears in this vault or in its data, and none will. The behaviour policy describes; it does not judge. 
Generated by `scripts/site/build-abp-vault.mjs` from `data/grant.json`, `data/mandate.json` and the pinned vocabulary; `data/mandate.json` is the only file a person writes. Licence: CC BY 4.0.

