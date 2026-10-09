# The board

> The queue of work on riskmandate.ai as a board: open, in flight, waiting on a ruling, done — read off the state file, the task briefs and the work files.
> Source: https://riskmandate.ai/admin/work/ · noindex · written by scripts/site/build-admin.mjs

### Open0

nothing here

### In flight0

nothing here

### Waiting on a ruling0

nothing here

### Done4

[#R1 · T15 · a day and a half**Rule schema, generator, index, the first four rules, linked first from `try-it.html`** done v1.37.0](../../admin/work/T15/)[#R2 · T16 · a day**Before and after for the four, on our own deployment, and the method page** done v1.37.0](../../admin/work/T16/)[#R3 · T17 · half a day per five**The candidate list and the next twenty rules, Claude shapes first** done v1.37.0: 24 rules, all ten candidate capabilities covered](../../admin/work/T17/)

#R4 · **The test drive with the lead's early users (open: needs the list); the path wired from the home page's builder (done**); a rule set per shape as a file (**done**, `rules/sets/`); *ask first* on T07's list (**done**; the Lab page itself is T07)

partly done

The four columns are read off the status column of the queue in [the state file](../../admin/agents/03-state-and-next/): *done* is done; *waiting on the lead* is needs the lead; any other *waiting* is waiting outside; a row whose brief a work file names is in flight; the rest are open and claimable. Nothing is dragged, so the board cannot say something the file does not.

## Waiting on a ruling — 11, counting the decisions the lead owns

**The review page `/home-diff.html` (private, v1.38.2): read the feedback in the review vault `ao0lynta` (lane `review`) with `REVIEW_KEY=… node scripts/review/read-feedback.mjs --vault <clone>`, then commit and push the clone; the lead holds the key, and a session needs it as `REVIEW_KEY`; the prices A/B/C/D and the keep/remove answers decide the next home page. `/engagements.html` (private) waits on the founders.**

a decision the lead owns, listed in the state fileneeds the lead

**From the ten-questions review of 9 October: sign off the proposed home page at `/home-next.html` (private); fix the £5 level-1 chips on the licence, for-corporate and for-founders pages and the insurance page's tense now (recommended); whether larger engagements appear on the pricing page; the source of the 0.388 figure.**

a decision the lead owns, listed in the state fileneeds the lead

**The OWASP move** (8 Oct, D30/D31; `site/owasp/`, record `site/owasp/project.json`): the name (Agent Behaviour

a decision the lead owns, listed in the state fileneeds the lead

**From the rules brief of 7 October: where the path loses most people (it orders R1–R4); who the early**

a decision the lead owns, listed in the state fileneeds the lead

***Behaviour* or *behavior* on the mark (the site is British; the recommendation is *behaviour*).**

a decision the lead owns, listed in the state fileneeds the lead

**The Licence to Operate referent (organisation / instrument / licensee) is adopted on the site**

a decision the lead owns, listed in the state fileneeds the lead

**Publish the n8n write-up and its author, or not.**

a decision the lead owns, listed in the state fileneeds the lead

**Extend the measuring environment's gateway rule to MCP-tunnelled requests (the deployer's).**

a decision the lead owns, listed in the state fileneeds the lead

**The return address for the level-3 files (a mailbox today; a write-only vault link when it exists).**

a decision the lead owns, listed in the state fileneeds the lead

**Who the reviewing person is at level 3, and whether the Voice Debrief vaults publish the routing service's providers by name.**

a decision the lead owns, listed in the state fileneeds the lead

**Which agent branches merge next, and in what order (see `.claude/work/`).**

a decision the lead owns, listed in the state fileneeds the lead

## In flight — 0 branches

One file per branch under `.claude/work/`. [How a work file is written](../../admin/work/about-work-files/).

Nothing in flight.

## Task briefs — 17

Each is a unit of work sized for one branch, with the files it touches named so two agents can see whether they would collide. [How a task brief is written and claimed](../../admin/work/about-task-briefs/).

| Brief | Task | Touches | Size | State |
|---|---|---|---|---|

| [T01](../../admin/work/T01/) | one page per behaviour, generated | `scripts/site/build-abp-pages.mjs`, `scripts/site/abp/`, `site/behaviour-*.html` (new), `site/pages.json` | a day | open |
| [T02](../../admin/work/T02/) | the grant as edges, one per path | `scripts/site/build-abp-vault.mjs`, `site/vaults/*/data/edges.json` (new, derived), the renderer | a day | open |
| [T03](../../admin/work/T03/) | metrics and outward links on the 23 | `site/vaults/_template/data/vocabulary/` extension, the behaviour pages, Lab 03 | a day and a half | open |
| [T04](../../admin/work/T04/) | audiences as views; prompts and projections in the vault | the generator, `site/vaults/*/data/views/`, `prompts/`, `projections/`, the renderer | several days | open |
| [T05](../../admin/work/T05/) | settle the 18 open questions | `site/vaults/<slug>/data/grant.json`, one slug at a time | a day per vault | open |
| [T06](../../admin/work/T06/) | the next five connectors, then the three business functions | `site/vaults/<new-slug>/`, `site/vaults/index.json` | half a day each | open |
| [T07](../../admin/work/T07/) | the request list against the model site, brought up to date | `site/lab-abp-requests.html`, an edition | two hours | open |
| [T08](../../admin/work/T08/) | bring `docs/how-the-website-works.md` to the current site | `docs/how-the-website-works.md` | half a day | open |
| [T09](../../admin/work/T09/) | inputs in the repository, the product in the vault; drop the snapshot fallback | the two build scripts, `abp-vaults.js`, `site/vaults/`, tests, CI | half a day | open |
| [T10](../../admin/work/T10/) | the two Voice Debrief use-case vaults, and a use-case group on the library | `site/vaults/voice-debrief-*/`, `index.json`, the library page | a day | open |
| [T11](../../admin/work/T11/) | the consequence layer: assets, consequences, routes out, open consequences on the delta; first for `oc433z3m` | `site/vaults/claude-gmail-connector/data/{assets,consequences}.json` (new), `build-abp-vault.mjs`, the renderer, `_template/data/` | a day | open |
| [T12](../../admin/work/T12/) | GDPR, EU AI Act and ATT&CK as nodes inside the vault, titles only, for consequences and behaviours to link to | `_template/data/standards/` (new), `build-abp-vault.mjs`, the renderer, Lab 03 | a day, with T03 | open |
| [T15](../../admin/work/T15/) | rule pages: schema, generator, index, the first four rules | `site/rules/` (new), `scripts/site/build-rules.mjs` (new), `package.json`, CI, `site/pages.json`, `site/try-it.html` | a day and a half | done |
| [T16](../../admin/work/T16/) | before and after for each rule, run on our own deployment, and a method page | `site/rules/*.json`, `site/rules/method.html` | a day | done |
| [T17](../../admin/work/T17/) | the candidate list from unbounded irreversible rows, and twenty rules from it | `scripts/site/build-rules.mjs`, `site/rules/*.json` | half a day per five | done |
