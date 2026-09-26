<!-- Generated from team/studio.html by scripts/site/generate.mjs. Edit the page, not this file. -->

# RiskMandate — RiskMandate Design Studio: its Agent Behaviour Policy

Writes storyboards, draws them with image models, proposes cast, and delivers into its own folders of the private vault. The grant (7 of the 23, 7 observed or measured), the mandate in the lead's words, the delta derived (2 in excess, 2 unbounded), every surface with its tier, what it never does, what would bound it, and the prompt a clean session starts from. Nothing is scored.

Source: https://riskmandate.ai/team/studio.html

---

# RiskMandate Design Studio

Writes storyboards, draws them with image models, proposes cast, and delivers into its own folders of the private vault.

**Runs as:** ChatGPT on the web, in the lead's account, with browsing, code execution and image generation on, and the stories vault's access token pasted into its conversation. [The catalogue’s template for the shape](/abp-vault-chatgpt-web.html).

**Validity:** this describes the deployment shape as at 26 September 2026. If the risk changed, the deployment changed, not this document. **Owner:** the lead.

**This page as markdown:** [studio.md](/team/studio.md) · **the data:** [studio.json](/team/studio.json)

## What it is for, and what it reads first.

Turns a story into a storyboard in the site's shape, draws it with whichever image model is being tried, keeps the original of every picture and a register of what drew it and when, proposes new cast to the lead, and answers requests from the publisher by message. It works in its own folders and never touches what is published.

Reads at the start of every session, in this order

Skills

- **image generation**: drawing a storyboard in the cast's style; several models, named
- **sgit**: commit and push its own folders and the mailroom
- **the story file shape**: a storyboard as data: slug, title, punchline, cast, source, truth, panels, prompt

**Tools:** conversation and uploads · browsing (the vendor's egress) · code execution (the vendor's sandbox) · image generation. **Reach:** _host_ is the vendor's environment and sandbox; not the lead's machine; _tenant_ is the stories vault at the vault host, with the account token in its conversation; _world_ is the vendor's egress: any page it is asked to read.

## 7 of the 23, irreversible first.

The catalogue's template for this shape is derived from the model site's web tree, with browsing off, and has one row. This deployment has more: the rows below are what this agent was observed to do on 26 September 2026, when it created and pushed the stories vault, read from the vault it left behind and from its own decision record. Each row: the primitive, what stands in the way, how we know, and what was done or read. A barrier is a control only in the fourth case.

Not in the grant, and why

- `send.message.world`: No mail. A message in the vault is a file.
- `write.repository.project`: It has no repository attached; the site's repository is not reachable with anything it holds.
- `create.record.world`: Nothing it holds publishes under a name; what it draws reaches the public only through the publisher.

**Not in the grammar:** Generating an image. Keeping a conversation on the vendor's side, with what was pasted into it. Both are real and neither is one of the 23.

## Write and draw stories in the cast's style; deliver into its own folders; propose, never publish.

Authored 26 September 2026 by the lead, in the sessions of 26 September, written down by the publisher; the first draft to argue with.

Wanted (5)

Refused (2)

Unstated (0)

- `write.repository.tenant`: wanted, with instances: its own folders (artwork/, stories/, cast/, prompts/, decisions/, sources/, guidance/, versions/, archive/, _page.json, mail/studio.chatgpt/) and the mailrooms. Never published/, board/ or another party's folder. The instances are prose; the grant does not know them.
- `send.endpoint.world`: wanted for two things: reading this site's public pages, and pushing the vault. Nothing else is asked for.
- `authenticate-as.credential.tenant`: wanted for the one vault. The token it holds reaches every vault the account has, which is more than the mandate.
- `grant.credential.self`: refused: no new vaults, no new keys, after the one it made.
- `read.credential.host`: refused beyond the one token and the one key it was handed; never into a file it pushes.

## 2 in excess, 2 unbounded.

Excess is what the grant has and the mandate did not ask for; unbounded excess is the part of it with nothing in the way but a switch or a sentence. That number is the only one a control can move, and section 06 says which control would move it.

Excess, refused by the mandate (2)

Excess, unstated (0)

Unbounded excess (2)

Shortfall (0)

Aligned (5)

## What it reads, what it writes, and the tier of each.

Checks

- **on every delivery:** the publisher reads the story or the picture against the site's rules before anything is published; the story build refuses an unknown cast member, a line for somebody not in the story, and the ladder word _(setting)_
- **on every check-in:** its own guidance: preserve originals, register each asset with its hash and status, save prompts verbatim, keep credentials outside the content tree _(expectation)_

Never

- edit published/, board/ or another party's folder
- draw a real product's interface, logo or a real face; score anything
- push a credential into the vault
- create a vault or a key beyond the one
- say the acronym with a D in it, the policy alone, or the ladder word

## The business case for a control, with no verdict in it.

This provision requires X; the grant does not bound X; a control of type Y at layer Z would bound X. Each line moves rows from the unbounded count.

Research needed

- **Does the vault host issue write tokens scoped to one vault?** It is the one control that would bound three rows at once for both agents. _Who: the sgit team._

## The role, the skills, the policy, then one check-in.

A ChatGPT conversation the lead opens, pointed at the vault: it reads the files above, delivers its mailroom, does the work, commits once and pushes. The lead's word of 26 September: the studio checks in to the vault itself, and the vault is the only channel between the agents. **Schedule:** None. It runs when the lead opens the conversation.

```
You are the RiskMandate Design Studio (studio.chatgpt). Read, in this order, in the stories vault: README.md; mail/README.md; mail/sessions/studio.chatgpt/brief.md; published/cast.json; then every message in mail/mailroom/studio.chatgpt/. Move those messages into mail/studio.chatgpt/inbox/. Do the work each asks for: a picture goes in your own artwork/ or mail/studio.chatgpt/files/<slug>/ with its record in artwork/assets.json; a storyboard is a file in the shape of published/just-a-draft.json; a proposal is a reply. Reply to publisher.claude by message (two copies: mail/mailroom/publisher.claude/ and mail/studio.chatgpt/outbox/publisher.claude/). Append to mail/sessions/studio.chatgpt/notes.md. Commit once, starting @Designer check-in:, and push. Never write the token or the key into a file.
```

## The other agent, and the three tiers.

Who does what, what is public, private and secret, the workflow from one to the other, and what is in place and not.
