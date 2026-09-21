<!-- Generated from article-union-of-every-session.html by scripts/site/generate.mjs. Edit the page, not this file. -->

# RiskMandate — in this session, the agent holds the union of everything it has ever been allowed to do

A conversation is not an authorisation boundary. Every session an agent runs carries the union of every scope ever consented and every approval ever clicked — in each vendor's own documented words. What that union is made of, what the help page will not tell you about it, and the one lever a deployer still has.

Source: https://riskmandate.ai/article-union-of-every-session.html

---

# In this session, the agent holds the union of everything it has ever been allowed to do.

Open a new chat, ask it to read your inbox, and nothing in that sentence authorises sending mail, changing labels or creating a filter. The session does anyway. **A session that only reads still holds everything you ever allowed** — because a conversation is not an authorisation boundary, and there is no screen anywhere that shows a person the union they are running with.

**Shape:** Claude with the Gmail connector, the deployment described in [that shape's behaviour policy](abp-vault-claude-gmail-connector.html).

**Sources:** Google's OAuth 2.0 documentation and Anthropic's connector help article, both read 20 September 2026, quoted rather than paraphrased. Nothing was tested on anybody else's system.

**This page as markdown:** [article-union-of-every-session.md](article-union-of-every-session.md)

## Two sentences, two very different grants.

In March you asked the agent to send an apology to a client, and approved it. In June you had it file a month of receipts, and approved that. In July you let it set up a filter. Each approval was reasonable, each was for one task, and each was given in its own conversation.

Today you type _read my inbox and tell me what is in it_. That sentence asks for one capability. The session it runs in carries all four.

_Reading needs no approval prompt in this shape, so it is present from the consent. Each later approval is added by a conversation that had a reason for it, and none of them is ever taken away. The bottom band is the ceiling all four sit under: it was agreed in one click, months before the first of these conversations._

A conversation is not an authorisation boundary. It only looks like one.

Everything about the interface suggests a fresh start — a new chat, an empty history, a new request. Underneath, the credential and the approval state are the same ones as last time, and neither has a way to be less than it was.

## Three layers, and each one accumulates.

None of this is hidden. It is the documented behaviour of two ordinary systems, which is why it is worth writing down rather than discovering.

### Scopes add up, by design

Google's authorisation server is built to accumulate. Its own documentation: a new authorisation “returns an authorization code that may be exchanged for a token containing **all scopes the user has granted the project**”, and with incremental authorisation “the new access token will also cover any scopes to which the user **previously granted** the application access”.

The grant is per account and per application, not per task. There is no smaller token to fall back to for a session that needs less.

### Approvals are per tool, not per session

The approval prompt offers _Always allow_ beside _Allow once_. Press it for one tool, in one conversation, for one reason, and the question stops being asked. Three prompts of that shape are in this deployment's record — send, trash, labels — each identical, each with the same button.

Whether that state is bounded by the conversation is **not stated** on the vendor's help page. See the table below.

### One connector, one account

The directory listing shows a single Gmail connector with a single _Connect to Claude_ button, captured 16 September 2026. A narrower second connection — the same mailbox, read-only, for the sessions that only read — is something neither vendor's page describes.

It may be possible; it is not documented. That is an open question below rather than a claim here.

Google, [Using OAuth 2.0 for Web Server Applications](https://developers.google.com/identity/protocols/oauth2/web-server), read 20 September 2026. Whether this particular connector uses incremental authorisation is not published by either vendor; what is published is that the authorisation server is designed to accumulate, and that a grant belongs to an account-and-application pair rather than to a task.

## Six questions a deployer would ask. Two are answered.

Read from Anthropic's Google Workspace connector help article on 20 September 2026. The silences are not an accusation — a vendor is entitled to document what it chooses. They are recorded because a deployer cannot find the answers, and the answers decide how far a single click reaches.

| The question | What the page says |
| --- | --- |
| Can I turn a connector off? | **Answered.** “Toggle individual connectors on or off.” |
| Can I turn off a single tool? | **Answered.** “Individual users can also disable specific tools from the chat interface.” A real control surface, and a manual one — nothing turns a tool off because this session does not need it. |
| Does _Always allow_ last beyond this conversation? | **Silent.** The page says approval is asked “before each of these actions” and that the asking can stop; it does not say for how long, or where the state lives. |
| Can an approval be scoped to one chat or one project? | **Silent.** |
| Can I connect a second account, or the same account with fewer permissions? | **Silent.** |
| Which scopes are requested, and can I choose a subset? | **Silent on the scopes** — it says only that “Google's OAuth screen mentions email sending permissions”. Google's screen itself offers three tick boxes, each of which can be unticked. |

## “Then don't press Always allow.”

It is the right instinct and it does not survive the mechanics, which [the first article in this series](article-approval-prompts.html) takes apart in detail.

- **The prompt is per action, and the point of the agent is to act.** An assistant asked to triage a morning's mail takes many actions. Every one is a modal in front of the person who asked for the triage, at the moment they are least inclined to read it.
- **The off switch is one click, on the same screen, one key from the default.** It is offered to the account it exists to protect, at the point of maximum friction.
- **We have no measurement of how often it is pressed**, and neither does anybody else — neither vendor publishes a figure. What can be said without a number is that the design places a permanent decision inside a momentary one, and that nothing on any later screen shows it was taken.
- **Even pressing it once is not the failure.** One approval, for one task, in one conversation, is a reasonable act. The accumulation is what nobody agreed to: four reasonable decisions, months apart, add up to a standing capability nobody ever described.

## Standing privilege, arriving somewhere with no tooling for it.

What the agent needs to do its job over a year, and what it needs for the next ten minutes, are different sets. Keeping the first available at all times, because the second cannot be expressed, is the oldest failure mode in access management — and the discipline that grew up around it has names for every part of the answer: roles, least privilege, just-in-time elevation, session scoping, expiry, review.

None of that tooling has arrived here. What a deployer has today, for an agent sitting on a mailbox, is:

- **One grant per account and application**, which a session cannot narrow.
- **One approval state per tool**, with no stated lifetime.
- **No expiry.** An approval given in March for one message is still in force in September, and no screen says when it was given.
- **No record.** Nothing shows which approvals exist, who granted them, or when — so nothing can be reviewed, and nobody can be asked to re-justify one.
- **Two manual controls** — the connector toggle and the per-tool toggle — both of which depend on somebody remembering, before every session, what that session ought not to be able to do.

The union is not a bug in anybody's product. It is what you get when authorisation is granted per application and work is done per task.

Everything above follows from that mismatch. It is worth stating plainly because it is invisible from inside the session — there is no screen anywhere that shows a person the union they are now running with.

## One grant, more than one mandate.

A behaviour policy measures the grant once, and the grant it measures _is_ the union — that is what measuring means. The lever a deployer still has is the other object: the mandate is written per purpose, and the delta is recomputed against each one.

| The mandate you write | Against the same six-capability grant |
| --- | --- |
| “Read my inbox and tell me what is in it” | one capability wanted, five in the grant and not asked for, four of them with nothing in the way |
| “Draft replies for me to send myself” | drafting is wanted; sending is not — and sending is a setting, removable in one click, so the refusal is a sentence rather than a bound |
| “Triage and file, never send” | labelling is wanted; the send tools are still present, still approved from a previous conversation, still in the grant |

- **This is why the vault for this shape carries several scenarios rather than one mandate.** Each is an alternative statement of what the agent is for, and each produces its own delta against the same measured grant. The grant never changes; what you asked for does.
- **Writing the mandate per purpose does not narrow the credential.** It makes the distance visible, per purpose — which is the only honest thing a document can do when the credential has no per-session setting to offer.
- **And it makes the ask concrete.** “We would like a narrower connection for read-only sessions” is a sentence a vendor can act on. “We are worried about permissions” is not.

## Three changes, in the vocabulary this site uses.

### A second, narrower credential

A read-only connection to the same mailbox, used by the sessions that only read. Google's `gmail.readonly` grants no send, so the bound is enforced by somebody the grant does not include — which is the difference between a control and a preference. [That shape is written up too.](abp-vault-gmail-readonly.html) Whether a client can hold two connections to one provider is the open question below.

### Approval state with a scope

Per project, or per conversation, or per hour. Still a setting by our test — the account can still grant it — but a setting whose blast radius ends somewhere, and which a session cannot inherit silently from a conversation three months ago.

### An approval with a date on it

A list of what has been allowed, when, and by whom, that a person can open and revoke from. It bounds nothing on its own — but nothing can be reviewed that cannot be seen, and today the only evidence that _Always allow_ was pressed is that the prompt stopped appearing.

## Four open questions, and how each would be settled.

Each is answerable from a vendor's own pages or from a system we are entitled to run. None is answerable by probing somebody else's, so none of them is answered here.

| Question | How it gets settled |
| --- | --- |
| Can one client hold two connections to the same provider, with different scopes? | The vendor's documentation of the connector model, quoted; or attempting a second connection on an account we run, and recording what the interface does. |
| Does the approval state live in the conversation, the account, or the workspace? | The vendor's own documentation. Failing that, approving in one conversation and observing the next, on an account we run. |
| Does this connector use incremental authorisation, so that consenting again widens the existing token? | Google's third-party access page for the account, which lists the scopes the application currently holds, read before and after. |
| Does unticking a scope at consent time actually narrow what the connector can do, or does the connector refuse to connect? | Connecting with one line unticked, on an account we run, and recording what happens. |

**Sources.** Google, [Using OAuth 2.0 for Web Server Applications](https://developers.google.com/identity/protocols/oauth2/web-server) and [Gmail API scopes](https://developers.google.com/workspace/gmail/api/auth/scopes), read 20 September 2026. Anthropic, [Use Google Workspace connectors](https://support.claude.com/en/articles/10166901-use-google-workspace-connectors), read 20 September 2026. The connector's directory listing, the consent screens and the approval prompts: captured by the deployer on an account they run, 16 and 19 September 2026, transcribed in the evidence record inside the vault for this shape.** What was not done.** No account but the deployer's own was touched, nothing was probed on anybody else's system, and where a page is silent this article says it is silent rather than filling the gap. No claim here is a verdict on a named company.

## The pieces this one rests on.

Every article here is built on a record you can open, and on a model published somewhere you can check it. These are the ones behind this argument.

The button that makes the union permanent, taken apart: seven things the screen cannot tell you, and who holds the barrier it offers.

The four objects — mandate elicited, grant measured, delta derived, barrier recorded — and the enforcer test this article leans on throughout.

The record: six capabilities with their barriers and holders, the blocked list, the contradictions, and the scenarios that give one grant more than one mandate.

The narrower credential as its own shape. What a session that only reads would hold if the credential said so — a boundary rather than a preference.

The transitive closure of a grant, and the two hopes every broad credential carries: that the agent will not misuse what it holds, and will not find more.

The vocabulary every policy on this site is computed against, versioned and pinned, so a barrier means the same thing in two documents.

## What is your agent still allowed to do, from a task you finished in March?

Nobody can answer that from inside the session, which is the finding. What can be written down is the grant, the mandate for what you actually want this agent for, and the distance between the two — per purpose, with what stands in the way of each row.
