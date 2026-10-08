<!-- Generated from rules/start-other-agents.html by scripts/site/generate.mjs. Edit the page, not this file. -->

# RiskMandate — Do you want your agent to start other agent sessions on its own?

Rule RM-R0018: To finish faster it starts more sessions, or schedules one to carry on later. Each has the same access, and nobody is watching them. What you get: Every agent running for you is one you said yes to, with a way to stop it. The one line to paste, what it honestly is, the stronger barriers with their sources, and where the capability is a row in a published behaviour policy.

Source: https://riskmandate.ai/rules/start-other-agents.html

---

# Do you want your agent to start other agent sessions on its own?

To finish faster it starts more sessions, or schedules one to carry on later. Each has the same access, and nobody is watching them.

**What you get:** Every agent running for you is one you said yes to, with a way to stop it.

**The capability:** Create something that outlives the session, on the platform (a routine, a scheduled trigger, a new session) (`create.schedule.tenant`). **Undo:** undone by the same actor with no loss.

**All rules:** [the index](/rules/) · **This page as markdown:** [start-other-agents.md](/rules/start-other-agents.md)

## Paste this into your agent's instructions, and it should ask you first.

For Claude Code, that is `CLAUDE.md` in the project or in your home directory; for Claude on the web or the desktop, a project's instructions or your personal preferences. The one line is enough to try it; the paragraph tells the agent why, and what counts.

```
Do not start other sessions or background agents that keep running after this one without asking me first; tell me what each will do and how to stop it.
```

```
Helpers that finish inside this session are fine. Starting a new session, a routine, or any agent that runs after this one ends needs my yes: tell me what it will do, what it can reach, when it stops, and how I can stop it, then wait.
```

## A request to the agent, not a control.

In the vocabulary every published behaviour policy uses, a line in the agent's instructions is an **expectation**: a rule in prose, enforced by nobody. A rule in prose is inside the boundary the agent operates in. All four major model providers stated in their own 2026 words that an instruction at this layer can be bypassed. It changes what the agent usually does, which is worth having; it does not hold when the agent is talked out of it, confused, or reading somebody else's instructions in a web page.

**If you want more than a request,** these are stronger, each quoted from the vendor's own page on the date shown.

### An ask rule in Claude Code's settings on the tool that creates routines and sessions on claude.ai

```
{
  "permissions": {
    "ask": [
      "RemoteTrigger"
    ]
  }
}
```

> “Ask rules prompt for confirmation whenever Claude Code tries to use the specified tool. (The tools reference: RemoteTrigger creates, updates, runs, and lists Routines on claude.ai, with Permission required: No.)”

[code.claude.com/docs/en/permissions](https://code.claude.com/docs/en/permissions) · [code.claude.com/docs/en/tools-reference](https://code.claude.com/docs/en/tools-reference) · read 8 October 2026

## This is a row in 2 published behaviour policies, with what stands in the way today.

Read from each vault's own grant, as published. The barrier is what was found in that deployment, before any rule.

## Not run yet. It will be, on our own deployment.

Every rule gets one run without the line and one with it, on a deployment we are entitled to run, dated, stopped before anything irreversible. [How these are run.](/rules/method.html)

## Tell us, and the rule gets better.

Each link opens the contact form with this rule's id and version filled in. It is encrypted in your browser and read by a person. Nothing is sent until you press send.

## A rule is one row. The ABP is every row, for your agent.

If this one made sense, the Agent Behaviour Policy is the same idea for everything your agent can reach: what it can do, what you authorised, the gap, and what stands in the way of each thing.

Versions

- **v1.0.0** · 8 October 2026 · First version, written from the published rows with nothing in the way.
