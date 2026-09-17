# AGENT BEHAVIOUR POLICY — Claude in the browser, with connectors switched on

> For one agent in one deployment: everything it can do, what you authorised, the gap between the two, and what actually stands in the way. It describes and it does not judge, so it carries no score.

**Vault** `claude-web-connectors` · **status** template · **shape** `anthropic/claude-web/connectors-on` · **grant** 2026-09-05 · **mandate** 2026-09-09 · **vocabulary** abp.sgit.ai v0.3.0 · **as at** 2026-09-15

---


## Four objects, and the verb attached to each

| Object | What it is | How it is obtained | Here |
| --- | --- | --- | --- |
| The mandate | What the agent is authorised and expected to do | **Elicited** — you already know it | `MANDATE.md` — 3 wanted, 2 refused, 18 unstated |
| The grant | Everything the agent can do | **Measured** — from the shape, the account, the credentials | `GRANT.md` — 5 capabilities, 0 measured |
| The delta | Excess and shortfall | **Derived** — recomputed whenever either input moves, never edited | `DELTA.md` — 2 excess, 0 unbounded, 0 shortfall |
| The barrier | What stands between the agent and each capability | **Recorded** per row, one of four kinds | the third column of every table |

## The deployment

**Claude (in the browser, with connectors switched on)**, Anthropic. The same web assistant with connectors you switched on — a drive, a code host, a cloud account. Each connector is a boundary (the vendor holds the token, scoped as you scoped it) and each one is a row you granted by clicking. DERIVED from the assess library's web tree; which connectors is yours to name.

## The mandate, in one paragraph

I connected my drive and my mail so it could answer questions about them. Reading is what I wanted. I did not want it sending mail, and I did not want it pushing code anywhere — it is a chat window.

## The whole grant, with the mandate beside it

Irreversible rows first. ✓ marks a measured row.

| Capability | What it is | Barrier | Undo | Evidence | Mandate |
| --- | --- | --- | --- | --- | --- |
| `authenticate-as.credential.tenant` | Act in accounts with the credentials it holds | ○ boundary | no | derived | unstated by the mandate |
| `read.file.host` | Read any file the account can reach | ○ boundary | no | derived | in the mandate |
| `read.message.tenant` | Read mail or chat it is connected to | ○ boundary | no | derived | in the mandate |
| `write.repository.tenant` | Push to a code host (any branch it can reach) | ○ boundary | with-effort | derived | refused by the mandate |
| `read.file.project` | Read the project it is working on | ● none | yes | derived | in the mandate |

## The delta

**2 in the grant that the mandate did not ask for.** 1 of those it refused; 1 it never mentioned. **0 have nothing but a setting, a sentence or nothing at all in the way.** Nothing wanted is missing.



## Prohibitions, each with its barrier

Every line an agent is asked to observe, next to what enforces it. A prohibition shown without its barrier is a claim this document cannot support.

| Line | Barrier | Enforced by |
| --- | --- | --- |
| Do not `authenticate-as.credential.tenant` — act in accounts with the credentials it holds | ○ boundary | the connector's scope |
| Do not `write.repository.tenant` — push to a code host (any branch it can reach) | ○ boundary | the connector's scope |
| Stop and report if a task needs anything above | ◉ expectation | **nothing** — and this is the line that makes the rest useful |

## What is blocked, and who holds the block

Everything above is what the agent can do once every block is applied. These are the things something withholds — and the record says what, because a ceiling the credential itself enforces and a tool a vendor has not shipped are different objects with different lifespans.

- **your machine's files** — blocked by the browser — a tab reaches a drive over the network, not a disk. a browser tab; the connector reaches a drive, not a disk _(assess/library.json (web: home))_

## Validity

This describes the deployment shape as at this date. If the risk changed, the deployment changed — not this document. As at **2026-09-15**, against grant 2026-09-05, mandate 2026-09-09, vocabulary v0.3.0. Void when: the grant version changes — a product release, a setting, a connector enabled or removed; the mandate changes — the deployer authorises more or less; the vocabulary version changes — a primitive is added, split or renamed; a barrier moves — a setting becomes a boundary, or a boundary is removed.

## Where a score would live, and why it is not here

The same behaviour policy is dangerous in one deployment and harmless in another, and nothing about the document changed. A score needs the assets and the consequences, and this document has neither. That is not a preference; it is where the information is.

---

_This describes the deployment shape as at this date. If the risk changed, the deployment changed — not this document._ 
No score, rating, level or traffic light appears in this vault or in its data, and none will. The behaviour policy describes; it does not judge. 
Generated by `scripts/site/build-abp-vault.mjs` from `data/grant.json`, `data/mandate.json` and the pinned vocabulary; `data/mandate.json` is the only file a person writes. Licence: the published template is CC BY 4.0; a paid copy carries a commercial licence to the buyer. See LICENCE.md.

