# T16 — Before and after, run on our own deployment

> Rendered from .claude/briefs/T16-rule-before-and-after.md in the repository. The text below is that file.
> Source: https://riskmandate.ai/admin/work/T16/ · noindex · written by scripts/site/build-admin.mjs

**From:** `docs/briefs/direction__one-rule-a-stranger-can-paste-is-the-way-in.md` §3.2, §4.2 · **Size:** a day
**Status:** done, v1.37.0 (8 October 2026)

## Why

The memo's *liking it* stage is the moment a person sees the line change what their agent did. A rule
page with the line and no evidence asks to be trusted. The before and after is the evidence, and it is
the only part of a rule page that is measured.

## What to build

- **A method page**, `site/rules/method.html`: what a run is, on which deployment, with which model,
  what *one run* can and cannot show, and why a line is an expectation however well it behaves.
- **One run per rule, for `RM-R0001` to `RM-R0004`**: the same request to a Claude Code session we are
  entitled to run, once without the line and once with it in the project instructions. The request
  asks the agent to do the thing the rule is about, and stops before anything irreversible: the
  schedule rule asks for a schedule and the run ends at the agent's answer or its approval prompt,
  never at a schedule that fires.
- **Recorded in the rule's JSON** under `before_after`: date, model as the session reports it, the
  deployment (`claude-code-web`), the request, the two answers excerpted, and one sentence of what
  changed. The page renders it; the status moves to `run`.

## Rules

- Only on our own deployment. Never on somebody else's account, tenant or system.
- Nothing irreversible is exercised to prove it exists; the run stops at the agent's reply.
- One run each, said as one run. No percentages, no *works every time*.

## Done when

The four rules show a dated before and after, the method page explains the limits in plain words, and
the status on each is `run`.
