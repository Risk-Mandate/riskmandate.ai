# AGENT BEHAVIOUR POLICY — Claude Code on the web, with one repository attached

> For one agent in one deployment: everything it can do, what you authorised, the gap between the two, and what actually stands in the way. It describes and it does not judge, so it carries no score.

**Vault** `claude-code-web` · **status** template · **shape** `anthropic/claude-code-remote/ccr-container` · **grant** 2026-09-05.2 · **mandate** 2026-09-09 · **vocabulary** abp.sgit.ai v0.3.0 · **as at** 2026-09-15

---


## Four objects, and the verb attached to each

| Object | What it is | How it is obtained | Here |
| --- | --- | --- | --- |
| The mandate | What the agent is authorised and expected to do | **Elicited** — you already know it | `MANDATE.md` — 6 wanted, 3 refused, 14 unstated |
| The grant | Everything the agent can do | **Measured** — from the shape, the account, the credentials | `GRANT.md` — 15 capabilities, 13 measured |
| The delta | Excess and shortfall | **Derived** — recomputed whenever either input moves, never edited | `DELTA.md` — 9 excess, 7 unbounded, 0 shortfall |
| The barrier | What stands between the agent and each capability | **Recorded** per row, one of four kinds | the third column of every table |

## The deployment

**Claude Code on the web (a remote session container)**, Anthropic. A managed cloud container, ephemeral, one git repository attached, an egress proxy above it, and a set of harness tools scoped by the platform. MEASURED, by the thing being profiled: the shell probed on 5 September with probes/run.py, the fetch tool's reach and the harness tools reported by the operator. HOST MEANS THE CONTAINER, not your machine; TENANT means the platform's scoped tokens, not your accounts. The same environment measured on 26 August is the Grant & Mandate library's first entry, and the two agree on every row they share.

## The mandate, in one paragraph

I attached a repository and I want it worked on: read it, change it, run things, commit, and push to that repository — that is why I attached it. The container is disposable, so what it does to the container's own files is its business. I do not want it signing as me, and I do not want it creating sessions or routines that keep going after this one ends.

## The whole grant, with the mandate beside it

Irreversible rows first. ✓ marks a measured row.

| Capability | What it is | Barrier | Undo | Evidence | Mandate |
| --- | --- | --- | --- | --- | --- |
| `authenticate-as.credential.signing` | Sign commits with the key it holds | ● none | no | observed ✓ | refused by the mandate |
| `delete.file.host` | Delete files anywhere the account can reach | ● none | no | observed ✓ | unstated by the mandate |
| `read.credential.host` | Read credentials stored where it runs | ● none | no | observed ✓ | unstated by the mandate |
| `read.file.host` | Read any file the account can reach | ● none | no | observed ✓ | unstated by the mandate |
| `read.record.history` | Read a retained record: shell history, past sessions | ● none | no | observed ✓ | refused by the mandate |
| `authenticate-as.credential.tenant` | Act in accounts with the credentials it holds | ○ boundary | no | inferred | unstated by the mandate |
| `send.endpoint.allowed` | Reach a permitted list of hosts | ○ boundary | no | observed ✓ | in the mandate |
| `execute.process.host` | Run programs as the account | ● none | with-effort | observed ✓ | in the mandate |
| `write.file.host` | Change any file the account can reach | ● none | with-effort | observed ✓ | unstated by the mandate |
| `write.file.project` | Change the project it is working on | ● none | with-effort | observed ✓ | in the mandate |
| `write.repository.project` | Commit to the repository it was pointed at | ● none | with-effort | observed ✓ | in the mandate |
| `write.repository.tenant` | Push to a code host (any branch it can reach) | ◐ setting | with-effort | observed ✓ | in the mandate |
| `read.file.project` | Read the project it is working on | ● none | yes | observed ✓ | in the mandate |
| `create.schedule.tenant` | Create something that outlives the session, on the platform (a routine, a scheduled trigger, a new session) | ◐ setting | yes | self-reported | refused by the mandate |
| `create.schedule.host` | Create something that outlives the turn where it runs (a cron, a service) | ○ boundary | yes | observed ✓ | unstated by the mandate |

