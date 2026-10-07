# One rule a stranger can paste is the way in, and a page per rule is how the path gets mended

> Rendered from docs/briefs/direction__one-rule-a-stranger-can-paste-is-the-way-in.md in the repository. The text below is that file.
> Source: https://riskmandate.ai/admin/briefs/direction__one-rule-a-stranger-can-paste-is-the-way-in/ · noindex · written by scripts/site/build-admin.mjs

**Date:** 2026-10-07 · **Author:** @website-agent
**Trigger:** project lead's voice memo of 7 October, on customer onboarding (Otter transcript, about four minutes): *"we made it super easy to buy but we're not selling … what we need to do is take a step back and keep simplifying it"*
**Reads against:** riskmandate.ai v1.36.2 (the new home page, sixteen vaults, the four levels, `try-it.html`, the early-access and early-adopters programmes, the team page); `direction__the-next-phase-is-users.md` (21 September, the go-to-market direction this memo sharpens); the vocabulary pinned in every vault (23 capabilities, four barrier kinds); the grant rows of `claude-code-web`, `claude-code-cli`, `claude-desktop`, `claude-web-connectors` as published today

> The memo of 21 September said the next phase is users and asked for many small examples. This one
> says what the small example is: one question, one line, one before and after. It is the first time
> the unit of the funnel has been named.

---

## 1. What the memo says, in its own order

1. **The path is the problem.** From *"not a user, unknown, to intrigue, to trying it out, to liking
   it, to needing this across the board, and then to becoming a customer"*. Six stages, named.
2. **The data says it is broken, and buying is not the bottleneck.** *"We make it super easy to buy,
   super easy to connect, super easy even from a price point of view … we're not having enough people
   using it and describing it and talking about it and loving it to generate the sales."* The lead
   holds the numbers; the brief does not quote one.
3. **So simplify again.** *"Take a step back and keep simplifying it, making it super easy."*
4. **The hypothesis is about the users who engage.** The ones who say *"wow, this is really good, how
   can I make it work, how can I take it to the next level"*. The few who tried it *"really love it"*.
5. **It works in production, on our own agents.** *"I have evidence of running this in production
   … in our own agentic workflows … it's already allowing me to have confidence … and it's also
   already found a bunch of gaps"*, some of them *"things you can't protect by any policy unless you
   put extra technology in place"*.
6. **The pages.** *"A whole bunch of pages"* with one message: *do you want your agent to do this? If
   not, here is a policy for you* — the line to add to Claude, a quick explanation, and two forms:
   *"the one line that you can add, or the paragraph"*, tried *"before and after"*.
7. **Test-driven by people we already have.** *"We already have a number of users … that can test
   drive this and can validate it."* And it must have *"immediate value"*.
8. **The first examples.** Every Claude session reaching *"the memory and the secrets that you have
   in other sessions"*; knowing *"about the other sessions"*; creating and editing schedules
   *"independently"*; using *"your connectors"*.
9. **Dozens, then hundreds, as a rule base.** *"Like when you have static analysis rules … specific
   rules or specific guidance. It's like a mini skill"*, version-controlled and mapped.
10. **Vaults later.** *"Eventually, yes, we will deliver these as vaults, but we're not there yet."*
11. **Two kinds of rule.** *"Things that require no prompts"* and *"things that require authorisation,
    which have an extra level of security"*.

## 2. Where we already are

The pieces exist; the doorway is still too big for the first step.

- **The first step today is twenty minutes.** `try-it.html` leads to the Gmail workflow: four steps,
  thirteen prompts, about twenty minutes. That is the right second step and a long first one. The
  per-shape workflows `T13` asked for are not built.
- **The vaults answer a question nobody has asked yet.** Sixteen of them, a reading app, keys. The
  21 September memo already said they are *"way more than what most customers need right now"*.
- **Every rule the memo wants is already a row.** The rows are in the published grants; what is
  missing is a page that asks the reader about one of them:

