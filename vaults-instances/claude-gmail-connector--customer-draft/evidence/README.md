# Evidence — the Gmail connector, connected and exercised on 2026-09-16

> The record behind the four **measured** rows in `data/grant.json`. Captured by the deployer
> on an account they run, on 16 September 2026, in Claude in the browser. The account's address
> appears on several screens and is redacted here and in the images as `<address redacted>`;
> nothing else on the screens was changed. Where an image is listed and not present, the file
> is still to be added once the redacted export exists.

## What was done, in order

| # | Action | Row it measures | Rule of measurement it followed |
|---|---|---|---|
| 1 | Opened the connector directory in Claude, then the Gmail listing | — (documents the tool list) | read the listing, changed nothing |
| 2 | Connected: three Google screens, all three scope lines left ticked | `authenticate-as.credential.tenant` | measure only what you are entitled to run — the deployer's own account |
| 3 | Asked Claude to read the inbox and name the top messages | `read.message.tenant` | reversible — a read |
| 4 | Asked Claude to send one message to an address the deployer named, and to list the account's settings | `send.message.world`, `read.record.history` | send only to an address the deployer named for the purpose; one message; no secret moved |
| 5 | Read Claude's reply about settings | the filters contradiction | say what you did not test — filters were not tested, and the agent said it had no tool for them |
| 6 | Opened the sent message's original headers on the sending side and saved the .eml | the send row's note on identifiability | read only |
| 7 | Asked Claude to delete the message it had sent; it warned that trash does not unsend; confirmed; approved *Moves a message to Trash* once | the trash entry under *not in the grammar* | delete only the artefact you created — the one message Claude itself sent |
| 8 | Asked Claude to delete it from Trash or empty Trash; it reported it had no tool for permanent deletion | the *permanent deletion* row under *not reachable* | say what you did not test — nothing was emptied |

Not done: no filter was created, no label was changed, nothing was forwarded, no draft was
made, nothing was marked as spam, nothing was permanently deleted. The one message trashed was
the one Claude had sent, and it sits in the Bin under Google's thirty-day rule. The connection was not revoked afterwards by
this record's author; whether the deployer revoked it is theirs to say.

## The screens, transcribed

### 1 · The directory (`claude.ai` → Connectors → Directory)

*Top connectors*: Google Drive — "Search, read, and upload files instantly"; **Gmail — "Draft
replies, summarize threads, & search your inbox"**; Google Calendar — "Manage your schedule
and coordinate meetings…"; then Canva, Microsoft 365, Notion, Figma, Slack, Atlassian Rovo,
HubSpot, Asana, Linear. Each is a separate tile with its own **+**.

### 2 · The Gmail listing (`https://claude.ai/directory/gmail-gmailmcp`)

**Gmail** ✓ — "Draft replies, summarize threads, & search your inbox" — button **Connect to Claude**.

"Connect Gmail to Claude to quickly find important emails and understand long conversations.
Claude can search through your messages, read entire email threads to give you context, and
help you stay on top of your inbox. Perfect for finding that message you remember sending,
catching up on email chains you missed, or preparing for meetings."

**Tools** (as shown; "Show all" not expanded):
`apply_sensitive_messa…` · `apply_sensitive_thread…` · `create_draft` · `create_filter` ·
`create_label` · `delete_label` · `forward` · `get_message` · `get_thread` · `label_message` ·
`label_thread` · `list_drafts` · `list_filters` · `list_labels` · `mark_message_spam` ·
`mark_thread_spam` · `reply` · `search_threads`

MADE BY **Google** · CATEGORY Communication · SIGN-IN Required ·
CONNECTOR URL `https://gmailmcp.googleapis.com/mcp/v1` · ADDED March 2026 ·
MORE INFO: Documentation → `https://developers.google.com/workspace/gmail` · Support →
`https://developers.google.com/workspace/support` · Privacy Policy → `https://policies.google.com/privacy`

Footer: "Only use connectors from developers you trust. Anthropic does not control which tools
developers make available and cannot verify that they will work as intended or that they won't
change."

### 3 · Sign in with Google — "Choose an account"

"to continue to **Claude for Gmail**". One account listed: `<address redacted>`, and "Use another
account". "Before using this app, you can review Claude for Gmail's Privacy Policy and Terms of
Service."

### 4 · "Sign in to Claude for Gmail"

"Google will allow **Claude for Gmail** to access this info about you — `<address redacted>` —
Email address." Cancel · Continue.

### 5 · "Claude for Gmail wants access to your Google Account"

"Select what **Claude for Gmail** can access" — **Select all** ☑

- ☑ **View your email messages and settings.** See access details
- ☑ **Manage drafts and send emails.** See access details
- ☑ **Read, compose and send emails from your Gmail account.** See access details

"Make sure that you trust Claude for Gmail. Review Claude for Gmail's privacy policy and Terms of
Service to understand how Claude for Gmail will process and protect your data. To make changes at
any time, go to your Google Account." Cancel · Continue.

The three lines are, in Google's scope list, `gmail.readonly`, `gmail.compose` and `gmail.modify`.
Each has its own tick box. `gmail.settings.basic` — "See, edit, create, or change your email
settings and filters in Gmail." — is not among them.

