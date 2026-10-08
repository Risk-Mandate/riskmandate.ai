<!-- Generated from owasp/lessons.html by scripts/site/generate.mjs. Edit the page, not this file. -->

# RiskMandate — OWASP Agent Behaviour Policies: what other projects teach

Twelve OWASP projects read for how they present themselves, version, publish data, organise contributors and handle companies, and what the proposed project copies and avoids.

Source: https://riskmandate.ai/owasp/lessons.html

---

# Twelve OWASP projects, read for how they work.

Before writing our own project page, we read how established OWASP projects present themselves: where they live, how they version, what they publish as data, how contributors and companies take part, and how a company that started or sponsors a project says so. Facts and dates only; what each one does, not a view of it.

**As at:** 8 October 2026. **Where it stands:** preparing the application; nothing sent to OWASP

**Read:** every page below on 8 October 2026, with a plain HTTP fetch. Two facts rest on search snippets and are not repeated here.

## One lesson each, with the fact it comes from.

| Project | What it does that we noted | What we take from it |
| --- | --- | --- |
| [Top 10](https://owasp.org/www-project-top-ten/) | Year-named editions; identifiers carry the year (`A01:2025`); the repository labels each edition RELEASED, SUPERSEDED or HISTORIC | An old citation never silently changes meaning. Every ABP release gets a status label, and none is deleted |
| [ASVS](https://owasp.org/www-project-application-security-verification-standard/) | Version-pinned requirement ids (`v5.0.0-1.2.5`); CONTRIBUTING.md says what a major, minor and patch release may change; CSV and JSON per release | A version-pinned id for every primitive and every template row, and a written rule for what each release type may change |
| [SAMM](https://owaspsamm.org/) | The core repository holds the raw model data that the website and toolbox are generated from; footer line “This is an OWASP project.” | One raw source, everything generated. The vaults already work this way; the project says so and publishes the source |
| [Cheat Sheet Series](https://cheatsheetseries.owasp.org/) | Cross-indexes to ASVS, MASVS, Proactive Controls and the Top 10; sheets on AI Agent Security, MCP Security and agent execution evidence | Cross-indexes make a project useful to people arriving from elsewhere. The AI Agent Security sheet is the first place to link to and from |
| [Juice Shop](https://owasp.org/www-project-juice-shop/) | Added a second co-leader on 29 January 2025, which its post describes as closing a requirement of the 2021 policy; publishes a fortnightly developer meeting on the OWASP calendar | Two leaders, or more, from day one. Publish the meeting |
| [ZAP](https://www.zaproxy.org/) | Left OWASP for the Linux Foundation’s Software Security Project on 1 August 2023; joined Checkmarx on 24 September 2024; each move announced with the reasons, what stayed (licence, core-team control) and what changed | Write the exit path before it is needed: what the sponsor may influence, and what it may not |
| [CycloneDX](https://cyclonedx.org/) | JSON, XML and Protobuf schemas with a media type and file-name convention; About pages for governance, guiding principles (including vendor neutrality), supporters, history and branding; an Industry Working Group for vendors; ratified as ECMA-424 in June 2024. Its Blueprints working group is developing a “Bill of Behaviors” for expected against actual behaviour | A schema with a media type, a complete About set, a separate group where vendors advise, and a conversation with the Blueprints group before either of us defines behaviour twice |
| [Dependency-Track](https://dependencytrack.org/) | A tool and its data format are two OWASP projects pointing at each other (with CycloneDX); the founder’s tenth-anniversary post names the original employer’s use case | The format and the tools that read it can be separate. Start as one project; keep the seam visible |
| [GenAI Security Project](https://genai.owasp.org/) | Mission and charter, governance (a meritocratic model with lazy consensus, 72 hours), leadership, sponsorship and branding pages; monthly open meeting; took in the Agent Control Standard on 1 September 2026; sponsors’ logos appear in each project asset | The page set is complete and worth following. Sponsor logos inside an ABP are not: a project that describes vendors’ agents keeps vendors’ logos out of its documents |
| [AI Exchange](https://owaspai.org/) | Names, in one sentence on its people page, the company that donated the initial framework; lists contributors with their organisations; linked into OpenCRE | The originating company named once, plainly, with what it donated and when |
| [Threat Dragon](https://owasp.org/www-project-threat-dragon/) | A numbered “try it” walk-through to a demo and a sample threat model; threat models saved as JSON; a published roadmap and community manifesto | A sixty-second path: open one template ABP, live, from the project page |
| [CRS](https://coreruleset.org/) | Copyright history kept in the README (a company to 2020, then the project); a sponsor post states what the sponsor’s product uses CRS for, what it contributes back and what the money pays for; an LTS line beside the latest release | Keep the origin in the README; say what sponsorship buys and that it does not buy governance; tell adopters which version to build on |

## Patterns, in the order we need them.

- **The owasp.org project page as the front door**, filled in completely: leaders, classification, type, licence, latest version and date. Any other domain carries OWASP’s branding, as the policy asks.
- **Two to five leaders**, at least one from outside RiskMandate. See [RiskMandate and the project](/owasp/riskmandate.html).
- **Version-pinned ids** for primitives and template rows, and a release rule saying what a major, minor and patch may change.
- **Status labels on every edition**, and old editions kept.
- **Machine-readable first**: a JSON Schema, a file-name convention, a media type, and the data exported per release.
- **One raw source**, from which the documents, the pages and the reading app are generated.
- **Crosswalks** to the Agentic Top 10, the Agent Control Standard, CycloneDX’s Bill of Behaviors work, the AI Agent Security cheat sheet, the AI Exchange and OpenCRE.
- **An About set**: charter, governance, guiding principles with vendor neutrality, supporters, a dated history, branding.
- **A written governance model**, with a waiting period for objections and a named tie-break.
- **An adopters’ group**, where companies that sell on the method, ours included, advise without steering.
- **Free, public, scheduled meetings**, on the OWASP calendar, recorded.
- **A try-it path** from the landing page to one live template ABP.
- **The DCO** for contributions, as OWASP recommends.
- **Contributors named** in the released work, with their organisations.

## Patterns we saw, and will not repeat.

- **A version on the owasp.org page that differs from the one on the project’s own site.** Seen on one project on the day we read it. Generate the page’s version field from the release.
- **A sponsorship contact who is no longer a leader.** Route sponsorship to a role address, through the Foundation.
- **Moving a repository without a forwarding note.** The LLM Top 10’s old repository says where work moved and stays up so that links keep working. Do that.
- **Vendor logos or vendor-written text inside the deliverable.**
- **A single leader, or leaders from one employer only.**
- **Unversioned identifiers.** ASVS calls its own unversioned ids problematic.
- **Money or agreements at project level.** The policy forbids both.

## The application, field by field.

What OWASP asks for, what we would answer, and the gates before anything is sent.
