<!-- Generated from lab-abp-flow.html by scripts/site/generate.mjs. Edit the page, not this file. -->

# What buying a behaviour policy would look like — RiskMandate Lab 02

Twelve stages from a stranger's first question to a recomputing vault with a read key they can hand an underwriter, with five of them drawn as interface mockups. None of it is built yet.

Source: https://riskmandate.ai/lab-abp-flow.html

---

# From a stranger's first question to a key they can hand an underwriter.

Twelve stages. The first four need no account, no integration and no access to anybody's environment — they are five documents and a page. The rest is one engineering build, and it is the same build every time, which is the only reason any of this could be a business.

**This is a dated edition of a page that changes.** The Lab holds our current thinking, and current thinking moves. This PDF does not: it is what we thought on the date stamped below, kept so the reasoning can be followed rather than only its conclusion. The live page may since have been corrected, extended or withdrawn — and if it has, the edition list on it will say so.

# From a stranger's first question to a key they can hand an underwriter.

Twelve stages. The first four need no account, no integration and no access to anybody's environment — they are five documents and a page. The rest is one engineering build, and it is the same build every time, which is the only reason any of this could be a business.

## Twelve stages. Four of them are documents.

Stages one to four are the whole sales motion and they are shippable now. Stages six to ten are a single build — a template vault that gets cloned per customer — and that build is the product even though nothing on this site sells it.

|  | Stage | What happens | State |
| --- | --- | --- | --- |
| 1 | Encounter | A stranger reads the question and recognises themselves in it | ships now |
| 2 | Self-select | Which of these five shapes is yours | ships now |
| 3 | Draft | The pre-computed policy for that shape. Free, instant, no account | ships now |
| 4 | Correct | They tell us where it is wrong. The conversion and the elicitation are the same move | ships now |
| 5 | Purchase | On the store, against the tiers that already exist | rail exists |
| 6 | Provision | Clone the template vault, seed it with the corrected draft | needs the template |
| 7 | Elicit the mandate | The only part that genuinely needs a person, or a good enough question set | needs the questions |
| 8 | Measure the grant | From the shape, the credentials and the connectors actually enabled | needs the library |
| 9 | Compute | Delta, label, leaflet. All derived, none authored | needs the computation |
| 10 | Deliver | The vault, and a read key they can share with anybody | needs the template |
| 11 | Live | Recompute when an input moves. The history is the business case | needs a receiver |
| 12 | Uplift | The twin, the score, the standards mapping — signed by somebody who did not sell stages one to ten | later |

The first policy will be made by hand. If the second one costs the same, there is no business.

So the thing being built is not a document and not even a vault — it is the **template** plus the **shape library**. The marginal cost of a policy is the cost of its shape, and shapes are reused. The target is explicit: the second policy of a shape already in the library should take minutes, not days. If it does not, the library is not working and nothing should be priced yet.

## Encounter. The question, one example, the link.

A panel on this site's front page, in the place currently held by the Index. The sequence is: do you know what your agents can do → here is one → buy one. The question and the examples belong to the free library; the offer belongs here.

Do you know what your agent can actually do?

Not what it did — what it _can_. Pick the setup closest to yours and read the policy we already wrote for it. It is free, there is no account, and we need no access to anything of yours.

_**Why it changes.** The page currently closes on the Insurability Index, which is the prescription — three rungs above where a stranger can start. The Index does not go away; the long-term argument, mapping an organisation's whole risk, moves into a section rather than off the site. The front page sells the label. The section describes the estate the label is the first step into._

## Self-select. Five shapes, and one of them is yours.

Five, not fifty. Build the coding agent first because it is already in the published data and proves the method with no new research. Then the mailbox and the personal drive, which a stranger recognises. Then the work mailbox and the corporate file estate, which are the ones somebody buys.

Which of these is closest to yours?

Close is close enough. The draft is about a deployment _shape_, not about your estate — you will correct it in a minute, and the correcting is the useful part.

_**The honest bit.** “None of these” is a real option and it goes to a person, because a shape we have not built is days of work and pretending otherwise would waste everybody's time. The five that are ready say so; nothing here implies a sixth exists._

## The draft. Free, instant, and deliberately understated.

This is the screen everything else exists to reach. Four numbers, then the capability rows with what stands in the way and whose material each one touches, then the table no template can carry. Every row says where it came from.

An assistant connected to a personal mailbox

Derived from vendor documentation read on 12 September 2026, not from your account. **We have assumed a conservative mandate.** If the numbers below look wrong, they are — and telling us how is the next step.

