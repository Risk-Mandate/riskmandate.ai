<!-- Generated from how-it-works.html by scripts/site/generate.mjs. Edit the page, not this file. -->

# RiskMandate — How it works

Authorisation is whatever the agent can already do — the union of every route to a capability, conferred long before request time. So we model rather than intercept: read-only digital twins instead of integrations, the RiskGraph, and engines that compute the profile. Never in the request path.

Source: https://riskmandate.ai/how-it-works.html

---

# We model it. We never sit in it.

Everything on this page follows from one observation: by the time a request is made, authorisation has already happened. That means the answer can be computed from a model of what exists — which is why nothing we run has to sit between an agent and what it is doing.

## Authorisation is whatever the agent can already do.

Not a decision made at request time. Authority was conferred the moment capability was — and what an agent can actually do is the union of every route to that capability, not the subset someone wrote down.

The privilege issued

granted, and documented

The credential discovered

found on a filesystem

The adjacent system reached

via a trusted path

The account recovered

through a reset flow

### If the agent can do it, it was authorised to.

The agent that dropped the database was, by this definition, already authorised to drop it. Calling that a breach of policy describes the paperwork, not the system.

### So the work is shrinking it.

Make the union visible, bound it deliberately, and accept what's left for a stated interval with a named owner. That's the whole product.

This is also why we never need to sit in the request path — authorisation already happened.

## Read-only by design — twins instead of integrations.

We model the primitives that matter — capabilities, assets, flows — rather than wiring into every system underneath. Nothing we run sits between an agent and what it's doing.

### No integration treadmill

Twins model capabilities, assets and flows, so coverage doesn't require a connector for every system an agent touches.

### Never in the request path

No runtime decisions and no enforcement point. There is nothing in line that can slow an agent down or break it — which makes the security review a much shorter conversation.

### Telemetry tests the map

Signals are consumed to find where our model of your agents is wrong — not to police traffic. Observed behaviour is how conferred capability gets reverse-engineered.

## See it run against one of yours.

We will walk the graph for an agent you already run and show you the profile it produces — who can stop it, how fast, what it breaks, and the part that cannot be undone.
