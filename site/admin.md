<!-- Generated from admin.html by scripts/site/generate.mjs. Edit the page, not this file. -->

# RiskMandate — Admin: how this site is run

The index behind riskmandate.ai: the records it keeps, the documents it was built from, the maintenance tooling, and the front door for the agents working on it. Public, because the site is.

Source: https://riskmandate.ai/admin.html

---

# How this site is run, and where everything behind it lives.

riskmandate.ai is a repository. The pages are plain HTML deployed unchanged, the records are files beside them, the design and the direction are briefs in the same tree, and the agents that work on it read a folder written for them. This page is the index a maintainer or an agent starts from. Nothing on it needs a login.

## Everything the site keeps, and where it is kept.

Each of these is a file a program can fetch, rendered by a page a person can read. Where the two disagree, the file is right and the page is stale. None of them is rewritten: they only grow.

[versions.html](versions.html)

Every release since the site began, newest first, with the note somebody wrote for it. A release is declared, never incremented; CI tags the commit it names.

[versions/index.json](versions/index.json)

The index the page renders, and the number every page's header shows. The single place the current version lives.

[synthetic-users.html](synthetic-users.html)

Five invented readers walked through this site one screenshot at a time and interviewed at the end, each starting with no knowledge of RiskMandate. Thirty screenshots, eleven unanswered questions, twelve findings, two of them blocking a sale — and the broken JavaScript it found on two pages before it found anything else.

