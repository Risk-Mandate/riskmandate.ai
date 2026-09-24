# RESEARCH NEEDED — Claude's Gmail connector, for Example Analytics

> 6 questions the grant cannot settle from the pages it was read from. Each names the row it belongs to, what would settle it, and where to look. This file is written to be handed to an agent.

**Vault** `example-analytics` · **status** draft · **shape** `anthropic/gmail-connector/default` · **grant** 2026-09-16 · **mandate** 2026-09-24 · **vocabulary** abp.sgit.ai v0.3.0 · **as at** 2026-09-24

---


## The rules for whoever takes this

- **Nothing is tested.** Do not connect an assistant to anybody's account to find out what it does. A question is settled from the vendor's own published pages, from a system you are entitled to run, or not at all.
- **Quote, do not paraphrase.** An answer is a sentence from a page, its URL, and the date you read it.
- **Record the answer in the grant.** Edit `data/grant.json`: move the row's `evidence` to the tier the answer supports, put the quote in its `note`, and remove the entry from `research_needed`. Rebuild; the history records that the counts moved, or that they did not.
- **An answer that says the page is silent is an answer.** Record it as `undocumented` in `contradictions` rather than leaving the question open.

## The questions

| # | Row | Question | How to settle it | Where to look |
| --- | --- | --- | --- | --- |
| 1 | `send.message.world` | Which tool sends? Google's reference names none; the directory names reply and forward; the approval prompt in the measured session named "Send email message", so a plain send exists — its tool name, and whether it sits behind "Show all", were not captured. | Expand "Show all" on the listing, or read the tools/list response Google documents for the endpoint. Do not connect an account to find out. | <https://claude.ai/directory/gmail-gmailmcp> · <https://developers.google.com/workspace/gmail/api/reference/mcp> |
| 2 | `create.schedule.tenant` | Does create_filter work under the three consented scopes, and can a filter it creates forward mail to an outside address? | Google's Gmail API documentation for users.settings.filters and forwarding addresses, quoted; the consent screen's "See access details" for each line. | <https://developers.google.com/workspace/gmail/api/auth/scopes> |
| 3 | `read.record.history` | Does list_filters return forwarding addresses and the vacation responder, or only filter criteria and actions? | Google's Gmail API documentation for users.settings.filters, quoted. | <https://developers.google.com/workspace/gmail> |
| 4 | `read.message.tenant` | Outside the stated exception — a consumer account that opted into model training, where a person copies connector content into a chat — is retrieved mail content ever used for training? | Anthropic's model-training data policy page, quoted. | <https://support.claude.com/en/articles/10166901-use-google-workspace-connectors> |
| 5 | — (the shape) | What are apply_sensitive_message… and apply_sensitive_thread…? The names are cut off in the listing and absent from Google's reference. | The listing's full tool names and descriptions, or Google's reference once it lists them. | <https://claude.ai/directory/gmail-gmailmcp> |
| 6 | `send.message.world` | Is the numeric sender in the Received line (a Google Cloud project number) the "Claude for Gmail" OAuth client's, and is there any published way for a recipient to tell that a message was sent by an agent through the connector rather than by the account holder? | Google's documentation of the Received header written by gmailapi.google.com, and Anthropic's, if any; compare the number against the OAuth client shown on the Google account's third-party access page. Do not send further messages to find out. | <https://developers.google.com/workspace/gmail> |

## What each row stands at today

