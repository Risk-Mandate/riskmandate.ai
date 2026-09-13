<!-- Generated from questions.html by scripts/site/generate.mjs. Edit the page, not this file. -->

# RiskMandate — questions we were asked

Real questions put to us in public, answered here with a date and without naming the asker. Where the answer is that we do not do the thing, that is the first line rather than a caveat at the bottom.

Source: https://riskmandate.ai/questions.html

---

# The questions people actually ask, including the awkward ones.

This is not a list of questions we wish we were asked. Every entry below was put to us by somebody outside this company, in public, and is reproduced here as the question rather than as a prompt for a pitch. Several of the answers are partly _no_, and those are the ones worth reading.

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

## Real questions, no names.

An FAQ is a list of questions somebody wished they had been asked. This is the other thing: questions put to us by people outside this company, in public, reproduced as they were meant rather than as a prompt for a pitch.

- **We never name the asker.** Every question here is paraphrased and dated, and the person who asked it is not identified. They asked in a conversation, not for a marketing page, and the answer is useful without the name attached.
- **If the answer is that we do not do the thing, that is the first line.** Not a caveat at the bottom, not a redirect to something adjacent that we do. Both answers currently on this page contain a _no_, and in both cases it is in a red panel near the top.
- **Every answer points at where it can be checked.** The reasoning lives in [the Lab](lab.html), with sources and dates; this page gives the direct answer and the link. Where a claim is ours rather than a citation, it says so.
- **An answer that outgrows a section gets its own page**, and this one keeps the summary and the link. Nothing is duplicated, and nothing is quietly rewritten — if an answer changes because we were wrong, the change is noted with its date.

## Both answers so far contain a no.

Neither question had a comfortable answer available, and giving the comfortable one would have been found out in the next message. If you have a question of the same kind, it is worth more to us than a good review — and it will end up on this page, without your name on it.
