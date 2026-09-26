<!-- Generated from team/index.html by scripts/site/generate.mjs. Edit the page, not this file. -->

# RiskMandate — The team: who does what, and what stands in the way

One person and two agents make this site. An Agent Behaviour Policy for each agent in the catalogue's grammar, three tiers of information (public, private, secret), every surface with its tier, the workflow from private to public, and the controls, checks and tooling in place and not. Nothing is scored.

Source: https://riskmandate.ai/team/

---

# Who does what, and what stands in the way.

This site is made by one person and two agents. The agents are described the way the site describes any agent: an Agent Behaviour Policy each, in the same grammar as the catalogue, with the grant measured on the thing itself, the mandate in the lead’s words, the gap derived, and a barrier on every row. Around them, three tiers of information and the workflow that moves a story from private to public.

**Nothing here is scored.** A count is a count; a barrier is what it is. Where the honest answer is a rule in prose, the page says so.

**As at** 26 September 2026. If the deployment changes, this page changes; the vaults and the tests that hold it true are listed in section 06.

## One person, two agents.

### RiskMandate Publisher

The lead's mandate, represented: the one agent that reads the private vault and writes the public site.

### RiskMandate Design Studio

Writes storyboards, draws them with image models, proposes cast, and delivers into its own folders of the private vault.

## Public, private, secret.

Everything the team touches is in one of three tiers, and the rule for each is one sentence. The controls under each are named by what they are under the enforcer test: a boundary is enforced by something the agent cannot reach; a setting can be flipped by the account; prose is a rule somebody wrote.

### Public

Everything under site/ and docs/ and .claude/ in this repository, because the site is served from site/ and the console renders the rest; the repository itself, open source; the board's ids, titles, owners and states.

**Read by** anyone. **Written by** the publisher, through the merge workflow; the lead.

**The rule.** Nothing goes here that is not meant for everyone. A story reaches here only through the publication workflow below.

- the merge command pushes dev only when the check is green (setting)
- CI runs the same check before the deploy job (setting)
- the credential test on site/ and on the console (setting)
- no message file and no message id in site/ (setting)
- no score, not the acronym with a D, never the policy alone, not the ladder word (settings, tested)
- the platform's token scope: only this repository (boundary)

### Private

The stories vault: every message between the parties, every draft, every picture not yet accepted, every decision not yet taken, the studio's working files and its decision record. The published mirror is the one public thing in it, and it is a copy.

**Read by** the three parties, and whoever the lead gives the read key to. **Written by** each party in its own folder; anyone in a mailroom, for its recipient.

**The rule.** It moves to public only when the lead has accepted it by message and the publisher has read it against the rules. What is said between agents stays in the vault; the board publishes that a request exists, never what it says.

- zero-knowledge encryption at the vault host: the server never sees plaintext (boundary)
- single-writer folders (prose)
- messages are immutable and only move (prose)
- one commit per check-in, named, in sgit history log (a record)

### Secret

The vault key (it derives the write key), the vault host's access token, the platform's tokens, any credential. Also secret-bearing: a chat or a conversation a secret was pasted into, and the transcript the harness keeps of it.

**Read by** the lead; an agent for the length of one session. **Written by** nobody, in a file.

**The rule.** Never in a file in either tree, never on a page, never in a message. Handed over in a session or set as an environment secret. A secret found in a file is an incident: rotate it first, then find how it got there.

- the test that refuses anything write-shaped in site/ and on the console (setting, after the fact)
- the rule in every brief and in CLAUDE.md (prose)
- the platform's environment secrets, once used (boundary against the transcript)
- what is not in place: a token scoped to one vault; a secret scan before a commit; a branch rule on dev at the code host

## One party touches two tiers, and nothing crosses the red line.

The studio writes into its own folders of the private vault. The publisher pulls the vault, writes the repository, and a push to dev is the public site once the check has passed. The lead hands a key in a session and never in a file. The only thing that goes from the vault to the site without the lead’s yes is the board, and the board carries no message.

_Red: secret, handed over in a session and kept by a platform. Gold: private, the encrypted vault. Green: public, the repository, the check and the site. Every arrow is something that happens on a check-in; the mirror back into the vault rides the pull and push arrow._

## Every place a thing can live, and its tier.

## Seven steps, each with its evidence.

The workflow that makes a story public. The lead accepts; the publisher checks and ships; the studio never publishes. Every step leaves a file somebody else can find.

### Deliver

a picture or a story file in its own folders, with its record; a message to the publisher naming the path

### Read against the rules

fictionalised and said so; nobody's product or face; nothing scored; the site's words; every line belongs to the cast; the truth under it is one the site states

### Ask

one message to the lead: what it is, where it came from, what goes live if the answer is yes

### Accept

yes, no, or what to change, by message or in a session written down as the lead's

### Publish

the story file and the picture into site/stories/; build; npm run check; a patch release with a note; merge into dev with the check green

### Deploy

the check job, then the deploy job

### Mirror back

site/stories/ copied into published/ in the vault; the task closed; the board regenerated; one check-in commit

## What is in place, and what is not.

The site’s own line applies to the site: a prohibition carries its barrier. Most of what holds this team to its rules is a setting or a sentence, and the three things that would make boundaries of them are listed as not in place, without a verdict.

The checks each agent runs, and what it never does, are on its page. The tests that hold the public tier are the site’s own: `npm run check` before every merge, the same in CI before every deploy.

## An agent is a role, a list of skills, and its behaviour policy.

A new session of either agent starts from nothing and reads three things in order: its role, the skills it needs, and its ABP. Then it runs one check-in. The prompt for each is on its page, with a copy button; the publisher’s is also `.claude/agents/publisher.md` in the repository, the form a Claude Code session loads by name.

- **[RiskMandate Publisher](/team/publisher.html#session).** A clean Claude Code session on this repository, started with the prompt below; on a schedule, the same prompt from a routine, with the key and the token read from the environment.
- **[RiskMandate Design Studio](/team/studio.html#session).** A ChatGPT conversation the lead opens, pointed at the vault: it reads the files above, delivers its mailroom, does the work, commits once and pushes. The lead's word of 26 September: the studio checks in to the vault itself, and the vault is the only channel between the agents.

## What this page does not have yet.

- **The policies as vaults.** Each agent’s policy is in the vault grammar and could be built with the catalogue’s generator and pushed with a public read key; today it is two JSON files and this page.
- **A token scoped to one vault.** The one control that would bound three rows for both agents; asked of the sgit team, not answered.
- **The schedule.** The publisher’s check-in runs by hand until the key and the token are environment secrets and the lead has said what a scheduled run may decide alone.
- **An infographic of this page**, asked of the studio by message.

## This is what an ABP looks like when it is written about ourselves.

Sixteen template policies for the shapes people run are in the library; this page is the same grammar turned on the two agents that make the site. If yours would look different, that is the point of writing it down.
