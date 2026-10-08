<!-- Generated from rules/read-all-your-mail.html by scripts/site/generate.mjs. Edit the page, not this file. -->

# RiskMandate — Do you want your agent to read through your mail and chats to find context?

Rule RM-R0016: You asked it to answer one email. To be thorough it searches years of your mail and chats: the HR thread, the personal one, the one about the deal that is not announced. What you get: The agent reads what the task is about, and asks before it goes looking wider. The one line to paste, what it honestly is, the stronger barriers with their sources, and where the capability is a row in a published behaviour policy.

Source: https://riskmandate.ai/rules/read-all-your-mail.html

---

# Do you want your agent to read through your mail and chats to find context?

You asked it to answer one email. To be thorough it searches years of your mail and chats: the HR thread, the personal one, the one about the deal that is not announced.

**What you get:** The agent reads what the task is about, and asks before it goes looking wider.

**The capability:** Read mail or chat it is connected to (`read.message.tenant`). **Undo:** cannot be undone.

**All rules:** [the index](/rules/) · **This page as markdown:** [read-all-your-mail.md](/rules/read-all-your-mail.md)

## Paste this into your agent's instructions, and it should ask you first.

For Claude Code, that is `CLAUDE.md` in the project or in your home directory; for Claude on the web or the desktop, a project's instructions or your personal preferences. The one line is enough to try it; the paragraph tells the agent why, and what counts.

```
Only read the messages, threads or documents I point you to; ask before searching my mail or chats more widely.
```

```
My mail and chats hold things that are not mine alone. Read the messages I name. If you need more context, tell me what you would search for and in which account, and wait for a yes. Never read threads labelled HR, legal, medical or personal unless I name them.
```

## A request to the agent, not a control.

In the vocabulary every published behaviour policy uses, a line in the agent's instructions is an **expectation**: a rule in prose, enforced by nobody. A rule in prose is inside the boundary the agent operates in. All four major model providers stated in their own 2026 words that an instruction at this layer can be bypassed. It changes what the agent usually does, which is worth having; it does not hold when the agent is talked out of it, confused, or reading somebody else's instructions in a web page.

**If you want more than a request,** these are stronger, each quoted from the vendor's own page on the date shown.

### An organisation's admin can set a claude.ai connector tool to ask

Set by the organisation's admin for each connector tool; the setting also reaches Claude Code sessions.

> “If your organization has set a claude.ai connector tool to ask and that setting reaches Claude Code in your session, allow rules for that tool don't take effect: Claude Code prompts on every call, even in auto and bypassPermissions modes.”

[code.claude.com/docs/en/permissions](https://code.claude.com/docs/en/permissions) · read 8 October 2026

## This is a row in 4 published behaviour policies, with what stands in the way today.

Read from each vault's own grant, as published. The barrier is what was found in that deployment, before any rule.

## Not run yet. It will be, on our own deployment.

Every rule gets one run without the line and one with it, on a deployment we are entitled to run, dated, stopped before anything irreversible. [How these are run.](/rules/method.html)

## Tell us, and the rule gets better.

Each link opens the contact form with this rule's id and version filled in. It is encrypted in your browser and read by a person. Nothing is sent until you press send.

## A rule is one row. The ABP is every row, for your agent.

If this one made sense, the Agent Behaviour Policy is the same idea for everything your agent can reach: what it can do, what you authorised, the gap, and what stands in the way of each thing.

Versions

- **v1.0.0** · 8 October 2026 · First version, written from the published rows with nothing in the way.
