# Grant measured, 16 November 2026, on an instance we ran

> **Measured.** Every row below is a call made with the integration user's API key against an
> Odoo instance stood up for this purpose and torn down the same day. Odoo Community is published
> under LGPL-3 and the instance was ours to run. Nobody else's system was touched. Where a row
> says "Odoo's own access check", it is a reading of the user's access through Odoo's ORM on that
> same instance, not an exercised call.

**Session:** a cloud agent working for the lead, 16 November 2026, in an ephemeral container.
**Instance:** the official `odoo:20.0` Docker image, tag `20.0-20261112` (Community), with
PostgreSQL 16, modules `crm` and `account` (Invoicing) and Odoo's demo data, one database.
**Who set it up:** the person running the exercise, as a deployer would, through the
administrator account: three provenance fields on bills, a list view and a form tab, one group
(*Bills agent: draft vendor bills*) with eight access rows (`ir.access`, Odoo 20's merged
access model), one internal user `bills-agent-integration` holding that group and Odoo's
default internal-user role, and an API key for it with scope `rpc` and a one-day expiry. The
key was written to a private file, never printed, and deleted at teardown.

## The job's group, as configured

| Model | Operations | Domain |
| --- | --- | --- |
| `account.move` | create, read, update | `move_type` in (`in_invoice`, `in_refund`) and `state` = `draft` |
| `account.move.line` | create, read, update | the bill is a vendor bill and its `parent_state` = `draft` |
| `res.partner`, `account.journal`, `account.account`, `account.tax`, `res.currency`, `account.payment.term` | read | none |

A first attempt gave create and read only, no update. Odoo refused to create a bill with lines:
"You are not allowed to modify 'Journal Item' (account.move.line) records." Update was added,
limited to drafts. That is why the grant's `write.file.project` row includes editing a draft
after approval.

## The work it did

Four supplier PDFs went through plan, policy check, a simulated approval and a broker that held
the key. The broker created two draft vendor bills (Wood Corner 437.00, Lumber Inc 434.70), each
total matching its document to the cent, attached each PDF to its bill, and read both back:
state `draft`, created by `bills-agent-integration`. The other two documents were held before
the key was used: one needed a supplier Odoo did not have, one was above the plan's limit.

## The probes

25 calls with the key, over JSON-2 (`POST /json/2/<model>/<method>`). The session labelled
each with a proposed record primitive (`create.record.tenant` and siblings); the grant maps them
onto the v0.3.0 vocabulary through `reach_names`. Records a probe created were removed by the
administrator straight afterwards.

