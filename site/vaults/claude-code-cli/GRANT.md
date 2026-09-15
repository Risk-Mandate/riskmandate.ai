# GRANT — everything the agent can do

> Measured from the deployment shape, not from your account and not by you. Every row says how it is known, what stands in the way, and whether it can be undone. Irreversible rows first.

**Vault** `claude-code-cli` · **status** template · **shape** `anthropic/claude-code/local-default` · **grant** 2026-09-05 · **mandate** 2026-09-09 · **vocabulary** abp.sgit.ai v0.3.0 · **as at** 2026-09-15

---


**Shape** Claude Code (the CLI, on your own machine) (Anthropic) · **surface** cli · **grant version** 2026-09-05 · **rows** 16, of which **0 measured** and 16 derived · **widest reach** world

## What the words mean here

The common case: one CLI agent running as your user account, credentials in the home directory, confirmations on, no containment. DERIVED from what a command-line program running as your account architecturally is, not measured on any instance — every row is a claim until somebody runs the probes and contributes the file. The assess library's cli tree is the source.

| Reach | In this shape means |
| --- | --- |
| host | your machine, as your user account |
| tenant | your accounts, with the credentials in your home directory |
| world | the internet |

## The rows

| Capability | What it is | Barrier | Undo | Evidence | Via | What stands in the way |
| --- | --- | --- | --- | --- | --- | --- |
| `authenticate-as.credential.signing` | Sign commits with the key it holds | ● none | no | documented | shell (Bash) | — |
| `authenticate-as.credential.tenant` | Act in accounts with the credentials it holds | ● none | no | derived | shell (Bash) | — |
| `create.record.world` | Publish packages, images or pages under the name it holds | ● none | no | documented | shell (Bash) | — |
| `delete.file.host` | Delete files anywhere the account can reach | ● none | no | derived | shell (Bash), files (Read, Edit, Write) | — |
| `read.credential.host` | Read credentials stored where it runs | ● none | no | documented | shell (Bash) | — |
| `read.file.host` | Read any file the account can reach | ● none | no | derived | shell (Bash), files (Read, Edit, Write) | — |
| `read.record.history` | Read a retained record: shell history, past sessions | ● none | no | documented | shell (Bash) | — |
| `send.endpoint.world` | Reach any host on the internet | ● none | no | derived | shell (Bash), fetch (WebFetch) | — |
| `write.file.host` | Change any file the account can reach | ● none | with-effort | derived | shell (Bash), files (Read, Edit, Write) | — |
| `write.file.project` | Change the project it is working on | ● none | with-effort | derived | shell (Bash), files (Read, Edit, Write) | — |
| `write.repository.project` | Commit to the repository it was pointed at | ● none | with-effort | derived | shell (Bash) | — |
| `write.repository.tenant` | Push to a code host (any branch it can reach) | ◉ expectation | with-effort | derived | shell (Bash) | branch discipline in prose, if any |
| `execute.process.host` | Run programs as the account | ◐ setting | with-effort | derived | shell (Bash) | the tool's own directory restriction and its confirmation prompt — enforced by the tool, which runs inside the grant; anything that can execute as you steps around it |
| `create.schedule.host` | Create something that outlives the turn where it runs (a cron, a service) | ● none | yes | derived | shell (Bash) | — |
| `read.file.project` | Read the project it is working on | ● none | yes | derived | shell (Bash), files (Read, Edit, Write) | — |
| `grant.credential.self` | Change its own permission settings | ◐ setting | yes | derived | shell (Bash) | the settings file is owned by the same account |

## The notes behind the rows

- **`authenticate-as.credential.signing`** — if commit signing is configured for the account, the agent signs as you
- **`authenticate-as.credential.tenant`** — inferred from the credentials the account holds
- **`create.record.world`** — if a registry token is in the home directory
- **`delete.file.host`** — null
- **`read.credential.host`** — a published read-only audit tool enumerates exactly this class in a home directory
- **`read.file.host`** — everything your account can read, because a shell as you reads as you
- **`read.record.history`** — shell history and the harness's own transcripts
- **`send.endpoint.world`** — curl reaches the world unless something above the account stops it
- **`write.file.host`** — null
- **`write.file.project`** — null
- **`write.repository.project`** — null
- **`write.repository.tenant`** — null
- **`execute.process.host`** — null
- **`create.schedule.host`** — a shell as you can write a crontab
- **`read.file.project`** — null
- **`grant.credential.self`** — anything running as you can rewrite the file that turns the prompt off

## Not reachable from this shape

| What | Why | Source |
| --- | --- | --- |

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

