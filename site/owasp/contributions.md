<!-- Generated from owasp/contributions.html by scripts/site/generate.mjs. Edit the page, not this file. -->

# RiskMandate — OWASP Agent Behaviour Policies: what moves

The contribution inventory for the proposed OWASP project: 82 assets from riskmandate.ai and the sgit sites, each with its source, licence, proposed action and rights status.

Source: https://riskmandate.ai/owasp/contributions.html

---

# Eighty-two assets, each decided on its own row.

The contribution inventory: everything RiskMandate and the sgit sites have published about the Agent Behaviour Policy, where it lives, what licence it says it carries, and whether we propose to contribute it, rewrite it first, defer it, or keep it out. A footer is not proof of rights, so every row is _unresolved_ until somebody has checked it.

**As at:** 8 October 2026. **Where it stands:** preparing the application; nothing sent to OWASP

**The file:** [contribution-inventory.csv](/owasp/contribution-inventory.csv), the source of the tables below. Read on 8 October 2026 from this repository and from the sgit sites with a plain HTTP fetch.

## Four answers, and none of them is final.

### 31 of 82 assets

Moves as it is, once its rights are checked.

### 13 of 82 assets

The idea moves; the text is rewritten for a neutral reader first.

### 11 of 82 assets

Not now: it needs somebody's consent, or it is not the ABP.

### 27 of 82 assets

Stays with RiskMandate: commercial, confidential, personal or infrastructure.

## The material to move is mostly on abp.sgit.ai.

