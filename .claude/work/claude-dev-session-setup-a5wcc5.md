# claude/dev-session-setup-a5wcc5

**Started:** 2026-09-25 · **Agent session:** https://claude.ai/code/session_01Qs56bjDQRKzHnusF4aXJUJ · **Task brief:** D27, the lead in chat

## Scope
The risk propagation visualiser drawn on every business-case page, from the case's own model and
engine, with each change as a switch. Generator only; every case page regenerated. The register.

## Files and surfaces I expect to touch
- `scripts/site/build-business-cases.mjs` (the figure, its script and CSS), every `site/business-case-*.html`
- `site/briefs.html`, the register, the release

## External state
- Vaults built and unpushed: none
- Release I will claim at merge: yes, v1.34.16, cut

## Status
- [x] Exercised in Chromium on three cases: counts match the tables; switches, focus and panels work; no errors
- [ ] Merge, CI green, live