| the memo's example | the capability | where it is a row today, and its barrier |
|---|---|---|
| other sessions' memory, and what was said in them | `read.record.history` | `claude-code-web` (none: the harness's own earlier outputs), `claude-code-cli` (none: shell history and the harness's transcripts), `claude-desktop` (none) |
| the secrets other sessions hold | `read.credential.host` | `claude-code-web` (none: the session's own), `claude-code-cli` (none), `claude-desktop` (none) |
| creating and editing schedules on its own | `create.schedule.tenant`, `create.schedule.host` | `claude-code-web` (setting; and boundary for the container's cron), `claude-code-cli` (none: a crontab as you) |
| using your connectors | `authenticate-as.credential.tenant` via connectors | `claude-web-connectors` (boundary: as scoped), `claude-desktop` (none) |

  A product's *memory* feature, as the vendor names it, is not a row in any vault yet; it has to be
  read off the vendor's pages and dated before a rule names it (§3.4).
- **The production evidence is published.** The team page carries the behaviour policies of the two
  agents that make this site: the publisher has three unbounded rows of four excess, the studio two
  of two. Those are the memo's *gaps*, found on our own agents, in public.
- **The ladder and the free step are built.** Four levels at the store; early access with level 3 at
  no cost; the early-adopters offer. The memo is not about any of those. It is about the person who
  has not yet met the idea.

## 3. The structure this asks for

### 3.1 The path, stage by stage, and what serves each

| stage | what the person thinks | what serves it | exists? |
|---|---|---|---|
| unknown | nothing | a rule page found by its question, shared in a thread | no |
| intrigue | *wait, can it do that?* | the question and the row behind it, in one screen | no |
| trying it | *let me add the line* | the one line and the paragraph, copy buttons, thirty seconds | no |
| liking it | *it changed what my agent did* | the before and after, run on our own deployment, dated | no |
| across the board | *I want this for all of it* | the rule set for one shape, and the line *a rule is one row; the ABP is every row for your agent* | partly: the sixteen vaults |
| customer | *correct it for us* | the four levels, level 3 free through early access | yes |

The first four stages are the gap. Everything built so far starts at the fifth.

### 3.2 The unit: a rule

One rule is one row of a mandate, made pasteable. Its fields:

- **id and version**, like a static-analysis rule: `RM-R0001`, version `1.0.0`, a changelog.
- **the question**, in the reader's words: *Do you want Claude to create schedules on its own?*
- **the capability**, from the pinned vocabulary, and **the shapes** where it is a row today.
- **the answer the rule writes**: *never*, or *ask me first* (§3.3).
- **the line**: one sentence for `CLAUDE.md` or the project instructions.
- **the paragraph**: the same rule with its reason and its exceptions, for people who want the agent
  to understand rather than obey.
- **the barrier the line is**: an *expectation*, said on the page every time. A line the agent reads
  is a request to the agent; it is not a control.
- **the stronger barriers**, where they exist: a setting the vendor documents, quoted and dated; a
  boundary somewhere outside the agent. And where none exists, the page says so. That is the memo's
  *"you can't protect by any policy unless you put extra technology in place"*, written down.
- **the before and after**: the same request to the same agent, without the line and with it, run on
  our own deployment, dated, the model named, the transcripts excerpted. One run each, said as one run.
- **the status**: *drafted*, *run on our own deployment*, *tried by a user*.

The rule base is one JSON file per rule in the repository, version-controlled, built into pages by a
generator with a `--check`, like the stories. Vaults come later, as the memo says.

### 3.3 Two kinds of rule, and what each is in the model

The memo's split, *no prompt* against *needs authorisation*, is two answers to the same question:

- **Never.** The agent does not do it and does not ask. In the mandate, a `do_not_want` row.
- **Ask me first.** The agent may, after a person says yes. The published grammar has no word for this:
  a mandate has `want`, `do_not_want` and `unstated`. Mark it as this site's extension, the way
  `material` and the barrier holders were, and ask the model site for it in Lab 03.

And the honest second axis: who holds the *ask first*. If the agent's own line holds it, it is an
expectation. If the harness's approval prompt holds it, it is a setting, with everything the
approval-prompt story says about prompts people click through. If a gateway holds it, it is a boundary.
Every rule page says which.

### 3.4 What a rule page may and may not claim

- **The before and after are run only on our own deployment.** Never on somebody else's system.
- **A vendor's setting is quoted from the vendor's page with the date it was read.** Where the vendor's
  pages disagree, the page says so, unresolved.
- **No verdict on the product.** *Claude can create schedules* is a fact with a source; *Claude is
  risky* is not something a rule page says.
- **No score.** A rule has no severity rating, no colour, no level. It has a capability, a barrier
  and an undo class, from the vocabulary.
- **The ABP, never the policy alone.** The memo's *"here is a policy for you"* becomes *here is a rule
  for you*, and the page closes with *a rule is one row; the ABP is every row, for your agent*.

### 3.5 Where it lives on the site

`site/rules/`, one page per rule, an index that filters by shape, by capability and by *never* or
*ask first*, linked from `try-it.html` as the first thing on it, and from the home page's builder,
which already asks *what happens when an agent tries to …* for eight systems. The menu stays at seven:
the rules are the first section of *Try it*, not a new entry.

## 4. What to build, in order

1. **The rule schema, the generator and the index, with the memo's four rules.** `RM-R0001` to
   `RM-R0004`: other sessions' history, other sessions' secrets, schedules on its own, your connectors.
   Line, paragraph, barrier, the shapes, status *drafted*. **A day and a half.** Task `T15`.
2. **Before and after, on our own deployment.** A method page and one run per rule in a Claude Code
   session we are entitled to run, transcripts excerpted, dated. **A day.** Task `T16`.
3. **The next twenty rules, from the rows that need them most.** Every published row whose barrier is
   *none* and whose undo class is irreversible is a candidate; take the Claude shapes first, because
   that is where the users the lead has are. **Half a day per five.** Task `T17`.
4. **The test drive.** The early users the lead names try a rule each and say what happened, through the
   contact form, which already lands encrypted in the site lane. A line on every rule page asks.
   **Half a day**, with the list from the lead.
5. **The path, wired.** Rules first on `try-it.html`; the home page's builder links each system to its
   rules; every rule ends on the ABP and the levels. **Half a day.**
6. **Rule sets per shape, as a file.** The rules for one shape as a `CLAUDE.md` block to download,
   versioned, the *mini skill*. The pricing page already says a skill carries instructions and cannot
   carry a constraint; the file says the same in its first line. **Half a day, after 3.**
7. **The Lab ask.** *Ask first* as a mandate state; added to `T07`. **An hour.**

## 5. What it does not settle, and what needs the lead

1. **The numbers.** The memo says the data shows the path is broken. The site collects nothing, so the
   brief cannot say where it breaks. Which stage loses most people is the lead's to say, and it changes
   which of 1 to 5 goes first.
2. **The test drivers.** Who the users are that can validate a rule, and whether a rule page may say
   *tried by a user* with or without a name.
3. **The name.** *Rules* is proposed for the family, with *never* and *ask me first* as the two answers.
   The alternative is *one-line behaviour policies*, which is closer to the memo and longer.
4. **Which agent first.** The four examples are Claude's. Whether the first twenty stay on the Claude
   shapes, or include ChatGPT and the connectors, is a reach-the-users-we-have call.
5. **Before and after are one run each.** A line can change what an agent does on Tuesday and not on
   Wednesday. The pages say so; whether to rerun on a schedule and keep the history is a later decision.
6. **When rules become vaults.** The memo says not yet. The schema is built so a rule set can become a
   mandate file without rewriting.
