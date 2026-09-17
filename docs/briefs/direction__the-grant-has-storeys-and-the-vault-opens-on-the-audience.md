# The grant has storeys: what the credential permits, what the client exposes, what practice allows — and the vault opens on the audience, not on the data

**Date:** 2026-09-16 · **Author:** @website-agent
**Trigger:** project lead's voice memo of 16 September — *"these multi-layers of grants … I want to use this vault and this Claude and email as a basic case study … we can change whatever we want on this vault"* — and, on the vault itself, *"map initially the audience and probably have three different folders … executive, operator and risk"*
**Reads against:** `site/vaults/claude-gmail-connector/` as pushed in `oc433z3m` (six grant rows, eleven consequences, six assets); the v5 reading app in app vault `vbhmlulo`; Google's Gmail API reference for `users.messages.attachments.get` and its scopes page (both read 2026-09-16); Anthropic's Google Workspace connectors help article (read 2026-09-16); `direction__consequences-assets-and-the-vault-as-a-website.md`; the barrier vocabulary at abp.sgit.ai v0.3.0

> The memo arrives with a worked example already on the table. An hour earlier we established, from Google's own reference, that the credential Claude holds authorises attachment bytes and the connector simply does not offer them. The memo generalises that into the shape of the model.

---

## 1. What the memo says, in its own order

1. **The vault is the delivery mechanism, and its first job is to not overwhelm.** *"The point of the vault is that we can have a huge amount of content … delivered in a simple way."* Everything we have built so far is true and most of it is too much for the first screen.
2. **Open on the audience.** Three of them, as *"folders"*, and **audience is the main section of the left menu**, with sub-menus under it. *"Executive, operator and risk — unless you have a better name for operator … maybe we call it technical."*
3. **The executive view is the whole thing, simplified.** *"How do you explain what this vault represents in one line, in a couple of diagrams, in a couple of paragraphs … in a nice sort of website-like way that becomes easy to consume for an executive."* Plain language, business language, visual, high level — and good enough that a technical person landing cold also starts there. *"If I'm looking at a vault or a grant that I just received, I want to start in one place."*
4. **Do not lose the rest.** The packs, the licence, how to use it, the paid material all stay. *"That should not be centre stage straight away."*
5. **The grant has storeys.** Three of them, named in the memo:
   - *"What is absolutely possible to do … with the Google permission. At this stage we're looking at Google's OAuth permission layer. That's the grant."*
   - *"What the agent, i.e. Anthropic, exposes to the chat environment. This is what you already started to map."* And the warning that goes with it: *"this is code, this could have bugs … it could change at any minute's notice."* We are relying on it and *"we hope, hope-based security, that it does the right thing."*
   - *"What normal usage, I guess, from Claude and Claude's own guardrails implement."*
6. **Those storeys hold mechanical capabilities, and mechanics are not the interesting part.** *"These are almost mechanical capabilities … I can read an email. This has no context, what is in the email. That's why we have to then add the next layer up, which is what will then be possible to do with that."* The memo names the examples: reading attachments, forwarding what you were not authorised to forward.
7. **That upper layer is a universe, and it is where the gaps are.** *"This is where it gets interesting … more behaviours, and side effects … we just need now to find some good ways to visualise this."*
8. **The question the whole thing is for.** *"What I really want to understand is: are people aware of this? Are people aware of this kind of controls?"*
9. **The vendor's restriction is a control, and can be read as one.** *"We can already reverse engineer an already-blocker, which is the Anthropic tool, and we should map that out — because part of the exercise here is to put more of these controls in place, and even make the business case for some of these controls."*

## 2. Where we are

