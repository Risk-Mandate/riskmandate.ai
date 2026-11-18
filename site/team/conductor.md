<!-- Generated from team/conductor.html by scripts/site/generate.mjs. Edit the page, not this file. -->

# RiskMandate — RiskMandate Conductor: its Agent Behaviour Policy

The session that runs the site's team on an hourly loop since 16 November 2026, with six roles inside it; it pushes dev, and dev is the live site. Documented from the repository and the session's own record, not measured. The grant (17 of the 23, 0 observed or measured), the mandate in the lead's words, the delta derived (5 in excess, 4 unbounded), every surface with its tier, what it never does, what would bound it, and the prompt a clean session starts from. Nothing is scored.

Source: https://riskmandate.ai/team/conductor.html

---

# RiskMandate Conductor

The session that runs the site's team on an hourly loop since 16 November 2026, with six roles inside it; it pushes dev, and dev is the live site. Documented from the repository and the session's own record, not measured.

**Runs as:** Claude Code on the web, in a managed container with this repository attached and an egress proxy above it; woken every hour from 07:37 to 23:37 London by a scheduled task set outside this repository. [The catalogue’s template for the shape](/abp-vault-claude-code-web.html).

**Validity:** this describes the deployment shape as at 18 November 2026. If the risk changed, the deployment changed, not this document. **Owner:** the lead.

**This page as markdown:** [conductor.md](/team/conductor.md) · **the data:** [conductor.json](/team/conductor.json)

## What it is for, and what it reads first.

Picks the top item on the backlog in T18 every hour, runs at most three of its six roles on it, builds and checks the site, commits in the site's voice, pushes its branch and, since the lead's yes of 17 November, merges into dev, which deploys. Records the lead's words when they reach it, through another session or directly, and keeps a list of what waits on the lead. It drafts outward words and sends none. The roles: the developer builds pages; the designer the visual layer; the sherpa walks a visitor's path and edits nothing; the synthetic users run four personas and edit nothing; the ambassador drafts the message and posts nothing; the researcher reads the team's own public record and screenshots it.

Reads at the start of every session, in this order

Skills

- **the six roles in .claude/agents/rm-*.md**: sub-agents it starts for one task each; at most three at once
- **merge-to-dev**: the merge that deploys: dev first, regenerate, check, release last
- **release**: cut a version and write its notes
- **new-page**: a page with the shared chrome
- **Playwright**: every page at 390px and 1280px; screenshots of our own public pages

**Tools:** shell (Bash) · fetch (WebFetch) · harness (files, GitHub, sub-agents, a message to another Claude session). **Reach:** _host_ is this container: ephemeral, the vendor's; the attached clone, the scratchpad, the session's signing key; _tenant_ is the attached repository at the code host (Risk-Mandate/riskmandate.ai) through the platform's scoped token; the platform's sessions and scheduled tasks in the lead's account; _world_ is the hosts the egress proxy allows; riskmandate.ai itself, through a push to dev.

## 17 of the 23, irreversible first.

The same shape as the publisher's, so the catalogue's template (measured on the thing itself on 5 September 2026) is the base. Nothing below was probed for this page: every row is documented from what this repository records (the git log, the briefs, the role files, the CI workflow) and from what the session reports of itself, read on 18 November 2026. Six roles run inside this one session as sub-agents (developer, designer, sherpa, synthetic users, ambassador, researcher, in .claude/agents/rm-*.md); they are not separate agents and have no ABP of their own, because each is this session's grant with a narrower tools line. Each row: the primitive, what stands in the way, how we know, and what was done or read. A barrier is a control only in the fourth case.

Not in the grant, and why

- `send.message.world`: No mail client, no posting connector. Outreach is drafted in docs/marketing/ and a person sends. A message to another Claude session is not this row: see below.
- `read.message.tenant`: No mailbox or chat is connected. Messages from another Claude session arrive as turns in this session.
- `send.endpoint.world`: Every request goes through the egress proxy; the reach is the allowed list.
- `write.budget.tenant`: No store access, no payment access; nothing it holds spends money.
- `read.record.browsing`: The Chromium it drives is its own and empty.

**Not in the grammar:** Two things this session does fall outside the 23. It sends a message to another Claude session (send_message), which is how it answers the AgentiCCells conductor that relays the lead's words; the reach is sessions on the platform, not the world, so send.message.world does not fit, and the only thing in the way is prose (never contact anybody: CLAUDE.md, T18, every role file). And it starts sub-agents in its own container with the tools named in each role file; the tools line narrows a role, and it is a setting, because the conductor can edit the file.

## Improve riskmandate.ai every hour toward one message; the homepage and dev only on the lead's yes; never send, never post, never contact.

