# T18 — The hourly loop: a team that improves riskmandate.ai every hour, toward one message

> Rendered from .claude/briefs/T18-the-hourly-loop.md in the repository. The text below is that file.
> Source: https://riskmandate.ai/admin/work/T18/ · noindex · written by scripts/site/build-admin.mjs

**From:** `docs/briefs/direction__we-can-control-your-agents.md` (the lead, 16 Nov) · **Size:** standing
**Status:** started 16 November 2026, on `claude/conductor-web-summit-2026`

## Why

The lead: two full agentic teams that "go to the website on a loop and just basically keep improving the website
every hour", toward one message: *we can control your agents, from one agent to hundreds*, shown with proof. This is
the riskmandate.ai team's loop. The wake is set from outside this repository (hourly, 07:37 to 23:37 London, by the
AgentiCCells conductor); nobody on this team creates another.

## The team

One conductor session; the roles are sub-agents it runs for a task, defined in `.claude/agents/`:
`rm-developer`, `rm-designer`, `rm-sherpa`, `rm-synthetic-users`, `rm-ambassador`, `rm-researcher`. The
publisher (`publisher.md`) keeps its own job. A new session or a scheduled task is asked of the lead first.

## One turn of the loop

1. Read notifications; read this file's backlog; `git fetch origin dev` and merge it if the branch is behind.
2. Pick the top open item; run at most three roles on it in parallel (a researcher or the sherpa first when the
   item needs facts or a path, the developer and the designer to build, synthetic users to check).
3. `generate.mjs`, `build-admin.mjs`, `npm run check` green; screenshot at 390 and 1280; commit in the site's voice.
4. Push the branch. **Merge into `dev` only once the lead has said yes to the merge**, then per the merge workflow
   (release last). The homepage only on the lead's yes.
5. Update the backlog below and the work file: what changed, what was not done, what needs the lead.

## The backlog (top is next)

| # | Item | Roles | State |
|---|---|---|---|
| 1 | The homepage draft rebuilt around the message, with the situations (micro) and the summit (macro), the film, the ladder (proposed), the book, and agenticcells.ai | developer, designer | round 1 done; photos and book added round 2 |
| 2 | Situations page: each a real case from our own record (needed a permission; the gap found; the rule that failed and became a barrier), quoted, dated, screenshotted | researcher, developer | open |
| 3 | The ladder on `pricing.html` (£500 / £1,500 / £5,000 / £20,000), once the lead confirms it directly | developer, ambassador | **answered** (retire £10/£50); next |
| 4 | The archive: old pages kept at their addresses with a dated note, listed on `/archive/` | developer, sherpa | **answered: a folder**; open |
| 5 | Web Summit photos and stills: which are public, of whom, and a gallery in more than one design | researcher, designer | photos copied and on the homepage draft (round 2); stills next |
| 6 | The film on the homepage and in the summit section | designer, developer | open |
| 7 | Where a rule is kept: prompt, hook, boundary (from the newsroom map) | developer, researcher | open |
| 8 | A sherpa walk and four synthetic personas over the branch build | sherpa, synthetic users | open; every few turns |
| 9 | The one-paragraph message and the cross-links with agenticcells.ai and the hub | ambassador | cross-link lines agreed with the AgentiCCells conductor 16 Nov (ours on the homepage draft; theirs: "Already running agents and need to control them? RiskMandate writes the behaviour policy, from one agent to hundreds."); the message itself open |
| 10 | The book: the PDF and the Leanpub link, where it sits on the site | developer, ambassador | **done on the draft** (round 2): PDF hosted, Leanpub linked |
| 11 | The universe view's white border stripes: find where the view lives and the cause | developer | open; it may live on another site |

## Done means

Never done; a turn is done when its item moved, the check is green, the branch is pushed and the backlog says so.
