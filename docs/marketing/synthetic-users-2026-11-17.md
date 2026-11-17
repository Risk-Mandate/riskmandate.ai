# Synthetic users on the live site, 17 November 2026

**Run by:** rm-synthetic-users, for the conductor (T18 backlog item 8) · **Date:** 2026-11-17
**Target:** https://riskmandate.ai, live. The run started on v1.41.6; the live site moved to v1.41.7 during it.
Every finding marked *(rechecked v1.41.7)* was confirmed again on v1.41.7.
**How:** Playwright (Chromium), one persona at a time, starting at the home page. Persona 2 on the iPhone 13
device descriptor; the others at 1280x800. Read-only: no form submitted, no payment link followed past the
store's own product page, nothing sent. Link status checked with a plain GET on each link found (810 unique URLs).
GitHub and some publishers return 403 or 429 to scripted requests; those are bot blocks, not dead links, and are
not counted as broken.

The personas are invented. Nothing here is a score: it records where each persona stopped and what it could not find.

---

## Persona 1: a CISO whose company has an agent in Gmail (desktop)

**Question:** "Can these people tell me what my agent can do, and what does it cost?"

**Path:** `/` → "See sixteen free examples" `/agent-behaviour-policy.html` → "Claude's Gmail connector"
`/abp-vault-claude-gmail-connector.html` → menu "You run agents today" `/for-corporate.html` → `/pricing.html` →
"Buy" (noted only: `store.sgit.ai/d/t3/`) → "Talk to us" `/contact.html` → header "Get in touch"
`customers.riskmandate.ai/`.

**What worked.** The home page answers the first half in one sentence and shows the four prices in a table. The
library has a Gmail connector tile ("6 it can do, 4 unbounded, measured 4 of 6") with a plain description of the
send approval prompt. That is the most useful thing this persona found. `/try-it.html` has a "twenty-minute Gmail workflow".

**Where it stopped or got confused.**
- **Contradicting prices.** `/for-corporate.html` is the menu entry for "You run agents today", and it still shows
  "Level 1 · the pack · £5 / Level 2 · a vault · £50 / Level 3 · corrected · £500", plus "Payment rails are not
  built yet". The home page says £500 / £1,500 / £5,000 / £20,000. The same old chips are on `/for-founders.html`
  and `/licence-to-operate.html` (including "£5", which never matched the old £10 either). *(rechecked v1.41.7)*
- **Pricing numbers its levels two ways.** The table says 1 to 4, but the section under it is headed "LEVEL 3 · HOW
  IT WORKS" and says "Buy level 3", "that is level 4". The "done when" table links "Level 3 →" from row 1 and
  "Level 4 →" from row 2 (`paid-t3.html`, `paid-t4.html`). *(rechecked v1.41.7)*
