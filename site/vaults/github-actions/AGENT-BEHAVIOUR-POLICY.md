# AGENT BEHAVIOUR POLICY — A GitHub Actions runner, a hosted CI job

> For one agent in one deployment: everything it can do, what you authorised, the gap between the two, and what actually stands in the way. It describes and it does not judge, so it carries no score.

**Vault** `github-actions` · **status** template · **shape** `github/actions-runner/ci` · **grant** 2026-08-26 · **mandate** 2026-09-09 · **vocabulary** abp.sgit.ai v0.3.0 · **as at** 2026-09-15

---


## Four objects, and the verb attached to each

| Object | What it is | How it is obtained | Here |
| --- | --- | --- | --- |
| The mandate | What the agent is authorised and expected to do | **Elicited** — you already know it | `MANDATE.md` — 5 wanted, 1 refused, 17 unstated |
| The grant | Everything the agent can do | **Measured** — from the shape, the account, the credentials | `GRANT.md` — 8 capabilities, 8 measured |
| The delta | Excess and shortfall | **Derived** — recomputed whenever either input moves, never edited | `DELTA.md` — 4 excess, 3 unbounded, 1 shortfall |
| The barrier | What stands between the agent and each capability | **Recorded** per row, one of four kinds | the third column of every table |

## The deployment

**Actions runner (a hosted CI job)**, GitHub. An ephemeral CI job with no agent, no hooks, and one platform-enforced grant: the workflow's permissions block. MEASURED on 26 August by measure.py inside the runner (the library's second entry), translated into findings on 5 September. Unrestricted egress; the token cannot write.

## The mandate, in one paragraph

Check out the code, build it, run the tests, fetch what it needs, and — when a release is cut — push the tag. I did not want it reading credentials beyond its own token.

## The whole grant, with the mandate beside it

Irreversible rows first. ✓ marks a measured row.

| Capability | What it is | Barrier | Undo | Evidence | Mandate |
| --- | --- | --- | --- | --- | --- |
| `delete.file.host` | Delete files anywhere the account can reach | ● none | no | observed ✓ | unstated by the mandate |
| `read.file.host` | Read any file the account can reach | ● none | no | observed ✓ | unstated by the mandate |
| `send.endpoint.world` | Reach any host on the internet | ● none | no | observed ✓ | in the mandate |
| `execute.process.host` | Run programs as the account | ● none | with-effort | observed ✓ | in the mandate |
| `write.file.host` | Change any file the account can reach | ● none | with-effort | observed ✓ | unstated by the mandate |
| `write.file.project` | Change the project it is working on | ● none | with-effort | observed ✓ | in the mandate |
| `write.repository.project` | Commit to the repository it was pointed at | ○ boundary | with-effort | observed ✓ | unstated by the mandate |
| `read.file.project` | Read the project it is working on | ● none | yes | observed ✓ | in the mandate |

## The delta

**4 in the grant that the mandate did not ask for.** 0 of those it refused; 4 it never mentioned. **3 have nothing but a setting, a sentence or nothing at all in the way.** 1 wanted and not granted.

Unbounded excess:

- `delete.file.host` — Delete files anywhere the account can reach — ● none
- `read.file.host` — Read any file the account can reach — ● none
- `write.file.host` — Change any file the account can reach — ● none


## Prohibitions, each with its barrier

Every line an agent is asked to observe, next to what enforces it. A prohibition shown without its barrier is a claim this document cannot support.

| Line | Barrier | Enforced by |
| --- | --- | --- |
| Do not `delete.file.host` — delete files anywhere the account can reach | ● none | **nothing** |
| Do not `read.file.host` — read any file the account can reach | ● none | **nothing** |
| Do not `write.file.host` — change any file the account can reach | ● none | **nothing** |
| Do not `write.repository.project` — commit to the repository it was pointed at | ○ boundary | the checkout is writable, but the token is contents:read, so nothing written can leave |
| Stop and report if a task needs anything above | ◉ expectation | **nothing** — and this is the line that makes the rest useful |

## What is not reachable

- **your machine** — a hosted runner _(library entry 2)_
- **the repository, for writing** — the token is contents:read _(evidence: ci.permissions-block)_

## Validity

This describes the deployment shape as at this date. If the risk changed, the deployment changed — not this document. As at **2026-09-15**, against grant 2026-08-26, mandate 2026-09-09, vocabulary v0.3.0. Void when: the grant version changes — a product release, a setting, a connector enabled or removed; the mandate changes — the deployer authorises more or less; the vocabulary version changes — a primitive is added, split or renamed; a barrier moves — a setting becomes a boundary, or a boundary is removed.

## Where a score would live, and why it is not here

The same behaviour policy is dangerous in one deployment and harmless in another, and nothing about the document changed. A score needs the assets and the consequences, and this document has neither. That is not a preference; it is where the information is.

---

_This describes the deployment shape as at this date. If the risk changed, the deployment changed — not this document._ 
No score, rating, level or traffic light appears in this vault or in its data, and none will. The behaviour policy describes; it does not judge. 
Generated by `scripts/site/build-abp-vault.mjs` from `data/grant.json`, `data/mandate.json` and the pinned vocabulary; `data/mandate.json` is the only file a person writes. Licence: CC BY 4.0.

