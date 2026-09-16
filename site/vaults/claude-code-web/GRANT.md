# GRANT — everything the agent can do

> Measured from the deployment shape, not from your account and not by you. Every row says how it is known, what stands in the way, and whether it can be undone. Irreversible rows first.

**Vault** `claude-code-web` · **status** template · **shape** `anthropic/claude-code-remote/ccr-container` · **grant** 2026-09-05.2 · **mandate** 2026-09-09 · **vocabulary** abp.sgit.ai v0.3.0 · **as at** 2026-09-15

---


**Shape** Claude Code on the web (a remote session container) (Anthropic) · **surface** agentbox · **grant version** 2026-09-05.2 · **rows** 15, of which **13 measured** and 2 derived · **widest reach** tenant

## What the words mean here

A managed cloud container, ephemeral, one git repository attached, an egress proxy above it, and a set of harness tools scoped by the platform. MEASURED, by the thing being profiled: the shell probed on 5 September with probes/run.py, the fetch tool's reach and the harness tools reported by the operator. HOST MEANS THE CONTAINER, not your machine; TENANT means the platform's scoped tokens, not your accounts. The same environment measured on 26 August is the Grant & Mandate library's first entry, and the two agree on every row they share.

| Reach | In this shape means |
| --- | --- |
| host | this container — ephemeral, the vendor's; not your machine |
| tenant | the attached repository and the platform's scoped tokens; not your accounts |
| world | the hosts the proxy allows |

## The rows

| Capability | What it is | Barrier | Undo | Evidence | Via | What stands in the way |
| --- | --- | --- | --- | --- | --- | --- |
| `authenticate-as.credential.signing` | Sign commits with the key it holds | ● none | no | observed ✓ | shell (Bash) | — |
| `delete.file.host` | Delete files anywhere the account can reach | ● none | no | observed ✓ | shell (Bash) | — |
| `read.credential.host` | Read credentials stored where it runs | ● none | no | observed ✓ | shell (Bash) | — |
| `read.file.host` | Read any file the account can reach | ● none | no | observed ✓ | shell (Bash) | — |
| `read.record.history` | Read a retained record: shell history, past sessions | ● none | no | observed ✓ | shell (Bash) | — |
| `authenticate-as.credential.tenant` | Act in accounts with the credentials it holds | ○ boundary | no | inferred | shell (Bash), harness (MCP and built-in tools) | the token's scope, set by the platform (in-scope repositories only) |
| `send.endpoint.allowed` | Reach a permitted list of hosts | ○ boundary | no | observed ✓ | shell (Bash), fetch (WebFetch), harness (MCP and built-in tools) | a mandatory egress proxy configured above this process — hosts it refuses are refused with a 403 on the CONNECT; the six hosts probed on 5 September all answered |
| `execute.process.host` | Run programs as the account | ● none | with-effort | observed ✓ | shell (Bash) | — |
| `write.file.host` | Change any file the account can reach | ● none | with-effort | observed ✓ | shell (Bash) | — |
| `write.file.project` | Change the project it is working on | ● none | with-effort | observed ✓ | shell (Bash) | — |
| `write.repository.project` | Commit to the repository it was pointed at | ● none | with-effort | observed ✓ | shell (Bash) | — |
| `write.repository.tenant` | Push to a code host (any branch it can reach) | ◐ setting | with-effort | observed ✓ | shell (Bash), harness (MCP and built-in tools) | pre-commit and pre-push hooks in the clone (the mandate hook and the insurance policy) — refuse by exit code, --no-verify passes; no branch rule at the host |
| `read.file.project` | Read the project it is working on | ● none | yes | observed ✓ | shell (Bash), harness (MCP and built-in tools) | — |
| `create.schedule.tenant` | Create something that outlives the session, on the platform (a routine, a scheduled trigger, a new session) | ◐ setting | yes | self-reported | harness (MCP and built-in tools) | the platform's routines are the operator's to list and delete |
| `create.schedule.host` | Create something that outlives the turn where it runs (a cron, a service) | ○ boundary | yes | observed ✓ | shell (Bash) | the container is ephemeral: whatever is scheduled here dies with it |

## The notes behind the rows

- **`authenticate-as.credential.signing`** — commits are signed with the session's own key, registered as an agent identity in this site's registry (sha256-f9facb4c94da6c19) — not with yours
- **`delete.file.host`** — anything in the container, including the clone; irreversible for the container, and the container is disposable
- **`read.credential.host`** — the credential-shaped paths present are the SESSION'S OWN: its commit-signing key and its vault keystore. No user credential is in the container; presence cannot tell whose a key is, so this is the operator's account
- **`read.file.host`** — any file in the container — the attached clone, the harness's state, the system. Not your machine's files (the assess tree's 'home: boundary')
- **`read.record.history`** — the harness's project directory holds this session's own earlier tool outputs; no user shell history exists here
- **`authenticate-as.credential.tenant`** — five key-shaped variables and a code-host token — the platform's, scoped to in-scope repositories; it acts as the platform's app, never as you
- **`send.endpoint.allowed`** — six of six probed hosts answered through the proxy; a sibling container measured on 4 September had three refused: same product, two policies
- **`execute.process.host`** — root inside the container: every process and file IN THE CONTAINER. The container is the host; your machine is not reachable
- **`write.file.host`** — a zero-byte file was created and removed in /etc: system configuration of the container is writable
- **`write.file.project`** — the attached working tree is writable
- **`write.repository.project`** — a repository is attached and writable
- **`write.repository.tenant`** — the attached repository only (any branch it can reach); branch discipline is the clone's hooks, a setting; no rule at the host
- **`read.file.project`** — the attached working tree is readable
- **`create.schedule.tenant`** — a routine or a scheduled trigger resumes this session or spawns another later: it outlives the container
- **`create.schedule.host`** — systemctl and /etc/cron.d exist, so a cron can be written — and dies with the container; the real scheduler is the platform's routines, on the harness row

## Not reachable from this shape

| What | Why | Source |
| --- | --- | --- |
| your machine's files | the container has no path to the operator's computer; the assess tree records home as a boundary | assess/library.json (agentbox: home) |
| your credentials | no user credential is in the image; the keys present are the session's own | evidence: filesystem.credential-presence, 5 Sep |
| hosts the proxy refuses | a 403 on the CONNECT, set above the process | evidence: network.egress-shell |
| repositories outside the platform's scope | the token is scoped by the platform; the API tool refuses out-of-scope calls | harness.platform-tools, self-reported |

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

