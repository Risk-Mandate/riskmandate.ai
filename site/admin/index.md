# The console

> The operations console behind riskmandate.ai: what needs the lead, what is in flight, every memo and brief, the board, the vaults, the records and the tooling — every count read off a file in the repository.
> Source: https://riskmandate.ai/admin/ · noindex · written by scripts/site/build-admin.mjs

**9**need the lead*0 queue rows, 9 decisions*

**0**waiting on somebody outside*the store's agent, the model site*

**1**branches in flight*one work file each*

**0**open tasks*of 4 in the queue · 4 done*

**34**memos not fully worked*of 42 received*

**36**briefs written here*one page each*

**16**vaults built and pushed*4 measured · 9 asked for*

**141**releases*8 Lab editions*

## Needs the lead — 9

The only filled rank on this console: a decision, a credential or a call nobody else holds. Read off [the state file](../admin/agents/03-state-and-next/).

**The OWASP move** (8 Oct, D30/D31; `site/owasp/`, record `site/owasp/project.json`): the name (Agent Behaviour

a decision the lead owns, openD1

**From the rules brief of 7 October: where the path loses most people (it orders R1–R4); who the early**

a decision the lead owns, openD2

***Behaviour* or *behavior* on the mark (the site is British; the recommendation is *behaviour*).**

a decision the lead owns, openD3

**The Licence to Operate referent (organisation / instrument / licensee) is adopted on the site**

a decision the lead owns, openD4

**Publish the n8n write-up and its author, or not.**

a decision the lead owns, openD5

**Extend the measuring environment's gateway rule to MCP-tunnelled requests (the deployer's).**

a decision the lead owns, openD6

**The return address for the level-3 files (a mailbox today; a write-only vault link when it exists).**

a decision the lead owns, openD7

**Who the reviewing person is at level 3, and whether the Voice Debrief vaults publish the routing service's providers by name.**

a decision the lead owns, openD8

**Which agent branches merge next, and in what order (see `.claude/work/`).**

a decision the lead owns, openD9

## In flight — 1 branch

One file per branch under `.claude/work/`, written before the work starts and deleted when it merges. Read every one before claiming a task.

**[claude/owasp-abp-project](../admin/work/branches/claude-owasp-abp-project/)**

A new top-level section, **OWASP**, at `site/owasp/`: the proposal to take the Agent Behaviour Policies to OWASP as an OWASP project, kept in public. Overview, charter (mission, objectives, scope, non-goals), the line between RiskMandate and the project, the application pack (process, form answers, leaders, roadmap), the tracker (gates, steps, submissions, people, decisions, log), the contribution inventory, the other OWASP projects it works with, and what popular OWASP projects teach. The record is `site/owasp/project.json`; the pages are built by `scripts/site/build-owasp.mjs` from `docs/owasp/pages/*.html`. Nothing is sent to OWASP from this branch: no outreach, no form, no repository created. since 8 October 2026

## How work gets here

**[The memo queue →](../admin/memos/)** — a document or a memo from the project lead arrives, is archived byte for byte and registered by digest, and is read into a brief. What was said and what we made of it are two objects, and only one of them is allowed to be wrong.

**[The briefs →](../admin/briefs/)** — what was decided and why, written here against a named source, one page each. A brief is broken into task briefs sized for one agent.

**[The board →](../admin/work/)** — the queue, in four columns. A row moves because its status in the state file moved or because a branch claimed its brief; nothing is dragged.

## Where things are

**[The vaults](../admin/vaults/)**

16 behaviour-policy vaults, each with its id, its public read key, how many rows are measured and how many questions are open.28 open

**[The agents' front door](../admin/agents/)**

CLAUDE.md, the six onboarding documents and the prompts, rendered here so an agent — or a person — can read them without the repository.16 files

**[The records](../admin/records/)**

Every append-only file the site keeps and the page that renders it: versions, the brief register, the Lab editions, the catalogue, the machine-readable indexes.append-only

**[Tooling and the gate](../admin/tooling/)**

The scripts under scripts/site/, which of them run in CI, and the five steps a change takes from a branch to the live site.npm run check
