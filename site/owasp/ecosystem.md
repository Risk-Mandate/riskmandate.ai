<!-- Generated from owasp/ecosystem.html by scripts/site/generate.mjs. Edit the page, not this file. -->

# RiskMandate — OWASP Agent Behaviour Policies: the other OWASP projects

Where an Agent Behaviour Policy meets other OWASP projects: risks it points at, controls it records as barriers, formats it can share, and the Agent Control Standard it would work beside. Read from OWASP's pages and dated.

Source: https://riskmandate.ai/owasp/ecosystem.html

---

# An ABP points at risks, records controls, and shares formats.

Where an Agent Behaviour Policy meets the rest of OWASP. Some projects name the risks an ABP row is evidence about. Many are, or describe, the controls an ABP records as its fourth barrier, the one enforced above the agent. A few are formats an ABP should be able to read and write. And one, the Agent Control Standard, sits right beside it. Every project’s facts are from its own pages, read on 8 October 2026; every line about how the ABP would use it is our proposal, not theirs.

**As at:** 8 October 2026. **Where it stands:** preparing the application; nothing sent to OWASP

**Already on this site:** [OWASP, as a graph](/owasp-graph.html), 181 nodes and 62 relationships read from OWASP’s pages on 24 September, and the business cases for [Coraza](/business-case-owasp-coraza.html) and [Threat Dragon and pytm](/business-case-owasp-threat-dragon.html).

## A risk to point at, a control to record, a format to share.

### The lists name it; the ABP measures it, per deployment

The Agentic Top 10, the LLM Top 10’s _Excessive Agency_, the Non-Human Identities Top 10’s _Overprivileged NHI_. Each names a risk in general. An ABP’s delta, what the agent can do and was not asked to, is that risk for one agent in one deployment, row by row.

### OWASP builds barriers; the ABP says where each one stands

The enforcer test: a control bounds a grant only if something the grant does not include enforces it. A WAF in front of the tools the agent calls, a rule set on its egress, a guardian that can deny a tool call: each is a candidate fourth barrier, and an ABP row can name it. That is the business case for an OWASP control, with no verdict in it.

### One description, several readers

The grant is a list of what the agent can reach: close to a bill of materials. CycloneDX, the Agent Control Standard’s Agent Bill of Materials and OpenCRE are formats an ABP should export to or link through, so that the same record serves the tools people already run.

## The ABP describes and records. ACS is a wire through which a control can act.

ACS joined the OWASP GenAI Security Project on 1 September 2026. Its README calls it a wire specification that lets a separate Guardian Agent inspect what an agent is about to do and permit, deny or modify it. Read on 8 October: version 0.1.3 (changelog dated 9 September 2026), Apache-2.0 for code and schemas, CC BY-SA 4.0 for prose. The brief of 8 October asked for an overlap matrix with ACS and the Agentic Top 10; this is the first reading of it, from public pages, for the maintainers to correct.

|  | Agent Behaviour Policies (proposed) | Agent Control Standard | Top 10 for Agentic Applications |
| --- | --- | --- | --- |
| Purpose | Write down what one agent in one deployment can do, what it was authorised to do, the gap, and what stands in the way | A runtime protocol through which a separate guardian can allow, deny, modify, ask or defer an agent’s next action | A list of the ten risk categories for agentic applications, December 2025 |
| Artefacts | Grant, mandate, delta and barrier records; a 23-primitive grammar; template ABPs; a build that derives the delta | A handshake, a JSON-RPC envelope, a minimum hook set, five dispositions; trace, inspect (an Agent Bill of Materials), provenance, crypto and audit profiles; a reference implementation | A document, ASI01 to ASI10, CC BY-SA 4.0 |
| Enforces | Nothing. It says what does | Yes: it is the channel a control acts through | No |
| Assesses | Yes: which capabilities are outside the mandate, and which of those nothing bounds | Not its stated purpose; the Agent Bill of Materials lists what the agent has | It informs an assessment |
| Where it lives | Proposed; not yet at OWASP | Inside the GenAI Security Project, under its governance | Inside the GenAI Security Project |
| How they would meet | An ABP row whose barrier is an ACS guardian names the hook and the disposition: _before_ `send.message.world`, `toolCallRequest` &rarr; `ask`. ACS’s Agent Bill of Materials and an ABP’s grant describe overlapping ground; whether one can be derived from the other is the first question to put to the maintainers. The Agentic Top 10 supplies the risk each row is evidence about. |