- **We already have storey two.** Every grant row in every vault is *what the client exposes*: `read.message.tenant` is `search_threads`, `get_thread`, `get_message`; `send.message.world` is *Send email message*, reply, forward. The `via` column has always been the tool surface. We have been calling it the grant.
- **We already have the layer above.** `data/consequences.json` is exactly the memo's *"what will then be possible"*: capability × asset → consequence, eleven of them for this shape, with the routes out counted. The memo's *"mechanical capabilities have no context"* is the sentence that layer exists to answer.
- **We do not have storey one at all,** and the attachment case shows what that costs. Google's reference for `users.messages.attachments.get` says: *"Requires one of the following OAuth scopes: `https://mail.google.com/`, `gmail.modify`, `gmail.readonly`."* The consent screen granted `readonly` and `modify`. So the credential permits attachment bytes. Anthropic's help article says attachment content *"is not directly accessible through Gmail (metadata only)"*. Both are true, and the vault records only the second — filed in `not_reachable` beside permanent deletion, which is bounded by something else entirely.
- **`not_reachable` is therefore doing two jobs and admitting to one.** Permanent deletion is out of reach because Google's scope text says `gmail.modify` *"does not allow immediate, permanent deletion of threads and messages, bypassing the trash"* and `mail.google.com` was never requested — a ceiling the deployer consented to and can revoke. Attachment content is out of reach because a vendor chose not to ship a tool, which the vendor can reship on any Tuesday with no new consent and no change to the screen the deployer saw. A reader who sees both under one heading has been told something we cannot support. That is rule 8.
- **Audiences exist in the app but as a signpost, not a structure.** *Who are you?* offers five cards on Start here, each jumping to an existing view. The memo wants the audience to be the organising spine of the left navigation, with the executive view authored rather than filtered.

## 3. The structure this asks for

### 3.1 Four storeys, and the gap between the first two

| Storey | What it is | Who decides it | In this shape |
|---|---|---|---|
| **Permitted** | what the credential authorises, whatever anyone chooses to build on it | the deployer, at the consent screen | the three Gmail scopes, and every Gmail API method they unlock |
| **Exposed** | the tools the client actually offers the model | the vendor, per release, as code | today's grant rows and their `via` |
| **Practised** | what happens in ordinary use, with approvals and the model's own refusals in the way | the deployer's settings, and the vendor's guardrails | the approval prompt, *Always allow*, an org owner's switch |
| **Consequences** | what follows when the above meets what is actually in the deployment | nobody decides; it falls out | the eleven, and the routes out |

**The gap between *permitted* and *exposed* is latent capability:** authorised, not currently offered, and held back by nothing the deployer controls. Attachment content is the worked example. Per the ruling in §5, it is **not** a grant row — the grant is what the agent can do after the blocks — but it is not *not reachable* either. It is permitted and blocked, and the record has to say by whom.

**This is the honest answer to "are people aware?"** — the deployer consented to a ceiling and was shown a product. The distance between the two is invisible today, on every connector, everywhere.

### 3.2 The barrier gains a holder, and that is the sharp end

Our enforcer test is *a control bounds a grant only if it is enforced by something the grant does not include.* The vendor's non-exposure passes it: the agent cannot edit Anthropic's connector. So it is a boundary — and treating it as one, without more, is what makes the model naive. What differs is **who holds the barrier, and whether it can move without the deployer knowing:**

- **held by the deployer** — revoke the scope, untick the consent line, turn the connector off. Moves only when they move it.
- **held by a vendor, against a consent the deployer gave** — the scope ceiling. Moves only if the deployer re-consents, and they see the screen.
- **held by a vendor, as a product decision** — the tool surface. Moves in a release. No consent, no screen, no notice.

So every barrier gets `held_by` and `moves_without_you`. That is one property, it is derivable from where the evidence came from, and it turns *"hope-based security"* from a remark into a column. It is also the business case the memo asks for: a control you can point at is worth buying; a control somebody else can withdraw on a Tuesday is worth knowing about.

### 3.3 The vault opens on the audience

Three, and the left navigation leads with them, each expanding to its own pages:

