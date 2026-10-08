<!-- Generated from owasp/charter.html by scripts/site/generate.mjs. Edit the page, not this file. -->

# RiskMandate — OWASP Agent Behaviour Policies: the charter

The proposed charter of OWASP Agent Behaviour Policies: mission, objectives, users, deliverables, non-goals, classification, and the questions it leaves open. A draft, not reviewed by OWASP.

Source: https://riskmandate.ai/owasp/charter.html

---

# What the project is for, and what it will not claim.

The proposed charter of OWASP Agent Behaviour Policies: the mission, the objectives, who it is for, what it ships, and the list of things it does not do. A draft, written on 8 October 2026 from the model as published and the initiation brief the leads commissioned, to be argued with before it is submitted.

**As at:** 8 October 2026. **Where it stands:** preparing the application; nothing sent to OWASP

**Status of this page:** a proposal. Nothing here has been sent to OWASP, and OWASP has not reviewed it.

## Make what an agent can do, and what it was allowed to do, a written thing.

OWASP Agent Behaviour Policies is an open, vendor-neutral method and a set of machine-readable artefacts for writing down, for one AI agent in one deployment, everything it can do, what it was authorised to do, the gap between the two, and what actually stands in the way.Proposed one-paragraph summary, for the application form

An agent is deployed with a credential, a set of tools and a place to run. Together those decide what it _can_ do, and almost nobody has written that down. The people who deployed it know what they _asked_ it to do, and that is usually written down nowhere either. The project gives both a shape: a list of capabilities in a shared grammar, a mandate in the deployer’s words, a gap derived from the two by a build anybody can rerun, and for every row the barrier that stands between the agent and the capability, with the evidence for it.

**It describes and it does not judge.** An Agent Behaviour Policy (ABP) carries no score, rating, level or verdict. The same ABP is harmless in one deployment and dangerous in another, and nothing in the document changed; the deployment did. Anything that scores is a separate thing built on top, by whoever wants to build it.

## Four objects, and the verb on each is the model.

