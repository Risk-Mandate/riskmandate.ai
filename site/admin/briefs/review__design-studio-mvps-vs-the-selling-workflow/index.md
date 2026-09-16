# The Design Studio MVPs, read against the workflow that sells a behaviour policy

> Rendered from docs/briefs/review__design-studio-mvps-vs-the-selling-workflow.md in the repository. The text below is that file.
> Source: https://riskmandate.ai/admin/briefs/review__design-studio-mvps-vs-the-selling-workflow/ · noindex · written by scripts/site/build-admin.mjs

**Date:** Monday 2026-09-14 — **three days out**
**Author:** @website-agent
**Reads against:** `summit__lisbon-2026-messaging.md`, `direction__abp-at-the-centre.md`, Lab 02 (`/lab-abp-flow.html`), Lab 04 (`/lab-shape-collector.html`), `abp.sgit.ai` v0.3.0, `store.sgit.ai` (read 14 September)
**Reviews:** the four storefront directions, three example packages, the vault and the customisation walkthrough at `riskmandate-design-studio.diniscruz.chatgpt.site` (read 14 September; the app is one 59 KB script, all state in the browser)

---

## 0. The one-paragraph answer

The studio has built the **delivery end** of the flow well and the **selling end** against the wrong ladder. Its vault — mandate, grant, computed delta, history, and an HTML plus JSON export the buyer keeps — is Lab 02's stage ten drawn properly, and its hero card ("what you asked for / what it can also do / who should decide") is most of the printed draft card we still have not made. But its three examples are authored fictions rather than the five derived shapes, its customisation step is a questionnaire in which the visitor *declares the grant*, its first price is £150 where ours is £10, it has no barrier column and so no enforcer test, and it says "the policy" on almost every screen. None of that is a redesign. It is a data swap, one column locked, one rung added, and a find-and-replace — and the result is the fulfilment tool for Thursday.

## 1. The strategy, in the order the booth uses it

Everything below is already ruled in the briefs above; it is restated so this review can be read alone.

| | Rule | Source |
|---|---|---|
| The thing sold | One document: an Agent Behaviour Policy for one agent in one deployment. Four objects — mandate *elicited*, grant *measured*, delta *derived*, barrier *recorded*. No score, ever | `direction__abp-at-the-centre.md` §2 |
| The motion | **Draft and correct.** Hand a conservative draft for a deployment shape; "is this right?"; the correction *is* the elicitation and it goes upward; the corrected one as a file they keep is £10 | messaging §2 |
| The ladder | `t1` £10 file · `t2` £50–100 provisions · `t3` £150–1,000 a person · `t4` £5k–10k a team. Four codes, four Stripe payment links, buyer's own phone. Nothing above ~£1,000 on a card | `store.sgit.ai/paying/` |
| The split | Library (free, `abp.sgit.ai`, no checkout) · offer (`riskmandate.ai`, prices by linking) · checkout (`store.sgit.ai`) | dev brief, "Where the buy button goes" |
| Four rooms | Corporate user → `t1`. Investor → `t3`. Founder → reverse sale only. Security vendor → partner conversation, we count what their product moves into row four | messaging §3 |
| Never | "ADP" · "the policy" · a score, rating or traffic light on an ABP · "compliant / certified / conformant" · "insurance" on any ABP surface · a verdict on a named third party · raw findings | messaging §4 |
| Pricing | Charge and count; never show a price before asking about it; one price at a time; a zero out of thirty is a finding | strategy brief, "The price experiment, redesigned" |
| Stages that ship this week | 1 encounter · 2 self-select · 3 draft · 4 correct. Stage 5 (purchase) "rail exists". 6–10 are one build: the template vault | Lab 02 |

## 2. What the studio is

Four storefront skins over one purchase, three example packages, one vault, one walkthrough.

| Piece | What it does | State |
|---|---|---|
| **Directions 01–04** — Field Guide, Control Room, Pattern Shop, Delivery Studio | Four home pages: editorial, technical, catalogue, concierge. All four end on the same three offers | Working |
| **Three packages** — coding copilot (Alto Studio), support assistant (Harbour Works), research assistant (Lumen Collective) | Fictional organisations, four or five hand-written actions each, `allowed` and `granted` arrays, one "unresolved area" | Authored |
| **The vault** — nine tabs | Overview · mandate · grant & evidence · computed delta · written policies for four audiences (operator, leadership, security, **insurance**) · relationship graph · standards links (AIUC-1, NIST AI RMF) · versions & review · take the package | Working; export to self-contained HTML and JSON |
| **Customisation walkthrough** — three steps | 01 a form (organisation, agent, owner, resource, mission) plus a table with **two editable columns, mandated and granted** · 02 pick a tier · 03 "handover", export an intake JSON | Working; browser-local |
| **Offers** | Free "take an example" · **£150** guided (one agent, 60 minutes) · **£500** team (three agents) · **£1,000** extended (five agents) | All marked "proposed"; no checkout |
| **Review board** | Save directions, leave notes, export markdown | Working |

