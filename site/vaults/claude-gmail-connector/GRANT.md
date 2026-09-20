# GRANT — everything the agent can do

> Measured from the deployment shape, not from your account and not by you. Every row says how it is known, what stands in the way, and whether it can be undone. Irreversible rows first.

**Vault** `claude-gmail-connector` · **status** template · **shape** `anthropic/gmail-connector/default` · **grant** 2026-09-16 · **mandate** 2026-09-16 · **vocabulary** abp.sgit.ai v0.3.0 · **as at** 2026-09-16

---


**Shape** Claude, with the Gmail connector enabled (Google (the MCP server at gmailmcp.googleapis.com, and the account); Anthropic (Claude, the client, the directory listing and the approval prompt)) · **surface** web · **grant version** 2026-09-16 · **rows** 6, of which **4 measured** and 2 derived · **widest reach** world

## What the words mean here

The Gmail connector in Claude's directory: "MADE BY Google", connector URL https://gmailmcp.googleapis.com/mcp/v1, "ADDED March 2026", category Communication, sign-in required. It is one of three Google Workspace connectors (Gmail, Calendar, Drive) that Anthropic's help article says are "available for all users on Claude and Claude Desktop", toggled individually — so a deployment can run Gmail alone, which is this shape. Three surfaces were read and they do not agree: Anthropic's help article (read 2026-09-16, "Updated over a month ago"), Google's own MCP reference for the server (read 2026-09-16, page dated 2026-07-21, Developer Preview), and the directory listing plus Google's consent screens as captured by the deployer on 2026-09-16 (evidence/). Nothing was tested from this site. The directory's own footer: "Only use connectors from developers you trust. Anthropic does not control which tools developers make available and cannot verify that they will work as intended or that they won't change." Four rows were then measured on 2026-09-16 by the deployer, on an account they run: the sign-in, a read of the inbox, one message sent to an address the deployer named for the purpose, and the label inventory; the record and the screens are in evidence/. Two more were then measured: the message as sent carries nothing that names the client, and permanent deletion is refused — a boundary at Google's scope, not a setting in Claude.

| Reach | In this shape means |
| --- | --- |
| host | the mailbox itself: every message and thread, labels, filters and saved drafts, and attachment metadata — never attachment content |
| tenant | the Google account the consent was given for |
| world | anyone Claude replies to or forwards a message to |

## The rows

| Capability | What it is | Barrier | Undo | Evidence | Via | What stands in the way | Whose material |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `read.message.tenant` | Read mail or chat it is connected to | ○ boundary | no | measured ✓ | search_threads, get_thread, get_message, list_drafts | the Google OAuth consent — "View your email messages and settings." (gmail.readonly), one of three lines the person can tick individually on Google's screen — and the per-connector toggle in Claude; revocable from Claude's Connectors settings and from the Google account's third-party access page | mixed |
| `send.message.world` | Send a message to anyone | ◐ setting | no | measured ✓ | Send email message, reply, forward | two layers. At consent, Google's screen asks for "Manage drafts and send emails." (gmail.compose) and "Read, compose and send emails from your Gmail account." (gmail.modify), each with its own tick box, all pre-ticked under "Select all" — unticked, sending would be a boundary; this shape assumes the default. After consent, the per-action approval prompt: "By default, Claude asks for your approval before each of these actions. On Team and Enterprise plans, owners decide whether members can allow these actions to run without asking each time." A switch the account, or an org owner, can flip. On the screen the prompt reads "Claude wants to use Send email message from Gmail" with three buttons: Deny · Always allow · Allow once. "Always allow" is the switch — one click by the account holder, and the prompt is gone for good. | third_party |
| `authenticate-as.credential.tenant` | Act in accounts with the credentials it holds | ○ boundary | no | measured ✓ | Sign in with Google — "Claude for Gmail" | the Google OAuth consent; "You must authenticate directly with your Google account before using these connectors." Revocable from the Google account ("To make changes at any time, go to your Google Account.") and from Claude's Connectors settings. | own |
| `read.credential.host` | Read credentials stored where it runs | ● none | no | inferred | search_threads, get_message | — | own |
| `read.record.history` | Read a retained record: shell history, past sessions | ● none | no | measured ✓ | list_labels, get_thread, list_filters (listed; the agent reported no such tool — see contradictions) | — | mixed |
| `create.schedule.tenant` | Create something that outlives the session, on the platform (a routine, a scheduled trigger, a new session) | ◐ setting | with-effort | documented | create_filter | the per-action approval prompt: "By default, each action Claude takes on your behalf requires your explicit approval. On Team and Enterprise plans, owners decide whether members can allow certain actions to run without asking each time." | mixed |

