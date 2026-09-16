# A policy per use case, and the £500 level is a prompt the customer runs

> Rendered from docs/briefs/direction__use-case-driven-policies-and-the-prompt-workflow.md in the repository. The text below is that file.
> Source: https://riskmandate.ai/admin/briefs/direction__use-case-driven-policies-and-the-prompt-workflow/ · noindex · written by scripts/site/build-admin.mjs

**Date:** 2026-09-15 · **Author:** @website-agent
**Trigger:** project lead's voice memo of 15 September, *"Use Case Driven ABP Policy Strategy"* (Otter transcript, about two minutes), received 15 September as a file and registered as D8
**Reads against:** `direction__abp-as-a-graph-and-stakeholder-views.md` (the memo it follows on from); store.sgit.ai v0.1.7 as read on 15 September (the four levels, `/offers/`, `/d/t3/`, `/how-it-works/`); the fifteen vaults; `MAP-A-GRANT.md` as shipped in every vault since v1.15.0

---

## 1. What the memo says, in its own order

1. **Another primitive: the use case.** Alongside a policy per target application and a policy
   per business function, a policy per *workflow*: *"use case driven … we can then start
   combining several policies."* The combination is the customer's; the examples are ours.
2. **Voice Debrief as the worked case study**, because its workflows are specific and already
   built, and because describing them advertises the product. Two are named:
   - **The web flow.** Upload audio on the website; transcribe; generate an infographic; the
     audio and the text go to *"open router, multiple models"*, and the results come back.
     The lead's own reading of it: *"the grant is that the data can go up anywhere. The mandate
     would be: I don't want anybody else apart from this transaction to see the data. But we
     don't know where the data is stored … we have no governance at this stage."* A good
     example of governance precisely because the grant is unbounded and the mandate is narrow.
   - **The WhatsApp flow through n8n**, *"the one that has all those examples from the thing we
     created"*: the shape the n8n vault already measured, now as a use case.
3. **Let the agent that knows the system write the policy.** *"Let's create the prompt for the
   agent that I have that knows how voice debrief works and knows how the n8n workflow works to
   actually be the one that creates the policy, the grant, and the mandate that can then send
   to us and we can package it up."*
