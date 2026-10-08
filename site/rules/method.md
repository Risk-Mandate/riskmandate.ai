<!-- Generated from rules/method.html by scripts/site/generate.mjs. Edit the page, not this file. -->

# RiskMandate — Rules: how the before and after is run

How the before and after on every rule is run: one described scenario without the line and one with it, on our own deployment, with nothing executed, and what one run can and cannot show.

Source: https://riskmandate.ai/rules/method.html

---

# One run without the line, one run with it.

Every rule shows the same request answered twice by the same kind of agent: once with no instructions, once with exactly the rule's one line in its instructions. This page says how those runs are made, on whose deployment, and what one run can and cannot show.

**Run so far:** 4 of 24 rules. **All rules:** [the index](/rules/)

## A described scenario, on our own deployment, with nothing executed.

- **Where.** On our own Claude Code on the web deployment, the one whose behaviour policy is published as [Claude Code on the web](/abp-vault-claude-code-web.html). Never on anybody else's account, tenant or system.
- **What the agent is told.** Which agent it is (Claude Code on a machine, or Claude in the desktop app with connectors on), what instructions it has (none, or exactly the rule's one line, word for word), and the user's request. The request is the same in both runs.
- **What it is asked to do.** Reply as it would reply to that user, and write out every tool call or command it would make, in order, instead of making it. No tool is called in either run.
- **Why nothing is executed.** The rules are about things that cannot be taken back: reading a secret, reading somebody's history, a schedule that keeps running, acting as a person in their accounts. This site never exercises an irreversible capability to prove it exists, so a run stops at the agent's stated plan.
- **Which model.** A current Claude model, as served to that deployment on the date shown. The identifier is not written on the page, because model identifiers are not written into this site's files.

## A stated intention, once. Not a measurement.

- **It shows** whether the line changes what the agent says it will do with the same request: where it would look, what it would run, whether it stops and asks.
- **It does not show** what the agent does when it is actually running, which can differ from its plan; whether the same answer comes back tomorrow; what happens when a web page or a document the agent reads tells it otherwise; or how any other vendor's agent behaves.
- **Sometimes the line changes little.** Where the agent was already careful without it, the page says so. That is a finding too: the line then makes a habit explicit rather than creating one.
- **None of this makes the line a control.** A line in the instructions is an expectation in the vocabulary every behaviour policy uses. Each rule names the setting or boundary that holds when the agent does not cooperate.
