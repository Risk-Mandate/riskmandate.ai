# The ABP app vault — the renderer, versioned once

This vault holds the code every Agent Behaviour Policy vault runs, and nothing else:

| File | What it is |
| --- | --- |
| `index.html` | The renderer: Start here, What is this?, Overview, Grant, Mandate — correct it, Delta, Licence to Operate, Give it to your agent, History. One file, nothing external, reads its data over the `window.sg` bridge (or same-origin fetch) relative to the vault it is booted in |
| `loader.html` | The loader every application vault carries as its `index.html`. Fetches `index.html` from this vault — over a sub-vault link when the host resolves one, directly with this vault's public read key otherwise, or from a static copy — and boots it in place |
| `versions/` | One entry per version of the renderer, with the vault commit it was pushed as |

An application vault is data: `vault.json`, `data/`, the markdown documents, `dist/`, and the loader. It carries no renderer of its own, so a fix here reaches every policy on its next load, and a policy's history is the history of its data and nothing else.

Read key: public, printed on riskmandate.ai. Write side: RiskMandate's.