### 6 · Reading the inbox

User: "Hi can you read my inbox and tell me what are the current top messages?"
Claude: "Loaded tools, used Gmail integration" → "Here's what's at the top of your inbox, newest
first:" and ten threads with sender, subject, date and a one-line summary (a payments provider's
notice, two billing receipts, two product digests, a Google Workspace invoice, a Google OAuth
clean-up warning, an outreach invitation, an API update notice, a guest-passes reminder). The
threads themselves are not reproduced here.

### 7 · The approval prompt

**Needs your input** › Gmail — "**Send email message**"
"Claude wants to use **Send email message** from **Gmail**"
**Deny** (Esc) · **Always allow** (⇧⌘↵) · **Allow once** (⌘↵)

The deployer chose *Allow once*. *Always allow* is the switch that removes the prompt for good;
it is the account holder's to press, which is why the row's barrier is a *setting*.

### 8 · The send, and the settings question

User: "great, can you send an email to `<address redacted>` (me on another account) saying hi and
can you also list the settings and configuration of this email account?"
Claude: "Loaded tools, used Gmail integration" → "Done — email sent to `<address redacted>` saying
hi from `<address redacted>`."

"On settings: the Gmail connector I have access to only exposes labels/messages, not
account-level settings like forwarding rules, filters, vacation responder, IMAP/POP config, or
signatures — those live in a separate Gmail Settings API that isn't wired up here. What I *can*
show you is the label/folder setup:" — then the system labels with thread and unread counts
(Inbox, Sent, Trash, Spam, Starred, Important, Unread, Chat, Drafts) and two custom labels with
their counts. "If you want the actual account settings (forwarding, filters, auto-reply, IMAP
access, signature), you'd need to check those directly in Gmail's web settings — I don't have a
tool that can read them here."

### 9 · The sent message, on the sending side (`09-sent-message-headers.eml.txt`)

Gmail → *Show original*: Message ID `<…@mail.gmail.com>`; Created 16 September 2026 at 12:02
(Delivered after 0 seconds); From `<account-name-redacted> <sending-address-redacted>`; To
`<recipient-redacted>`; Subject *Hi from your other account*. Headers, in full:

```
Received: from 101988054943 named unknown by gmailapi.google.com with HTTPREST; Wed, 16 Sep 2026 04:02:26 -0700
Received: from 101988054943 named unknown by gmailapi.google.com with HTTPREST; Wed, 16 Sep 2026 04:02:26 -0700
Date · To · Message-Id · Subject · MIME-Version · Content-Type: multipart/alternative · From
```

No `X-Mailer`, no `User-Agent`, no header naming Claude or Anthropic. The body is signed with the
account holder's first name. To the recipient the message is from the account holder; the only
trace of the connector is a Received line that says the Gmail API sent it, and a project number.

### 10 · Trash — the warning and the prompt

User: "great now can you delete that message you sent?"
Claude: *Searched available tools — trash delete message* → "One heads-up: this only removes it
from your Sent folder — it won't unsend or delete it from [the recipient's] inbox …, since
there's no way to recall an email already delivered. Want me to go ahead and trash it on your
side anyway?" User: "yes please trash it?"
**Needs your input** › Gmail — "**Moves a message to Trash.**"
"Claude wants to use **Moves a message to Trash** from **Gmail**" — Deny · Always allow · Allow once.

### 11 · The Bin

Gmail, `in:trash`: one message, *Hi from your other account*. The banner: "Messages that have been
in the Bin for more than 30 days will be deleted automatically. Empty Bin now".

### 12 · Permanent deletion

User: "great that worked, now are you able to delete that message from the trash, or empty the trash?"
Claude: *Searched available tools — permanently delete message empty trash* → "I don't have a
tool for permanent deletion or emptying Trash — only moving messages/threads to Trash. In Gmail,
items in Trash are auto-deleted permanently after 30 days on their own. If you want it gone
sooner, you'd need to do that manually from the Gmail web/app interface (open Trash → delete
forever)."

That matches Google's scope text: `gmail.modify` "does not allow immediate, permanent deletion
of threads and messages, bypassing Trash", and the scope that would — `https://mail.google.com/`,
"Read, compose, send, and permanently delete all your email from Gmail" — is not on the consent
screen. Permanent deletion is bounded at Google, out of the agent's reach: a boundary, not a
setting, and the thirty-day Bin is Google's rule rather than the connector's.

## Images

Present: `09-sent-message-headers.eml.txt` (redacted). To be added, redacted: `01-directory.png`,
`02-listing.png`, `03-choose-account.png`, `04-sign-in.png`, `05-consent.png`, `06-read-inbox.png`,
`07-approval-prompt.png`, `08-send-and-settings.png`, `10-trash-prompt.png`, `11-the-bin.png`,
`12-permanent-deletion.png`. The transcriptions above are the record until then.

---

_This is an evidence file, not a judgement. It says what was seen and done on one account on one
day. The connector's tool list can change without notice, as the listing's own footer says._
