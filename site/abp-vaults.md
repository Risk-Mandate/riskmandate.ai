<!-- Generated from abp-vaults.html by scripts/site/generate.mjs. Edit the page, not this file. -->

# RiskMandate — Agent Behaviour Policies, one vault per application

A directory of behaviour-policy template vaults, one per target application, each read live in the browser from the encrypted vault with a published read key: the four counts, every row with its barrier, the vault’s own app, and the files you hand the agent.

Source: https://riskmandate.ai/abp-vaults.html

---

# Which agent do you run?

Pick the application closest to yours. Each is a vault: a measured grant for that application, a starting mandate written to be corrected, the delta between them, and the files you hand the agent — with its own app, its own history, and a read key you can hand to anyone who asks how you govern it. The ones below are **templates**: free, public, derived from published data, and never scored. Yours is one of these with the mandate corrected, a name on the licence, and no public key.

## One vault per application. Derived, never authored, and the numbers are live.

Every tile is a deployment shape published at abp.sgit.ai and built into a vault by one command. The counts are read from the vault as you look: grant, wanted, excess, unbounded. Where a vault cannot be reached the tile says so and falls back to the copy served from this site.

### [Claude Code on the web](abp-vault-claude-code-web.html) ✓

A managed, ephemeral container with one repository attached and an egress proxy above it. The shape this site is maintained from; 13 of 20 rows measured on the thing itself.

### [Claude Code on your machine](abp-vault-claude-code-cli.html) ✓

The coding agent on a developer's own machine with confirmation prompts enabled. Read this one beside the confirmations-off shape: one setting moves one barrier and not one number changes.

### [Claude Code, confirmations off](abp-vault-claude-code-cli-confirmations-off.html) ✓

The same agent, the same machine, the same account, with the confirmation prompt switched off. The prompt was the only thing between an authorised capability and the whole machine, and it was a switch the agent's account could flip.

### [Claude Desktop](abp-vault-claude-desktop.html) ✓

The desktop app with local tools on: files, processes and the network of the machine it sits on. Ten capabilities, three wanted, eight with nothing real in the way.

### [Claude in the browser, connectors on](abp-vault-claude-web-connectors.html) ✓

Chat with connectors enabled: the tenant's accounts are in reach through whatever was connected. The two excess rows here both sit behind a boundary, which is the exception in this directory.

### [ChatGPT in the browser](abp-vault-chatgpt-web.html) ✓

The smallest grant in the set: one capability, one wanted, no excess. The baseline every other shape is measured against, and the proof that a template can be empty and still be right.

### [A browser extension](abp-vault-browser-extension.html) ✓

Other people's data, and the mandate nobody wrote down. Three capabilities, all three irreversible; the shortest policy in the directory and not the mildest.

### [GitHub Actions](abp-vault-github-actions.html) ✓

A hosted runner under a service account: persistence, and reach beyond the turn. Eight of eight rows measured, the only fully measured shape besides the web container.

### [A scheduled job](abp-vault-scheduled-job.html) ✓

A job that outlives the person who made it, running as a service account nobody logs in as. Seven capabilities, four wanted, four with nothing in the way.

### [Google Workspace MCP servers](abp-vault-google-workspace-mcp.html) ✓

Gmail, Drive, Docs, Sheets, Slides, Calendar and Chat, one server each. The page advertises drafting mail and scheduling meetings; the scopes it asks for send mail and cannot touch a calendar.

### [Gmail, read-only scope](abp-vault-gmail-readonly.html) ✓

The narrowest scope that reads one message reads every message. Lab 03 asked the model site for this shape first; here it is, read from Google's scope page.

### [Google Drive, read-only scope](abp-vault-google-drive-readonly.html) ✓

The default corpus is "files owned by or shared to the user": everything anybody ever shared, on day one, without anyone choosing it.

### [Microsoft 365 connector (Claude)](abp-vault-claude-m365-connector.html) ✓

Delegated permissions, consented once by a Global Administrator. Shared mailboxes are in scope; site-specific narrowing is unsupported because the search is tenant-wide; and the page that says "read-only access" also lists the tools that send mail as the user.

