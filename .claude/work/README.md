# In-flight work — one file per branch

Before you start, read every file here. Then write your own as `<branch-name>.md` (slashes
become dashes: `claude/upbeat-fermi-vgsy7c` → `claude-upbeat-fermi-vgsy7c.md`) in your first
commit, and delete it in the commit that merges you into `dev`. A file older than a week with no
matching branch on `origin` is stale and may be removed by whoever notices.

Template:

```markdown
# <branch>

**Started:** YYYY-MM-DD · **Agent session:** (a link if you have one) · **Task brief:** `.claude/briefs/Txx-…` or "ad hoc"

## Scope
One paragraph: what this branch will land, and what it will not.

## Files and surfaces I expect to touch
- `site/<page>.html` (+ its twin, regenerated)
- `site/vaults/<slug>/` — inputs only; derived files regenerated
- `scripts/site/…`
- every page (chrome / modules / menu) — say so loudly; merge it fast

## External state
- Vaults built and unpushed: <slugs> — the push is owed by the lead
- Lab editions I will cut: <slugs>
- Release I will claim at merge: yes / no

## Status
- [ ] …
- [ ] …

## Notes for whoever merges after me
Anything the rules did not cover, and what I did about it.
```