4. **That is the third level of the store.** *"We give the user a prompt for them to calculate
   what's happening in that environment, and then we'll take that prompt and we'll create the
   policy for you."* Four price points: the pack (£5), the vault (£50), the custom policy
   (£500, *"the workflow is we give them a prompt, they run the prompt in the environment, they
   send us the result, and then we send them back the [policy]"*), and two live sessions
   (£1,500).
5. **Show what the £500 buys, in practice**, and *"we need a page, and we need to map this
   app, and we need to map the server."* The store.sgit.ai agent is working on the store side;
   synchronise once it finishes.

## 2. Where we already are

- **The prompt exists.** `MAP-A-GRANT.md` travels in every vault since v1.15.0: it is the
  prompt for an agent that holds a credential to measure its own grant, draft the mandate from
  the deployer's words, and produce the two JSON files the generator turns into everything
  else. Its seven rules of measurement came from the n8n write-up, which was itself produced
  this way. The memo's workflow is that prompt with a return address.
- **The n8n shape is measured.** `n8n-owner-api-key` stands at seven of eight rows measured on
  a live sandbox. The WhatsApp-through-n8n use case is that grant with a different mandate:
  exactly what `data/scenarios.json` already models (six mandates per vault, the grant never
  changing). A use case is a scenario promoted to its own vault, with its own workflow
  description and, where the workflow spans several applications, the union of their grants.
- **The store has the four levels live** (v0.1.7, 15 September): £5 the pack by email, £50 a
  working vault, £500 corrected for your situation (*agents with review*), £1,500 two sessions
  and a professional signs. Its own ledger says levels 1 and 2 exist and run and levels 3 and
  4 are *specified, never run*; its level-3 page says *"you tell us the industry, the use case
  and the details"* and *"nobody interviews you at this level: you send the details and the
  work is done from them"*. The memo makes that concrete: the details you send are the output
  of a prompt you ran.
- **The site now links to the store** (v1.19.0): the homepage's *view a policy / buy a policy*,
  the pricing page rebuilt around the four levels, and a *buy this policy* link on every vault
  page to the store's page for the same slug (the store uses our slugs).

## 3. The £500 workflow, written down

What the customer does, what we do, and what arrives, so the level-3 page on both sites can say
the same thing.

| Step | Who | What |
|---|---|---|
| 1 | customer | Buys level 3 at the store for the application closest to theirs, or *something not on the list*. |
| 2 | us | Send the prompt: `MAP-A-GRANT.md` for that shape, with a short header naming the order reference and what to send back. Nothing else is needed from us at this step; the prompt is public and in every vault already. |
| 3 | customer | Runs the prompt in the environment, with the agent that already holds the credential. The rules of measurement hold: measure only what you are entitled to run, reversible probes, never move a credential, note the door, say what you did not test, leave it as you found it. |
| 4 | customer | Sends back `data/grant.json`, `data/mandate.json` (the mandate in their own words, drafted by the agent, marked as a draft) and the session record. No secrets: the prompt says so. |
| 5 | us, agents | Build the vault from the three files with `build-abp-vault.mjs`; read the grant against the vocabulary; write the contradictions and the open questions; correct the mandate against the industry, the use case and the details the customer supplied; recompute. |
| 6 | us, a person reviews | The written note of what was changed and why, which the store's level-3 page already promises. Model-generated, marked as such. |
| 7 | us | Deliver the vault: private, no public key, a name on the licence, the note beside it. |

Two things the workflow depends on that do not exist yet: **a return address** for step 4 that
is not a mailbox (a write-only vault link is on the store's *not for sale yet* list as a
sharing primitive; until it exists, the order reference in an email is the honest answer), and
**a per-shape header for the prompt** so the customer's agent knows which vault's vocabulary
and reach names to use.

## 4. Voice Debrief as the first use-case vaults

Two vaults, both `use-case` in `vault.json`, both documented from the workflows as built rather
than from a vendor page, because the workflows are ours to describe:

| Vault | Grant | Mandate | What it shows |
|---|---|---|---|
| `voice-debrief-web` | the site's upload path; the transcription; the model calls through a routing service to several providers; the infographic generation; the results path. `send.endpoint.world` for the audio and the text, `material: own` for the speaker and `third_party` for whoever else is in the room; `write.budget.tenant` against the routing account | *"nobody apart from this transaction sees the data"* | the grant is unbounded on the row that matters and the mandate is one sentence: the widest delta on the site, on our own product, published |
| `voice-debrief-whatsapp-n8n` | the n8n owner-key grant, measured, plus the messaging platform's bot scope, documented | the WhatsApp workflow as built | a use case as a combination: two grants, one mandate |

The memo's instruction is that the agent that knows the workflows writes these, using the
prompt, and sends the files here to be packaged. That is the workflow in §3 run on ourselves
first, which is the right order: the £500 level has never been sold once, and the first run
should not be a customer's.

## 5. What this asks for, in order

1. **A page for the £500 workflow** on this site (`how-the-corrected-level-works.html` or a
   section of `pricing.html`): the seven steps, the prompt linked, what arrives, what does not.
   Done as a section of the pricing page in v1.19.0; a page of its own when the store's side
   has the return address.
2. **The prompt with a header**: a generated `MAP-A-GRANT.md` per vault that names the shape,
   the vocabulary version and the order reference placeholder. Small change to the generator.
3. **The two Voice Debrief vaults**, produced by the agent that knows the product, packaged
   here. A `use-case` status in `vault.json` and a *Use cases* group on the library page.
4. **Combination**: a vault whose grant is the union of two vaults' grants, with the source
   vault named on every row. The generator does not do this yet; it is the mechanism every
   real deployment needs and the third axis of the library.
5. **Synchronise with the store agent** on the level-3 page wording once its side lands: the
   same seven steps, the same prompt, the same *what does not arrive*.

## 6. What this does not settle

- Whether a use-case vault is a new `status`, a new `group`, or a scenario that has grown up.
  This brief says a vault with its own workflow description; the library's third axis.
- The return address for step 4. A mailbox works today and is the wrong long-term answer.
- Who reviews at level 3: *agents with review* is the store's phrase; the reviewer is a person
  and the note is what they sign off, but nothing here names them.
- The Voice Debrief grants themselves. They are documented from our own workflows, which is
  allowed; the model calls through a routing service reach providers whose retention we cannot
  read, which is a `research_needed` row, not a guess.