**What we do not say.** No ABP–ACS integration exists, and nothing here claims interoperability. The initiation brief recorded observations about ACS’s reference implementation as it was reviewed; they are time-sensitive, they have not been re-checked at a commit, and we do not repeat them. Any statement about ACS on this site will name the version and commit it was read at.

**The experiment we propose**, on a system we are entitled to run and on nobody else’s: one synthetic agent deployment, one restriction (a person approves before any external email), ACS as the enforcement. Record the ABP row, the evidence of the capability, the hook and disposition, the failure behaviour, and four tests: it allows what it should, it stops what it should, a known bypass, and an outage of the guardian. Then the paths it does not cover. No conformance is claimed without a defined profile and results.

**The note to the maintainers** ([M03](/owasp/tracker.html#submissions), drafted, not sent): _We are proposing an OWASP project for Agent Behaviour Policies, a per-deployment record of what an agent can do, what it was authorised to do, and what stands in the way. ACS looks like the natural runtime barrier for many of its rows. Before we describe that relationship anywhere, could you tell us whether we have read ACS correctly, whether the Agent Bill of Materials could carry or derive an ABP grant, and whether you would review a small experiment that uses ACS to enforce one ABP restriction?_

**A disclosure for the review.** ACS’s creators are named in its governance file; one of them also sits on OWASP’s Project Committee, which reviews new projects. That is a reason to raise the overlap ourselves, early, and in the application.

## Ten risks, and which part of an ABP speaks to each.

Titles only, from the December 2025 edition. The right-hand column is our reading of where the ABP model has something to say, and where it has nothing yet. Three items touch nothing in the grammar today; that is a finding about the grammar, said here rather than papered over.

| Id | Title | Where an ABP speaks to it (our reading) |
| --- | --- | --- |
| ASI01 | Agent Goal Hijack | A hijacked agent does what its grant allows. The **unbounded excess**, what it can reach, was not asked to and nothing stops, is the size of the problem when it happens |
| ASI02 | Tool Misuse and Exploitation | Every grant row is a tool path (`via`) with its barrier. Misuse is a row used outside the mandate; the barrier column says whether anything is in the way |
| ASI03 | Identity and Privilege Abuse | `authenticate-as.credential.tenant`, `authenticate-as.credential.signing`, `grant.credential.self`, `read.credential.host`. The credential the agent holds is the grant, never a barrier |
| ASI04 | Agentic Supply Chain Vulnerabilities | Not in the grammar. The tools list records what is connected; nothing records where it came from. A candidate for the CycloneDX link |
| ASI05 | Unexpected Code Execution (RCE) | `execute.process.host`, `execute.process.self`, `create.schedule.*`, with their undo class |
| ASI06 | Memory & Context Poisoning | Not in the grammar. Memory as a thing written to and read back across sessions has no primitive yet |
| ASI07 | Insecure Inter-Agent Communication | Not in the grammar beyond `send.endpoint.*`. One agent delegating to another is an open modelling question |
| ASI08 | Cascading Failures | Reach (`tenant`, `world`) and the undo class say how far a step goes and whether it comes back; the graph work joins one agent’s rows to the desks they reach |
| ASI09 | Human-Agent Trust Exploitation | The barrier kinds: an approval prompt the agent’s own account can switch off is a _setting_, not a control. See [An approval prompt is not a human in the loop](/article-approval-prompts.html) |
| ASI10 | Rogue Agents | As ASI01: the delta and its unbounded part bound what a rogue agent can do, and only the fourth barrier changes that |

None of this mapping is in the template vaults yet; their standards graphs name ATT&CK, the EU AI Act and GDPR. Adding the Agentic Top 10 and the LLM Top 10 by id and title is a step on [the tracker](/owasp/tracker.html).

## What each is, and how an ABP would use it.

Level and licence as OWASP’s public project list and the project’s own pages gave them on 8 October 2026. The last column is a proposal to each project’s leaders, not something any of them has agreed to.

| Project | What it is | Level | Licence | How an ABP would use it |
| --- | --- | --- | --- | --- |
| [AI Exchange](https://owaspai.org/) | An AI security guide of over 300 pages, with threats and controls | Flagship | CC0 1.0 | Its control names as the vocabulary for barriers; CC0 lets template ABPs carry them |
| [AISVS](https://github.com/OWASP/AISVS) | Verification requirements for AI systems, including a chapter on orchestration and agentic security and one on MCP | Incubator | CC BY-SA 4.0 | A barrier row points at the requirement ids it bears on; ids only, never the text |
| [LLM Top 10](https://genai.owasp.org/llm-top-10/) | Risk categories for LLM applications; LLM06 is Excessive Agency | within GenAI (Flagship) | CC BY-SA 4.0 | The delta is a per-deployment instance of excessive agency |
| [Non-Human Identities Top 10](https://owasp.org/www-project-non-human-identities-top-10/) | Risks of non-human identities, 2025; NHI5 is Overprivileged NHI | Incubator | not stated on the list | An agent’s credentials are non-human identities; the excess is a measure of their overprivilege |
| [AI Agent Security Cheat Sheet](https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/AI_Agent_Security_Cheat_Sheet.md) | Guidance including tool security and least privilege, human-in-the-loop controls, multi-agent security | Cheat Sheet Series (Flagship) | CC BY-SA 4.0 | Propose a section, or a sheet, on writing an agent’s behaviour down; link both ways |
| [CycloneDX](https://cyclonedx.org/) | Bill of materials standard (ECMA-424), including an ML-BOM; its Blueprints working group is developing a Bill of Behaviors | Flagship | Apache-2.0 | Export the grant’s tools, models and servers as a BOM; talk to the Blueprints group before either of us defines behaviour twice |
| [Dependency-Track](https://dependencytrack.org/) | Component inventory and policy platform that reads CycloneDX | Flagship | Apache-2.0 | Ingest an ABP-derived BOM; flag a component the mandate does not cover |
| [Threat Dragon](https://owasp.org/projects/threat-dragon) and [pytm](https://github.com/OWASP/pytm) | Threat-modelling tools: diagrams saved as JSON; threat models as Python | Production | Apache-2.0; MIT | The grant as assets and flows, the barriers as mitigations; generate a model from an ABP |
| [Coraza](https://coraza.io/) and [CRS](https://coreruleset.org/) | A web application firewall framework, and the rule set it runs | Production; Flagship | Apache-2.0 | A fourth barrier on the HTTP tools an agent calls and on its egress; already a business case on this site |
| [OpenCRE](https://opencre.org/) | A graph linking security standards by common requirement | Production | CC0 1.0 | Give each barrier kind a CRE link, so an ABP connects to standards without quoting them |
| [SAMM](https://owaspsamm.org/) and [ASVS](https://owasp.org/projects/asvs) | A maturity model for the organisation; verification requirements for web applications | Flagship | CC BY-SA 4.0 | An ABP as an artefact of threat assessment in SAMM; ASVS access-control requirements for tools that are web APIs. SAMM scores the organisation; an ABP carries no score |
| [Threat Modeling Project](https://owasp.org/projects/threat-modeling-project) | Methods and the four-question frame | Lab | not stated on the list | The delta answers “what can go wrong?” for one agent, from evidence |

## Agent projects started at OWASP in 2025 and 2026, read before we apply.

The application asks how the project meets a need no existing OWASP or open-source project meets. OWASP’s project list on 8 October named, among others: the Agent Observability Standard, the Agent Skills Security Standard, the Agentic Skills Top 10, Agent Memory Guard, the MCP Top 10, the MCP Taxonomy, the MCP Verification Standard, and the MCP Governance and Risk Project.

We have read their names and levels, not their contents. Before the application goes, each gets a line: what it covers, whether it records a deployment’s mandate or its delta, and what the ABP would cite from it. Our working answer to the form’s question, to be tested against that reading: **none of the projects we have read so far writes down, for one deployment, what the agent was authorised to do next to what it can do, and derives the gap.** If one does, the right move is to contribute to it, and this page will say so.

## How other projects present themselves, and what we copy.

Twelve OWASP projects read for how they work, and the patterns we take and avoid.
