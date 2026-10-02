# Where we are, and what is next

Keep this file true. If you land something, move it; if you learn something, add it. Dates are
the site's; check `site/versions/index.json` for the current version before trusting the number here.

## State as at 2026-09-30, v1.35.3

- **Site:** 65 HTML files under `site/` plus the admin console under `site/admin/`, one live site deployed from `dev`. Top-level menu:
  Behaviour policies · Who it's for · Insurance · Pricing · Try it · Articles · More (v1.28.0: **seven entries, the cap**; the
  Lab and the live demos are under More; the articles are unlisted beneath Articles).
- **The ABP is the entry point.** Homepage leads with it (v1.12.0); `abp.html` is the model page;
  `agent-behaviour-policy.html` is the library (menu label *Agent Behaviour Policies*): 15 vaults,
  grid and list, search over names, scopes, tools and the 23 ids, a *by behaviour* facet, a
  resizable preview panel with the label, the lethal trifecta and scenarios, `#policy=<slug>`
  deep links (v1.16.0, v1.17.0). *Refused* is now *told not to* everywhere.
- **Vaults: 16 built, checked and pushed**, all at the *template* status, all re-pushed to carry
  `MAP-A-GRANT.md` and `data/scenarios.json`. Renderer **v5** in the new app vault `vbhmlulo` (the left-navigation reading app with the consequence layer, Your keys, the dual licence); `fl3i7lu4` (v4) still serves the fifteen not re-pushed.