## 3. Keep these. They are right and some of them are ahead of us

- **The vault is the deliverable, and the export is a file they keep.** "The output is the product demonstration" is Lab 02's thesis, and the studio built it: one record, several views, an HTML that opens offline and a JSON beside it. That is tier 1's promise made concrete, and it is the fulfilment tool we do not otherwise have for Thursday (§5).
- **The hero card is the printed draft.** *What you asked for · what it can also do · who should decide · 02 known permissions beyond the intended mandate.* Put the shape's real rows under it and the `t1` code on the back and it is the P0 print item.
- **Unresolved is kept out of the number.** "Outbound network paths have not been assessed" sits beside the delta, not inside it. That is exactly Lab 01's rule — publish the contradiction unresolved — and Lab 04's enabled-but-switched-off state has a home here.
- **Shortfall is a first-class count.** "Mandated but not granted" is on the delta screen. The Questions page says shortfall is the half that turns up in practice and never appears in a security review; the studio drew it.
- **The live delta while ticking the mandate.** The side panel recomputes as boxes change. That is the correction moment made visible on a screen, which Lab 02 said was the stage nobody had rehearsed.
- **The honesty banners.** "Fictional example · no live measurement · encryption is not simulated · no payment is taken." On-voice, and they should survive into whatever ships.
- **Review triggers and history.** "Revisit after a new connector, credential, scope, route, owner or mandate" is the validity statement in operational form.

## 4. Where it departs from the strategy

Seven departures. The first three are the ones that would cost us on the floor.

### 4.1 The price ladder starts at £150, and the £10 rung does not exist

The studio's free tier is "download the fictional example" and its first paid rung is a person for an hour. Ours is: the library is free (and lives on `abp.sgit.ai`, not on the store), and **the first thing anybody pays for is £10 for their own corrected draft as a file they keep.** The £150–£1,000 band is `t3` — a person reading a situation — which at the summit is the *investor* ask, not the founder one. And the studio shows three prices on the storefront before the visitor has done anything, which the pricing brief rules out in as many words: never show a price before the question.

*Consequence:* a visitor who arrives from the booth with a `t1` code in hand would find no £10 anywhere.

### 4.2 The examples are authored, and they are not the five

Three invented companies with four or five prose actions each ("Push to main", "Issue refunds", "Create public share links"). The credibility of a behaviour policy rests on every row saying where it came from: 23 capability primitives in `verb.object.reach`, a provenance tier per row, 21 of 99 measured, a source URL and a date. The studio's rows carry "declared" or "documented example", which is not a provenance tier in the pack, and none of them traces to anything.

The five published shapes — chat with nothing connected, the coding agent with confirmations on and off, the browser extension, the CI runner — are the ones the cards will carry, and **the coding pair is the strongest thing we own** (one barrier moves, not one number does). The studio has neither the pair nor the shapes. Its support and research assistants are the right *instinct* (a mailbox, a drive — the connector shapes Lab 02 says a stranger recognises), but they are invented rather than derived from the vendor documentation Lab 01 already quoted, and they are not in the published data yet (Lab 03, request 2).

`abp.sgit.ai/data/` publishes profiles, mandates, deltas, barriers and capabilities as JSON with cross-origin access, versioned at v0.3.0 (checked 14 September). The studio could read the real shapes tonight.

### 4.3 The correction step is a questionnaire, and it lets the visitor declare the grant

Step 01 asks for organisation, agent, owner, resource and mission, then presents a table with **two editable columns: mandated and granted.** The copy is honest ("these are your declarations, not measured access"), but the mechanic is backwards on both halves:

- **The grant is never declared.** It is looked up from the shape, and the whole site argues that a self-reported grant is a questionnaire, and "questionnaires describe, evidence prices". A visitor who can untick *Deploy to production* has just edited the measurement.
- **The mandate is corrected, not composed.** Draft-and-correct means the draft *asserts* a conservative mandate and asks to be told where it is wrong, so the correction goes upward. The studio starts from a fully-formed mandate and asks the visitor to edit it, which is a form, and forms get abandoned. Lab 04's completion research is on this exact point.

The live side panel is the right half of this screen. The left half should be one editable column over a locked, provenanced grant.

