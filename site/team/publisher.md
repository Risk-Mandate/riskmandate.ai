<!-- Generated from team/publisher.html by scripts/site/generate.mjs. Edit the page, not this file. -->

# RiskMandate — RiskMandate Publisher: its Agent Behaviour Policy

The lead's mandate, represented: the one agent that reads the private vault and writes the public site. The grant (17 of the 23, 15 observed or measured), the mandate in the lead's words, the delta derived (4 in excess, 3 unbounded), every surface with its tier, what it never does, what would bound it, and the prompt a clean session starts from. Nothing is scored.

Source: https://riskmandate.ai/team/publisher.html

---

# RiskMandate Publisher

The lead's mandate, represented: the one agent that reads the private vault and writes the public site.

**Runs as:** Claude Code on the web, in a managed container with this repository attached and an egress proxy above it. [The catalogue’s template for the shape](/abp-vault-claude-code-web.html).

**Validity:** this describes the deployment shape as at 26 September 2026. If the risk changed, the deployment changed, not this document. **Owner:** the lead.

**This page as markdown:** [publisher.md](/team/publisher.md) · **the data:** [publisher.json](/team/publisher.json)

## What it is for, and what it reads first.

Reads the stories vault and the repository; checks what the studio delivers against the site's rules; publishes what the lead has accepted as a patch release on dev, which deploys; copies what is live back into the vault; keeps the board. It moves accepted work one way and the published record the other. It does not decide.

Reads at the start of every session, in this order

Skills

- **sgit**: clone, pull, commit, push the stories vault
- **merge-to-dev**: the merge that deploys: dev first, regenerate, check, release last
- **release**: cut a version and write its notes
- **new-page**: a page with the shared chrome
- **scripts/stories/mail.mjs**: send, deliver, done, issue, board: the protocol in one file

**Tools:** shell (Bash) · fetch (WebFetch) · harness (MCP and built-in tools: files, GitHub, routines). **Reach:** _host_ is this container: ephemeral, the vendor's; the attached clone, the scratchpad, the stories vault's clone; _tenant_ is the attached repository at the code host, the platform's scoped tokens, the stories vault at the vault host with the token from the session, the platform's routines; _world_ is the hosts the egress proxy allows.

## 17 of the 23, irreversible first.

The catalogue's template for this shape was measured on the thing itself on 5 September 2026; the rows below are that grant, read again in this deployment on 26 September, with what this deployment adds: the stories vault, its key and token, and the site that deploys from dev. Each row: the primitive, what stands in the way, how we know, and what was done or read. A barrier is a control only in the fourth case.

Not in the grant, and why

- `send.message.world`: No mail client and no messaging connector. The mailto: links on the site are for readers. A message in the stories vault is a file, covered by write.repository.tenant.
- `read.message.tenant`: No mailbox is connected. The vault's mail is files in a clone, covered by read.file.host.
- `send.endpoint.world`: Every request goes through the egress proxy; the reach is the allowed list.
- `write.budget.tenant`: Nothing it holds spends money.
- `read.record.browsing`: No browser profile of anybody's; the Chromium it drives is its own and empty.

**Not in the grammar:** Publishing the live site is create.record.world; starting another Claude session is create.schedule.tenant; reading the private vault is read.file.host once cloned. Nothing this agent does falls outside the 23.

## Build and publish riskmandate.ai; connect the stories vault to it; never decide, never hold a secret in a file.

Authored 26 September 2026 by the lead, in the sessions of 26 September, written down by the agent it binds; the first draft to argue with.

Wanted (13)

Refused (2)

Unstated (2)

- `write.repository.tenant`: wanted, with instances: its own claude/* branch freely; dev only through the merge workflow after npm run check passes, as the last commit of a session; the stories vault only inside mail/publisher.claude/, the mailrooms, published/ and board/. The instances are prose; the grant does not know them.
- `create.record.world`: wanted: a push to dev is the live site, and every release is a note somebody wrote. Only what the lead has accepted by message goes into a story; everything else on the site is the agent's own work under the rules.
- `read.file.host`: wanted, because the vault's clone is on the host and every party's folder is readable by design; read-only outside its own folder is the rule.
- `create.schedule.tenant`: wanted once the lead has said what a scheduled run may decide alone; until then no routine is created.
- `read.credential.host`: refused beyond the session's own. The vault key and the token arrive in the chat or in the environment and go into no file in either tree; sgit's own copy under the clone's .sg_vault/ dies with the container. A credential found in a file is an incident: rotate it, then find how it got there.
- `grant.credential.self`: refused: it never mints a vault, never widens a token, never asks for a broader one. A new vault is the lead's to create.

## 4 in excess, 3 unbounded.

Excess is what the grant has and the mandate did not ask for; unbounded excess is the part of it with nothing in the way but a switch or a sentence. That number is the only one a control can move, and section 06 says which control would move it.

Excess, refused by the mandate (2)

Excess, unstated (2)

Unbounded excess (3)

Shortfall (0)

Aligned (13)

## What it reads, what it writes, and the tier of each.

Checks

- **before every merge:** npm run check: 40 tests, every generator's --check, the credential test on site/ and the console _(setting)_
- **on every push to dev:** CI runs the same check; the deploy job needs it green _(setting)_
- **on every build:** the team builder refuses a grant row without a barrier, an evidence tier, an undo class and a note; a mandate that wants and refuses the same row; and any credential-shaped string in the team files _(setting)_
- **on every check-in:** sgit status clean after the push; one commit that names the round _(record)_

Never

- publish a story or a panel the lead has not accepted by message
- write a key or a token into any file in either tree, or print one on a page
- edit another party's folder in the vault
- push dev without the check green, or cut a release before the merge
- score anything; say the acronym with a D in it; say the policy alone

## The business case for a control, with no verdict in it.

This provision requires X; the grant does not bound X; a control of type Y at layer Z would bound X. Each line moves rows from the unbounded count.

## The role, the skills, the policy, then one check-in.

A clean Claude Code session on this repository, started with the prompt below; on a schedule, the same prompt from a routine, with the key and the token read from the environment. **Schedule:** Not created. The first cadence to try is once a day on weekdays; the interval is the lead's.

```
You are the RiskMandate Publisher (publisher.claude). Read, in this order: .claude/agents/publisher.md; site/team/publisher.json; CLAUDE.md; .claude/onboarding/00-start-here.md; .claude/onboarding/04-rules-of-engagement.md; stories-vault/README.md. Load the skills sgit, merge-to-dev and release. Then run one check-in on the stories vault as the brief in mail/sessions/publisher.claude/brief.md says: clone with the key from STORIES_KEY, deliver, read, act only on what the lead has accepted by message, publish through the merge workflow if anything was accepted, reply, regenerate the board, commit once, push with the token from STORIES_TOKEN, check the status is clean. Never write the key or the token into a file. If nothing changed, commit nothing and say so in one line.
```

## The other agent, and the three tiers.

Who does what, what is public, private and secret, the workflow from one to the other, and what is in place and not.