**Whose material** is not in the published grammar. It is the property Lab 01 found a connector shape needs — `own`, `organisation`, `third_party` or `mixed` — and is asked of the model site as Lab 03 request 1. `mixed` is the finding: no setting any of these vendors offers makes it `own`.

## The notes behind the rows

- **`read.message.tenant`** — Anthropic: "Search and read emails using natural language queries." "Access email metadata, including attachment metadata (not attachment content)." Google's reference: "Read data: Search emails, retrieve threads, and list labels." Read carries no per-action approval prompt on Anthropic's page; the prompt sentence sits under send, reply and forward. Measured 2026-09-16: asked to read the inbox and name the top messages, Claude returned ten threads with sender, subject and date, after "Loaded tools, used Gmail integration".
- **`send.message.world`** — Anthropic: "Send, reply to, and forward emails from Gmail." and "During authentication, Google's OAuth screen mentions email sending permissions... Claude can send, reply to, and forward emails, but only does so with your explicit approval by default." The directory listing names reply and forward; Google's own reference for the same server (2026-07-21) names no tool that sends — see contradictions. The credential is the grant; the approval prompt is the barrier, and by the enforcer test it is a setting — the grant includes the ability to remove it. Measured 2026-09-16: one message sent to an address the deployer named for the purpose, after "Allow once"; Claude confirmed the send and the sending address. The message as sent carries no header naming the client: no X-Mailer, no User-Agent; the Received line says "by gmailapi.google.com with HTTPREST" from a numeric sender that is the OAuth client's Google Cloud project number, and the body is signed with the account holder's name. To the recipient it is the account holder's mail (evidence/09).
- **`authenticate-as.credential.tenant`** — acts as the account holder over the Gmail data of the connected account. "Claude mirrors your existing permissions — you cannot access information you don't already have access to in Google Workspace." The OAuth application is named "Claude for Gmail" on Google's screens. Measured 2026-09-16: the three Google screens — choose an account; "Sign in to Claude for Gmail"; "Claude for Gmail wants access to your Google Account" with the three scope lines pre-ticked — are transcribed in evidence/.
- **`read.credential.host`** — password resets, one-time codes, invitations and account-recovery mail arrive in a mailbox; reading messages reads those. Inferred, not documented — no tool or scope on either vendor's page separates them.
- **`read.record.history`** — a mailbox is a retained record of years, and the consent line is "View your email messages and settings." Measured 2026-09-16: asked for the account's settings, Claude returned the label structure with thread and unread counts for every system and custom label (an inventory of the mailbox's shape), and said it had no tool for forwarding rules, filters, the vacation responder or signatures. Nothing separates this from reading messages, so the barrier is the same as the row above: none beyond the consent itself.
- **`create.schedule.tenant`** — a Gmail filter is a standing rule that acts on every future message without the agent present — labelling, archiving, forwarding — which is what this primitive names: "something that outlives the session, on the platform". The tool is on the directory listing (captured 2026-09-16); it is not on Google's reference page for the server (2026-07-21), and the scope that filters need, gmail.settings.basic — "See, edit, create, or change your email settings and filters in Gmail." — is not among the three lines on the consent screen. Whether the tool works under the consented scopes is open; the row records what is listed. Asked in the measured session, Claude said: "the Gmail connector I have access to only exposes labels/messages, not account-level settings like forwarding rules, filters, vacation responder, IMAP/POP config, or signatures" — self-reported, and against the listing.

## Permitted, and blocked

The grant above is what the agent can do **after** the blocks. This is what something withholds. A block is not a property of the credential: some of these are the credential's own ceiling, and some are a vendor choosing not to ship a tool the credential would authorise. Each one names what blocks it, because those two are not the same object and a reader who is shown them under one heading has been told something this document cannot support.

