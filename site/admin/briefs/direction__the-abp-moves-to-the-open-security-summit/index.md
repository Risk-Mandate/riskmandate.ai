# The ABP moves to the Open Security Summit: what the site did, and the process from here

> Rendered from docs/briefs/direction__the-abp-moves-to-the-open-security-summit.md in the repository. The text below is that file.
> Source: https://riskmandate.ai/admin/briefs/direction__the-abp-moves-to-the-open-security-summit/ · noindex · written by scripts/site/build-admin.mjs

**Date:** 3 November 2026 · **Author:** @website-agent · **For:** the lead, and whoever keeps this section after
v1.40.1 · **Status:** the site's part is done; the proposal's phases are the founders' and the CIC's

**Trigger:** the lead, 3 November 2026: *"Can you remove the OWASP section since we need to move it to the Open
Security Summit, can you remove the top level link, and start the process of replacing OWASP with OSS."* The move
itself was proposed on 20 October in the newsroom's *Agent Behaviour Policies move to the Open Security Summit*.

## 1. What the site did (v1.40.1)

- **The OWASP group is off the menu.** Its eight pages are unlisted, not deleted: the newsroom's article of 20
  October and the brief register link `riskmandate.ai/owasp/`, and the section is the public record of the 8 October
  proposal, which the site's rules keep.
- **Every OWASP page says it is superseded**, at the top, from one field in the record: `site/owasp/project.json →
  superseded` (date, where it went, one sentence), rendered by `build-owasp.mjs`. The record's stage now says so, and
  its log and decisions gained the move (K05, two log lines); nothing earlier was rewritten.
- **Nothing was sent to OWASP.** The record's three submissions (the committee email, the project application, the
  note to the Agent Control Standard maintainers) were all `drafted`, `sent` empty. They stay drafts.
- **A new page, `open-security-summit.html`**, under *Behaviour policies*: why it needs a home, the proposal (host,
  programme, project), the governance that has to come first, what is stewarded and what is not, RiskMandate's place,
  the four phases with their status, what carries over from the OWASP work, and what it does not claim.
- **What stays as it was:** OWASP's own projects on this site (the OWASP graph, the Coraza and Threat Dragon business
  cases), the OWASP Agentic Top 10 among the standards, and the lead's OWASP history. Those are about OWASP, not about
  where the ABP lives.

## 2. The process from here, phase by phase

| phase | what | who | the site's part when it happens |
|---|---|---|---|
| 1 · Confirm the basis | the CIC's articles and community-interest statement read; the assets and licences inventoried; advice on conflicts and inter-company agreements | the lead, with advice | mark it on the page with its date; the 82-row inventory from the OWASP work (`site/owasp/contribution-inventory.csv`) is the starting stewardship record; steps S05 and S06 of the OWASP record (rights checks, a CC BY 4.0 licence file here and in the abp.sgit.ai repository) carry over |
| 2 · Establish the programme | approval through the CIC, the first charter, independent steering-group members, funding | the CIC | rewrite the draft charter (`owasp/charter.html`) for the CIC; publish the charter and the steering group's membership with independence as defined |
| 3 · Publish and operate | shared infrastructure, scope, licences, governance and contribution rules in public, first releases | the project | when it has its own site, this page points there and becomes the RiskMandate side only |
| 4 · Review | outside contributors can really influence decisions; hosting rules improved before a second project | the project and the CIC | publish the review |

When phase 1 starts, the page should grow a record of its own, the way the OWASP section has one: a
`project.json` with gates, steps, submissions and a log, and the page built from it, so a status changes in one place.
Until then the page is hand-written and says *proposed* on every phase.

## 3. What the site must not say until it is true

That the ABP *is* an Open Security Summit project, or is independently governed; that a charter is adopted or
anything transferred. The page carries the newsroom's own list. The OWASP build already refuses claims of OWASP
approval; the same lint should be added when the Open Security Summit page gets its builder.
