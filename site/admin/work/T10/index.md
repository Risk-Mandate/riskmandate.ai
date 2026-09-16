# T10 — The two Voice Debrief use-case vaults, and a use-case axis on the library

> Rendered from .claude/briefs/T10-use-case-vaults.md in the repository. The text below is that file.
> Source: https://riskmandate.ai/admin/work/T10/ · noindex · written by scripts/site/build-admin.mjs

**From:** `docs/briefs/direction__use-case-driven-policies-and-the-prompt-workflow.md` §4–5.
**Size:** a day, after the agent that knows the Voice Debrief workflows has run the prompt.
**Touches:** `site/vaults/voice-debrief-web/`, `site/vaults/voice-debrief-whatsapp-n8n/` (new),
`site/vaults/index.json` (a *Use cases* group), `scripts/site/build-abp-pages.mjs` (the group),
`vault.json` (`kind: use-case`).

## The task
Two vaults for two workflows of our own product, documented from the workflows as built:
the web flow (upload, transcribe, infographic; audio and text sent through a model-routing
service to several providers) and the WhatsApp flow through n8n (the measured n8n grant plus
the messaging platform's bot scope). The lead's instruction is that the agent that knows the
workflows runs `MAP-A-GRANT.md` and sends the two JSON files here; this brief packages them.
This is the £500 workflow run on ourselves before it is run for a customer.

## Constraints
- The web flow's grant is unbounded on `send.endpoint.world` and `write.budget.tenant`, and the
  mandate is one sentence. Publish that delta as it is; it is the point.
- Where the routing service's providers' retention cannot be read from a page, it is a
  `research_needed` row, not a guess. `material` is `own` for the speaker and `third_party` for
  whoever else is in the recording; say so on the rows.
- A use case that spans two applications names the source vault on every row. The generator does
  not merge grants yet; until it does, the second vault carries both sets of rows with `via`
  saying which application each came from.
- No score; no verdict on the routing service or the providers.

## Done means
- Two vaults build and `--check`; the library shows a *Use cases* group; the store agent is told
  the slugs so the store can list them; the state file moves the item.
