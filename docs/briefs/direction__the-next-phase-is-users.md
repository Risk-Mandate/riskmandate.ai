# Nobody buys a policy until they have made a small one, so the next phase is users

**Date:** 2026-09-21 · **Author:** @website-agent
**Trigger:** project lead's voice memo of 21 September, sent in the thread with a screenshot of the Agentics Foundation London group (*"anybody here has an agent connected to a Gmail account … I just published this set of prompts that you can use to find out the blast radius of that connector"*), about four minutes; registered as I11
**Reads against:** [abp.sgit.ai/gmail](https://abp.sgit.ai/gmail/index.html) as read 21 September 2026 — four steps, thirteen prompts, about twenty minutes; riskmandate.ai v1.27.3 (sixteen vaults, three articles, the four store levels); `direction__use-case-driven-policies-and-the-prompt-workflow.md` (D8, 15 September) which proposed the customer-run prompt as the £500 level; `direction__consequences-assets-and-the-vault-as-a-website.md` (the consequence layer as built)

> The memo arrives the day after the prompt workflow went out to a real group of strangers. It is
> not a product memo. It is the moment the work stops being about how good the artefact is and
> starts being about how many people have run it.

---

## 1. What the memo says, in its own order

1. **The MVP is done and the next phase is users.** *"I think we now have nailed at least the MVP
   of the offering."* What follows is the whole memo's premise: the building is not the problem now.
2. **The vaults are more than the first users need.** *"The vaults are crazy powerful … they
   probably are way more than what most customers need right now."* Not a criticism of the vault —
   an observation about who arrives first.
3. **So: many small examples, where a policy adds value today.** *"Find tons and tons and tons of
   smaller examples where we can write policies that add value right now. And this is where we need
   to be pragmatic."*
4. **We are introducing a concept, not selling a feature.** *"That's a unique concept that is new.
   People don't think like that. But a lot of people are looking for solutions to control agents."*
   Both halves matter: the idea is unfamiliar, and the need is already felt.
5. **A strategy, and a mapped set of work.** *"A set of tasks, activities, workflows, messaging,
   experiments … basically a sort of go-to-market activity where we focus on finding users."*
6. **The measures are user measures.** *"Our KPIs and OKRs should be all about the number of users
   that create a policy, the number of users that actually run the prompts."* Not visits, not
   downloads, not vaults published.
7. **Start from the user, and give value immediately.** *"What can we give the user that they start
   to use it straight away, that they get value from it straight away."*
8. **The ladder exists; the funnel does not.** *"We have a nice ladder now for users to become
   customers. What we need now is a bigger funnel"* — people using the core ideas, and the policies,
   for free, *"because remember that we charge for the customisation and deployment and the security
   reviews."*
9. **The prompt workflow is the shareable thing.** The Gmail pages at abp.sgit.ai are *"a good
   example of how we can now have something that I can share and that we can share and the user can
   go try this."*
10. **The loop that matters is run-and-report.** *"If we can get the user to run a prompt, and then
    provide feedback — something is wrong, the workflow is not there. So let's nail those
    workflows."* Then: more example pages, *"tons and tons of examples"*, attached to the policies
    we already have.
11. **The sales order is small-then-large.** *"Nobody's going to buy a full policy until they've
    done the smaller policy."*
12. **And the second frontier: beyond technical permissions.** The Gmail work is already *"looking
    beyond the technical permissions"*, and the memo lists what that means in a mailbox: changing
    all the labels *"you basically destroy the information architecture of a user"*; marking read
    things unread; *"if you send too many emails, generate too many drafts, move too many files
    around"*. Then the part no permission model touches at all: *"the messages that should be
    replied, the messages that should never be replied, the message that should be read, the message
    that should never be read"*. Then prompt injection, and the session rule that follows from it:
    *"I want you to read something, but because I've given Claude access to send emails, I don't
    want you to send an email in this session."*
13. **Which is a visualisation problem too.** *"Find even ways for Claude to visualise that … so we
    can define much better rules of engagement for that version or for that session."*
14. **And the test.** *"If we can get this and users get value, then we have a business."*

## 2. Where we already are

- **The artefact the memo wants exists, and it is not on this site.** abp.sgit.ai/gmail is four
  steps and thirteen prompts a person pastes into their own assistant, against their own mailbox,
  with *"nothing collected here, no account needed"*. It is honest about what it produces: *"what
  comes back is a self report, and this site counts that as a claim rather than a measurement."*
  riskmandate.ai does not link to it from anywhere.
- **The ladder is built.** Four levels at the store, a page per level after payment, the £5 pack as
  a real download with its sha256 on the page. What sits above the ladder — the free rung that
  produces a user rather than a customer — has no surface here at all.
- **The record is deep and the entry is steep.** Sixteen vaults, the reading app, the consequence
  layer, the barrier holders. A first-time reader meets an encrypted vault with a published read
  key. That is the right artefact for the third conversation and the wrong one for the first.
- **We already write the small examples without calling them that.** Every vault carries
  `MAP-A-GRANT.md`, a prompt for an agent that already holds the credential. It is buried inside a
  vault, which is to say: behind the thing it is supposed to be an on-ramp to.
- **Three articles**, each ending in *Where this connects*. They are arguments, not on-ramps. The
  reader finishes one convinced and with nothing to do.
- **The consequence layer is the right home for §1.12 and does not yet hold it.** `consequences.json`
  models `capability × asset → consequence` with six kinds. Everything the memo lists in a mailbox is
  a consequence in that sense — but the layer has no notion of *volume* (one message or two
  thousand), and no notion of an instance the mandate names (*this* label, *that* correspondent).
- **No counter exists.** There is no way to answer *how many people ran the prompts* today, and the
  memo makes that the primary measure. The site collects nothing by design, which is a constraint
  on the answer rather than an excuse for not having one.

## 3. The structure this asks for

### 3.1 A rung below the ladder, and it is free

The store's four levels are a ladder for a customer. The memo asks for the step below the bottom
one, whose output is a **user**:

| Rung | What the person does | What they get | What it costs |
|---|---|---|---|
| **Zero — run it yourself** | pastes thirteen prompts into their own assistant, twenty minutes | a grant, a mandate and a delta for their own deployment, self-reported | nothing, and nothing is collected |
| One — the pack | downloads the shape nearest theirs | the template, the files, the vocabulary | the store's first level |
| Two — the vault | holds the keys to a living copy | the reading app, the history, the licence | the store's second level |
| Three — corrected | a named professional corrects it for their deployment | the mandate argued with, not assumed | the store's third level |
| Four — signed | two sessions and a signature | somebody accountable | the store's fourth level |

**Rung zero is not a trial of rungs one to four.** It is a complete thing: at the end the person has
a document about their own agent that did not exist that morning. That it is self-report is stated
on the page rather than hidden, and it is exactly why rung three exists.

### 3.2 A small policy is not a small vault

The mistake to avoid is shipping a reduced vault. A small policy is a different object:

- **one deployment, one page, one sitting** — not a directory of derived files;
- **written by the user's own agent**, from a prompt we publish, not measured by us;
- **useful before anyone pays** — the delta is the value, and the delta is computable from a
  mandate the person types and a grant their agent reports;
- **honest about its evidence tier** — *self-reported*, which is a tier the vocabulary already has.

Everything we have built stays where it is. What is new is the doorway.

### 3.3 The second frontier: consequences in the user's own words

§1.12 is the most valuable part of the memo and the part furthest from what is built. A permission
model says *the agent may label a message*. A person cares about something else entirely:

| What the memo names | What it is, in the model | What is missing today |
|---|---|---|
| “change all the labels … destroy the information architecture” | a consequence of `label` × the mailbox's organisation | **volume.** One label on one message and a relabelling of nine thousand are the same capability and not the same event |
| marking read things unread | a consequence with no asset in our list | the mailbox's *state* as an asset, distinct from its contents |
| “send too many emails, generate too many drafts, move too many files” | `send`, `create.draft`, `move` at scale | volume again, as a property of the consequence rather than the capability |
| “messages that should never be read; messages that should never be replied to” | **a mandate over instances, not over primitives** | the mandate names capabilities from a fixed list of twenty-three. It cannot currently say *not this label*, *never this correspondent*, *not the thread from the lawyer* |
| prompt injection | the grant reached by something that is not the user | no object for *who asked* — every row assumes the deployer is the one asking |
| “I don't want you to send an email in this session” | **a mandate scoped to a session**, not to a deployment | the mandate has one scope: the deployment. The union article says why that is the whole problem |

Three of those six are the same finding: **the mandate is currently a statement about a deployment,
made in capability primitives, and people want to make statements about a session, about an
instance, and about a volume.** That is a model extension, not a page — and it is the one the memo's
last line depends on, because *"rules of engagement for this session"* is precisely a session-scoped
mandate.

Recommendation: do not extend the published vocabulary yet. Write the extension as a question to the
model site (a Lab ask), and meanwhile express all six in the layer that already exists — the
consequence layer — with `volume` and `instances` as properties of a consequence, authored per
vault, and clearly marked as this site's extension rather than the published model's. That is how
`material` and the barrier holders were handled, and it kept the vocabulary honest.

### 3.4 Where this lives on the site

**A new top-level section, *Try it*.** One page, `try-it.html`, in the menu between *Pricing* and
*Articles*, whose whole job is to get a person to run the prompts:

- what it is in one line, and what they end up with;
- the Gmail workflow, prominently, linking to abp.sgit.ai/gmail — the four steps named, the time
  stated, and *nothing is collected* said plainly;
- what it is honestly not: a self report, which the page says before the reader discovers it;
- what to do with the result: correct it, publish it, bring it to us, or nothing at all;
- **where to tell us it broke** — the feedback loop the memo calls the point;
- the shapes that have a prompt workflow, as a growing list, and the sixteen already written up.

Seven top-level entries is the cap, and this takes the seventh. The strategy itself — this brief —
belongs in `docs/` and renders on the admin console, not in the public menu; a public page whose
subject is our own funnel would be a page about us at the moment we need pages about the reader.

## 4. What to build, in order

1. **`try-it.html` and the menu entry.** The doorway, as §3.4. **Half a day.** *(Built with this
   brief — see §6.)*
2. **A prompt workflow per shape we already have.** `MAP-A-GRANT.md` exists in every vault; what is
   missing is the four-step, paste-it-in shape the Gmail pages have, per shape, published where a
   stranger can find it. Start with the three that need no connector: Claude Code CLI, GitHub
   Actions, a scheduled job. **A day per shape, less once the first is written.**
3. **A feedback path that survives a stranger.** The memo's loop is run-then-report. `feedback.html`
   exists; what is missing is a route from the workflow's last step back to us that does not need an
   account. **Half a day.**
4. **The measure.** Decide what can honestly be counted when the site collects nothing, and publish
   the number wherever it lands. A public counter of policies people say they made is a weaker
   number than a private analytics figure and a more honest one. **Needs the lead — §5.**
5. **Volume and instances on the consequence layer**, per §3.3, authored for the Gmail shape first:
   the relabelling, the mass send, the draft flood, the mailbox's state as an asset. **A day.**
6. **The session mandate.** Write up *rules of engagement for this session* as a design, against the
   union article, and ask the model site for the vocabulary. **Half a day, then it waits.**
7. **Examples, plural, continuously.** The memo says tons. The rate limit is not authoring, it is
   having a shape somebody actually runs — so each new example should come from a person who asked,
   not from a list we invented.

## 5. What needs the lead

1. **The seventh menu slot.** *Try it* takes the last one. The alternatives are demoting *Pricing*
   into *More* or grouping *Articles* and *Try it* under one heading. Recommendation: take the slot,
   and revisit when something else needs it.
2. **What we count, and where it is published.** The site collects nothing. The honest options are:
   a self-reported counter (*"I ran it"* on the page, which undercounts), the store's own numbers
   (which measure customers, not users), or nothing public and a private note. Recommendation: ask
   on the page, publish the number with its method beside it, and say it undercounts.
3. **Does a user-made policy get published?** The strongest evidence that this works is other
   people's policies. That needs a way to accept one, a licence position, and a line on what we do
   with a mailbox description somebody sends us. Nothing here assumes it.
4. **How far the free rung goes.** Today the template vaults are free to read and the store sells
   correction. If the prompt workflow gets good enough to produce most of what rung one sells, that
   is a choice to make deliberately rather than discover.
5. **The model extension in §3.3** — session scope, instance scope, volume — is proposed as a Lab
   ask rather than a change to the published vocabulary. Confirm that is the order.

## 6. What shipped with this brief

`try-it.html`, in the menu as the seventh top-level entry, pointing at the Gmail workflow and saying
what it is and is not. Nothing else in §4 is built, and the brief says so rather than implying a plan
is a delivery.
