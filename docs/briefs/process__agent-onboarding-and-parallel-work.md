# The agents' front door: onboard in ten minutes, and work in parallel without undoing each other

**Date:** 2026-09-15 · **Author:** @website-agent
**Trigger:** project lead's note of 15 September — *"improve the onboarding of new agents like you so that next time you don't have to read as much … `.claude` folders and files that provide links to the pages and the docs … the docs should be linked from the home page … the admin section should also be visible … define the rules of engagement for when agents are working in parallel, especially when they're operating on different branches that then will merge into dev"*
**Reads against:** the repository at v1.16.0; `git log` since v1.0.0; the two sibling branches on `origin` at the time of writing

---

## 1. The problem, measured on this session

To become useful on this repository, the agent writing this read: the README, the
how-the-website-works document, twelve briefs, the markdown twins of the ABP page, the library
page, the Lab index, the work page and the agents page, six release notes, the vault catalogue,
one vault's fifteen files and its pinned vocabulary, the headers of ten scripts, the test suite,
the CI workflow, and the git log. Roughly a hundred and fifty thousand words, for a task that
touched none of the ABP data. The previous agents did the same. Every one of them rebuilt the
same map in its own context and threw it away at the end of the session.

Two things made it worse than it needed to be. There was no index: the README pointed at one
document and one folder, and the rest had to be discovered. And there was no statement of the
model short enough to trust: the ABP is described across five briefs, the model site, the vault
template and the pages, each written for a different reader, none written for the next agent.

The second problem is newer. Since v1.11.0 two or three agents have been working at once on
sibling `claude/*` branches that merge into `dev`, and the git log records the cost: a branch
that had to restamp every page to v1.12.0 before it could merge, because both sides had cut a
release; a merge whose first CI run failed on a `.gitignore` rule; and, today, two branches
sitting on the same base commit with nothing telling either what the other is doing. `dev` is
also the live site, so a merge is a deploy.

## 2. What was built

**`CLAUDE.md`** at the root, read automatically by Claude Code: the ten rules that are not
optional (no score on a behaviour policy, never ADP, never *the policy* alone, never test
somebody else's system, no verdicts, no conformity language, no standards text, no manufactured
assurance, British English, no write credential in `site/`), the mechanics in one screen, the
short form of working alongside other agents, and a table of where things are.

**`.claude/onboarding/`**, six files:

| File | Replaces |
|---|---|
| `00-start-here.md` | the hour of orientation: a reading order by task, and what a good session leaves behind |
| `01-map.md` | discovering the tree: every document, page family, script, test, register and external system, one line each, with when to read it |
| `02-abp-model.md` | five briefs and the model site: the four objects and their verbs, the 23 primitives with reach and undo, the four barriers and the enforcer test, the evidence tiers, `material`, the delta semantics, the four counts, the label/record/prescription stack, the naming rules, the vault layout and a grant row, the graph direction, what is honest to say |
| `03-state-and-next.md` | reading six release notes: the state at the current version, the vaults by tier, the ordered queue with a brief per item, the decisions the lead owns, the known rough edges |
| `04-rules-of-engagement.md` | learning the hard way: §3 below |
| `05-workflows.md` | reading ten script headers: recipes for a page, a vault, a correction, a release, a Lab edition, a brief, a register entry, a shared module, the chrome, a merge |

**`.claude/briefs/`**: eight task briefs cut from the graph brief's build order, the research
queue, the connector queue, Lab 03 and the stale document, each naming the files it touches so
two agents can see whether they would collide. **`.claude/commands/`**: eight prompts for the
common jobs, usable as slash commands in Claude Code and pasteable anywhere else.
**`.claude/work/`**: one file per in-flight branch, the mechanism §3 rests on.

**`admin.html`**, in the *More* menu and linked as *Admin* beside *Versions* in every footer:
the records the site keeps, every document under `docs/` with a link into the repository, the
agents' front door, the tooling with what runs in CI, and how a change ships. Two tests keep it
honest: every document under `docs/` must be linked from the page, and every footer that links
*Versions* must link *Admin*. `new-page.mjs` scaffolds the link into new pages.

## 3. The rules of engagement, and why each one

The full text is `.claude/onboarding/04-rules-of-engagement.md`. The reasoning:

1. **Claim a scope before starting, in a file per branch.** A shared claims file would itself
   conflict on every merge; a file per branch never does, and deleting it on merge is the
   natural signal that the surface is free. It is a rule in prose and bounds nothing, which is
   why it is written in the same words the vaults use for `AGENTS.md`.
2. **The release is the last commit before merge, after merging `dev` in.** `release.mjs`
   restamps every page. Two branches that both release conflict on fifty files, and the v1.13.0
   merge is the record of what that costs. Claiming the number at merge time makes the conflict
   impossible rather than resolvable.
3. **Generated files are regenerated, never hand-merged.** The twins, the sitemap, the vault
   pages and everything derived inside a vault are functions of their inputs; merging their
   text by hand produces a file the `--check` will reject anyway.
4. **Every-page edits are small commits merged the same day.** The licence chrome, a module
   sync, a footer link: each touches every page, so the longer it sits on a branch the more it
   conflicts with. This change is itself an example and follows its own rule.
5. **Append-only records are never rewritten.** The version record, the brief register, the
   Lab editions and a vault's history exist to be checkable later; a merge that renumbers an
   edition breaks a promise to whoever was sent the file.
6. **External state is declared.** Vault pushes need a write key the lead holds; a branch says
   which vaults are built and unpushed so the lead can push them, and never commits a key.
7. **One owner per surface at a time.** A page family, a vault slug, the shared chrome: whoever
   `.claude/work/` says. Two agents adding two different vaults never collide; two agents editing
   `scripts/site/abp/` will.
8. **`dev` is live.** Nobody force-pushes it; a wrong deploy is fixed forward with a release.
9. **The third number moves by default** (added by the lead on 15 September, after two agents
   had each taken a second-number bump in one day). `1.19.0` → `1.19.1`. The second number is
   for a release that changes what the site is or sells; the first is the lead's.

## 4. What this does not settle

- **Whether `.claude/` stays current.** The rule is that a change to anything the folder
  describes changes the folder in the same commit. Nothing enforces it beyond the two tests on
  the admin page. If the map rots, the next agent is back to reading the tree; a check that the
  map names every file under `docs/` and every script under `scripts/site/` would be cheap and
  is the first thing to add if it rots.
- **Who merges, and when.** The rules say how to merge; they do not say which of two ready
  branches goes first. That is the lead's, and `.claude/work/` is where the lead can see both.
- **The docs are linked, not served.** `docs/` is not in `site/`, so the admin page links into
  the repository on `dev`. Serving the docs from the site would need them generated into
  `site/docs/` with twins and the sitemap updated; it is a half-day if wanted and nothing
  here depends on it.
- **`docs/how-the-website-works.md` is still written at v1.0.0**, now with an addendum saying
  so. Bringing its body to the current site is task brief T08.
