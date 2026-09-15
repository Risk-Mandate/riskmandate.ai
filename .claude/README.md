# .claude/ — the agent's front door

Everything here exists so the next agent reads less. The repository's own docs are the record;
this folder is the index, the condensed model, the working rules and the ready-to-start work.

```
CLAUDE.md                  read automatically by Claude Code; the rules and the one-screen mechanics
.claude/
  onboarding/
    00-start-here.md       reading order by task; ten minutes to being useful
    01-map.md              every doc, brief, page family, script, test and register, one line each
    02-abp-model.md        the Agent Behaviour Policy model, condensed from the briefs and abp.sgit.ai
    03-state-and-next.md   where the site is (version, vaults, what is built) and the ordered next steps
    04-rules-of-engagement.md  parallel agents, branches, merging into dev, what never conflicts and why
    05-workflows.md        recipes: page, vault, release, Lab edition, brief, register entry, merge
  briefs/                  task briefs written to be picked up by one agent each; scope, files, done
  commands/                prompts for common jobs; in Claude Code they are /slash commands
  work/                    one file per in-flight branch: who is on what, which files, which vaults
```

Keep it current. When you change how something works, change the line here that describes it in
the same commit. A stale index costs the next agent exactly the hour this folder exists to save.

Published mirror: `site/admin.html` lists the same things for a reader on the site, with links
into the repository.
