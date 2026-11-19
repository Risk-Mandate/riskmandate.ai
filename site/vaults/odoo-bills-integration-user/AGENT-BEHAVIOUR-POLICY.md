# AGENT BEHAVIOUR POLICY — A self-hosted Odoo 20 Community database, bills integration user

> For one agent in one deployment: everything it can do, what you authorised, the gap between the two, and what actually stands in the way. It describes and it does not judge, so it carries no score.

**Vault** `odoo-bills-integration-user` · **status** template · **shape** `odoo/community-20/bills-integration-user` · **grant** 2026-11-16 · **mandate** 2026-11-16 · **vocabulary** abp.sgit.ai v0.3.0 · **as at** 2026-11-19

---


## Four objects, and the verb attached to each

| Object | What it is | How it is obtained | Here |
| --- | --- | --- | --- |
| The mandate | What the agent is authorised and expected to do | **Elicited** — you already know it | `MANDATE.md` — 4 wanted, 6 refused, 13 unstated |
| The grant | Everything the agent can do | **Measured** — from the shape, the account, the credentials | `GRANT.md` — 7 capabilities, 7 measured |
| The delta | Excess and shortfall | **Derived** — recomputed whenever either input moves, never edited | `DELTA.md` — 3 excess, 3 unbounded, 0 shortfall |
| The barrier | What stands between the agent and each capability | **Recorded** per row, one of four kinds | the third column of every table |

## The deployment

**A self-hosted Odoo 20 Community database, reached with the API key of a narrow integration user**, Odoo (self-hosted Community). An agent holding the API key of an internal integration user on a self-hosted Odoo 20 Community database, for one job: turn incoming supplier documents into draft vendor bills. The user is not an administrator and is not in Accounting / Invoicing. It holds Odoo's default internal-user role and one group made for the job, whose access rows allow create, read and update on draft vendor bills and their lines, read on contacts, journals, accounts, taxes, currencies and payment terms, and delete on nothing. Measured on 16 November 2026 on an instance stood up for the exercise and torn down the same day: a static read of the user's access through Odoo's own checks (172 models with some access: read on 154, create on 56, update on 56, delete on 33), and 25 calls made with the key over Odoo's JSON-2 API, each recorded. The two rows on bills come from the job's group; supplier bank accounts, chatter email, scheduled messages, attachments and email templates come from the internal-user role every internal user holds. In the exercise the agent itself never held this key: it wrote proposed bills to a file, a person approved them, and a small broker applied them with the key. This vault describes the key, which is what an agent holding it can do.

## The mandate, in one paragraph

Read each supplier document, find the supplier among the ones already in Odoo, and create a draft vendor bill for it, for a person to check and post. Never post a bill, pay anything, email a supplier, create or change a supplier, or schedule anything. A document from a supplier Odoo does not know goes back to a person.

## The whole grant, with the mandate beside it

Irreversible rows first. ✓ marks a measured row.

| Capability | What it is | Barrier | Undo | Evidence | Mandate |
| --- | --- | --- | --- | --- | --- |
| `authenticate-as.credential.tenant` | Act in accounts with the credentials it holds | ● none | no | measured ✓ | in the mandate |
| `read.file.host` | Read any file the account can reach | ● none | no | measured ✓ | in the mandate |
| `send.message.world` | Send a message to anyone | ● none | no | measured ✓ | refused by the mandate |
| `write.file.project` | Change the project it is working on | ● none | with-effort | measured ✓ | in the mandate |
| `write.file.host` | Change any file the account can reach | ● none | with-effort | measured ✓ | refused by the mandate |
| `read.file.project` | Read the project it is working on | ● none | yes | measured ✓ | in the mandate |
| `create.schedule.tenant` | Create something that outlives the session, on the platform (a routine, a scheduled trigger, a new session) | ● none | yes | measured ✓ | refused by the mandate |

## The delta

**3 in the grant that the mandate did not ask for.** 3 of those it refused; 0 it never mentioned. **3 have nothing but a setting, a sentence or nothing at all in the way.** Nothing wanted is missing.

Unbounded excess:

- `write.file.host` — Change any file the account can reach — ● none
- `send.message.world` — Send a message to anyone — ● none
- `create.schedule.tenant` — Create something that outlives the session, on the platform (a routine, a scheduled trigger, a new session) — ● none


## Prohibitions, each with its barrier

