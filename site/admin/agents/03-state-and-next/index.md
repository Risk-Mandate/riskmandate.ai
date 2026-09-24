# Where we are, and what is next

> Rendered from .claude/onboarding/03-state-and-next.md in the repository. The text below is that file.
> Source: https://riskmandate.ai/admin/agents/03-state-and-next/ · noindex · written by scripts/site/build-admin.mjs

Keep this file true. If you land something, move it; if you learn something, add it. Dates are
the site's; check `site/versions/index.json` for the current version before trusting the number here.

## State as at 2026-09-21, v1.28.0

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
  `evidence/`. Five more are listed on the index as *not written*, each with a record already
  behind it.
- **Try it** (`try-it.html`, top-level, v1.28.0): the free step below the store's ladder and the
  first surface aimed at a stranger rather than a reader. Four steps, thirteen prompts, run in the
  person's own assistant against their own mailbox, hosted at abp.sgit.ai/gmail; what they end up
  with (grant, mandate, delta); what it honestly is not (a self report, said before they find out);
  the four layers; and where to say it broke. From the lead's memo of 21 September —
  `direction__the-next-phase-is-users.md`, the go-to-market direction: **the measure is the number
  of people who run the prompts**, and the queue that follows is T13 (a workflow per shape) and T14
  (volume and instances on the consequence layer).
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
