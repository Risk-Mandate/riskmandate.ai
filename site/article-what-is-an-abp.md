<!-- Generated from article-what-is-an-abp.html by scripts/site/generate.mjs. Edit the page, not this file. -->

# RiskMandate — what an Agent Behaviour Policy is, and why one agent needs one

Somebody will ask what your agent can do, and you need an answer they can check. Four objects — the mandate elicited, the grant measured, the delta derived, the barrier recorded — worked end to end on one real deployment, with every number traceable to the record it came from.

Source: https://riskmandate.ai/article-what-is-an-abp.html

---

# Somebody will ask what your agent can do. You need an answer they can check.

Not a list of features, not the name of a credential, and not a reassurance. A sentence with a number in it, derived from the deployment, that somebody who was not in the room can verify. That document is an **Agent Behaviour Policy**, and this is what one is.

**What this is:** an introduction. The worked example runs through it end to end, and every number in it comes from a record you can open.

**This page as markdown:** [article-what-is-an-abp.md](article-what-is-an-abp.md)

## Three answers people give, and why none of them survives contact.

Somebody senior asks what the agent you just connected can actually do. There are three answers in circulation, and each one fails a different way. A real deployment makes the failure concrete, so the one running through this article is **Claude with the Gmail connector enabled** — chosen because both vendors publish enough to check every line of it.

### “It drafts replies and summarises threads.”

The product description. In this deployment the connector's own tile says “Draft replies, summarize threads, & search your inbox” — and the same listing names `forward`, `create_filter`, `mark_message_spam` and `delete_label` among its tools. Both were read on 16 September 2026, on the same page.

### “It has read access to the mailbox.”

The name of the credential. The consent screen for this deployment carried three lines, and the third was “Read, compose and send emails from your Gmail account.” Read access was one of the three things granted, not the extent of them.

### “It only does what we tell it.”

The reassurance. It describes the mandate, which nobody disputes, and says nothing about the grant. What an agent is asked to do and what it is able to do are different objects, and only one of them was measured.

None of the three is a lie. They are answers to a question nobody asked precisely.

“What can it do” and “what did we ask it to do” have different answers, and the useful number is the distance between them. Writing that distance down, for one agent in one deployment, is the whole idea.

## Four objects, and a verb attached to each.

The verbs are the discipline. A questionnaire produces claims; these four produce a record, because each one has a stated way of being obtained and the last two are not written by a person at all.

| Object | What it is | How it is obtained | Who can argue with it |
| --- | --- | --- | --- |
| The mandate | what the agent is authorised and expected to do | **Elicited** — in minutes, because you already know it | you, and you should: it is the one part you own |
| The grant | everything the agent can do | **Measured** — from the deployment, the account and the credential, or read from the vendor's own published pages and dated | anybody, by checking the source on the row |
| The delta | excess where it can and you did not ask; shortfall where you asked and it cannot | **Derived** — recomputed whenever either input moves, stored with both versions pinned, never edited | nobody. Change an input and recompute |
| The barrier | what stands between the agent and each capability | **Recorded** per row, one of four kinds, with who holds it | anybody, by naming what enforces it |

“Your agent can do 340 things” is a shrug. “Your agent can do 340 things and you authorised 12” is a finding.

- **The delta is the only judgment in the document**, and it is derived rather than given. That is deliberate: a number somebody computed from two inputs you can both see is harder to argue away than an opinion, and easier to act on.
- **The mandate is usually wrong upward.** When a draft is put in front of the person who deployed the agent, the correction almost always removes things: they authorised less than the draft assumed. That correction is the point of handing it over.

## Twenty-three primitives, or nothing compares to anything.

If every policy invents its own words, no two can be read side by side and no row can be counted. So a capability is written as `verb.object.reach`, drawn from a fixed, published list of twenty-three. A new mailbox, a new path or a new repository is an instance of an existing primitive, never a new one.