Every line an agent is asked to observe, next to what enforces it. A prohibition shown without its barrier is a claim this document cannot support.

| Line | Barrier | Enforced by |
| --- | --- | --- |
| Do not `send.message.world` — send a message to anyone | ● none | **nothing** |
| Do not `write.file.host` — change any file the account can reach | ● none | **nothing** |
| Do not `create.schedule.tenant` — create something that outlives the session, on the platform (a routine, a scheduled trigger, a new session) | ● none | **nothing** |
| Stop and report if a task needs anything above | ◉ expectation | **nothing** — and this is the line that makes the rest useful |

## What is blocked, and who holds the block

Everything above is what the agent can do once every block is applied. These are the things something withholds — and the record says what, because a ceiling the credential itself enforces and a tool a vendor has not shipped are different objects with different lifespans.

- **posting (confirming) a draft vendor bill** — blocked by Odoo's own code: action_post checks for the Accounting / Invoicing group, which this user does not hold and cannot add to itself. the user's access rows allow update on draft vendor bills, which is the operation posting performs; the refusal comes from a group check in the code, not from an access row. Measured: "You don't have the access rights to post an invoice." _(measured 2026-11-16, history/grant-measured--2026-11-16.md, probe 5)_
- **adding itself to another group (Accounting / Administrator was tried)** — blocked by field-level access on res.users.group_ids, administered by a person with the Access Rights role. Measured: "You do not have enough rights to access the field "group_ids" on User (res.users)." Creating access rows (ir.access) and editing groups are outside this user's access too, so it cannot widen its own grant _(measured 2026-11-16, history/grant-measured--2026-11-16.md, probe 19; Odoo's own access check for ir.access and res.groups)_
- **minting another API key for itself** — blocked by for the interactive wizard, an identity check (the user's password, and this user has none); for the programmatic route, the system parameter base.enable_programmatic_api_keys, off by default and held by an administrator. creating res.users.apikeys records directly was refused; the key wizard answered with an identity check. In Odoo 20's source, res.users.apikeys.generate first calls _ensure_can_manage_keys_programmatically, which raises "Programmatic API keys are not enabled" unless the caller is a system administrator or that parameter is true _(measured 2026-11-16, history/grant-measured--2026-11-16.md, probes 20 and 21; https://github.com/odoo/odoo/blob/20.0/odoo/addons/base/models/res_users.py, read 2026-11-16)_
- **Odoo's AI agents and its MCP server** — blocked by the edition: the ai and MCP modules are not in Odoo Community, so this database has neither. no ai, mcp or documents addon is among the 701 addons in the odoo:20.0 Community image measured; Odoo's own documentation places the AI app on the Custom plan for Odoo Online. On an Enterprise database the same user's grant would grow by whatever AI and MCP tools are exposed to it; see research_needed _(measured 2026-11-16 (the image's addon list); https://www.odoo.com/documentation/20.0/applications/productivity/ai.html, read 2026-11-16)_

## What is not settled

**4 open questions** the grant cannot answer from published pages — listed in `RESEARCH-NEEDED.md` with how each is settled. **2 places where the vendor's own pages disagree** — in `GRANT.md`, published unresolved. A row with an open question against it stands at the evidence tier it shows; nothing here was obtained by probing anybody else's system.

## Validity

This describes the deployment shape as at this date. If the risk changed, the deployment changed — not this document. As at **2026-11-19**, against grant 2026-11-16, mandate 2026-11-16, vocabulary v0.3.0. Void when: the grant version changes — a product release, a setting, a connector enabled or removed; the mandate changes — the deployer authorises more or less; the vocabulary version changes — a primitive is added, split or renamed; a barrier moves — a setting becomes a boundary, or a boundary is removed.

## Where a score would live, and why it is not here

The same behaviour policy is dangerous in one deployment and harmless in another, and nothing about the document changed. A score needs the assets and the consequences, and this document has neither. That is not a preference; it is where the information is.

---

_This describes the deployment shape as at this date. If the risk changed, the deployment changed — not this document._ 
No score, rating, level or traffic light appears in this vault or in its data, and none will. The behaviour policy describes; it does not judge. 
Generated by `scripts/site/build-abp-vault.mjs` from `data/grant.json`, `data/mandate.json` and the pinned vocabulary; `data/mandate.json` is the only file a person writes. Licence: the published template is CC BY 4.0; a paid copy carries a commercial licence to the buyer. See LICENCE.md.

