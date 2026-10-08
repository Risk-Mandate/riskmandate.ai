# claude/owasp-abp-project

> Rendered from .claude/work/claude-owasp-abp-project.md in the repository. The text below is that file.
> Source: https://riskmandate.ai/admin/work/branches/claude-owasp-abp-project/ · noindex · written by scripts/site/build-admin.mjs

**Started:** 2026-10-08 · **Agent session:** https://claude.ai/code/session_018R43mqYaeLXPg2E3DsbSiB · **Task brief:** ad hoc — the lead's voice note and the Perplexity initiation brief of 8 Oct 2026 (D30, D31)

## Scope
A new top-level section, **OWASP**, at `site/owasp/`: the proposal to take the Agent Behaviour
Policies to OWASP as an OWASP project, kept in public. Overview, charter (mission, objectives,
scope, non-goals), the line between RiskMandate and the project, the application pack (process,
form answers, leaders, roadmap), the tracker (gates, steps, submissions, people, decisions, log),
the contribution inventory, the other OWASP projects it works with, and what popular OWASP projects
teach. The record is `site/owasp/project.json`; the pages are built by `scripts/site/build-owasp.mjs`
from `docs/owasp/pages/*.html`. Nothing is sent to OWASP from this branch: no outreach, no form, no
repository created.

## Files and surfaces I expect to touch
- `site/owasp/**` (new), `docs/owasp/pages/*.html` (new), `scripts/site/build-owasp.mjs` (new)
- `site/pages.json` — **the menu**: OWASP becomes a top-level entry; *Try it* moves into *Behaviour policies* to stay at seven
- `package.json` — `build-owasp.mjs --check` in `npm run check`
- `site/briefs-register.json`, `site/briefs.html`, `site/assets/briefs/` — D30 and D31
- `docs/briefs/direction__owasp-agent-behaviour-policies.md` (new)
- `.claude/onboarding/01-map.md`, `03-state-and-next.md`

## External state
- Vaults built and unpushed: none
- Lab editions I will cut: none
- Release I will claim at merge: yes, a patch
- Nothing sent to OWASP, nobody emailed, no repository created. Every external step is in the tracker as *to do*, waiting on the lead.

## Status
- [ ] research: OWASP process and people, exemplar projects, our own inventory
- [ ] the section, the builder, the record
- [ ] register D30, D31; the direction brief
- [ ] check, release, merge

## Notes for whoever merges after me
The menu change touches every page through generate.mjs. Merge dev before continuing if you are on a sibling branch.
