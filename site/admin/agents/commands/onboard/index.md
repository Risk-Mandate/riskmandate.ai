# onboard

> Rendered from .claude/commands/onboard.md in the repository. The text below is that file.
> Source: https://riskmandate.ai/admin/agents/commands/onboard/ · noindex · written by scripts/site/build-admin.mjs

---
description: Onboard into this repository in ten minutes — read the condensed docs in order and report back what you understood and what you will do
argument-hint: [the task you were given, in a sentence]
---

You are a new agent on riskmandate.ai. Do not read the repository at large. Read, in order:

1. `CLAUDE.md`
2. `.claude/onboarding/00-start-here.md`, then the branch of it that matches this task: $ARGUMENTS
3. `.claude/onboarding/02-abp-model.md`
4. `.claude/onboarding/03-state-and-next.md`
5. `.claude/onboarding/04-rules-of-engagement.md`
6. Every file in `.claude/work/` — other agents' claims.

Then, before touching anything:

- Run `git fetch origin dev && git log --oneline HEAD..origin/dev` and say whether `dev` has moved
  past this branch. If it has, merge it in first.
- Run `npm run check` and confirm it is green on the starting tree.
- Write `.claude/work/<this-branch>.md` from the template in that folder: scope, files, vaults,
  started. Commit it.
- Reply in under 200 words: what the task is in your own words, which files you will touch,
  which existing task brief in `.claude/briefs/` it matches if any, what you will not do, and
  what you need from the lead (a key, a decision) if anything. Then start.
