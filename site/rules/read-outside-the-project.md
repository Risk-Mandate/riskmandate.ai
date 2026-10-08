<!-- Generated from rules/read-outside-the-project.html by scripts/site/generate.mjs. Edit the page, not this file. -->

# RiskMandate — Do you want your agent to read files outside the project you gave it?

Rule RM-R0006: It needs one example config and goes looking through your home folder: other clients' projects, your documents, your downloads. Nothing is changed, and everything it read is now in a transcript. What you get: The agent works inside the folder you opened, and reads anywhere else only when you hand it the path. The one line to paste, what it honestly is, the stronger barriers with their sources, and where the capability is a row in a published behaviour policy.

Source: https://riskmandate.ai/rules/read-outside-the-project.html

---

# Do you want your agent to read files outside the project you gave it?

It needs one example config and goes looking through your home folder: other clients' projects, your documents, your downloads. Nothing is changed, and everything it read is now in a transcript.

**What you get:** The agent works inside the folder you opened, and reads anywhere else only when you hand it the path.

**The capability:** Read any file the account can reach (`read.file.host`). **Undo:** cannot be undone.

**All rules:** [the index](/rules/) · **This page as markdown:** [read-outside-the-project.md](/rules/read-outside-the-project.md)

## Paste this into your agent's instructions, and it should not do it.

For Claude Code, that is `CLAUDE.md` in the project or in your home directory; for Claude on the web or the desktop, a project's instructions or your personal preferences. The one line is enough to try it; the paragraph tells the agent why, and what counts.

```
Stay inside this project's folder: do not read files elsewhere on my machine unless I give you the path.
```

```
This session is about this project. Do not list, search or read files outside its folder: not my home directory, other projects, documents, downloads or system files. If something outside would help, tell me what you are looking for and let me give you the path.
```

## A request to the agent, not a control.

In the vocabulary every published behaviour policy uses, a line in the agent's instructions is an **expectation**: a rule in prose, enforced by nobody. A rule in prose is inside the boundary the agent operates in. All four major model providers stated in their own 2026 words that an instruction at this layer can be bypassed. It changes what the agent usually does, which is worth having; it does not hold when the agent is talked out of it, confused, or reading somebody else's instructions in a web page.

**If you want more than a request,** these are stronger, each quoted from the vendor's own page on the date shown.

### Claude Code prompts before its file tools read outside the working directory, and a setting extends that to read-only shell commands

Leave Manual mode on for reads outside the project, and set permissions.blockReadsOutsideWorkingDirectories so that read-only shell commands such as cat and ls do not get round it.

> “File-access tools marked No, including Read, Grep, and Glob, still prompt for paths outside the working directory and additional directories. (The permissions page: Claude Code recognizes a built-in set of Bash commands as read-only and runs them without a permission prompt in every mode, except as permissions.blockReadsOutsideWorkingDirectories changes for paths outside your working directories.)”

[code.claude.com/docs/en/tools-reference](https://code.claude.com/docs/en/tools-reference) · [code.claude.com/docs/en/permissions](https://code.claude.com/docs/en/permissions) · read 8 October 2026

### Claude Code's Bash sandbox, with the paths listed in its denyRead setting

Turn the sandbox on (/sandbox) and list the paths under sandbox.filesystem.denyRead. It holds for shell commands and every process they start; Claude's own Read tool runs outside it, so keep the Read deny rule as well.

> “The Bash sandbox is a boundary that the operating system enforces around the shell commands Claude runs on your machine. … The sandbox is off by default. … Reads: Most of the machine, including credential files such as ~/.ssh and ~/.aws/credentials. … A denyRead entry doesn't stop the Read tool.”

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
