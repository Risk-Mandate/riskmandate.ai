<!-- Generated from work-abp-power-user.html by scripts/site/generate.mjs. Edit the page, not this file. -->

# Brief B1 — power user and tester of Agent Behaviour Policies

The first task for a freelance collaborator: make Agent Behaviour Policies for real deployments, find where the model breaks, and time it. Opens with a prompt written to paste straight into an agent, plus the full reading list across riskmandate.ai, abp.sgit.ai and the rest of the estate.

Source: https://riskmandate.ai/work-abp-power-user.html

---

# Be the first power user of Agent Behaviour Policies.

We have a published model, five worked examples, and a claim that the second policy of a known deployment shape should take minutes rather than days. Nobody has tested that. Your job is to make these things for real, find out where the model breaks, and time it — because that measurement is the only honest input to pricing anything, and we are five days from a conference where we intend to sell it.

## The prompt. Paste this into your agent.

Written to be handed over whole. It orients your agent on what we are doing, what we are trying to sell and by when, and what the first task is. Everything after this section on this page is the detail behind it.

```
You are helping a freelance collaborator working with RiskMandate. Read this whole
prompt, then fetch the reading list before doing anything else.

WHO WE ARE. RiskMandate sells the insurability layer for AI agents. The argument:
an agent's grant (everything a credential technically permits) is far larger than
its mandate (what somebody actually authorised it to do), and the gap between
them is authority nobody scoped, time-boxed or signed for. We make that gap
explicit, name an owner, and turn a standing grant into an acceptance with an
expiry. We are read-only and never in the request path.

WHAT WE ARE SELLING RIGHT NOW. One artefact: an Agent Behaviour Policy (ABP).
For one agent in one deployment, it states everything it can do, what it was
authorised to do, the delta, and what actually stands in the way of each
capability. It describes and does not judge, so it carries no score — that rule
is absolute and is explained in the reading list.

The sales motion is draft and correct: we hand somebody a pre-computed draft
policy for a deployment shape resembling theirs, deliberately understated, and
they correct it. Correcting it IS stating their mandate, and the correction goes
upward — which is the moment they realise the grant is bigger than they thought.
It needs no access to anything of theirs, so it is legal and fast with a
stranger. Tiers run from GBP 10 (their own answers and the delta, as a file they
keep) to GBP 5,000-10,000 (an assessment by security professionals).

THE TWO DEADLINES THAT SHAPE EVERYTHING.
  1. Startup Summit Lisbon, 17-18 September 2026. We are exhibiting on a
     1m x 0.4m booth. The plan is to run draft-and-correct on paper with
     founders and investors, in about five minutes per conversation.
  2. Selling online, through a store that already has payment rails and
     printed codes, and a funnel that currently dead-ends before the checkout.

YOUR FIRST TASK. Be the first real power user and tester of ABPs. Concretely:
create them for deployments you actually run, work out where the model breaks,
and instrument the whole thing — time per policy, how many rows you could
measure versus derive, how many questions needed a human, which stage was
slowest. We claim the second policy of a known shape takes minutes rather than
days. Nobody has checked. Your table is the answer, and it decides whether any
of this can be priced.

SEVEN HARD RULES. These are not style preferences. Breaking any of them
produces output we cannot use:
  1. Never test somebody else's system. Read vendors' published documentation.
     Where their own pages contradict each other, publish the contradiction
     unresolved, with both sources and the date. Do not settle it by trying it.
  2. Never put a score on an ABP — no rating, traffic light or risk level,
     anywhere, including in data. The same policy is dangerous in one deployment
     and harmless in another.
  3. Never write "ADP". It is a registered mark of a major payroll processor.
     The acronym is ABP, spelled out at first use.
  4. Never say "the policy" for an ABP — in our own demo, "policy" is the
     insurance instrument. Say "the ABP" or "the behaviour policy".
  5. No conformity language: not certified, compliant, conformant, accredited.
     Nothing here is a compliance assessment.
  6. No verdict about a named third party. Publish the record — facts, dates,
     sources — never the judgement, and no adjective against anybody's name.
  7. Do not reproduce a standards body's text. Titles only. The EU regulation
     is expressly reusable; the international management standards are not.

HOW TO READ OUR MATERIAL. Every page on riskmandate.ai and abp.sgit.ai has a
markdown twin: swap .html for .md, or fetch /index.md on a directory URL. Use
those. /llms.txt on either site is the index. Read in this order:

  1. https://abp.sgit.ai/index.md            what an ABP is — the model itself
  2. https://abp.sgit.ai/model/index.md      23 capability primitives, 4 barriers, 3 undo classes
  3. https://abp.sgit.ai/examples/index.md   the five worked examples, derived not authored
  4. https://riskmandate.ai/abp.md           how we present it commercially
  5. https://riskmandate.ai/lab-connector-grants.md   the finding the first policies exist to show
  6. https://riskmandate.ai/lab-abp-flow.md   the twelve-stage flow and the interface mockups
  7. https://store.sgit.ai/offers/           what is actually for sale, and at what price
  8. https://riskmandate.ai/summit.md        the Lisbon plan

WHAT GOOD OUTPUT LOOKS LIKE. One markdown file. Dated. What you did, what you
found, what you could not answer, and the instrumentation table. Include the
things that went wrong — a brief that only produces good news has told us
nothing. If part of this brief will not survive contact with reality, say so
before doing it rather than after.

The full brief, with the deliverable format and the open questions, is at
https://riskmandate.ai/work-abp-power-user.md
```

