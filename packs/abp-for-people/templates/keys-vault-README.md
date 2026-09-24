# The keys vault (PRIVATE)

This vault holds what must never be in a person's vault:

- `registry.json` — every person vault, with its **vault key** (the write credential), its read
  key, its link and what happened after it was sent.
- `people/<slug>/intake.md` — the lead's notes from the conversation, the request, anything said
  in confidence.

Rules:

1. Its own vault key is held by the lead and given to an agent at the start of a session. It is
   never written into a file, a commit message, a person's vault or a chat summary.
2. Nothing is ever copied out of here into `people/<slug>/`. The leak check reads `intake.md` to
   make sure no line of it reached the person's vault.
3. One entry per person. A vault is never reused for somebody else.
