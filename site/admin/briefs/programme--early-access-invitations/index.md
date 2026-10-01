# The early-access programme: the invitation, the replies, and how the first batch goes out

> Rendered from docs/programme/early-access-invitations.md in the repository. The text below is that file.
> Source: https://riskmandate.ai/admin/briefs/programme--early-access-invitations/ · noindex · written by scripts/site/build-admin.mjs

**Date:** 30 September 2026 · **Author:** @website-agent · **For:** the lead, and the mailbox and inbox
roles on `agent@riskmandate.ai` · **Status:** ready to run once the lead drops the list in

The programme itself is described in `docs/briefs/programme__early-access-and-the-first-batch.md`
and on the site at `/early-access.html`. This file is the operational half: the words that go out,
the columns the list needs, and who does what, in the six-roles setup described in
[Six agents, one inbox](https://sgit.ai/articles/six-agents-one-inbox.html) (sgit.ai, 29 September).

## 1. The list

One CSV, held by the lead, never committed to this repository and never put in a vault that has a
public read key. Columns:

| column | required | used for |
|---|---|---|
| `email` | yes | the To |
| `first_name` | yes | the greeting |
| `organisation` | no | the one line that says why them |
| `agent` | no | the agent they run or are about to, in their words (a Gmail connector, Claude Code, an n8n workflow…). Names the shape we start their vault from |
| `context` | no | one sentence the lead writes: where you met, what they said, what they asked. Goes into the invitation as the second sentence, so no two invitations are the same |
| `invite_code` | yes | `EA-` + four characters, one per person, made by the lead. Typed into the form; it is how a registration is matched to an invitation |
| `sent`, `replied`, `registered`, `vault` | filled in as it happens | the register |

Twenty is a batch. The measure is registrations and, after that, people who run the prompts and
correct a mandate: the programme's OKR is the user memo's (21 September), not the send count.

## 2. The invitation

Subject: **An early look at a behaviour policy for the agent you run**

> Hi {first_name},
>
> {context}
>
> I am opening an early-access programme for a small group of people who already run an agent
> with real access: a mailbox, a code host, a workflow tool, a CRM. It is invite only, and this is
> the invitation.
>
> What you get: an Agent Behaviour Policy for one agent you run, written for you rather than as
> an example — everything it can reach, what you authorised, the gap, and what stands in the way of
> each thing — delivered as an encrypted vault you hold the keys to, with the reading app inside.
> You correct it; that is the point. And a direct line to me and to the agent that keeps the site.
>
> What I ask: run it against the agent you actually have, tell me where it is wrong, and tell me
> what you would do with it. Twenty minutes to run the prompts, and whatever you can spare after.
> Nothing is collected by the site, and nothing you send is read by anyone but us.
>
> If you want in, register here with the code {invite_code}: https://riskmandate.ai/early-access.html
> The examples the programme starts from are public: https://riskmandate.ai/agent-behaviour-policy.html
>
> Dinis

Send from `agent@riskmandate.ai`, signed by the lead's name, with the lead in reply-to if the
account's rules allow it; otherwise replies land in the same mailbox, which the reader files.

## 3. The reply when they register

Sent by the inbox role, from a draft the mailbox role prepares, within a working day of the
registration arriving (the form lands in the comms vault's `site` lane; the drain files it):

Subject: **You are in — what happens next**

> Hi {first_name},
>
> Thank you. You are on the early-access programme, code {invite_code}.
>
> Here is what happens now. Within five working days you get a link to a vault made for
> {organisation}: a behaviour policy for {agent}, drafted from what you told us and from your own
> public pages, dated. The key comes in a separate message, never on a page.
>
> When it arrives: open it, read the mandate first, and tell us what is wrong. A reply to this
> email is enough. If you would rather show us than write it, say so and we will find half an hour.
>
> Two things it is not: it is not a security assessment, and it is not a promise about your
> agent's behaviour. It is a description you can argue with, and the arguing is the product.
>
> Dinis

## 4. The reminder, once, after ten days

Subject: **Still open, if you want it**

> Hi {first_name},
>
> The early-access place is still yours if you want it; the code is {invite_code} and the form is
> https://riskmandate.ai/early-access.html. If not, no reply needed and I will not ask again.
>
> Dinis

## 5. Who does what

| step | role | what |
|---|---|---|
| 1 | the lead | puts the CSV where the mailbox role can read it (the lead's own drive, or the collab vault); says "go" |
| 2 | the mailbox role (Cowork) | one draft per row from §2, the placeholders filled, nothing else changed; labels them `early-access/invitation`; reports the count |
| 3 | the lead | reads two or three drafts; says "send" |
| 4 | the inbox role (Cowork) | sends the drafts, in batches of twenty, and marks `sent` in the register |
| 5 | the reader (scheduled) | files replies under `early-access/`; tags a registration that came by email rather than by the form |
| 6 | the site agent (Claude Code) | drains the `site` lane each session; a registration becomes a record in the CRM role's list and a person vault is started with the people pack (`packs/dist/abp-for-people-pack.zip`) |
| 7 | the mailbox and inbox roles | the reply in §3, then the key by a separate message once the vault exists |
| 8 | the lead | the reminder in §4, once, or not |

## 6. What is not automated, on purpose

No agent sends a message a person has not seen as a draft. No agent decides who is on the list.
The invite code is not a secret and is not checked by the form; it is a label that lets a
registration be matched to an invitation and a stray registration be noticed. The mailbox's
outbound delivery restriction (the Workspace admin rule from the six-roles article) bounds what a
wrong send can reach.
