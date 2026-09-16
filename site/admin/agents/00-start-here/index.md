# Start here

> Rendered from .claude/onboarding/00-start-here.md in the repository. The text below is that file.
> Source: https://riskmandate.ai/admin/agents/00-start-here/ · noindex · written by scripts/site/build-admin.mjs

You are working on riskmandate.ai: a plain-HTML marketing site that is also the working record
of a product being built in public. The product is the **Agent Behaviour Policy** (ABP). Read
`../../CLAUDE.md` first if you have not; it is the rules. This file is the reading order.

## Ten minutes, whatever the task

1. `02-abp-model.md` — the model. Four objects, four barriers, 23 primitives, no score. Five
   minutes, and it replaces five briefs and the model site.
2. `03-state-and-next.md` — where the site is today and what is queued, in order.
3. `04-rules-of-engagement.md` — how to work when other agents are on sibling branches.
4. `01-map.md` — skim the headings so you know what exists. Come back to it when you need a path.

Then pick the branch below that matches your task and read only that.

## By task

**Changing a page on the site**
- `05-workflows.md` → *Add or edit a page*. The chrome is identical everywhere and is copied
  from a donor page; `generate.mjs` after every edit; `npm run check` before every commit.
- The voice: read one finished page's markdown twin, for example `site/abp.md`, before writing.
- `docs/how-the-website-works.md` only if you are touching the shared modules or the menu.

**Adding or changing a behaviour-policy vault**
- `02-abp-model.md` → *The vault* section, then `05-workflows.md` → *Add a vault*.
- One real vault as the example: `site/vaults/n8n-owner-api-key/` (measured) and
  `site/vaults/gmail-readonly/` (documented, with open questions). Read `README.md` and
  `data/grant.json` in one of them; the rest is derived.
- `site/vaults/_template/MAP-A-GRANT.md` is the prompt that produces a grant; its rules of
  measurement are the rules you follow.
- A vault push to sgit needs a write key you do not have unless the lead gave you one. Build
  and check locally; say in your work file that the push is owed.

**Researching the open questions in a connector vault**
- `docs/briefs/research__connector-grants-open-questions.md` §2 is the brief. It is short.
- The command `.claude/commands/research-vault.md` is the prompt.

**Building the graph (behaviour pages, edges, views, projections)**
- `docs/briefs/direction__abp-as-a-graph-and-stakeholder-views.md` in full; it is the spec.
- `.claude/briefs/T01-behaviour-pages.md` onward are the ordered tasks cut from it.

**Turning a voice debrief or a note from the lead into a brief**
- Read two existing briefs for the shape: `docs/briefs/direction__abp-at-the-centre.md` and
  `docs/briefs/review__first-measured-abp-n8n-owner-key.md`. Header block, numbered sections,
  what it asks for, what it does not settle, decisions needed.
- `.claude/commands/brief-from-debrief.md` is the prompt.

**Merging a branch into dev**
- `04-rules-of-engagement.md` in full, then `.claude/commands/merge-to-dev.md`.

**Cutting a release**
- `05-workflows.md` → *Cut a release*. Notes are written in the voice of `site/versions/1.15.0.md`:
  what changed, why, what was not changed and why not.

## What a good session leaves behind

- The work, checked: `npm run check` green before every push.
- A release note if a page changed; a brief in `docs/briefs/` if a decision or a design was made.
- `.claude/work/<branch>.md` updated, or deleted if the branch merged.
- Anything in this folder that your change made stale, fixed in the same commit.
- A final message that says what was done, what was not, and what needs the lead: a key, a
  decision, a push you could not make.
