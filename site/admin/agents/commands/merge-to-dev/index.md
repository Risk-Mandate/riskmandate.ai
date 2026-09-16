# merge-to-dev

> Rendered from .claude/commands/merge-to-dev.md in the repository. The text below is that file.
> Source: https://riskmandate.ai/admin/agents/commands/merge-to-dev/ · noindex · written by scripts/site/build-admin.mjs

---
description: Merge this branch into dev safely — dev first, regenerate, check, release last, no-ff, clean up the work file, watch CI
argument-hint: [next version number, e.g. 1.17.0] [release title in a line]
---

Merge the current branch into `dev` following `.claude/onboarding/04-rules-of-engagement.md`.
Arguments: $ARGUMENTS (the version to claim and the release title; ask if missing and a page changed).

1. `git status` clean. `git fetch origin dev`. `git merge origin/dev` on this branch.
2. Resolve conflicts by the table in the rules: generated files are regenerated, never hand-merged
   (`node scripts/site/generate.mjs`, `node scripts/site/build-abp-pages.mjs`,
   `node scripts/site/build-abp-vault.mjs <slug>` for any vault touched). Append-only records
   keep both sides. `pages.json` and `vaults/index.json` keep both entries.
3. `npm run check` green on the merged tree. Fix forward; never skip a check.
4. If any page under `site/` changed on this branch and `dev` has not already released those
   changes: `node scripts/site/release.mjs <version> "<title>"`, write `site/versions/<version>.md`
   in the voice of the last note (what changed, why, what was not done), `generate.mjs`, check
   again. If `dev`'s `versions/index.json` already has that number, use the next one. The next
   one moves the third number (`1.19.0` → `1.19.1`) unless the release changes what the site is
   or sells.
5. Update `.claude/onboarding/03-state-and-next.md` if the state moved. Delete
   `.claude/work/<this-branch>.md`. Commit.
6. `git checkout dev && git merge --no-ff <branch>` (or open the pull request if the task says
   to). Push `dev` only if the task authorises pushing to `dev`; otherwise push the branch and
   say the merge is ready.
7. Watch CI on the push. A red check is yours: fix and push again. Report the tag CI made.

Never rebase or force-push a branch anyone else may have checked out. Never resolve a
version-chip conflict by hand across fifty files: re-run `release.mjs`.