| What | Blocked by | Who holds the block | Why | Source |
| --- | --- | --- | --- | --- |
| Google Calendar and Google Drive | the per-connector toggle in Claude — only the Gmail one is on in this shape | you — moves without you: **no** | "You can enable or disable specific connectors from below the chat interface... Toggle individual connectors on or off." This shape has only the Gmail toggle on; the directory lists Gmail, Google Drive and Google Calendar as three connectors. | https://support.claude.com/en/articles/10166901-use-google-workspace-connectors |
| attachment content | Anthropic's connector — the tool surface offers attachment metadata and no tool that returns the bytes; the credential authorises the bytes | a vendor, as a product decision — moves without you: **yes** | "Attachment content is not directly accessible through Gmail (metadata only)." | https://support.claude.com/en/articles/10166901-use-google-workspace-connectors |
| another Google account, or anything the account holder cannot already open | Google's own authorisation — the credential is issued for one account, and the connector inherits the account holder's permissions rather than adding to them | a vendor, against a consent you gave — moves without you: **with-your-consent** | "Claude can only access the Gmail, Calendar, and Drive data for the Google account you've connected" and "Claude mirrors your existing permissions — you cannot access information you don't already have access to in Google Workspace." | https://support.claude.com/en/articles/10166901-use-google-workspace-connectors |
| permanent deletion of mail | Google's scope ceiling — the widest scope consented is gmail.modify, and permanent deletion needs https://mail.google.com/, which was never asked for | a vendor, against a consent you gave — moves without you: **with-your-consent** | the widest scope on the consent screen is gmail.modify — "Read, compose, and send emails from your Gmail account. This scope does not allow immediate, permanent deletion of threads and messages, bypassing Trash"; the full https://mail.google.com/ scope ("Read, compose, send, and permanently delete all your email from Gmail") is not asked for. Measured 2026-09-16: asked to delete a trashed message or empty the Trash, Claude reported "I don't have a tool for permanent deletion or emptying Trash — only moving messages/threads to Trash". A boundary at Google, and the thirty-day Bin is Google's rule. | https://developers.google.com/workspace/gmail/api/auth/scopes |

### Each block, in seven answers

**Google Calendar and Google Drive**

| | |
| --- | --- |
| **Who holds it** | you — the person who decides which connectors are on; in this shape only the Gmail toggle is |
| **What it is made of** | a toggle under the chat interface, one per connector |
| **Can it move without you** | **no** — the toggle is the deployer’s, and turning Drive or Calendar on is a sign-in and a consent screen of its own |
| **Would you be told** | **yes** — enabling either is something the deployer does, with Google’s consent screen in front of it |
| **Can you check it is still there** | **yes** — the connector list under the chat interface shows which are on, at any time |
| **What would take it away** | turning on the Drive or the Calendar connector — at which point this is a different deployment shape, with its own behaviour policy |
| **If it went, what is behind it** | nothing here: this credential is for Gmail, and Drive and Calendar are separate consents to separate scopes |
| **Read from** | https://support.claude.com/en/articles/10166901-use-google-workspace-connectors (read 2026-09-16) |


**attachment content**

| | |
| --- | --- |
| **Who holds it** | a vendor, as a product decision — Anthropic, in the connector’s tool surface: the client offers attachment metadata and no tool that returns the bytes |
| **What it is made of** | which tools the client ships — code, not a permission. The directory’s own footer: Anthropic "does not control which tools developers make available and cannot verify that they will work as intended or that they won’t change." |
| **Can it move without you** | **yes** — a release adds a tool. No consent screen, no new scope, nothing for the deployer to click — because the scope that authorises the bytes has already been granted |
| **Would you be told** | **no** — neither vendor publishes a dated changelog for this connector’s tool list, and part of the listing sits behind "Show all" |
| **Can you check it is still there** | **partly** — the directory listing names today’s tools, and the agent can be asked what it holds — which is self-report. There is no published tool manifest with a date on it to check against |
| **What would take it away** | a release that ships a tool returning attachment bytes |
| **If it went, what is behind it** | the bytes. Google’s reference for users.messages.attachments.get: "Requires one of the following OAuth scopes: https://mail.google.com/, gmail.modify, gmail.readonly." Two of those three were consented, so nothing about the credential would have to change |
| **Read from** | https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.messages.attachments/get (read 2026-09-16); https://support.claude.com/en/articles/10166901-use-google-workspace-connectors (read 2026-09-16) |