| A row | Reads as | Reach, in this deployment |
| --- | --- | --- |
| `read.message.tenant` | read messages, across the account | **tenant** — the one Google account the consent was given for |
| `send.message.world` | send messages to anyone | **world** — anyone it replies to or forwards to |
| `read.credential.host` | read stored credentials | **host** — here, the mailbox itself, where reset links and one-time codes arrive |
| `create.schedule.tenant` | create something that runs without the agent present | **tenant** — a filter is a standing rule on every future message |

## Four kinds of barrier, and only one of them is a control.

Every capability in the grant carries what stands between the agent and it. There are four kinds, and three of them bound nothing — which is not an opinion but a consequence of what each one is.

|  | Barrier | What stands in the way | Is it a control |
| --- | --- | --- | --- |
| ● | none | nothing in the way | no |
| ◉ | expectation | a rule in prose, enforced by nobody | no |
| ◐ | setting | a switch the agent's own account can flip | no |
| ○ | boundary | enforced above the grant, out of the agent's reach | **yes** |

A control bounds a grant only if it is enforced by something the grant does not include.

Read the third and fourth rows together and the test falls out of them. A setting the agent's own account can change is not a control, because the grant includes the ability to remove the bound. A boundary enforced above it is one, because it does not.

- **Every prohibition carries its barrier.** A line that says _the agent must not send mail_, printed without what enforces it, is a claim the document cannot support. Shown beside _◉ expectation — a rule in prose_, it is honest, and for most deployments today that is the honest answer.
- **Each barrier also says who holds it** — and that turned out to matter as much as the kind. Who holds it, what it rests on, whether it can move without you, whether you would be told, whether you can check, what would remove it, and what the credential would still allow if it went. Seven facts, each with a source. [The first article in this series](article-approval-prompts.html) is one barrier taken apart that way.
- **None of the seven is a grade.** A control is never called strong, weak or credible here, for the same reason nothing else is scored — see below. It is described precisely enough that the reader can judge it for their own deployment.

## One deployment, all the way through.

Claude with the Gmail connector, as read from both vendors' published pages on 16 September 2026 and then exercised on an account the deployer runs. The mandate used here is the narrow one most people describe when asked: _read my inbox and tell me what is in it_.

| Capability | Barrier | In the mandate | How it is known |
| --- | --- | --- | --- |
| `read.message.tenant` | ○ boundary — the consented scope | **wanted** | measured |
| `send.message.world` | ◐ setting — an approval prompt, removable in one click | not asked for | measured |
| `authenticate-as.credential.tenant` | ○ boundary — the credential is issued for one account | not asked for | measured |
| `create.schedule.tenant` | ◐ setting — the same approval prompt | not asked for | documented |
| `read.credential.host` | ● none | not asked for | inferred |
| `read.record.history` | ● none | not asked for | measured |

capabilities the deployment reaches, four of them measured on the deployer's own account rather than read from a page

the one thing that was actually asked for

in the grant and not asked for — none of it refused, because nobody thought to refuse it

excess with no boundary in the way. **The only number anybody can move**

- **Four is the number that matters, and it is the only one a control changes.** Buying a tool, writing a rule or briefing the agent does not move it. Turning a setting into a boundary — unticking a scope, moving a switch above the account — does, and nothing else does.
- **The record says what it does not know.** Six open questions, listed with how each would be settled. Five places where the two vendors' own pages contradict each other, published unresolved rather than picked between — because settling them would mean testing somebody else's system, which is out of bounds.
- **And four things it cannot do, each naming what withholds it.** Permanent deletion of mail is blocked by Google's scope ceiling, which moves only if somebody consents to a wider credential on a screen they are shown. Attachment content is blocked by the client not shipping a tool for it — while the credential authorises the bytes. Both were once filed as “not reachable”; only one of them is the kind of thing you can rely on.

## A behaviour policy cannot be dangerous. A deployment can.

The most permissive grant imaginable, running where there are no assets and nothing reachable, is a low risk. The same grant with a production mailbox attached tomorrow is a high one — and nothing about the document changed in between.

