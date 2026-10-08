# The Agent Behaviour Policy goes to OWASP, and RiskMandate becomes its sponsor

**Date:** 8 October 2026 · **Author:** @website-agent · **Status:** direction, decided by the founders; the external steps wait on the leads

**Trigger.** The lead's voice note (D30): *"me and Nime, just made the exact decision to … propose to OWASP or to move to OWASP our agent behavior policies … we need to create a new section on the risk mandate website, even top level menu, called OWASP … this should go on the public website the public Git repo."* And the initiation brief written with Perplexity the same day (D31), which sets the gates.

**Reads against.** OWASP Project Policy (owasp.org/www-policy/operational/projects, read 8 Oct 2026); twelve OWASP projects' public pages (read 8 Oct; the list is on `site/owasp/lessons.html`); abp.sgit.ai v0.12.1 and its `data/index.json`; this repository at the branch point (v1.36.3); D17, the lead's OWASP-first memo of 24 Sept, and `owasp-graph.html`.

## 1. What was decided

1. The ABP is proposed to OWASP as an open project, **OWASP Agent Behaviour Policies**. RiskMandate is its sponsor and one commercial adopter among any number (K01).
2. The whole move is kept in public: a top-level **OWASP** section on this site and its record in this repository (K02).
3. RiskMandate commercialises on the method as anybody could, and writes its model down as a pattern others can follow (K03).
4. Nothing external without approval: every email, form, repository and licence change waits on its gate, G0 to G4 (K04, from D31).

## 2. What was built

- `site/owasp/`, eight pages, top-level in the menu (*Try it* moved into *Behaviour policies* to stay at seven):
  overview, charter, RiskMandate and the project, what moves, the other OWASP projects, what other projects teach,
  the application, the tracker.
- `site/owasp/project.json` — **the record.** Gates, steps, submissions, people, places, decisions, questions, log.
  Every status on the section is rendered from it. To move something: edit the row, run
  `node scripts/site/build-owasp.mjs && node scripts/site/generate.mjs`.
- `site/owasp/contribution-inventory.csv` — 82 assets: 31 contribute, 13 rewrite, 11 defer, 27 exclude; each `unresolved` for rights until checked.
- `scripts/site/build-owasp.mjs` with `--check` in `npm run check`. The page bodies are `docs/owasp/pages/<slug>.html`, with `<!--owasp:name-->` placeholders filled from the record. The build refuses ADP, rung, the conformity words, and any claim that the project is OWASP-approved, endorsed or official while `project.owasp_status` is not `accepted`.

## 3. What the research changed

- **Leadership is personal under OWASP's policy**, and leaders may not hold money or sign agreements with companies. Two co-founders of one company leading is allowed and is the pattern the exemplar research says to avoid: a third leader from outside RiskMandate is a step (S11).
- **The material to move is abp.sgit.ai, v0.12.1, not the vault copies here (v0.3.0).** There is no JSON Schema file anywhere; writing one is the first specification deliverable.
- **No CC BY licence file exists in this repository**; the footers carry the claim. Paid copies name RiskMandate as copyright holder, so the company signs off the contribution, not one person.
- **Adjacent OWASP work exists and is named on the ecosystem page:** the Agent Control Standard (in the GenAI Security Project since 1 Sept 2026), the Agentic Top 10, CycloneDX's Bill of Behaviors work, the AI Agent Security cheat sheet.

## 4. What this does not settle — decisions for the leads

1. **The name.** The note says *application behavior policies*; the brief and the thing being moved say *Agent Behaviour Policies*. The section uses the latter until told otherwise (Q1).
2. **The home.** Standalone Incubator project, or an initiative inside the GenAI Security Project (Q2). The application page sets out both.
3. **The third leader** (Q3), and confirmation that both leaders' memberships are current (S12).
4. **CC BY 4.0 or CC BY-SA 4.0** for documents (Q4).
5. **Approval of the drafted email and the application fields** (S14, S15). Neither has been sent.
