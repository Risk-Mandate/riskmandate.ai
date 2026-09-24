# Where this model comes from

These files are a copy of the data in the **RiskGraph Explorer** vault, one of the live demos on
riskmandate.ai (`demos.html`). The vault is public: its read key is printed on
`demo-licence-to-operate.html`, and anyone can clone it and compare.

- vault id: `3simlnqe`
- vault version: `v0.3.0` (its own `VERSION` file)
- copied: 24 September 2026, byte for byte, by `scripts/site/build-business-cases.mjs`'s author
- files: `facts.json`, `risks.json`, `roles.json`, `questions.json`, `presets.json`, `twins.json`,
  `instruments.json`

The business cases run the vault's own three rules on this data (see
`scripts/site/business-case/engine.mjs`, which reproduces `app/src/20-graph.js` from the vault).
Do not edit these files here. If the model changes, change it in the vault, cut a vault version,
copy it again, update this note and the digests below, and rebuild the cases: a register computed
from a model that has drifted from its source is not the model it says it is.

## sha256 at the time of copying

- `facts.json` e057b0930c5b26ad9739c7850c9f3aa130825b4c2fe0bc67842c7c0e7ed4b6c1
- `risks.json` da230c2779c830f230296bb568cd936e0683bc59bb96309c428849665beabc57
- `roles.json` c9b791568da55e4614f8b96534a6498565b9e388c433b1a5593499bab130ba62
- `questions.json` 71e83ba61bc51f72512b9d8de890b0b83398b151f470af96478d140ffa454ef0
- `presets.json` 13406ef6233610c91406f2ee54dbe1f056f607efe0b6ef706faa4dcff70069f2
- `twins.json` 5ac787208c04076b3da0a8b875abbf4c339e4d784d69fe2d6eef01f7490ff757
- `instruments.json` 0cf628c6221b4585ff809f968a74a2195f3c071269ce527236d5653ec1d7fe73
