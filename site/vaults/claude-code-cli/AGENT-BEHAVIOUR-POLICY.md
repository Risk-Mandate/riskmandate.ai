# AGENT BEHAVIOUR POLICY — Claude Code on your own machine, confirmations on

> For one agent in one deployment: everything it can do, what you authorised, the gap between the two, and what actually stands in the way. It describes and it does not judge, so it carries no score.

**Vault** `claude-code-cli` · **status** template · **shape** `anthropic/claude-code/local-default` · **grant** 2026-09-05 · **mandate** 2026-09-09 · **vocabulary** abp.sgit.ai v0.3.0 · **as at** 2026-09-15

---


## Four objects, and the verb attached to each

| Object | What it is | How it is obtained | Here |
| --- | --- | --- | --- |
| The mandate | What the agent is authorised and expected to do | **Elicited** — you already know it | `MANDATE.md` — 5 wanted, 11 refused, 7 unstated |
| The grant | Everything the agent can do | **Measured** — from the shape, the account, the credentials | `GRANT.md` — 16 capabilities, 0 measured |
| The delta | Excess and shortfall | **Derived** — recomputed whenever either input moves, never edited | `DELTA.md` — 12 excess, 12 unbounded, 1 shortfall |
| The barrier | What stands between the agent and each capability | **Recorded** per row, one of four kinds | the third column of every table |

## The deployment

**Claude Code (the CLI, on your own machine)**, Anthropic. The common case: one CLI agent running as your user account, credentials in the home directory, confirmations on, no containment. DERIVED from what a command-line program running as your account architecturally is, not measured on any instance — every row is a claim until somebody runs the probes and contributes the file. The assess library's cli tree is the source.

## The mandate, in one paragraph

I want it to read and change the project I pointed it at, run the build and the tests, commit to that repository, and fetch the packages and docs it needs. I did not sign up for it reading the rest of my disk, my credentials or my shell history, sending anything to anyone, publishing under my name, changing its own permission settings, or leaving anything behind that runs after it stops.

## The whole grant, with the mandate beside it

Irreversible rows first. ✓ marks a measured row.

| Capability | What it is | Barrier | Undo | Evidence | Mandate |
| --- | --- | --- | --- | --- | --- |
| `authenticate-as.credential.signing` | Sign commits with the key it holds | ● none | no | documented | refused by the mandate |
| `authenticate-as.credential.tenant` | Act in accounts with the credentials it holds | ● none | no | derived | refused by the mandate |
| `create.record.world` | Publish packages, images or pages under the name it holds | ● none | no | documented | refused by the mandate |
| `delete.file.host` | Delete files anywhere the account can reach | ● none | no | derived | refused by the mandate |
| `read.credential.host` | Read credentials stored where it runs | ● none | no | documented | refused by the mandate |
| `read.file.host` | Read any file the account can reach | ● none | no | derived | refused by the mandate |
| `read.record.history` | Read a retained record: shell history, past sessions | ● none | no | documented | refused by the mandate |
| `send.endpoint.world` | Reach any host on the internet | ● none | no | derived | unstated by the mandate |
| `write.file.host` | Change any file the account can reach | ● none | with-effort | derived | refused by the mandate |
| `write.file.project` | Change the project it is working on | ● none | with-effort | derived | in the mandate |
| `write.repository.project` | Commit to the repository it was pointed at | ● none | with-effort | derived | in the mandate |
| `write.repository.tenant` | Push to a code host (any branch it can reach) | ◉ expectation | with-effort | derived | unstated by the mandate |
| `execute.process.host` | Run programs as the account | ◐ setting | with-effort | derived | in the mandate |
| `create.schedule.host` | Create something that outlives the turn where it runs (a cron, a service) | ● none | yes | derived | refused by the mandate |
| `read.file.project` | Read the project it is working on | ● none | yes | derived | in the mandate |
| `grant.credential.self` | Change its own permission settings | ◐ setting | yes | derived | refused by the mandate |