## The delta

**9 in the grant that the mandate did not ask for.** 3 of those it refused; 6 it never mentioned. **7 have nothing but a setting, a sentence or nothing at all in the way.** Nothing wanted is missing.

Unbounded excess:

- `authenticate-as.credential.signing` — Sign commits with the key it holds — ● none
- `delete.file.host` — Delete files anywhere the account can reach — ● none
- `read.credential.host` — Read credentials stored where it runs — ● none
- `read.file.host` — Read any file the account can reach — ● none
- `read.record.history` — Read a retained record: shell history, past sessions — ● none
- `write.file.host` — Change any file the account can reach — ● none
- `create.schedule.tenant` — Create something that outlives the session, on the platform (a routine, a scheduled trigger, a new session) — ◐ setting


## Prohibitions, each with its barrier

Every line an agent is asked to observe, next to what enforces it. A prohibition shown without its barrier is a claim this document cannot support.

| Line | Barrier | Enforced by |
| --- | --- | --- |
| Do not `authenticate-as.credential.signing` — sign commits with the key it holds | ● none | **nothing** |
| Do not `delete.file.host` — delete files anywhere the account can reach | ● none | **nothing** |
| Do not `read.credential.host` — read credentials stored where it runs | ● none | **nothing** |
| Do not `read.file.host` — read any file the account can reach | ● none | **nothing** |
| Do not `read.record.history` — read a retained record: shell history, past sessions | ● none | **nothing** |
| Do not `authenticate-as.credential.tenant` — act in accounts with the credentials it holds | ○ boundary | the token's scope, set by the platform (in-scope repositories only) |
| Do not `write.file.host` — change any file the account can reach | ● none | **nothing** |
| Do not `create.schedule.tenant` — create something that outlives the session, on the platform (a routine, a scheduled trigger, a new session) | ◐ setting | the platform's routines are the operator's to list and delete |
| Do not `create.schedule.host` — create something that outlives the turn where it runs (a cron, a service) | ○ boundary | the container is ephemeral: whatever is scheduled here dies with it |
| Stop and report if a task needs anything above | ◉ expectation | **nothing** — and this is the line that makes the rest useful |

## What is not reachable

- **your machine's files** — the container has no path to the operator's computer; the assess tree records home as a boundary _(assess/library.json (agentbox: home))_
- **your credentials** — no user credential is in the image; the keys present are the session's own _(evidence: filesystem.credential-presence, 5 Sep)_
- **hosts the proxy refuses** — a 403 on the CONNECT, set above the process _(evidence: network.egress-shell)_
- **repositories outside the platform's scope** — the token is scoped by the platform; the API tool refuses out-of-scope calls _(harness.platform-tools, self-reported)_

## Validity

This describes the deployment shape as at this date. If the risk changed, the deployment changed — not this document. As at **2026-09-15**, against grant 2026-09-05.2, mandate 2026-09-09, vocabulary v0.3.0. Void when: the grant version changes — a product release, a setting, a connector enabled or removed; the mandate changes — the deployer authorises more or less; the vocabulary version changes — a primitive is added, split or renamed; a barrier moves — a setting becomes a boundary, or a boundary is removed.

## Where a score would live, and why it is not here

The same behaviour policy is dangerous in one deployment and harmless in another, and nothing about the document changed. A score needs the assets and the consequences, and this document has neither. That is not a preference; it is where the information is.

---

_This describes the deployment shape as at this date. If the risk changed, the deployment changed — not this document._ 
No score, rating, level or traffic light appears in this vault or in its data, and none will. The behaviour policy describes; it does not judge. 
Generated by `scripts/site/build-abp-vault.mjs` from `data/grant.json`, `data/mandate.json` and the pinned vocabulary; `data/mandate.json` is the only file a person writes. Licence: the published template is CC BY 4.0; a paid copy carries a commercial licence to the buyer. See LICENCE.md.