- **Executive** — one line, one diagram, three paragraphs. What this agent can do, what was authorised, what nobody bounded, and what would have to be true for that to be acceptable. No capability ids on the first screen. Authored prose, not a filter over tables.
- **Operator** — the person who runs this agent and can change a setting. The grant with its storeys, the settings that move a barrier, how to give the files to the agent, how to correct the mandate.
- **Risk** — the delta, the consequences with the standards they touch, the licence to operate and its conditions, what is unbounded and who holds each barrier.

Then, below and still present: the record (the ABP, evidence, the gap, what follows), what you hold (licence, keys, history, download), and how to use it. The memo is explicit that the paid material stays and simply stops being the first thing.

**On the name.** Recommendation: **Operator**, not Technical. The vault's own instrument is a **Licence to Operate**, which names an accountable owner and authorises an agent to *operate*. *Operator* is already the word this product uses for the person the licence is about, and it names a responsibility rather than a skill level — a non-technical person can be the operator of an agent, and they are exactly who needs the view. *Technical* would also wrongly imply that Risk and Executive readers get a non-technical version of the same facts, when what changes is the ordering and the language, never the facts.

## 4. What to build, in order

1. **Storey one for this shape.** `data/permitted.json`: the scopes the consent granted, and per scope the Gmail API methods they unlock, quoted and dated from Google. Each grant row gains `permitted_by` (the scope) and each permitted-but-unexposed capability becomes a row with `exposed: false`. **Half a day.**
2. ~~**`held_by` and `moves_without_you` on every barrier**~~ — **done, 17 September**, and wider than proposed: seven properties rather than two, `not_reachable` replaced by the blocked list in all sixteen vaults, and the build refusing a record that grades what it describes. See §6.
3. **The audience spine in the reading app.** The three sections as the top of the left navigation with sub-pages, the executive view authored, everything current demoted but kept. **A day and a half.**
4. **The storeys, drawn.** One diagram, in the executive view and on the site: four bands, the rows sitting in each, the latent gap shaded. This is the *"good way to visualise"* the memo asks for, and it is the picture that answers *"are people aware?"* in one look. **Half a day.**
5. **Say it once on the site**, on the ABP model page: the grant has storeys, and here is what that means for anyone who has ever ticked an OAuth consent screen. **Two hours.**

## 5. What needs the lead

1. **Settled, 16 September.** The lead's ruling: *"Grant is everything that agent can do (after blocks), not just what it is given to it via OAuth."* So the grant keeps its meaning and its place — storey two, the effective reach once every block is applied — and each row carries which scope permits it. A capability the credential permits and a block withholds is **not** a grant row; it is recorded as *permitted and blocked*, with the block named. `not_reachable` therefore becomes **the blocked list**, and each entry says what blocks it, who holds that block, and what would remove it. Attachment content is the worked example: permitted by `gmail.readonly`, blocked by the connector's tool surface, which Anthropic holds.
2. **Audience names.** Executive · Operator · Risk, per §3.3. Say if you want Technical instead.
   *(Still open. The spine is not built; the names are.)*
3. **Do we ask Anthropic and Google anything?** Both gaps are readable from published pages, so nothing here needs testing. But *"it'd be interesting to see if Anthropic even has access to it in its scripts"* is only answerable by them. Recommendation: publish the contradiction unresolved, as we do, and do not ask.
4. **How far does the case study go?** The memo says we can change whatever we want on this vault. Recommendation: yes for structure, data and the app — and the fifteen other vaults stay on the current shape until this one has settled, exactly as we did for the reading app.

---

## 6. Built, 17 September: the seven answers

The lead's instruction was *"yes build it"*, with one clarification and one question. Both changed
what got built.

**The clarification.** *"The judgment that we provide is the delta, which is the difference between
what the user is expecting the agent to do (mandate) and what it can actually do."* That is the
whole reason a barrier gets facts and never a grade. The ABP already carries exactly one judgment,
and it is derived rather than given: the delta. Adding a second — *this control is strong* — would
be a judgment we author, about somebody else's product, in a document whose one rule is that it
describes and does not judge. It would also be wrong on its own terms: how much a barrier is worth
depends on the deployment it is in, which is the same argument that keeps a score off the policy.