- **The pricing page dates its sales states to 15 September** ("the states above are copied from it on 15
  September 2026, and two of the four had never been sold once"). The levels it describes are from 17 November.
- **Are the payment links live?** `/pricing.html` says the first two levels "have standing payment links at
  store.sgit.ai". The store pages they link to (`store.sgit.ai/d/t3/`, `/d/t4/`) say "The payment link has not
  been issued yet". The general "Buy at the store" button goes to `store.sgit.ai/policies/`, which still lists
  "£10 ABP Pack · £50 ABP Vault · £500 ABP Tailored · £1,500 ABP Reviewed". (The store is another site; its own
  pages, read 17 Nov.)
- **"Get in touch" goes to the wrong place.** On the home page the header button says "Get in touch" and goes to
  `customers.riskmandate.ai`: a hello-world tutorial with no contact route. Every other page labels the same
  button "Try it free". The real contact route is `/contact.html` (an encrypted form, plus a mailto), reached from
  "Talk to us about your agents". The tutorial site also shows "Your account:  of credit", a value missing in its text.
- The home page does not mention Gmail or any named application. Getting from "your agent" to "the Gmail tile"
  takes a library filter that the persona found only by scrolling.

**Could not find:** the answer to "what does it cost for *my* Gmail agent" in one place: is it £500, and what
arrives? (The answer is spread across the pricing table, the "how it works" section numbered as level 3, and the store page.)

**Price levels clear?** On the home page, yes. Elsewhere, no: three pages show retired levels and pricing mixes its numbering.
**"Talk to us" clear?** The button in the page body, yes. The header button, no.

---

## Persona 2: a founder running ten coding agents (iPhone 13)

**Question:** "Have they done this for real on many agents, and where's the proof?"

**Path:** `/` (the headline figures) → "how counted" `/web-summit-2026/#s02` → "All eighteen situations"
`/web-summit-2026/situations.html` → menu "The team: our own agents' policies" `/team/` → evidence links
`web-summit.sgit.ai/abp/`, `web-summit.sgit.ai/team/everything/`, `web-summit.sgit.ai/abp/in-action/` → `/pricing.html`.

**What worked.** This persona got the furthest. Each of the four headline figures (191, 2,262, 2,980, 1) has an
evidence link and a "how counted" link. The summit record says what was not done (observe mode; nobody outside
the team checked the counts). The situations cards each quote their source. No horizontal scroll at 390 px on any page visited.

**Where it stopped or got confused.**
- **The menu is broken on the proof pages.** On `/web-summit-2026/`, `/web-summit-2026/situations.html` and
  `/archive/`, every menu entry resolves relative to the folder: "Four ways in, and pricing" →
  `/web-summit-2026/pricing.html` → **404**. All 40 menu links on those pages 404. The menu builds its links from
  `RM.data.pages[].file` ("pricing.html") with no leading slash. `/team/`, `/stories/` and `/agents/` resolve
  correctly, so those pages do something the summit and archive pages do not. *(rechecked v1.41.7)* The founder
  coming from "how counted" who taps the menu to reach pricing lands on a 404.
- **`/team/` contradicts the message.** The page the menu calls "The team: our own agents' policies" opens with
  "As at 26 September 2026 … One person, two agents". The home page says "more than a hundred agents".
- The proof is in raw GitHub folders and JSON (`board/runs/`, a run report `.json`). It is genuine, but on a phone
  it is unreadable. There is no screenshot of a run report on our own page.
- One situations card (29 Oct, "the sandbox refused two installs") has an empty "What the ABP said." line.
- The phone menu is one very long list (about 40 entries under eight headings, including "Early adopters",
  "Brand" and "UK support"). The proof pages are not in it: the summit record and the situations are reachable
  only from the home page.
- Contrast: the main button on the home page, "Talk to us about your agents", is green text on a green button
  (screenshot at 390). It is hard to read on a phone.

**Claims it could not trace:** none of the home page figures. "Ten coding agents like mine": no situation is
framed for an outside founder's coding fleet, and none is labelled *invented*. All are our own.
**Price levels clear?** Yes, on the home page table. **"Talk to us" clear?** Yes, but low contrast.

---

## Persona 3: an insurance underwriter (desktop)

**Question:** "Is there anything here I could use to price agent risk, and what is design vs real?"

**Path:** `/` → menu "The Insurability Index" `/insurance.html` → "Can you insure a program?" `/insure-a-program.html`
→ `/licence-to-operate.html` → `/scenarios.html` → `/ramm.html` → `/business-cases.html`.

**What worked.** `/insure-a-program.html` is dated and sourced entry by entry (IRMI, Munich Re, Nexus Mutual, Chaucer,
AIUC, ElevenLabs, RAND). Its table of "what the underwriter asks / where an ABP answers it" is the most
underwriter-native thing on the site. `/insurance.html` labels its three steps "WHAT WE SELL TODAY / TEMPLATE SHIPS,
UNISSUED / THIS PAGE · DESIGN", and says the Index weights are "underwriting judgement rather than fitted loss experience".

**Where it stopped or got confused.**
- **The real data is never linked from the insurance pages.** None of the six underwriter pages links the summit
  record, the 2,262 run reports or the 2,980 out-of-grant entries. The 16 vaults (118 rows, 32 measured) are
  linked from only one of them, `/licence-to-operate.html`. The one data set an underwriter could look at is two
  menus away under "Live demos"/home.
- **Design reads as fact in places.** The "Questionnaires describe. Evidence prices." table says RiskMandate gives the
  underwriter "A priced exposure. Loss bands per agent, aggregate across the fleet" and "The record holds", in the
  present tense. The Index level panel says "WHAT AN UNDERWRITER OFFERS: Standalone AI liability becomes available
  and retention drops materially". The section is marked design at the top, but these lines carry no "design" beside them.
- **Unsourced figures.** `/insurance.html` "FILINGS · Many · P&C groups have filed to exclude AI", "APPROVALS · Most
  · of those filings have cleared review". The page says they are "stated qualitatively on purpose". Under the
  17 Nov rule they are claims with no link. "Underwriting agentic risk today runs on self-reported answers" has no source either.
- The same retired price chips (£5 / £50) on `/licence-to-operate.html`.

**Could not find:** a sample of what an underwriter would receive for one agent (one vault plus its run log, as an
evidence pack). It would have to be built from the parts.
**Price levels / talk to us:** these pages do not mention the four levels, except the stale chips on licence-to-operate. The "Talk to us" buttons work.

---

## Persona 4: a developer told to add a hook (desktop)

**Question:** "Where do I start, practically, today?"

**Path:** `/` (section 03 "Hooks: stronger") → "the test above" `newsroom.sgit.ai/articles/an-agent-that-may-only-chat.html`
→ `/how-it-works.html` → `/try-it.html` → `/secure-harness.html` → `/abp-vault-claude-code-web.html` (AGENTS.md)
→ `github.com/Risk-Mandate/riskmandate.ai` → `/demos.html`.

**What worked.** The newsroom article describes the hook exactly: PreToolUse with matcher "*", deny-all, log, the line
as the reason, UserPromptSubmit to re-add it. It also says plainly what the hook does not cover (`--bare`,
project settings, managed settings). The vault pages give an `AGENTS.md` to hand the agent today. `/secure-harness.html` offers "Run it in a browser tab".

**Where it stopped or got confused.**
- **No hook on riskmandate.ai.** The home page "Hooks" card has no link to a hook. "the test above" leaves the site
  for the newsroom. No page under `site/` has a hook file or the word PreToolUse, except the archived old home
  page (`/archive/home-2026-11-16.html`). The repository has no example hook either (its README is about running the site).
- `/how-it-works.html` starts with "Thirteen prompts" and theory ("Authorisation is whatever the agent can already
  do"). A developer looking for a file to paste reads six steps before reaching anything to run.
- `/try-it.html` sends the developer back to `customers.riskmandate.ai` first (chat prompts, no hooks).
- There is no "for developers" entry in the menu ("Who it's for" lists corporate, founder, startup, early access, early adopters).
- `/demos.html` did not settle within 45 s (network still busy). It loaded, but this persona gave up before the frames did.

**Could not find:** a copy-pasteable `.claude/settings.json` hook plus the ABP rows it enforces, with the managed-settings caveat beside it.
**Price levels / talk to us:** not looked for. The developer would hand the site to a manager.

---

## Dead links and broken media (all personas)

| What | Where | State |
|---|---|---|
| 40 menu links 404 | `/web-summit-2026/`, `/web-summit-2026/situations.html`, `/archive/` | broken, v1.41.6 and v1.41.7 |
| Film request aborted on first load | `/assets/media/film/riskmandate-reach-mandate-gap.mp4` on `/` | the browser cancelled it while preloading (net::ERR_ABORTED); the file plays; no fault seen |
| Situation screenshots "not loaded" at first paint | `/assets/situations/*.png` | lazy-loaded; all return 200; no fault |
| Missing value | `customers.riskmandate.ai`: "Your account:  of credit" | a blank where a value should be |

No other internal link returned an error. Every external non-200 was a 403/429 bot block (GitHub, OUP, RAND, CoinDesk and others), not a dead page.

---

## The eight most valuable fixes, ranked

1. **Fix the menu on subfolder pages** (`/web-summit-2026/*`, `/archive/*`): make the menu's links root-relative
   (`/pricing.html`). Today every menu link on the proof pages 404s.
2. **Remove the retired £5/£50 chips** from `/for-corporate.html`, `/for-founders.html` and `/licence-to-operate.html`,
   and show the four levels instead. The CISO's own menu entry contradicts the home page.
3. **Renumber pricing's lower sections** to the 1 to 4 ladder ("Level 3 · how it works" is level 1; "Buy level 3",
   "that is level 4", the Level 3/4 links in "done when"). Re-date or remove "copied from it on 15 September".
4. **Make one route the "talk to us" route:** the header button says "Get in touch" on the home page but goes to the
   tutorial site. Point it to `/contact.html`, or label it "Try it free" as on every other page.
5. **Settle whether the payment links are live.** Pricing says "standing payment links"; the store says "not issued
   yet"; the store's catalogue still sells £10/£50. This needs the store team. Draft the note; the lead sends it.
6. **Put a hook on the site:** one page or one vault file with the PreToolUse deny-all hook from the newsroom test,
   the rows it enforces, and the managed-settings caveat. Link it from the home page "Hooks" card and add a
   "You are a developer" entry to the menu.
7. **Link the real data from `/insurance.html`:** the run reports and the summit record as "what exists today". Put
   "design" beside the present-tense lines ("A priced exposure", "WHAT AN UNDERWRITER OFFERS"). Source or remove
   "Many / Most" filings.
8. **Update `/team/`** ("One person, two agents, as at 26 September") or relabel it in the menu. Put the summit record
   and the situations into the menu, and fix the low-contrast main button on the home page.

**What was not done:** no form submitted, no payment page opened, nothing measured on anybody's system. Persona 3
did not open each vault. The admin console and the store were not walked as personas.
**What needs the lead:** fix 5 (the store's wording and its £10/£50 catalogue belong to another team), and whether
a developer entry belongs in the menu.
