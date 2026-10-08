<!-- Generated from owasp/riskmandate.html by scripts/site/generate.mjs. Edit the page, not this file. -->

# RiskMandate — OWASP Agent Behaviour Policies: the sponsor and the line

How RiskMandate sits beside the proposed OWASP project: what moves and what stays, where the information lives and who manages it, a commercial model others can follow, what OWASP's policy already settles, and the conflict of interest.

Source: https://riskmandate.ai/owasp/riskmandate.html

---

# The sponsor, and where the line is.

RiskMandate originated the Agent Behaviour Policy, publishes it under open licences, and sells services built on it. If OWASP accepts the project, RiskMandate becomes its sponsor and one commercial adopter among any number. This page says what that means, what moves and what stays, who manages what, and how a conflict of interest is handled, so that the line is written before anybody has to ask where it is.

**As at:** 8 October 2026. **Where it stands:** preparing the application; nothing sent to OWASP

## The method is the project’s. The service is ours, and anybody’s.

The method, the grammar, the schemas, the reference build, the template examples and the mappings belong to the OWASP project and are developed in its repository, in the open, by whoever contributes. RiskMandate sponsors the project with the leaders’ time and with the material it has already published. RiskMandate also sells things built on the method: reviewed behaviour policies, a store, an index that scores deployments for people who carry the risk. Any other company may do the same, on the same terms, and the project will say so on its front page. The project does not need RiskMandate to be useful, and the test of that is simple: somebody who has never heard of RiskMandate can produce a complete ABP from the project’s repository alone.

The decision was taken on **8 October 2026** by the two founders, Dinis Cruz and Nimay Parekh. In the lead’s words, the move is simple _“because everything is already published”_ under open licences and the code is freely available, and RiskMandate is _“the sponsor of this project. And yes, we are commercializing some elements of this, but like anybody else could commercialize.”_

## Two columns, decided per asset.

The proposed boundary, from the initiation brief and the inventory. Every asset is decided on its own row on [What moves](/owasp/contributions.html); this is the rule the rows follow.

### The OWASP project

- The method and the vocabulary: four objects, 23 primitives, four barriers, six evidence tiers, three undo classes
- The schemas and the rules that validate them
- The reference build and validator, and its tests
- Generic template ABPs and synthetic examples
- The measuring prompt and its rules of measurement
- Guidance on evidence, reassessment and limitations
- Public mappings to OWASP projects and to standards, by title
- Its own issues, decisions, releases and roadmap

### RiskMandate

- The commercial site, its positioning and its funnels
- Pricing, the four levels, the store and what is paid for
- Reviews of a customer’s deployment and the reviewers who run them
- Customer data, customer vaults, anything confidential
- The Insurability Index, Licence to Operate and the insurance work
- The reading app and the vault hosting on sgit
- Keys, tokens and operational credentials
- Third-party material we have no right to contribute

Not a find-and-replace. A page that says _RiskMandate_ does not become an OWASP page by changing the word. What moves is extracted, stripped of product claims, rewritten for a neutral reader, and keeps its provenance: where it came from, on which date, at which commit.

## One table, kept current.

Today, before anything has moved, and after acceptance, as proposed. A row changes when the thing moves, not when somebody intends it to.

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

## What we sell is a pattern, not a privilege.

The lead’s instruction: propose commercial models that others can follow. Here is what RiskMandate does with the method, written as a pattern, so that a competitor can read it as a manual.

### The method, the examples, the tools

Anybody can measure a grant, write a mandate, build the delta and publish the result, using nothing but the project’s repository. Nothing in the project is gated, metered or held back for a paid tier.

### Doing the work for somebody

Measuring a customer’s deployment, eliciting a mandate from their people, reviewing the result with a named professional, keeping it current when the deployment moves. RiskMandate sells this; a consultancy, an MSSP or a platform vendor can sell the same thing under the same rules.

### Hosting and reading

A vault to keep the ABP in, a reading app, a store. RiskMandate’s run on sgit; others can be built on any storage, because the format is the project’s and not the host’s.

### Scoring, pricing, accepting risk

