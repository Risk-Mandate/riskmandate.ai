# GRANT — everything the agent can do

> Measured from the deployment shape, not from your account and not by you. Every row says how it is known, what stands in the way, and whether it can be undone. Irreversible rows first.

**Vault** `claude-m365-connector` · **status** template · **shape** `anthropic/microsoft-365-connector/default` · **grant** 2026-09-15 · **mandate** 2026-09-15 · **vocabulary** abp.sgit.ai v0.3.0 · **as at** 2026-09-15

---


**Shape** Claude's Microsoft 365 connector (Outlook, SharePoint, OneDrive, Teams) (Anthropic) · **surface** web · **grant version** 2026-09-15 · **rows** 5, of which **0 measured** and 5 derived · **widest reach** world

## What the words mean here

"An Anthropic-hosted integration that enables Claude to securely access Microsoft 365 services (Outlook, SharePoint, OneDrive, Teams) through user-delegated permissions." A Global Administrator consents once for the tenant; each user then reaches only what they already have permission for, over OAuth 2.0 On-Behalf-Of. The rows are the connector's tool tables read as capabilities. Lab 01 read this page on 12 September as read-only; on 15 September it lists write tools too, and both readings are recorded.

| Reach | In this shape means |
| --- | --- |
| host | SharePoint sites and OneDrive files the user can already open — searched tenant-wide |
| tenant | the Microsoft Entra tenant the administrator consented for; the user's mailbox, shared mailboxes they are delegated to, and Teams chats |
| world | anyone reachable by mail from the user's address |

## The rows

| Capability | What it is | Barrier | Undo | Evidence | Via | What stands in the way | Whose material |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `read.message.tenant` | Read mail or chat it is connected to | ○ boundary | no | documented | outlook_email_search, chat_message_search, read_resource | delegated Entra permissions Mail.Read, Mail.Read.Shared and Chat.Read — consented once by a Global Administrator, revocable per permission in Entra | mixed |
| `send.message.world` | Send a message to anyone | ○ boundary | no | documented | outlook_send_mail, outlook_forward_mail, outlook_send_draft | Mail.Send, delegated; "Revoke … in Entra" is the off switch, and it is the administrator's, not the user's | third_party |
| `read.file.host` | Read any file the account can reach | ○ boundary | no | documented | sharepoint_search, sharepoint_folder_search, read_resource | delegated Sites.Read.All and Files.Read / Files.Read.All; "Users cannot bypass SharePoint sharing settings or folder permissions" | mixed |
| `authenticate-as.credential.tenant` | Act in accounts with the credentials it holds | ○ boundary | no | documented | OAuth 2.0 On-Behalf-Of | delegated permissions; "Multi-tenant isolation is cryptographically enforced through digitally signed access tokens" | own |
| `read.credential.host` | Read credentials stored where it runs | ● none | no | inferred | outlook_email_search, read_resource | — | organisation |

**Whose material** is not in the published grammar. It is the property Lab 01 found a connector shape needs — `own`, `organisation`, `third_party` or `mixed` — and is asked of the model site as Lab 03 request 1. `mixed` is the finding: no setting any of these vendors offers makes it `own`.

## The notes behind the rows

- **`read.message.tenant`** — the user's mailbox, "shared mailboxes they've been granted delegate access to … including full access and folder-level delegation", and Teams chats. Shared-mailbox access is stated as read-only via Mail.Read.Shared.
- **`send.message.world`** — outlook_send_mail — "Send an email as the user." To any address. Listed under Write tools on the same page whose read section says the connector "provides read-only access to" its sources.
- **`read.file.host`** — "SharePoint search requires Sites.Read.All permission. Site-specific permissioning (using *.Selected permissions) is not supported because the underlying search is tenant-wide." Everything the user can already open, across the tenant.
- **`authenticate-as.credential.tenant`** — "Users can only access Microsoft 365 data they already have permission for." Anthropic hosts the connector and holds the token.
- **`read.credential.host`** — a work mailbox carries password resets, MFA codes and shared credentials sent between colleagues; a SharePoint estate carries key files and configuration. Reading either reads those. Inferred, not documented.

## Not reachable from this shape

| What | Why | Source |
| --- | --- | --- |
| personal Microsoft accounts | "Personal Microsoft accounts (@outlook.com, @hotmail.com) can't be used" | https://support.claude.com/en/articles/12684923-microsoft-365-connector-security-guide |
| other users' private files or emails | "Users can't access other users' private files or emails"; delegated permissions reach only what the user already can | https://support.claude.com/en/articles/12684923-microsoft-365-connector-security-guide |
| the Online Archive mailbox | "Email search doesn't reach a user's separate Online Archive (In-Place Archive) mailbox" | https://support.claude.com/en/articles/12684923-microsoft-365-connector-security-guide |
| a single SharePoint site | "Site-specific permissioning (using *.Selected permissions) is not supported because the underlying search is tenant-wide" | https://support.claude.com/en/articles/12684923-microsoft-365-connector-security-guide |
| writing SharePoint or OneDrive files | no write tool for files is listed; the write tools are mail and Teams | https://support.claude.com/en/articles/12684923-microsoft-365-connector-security-guide |

