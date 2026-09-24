# Briefs written here

> Every document under docs/ on riskmandate.ai, rendered as a page: direction briefs, reviews, workflows, architecture and research, newest first.
> Source: https://riskmandate.ai/admin/briefs/ · noindex · written by scripts/site/build-admin.mjs

**25**documents under docs/*one page each, rendered from the file*

**8**direction briefs*the product and the site*

**4**reviews*read against a named source*

**3**workflows*run once, written to run again*

These were written here, by the agent maintaining the site, in response to [the memos and documents that arrived](../../admin/memos/). Each is read against a named source and dated. Add a file under `docs/` and rerun `build-admin.mjs`: it has a page here and a test fails until it does.

## Newest first

**[A behaviour policy for everybody the lead talks to, made by an agent from a zip](../../admin/briefs/workflow__abp-vaults-for-people-we-know/)**

Users. The product is ready and the objective this quarter is people trying it. A behaviour policy about someone else's example deployment is a demo; one about their organisation, sent the day after a conversation, is an invitation to correct it, which is…24 September 2026 · workflow

**[The reviewer manifest: one source for who does the work, addressed to the store team](../../admin/briefs/workflow__the-reviewer-manifest-and-who-owns-a-person-page/)**

One line: read https://riskmandate.ai/reviewers.json and build the chooser from it, instead of holding a second copy of a real person's biography.22 September 2026 · workflow

**[Nobody buys a policy until they have made a small one, so the next phase is users](../../admin/briefs/direction__the-next-phase-is-users/)**

The store's four levels are a ladder for a customer. The memo asks for the step below the bottom one, whose output is a user:21 September 2026 · direction

**[The menu after the ABP turn: five entries, one product first, and eleven pages out of the nav](../../admin/briefs/direction__the-menu-and-the-page-list-after-the-abp-turn/)**

Seven top-level entries, which is the cap the header can hold at 1100px: Policies (5) · Who it's for (3) · Insurance (8) · Live demos (7) · Lisbon 2026 (1) · Pricing (1) · More (11).18 September 2026 · direction

**[Five synthetic users read the new home page: the word is fixed, the vocabulary is split](../../admin/briefs/review__five-synthetic-users-read-the-new-home-page/)**

The second reading of riskmandate.ai by the same five invented readers found that the first reading's headline finding is gone and two new ones took its place. This page is the review; the runs, the screenshots and the interviews are in the vault,…17 September 2026 · review

**[A grant is a union of capabilities; what the reader needs is the consequences — and the assets that make each one real](../../admin/briefs/direction__consequences-assets-and-the-vault-as-a-website/)**

A consequence layer beside the grant: derived where it can be, authored where it must be, evidence-tiered like everything else, and never a score.16 September 2026 · direction

**[The first MVP vault: `oc433z3m` becomes the product, and the reading app is rebuilt around it](../../admin/briefs/direction__mvp-vault-and-the-reading-app/)**

The store's exploration has three emphases on one shopping model — ABP first, Vault first, Use it — and the vault appears the same way in all three: a panel titled Inside an ABP vault, with a left navigation of eight entries and a reading pane on the right.16 September 2026 · direction

**[The grant has storeys: what the credential permits, what the client exposes, what practice allows — and the vault opens on the audience, not on the data](../../admin/briefs/direction__the-grant-has-storeys-and-the-vault-opens-on-the-audience/)**

Our enforcer test is a control bounds a grant only if it is enforced by something the grant does not include. The vendor's non-exposure passes it: the agent cannot edit Anthropic's connector. So it is a boundary — and treating it as one, without more, is…16 September 2026 · direction

**[Buying a behaviour policy for Claude on one Gmail mailbox: the workflow, run once](../../admin/briefs/workflow__buying-a-policy-for-claude-on-gmail/)**

A call with a customer. Agreed on the call: the deployment is Claude in the browser with the Gmail connector enabled, on one mailbox, and the customer wants the behaviour policy for it. The same day the lead connected the connector on an account they run…16 September 2026 · workflow

**[Vaults in vaults: the application vault is data, the renderer lives once](../../admin/briefs/architecture__vaults-in-vaults-for-behaviour-policies/)**

The renderer never sees which route ran. Its reads for data go through the same bridge or same-origin fetch the loader has, so data/grant.json resolves in this vault, not in the app vault. Booting is: parse the fetched document, move its styles into the…15 September 2026 · architecture

**[The policy is a graph, and every stakeholder gets a projection of it](../../admin/briefs/direction__abp-as-a-graph-and-stakeholder-views/)**

More of this exists than it looks, because the model site made the primitives into ids on day one:15 September 2026 · direction

**[A policy per use case, and the £500 level is a prompt the customer runs](../../admin/briefs/direction__use-case-driven-policies-and-the-prompt-workflow/)**

What the customer does, what we do, and what arrives, so the level-3 page on both sites can say the same thing.15 September 2026 · direction

**[The agents' front door: onboard in ten minutes, and work in parallel without undoing each other](../../admin/briefs/process__agent-onboarding-and-parallel-work/)**

To become useful on this repository, the agent writing this read: the README, the how-the-website-works document, twelve briefs, the markdown twins of the ABP page, the library page, the Lab index, the work page and the agents page, six release notes, the…15 September 2026 · process

**[Connector grants: the open questions, written to be handed to an agent](../../admin/briefs/research__connector-grants-open-questions/)**

Five behaviour-policy vaults for connector shapes, in the directory at abp-vaults.html and each with its own page. None of these shapes is published at abp.sgit.ai; the grants were read from the vendors' own pages on 15 September 2026, quoted rather than…15 September 2026 · research

**[The first measured behaviour policy: an owner API key on a self-hosted n8n, read against the model](../../admin/briefs/review__first-measured-abp-n8n-owner-key/)**

An agent holding an owner-scoped API key on a self-hosted workflow-automation platform was given the earlier, prose version of the policy and asked to find the edges of what the key could do. It did it the right way: built and ran one real AI-agent…15 September 2026 · review

**[The vault pages, read against the vault: show the thing, and stop copying it](../../admin/briefs/review__vault-pages-vs-the-vault/)**

The Licence to Operate demo page opens with the product itself, twice: the vault's app in App Mode, and beneath it the vault browser with the file tree on the left and the same app running under index.html. Both are the official SG/Vault interface, opened…15 September 2026 · review

**[The Design Studio MVPs, read against the workflow that sells a behaviour policy](../../admin/briefs/review__design-studio-mvps-vs-the-selling-workflow/)**

The studio has built the delivery end of the flow well and the selling end against the wrong ladder. Its vault — mandate, grant, computed delta, history, and an HTML plus JSON export the buyer keeps — is Lab 02's stage ten drawn properly, and its hero card…14 September 2026 · review

**[LinkedIn company page — every field, ready to paste](../../admin/briefs/marketing--linkedin-company-page/)**

Copy the values. Where a field needs a judgement call rather than a fact, the recommendation is first and the reasoning is one line under it.12 September 2026

**[Direction change — the Agent Behaviour Policy becomes the primitive](../../admin/briefs/direction__abp-at-the-centre/)**

The Agent Behaviour Policy is not a new product. It is the primitive the rest of RiskMandate was already made of, now named, published, and — critically — sellable this week at ten pounds.11 September 2026 · direction

**[Lisbon messaging — we now have something to sell in the room](../../admin/briefs/summit__lisbon-2026-messaging/)**

The previous strategy brief's problem was that the booth had a demo and no transaction: the game qualified people, the Index took an email, and the sale started after the event. That is no longer true. The Agent Behaviour Policy is a named artefact with a…11 September 2026 · summit

**[Startup Summit Lisbon 2026 — strategy, materials, and the build list](../../admin/briefs/summit__lisbon-2026-strategy/)**

riskmandate.ai is written for a Head of Risk. Lisbon is founders and investors. If we run the site's messaging at the booth it will land as "enterprise GRC vendor" and founders will walk past.9 September 2026 · summit

**[Which published vaults belong on riskmandate.ai](../../admin/briefs/vaults__what-to-add-to-the-site/)**

demos.html embeds three, each with its own page:9 September 2026 · vaults

**[Architecture Brief — Decoupling site structure from content](../../admin/briefs/architecture__structure-content-decoupling/)**

Split riskmandate.ai into two planes with different owners, lifecycles, and quality regimes:4 July 2026 · architecture

**[Implementation Brief — Scenarios pilot (first decoupled content area)](../../admin/briefs/implementation__scenarios-pilot/)**

Move the interactive Risk Scenarios experience to the decoupled model:4 July 2026 · implementation

**[How riskmandate.ai actually works](../../admin/briefs/how-the-website-works/)**

How a page is put together, what happens when the browser loads one, and where each thing lives. Current as of v1.0.0; see the addendum below for what has been added since, and .claude/onboarding/01-map.md for the current map.

## Direction · where the site and the product are going, and why

**[Nobody buys a policy until they have made a small one, so the next phase is users](../../admin/briefs/direction__the-next-phase-is-users/)**

The store's four levels are a ladder for a customer. The memo asks for the step below the bottom one, whose output is a user:21 September 2026 · direction

**[The menu after the ABP turn: five entries, one product first, and eleven pages out of the nav](../../admin/briefs/direction__the-menu-and-the-page-list-after-the-abp-turn/)**

Seven top-level entries, which is the cap the header can hold at 1100px: Policies (5) · Who it's for (3) · Insurance (8) · Live demos (7) · Lisbon 2026 (1) · Pricing (1) · More (11).18 September 2026 · direction

**[A grant is a union of capabilities; what the reader needs is the consequences — and the assets that make each one real](../../admin/briefs/direction__consequences-assets-and-the-vault-as-a-website/)**

A consequence layer beside the grant: derived where it can be, authored where it must be, evidence-tiered like everything else, and never a score.16 September 2026 · direction

**[The first MVP vault: `oc433z3m` becomes the product, and the reading app is rebuilt around it](../../admin/briefs/direction__mvp-vault-and-the-reading-app/)**

The store's exploration has three emphases on one shopping model — ABP first, Vault first, Use it — and the vault appears the same way in all three: a panel titled Inside an ABP vault, with a left navigation of eight entries and a reading pane on the right.16 September 2026 · direction

**[The grant has storeys: what the credential permits, what the client exposes, what practice allows — and the vault opens on the audience, not on the data](../../admin/briefs/direction__the-grant-has-storeys-and-the-vault-opens-on-the-audience/)**

Our enforcer test is a control bounds a grant only if it is enforced by something the grant does not include. The vendor's non-exposure passes it: the agent cannot edit Anthropic's connector. So it is a boundary — and treating it as one, without more, is…16 September 2026 · direction

**[The policy is a graph, and every stakeholder gets a projection of it](../../admin/briefs/direction__abp-as-a-graph-and-stakeholder-views/)**

More of this exists than it looks, because the model site made the primitives into ids on day one:15 September 2026 · direction

**[A policy per use case, and the £500 level is a prompt the customer runs](../../admin/briefs/direction__use-case-driven-policies-and-the-prompt-workflow/)**

What the customer does, what we do, and what arrives, so the level-3 page on both sites can say the same thing.15 September 2026 · direction

**[Direction change — the Agent Behaviour Policy becomes the primitive](../../admin/briefs/direction__abp-at-the-centre/)**

The Agent Behaviour Policy is not a new product. It is the primitive the rest of RiskMandate was already made of, now named, published, and — critically — sellable this week at ten pounds.11 September 2026 · direction

## Workflows · a process run once, written down so it can be run again

**[A behaviour policy for everybody the lead talks to, made by an agent from a zip](../../admin/briefs/workflow__abp-vaults-for-people-we-know/)**

Users. The product is ready and the objective this quarter is people trying it. A behaviour policy about someone else's example deployment is a demo; one about their organisation, sent the day after a conversation, is an invitation to correct it, which is…24 September 2026 · workflow

**[The reviewer manifest: one source for who does the work, addressed to the store team](../../admin/briefs/workflow__the-reviewer-manifest-and-who-owns-a-person-page/)**

One line: read https://riskmandate.ai/reviewers.json and build the chooser from it, instead of holding a second copy of a real person's biography.22 September 2026 · workflow

**[Buying a behaviour policy for Claude on one Gmail mailbox: the workflow, run once](../../admin/briefs/workflow__buying-a-policy-for-claude-on-gmail/)**

A call with a customer. Agreed on the call: the deployment is Claude in the browser with the Gmail connector enabled, on one mailbox, and the customer wants the behaviour policy for it. The same day the lead connected the connector on an account they run…16 September 2026 · workflow

## Reviews · something read against a named source

**[Five synthetic users read the new home page: the word is fixed, the vocabulary is split](../../admin/briefs/review__five-synthetic-users-read-the-new-home-page/)**

The second reading of riskmandate.ai by the same five invented readers found that the first reading's headline finding is gone and two new ones took its place. This page is the review; the runs, the screenshots and the interviews are in the vault,…17 September 2026 · review

**[The first measured behaviour policy: an owner API key on a self-hosted n8n, read against the model](../../admin/briefs/review__first-measured-abp-n8n-owner-key/)**

An agent holding an owner-scoped API key on a self-hosted workflow-automation platform was given the earlier, prose version of the policy and asked to find the edges of what the key could do. It did it the right way: built and ran one real AI-agent…15 September 2026 · review

**[The vault pages, read against the vault: show the thing, and stop copying it](../../admin/briefs/review__vault-pages-vs-the-vault/)**

The Licence to Operate demo page opens with the product itself, twice: the vault's app in App Mode, and beneath it the vault browser with the file tree on the left and the same app running under index.html. Both are the official SG/Vault interface, opened…15 September 2026 · review

**[The Design Studio MVPs, read against the workflow that sells a behaviour policy](../../admin/briefs/review__design-studio-mvps-vs-the-selling-workflow/)**

The studio has built the delivery end of the flow well and the selling end against the wrong ladder. Its vault — mandate, grant, computed delta, history, and an HTML plus JSON export the buyer keeps — is Lab 02's stage ten drawn properly, and its hero card…14 September 2026 · review

## Research · questions written to be handed to an agent

**[Connector grants: the open questions, written to be handed to an agent](../../admin/briefs/research__connector-grants-open-questions/)**

Five behaviour-policy vaults for connector shapes, in the directory at abp-vaults.html and each with its own page. None of these shapes is published at abp.sgit.ai; the grants were read from the vendors' own pages on 15 September 2026, quoted rather than…15 September 2026 · research

## Architecture · how the pieces fit

**[Vaults in vaults: the application vault is data, the renderer lives once](../../admin/briefs/architecture__vaults-in-vaults-for-behaviour-policies/)**

The renderer never sees which route ran. Its reads for data go through the same bridge or same-origin fetch the loader has, so data/grant.json resolves in this vault, not in the app vault. Booting is: parse the fetched document, move its styles into the…15 September 2026 · architecture

**[Architecture Brief — Decoupling site structure from content](../../admin/briefs/architecture__structure-content-decoupling/)**

Split riskmandate.ai into two planes with different owners, lifecycles, and quality regimes:4 July 2026 · architecture

## Process · how the work is done

**[The agents' front door: onboard in ten minutes, and work in parallel without undoing each other](../../admin/briefs/process__agent-onboarding-and-parallel-work/)**

To become useful on this repository, the agent writing this read: the README, the how-the-website-works document, twelve briefs, the markdown twins of the ABP page, the library page, the Lab index, the work page and the agents page, six release notes, the…15 September 2026 · process

## Vaults · which vaults belong here

**[Which published vaults belong on riskmandate.ai](../../admin/briefs/vaults__what-to-add-to-the-site/)**

demos.html embeds three, each with its own page:9 September 2026 · vaults

## Summit · Lisbon 2026

**[Lisbon messaging — we now have something to sell in the room](../../admin/briefs/summit__lisbon-2026-messaging/)**

The previous strategy brief's problem was that the booth had a demo and no transaction: the game qualified people, the Index took an email, and the sale started after the event. That is no longer true. The Agent Behaviour Policy is a named artefact with a…11 September 2026 · summit

**[Startup Summit Lisbon 2026 — strategy, materials, and the build list](../../admin/briefs/summit__lisbon-2026-strategy/)**

riskmandate.ai is written for a Head of Risk. Lisbon is founders and investors. If we run the site's messaging at the booth it will land as "enterprise GRC vendor" and founders will walk past.9 September 2026 · summit

## Implementation · a first step, built

**[Implementation Brief — Scenarios pilot (first decoupled content area)](../../admin/briefs/implementation__scenarios-pilot/)**

Move the interactive Risk Scenarios experience to the decoupled model:4 July 2026 · implementation

## Other documents · how the site works, and the marketing copy

**[LinkedIn company page — every field, ready to paste](../../admin/briefs/marketing--linkedin-company-page/)**

Copy the values. Where a field needs a judgement call rather than a fact, the recommendation is first and the reasoning is one line under it.12 September 2026

**[How riskmandate.ai actually works](../../admin/briefs/how-the-website-works/)**

How a page is put together, what happens when the browser loads one, and where each thing lives. Current as of v1.0.0; see the addendum below for what has been added since, and .claude/onboarding/01-map.md for the current map.
