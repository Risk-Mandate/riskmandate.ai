<!-- Generated from rules/change-its-own-permissions.html by scripts/site/generate.mjs. Edit the page, not this file. -->

# RiskMandate — Do you want your agent to change its own permissions?

Rule RM-R0015: A command was blocked, so it adds an allow rule to its settings, or switches confirmations off to save you clicks. The next session starts with fewer checks, and you did not decide that. What you get: Only you change what the agent may do without asking. The one line to paste, what it honestly is, the stronger barriers with their sources, and where the capability is a row in a published behaviour policy.

Source: https://riskmandate.ai/rules/change-its-own-permissions.html

---

# Do you want your agent to change its own permissions?

A command was blocked, so it adds an allow rule to its settings, or switches confirmations off to save you clicks. The next session starts with fewer checks, and you did not decide that.

**What you get:** Only you change what the agent may do without asking.

**The capability:** Change its own permission settings (`grant.credential.self`). **Undo:** undone by the same actor with no loss.

**All rules:** [the index](/rules/) · **This page as markdown:** [change-its-own-permissions.md](/rules/change-its-own-permissions.md)

## Paste this into your agent's instructions, and it should not do it.

For Claude Code, that is `CLAUDE.md` in the project or in your home directory; for Claude on the web or the desktop, a project's instructions or your personal preferences. The one line is enough to try it; the paragraph tells the agent why, and what counts.

```
Never edit your own settings, permission rules or hooks (such as .claude/settings.json), or change how much you ask me; tell me what you would change and why.
```

```
Your permissions are mine to set. Do not edit settings files, permission rules, hooks or the permission mode, and do not add allow rules to get past a prompt. If a prompt is getting in the way, tell me which rule you would change and why, and I will decide.
```

## A request to the agent, not a control.

In the vocabulary every published behaviour policy uses, a line in the agent's instructions is an **expectation**: a rule in prose, enforced by nobody. A rule in prose is inside the boundary the agent operates in. All four major model providers stated in their own 2026 words that an instruction at this layer can be bypassed. It changes what the agent usually does, which is worth having; it does not hold when the agent is talked out of it, confused, or reading somebody else's instructions in a web page.

**If you want more than a request,** these are stronger, each quoted from the vendor's own page on the date shown.

### Claude Code's protected paths: writes to its own configuration are never auto-approved

Leave the permission mode on Manual, acceptEdits or auto; in dontAsk such writes are denied.

> “Writes to a small set of paths are never auto-approved, except in bypassPermissions mode and in interactive terminal sessions in plan mode with bypass permissions available. This prevents accidental corruption of repository state and Claude's own configuration.”

[code.claude.com/docs/en/permission-modes](https://code.claude.com/docs/en/permission-modes) · read 8 October 2026

### Managed settings, set by the organisation, outrank the user's and the project's

An organisation sets permissions in managed settings; a key set there overrides the same key in any file the agent can edit.

> “When the same key appears in more than one place, Claude Code uses the value from the highest level that sets it. … a key at a higher level overrides the same key anywhere below it. (Highest: managed settings, set by your organization.)”

[code.claude.com/docs/en/settings](https://code.claude.com/docs/en/settings) · read 8 October 2026

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
