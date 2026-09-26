# claude/dev-session-setup-a5wcc5

**Started:** 2026-09-26 · **Agent session:** the lead's long-running session · **Task brief:** ad hoc: the team and its behaviour policies

## Scope
`site/team/`: one person, two agents, an Agent Behaviour Policy each in the vault grammar, three tiers
(public, private, secret), the surfaces, the workflow from private to public, controls and tooling in place
and not; `.claude/agents/publisher.md` and `/publisher-check-in` for a clean session; a test that nothing
private reaches `site/`; the designer renamed `designer.chatgpt` in the vault and asked to argue with its
policy and draw the team as an infographic.

## Files and surfaces I expect to touch
- `site/team/**`, `scripts/site/build-team.mjs`, `site/pages.json`, `package.json`, the CI workflow, `tests/site/test_pages.mjs`
- `.claude/agents/publisher.md`, `.claude/commands/publisher-check-in.md`, onboarding, `CLAUDE.md` (one table row), the console
- `stories-vault/seed/**` and `scripts/site/build-stories.mjs` (the rename)

## External state
- Vault pushed: the stories vault `dy4u2m9c`, one more check-in commit: the designer's identity renamed, message 007, S07, the board.
- Release I will claim at merge: yes, 1.35.0 (a new section)

## Status
- [x] built, checked, rendered
- [ ] release, merge, deploy
