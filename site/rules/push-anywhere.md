<!-- Generated from rules/push-anywhere.html by scripts/site/generate.mjs. Edit the page, not this file. -->

# RiskMandate — Do you want your agent to push to any branch, including main?

Rule RM-R0013: It finishes the change and pushes straight to main, or force-pushes over a colleague's branch to fix a conflict. The pipeline deploys it before anybody has read it. What you get: Work lands on the branch you named, and anything else waits for you. The one line to paste, what it honestly is, the stronger barriers with their sources, and where the capability is a row in a published behaviour policy.

Source: https://riskmandate.ai/rules/push-anywhere.html

---

# Do you want your agent to push to any branch, including main?

It finishes the change and pushes straight to main, or force-pushes over a colleague's branch to fix a conflict. The pipeline deploys it before anybody has read it.

**What you get:** Work lands on the branch you named, and anything else waits for you.

**The capability:** Push to a code host (any branch it can reach) (`write.repository.tenant`). **Undo:** recoverable from a backup, a history or a revert, at a cost.

**All rules:** [the index](/rules/) · **This page as markdown:** [push-anywhere.md](/rules/push-anywhere.md)

## Paste this into your agent's instructions, and it should ask you first.

For Claude Code, that is `CLAUDE.md` in the project or in your home directory; for Claude on the web or the desktop, a project's instructions or your personal preferences. The one line is enough to try it; the paragraph tells the agent why, and what counts.

```
Push only to the branch I named; never push to main or force-push, and ask before pushing anywhere else or opening a pull request.
```

```
Push only to the branch I gave you for this task. Never push to main or another protected branch, never force-push, and never delete a remote branch. Before pushing to any other branch or opening a pull request, tell me which and why, and wait for a yes.
```

## A request to the agent, not a control.

In the vocabulary every published behaviour policy uses, a line in the agent's instructions is an **expectation**: a rule in prose, enforced by nobody. A rule in prose is inside the boundary the agent operates in. All four major model providers stated in their own 2026 words that an instruction at this layer can be bypassed. It changes what the agent usually does, which is worth having; it does not hold when the agent is talked out of it, confused, or reading somebody else's instructions in a web page.

**If you want more than a request,** these are stronger, each quoted from the vendor's own page on the date shown.

### Deny rules on pushes to main and force-pushes in Claude Code's settings

```
{
  "permissions": {
    "deny": [
      "Bash(git push --force *)",
      "Bash(git push -f *)",
      "Bash(git push origin main*)"
    ]
  }
}
```

> “Deny rules prevent Claude Code from using the specified tool. (The same page: a Bash rule matches the command text Claude writes, so a deny or ask rule covers the invocation Claude usually produces and isn't a security boundary around the program.)”

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
