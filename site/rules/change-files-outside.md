<!-- Generated from rules/change-files-outside.html by scripts/site/generate.mjs. Edit the page, not this file. -->

# RiskMandate — Do you want your agent to change files outside the project?

Rule RM-R0014: To fix the build it edits your shell profile, your global git configuration, or a file in another project. The fix works here and something else breaks next week. What you get: Changes stay inside the project, where version control can show and undo them. The one line to paste, what it honestly is, the stronger barriers with their sources, and where the capability is a row in a published behaviour policy.

Source: https://riskmandate.ai/rules/change-files-outside.html

---

# Do you want your agent to change files outside the project?

To fix the build it edits your shell profile, your global git configuration, or a file in another project. The fix works here and something else breaks next week.

**What you get:** Changes stay inside the project, where version control can show and undo them.

**The capability:** Change any file the account can reach (`write.file.host`). **Undo:** recoverable from a backup, a history or a revert, at a cost.

**All rules:** [the index](/rules/) · **This page as markdown:** [change-files-outside.md](/rules/change-files-outside.md)

## Paste this into your agent's instructions, and it should not do it.

For Claude Code, that is `CLAUDE.md` in the project or in your home directory; for Claude on the web or the desktop, a project's instructions or your personal preferences. The one line is enough to try it; the paragraph tells the agent why, and what counts.

```
Do not create or change files outside this project's folder, including dotfiles and configuration in my home directory, unless I give you the path.
```

```
Keep every change inside this project, where I can see it in version control. Do not edit my shell profile, global git or tool configuration, files in other projects, or system files. If a fix needs a change outside, tell me the file and the change and let me make it or say yes.
```

## A request to the agent, not a control.

In the vocabulary every published behaviour policy uses, a line in the agent's instructions is an **expectation**: a rule in prose, enforced by nobody. A rule in prose is inside the boundary the agent operates in. All four major model providers stated in their own 2026 words that an instruction at this layer can be bypassed. It changes what the agent usually does, which is worth having; it does not hold when the agent is talked out of it, confused, or reading somebody else's instructions in a web page.

**If you want more than a request,** these are stronger, each quoted from the vendor's own page on the date shown.

### Edit deny rules in Claude Code's settings for paths outside the project

```
{
  "permissions": {
    "deny": [
      "Edit(~/**)"
    ]
  }
}
```

> “Claude Code checks file permissions against Edit(path) and Read(path) rules only. (And: File modification | Edit/write files | Approval required: Yes.)”

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
