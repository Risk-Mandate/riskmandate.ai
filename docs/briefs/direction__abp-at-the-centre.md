# Direction change — the Agent Behaviour Policy becomes the primitive

**Date:** 2026-09-11 · **Author:** @website-agent
**Trigger:** project lead's voice memo of 11 September
**Reads against:** `abp.sgit.ai` v0.2.0, `store.sgit.ai` v0.1.1, `risks.sgit.ai` v0.2.2
**Companion:** `summit__lisbon-2026-messaging.md` (what to say in Lisbon, six days out)
**Supersedes:** the positioning in `summit__lisbon-2026-strategy.md` §1–§3 and §5

---

## 1. What changed

The Agent Behaviour Policy is not a new product. It is **the primitive the rest of
RiskMandate was already made of**, now named, published, and — critically — **sellable
this week at ten pounds**.

Read the four objects on `abp.sgit.ai` against what riskmandate.ai already argues:

| ABP object | What riskmandate.ai already calls it |
|---|---|
| The mandate | the mandate — "what the holder is authorised and expected to do" |
| The grant | the grant — "what a credential technically permits" |
| The delta | excess authority — "the gap nobody accepted" |
| The barrier | the controls the plug profile asks about |

It is the same model. The site has been arguing the ABP's contents for months without
the artefact having a name. Now it has one, a published vocabulary (23 capability
primitives, four barriers, three undo classes), five worked examples derived rather
than authored, and a price.

**The full circle the memo describes is real and it closes here:** the grant is
computed from reality through the digital twins, the delta falls out of grant against
mandate, the prohibitions are the enforceable subset of the delta, the risk acceptance
workflow acts on what the prohibitions do not bound, and the insurability argument sits
on top because — per the ABP strategy brief — **the behaviour policy is the scoping
document the one agent-specific underwriter already asks for on its intake form.**

## 2. The stack, and where riskmandate.ai sits in it

The ABP estate's own structure, which the project lead has adopted:

| | The thing | What it does | Score? | Signed? |
|---|---|---|---|---|
| **Label** | the ABP | describes capability, context-free | **never** | no |
| **Patient record** | the twin, hooked to the real environment | supplies assets, tools, data, what is connected | n/a | no |
| **Prescription** | risk score + acceptance | combines the two, dated | **yes** | by a named professional |

**riskmandate.ai is the prescription layer, commercially.** `risks.sgit.ai` is the
conceptual and research home and says so — "riskmandate.ai, the commercial product this
research underpins". The site's job is unchanged: make the deployment insurable. What
changes is that **it now sits on a named, published, purchasable input** instead of
starting from an abstraction.

**This is the single most important thing to get right on the site, and it is the thing
we are most likely to get wrong.** The Insurability Index is a score. The ABP carries no
score, anywhere, by rule — because the same ABP is dangerous in one deployment and
harmless in another, and nothing about the document changed. So:

> **The Index scores the deployment. It never scores the ABP.** A page that puts a
> number, a traffic light or a level next to a behaviour policy breaks the rule that
> makes the ABP usable by an underwriter without argument.

Every page we write that mentions both must keep that line visible. It is not a
presentational nicety — a consequence-agnostic ABP is the one shape an insurer can take
without negotiating over it, which is the whole commercial reason to have one.

## 3. What this fixes about the site as it stands today

**There is nothing to buy.** `pricing.html` offers Community (free, open source),
Consumption (token-based) and Enterprise (custom, talk to us). None of those is a thing
a visitor can pay for, and the page's own closing line is "book a demo". Meanwhile
`store.sgit.ai` has four priced tiers with printed payment codes, starting at £10. **A
visitor to riskmandate.ai today cannot reach them.** That is the gap the memo names,
and closing it is the highest-value change on the site.

**The funnel dead-ends off-site.** The companion vault brief already flagged this for
Licence to Operate and the permission game. The ABP makes it worse and better at once:
worse because there is now a fourth off-site destination, better because the ABP is the
one that has a checkout behind it.

**Two claims on `pricing.html` need review under the estate's own disclosure rules.**
"NIST / ISO / EU AI Act alignment" is conformity-adjacent language, and the standing
rules are that nothing here is a compliance assessment, that the language of conformity
marking raises the standard of care for no buyer benefit, and that the international
management standards' text may not be adapted or shipped. The EU regulation is expressly
reusable and can stay. The other two want rewording or removal.

## 4. The naming rules, and they are not optional

Three of these are hazards the ABP briefs identify; the fourth is ours.

1. **Never "ADP".** It is one of the largest payroll processors in the world and a
   registered mark in every relevant class. Nothing with that string on it gets printed
   or published. The acronym is **ABP**, spelled out as **Agent Behaviour Policy** at
   first use on every surface.
2. **Never "the policy".** This site publishes the Licence to Operate demo, in which
   *policy* is the insurance instrument — normal band, per-action ceiling, premium per
   interval. A behaviour policy called "the policy" collides with it on the first page
   that mentions both, and this site is that page. It is **the ABP** or **the behaviour
   policy**, always. One extra word.
