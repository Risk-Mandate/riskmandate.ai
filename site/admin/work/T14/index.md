# T14 — Volume and instances on the consequence layer

> Rendered from .claude/briefs/T14-volume-and-instances-on-consequences.md in the repository. The text below is that file.
> Source: https://riskmandate.ai/admin/work/T14/ · noindex · written by scripts/site/build-admin.mjs

**From:** `docs/briefs/direction__the-next-phase-is-users.md` §3.3 · **Size:** a day
**Status:** open

## Why

A permission model says *the agent may label a message*. The lead's memo says what a person actually
fears: *"if you change all the labels, you basically destroy the information architecture of a
user"*. Those are the same capability and not the same event, and the difference is **volume**.

The consequence layer already models `capability × asset → consequence` with six kinds and a derived
barrier. It has no notion of scale, and no notion of an instance a mandate names.

## What to build

1. **`volume` on a consequence** — a coarse, authored property: `one`, `some`, `most`, `all`. Not a
   score and not a likelihood: a statement of how much of the asset the consequence reaches when it
   happens. The build refuses a value outside the four.
2. **The mailbox's *state* as an asset**, distinct from its contents: read and unread, starred,
   filed, archived. Marking read things unread is a consequence against that asset and against
   nothing else we currently model.
3. **Author the four the memo names**, for `claude-gmail-connector`: the relabelling, the mass send,
   the draft flood, and the unread flip — each with its required capabilities, its asset, its
   derived barrier and its source.
4. **Render volume** wherever a consequence is rendered: `CONSEQUENCES.md`, the reading app's *What
   follows* view, and the vault page.

## Rules

- **No score.** `volume` says how much, not how bad. The build already refuses a consequence that
  reads like a rating, and the same check must cover the new field.
- It is **this site's extension**, not the published vocabulary — recorded like `material` and the
  barrier holders, and offered to the model site as a Lab ask rather than invented into it.

## Not in this task

The **instance-scoped mandate** (*never this label*, *never this correspondent*) and the
**session-scoped mandate** (*not in this session*) are the harder half of §3.3 and are a change to
what a mandate is. They are a design and a Lab ask, not this build.
