<!-- Generated from agent-behaviour-policy.html by scripts/site/generate.mjs. Edit the page, not this file. -->

# RiskMandate — Agent Behaviour Policies, one vault per application

A directory of behaviour-policy template vaults, one per target application, each read live in the browser from the encrypted vault with a published read key: the four counts, every row with its barrier, the vault’s own app, and the files you hand the agent.

Source: https://riskmandate.ai/agent-behaviour-policy.html

---

# Agent Behaviour Policies, as building blocks.

An **Agent Behaviour Policy** describes one AI agent in one deployment: everything it can do (the grant), what you actually authorised (the mandate), the gap between the two (the delta), and what really stands in the way of each thing (the barrier). It describes and it does not judge, so it carries no score. Below are the example policies we have built, one per target application — for most people the first they will have seen. Click one to read it here; a real deployment is a combination of several.

## Pick a behaviour policy. Read it here. Open its vault.

Every tile is one Agent Behaviour Policy, delivered as a vault: a measured or documented grant for that application, a starting mandate written to be corrected, six scenarios that change the mandate and never the grant, and the files you hand the agent. The counts are read from the vault as you look. Grid or list, same set; search matches names, vendors, scopes, tool names and the 23 capability ids, so `send.message.world` finds every policy that can send mail whatever the product calls it. Not here yet? [See what is next, vote, or suggest one](agent-behaviour-policy-next.html).

### [Claude Code on the web](abp-vault-claude-code-web.html)

A managed, ephemeral container with one repository attached and an egress proxy above it. The shape this site is maintained from; 13 of 20 rows measured on the thing itself.

### [Claude Code on your machine](abp-vault-claude-code-cli.html)

The coding agent on a developer's own machine with confirmation prompts enabled. Read this one beside the confirmations-off shape: one setting moves one barrier and not one number changes.

### [Claude Code, confirmations off](abp-vault-claude-code-cli-confirmations-off.html)

The same agent, the same machine, the same account, with the confirmation prompt switched off. The prompt was the only thing between an authorised capability and the whole machine, and it was a switch the agent's account could flip.

### [Claude Desktop](abp-vault-claude-desktop.html)

The desktop app with local tools on: files, processes and the network of the machine it sits on. Ten capabilities, three wanted, eight with nothing real in the way.

### [Claude in the browser, connectors on](abp-vault-claude-web-connectors.html)

Chat with connectors enabled: the tenant's accounts are in reach through whatever was connected. The two excess rows here both sit behind a boundary, which is the exception in this directory.

### [ChatGPT in the browser](abp-vault-chatgpt-web.html)

The smallest grant in the set: one capability, one wanted, no excess. The baseline every other shape is measured against, and the proof that a template can be empty and still be right.

### [A browser extension](abp-vault-browser-extension.html)

Other people's data, and the mandate nobody wrote down. Three capabilities, all three irreversible; the shortest policy in the directory and not the mildest.

### [GitHub Actions](abp-vault-github-actions.html)

A hosted runner under a service account: persistence, and reach beyond the turn. Eight of eight rows measured, the only fully measured shape besides the web container.

### [A scheduled job](abp-vault-scheduled-job.html)

A job that outlives the person who made it, running as a service account nobody logs in as. Seven capabilities, four wanted, four with nothing in the way.

### [n8n, owner API key](abp-vault-n8n-owner-api-key.html)

The first grant here measured on a live instance, by an early beta user's agent: full control of every automation, an outbound node with no restriction on target, every account visible, and credential metadata open through one door and shut through another.

### [Google Workspace MCP servers](abp-vault-google-workspace-mcp.html)

Gmail, Drive, Docs, Sheets, Slides, Calendar and Chat, one server each. The page advertises drafting mail and scheduling meetings; the scopes it asks for send mail and cannot touch a calendar.

### [Claude's Gmail connector](abp-vault-claude-gmail-connector.html)

Search and read carry no approval prompt; send, reply and forward do, on by default — a setting the account, or an org owner, can turn off. The consent screen already permits sending before the prompt is ever removed. Four of six rows measured on an account the deployer runs; permanent deletion measured as out of reach.

### [Gmail, read-only scope](abp-vault-gmail-readonly.html)

The narrowest scope that reads one message reads every message. Lab 03 asked the model site for this shape first; here it is, read from Google's scope page.

### [Google Drive, read-only scope](abp-vault-google-drive-readonly.html)

The default corpus is "files owned by or shared to the user": everything anybody ever shared, on day one, without anyone choosing it.

### [Microsoft 365 connector (Claude)](abp-vault-claude-m365-connector.html)

Delegated permissions, consented once by a Global Administrator. Shared mailboxes are in scope; site-specific narrowing is unsupported because the search is tenant-wide; and the page that says "read-only access" also lists the tools that send mail as the user.

### [Dropbox MCP server](abp-vault-dropbox-mcp.html)

Eight scopes, two of them write and two of them sharing, and no folder-scoped variant. It reads, creates, moves, deletes and makes shared links; the page says files are not deleted permanently and that recovery depends on your plan.

Nothing matches. Search matches names, vendors, scopes, tools and capability ids — try a shorter word.

Missing the one you run? [8 are asked for — vote on which is next, or suggest one](agent-behaviour-policy-next.html). Every vault also carries `MAP-A-GRANT.md`: give it to an agent that already holds the credential and it measures its own grant.

## Pick the policies your deployment is made of. Then correct the mandate.

Everything else in the vault is derived. The correction is the elicitation, and the corrected combination — with a name on the licence and no public key — is what is sold.
