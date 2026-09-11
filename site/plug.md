<!-- Generated from plug.html by scripts/site/generate.mjs. Edit the page, not this file. -->

# RiskMandate — Who can pull the plug?

Every board asks it in a sentence: if this agent starts doing something no one intended, who stops it, how fast, and what does stopping it cost? The plug profile is the mandate read backwards — who, blast radius, speed, side effects, and the one dimension money cannot buy back: recoverability.

Source: https://riskmandate.ai/plug.html

---

# Who can pull the plug?

It gets asked in one sentence. Most teams cannot answer it for a single agent — not because the plug doesn't exist, but because nobody has ever stated its profile. Who can stop this thing, how fast, what breaks when they do, and how much of it can never be undone.

## The plug always exists. Its profile doesn't.

Every agent can be stopped — a key revoked, a token pulled, a service scaled to zero. That's not the gap. The gap is that when someone asks what stopping it actually involves, the honest answer today is a pause and a promise to find out.

“Who can stop it?”

Usually a team, not a person — and rarely one with both the authority and the access. The two live in different systems and nobody has joined them up.

“How long would it take?”

Measured from the decision, not from detection. The answer depends on how many places the agent's capability was conferred, which is exactly what nobody has enumerated.

“What breaks if we do?”

In-flight work, downstream consumers, half-finished transactions. Stopping an agent is itself a change with a blast radius.

“What can't we undo?”

The question almost nobody asks, and the only one where the answer is permanent. See recoverability.

## Five dimensions. One owner. An expiry date.

Every field below is derived from the graph and carries its evidence — not a workshop opinion, not a colour on a heat map. When it's signed, it becomes an acceptance with a named owner and a date it runs out.

### Computed, not asserted

Each dimension is derived from what the graph knows about conferred capability, reachable assets, and observed behaviour. If we can't compute it, we say so rather than scoring it.

### Recoverability decides

The dimension money cannot buy back. It separates a catastrophic-but-reversible risk from a smaller permanent one — and it usually reverses the priority order.

### An acceptance, not a record

A named owner, stated conditions, an expiry. Filing the risk is not the outcome; someone underwriting it for a bounded period is.

### Every agent, not the interesting ones

A profile that exists only for the agents someone already worried about tells you nothing about the ones nobody did.

### AP-Agent-07 · invoice approval

## Speed is a race. And most plugs are blunt.

Speed is not a duration, it is a race — how fast the plug can be pulled against how fast the harm spreads. Both sides need a number, because a four-minute pull is excellent against a threat that compounds hourly and useless against one that compounds by the second.

There is also a floor underneath detection. If cost is your signal, most hyperscalers report spend **12–18 hours in arrears** — so a cost-triggered response cannot start sooner than that, whatever the runbook says. And when the damage outruns the pull, speed has stopped mattering and only recoverability is left.

The off-switch for one agent is often the power switch for the whole website. Revoking a shared service account stops the misbehaving agent and eleven well-behaved ones with it, which is why teams hesitate at exactly the moment they should not.

**The absence of a precise plug is itself a finding** — not a footnote about tooling. A stop you are unwilling to use in practice is not a control you can count on.

## “How long will you accept this?” has a second half.

Our doctrine is that every risk is already accepted the moment an agent runs — the only real question is for how long. Recoverability is what makes that question bite: _and how much of it can we undo if we're wrong?_

A wrong write that can be replayed. A queue that can be drained. A permission that can be re-granted. Expensive, embarrassing, survivable — and the interval can be longer.

A payment that cleared. A message that reached a customer. Data that left the boundary. A deletion past its retention window. No budget, no escalation and no incident review buys these back.

## None of this requires us to sit in the request path.

Authorisation already happened — it was conferred the moment capability was, and what an agent can actually do is the union of every route to that capability. So the profile is derived by modelling what exists, not by intercepting anything: read-only twins instead of integrations, and no enforcement point that can slow an agent down or break it.

## A flat register cannot survive the follow-up question.

Two categories of tool already sit near this problem. Neither is built to answer what it costs to stop a specific agent — and that isn't a criticism of either, it's a description of what they were built for.

Governance & risk platforms

- Record risk
- Flat register, one altitude
- Scores, asserted by a human
- Acceptance as free text

Identity & posture tooling

- Grant access, find misconfiguration
- Excellent at the layer they own
- No business owner attached
- No expiry, no underwriting

RiskMandate

- Computes the plug profile
- Every altitude, one graph
- Evidence, not scores
- Accepted, owned, funded, expiring

## Start from the break-even, not from a multiple.

We're not going to quote you a return we computed with our own assumptions. The useful version is the test you can run against your own numbers in about a minute.

The break-even test

What is the largest _irreversible_ loss one of your agents could cause? Multiply by the probability you'd defend to your board. If the platform costs less than a small single-digit percentage of that number, it pays for itself on that one agent.

Everything else — the reversible exposure, the audit time, the over-remediation you stop doing — is upside on top.

Where the value shows up

- Irreversible exposure_bounded and owned, instead of unquantified_
- Reversible exposure_accepted deliberately for a stated interval_
- Audit & evidence_assembled from the graph rather than reconstructed_
- Over-remediation_work not done on risks that were fine to accept_

We'll build this with your figures in a working session — no modelled ROI slide, because you'd be right not to trust ours.

Pricing is open-source core, consumption-metered platform, and custom enterprise.

## What people ask in the first meeting.

### Does this sit in the request path — can it slow down or break my agents?

No. There are no runtime decisions and no enforcement point. It reads and models; it never intercepts. That is a design property, not a configuration option.

### Do I need to integrate it with every system my agents touch?

No. Digital twins model the capability primitives — assets and flows — rather than requiring a live connector to everything underneath. That's what makes broad coverage tractable rather than a multi-year programme.

### Who decides what an acceptable plug profile looks like?

You do — and that is the point. The Act requires residual risk to be judged acceptable without ever defining the word, so the threshold is yours to set and yours to evidence. We compute the profile; the line it is measured against is a business decision. See [accepted is not acceptable](acceptable.html).

### How is this different from the risk register we already have?

A register records that a risk exists. A plug profile computes what stopping the agent would cost, attaches a named owner, and expires. The difference shows up the first time someone has to sign one.

### What happens to our telemetry?

It's used to test whether our model of your agents is accurate — to find blind spots in the map. It isn't a surveillance layer and it doesn't police traffic.

### Can we self-host?

Yes. The core is open source and self-hostable, on a zero-knowledge vault on your own infrastructure — your keys, your data. Enterprise adds sovereign regional deployment.

### Where do I read the underlying thinking?

The [library](library.html) has the recorded talks, the full proposition deck, and the long-form pieces — the blast radius, permission granularity, side effects, and risk acceptance. [RAMM](ramm.html) covers how acceptance maturity is computed, and [accepted is not acceptable](acceptable.html) covers where the line itself comes from.

## See the plug profile for one of yours.

Choose an agent you already run. We'll walk the graph and show you who can stop it, how fast, what it breaks, and the part that can't be undone.
