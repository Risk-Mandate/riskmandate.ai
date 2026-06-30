# riskmandate.ai

The public marketing website for **Risk Mandate.ai**, served at **riskmandate.ai**.

Content lives in an **SG/Vault** (id `7rfetjwz`). This repo holds the tooling
that publishes that vault into a deployable static site, plus the generated
output.

## Layout

```
vault_publisher/     Standalone module — clones the vault (read-only via sgit-ai)
                     and emits a clean static site. Config-driven and reusable;
                     intended to be refactored out into its own package later.
public/              Generated static site (the deploy root). NOT committed
                     (gitignored) — CI rebuilds it from the vault on each deploy,
                     so the vault is the single source of truth.
```

## Quick start

```bash
pip install -r vault_publisher/requirements.txt
python vault_publisher/publish.py     # regenerates public/ from the vault
```

Then serve / deploy `public/`:

```bash
python -m http.server -d public 8099  # local preview at http://127.0.0.1:8099
```

See [`vault_publisher/README.md`](vault_publisher/README.md) for details on the
publishing model, the (public, read-only) vault key, and where client-side
decryption would slot in for future encrypted content.