The prompt is also the top of this page's markdown twin, so an agent that fetches [work-abp-power-user.md](work-abp-power-user.md) gets the prompt and the detail in one go.

## Ordered by what you need first, not by what we are proudest of.

Four sites, one game and one repository. Everything is public; nothing needs an account. The `.md` address is the one to hand an agent — same content, no markup.

## Five steps, and the fourth is the one we are paying for.

Steps one to three exist to get you to step four with an informed opinion. Step five is what happens if there is time.

### Read, and play the game before the docs

Do the forty questions first. It takes five minutes and it gives you the intuition the documents assume. Then read the model, then how we sell it.

- Write down, before you read the examples, how many of the 23 primitives you think your own coding agent has, and how many you asked for. Keep that number — it is the same mechanic we sell.
- Then read in the order in the list above.

### Reproduce one of the five published examples

Take the coding-agent example — confirmations on and off — and rebuild it from the published vocabulary without copying the finished document. It is the cheapest possible test of whether the model can be used by somebody who did not write it.

- Where did you have to guess? Where was the published data silent?
- Did you get the same numbers? If not, is the example wrong or is the vocabulary ambiguous?
- Time it. This is your baseline for “a policy for a shape that already exists”.

### Make three policies for things you actually run

Your own deployments, not hypotheticals — the whole point is that a real one surfaces problems an invented one hides. Good candidates: your coding agent, an assistant you have connected to a mailbox or a drive, and a CI job.

- **Elicit your own mandate first**, in writing, before you measure the grant. Notice how long that takes and how sure you are.
- **Measure the grant from documentation**, never by probing. Record the source URL and the date for every row.
- **Mark every row measured or derived.** Derived is fine and is most of it; unmarked is not.
- **Record the barrier per capability** — none, expectation, setting or boundary — and be strict: a switch your own account can flip is a setting, not a control.
- **Try the proposed `material` property** — own, organisation, third_party, mixed. Does it survive contact with a real deployment, or does it need a fifth value?
- Add a validity statement and no score. If you feel the urge to add a score, note where that urge came from — that is useful data about every buyer we will meet.

### Instrument it, and publish the table

This is the deliverable. The claim under test is that the second policy of a shape already in the library takes minutes rather than days. If it does not, the library is not doing its job and nothing should be priced until it does.

- Time per policy, split by stage: eliciting the mandate, measuring the grant, computing the delta, writing it up.
- Rows measured versus derived, per policy.
- How many questions you could not answer without a human.
- Which stage was slowest, and whether a shape library would have removed it.
- First policy of a shape versus second policy of the same shape. That ratio is the finding.

### If there is time: break it on purpose

Find the deployment the model cannot describe. We already know of one and would like more.

- **The known one:** a connector that exists and is switched off is not in the grant today and is one click from being in it. Neither the barrier model nor the label has a place for that, and it is probably the most common state in any real estate.
- What about an agent that can create other agents? A scheduled job that outlives the person who made it? A shared machine?

## One markdown file, and a table in it.

Not a deck, not a summary. The working, because the working is what we can act on. Everything below is a suggested shape rather than a form to fill in.

| Section | What goes in it |
| --- | --- |
| date, and what you read | so a reader knows what your view was based on and when |
| your pre-reading guess | the two numbers from step 1, and how wrong they turned out to be |
| the reproduction | did you get the same numbers as the published example, and where did you guess |
| the three policies | as actual ABPs, with every row marked measured or derived and sourced |
| the instrumentation table | **the point of the exercise** — times, ratios, and the first-versus-second finding |
| where the model broke | anything you could not express, with the deployment that broke it |
| what you could not answer | open questions, unresolved contradictions, things needing somebody else |
| what you would change | about the model, the flow, the brief, or this page |

Include what went wrong. A report that only contains good news has told us nothing.

The most valuable possible outcome of this brief is “the second policy took just as long as the first, and here is why” — because that would stop us pricing something that does not work yet. Finding that out costs days. Finding it out after we have sold it costs considerably more.

## What we do not know, and what we still owe you.

- **What does mandate elicitation look like for a connector?** For a coding agent the mandate is a job. For a mailbox it is closer to a relationship, and nobody has drafted those questions. If step 3 produces a usable question set, that is worth more than the table.
- **Does `material` belong in the shared vocabulary or in each policy?** It is a property of a capability _in a context_, which argues for the policy; it is identical across every policy of the same shape, which argues for the vocabulary. We lean to the vocabulary with a per-policy override and are not confident.
- **Which of the five shapes should a stranger meet first?** The work mailbox and the corporate file estate are what somebody buys; the personal mailbox and the personal drive are what somebody understands. This decides the front page.
- **Can a vault read key be revoked?** The whole “hand an underwriter a key” story depends on it and we have not checked. If you get to this before we do, tell us.
- **Rate, hours and duration.** Deliberately absent: this page is public, and those are between the two of you.
- **Start date and when the table is wanted by.** The Lisbon event is 17–18 September, which is the only fixed date on our side.
- **Who to ask when blocked**, and how fast a reply is reasonable.
- **Whether the output is published.** Our default is that it is — this whole section is public — but that is a decision to make explicitly before the work starts rather than after.
- **Repository access**, if any of the work becomes site changes rather than policies.

## Tell us the brief is wrong before you do it.

This was written by somebody who has not done the task, five days before a conference, from a model nobody has stress-tested. The most useful first message you can send is which part of it will not survive contact with reality.
