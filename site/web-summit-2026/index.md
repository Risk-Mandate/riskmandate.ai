<!-- Generated from web-summit-2026/index.html by scripts/site/generate.mjs. Edit the page, not this file. -->

# RiskMandate — In action at Web Summit 2026: the policies, the runs, the record

What Web Summit 2026 left on the public record: 191 Agent Behaviour Policy documents across three of the team's sites, 2,262 run reports, every gap logged, one rule turned into a barrier. Every figure sourced and dated, 16 November 2026. Nothing scored.

Source: https://riskmandate.ai/web-summit-2026/

---

# RiskMandate in action, on our own agents.

From 9 to 12 November 2026 in Lisbon, a team of people and their agents ran a stand, a newsroom and an incident site. Most agents on that team had an Agent Behaviour Policy (ABP) written in this site’s grammar, 94 of the 109 on the team’s circuit on 10 November ([the stand deck](https://web-summit.sgit.ai/meetings/2026-11-10-1600/show/)): what it can reach, what it was authorised to do, the gap, and what stands in the way. This page is the mapping of what that left on the public record, with every figure sourced and dated.

**Nothing here is scored.** A count is a count, and where two of our own pages give different counts, both are printed and neither is chosen.

**As at** 16 November 2026, every source read that day between 10:00 and 11:30 UTC. Our sources only: the team’s public sites and the public repositories behind them. No private record, no contact detail, nothing measured on anybody else’s system.

## Four days in Lisbon, and the ten before them.

The team’s own account, in the team’s own pages. The stand was on Thursday 12 November, booth A1-30. The rest of the week was the work behind it.

| What | As the source puts it | Source, date |
| --- | --- | --- |
| The team | “Seven of us. Our agents. One RiskMandate.” Nine people on the team page, seven going to Lisbon. | [web-summit.sgit.ai](https://web-summit.sgit.ai/), v0.2.2247, 16 Nov |
| The agents | “9 people, 164 agents”; “137 agents have committed, and 27 more are proposed” | [web-summit.sgit.ai/team/everything/](https://web-summit.sgit.ai/team/everything/), 16 Nov |
| Ten days, counted | “about 20,000 commits” across 15 repositories, “224 Claude Code sessions”, “around 250 named agents” | [newsroom.sgit.ai](https://newsroom.sgit.ai/articles/ten-days-at-web-summit.html), 14 Nov |
| The stand deck | “Give agents access. Not free rein.” “nine people, 119 agents that have run, 85 at work in 48 hours” | [web-summit.sgit.ai/meetings/2026-11-10-1600/show/](https://web-summit.sgit.ai/meetings/2026-11-10-1600/show/), 10 Nov |
| The newsroom | PrompTugal.news, “powered by RiskMandate”: “73 articles”, “61 named agents in 43 roles”, “fifty requests to companies and sent none” | [newsroom.sgit.ai](https://newsroom.sgit.ai/articles/promptugal-news-the-newsroom-we-ran.html), 15 Nov; [promptugal.news/riskmandate/](https://promptugal.news/riskmandate/) |
| The incident site | Storm Charles, Lisbon, 10 to 12 November: decisions, warnings and public signals, each sourced and timed. “Not a warning service: follow IPMA and ANEPC.” “2,618 pages”. | [storm-charles.promptugal.news](https://storm-charles.promptugal.news/); newsroom.sgit.ai, 14 Nov |
| The film | _Know the Reach_, a song with subtitles, 3:39 on the stand site; the music video’s first part, 53.4 seconds, by Silvio Switha | [riskmandate-at-websummit.agenticcells.site](https://riskmandate-at-websummit.agenticcells.site/#film), 16 Nov; [newsroom.sgit.ai](https://newsroom.sgit.ai/articles/know-the-reach.html), 15 Nov |
| The pause | “9 Nov … at 23:30, the Big Stop: every agent paused”; “12 Nov … the final hold at 18:12” | [newsroom.sgit.ai](https://newsroom.sgit.ai/articles/ten-days-at-web-summit.html), 14 Nov |

The film, by Silvio Switha, November 2026, as shown at the stand; it says delta where this site says gap. The song and its video: [newsroom.sgit.ai](https://newsroom.sgit.ai/articles/know-the-reach.html).

## One for every agent, in three places.

The lead’s estimate was a hundred to two hundred ABPs. Counted file by file on 16 November, the three sites publish 191 documents. That sum counts some agents twice: two of the team site’s pages cover groups that also have files on the PrompTugal board. We have not removed the overlap, so 191 is an upper bound on distinct agents with an ABP, not a count of them.

| Where | Count | Status, in the source’s words | How counted |
| --- | --- | --- | --- |
| [web-summit.sgit.ai/abp/](https://web-summit.sgit.ai/abp/), one page per agent on the team | 94 | “the ABPs are in the explorer phase … observe and recommend; they block nothing” (at the lead’s word, 6 Nov). The index says “93 pages”; the stand deck says “93 pages, one per agent”. | sitemap: 100 abp URLs less 6 that are not agent pages |
| PrompTugal.news board, `board/abp/` in the [public repository](https://github.com/PrompTugal/PrompTugal__News__Website) | 54 | generated from one data file, `policies.json` v1.13.0 (16 Nov 07:40 UTC): 11 rules, 47 grants. Mode “observe”: “observe first, never block”. Every circuit breaker off. | files in board/abp/, less README and the page file; public clone, 16 Nov |
| [storm-charles.promptugal.news](https://storm-charles.promptugal.news/library/abp.md), one per incident agent | 43 | “DRAFTS, NOT AGREED BY DINIS.” “Only the librarian’s own session was measured; the others’ tools and connectors are not known here.” | policy.md entries in its llms.txt |

## Written down, then found, then fixed.

Two records, kept differently. The team site counted cases by hand for the first week. The PrompTugal board has every agent run file a report, and a run without one counts against its own rule (R10).

| What the team site recorded, 2 to 6 November, about 85 agents | Count |
| --- | --- |
| Caught by a review before it went out | 7 |
| Found by an ABP, then fixed by its owner (“the gap was written down, an issue opened, and the owner closed it”) | 7 |
| A rule failed, and became a technical barrier: on 2 November at 23:06 UTC the conductor pushed to main; main was protected on 6 November, and “never push to main” is a technical barrier in all 72 behaviour policies of that day | 1 |
| Found, still open | 6 |

Sources: [web-summit.sgit.ai/abp/in-action/](https://web-summit.sgit.ai/abp/in-action/), first written 6 Nov; [web-summit.sgit.ai/reports/2026-11-06-0457/](https://web-summit.sgit.ai/reports/2026-11-06-0457/).

| What the PrompTugal run reports hold, 6 Nov 04:47 to 16 Nov 10:26 UTC | Count |
| --- | --- |
| Run reports | 2,262 |
| Distinct agents filing them | 76 |
| Tool calls recorded | 25,393 |
| Entries logged as outside the grant: 2,979 writes outside the agent’s grant (rule R6), 1 compaction the hook did not re-anchor (R1) | 2,980 |
| Calls blocked: a write to the hold file, which only the lead lifts (R6, 6 Nov 05:11 UTC) | 1 |

Counted by us from a read-only clone of `board/runs/` in [PrompTugal/PrompTugal__News__Website](https://github.com/PrompTugal/PrompTugal__News__Website), about 10:30 UTC on 16 Nov. The site’s own figure that morning: “2260 run reports” logging “2962 actions outside an agent’s grant” ([promptugal.news/agentic-system/](https://promptugal.news/agentic-system/), v0.1.1606). The repository grows every hour.

## A hundred agents on one screen, and what “at once” means.

What people stopped for at the stand was the picture of the whole team at work. These are the views, and the counts each one gives. They measure different things, so they do not agree, and they are not meant to.

### “109 agents, 94 with a written policy”

Each agent wired through its ABP and barriers to what it reaches. The release note of 10 November adds “the circuit’s ‘Team now’: every agent working at once”.

stand deck, [10 Nov](https://web-summit.sgit.ai/meetings/2026-11-10-1600/show/); a person’s command centre on web-summit.sgit.ai

### “9 people and 137 running agents”

“A grey curve is a message between agents … 344 pairs so far.”

[web-summit.sgit.ai/team/map/](https://web-summit.sgit.ai/team/map/)

### Team, Agents, Reach, Universe, Flow

“Universe: the team drawn as planets and moons, with agents that have no policy flagged in red.” Reach joins agents to “mail, keys, the site, infrastructure, the CRM”.

[the stand site](https://riskmandate-at-websummit.agenticcells.site/#stand); [the demo screen](https://web-summit.sgit.ai/assets/demo/screen.htm)

### “48 loops at once”

Twelve storm tasks on four models, run by one agent: 48 loops, peak concurrency 96. A view of one run six ways, not of a hundred agents.

[swarm.promptugal.news](https://swarm.promptugal.news/), runs/index.json

| “At once”, counted four ways | Figure | Source |
| --- | --- | --- |
| Claude Code sessions working at the same time, at the peak (an upper bound from each session’s start and last activity) | 64 to 67 | [newsroom.sgit.ai](https://newsroom.sgit.ai/articles/ten-days-at-web-summit.html), 14 Nov, for 11 Nov |
| Sessions created in one day, the storm swarm | 134 | [newsroom.sgit.ai](https://newsroom.sgit.ai/articles/ten-days-at-web-summit.html), 14 Nov |
| Agents with overlapping run windows in the PrompTugal reports (an upper bound: a run can sit idle) | 25 | our count from [the run reports](https://github.com/PrompTugal/PrompTugal__News__Website/tree/dev/board/runs), 6 Nov 23:49 UTC |
| “more than 120 agents at once” (abstract); “more than a hundred agents” (index) | >100 | [newsroom.sgit.ai](https://newsroom.sgit.ai/articles/where-assist-becomes-execute.html), 15 Nov |

## What exists, and where.

- [riskmandate-at-websummit.agenticcells.site](https://riskmandate-at-websummit.agenticcells.site/): the stand site. The film, the three questions (reach, mandate, gap), the stand views, photos of the week. Published 16 November; the film is in an encrypted vault with its read key printed on the page, as ours are.
- [Know the Reach](https://www.youtube.com/watch?v=BjN-K-C2fsw), the music video, part one; the song released 13 November. “The rest of the song is still to be filmed.”
- [web-summit.sgit.ai](https://web-summit.sgit.ai/): the team site. 756 pages on its sitemap: the ABPs, 181 meeting pages, 67 reports, the stand decks, an [ABP maker](https://web-summit.sgit.ai/abp-make/) (“about two minutes … Nothing you type is stored or sent”).
- [promptugal.news](https://promptugal.news/) and [storm-charles.promptugal.news](https://storm-charles.promptugal.news/): the two sites the agents ran under their ABPs, each with its agentic-system page and its policies public.
- newsroom.sgit.ai: [What can your agent reach](https://newsroom.sgit.ai/articles/what-can-your-agent-reach.html) (18 Oct), [Web Summit 2026: the plan](https://newsroom.sgit.ai/articles/web-summit-2026-the-plan.html) (26 Oct), the team series of 30 Oct to 4 Nov, [Ten days at Web Summit](https://newsroom.sgit.ai/articles/ten-days-at-web-summit.html) (14 Nov, the first of a promised thirteen), [Where assist becomes execute](https://newsroom.sgit.ai/articles/where-assist-becomes-execute.html) (15 Nov).

## No customer is named. The follow-ups are sealed.

Nothing on the public record names a customer, pilot or partner of the ABP, and this page does not either. What the record does say:

- PrompTugal.news is called the “first customer” of the agentic-team service, not of the ABP ([newsroom.sgit.ai](https://newsroom.sgit.ai/articles/an-agentic-console.html), 15 Nov). It is ours.
- The people the team met are on a sealed list: “No names are on this site: the list is a sealed record”, started 13 November; the team’s client pipeline takes it over ([web-summit.sgit.ai/crm/follow-ups/](https://web-summit.sgit.ai/crm/follow-ups/)). Five booked meetings are in a private vault, “all marked not public”.
- The week-after plan: “Every conversation followed up from the map … A follow-up is drafted in the person’s own email … The person sends it.” Six drafts and a style guide were saved on 13 November ([web-summit.sgit.ai/plan/](https://web-summit.sgit.ai/plan/)).
- Open from the 13 November stand-up: “Who writes the one-paragraph RiskMandate message” ([web-summit.sgit.ai/meetings/2026-11-13-1800/](https://web-summit.sgit.ai/meetings/2026-11-13-1800/)).
- Promised in public: the rest of the _Know the Reach_ video; the thirteen-article _Ten days_ series; a first-customer site, start-here page and mailing list, all marked “proposed” ([20 Oct](https://newsroom.sgit.ai/articles/our-first-customers.html)).
- On this site: the homepage still invites people to the stand of 12 November. That strip is now in the past tense of the calendar, not of the page; it changes with the new homepage (section 09).

## Printed side by side, unresolved.

Each is right about what it counts. A reader quoting one should quote what it counts. Every figure below is linked to its evidence where it first appears, in sections 01 to 04; the newer ones here: [the PrompTugal agentic-system page](https://promptugal.news/agentic-system/) (“2260”, “2962”), [the team page](https://web-summit.sgit.ai/team/everything/) (164, 137), [the ABP index](https://web-summit.sgit.ai/abp/) (“93 pages”), [the stand site](https://riskmandate-at-websummit.agenticcells.site/#film) (3:39), [the newsroom](https://newsroom.sgit.ai/articles/know-the-reach.html) (53.4 seconds), [the newsroom piece](https://newsroom.sgit.ai/articles/promptugal-news-the-newsroom-we-ran.html) (“73 signed articles”).

| Measure | Figures |
| --- | --- |
| Agents on the team | “around 250 named agents” (distinct names); 164 (137 committed + 27 proposed); 119 that have run (10 Nov); 109 in the circuit; 94 ABP pages; 76 agents filing run reports; “about 85” (first week) |
| ABP pages on the team site | 94 (sitemap, 16 Nov); “93 pages” (index, deck); 72 behaviour policies (6 Nov) |
| Actions outside the grant | “2962” (site, v0.1.1606); 2,980 entries (reports, our count); 1,951 (sum of the reports’ own out-of-mandate counter) |
| Run reports | “2260” (site); 2,262 (repository, a little later) |
| The film’s length | 3:39 (the stand site); 53.4 seconds, part one, of a song “about three and a half minutes long” (newsroom) |
| PrompTugal articles | “73 signed articles”; 79 article URLs on the sitemap |

## A team for this site, and its first two weeks.

Started on 16 November at the lead’s word: run riskmandate.ai with a team on the post-summit follow-up, the publications, the marketing pushes, the positioning, and the real examples. One conductor session; every role below is a sub-agent it runs, not a session of its own. Agents draft; a person sends. The full plan is the brief [plan__riskmandate-team-after-web-summit-2026.md](https://github.com/Risk-Mandate/riskmandate.ai/blob/dev/docs/briefs/plan__riskmandate-team-after-web-summit-2026.md). Eighteen small cases from the record are on [the situations page](/web-summit-2026/situations.html). The site itself, rebuilt around the newsroom’s material, is proposed on [the site plan](/web-summit-2026/site-plan.html), with every article it draws on in [the newsroom map](/web-summit-2026/newsroom-map.html).

### Conductor

Holds the calendar and this section; merges into dev; reports to the lead. Asks before any new session or scheduled task.

### Evidence and case studies

Turns the record into case pages: the push to main, the hold file, the gap per agent. Every number recounted from source on the day it is printed.

### Publications

The summit articles on this site, in its voice; release notes; tracks the thirteen promised on the newsroom.

### Follow-up

The public material a follow-up points to: one page per conversation type. Drafts only; never holds the sealed list; a person sends.

### Sales

The offer after the summit: the levels as priced, the early-user route, design partnerships with security teams as the stand deck named them.

### Positioning and marketing

The one-paragraph RiskMandate message (open since 13 Nov); the pushes on LinkedIn and the newsroom, drafted for a person to post.

### Designer and developer

The new homepage behind a private page; the swarm picture as a static, sourced figure the site can carry without a live feed.

| When | What | Who |
| --- | --- | --- |
| Mon 16 Nov | This mapping, published unlisted; the plan as a brief | conductor |
| Tue 17 – Wed 18 | The homepage’s stand strip moved to the past tense and pointed here, once the lead says yes; a private draft of the new homepage | dev, designer |
| Tue 17 – Thu 19 | Case page one: _the rule that became a barrier_ (2 to 6 Nov), from the in-action record | evidence, publications |
| Wed 18 – Fri 20 | The one-paragraph message, three drafts for the lead; follow-up landing pages by conversation type | positioning, follow-up |
| Fri 20 | The lead reviews the homepage draft and the message | the lead |
| Mon 23 – Tue 24 | Case page two: _2,262 runs, every gap logged_; the swarm figure as a sourced static image | evidence, designer |
| Wed 25 – Thu 26 | The post-summit offer on the pricing and early-access pages; a LinkedIn series drafted for a person to post | sales, marketing |
| Fri 27 | The new homepage live if approved; a dated recount of every figure on this page | dev, evidence |

## RiskMandate in action at Web Summit 2026.

**A proposal. The homepage has not changed and will not until the lead approves.** A private draft is at [home-proposal](/web-summit-2026/home-proposal.html). The shape: the summit leads, because it is the first time the ABP ran on a team of this size rather than on a template.

- **The opening.** “Give agents access. Not free rein.” kept as the line; under it, the team at work as one picture (the circuit or the team map, as a still, dated) and the film.
- **The record, in four counts.** ABPs published, run reports, gaps logged, the one rule turned barrier: each linked to its source here, each with its date, none scored.
- **The loop, once.** The push to main on 2 November, the barrier on 6 November: the clearest single story of reach, mandate and gap.
- **What you can do now.** The ABP maker and the sixteen free examples, then the levels as priced today.
- **What was not done.** Observe mode, not blocking; documented, not measured; nobody outside the team has checked the counts. Said on the homepage, not only here.

## Read, counted, not tested.

Four read-only passes on 16 November: this site’s own pages; the team site (all 756 sitemap pages as markdown); PrompTugal.news, Storm Charles and the PrompTugal board through a public clone; the stand site and newsroom.sgit.ai. GET requests and a public clone only; nothing was submitted, probed or measured on any system. No private vault, sealed list or customer record was read. The team site’s interactive views were not rendered; two release notes on it name articles we could not find. The Fringe repository was not counted.
