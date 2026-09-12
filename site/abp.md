<!-- Generated from abp.html by scripts/site/generate.mjs. Edit the page, not this file. -->

# RiskMandate — the Agent Behaviour Policy

An Agent Behaviour Policy is a written description, for one agent in one deployment, of everything it can do, what you authorised it to do, the gap between them, and what actually stands in the way. It describes and it does not judge, so it carries no score.

Source: https://riskmandate.ai/abp.html

---

# You know what you asked for. You do not know what it can do.

An **Agent Behaviour Policy** is a written description, for one agent in one deployment, of everything it can do, what you authorised it to do, the gap between the two, and what actually stands in the way. It is derived from your deployment rather than copied from a template. It describes and it does not judge, so it carries no score.

## Four objects. The order they are produced in matters.

A behaviour policy is not a single list. The mandate is cheap, because you already know it. The grant is the work. The delta falls out of the two and is never written by hand.

| Object | What it is | How it is obtained |
| --- | --- | --- |
| The mandate | What the agent is authorised and expected to do | **Elicited.** In minutes, because you already know it |
| The grant | Everything the agent can do | **Measured.** From the deployment shape, the account and the credentials |
| The delta | Excess where it can and you did not ask; shortfall where you asked and it cannot | **Derived.** Recomputed whenever the grant or the mandate moves, stored with the versions of both, never edited |
| The barrier | What stands between the agent and each capability | **Recorded** per capability, from one of four kinds |

“Your agent can do 340 things.”

A shrug. Nobody acts on an inventory, and the length of the list looks like a maintenance problem rather than a finding.

“Your agent can do 340 things and you authorised 12.”

The mandate is the edge that gives the enumeration a shape. It is the cheapest object to capture and the one that makes the other three mean something.

## Only one kind of thing is actually in the way.

For every capability in the grant, a behaviour policy records what stands between the agent and it. There are four kinds, and three of them bound nothing. That is not an opinion — it follows from what each one is.

|  | Barrier | What stands in the way | Is it a control |
| --- | --- | --- | --- |
| ● | none | nothing in the way | no |
| ◉ | expectation | a rule in prose, enforced by nobody | no |
| ◐ | setting | a switch the agent's own account can flip | no |
| ○ | boundary | enforced above the grant, out of the agent's reach | yes |

A control bounds a grant only if it is enforced by something the grant does not include.

Read the third and fourth rows together and the test falls out of them. A setting the agent's own account could change is not a control, because the grant includes the ability to remove the bound. A boundary enforced above it, that it cannot reach, is a control — because it does not.

Every prohibition we render carries its barrier. One shown without it is a claim we cannot support, and it manufactures assurance. For most deployments today the honest answer is the second row. · [The barrier, in full](https://abp.sgit.ai/model/barriers/) · [as JSON](https://abp.sgit.ai/data/barriers.json)

## One setting. Two documents.

The clearest way to see what a behaviour policy does is to change one setting and watch the document change. A coding agent on a developer's own machine, profiled twice — once with confirmation prompts enabled, once with them disabled. Same product, same machine, same account.

|  | Confirmations on | Confirmations off |
| --- | --- | --- |
| Grant | 16 | 16 |
| Mandate | 5 | 5 |
| Excess | 12 | 12 |
| Unbounded excess | 12 | 12 |
| Barrier on `execute.process.host` | setting — not a control | none — not a control |

One barrier moved, and not one number did.

The confirmation prompt was the only thing standing between an authorised capability and the whole of the machine — and it was a switch the agent's own account could flip, which is the third row and not the fourth. A behaviour policy is about the deployment, not about the product.

Both documents are derived from published data rather than authored, and each states which of its rows were measured. · [confirmations on](https://abp.sgit.ai/examples/claude-code-cli-confirmations-enabled/) · [confirmations off](https://abp.sgit.ai/examples/claude-code-cli-confirmations-disabled/) · [all five examples](https://abp.sgit.ai/examples/)

## It describes. It does not judge.

The same behaviour policy is dangerous in one deployment and harmless in another, and nothing about the document changed. The most permissive grant imaginable, running where there are no assets and nothing reachable, is a low risk. The same grant with a production database attached tomorrow is a high one.

A policy cannot be dangerous. A deployment can.

So there is no rating on a behaviour policy, no traffic light and no risk level — not on this page, not in the data. Risk is a function of the policy, the assets, the consequences and the date, and the policy is the one input that does not move.

- **The Insurability Index scores the deployment, never the behaviour policy.** The Index knows the assets, so it can score; the policy does not, so it cannot. That is not a product preference — it is where the information is.
- **Every behaviour policy carries a validity statement.** _This describes the deployment shape as at this date. If the risk changed, the deployment changed — not this document._
- **A document with a visible clock can be re-sold. A verdict cannot.** A description of a grant rots on a known clock: the product's releases and the deployment's changes. A verdict rots on an unknown one.
- **We call it the ABP or the behaviour policy, never “the policy”.** In our own [Licence to Operate](demo-licence-to-operate.html) demonstration, _policy_ is the insurance instrument. Two different things cannot share one word on a site that publishes both.

## The label, the record, and the prescription.

A label describes a substance and never says _this is safe for you_. A patient record supplies the context. A prescribing decision combines the two, and a named professional signs it and carries the responsibility. Three things, and only the third can hold a number.

### The behaviour policy

What the agent can do, what you authorised, the gap, and what is in the way. Context-free, so it is the same document wherever the agent runs.

### The twin

A read-only model of the environment the agent is actually in: the assets, the tools, the data, what is connected to what. This is where the grant stops being a deployment shape and becomes yours.

### The Index, and the acceptance

The two combined, dated, with a named owner and an expiry — so the decision comes back. This is what RiskMandate is, and it is the only rung with a score on it.

The people who sell do not sign, which is why the label and the prescription are separate products rather than two sections of one.

## The business case for a control, with no verdict in it.

Unbounded excess is the only number on a behaviour policy that anybody can move. Every real control shifts one capability out of the agent's reach and into the fourth row, and the number falls.

- **The gap between excess and unbounded excess is the business case** — computed, sourced, and containing no claim about whether anything is acceptable.
- **It is checkable, clause by clause.** _This provision requires X. The agent's current grant does not bound X. A control of type Y, enforced at layer Z, would bound X._ Each of those three can be checked against the provision, the grant and the control.
- **It is not a compliance assessment** and it never concludes that you are compliant. It names the provision, the gap and the remedy, and stops.
- **Most prohibitions today sit in the second row** — a rule somebody wrote down, enforced by nobody. Moving one to the fourth row is a real change, and it is countable.

If you sell a control and want the count for your product against the five published deployment shapes, [that is what the partner conversation is](partners.html).

## Start with a draft. Then correct it.

You do not need to give us access to anything. A draft behaviour policy is derived from a deployment shape — which agent, running where, with which class of credentials — and handed to you. Correcting it is how you state your mandate, and the correction is usually upward.
