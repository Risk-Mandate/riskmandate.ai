<!-- Generated from rules/act-in-your-cloud.html by scripts/site/generate.mjs. Edit the page, not this file. -->

# RiskMandate — Do you want your agent to act in your cloud and code-host accounts with the logins on your machine?

Rule RM-R0020: Your cloud CLI and your code-host CLI are logged in as you. The agent uses them to clean up resources, change a setting, or create something, in production, as you. What you get: Your logins are used for what you asked, and anything that changes an account waits for you. The one line to paste, what it honestly is, the stronger barriers with their sources, and where the capability is a row in a published behaviour policy.

Source: https://riskmandate.ai/rules/act-in-your-cloud.html

---

# Do you want your agent to act in your cloud and code-host accounts with the logins on your machine?

Your cloud CLI and your code-host CLI are logged in as you. The agent uses them to clean up resources, change a setting, or create something, in production, as you.

**What you get:** Your logins are used for what you asked, and anything that changes an account waits for you.

**The capability:** Act in accounts with the credentials it holds (`authenticate-as.credential.tenant`). **Undo:** cannot be undone.

**All rules:** [the index](/rules/) · **This page as markdown:** [act-in-your-cloud.md](/rules/act-in-your-cloud.md)

## Paste this into your agent's instructions, and it should ask you first.

For Claude Code, that is `CLAUDE.md` in the project or in your home directory; for Claude on the web or the desktop, a project's instructions or your personal preferences. The one line is enough to try it; the paragraph tells the agent why, and what counts.

```
Do not use my cloud, code-host or other command-line logins (aws, gcloud, az, gh, kubectl) to change anything; read-only commands I ask for are fine, anything else needs a yes.
```

```
The command-line tools on this machine are logged in as me. Read-only commands I ask for, such as listing or describing, are fine. Anything that creates, changes, deletes or grants access in a cloud, code-host or cluster account needs my yes: say the command, the account and the effect, and wait.
```

## A request to the agent, not a control.

In the vocabulary every published behaviour policy uses, a line in the agent's instructions is an **expectation**: a rule in prose, enforced by nobody. A rule in prose is inside the boundary the agent operates in. All four major model providers stated in their own 2026 words that an instruction at this layer can be bypassed. It changes what the agent usually does, which is worth having; it does not hold when the agent is talked out of it, confused, or reading somebody else's instructions in a web page.

**If you want more than a request,** these are stronger, each quoted from the vendor's own page on the date shown.

### An ask rule in Claude Code's settings for each logged-in tool

```
{
  "permissions": {
    "ask": [
      "Bash(aws *)",
      "Bash(gcloud *)",
      "Bash(kubectl *)",
      "Bash(gh *)"
    ]
  }
}
```

> “A broad deny rule like Bash(aws *) blocks every matching call, including calls that also match a narrower allow rule like Bash(aws s3 ls). An allow rule can't carve an exception out of a deny rule. (The same page: a Bash rule matches the command text Claude writes, so a deny or ask rule covers the invocation Claude usually produces and isn't a security boundary around the program.)”

[code.claude.com/docs/en/permissions](https://code.claude.com/docs/en/permissions) · read 8 October 2026

## This is a row in 3 published behaviour policies, with what stands in the way today.

Read from each vault's own grant, as published. The barrier is what was found in that deployment, before any rule.

## Not run yet. It will be, on our own deployment.

Every rule gets one run without the line and one with it, on a deployment we are entitled to run, dated, stopped before anything irreversible. [How these are run.](/rules/method.html)

## Tell us, and the rule gets better.

Each link opens the contact form with this rule's id and version filled in. It is encrypted in your browser and read by a person. Nothing is sent until you press send.

## A rule is one row. The ABP is every row, for your agent.

If this one made sense, the Agent Behaviour Policy is the same idea for everything your agent can reach: what it can do, what you authorised, the gap, and what stands in the way of each thing.

Versions

- **v1.0.0** · 8 October 2026 · First version, written from the published rows with nothing in the way.
