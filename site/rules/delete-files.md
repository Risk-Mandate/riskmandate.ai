<!-- Generated from rules/delete-files.html by scripts/site/generate.mjs. Edit the page, not this file. -->

# RiskMandate — Do you want your agent to delete files without asking?

Rule RM-R0007: It tidies up what it thinks are temporary files, or clears a folder to start again, and one of them was yours. A deleted file outside version control does not come back. What you get: Nothing you made is deleted without a yes, and nothing outside the project is deleted at all. The one line to paste, what it honestly is, the stronger barriers with their sources, and where the capability is a row in a published behaviour policy.

Source: https://riskmandate.ai/rules/delete-files.html

---

# Do you want your agent to delete files without asking?

It tidies up what it thinks are temporary files, or clears a folder to start again, and one of them was yours. A deleted file outside version control does not come back.

**What you get:** Nothing you made is deleted without a yes, and nothing outside the project is deleted at all.

**The capability:** Delete files anywhere the account can reach (`delete.file.host`). **Undo:** cannot be undone.

**All rules:** [the index](/rules/) · **This page as markdown:** [delete-files.md](/rules/delete-files.md)

## Paste this into your agent's instructions, and it should ask you first.

For Claude Code, that is `CLAUDE.md` in the project or in your home directory; for Claude on the web or the desktop, a project's instructions or your personal preferences. The one line is enough to try it; the paragraph tells the agent why, and what counts.

```
Ask before deleting any file or folder you did not create in this session, and never run rm -rf or delete anything outside this project.
```

```
Deleting is the one change I cannot take back. Files you created in this session you may remove. Anything else, inside the project or out of it, needs my yes: list what you would delete and why. Never run rm -rf, never delete outside this project's folder, and never clear a directory to start again without asking.
```

## A request to the agent, not a control.

In the vocabulary every published behaviour policy uses, a line in the agent's instructions is an **expectation**: a rule in prose, enforced by nobody. A rule in prose is inside the boundary the agent operates in. All four major model providers stated in their own 2026 words that an instruction at this layer can be bypassed. It changes what the agent usually does, which is worth having; it does not hold when the agent is talked out of it, confused, or reading somebody else's instructions in a web page.

**If you want more than a request,** these are stronger, each quoted from the vendor's own page on the date shown.

### An ask rule on rm in Claude Code's settings

```
{
  "permissions": {
    "ask": [
      "Bash(rm *)"
    ]
  }
}
```

> “A deny or ask rule matches past any leading assignment, so Bash(rm *) in deny still matches FOO=bar rm -rf tmp/. (The same page: a Bash rule matches the command text Claude writes, so a deny or ask rule covers the invocation Claude usually produces and isn't a security boundary around the program.)”

[code.claude.com/docs/en/permissions](https://code.claude.com/docs/en/permissions) · read 8 October 2026

### Claude Code's Bash sandbox, which limits where shell commands can write

Turn the sandbox on (/sandbox). Shell commands, and the processes they start, can then write only inside the working directory and a few named places.

> “By default, sandboxed commands can write to the current working directory, the per-user temp directory, and any directories you've added with --add-dir, /add-dir, or permissions.additionalDirectories. … The sandbox is off by default.”

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