**another Google account, or anything the account holder cannot already open**

| | |
| --- | --- |
| **Who holds it** | a vendor, against a consent you gave — Google: the token is issued for the account that signed in, and the connector inherits that account holder’s permissions rather than adding to them |
| **What it is made of** | the OAuth grant to "Claude for Gmail" for a single account, and Google Workspace’s own permission model underneath it |
| **Can it move without you** | **with-your-consent** — for another account, yes — that is a second sign-in. But what the connected account may open is not fixed: an administrator or a colleague sharing a mailbox widens it with no consent screen anywhere, and the connector follows |
| **Would you be told** | **partly** — a second account is a sign-in the deployer performs; somebody widening what the connected account itself may open is not announced here at all |
| **Can you check it is still there** | **yes** — what the connector reaches is what the account holder reaches, and that is visible by signing in as them |
| **What would take it away** | a second sign-in for a second account — or, with no sign-in at all, somebody widening what the connected account may open |
| **If it went, what is behind it** | exactly what the account holder may open at the moment it is asked. This one is a mirror, not a ceiling, and a mirror moves when the thing in front of it does |
| **Read from** | https://support.claude.com/en/articles/10166901-use-google-workspace-connectors (read 2026-09-16) |


**permanent deletion of mail**

| | |
| --- | --- |
| **Who holds it** | a vendor, against a consent you gave — Google: the consent screen carried gmail.modify, and Google’s own scope text excludes permanent deletion from it |
| **What it is made of** | the scope text itself — gmail.modify "does not allow immediate, permanent deletion of threads and messages, bypassing Trash" — and the absence of https://mail.google.com/ from the screen |
| **Can it move without you** | **with-your-consent** — widening it means a consent screen carrying the line "Read, compose, send, and permanently delete all your email from Gmail", which the deployer would have to tick |
| **Would you be told** | **yes** — the wider scope is a line on a screen, in Google’s own words, before anything can use it |
| **Can you check it is still there** | **yes** — the Google account’s third-party access page lists the scopes "Claude for Gmail" holds |
| **What would take it away** | a consent to https://mail.google.com/ — a wider credential, and a different deployment shape |
| **If it went, what is behind it** | nothing here: this is the credential’s own ceiling rather than something layered on top of it. Mail the agent moves to the Bin is still deleted after thirty days, which is Google’s rule and not the agent’s |
| **Read from** | https://developers.google.com/workspace/gmail/api/auth/scopes (read 2026-09-16) |



## Who holds each barrier

The barrier column says *what* stands in the way. It does not say who holds the thing in the way, what it is made of, or what would take it away — and two barriers of the same kind can be nothing alike. Seven answers per row, each a fact with a source. None of them is a rating: how much a barrier is worth depends on the deployment, which is the same reason nothing here is scored.

| Capability | Barrier | Who holds it | Moves without you | Would you be told | What removes it |
| --- | --- | --- | --- | --- | --- |
| `read.message.tenant` | ○ boundary | a vendor, against a consent you gave | **with-your-consent** | yes | revoking the application at the Google account, or turning the Gmail connector off — either ends the row, and no third party has to agree |
| `send.message.world` | ◐ setting | you | **yes** | no | one click on "Always allow" by the account the agent runs as, or an owner’s plan-level decision |
| `authenticate-as.credential.tenant` | ○ boundary | a vendor, against a consent you gave | **with-your-consent** | yes | revoking the application at the Google account — the connector then holds nothing |
| `create.schedule.tenant` | ◐ setting | you | **yes** | no | one click on "Always allow" — and, separately, the connector shipping a create_filter that works under the consented scopes |

### Each barrier, in seven answers

**`read.message.tenant`** — Read mail or chat it is connected to — ○ boundary

