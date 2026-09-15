---
description: Add a page to the site with the shared chrome, register it, regenerate, check
argument-hint: <name> "<title>" "<description>" [menu group | unlisted | private]
---

Add the page $ARGUMENTS following `.claude/onboarding/05-workflows.md` → *Add or edit a page*.

- Read the markdown twin of a finished page in the same family first for the voice
  (`site/abp.md` for the model, `site/work.md` for process pages, a `lab-*.md` for the Lab).
- Write the body and the page CSS in the scratchpad; scaffold with `new-page.mjs` using
  `work.html` as the donor unless the family has a better one; run `add-licence-chrome.mjs`.
- Register it in `site/pages.json` in the group given (or `unlisted`/`private`); keep at most 7
  top-level entries. `generate.mjs`, `npm run check`.
- Every claim on the page carries a source and a date. Nothing is scored. No literal hex outside
  `:root`. No `innerHTML`.
- A page change ships as a release: do not cut it on the branch; note in `.claude/work/<branch>.md`
  that a release is owed at merge.
