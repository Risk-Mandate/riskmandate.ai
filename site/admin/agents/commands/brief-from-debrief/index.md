# brief-from-debrief

> Rendered from .claude/commands/brief-from-debrief.md in the repository. The text below is that file.
> Source: https://riskmandate.ai/admin/agents/commands/brief-from-debrief/ · noindex · written by scripts/site/build-admin.mjs

---
description: Turn a voice debrief, a transcript or a note from the lead into a brief in docs/briefs/, in the house shape and voice
argument-hint: <path to the transcript or the note, or paste it>
---

Write a brief from: $ARGUMENTS

Read `docs/briefs/direction__abp-as-a-graph-and-stakeholder-views.md` and
`docs/briefs/review__first-measured-abp-n8n-owner-key.md` first; match their shape exactly.

- File: `docs/briefs/<kind>__<slug>.md`, kind one of `direction`, `architecture`,
  `implementation`, `review`, `research`, `summit`, `vaults`, `process`.
- Title as a claim. Header block: date, author `@website-agent`, trigger (the lead's words,
  quoted, with the source and its length), reads against (sources with versions).
- Section 1: what the source says, in its own order, with the lead's phrases quoted where they
  carry the idea. Section 2: where we already are, against the site as built. Then the design or
  the structure it asks for. Then the build order, numbered and sized. End with what it does not
  settle or the decisions needed from the lead.
- The site's rules apply to the brief: no score on a behaviour policy, ABP never ADP, never
  "the policy" alone, no verdicts on named third parties, no conformity language, British English.
- Then: one line in `.claude/onboarding/01-map.md`; a change to `03-state-and-next.md` if it
  reorders the queue; a task brief in `.claude/briefs/` for each build item large enough for one
  agent. If the source was a file, register it (`05-workflows.md` → *Register a document*).
