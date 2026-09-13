<!-- Generated from questions.html by scripts/site/generate.mjs. Edit the page, not this file. -->

# RiskMandate — questions we were asked

Real questions put to us in public, answered here with a date and without naming the asker. Where the answer is that we do not do the thing, that is the first line rather than a caveat at the bottom.

Source: https://riskmandate.ai/questions.html

---

# The questions people actually ask, including the awkward ones.

Most of these were put to us by somebody outside this company, in public, and are reproduced as the question rather than as a prompt for a pitch. Two were not asked at all — one because everything else here assumes it, one because we expect it and would rather answer before we are pitching. Every entry says which it is. Several of the answers are partly _no_, and those are the ones worth reading.

## Grant, mandate, delta — and why the verbs matter more.

### What do you actually mean by grant, mandate, delta and barrier?

Nobody put this one to us, which is why it is first. The four words look self-explanatory and three of them mean something narrower than they sound — and the rest of this page, and most of the Lab, is unreadable if they are taken at face value.

Four objects, and the verb attached to each one is the whole model.

The mandate is _elicited_, the grant is _measured_, the delta is _derived_, the barrier is _recorded_. Nothing in a behaviour policy is authored except the mandate — which is also the only one of the four you already know.

#### The four objects

**Why the mandate is the cheap half and still the important one.** “Your agent can do 340 things” is a shrug — an inventory nobody acts on. “Your agent can do 340 things and you authorised 12” is a finding. The mandate is the edge that gives the enumeration a shape, and it takes minutes because it is the one thing you already have in your head and nowhere else.

#### The four barriers, and the test that separates them

|  | Barrier | What stands in the way | Is it a control |
| --- | --- | --- | --- |
| **●** | none | Nothing in the way | no |
| **◉** | expectation | A rule in prose, enforced by nobody | no |
| **◐** | setting | A switch the agent's own account can flip | no |
| **○** | boundary | Enforced above the grant, out of the agent's reach | **yes** |

A control bounds a grant only if it is enforced by something the grant does not include.

Read the third and fourth rows together and the test falls out of them. A setting the agent's own account could change is not a control, because the grant includes the ability to remove the bound. A boundary it cannot reach is one, because it does not. For most deployments today the honest answer is the second row.

#### The rest of the vocabulary