### 4.4 The vocabulary

| Where | Says | Rule |
|---|---|---|
| Control Room hero, Pattern Shop hero, Delivery Studio hero, vault tab, buttons | "Own **the policy**", "Find **the policy** that feels like yours", "A working **policy**", "Read **a policy** →", "Written **policies**" | Never "the policy" — it is the insurance instrument in Licence to Operate. *The ABP* or *the behaviour policy* |
| Vault → written policies | An **Insurance** audience view, "underwriting discussion brief" | "Insurance" appears on no ABP surface. The insurance argument is a different document and a different room |
| Vault → standards links | AIUC-1 and NIST AI RMF mapped per package | Conformity-adjacent on the £10 artefact. Standards are stage 12, the uplift, signed by somebody who did not sell stages one to ten |
| Offer cards | "Human-reviewed delivery", "a person responsible for the review" | Fine as `t3`, but keep it clear of the signed opinion: no wording exists and it is not sold this week |

The studio never says "ADP", never scores an ABP, and disclaims certification and insurance in the footer. Those three are right.

### 4.5 No barrier column, so no enforcer test

Every capability row in a behaviour policy records which of four kinds stands in the way — none, expectation, setting, boundary — and only the fourth is a control. The studio's grant table has a "control description" column in prose ("No branch rule supplied", "Sandbox configuration"), which is closer to the second row than to a recorded barrier. Without the column there is no *unbounded excess*, and unbounded excess is the only number on a behaviour policy anybody can move — which is the business case for a control and the whole of the security-vendor conversation (messaging §3.4).

### 4.6 Four skins, not four rooms

The four directions are four *presentations* of one purchase. The strategy has four *conversations* with four different asks: `t1`, `t3`, the reverse sale, the partner count. The investor and the security vendor — the two quadrants the messaging brief calls emptiest — are not in the studio at all. The Field Guide opening ("You asked it to help. What else can it do?") is the closest to our aisle line and should be the one storefront; the audience split belongs on a second axis, the way `store.sgit.ai/audiences/` already does it.

### 4.7 The export's schema is its own

`riskmandate-design-example/0.1`, with `allowed` and `granted` arrays of local action ids. A file a buyer keeps should be in the published schema so it can be recomputed against a later vocabulary version, pinned to the shape and version it was derived from. The delta record on `abp.sgit.ai` already does this (inputs pinned, code version stamped); the export should be that record plus the corrected mandate.

## 5. The selling workflow, end to end, for Thursday

Two lanes, one artefact. The paper lane is what the booth runs; the online lane is the same four stages self-served, and only the pages that already exist are in scope this week.

### 5.1 The paper lane — one conversation, about five minutes

```
 1  AISLE      "Do you know what your AI agent can actually do?"     tabletop sign
 2  QUALIFY    run agents? → 5.1a · back companies? → t3 · sell a control? → partner
 3  SHAPE      "Which agent, and roughly where?"                     pick one of five cards
 4  DRAFT      hand the printed draft — conservative on purpose
 5  CORRECT    "Is this right?" — they mark the mandate column with a pen
               the correction goes upward; that is the finding, said aloud
 6  OFFER      "The corrected one, as a file you keep, is £10"       QR → Stripe t1 link
 7  PAY        their phone, Stripe's page. Stripe collects the email  ← this is lead capture
 8  KEEP       we keep the marked card. Nothing else is written down
 9  EVENING    log the conversation against the summit graph vault (nmzxlq3e)
10  48 HOURS   render the corrected ABP → send the file               ← the studio's vault export
```

**Step 7 solves the lead-capture question in the 9 September brief without a form.** A Stripe payment link asks for an email to send the receipt to; the buyer types it on Stripe's page; we never handle a card or a form. The £10 is the qualification and the permission to follow up, which is what the messaging brief already says it is.

**Step 10 is where the studio fits.** The corrected card comes back to a laptop; somebody opens the shape, ticks the mandate to match the pen marks, exports HTML plus JSON, and sends it. That is a manual stage six-to-ten, and it is fine for the first twenty. The instrumented time per policy is the number Brief B1 is asking a power user for, so time it.

### 5.2 The online lane — the same four stages, unattended

