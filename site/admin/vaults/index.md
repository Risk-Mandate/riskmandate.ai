# The vaults

> Every behaviour-policy vault on riskmandate.ai with its id, shape, measured rows and open questions, read off the catalogue and each vault's data.
> Source: https://riskmandate.ai/admin/vaults/ · noindex · written by scripts/site/build-admin.mjs

**16**vaults built and pushed*public read key, printed on purpose*

**4**measured on the thing itself*at least one row run by us*

**28**open research questions*across every grant*

**8**asked for, not built*5 connectors · 3 functions*

Read off [the catalogue](../../vaults/index.json) and each vault's `vault.json` and `data/grant.json`. *Measured* counts rows run on a system we are entitled to run; everything else is documented from the vendor's pages, dated and quoted. No row here is a score: the number of open questions is how much the grant still does not know about itself.

## Coding agents

| Vault | Shape | Rows | Measured | Open | As at | Id |  |
|---|---|---|---|---|---|---|---|

| [Claude Code on the web](../../abp-vault-claude-code-web.html)
Claude Code on the web, with one repository attached | `anthropic/claude-code-remote/ccr-container` | 15 | 13 of 15 | none | 2026-09-15 | `ruj286tr` | [host ↗](https://dev.vault.sgraph.ai/en-gb/#6042edc39e0bcb1f17af1da0cf9d4ded6f89a7bb6a5394aa9554bb76913a249c:ruj286tr) |
| [Claude Code on your machine](../../abp-vault-claude-code-cli.html)
Claude Code on your own machine, confirmations on | `anthropic/claude-code/local-default` | 16 | documented | none | 2026-09-15 | `amicdz0h` | [host ↗](https://dev.vault.sgraph.ai/en-gb/#46c3f77951dfea80c8bf3d72d5a84915e2694129ca8df4a1c58ccecfeb31bc47:amicdz0h) |
| [Claude Code, confirmations off](../../abp-vault-claude-code-cli-confirmations-off.html)
Claude Code on your own machine, confirmations off | `anthropic/claude-code/local-confirmations-off` | 16 | documented | none | 2026-09-15 | `ahly2cho` | [host ↗](https://dev.vault.sgraph.ai/en-gb/#7894e9462c18014303ec8137593610880171f0d6fa8a999b5f9f8687ba100b86:ahly2cho) |

## Chat assistants

| Vault | Shape | Rows | Measured | Open | As at | Id |  |
|---|---|---|---|---|---|---|---|

| [Claude Desktop](../../abp-vault-claude-desktop.html)
Claude Desktop, with local tools switched on | `anthropic/claude-desktop/default` | 10 | documented | none | 2026-09-15 | `ty3axtmo` | [host ↗](https://dev.vault.sgraph.ai/en-gb/#0773b3bf99cb7ef237fa83c77778eb85009a89dbaf566c2d16a83a8f3c693635:ty3axtmo) |
| [Claude in the browser, connectors on](../../abp-vault-claude-web-connectors.html)
Claude in the browser, with connectors switched on | `anthropic/claude-web/connectors-on` | 5 | documented | none | 2026-09-15 | `wkm5owfl` | [host ↗](https://dev.vault.sgraph.ai/en-gb/#2bf331cfad716bdc7f37feddd7f1892c651425dd844381d3f392ed1b3419447d:wkm5owfl) |
| [ChatGPT in the browser](../../abp-vault-chatgpt-web.html)
ChatGPT in the browser, nothing connected | `openai/chatgpt-web/default` | 1 | documented | none | 2026-09-15 | `dd1teu9n` | [host ↗](https://dev.vault.sgraph.ai/en-gb/#8f7da12c7ab0f2496471ff9d5e4f4755975ce51e7830dafa39dc728b5aa71001:dd1teu9n) |
| [A browser extension](../../abp-vault-browser-extension.html)
A browser extension with broad host permissions | `generic/browser-extension/broad-host-permissions` | 3 | documented | none | 2026-09-15 | `exsaxrfr` | [host ↗](https://dev.vault.sgraph.ai/en-gb/#875818b8d845c17801db7aa4bef5037a70e084db717749533179af0b2abc68df:exsaxrfr) |

## Automation & CI

| Vault | Shape | Rows | Measured | Open | As at | Id |  |
|---|---|---|---|---|---|---|---|

| [GitHub Actions](../../abp-vault-github-actions.html)
A GitHub Actions runner, a hosted CI job | `github/actions-runner/ci` | 8 | 8 of 8 | none | 2026-09-15 | `0hpdpj80` | [host ↗](https://dev.vault.sgraph.ai/en-gb/#28afd90f03365372d9c0181808680519523ffdbeadc1fce7ec8e2074c28e36e3:0hpdpj80) |
| [A scheduled job](../../abp-vault-scheduled-job.html)
A scheduled job running as a service account | `generic/scheduled-job/service-account` | 7 | documented | none | 2026-09-15 | `kd7zeimj` | [host ↗](https://dev.vault.sgraph.ai/en-gb/#cf9307d3ac3f3674049590684d9af0c10116364c813dea77d8584c8fa5a10e7c:kd7zeimj) |
| [n8n, owner API key](../../abp-vault-n8n-owner-api-key.html)
A self-hosted n8n instance, owner API key | `n8n/self-hosted/owner-api-key` | 8 | 7 of 8 | 4 open 2 contradictions | 2026-09-15 | `l8opgcug` | [host ↗](https://dev.vault.sgraph.ai/en-gb/#d85b128b1eff181a71f3e4eec16a27510934ca73aecc450617b7c40d750909b3:l8opgcug) |

## Mail & files connectors

| Vault | Shape | Rows | Measured | Open | As at | Id |  |
|---|---|---|---|---|---|---|---|

| [Google Workspace MCP servers](../../abp-vault-google-workspace-mcp.html)
The Google Workspace MCP servers | `google/workspace-mcp/default` | 6 | documented | 4 open 3 contradictions | 2026-09-15 | `pq7ct02p` | [host ↗](https://dev.vault.sgraph.ai/en-gb/#093c4c58f1593dacecc727de965ee22f883a6530cac20b2ff9ae6b7ea811c1e4:pq7ct02p) |
| [Claude's Gmail connector](../../abp-vault-claude-gmail-connector.html)
Claude, with the Gmail connector on one inbox | `anthropic/gmail-connector/default` | 6 | 4 of 6 | 6 open 5 contradictions | 2026-09-16 | `oc433z3m` | [host ↗](https://dev.vault.sgraph.ai/en-gb/#22fd71dfcc045d047846972e051fd97444f75e0c53da3fde9a233060023cee04:oc433z3m) |
| [Gmail, read-only scope](../../abp-vault-gmail-readonly.html)
An assistant on a personal Gmail mailbox | `google/gmail/readonly-connector` | 4 | documented | 3 open 1 contradiction | 2026-09-15 | `l2zlv3ng` | [host ↗](https://dev.vault.sgraph.ai/en-gb/#865ea2d50ada749c30554380f22202dffe4c362a4a85a565accd045b84eefaf8:l2zlv3ng) |
| [Google Drive, read-only scope](../../abp-vault-google-drive-readonly.html)
An assistant on a personal Google Drive | `google/drive/readonly-connector` | 3 | documented | 3 open 1 contradiction | 2026-09-15 | `vz03p8it` | [host ↗](https://dev.vault.sgraph.ai/en-gb/#e04bb066d11479d33ecb9e5d0c1a621e13e4599e8c2b5380001ab16e8c932270:vz03p8it) |
| [Microsoft 365 connector (Claude)](../../abp-vault-claude-m365-connector.html)
Claude's Microsoft 365 connector | `anthropic/microsoft-365-connector/default` | 5 | documented | 4 open 3 contradictions | 2026-09-15 | `dgx3nvu4` | [host ↗](https://dev.vault.sgraph.ai/en-gb/#43d439062419da78ef22e544257d775f5774b33830d92f7a3abe5c05c2873669:dgx3nvu4) |
| [Dropbox MCP server](../../abp-vault-dropbox-mcp.html)
The official Dropbox MCP server | `dropbox/mcp-server/default` | 5 | documented | 4 open 2 contradictions | 2026-09-15 | `9eqa7e4p` | [host ↗](https://dev.vault.sgraph.ai/en-gb/#f22db64f51e4268a4531bebe0c6d46f3e51dd1337193a7e8137efac9cdfc5990:9eqa7e4p) |

## Asked for, not built

**Claude's Calendar & Drive connectors**

Google Calendar and Google Drive, the two Google Workspace connectors not yet in the directory — Gmail's own is.not yet researched

**An assistant connected to Slack**

Channels are mostly other people's writing, and a bot token reaches every channel it is in.not yet researched

**An assistant connected to GitHub**

A fine-grained token can be scoped to a repository; an OAuth app cannot, and most connectors are OAuth apps.not yet researched

**An assistant connected to Notion**

An integration is added page by page, which is the one connector model with a floor. Whether the assistant's connector uses it is the question.not yet researched

**An assistant connected to Salesforce**

A CRM is entirely third-party material by construction.not yet researched

**Access to the CRM**

Customer records are third-party material by construction. Salesforce, HubSpot, Dynamics.asked for

**The customer-service desk**

Tickets, and the conversations inside them. Zendesk, Intercom, Freshdesk.asked for

**Finance data**

Spreadsheets, ledgers and the exports beside them. Sheets, Excel, NetSuite.asked for

The public page for these is [what is next](../../agent-behaviour-policy-next.html), with a vote and a suggestion form.
