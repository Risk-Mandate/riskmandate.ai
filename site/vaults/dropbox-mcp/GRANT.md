# GRANT — everything the agent can do

> Measured from the deployment shape, not from your account and not by you. Every row says how it is known, what stands in the way, and whether it can be undone. Irreversible rows first.

**Vault** `dropbox-mcp` · **status** template · **shape** `dropbox/mcp-server/default` · **grant** 2026-09-15 · **mandate** 2026-09-15 · **vocabulary** abp.sgit.ai v0.3.0 · **as at** 2026-09-15

---


**Shape** The official Dropbox MCP server (Dropbox) · **surface** mcp · **grant version** 2026-09-15 · **rows** 5, of which **0 measured** and 5 derived · **widest reach** world

## What the words mean here

Dropbox's own MCP server, connected from an MCP client with a Dropbox app configured for scoped access and eight permissions: account_info.read, files.metadata.read, files.content.read, files.content.write, sharing.read, sharing.write, file_requests.read, file_requests.write. The rows are its published tool list read as capabilities. "If you change your Dropbox app settings, such as adding a new scope, you must reconnect" — the scope set is the boundary, and it is the whole of it: there is no folder-scoped variant.

| Reach | In this shape means |
| --- | --- |
| host | the Dropbox account as a store — and for a team user, "the usage and quota for the entire team" |
| tenant | the Dropbox account or team the app was authorised for |
| world | anyone who holds a shared link or a file-request URL |

## The rows

| Capability | What it is | Barrier | Undo | Evidence | Via | What stands in the way | Whose material |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `read.file.host` | Read any file the account can reach | ○ boundary | no | documented | GetFileContent, Search, ListFolder, DownloadLink, GetFileMetadata | the app's scopes files.metadata.read and files.content.read, consented by the user; a team admin's App Center controls are open, below | mixed |
| `delete.file.host` | Delete files anywhere the account can reach | ○ boundary | no | documented | Delete | files.content.write | mixed |
| `create.record.world` | Publish packages, images or pages under the name it holds | ○ boundary | no | documented | CreateSharedLink, CreateFileRequest | sharing.write and file_requests.write | mixed |
| `authenticate-as.credential.tenant` | Act in accounts with the credentials it holds | ○ boundary | no | documented | WhoAmI, the OAuth app | the app's scoped access, all eight scopes at once | own |
| `write.file.host` | Change any file the account can reach | ○ boundary | with-effort | documented | CreateFile, CreateFolder, Copy, Move | files.content.write | mixed |

**Whose material** is not in the published grammar. It is the property Lab 01 found a connector shape needs — `own`, `organisation`, `third_party` or `mixed` — and is asked of the model site as Lab 03 request 1. `mixed` is the finding: no setting any of these vendors offers makes it `own`.

## The notes behind the rows

- **`read.file.host`** — "Extract text from PDFs, Word documents, and other text representable files"; "Search files and folders by name or content". Everything the account can open, team folders included.
- **`delete.file.host`** — "Move one or more files or folders to Deleted files. Files aren't deleted permanently. Recovery depends on your plan's recovery window."
- **`create.record.world`** — a shared link "for a file or folder, with the option to invite up to 25 viewers by email"; a file request "so others can upload files to a folder you choose". Both publish something under the account's name to whoever holds the URL.
- **`authenticate-as.credential.tenant`** — "Get the authenticated Dropbox user's identity, team/account context"; the server acts as the account, and for team users GetUsageAndQuota "will retrieve the usage and quota for the entire team".
- **`write.file.host`** — Copy "can recreate a deleted file or replace an existing file at the destination path"; Move renames or moves files and folders; CreateFile writes up to 5 MB of inline content.

## Permitted, and blocked

The grant above is what the agent can do **after** the blocks. This is what something withholds. A block is not a property of the credential: some of these are the credential's own ceiling, and some are a vendor choosing not to ship a tool the credential would authorise. Each one names what blocks it, because those two are not the same object and a reader who is shown them under one heading has been told something this document cannot support.