So: **seven properties on every barrier and every block, each a fact with a source, none of them a
rating.** Who holds it · what it is made of · can it move without you · would you be told · can you
check it is still there · what would take it away · if it went, what is behind it. The build refuses
a holder record that grades the thing it describes: *strong*, *weak*, *credible*, *robust*,
*adequate*, *effective*, *reliable* and their negatives fail the build, in data as in prose.

**The question.** *"Have you read this document [nhi.sgit.ai/hope](https://nhi.sgit.ai/hope/index.html)
where I talk about the Hope as Strategy?"* Not until it was asked; read 2026-09-17. It names the
thing this work had been circling without a word for it. Its argument, in its own terms: the honest
description of an agent deployment today is *hand over a broad credential, and hope*; every broad
credential carries two hopes that fail differently — the **behaviour hope** (the agent will not
misuse what it holds) and the **discovery hope** (the agent will not find access beyond what was
intended); and the real authorisation is *the union of everything reachable from what it was given —
the transitive closure of the grant — not the words used when granting*.

That lands on this brief in three places.

1. **The lead's grant ruling and the closure are the same sentence.** *Everything the agent can do
   after the blocks* is the transitive closure, with the blocks subtracted. Our four barrier kinds
   already separate a bound that is enforced from one that is asked; what was missing is that a
   bound nobody holds, or one held by a party who can withdraw it in a release, is a hope wearing a
   boundary's clothes. The seven answers are how a reader tells those apart without being told which
   to trust.
2. **The blocked list is the discovery hope, made specific.** Attachment content is not a boundary
   and it is not out of reach: it is a capability the credential authorises and a client does not
   offer. Filed under *not reachable*, it reads as assurance. Filed as *permitted, blocked by a
   vendor's product decision, moves without you: yes, would you be told: no*, it reads as what it is.
3. **The asymmetry is the finding.** On this shape, every block held by the deployer or by a
   credential ceiling moves only with a screen in front of it. The one block held as a product
   decision moves in a release with no screen at all — and it is the one holding back a capability
   the consent screen already granted. That is a hope with a date on it, and the record now says so.

What the ABP does not do, and the hope document is right about: none of this removes the hope. It
names it, which is the step before it can be measured, bounded or replaced. The rung above this one
is the Insurability Index, where a barrier's holder is exactly the kind of fact an underwriter asks
for and nobody currently has to answer.

### What shipped

- `data/barrier-holders.json` — six holder classes and the seven questions, travelling with every
  vault, pinned like the vocabulary and offered to the model site as an extension rather than
  invented into it.
- `not_reachable` is gone. Every vault now carries **`blocked`**, and the build refuses an entry
  that does not name its blocker — all sixteen migrated, thirty-four entries.
- The seven answers authored for the MVP vault: four blocks and the four barriers that are not
  *none*. A row whose barrier is `none` may not carry a holder: nothing is in the way, so nobody
  holds it.
- Rendered in `GRANT.md` (two new sections), `AGENT-BEHAVIOUR-POLICY.md`, the licence-to-operate
  conditions table (a condition now names who holds the thing enforcing it), the reading app as a
  **What holds** view, and the vault pages on the site.
- `tests/site/test_vault_app.mjs` — the reading app is booted against a real vault in a fake DOM and
  every view is built. Two renderer bugs shipped from that file before this existed.

### Still open after this

Storey one — `data/permitted.json`, the scopes and the methods they unlock, quoted from Google, with
`permitted_by` on each grant row — is not built. The blocked list names the blocker but does not yet
name the permission behind it in machine-readable form; it is prose in `credential_would_still_allow`.
The audience spine and the storeys diagram (§4 items 3 and 4) are also still to come.