| | |
| --- | --- |
| **Who holds it** | a vendor, against a consent you gave — Google enforces it, and what it enforces is the three lines the deployer ticked on the consent screen for "Claude for Gmail" |
| **What it is made of** | an OAuth scope — "View your email messages and settings." (gmail.readonly) — and, above it, the per-connector toggle that decides whether the credential is used at all |
| **Can it move without you** | **with-your-consent** — widening it means a new screen with new lines on it; narrowing it is the deployer’s alone, at the Google account or in Claude’s Connectors settings |
| **Would you be told** | **yes** — a scope change is a screen somebody has to click through, and the account’s third-party access page lists what the application holds |
| **Can you check it is still there** | **yes** — the Google account’s third-party access page names "Claude for Gmail" and its access, without asking either vendor |
| **What would take it away** | revoking the application at the Google account, or turning the Gmail connector off — either ends the row, and no third party has to agree |
| **If it went, what is behind it** | nothing further. This barrier is the shape of the credential itself, so removing it leaves the agent reading less, not more — which is what makes it different from the blocks below |
| **Read from** | https://developers.google.com/workspace/gmail/api/auth/scopes (read 2026-09-16) |


**`send.message.world`** — Send a message to anyone — ◐ setting

| | |
| --- | --- |
| **Who holds it** | you — the account holder: one click on "Always allow" and the prompt is gone for good. On Team and Enterprise plans an owner above them decides whether members may make that click |
| **What it is made of** | a per-action prompt in the client — "Claude wants to use Send email message from Gmail", with Deny, Allow once and Always allow |
| **Can it move without you** | **yes** — the switch is inside the deployment: whoever is at the keyboard in the session can flip it, and on Team and Enterprise an owner can decide it for the member |
| **Would you be told** | **no** — nothing announces that "Always allow" was clicked. The prompt simply stops appearing, and the record of it is its absence |
| **Can you check it is still there** | **partly** — the setting is visible in the account’s own Connectors settings; no log outside the deployment says when it changed or who changed it |
| **What would take it away** | one click on "Always allow" by the account the agent runs as, or an owner’s plan-level decision |
| **If it went, what is behind it** | the send itself. gmail.compose and gmail.modify were both consented, so with the prompt gone the credential sends, replies and forwards to anyone, with no further screen |
| **Read from** | https://support.claude.com/en/articles/10166901-use-google-workspace-connectors (read 2026-09-16) |


**`authenticate-as.credential.tenant`** — Act in accounts with the credentials it holds — ○ boundary

| | |
| --- | --- |
| **Who holds it** | a vendor, against a consent you gave — Google: the token is issued for the one account that signed in, and the agent acts as that account holder |
| **What it is made of** | the OAuth grant to "Claude for Gmail" for a single account |
| **Can it move without you** | **with-your-consent** — acting as another account means another sign-in and another consent screen — but what this account may open can widen without either |
| **Would you be told** | **yes** — a second account is a sign-in the deployer performs, on Google’s screens |
| **Can you check it is still there** | **yes** — the Google account’s third-party access page lists the application and the access it holds |
| **What would take it away** | revoking the application at the Google account — the connector then holds nothing |
| **If it went, what is behind it** | nothing wider than the account holder. What it reaches grows when their own access grows, which is a door that opens from a side nobody watches |
| **Read from** | https://support.claude.com/en/articles/10166901-use-google-workspace-connectors (read 2026-09-16) |


**`create.schedule.tenant`** — Create something that outlives the session, on the platform (a routine, a scheduled trigger, a new session) — ◐ setting

| | |
| --- | --- |
| **Who holds it** | you — the account holder, through the same per-action approval prompt; on Team and Enterprise an owner decides whether members may turn it off |
| **What it is made of** | a prompt in the client — and, underneath it, an unsettled question: Google names gmail.settings.basic for filters, and the consent screen did not carry it |
| **Can it move without you** | **yes** — the prompt goes with one click from inside the deployment. Whether the scope underneath it exists at all is Google’s and Anthropic’s to say, not the deployer’s |
| **Would you be told** | **no** — neither the click nor a change to the connector’s tool list is announced |
| **Can you check it is still there** | **partly** — a filter that exists is visible in Gmail’s own settings; nothing says the tool was offered, or that the prompt was turned off |
| **What would take it away** | one click on "Always allow" — and, separately, the connector shipping a create_filter that works under the consented scopes |
| **If it went, what is behind it** | unsettled. The listing names create_filter and the consent screen does not carry gmail.settings.basic. If the scope is absent, Google refuses the filter whatever the client offers; this record says so rather than choosing a side |
| **Read from** | https://developers.google.com/workspace/gmail/api/auth/scopes (read 2026-09-16); https://support.claude.com/en/articles/10166901-use-google-workspace-connectors (read 2026-09-16) |



