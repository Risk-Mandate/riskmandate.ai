<!-- Generated from owasp/tracker.html by scripts/site/generate.mjs. Edit the page, not this file. -->

# RiskMandate — OWASP Agent Behaviour Policies: the tracker

The state of the proposal to OWASP, in public: gates, steps, submissions and answers, the people to talk to, where everything lives, decisions, open questions and a dated log.

Source: https://riskmandate.ai/owasp/tracker.html

---

# Every step, every submission, every answer.

The state of the move, kept in public. What has been done, what is being done, what waits on whom; what was sent, to whom, through which channel, on which date, and what came back. The people we need to talk to and why. The decisions taken and the questions still open. A line changes when the thing happens, not when somebody means it to.

**As at:** 8 October 2026. **Where it stands:** preparing the application; nothing sent to OWASP

**The record:** [project.json](/owasp/project.json). Every table on this page is rendered from it.

## Five approvals, each a named person’s.

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

## The plan, two weeks to an application and a year after it.

The lead’s aim is an OWASP project the two founders lead within a couple of weeks of 8 October. The steps to the application are sized for that; the steps after it are OWASP’s pace, not ours.

### 4 of 25 steps

Happened, and the record says where.

### 0 of 25 steps

Somebody is on it now.

### 16 of 25 steps

Planned; nobody has started.

### 4 of 25 steps

Ready, and waiting on a named person's approval or answer.