- **The model lives at abp.sgit.ai, version 0.12.1.** Its vocabulary is one JSON pack at [abp.sgit.ai/data/index.json](https://abp.sgit.ai/data/index.json), stated CC BY 4.0: 23 capabilities, 4 barriers, 3 undo classes, 17 profiles, 16 mandates and 18 stored deltas. It has 81 model pages, a seven-part documentation pack including the hard rules and the measuring prompt, five worked examples and 23 version notes. That, not the copies in this repository, is what the project should start from.
- **The vaults here are pinned at 0.3.0**, copied on 15 September. They are the sixteen template examples. Every one is at status _template_; rows are measured on the thing itself in two (`claude-gmail-connector`, 4 of 6; `n8n-owner-api-key`, 7 of 8) and observed in two more (`claude-code-web`, `github-actions`). The rest are documented from vendor pages or derived.
- **There is no JSON Schema file.** `abp/profile/v1` and `abp/mandate/v1` exist as `type` values in the data. Writing the schemas is new work, and the first deliverable of the specification.
- **The delta build** in `scripts/site/build-abp-vault.mjs` recomputes the delta from the grant and the mandate and refuses to build if it disagrees with the published one. Its core is the reference tool; the licence assembly and the store and sgit coupling come out first.
- **There is no OWASP mapping in any vault.** The standards graphs in the vaults cover ATT&CK, the EU AI Act and GDPR. The OWASP material that exists is on this site: [OWASP, as a graph](/owasp-graph.html), 181 nodes and 62 edges read from OWASP’s pages on 24 September, already marked as offered to OWASP to take.
- **The “stuff on sgit to move”** the lead mentioned is the model, the data, the documentation pack and the examples on abp.sgit.ai. There is no `/owasp/` page there (it returns 404). risks.sgit.ai maps to SAMM, ASVS, WSTG and Threat Dragon, but it is a maturity scale with levels, so it stays out of a project that never scores.

## What the licences say, and what they do not prove.

| Finding | What it means | Who decides |
| --- | --- | --- |
| Code here is Apache-2.0, in the root `LICENSE` | Acceptable to OWASP as it is | — |
| Pages and template ABPs say CC BY 4.0, in the footer and in each vault’s generated `LICENCE.md`; abp.sgit.ai, risks.sgit.ai and standards.sgit.ai say the same | Acceptable to OWASP (a Creative Commons licence). But **no CC BY licence file exists in the repository**; one is added before transfer | The leads |
| Paid copies of a vault carry a commercial licence that names the copyright as RiskMandate’s | The contribution needs the company’s sign-off, not one person’s. The commercial licence text itself stays out | RiskMandate, as a company |
| The n8n measurement was made by an early beta user’s agent; three cases on abp.sgit.ai are real people’s estates | Deferred until those people agree, in writing | The people concerned |
| The abp.sgit.ai source repository, `SGit-AI/SGit-AI__Website__ABP`, was not readable from this session | Its licence file is unchecked. A row from it stays unresolved until somebody reads it | The leads |
| Vendor marks in `logos.json`; vendors’ product names throughout | Logos stay out. Names stay, as facts, under rule five: no verdict on a named third party | — |
| Much of the text was drafted by agents | The brief’s rule: do not assume agent-generated content is free of third-party material. Quotes are short and sourced by design; each moved document is read once more for that | The reviewer of each asset |
| OWASP projects often use CC BY-SA 4.0 for documents | CC BY 4.0 is permitted. Moving to BY-SA is a choice, not a requirement | The leads |

## The inventory, by proposed action.

Ids: `A` abp.sgit.ai and the other sgit sites, `R` the schemas and vocabulary here, `V` the vaults, `S` scripts and tests, `D` documents, `P` pages, `O` OWASP material already here, `X` what stays with RiskMandate.

### Contribute 31

| Id | Asset | Where it is now | Type | Licence today | Coupling | Rights | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| A01 | The ABP model (four objects, grammar, barrier, delta, graph rules) | [https://abp.sgit.ai/model/](https://abp.sgit.ai/model/)abp.sgit.ai (repo SGit-AI/SGit-AI__Website__ABP) | specification | CC BY 4.0 (page footer; data/index.json) | low | unresolved | Canonical source; supersedes repo copies. Repo licence of SGit-AI__Website__ABP not verified (GitHub not attached to session) |
| A02 | Published vocabulary pack abp/pack/v1 v0.12.1 | [https://abp.sgit.ai/data/index.json (+ capabilities.json, barriers.json, undo-classes.json, evidence-tiers.json)](https://abp.sgit.ai/data/index.json)abp.sgit.ai (repo SGit-AI/SGit-AI__Website__ABP) | data/vocabulary | CC BY 4.0 (stated in pack) | none | unresolved | Core of an OWASP project. Pack says no score anywhere |
| A03 | Published profiles, mandates, stored deltas, graph, lexicon, bridges | [https://abp.sgit.ai/data/{profiles,mandates,deltas,graph,lexicon,bridges,universes,gaps,facts}/](https://abp.sgit.ai/data/{profiles,mandates,deltas,graph,lexicon,bridges,universes,gaps,facts}/)abp.sgit.ai (repo SGit-AI/SGit-AI__Website__ABP) | data | CC BY 4.0 | low | unresolved | Check bridges for third-party standard text (rule 7) |
| A04 | RiskMandate-contributed shapes (8 shapes, 42 rows) | [https://abp.sgit.ai/data/contributed/riskmandate/manifest.json](https://abp.sgit.ai/data/contributed/riskmandate/manifest.json)abp.sgit.ai (repo SGit-AI/SGit-AI__Website__ABP) | data | CC BY 4.0 | low | unresolved | Same material as repo vaults; contribute once, from one place |
| A05 | Foundation document: What is an Agent Behaviour Policy | [https://abp.sgit.ai/what-is-an-abp/ ; https://abp.sgit.ai/docs/briefs/v0.33.70__foundation__...](https://abp.sgit.ai/what-is-an-abp/)abp.sgit.ai (repo SGit-AI/SGit-AI__Website__ABP) | documentation | CC BY 4.0 | low | unresolved | Natural OWASP project charter text |
| A06 | Docs pack (start here, what to build, conventions, model, first examples, hard rules, the prompt) | [https://abp.sgit.ai/docs/pack/00__START-HERE ... 06__THE-PROMPT](https://abp.sgit.ai/docs/pack/00__START-HERE)abp.sgit.ai (repo SGit-AI/SGit-AI__Website__ABP) | documentation | CC BY 4.0 | low | unresolved | Hard rules map to repo CLAUDE.md rules 1-8 |
| A08 | Worked examples: browser extension, ChatGPT web, Claude Code CLI on/off, GitHub Actions | [https://abp.sgit.ai/examples/ (5 examples)](https://abp.sgit.ai/examples/)abp.sgit.ai (repo SGit-AI/SGit-AI__Website__ABP) | examples | CC BY 4.0 | low | unresolved | Vendor-named; facts and dates only |
| A09 | Guided flows: Gmail, cost policy, desktop | [https://abp.sgit.ai/gmail/ ; /cost/ ; /desktop/](https://abp.sgit.ai/gmail/)abp.sgit.ai (repo SGit-AI/SGit-AI__Website__ABP) | documentation | CC BY 4.0 | low | unresolved | Cost flow may lean on pricing language; review |
| A12 | Model release history | [https://abp.sgit.ai/versions/ (23)](https://abp.sgit.ai/versions/)abp.sgit.ai (repo SGit-AI/SGit-AI__Website__ABP) | changelog | CC BY 4.0 | none | unresolved | Keep as provenance of the vocabulary |
| V01 | Template ABP vault: browser-extension | `site/vaults/browser-extension/`Risk-Mandate/riskmandate.ai | template ABP (vault) | CC BY 4.0 (LICENCE.md, generated) | low | unresolved | status=template; vocabulary v0.3.0; as_at 2026-09-15/16. Contribute data/ (grant, mandate, delta, scenarios, consequences, assets, barrier-holders) + the .md documents; strip LICENCE.md commercial section, app.link.json/read key, dist zip |
| V02 | Template ABP vault: chatgpt-web | `site/vaults/chatgpt-web/`Risk-Mandate/riskmandate.ai | template ABP (vault) | CC BY 4.0 (LICENCE.md, generated) | low | unresolved | status=template; vocabulary v0.3.0; as_at 2026-09-15/16. Contribute data/ (grant, mandate, delta, scenarios, consequences, assets, barrier-holders) + the .md documents; strip LICENCE.md commercial section, app.link.json/read key, dist zip |
| V03 | Template ABP vault: claude-code-cli | `site/vaults/claude-code-cli/`Risk-Mandate/riskmandate.ai | template ABP (vault) | CC BY 4.0 (LICENCE.md, generated) | low | unresolved | status=template; vocabulary v0.3.0; as_at 2026-09-15/16. Contribute data/ (grant, mandate, delta, scenarios, consequences, assets, barrier-holders) + the .md documents; strip LICENCE.md commercial section, app.link.json/read key, dist zip |
| V04 | Template ABP vault: claude-code-cli-confirmations-off | `site/vaults/claude-code-cli-confirmations-off/`Risk-Mandate/riskmandate.ai | template ABP (vault) | CC BY 4.0 (LICENCE.md, generated) | low | unresolved | status=template; vocabulary v0.3.0; as_at 2026-09-15/16. Contribute data/ (grant, mandate, delta, scenarios, consequences, assets, barrier-holders) + the .md documents; strip LICENCE.md commercial section, app.link.json/read key, dist zip |
| V05 | Template ABP vault: claude-code-web | `site/vaults/claude-code-web/`Risk-Mandate/riskmandate.ai | template ABP (vault) | CC BY 4.0 (LICENCE.md, generated) | low | unresolved | status=template; vocabulary v0.3.0; as_at 2026-09-15/16. Contribute data/ (grant, mandate, delta, scenarios, consequences, assets, barrier-holders) + the .md documents; strip LICENCE.md commercial section, app.link.json/read key, dist zip |
| V06 | Template ABP vault: claude-desktop | `site/vaults/claude-desktop/`Risk-Mandate/riskmandate.ai | template ABP (vault) | CC BY 4.0 (LICENCE.md, generated) | low | unresolved | status=template; vocabulary v0.3.0; as_at 2026-09-15/16. Contribute data/ (grant, mandate, delta, scenarios, consequences, assets, barrier-holders) + the .md documents; strip LICENCE.md commercial section, app.link.json/read key, dist zip |
| V07 | Template ABP vault: claude-gmail-connector | `site/vaults/claude-gmail-connector/`Risk-Mandate/riskmandate.ai | template ABP (vault) | CC BY 4.0 (LICENCE.md, generated) | low | unresolved | status=template; vocabulary v0.3.0; as_at 2026-09-15/16. Contribute data/ (grant, mandate, delta, scenarios, consequences, assets, barrier-holders) + the .md documents; strip LICENCE.md commercial section, app.link.json/read key, dist zip; only vault with a licence block in vault.json (kind cc-by-4.0, points to store ledger) |
| V08 | Template ABP vault: claude-m365-connector | `site/vaults/claude-m365-connector/`Risk-Mandate/riskmandate.ai | template ABP (vault) | CC BY 4.0 (LICENCE.md, generated) | low | unresolved | status=template; vocabulary v0.3.0; as_at 2026-09-15/16. Contribute data/ (grant, mandate, delta, scenarios, consequences, assets, barrier-holders) + the .md documents; strip LICENCE.md commercial section, app.link.json/read key, dist zip |
| V09 | Template ABP vault: claude-web-connectors | `site/vaults/claude-web-connectors/`Risk-Mandate/riskmandate.ai | template ABP (vault) | CC BY 4.0 (LICENCE.md, generated) | low | unresolved | status=template; vocabulary v0.3.0; as_at 2026-09-15/16. Contribute data/ (grant, mandate, delta, scenarios, consequences, assets, barrier-holders) + the .md documents; strip LICENCE.md commercial section, app.link.json/read key, dist zip |
| V10 | Template ABP vault: dropbox-mcp | `site/vaults/dropbox-mcp/`Risk-Mandate/riskmandate.ai | template ABP (vault) | CC BY 4.0 (LICENCE.md, generated) | low | unresolved | status=template; vocabulary v0.3.0; as_at 2026-09-15/16. Contribute data/ (grant, mandate, delta, scenarios, consequences, assets, barrier-holders) + the .md documents; strip LICENCE.md commercial section, app.link.json/read key, dist zip |
| V11 | Template ABP vault: github-actions | `site/vaults/github-actions/`Risk-Mandate/riskmandate.ai | template ABP (vault) | CC BY 4.0 (LICENCE.md, generated) | low | unresolved | status=template; vocabulary v0.3.0; as_at 2026-09-15/16. Contribute data/ (grant, mandate, delta, scenarios, consequences, assets, barrier-holders) + the .md documents; strip LICENCE.md commercial section, app.link.json/read key, dist zip |
| V12 | Template ABP vault: gmail-readonly | `site/vaults/gmail-readonly/`Risk-Mandate/riskmandate.ai | template ABP (vault) | CC BY 4.0 (LICENCE.md, generated) | low | unresolved | status=template; vocabulary v0.3.0; as_at 2026-09-15/16. Contribute data/ (grant, mandate, delta, scenarios, consequences, assets, barrier-holders) + the .md documents; strip LICENCE.md commercial section, app.link.json/read key, dist zip |
| V13 | Template ABP vault: google-drive-readonly | `site/vaults/google-drive-readonly/`Risk-Mandate/riskmandate.ai | template ABP (vault) | CC BY 4.0 (LICENCE.md, generated) | low | unresolved | status=template; vocabulary v0.3.0; as_at 2026-09-15/16. Contribute data/ (grant, mandate, delta, scenarios, consequences, assets, barrier-holders) + the .md documents; strip LICENCE.md commercial section, app.link.json/read key, dist zip |
| V14 | Template ABP vault: google-workspace-mcp | `site/vaults/google-workspace-mcp/`Risk-Mandate/riskmandate.ai | template ABP (vault) | CC BY 4.0 (LICENCE.md, generated) | low | unresolved | status=template; vocabulary v0.3.0; as_at 2026-09-15/16. Contribute data/ (grant, mandate, delta, scenarios, consequences, assets, barrier-holders) + the .md documents; strip LICENCE.md commercial section, app.link.json/read key, dist zip |
| V15 | Template ABP vault: n8n-owner-api-key | `site/vaults/n8n-owner-api-key/`Risk-Mandate/riskmandate.ai | template ABP (vault) | CC BY 4.0 (LICENCE.md, generated) | low | unresolved | status=template; vocabulary v0.3.0; as_at 2026-09-15/16. Contribute data/ (grant, mandate, delta, scenarios, consequences, assets, barrier-holders) + the .md documents; strip LICENCE.md commercial section, app.link.json/read key, dist zip; measured on a sandbox by an early beta user's agent: confirm consent |
| V16 | Template ABP vault: scheduled-job | `site/vaults/scheduled-job/`Risk-Mandate/riskmandate.ai | template ABP (vault) | CC BY 4.0 (LICENCE.md, generated) | low | unresolved | status=template; vocabulary v0.3.0; as_at 2026-09-15/16. Contribute data/ (grant, mandate, delta, scenarios, consequences, assets, barrier-holders) + the .md documents; strip LICENCE.md commercial section, app.link.json/read key, dist zip |
| V17 | Vault template and MAP-A-GRANT prompt | `site/vaults/_template/ (MAP-A-GRANT.md, AGENTS.md, SKILL.md, data/assets.json, consequences.json, barrier-holders.json, standards/)`Risk-Mandate/riskmandate.ai | template/prompt | CC BY 4.0 | low | unresolved | LICENCE.template.md (commercial licence body) excluded; see R10 |
| D02 | direction__abp-as-a-graph-and-stakeholder-views | `docs/briefs/direction__abp-as-a-graph-and-stakeholder-views.md`Risk-Mandate/riskmandate.ai | design brief | Apache-2.0 repo (docs not separately licensed) | low | unresolved | Behaviours as nodes, barrier per path, views per audience |
| D04 | direction__the-grant-has-storeys-and-the-vault-opens-on-the-audience | `docs/briefs/direction__the-grant-has-storeys-and-the-vault-opens-on-the-audience.md`Risk-Mandate/riskmandate.ai | design brief | Apache-2.0 repo (docs not separately licensed) | low | unresolved | Grant storeys: credential/client/etc |
| D09 | review__first-measured-abp-n8n-owner-key | `docs/briefs/review__first-measured-abp-n8n-owner-key.md`Risk-Mandate/riskmandate.ai | design brief | Apache-2.0 repo (docs not separately licensed) | low | unresolved | Evidence tiers worked through on a measured grant |
| D10 | research__connector-grants-open-questions | `docs/briefs/research__connector-grants-open-questions.md`Risk-Mandate/riskmandate.ai | design brief | Apache-2.0 repo (docs not separately licensed) | low | unresolved | Research method: read, quote, date vendor pages; never test |
| O01 | OWASP, as a graph | `site/owasp-graph.html ; site/business-case/owasp/graph.json`Risk-Mandate/riskmandate.ai | data + web page | CC BY 4.0; 'Offered to OWASP: take it' | low | unresolved | Contribute nodes/edges; the bridge is RiskMandate's reading of the RiskGraph model: rewrite as an ABP-primitive mapping or drop. Items titles only (rule 7 ok) |

### Rewrite 13

| Id | Asset | Where it is now | Type | Licence today | Coupling | Rights | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| A07 | Model design briefs | [https://abp.sgit.ai/docs/briefs/ (13 briefs v0.4.0-v0.33.71)](https://abp.sgit.ai/docs/briefs/)abp.sgit.ai (repo SGit-AI/SGit-AI__Website__ABP) | documentation | CC BY 4.0 | high | unresolved | Dev/arch briefs contribute; the 4 strategy briefs (insurer, sell the correction, exclusions, consent) are commercial framing: exclude or rewrite |
| R02 | Grant schema in use: abp/profile/v1 | `site/vaults/*/data/grant.json (type abp/profile/v1)`Risk-Mandate/riskmandate.ai | schema (implicit) | CC BY 4.0 | low | unresolved | No standalone JSON Schema file exists; write one for OWASP |
| R03 | Mandate schema in use: abp/mandate/v1 | `site/vaults/*/data/mandate.json (type abp/mandate/v1)`Risk-Mandate/riskmandate.ai | schema (implicit) | CC BY 4.0 | low | unresolved | No standalone JSON Schema file; write one |
| V18 | Standards mini-graphs (ATT&CK, EU AI Act, GDPR) | `site/vaults/_template/data/standards/{attack,eu-ai-act,gdpr}.json`Risk-Mandate/riskmandate.ai | data/mapping | CC BY 4.0 (own work); names belong to MITRE/EU | low | unresolved | No OWASP mini-graph exists in vaults: add LLM Top 10 / Agentic Top 10 as a new mini-graph (gap) |
| V19 | The ABP reading app (renderer + loader) | `site/vaults/_app/ (index.html renderer, loader.html, versions/)`Risk-Mandate/riskmandate.ai | code | Apache-2.0 | high | unresolved | Tied to sgit/SG Send vault bridge and Licence to Operate (insurance) tab; make host-agnostic or defer |
| S01 | Vault generator: derives delta, writes documents | `scripts/site/build-abp-vault.mjs (779 lines)`Risk-Mandate/riskmandate.ai | code | Apache-2.0 | high | unresolved | Delta derivation is the contributable core; licence assembly, store links, sgit paths must be stripped |
| S05 | Vault app tests | `tests/site/test_vault_app.mjs`Risk-Mandate/riskmandate.ai | tests | Apache-2.0 | high | unresolved | Port the delta and no-score/no-write-credential checks |
| S06 | Delta conformance check per vault | `package.json 'check' loop: build-abp-vault.mjs <slug> --check`Risk-Mandate/riskmandate.ai | CI | Apache-2.0 | low | unresolved | Good CI pattern for an OWASP repo |
| D01 | direction__abp-at-the-centre | `docs/briefs/direction__abp-at-the-centre.md`Risk-Mandate/riskmandate.ai | design brief | Apache-2.0 repo (docs not separately licensed) | high | unresolved | Naming rules and honest-to-say list are portable; selling content is not |
| D03 | direction__consequences-assets-and-the-vault-as-a-website | `docs/briefs/direction__consequences-assets-and-the-vault-as-a-website.md`Risk-Mandate/riskmandate.ai | design brief | Apache-2.0 repo (docs not separately licensed) | low | unresolved | Consequence layer; standards as mini-graphs |
| D14 | ABP model, condensed | `.claude/onboarding/02-abp-model.md`Risk-Mandate/riskmandate.ai | documentation | Apache-2.0 repo | low | unresolved | Good README seed; stale vs v0.12.1 |
| D15 | The non-optional rules (no score, ABP naming, never test others' systems, no verdict, no conformity language, no standards text, no manufactured assurance) | `CLAUDE.md rules 1-8`Risk-Mandate/riskmandate.ai | governance | Apache-2.0 | none | unresolved | Core of an OWASP project's contribution guide |
| P01 | Explainer pages for the ABP | `site/abp.html ; site/article-what-is-an-abp.html ; site/grant-gap.html ; site/how-it-works.html`Risk-Mandate/riskmandate.ai | web pages | CC BY 4.0 (footer) | high | unresolved | Content good; mixed with store CTAs |

### Defer 11

| Id | Asset | Where it is now | Type | Licence today | Coupling | Rights | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| A10 | Elicited cases of real users' estates | [https://abp.sgit.ai/cases/ (beta-001, session-001, estate-002)](https://abp.sgit.ai/cases/)abp.sgit.ai (repo SGit-AI/SGit-AI__Website__ABP) | case data | CC BY 4.0 (as published) | low | unresolved | Real beta users: needs explicit consent before moving to OWASP |
| A11 | ABP model articles | [https://abp.sgit.ai/articles/ (16)](https://abp.sgit.ai/articles/)abp.sgit.ai (repo SGit-AI/SGit-AI__Website__ABP) | articles | CC BY 4.0 | low | unresolved | Useful as project blog/history; review for RiskMandate promotion |
| A13 | What can it do? game + upstream capability map | [https://what-can-it-do.games.sgit.ai/](https://what-can-it-do.games.sgit.ai/)what-can-it-do.games.sgit.ai | app/data | CC BY 4.0 (stated in vocabulary README) | low | unresolved | Game has a points score for the player (not the ABP) and a Licence to Operate (insurance) page; upstream map itself could contribute |
| A14 | RAMM acceptance maturity model with OWASP crosswalks | [https://risks.sgit.ai/ramm/](https://risks.sgit.ai/ramm/)risks.sgit.ai | specification | CC BY 4.0 unless stated | high | unresolved | Not ABP; carries levels (a maturity scale) so must stay out of an ABP project (rule 1) |
| A15 | Standards as addressable provisions (method) | [https://standards.sgit.ai/](https://standards.sgit.ai/)standards.sgit.ai | method | CC BY 4.0 | low | unresolved | Possible method for OWASP list mapping; not ABP itself |
| S04 | PDF rendering of a vault | `scripts/site/render-abp-vault-pdf.mjs`Risk-Mandate/riskmandate.ai | code | Apache-2.0 | high | unresolved |  |
| D05 | direction__one-rule-a-stranger-can-paste-is-the-way-in | `docs/briefs/direction__one-rule-a-stranger-can-paste-is-the-way-in.md`Risk-Mandate/riskmandate.ai | design brief | Apache-2.0 repo (docs not separately licensed) | high | unresolved | Rule base under site/rules/ not yet built |
| D08 | architecture__vaults-in-vaults-for-behaviour-policies | `docs/briefs/architecture__vaults-in-vaults-for-behaviour-policies.md`Risk-Mandate/riskmandate.ai | design brief | Apache-2.0 repo (docs not separately licensed) | high | unresolved | sgit-specific delivery |
| P03 | RiskMandate's own agents' behaviour policies | `site/team/ (publisher.html, studio.html)`Risk-Mandate/riskmandate.ai | example ABPs | CC BY 4.0 | high | unresolved | Real internal deployment; good dogfood example if lead agrees |
| P04 | Lab editions on ABP | `site/lab-abp-requests.html ; lab-connector-grants.html ; lab-shape-collector.html`Risk-Mandate/riskmandate.ai | web pages/research | CC BY 4.0 | high | unresolved | Research record; RiskMandate-branded |
| P05 | Articles and stories | `site/article-*.html (8) ; site/stories/ (9)`Risk-Mandate/riskmandate.ai | articles | CC BY 4.0 | high | unresolved | Awareness material; RiskMandate voice and CTAs |

### Exclude 27

| Id | Asset | Where it is now | Type | Licence today | Coupling | Rights | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| A16 | OWASP and the summits | [https://open-source.sgit.ai/owasp/index.html](https://open-source.sgit.ai/owasp/index.html)open-source.sgit.ai | history/biography | CC BY 4.0 | none | excluded | Personal history; not project material |
| A17 | Existing OWASP ties: owasp-sbot org (Issues-FS, osbot-utils, MGraph-DB) | [https://sgit.ai/articles/ ; graphs.sgit.ai llms.txt ; coding.sgit.ai llms.txt](https://sgit.ai/articles/)sgit.ai / graphs.sgit.ai / coding.sgit.ai | reference | Apache-2.0 (code) | none | excluded | Precedent only; already OWASP |
| A18 | The store (levels, checkout, ledger, commercial licence wording) | [https://store.sgit.ai/](https://store.sgit.ai/)store.sgit.ai | commercial | proprietary/commercial | high | excluded | Commercial |
| R01 | Pinned vocabulary copies (v0.3.0) | `site/vaults/*/data/vocabulary/ (README, capabilities.json, barriers.json, undo-classes.json, evidence-tiers.json)`Risk-Mandate/riskmandate.ai | data/vocabulary | CC BY 4.0 | none | excluded | Duplicate of A02 at an older version (v0.3.0 vs v0.12.1); contribute from abp.sgit.ai instead |
| V20 | Vault catalogue with public read keys (vid, key, endpoint dev.send.sgraph.ai) | `site/vaults/index.json ; site/vaults/*/app.link.json`Risk-Mandate/riskmandate.ai | infrastructure/config | Apache-2.0 | high | excluded | Read keys are public by design but are RiskMandate/sgit infra |
| V21 | Published upstream delta for each shape | `site/vaults/*/data/upstream/delta.json`Risk-Mandate/riskmandate.ai | data | CC BY 4.0 | none | excluded | Duplicate of A03 |
| S02 | Site page builder for vault directory and per-vault pages | `scripts/site/build-abp-pages.mjs ; scripts/site/abp/abp-vaults.js, abp.css`Risk-Mandate/riskmandate.ai | code | Apache-2.0 | high | excluded | Site chrome and store links |
| S03 | Vendor marks (Simple Icons, CC0) | `scripts/site/abp/logos.json`Risk-Mandate/riskmandate.ai | assets | CC0 paths; trademarks of vendors | none | excluded | Trademark use; do not carry into OWASP |
| D06 | direction__use-case-driven-policies-and-the-prompt-workflow | `docs/briefs/direction__use-case-driven-policies-and-the-prompt-workflow.md`Risk-Mandate/riskmandate.ai | design brief | Apache-2.0 repo (docs not separately licensed) | high | excluded | Pricing/store levels |
| D07 | direction__mvp-vault-and-the-reading-app | `docs/briefs/direction__mvp-vault-and-the-reading-app.md`Risk-Mandate/riskmandate.ai | design brief | Apache-2.0 repo (docs not separately licensed) | high | excluded | Dual licence and paid levels |
| D11 | review__vault-pages-vs-the-vault | `docs/briefs/review__vault-pages-vs-the-vault.md`Risk-Mandate/riskmandate.ai | design brief | Apache-2.0 repo (docs not separately licensed) | high | excluded | Site-specific |
| D12 | workflow__buying-a-policy-for-claude-on-gmail | `docs/briefs/workflow__buying-a-policy-for-claude-on-gmail.md`Risk-Mandate/riskmandate.ai | design brief | Apache-2.0 repo (docs not separately licensed) | high | excluded | Purchase workflow |
| D13 | workflow__abp-vaults-for-people-we-know | `docs/briefs/workflow__abp-vaults-for-people-we-know.md`Risk-Mandate/riskmandate.ai | design brief | Apache-2.0 repo (docs not separately licensed) | high | excluded | Person vaults; personal data |
| D16 | Lead's spoken brief: OWASP and open source first | `site/assets/briefs/2026-09-24__transcript__owasp-and-open-source-first.txt (brief D17)`Risk-Mandate/riskmandate.ai | internal brief | Apache-2.0/CC BY (site) | none | excluded | Provenance for the proposal; internal |
| P02 | Vault directory and per-vault pages | `site/agent-behaviour-policy.html ; site/abp-vault-*.html (16, generated)`Risk-Mandate/riskmandate.ai | web pages (generated) | CC BY 4.0 | high | excluded | Generated + buy links; regenerate from data in OWASP |
| O02 | Business case: OWASP Coraza | `site/business-case-owasp-coraza.html ; site/business-case/cases/owasp-coraza.json`Risk-Mandate/riskmandate.ai | web page + data | CC BY 4.0 | high | excluded | Commercial/insurance framing; could be offered to the Coraza project separately |
| O03 | Business case: OWASP Threat Dragon and pytm | `site/business-case-owasp-threat-dragon.html ; site/business-case/cases/owasp-threat-dragon.json`Risk-Mandate/riskmandate.ai | web page + data | CC BY 4.0 | high | excluded | As O02 |
| O04 | Business case builder and open-source companies list | `scripts/site/build-business-cases.mjs ; site/business-case/companies.json`Risk-Mandate/riskmandate.ai | code/data | Apache-2.0 | high | excluded | Graph renderer part could be reused for O01 |
| O05 | Biographical OWASP mentions | `site/uk-support.json ; site/reviewers/dinis-cruz.json ; site/about.html`Risk-Mandate/riskmandate.ai | reference | CC BY 4.0 | none | excluded | Bio only |
| O06 | Lisbon summit strategy: OWASP bio placeholder | `docs/briefs/summit__lisbon-2026-strategy.md (line 182)`Risk-Mandate/riskmandate.ai | brief | Apache-2.0 | none | excluded | No substantive OWASP content |
| X01 | Pricing and paid-level pages | `site/pricing.html ; abp-reviewed.html ; reviewers.html ; paid-t1..t4.html ; after-payment.html`Risk-Mandate/riskmandate.ai | commercial | CC BY 4.0 | high | excluded | Commercial |
| X02 | Insurance product pages and business cases | `site/insurance.html ; insure-a-program.html ; licence-to-operate.html ; demo-licence-to-operate.html ; acceptable.html ; acceptance.html ; plug.html ; ramm.html ; scenarios.html ; statics.html ; business-case-*.html (18) ; business-cases.html`Risk-Mandate/riskmandate.ai | commercial | CC BY 4.0 | high | excluded | Insurance product; RAMM has levels (scores) |
| X03 | Commercial licence body for paid copies | `site/vaults/_template/LICENCE.template.md ; LICENCE.md commercial sections`Risk-Mandate/riskmandate.ai | legal | proprietary terms | high | excluded | Dual-licence mechanism is RiskMandate's |
| X04 | Customer instance of a template | `vaults-instances/claude-gmail-connector--customer-draft/`Risk-Mandate/riskmandate.ai | customer data | private | high | excluded | Customer data |
| X05 | Stories vault, admin console, agent work files | `stories-vault/ ; site/admin/ ; .claude/work ; .claude/agents ; site/briefs-register.json`Risk-Mandate/riskmandate.ai | internal | n/a | high | excluded | Internal |
| X06 | ABP vaults for people we know (pack) | `packs/abp-for-people/ ; packs/dist/abp-for-people-pack.zip`Risk-Mandate/riskmandate.ai | tooling + personal data | Apache-2.0 | high | excluded | Personal data and keys workflow |
| X07 | Marketing and sales pages | `site/early-access.html ; early-adopters.html ; for-*.html ; partners.html ; work*.html ; summit*.html ; interview-*.html`Risk-Mandate/riskmandate.ai | commercial | CC BY 4.0 | high | excluded |  |

## What it plugs into, across OWASP.

The projects a behaviour policy points at, and the ones that point back: as risks, as controls, and as formats.
