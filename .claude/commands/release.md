---
description: Cut a release of the site — version, notes in the house voice, restamp, regenerate, check
argument-hint: <version> "<title in a line>"
---

Cut release $ARGUMENTS following `.claude/onboarding/05-workflows.md` → *Cut a release*.

- Confirm `dev` is merged in first (`git log --oneline HEAD..origin/dev` is empty), because the
  restamp touches every page and a release number is claimed at merge time.
- `node scripts/site/release.mjs <version> "<title>"`, then write `site/versions/<version>.md`.
  Read `site/versions/1.15.0.md` and `1.16.0.md` first and match them: bold lead phrases, links
  to the pages that changed, the reason for each change, and a closing paragraph on what was
  deliberately not done. No model identifiers. British English. No score, no verdicts, no
  conformity language.
- `node scripts/site/generate.mjs && npm run check`.
- Commit as `v<version> — <title>`. Do not tag; CI tags on push to dev.
