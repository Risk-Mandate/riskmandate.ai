<!-- Generated from rules/publish-under-your-name.html by scripts/site/generate.mjs. Edit the page, not this file. -->

# RiskMandate — Do you want your agent to publish packages, images or releases under your name?

Rule RM-R0009: To check the release works, it runs the publish command. Now a package, an image or a release is out under your name, and people can download it before you have looked at it. What you get: Nothing goes out under your name unless you asked for that publish, in that message. The one line to paste, what it honestly is, the stronger barriers with their sources, and where the capability is a row in a published behaviour policy.

Source: https://riskmandate.ai/rules/publish-under-your-name.html

---

# Do you want your agent to publish packages, images or releases under your name?

To check the release works, it runs the publish command. Now a package, an image or a release is out under your name, and people can download it before you have looked at it.

**What you get:** Nothing goes out under your name unless you asked for that publish, in that message.

**The capability:** Publish packages, images or pages under the name it holds (`create.record.world`). **Undo:** cannot be undone.

**All rules:** [the index](/rules/) · **This page as markdown:** [publish-under-your-name.md](/rules/publish-under-your-name.md)

## Paste this into your agent's instructions, and it should not do it.

For Claude Code, that is `CLAUDE.md` in the project or in your home directory; for Claude on the web or the desktop, a project's instructions or your personal preferences. The one line is enough to try it; the paragraph tells the agent why, and what counts.

```
Never publish anything (npm publish, docker push, a GitHub release, a deploy to production) unless I ask for that specific publish in this message.
```

```
Publishing puts something out under my name that I cannot fully take back. Build, test and package as much as you like, locally. Do not run a publish, push an image, create a release or deploy to production unless I ask for that specific one in the current message; an earlier yes does not carry over.
```

## A request to the agent, not a control.

In the vocabulary every published behaviour policy uses, a line in the agent's instructions is an **expectation**: a rule in prose, enforced by nobody. A rule in prose is inside the boundary the agent operates in. All four major model providers stated in their own 2026 words that an instruction at this layer can be bypassed. It changes what the agent usually does, which is worth having; it does not hold when the agent is talked out of it, confused, or reading somebody else's instructions in a web page.

**If you want more than a request,** these are stronger, each quoted from the vendor's own page on the date shown.

### Deny rules on the publish commands in Claude Code's settings

```
{
  "permissions": {
    "deny": [
      "Bash(npm publish *)",
      "Bash(docker push *)",
      "Bash(gh release create *)"
    ]
  }
}
```

> “Deny rules prevent Claude Code from using the specified tool. (The same page: a Bash rule matches the command text Claude writes, so a deny or ask rule covers the invocation Claude usually produces and isn't a security boundary around the program.)”

[code.claude.com/docs/en/permissions](https://code.claude.com/docs/en/permissions) · read 8 October 2026

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
