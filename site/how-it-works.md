<!-- Generated from how-it-works.html by scripts/site/generate.mjs. Edit the page, not this file. -->

# RiskMandate — How it works: from a prompt to a graph with provenance

How an Agent Behaviour Policy technically works, in the order it happens: a prompt that shows what the agent can reach, the barriers that separate hope from a control, fitting the policy to the controls you actually have, connectors to whatever you run, the graph to standards and risks, and the vault as provenance.

Source: https://riskmandate.ai/how-it-works.html

---

# We write down the gap. Then we shrink it.

The idea is to map out the gap between what you want an agent to do and what it can actually do, so that you can find ways to contain it. That is the whole answer to _what does this do_. This page is the answer to _how does it technically work_, in the order it happens, with the status of each step on the step.

## Authorisation is whatever the agent can already do.

Not a decision made at request time. Authority was conferred the moment capability was, and what an agent can actually do is the union of every route to that capability, not the subset somebody wrote down.

### If the agent can do it, it was authorised to.

The agent that dropped the database was, by this definition, already authorised to drop it. Calling that a breach of policy describes the paperwork, not the system.

### So the work is shrinking it.

Make the union visible, bound it deliberately, and accept what is left for a stated interval with a named owner. Everything below is one of those three things.

## Six steps, from a prompt to a graph with provenance.

Each step exists because the one before it produces a question the previous step cannot answer. The chip on each says what runs today, what runs per engagement, and what is designed.

### Start with a prompt

“What can this agent actually do?”

Thirteen prompts, pasted into the assistant you already run, against your own mailbox or repository. The agent enumerates its own tools and scopes, drafts the mandate in three lists for you to correct, and writes the gap down. Twenty minutes; nothing is collected.

A prompt is first because it is the fastest way to be surprised, and being surprised is the shift: the list of what the agent can reach is longer than the tile that sold it, and the people deploying or buying agents have usually never seen the list.

### Notice that a prompt is hope

“Fine. How do we reduce it?”

The moment a stakeholder asks that, the honest answer is that asking the agent to behave is not a control. [nhi.sgit.ai](https://nhi.sgit.ai/hope/) puts it in four words: _hope is not a control_; you are hoping the agent does not use the credential a certain way, and hoping it does not find more access than you think you gave it.

So every capability in a behaviour policy carries one of four barriers: nothing in the way, a rule in prose, a setting, or a boundary enforced by something the grant does not include. Only the fourth bounds anything. The policy says which one each capability has, and it never grades them.

### Fit the policy to the controls you actually have

“What is actually in the way, here?”

What bounds an agent depends on what exists in your environment: the proxy in front of it, the egress rules, which kinds of account can be created, what corporate tooling prevents, and what nobody has switched on. So a template becomes yours when its mandate and its barriers are corrected against your deployment rather than against the vendor’s defaults.

The record keeps a distinction that matters when a control moves: who holds each barrier. A scope you consented to and can revoke is a different object from a product decision a vendor can change in a release with no notice. Both are recorded; the difference is in the facts.

### Integrate with whatever you have

“Do you plug into our stack?”

We read; we never enforce. Sixteen deployment shapes are described today, each from the vendor’s own published pages, quoted and dated, or measured on a deployment we are entitled to run. Reading a customer’s own control planes — the identity provider, cloud IAM, the proxy, CI — needs a connector, and connectors are built per engagement with agentic development against whatever is on the other side, then productised as they mature.

Nothing we build sits between an agent and what it is doing. There is no enforcement point to slow an agent down or break it, which is why the security review of us is a short conversation.

### Connect it to the graph

“What does this touch, and who already cares?”

The policy is a graph and the documents are projections of it. Behaviours are addressable nodes; each grant row is an edge carrying its door, its evidence and its barrier. From there the edges go outward: every published vault already carries the EU AI Act articles, GDPR articles and ATT&CK techniques its consequences touch, by id and title, where a link means _touched_ and never _complies_.

The same mechanism is what connects a gap to a risk, and a risk upward through the register to the board, and sideways to your internal policies and documents. One graph, several readers, and it is why one record can answer a questionnaire somebody else already wrote.

### Keep it in a vault, because the vault is the provenance

“How do we know this is what was true, and when?”

Every policy lives in an encrypted vault you hold the keys to, with every version kept, the record of what was asked and answered, the sign-off with a name and a date, and a validity statement that says what voids it: a release, a setting, a connector enabled. If the risk changed, the deployment changed, and the history shows which came first.

Where this goes: the same vault, or one of yours, holds the execution logs and the evidence beside the policy, so provenance is not a separate system somebody has to keep in step.

## Five things, in one direction.

Read-only throughout, and never in the request path. The only thing that ever sits inside your agent is a file it reads — `AGENTS.md`, `SKILL.md` — and a file is an expectation, not a control. That distinction is the second step above, and it is the whole reason the third one exists.

## Be surprised first. Then decide what to do about it.

The prompts are free and collect nothing. If the list comes back longer than you expected, that is the product working, and the rest of this page is what happens next.