| # | Probe | Session label | Outcome | Detail |
| --- | --- | --- | --- | --- |
| 1 | read suppliers | `read.record.tenant` | **allowed** | 41 records |
| 2 | create draft vendor bill | `create.record.tenant` | **allowed** | [59] (probe records removed by the administrator afterwards) |
| 3 | create customer invoice (out_invoice) | `create.record.tenant` | **denied** | 403 AccessError: Uh-oh! Looks like you have stumbled upon some top-secret records. |
| 4 | edit a draft bill after approval | `write.record.tenant` | **allowed** | True |
| 5 | post a draft bill (action_post) | `write.record.tenant` | **denied** | 403 AccessError: You don't have the access rights to post an invoice. |
| 6 | read a posted bill | `read.record.tenant` | **denied** | 403 AccessError: Uh-oh! Looks like you have stumbled upon some top-secret records. |
| 7 | edit a posted bill | `write.record.tenant` | **denied** | 403 AccessError: Uh-oh! Looks like you have stumbled upon some top-secret records. |
| 8 | delete a draft bill | `delete.record.tenant` | **denied** | 403 AccessError: You are not allowed to delete 'Journal Item' (account.move.line) records. |
| 9 | create a supplier (res.partner) | `create.record.tenant` | **denied** | 403 AccessError: You are not allowed to create 'Contact' (res.partner) records. |
| 10 | edit a supplier's name | `write.record.tenant` | **denied** | 403 AccessError: Uh-oh! Looks like you have stumbled upon some top-secret records. |
| 11 | read supplier bank accounts | `read.record.tenant` | **allowed** | 6 records |
| 12 | add a supplier bank account | `create.record.tenant` | **denied** | 403 AccessError: You are not allowed to create 'Bank Account' (res.partner.bank) records. |
| 13 | read bank statement lines | `read.record.tenant` | **denied** | 403 AccessError: You are not allowed to access 'Bank Transaction' (account.bank.statement.line) records. |
| 14 | register a payment | `write.budget.tenant` | **denied** | 403 AccessError: You are not allowed to create 'Payment' (account.payment) records. |
| 15 | email the supplier from a bill (message_post) | `send.message.world` | **allowed** | returned a message id; Odoo queued an email "Draft Bill (INV-WC-2291)" to the supplier, left in exception because the instance had no outgoing mail server |
| 16 | queue an outgoing email (mail.mail) | `send.message.world` | **denied** | 403 AccessError: You are not allowed to create 'Outgoing Mail' (mail.mail) records. |
| 17 | create an attachment | `create.record.tenant` | **allowed** | [475] (probe records removed by the administrator afterwards) |
| 18 | create a CRM lead | `create.record.tenant` | **denied** | 403 AccessError: You are not allowed to create 'Lead' (crm.lead) records. |
| 19 | add itself to Accounting / Administrator | `grant.credential.self` | **denied** | 403 AccessError: You do not have enough rights to access the field "group_ids" on User (res.users). |
| 20 | mint another API key (res.users.apikeys create) | `grant.credential.self` | **denied** | 403 AccessError: You are not allowed to create 'User API Key' (res.users.apikeys) records. |
| 21 | start the API key wizard (make_key) | `grant.credential.self` | **allowed** | answered with an identity-check form (res.users.identitycheck), not a key; the user has no password |
| 22 | create a scheduled action (ir.cron) | `create.schedule.tenant` | **denied** | 403 AccessError: You are not allowed to create 'Scheduled Action' (ir.cron) records. |
| 23 | create a server action | `execute.process.host` | **denied** | 403 AccessError: You are not allowed to create 'Server Action' (ir.actions.server) records. |
| 24 | read system parameters | `read.credential.host` | **denied** | 403 AccessError: You are not allowed to access 'System Parameter' (ir.config_parameter) records. |
| 25 | read other users' API keys | `read.credential.host` | **allowed** | returned one record: its own key's name and owner, no secret |

**8 allowed, 17 denied.** Of the 8 allowed, 2 are the job (probes 1 and 2), 2 are not a
capability (probe 21 asked for a password the user does not have; probe 25 returned only the
user's own key's name), and 4 are in the grant beyond the job: editing a draft after approval,
supplier bank accounts, chatter email to the supplier, attachments.

## Odoo's own access check

Read on the same instance, after the probes, as the administrator, through Odoo's ORM
(`has_access` for the user) and the `ir.access` rows that apply to its groups:

- 172 models with some access: read on 154, create on 56, update on 56, delete on 33. The
  deletable ones are mostly personal and interface records, each under its own access domain:
  activities, calendar entries, filters, attachments, messages, email templates, scheduled messages.
- In the grant from the internal-user role, not the job's group: create on
  `mail.scheduled.message` (records the user can reach, its own only), create on
  `mail.template` (templates it created or owns), create on `ir.attachment` (records it can
  update), update on `res.partner` (its own contact only), read on `res.partner.bank` (all).
- Not in the grant: delete on bills, payments, creating contacts, writing bank accounts, bank
  transactions, leads, outgoing mail, scheduled actions, server actions, system parameters,
  API keys, groups, access rows. Posting needs the Accounting / Invoicing group, checked in code.
- The user cannot change its own access: it has no Access Rights role, no write on
  `res.groups` and no create on `ir.access`.

## Not done

- No email was delivered: the instance had no outgoing mail server.
- Odoo's AI agents and MCP server were not run: they are Enterprise modules and are not in this
  image. What the vault says about them is quoted from Odoo's pages, with the date read.
- The same scripts ran on Odoo 19 and 17 the same day, with the same result on the bills once the
  suppliers existed (17's database had no demo suppliers); this vault describes 20 only.
- A group that does not imply the internal-user role was not tried.
