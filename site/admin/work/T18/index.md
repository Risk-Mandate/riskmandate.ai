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
| 1 | The homepage draft rebuilt around the message, with the situations (micro) and the summit (macro), the film, the ladder (proposed), the book, and agenticcells.ai | developer, designer | **live** v1.41.0 |
| 2 | Situations page: each a real case from our own record (needed a permission; the gap found; the rule that failed and became a barrier), quoted, dated, screenshotted | researcher, developer | **done** (round 2): `/web-summit-2026/situations.html`, 18 cases, data in `docs/marketing/situations/` |
| 3 | The ladder on `pricing.html` (£500 / £1,500 / £5,000 / £20,000), once the lead confirms it directly | developer, ambassador | **done** v1.41.0: the ladder live, £10/£50 retired |
| 4 | The archive: old pages kept at their addresses with a dated note, listed on `/archive/` | developer, sherpa | started v1.41.0: `/archive/` with the old home page; more pages to move |
| 5 | Web Summit photos and stills: which are public, of whom, and a gallery in more than one design | researcher, designer | photos copied and on the homepage draft (round 2); stills next |
| 6 | The film on the homepage and in the summit section | designer, developer | **done** (home v1.41.0, summit record v1.41.17) |
| 7 | Where a rule is kept: prompt, hook, boundary (from the newsroom map) | developer, researcher | open |
| 8 | A sherpa walk and four synthetic personas over the branch build | sherpa, synthetic users | first run 17 Nov (`docs/marketing/synthetic-users-2026-11-17.md`); fixes 1–4 v1.41.8; every few turns |
| 9 | The one-paragraph message and the cross-links with agenticcells.ai and the hub | ambassador | cross-link lines agreed with the AgentiCCells conductor 16 Nov (ours on the homepage draft; theirs: "Already running agents and need to control them? RiskMandate writes the behaviour policy, from one agent to hundreds."); the message drafted 17 Nov (`docs/marketing/the-message-2026-11-17.md`, three drafts; draft A recommended) — for the lead to choose and a person to post |
| 10 | The book: the PDF and the Leanpub link, where it sits on the site | developer, ambassador | **done on the draft** (round 2): PDF hosted, Leanpub linked |
| 14 | Stale figures from the audit, quick: pricing "Fifteen example policies" (16); after-payment "fifteen templates" and its zip table (missing claude-gmail-connector, sizes stale); team pages "40 tests" (45); about "sixty pages"; uk-support's levels; interview-founder-marketing's £10/£50 | developer | **done** v1.41.3 |
| 15 | Evidence links, page by page from `docs/marketing/evidence-audit-2026-11-17.json` (129 add-link, 19 remove-or-source); insure-a-program v1.41.5; the pilots article, secure-harness, reviewer-dinis-cruz v1.41.6; Lab pages wait (dated editions: a change means a new edition); pricing and the OWASP charter and contributions v1.41.7; twelve more pages v1.41.15; the last 21 pages v1.41.16 (try-it's figures sit inside linked cards: open). The audit is done apart from the Lab editions and the archive | researcher, developer | in progress |
| 16 | For the lead: whether the sixteen template zips may be linked from after-payment (the retired £10 pack; the files are already public);  five unsourced figures to source or remove (credit-agent story removed v1.41.6; Mosaic, Nexus, ElevenLabs corrected v1.41.5; MIT NANDA linked to a public mirror — is a mirror acceptable?; Dinis's OWASP roles link only his own page); the investor deck's market figures need links | the lead | waiting |
| 17 | From the synthetic users: a page a developer can start from (**done** v1.41.9, `/developers.html`, unlisted; a menu entry waits on the lead); the insurance pages link the real data and label design as design (**done** v1.41.13); `/team/` dated note on the new roles (**done** v1.41.13; their ABPs not written yet); the store still sells £10/£50 and says links not issued (the store team's) | developer, researcher, the lead | open |
| 18 | Phone length: home v1.41.11 (9,086→7,093), pricing and try-it v1.41.14 (9,945→6,135; 10,089→7,048) | developer, designer | **done** |
| 19 | Newsroom of 17 Nov: "The payment desk" as a situation or example for money-adjacent agents (money in plain auditable code; budgeted single-use cards only once trusted; the lead's position, not a product); "Patient vaults, answered" for a regulated-buyer FAQ; "Keys after payment" only if the lead says it is built for the £500 offer | researcher, developer | open |
| 20 | Once https://agenticcells.ai/website-cell/ is live: one line linking it as behaviour policies in practice (the lead, 17 Nov: "every one of these is a deployment of agent behavior policies"); place: the home page's four ways in or the summit record | ambassador, developer | **done** v1.41.18 (home page, four ways in) |
| 13 | Evidence audit, every page: each figure links to its public evidence or comes off (the lead's rule of 17 Nov); home page v1.41.1, the summit record v1.41.2; the rest audited 17 Nov (docs/marketing/evidence-audit-2026-11-17.json) | researcher, developer | **in progress** |
| 12 | `pricing.html` scrolls sideways on a phone (844px at 390): already so on v1.40.3; the levels table's wrapper does not hold it | developer | **done** v1.41.2: the second table had no scroll container |
| 11 | The universe view's white border stripes: find where the view lives and the cause | developer | open; it may live on another site |

## Done means

Never done; a turn is done when its item moved, the check is green, the branch is pushed and the backlog says so.
