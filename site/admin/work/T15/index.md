# T15 — Rule pages: the schema, the generator, the index, and the first four rules

> Rendered from .claude/briefs/T15-rule-pages.md in the repository. The text below is that file.
> Source: https://riskmandate.ai/admin/work/T15/ · noindex · written by scripts/site/build-admin.mjs

**From:** `docs/briefs/direction__one-rule-a-stranger-can-paste-is-the-way-in.md` §3.2, §4.1 · **Size:** a day and a half
**Status:** done, v1.37.0 (8 October 2026)

## Why

The path from a stranger to a customer breaks before anybody tries anything. The first step on the
site today is twenty minutes of prompts. The lead's memo of 7 October names the smaller unit: a page
that asks *do you want your agent to do this?*, and, if not, gives the one line to add.

## What to build

- **`site/rules/<id>.json`**, one file per rule: `id` (`RM-R0001`), `version`, `changelog`, `question`,
  `capability` (from the pinned vocabulary), `shapes` (the vaults where it is a row, with the row's
  barrier), `answer` (`never` or `ask-first`), `line`, `paragraph`, `barrier_of_the_line`
  (`expectation`, always), `stronger` (settings and boundaries, each with a source URL and the date read,
  or an explicit *none known*), `before_after` (empty until T16), `status` (`drafted`, `run`, `tried`).
- **`scripts/site/build-rules.mjs [--check]`**: validates every rule against the vocabulary and the
  vaults' grants, refuses a rule without a barrier statement, refuses any score-shaped field, and
  writes `site/rules/index.html` and `site/rules/<id>.html` with the shared chrome, the way
  `build-stories.mjs` does. Add the `--check` to `package.json` and CI.
- **The index**: filter by shape, by capability, by *never* or *ask first*. Each card is the question.
- **The first four**, from the memo:
  1. `RM-R0001` other sessions' history: `read.record.history`, *never*.
  2. `RM-R0002` other sessions' secrets: `read.credential.host`, *never*.
  3. `RM-R0003` schedules on its own: `create.schedule.tenant`, *ask first*.
  4. `RM-R0004` your connectors: `authenticate-as.credential.tenant`, *ask first*.
- **Each page**: the question as the title; the row behind it and the shapes; the line and the paragraph
  with copy buttons; *this line is an expectation*, then what stronger barrier exists or that none does;
  the before and after section, empty and saying so; and the close, *a rule is one row; the ABP is every
  row for your agent*, linking the vaults and the levels.
- **Register** the index and the four pages in `site/pages.json` under *Try it*'s place (unlisted pages),
  and link the index first on `try-it.html`.

## Rules

- `ask-first` is this site's extension of the mandate; the page and the JSON say so.
- A vendor setting named on a page is quoted from the vendor's own page with the date it was read. If
  it was not read, the field is *none known* and the page says *we have not found one*.
- No severity, colour or level on a rule. Never *the policy* alone.

## Done when

The four pages and the index are live, linked first from `try-it.html`, `build-rules.mjs --check` runs
in `npm run check`, and a fifth rule can be added by writing one JSON file.