3. **Licence to Operate now has a referent.** The organisation is the authority, the
   ABP is the instrument, the agent is the licensee — self-issued and witnessed by us,
   which is how most assurance works. This is a *proposal for a ruling*, not a ruling,
   and it is the project lead's to make. It would make "mandate to operate" redundant,
   which resolves a collision open since 8 September.
4. **Behaviour or behavior.** Undecided, and it is due before anything is printed. An
   acronym does not care; a wordmark does. The site is written in British English
   throughout, which argues for *behaviour*, and the marks brief says the mark is the
   moat.

## 5. The site changes, in priority order

Sized against the one constraint that matters: **the event is Thursday 17 and Friday
18 September, six days out.**

| | Change | Why | Size |
|---|---|---|---|
| **P0** | `abp.html` — a real page for the Agent Behaviour Policy: the four objects, the barrier table, the one-setting-two-documents pair, and a link to the five worked examples on `abp.sgit.ai` | The booth conversation needs a URL on our own domain. Everything on it already exists and is published | half a day |
| **P0** | `pricing.html` → point at the four tiers and their codes | It is the only page where a visitor asks to pay, and today it answers "book a demo" | 2 hours |
| **P0** | Homepage: second panel becomes *the grant you did not enumerate*, with the ABP named and the £10 draft as the call to action | The current hero closes on the Index, which is the prescription. The entry point is now one rung below it | 2 hours |
| **P1** | `grant-gap.html` — name the artefact | The page already makes the whole argument and never says what the document is called | 1 hour |
| **P1** | The Index/ABP boundary, stated once, on both pages that carry it | The rule in §2. Cheaper to write now than to unpick later | 1 hour |
| **P1** | `demos.html` — add Licence to Operate's role in the ladder: prohibitions are the exclusions | Closes the funnel and explains the demo rather than just listing it | 2 hours |
| **P2** | `partners.html` — the control business case (see §6) | New motion, needs the copy written, does not block the event | half a day |
| **P2** | Reword the conformity-adjacent claims on `pricing.html` | Correctness, not urgency | 1 hour |

**What I would not do before the event:** rewrite the homepage thesis. "Make your
agents insurable" survives this change intact and is strengthened by it — the ABP
strategy brief's central finding is that the behaviour policy is the underwriting
artefact, which makes the insurability claim *more* defensible, not less. The change is
to the **entry point**, not to the argument.

## 6. The motion the memo adds that nothing else covers

> *"a number of companies, especially cybersecurity companies, we are basically making
> the business case why that company is so powerful. Because that company is
> fundamentally reducing, adding controls that reduce the risk."*

This is a real and unoccupied motion, and the ABP already computes it exactly.

The barrier model has four kinds and **only the fourth bounds anything**: nothing, an
expectation (a rule enforced by nobody), a setting (a switch the agent's own account can
flip), and a boundary (enforced above the grant, out of the agent's reach). The
**enforcer test** is that a control bounds a grant only if it is enforced by something
the grant does not include.

From which: **the gap between excess and unbounded excess is the business case for a
control, and it contains no verdict.** Every real control moves one capability into the
fourth row and the number falls. A security vendor can be handed a computed, sourced,
verdict-free statement of exactly how many capabilities their product moves out of an
agent's reach — for a named deployment shape, derived from published data.

That is a partner artefact nobody else can produce, it costs us nothing to compute, and
it is the strongest thing we can offer the vendors who will be exhibiting alongside us.
It is also *on-message*: we describe, they bound, and neither of us claims the other's
job.

## 7. What is honest to say, and what is not

| Say | Do not say |
|---|---|
| The ABP describes; it does not judge | anything that scores an ABP |
| The delta is derived, stored with its inputs, recomputed | "computed and never stored" — corrected on 11 Sept, in the open |
| This provision requires X; the grant does not bound X; a control of type Y at layer Z would bound X | "then you are in compliance" |
| Most deployments' barriers are the second kind — a rule enforced by nobody | a prohibition rendered without its barrier |
| The behaviour policy is on the intake form of the one agent-specific underwriter | that we are insured, insurable-certified, or that any insurer endorses us |
| The undo class is the product's published behaviour; the deployment can change it | that reversibility is context-free |

Every ABP carries a validity statement: *this describes the deployment shape as at this
date, and if the risk changed, the deployment changed, not this document.* We should
carry the same sentence wherever we render one.

## 8. Decisions I need

1. **Behaviour or behavior** — due before anything is printed (§4.4). My recommendation
   is *behaviour*, to match the site.
2. **Is the Licence to Operate ruling made?** (§4.3) If yes I will write it into the
   demos page and retire "mandate to operate". If not, I will keep both phrases off any
   page that mentions the other.
3. **Does `pricing.html` point at `store.sgit.ai`, or do we mirror the four tiers onto
   riskmandate.ai?** Pointing is a two-hour change and is honest about where the
   checkout lives. Mirroring is a day and risks the two disagreeing. I would point.
4. **Is `abp.html` ours to write, or do we link `abp.sgit.ai` and stop?** I would write
   it: the booth conversation ends on our domain, and a page that only forwards is a
   page that loses the visitor.
5. **Confirm the estate rule that riskmandate.ai is the prescription layer** (§2), so I
   can state it on the site rather than implying it.
