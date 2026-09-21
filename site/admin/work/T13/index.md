# T13 — A prompt workflow per shape, published where a stranger can find it

> Rendered from .claude/briefs/T13-prompt-workflow-per-shape.md in the repository. The text below is that file.
> Source: https://riskmandate.ai/admin/work/T13/ · noindex · written by scripts/site/build-admin.mjs

**From:** `docs/briefs/direction__the-next-phase-is-users.md` §4.2 · **Size:** a day for the first, less after
**Status:** open

## Why

The Gmail workflow at [abp.sgit.ai/gmail](https://abp.sgit.ai/gmail/index.html) is four steps and
thirteen prompts a person pastes into their own assistant. It is the only on-ramp we have, and it
covers one shape. The other fifteen carry `MAP-A-GRANT.md` — the same idea, one prompt instead of
thirteen, and buried inside a vault, which is behind the thing it is meant to be an on-ramp to.

The lead's measure is the number of people who **run** the prompts. That number is bounded by how
many shapes have something runnable.

## What to build

For one shape at a time, in this order — the three that need no connector and no consent screen, so
a curious person can start in thirty seconds:

1. `claude-code-cli` — a coding agent on the operator's own machine
2. `github-actions` — a CI runner, where the grant is a token and a workflow file
3. `scheduled-job` — something that runs with nobody watching

Each one is four steps, matching the Gmail shape: **what it can already do** · **what you actually
asked for** · **write the behaviour policy** · **what a prompt cannot do**. Take the wording from the
Gmail pages so a person who has done one recognises the next.

## Rules

- The prompts ask the agent about **itself, on a system the person is entitled to run**. Never a
  prompt that probes somebody else's system, and never one that exercises an irreversible capability
  to prove it exists.
- Every workflow says, before the reader finds out, that what comes back is a **self report** — a
  claim rather than a measurement, at the `self-reported` evidence tier the vocabulary already has.
- The last step marks the rows the agent is inferring, so the weak lines are visible.
- Name the shape's behaviour policy beside it, so a person can read the measured version against
  their own.

## Done when

Each shape has a workflow a stranger can follow without asking us anything, linked from
`try-it.html`, and the page says which shapes have one and which do not.
