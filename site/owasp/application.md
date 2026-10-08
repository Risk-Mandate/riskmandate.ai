<!-- Generated from owasp/application.html by scripts/site/generate.mjs. Edit the page, not this file. -->

# RiskMandate — OWASP Agent Behaviour Policies: the application

The OWASP new-project process as OWASP documents it, the answers we propose field by field, the two possible homes, the first-year roadmap and the proposed repository. A draft; nothing has been submitted.

Source: https://riskmandate.ai/owasp/application.html

---

# What OWASP asks, and what we would answer.

The new-project process as OWASP’s own pages describe it, the fields of the request with the answers we propose, the two homes the project could have, the email we would send first, a first-year roadmap and the repository we would set up. All of it is a draft for the leads to approve, line by line, before anything is sent.

**As at:** 8 October 2026. **Where it stands:** preparing the application; nothing sent to OWASP

**Status:** nothing submitted. The request form sits behind an OWASP service-desk login, so its fields are taken from OWASP’s guide, not from the form itself.

## Seven things before the form, one form, and thirty days after.

From OWASP’s support guide [How to create a project](https://support.docs.owasp.org/wiki/spaces/OSD/pages/478445603/How+to+create+a+project) (last updated 22 September 2026) and the [Project Policy](https://owasp.org/policy/project) (adopted 28 September 2021), both read on 8 October 2026.

| Stage | What OWASP asks | Where we are |
| --- | --- | --- |
| Before | Two to five leaders, all OWASP members, each with a GitHub account | Two named, membership as the lead stated it, not yet checked; a third sought |
| Before | Read and acknowledge the Project Policy | Read; summarised on [RiskMandate and the project](/owasp/riskmandate.html) |
| Before | Choose a licence: an OSI licence for code, Creative Commons (or a standards body’s open licence) for documentation; the DCO for contributions | Apache-2.0 and CC BY 4.0 proposed; CC BY-SA 4.0 an open question |
| Before | Classify: Code or Documentation; Breaker, Builder or Defender | Documentation; Builder |
| Before | Check the name against OWASP’s projects and GitHub; say how the project meets a need no existing project meets | Name open; the overlap reading is on [The other OWASP projects](/owasp/ecosystem.html) |
| Before | Draft the problem, innovation, purpose, deliverables and a first-year roadmap | Drafted below |
| Submit | The New Project Request in OWASP’s service desk. OWASP replies within one business day; the Project Committee reviews and asks about scope, overlap and roadmap; a decision normally takes a few weeks | Not submitted |
| After | OWASP gives admin access to a new repository in its GitHub organisation and an invitation to manage the project’s page on owasp.org. Leaders create the page within 30 days, list every leader with an owasp.org email, add the licence, enable the DCO check, publish a roadmap | — |

**Two things OWASP’s own pages disagree on, published as they stand.** The Project Policy’s link to the request form and the guide’s link point at different service-desk forms; the guide is the newer page, so we would use its link and ask. And owasp.org moved to a new site in September 2026: project pages now live at `owasp.org/projects/<slug>` and are edited in an admin portal, while the draft Project Handbook still describes the older `www-project-<name>` repository. Which one a new project gets is not stated; it is a question in the email.

## Sixteen fields, our proposed answers.

The field list follows the guide’s steps. Where we do not have an answer, the field says so; a leader’s details are never filled in for them.

OWASP Agent Behaviour Policies (ABP).

Two things to settle first. The lead’s voice note says _application_ behaviour policies. And the Project Committee’s good practices ask that a name not be easily confused with a company’s commercial service, while RiskMandate sells reviewed Agent Behaviour Policies today. Either the project keeps the name and RiskMandate renames what it sells, or the project takes a name of its own. The leads decide before the form goes.

AI agents are deployed with credentials, tools and a place to run, and together these decide what an agent can do. That is rarely written down, and what the agent was authorised to do usually is not written down either. So nobody can say, for a given deployment, which capabilities are outside what was asked for, or whether anything other than a sentence in a prompt stands in the way. Risk lists such as the Agentic Top 10 and the LLM Top 10’s Excessive Agency describe the risk in general; there is no open, shared format for recording it for one agent in one deployment.

Three things, together. A grammar of capability primitives (`verb.object.reach`) in which a measured grant and a written mandate can be compared. A delta derived by a build anybody can rerun, never written by hand. And a barrier recorded on every row with one test: a control bounds a capability only if something the agent’s own grant does not include enforces it. The record carries no score, which is what lets a vendor, a buyer, a reviewer and an insurer all use the same one.

Give security teams, agent developers and reviewers a vendor-neutral, machine-readable way to write down what an agent can do, what it was authorised to do, the gap, and what stands in the way, with evidence on every row; and give the builders of controls (OWASP’s among them) a grammar in which to say which rows their control bounds.

A specification (objects, grammar, barriers, evidence tiers, delta, lifecycle, limitations); JSON Schemas for the grant, the mandate and the delta; a reference build and validator; template ABPs for common deployment shapes, at least three rebuilt by a reviewer outside the leaders’ company; the measuring prompt with its rules; mappings by id and title to the Agentic Top 10, the LLM Top 10, AISVS and the Agent Control Standard.

**Disclosure.** Both proposed leaders are co-founders of RiskMandate, which originated the model, publishes it under open licences, and sells services built on it. The project would be useful without RiskMandate; RiskMandate would be one adopter among any number, sponsoring only through the Foundation. We are seeking a third leader from outside the company. We have read the Agent Control Standard and will raise the overlap with its maintainers before and during review.

**Questions.** Which request form is current? Will the project get a `www-project` repository or a page in the new admin portal? Would the committee prefer this to start as an initiative of the GenAI Security Project?

## Standalone, inside GenAI, or standalone with a line to it.

Both routes exist. A standalone project is approved by OWASP’s Project Committee under the Project Policy. An initiative inside the GenAI Security Project is proposed on its one- or two-page template, reviewed by its core team for up to four weeks and voted in by its core team and board over 72 hours. Several standalone agent projects were created at OWASP in 2025 and 2026.

| Home | What it gives | What it costs |
| --- | --- | --- |
| Standalone Incubator project | Its own page, level, promotion path and leaders under the Foundation’s rules; the DCO; a home that is neutral between the GenAI work and everything else (ASVS, CycloneDX, Threat Dragon) | Starts at Incubator with nobody’s audience but its own; visibility is the leaders’ job |
| Initiative of the GenAI Security Project | Its audience and its community; next to ACS and the Agentic Top 10, where the overlap is easiest to work out | Its governance, which its board may revise; fortnightly reporting; no page or level of its own on owasp.org (ACS has none) |
| **Standalone, with a formal line to the Agentic Security Initiative** | Both: a neutral home, and a named liaison with ACS and the Agentic Top 10 for the mappings | Two communities to keep informed |

**Our proposal is the third**, and we would ask before deciding: the first email goes to the Project Committee and to the Agentic Security Initiative’s leads together, so that neither hears about it second. If both prefer the initiative route, we take it.

## Drafted, not sent.

Submission M01 on [the tracker](/owasp/tracker.html#submissions). Recipients: the Project Committee’s group address, published on [its page](https://owasp.org/groups/project-committee); the Agentic Security Initiative’s co-leads, through the initiative’s channel on [its page](https://genai.owasp.org/initiatives/agentic-security-initiative/). The leads approve the text and the recipients (gate G3) before it goes.

```
Subject: Proposed OWASP project: Agent Behaviour Policies — which home fits?

Hello,

We would like to propose a new OWASP project, Agent Behaviour Policies, and
before we file the request we would value a view on where it should live.

An Agent Behaviour Policy is a written record, for one AI agent in one
deployment, of what it can do (measured from the deployment, in a grammar of
capability primitives), what it was authorised to do, the gap between the two
(derived, never written by hand), and what stands in the way of each capability,
with one test: a control bounds a capability only if something the agent's own
grant does not include enforces it. It carries no score.

The method, sixteen template examples and the build are already published under
CC BY 4.0 and Apache-2.0. The proposal, the draft charter, the contribution
inventory and the overlap reading we have done against the Agent Control
Standard and the Agentic Top 10 are public at https://riskmandate.ai/owasp/

A disclosure: both of us are co-founders of RiskMandate, which originated the
model and sells services built on it. We want the project to be useful without
RiskMandate, and we are looking for a third leader from outside the company.

Three questions:
1. Would you see this as a standalone project, or as an initiative of the
   GenAI Security Project, next to ACS?
2. Which New Project Request form is current?
3. Is there anything already under way at OWASP that this should join instead?

Thank you,
Dinis Cruz and Nimay Parekh
```

## A roadmap with owners, and no promise of promotion.

Planning targets, not commitments to OWASP. Months count from acceptance.

| Months | Deliverables | Owner |
| --- | --- | --- |
| 1–3 · the foundation | Rights settled and the approved assets moved with their provenance; the project page and repository; governance, contribution and security-reporting files; the specification draft and terminology; JSON Schemas v0.1; three template ABPs with their inputs; a limitations document; an open call for critique | The leads |
| 4–6 · reproducible | The reference build and validator with fixtures; the delta’s computation and what it does not detect, written down; evidence and reassessment rules; the ACS experiment; Agentic Top 10 and LLM Top 10 mappings in the templates | The leads, and the first outside contributors |
| 7–9 · reviewed by others | Reviewers outside RiskMandate; examples tested on two materially different deployment patterns; adversarial and failure cases; decisions and incompatible assumptions tracked in public | The third leader, and reviewers |
| 10–12 · a release | A reviewed release with changelog and status label; implementation experience; a governance review including how much of the work came from RiskMandate; the case for Lab, made only if the committee’s criteria are met | The leads |

## Proposed tree, created only after acceptance.

From the initiation brief, with what the other projects taught us added: a `project.owasp.yaml` for OWASP’s project index (ACS carries one), a history file, and a governance file that names the sponsor and the exit path. No staging repository has been created; when one is, it will not be called an OWASP project.

```
README.md                 what it is, try it in sixty seconds, status of every edition
LICENSE  LICENSING.md     Apache-2.0 for code and schemas; CC BY 4.0 (or BY-SA) for documents
CONTRIBUTING.md           the DCO; the house rules: no score, no verdict, no conformity language
GOVERNANCE.md             leaders, decisions, the sponsor, what it may and may not do, the exit path
SECURITY.md               a reviewed draft until the leads approve the channel
HISTORY.md                one dated origin sentence: what RiskMandate contributed, when, under which licence
project.owasp.yaml        name, pitch, level 2 (Incubator), type documentation, audience builder, leaders, licence
specification/            overview, terminology, deployment, capability, mandate, delta, barriers and evidence,
                          lifecycle, limitations
schemas/                  grant, mandate, delta (JSON Schema, versioned)
vocabulary/               the primitives, barriers, undo classes, evidence tiers (version-pinned ids)
examples/                 template ABPs: inputs, derived outputs, sources, open questions
tools/                    the reference build and validator
tests/                    fixtures; every example's delta must equal its recomputation
mappings/                 agentic-top-10, llm-top-10, aisvs, acs, cyclonedx, opencre (ids and titles only)
roadmap/first-year.md
```

## Where every step stands today.

The gates, the steps, the submissions and the people, from the record.
