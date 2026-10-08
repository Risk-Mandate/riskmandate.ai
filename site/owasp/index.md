<!-- Generated from owasp/index.html by scripts/site/generate.mjs. Edit the page, not this file. -->

# RiskMandate — OWASP Agent Behaviour Policies: the proposal

RiskMandate's founders are proposing the Agent Behaviour Policy to OWASP as an open project, OWASP Agent Behaviour Policies, with RiskMandate as sponsor. The proposal, the gates, and the record of the move, kept in public. Not yet an OWASP project.

Source: https://riskmandate.ai/owasp/

---

# We are proposing the Agent Behaviour Policy to OWASP.

On 8 October 2026 RiskMandate’s two founders decided to propose the Agent Behaviour Policy (ABP) to OWASP as an open project, **OWASP Agent Behaviour Policies**, with RiskMandate as its sponsor. The method is already published under open licences, so the move is mostly about giving it a home that is not ours. This section is where the move is kept: the charter, the line between the company and the project, what moves, what OWASP projects it works with, the application, and a tracker of every step, submission and answer, in public, as it happens.

**As at:** 8 October 2026. **Where it stands:** preparing the application; nothing sent to OWASP

**What this is not, yet:** an OWASP project. OWASP has not received the application, reviewed it or accepted it. Nothing here is endorsed by OWASP, and no page should be read as saying so.

## A description of what an agent can do should not belong to the company that sells it.

An ABP is a written description, for one agent in one deployment, of everything it can do (the grant), what it was authorised to do (the mandate), the gap between the two (the delta), and what actually stands in the way (the barrier). It carries no score. RiskMandate built it, published it at [abp.sgit.ai](https://abp.sgit.ai/) under CC BY 4.0 and the code under Apache-2.0, and sells services on it. That is a reasonable way to start something and a poor way to make it a shared language: a format the buyer, the vendor, the reviewer and the insurer all write in has to be one none of them owns.

OWASP is where the application-security community already keeps shared language of that kind: the Top 10s, ASVS, SAMM, CycloneDX, and now, in the GenAI Security Project, the Agentic Top 10 and the Agent Control Standard. Many OWASP projects are exactly what a behaviour policy records as a _barrier_: something enforced above the agent, out of its reach. A project that describes agents in a grammar those controls can be mapped onto adds to them rather than competing with them. And it gets what one company cannot give it: people outside RiskMandate who will try to break the model.

In a way it’s a simple move because everything is already published and they have Creative Commons, right? You know, the code is freely available. But I think this is going to help a lot the project and it’s also, I think, it’s a great OWASP project from a community point of view.Dinis Cruz, voice note, 8 October 2026 (transcribed; [D30](/briefs.html) in the brief register)

## Five gates. Nothing leaves before the gate before it.

The gates come from the initiation brief the leads commissioned on 8 October ([D31](/briefs.html)). An instruction to prepare the move is not permission to make it: every external step, an email, a form, a repository, waits on the lead’s approval of the exact content and recipient.

### Scope

The objectives, and what agents may read and draft.

**Who clears it:** Dinis Cruz

### Contribution rights

The asset manifest: every row's rights checked, nothing confidential left.

**Who clears it:** The leads, and RiskMandate as a company

### Technical scope

Terminology, boundaries and limitations accepted.

**Who clears it:** The leads, and a reviewer outside RiskMandate

### Outreach and application

The exact recipients, the email text and every field of the application.

**Who clears it:** The leads

### Publication and migration

The repository target, the licences and the contribution set.

**Who clears it:** The leads, after OWASP accepts

### 4 of 25 steps

Happened, and the record says where.

### 0 of 25 steps

Somebody is on it now.

### 16 of 25 steps

Planned; nobody has started.

### 4 of 25 steps

Ready, and waiting on a named person's approval or answer.

The full list, with owners, dates and notes, is on [the tracker](/owasp/tracker.html).

## Eight pages, one record behind them.

Every status on these pages comes from one file, [project.json](/owasp/project.json). When something moves, that file changes and the pages are rebuilt, so the tracker and the overview cannot disagree. The file is written to move into the project’s own repository unchanged.

### The charter

Mission, objectives, who it is for, what it ships, and what it will never claim.

### RiskMandate and the project

The sponsor, what moves and what stays, who manages what, and the conflict of interest.

### What moves

Eighty-two assets, each with a proposed action and a rights status.

### The other OWASP projects

Risks it points at, controls it records, formats it shares, and ACS beside it.

### What other projects teach

Twelve projects read for how they work: what we copy and what we avoid.

### The application

The process, our answers field by field, the home, the roadmap, the repository.

### The tracker

Gates, steps, submissions, people, places, decisions, questions and the log.

## The proposal, as it stands today.

| Name | OWASP Agent Behaviour Policies (ABP) |
| --- | --- |
| One line | An open, vendor-neutral method and machine-readable format for writing down what an AI agent in a given deployment can do, what it was authorised to do, the gap, and what stands in the way |
| Proposed leaders | Dinis Cruz and Nimay Parekh, as people and not as RiskMandate; a third from outside RiskMandate sought |
| Sponsor | RiskMandate, through the OWASP Foundation, on the same terms open to anyone |
| Type and level | Documentation, with a reference tool; Builder; Incubator. OWASP’s to confirm |
| Home | A standalone OWASP project, or an initiative inside the GenAI Security Project: [both set out](/owasp/application.html#home) |
| Licences | CC BY 4.0 for documents, Apache-2.0 for code, as published today; checked per asset before transfer |
| Starts from | The abp.sgit.ai model v0.12.1, its documentation pack, sixteen template ABPs and the delta build |
| Never | A score, a mark, an insurance product, a hosted service, or a claim that a document enforces anything |

## The charter, then the line.

What the project is for and what it will not claim, then how RiskMandate sits beside it. Argue with either; that is what they are for.
