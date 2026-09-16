# DELTA — what it can do that you did not ask for

> Derived from the grant and the mandate, never authored. Recomputed on every build, with both inputs pinned. If this file looks wrong, one of the two inputs is.

**Vault** `claude-code-cli` · **status** template · **shape** `anthropic/claude-code/local-default` · **grant** 2026-09-05 · **mandate** 2026-09-09 · **vocabulary** abp.sgit.ai v0.3.0 · **as at** 2026-09-15

---


**Grant** 2026-09-05 · **mandate** 2026-09-09 · **computed** 2026-09-15T01:41:06Z · **agrees row for row with** the published record `anthropic__claude-code__local-default__coding-assistant-on-my-machine` (2026-09-11T13:00:37Z)

## Four counts, and none of them is a score

| | Count | Meaning |
| --- | --- | --- |
| Grant | 16 | capabilities the deployment reaches |
| Mandate | 5 | capabilities the deployer wanted |
| Excess | 12 | in the grant and not wanted |
| **Unbounded excess** | **12** | excess with no boundary in the way — the only number anybody can move |
| Shortfall | 1 | wanted and not in the grant |
| Aligned | 4 | wanted and granted |

## Excess you refused (10)

You said no. Each row says what, if anything, enforces the no.

| Capability | What it is | Barrier | Undo | Evidence | Mandate |
| --- | --- | --- | --- | --- | --- |
| `authenticate-as.credential.signing` | Sign commits with the key it holds | ● none | no | documented | refused by the mandate |
| `authenticate-as.credential.tenant` | Act in accounts with the credentials it holds | ● none | no | derived | refused by the mandate |
| `create.record.world` | Publish packages, images or pages under the name it holds | ● none | no | documented | refused by the mandate |
| `delete.file.host` | Delete files anywhere the account can reach | ● none | no | derived | refused by the mandate |
| `read.credential.host` | Read credentials stored where it runs | ● none | no | documented | refused by the mandate |
| `read.file.host` | Read any file the account can reach | ● none | no | derived | refused by the mandate |
| `read.record.history` | Read a retained record: shell history, past sessions | ● none | no | documented | refused by the mandate |
| `write.file.host` | Change any file the account can reach | ● none | with-effort | derived | refused by the mandate |
| `create.schedule.host` | Create something that outlives the turn where it runs (a cron, a service) | ● none | yes | derived | refused by the mandate |
| `grant.credential.self` | Change its own permission settings | ◐ setting | yes | derived | refused by the mandate |


## Excess you never mentioned (2)

Authority nobody scoped. Not wrong — unstated. These are the rows to read twice.

| Capability | What it is | Barrier | Undo | Evidence | Mandate |
| --- | --- | --- | --- | --- | --- |
| `send.endpoint.world` | Reach any host on the internet | ● none | no | derived | unstated by the mandate |
| `write.repository.tenant` | Push to a code host (any branch it can reach) | ◉ expectation | with-effort | derived | unstated by the mandate |


## Unbounded excess (12)

The excess whose barrier is anything but a boundary. Every real control moves one of these rows into the fourth barrier and this list gets shorter; nothing else does.

- `authenticate-as.credential.signing` — Sign commits with the key it holds — ● none
- `authenticate-as.credential.tenant` — Act in accounts with the credentials it holds — ● none
- `create.record.world` — Publish packages, images or pages under the name it holds — ● none
- `delete.file.host` — Delete files anywhere the account can reach — ● none
- `read.credential.host` — Read credentials stored where it runs — ● none
- `read.file.host` — Read any file the account can reach — ● none
- `read.record.history` — Read a retained record: shell history, past sessions — ● none
- `send.endpoint.world` — Reach any host on the internet — ● none
- `write.file.host` — Change any file the account can reach — ● none
- `write.repository.tenant` — Push to a code host (any branch it can reach) — ◉ expectation — branch discipline in prose, if any
- `create.schedule.host` — Create something that outlives the turn where it runs (a cron, a service) — ● none
- `grant.credential.self` — Change its own permission settings — ◐ setting — the settings file is owned by the same account


## Shortfall (1)

- `send.endpoint.allowed` — Reach a permitted list of hosts — wanted, and not in this grant


## Aligned (4)

| Capability | What it is | Barrier | Undo | Evidence | Mandate |
| --- | --- | --- | --- | --- | --- |
| `write.file.project` | Change the project it is working on | ● none | with-effort | derived | in the mandate |
| `write.repository.project` | Commit to the repository it was pointed at | ● none | with-effort | derived | in the mandate |
| `execute.process.host` | Run programs as the account | ◐ setting | with-effort | derived | in the mandate |
| `read.file.project` | Read the project it is working on | ● none | yes | derived | in the mandate |


---

_This describes the deployment shape as at this date. If the risk changed, the deployment changed — not this document._ 
No score, rating, level or traffic light appears in this vault or in its data, and none will. The behaviour policy describes; it does not judge. 
Generated by `scripts/site/build-abp-vault.mjs` from `data/grant.json`, `data/mandate.json` and the pinned vocabulary; `data/mandate.json` is the only file a person writes. Licence: the published template is CC BY 4.0; a paid copy carries a commercial licence to the buyer. See LICENCE.md.

