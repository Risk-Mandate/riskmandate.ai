<!-- Generated from lab.html by scripts/site/generate.mjs. Edit the page, not this file. -->

# RiskMandate — the Lab

Findings, interface mockups and open proposals, published as they happen. Work in progress rather than product claims — some of it will turn out to be wrong, and the arguing is the point.

Source: https://riskmandate.ai/lab.html

---

# Findings, mockups and things we have not built yet.

We work out the product in public. This is where the research, the interface mockups and the open proposals live, before any of it is a feature. If you want to argue with us, this is the surface to argue with — and the arguing is the point.

## Everything currently open.

In reading order rather than by date — the finding comes first because everything after it leans on it. Each entry says what state it is in, because a finding and a mockup are not the same kind of claim and should not be read as though they were.

### The grant is user-shaped, not data-shaped

When somebody connects an assistant to their mailbox or their drive, what do they actually grant it? We read four vendors' own documentation and the answer is consistent: the unit of restriction is the application, never the data. The narrowest mail scope that can read a message reads every message. The default file corpus is, in the publisher's own words, files _owned by or shared to_ the user. And in four places a vendor's own marketing and their own scope list disagree with each other.

### What buying a behaviour policy would actually look like

Twelve stages from the first question a stranger reads to a delivered, recomputing vault with a read key they can hand to an underwriter. Five of those stages are drawn here as interface mockups, including the one that matters most: what a draft policy looks like, and what correcting it feels like. None of this is built. The mockups exist so the flow can be argued with before it is written.

### Changes we are asking of the behaviour-policy site

The model and its data live on a separate site, maintained by somebody else. This is our open request list against it: one new property for the capability grammar, four deployment shapes we would like published, and the provenance conventions we would need in order to render any of it. Published rather than emailed, so the reasoning is checkable and the answer can be public too.

### Seven things to build, and one word we have not earned

The build specification for the first thing anybody will ever use: a page that asks what you run, computes what you granted, and hands you the gap. Three tools, two vaults, two documents — and the arithmetic that decides what may leave the browser. A twenty-connector multi-select carries about 20 bits, which is more entropy than a well-known browser-fingerprint study measured in a whole fingerprint, so the full shape is computed locally and only bands and categories are ever submitted.

### Your agent can commit as you, and no instruction stops it

The author name and address on a commit are free text — git's own reference says the name has no effect on authentication, the code host's write interface takes both as parameters needing only contents write, and the host attributes the result to whoever owns that address with no consent step and no notification. Exactly one thing prevents it, and it is a repository setting. Alongside the finding: the eight-line prompt we would ship, with every line marked by what actually enforces it, and six documented incidents whose fixes have one thing in common.

### Every routable address is in the grant, and the one rule everybody signs has no barrier

Ask any deployer whether their agent should attack other people's systems and you get the same answer — it is the easiest line in any policy to agree. It is also the one where the grant cannot be enumerated at all: it is every address the process can route to, nobody granted it, and the measure we have been using since Lab 04 does not apply. A vendor's own documentation says the fetch allow list does not prevent network access because the shell can reach any URL; the setting that does hold covers shell subprocesses only, does nothing when written into a repository, and fails open. Includes what the machine that published this page can reach, measured.

## Four states, and they mean different things.

The rest of this site says only what we can defend. The Lab is looser on purpose — but only about _status_, never about sourcing. A guess here is labelled a guess; a quote is still a quote with a link and a date.

|  | State | What it means | How much to trust it |
| --- | --- | --- | --- |
| Finding | finding | Something we read in a primary source and can quote | As much as the source. Every claim links to it, with the date it was read |
| Mockup | mockup | An interface or a flow drawn to be argued with. Not built | As a proposal. If it looks like a screenshot, it is not one |
| Proposal | proposal | A change we are asking somebody else to make | As our opinion, with the reasoning attached |
| Open | open | A question we cannot currently answer | Not at all. It is here so nobody has to rediscover it |

- **Nothing here is tested against anybody's system.** Every claim about a third party's product comes from that party's own published documentation, read on a stated date. Probing somebody else's service to find out what it does is out of bounds, so where a vendor's own pages contradict each other we publish the contradiction unresolved rather than settle it by experiment.
- **No verdicts about named third parties.** Where a vendor is named, it carries a source, a date and no adjective. Nobody in these pages is accused of anything; marketing copy and scope lists are maintained by different people and nothing reconciles them, which is the whole point.
- **A mockup is not a roadmap.** Drawing a screen is the cheapest way to find out that a flow is wrong. Some of these will be discarded, and the discarding will be published too.
- **Corrections are welcome and get published.** If something here is wrong — especially if it is your product we have described — tell us and the page changes with a note saying what changed and why.

## Because the alternative is a demo nobody can check.

- **It is the same discipline as the product.** A behaviour policy is worth something because every row names where it came from. A research page that cannot be checked would be the opposite of the thing we sell.
- **It finds collaborators faster than a pitch does.** Somebody who reads a finding and disagrees with it is more useful than somebody who reads a landing page and nods.
- **It dates our work.** Publishing a finding with a date is how a claim earns a clock. Anything undated rots invisibly.
- **The reverse also holds:** anything in here that stays unbuilt for months is telling us something, in public, that a private backlog would have hidden.

## The journey, kept as files.

Every entry is also cut as a dated PDF, and the old ones are kept. Send the file rather than the link when what matters is what we thought _then_ — a link shows the reader whatever the page says by the time they arrive.

All 6 entries, in reading order, as a single PDF, 76 pages. This is the one to attach when you want somebody to follow the whole journey rather than land in the middle of it.

Digests for every edition are in [lab-editions.json](lab-editions.json), so a PDF somebody was sent can be checked against this list.

## Argue with the earliest version.

Everything here is cheaper to change now than after it ships. If a finding is wrong, a mockup is unusable, or a proposal is misguided, that is the most useful thing you could tell us today.
