# The console

> The operations console behind riskmandate.ai: what needs the lead, what is in flight, every memo and brief, the board, the vaults, the records and the tooling — every count read off a file in the repository.
> Source: https://riskmandate.ai/admin/ · noindex · written by scripts/site/build-admin.mjs

**9**need the lead*2 queue rows, 7 decisions*

**2**waiting on somebody outside*the store's agent, the model site*

**0**branches in flight*one work file each*

**12**open tasks*of 17 in the queue · 1 done*

**32**memos not fully worked*of 40 received*

**27**briefs written here*one page each*

**16**vaults built and pushed*4 measured · 8 asked for*

**118**releases*8 Lab editions*

## Needs the lead — 9

The only filled rank on this console: a decision, a credential or a call nobody else holds. Read off [the state file](../admin/agents/03-state-and-next/).

**Both pushes done** 16 Sept (`oc433z3m` public, `xjir6m0c` private). Still owed: the twelve screens as redacted image files in `evidence/`; the correction call (§4 of the workflow brief)

waiting on the lead#11a

**Done** v1.24.0 — the MVP vault: `LICENCE.md` + `licence` block in the build; the v3 reading app with the left navigation, *Who are you?*, *Your keys*, *Keep it*, *Download*; a new app vault; `oc433z3m` re-pushed; the vault page repositioned (`direction__mvp-vault-and-the-reading-app.md`)

the lead's four decisions answered 16 Sept; renderer v5 in a new app vault `vbhmlulo`; oc433z3m re-pushed; the dual licence in the build#15

***Behaviour* or *behavior* on the mark (the site is British; the recommendation is *behaviour*).**

a decision the lead owns, openD1

**The Licence to Operate referent (organisation / instrument / licensee) is adopted on the site**

a decision the lead owns, openD2

**Publish the n8n write-up and its author, or not.**

a decision the lead owns, openD3

**Extend the measuring environment's gateway rule to MCP-tunnelled requests (the deployer's).**

a decision the lead owns, openD4

**The return address for the level-3 files (a mailbox today; a write-only vault link when it exists).**

a decision the lead owns, openD5

**Who the reviewing person is at level 3, and whether the Voice Debrief vaults publish the routing service's providers by name.**

a decision the lead owns, openD6

**Which agent branches merge next, and in what order (see `.claude/work/`).**

a decision the lead owns, openD7

## In flight — 0 branches

One file per branch under `.claude/work/`, written before the work starts and deleted when it merges. Read every one before claiming a task.

**Nothing in flight.**

No work file under .claude/work/.

## How work gets here

**[The memo queue →](../admin/memos/)** — a document or a memo from the project lead arrives, is archived byte for byte and registered by digest, and is read into a brief. What was said and what we made of it are two objects, and only one of them is allowed to be wrong.

**[The briefs →](../admin/briefs/)** — what was decided and why, written here against a named source, one page each. A brief is broken into task briefs sized for one agent.

**[The board →](../admin/work/)** — the queue, in four columns. A row moves because its status in the state file moved or because a branch claimed its brief; nothing is dragged.

## Where things are

**[The vaults](../admin/vaults/)**

16 behaviour-policy vaults, each with its id, its public read key, how many rows are measured and how many questions are open.28 open

**[The agents' front door](../admin/agents/)**

CLAUDE.md, the six onboarding documents and the prompts, rendered here so an agent — or a person — can read them without the repository.15 files

**[The records](../admin/records/)**

Every append-only file the site keeps and the page that renders it: versions, the brief register, the Lab editions, the catalogue, the machine-readable indexes.append-only

**[Tooling and the gate](../admin/tooling/)**

The scripts under scripts/site/, which of them run in CI, and the five steps a change takes from a branch to the live site.npm run check
