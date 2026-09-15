<!-- Generated from agent-behaviour-policy.html by scripts/site/generate.mjs. Edit the page, not this file. -->

# RiskMandate — Agent Behaviour Policies, one vault per application

A directory of behaviour-policy template vaults, one per target application, each read live in the browser from the encrypted vault with a published read key: the four counts, every row with its barrier, the vault’s own app, and the files you hand the agent.

Source: https://riskmandate.ai/agent-behaviour-policy.html

---

# Every policy we have, as building blocks.

One template policy per target application, and one per business function. Click any of them to preview it here — the card, the grant against the mandate, the scenarios — then open its vault or its page. A real deployment is a combination of these, and the combination is what we sell.

## Pick a policy. Preview it here. Open its vault.

Every tile is a vault: a measured or documented grant for that application, a starting mandate written to be corrected, six scenarios that change the mandate and never the grant, and the files you hand the agent. The counts are read from the vault as you look. Grid or list, same set; search matches names, vendors, scopes, tool names and the 23 capability ids, so `send.message.world` finds every policy that can send mail whatever the product calls it.

### Claude Code on the web

A managed, ephemeral container with one repository attached and an egress proxy above it. The shape this site is maintained from; 13 of 20 rows measured on the thing itself.

### Claude Code on your machine

The coding agent on a developer's own machine with confirmation prompts enabled. Read this one beside the confirmations-off shape: one setting moves one barrier and not one number changes.

### Claude Code, confirmations off

The same agent, the same machine, the same account, with the confirmation prompt switched off. The prompt was the only thing between an authorised capability and the whole machine, and it was a switch the agent's account could flip.

### Claude Desktop

The desktop app with local tools on: files, processes and the network of the machine it sits on. Ten capabilities, three wanted, eight with nothing real in the way.

### Claude in the browser, connectors on

Chat with connectors enabled: the tenant's accounts are in reach through whatever was connected. The two excess rows here both sit behind a boundary, which is the exception in this directory.

### ChatGPT in the browser

The smallest grant in the set: one capability, one wanted, no excess. The baseline every other shape is measured against, and the proof that a template can be empty and still be right.

### A browser extension

Other people's data, and the mandate nobody wrote down. Three capabilities, all three irreversible; the shortest policy in the directory and not the mildest.

### GitHub Actions

A hosted runner under a service account: persistence, and reach beyond the turn. Eight of eight rows measured, the only fully measured shape besides the web container.

### A scheduled job

A job that outlives the person who made it, running as a service account nobody logs in as. Seven capabilities, four wanted, four with nothing in the way.

### n8n, owner API key

The first grant here measured on a live instance, by an early beta user's agent: full control of every automation, an outbound node with no restriction on target, every account visible, and credential metadata open through one door and shut through another.

### Google Workspace MCP servers

Gmail, Drive, Docs, Sheets, Slides, Calendar and Chat, one server each. The page advertises drafting mail and scheduling meetings; the scopes it asks for send mail and cannot touch a calendar.

### Gmail, read-only scope

The narrowest scope that reads one message reads every message. Lab 03 asked the model site for this shape first; here it is, read from Google's scope page.

### Google Drive, read-only scope

The default corpus is "files owned by or shared to the user": everything anybody ever shared, on day one, without anyone choosing it.

### Microsoft 365 connector (Claude)

Delegated permissions, consented once by a Global Administrator. Shared mailboxes are in scope; site-specific narrowing is unsupported because the search is tenant-wide; and the page that says "read-only access" also lists the tools that send mail as the user.

### Dropbox MCP server

Eight scopes, two of them write and two of them sharing, and no folder-scoped variant. It reads, creates, moves, deletes and makes shared links; the page says files are not deleted permanently and that recovery depends on your plan.

### Claude's Google Workspace connector

Gmail, Calendar and Drive from inside Claude. The connector's scope list has not been read yet; the Google pages behind it have.

### An assistant connected to Slack

Channels are mostly other people's writing, and a bot token reaches every channel it is in.

### An assistant connected to GitHub

A fine-grained token can be scoped to a repository; an OAuth app cannot, and most connectors are OAuth apps.

### An assistant connected to Notion

An integration is added page by page, which is the one connector model with a floor. Whether the assistant's connector uses it is the question.

### An assistant connected to Salesforce

A CRM is entirely third-party material by construction.

### Access to the CRM

Customer records are third-party material by construction. Salesforce, HubSpot, Dynamics.

### The customer-service desk

Tickets, and the conversations inside them. Zendesk, Intercom, Freshdesk.

### Finance data

Spreadsheets, ledgers and the exports beside them. Sheets, Excel, NetSuite.

Nothing matches. Search matches names, vendors, scopes, tools and capability ids — try a shorter word.

## The next policies, and what each one waits for.

A vault is built from a measured or documented grant, never typed. The connectors above marked _not yet researched_ become vaults once their vendor pages have been read and quoted, the way the five connector vaults were. The business functions are a different axis: a policy for what the agent is _for_ — the CRM, the service desk, the finance data — whichever product holds it. The mandate is the same across products; the grant is per product; each becomes a vault once one product's grant is documented for it. Nothing here is invented to fill a grid.

- **A documented grant is not a measured one.** The connector vaults stand at the _documented_ tier: every row quotes a vendor page and names its date, nothing was tested, and the rows a page could not settle are counted on the tile as open questions. A measured row needs a system we are entitled to run, and probing somebody else's is out of bounds here with no research exemption.
- **Every deployment is a combination.** An agent's own policy, plus one per connector it holds, plus the business function it serves. The templates are the building blocks; the combination — with its merged grant and a corrected mandate — is what a deployment's policy is made of, and what is sold.
- **Run something that is not here?** Every vault carries `MAP-A-GRANT.md`: give it to an agent that already holds the credential and it measures its own grant and drafts the first policy. Send us what it finds; that is how a new application gets its tile.

## Ciphertext in, decrypted here, and always the current commit.

The vault API answers plain cross-origin GETs with no auth header, because what it returns is ciphertext under a key the server has never held. This page derives each vault's HEAD address from its read key, fetches the ref, the commit, the tree and the blobs it needs, and decrypts them in your browser. A push to a vault is live on the next page load — no rebuild of this site.

- **The viewer is the site's. The data is the vault's.** Every string from a vault is rendered as text, never as markup. A vault's app runs only inside a sandboxed frame with an opaque origin, served its reads over a message channel, and never sees a key.
- **Immutable objects are cached; the ref never is.** A stale ref would render an older commit from perfectly valid ciphertext and nothing would error, so the page fetches it fresh every time.
- **The read keys are printed, on purpose.** Each is derived one-way from its vault's write key and cannot be turned back into it. Anyone can clone a vault with it and check what its page says against the bytes.
- **The reader is copied, not fetched.** It is sgit.ai's house reader, about ninety lines, in each page's own source — the brief that documents it says to copy it rather than load it across origins at runtime.

The mechanism is written up at [sgit.ai — reading one file out of a vault](https://sgit.ai/docs/vault/reading-a-vault-file.html), the rules for a site page that embeds a vault at [sgit.ai — guidance](https://sgit.ai/docs/guidance/index.html).

## Pick the policies your deployment is made of. Then correct the mandate.

Everything else in the vault is derived. The correction is the elicitation, and the corrected combination — with a name on the licence and no public key — is what is sold.