- **So there is no rating anywhere**, including in the data. No traffic light, no risk level, no maturity band. A score would need the assets and the consequences, and the description of a grant has neither.
- **Every policy carries a validity statement instead.** _This describes the deployment shape as at this date. If the risk changed, the deployment changed — not this document._ It names what would void it: a product release, a setting, a connector enabled, a barrier moving.
- **A description with a visible clock can be re-read and re-sold. A verdict cannot.** A grant rots on a known clock — the product's releases and the deployment's changes. A verdict rots on an unknown one, and nobody can tell when.
- **The scoring happens one floor up.** An [Insurability Index](insurance.html) knows the assets, so it can score; the behaviour policy does not, so it does not. That is not a product preference, it is where the information is.

## Four things people reasonably expect it to be.

### Not a risk assessment

It has no assets in it and no consequences. It is the input to one — and the part that is missing from most of them.

### Not a certification

Nothing here says compliant, conformant, accredited or aligned. It is a description, issued by whoever wrote it, with its sources on every row.

### Not a guardrail

It enforces nothing. It says, per row, what does — and for most rows today the honest answer is _nothing_.

### Not a test of anybody's product

Rows come from the vendor's own published pages, quoted and dated, or from a system we are entitled to run. Nothing is probed on somebody else's system, and no named company is given a verdict.

## Three ways, and the first one is free.

### Sixteen are published

One per deployment shape — connectors, coding agents, MCP servers, a scheduled job, a CI runner. Each is an encrypted vault whose read key is printed on the page on purpose, so anybody can open it and check every number against the bytes it came from.

### Ask the agent to do it

Every vault carries `MAP-A-GRANT.md`, a prompt for an agent that already holds the credential: map what you can reach, in the twenty-three primitives, and draft the first policy. What it reports is self-report until a log outside it agrees — and it is a better starting point than a blank page.

### For your deployment

The templates describe a shape; your deployment has a mandate, an owner and an interval. Four levels, from the pack as a download to a named professional's signature on a corrected copy.

And then the document has somewhere to go.

A [Licence to Operate](licence-to-operate.html) turns the description into something signed: the organisation is the authority, the behaviour policy is the instrument, the agent is the licensee, for an interval, with every condition printed beside what enforces it. Above that sits insurance, which needs both. We are on the first step, and we say so.

**The worked example.** Claude with the Gmail connector: Anthropic's [Use Google Workspace connectors](https://support.claude.com/en/articles/10166901-use-google-workspace-connectors) and Google's [Gmail API scopes](https://developers.google.com/workspace/gmail/api/auth/scopes), both read 16 September 2026; the connector's directory listing and Google's consent screens as captured by the deployer the same day; four of the six rows exercised on an account the deployer runs. The record, the evidence and the contradictions are in [that shape's behaviour policy](abp-vault-claude-gmail-connector.html).** The model.** The twenty-three primitives, the four barriers, the undo classes and the evidence tiers are published as a versioned vocabulary and pinned into every vault, so a policy written today can still be read against the one it was computed with.

## Where to go from here.

The model, then two arguments built on it, then the record itself — and the places all of it is published.

One barrier taken apart: what an approval prompt asks, what it cannot tell you, and where the accountability ends up.

What a session actually holds: every scope ever consented and every approval ever clicked, in each vendor’s own documented words.

One behaviour policy per deployment shape, each an encrypted vault whose read key is printed on purpose so anybody can check the numbers.

Where this is going. Eight dated answers, oldest first, and why every one of them needed a description of what the program does where it runs.

The twenty-three primitives, the four barriers, the undo classes and the evidence tiers — versioned, and pinned into every vault.

What arrives at each level, from the pack as a download to a named professional’s signature on a copy corrected for your deployment.

## The gap is already there. The document is the only new thing.

Pick the agent you would least like to explain to an auditor, and write down four things about it: what it can do, what you asked it to do, the distance between them, and what actually stands in the way of each row. Sixteen worked examples are published with their keys, and one of them is probably close to yours.
