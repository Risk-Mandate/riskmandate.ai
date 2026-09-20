# AGENT BEHAVIOUR POLICY — A browser extension with broad host permissions

> For one agent in one deployment: everything it can do, what you authorised, the gap between the two, and what actually stands in the way. It describes and it does not judge, so it carries no score.

**Vault** `browser-extension` · **status** template · **shape** `generic/browser-extension/broad-host-permissions` · **grant** 2026-09-05 · **mandate** 2026-09-09 · **vocabulary** abp.sgit.ai v0.3.0 · **as at** 2026-09-15

---


## Four objects, and the verb attached to each

| Object | What it is | How it is obtained | Here |
| --- | --- | --- | --- |
| The mandate | What the agent is authorised and expected to do | **Elicited** — you already know it | `MANDATE.md` — 1 wanted, 2 refused, 20 unstated |
| The grant | Everything the agent can do | **Measured** — from the shape, the account, the credentials | `GRANT.md` — 3 capabilities, 0 measured |
| The delta | Excess and shortfall | **Derived** — recomputed whenever either input moves, never edited | `DELTA.md` — 2 excess, 2 unbounded, 0 shortfall |
| The barrier | What stands between the agent and each capability | **Recorded** per row, one of four kinds | the third column of every table |

## The deployment

**A browser extension with broad host permissions**, generic. Not an agent by name, and it has a grant: an extension granted 'read and change all your data on all websites' reads every page you visit, reaches any host, and acts inside the sites you are logged into. Nobody wrote it a mandate. DERIVED from the permission model the browser documents; not measured on any instance.

## The mandate, in one paragraph

I want it to work on the sites I use it on. I did not install it so that it could see every page I visit, act inside the accounts I am logged into, or send what it sees anywhere.

## The whole grant, with the mandate beside it

Irreversible rows first. ✓ marks a measured row.

| Capability | What it is | Barrier | Undo | Evidence | Mandate |
| --- | --- | --- | --- | --- | --- |
| `read.record.browsing` | Read every page you visit | ● none | no | documented | in the mandate |
| `send.endpoint.world` | Reach any host on the internet | ● none | no | documented | refused by the mandate |
| `authenticate-as.credential.tenant` | Act in accounts with the credentials it holds | ◐ setting | no | documented | refused by the mandate |

## The delta

**2 in the grant that the mandate did not ask for.** 2 of those it refused; 0 it never mentioned. **2 have nothing but a setting, a sentence or nothing at all in the way.** Nothing wanted is missing.

Unbounded excess:

- `send.endpoint.world` — Reach any host on the internet — ● none
- `authenticate-as.credential.tenant` — Act in accounts with the credentials it holds — ◐ setting


## Prohibitions, each with its barrier

Every line an agent is asked to observe, next to what enforces it. A prohibition shown without its barrier is a claim this document cannot support.

| Line | Barrier | Enforced by |
| --- | --- | --- |
| Do not `send.endpoint.world` — reach any host on the internet | ● none | **nothing** |
| Do not `authenticate-as.credential.tenant` — act in accounts with the credentials it holds | ◐ setting | the site's own session controls |
| Stop and report if a task needs anything above | ◉ expectation | **nothing** — and this is the line that makes the rest useful |

## What is blocked, and who holds the block

Everything above is what the agent can do once every block is applied. These are the things something withholds — and the record says what, because a ceiling the credential itself enforces and a tool a vendor has not shipped are different objects with different lifespans.

- **files on your disk** — blocked by the browser's extension sandbox — the runtime the extension is loaded into offers page scripts no filesystem. the browser sandbox; an extension reads pages, not the filesystem _(the browser's extension permission model)_

## Validity

This describes the deployment shape as at this date. If the risk changed, the deployment changed — not this document. As at **2026-09-15**, against grant 2026-09-05, mandate 2026-09-09, vocabulary v0.3.0. Void when: the grant version changes — a product release, a setting, a connector enabled or removed; the mandate changes — the deployer authorises more or less; the vocabulary version changes — a primitive is added, split or renamed; a barrier moves — a setting becomes a boundary, or a boundary is removed.

## Where a score would live, and why it is not here

The same behaviour policy is dangerous in one deployment and harmless in another, and nothing about the document changed. A score needs the assets and the consequences, and this document has neither. That is not a preference; it is where the information is.

---

_This describes the deployment shape as at this date. If the risk changed, the deployment changed — not this document._ 
No score, rating, level or traffic light appears in this vault or in its data, and none will. The behaviour policy describes; it does not judge. 
Generated by `scripts/site/build-abp-vault.mjs` from `data/grant.json`, `data/mandate.json` and the pinned vocabulary; `data/mandate.json` is the only file a person writes. Licence: the published template is CC BY 4.0; a paid copy carries a commercial licence to the buyer. See LICENCE.md.