## The delta

**12 in the grant that the mandate did not ask for.** 10 of those it refused; 2 it never mentioned. **12 have nothing but a setting, a sentence or nothing at all in the way.** 1 wanted and not granted.

Unbounded excess:

- `authenticate-as.credential.signing` — Sign commits with the key it holds — ● none
- `authenticate-as.credential.tenant` — Act in accounts with the credentials it holds — ● none
- `create.record.world` — Publish packages, images or pages under the name it holds — ● none
- `delete.file.host` — Delete files anywhere the account can reach — ● none
- `read.credential.host` — Read credentials stored where it runs — ● none
- `read.file.host` — Read any file the account can reach — ● none
- `read.record.history` — Read a retained record: shell history, past sessions — ● none
- `send.endpoint.world` — Reach any host on the internet — ● none
- `write.file.host` — Change any file the account can reach — ● none
- `write.repository.tenant` — Push to a code host (any branch it can reach) — ◉ expectation
- `create.schedule.host` — Create something that outlives the turn where it runs (a cron, a service) — ● none
- `grant.credential.self` — Change its own permission settings — ◐ setting


## Prohibitions, each with its barrier

Every line an agent is asked to observe, next to what enforces it. A prohibition shown without its barrier is a claim this document cannot support.

| Line | Barrier | Enforced by |
| --- | --- | --- |
| Do not `authenticate-as.credential.signing` — sign commits with the key it holds | ● none | **nothing** |
| Do not `authenticate-as.credential.tenant` — act in accounts with the credentials it holds | ● none | **nothing** |
| Do not `create.record.world` — publish packages, images or pages under the name it holds | ● none | **nothing** |
| Do not `delete.file.host` — delete files anywhere the account can reach | ● none | **nothing** |
| Do not `read.credential.host` — read credentials stored where it runs | ● none | **nothing** |
| Do not `read.file.host` — read any file the account can reach | ● none | **nothing** |
| Do not `read.record.history` — read a retained record: shell history, past sessions | ● none | **nothing** |
| Do not `send.endpoint.world` — reach any host on the internet | ● none | **nothing** |
| Do not `write.file.host` — change any file the account can reach | ● none | **nothing** |
| Do not `write.repository.tenant` — push to a code host (any branch it can reach) | ◉ expectation | branch discipline in prose, if any |
| Do not `create.schedule.host` — create something that outlives the turn where it runs (a cron, a service) | ● none | **nothing** |
| Do not `grant.credential.self` — change its own permission settings | ◐ setting | the settings file is owned by the same account |
| Stop and report if a task needs anything above | ◉ expectation | **nothing** — and this is the line that makes the rest useful |

## What is not reachable


## Validity

This describes the deployment shape as at this date. If the risk changed, the deployment changed — not this document. As at **2026-09-15**, against grant 2026-09-05, mandate 2026-09-09, vocabulary v0.3.0. Void when: the grant version changes — a product release, a setting, a connector enabled or removed; the mandate changes — the deployer authorises more or less; the vocabulary version changes — a primitive is added, split or renamed; a barrier moves — a setting becomes a boundary, or a boundary is removed.

## Where a score would live, and why it is not here

The same behaviour policy is dangerous in one deployment and harmless in another, and nothing about the document changed. A score needs the assets and the consequences, and this document has neither. That is not a preference; it is where the information is.

---

_This describes the deployment shape as at this date. If the risk changed, the deployment changed — not this document._ 
No score, rating, level or traffic light appears in this vault or in its data, and none will. The behaviour policy describes; it does not judge. 
Generated by `scripts/site/build-abp-vault.mjs` from `data/grant.json`, `data/mandate.json` and the pinned vocabulary; `data/mandate.json` is the only file a person writes. Licence: the published template is CC BY 4.0; a paid copy carries a commercial licence to the buyer. See LICENCE.md.