| Capability |  | Barrier | Material | In the mandate |
| --- | --- | --- | --- | --- |
| read.message.tenant | ◉ | expectation — a rule in prose | mixed | yes |
| read.record.history | ● | none | mixed | no |
| send.message.world | ◐ | setting — you can flip it back | organisation | yes |
| read.credential.host | ● | none | third_party | no |
| send.endpoint.world | ● | none | mixed | no |
| create.record.world | ◉ | expectation — a rule in prose | mixed | no |
| read.record.browsing | ◐ | setting — you can flip it back | mixed | no |

**Five of seven capabilities are mixed or third_party.** That is not a setting you have wrong. There is no supported way to say _my inbox, except messages from outside the company_ — the unit of restriction is the connector, not the correspondence.

| Where the vendor's own pages disagree | Advertised | Granted |
| --- | --- | --- |
| label mutation | label and unlabel mail threads | no scope in the grant authorises it · unresolved |
| calendar writes | create, update and delete events | the granted scope list is read-only · unresolved |

Provenance7 of 7 capability rows **derived** from published documentation, 0 measured. Mandate assumed, not elicited. Delta computed from both, pinned to the versions shown. Valid for the deployment shape described, as at 12 September 2026 — _if the risk changed, the deployment changed, not this document._ No score appears anywhere in this document and none will.

_**Understated on purpose.** The assumed mandate is generous to the reader: it credits them with having authorised more than they probably did, so the correction goes _upward_. That is the moment somebody realises the grant is bigger than they thought — the same mechanic as the permission game, on a page instead of in a quiz. **And no score, anywhere.** Four counts, a barrier per row, and whose material it touches. The number a buyer can actually move is _unbounded_, and it only moves when a real control appears._

## Correct. The conversion and the elicitation are one move.

Nobody needs telling what they asked the agent to do — they need telling what it can do. So the draft asserts the mandate and asks to be corrected, and correcting it _is_ stating the mandate. This is the stage nobody has rehearsed and the one most likely to be wrong.

Which of these did you actually ask it to do?

We guessed two. Everything you add moves a row out of the excess and into the mandate — and everything you leave is authority nobody scoped.

_**Two things this must not do.** It must not tell anybody their setup is dangerous — a policy describes and does not judge, and the same grant is fine in one deployment and serious in another. And it must send nothing anywhere: this is a form about a deployment shape, not a probe of the reader's account, which is what makes it legal to run with a stranger in ninety seconds._

## Deliver. A key, not an attachment.

What is sold is a clone of a template vault, seeded with the customer's own corrected draft. Nothing in it is authored except the mandate — the only thing the customer knows and we do not. And the read key is the part that is worth more than it sounds.

Northgate Financial — assistant, work mailbox

Recomputes when an input moves. Every version is kept, and the history is the part an underwriter will want.

- mandate.jsonelicited from you — the only authored file
- grant.jsonmeasured · 4 of 11 rows, 7 derived
- delta.jsonderived · inputs pinned
- label.mdcomputed
- leaflet.mdcomputed
- history/3 recomputes since 12 Sept
- validity.mdas at 12 September 2026

Hand that to a customer asking how you govern your agents, to an auditor, or to an underwriter. They get a live, versioned, recomputing document — **not a PDF that went stale the day you sent it**. They cannot write to it, and you can stop sharing it.

_**Why the key is the feature.** The one insurer underwriting agents by name asks for a scoping statement: capabilities, autonomy, data access, callable tools. A read key to a live recomputing vault answers that better than a document, and nobody else can offer it. **The open question** is whether a read key can be revoked — the whole proof story depends on it, and we have not checked._

## Instrument the first five, and publish the table.

Time each one. Count how many rows were derived rather than measured, how many questions had to go to a human, and which stage was slowest. That table is the only pricing input anybody will have, and publishing it is the same discipline as everything else here.

- **Build five first** — the coding agent — because it is already in the published data and proves the method with no new research.
- **Then one and three**, the personal mailbox and the personal drive, because a stranger recognises them.
- **Then two and four**, the work mailbox and the corporate file estate, because those are the ones somebody buys.
- **Every one is derived, not measured.** The rows come from vendor documentation read on a date, not from observation — and the provenance line says so, in the same place the published capability map says 21 of 99 rows were measured.

## The journey, kept as files.

This page holds current thinking, and it will change. Each edition below is a dated, immutable copy of what it said on the day, with its own digest. Nothing is rewritten; the list only grows.

Digests for every edition are in [lab-editions.json](lab-editions.json), so a PDF somebody was sent can be checked against this list.

## Tell us which screen is wrong.

These are drawings. Changing them costs an afternoon now and a rewrite later, so this is the cheapest moment this flow will ever be. Stage four is the one we are least sure of.
