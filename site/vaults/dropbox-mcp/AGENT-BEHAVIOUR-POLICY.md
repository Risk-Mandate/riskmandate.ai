# AGENT BEHAVIOUR POLICY — The official Dropbox MCP server

> For one agent in one deployment: everything it can do, what you authorised, the gap between the two, and what actually stands in the way. It describes and it does not judge, so it carries no score.

**Vault** `dropbox-mcp` · **status** template · **shape** `dropbox/mcp-server/default` · **grant** 2026-09-15 · **mandate** 2026-09-15 · **vocabulary** abp.sgit.ai v0.3.0 · **as at** 2026-09-15

---


## Four objects, and the verb attached to each

| Object | What it is | How it is obtained | Here |
| --- | --- | --- | --- |
| The mandate | What the agent is authorised and expected to do | **Elicited** — you already know it | `MANDATE.md` — 1 wanted, 3 refused, 19 unstated |
| The grant | Everything the agent can do | **Measured** — from the shape, the account, the credentials | `GRANT.md` — 5 capabilities, 0 measured |
| The delta | Excess and shortfall | **Derived** — recomputed whenever either input moves, never edited | `DELTA.md` — 4 excess, 0 unbounded, 0 shortfall |
| The barrier | What stands between the agent and each capability | **Recorded** per row, one of four kinds | the third column of every table |

## The deployment

**The official Dropbox MCP server**, Dropbox. Dropbox's own MCP server, connected from an MCP client with a Dropbox app configured for scoped access and eight permissions: account_info.read, files.metadata.read, files.content.read, files.content.write, sharing.read, sharing.write, file_requests.read, file_requests.write. The rows are its published tool list read as capabilities. "If you change your Dropbox app settings, such as adding a new scope, you must reconnect" — the scope set is the boundary, and it is the whole of it: there is no folder-scoped variant.

## The mandate, in one paragraph

I connected Dropbox so the assistant could find and read my files. I did not want it creating links anyone can open, and I did not want it deleting or moving anything.

## The whole grant, with the mandate beside it

Irreversible rows first. ✓ marks a measured row.

| Capability | What it is | Barrier | Undo | Evidence | Mandate |
| --- | --- | --- | --- | --- | --- |
| `read.file.host` | Read any file the account can reach | ○ boundary | no | documented | in the mandate |
| `delete.file.host` | Delete files anywhere the account can reach | ○ boundary | no | documented | refused by the mandate |
| `create.record.world` | Publish packages, images or pages under the name it holds | ○ boundary | no | documented | refused by the mandate |
| `authenticate-as.credential.tenant` | Act in accounts with the credentials it holds | ○ boundary | no | documented | unstated by the mandate |
| `write.file.host` | Change any file the account can reach | ○ boundary | with-effort | documented | refused by the mandate |

## The delta

**4 in the grant that the mandate did not ask for.** 3 of those it refused; 1 it never mentioned. **0 have nothing but a setting, a sentence or nothing at all in the way.** Nothing wanted is missing.



## Prohibitions, each with its barrier

Every line an agent is asked to observe, next to what enforces it. A prohibition shown without its barrier is a claim this document cannot support.

| Line | Barrier | Enforced by |
| --- | --- | --- |
| Do not `delete.file.host` — delete files anywhere the account can reach | ○ boundary | files.content.write |
| Do not `create.record.world` — publish packages, images or pages under the name it holds | ○ boundary | sharing.write and file_requests.write |
| Do not `authenticate-as.credential.tenant` — act in accounts with the credentials it holds | ○ boundary | the app's scoped access, all eight scopes at once |
| Do not `write.file.host` — change any file the account can reach | ○ boundary | files.content.write |
| Stop and report if a task needs anything above | ◉ expectation | **nothing** — and this is the line that makes the rest useful |

## What is blocked, and who holds the block

Everything above is what the agent can do once every block is applied. These are the things something withholds — and the record says what, because a ceiling the credential itself enforces and a tool a vendor has not shipped are different objects with different lifespans.

- **permanent deletion** — blocked by Dropbox's own delete semantics — the tool moves files to Deleted files, and no tool deletes permanently. "Move one or more files or folders to Deleted files. Files aren't deleted permanently." — but see the contradiction on recovery windows _(https://help.dropbox.com/integrations/connect-dropbox-mcp-server)_
- **files over 5 MB, as text** — blocked by the server's extraction limit — over it, the client is handed a download link instead. "Support files up to 5 MB" for content extraction; DownloadLink hands the original to the client instead _(https://help.dropbox.com/integrations/connect-dropbox-mcp-server)_
- **your machine** — blocked by the line between the server and the client — what the MCP client itself reaches is that client's own grant, a separate shape. the client's own grant is a separate shape _(https://help.dropbox.com/integrations/connect-dropbox-mcp-server)_

## What is not settled

**4 open questions** the grant cannot answer from published pages — listed in `RESEARCH-NEEDED.md` with how each is settled. **2 places where the vendor's own pages disagree** — in `GRANT.md`, published unresolved. A row with an open question against it stands at the evidence tier it shows; nothing here was obtained by probing anybody else's system.

## Validity

This describes the deployment shape as at this date. If the risk changed, the deployment changed — not this document. As at **2026-09-15**, against grant 2026-09-15, mandate 2026-09-15, vocabulary v0.3.0. Void when: the grant version changes — a product release, a setting, a connector enabled or removed; the mandate changes — the deployer authorises more or less; the vocabulary version changes — a primitive is added, split or renamed; a barrier moves — a setting becomes a boundary, or a boundary is removed.

## Where a score would live, and why it is not here

The same behaviour policy is dangerous in one deployment and harmless in another, and nothing about the document changed. A score needs the assets and the consequences, and this document has neither. That is not a preference; it is where the information is.

---

_This describes the deployment shape as at this date. If the risk changed, the deployment changed — not this document._ 
No score, rating, level or traffic light appears in this vault or in its data, and none will. The behaviour policy describes; it does not judge. 
Generated by `scripts/site/build-abp-vault.mjs` from `data/grant.json`, `data/mandate.json` and the pinned vocabulary; `data/mandate.json` is the only file a person writes. Licence: the published template is CC BY 4.0; a paid copy carries a commercial licence to the buyer. See LICENCE.md.

