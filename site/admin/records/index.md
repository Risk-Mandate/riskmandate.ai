# The records

> The append-only records riskmandate.ai keeps — versions, the brief register, the Lab editions, the vault catalogue, the machine-readable indexes — and where each lives.
> Source: https://riskmandate.ai/admin/records/ · noindex · written by scripts/site/build-admin.mjs

Each of these is a file a program can fetch, rendered by a page a person can read. Where the two disagree, the file is right and the page is stale. None of them is rewritten: they only grow.

## Versions

**[versions.html](../../versions.html)**

Every release since the site began, newest first, with the note somebody wrote for it. A release is declared, never incremented; CI tags the commit it names.page

**[versions/index.json](../../versions/index.json)**

The index the page renders, and the number every page's header shows. The single place the current version lives.file

## How the site reads to somebody new

**[synthetic-users.html](../../synthetic-users.html)**

Five invented readers walked through this site one screenshot at a time and interviewed at the end. Everybody in it is invented and the page says so.page

## Briefs received

**[briefs.html](../../briefs.html)**

Every document this site was built from, what it produced and what it did not, with the SHA-256 of each file as received.page

**[briefs-register.json](../../briefs-register.json)**

The register itself. Hash the brief you sent and look for it here.file

**[the memo queue](../../admin/memos/)**

The same register, with what each item still owes.console

## The Lab's editions

**[lab-editions.json](../../lab-editions.json)**

Every dated PDF ever cut of a Lab page, with its digest — 8 so far. A page holds current thinking and changes; an edition is what it said on the day, and is never removed. [The Lab](../../lab.html) lists them.file

## The behaviour-policy vaults

**[vaults/index.json](../../vaults/index.json)**

The catalogue: every template vault, its vault id and its public read key, the applications asked for and not yet built, and the app vault the renderer lives in.file

**[the vaults](../../admin/vaults/)**

The catalogue with each vault's measured rows and open questions.console

## Machine-readable

**[llms.txt](../../llms.txt)**

The index for an agent: every published page with its title, description and markdown twin. The console is not in it.file

**[llms-full.txt](../../llms-full.txt)**

The whole published site as one markdown document.file

**[.well-known/agent-content.json](../../.well-known/agent-content.json)**

The structured manifest. [The agents page](../../agents.html) explains all three.file

**[sitemap.xml](../../sitemap.xml)**

Every published page and nothing that is not one; a test says so.file
