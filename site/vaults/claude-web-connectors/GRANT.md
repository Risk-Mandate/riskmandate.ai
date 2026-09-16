# GRANT — everything the agent can do

> Measured from the deployment shape, not from your account and not by you. Every row says how it is known, what stands in the way, and whether it can be undone. Irreversible rows first.

**Vault** `claude-web-connectors` · **status** template · **shape** `anthropic/claude-web/connectors-on` · **grant** 2026-09-05 · **mandate** 2026-09-09 · **vocabulary** abp.sgit.ai v0.3.0 · **as at** 2026-09-15

---


**Shape** Claude (in the browser, with connectors switched on) (Anthropic) · **surface** web · **grant version** 2026-09-05 · **rows** 5, of which **0 measured** and 5 derived · **widest reach** tenant

## What the words mean here

The same web assistant with connectors you switched on — a drive, a code host, a cloud account. Each connector is a boundary (the vendor holds the token, scoped as you scoped it) and each one is a row you granted by clicking. DERIVED from the assess library's web tree; which connectors is yours to name.

| Reach | In this shape means |
| --- | --- |
| host | what the drive connector is scoped to; not your machine |
| tenant | the accounts you connected, as you scoped them |
| world | the vendor's egress |

## The rows

| Capability | What it is | Barrier | Undo | Evidence | Via | What stands in the way |
| --- | --- | --- | --- | --- | --- | --- |
| `authenticate-as.credential.tenant` | Act in accounts with the credentials it holds | ○ boundary | no | derived | connectors | the connector's scope |
| `read.file.host` | Read any file the account can reach | ○ boundary | no | derived | connectors | the connector's scope, held by the vendor |
| `read.message.tenant` | Read mail or chat it is connected to | ○ boundary | no | derived | connectors | the connector's scope |
| `write.repository.tenant` | Push to a code host (any branch it can reach) | ○ boundary | with-effort | derived | connectors | the connector's scope |
| `read.file.project` | Read the project it is working on | ● none | yes | derived | conversation and uploads | — |

## The notes behind the rows

- **`authenticate-as.credential.tenant`** — a cloud connector acts as you
- **`read.file.host`** — a drive connector: your other files, as scoped
- **`read.message.tenant`** — a mail or chat connector reads your mail
- **`write.repository.tenant`** — a code-host connector
- **`read.file.project`** — null

## Not reachable from this shape

| What | Why | Source |
| --- | --- | --- |
| your machine's files | a browser tab; the connector reaches a drive, not a disk | assess/library.json (web: home) |

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
Generated by `scripts/site/build-abp-vault.mjs` from `data/grant.json`, `data/mandate.json` and the pinned vocabulary; `data/mandate.json` is the only file a person writes. Licence: the published template is CC BY 4.0; a paid copy carries a commercial licence to the buyer. See LICENCE.md.

