# RESEARCH NEEDED — A self-hosted Odoo 20 Community database, bills integration user

> 4 questions the grant cannot settle from the pages it was read from. Each names the row it belongs to, what would settle it, and where to look. This file is written to be handed to an agent.

**Vault** `odoo-bills-integration-user` · **status** template · **shape** `odoo/community-20/bills-integration-user` · **grant** 2026-11-16 · **mandate** 2026-11-16 · **vocabulary** abp.sgit.ai v0.3.0 · **as at** 2026-11-19

---


## The rules for whoever takes this

- **Nothing is tested.** Do not connect an assistant to anybody's account to find out what it does. A question is settled from the vendor's own published pages, from a system you are entitled to run, or not at all.
- **Quote, do not paraphrase.** An answer is a sentence from a page, its URL, and the date you read it.
- **Record the answer in the grant.** Edit `data/grant.json`: move the row's `evidence` to the tier the answer supports, put the quote in its `note`, and remove the entry from `research_needed`. Rebuild; the history records that the counts moved, or that they did not.
- **An answer that says the page is silent is an answer.** Record it as `undocumented` in `contradictions` rather than leaving the question open.

## The questions

| # | Row | Question | How to settle it | Where to look |
| --- | --- | --- | --- | --- |
| 1 | `send.message.world` | On a database with an outgoing mail server, is the chatter email from this user delivered to the supplier, and with which sender address? | On an instance you are entitled to run, configure a mail server that delivers only to an address the deployer names for the purpose, post one message with partner_ids from this user, and record what arrives. | — |
| 2 | — (the shape) | On an Enterprise database, which user does an AI agent run as when an automated or scheduled action summons it, and which group may edit an agent's tools? Odoo states that "Agents triggered automatically perform their tasks directly, without requesting user approval before creating or updating records." and that "Agents can be summoned by automated and scheduled actions." | Odoo's own pages, quoted and dated, then a measurement on an Enterprise or Odoo.sh database the deployer is entitled to run. | <https://www.odoo.com/documentation/20.0/applications/productivity/ai/server-actions.html> · <https://www.odoo.com/odoo-20-release-notes> |
| 3 | — (the shape) | If this user is given an API key with scope MCP on an Enterprise database, which tools does Odoo's MCP server expose to it beyond the five default ones? Odoo states that the key is used "to authenticate the user's identity and permissions in the Odoo database" and that further tools are exposed by ticking "Available in MCP" on a server action. | Odoo's MCP server and tools pages, quoted; then a listing of tools from an MCP client on an Enterprise database the deployer is entitled to run. | <https://www.odoo.com/documentation/20.0/applications/productivity/ai/mcp_server.html> |
| 4 | `read.file.host` | Can the same job be done by a user whose group does not imply Odoo's internal-user role, which would take supplier bank accounts, chatter email, scheduled messages and email templates out of the grant? | On an instance you are entitled to run, make such a group, create one draft bill with lines through the key, and measure the grant again. | — |

## What each row stands at today

- **`send.message.world`** — ● none · evidence *measured* — the call returned a message id and Odoo queued an email titled "Draft Bill (INV-WC-2291)" to the supplier's address. The instance had no outgoing mail server, so the email stayed in the queue marked exception and was never delivered; on a database with mail configured nothing in this user's access would stop it. Creating outgoing mail directly (mail.mail) was refused: the door is the chatter, not the mail queue.
- **`read.file.host`** — ● none · evidence *measured* — Odoo's own access check reports read on 154 models. Read in the session: 41 contacts, and 6 supplier bank accounts (res.partner.bank, read granted to every internal user by the internal-user role, not by the job's group). Refused: posted bills, bank transactions (account.bank.statement.line), system parameters (ir.config_parameter), other users' API keys (it sees only its own key's name, never the secret).

## Pages this grant was read from

- The measuring session, 16 November 2026: the session record is history/grant-measured--2026-11-16.md in this vault — <https://riskmandate.ai/abp-vault-odoo-bills-integration-user.html> (read 2026-11-16)
- Odoo 20 external API documentation (JSON-2, access validation, removal schedule) — <https://www.odoo.com/documentation/20.0/developer/reference/external_api.html> (read 2026-11-19)
- Odoo 20 AI server actions documentation (agents triggered automatically) — <https://www.odoo.com/documentation/20.0/applications/productivity/ai/server-actions.html> (read 2026-11-19)
- Odoo 20 MCP server documentation — <https://www.odoo.com/documentation/20.0/applications/productivity/ai/mcp_server.html> (read 2026-11-19)
- Odoo 20 release notes — <https://www.odoo.com/odoo-20-release-notes> (read 2026-11-19)
- Odoo pricing page — <https://www.odoo.com/pricing> (read 2026-11-19)
- Odoo 20 source, res_users.py (API key generation) — <https://github.com/odoo/odoo/blob/20.0/odoo/addons/base/models/res_users.py> (read 2026-11-16)
- The official odoo:20.0 Docker image, tag 20.0-20261112 — <https://hub.docker.com/_/odoo> (read 2026-11-16)


---

_This describes the deployment shape as at this date. If the risk changed, the deployment changed — not this document._ 
No score, rating, level or traffic light appears in this vault or in its data, and none will. The behaviour policy describes; it does not judge. 
Generated by `scripts/site/build-abp-vault.mjs` from `data/grant.json`, `data/mandate.json` and the pinned vocabulary; `data/mandate.json` is the only file a person writes. Licence: the published template is CC BY 4.0; a paid copy carries a commercial licence to the buyer. See LICENCE.md.