### [Dropbox MCP server](abp-vault-dropbox-mcp.html) ✓

Eight scopes, two of them write and two of them sharing, and no folder-scoped variant. It reads, creates, moves, deletes and makes shared links; the page says files are not deleted permanently and that recovery depends on your plan.

## The next connectors, and what each one waits for.

A vault is built from a measured or documented grant, never typed. The four connector shapes [Lab 03](lab-abp-requests.html) asked the model site for are built above, ahead of the model site, from the vendors' own pages read and quoted on a date — and each carries the questions those pages could not settle in its `RESEARCH-NEEDED.md`, written to be handed to an agent. These are the connectors whose pages have not been read yet. Nothing here is invented to fill a grid.

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

- **Mandates are per application, not per agent — to begin with.** The mandate in a template is really the mandate for a resource: a repository attached to a coding agent, a mailbox connected to an assistant. That is what makes the library reusable, and why the directory is organised by application rather than by model.
- **A documented grant is not a measured one.** The connector vaults stand at the _documented_ tier: every row quotes a vendor page and names its date, nothing was tested, and the rows a page could not settle are counted on the tile as open questions. A measured row needs a system we are entitled to run, and probing somebody else's is out of bounds here with no research exemption.
- **Run something that is not here?** The generator takes a grant and a mandate and does the rest. Ask the agent to check its own grant with the block at the end of any GRANT.md, and send us what it finds: that is how a new application gets its row.

## The same vault, at four altitudes.

Not every reader needs the tables. Each vault renders the same files at four levels of detail, and every level is derived from the same bytes — so the tile above and the row in an underwriter's spreadsheet cannot disagree.

### Four counts, no score

Grant, wanted, excess, unbounded — and the excess split by barrier. The shape of the Index card on the home page, with the one number that is not allowed removed.

### Every row, with its barrier

The grant irreversible-first, the delta in its three lists, the licence's conditions next to what enforces each. On each vault's page, rendered live.

### The vault's own interface

Opens on Start here: what this is, where the pieces go, what we want the agent to do beside what we do not, and three ways to hand it over — copy-and-paste, a zip, a PDF. Embedded on each vault's page in a sandboxed frame.

### The bytes themselves

Markdown for people, JSON for machines, the pinned vocabulary, the history, and the two files you hand the agent. Cloned with one command from the read key.

## Ciphertext in, decrypted here, and always the current commit.

The vault API answers plain cross-origin GETs with no auth header, because what it returns is ciphertext under a key the server has never held. This page derives each vault's HEAD address from its read key, fetches the ref, the commit, the trees and the blobs it needs, and decrypts them in your browser. A push to a vault is live on the next page load — no rebuild of this site, no redeploy.

- **The viewer is the site's. The data is the vault's.** Every string from a vault is rendered as text, never as markup. A vault's app runs only inside a sandboxed frame with an opaque origin, served its reads over a message channel. A vault can change what is shown; it can never change what the page does.
- **Immutable objects are cached; the ref never is.** A stale ref would render an older commit from perfectly valid ciphertext and nothing would error, so the page fetches it fresh every time.
- **The read keys are printed, on purpose.** Each is derived one-way from its vault's write key and cannot be turned back into it. Anyone can clone a vault with it and check what its page says against what is there. No write credential is anywhere in this site, and a test fails the build if one lands.
- **The reader is copied, not fetched.** It is sgit.ai's house reader, about ninety lines, in each page's own source — the brief that documents it says to copy it rather than load it across origins at runtime.

The mechanism is written up at [sgit.ai — reading one file out of a vault](https://sgit.ai/docs/vault/reading-a-vault-file.html), the rules for a site page at [reading a vault from a site page](https://sgit.ai/docs/briefs/sgit-ai-site-pages.html). The template, the generator and the catalogue behind every vault here are in this site's repository; [Lab 07](lab-vault-delivered.html) is the record of the first one.

## Pick the application closest to yours. Then correct the mandate.

Everything else in the vault is derived. The correction is the elicitation, and the corrected vault — with a name on the licence and no public key — is what is sold.
