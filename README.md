# riskmandate.ai

The public marketing website for **Risk Mandate.ai**, served at **riskmandate.ai**.

Content lives in an **SG/Vault** (id `7rfetjwz`). This repo holds the tooling
that publishes that vault into a deployable static site, plus the generated
output.

## Layout

```
vault_publisher/         Standalone module — clones the vault (read-only via sgit-ai)
                         and emits a clean static site. Config-driven and reusable;
                         intended to be refactored out into its own package later.
web_overlay/             Repo-held static pages overlaid onto the output (e.g. the
                         /app/ vault-host page). See docs/hosting-mvp.md.
scripts/                 Dev tooling (run-locally__riskmandate_ai.sh).
.public-generated-files/ Generated static site (the deploy root). NOT committed
                         (gitignored) — CI rebuilds it from the vault on each deploy,
                         so the vault is the single source of truth.
```

## Quick start

Run the whole thing locally (generate the static tree from the vault, then serve
it on localhost):

```bash
bash scripts/run-locally__riskmandate_ai.sh        # → http://localhost:10070/
```

Or just regenerate the deploy tree:

```bash
pip install -r vault_publisher/requirements.txt
python vault_publisher/publish.py     # regenerates .public-generated-files/ from the vault
```

## Docs

- [`docs/how-the-website-works.md`](docs/how-the-website-works.md) — **start
  here**: the load sequence (host shell → versioned pages → `rm-nav`
  messages), the SG/Vault integration, and the publish pipeline end to end.
- [`vault_publisher/README.md`](vault_publisher/README.md) — the publishing
  model, the (public, read-only) vault key, and the denylist rationale.
- [`docs/hosting-mvp.md`](docs/hosting-mvp.md) — the `/app/` embedded
  vault-app page and the path to fully-static encrypted hosting.