Encounter (`/abp.html`) → self-select (five shapes) → draft (the shape's page on `abp.sgit.ai`) → correct → `store.sgit.ai/d/t1/`. Stages one to three exist today. Stage four is the studio's correction screen with the grant locked (§6.2). Stage five is a Stripe link that does not yet exist (§7.1). Lab 04's collector is the proper version of stages two to four and is not for this week.

### 5.3 What the booth does not do

No monitor demo of the studio. The screen facing the aisle runs the game, unattended, as decided. The studio is a back-of-house tool this week and a storefront after it.

## 6. What to change in the studio, in priority order

Sized against Thursday. Everything in P0 is a data or copy change to the existing script; nothing is a new screen.

| | Change | Why | Size |
|---|---|---|---|
| **P0** | **Replace the three packages with the five published shapes**, read from `abp.sgit.ai/data/profiles/`, `mandates/`, `deltas/` and `capabilities.json` (CORS is on; pin v0.3.0). Rows in `verb.object.reach` with the pack's provenance tier per row | The cards on paper and the rows on screen become the same bytes. The coding pair arrives for free | half a day |
| **P0** | **Lock the grant column.** The correction screen keeps one editable column — *in my mandate* — pre-ticked to the shape's starting mandate, over a read-only grant with provenance and barrier per row. Keep the live delta panel | Draft-and-correct instead of a questionnaire; the grant stops being self-reported | 2 hours |
| **P0** | **Add the barrier column** with the four glyphs (● ◉ ◐ ○) and the *unbounded excess* count; put the enforcer-test sentence under the table | Without it there is no row-four argument and no vendor conversation | 2 hours |
| **P0** | **Add the £10 rung and remove the prices from the storefront.** Offer screen shows one thing after the correction: *the corrected draft as a file you keep — £10 → `store.sgit.ai/d/t1/`*. `t3` (a person, £150–1,000) stays as the investor door. Drop the £500 and £1,000 team tiers this week; they are `t3` band and the ladder already says so | The ladder matches the store; no price before the question | 1 hour |
| **P0** | **Find-and-replace the vocabulary:** every "policy" → "behaviour policy" or "ABP"; delete the Insurance audience view; move the standards tab behind "after review" or delete it from the £10 artefact | The rules in §1 | 1 hour |
| **P1** | **Export in the published schema:** the shape id and vocabulary version pinned, the corrected mandate as the only authored file, the delta recomputed, a validity statement and the provenance line. Keep the offline HTML | A file that can be recomputed later is the vault's whole argument | half a day |
| **P1** | **A print view per shape** — one card: the compare rows, four counts, the capability rows with barrier glyph and a tick column, the `t1` code and QR on the back. Render with the repo's existing Playwright scripts (`render-business-card.mjs` is the pattern) | This is the P0 print item and it does not exist anywhere yet (§7.2) | half a day |
| **P1** | **One storefront, not four.** Field Guide opening + Pattern Shop's shape picker as section two + the vault as section three. Audience split as a second axis: run agents / back companies / sell a control | Four rooms rather than four skins | 2 hours |
| **P2** | The mailbox and drive shapes, **only when Lab 03 request 2 lands** — until then they are "asked for", not fictional | Derived or not at all | — |
| **P2** | The partner view: for one shape, "capabilities your control moves into row four" as a count with no verdict | Messaging §3.4, after the event | later |

## 7. Blockers that are not the studio's, and block the same workflow

1. **No Stripe payment link exists for `t1`.** The store says every `checkout_url` is empty and that issuing one is a single pasted line pinned to `buy.stripe.com`. Until it exists the printed code lands on a page that explains why there is no button, which the messaging brief already called worse than no card. **This is the first thing to do and it takes minutes.**
2. **The five draft cards do not exist.** The repo has `render-business-card.mjs` and `render-booth-panel.mjs` and no draft-card script; the cards are mentioned on `/summit-booth.html` and in the messaging brief and nowhere else. Business cards with the `t1` code were the stated fallback; confirm they carry it.
3. **The store's tier-1 page still says the delta is "computed at the moment you open it and never stored".** `abp.sgit.ai` corrected that on 11 September to *derived, stored with its inputs pinned, recomputed*. The card must not say one thing and the delivery page another.
4. **Behaviour or behavior** is still open on the record. Everything above is written *behaviour*, to match the site.
5. **What arrives after payment.** The store promises "your answers and the delta, as a file". For the first buyers that file is the §5.1 step-ten export. Somebody owns sending it within 48 hours, by name, before Thursday.

## 8. Decisions needed

1. **Is the studio's vault the fulfilment renderer for Lisbon?** I would say yes, with §6's five P0 changes, and time the first five.
2. **Which one direction survives?** Recommendation: the Field Guide, with the Pattern Shop's picker inside it.
3. **Do the `t3` team tiers (£500, £1,000) stay visible anywhere this week?** Recommendation: no. One price at a time, and the price is £10.
4. **Who issues the Stripe link, and who sends the files?** Two names, today.
