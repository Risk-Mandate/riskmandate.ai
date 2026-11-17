# Map — what newsroom.sgit.ai gives riskmandate.ai

**Date:** 2026-11-16 · **Author:** conductor.riskmandate
**Trigger:** the lead, 16 Nov (relayed): "bootstrap the team that is going to work on the RiskMandate website, which
needs a lot of work. You can see the ideas, and TONS of materials, for this site in newsroom.sgit.ai."
**Reads against:** newsroom.sgit.ai v0.14.124 (`/newsroom/wire.json`, 434 articles; the five collections; the desks
and sections; `/shipped/`), riskmandate.ai v1.40.3
**Data:** `docs/marketing/newsroom-map/newsroom-map-2026-11-16.jsonl` — 320 rows, one per item: url, date, short,
idea, fit, becomes, target, figures, cautions, proposed_page
**On the site:** `/web-summit-2026/newsroom-map.html` (the 243 rows with a place, grouped by proposed page) and
`/web-summit-2026/site-plan.html` (the proposed shape)
**Companion:** `plan__riskmandate-team-after-web-summit-2026.md` §6

---

## 1. How it was read

A keyword filter over the wire picked 285 articles that touch agents, behaviour policies, mandate, reach or
insurance. Four read-only agents took them in date order (17 Aug – 14 Oct, 14–21 Oct, 21 Oct – 1 Nov, 1–16 Nov),
fetching each markdown twin and skimming its abstract, its short list and its *what this does not claim* section,
reading in full where a figure or a caution needed it. A fifth read the five collections, the desks, the sections,
the two features the lead named, `/shipped/` and the other non-article pages, and the 149 articles the filter left
out, rescuing 13. GET only; nothing submitted, nothing tested.

**Fit** is a sorting label, not a judgement: *direct* (the ABP, reach, mandate, gap, barriers, insurability),
*supporting* (evidence, buyers, pricing, selling), *adjacent* (context), *off* (not for this site).

| Fit | Items |
|---|---|
| direct | 91 |
| supporting | 86 |
| adjacent | 66 |
| off | 77 |

## 2. Where it lands (the proposed pages)

| Proposed page | Items | Status |
|---|---|---|
| Product · Where a rule is kept | 33 | new |
| Product · What an ABP is | 11 | rewrite `abp.html` |
| Product · Insuring agents | 24 | rebuild `insurance.html` as a family |
| Product · Who it is for | 15 | existing pages; a regulators page proposed |
| Product · Levels and pricing | 10 | keep; fix the £5/£10 level-1 disagreement |
| Product · Reviewed upward | 5 | `abp-reviewed.html` + `reviewers.html`, explained via *Local trust, certified upwards* |
| In action · Web Summit 2026 | 11 | new (this section) |
| In action · Case studies | 16 | new |
| In action · Example ABPs and the library | 27 | existing |
| In action · Vendor-shaped examples | 8 | new; documented from vendor pages, never run |
| In action · Invented twins | 3 | `demos.html`, each labelled invented |
| In action · Try it | 4 | existing |
| In action · What runs, what is designed | 1 | new; the newsroom's `/shipped/` done for us |
| Read · Reading paths by reader | 38 | rewrite `articles.html` |
| Read · Questions | 11 | `questions.html` + the ten questions of 9 Oct |
| Open source · The team and how it runs | 26 | existing |

## 3. The strongest material, by page

- **Where a rule is kept:** hope-or-enforcement; where-a-check-runs; proven-controls-for-agents ("22 were
  expectations, 34 settings and one a boundary"); are-hooks-the-sweet-spot; a-second-reader-the-agent-cannot-skip;
  behaviour-policies-from-the-checks; an-agent-that-may-only-chat (line alone 3 of 12 attacks held, line plus hook
  12 of 12; it also lists seven faults in our own policies, to check).
- **What an ABP is:** what-can-your-agent-reach; the-behaviour-policy-is-the-business-logic; drift-is-the-mandate-moving;
  approved-business-mandates ("turning approved business mandates into tested controls"); governs-enforces-attests.
- **Insuring agents:** insuring-agents-the-whole-story; a-payout-for-every-row (figures illustrative);
  who-carries-the-risk; the-vendors-layer; underwriting-the-agent-economy-reviewed; the-ipo-filing-and-the-agents;
  a-policy-beside-the-prompt; the-policy-draws-the-liability-line. All say no insurer has agreed to any of it.
- **Case studies:** the summit record; the-ultimate-insider-case-study; six-agents-one-inbox; our-workflow-on-odoo-20
  (measured on a system we may run: 25 probes; the approval simulated); our-first-pr-in-ruflo.
- **Vendor-shaped examples:** riskmandate-and-manus, -cloudflare, -lovable (read 9 Nov, never run); odoo-and-our-stack.
- **Reviewed upward:** local-trust-certified-upwards; sources-and-shadows; on-the-record; the `/reviews/` pattern.
- **Questions:** riskmandate-ten-questions (with its maturity table: Licence to Operate "template and design", the
  Index "design; early conversations only").
- **Reading paths:** the collection *Behaviour policy in practice* (11 articles; last updated 7–8 Oct, so it misses the
  insurance series, the-grant-not-the-prompt, SHarness and the summit; its intro needs rewording before reuse).

## 4. Where the newsroom and the site disagree (for the lead)

1. **Prices.** Site: £10 / £50 / £500 / £1,500, one-off. Newsroom proposals: prepaid credit £5 or £50; services at
   £5,000 and £25,000 (who-maintains-the-php-you-run); one ladder £500 to £20,000 (the-intersection,
   selling-mini-agentic-teams). Level 1 reads £5 on `licence-to-operate.html` and £10 elsewhere (ten questions, 9 Oct).
2. **The roadmap.** Site: ABP → Licence to Operate → Insurability Index. Newsroom, 20 Oct: six stages, "a proposal,
   not a decision".
3. **Claims as if shipped.** The ten questions found continuous attestation and a first Index described as built on
   `insurance.html`. To be settled on the proposed *What runs, what is designed* page.
4. **Wording the site does not carry.** Conformity words in the insurance pieces and the Lovable mapping; a level scale
   for deciders; a red/amber/green flag in a collaborator's app; scores of named third parties (the legal AI map);
   "verdict" in several places; the decision-policy acronym. None is carried; each row's cautions say where.
5. **Counts that move.** 2,032 run reports in identity-for-agents against 2,262 in the summit record a day later;
   "about fifteen" against twelve agents in two articles of October. Reprint with the date or not at all.

## 5. What this does not settle

Which pages are built first (the plan's order is a proposal); whether newsroom articles are reprinted on this site or
linked; whether *How it works* is renamed *In action* (a menu change, every page); any price.
