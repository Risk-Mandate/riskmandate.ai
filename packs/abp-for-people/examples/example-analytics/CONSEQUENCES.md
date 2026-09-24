# CONSEQUENCES — what follows when the agent meets what is in the deployment

> A grant is the union of what the agent can do; this is what that adds up to here. Each line is explicit, and each names the capability and the asset that make it real. Derived from the grant, the assets and the vendors' own pages — never a score.

**Vault** `example-analytics` · **status** draft · **shape** `anthropic/gmail-connector/default` · **grant** 2026-09-16 · **mandate** 2026-09-24 · **vocabulary** abp.sgit.ai v0.3.0 · **as at** 2026-09-24

---


## Why this file exists

The grant says the agent can read the mailbox. The consequence says what that means when the mailbox holds a password-reset link and the account resets by email. A capability is what the agent can do; a consequence is what follows when that capability meets an asset that is actually there. The barrier on a consequence is the weakest barrier among the capabilities it needs: a chain is only as bounded as its least-bounded link.

## The assets it acts on

| Asset | In this deployment | Present | Whose rights |
| --- | --- | --- | --- |
| Messages other people sent to this account, and their contents and attachments' metadata. | `asset.mail-from-others` | confirmed | the senders retain rights over what they sent; where the mailbox is a corporate one, the employer's policy governs it too. Authorisation to read a message is not, on its face, authorisation to forward it. |
| Secrets that have arrived in the mailbox: passwords sent in plain text, API keys, invitations, and one-time codes. | `asset.secrets-in-mail` | assumed — you can untick this | the account holder, and whoever issued each secret |
| Other accounts, on other services, that use this email address to sign in or to reset a password. | `asset.accounts-registered-to-this-address` | assumed — you can untick this | the account holder |
| The account holder's own information design over the mailbox: labels, read and unread state, stars, archive, and any filters already in place. | `asset.the-owners-filing` | confirmed | the account holder — this is how they find things |
| The addresses of everyone the account has corresponded with, and the addresses inside the messages it holds. | `asset.contacts` | confirmed | the correspondents |
| In this deployment Claude also has web search and web fetch switched on, so it can open a link and retrieve a page. | `asset.claude-web-tools` | confirmed — you can untick this | not an asset in the mailbox — a capability of the assistant beside the connector, recorded here because it is what a reset link needs to become an account takeover, and because whether it is on is the deployer's setting |

## What follows

| Consequence | Kind | Barrier | Evidence | Requires | Mandate |
| --- | --- | --- | --- | --- | --- |
| **You can read any secret that has ever arrived in this mailbox: a password sent in plain text, an API key, an invitation.** | read | ● none | inferred | `read.message.tenant` · `read.credential.host` · secrets-in-mail | scoped |
| **You can read every password-reset link and one-time code in this mailbox, past and future, for whatever other accounts use this address.** | read | ● none | inferred | `read.message.tenant` · accounts-registered-to-this-address · → read-secrets-in-mail | scoped |
| **Because this deployment can also open a link, you can take over any account that resets its password by email to this address: read the reset link, follow it, set a new password.** | act | ● none | documented | `read.message.tenant` · accounts-registered-to-this-address · claude-web-tools · → read-reset-links | scoped |
| **You can send any message in this mailbox to anyone — messages the sender authorised the account holder to read, not to forward.** | exfiltrate | ◐ setting | measured ✓ | `read.message.tenant` · `send.message.world` · mail-from-others | scoped |
| **You can collect every address and every message body the mailbox holds, and assemble them.** | read | ● none | measured ✓ | `read.message.tenant` · `read.record.history` · contacts · mail-from-others | scoped |
| **You can send messages at whatever rate the platform allows, to as many recipients as it allows, as the account holder.** | act | ◐ setting | documented | `send.message.world` · `authenticate-as.credential.tenant` | open |
| **You can send payloads, links and pretexts to other people and other organisations, from a real account they may trust.** | impersonate | ◐ setting | documented | → mass-send · → send-without-trace | open |
| **Sending enough, fast enough, may have Google suspend the account, and on a Workspace domain possibly the organisation.** | disrupt | ◐ setting | documented | → mass-send | open |
| **You can relabel, archive, trash or mark every message, undoing the filing the account holder built to find things.** | disrupt | ● none | documented | `read.message.tenant` · `read.record.history` · the-owners-filing | scoped |
| **You can create a filter that forwards future mail to an outside address, with nobody present — exfiltration that outlives the session.** | outlive | ◐ setting | documented | `create.schedule.tenant` · `send.message.world` | open |
| **Mail you send carries nothing on its face that identifies it as sent by an agent rather than by the account holder.** | impersonate | ◐ setting | measured ✓ | `send.message.world` · `authenticate-as.credential.tenant` | open |