## Where the vendor's own pages disagree

Advertised in one place, permitted in another, and the two do not match. Published unresolved on purpose: settling any of these by connecting an assistant and trying would mean probing somebody else's system, which is out of bounds here. If the vendor says which page is right, this table changes and says so.

| What is advertised | What the grant permits | State |
| --- | --- | --- |
| "The connector provides read-only access to:" (the heading over the read tools) | a "Write tools" table on the same page: outlook_send_mail (Mail.Send), outlook_trash_thread and outlook_batch_delete_messages (Mail.ReadWrite) | **unresolved** |,| "Shared mailbox access remains read-only, via the Mail.Read.Shared permission" | outlook_send_mail "Send an email as the user" — whether it can send from a shared mailbox is not stated | **undocumented** |,| Lab 01, 12 September: the page read as a read-only connector | 15 September: the same page lists ten write tools. The page moved between the two readings; which capabilities a tenant consented to before the change is not stated | **unresolved** |

Sources: <https://support.claude.com/en/articles/12684923-microsoft-365-connector-security-guide> · <https://riskmandate.ai/lab-connector-grants.html>

## Granted, and not in the grammar

The connector permits these and none of the 23 primitives names them. They are recorded here so the grant is not silently narrower than the consent screen, and asked of the model site.

| What the connector can do | Permission | Why no row |
| --- | --- | --- |
| trash, untrash and batch-delete mail; create and update drafts | Mail.ReadWrite | the 23 primitives have delete.file.host and write.file.host; a message is not a file, and no primitive names deleting or drafting one |,| search the calendar and find meeting availability | Calendars.Read | no primitive reads a calendar; create.schedule.* creates jobs, not events |,| send Teams messages and create chats | ChatMessage.Send, ChannelMessage.Send, Chat.Create | send.message.world covers it loosely; a Teams post reaches the tenant, and whether it reaches federated external chats is open |

## Open questions

**4** things this grant cannot settle from the pages it was read from. Each is in `RESEARCH-NEEDED.md` with how to settle it, and can be handed to a separate agent. Until it is answered, the row it belongs to stands at the evidence tier shown.

## The four barriers, and the test

| | Barrier | What stands in the way | Is it a control |
| --- | --- | --- | --- |
| ● | none | nothing in the way | no |
| ◉ | expectation | a rule in prose, enforced by nobody | no |
| ◐ | setting | a switch the agent's own account can flip | no |
| ○ | boundary | enforced above the grant, out of the agent's reach | **yes** |

> A control bounds a grant only if it is enforced by something the grant does not include.

A setting the agent's own account can change is not a control, because the grant includes the ability to remove the bound. A boundary enforced above it is one, because it does not.

## Evidence tiers

| Tier | Means |
| --- | --- |
| derived | from what the thing architecturally is; a claim until somebody runs the probes |
| inferred | from another row or another profile, by reasoning rather than by observation |
| self-reported | reported by the operator, the harness or the tool itself, without an independent probe |
| documented | the vendor, or a published tool, says so |
| measured ✓ | a probe run on an instance, dated, with an evidence file |
| observed ✓ | seen directly, on the thing itself, by the thing itself |

✓ marks the tiers this vault counts as measured. Nothing here was obtained by probing anybody else's system: a row is measured only from a system we are entitled to run, or from the vendor's own published documentation.

## Ask the agent to check it

The agent is running in the deployment this file describes, so it can look. What it reports is a claim until a log held outside it agrees — but a claim from inside the deployment is a better starting point than a template. Paste this into a session running in the shape above:

```
You are running inside the deployment described in GRANT.md. Compare each row with what you
can actually reach from here, and report — do not change any file except the one named below.

For every row: PRESENT, ABSENT or CANNOT TELL; which tool reaches it; one line of evidence
(a command's output, a tool's own description, a documentation sentence with its URL).
Never exercise a capability whose undo class is "no" to prove it exists: presence of a
credential file is evidence; using it is not permitted.
Add a row for anything you can reach that is not listed, in verb.object.reach form, using
only the 23 primitives in data/vocabulary/capabilities.json. A new path, host or mailbox is
an instance of an existing primitive, not a new one.
Do not touch MANDATE.md or data/mandate.json — that file is the deployer's, not yours.
Write the result to history/grant-check--<today>.md with the date and the tool versions
you can see. Everything in it is self-report; say so at the top.
```

---

_This describes the deployment shape as at this date. If the risk changed, the deployment changed — not this document._ 
No score, rating, level or traffic light appears in this vault or in its data, and none will. The behaviour policy describes; it does not judge. 
Generated by `scripts/site/build-abp-vault.mjs` from `data/grant.json`, `data/mandate.json` and the pinned vocabulary; `data/mandate.json` is the only file a person writes. Licence: the published template is CC BY 4.0; a paid copy carries a commercial licence to the buyer. See LICENCE.md.