| Step | Gate | What | Who | When | Status | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| S01 | G0 | Decide to propose the ABP to OWASP, with RiskMandate as sponsor | Dinis Cruz, Nimay Parekh | 2026-10-08 | Done | Voice note D30 [link](/briefs.html) |
| S02 | G0 | Commission the initiation brief: charter, boundary, inventory, gates | Dinis Cruz | 2026-10-08 | Done | Brief D31, written with Perplexity [link](/briefs.html) |
| S03 | G0 | Publish this section and the record on the public site and in the public repository | the website agent | 2026-10-08 | Done | The lead asked for it public: "this should go on the public website the public Git repo" |
| S04 | G1 | Inventory every asset: source, licence, proposed action, coupling | the website agent | 2026-10-08 | Done | 82 rows [link](/owasp/contribution-inventory.csv) |
| S05 | G1 | Check the rights on each contribute and rewrite row, and the licence file of the abp.sgit.ai repository | Dinis Cruz |  | To do | A footer is not proof of rights |
| S06 | G1 | Add a CC BY 4.0 licence file to this repository and to the abp.sgit.ai repository | Dinis Cruz |  | To do | None exists; the footers say CC BY 4.0 |
| S07 | G1 | RiskMandate, as a company, agrees in writing to contribute the approved assets | Nimay Parekh |  | To do | Paid copies name the copyright as RiskMandate's |
| S08 | G1 | Ask the early beta user whose agent measured the n8n vault, and the three people behind the abp.sgit.ai cases, whether their material may move | Dinis Cruz |  | To do | Deferred until they agree in writing |
| S09 | G2 | Decide the name: Agent Behaviour Policies, as in the brief, or the wording in the voice note | Dinis Cruz |  | Waiting | Open question Q1 |
| S10 | G2 | Decide the home: a standalone project, or an initiative inside the GenAI Security Project | the leads, after talking to the GenAI project's leaders |  | To do | Both set out on the application page [link](/owasp/application.html#home) |
| S11 | G2 | Find a third leader from outside RiskMandate | the leads |  | To do | Two leaders from one company is the pattern the research says to avoid |
| S12 | G2 | Confirm both leaders' OWASP membership is current | Dinis Cruz, Nimay Parekh |  | To do | Stated by the lead; not checked against OWASP's records |
| S13 | G2 | Find and fix the public pages that describe the delta's storage differently | the website agent |  | To do | The brief reports a contradiction; the model says derived, stored with both inputs, never edited |
| S24 | G2 | Read the agent projects OWASP started in 2025 and 2026 (Agent Observability Standard, Agent Skills Security Standard, the MCP projects and others) and write one line on each: what it covers, and whether it records a mandate or a delta | the website agent |  | To do | The form asks how the project meets a need no existing project meets [link](/owasp/ecosystem.html) |
| S25 | G2 | Settle the name against the committee's vendor-neutrality good practice: RiskMandate sells Agent Behaviour Policies today | Dinis Cruz, Nimay Parekh |  | Waiting | Q1 |
| S14 | G3 | Approve the email to the projects team and the GenAI project, and its recipients | the leads |  | Waiting | Drafted on the application page [link](/owasp/application.html#email) |
| S15 | G3 | Approve every field of the application | the leads |  | Waiting | Drafted on the application page [link](/owasp/application.html#form) |
| S16 | G3 | Send the email; submit the application through OWASP's channel | Dinis Cruz |  | Blocked | Blocked on S14 and S15 |
| S17 | G4 | OWASP gives admin access to a new repository in its GitHub organisation and an invitation to manage the project's page on owasp.org; within 30 days the leads create the page (leaders with owasp.org emails, pitch, level, type, licence), add the licence and enable the DCO check | OWASP staff, then the leads |  | To do | After acceptance |
| S18 | G4 | Create the specification repository with README, LICENSE, GOVERNANCE, CONTRIBUTING, SECURITY and the proposed tree | the leads |  | To do | Proposed tree on the application page [link](/owasp/application.html#repo) |
| S19 | G4 | Move the approved assets with their provenance: source, date, commit | the leads |  | To do | Not a find-and-replace |
| S20 | G4 | Point abp.sgit.ai and this site's model pages at the project as the source; nothing taken down | the website agent, with the lead's approval |  | To do | Only after the project's repository exists |
| S21 | G2 | Write the JSON Schemas for the grant, the mandate and the delta | to be assigned |  | To do | No schema file exists today |
| S22 | G2 | Run the integration experiment: one synthetic deployment, one restriction (approval before external email), ACS as the enforcement, with positive, negative, bypass and outage tests | to be assigned |  | To do | Only on a system we are entitled to run; no conformance claimed |
| S23 | G2 | Add OWASP mappings to the template vaults: Agentic Top 10 and LLM Top 10 items, by id and title | the website agent |  | To do | The vaults map ATT&CK, the EU AI Act and GDPR today, and no OWASP list |

## What we sent, and what came back.

Each row is drafted here before it is sent, and says _not sent_ until it has been. The draft is linked; the answer is quoted in a short phrase and dated when it arrives.

| Id | What | To | Channel | Sent | Status | Answer |
| --- | --- | --- | --- | --- | --- | --- |
| M01 | Email introducing the proposal and asking which home fits · [the draft](/owasp/application.html#email) | OWASP Project Committee (project-committee@owasp.org); co-leads of the GenAI Security Project's Agentic Security Initiative | email | not sent | Drafted | — |
| M02 | New project application · [the draft](/owasp/application.html#form) | OWASP Foundation | [New Project Request, OWASP service desk (login needed)](https://support.docs.owasp.org/wiki/spaces/OSD/pages/478445603/How+to+create+a+project) | not sent | Drafted | — |
| M03 | Note to the Agent Control Standard maintainers on the overlap, and the integration experiment · [the draft](/owasp/ecosystem.html#acs) | ACS maintainers | [GitHub discussion or the GenAI Slack](https://github.com/GenAI-Security-Project/agent-control-standard) | not sent | Drafted | — |

## The people and the channels, from OWASP’s own pages.

Names and roles as OWASP’s pages gave them on the date read. _Confirmed_ says whether that is from a page read in full or still to check. Nobody on this list has been contacted.

| Who | Role | Why we talk to them | How | Confirmed |
| --- | --- | --- | --- | --- |
| OWASP Project Committee | Reviews new-project requests and promotions; meets monthly | They decide on the request. First recipient of the email (M01) | [project-committee@owasp.org · Slack #project-new-projects](https://owasp.org/groups/project-committee) | Yes: the committee's page, read 8 Oct 2026 |
| Bjoern Kimminich | Project Committee chair | Chairs the review | [through the committee's group address](https://owasp.org/groups/project-committee) | Named in the committee's leaders file; when it was last edited is unchecked |
| Jeff Foley, Donnie Brown | Project Committee vice chair and secretary | The committee's officers | [through the committee's group address](https://owasp.org/groups/project-committee) | As above |
| Jason Gillam, Michael Bargury, Jim Manico | Project Committee members | Possible reviewers. Michael Bargury is also a creator of the Agent Control Standard: the overlap is raised by us, in the request | [through the committee's group address](https://owasp.org/groups/project-committee) | As above |
| Steve Springett | Global Board liaison to the Project Committee | The board's view, if the home question goes that far | [through the committee's group address](https://owasp.org/groups/project-committee) | As above |
| Starr Brown | Director of Open Source Projects and Programs; staff liaison to the Project Committee | The staff side of the request: forms, repository, page, shared resources | [OWASP staff page](https://owasp.org/staff) | Yes: the staff page, read 8 Oct 2026 |
| Andrew van der Stock | Executive Director; author of the September 2026 project guides | The guides' author, if a step in them is unclear | [OWASP staff page](https://owasp.org/staff) | Yes: the staff page and the guide, read 8 Oct 2026 |
| John Sotiropoulos, Ron F. Del Rosario | Co-leads, Agentic Security Initiative, GenAI Security Project | The initiative ACS and the Agentic Top 10 sit in. Second recipient of the email (M01) | [Slack #team-genai-agentic-security-initiative; open meeting Tuesdays](https://genai.owasp.org/initiatives/agentic-security-initiative/) | Yes: the initiative's page, read 8 Oct 2026 |
| Scott Clinton, Steve Wilson | Co-chairs, GenAI Security Project | If the home is an initiative inside GenAI, its board and core team vote it in | [GenAI Security Project](https://genai.owasp.org/project-governance/) | Yes: owasp.org's project record and genai.owasp.org, read 8 Oct 2026 |
| Rock Lambros, Ariel Fogel, Bar Kaduri; Michael Bargury, Ory Segal | Project leads and creators, Agent Control Standard | The overlap note and the experiment (M03) | [the ACS repository](https://github.com/GenAI-Security-Project/agent-control-standard) | Yes: ACS's GOVERNANCE.md, read 8 Oct 2026 |
| OWASP support | The general service desk | If a form or a link does not work | [support@owasp.org · contact.owasp.org](https://owasp.org/contact) | Yes: owasp.org/contact, read 8 Oct 2026 |

## Repositories, sites and records, and who manages each.

| What | Where it lives | Who manages it | Side |
| --- | --- | --- | --- |
| The model, vocabulary and documentation pack | [abp.sgit.ai (v0.12.1)](https://abp.sgit.ai/) | Dinis Cruz | today: sgit, CC BY 4.0; proposed: the OWASP project |
| The sixteen template ABPs and the delta build | [github.com/Risk-Mandate/riskmandate.ai, site/vaults/](https://github.com/Risk-Mandate/riskmandate.ai) | the website agent, for the leads | today: RiskMandate; proposed: the OWASP project, as examples and the reference tool |
| This section and its record | [riskmandate.ai/owasp/ and site/owasp/project.json](/owasp/) | the website agent, for the leads | RiskMandate, until the project's repository exists |
| The OWASP graph | [riskmandate.ai/owasp-graph.html and business-case/owasp/graph.json](/owasp-graph.html) | the website agent | RiskMandate; offered to OWASP |
| The project page | owasp.org/projects/<slug>, edited in OWASP's admin portal (the new site, September 2026); or a www-project repository, as the draft handbook still describes | OWASP staff create it; the leads maintain it | OWASP, after acceptance |
| The specification, schemas, examples and tools | a repository under github.com/OWASP (proposed) | the project's leaders and contributors | OWASP, after acceptance |
| Commercial services, the store, the Index, reviews | [riskmandate.ai, store.sgit.ai](/pricing.html) | RiskMandate | RiskMandate, always |
| Customer data and customer vaults | private vaults, never in a public repository | RiskMandate | RiskMandate, always |

## What has been decided, by whom.

| Id | Decided | By | Date |
| --- | --- | --- | --- |
| K01 | Propose the Agent Behaviour Policy to OWASP as an open project, with RiskMandate as sponsor | Dinis Cruz, Nimay Parekh | 8 October 2026 |
| K02 | Keep the whole move in public: this section on the public site, the record in the public repository | Dinis Cruz | 8 October 2026 |
| K03 | RiskMandate commercialises on the method as anybody else could, and proposes its commercial model as one others can follow | Dinis Cruz | 8 October 2026 |
| K04 | Nothing external without approval: every email, form, repository and licence change waits on its gate | Dinis Cruz (brief D31) | 8 October 2026 |

## What is not decided, and what it holds up.

| Id | Open question | Who answers | Blocks |
| --- | --- | --- | --- |
| Q1 | The name. Agent Behaviour Policies, or 'application behaviour policies' as the voice note says? And since OWASP's good practices ask that a project's name not be confused with a company's commercial service, does RiskMandate rename what it sells, or does the project take another name? | Dinis Cruz | S15 |
| Q2 | A standalone project, or an initiative inside the GenAI Security Project? | the leads, with the GenAI project's leaders | S15 |
| Q3 | Who is the third leader, from outside RiskMandate? | the leads |  |
| Q4 | Documents under CC BY 4.0, as today, or CC BY-SA 4.0, as many OWASP projects use? | the leads | S18 |
| Q5 | Does 'grant' stay the word for measured reach, given that it reads as authorisation in ordinary English? | the project, in public |  |
| Q6 | How do the four barrier kinds sit with a richer control model (preventive, approval, detective, corrective; failure behaviour; bypass paths)? | the project, in public |  |
| Q7 | Does abp.sgit.ai become the project's reading site under OWASP branding, or does the project read only from its repository? | the leads, with OWASP | S20 |
| Q8 | Which three examples will a reviewer outside RiskMandate rebuild from their inputs first? | the leads |  |
| Q9 | Which New Project Request form is current? The Project Policy and the September 2026 guide link to different ones | OWASP, asked in M01 | S16 |
| Q10 | Does a new project get a www-project repository, or only a page in the new admin portal and a code repository? | OWASP, asked in M01 | S17 |

## What happened, newest first.

| Date | What happened | Where |
| --- | --- | --- |
| 8 October 2026 | OWASP's process read: the September 2026 guide, the Project Policy, the committee's page, the staff page, the GenAI project's governance and the ACS repository. The form is behind a login; two OWASP pages link to different forms | [link](/owasp/application.html) |
| 8 October 2026 | OWASP's Project Policy, twelve OWASP projects and our own published material read; the inventory, the charter and this section published | [link](/owasp/) |
| 8 October 2026 | The founders decide to propose the Agent Behaviour Policies to OWASP; voice note D30 and initiation brief D31 arrive | [link](/briefs.html) |
| 24 September 2026 | The lead asks for OWASP first: a semantic graph of OWASP, business cases for its projects, and the intent to move RiskMandate's ideas and standards to OWASP (D17) | [link](/owasp-graph.html) |

## Something here is wrong or out of date?

Say so. A tracker that lags reality is worse than none, and the correction is the point.