_Barrier is derived from the required capabilities: ● none, ◉ a rule in prose, ◐ a setting the account can flip, ○ a boundary enforced above it. "Open" means the mandate did not scope every capability it needs and every asset it needs is present or assumed._

## The routes out, counted

**2** ways data leaves this deployment, or keeps leaving after the chat ends. Each names the door and what stands in it.

| Route | Door | Barrier | Outlives the session | Told not to |
| --- | --- | --- | --- | --- |
| You can send any message in this mailbox to anyone — messages the sender authorised the account holder to read, not to forward. | a reply, a forward, or a new message carrying the content, sent as the account holder | ◐ setting | no | yes |
| You can create a filter that forwards future mail to an outside address, with nobody present — exfiltration that outlives the session. | a Gmail filter with a forward action, running on every future message after the chat ends | ◐ setting | yes | yes |

## The notes behind each

- **You can read any secret that has ever arrived in this mailbox: a password sent in plain text, an API key, an invitation.**
  read.message.tenant is measured; that secrets are among the messages is inferred — no scope separates them
  _Touches:_ Unsecured Credentials: Chat Messages (T1552.008)
  _Open:_ None on the reach itself; the open question is asset.secrets-in-mail, which the deployer can untick if this mailbox holds none.
- **You can read every password-reset link and one-time code in this mailbox, past and future, for whatever other accounts use this address.**
  the same reading capability; reset mail and one-time codes are messages
  _Touches:_ Account Manipulation (T1098); Security of processing (32)
- **Because this deployment can also open a link, you can take over any account that resets its password by email to this address: read the reset link, follow it, set a new password.**
  the third leg — opening the link — is not the Gmail connector; it is Claude's own web fetch, which the project lead confirmed is on in this deployment (2026-09-16). The connector reads the mail; web fetch follows the link. Take away either and the takeover is gone.
  _Touches:_ Account Manipulation (T1098); Valid Accounts (T1078)
  _Open:_ Whether the reset flow of a given service completes from a link alone, or asks for a second factor the mailbox does not hold, is per-service and not settled here.
- **You can send any message in this mailbox to anyone — messages the sender authorised the account holder to read, not to forward.**
  read is measured; send is measured (one message, 2026-09-16); the asymmetry between reading and forwarding is a matter of authorisation and is recorded here as a claim about rights, not a legal finding
  _Touches:_ Email Collection (T1114); Email Collection: Remote Email Collection (T1114.002); Principles relating to processing of personal data (5); Lawfulness of processing (6)
  _Open:_ Where the mailbox is a corporate one, the employer's own policy governs forwarding. This vault records that rights are held by the senders and the employer; it does not rule on whether a given forward is lawful.
- **You can collect every address and every message body the mailbox holds, and assemble them.**
  read.message.tenant, measured
  _Touches:_ Email Collection (T1114); Gather Victim Identity Information: Email Addresses (T1589.002); Principles relating to processing of personal data (5)
