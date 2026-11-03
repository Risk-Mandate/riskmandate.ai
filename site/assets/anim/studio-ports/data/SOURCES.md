# Sources of the studio ports' data

Copied unmodified by studio@the-ultimate-insider on 29 October 2026 from
[SGit-AI/SGit-AI__Website__Ruv](https://github.com/SGit-AI/SGit-AI__Website__Ruv) at commit `47b447585111b213071fda4e90c21927152071b7`,
under the Apache License 2.0 (the licence text: `../LICENSE-ruv-sgit.txt`). Served on ruv.sgit.ai at the same names under `/data/`.

| File here | Source in that repository | Live copy | What it is |
|---|---|---|---|
| `abp.json` | `site/data/abp.json` | https://ruv.sgit.ai/data/abp.json | the swarm's Agent Behaviour Policy: owner, valid until, 6 roles, 36 rows |
| `rules.json` | `site/data/rules.json` | https://ruv.sgit.ai/data/rules.json | the 36 rules the ABP compiles into, in Ruflo's policy engine |
| `report.json` | `site/data/report.json` | https://ruv.sgit.ai/data/report.json | POC1: the same 11 actions in legacy mode and in enforce mode, and both hash-chained ledgers |
| `state-abp.json` | `site/data/state-abp.json` | https://ruv.sgit.ai/data/state-abp.json | POC1's engine state in enforce mode: the 11 decision receipts, each with its hash and the hash before it |

"23 primitives" on the ABP slide is the `count` in `abp/vocabulary/capabilities.json` in the same repository and commit (the source slide hard-codes it, as here).

Ruflo and its policy engine are MIT, by rUv / ruvnet. Nothing in these files is a key or a personal detail beyond the owner's name, which ruv.sgit.ai publishes.