An index that scores a deployment, an underwriting question set, a risk acceptance signed by a named person. All of these consume an ABP; none is part of it, and none may be written back into it as a score.

**The rules a commercial adopter follows**, ours included, proposed for the project’s front page: say you are an adopter, not the project; never call a product or service OWASP-anything beyond what OWASP’s brand rules allow; never say an ABP is approved, passed or rated by the project; contribute fixes to the method upstream rather than forking the grammar.

## Leadership is personal. Money and contracts go through the Foundation.

Most of the line between a sponsor and an OWASP project is drawn by OWASP’s own Project Policy, not by us. Read on 8 October 2026 at [owasp.org/www-policy/operational/projects](https://owasp.org/www-policy/operational/projects); short phrases quoted.

| The policy says | What it means for RiskMandate |
| --- | --- |
| “Leadership is personal, and not associated with any organization, company, or employer”; two to five leaders, each an OWASP member | Dinis Cruz and Nimay Parekh would lead as people, not as RiskMandate. The project page lists them without the company’s name in the role. |
| Projects “are not permitted to hold any bank accounts” or run an independent donation mechanism | RiskMandate pays nothing to the project directly. If it sponsors with money, it does so through the Foundation, at a published level, like any other supporter. |
| Leaders “cannot sign contracts or enter into agreements with commercial organizations” | No agreement between the project and RiskMandate, ever, signed by the leaders. Anything of that kind is between RiskMandate and the Foundation. |
| Source material “must remain within the foundation” | What is contributed stays with OWASP. RiskMandate keeps the right every licensee has, to use it, and keeps its own products. |
| Projects “must identify as an OWASP project in their branding”, and OWASP branding should be prominent on any other domain | abp.sgit.ai, if it becomes the project’s reading site, carries OWASP’s branding and says it is the OWASP project’s; riskmandate.ai says it originated and contributes to the project, and never that it is the project. |
| Documentation under a Creative Commons licence; code under an OSI licence; the DCO recommended for contributions | CC BY 4.0 and Apache-2.0, which is what is published now, both qualify. Whether to move the documents to CC BY-SA 4.0, as many OWASP projects use, is a decision for the leads. |

## Both leaders founded the sponsor. That is said first, not found later.

OWASP’s rules make leadership personal; they do not make two co-founders of one company independent of it. The research we did on other projects names _leaders all from one employer_ as the pattern to avoid. So:

- **Declared.** Both proposed leaders are co-founders of RiskMandate. The application, the project page and the repository’s governance file say so in one sentence each.
- **A third leader from outside, before launch if we can.** At least one leader with no RiskMandate affiliation. The policy allows up to five. Whether we found one is a line on the tracker.
- **Decisions in public.** A change to the grammar, the schemas or the barrier kinds is an issue and a recorded decision with its reasoning, under a written governance model with a waiting period for objections, never a commit from the sponsor alone.
- **What RiskMandate may and may not do**, written into the governance file: it may sponsor through the Foundation, contribute, and sell services built on the open method. It may not decide a release alone, put its brand in an ABP document or template, or add anything that scores.
- **No sponsor vocabulary.** No primitive, field or example exists because a RiskMandate product needs it. A product need that is also a method need is argued on the method’s merits.
- **The exit path, written now.** If RiskMandate’s priorities and the project’s diverge, the project stays where it is, under its licence and its other leaders, and RiskMandate becomes an adopter. ZAP published each of its moves with the reasons and what stayed the same; we write ours before there is one.
- **Contribution concentration reported.** Once a year, how much of the work came from RiskMandate people, so that the dependence is a number and not an impression.

## Nothing is taken down until there is somewhere to point.

Until the project is accepted and its repository exists, this site and abp.sgit.ai stay the canonical home of the model, and nothing on them is redirected or archived. After acceptance, the model pages point at the project as the source, the vaults name the project’s schema version, and this section becomes the record of how the move was made. Every one of those changes is a step on the [tracker](/owasp/tracker.html) with the lead’s approval against it.

## What we would submit, field by field.

The process as OWASP documents it, the answers we propose, the leaders, and where the project could live.
