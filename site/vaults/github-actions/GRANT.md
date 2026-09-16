# GRANT — everything the agent can do

> Measured from the deployment shape, not from your account and not by you. Every row says how it is known, what stands in the way, and whether it can be undone. Irreversible rows first.

**Vault** `github-actions` · **status** template · **shape** `github/actions-runner/ci` · **grant** 2026-08-26 · **mandate** 2026-09-09 · **vocabulary** abp.sgit.ai v0.3.0 · **as at** 2026-09-15

---


**Shape** Actions runner (a hosted CI job) (GitHub) · **surface** ci · **grant version** 2026-08-26 · **rows** 8, of which **8 measured** and 0 derived · **widest reach** world

## What the words mean here

An ephemeral CI job with no agent, no hooks, and one platform-enforced grant: the workflow's permissions block. MEASURED on 26 August by measure.py inside the runner (the library's second entry), translated into findings on 5 September. Unrestricted egress; the token cannot write.

| Reach | In this shape means |
| --- | --- |
| host | the runner — destroyed after the job; not your machine |
| tenant | the repository, with the workflow's token |
| world | the internet, unrestricted |

## The rows

| Capability | What it is | Barrier | Undo | Evidence | Via | What stands in the way |
| --- | --- | --- | --- | --- | --- | --- |
| `delete.file.host` | Delete files anywhere the account can reach | ● none | no | observed ✓ | the job's shell | — |
| `read.file.host` | Read any file the account can reach | ● none | no | observed ✓ | the job's shell | — |
| `send.endpoint.world` | Reach any host on the internet | ● none | no | observed ✓ | the job's shell | — |
| `execute.process.host` | Run programs as the account | ● none | with-effort | observed ✓ | the job's shell | — |
| `write.file.host` | Change any file the account can reach | ● none | with-effort | observed ✓ | the job's shell | — |
| `write.file.project` | Change the project it is working on | ● none | with-effort | observed ✓ | the job's shell | — |
| `write.repository.project` | Commit to the repository it was pointed at | ○ boundary | with-effort | observed ✓ | the job's shell | the checkout is writable, but the token is contents:read, so nothing written can leave |
| `read.file.project` | Read the project it is working on | ● none | yes | observed ✓ | the job's shell | — |

## The notes behind the rows

- **`delete.file.host`** — the runner's user with passwordless escalation: every file on the ephemeral machine
- **`read.file.host`** — the runner's user with passwordless escalation: every file on the ephemeral machine
- **`send.endpoint.world`** — github.com 200, pypi.org 200, example.com 200 — UNRESTRICTED egress, no proxy
- **`execute.process.host`** — runs as uid 1001; passwordless escalation available (n1a) — programs run as this user and can escalate
- **`write.file.host`** — the runner's user with passwordless escalation: every file on the ephemeral machine
- **`write.file.project`** — the checked-out tree at this ref is writable by the job
- **`write.repository.project`** — the checked-out tree at this ref is writable by the job
- **`read.file.project`** — the checked-out tree at this ref is readable — including anything a contributor committed by mistake

## Not reachable from this shape

| What | Why | Source |
| --- | --- | --- |
| your machine | a hosted runner | library entry 2 |
| the repository, for writing | the token is contents:read | evidence: ci.permissions-block |

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

