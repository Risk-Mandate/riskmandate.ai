<!-- Generated from business-cases.html by scripts/site/generate.mjs. Edit the page, not this file. -->

# RiskMandate — business cases, by the risk they change

The business case for a security product is the difference between the risk register without it and with it, from the operator to the board. Computed from a public model, our own product first, then others in their own words.

Source: https://riskmandate.ai/business-cases.html

---

# A security product is worth the risks it retires.

The business case for a security product is a difference: the risk register for an agent deployment without it, and the register with it, from the operator who is paged to the board that has to defend it. This section writes that difference down, computed from a public model, for our own product first and then for others’, in their own words.

## Three readers, one register.

### A case in your own terms.

Not a feature list: which entries leave your register, whose they were, and what reaches the board. And which ones a product only makes less likely, said as that.

### A case you did not have to write.

Many security products are sold on capability. This maps the capability to the risks it changes, at every altitude, in terms a CFO and a board can read. If it is wrong about you, it changes.

### Every case starts with a map.

No case can be computed until somebody has answered the questions truthfully about one agent in one deployment. That answer is what an Agent Behaviour Policy produces.

## Five steps, none of them by hand.

- **State the deployment.** Sixteen questions about one agent: where it runs, what data it can reach, whether it can change production, whether anybody can stop it, and whether what it changes can be undone. Every case says which answers it starts from.
- **Write what the product does, in its own words.** From the vendor’s documentation, quoted and dated. Never from testing their product: we do not test somebody else’s system.
- **Write the answers it changes.** Each change says what kind it is: stating what is true, an expectation the agent is asked to meet, a setting, or a boundary the agent’s grant does not include. An expectation never retires a risk; it is listed as a reduction.
- **Compute both registers.** The model’s 49 facts establish or retire its 49 risks by fixed rules, and corporate risks roll up from the ones that lead into them.
- **Read it by altitude.** Each risk belongs to named roles, and each role reports up to the board. The case is the difference at each level.

The model is the RiskGraph Explorer’s, from one of our [live demos](demos.html), copied into this site with its provenance. It is small on purpose: sixteen questions, readable in one sitting, so an argument about a case is an argument about an answer, not about a formula. Nothing on these pages is a score, and no case is a statement that a product works; it is a statement of what changes in the register if it does what its documentation says.

## 19 written so far, ours first.

Our own product first, so the method is tested on us. Then open-source projects, OWASP’s first, which anybody can deploy and nobody has to pay for, but which cost something to adopt and more to customise; each case says what. Cases about commercial products are drafted from their own documentation and sent to the company before they are listed.

Our own

Open source

Across the open-source projects, the answers that move are egress, access to data, the record, the account, stopping and undoing. None of them moves who owns the stop, the side effects of stopping, the procedure after it, or the class of data in reach. Those are decisions and documents, not software, which is where a behaviour policy and a [licence to operate](licence-to-operate.html) come in.

## Companies that work the way we do, and whose projects are here.

RiskMandate publishes its behaviour policies and toolkit openly and sells the work on top. These companies run the same model around projects in this section, or beside OWASP. They are here because the conversations the lead wants are with them: a case about their project is also a case for what they sell.

The patterns, as facts. Some stay inside OWASP with a company alongside: DefectDojo, SAMM with Codific, secureCodeBox with iteratec. ZAP left OWASP in 2023, saying it could only be in one foundation, and became ZAP by Checkmarx in 2024. Several gave their project to a foundation and sell a distribution of it: Falco, Kyverno, agentgateway. Some sell a hosted control plane over an open engine. Two such companies closed in 2025: after the creators of Open Policy Agent joined Apple, OPA stayed a CNCF project with no change to its governance or licence; Aserto wound down as a commercial entity.

## 12 categories, computed the same way.

Twelve kinds of product that could sit around an agent, each computed against the typical deployment with its own questions answered as they would be without it. Every row is our reading of what the category does, not any vendor’s claim, and the change is conservative on purpose: where a category could move an answer to _partly_ or _fully_, the row says _partly_.

Two patterns are worth reading off the table. Most categories retire one or two entries each, so the case for any single product is narrow and exact rather than broad, and a register gets small by combining them. And every category adds something: a service in the request path, a store of prompts, a credential with wide reach. The case is only honest with that column in it.

## What a case will and will not say.

- **The vendor’s words, quoted and dated,** for anything a product does. Where their pages disagree, both are shown.
- **No verdict on any product** and no ranking of one against another. The case says what changes if the documentation is right.
- **No conformity language.** A product that touches an article of a regulation is shown as touching it, never as meeting it.
- **What it adds is part of the case.** A product in the request path is also something that can fail, and something that has to be stopped.
- **Open source is published; commercial is sent first.** A case about an open-source project is published and sent to its maintainers at the same time. A case about a commercial product is sent to the company before it is listed. Either changes with a date when they correct it.

## Ask for a case, or correct one.

If you build a product for agent security and would like its case written, or you have read a case about your product and it is wrong, write to us. If you run agents, the case for anything starts with a map of one of them.
