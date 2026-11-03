<!-- Generated from secure-harness.html by scripts/site/generate.mjs. Edit the page, not this file. -->

# RiskMandate — SHarness: the rules in an ABP, held by the kernel

SHarness is the open-source secure harness RiskMandate maintains: it turns an Agent Behaviour Policy into a Process Behaviour Policy the Linux kernel holds on every process the agent starts, in your own environment. What changes, how it works, what runs today and what is still the design.

Source: https://riskmandate.ai/secure-harness.html

---

# The rules in an ABP, held by the kernel.

An Agent Behaviour Policy says what one agent may do. Until now, what kept each rule was the agent's own willingness, a hook on its own machine, or a control you already ran. **SHarness** adds the missing piece: an open-source secure harness, which RiskMandate maintains and you run in your own environment, that turns the ABP into a policy the Linux kernel holds on every process the agent starts. We are still never in the request path.

## From describing a rule to holding it.

An ABP describes; a Process Behaviour Policy is that description executed, underneath the agent. In sharness.ai's own words: “An ABP _describes_ an agent's behaviour; a PBP is that description _executed_, underneath the agent.”

### Before

RiskMandate wrote down the reach, the mandate, the gap and the barrier on every row. Most barriers were expectations, lines the agent reads, or settings it could switch off. Enforcement was yours to find.

### With SHarness

The same rows, compiled into a policy named by a hash you supply, and held by something the agent does not include: the kernel, or a door that is the only way to a resource. A row held that way is a boundary, the one kind of barrier an insurer, an auditor or a board can count.

Not inline, still: “The enterprise story has no product in the request path.” The vendor ships profiles, your organisation names its own proxies and databases, the machine compiles the rest, and “it costs nothing per request: the expansion runs once, at launch.” From [SHarness: the secure harness we could not find, so we built it](https://newsroom.sgit.ai/articles/introducing-sharness.html), 29 October 2026.

## Three things make a policy binding.

- **The text.** A small JSON policy in canonical form, so it hashes the same in every language.
- **The hash, from outside.** You supply `sha256:…`, and the enforcer refuses anything else. “A prompt-injected agent cannot widen what it cannot rename.”
- **An enforcer the agent does not include.** The kernel, or a separate process. “Who enforces decides the barrier kind.”

A launcher outside every domain checks the hash, gives each part its own Linux user and certificate, and destroys the certificate authority's key. The kernel holds the capability rows: what a process may read, write, run and connect to. Five doors hold the behaviour rows, each the only way to one resource: files, network, keys, shell and model. The permission prompt goes last: “yes to what the policy allows, silence for what it refuses, and a question only for what it cannot hold.”

## From the gap to the kernel, in four animations.

The first plays when it comes into view; choose the next below. Each runs about fifty seconds and holds its last frame. They are read from the same data the sources published, and dated by it. They were made for [The Ultimate Insider](https://the-ultimate-insider.presentation.sgit.ai/) talk and for [ruv.sgit.ai](https://ruv.sgit.ai/). They are copied here so this page loads nothing from another site, and their wording uses this site's terms ([what changed, and the licences](assets/anim/README.md)).

_**1 · The ABP.** One example, Claude Code on your own machine with confirmations on: the mandate, the grant, the gap, and the barrier on each row. It ends on twelve rows of excess, none of them held by a control. _E09, the-ultimate-insider.presentation.sgit.ai, CC BY 4.0._**2 · Enforced in a swarm.** The same eleven actions from a Ruflo swarm, run twice. The default lets all eleven through. Under the ABP in enforce mode, four are denied and two wait for approval, each with a receipt in a hash-chained ledger. POC1, Ruflo 3.56.10. _Studio v4, ruv.sgit.ai, Apache-2.0._**3 · Held by the kernel.** One row of that excess, held. `sharness-ai hello` writes a PBP, hashes it, lets the kernel hold it, then runs six probes. Six of six held, 25 October 2026, in five environments, for a child process. _E11, the-ultimate-insider.presentation.sgit.ai, CC BY 4.0._**4 · The radius.** It shows which rows would close if a files and network wall held for the agent itself, and which would still be bounded by nothing. That needs the launcher above the agent, which is still the design; the title says so. _E12, the-ultimate-insider.presentation.sgit.ai, CC BY 4.0._Replay[Full screen ↗](assets/anim/studio/lab/e09/v1/index.html)_

## Describe, check, hold, and show the evidence.

### The ABP

One agent, one deployment: reach, mandate, gap and the barrier on each row. Available now, from the pack to a reviewed and signed policy. [The levels](pricing.html).

### Lines and hooks

The rules you can paste or install today, for Claude, ChatGPT and Claude Code. [Try one in five minutes](https://customers.riskmandate.ai/), or [pick a rule](rules/).

### SHarness

The same rows, held by the kernel and the doors, in your environment. Open source, Apache-2.0: `pip install sharness-ai`. We help you deploy it.

### Two numbers

Every summary carries the reach nobody asked for, and now a second number: the rows no boundary holds. “The second number is the business case for the next door.”

## What runs today, and what is still the design.

sharness.ai labels itself a design with its first experiments runnable, and keeps [the honest column](https://sharness.ai/evidence/status/index.html). This is ours from it.

### Runs today

- `sharness-ai` 0.2.0 on [PyPI](https://pypi.org/project/sharness-ai/): Python standard library only, 243 tests.
- The kernel locks on a process: file and execute rules, ports, no network, memory and process caps, the hash checked first.
- `hello`: six probes under a deny-all policy, six held, in five environments, one of them a Linux kernel in a browser tab.
- The levels: `contain`, `profile`, `explain`, from one sentence down to the kernel.
- The file and network doors, as early versions, and a shell whose only way out is the network door.

### Design, not built

- The launcher above the agent. In the project's words: “Nothing yet binds the agent itself.”
- The key, shell and model doors; seccomp; hostnames in the policy.
- Linux only, and no protection against root.
- `policy translate` writes the same policy for bubblewrap, Docker, Kubernetes and Claude Code's sandbox, with what each cannot hold; the translations have not been run against those targets.
- The security reviews so far were done by an agent of the project.

## The questions a sceptical engineer asks.

## On the newsroom.

- [SHarness: the secure harness we could not find, so we built it](https://newsroom.sgit.ai/articles/introducing-sharness.html) · 29 October
- [Proven controls, for agents](https://newsroom.sgit.ai/articles/proven-controls-for-agents.html) · 29 October: who holds each control, and six controls tested by breaking them
- [The grant, not the prompt](https://newsroom.sgit.ai/articles/the-grant-not-the-prompt.html) · 2 November: a prompt, then a hook, then the capability not being there
- [False positives and the harness](https://newsroom.sgit.ai/articles/false-positives-and-the-harness.html) · 2 November
- [Selling less code](https://newsroom.sgit.ai/articles/selling-less-code.html) · 30 October: a smaller build, a smaller policy, held by SHarness
- [A payout for every row](https://newsroom.sgit.ai/articles/a-payout-for-every-row.html) · 28 October: only an enforced control lowers a row's premium, a proposal

## The ABP comes first.

A harness holds the rules you wrote down. Write the first one in five minutes, in your own assistant.
