<!-- Generated from work.html by scripts/site/generate.mjs. Edit the page, not this file. -->

# Working with us — briefs for collaborators and their agents

Briefs for people collaborating with RiskMandate, written to be read by a person and handed to an agent. Plus the seven hard rules that apply to anything produced on our behalf.

Source: https://riskmandate.ai/work.html

---

# Briefs for people working with us — and for their agents.

If you have been pointed at this page, it is because we are working together. Each brief below is written to be read by a person _and_ handed to an agent: every page on this site has a markdown twin at the same address with a `.md` extension, which is the version to paste. Nothing here is behind a login, because nothing we do is.

## What is on the table.

Each brief states the commercial context, the task, what the deliverable is, and what we do not know. If a brief does not tell you why the work matters commercially, it is a bad brief and we would like to hear that.

### Power user and tester of Agent Behaviour Policies

Make Agent Behaviour Policies for real deployments, find out where the model breaks, and time the whole thing. We have a published model, five worked examples and a claim that the second policy of a known shape should take minutes rather than days — and nobody has tested that claim. It is the single input that decides whether any of this can be priced.

## Everything is published, including the parts that are wrong.

Six things that will save you guessing. They are not preferences; they are how the whole estate is built, and they hold for anybody working on it.

- **Every page has a markdown twin.** Any page on this site, with `.html` swapped for `.md`, is the same content without the markup. That is the thing to give an agent. `llms.txt` is the index; `llms-full.txt` is the whole site in one file.
- **We work in the open.** [The Lab](lab.html) holds findings, interface mockups and open proposals before any of it is built, each labelled with how much to trust it. Work in progress is published, and so is the discarding of it.
- **Thinking gets versioned.** Lab pages change, so every meaningful state is also cut as a dated PDF with its own digest. If a page contradicts what you read last week, the earlier edition is still linked from it.
- **Every claim carries its source.** A statement about a third party's product cites that party's own published documentation, with the date it was read, and no adjective. If we cannot source it, we do not publish it.
- **The site has no build step.** `site/` is plain HTML deployed unchanged — one self-contained file per page, no framework, no bundler. Editing a page means editing the page. There are a few maintenance scripts and a version record; there is nothing to compile.
- **Releases are declared, not incremented.** Every change ships as a version with notes somebody wrote, and the number in the header links to [the record](versions.html). Nothing bumps it for you.

## Seven things that must not be broken.

These are not style guidance. Each one exists because breaking it would be dishonest, legally unwise, or would destroy the thing that makes our output worth anything. They apply to you and to anything your agent produces on our behalf.

| Never | Why |
| --- | --- |
| Test somebody else's system | Probing a third party's service to find out what it does is out of bounds, with no research exemption. Read their documentation. Where their own pages contradict each other, publish the contradiction unresolved with both sources and a date — an honest unresolved finding is worth more than a resolved one obtained by poking |
| Put a score on a behaviour policy | No rating, no traffic light, no risk level, anywhere, including in the data. The same policy is dangerous in one deployment and harmless in another. The score lives on the risk product, where the assets are known and a named person signs |
| Write `ADP` | It is a registered mark of one of the largest payroll processors in the world, in every relevant class. The acronym is **ABP**, spelled out as Agent Behaviour Policy at first use |
| Say “the policy” | In our own [Licence to Operate](demo-licence-to-operate.html) demonstration, _policy_ is the insurance instrument. Say “the ABP” or “the behaviour policy”. It costs one word |
| Use conformity language | No “certified”, “compliant”, “conformant”, “accredited”, and nothing that reads as a conformity mark. Nothing we sell is a compliance assessment, and the language raises the standard of care for no buyer benefit |
| Pass a verdict on a named third party | Publish the record — facts, dates, sources — never the judgement, and no evaluative adjective attached to anybody's name. That holds for competitors, vendors, standards bodies and platforms |
| Reproduce a standards body's text | The international management standards prohibit adaptation, translation and commercial exploitation, and now prohibit language-model use of their content. Titles only. The EU regulation is expressly reusable and can be quoted freely |

And one that is about tone rather than risk: we do not manufacture assurance.

A prohibition rendered without saying what enforces it, a number without its provenance, a claim without a date — each of those makes a reader feel safer than the evidence supports. That is the specific failure this whole product exists to fix, so producing it ourselves would be self-defeating.

## What you need, and what you do not.

- **Nothing, to start.** The first brief needs a browser and an agent. No repository access, no credentials, no vault keys, no accounts.
- **Repository access, when you are changing the site.** `node` and `python3` are the only prerequisites; `bash scripts/run-locally__riskmandate_ai.sh` serves the site on localhost and `node --test tests/site/*.mjs` is the gate. The README is short on purpose.
- **A vault key, only if a brief says so.** Content lives in SG/Vaults, read with `sgit`. Read keys are public by design; write keys are not, and no brief hands one over casually.
- **Hand work back as markdown.** One file, with the date, what you did, what you found, and what you could not answer. Not a slide, not a summary — the working, because the working is what we can act on.

## Start with B1.

It opens with a prompt written to be pasted straight into an agent, a reading list ordered by what you actually need first, and a deliverable that is a table rather than an opinion.
