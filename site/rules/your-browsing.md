<!-- Generated from rules/your-browsing.html by scripts/site/generate.mjs. Edit the page, not this file. -->

# RiskMandate — Do you want your agent to read every page you visit?

Rule RM-R0011: You asked it about one page. It can see your other tabs and your history: your bank, your health searches, the document you had open in another window. What you get: The agent works on the page you point it at, and the rest of your browsing stays yours. The one line to paste, what it honestly is, the stronger barriers with their sources, and where the capability is a row in a published behaviour policy.

Source: https://riskmandate.ai/rules/your-browsing.html

---

# Do you want your agent to read every page you visit?

You asked it about one page. It can see your other tabs and your history: your bank, your health searches, the document you had open in another window.

**What you get:** The agent works on the page you point it at, and the rest of your browsing stays yours.

**The capability:** Read every page you visit (`read.record.browsing`). **Undo:** cannot be undone.

**All rules:** [the index](/rules/) · **This page as markdown:** [your-browsing.md](/rules/your-browsing.md)

## Paste this into your agent's instructions, and it should not do it.

For Claude Code, that is `CLAUDE.md` in the project or in your home directory; for Claude on the web or the desktop, a project's instructions or your personal preferences. The one line is enough to try it; the paragraph tells the agent why, and what counts.

```
Only read the page I point you at; do not read, summarise or use my other tabs or my browsing history.
```

```
Work only on the page I am asking about. Do not open, read or summarise my other tabs, my history, my bookmarks or pages I visited earlier, even if they look relevant. If another page would help, tell me which and why, and let me open it for you.
```

## A request to the agent, not a control.

In the vocabulary every published behaviour policy uses, a line in the agent's instructions is an **expectation**: a rule in prose, enforced by nobody. A rule in prose is inside the boundary the agent operates in. All four major model providers stated in their own 2026 words that an instruction at this layer can be bypassed. It changes what the agent usually does, which is worth having; it does not hold when the agent is talked out of it, confused, or reading somebody else's instructions in a web page.

**We have not found a stronger barrier** for this one in the vendor's documentation. If you know of one, tell us below.

## This is a row in a published behaviour policy, with what stands in the way today.

Read from each vault's own grant, as published. The barrier is what was found in that deployment, before any rule.

## Not run yet. It will be, on our own deployment.

Every rule gets one run without the line and one with it, on a deployment we are entitled to run, dated, stopped before anything irreversible. [How these are run.](/rules/method.html)

## Tell us, and the rule gets better.

Each link opens the contact form with this rule's id and version filled in. It is encrypted in your browser and read by a person. Nothing is sent until you press send.

## A rule is one row. The ABP is every row, for your agent.

If this one made sense, the Agent Behaviour Policy is the same idea for everything your agent can reach: what it can do, what you authorised, the gap, and what stands in the way of each thing.

Versions

- **v1.0.0** · 8 October 2026 · First version, written from the published rows with nothing in the way.