This is the model published at [abp.sgit.ai](https://abp.sgit.ai/model/), version 0.12.1 when read on 8 October 2026, with its vocabulary at [one address](https://abp.sgit.ai/data/index.json) under CC BY 4.0. The sixteen template vaults on this site were built against 0.3.0 and are pinned to it, which is what pinning is for. It is the starting point of the project, not its conclusion: the project’s first job is to let people outside RiskMandate break it.

| Object | What it is | Verb | Who produces it |
| --- | --- | --- | --- |
| The grant | Everything the agent can do, one row per capability, in a grammar of 23 primitives written `verb.object.reach` | **Measured**, or **documented** from the vendor’s own pages, quoted and dated | The deployment shape, the account, the credential. Never typed from memory |
| The mandate | What the agent is authorised and expected to do: wanted, told not to, unstated | **Elicited** | The deployer, in their words. The only file a person writes |
| The delta | Excess (can, not asked), shortfall (asked, cannot), and the part of the excess nothing bounds | **Derived** | The build. Stored with the versions of both inputs, recomputed when either moves, never edited |
| The barrier | What stands between the agent and each capability: none, an expectation, a setting, or a boundary | **Recorded**, per row | Whoever measured the row |

**The enforcer test.** A control bounds a grant only if it is enforced by something the grant does not include. A rule in prose is not a control, and neither is a switch the agent’s own account can flip; a token scope, a branch rule, a sandbox or an egress proxy enforced above the agent is. That one sentence is where most of the value to other OWASP projects lies, because most of them are, or describe, the fourth kind. See [The other OWASP projects](/owasp/ecosystem.html).

## Five objectives for the first year.

### A specification anybody can implement

The four objects, the grammar, the barrier kinds, the evidence tiers and the delta’s computation, written as a specification with JSON schemas, separate from any product that uses them.

### Examples that can be reproduced

Template ABPs for common deployment shapes, each with its inputs, its sources and its open questions, and at least three that a reviewer outside RiskMandate has rebuilt from the inputs.

### Tooling that needs nobody’s account

A validator and the delta build as a reference tool, Apache-2.0, runnable offline. No RiskMandate service, store or vault is needed to use any of it.

### Mappings to the rest of OWASP

Where a capability meets an item of the Agentic Top 10 or the LLM Top 10, and where a barrier is an OWASP control: the Agent Control Standard, Coraza, a threat model in Threat Dragon. Read from their pages, dated, offered to their leaders.

### A place to argue in public

Issues, decisions and the semantic questions still open (is a grant a capability or a delegation? when does a gap go stale?) kept in the open, with the reasoning, so that a disagreement is a record and not a rumour.

## Five readers, one record.

- **Security and platform teams** reviewing an agent before it goes live, or after it already has.
- **Agent developers** saying, before somebody asks, what their agent can reach and where the approval sits.
- **Organisations** recording delegated authority: who allowed what, in which words, on which date.
- **Reviewers and auditors** checking whether the stated limits match the deployed controls, row by row.
- **Maintainers of controls and runtimes** who want to say which rows their product bounds, in a grammar the buyer already holds.

## Deliverables, in the order they are needed.

| Deliverable | Starts from | Licence |
| --- | --- | --- |
| The specification: objects, grammar, barriers, evidence, delta, lifecycle, limitations | the abp.sgit.ai model (v0.12.1) and its seven-part documentation pack, rewritten as a neutral document | CC BY 4.0 |
| JSON schemas: `abp/profile/v1` (the grant), `abp/mandate/v1`, `abp.delta/v1`, the vocabulary files | today these are `type` values in the vault data and pages under abp.sgit.ai/model/schema/; no standalone JSON Schema file exists yet, so this is new work | Apache-2.0 |
| The reference build and validator | `scripts/site/abp/` and `build-abp-vault.mjs` in this repository, extracted from the site | Apache-2.0 |
| Template ABPs for common shapes | the sixteen template vaults, as data, without the RiskMandate reading app | CC BY 4.0 for the documents, Apache-2.0 for the data files |
| The measuring prompt | `MAP-A-GRANT.md`: the prompt that lets an agent holding a credential measure its own grant, and its seven rules of measurement | CC BY 4.0 |
| Mappings to OWASP projects and to standards by title | the [OWASP graph](/owasp-graph.html) and the control business cases on this site | CC BY 4.0 |

The licences are proposals. The repository is Apache-2.0 at the root and the site’s pages say CC BY 4.0 in their footers; whether those statements cover every file that would move, including what agents generated and what third parties wrote, is checked asset by asset on [What moves](/owasp/contributions.html) before anything is transferred.

## Non-goals, written down first.

Each of these is something a reader could reasonably assume, and each is false. Saying so in the charter is cheaper than correcting it later.

- **No score.** Not on an ABP, not on a deployment, not in the data. An index that scores a deployment can be built on top; it is not part of this project.
- **No insurance product**, cover decision or underwriting endorsement.
- **No mark, no badge, no scheme that says an agent is safe.** The project describes; nobody passes it.
- **No hosted service.** No assessment service, no managed vault, no account. RiskMandate sells those, and so may anyone else.
- **No runtime.** Not a control plane, an agent framework or an identity system. Those are barriers the ABP records, and other projects build them.
- **No replacement** for the Agent Control Standard, the Agentic Top 10, ASVS, AISVS or any framework. The ABP points at them.
- **No claim that a document enforces anything.** A behaviour policy is a rule in prose until a boundary bounds it, and it says so about itself.
- **No claim of complete discovery.** A grant is as complete as its evidence, and every row says which tier of evidence it rests on.

## A documentation project with a tool beside it.

Our proposal: a **Documentation** project, with the reference build as supporting code, in the **Builder** category, starting at **Incubator**, the level every new OWASP project starts at. The type and the category are OWASP’s to confirm, and the application says so. The alternative home, an initiative inside the OWASP GenAI Security Project next to the Agent Control Standard and the Agentic Top 10, is set out on [The application](/owasp/application.html#home) with the reasons for each.

## Settled by argument, not by the sponsor.

- **Is a grant a capability or a delegation?** In the model the grant is what the credential and the deployment make possible: measured reach. In ordinary English a grant is something somebody authorised. The initiation brief flags the collision; renaming is on the table and is the community’s call.
- **Is the delta a stored file or a calculation?** The model says both: derived by the build, stored with the versions of both inputs, never edited, recomputed when either moves. The brief reports that public pages describe this differently; the inconsistency is a bug to find and fix before the specification is cut.
- **Four barriers, or a richer control model?** The model’s four kinds answer one question, _does anything outside the agent stop it_. The brief proposes preventive, approval, detective and corrective types, failure behaviour and bypass paths. Both may belong; how they sit together is open.
- **One barrier per row, or one per path?** The same capability through two doors can be bounded on one and not the other. The model is moving to one per path.
- **What a set difference misses.** Two permitted steps can add up to an outcome nobody authorised. The first release must say what its delta detects and what stays a question for a reviewer.

## Who sponsors it, and where the line is.

RiskMandate originated the model and sells services on it. The project has to be useful to somebody who never buys anything from us. How that is kept true is the next page.