| Word | What it means here |
| --- | --- |
| capability | The unit of a row, written as `verb.object.reach` — for example `read.record.mailbox`. **Reach** is how far it goes: project, host, tenant, world, self. What it does _not_ say is _whose_ material it touches, which is a gap we have asked the model site to close |
| authorisation closure | **The union of everything reachable, not the nominal grant.** The two diverge whenever a capability has more than one route to it, which is most of the time — and that divergence is the reason the document is worth anything. See [Q01](#q1) |
| deployment shape | A configuration somebody actually runs — which assistant, on which surface, with which connectors. Not the product, and not the model. The same product in two shapes produces two different documents |
| excess · shortfall | The two halves of the delta. Excess is the one people expect. Shortfall — you asked for something it cannot do — is the one that turns up in practice and never appears in a security review |
| twin | The agent's permissions, capabilities and track record over time. The behaviour policy is context-free; the twin is what supplies the context, and it is what reassessment watches |
| acceptance | A real risk cannot be denied, only accepted — **in a direction, by a named owner, for an interval**. So an acceptance expires rather than persisting silently, and naming the interval is the decision |
| enforcer test | The sentence in the green panel above. It is the only thing separating barrier three from barrier four, and it is doing almost all of the work in this model |

#### And four words we deliberately do not use

There is no rating on a behaviour policy, no traffic light, no risk level — not on the page and not in the data. **A policy cannot be dangerous; a deployment can.** The same grant is a low risk where nothing is reachable and a high one with a production database attached tomorrow, and nothing about the document changed. Scoring needs the assets, and the document does not have them

Always _the ABP_ or _the behaviour policy_. In our own [Licence to Operate](demo-licence-to-operate.html) demonstration, _policy_ is the insurance instrument. **Two different things cannot share one word on a site that publishes both**

Not used of any data we collect until three things exist: the banding, the suppression, and a written motivated-intruder assessment. Two are specified and one is not written, so **the honest word today is _banded_** — see [Lab 04](lab-shape-collector.html)

The value is a closed, controlled vocabulary, not the formalism around it. We are building a schema for a deployed configuration because **no existing standard describes one**, and we are not going to dress it up as more than that

The four objects, the four barriers and the enforcer test are published in full on [the model page](abp.html) and at [abp.sgit.ai](https://abp.sgit.ai/), with the barrier data as JSON. Authorisation closure, the moment of authorisation and the acceptance lifecycle are entities in [RAMM's agentic overlay](ramm.html). The `material` property that would answer _whose_ is a request we have made rather than something that exists — [Lab 03](lab-abp-requests.html).

## What happens when one authority path is revoked and another survives?

### How does the graph handle a revoked relationship when another legitimate authority path survives — and how does that result reach enforcement before the action commits?

Paraphrased from a public comment. The asker's point was that a grant and a mandate need to stay connected _without the task expanding the permission_, and that the interesting case is the one where revoking a relationship leaves another route intact.

We do not model revocation as removing an edge. The recorded object is the _authorisation closure_ — the union of everything reachable, not the nominal grant.

So revoking one relationship while another legitimate path survives produces exactly the result the question is probing for: the nominal grant shrinks and the closure does not move. That non-movement is the finding, and it is what gets recorded.

Nothing we produce intervenes before the action commits.

RiskMandate produces the record, not the decision point. What intervenes before an action commits is a boundary somebody else operates — a token scope, a branch rule, an egress proxy, a kernel firewall. Our contribution is the document that says which one is in place, computed rather than asserted, and printed next to every line it applies to.

#### Why closure rather than the nominal grant

A nominal grant is what somebody thinks they authorised. A closure is what is reachable. The two diverge whenever a capability has more than one route to it, which is most of the time — and the divergence is the entire reason the document is worth anything. [RAMM's agentic overlay](ramm.html) carries it as a named entity, defined as _the union of everything reachable, not the nominal grant — the real blast radius_.

#### A worked example, checkable in one command

The author on a git commit is a free text field. Git's own reference says of the author name that it **“has no effect on authentication”**, and a code host's file-contents endpoint accepts `author` and `committer` as parameters requiring only contents-write. Two independent authority paths reach the same capability.

|  | Revoke the keys and the git config | Revoke the contents-write token |
| --- | --- | --- |
| nominal grant | Shrinks — the local client can no longer commit as anybody | Shrinks |
| closure | **Unchanged.** The API path still sets any author it likes | **Unchanged.** The local client still does |
| what the row says | The capability is still present, the delta has not moved, and the barrier column still reads what it read before |

That is the behaviour the question is asking about, and it is deliberately unflattering: a revocation that looks like progress on a permissions dashboard produces no change at all in the record. If it did produce a change, the record would be measuring the wrong object.

#### What does reach enforcement before the action commits

In that same example, exactly one thing does: **a branch rule requiring signed commits**. In the host's own words, with it enabled, _“contributors and bots can only push commits that have been signed and verified to the branch”_ — a server-side check at push time, before the reference moves. The feature most people reach for instead marks the commit with a verification status _after_ it exists, which is a label rather than a refusal.

So the honest architecture is two layers with a clean split: **a boundary that somebody else operates and that acts before the commit**, and **a record that says which boundary that is, where it sits, and what would void it**. We build the second and refuse to imply we are the first.

#### The trap underneath the question

If policy layers combine by _union_, a revocation cannot bind at all, because a surviving allow re-widens it. That is not hypothetical — a widely used orchestrator documents its network policies as _“additive”_ with the result being _“the union of what the applicable policies allow”_ and no denial primitive at all. The semantics that work are the ones a large cloud provider uses for permissions boundaries: **intersection, with an explicit denial terminal at every layer, and a child policy that can only narrow its parent**.

Revoking a path is only meaningful in a system that composes by intersection.

In a system that composes by union, revocation is a gesture. That is a behavioural difference rather than a vocabulary one, and it can be tested in an afternoon.

Sources and the full working: [Lab 05 — the commit author is a free text field](lab-commit-author.html) for the two authority paths and the signed-commits rule, and [Lab 06 — every routable address is in the grant](lab-network-reach.html) for the composition rules and the union/intersection precedents. Every quotation on both pages was fetched and checked against its source on 12 September 2026.

## Once everyone shares the vocabulary, what is actually enforced?

### Once the language converges around mandates, grants, evidence, risk and runtime standing, the differentiator can no longer be vocabulary. What is actually enforced, where is the boundary, what changes at runtime, what evidence is preserved, and what happens when the state changes after the original grant?

Paraphrased from a public comment, which closed with the right test: _if two architectures use different terms but produce the same behaviour under the same stress case, the distinction is linguistic. If the behaviour diverges under pressure, that is where a real architectural distinction may begin._

Agreed, and the premise is not conceded reluctantly — vocabulary stops being a differentiator the moment it is adopted, which is the outcome we want.

Below are direct answers to all five, and then the test run as stated: three stress cases where the behaviour diverges rather than the terminology. Each one is cheap to run and one of them can be run against a repository this afternoon.

#### The five, answered

#### The test, run

Three stress cases. In each, a system whose distinction is only vocabulary produces one behaviour and this one produces another — which is the bar the question sets, and it is the right bar.

| Stress case | If the distinction is only vocabulary | What happens here | Diverges |
| --- | --- | --- | --- |
| Revoke one authority path while another survives | The recorded permission shrinks and the document looks better. Progress on a dashboard | Closure is unchanged, the delta does not move, and the row says so in as many words | yes |
| Change the model router on a Tuesday afternoon | The badge is unchanged, because the vendor refusal layer still counts as a control | The pessimistic minimum drops, because a perishable barrier is not counted without its void condition printed beside it | yes |
| Add a policy layer | Additive union: adding a policy can only _widen_ the effective reach, and a revocation cannot bind | Intersection with a terminal explicit denial: a child can only narrow, and ambiguity narrows or halts rather than widening | yes |

The first of those is runnable against any repository with two authority paths to the same capability, which is most of them. If it does not diverge, the distinction really was linguistic and we would rather find that out in public.

#### The part that is a no

**None of the above intervenes before the action commits.** What acts in the path is a boundary somebody else operates. We compute the record, we say which boundary is in place, where it sits relative to the deployer, and what would void it — and we are explicit that a document is not a policy decision point. That is a smaller claim than the market makes, and it is the one that survives being checked.

Full working, with every quotation fetched and checked against its source on 12 September 2026: [Lab 05](lab-commit-author.html) for the enforcement column and the eight-line prompt; [Lab 06](lab-network-reach.html) for the egress-path matrix, the perishable-barrier fields, the evidence table and the six composition rules; [the model](abp.html) for the four barriers and the enforcer test; and [RAMM](ramm.html) for authorisation closure, the moment of authorisation and the acceptance lifecycle.

## How is this different from an inventory?

### How is a behaviour policy different from an agent registry, a CMDB, or an AI bill of materials — and if I already run one of those, what does this add?

Nobody has put this to us yet. It is on the page because it is the first objection anybody with a working asset register will have, and we would rather have written the answer down before we are in a room trying to sell something.

Different unit, different verb. An inventory records assets that somebody asserted. A behaviour policy records capabilities that were measured, and the gap between them and what you intended.

That gap is not an asset, so it is not in any inventory — it is a relationship between what a credential permits and what somebody meant, and the second half of that has usually never been written down anywhere.

If you already run a good inventory, we would rather read from it than replace it.

The estate half of a destination list should be generated from an existing inventory rather than typed, and we have no ambition to be your asset register. We also do not discover by telemetry — no extension, no endpoint agent, no network inspection. This finds what people will tell you, which is a different thing from what is on the network, and neither one is complete.

#### Side by side

|  | Agent registry · CMDB | AI bill of materials | Behaviour policy |
| --- | --- | --- | --- |
| The object it describes | What you have | What the model _is_ | What one deployment can _reach_ |
| Unit of a row | An asset | A model artefact | A capability — `verb.object.reach` |
| How a row gets there | Asserted, or discovered at a point in time | Declared by the producer | Derived, carrying a source, a date, and whether it was measured or derived |
| Does it say what bounds it | No | No | A required column on every row — and it often reads _nothing_ |
| When a scope changes | Nothing, until the next discovery run | Nothing — the artefact did not change | Recomputes, and says what moved |
| The question it answers | “How many agents do we have?” | “What is in this model?” | “What can this one reach that nobody intended?” |

#### Three specifics, and one of them is a genuine gap

**No existing standard describes a deployed configuration.** The machine-learning component bill of materials — standardised as an international specification in December 2025 — describes a model: its parameters, its task, its architecture family, its datasets, its inputs and outputs, its considerations. The other bill-of-materials family has an equivalent profile. **Neither says which assistant a person runs, on which surface, with which connectors granted which scopes.** So an AI bill of materials and a behaviour policy are not competitors; they describe different objects, and one of the two has no standard behind it yet. That finding is written up with its sources in [Lab 04](lab-shape-collector.html).

**Two agents with identical inventory rows can have completely different reach.** The clearest demonstration is one setting on one product. A coding agent on a developer's own machine, profiled twice — same product, same machine, same account — once with confirmation prompts on and once with them off:

|  | Confirmations on | Confirmations off |
| --- | --- | --- |
| grant | 16 | 16 |
| mandate | 5 | 5 |
| excess | 12 | 12 |
| unbounded excess | 12 | 12 |
| barrier on `execute.process.host` | **◐** setting — not a control | **●** none — not a control |

One barrier moved and not one number did. An inventory would hold a single row here, identical in both cases, because the asset did not change. **The confirmation prompt was the only thing between an authorised capability and the whole of the machine — and it was a switch the agent's own account could flip**, which is the third barrier and not the fourth. Both documents are derived from published data and each states which of its rows were measured.

**And an inventory goes stale silently.** A CMDB row is true until it is not, and nothing in it announces the moment it stopped being true. A delta is stored with the versions of both inputs pinned, so when a scope changes it does not merely become correct again — it can say _what moved_, and on what date. That is the same discipline as maturity being computed from evidence rather than asserted in a questionnaire, which is what [RAMM](ramm.html) is for.

An inventory that lists an agent without saying what it can reach has recorded the least interesting fact about it.

Which is not an argument against inventories. It is an argument that the row you want is not the kind of row an inventory holds — and that if you have one, it is an input to this rather than a competitor for it.

The bill-of-materials finding, the deployed-configuration gap and the discovery-market survey are in [Lab 04](lab-shape-collector.html), with sources read on 12 September 2026. The one-setting-two-documents example and the four barriers are on [the model page](abp.html), derived from published data at [abp.sgit.ai](https://abp.sgit.ai/). The rule that estate destinations should be generated from an inventory rather than typed is in [Lab 06](lab-network-reach.html).

## Real questions, no names.

An FAQ is a list of questions somebody wished they had been asked. This is the other thing: questions put to us by people outside this company, in public, reproduced as they were meant rather than as a prompt for a pitch.

- **We never name the asker.** Every question here is paraphrased and dated, and the person who asked it is not identified. They asked in a conversation, not for a marketing page, and the answer is useful without the name attached.
- **And every entry says whether it was actually asked.** Two of the four were not: the definitions, because everything else here leans on them, and the inventory comparison, because it is the first objection anybody with a working asset register will have and we would rather write the answer before we are in a room selling something. Both say so on their own line, because a page claiming to answer real questions has to be checkable on that claim.
- **If the answer is that we do not do the thing, that is the first line.** Not a caveat at the bottom, not a redirect to something adjacent that we do. Both answers currently on this page contain a _no_, and in both cases it is in a red panel near the top.
- **Every answer points at where it can be checked.** The reasoning lives in [the Lab](lab.html), with sources and dates; this page gives the direct answer and the link. Where a claim is ours rather than a citation, it says so.
- **An answer that outgrows a section gets its own page**, and this one keeps the summary and the link. Nothing is duplicated, and nothing is quietly rewritten — if an answer changes because we were wrong, the change is noted with its date.

## Three of the four say what we do not do.

None of them had a comfortable answer available, and giving the comfortable one would have been found out in the next message. If you have a question of the same kind, it is worth more to us than a good review — and it will end up on this page, without your name on it.
