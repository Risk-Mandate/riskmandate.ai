<!-- Generated from rules/send-data-anywhere.html by scripts/site/generate.mjs. Edit the page, not this file. -->

# RiskMandate — Do you want your agent to send your code or data to any site on the internet?

Rule RM-R0005: To share a log it pastes it into a public paste site; to test an idea it calls an API you have never heard of with your data in the request; to debug it uploads a file to an online tool. Once it has left, it has left. What you get: Data leaves only for the places the task needs, and you hear about any other place before anything is sent. The one line to paste, what it honestly is, the stronger barriers with their sources, and where the capability is a row in a published behaviour policy.

Source: https://riskmandate.ai/rules/send-data-anywhere.html

---

# Do you want your agent to send your code or data to any site on the internet?

To share a log it pastes it into a public paste site; to test an idea it calls an API you have never heard of with your data in the request; to debug it uploads a file to an online tool. Once it has left, it has left.

**What you get:** Data leaves only for the places the task needs, and you hear about any other place before anything is sent.

**The capability:** Reach any host on the internet (`send.endpoint.world`). **Undo:** cannot be undone.

**All rules:** [the index](/rules/) · **This page as markdown:** [send-data-anywhere.md](/rules/send-data-anywhere.md)

## Paste this into your agent's instructions, and it should ask you first.

For Claude Code, that is `CLAUDE.md` in the project or in your home directory; for Claude on the web or the desktop, a project's instructions or your personal preferences. The one line is enough to try it; the paragraph tells the agent why, and what counts.

```
Before sending any file, code or data to a host outside this project's usual tools (uploads, pastes, webhooks, unfamiliar APIs), tell me where and what, and wait for a yes.
```

```
Treat sending data out of this machine as a decision of mine. Fetching documentation or packages the project already uses is fine. Uploading files, pasting content into online tools, calling APIs this project does not already call, posting to webhooks, or sending logs or data anywhere new needs my yes: tell me the host, what would be sent, and why, then wait.
```

## A request to the agent, not a control.

In the vocabulary every published behaviour policy uses, a line in the agent's instructions is an **expectation**: a rule in prose, enforced by nobody. A rule in prose is inside the boundary the agent operates in. All four major model providers stated in their own 2026 words that an instruction at this layer can be bypassed. It changes what the agent usually does, which is worth having; it does not hold when the agent is talked out of it, confused, or reading somebody else's instructions in a web page.

**If you want more than a request,** these are stronger, each quoted from the vendor's own page on the date shown.

### Deny rules on the shell's network tools, with WebFetch allowed only for named domains

```
{
  "permissions": {
    "deny": [
      "Bash(curl *)",
      "Bash(wget *)"
    ],
    "allow": [
      "WebFetch(domain:github.com)"
    ]
  }
}
```

> “Restrict Bash network tools: use deny rules to stop curl, wget, and similar commands, then use the WebFetch tool with WebFetch(domain:github.com) permission for allowed domains. A deny rule doesn't match the same program by path or inside sh -c, so pair it with the sandbox network allowlist when the restriction must hold.”

[code.claude.com/docs/en/permissions](https://code.claude.com/docs/en/permissions) · read 8 October 2026

### Claude Code's Bash sandbox, with its network allowlist

Turn the sandbox on and list only the hosts the work needs under sandbox.network.allowedDomains. It covers shell commands and the processes they start; WebFetch follows permission rules instead.

> “Network: No direct route out. Connections go through a proxy on your machine that checks each host against your allowed domains, which start empty. … allowedDomains doesn't limit WebFetch.”

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
