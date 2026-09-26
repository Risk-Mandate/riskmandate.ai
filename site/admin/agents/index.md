# The agents' front door

> The agents' front door on riskmandate.ai: CLAUDE.md, the onboarding documents, the task briefs and the prompts, rendered as pages.
> Source: https://riskmandate.ai/admin/agents/ · noindex · written by scripts/site/build-admin.mjs

**6**onboarding documents*ten minutes, in order*

**14**task briefs*sized for one agent each*

**8**prompts*slash commands in Claude Code*

**1**branches in flight*one work file each*

Most of the work on this site is done by agents, several at a time, on branches that merge into `dev`. Each one used to read the whole repository to learn it. Now there is a folder written for them, kept current in the same commit as whatever it describes, and rendered here so it can be read without the repository.

## Read first

**[CLAUDE.md](../../admin/agents/claude-md/)**

Read automatically by Claude Code. The ten rules that are not optional, the mechanics in one screen, and the short form of working alongside other agents.required

**[.claude/onboarding/00-start-here.md](../../admin/agents/00-start-here/)**

The reading order by task. Ten minutes to being useful.required

**[.claude/onboarding/02-abp-model.md](../../admin/agents/02-abp-model/)**

The Agent Behaviour Policy condensed: four objects, four barriers, the 23 primitives, the evidence tiers, the vault, the graph.required

**[.claude/onboarding/04-rules-of-engagement.md](../../admin/agents/04-rules-of-engagement/)**

Parallel agents, branches, what conflicts and what to do about it, external state, ownership by surface.required

## Then, as needed

**[.claude/onboarding/01-map.md](../../admin/agents/01-map/)**

Every document, page family, script, test and register, one line each.reference

**[.claude/onboarding/03-state-and-next.md](../../admin/agents/03-state-and-next/)**

Where the site is and the ordered queue of what is next, with the decisions the lead owns.reference

**[.claude/onboarding/05-workflows.md](../../admin/agents/05-workflows/)**

Recipes: add a page, add a vault, cut a release, cut a Lab edition, write a brief, register a document, merge a branch.reference

**[.claude/briefs/README.md](../../admin/work/about-task-briefs/)**

Task briefs sized for one agent each, with the files each touches.work

**[.claude/work/README.md](../../admin/work/about-work-files/)**

One file per in-flight branch. Read before claiming a task; delete on merge.live

## Prompts for the common jobs

Under `.claude/commands/`; in Claude Code each is a slash command. They start a job the way the workflows say it should be started.

**[/brief-from-debrief](../../admin/agents/commands/brief-from-debrief/)**

Read docs/briefs/direction__abp-as-a-graph-and-stakeholder-views.md and docs/briefs/review__first-measured-abp-n8n-owner-key.md first; match their shape exactly.prompt

**[/handover](../../admin/agents/commands/handover/)**

handoverprompt

**[/merge-to-dev](../../admin/agents/commands/merge-to-dev/)**

Merge the current branch into dev following .claude/onboarding/04-rules-of-engagement.md. Arguments: $ARGUMENTS (the version to claim and the release title; ask if missing and a page changed).prompt

**[/new-page](../../admin/agents/commands/new-page/)**

Add the page $ARGUMENTS following .claude/onboarding/05-workflows.md → Add or edit a page.prompt

**[/new-vault](../../admin/agents/commands/new-vault/)**

Add the vault $ARGUMENTS following .claude/onboarding/05-workflows.md → Add a vault and the model in .claude/onboarding/02-abp-model.md. Read site/vaults/gmail-readonly/data/grant.json as the example of a documented grant and…prompt

**[/onboard](../../admin/agents/commands/onboard/)**

You are a new agent on riskmandate.ai. Do not read the repository at large. Read, in order:prompt

**[/release](../../admin/agents/commands/release/)**

Cut release $ARGUMENTS following .claude/onboarding/05-workflows.md → Cut a release.prompt

**[/research-vault](../../admin/agents/commands/research-vault/)**

Work site/vaults/$ARGUMENTS/RESEARCH-NEEDED.md following §2 of docs/briefs/research__connector-grants-open-questions.md. For each question:prompt

**A rule in prose bounds nothing.** These files work because every agent reads them first. That is the same sentence every behaviour-policy vault says about its own `AGENTS.md`, and it is as true here. The tests and the CI checks are the boundaries; the folder is the telling. People collaborating with us start at [Working with us](../../work.html) instead.
