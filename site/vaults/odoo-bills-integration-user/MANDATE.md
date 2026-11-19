# MANDATE — what the agent is authorised and expected to do

> A starting point, not a survey. It is written to be argued with, and the correction is usually upward: read it and tell us where it is wrong.

**Vault** `odoo-bills-integration-user` · **status** template · **shape** `odoo/community-20/bills-integration-user` · **grant** 2026-11-16 · **mandate** 2026-11-16 · **vocabulary** abp.sgit.ai v0.3.0 · **as at** 2026-11-19

---


**Mandate id** `draft-vendor-bills-from-supplier-documents` · **status** starting-point · **authored** 2026-11-16 by drafted by the measuring session from the deployer's brief, "an agent that turns incoming supplier documents into draft vendor bills (never posted), with a narrowly scoped integration user (not admin)"; not yet corrected by the deployer

## In one paragraph

Read each supplier document, find the supplier among the ones already in Odoo, and create a draft vendor bill for it, for a person to check and post. Never post a bill, pay anything, email a supplier, create or change a supplier, or schedule anything. A document from a supplier Odoo does not know goes back to a person.

## What is wanted (4)

| Capability | What it is | Reach |
| --- | --- | --- |
| `authenticate-as.credential.tenant` | Act in accounts with the credentials it holds | tenant — the Odoo database as an account the key acts in, and the company's mail sent through it |
| `write.file.project` | Change the project it is working on | project — the draft vendor bills the key was given to create: account.move records of type in_invoice or in_refund, in state draft |
| `read.file.project` | Read the project it is working on | project — the draft vendor bills the key was given to create: account.move records of type in_invoice or in_refund, in state draft |
| `read.file.host` | Read any file the account can reach | host — the Odoo database as this user sees it: contacts, supplier bank accounts, journals and every other model the internal-user role reads |

## What is explicitly not wanted (6)

| Capability | What it is | Reach |
| --- | --- | --- |
| `send.message.world` | Send a message to anyone | world — suppliers and anyone else outside the company, reached by email from a record's chatter |
| `create.schedule.tenant` | Create something that outlives the session, on the platform (a routine, a scheduled trigger, a new session) | tenant — the Odoo database as an account the key acts in, and the company's mail sent through it |
| `write.file.host` | Change any file the account can reach | host — the Odoo database as this user sees it: contacts, supplier bank accounts, journals and every other model the internal-user role reads |
| `write.budget.tenant` | Spend money or tokens against an account it holds | tenant — the Odoo database as an account the key acts in, and the company's mail sent through it |
| `grant.credential.self` | Change its own permission settings | self |
| `delete.file.host` | Delete files anywhere the account can reach | host — the Odoo database as this user sees it: contacts, supplier bank accounts, journals and every other model the internal-user role reads |

## Unstated (13)

Named neither way. For the ones that are in the grant, this is authority nobody scoped — see `DELTA.md`.

| Capability | What it is | In the grant | Note |
| --- | --- | --- | --- |
| `authenticate-as.credential.signing` | Sign commits with the key it holds | no |  |
| `create.record.world` | Publish packages, images or pages under the name it holds | no |  |
| `create.schedule.host` | Create something that outlives the turn where it runs (a cron, a service) | no |  |
| `execute.process.host` | Run programs as the account | no |  |
| `execute.process.self` | Run programs inside its own sandbox only | no |  |
| `read.credential.host` | Read credentials stored where it runs | no |  |
| `read.message.tenant` | Read mail or chat it is connected to | no |  |
| `read.record.browsing` | Read every page you visit | no |  |
| `read.record.history` | Read a retained record: shell history, past sessions | no |  |
| `send.endpoint.allowed` | Reach a permitted list of hosts | no |  |
| `send.endpoint.world` | Reach any host on the internet | no |  |
| `write.repository.project` | Commit to the repository it was pointed at | no |  |
| `write.repository.tenant` | Push to a code host (any branch it can reach) | no |  |

## Correct it

Move any capability between the three lists in `data/mandate.json` and rebuild. Three questions settle most rows:

- **Did you ask for this?** Then it is a want.
- **Would you object if it happened?** Then it is a do-not-want — and the barrier column in `GRANT.md` says whether anything actually stops it.
- **Neither?** Leave it unstated. Unstated rows in the grant are the ones that turn up in an incident report as "nobody said it couldn't".

---

_This describes the deployment shape as at this date. If the risk changed, the deployment changed — not this document._ 
No score, rating, level or traffic light appears in this vault or in its data, and none will. The behaviour policy describes; it does not judge. 
Generated by `scripts/site/build-abp-vault.mjs` from `data/grant.json`, `data/mandate.json` and the pinned vocabulary; `data/mandate.json` is the only file a person writes. Licence: the published template is CC BY 4.0; a paid copy carries a commercial licence to the buyer. See LICENCE.md.