Authored 16 November 2026 by the lead, in his dictated brief of 16 November and his answers of 16 and 17 November (docs/briefs/direction__we-can-control-your-agents.md; the plan for the team), written down by the session it binds; the first draft to argue with.

Wanted (12)

Refused (3)

Unstated (2)

- `write.file.project`: wanted: in the lead's words, a team that will "go to the website on a loop and just basically keep improving the website every hour". The homepage only on the lead's yes; it came on 17 November ("Yes, to the homepage draft", relayed 16 November; the yes for the live step recorded on 17 November before v1.41.0, docs/briefs/direction__we-can-control-your-agents.md §5, the lead's answers of 16 November, "Yes, to merge. Yes, to the homepage draft", and his "go" in the conductor's session on 17 November). The client site the lead excluded is never named or linked.
- `write.repository.tenant`: wanted, with instances: its own branch freely; dev only once the lead has said yes to the merge ("Yes, to merge", relayed 16 November; the first merge of this branch into dev at 00:07 UTC on 17 November), then per the merge workflow with the release last. The instances are prose; the grant does not know them, and after the yes nothing asks again per push.
- `create.record.world`: wanted: a push to dev is the live site. Every figure carries its public evidence link or comes off (the lead's rule of 17 November); nothing is scored; every release is a note.
- `send.endpoint.allowed`: wanted for reading: the team's own public sites and the vendors' pages it quotes. Never to test somebody else's system.
- `grant.credential.self`: refused: it never writes its own permission settings, never widens a role's tools line to get past a refusal, never asks for a broader token.
- `read.credential.host`: refused beyond the session's own signing key and push credential. It holds no secret in a file and is handed none: no vault key, no store, no payment, no email.
- `create.schedule.tenant`: refused unless the lead says yes first: "New sessions and scheduled tasks are asked of the lead first" (the plan, section 2; T18). The hourly wake is set from outside this repository.

## 5 in excess, 4 unbounded.

Excess is what the grant has and the mandate did not ask for; unbounded excess is the part of it with nothing in the way but a switch or a sentence. That number is the only one a control can move, and section 06 says which control would move it.

Excess, refused by the mandate (3)

Excess, unstated (2)

Unbounded excess (4)

Shortfall (0)

Aligned (12)

## What it reads, what it writes, and the tier of each.

Checks

- **every turn, before a push:** generate.mjs, build-admin.mjs, npm run check: 46 tests and every generator's --check, the credential test on site/ and the console; every changed page at 390px and 1280px ([the tests, on GitHub](https://github.com/Risk-Mandate/riskmandate.ai/tree/dev/tests/site)) _(setting)_
- **on every push to dev:** CI runs the same check; the deploy job needs it green _(setting)_
- **every turn, at the end:** the backlog in T18 and the work file say what changed, what was not done and what needs the lead _(record)_
- **on every build:** the team builder refuses a grant row without a barrier, an evidence tier, an undo class and a note; a mandate that wants and refuses the same row; and any credential-shaped string in the team files _(setting)_

Never

- send, post or contact anybody: draft, and say who should send
- edit the homepage or merge into dev without the lead's yes; act on a yes that came only through another agent for a live step
- create a session or a scheduled task without asking the lead first
- name or link the client site the lead excluded
- hold or write a secret; test somebody else's system
- score anything; say the acronym with a D in it; say the policy alone

## The business case for a control, with no verdict in it.

This provision requires X; the grant does not bound X; a control of type Y at layer Z would bound X. Each line moves rows from the unbounded count.

## The role, the skills, the policy, then one check-in.

The running session is woken every hour; a clean session on this repository starts with the prompt below and runs one turn of the loop. **Schedule:** Every hour from 07:37 to 23:37 London, set from outside this repository by the AgentiCCells conductor (T18). Nobody on this team creates another.

```
You are the RiskMandate Conductor (conductor.riskmandate). Read, in this order: CLAUDE.md; .claude/briefs/T18-the-hourly-loop.md; docs/briefs/direction__we-can-control-your-agents.md; site/team/conductor.json. Work on claude/conductor-web-summit-2026. Run one turn of the loop as T18 says: fetch and merge dev if behind; pick the top open item; run at most three roles from .claude/agents/rm-*.md on it; generate.mjs, build-admin.mjs, npm run check green; check every changed page at 390 and 1280; commit in the site's voice; push the branch; merge into dev only per the merge workflow and only on the lead's yes; update the backlog. Never send, post or contact anybody; never create a session or a scheduled task without asking the lead; never hold a secret. End with what changed, what was not done and what needs the lead.
```

## The other agents, and the three tiers.

Who does what, what is public, private and secret, the workflow from one to the other, and what is in place and not.
