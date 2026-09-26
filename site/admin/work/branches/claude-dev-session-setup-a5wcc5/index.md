# claude/dev-session-setup-a5wcc5

> Rendered from .claude/work/claude-dev-session-setup-a5wcc5.md in the repository. The text below is that file.
> Source: https://riskmandate.ai/admin/work/branches/claude-dev-session-setup-a5wcc5/ · noindex · written by scripts/site/build-admin.mjs

**Started:** 2026-09-26 · **Agent session:** https://claude.ai/code/session_01Qs56bjDQRKzHnusF4aXJUJ · **Task brief:** D29, the lead's memo

## Scope
The stories section: a cast file, six story files, a generator with a check in CI, the section
page and six story pages, the three drawn pieces as WebP. The register, the onboarding, the release.

## Files and surfaces I expect to touch
- `scripts/site/build-stories.mjs` (new), `site/stories/`, `site/assets/stories/`, `site/stories.html`, `site/story-*.html`
- `site/pages.json` (More run), `package.json`, `.github/workflows/ci-pipeline.yml` (one check each)
- `site/briefs.html`, the register, onboarding 01/03/05

## External state
- Vaults built and unpushed: none
- Release I will claim at merge: yes, v1.34.18, cut

## Status
- [x] Data, generator, register, onboarding written
- [ ] Built and checked in Chromium; merge, CI green, live