| Tier | Vaults |
|---|---|
| measured on the thing itself | `claude-code-web` (13/20 rows), `github-actions` (8/8), `n8n-owner-api-key` (7/8, from an early beta user's write-up), `claude-gmail-connector` (4/6, below) |
| derived from the model site's five examples | `claude-code-cli`, `claude-code-cli-confirmations-off`, `claude-desktop`, `claude-web-connectors`, `chatgpt-web`, `browser-extension`, `scheduled-job` |
| documented from vendor pages, 15 Sept, with open questions | `google-workspace-mcp` (4), `gmail-readonly` (3), `google-drive-readonly` (3), `claude-m365-connector` (4), `dropbox-mcp` (4) |
| measured on the deployer's own account, 16 Sept | `claude-gmail-connector` (`oc433z3m`, 4 of 6 rows measured, 5 contradictions, 6 open questions; in *Mail & files connectors*). Its customer instance is pushed as a private vault `xjir6m0c` (status draft), key handed to the lead in the session; the anonymised inputs stay under `vaults-instances/` |

- **Asked for, not built**, on their own page `agent-behaviour-policy-next.html` (v1.17.0) with a
  vote and a suggestion form: Claude's Google Workspace connector, Slack, GitHub, Notion,
  Salesforce; and the three **business functions**: the CRM, the customer-service desk, finance data.
- **Lab:** seven entries, 16 PDF editions, the whole Lab as one file (v5).
- **Can you insure a program?** (v1.26.1, `insure-a-program.html`, in *Insurance*; the thread framing
  removed in v1.26.2 at the lead's ask): the answer, with RAND's *How Is Artificial Intelligence
  Insured?* (RR-A5130-1, 16 Sept 2026) as the context, sourced and dated: tech E&O since the 1980s, Y2K 1997–98, Munich Re's first AI policy 2018, Nexus
  Mutual's smart-contract cover 2019, the courts and Directive 2024/2853 on software as a product,
  the AI warranties and liability covers of 2023–26, the exclusions, the first insured agent
  deployment (AIUC / ElevenLabs, Feb 2026), and the AIUC blueprint's line that the deployment, not
  the model, is the unit of risk. The underwriting questions mapped to the parts of an ABP; the
  three steps as the strategy. Two sources refused a direct read (RAND's page, Justia) and the page
  says so.
- **Articles** (`articles.html`, **top-level**, between Pricing and More — six top-level entries, cap is seven): the article family (menu label *Articles* from v1.27.2; it was *Writing*). Three published. *In this session, the agent holds the union of everything it has ever been allowed to do* (20 Sept, `article-union-of-every-session.html`; retitled 21 Sept around the union, which is the transferable idea): how the permission union forms at the credential, the client and the deployment, each in the vendor's own words; six questions a deployer would ask with four of them silent on the help page; standing privilege named; the mandate written per purpose as the one lever left; a drawn diagram of the union accumulating across four conversations. Every article ends in a **Where this connects** card grid — other articles, the shape's behaviour policy, and the sibling sites (abp.sgit.ai, nhi.sgit.ai, store.sgit.ai), external cards marked in gold with an arrow. *Somebody will ask
  what your agent can do* (20 Sept, `article-what-is-an-abp.html`) is the introduction: the three
  answers people give and why each fails, the four objects and their verbs, the twenty-three
  primitives, the four barriers and the enforcer test, why nothing is scored, and one deployment
  worked end to end. *An approval prompt
  is not a human in the loop* (19 Sept, `article-approval-prompts.html`), on Claude's Gmail
  connector: the prompt's three buttons against the seven things the screen does not say, the
  consent that had already authorised the action underneath it, the barrier's seven holder answers
  from the vault, and where the accountability lands. The evidence is capture 13 in that vault's
  `evidence/`. Two on 24 Sept, from the lead's memos D14 and D15: *The pilot worked. Then somebody
  asked what else it could do* (`article-pilots-do-not-stay-in-production.html`), the surveys with
  the causes each names and a section saying no survey tests the mechanism; and *A deleted meeting
  comes back. An edited one does not* (`article-calendar-edits-cannot-be-undone.html`), Google's
  own recovery facts per action and the draft Calendar rows. A third on 24 Sept, from D20, is the
  first of a kind the lead wants more of, **a reply to something strong seen on LinkedIn, with our
  world on top**: *Who owns what in AI. And how accountability holds on the way up*
  (`article-who-owns-what-in-ai.html`). It quotes and credits a role-ownership infographic, reads
  its middle column as a routing table and the organisation chart as the escalation path, and walks
  one invented agent from nine ABP rows to the board; section 09 is the model to build from (nodes,
  edges with inverses, placement, clock, cease, stop check, board view). Its three figures (D21) are
  drawn by an inline script from the article's data, `createElementNS` and `textContent` only, nothing
  loaded: the blast radius can be played or changed, and its counts are the engine's. Its guide, *One agent, and every desk it reaches* (`article-risk-propagation-visualiser.html`, D24, 25 Sept), reads the
  figure with thirty-four captures in `site/assets/articles/risk-propagation/`, taken by
  `scripts/site/capture-risk-propagation.mjs` (Playwright, run by hand against a local server, not in CI);
  re-capture after any change to the figure, or the guide's pictures will disagree with it. Keep such replies stand-alone,
  factual about the source, and long enough to implement from. Five more are listed on the index as *not written*, each with a record already
  behind it.
- **A behaviour policy for a ChatGPT dot** (`article-abp-for-chatgpt-dots.html`, 30 Sept, v1.35.2): OpenAI's dots
  (released 29 Sept 2026: always-on agents in ChatGPT with a cloud computer, a browser and every connected app) as
  the clearest case for an ABP. An introduction from the vendor's pages; twelve grant rows in the vocabulary, each
  with the vendor's sentence, a barrier and its holder (you, the workspace admin, the vendor); the finding that the
  strongest barriers (Auto-review, mandatory confirmations) are a reviewer model the vendor calls a judgement, filed
  as a request to the model site for a barrier class; six open questions; a starting mandate with the delta
  derived (grant 12, mandate 5, excess 7, unbounded 2); five steps to write one. Documented, not measured: dots are
  not offered to Pro accounts in the UK. The shape is on the asked-for list as `chatgpt-dots`. Vendor pages were
  read through a page-reader service where the vendor's site refused the tooling; the article says so.
- **The team** (`site/team/`, served as `/team/`, v1.35.0, in *Behaviour policies*): one person and two agents, each
  agent with an Agent Behaviour Policy in the vault grammar, the grant observed on the thing itself on 26 September
  (the publisher: 17 rows, 4 in excess, 3 unbounded; the studio: 7 rows, 2 in excess, both unbounded, the account
  token and the vault key in its conversation), the mandate in the lead's words, the delta derived by the builder.
  Three tiers of information (public, private, secret) with the rule and the controls for each, named by the enforcer
  test; every surface with its tier; the seven-step workflow from private to public with evidence per step; tooling in
  place and not (a token scoped to one vault, a branch rule on dev, a secret scan). A new test: no message file and no
  message id ever reaches `site/`. A clean session starts from `.claude/agents/publisher.md` and the prompt on the
  agent's page; `/publisher-check-in` is the routine's prompt. Asked of the studio by message: argue with its
  policy, and draw the team page as an infographic. Not done: the policies as vaults; the schedule.
- **Stories** (`site/stories/`, served as `/stories/`, v1.34.18 and moved into the folder in v1.34.19, D29): a
  cast of nine drawn by a ChatGPT image model from the lead's prompt, with what each stands for on the site's
  model; six stories as data, two drawn and four storyboards from the articles, each with the truth under it,
  the panels and a prompt for any image model; an eighth, *The ultimate insider* (1 Oct, v1.35.8; drawn by the studio as
  two sheets and published 2 Oct, v1.35.9, with six notes to correct), fourteen panels from
  the lead's sgit.ai article, recast from a draft the sgit.ai session made with its own Synthetic Users; its prompt names
  the cast sheet and three drawn strips as reference images, and `llms.txt` now points sibling agents at the data
  (`stories/cast.json`, the story JSON, `board.json`, `team/*.json`) because that session searched its own repository
  and found nothing; a third drawn story, *While I was there* (the studio's, accepted by the lead
  on 26 September, message 008), shipped in v1.35.1. The order is story, narrative, punchline, cast, storyboard,
  picture. In the header under *Reading*, with Articles (the seventh top-level entry; the cap holds). Section 06
  of the index is **who does what and the board**: the lead, a studio model (`studio.chatgpt`) and this site's
  agent as publisher work through one sgit vault in the Email-FS-lite protocol; the board is derived from
  issues and mailrooms, never dragged, and **versioned** from v1.35.1: a revision per change, the diff per revision in
  `board.json`, every earlier state under `board/history/` in the vault; a second board is `--board <dir>`. The vault
  `dy4u2m9c` was **born on 26 September** with the studio's own
  layout already in it (artwork, markdown scripts, a cast file, decisions, sources); our side went in beside it:
  `mail/` (six messages, six tasks), `published/` (the site's data, mirrored), `board/`. The seed is
  `stories-vault/seed/`; the clone lives outside the repository; the key and the push token come from the lead
  in the session. Waiting: the studio's first reply; the schedule (S04), which the lead sets up on his side. The studio checks in to
  the vault itself; the vault is the only channel between the agents (the lead, 26 September). Tooling `scripts/stories/mail.mjs`. Design:
  `docs/briefs/architecture__the-stories-vault-and-the-three-way-workflow.md`. Moves to stories.sgit.ai later.
- **Try it** (`try-it.html`, top-level, v1.28.0): the free step below the store's ladder and the
  first surface aimed at a stranger rather than a reader. Four steps, thirteen prompts, run in the
  person's own assistant against their own mailbox, hosted at abp.sgit.ai/gmail; what they end up
  with (grant, mandate, delta); what it honestly is not (a self report, said before they find out);
  the four layers; and where to say it broke. From the lead's memo of 21 September —
  `direction__the-next-phase-is-users.md`, the go-to-market direction: **the measure is the number
  of people who run the prompts**, and the queue that follows is T13 (a workflow per shape) and T14
  (volume and instances on the consequence layer).
- **The agent's front door** (v1.35.3, 30 Sept): `agent@riskmandate.ai` is the one identity. As an address it is the
  monitored Workspace mailbox with the six roles of sgit.ai's *Six agents, one inbox* (29 Sept) behind it; as a lane
  identity it is Agent Contact v0.1: `site/.well-known/sgit-agents.json` (keys, fingerprints, the inbox vault
  `yo706x9q` on dev.send.sgraph.ai, two public append tokens) and `/agents/`, built from the file by
  `build-agents.mjs` (`--check` in `npm run check`; `tests/site/test_agents.mjs` recomputes the fingerprints). The
  comms vault holds the identity's key store (encrypted under a secret derived from the write key) and is drained by
  `scripts/intake/drain.mjs` with `COMMS_KEY` in the environment; `configure.mjs` (re)registers lanes. Every address on
  the site now points at `agent@riskmandate.ai`; *Get in touch* opens `contact.html`.
- **Two forms over the `site` lane** (v1.35.3): `contact.html` and `early-access.html` encrypt what is typed to the
  agent's RSA key in the browser (sgit envelope v2, Web Crypto, proven against `sgit pki decrypt`) and POST to
  `append/write`; on any failure the same text becomes a mailto. `privacy.html` says so. A synthetic registration was
  sent, drained and committed to the comms vault on 30 Sept.
- **The early-adopters thank you** (`early-adopters.html`, in *Who it's for*, 2 Oct, v1.35.10): two groups who backed
  this early, the Cyber Boardroom's early users (bought £5 of credits, little used) and RiskMandate's early adopters,
  each get level 3, the £500 corrected policy, at no cost, thirty days from the email, through the early-access form
  with a `CB-`/`EA-` code. The Cyber Boardroom is named as the company behind RiskMandate, its mark beside ours. The
  operational half, the two emails, the reply, the reminder, the columns and who does what, is
  `docs/programme/early-adopters-thank-you.md`; the sends wait on the two lists and a send date.
- **About: the company and the founders** (`about.html`, in *More*, 2 Oct, v1.35.12 and v1.35.13, "going official"):
  the two founders, **Nimay Parekh, co-founder and CEO**, and Dinis Cruz, co-founder, with the bios exactly as the
  investor deck states them; the three steps with their status chips; and the **investor deck v3**
  (`site/assets/deck/riskmandate-investor-deck-v3.pdf`, 18 slides) read slide by slide from
  `site/assets/deck/investor-v3/slide-NN.webp` with a note per number (slide 8's counts and the sixteen templates match
  the site on 2 Oct; market figures carry their source on the slide; slide 12's prices are marked proposed). **The
  footer was changed at the lead's ask**: *Confidential* became *CC BY 4.0* on the thirteen slides that carried it,
  built from the deck's own outlined glyphs (the text is paths, not fonts; the script is
  `scripts/deck/relabel-investor-deck-footer.py`); nothing else on the slides was touched. **The Cyber Boardroom is a side note
  only** (v1.35.13): a UK-incorporated company through which RiskMandate's early trading runs, with a company for
  RiskMandate alone between the two founders to come; the line is said in full only on `early-adopters.html`, where
  the people thanked were its early users. The reviewer record's one-line (`site/reviewers/dinis-cruz.json`, the source
  the two reviewer pages are built from) and the team page's Who section say co-founder and point here. The deck's own
  page numbers run 01 to 17 then 19, as presented.
- **The home page, v1.36.0** (`index.html`, 2 Oct, signed off by the lead): the design the lead sent as a React
  component (`RiskMandateHome.tsx`, "Give agents access. Not free rein."), ported to plain HTML, CSS and one short
  script, in the site's chrome. Hand-authored, like every home page before it. Its sections: the hero; the stage, six
  agents and the gate with the four kinds of dot (pure CSS keyframes); the eight systems; the builder (pick a system,
  set each rule to allow / redact / hold / block, alert toggles; one state object, re-rendered by the script); bring
  your policy; a prompt asks, a policy enforces; the phone and the email; **the four levels** (the store's, in
  pounds, paid once, level 3 selected on load and marked *start here*, with the free early-access link for level 3);
  **the model** (*Under every rule, one record*: the gap figure with the counts from `claude-code-web`, the four
  parts, the four views and the draft-to-version flow, the three steps, the previous home page's own blocks by
  their own markup, the flow strip renamed `abpFlow`); the proof strip of four ledger claims, which the tests hold to
  the catalogue count; the closing call. The experiment pages `home-next.html` and `home-current.html` are gone
  (v1.35.14 to v1.35.17 were their life); `home-next.html` is a redirect stub to the root because the link was shared.
  **Open, the lead's call:** the design's enforcement language (real time, alerts by text and email, a decision log)
  describes a product the site does not sell; the v1.35.14 notes list it. The previous home page is in git at
  v1.35.17 and before.
- **The early-access programme** (invite only, a vault each, free): `docs/briefs/programme__early-access-and-the-first-batch.md`
  and `docs/programme/early-access-invitations.md` (the invitation, the acceptance, the reminder, the CSV columns, who
  does what in the six roles). Waiting on the lead: the list, the sender, the drain schedule, telling sgit.ai.
- **Records:** 14 items in the brief register (9 files, 5 informal); 23 releases since v1.0.0.
- **Summit:** Lisbon, 17–18 Sept. `summit.html` public; `summit-booth.html` private working page.
- **The store is live** (store.sgit.ai, 15 Sept): four levels, named by level here; the store owns every price (its boundary of 16 Sept). The
  homepage says *view a policy / buy a policy*; `pricing.html` is the four levels with the level-3
  prompt workflow; every vault page links *buy this policy* to `store.sgit.ai/p/<slug>/`.
- **After payment** (v1.19.1, brief D9 *the offer is built and the button is not*): four unlisted
  pages `paid-t1.html` … `paid-t4.html`, one per level, for the payment link's success address —
  what arrives and when, what you do next (level 3: run `MAP-A-GRANT.md`, send the two files by
  email), how the key reaches you (out of band, never on a page), the definition of done, who to
  write to. `pricing.html#after` states the plus-one-thing rule and the definition of done per
  level; the homepage's behaviour-policy section carries the four levels. **The £5 page is the
  download** (v1.19.2): `build-abp-pages.mjs` stamps every template's zip path, size and sha256
  into `paid-t1.html` between the `/*__DIST__*/` markers from `site/vaults/<slug>/dist/` (CI
  checks it); the page reads `?shape=<slug>`, offers the file and hashes it in the browser; with
  no shape it lists all fifteen. Levels 2–4 are *a person follows up within 24 hours* (the
  lead's). The store still has to point each payment link at its page, level 1 with the shape.
  **`after-payment.html`** (v1.19.3, under *More*, linked from `admin.html` and Pricing) is the
  debrief for the store team: the four pages, the link contract (`?order=`, `?shape=`), the five
  things the store has to do, what the site guarantees, what is open. Hand the store's agent
  `https://riskmandate.ai/after-payment.md`. The paid pages are public and indexable now, on purpose.
- **Vault pages open on the vault** (v1.19.0): two host frames (App Mode, vault browser) via the
  embed handshake, `rm-abp-host` in `scripts/site/abp/abp-vaults.js`. The site still deploys a copy
  of every vault under `site/vaults/`; removing that is T09.
- **Agents' front door:** `CLAUDE.md` + `.claude/` (v1.18.0), rendered on the site by the console.
- **The admin console** (v1.23.0): `site/admin/`, written by `build-admin.mjs` from the repository —
  what needs the lead (the only filled rank), the board read off this file's queue, the memo queue
  read off the brief register, every `docs/` document, task brief, work file and onboarding page as a
  console page with a twin, the vaults with measured rows and open questions, the records, the
  tooling. Structure adopted from `store.sgit.ai/admin/` and the newsroom console. Public, noindex,
  not in `pages.json` (a `link` menu entry under *More*); `admin.html` redirects to it. Adding a
  brief under `docs/` and rerunning the build is all it takes for it to have a page.

## The queue, in order

From the graph brief (`direction__abp-as-a-graph-and-stakeholder-views.md` §4), then the research
and vault queues. Each has a task brief in `.claude/briefs/`.

| # | Task | Brief | Size | Status |
|---|---|---|---|---|
| 1 | *By behaviour* facet on the library | — | small | **done** v1.16.0 |
| 2 | One page per behaviour: `behaviour-<id>.html`, generated from the catalogue | `T01` | a day | open |
| 3 | `data/edges.json` per vault: the grant as edges, one per path, barrier on the path | `T02` | a day | open |
| 4 | Metrics on behaviours (speed, volume, blast) as coarse ordinals in a vocabulary extension | `T03` | half a day + a Lab 03 ask | open |
| 5 | Outward links per behaviour: ATT&CK technique ids, GDPR articles, cited | `T03` | a day | open |
| 6 | Views per audience + prompts + projections, regenerated by the build, refused when stale | `T04` | several days | open, after 2–5 |
| 7 | Settle the 18 open questions across the five connector vaults | `T05` | a day per vault | open |
| 8 | The next five connector vaults | `T06` | half a day each | open |
| 9 | The three business-function vaults | `T06` | after 8 | open |
| 10 | Lab 03: add the asks from the n8n review and the graph brief (barrier per path; a word for a broad-but-real gate; metrics and links on the primitives) | `T07` | two hours | open |
| 11 | The two Voice Debrief use-case vaults, and a use-case group on the library | `T10` | a day, after the workflow agent runs the prompt | open |
| 11a | Both pushes **done** 16 Sept (`oc433z3m` public, `xjir6m0c` private). Still owed: the twelve screens as redacted image files in `evidence/`; the correction call (§4 of the workflow brief) | — | the lead | waiting on the lead |
| 12 | Stop deploying the vault: inputs in the repository, the product in the vault | `T09` | half a day | open |
| 13 | A page for the £500 workflow once the store has a return address; a per-shape header on `MAP-A-GRANT.md` | — | small | waiting on the store agent |
| 14 | Point the four payment links' success address at `paid-t<n>.html` (level 1: `paid-t1.html?shape=<slug>&order=<ref>`); the level-3 text on the store's product page; the opinion add-on page (brief D9) | — | the store's | waiting on the store agent |
| 15 | **Done** v1.24.0 — the MVP vault: `LICENCE.md` + `licence` block in the build; the v3 reading app with the left navigation, *Who are you?*, *Your keys*, *Keep it*, *Download*; a new app vault; `oc433z3m` re-pushed; the vault page repositioned (`direction__mvp-vault-and-the-reading-app.md`) | — | two and a half days | the lead's four decisions answered 16 Sept; renderer v5 in a new app vault `vbhmlulo`; oc433z3m re-pushed; the dual licence in the build |
| 16 | **Done** v1.24.0 — the consequence layer for `oc433z3m`: assets, consequences, routes out, two scenarios; the research list documented from Google's pages; the standards mini-graphs | `T11`, `T12` | done | eleven consequences, six assets, two routes out, the standards mini-graphs; the research list (Google's pages, Claude's web tools) is still open — T05/research-vault |

## Decisions the lead owns (open)

- *Behaviour* or *behavior* on the mark (the site is British; the recommendation is *behaviour*).
- The Licence to Operate referent (organisation / instrument / licensee) is adopted on the site
  and in every vault; confirm it is a ruling.
- Publish the n8n write-up and its author, or not.
- Extend the measuring environment's gateway rule to MCP-tunnelled requests (the deployer's).
- The return address for the level-3 files (a mailbox today; a write-only vault link when it exists).
- Who the reviewing person is at level 3, and whether the Voice Debrief vaults publish the routing service's providers by name.
- Which agent branches merge next, and in what order (see `.claude/work/`).

## Known rough edges

- **The v5 app-vault mount is confirmed working** on `oc433z3m`'s live view (verified 16 Sept: the site's *See it live* frame renders the v5 reading app, "app via sub-vault link"). One trap for whoever re-pushes the other fifteen: when refreshing an sgit clone, do **not** exclude `.vault/` — `app.link.json` and `.vault/owner/ro-links.json` must both point at the same app vault or the host mount fails with "No such file: app/index.html".

- `docs/how-the-website-works.md` is written at v1.0.0 with an addendum; the page counts and
  test counts in its body are historical.
- The older *The problem* pages (`plug`, `acceptable`, `acceptance`) carry an earlier voice and
  footer; `acceptance.html` has its own footer layout.
- `llms-full.txt` and `.well-known/agent-content.json` are partly hand-written and restamped by
  `generate.mjs`; they lag the newest pages.
- The Lab edition hash strips chrome as of the last commit before v1.17.0; an every-page change
  outside header, footer, menu script and version chip will still look like every page changed.
