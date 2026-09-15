# riskmandate.ai — read this first

This is the public site for RiskMandate, served byte for byte from `site/` by GitHub Pages.
No build step, no framework. The site sells the **Agent Behaviour Policy** (ABP): for one
agent in one deployment, everything it can do, what it was authorised to do, the gap, and
what stands in the way. Fifteen template policies exist as encrypted vaults, read live on
`agent-behaviour-policy.html`. The Insurability Index is where this goes; we are on rung one.

**Do not re-read the repository to learn it.** `.claude/onboarding/` is the condensed version
of everything a previous agent had to read in full. Start at `.claude/onboarding/00-start-here.md`
and follow the reading order for your task. Budget: ten minutes, not an hour.

## The rules that are not optional

These hold for every page, every vault, every brief and every commit. Breaking one is not a
style problem; it is a correctness problem, and the site's own tests catch some of them.

1. **No score on a behaviour policy.** No rating, level, traffic light or verdict, anywhere,
   including in data. The Index scores the deployment; the ABP never scores anything.
2. **Never `ADP`.** The acronym is **ABP**, spelled out as *Agent Behaviour Policy* at first use.
3. **Never "the policy" alone.** Say *the ABP* or *the behaviour policy*. On this site *policy*
   is also the insurance instrument in the Licence to Operate demo.
4. **Never test somebody else's system.** Read the vendor's pages, quote them, date them. Where
   their pages disagree, publish the contradiction unresolved. A row becomes *measured* only
   on a system we are entitled to run.
5. **No verdict on a named third party.** Facts, dates, sources; no evaluative adjective.
6. **No conformity language.** Not certified, compliant, conformant, accredited, aligned.
7. **Never reproduce a standards body's text.** Titles only. The EU regulation may be quoted.
8. **Do not manufacture assurance.** A prohibition carries its barrier; a number carries its
   provenance; a claim carries its date.
9. **British English.** *Behaviour*, *authorise*, *licence* (noun). The site's voice is plain,
   sourced and unhurried; it says what was not done beside what was.
10. **No write credential in `site/`, ever.** Read keys are public by design and printed on
    purpose. A test fails the build if anything write-shaped lands in the deployed tree.

## The mechanics, in one screen

```bash
bash scripts/run-locally__riskmandate_ai.sh           # http://localhost:10070/  (localhost, not 127.0.0.1)
node scripts/site/generate.mjs                        # markdown twins, sitemap, llms.txt, 404 — rerun after any page edit
npm run check                                         # everything CI runs: tests + every --check
node scripts/site/release.mjs 1.17.0 "Title"          # cut a version: notes stub + restamp every page
```

- `site/pages.json` is the only place the page list lives; `generate.mjs` injects the menu.
- Generated files are committed. Never hand-edit a `.md` twin, `sitemap.xml`, `llms.txt`,
  an `abp-vault-*.html` page, or anything under `site/vaults/<slug>/` except `vault.json`,
  `data/grant.json`, `data/mandate.json`, `data/scenarios.json`.
- A release is a note somebody wrote. Every site change ships as one. Nothing bumps it for you.
- **Move the third number by default** (`1.19.0` → `1.19.1`). The second number is for a release
  that changes what the site is or what it sells: a new section, a new product, a page family
  rebuilt. Most sessions, including ones that touch fifty pages, are a patch. The lead moves the first.
- Pushing to `dev` deploys the live site. `dev` is the default branch and the integration branch.

## Working alongside other agents

Other agents are usually working on sibling `claude/*` branches at the same time, all merging
into `dev`. The rules are in `.claude/onboarding/04-rules-of-engagement.md`; the short form:

- Claim your scope in `.claude/work/<branch>.md` before you start; delete it when merged.
- Never cut a release on your branch until the last commit before merge, after merging `dev` in.
- Never resolve a conflict in a generated file by hand: regenerate it.
- Append-only records (versions, brief register, Lab editions, vault history) are never rewritten.
- A vault push to sgit is external state: say in your work file which vaults you pushed and why.

## Where things are

| You need | Go to |
|---|---|
| the shortest path into a task | `.claude/onboarding/00-start-here.md` |
| every doc, brief, page family, script and register, one line each | `.claude/onboarding/01-map.md` |
| the ABP model without reading five briefs | `.claude/onboarding/02-abp-model.md` |
| where we are and what is next | `.claude/onboarding/03-state-and-next.md` |
| how to add a page, a vault, a release, an edition, a brief | `.claude/onboarding/05-workflows.md` |
| a task ready to pick up | `.claude/briefs/` |
| a prompt to start a common job | `.claude/commands/` (also slash commands in Claude Code) |
| the same index, on the site | `site/admin.html` |

Write for the reader who arrives after you. Commit messages here say what changed and why in
the site's own voice; look at `git log` for the register. No model identifiers in anything
committed.