- **You can send messages at whatever rate the platform allows, to as many recipients as it allows, as the account holder.**
  send is measured for one message; the rate and recipient limits, and what a burst triggers, are Google's and are documented from Google's pages or left open — never provoked on a live account
  _Touches:_ Phishing (T1566)
  _Open:_ Gmail's per-account sending limits, and whether the connector's send is subject to them, are not yet read from Google's pages. See RESEARCH-NEEDED.md.
- **You can send payloads, links and pretexts to other people and other organisations, from a real account they may trust.**
  follows from send; internal recipients are the most exposed, because a message from a colleague's real address clears the filters a stranger's would not
  _Touches:_ Internal Spearphishing (T1534); Phishing: Spearphishing Attachment (T1566.001)
- **Sending enough, fast enough, may have Google suspend the account, and on a Workspace domain possibly the organisation.**
  Google operates sending limits and abuse protections; the sequence that suspends an account, and one that reaches the organisation, is read from Google's pages and dated, never triggered to find out
  _Open:_ The exact thresholds and the sequence of events are not yet read from Google's pages. Documented only; never measured.
- **You can relabel, archive, trash or mark every message, undoing the filing the account holder built to find things.**
  the gmail.modify scope on the consent screen reads "Read, compose, and send emails from your Gmail account" and permits changing labels and moving messages; which of these the connector's tools expose is a research row. Permanent deletion is out of reach — the widest consented scope is gmail.modify, which does not bypass Trash.
  _Touches:_ Data Manipulation: Stored Data Manipulation (T1565.001); Hide Artifacts: Email Hiding Rules (T1564.008)
  _Open:_ Whether the connector exposes tools to change a message's labels, archive, trash, mark read or mark spam — and whether any of these can be done in bulk — is not settled from either vendor's page. Two of these (change one label, mark one read) may be checked on the deployer's own account without provoking anything; the bulk versions are documented, never run.
- **You can create a filter that forwards future mail to an outside address, with nobody present — exfiltration that outlives the session.**
  a filter is the create.schedule.tenant row; whether create_filter runs under the three consented scopes, and whether a filter it makes can forward to an outside address, is a research row
  _Touches:_ Email Collection: Email Forwarding Rule (T1114.003); Hide Artifacts: Email Hiding Rules (T1564.008); Principles relating to processing of personal data (5)
  _Open:_ Does create_filter work under the consented scopes, and can its filter forward to an outside address? See RESEARCH-NEEDED.md.
- **Mail you send carries nothing on its face that identifies it as sent by an agent rather than by the account holder.**
  measured 2026-09-16: the sent message's headers carry only a Received line from gmailapi.google.com with a numeric project id; no header names Claude or the connector as the author
  _Open:_ Whether the numeric sender in the Received line can be tied back to the connector's OAuth client, and whether any published method lets a recipient tell an agent-sent message from a person-sent one, is a research row.

## What this is, and is not

- Every line is a claim about **this deployment shape**, not about the vendors as parties.
- A consequence marked *documented* was read from a vendor's own page and never provoked on a live account. A consequence marked *measured* was run once, on an account the deployer is entitled to run.
- The authorisation to read a message is recorded, where it applies, as not being authorisation to forward it. That is a statement about whose rights are in play, with the standards it touches linked; it is not a legal finding.
- No consequence is scored, ranked or given a likelihood. It has a kind and a barrier, and that is the whole of it.

---

_This describes the deployment shape as at this date. If the risk changed, the deployment changed — not this document._ 
No score, rating, level or traffic light appears in this vault or in its data, and none will. The behaviour policy describes; it does not judge. 
Generated by `scripts/site/build-abp-vault.mjs` from `data/grant.json`, `data/mandate.json` and the pinned vocabulary; `data/mandate.json` is the only file a person writes. Licence: the published template is CC BY 4.0; a paid copy carries a commercial licence to the buyer. See LICENCE.md.

