<!-- Generated from rules/run-anything.html by scripts/site/generate.mjs. Edit the page, not this file. -->

# RiskMandate — Do you want your agent to install software and run programs as you without asking?

Rule RM-R0012: To get past an error it installs a package it found, runs a script from a website, or changes a system setting. It runs as you, with everything you can reach. What you get: You know what gets installed and run, and where it came from, before it runs. The one line to paste, what it honestly is, the stronger barriers with their sources, and where the capability is a row in a published behaviour policy.

Source: https://riskmandate.ai/rules/run-anything.html

---

# Do you want your agent to install software and run programs as you without asking?

To get past an error it installs a package it found, runs a script from a website, or changes a system setting. It runs as you, with everything you can reach.

**What you get:** You know what gets installed and run, and where it came from, before it runs.

**The capability:** Run programs as the account (`execute.process.host`). **Undo:** recoverable from a backup, a history or a revert, at a cost.

**All rules:** [the index](/rules/) · **This page as markdown:** [run-anything.md](/rules/run-anything.md)

## Paste this into your agent's instructions, and it should ask you first.

For Claude Code, that is `CLAUDE.md` in the project or in your home directory; for Claude on the web or the desktop, a project's instructions or your personal preferences. The one line is enough to try it; the paragraph tells the agent why, and what counts.

```
Ask before installing software, running anything downloaded from the internet, or changing system settings; say what it is and where it came from.
```

```
Running the project's own build, tests and scripts is fine. Installing new software or packages, running scripts fetched from the internet, using sudo, or changing system or shell settings needs my yes: say what it is, where it comes from, and why the task needs it, then wait.
```

## A request to the agent, not a control.

In the vocabulary every published behaviour policy uses, a line in the agent's instructions is an **expectation**: a rule in prose, enforced by nobody. A rule in prose is inside the boundary the agent operates in. All four major model providers stated in their own 2026 words that an instruction at this layer can be bypassed. It changes what the agent usually does, which is worth having; it does not hold when the agent is talked out of it, confused, or reading somebody else's instructions in a web page.

**If you want more than a request,** these are stronger, each quoted from the vendor's own page on the date shown.

### Claude Code's Manual mode, which prompts before shell commands

Keep Manual mode (default) for this kind of work, or add ask rules for installers such as Bash(npm install *) and Bash(pip install *).

> “Bash commands | Shell execution | Approval required: Yes, except a built-in set of read-only commands.”

[code.claude.com/docs/en/permissions](https://code.claude.com/docs/en/permissions) · read 8 October 2026

### Claude Code's Bash sandbox, around every command and the processes it starts

Turn the sandbox on (/sandbox) and keep its file and network limits narrow.

> “The Bash sandbox is a boundary that the operating system enforces around the shell commands Claude runs on your machine. … While the sandbox is on, the shell commands Claude runs start inside its boundary, and so do the processes they start. The sandbox is off by default.”

[code.claude.com/docs/en/sandboxing](https://code.claude.com/docs/en/sandboxing) · read 8 October 2026

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