## Where the vendor's own pages disagree

Advertised in one place, permitted in another, and the two do not match. Published unresolved on purpose: settling any of these by connecting an assistant and trying would mean probing somebody else's system, which is out of bounds here. If the vendor says which page is right, this table changes and says so.

| What is advertised | What the grant permits | State |
| --- | --- | --- |
| Google's MCP reference for gmailmcp.googleapis.com (page dated 2026-07-21): ten tools — create_draft, get_message, get_thread, label_message, label_thread, list_drafts, list_labels, search_threads, unlabel_message, unlabel_thread — and "Take action: Create draft emails and label messages." None sends. | the same server's listing in Claude's directory (captured 2026-09-16) names reply, forward, create_filter, list_filters, create_label, delete_label, mark_message_spam and mark_thread_spam, with more behind "Show all"; and Google's consent screen for it asks for gmail.compose and gmail.modify, both of which send. | **unresolved** |
| the directory listing's own description: "Draft replies, summarize threads, & search your inbox" and "Claude can search through your messages, read entire email threads to give you context, and help you stay on top of your inbox." | the listing's tool list (reply, forward, create_filter, mark spam) and the consent it opens ("Manage drafts and send emails.", "Read, compose and send emails from your Gmail account.") | **unresolved** |
| create_filter is on the listing | the three consent lines are gmail.readonly, gmail.compose and gmail.modify; the scope Google names for filters, gmail.settings.basic, is not asked for | **undocumented** |
| Anthropic's help article documents the connector's behaviour and its approval prompt as Claude's | the listing says "MADE BY Google", Google's page says Developer Preview, and the directory's footer says "Anthropic does not control which tools developers make available and cannot verify that they will work as intended or that they won't change." Who is accountable for the tool set, and for its changing, is stated by neither. | **unresolved** |
| the directory listing names list_filters and create_filter | in the measured session (2026-09-16) the agent, asked to list the account's settings, said: "the Gmail connector I have access to only exposes labels/messages, not account-level settings like forwarding rules, filters, vacation responder, IMAP/POP config, or signatures — those live in a separate Gmail Settings API that isn't wired up here." Self-reported; the consent screen did not ask for gmail.settings.basic either. | **unresolved** |

Sources: <https://developers.google.com/workspace/gmail/api/reference/mcp> · <https://claude.ai/directory/gmail-gmailmcp> · <https://developers.google.com/workspace/gmail/api/auth/scopes> · <https://support.claude.com/en/articles/10166901-use-google-workspace-connectors>

## Granted, and not in the grammar

The connector permits these and none of the 23 primitives names them. They are recorded here so the grant is not silently narrower than the consent screen, and asked of the model site.

| What the connector can do | Permission | Why no row |
| --- | --- | --- |
| create, list, update and delete drafts | gmail.compose — "Manage drafts and send emails." | the 23 primitives have write.file.* and delete.file.host; a message is not a file, and no primitive names a draft |
| create and delete labels; label and unlabel messages and threads | gmail.modify | no primitive names labelling |
| move a message to Trash ("Moves a message to Trash" — measured 2026-09-16, behind the same approval prompt, on the one message Claude had itself sent); mark a message or thread as spam | gmail.modify — trash, not permanent deletion; the Bin auto-deletes after thirty days | delete.file.host is the nearest primitive and a message is not a file; both actions are recoverable from Gmail's own folders for thirty days, and permanent deletion is out of the connector's reach (see not_reachable) |
| apply_sensitive_message… and apply_sensitive_thread… (names truncated in the capture) | not stated | not on Google's reference page; what they do is not known from the listing |

## Open questions

**6** things this grant cannot settle from the pages it was read from. Each is in `RESEARCH-NEEDED.md` with how to settle it, and can be handed to a separate agent. Until it is answered, the row it belongs to stands at the evidence tier shown.

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

