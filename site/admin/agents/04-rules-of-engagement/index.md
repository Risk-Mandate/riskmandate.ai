# Rules of engagement for agents working in parallel

> Rendered from .claude/onboarding/04-rules-of-engagement.md in the repository. The text below is that file.
> Source: https://riskmandate.ai/admin/agents/04-rules-of-engagement/ · noindex · written by scripts/site/build-admin.mjs

Several agents work on this repository at once, each on its own `claude/<name>` branch, all
merging into `dev`. `dev` is the default branch, the integration branch, and **the live site**:
CI deploys `site/` on every push to `dev`. So a merge into `dev` is a deploy, and a broken
merge is a broken site. These rules exist so that two agents who never talk to each other
can still land their work without undoing each other's.

## 1. Before you start: claim a scope

Write `.claude/work/<your-branch>.md` in your first commit (the template is in that folder).
It says what you are doing, which files and page families you expect to touch, which vaults you
will push, and when you started. Read the other files in that folder first: if somebody has
claimed the page or the vault you were going to work on, pick a different task from
`.claude/briefs/` or narrow yours so the file sets do not overlap. Delete your file in the
commit that merges you into `dev`.

This is a rule in prose and it bounds nothing. It works because everyone reads it first.

## 2. What conflicts, and what to do about it

| Surface | Why it conflicts | Rule |
|---|---|---|
| **The version restamp** (`release.mjs` touches every page, `versions/index.json`, `riskmandate_ai/version`, `pyproject.toml`) | two branches releasing = every HTML file conflicts on the version chip | Cut the release **only as the last commit before merge, after merging `dev` in**. If `dev` took your number first, re-run `release.mjs` with the next one. Never merge a branch that releases an older number than `dev` already has |
| **The version number itself** | two agents each taking a second-number bump makes the record read as if the site changed shape twice in a day | **Move the third number by default**: `1.19.0` → `1.19.1`, then `1.19.2`. The second number is for a release that changes what the site is or sells (a new section, a new product, a page family rebuilt), and one agent's session rarely is that, however many pages it touched. When in doubt, the third. The first number is the lead's |
| **Generated files** (`*.md` twins, `sitemap.xml`, `llms.txt`, `llms-full.txt`, `404.html`, `versions.md`, `abp-vault-*.html`, `agent-behaviour-policy.html`, `site/admin/**`, everything derived inside `site/vaults/<slug>/`) | both sides regenerate | Never resolve by hand. Take either side, then run the generator (`generate.mjs`, `build-abp-pages.mjs`, `build-abp-vault.mjs <slug>`) and commit its output |
| **Every-page edits** (`sync-modules.mjs`, `add-licence-chrome.mjs`, a footer or header change, a menu change) | touches 50+ files | Do it in its own small commit, merge it into `dev` the same day, and tell the other agents in your work file so they merge `dev` before continuing |
| `site/pages.json` | two branches add a page | Keep both entries. Respect the 7-top-level-entries cap; a new page goes in a group |
| `site/vaults/index.json` | two branches add a vault | Keep both entries, in the order that reads best on the library page; rebuild the pages |
| **Append-only records**: `versions/index.json` + `versions/<v>.md`, `briefs-register.json` + `assets/briefs/`, `lab-editions.json` + `assets/lab/*.pdf`, `site/vaults/<slug>/history/` | history | Never edit or renumber an existing entry. Add yours. A Lab edition is cut on `dev` or by the agent who owns that page, never by two agents for the same page in the same day |
| `docs/briefs/` | none, if names differ | One file per brief, named `<kind>__<slug>.md`. Never rewrite another agent's brief; add a dated note at the top if it is superseded |
| `.claude/onboarding/` and `CLAUDE.md` | both sides update the map | Small, surgical edits; merge `dev` first; the map must describe `dev` after your merge |
| The Lab page content hashes | an every-page chrome change looks like every Lab page changed | `render-lab-pdfs.mjs` strips chrome from the hash. If `--check` still reports every page moved after a chrome change, the hash rule needs extending, not the register restamping |

## 3. Branches and merging

1. Branch from `dev`. Name it as the harness gave it to you (`claude/<words>`) or `feature/<slug>`.
2. Commit as you go with messages in the site's voice: what changed and why. The subject line
   is the register entry; `git log --oneline` should read as a story.
3. Push to your branch as often as you like. **Never push to `dev`, `qa` or `main` from a
   branch session unless the task says to merge.**
4. To merge: `git fetch origin dev && git merge origin/dev` on your branch first. Resolve per §2.
   Regenerate. `npm run check` green. Only then cut the release (§2, row 1), check again, and
   merge into `dev` with a merge commit (`--no-ff`), never a rebase of somebody else's history.
5. If the branch's pull request was already merged and you are asked for follow-up, start the
   branch again from `origin/dev`; never stack on merged history.
6. Nobody force-pushes `dev`. A wrong deploy is fixed forward with a new release.

## 4. External state

Some things are not in git and do not merge:

- **Vault pushes to sgit.** Every application vault and the app vault have a write key the lead
  holds. Building and `--check`ing a vault locally is always allowed; pushing needs the key. Say
  in your work file which vaults are built and unpushed, so the lead can push them. Never
  commit a write key or a token, anywhere. The test suite fails the build if one lands in `site/`.
- **The app vault's renderer version.** A change to `site/vaults/_app/index.html` must be
  pushed to the app vault and recorded in `_app/versions/index.json`; every application vault's
  `vault.json` names the renderer version it was built against.
- **PDF editions.** A Lab edition somebody was sent is a promise. Never delete, replace or
  regenerate a registered PDF.
- **The live site.** A push to `dev` is live within minutes. If a merge breaks CI, the previous
  deploy stays up; fix forward.

## 5. Ownership by surface

A surface has one owner at a time. Ownership is whatever `.claude/work/` says.

- **A page family** (`lab-*`, `demo-*`, the ABP pages, the summit pages): one agent at a time.
- **A vault**: one agent at a time, per slug. Two agents can add two different vaults freely.
- **The library page and the vault pages**: generated; owned by whoever changes `index.json`
  or `scripts/site/abp/`. Two agents changing `scripts/site/abp/` at once will conflict in JS:
  claim it.
- **Chrome and shared modules**: claim it, do it small, merge it fast.
- **Briefs**: the author owns the file. Anyone may reference it.

## 6. What every merge into dev must carry

- `npm run check` green on the merged tree, not just on the branch.
- A release note if any page under `site/` changed, in the voice of the existing notes, saying
  what was not done beside what was.
- `.claude/onboarding/03-state-and-next.md` updated if the state moved (a vault added, a task
  done, a decision taken).
- Your `.claude/work/` file removed.

## 7. When the rules are wrong

They will be. Write the case in your work file, do the safest thing, and propose the change to
this file in the same push. A rule that was silently worked around is worse than one that was
argued with in public, which is the same thing the site says about a draft behaviour policy.