[the vault itself &nearr;](https://dev.vault.sgraph.ai/en-gb/#a41174009cf6f3019147040ef0c759b6c84c86ffa37eb54af06011c161a12332:o3q6zhtr)

Read-only, with the personas, the protocol, every run record and every screenshot. Everybody in it is invented and the vault says so before you can scroll past it.

[briefs.html](briefs.html)

Every document this site was built from, what it produced and what it did not, with the SHA-256 of each file as received so nothing is worked twice or quietly dropped.

[briefs-register.json](briefs-register.json)

The register itself. Hash the brief you sent and look for it here.

[lab-editions.json](lab-editions.json)

Every dated PDF ever cut of a Lab page, with its digest. A page holds current thinking and changes; an edition is what it said on the day, and is never removed. [The Lab](lab.html) lists them.

[vaults/index.json](vaults/index.json)

The catalogue: every template vault, its vault id and its public read key, the applications asked for and not yet built, and the app vault the renderer lives in. [The library](agent-behaviour-policy.html) is rendered from it.

[llms.txt](llms.txt)

The index for an agent: every page with its title, description and markdown twin.

[llms-full.txt](llms-full.txt)

The whole site as one markdown document.

[.well-known/agent-content.json](.well-known/agent-content.json)

The structured manifest. [The agents page](agents.html) explains all three.

[sitemap.xml](sitemap.xml)

Every published page and nothing that is not one; a test says so.

## What was decided, and why.

The direction, the architecture and the reviews live in the repository under `docs/`, written by the agent that maintains the site and read against a named source. Each is linked here; a test fails the build if one is added and this list is not.

| Document | What it is |
| --- | --- |
| [after-payment.html](after-payment.html) | 15 September. A debrief for the store.sgit.ai team: the four post-sale pages, the link contract per level, what the store has to point at them, what this site guarantees, and what is still open. On the site rather than in `docs/`, so the store's agent can be handed one address. |
| [docs/how-the-website-works.md](https://github.com/Risk-Mandate/riskmandate.ai/blob/dev/docs/how-the-website-works.md) | How a page is put together, the shared modules, the generated files, the pipeline and the tests. Written at v1.0.0, with an addendum for what came after. |
| [docs/briefs/direction__abp-at-the-centre.md](https://github.com/Risk-Mandate/riskmandate.ai/blob/dev/docs/briefs/direction__abp-at-the-centre.md) | 11 September. The Agent Behaviour Policy becomes the primitive the site sells; the label, the record and the prescription; the naming rules; what is honest to say. |
| [docs/briefs/direction__abp-as-a-graph-and-stakeholder-views.md](https://github.com/Risk-Mandate/riskmandate.ai/blob/dev/docs/briefs/direction__abp-as-a-graph-and-stakeholder-views.md) | 15 September. The behaviour policy is a graph: behaviours as addressable nodes, a barrier per path, a view per audience, and projections regenerated from a prompt that ships with the vault. The build order. |
| [docs/briefs/architecture__vaults-in-vaults-for-behaviour-policies.md](https://github.com/Risk-Mandate/riskmandate.ai/blob/dev/docs/briefs/architecture__vaults-in-vaults-for-behaviour-policies.md) | 15 September. The renderer lives once in an app vault; every application vault is data plus a loader; the sub-vault link format, found in the host's own source. |
| [docs/briefs/review__first-measured-abp-n8n-owner-key.md](https://github.com/Risk-Mandate/riskmandate.ai/blob/dev/docs/briefs/review__first-measured-abp-n8n-owner-key.md) | 15 September. The first grant measured on a live instance, read against the model; where the write-up and the vocabulary disagree, and who is right. |
| [docs/briefs/research__connector-grants-open-questions.md](https://github.com/Risk-Mandate/riskmandate.ai/blob/dev/docs/briefs/research__connector-grants-open-questions.md) | 15 September. Five connector vaults at the documented tier, the brief for the agent that settles their open questions, and the queue of five more. |
| [docs/briefs/process__agent-onboarding-and-parallel-work.md](https://github.com/Risk-Mandate/riskmandate.ai/blob/dev/docs/briefs/process__agent-onboarding-and-parallel-work.md) | 15 September. Why the agents' front door exists, what it contains, and the rules for agents working on sibling branches that merge into `dev`. |
| [docs/briefs/direction__use-case-driven-policies-and-the-prompt-workflow.md](https://github.com/Risk-Mandate/riskmandate.ai/blob/dev/docs/briefs/direction__use-case-driven-policies-and-the-prompt-workflow.md) | 15 September. A policy per use case, with Voice Debrief as the first two; and the £500 level of the store as a prompt the customer runs, written down as seven steps. |
| [docs/briefs/review__vault-pages-vs-the-vault.md](https://github.com/Risk-Mandate/riskmandate.ai/blob/dev/docs/briefs/review__vault-pages-vs-the-vault.md) | 15 September. The vault pages read against the vault and against sgit's demo page: show the product in the host, twice; and stop deploying a copy of the vault from this site. |
| [docs/briefs/workflow__buying-a-policy-for-claude-on-gmail.md](https://github.com/Risk-Mandate/riskmandate.ai/blob/dev/docs/briefs/workflow__buying-a-policy-for-claude-on-gmail.md) | 16 September. The purchase workflow run once, for a customer: Claude on one Gmail mailbox. Nine steps from the call to the review trigger, the vault mapped to what the customer does with it, the settings and who can change them, the prompts, and what the run taught. |
| [docs/briefs/review__design-studio-mvps-vs-the-selling-workflow.md](https://github.com/Risk-Mandate/riskmandate.ai/blob/dev/docs/briefs/review__design-studio-mvps-vs-the-selling-workflow.md) | 14 September. The storefront concepts read against the workflow that sells a behaviour policy. |
| [docs/briefs/vaults__what-to-add-to-the-site.md](https://github.com/Risk-Mandate/riskmandate.ai/blob/dev/docs/briefs/vaults__what-to-add-to-the-site.md) | 9 September. Which of the twenty-six public vaults belong on the site, and why the rest do not. |
| [docs/briefs/summit__lisbon-2026-strategy.md](https://github.com/Risk-Mandate/riskmandate.ai/blob/dev/docs/briefs/summit__lisbon-2026-strategy.md) | 9 September, partly superseded. The event, the audiences, the materials and the two days. |
| [docs/briefs/summit__lisbon-2026-messaging.md](https://github.com/Risk-Mandate/riskmandate.ai/blob/dev/docs/briefs/summit__lisbon-2026-messaging.md) | 11 September. What to say in the room now there is something to sell. |
| [docs/briefs/architecture__structure-content-decoupling.md](https://github.com/Risk-Mandate/riskmandate.ai/blob/dev/docs/briefs/architecture__structure-content-decoupling.md) | July. Structure in the repository, content in vaults, decrypted in the visitor's browser. |
| [docs/briefs/implementation__scenarios-pilot.md](https://github.com/Risk-Mandate/riskmandate.ai/blob/dev/docs/briefs/implementation__scenarios-pilot.md) | July. The first decoupled content area, as built at [/scenarios/](scenarios/). |
| [docs/marketing/linkedin-company-page.md](https://github.com/Risk-Mandate/riskmandate.ai/blob/dev/docs/marketing/linkedin-company-page.md) | Every field of the company page, ready to paste. |

## The front door, so the next agent reads less.

Most of the work on this site is done by agents, several at a time, on branches that merge into `dev`. Each one used to read the whole repository to learn it. Now there is a folder written for them, and it is kept current in the same commit as whatever it describes.

[CLAUDE.md](https://github.com/Risk-Mandate/riskmandate.ai/blob/dev/CLAUDE.md)

Read automatically by Claude Code. The ten rules that are not optional, the mechanics in one screen, and the short form of working alongside other agents.

[.claude/onboarding/00-start-here.md](https://github.com/Risk-Mandate/riskmandate.ai/blob/dev/.claude/onboarding/00-start-here.md)

The reading order by task. Ten minutes to being useful.

[.claude/onboarding/02-abp-model.md](https://github.com/Risk-Mandate/riskmandate.ai/blob/dev/.claude/onboarding/02-abp-model.md)

The Agent Behaviour Policy condensed: four objects, four barriers, the 23 primitives, the evidence tiers, the vault, the graph. Replaces five briefs and the model site for most tasks.

[.claude/onboarding/04-rules-of-engagement.md](https://github.com/Risk-Mandate/riskmandate.ai/blob/dev/.claude/onboarding/04-rules-of-engagement.md)

Parallel agents, branches, what conflicts and what to do about it, external state, ownership by surface, and what every merge into `dev` must carry.

[.claude/onboarding/01-map.md](https://github.com/Risk-Mandate/riskmandate.ai/blob/dev/.claude/onboarding/01-map.md)

Every document, page family, script, test and register, one line each.

[.claude/onboarding/03-state-and-next.md](https://github.com/Risk-Mandate/riskmandate.ai/blob/dev/.claude/onboarding/03-state-and-next.md)

Where the site is and the ordered queue of what is next, with the decisions the lead owns.

[.claude/onboarding/05-workflows.md](https://github.com/Risk-Mandate/riskmandate.ai/blob/dev/.claude/onboarding/05-workflows.md)

Recipes: add a page, add a vault, cut a release, cut a Lab edition, write a brief, register a document, merge a branch.

[.claude/briefs/](https://github.com/Risk-Mandate/riskmandate.ai/tree/dev/.claude/briefs)

Task briefs sized for one agent each, with the files each touches so two agents can see whether they would collide.

[.claude/commands/](https://github.com/Risk-Mandate/riskmandate.ai/tree/dev/.claude/commands)

Prompts for the common jobs: onboard, new page, new vault, research a vault, brief from a debrief, release, merge to `dev`, hand over. In Claude Code they are slash commands.

[.claude/work/](https://github.com/Risk-Mandate/riskmandate.ai/tree/dev/.claude/work)

One file per in-flight branch: who is on what, which files, which vaults are built and unpushed. Read before claiming a task; delete on merge.

A rule in prose bounds nothing. These files work because every agent reads them first.

That is the same sentence every behaviour-policy vault says about its own `AGENTS.md`, and it is as true here. The tests and the CI checks are the boundaries; the folder is the telling. People collaborating with us start at [Working with us](work.html) instead.

## No build step, and a few scripts that keep it honest.

`site/` is what is served, byte for byte. The scripts under `scripts/site/` derive the files that must agree with the pages, and every one with a `--check` runs in CI so a page cannot ship with a stale twin, a hand-edited delta or a missing licence line.

| Script | Does | In CI |
| --- | --- | --- |
| generate.mjs | The markdown twin of every page, `sitemap.xml`, `llms.txt`, `robots.txt`, `404.html`, `versions.md`; injects the menu from `pages.json` | yes |
| release.mjs | Cuts a version: the notes stub, the index entry, the version chip on every page, the package version | no |
| new-page.mjs | Scaffolds a page with the current chrome copied from a donor page, so a new page cannot drift from the site it joins | no |
| build-abp-vault.mjs | Derives one behaviour-policy vault from its inputs: the documents, the delta, the validity statement, a deterministic zip, the loader, the history. Refuses to write a delta it cannot reproduce | yes, every vault |
| build-abp-pages.mjs | The library page and one page per vault, from the catalogue and each vault's data | yes |
| render-lab-pdfs.mjs | Cuts a dated PDF edition of a Lab page when its content moved, and registers its digest | check only |
| add-licence-chrome.mjs | The GitHub link in every header and the licence line in every footer | yes |
| sync-modules.mjs | Pushes a change to a shared JS module into every page that inlines it | yes |
| render-abp-vault-pdf.mjsrender-booth-panel.mjsrender-business-card.mjsrender-brand-exports.mjs | Print and download assets, rendered from the pages with a headless browser | no |

- **The tests** are `node --test tests/site/*.mjs`: whole documents, every internal link and anchor, one version and one menu everywhere, the sitemap, the registers against their digests, no read key on a mockup, no write credential anywhere, every document above linked from this page.
- **The pipeline** is `.github/workflows/ci-pipeline.yml`: on a push to `dev`, `qa` or `main` it runs the checks, tags the commit with the version the record declares, and deploys `site/` to GitHub Pages. Any of the three deploys the one live site.
- **Locally**, `bash scripts/run-locally__riskmandate_ai.sh` serves the site on `localhost`, which matters: the vault pages and `/scenarios/` decrypt in the browser and need a secure context.
- **Everything CI runs** is one command, `npm run check`. If it is not green, the change is not done.

## A branch, a check, a note, a merge.

The same path whether a person or an agent made the change, and the rules for several agents making changes at once are in the file above. The short form:

### Branch from `dev`, and say what you are doing

One file in `.claude/work/` names the branch, its scope, the files it will touch and the vaults it will push. Other agents read it before they start.

### Edit the page, then regenerate

The page is the source; its twin, the sitemap and the index are derived. Generated files are never hand-edited and never hand-merged.

### Check

`npm run check` is the gate, locally and in CI.

### Merge `dev` in, then cut the release last

The version restamps every page, so it is the final commit before the merge and the number is claimed at merge time. The note says what changed, why, and what was deliberately not done.

### Merge into `dev`, which is live

CI checks, tags `v<version>`, and deploys. A wrong deploy is fixed forward with the next release; nothing is force-pushed.

## Start at the front door.

If you are an agent, the folder is written for you and it is ten minutes long. If you are a person, the same folder is the most honest description of how this site is actually run.
