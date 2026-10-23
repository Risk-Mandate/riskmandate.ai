<!-- Generated from newsroom.html by scripts/site/generate.mjs. Edit the page, not this file. -->

# RiskMandate — from the newsroom: the thinking behind the ABP

The 15 articles on the SGit Newsroom that say most simply what an Agent Behaviour Policy is, where its line sits and where it is going, retold in a paragraph each, with a line quoted and a link. And the news that RiskMandate is on LinkedIn.

Source: https://riskmandate.ai/newsroom.html

---

# The thinking behind the ABP, as it was written down.

Dinis Cruz writes RiskMandate's thinking on [newsroom.sgit.ai](https://newsroom.sgit.ai/), from voice memos, written up and checked by the newsroom's agent. These are the 15 articles that say most simply what an Agent Behaviour Policy is, where its line sits and where it is going, each retold here in a paragraph, with a line quoted and a link to the whole piece.

## RiskMandate is on LinkedIn.

The company page went up on 21 October 2026: [linkedin.com/company/riskmandate](https://www.linkedin.com/company/riskmandate/). It will carry what we learn from the first customers and the articles behind it, starting with the pieces on this page, retold for LinkedIn. Every one of them ends in the same place: [five minutes on the customers site](https://customers.riskmandate.ai/), putting a behaviour policy on your own assistant.

## What an Agent Behaviour Policy is, in plain words.

18 October 2026

### [What can your agent reach?](https://newsroom.sgit.ai/articles/what-can-your-agent-reach.html)

Written for a reader who found these pages hard, and said so. RiskMandate writes down, for one agent in one deployment, what it can reach, what you authorised it to do, the gap, and what stands in the way of each capability. It is read-only on purpose and never in the agent's path; it already covers commercial agents; and it gets into the room through the questions that already arrive, from contracts to insurance renewals.

> “It carries no score and no verdict. It is the record.”

[Read it on the newsroom ↗](https://newsroom.sgit.ai/articles/what-can-your-agent-reach.html)

20 October 2026

### [A briefing for the WestCap CISO Summit](https://newsroom.sgit.ai/articles/a-briefing-for-the-ciso-summit.html)

The ABP in three sentences, then said again for six kinds of person in a room: CISOs, governance and audit, incident response, defence vendors, investors and founders. The idea at its centre is one sentence: a control bounds a grant only if it is enforced by something the grant does not include.

> “Your agent can do three hundred and forty things and you authorised twelve is a finding.”

[Read it on the newsroom ↗](https://newsroom.sgit.ai/articles/a-briefing-for-the-ciso-summit.html)

8 October 2026

### [Hope or enforcement](https://newsroom.sgit.ai/articles/hope-or-enforcement.html)

One customer-service agent built three ways, each with an ABP and every rule marked by what enforces it. The same 62 fictional emails, sixteen of them hostile, went through all three: in the first design 97% of the rules were kept only by the model, in the second 73%, in the third 23%.

> “A rule the model keeps is an expectation: hope.”

[Read it on the newsroom ↗](https://newsroom.sgit.ai/articles/hope-or-enforcement.html)

9 October 2026

### [Ten hard questions, answered](https://newsroom.sgit.ai/articles/riskmandate-ten-questions.html)

The ten questions people actually ask, brought back from a conference by the co-founder and answered in a two-hour interview: bypass, keeping a policy current, what you pay for, liability, platforms, enforcement, breaches, agents instructing agents, measurement. With an honest table of what is live and what is design.

> “Not inline. … Not an insurer. … Not a one-button solution.”

[Read it on the newsroom ↗](https://newsroom.sgit.ai/articles/riskmandate-ten-questions.html)

## Describe, govern, enforce: who does which.

19 October 2026

### [Governs, enforces, attests](https://newsroom.sgit.ai/articles/governs-enforces-attests.html)

An ABP does not enforce anything by itself. It says what each role is granted and for, writes each rule down, and says how each rule is kept: in the prompt, a hope; by hooks in the agent's harness, deterministic but on the agent's own machine; or by a third-party system that does the blocking, the level we recommend. On top, an attestation layer signs what was assured, so somebody else can check it.

> “An ABP governs.”

[Read it on the newsroom ↗](https://newsroom.sgit.ai/articles/governs-enforces-attests.html)

14 October 2026

### [Policy as code needs a policy first](https://newsroom.sgit.ai/articles/policy-as-code-needs-a-policy-first.html)

Policy as code answers one question, is this request allowed. The questions a business, an auditor or an insurer asks are the ones around it, and the ABP holds them, so it can be written both ways: five rows of a real ABP became a Rego policy, and code can be read back into an ABP.

> “A rule the agent can rewrite is a setting.”

[Read it on the newsroom ↗](https://newsroom.sgit.ai/articles/policy-as-code-needs-a-policy-first.html)

20 October 2026

### [Can a key leak without breaking the policy?](https://newsroom.sgit.ai/articles/a-leak-without-breaking-the-policy.html)

A first customer's question. Yes, if the ABP only lists what an agent can do: sending an email is a capability, putting a key in it is content. So secrets need content rows, at three levels: told, checked, never given. A hook tested against nine leaks stopped most of them and missed three.

> “Sending is allowed; the key is content.”

[Read it on the newsroom ↗](https://newsroom.sgit.ai/articles/a-leak-without-breaking-the-policy.html)

17 October 2026

### [Three policies for an agent](https://newsroom.sgit.ai/articles/three-policies-for-an-agent.html)

When something goes wrong, people ask how the agent made that decision, and a behaviour policy alone cannot answer. Beside the ABP sit a decision policy, who chooses at a branch point and on what evidence, and a workflow policy, which steps in what order.

> “Behaviour: what an agent may do. Decision: who chooses at a branch point… Workflow: which steps, in what order.”

[Read it on the newsroom ↗](https://newsroom.sgit.ai/articles/three-policies-for-an-agent.html)

13 October 2026

### [A policy beside the prompt](https://newsroom.sgit.ai/articles/a-policy-beside-the-prompt.html)

A proposal: every agent should take an ABP as an input beside its prompt, written to a published standard, which the vendor accepts, enforces as far as it can, and eventually answers for, as aviation and payments learned to.

[Read it on the newsroom ↗](https://newsroom.sgit.ai/articles/a-policy-beside-the-prompt.html)

## Customers, a roadmap, and a home of its own.

20 October 2026

### [Our first customers](https://newsroom.sgit.ai/articles/our-first-customers.html)

The brief the customers site was built from: a first batch called customers, not beta users, each with credit on a site we run, followed up closely, with milestones written with them, and a list for the next batch. What it is looking for is the usage moment.

> “Discover the usage moment. The simplest useful policy, the easiest entry, a fair price.”

[Read it on the newsroom ↗](https://newsroom.sgit.ai/articles/our-first-customers.html) · [The customers site](https://customers.riskmandate.ai/)

20 October 2026

### [A proposed roadmap for RiskMandate](https://newsroom.sgit.ai/articles/the-riskmandate-roadmap.html)

Still being discussed between the founders, so a proposal, not a decision: a spectrum of trust walked with each customer. Policies, understand, risk acceptance, contain, manage, insure; each stage answers the question a customer asks once the last one is answered.

> “Then insure. The end game: agents an insurer can cover.”

[Read it on the newsroom ↗](https://newsroom.sgit.ai/articles/the-riskmandate-roadmap.html)

20 October 2026

### [Free to copy, paid at the source](https://newsroom.sgit.ai/articles/free-to-copy-paid-at-the-source.html)

The policies and hooks are open and anyone may copy them. But a hook is code that runs with your permissions, so people will come to the official source for it, and that source can charge per use, if others review the hooks and we sign them.

> “But a hook is code. It runs on your machine, with your permissions.”

[Read it on the newsroom ↗](https://newsroom.sgit.ai/articles/free-to-copy-paid-at-the-source.html)

20 October 2026

### [Agent Behaviour Policies move to the Open Security Summit](https://newsroom.sgit.ai/articles/agent-behaviour-policies-move-to-the-open-security-summit.html)

A proposal for the ABP to become the first hosted project of the Open Security Summit, a UK community interest company, after the proposal to OWASP of 8 October. Hosting separates it from RiskMandate as an organisation; a public charter and a steering group with a majority independent of RiskMandate are still to be written.

> “Hosting is not independence.”

[Read it on the newsroom ↗](https://newsroom.sgit.ai/articles/agent-behaviour-policies-move-to-the-open-security-summit.html)

19 October 2026

### [A trusted framework for agentic finance](https://newsroom.sgit.ai/articles/a-trusted-framework-for-agentic-finance.html)

A reply to the FCA's plan, announced by Jessica Rusu, for a framework covering agent identity, delegated authority, accountability and execution: how the open behaviour policies line up with it, and an invented bank with six agents, one day of their work replayed through the gate.

> “Every incident came from a gap row.”

[Read it on the newsroom ↗](https://newsroom.sgit.ai/articles/a-trusted-framework-for-agentic-finance.html)

21 October 2026

### [Answering a draft](https://newsroom.sgit.ai/articles/answering-a-draft.html)

How agent@riskmandate.ai works: the agent reads, researches and drafts; Dinis reads every draft and sends it himself, 178 so far. The drafts folder is a work queue with three labels, send, review and decide, and a decision draft is never sent: it is answered.

> “The agent drafts; I send.”

[Read it on the newsroom ↗](https://newsroom.sgit.ai/articles/answering-a-draft.html)

## Retold here, written there.

Every article above is by Dinis Cruz, on [the SGit Newsroom](https://newsroom.sgit.ai/), written up from his voice memos and checked by the newsroom's agent, under CC BY 4.0. The paragraphs on this page are ours, written on 21 October 2026; the quotes are short and are the articles' own words; the dates are the articles'. Where an article and this site differ, the article was often first: two of them pointed out wording on this site's home page that put RiskMandate in the request path, and the home page was rewritten.

## Put a behaviour policy on your agent.

Ask your assistant to do something. Paste one line that says it must not. Ask again. In Claude or ChatGPT, in your browser, nothing to install.