| What | Blocked by | Who holds the block | Why | Source |
| --- | --- | --- | --- | --- |
| permanent deletion | Dropbox's own delete semantics — the tool moves files to Deleted files, and no tool deletes permanently | _not yet recorded_ | "Move one or more files or folders to Deleted files. Files aren't deleted permanently." — but see the contradiction on recovery windows | https://help.dropbox.com/integrations/connect-dropbox-mcp-server |
| files over 5 MB, as text | the server's extraction limit — over it, the client is handed a download link instead | _not yet recorded_ | "Support files up to 5 MB" for content extraction; DownloadLink hands the original to the client instead | https://help.dropbox.com/integrations/connect-dropbox-mcp-server |
| your machine | the line between the server and the client — what the MCP client itself reaches is that client's own grant, a separate shape | _not yet recorded_ | the client's own grant is a separate shape | https://help.dropbox.com/integrations/connect-dropbox-mcp-server |

## Where the vendor's own pages disagree

Advertised in one place, permitted in another, and the two do not match. Published unresolved on purpose: settling any of these by connecting an assistant and trying would mean probing somebody else's system, which is out of bounds here. If the vendor says which page is right, this table changes and says so.

| What is advertised | What the grant permits | State |
| --- | --- | --- |
| "Files aren't deleted permanently." | "Recovery depends on your plan's recovery window." — the same tool description; after the window they are gone | **unresolved** |
| "Support files up to 5 MB" (GetFileContent) | DownloadLink: "download the original file instead of reading extracted text" — the limit is on extraction, not on reach | **unresolved** |

Sources: <https://help.dropbox.com/integrations/connect-dropbox-mcp-server>

## Open questions

**4** things this grant cannot settle from the pages it was read from. Each is in `RESEARCH-NEEDED.md` with how to settle it, and can be handed to a separate agent. Until it is answered, the row it belongs to stands at the evidence tier shown.

## The four barriers, and the test

| | Barrier | What stands in the way | Is it a control |
| --- | --- | --- | --- |
| ● | none | nothing in the way | no |
| ◉ | expectation | a rule in prose, enforced by nobody | no |
| ◐ | setting | a switch the agent's own account can flip | no |
| ○ | boundary | enforced above the grant, out of the agent's reach | **yes** |

> A control bounds a grant only if it is enforced by something the grant does not include.

A setting the agent's own account can change is not a control, because the grant includes the ability to remove the bound. A boundary enforced above it is one, because it does not.

## Evidence tiers

| Tier | Means |
| --- | --- |
| derived | from what the thing architecturally is; a claim until somebody runs the probes |
| inferred | from another row or another profile, by reasoning rather than by observation |
| self-reported | reported by the operator, the harness or the tool itself, without an independent probe |
| documented | the vendor, or a published tool, says so |
| measured ✓ | a probe run on an instance, dated, with an evidence file |
| observed ✓ | seen directly, on the thing itself, by the thing itself |

✓ marks the tiers this vault counts as measured. Nothing here was obtained by probing anybody else's system: a row is measured only from a system we are entitled to run, or from the vendor's own published documentation.

## Ask the agent to check it

The agent is running in the deployment this file describes, so it can look. What it reports is a claim until a log held outside it agrees — but a claim from inside the deployment is a better starting point than a template. Paste this into a session running in the shape above:

```
You are running inside the deployment described in GRANT.md. Compare each row with what you
can actually reach from here, and report — do not change any file except the one named below.

For every row: PRESENT, ABSENT or CANNOT TELL; which tool reaches it; one line of evidence
(a command's output, a tool's own description, a documentation sentence with its URL).
Never exercise a capability whose undo class is "no" to prove it exists: presence of a
credential file is evidence; using it is not permitted.
Add a row for anything you can reach that is not listed, in verb.object.reach form, using
only the 23 primitives in data/vocabulary/capabilities.json. A new path, host or mailbox is
an instance of an existing primitive, not a new one.
Do not touch MANDATE.md or data/mandate.json — that file is the deployer's, not yours.
Write the result to history/grant-check--<today>.md with the date and the tool versions
you can see. Everything in it is self-report; say so at the top.
```

---

_This describes the deployment shape as at this date. If the risk changed, the deployment changed — not this document._ 
No score, rating, level or traffic light appears in this vault or in its data, and none will. The behaviour policy describes; it does not judge. 
Generated by `scripts/site/build-abp-vault.mjs` from `data/grant.json`, `data/mandate.json` and the pinned vocabulary; `data/mandate.json` is the only file a person writes. Licence: the published template is CC BY 4.0; a paid copy carries a commercial licence to the buyer. See LICENCE.md.

