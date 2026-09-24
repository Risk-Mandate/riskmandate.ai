# ABP for people you know — the pack

Give this zip to a new Claude agent. It makes an Agent Behaviour Policy vault for one person or
organisation you have just talked to, so you can send them a link: a demo that is about them, that
asks them to correct it, and that invites them to try the product.

## What you give the agent

**Once per session, in chat, never in a file:**

- the sgit access token it pushes with;
- the keys vault's vault key (after the first session; see below).

**Once per person:** the filled-in `templates/request.md`, which is a website, a name, a sentence,
optionally a LinkedIn link, and your private notes from the conversation.

**What you get back:** a link to their vault, a draft message to send them, the three assumptions
most likely to be wrong, and what the agent could not find. You send it; the agent never contacts
anybody.

## The three vaults

- **App vault** (`vbhmlulo`): the renderer every behaviour-policy vault already loads. Shared,
  public read key, unchanged by this work.
- **Keys vault**: private. Every person vault's keys, and your notes. Its key stays with you.
- **One vault per person**: their behaviour policy, written as if it might be public one day,
  shared by link only.

## The first session

There is no keys vault yet. Tell the agent to create it (the steps are in `CLAUDE.md`). It will
give you the keys vault's vault key once, in chat. Keep it; you hand it to every later session.

## What is in the zip

| Path | What |
|---|---|
| `CLAUDE.md` | The agent's instructions: rules, the three vaults, every step with its commands |
| `BRIEF.md` | Why this exists and what we are trying to learn |
| `templates/` | Your request form, the private intake, the person's cover document and sources file, the registry, the message |
| `tools/new-person.mjs` | Starts a person's vault from one of the catalogue's deployments |
| `tools/check-person.mjs` | The gate before a push: no other person's names or keys, no private notes, no contact details, every source dated |
| `toolkit/` | The builder from riskmandate.ai, unchanged, with the template, the app loader and the sixteen catalogue deployments' inputs |
| `examples/example-analytics/` | A fictional organisation's vault, built and checked, to show the shape of the result |
| `people/` | Where the agent works; one folder per person |

Nothing in the zip is secret. It carries the app vault's public read key, as riskmandate.ai does,
and no write credential of any kind.
