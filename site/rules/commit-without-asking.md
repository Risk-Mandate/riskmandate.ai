<!-- Generated from rules/commit-without-asking.html by scripts/site/generate.mjs. Edit the page, not this file. -->

# RiskMandate — Do you want your agent to rewrite your repository's history?

Rule RM-R0019: To tidy up it amends your last commit, rebases the branch, or resets to a clean state, and the uncommitted work you had in progress is gone. What you get: Your history and your uncommitted work are left as you left them, unless you say otherwise. The one line to paste, what it honestly is, the stronger barriers with their sources, and where the capability is a row in a published behaviour policy.

Source: https://riskmandate.ai/rules/commit-without-asking.html

---

# Do you want your agent to rewrite your repository's history?

To tidy up it amends your last commit, rebases the branch, or resets to a clean state, and the uncommitted work you had in progress is gone.

**What you get:** Your history and your uncommitted work are left as you left them, unless you say otherwise.

**The capability:** Commit to the repository it was pointed at (`write.repository.project`). **Undo:** recoverable from a backup, a history or a revert, at a cost.

**All rules:** [the index](/rules/) · **This page as markdown:** [commit-without-asking.md](/rules/commit-without-asking.md)

## Paste this into your agent's instructions, and it should ask you first.

For Claude Code, that is `CLAUDE.md` in the project or in your home directory; for Claude on the web or the desktop, a project's instructions or your personal preferences. The one line is enough to try it; the paragraph tells the agent why, and what counts.

```
Ask before committing, and never rewrite history (rebase, amend, reset --hard) or discard my uncommitted changes.
```

```
Make new commits only when I ask, with messages that say what changed. Never amend, rebase, squash, reset --hard, checkout over changed files, stash or clean my working tree without asking: tell me exactly what would be lost and wait for a yes.
```

## A request to the agent, not a control.

In the vocabulary every published behaviour policy uses, a line in the agent's instructions is an **expectation**: a rule in prose, enforced by nobody. A rule in prose is inside the boundary the agent operates in. All four major model providers stated in their own 2026 words that an instruction at this layer can be bypassed. It changes what the agent usually does, which is worth having; it does not hold when the agent is talked out of it, confused, or reading somebody else's instructions in a web page.

**If you want more than a request,** these are stronger, each quoted from the vendor's own page on the date shown.

### Ask rules on the history-rewriting git commands in Claude Code's settings

```
{
  "permissions": {
    "ask": [
      "Bash(git reset *)",
      "Bash(git rebase *)",
      "Bash(git commit --amend*)",
      "Bash(git clean *)"
    ]
  }
}
```

> “Deny and ask rules apply when any subcommand matches them, including a command nested inside a subshell, a command substitution, or a control-flow body such as a for loop. An ask rule like Bash(git clean *) still prompts you for cd /tmp && git clean -f. (The same page: a Bash rule matches the command text Claude writes, so a deny or ask rule covers the invocation Claude usually produces and isn't a security boundary around the program.)”

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