- **`send.message.world`** — ◐ setting · evidence *measured* — Anthropic: "Send, reply to, and forward emails from Gmail." and "During authentication, Google's OAuth screen mentions email sending permissions... Claude can send, reply to, and forward emails, but only does so with your explicit approval by default." The directory listing names reply and forward; Google's own reference for the same server (2026-07-21) names no tool that sends — see contradictions. The credential is the grant; the approval prompt is the barrier, and by the enforcer test it is a setting — the grant includes the ability to remove it. Measured 2026-09-16: one message sent to an address the deployer named for the purpose, after "Allow once"; Claude confirmed the send and the sending address. The message as sent carries no header naming the client: no X-Mailer, no User-Agent; the Received line says "by gmailapi.google.com with HTTPREST" from a numeric sender that is the OAuth client's Google Cloud project number, and the body is signed with the account holder's name. To the recipient it is the account holder's mail (evidence/09).
- **`create.schedule.tenant`** — ◐ setting · evidence *documented* — a Gmail filter is a standing rule that acts on every future message without the agent present — labelling, archiving, forwarding — which is what this primitive names: "something that outlives the session, on the platform". The tool is on the directory listing (captured 2026-09-16); it is not on Google's reference page for the server (2026-07-21), and the scope that filters need, gmail.settings.basic — "See, edit, create, or change your email settings and filters in Gmail." — is not among the three lines on the consent screen. Whether the tool works under the consented scopes is open; the row records what is listed. Asked in the measured session, Claude said: "the Gmail connector I have access to only exposes labels/messages, not account-level settings like forwarding rules, filters, vacation responder, IMAP/POP config, or signatures" — self-reported, and against the listing.
- **`read.record.history`** — ● none · evidence *measured* — a mailbox is a retained record of years, and the consent line is "View your email messages and settings." Measured 2026-09-16: asked for the account's settings, Claude returned the label structure with thread and unread counts for every system and custom label (an inventory of the mailbox's shape), and said it had no tool for forwarding rules, filters, the vacation responder or signatures. Nothing separates this from reading messages, so the barrier is the same as the row above: none beyond the consent itself.
- **`read.message.tenant`** — ○ boundary · evidence *measured* — Anthropic: "Search and read emails using natural language queries." "Access email metadata, including attachment metadata (not attachment content)." Google's reference: "Read data: Search emails, retrieve threads, and list labels." Read carries no per-action approval prompt on Anthropic's page; the prompt sentence sits under send, reply and forward. Measured 2026-09-16: asked to read the inbox and name the top messages, Claude returned ten threads with sender, subject and date, after "Loaded tools, used Gmail integration".
- **`send.message.world`** — ◐ setting · evidence *measured* — Anthropic: "Send, reply to, and forward emails from Gmail." and "During authentication, Google's OAuth screen mentions email sending permissions... Claude can send, reply to, and forward emails, but only does so with your explicit approval by default." The directory listing names reply and forward; Google's own reference for the same server (2026-07-21) names no tool that sends — see contradictions. The credential is the grant; the approval prompt is the barrier, and by the enforcer test it is a setting — the grant includes the ability to remove it. Measured 2026-09-16: one message sent to an address the deployer named for the purpose, after "Allow once"; Claude confirmed the send and the sending address. The message as sent carries no header naming the client: no X-Mailer, no User-Agent; the Received line says "by gmailapi.google.com with HTTPREST" from a numeric sender that is the OAuth client's Google Cloud project number, and the body is signed with the account holder's name. To the recipient it is the account holder's mail (evidence/09).

## Pages this grant was read from

- Use Google Workspace connectors (Anthropic help) — <https://support.claude.com/en/articles/10166901-use-google-workspace-connectors> (read 2026-09-16)
- Gmail — the connector's listing in Claude's directory (sign-in required; captured by the deployer, screenshots in evidence/) — <https://claude.ai/directory/gmail-gmailmcp> (read 2026-09-16)
- MCP Reference: gmailmcp.googleapis.com (Google; page dated 2026-07-21) — <https://developers.google.com/workspace/gmail/api/reference/mcp> (read 2026-09-16)
- Configure the Gmail MCP server (Google) — <https://developers.google.com/workspace/gmail/api/guides/configure-mcp-server> (read 2026-09-16)
- Gmail API scopes (Google) — <https://developers.google.com/workspace/gmail/api/auth/scopes> (read 2026-09-16)
- The listing's More info links: Documentation, Support, Privacy Policy — <https://developers.google.com/workspace/gmail · https://developers.google.com/workspace/support · https://policies.google.com/privacy> (read 2026-09-16)


---

_This describes the deployment shape as at this date. If the risk changed, the deployment changed — not this document._ 
No score, rating, level or traffic light appears in this vault or in its data, and none will. The behaviour policy describes; it does not judge. 
Generated by `scripts/site/build-abp-vault.mjs` from `data/grant.json`, `data/mandate.json` and the pinned vocabulary; `data/mandate.json` is the only file a person writes. Licence: the published template is CC BY 4.0; a paid copy carries a commercial licence to the buyer. See LICENCE.md.

