# Which published vaults belong on riskmandate.ai

**Date:** 2026-09-09 · **Author:** @website-agent
**Source:** the 26-vault catalogue at `https://sgit.ai/demos/vaults/llms.txt`
**Companion:** `summit__lisbon-2026-strategy.md` (which of these to lead with in Lisbon)

---

## Already on the site (3 of 26)

`demos.html` embeds three, each with its own page:

| # | Vault | id |
|---|---|---|
| 8 | Risk Graph Explorer | `3simlnqe` |
| 7 | Agentic Browser Isolation | `0610gsp9` |
| 9 | Risk Mandate | `4zf6pf2z` |

Good picks, but they under-sell the current thesis. The site now argues
**insurability** — and the three strongest proofs of that argument are all
sitting in the catalogue unused.

## Tier 1 — add these; they *are* the argument

**#23 Licence to Operate** · `posrhzp3` · Analysis · 13 MB
`d990a52efb9af32c8463e2962f3ca5ccf92b3b6e8ea788e55009073c29b4da29:posrhzp3`
"An insurance policy for an agent, simulated: grant, mandate, and the delta
nothing covers." This is the homepage thesis made executable — *the grant is
not the mandate*, with the uncovered delta priced. Nothing else on the site
closes that loop. **Highest priority.** It is already the "what next" link out
of the what-can-it-do game, so the funnel exists and currently dead-ends
outside our site.

**#25 Agent permission games** · `4evnlwrj` · Application · 2.6 MB
`f94c8b1d42352d95703ac3d39032735d9b4e388d16ab5b87c948928d8e111118:4evnlwrj`
Contains the what-can-it-do game — five minutes, forty questions, no sign-up,
and it scores how well you know what you know. It is the best top-of-funnel
asset we have and the natural booth device (see the summit brief).
⚠️ **Read the caveat below before embedding this one.**

**#24 AIUC-1 conformance layer** · `2wzct4k7` · Reference · 43 MB
`sgit_private_read_0f01d367…:2wzct4k7`
"The AIUC-1 standard as a graph, plus a conformance layer that **computes
insurability**." This is the single best evidence that the Insurability Index
is a computed number against a real standard rather than a metaphor — exactly
the objection a GRC buyer or an investor raises first.
⚠️ Its read key carries a `sgit_private_read_` prefix, unlike every other entry.
Confirm with the vault team that it is intended for public publication before
we embed it.

**#18 RiskMandate · File security** · `wu365g94` · Analysis · 2.7 MB
`sgit_rk1_e8a1e664…:wu365g94`
An eleven-step risk-acceptance walk running SQLite in the browser. Already
RiskMandate-branded, and it shows the *workflow* rather than the concept —
the thing a buyer asks to see after they accept the premise.

## Tier 2 — add next; they anchor the regulatory story

**#10 Regulation Graph** · `73heuprz` — the EU AI Act parsed into an evidence
graph, article by article. We are exhibiting in Lisbon to a 40-country European
audience; this is the most locally relevant asset in the catalogue.

**#19 Standards Atlas — GDPR** · `4zv4bvmu` — GDPR as a semantic graph, with
writes scoped to a feedback folder. Pairs with the above and demonstrates
controlled write access, which is a question we get asked.

## Tier 3 — credibility, but not as "demos"

**#20 AI vs. AI — Black Hat EU 2025** · `k1izvg7e` and
**#21 Scaling Threat Modeling (ThreatModCon)** · `0ict6flm`.
These are conference talks, not product demos. Putting them under "Live demos"
would weaken that page. They belong in a separate **Research / Talks** strip —
useful for investors doing diligence on whether the team is credible in the
field, which is precisely the Lisbon audience.

## Deliberately not recommended

The remaining sixteen (Algarve, Supplement Stack, Health Score, VoiceDebrief ×2,
Payments, Commercialisation, Content-Transformation, Deploy Docs, Catalogue,
Field Notes, Strategy Maps, Vault App Mode, Pentest Report, sgit board) are
excellent demonstrations of **sgit/SG-Send**, not of RiskMandate. They prove
the substrate, not our category. Linking them dilutes a page whose job is to
make one argument. If we want to credit the substrate, one line — "built on
sgit; twenty-six public vaults at sgit.ai" — does more than sixteen tiles.

---

## Two implementation notes for the vault team

**1. Three different read-key formats are in circulation.** Bare 64-hex
(`d990a52e…:posrhzp3`, the newest vaults), `sgit_rk1_…` (most), and
`sgit_private_read_…` (#24). Whatever the demo embed does today handles only the
form the current three use. Whoever wires these up should accept all three, and
fail loudly rather than silently rendering an empty frame.

**2. `demos.html` currently makes a promise that vault #25 would break.**
The page says, of the embedded demos:

> "nothing you do inside a demo leaves your device"

The catalogue describes #25 as *"the first vault here that phones home."* Both
statements can be true of their own subject, but not on the same page without a
distinction. Before embedding the games vault, either scope that sentence to
the demos it applies to, or give #25 its own labelled treatment saying what it
sends and why. Our own voice rule — no claim that isn't defensible — makes this
a blocker, not a nicety. It is also exactly the kind of detail a security-led
visitor checks on the spot.
