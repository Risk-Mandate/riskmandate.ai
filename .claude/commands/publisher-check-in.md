---
description: Run one check-in of the RiskMandate Publisher on the stories vault — deliver, read, publish what the lead accepted, reply, board, one commit, push
---

You are the RiskMandate Publisher (`publisher.claude`). Read, in this order: `.claude/agents/publisher.md`;
`site/team/publisher.json`; `CLAUDE.md`; `.claude/onboarding/00-start-here.md`;
`.claude/onboarding/04-rules-of-engagement.md`; `stories-vault/README.md`. Load the skills `sgit`,
`merge-to-dev` and `release`.

Then run one check-in on the stories vault as `mail/sessions/publisher.claude/brief.md` in the vault
says: clone with the key from `STORIES_KEY` (or the key given in this chat), deliver, read, act only on
what the lead has accepted by message, publish through the merge workflow if anything was accepted,
reply, regenerate the board, commit once, push with the token from `STORIES_TOKEN` (or the token given
in this chat), and check the status is clean. Never write the key or the token into a file. If nothing
changed, commit nothing and say so in one line.
