# vault_publisher

A small, **standalone** module that pulls published content out of an SG/Vault
and writes a clean, deployable **static site** into `public/`.

It is deliberately self-contained and config-driven so it can be lifted out of
this repo and reused in other projects later — point `vault.config.json` at a
different vault and it works the same way.

## How it works

1. Reads `vault.config.json` (vault id, **read-only** key, and the allowlist of
   files to publish).
2. Performs a **read-only clone** of the vault with `sgit-ai`.
3. Copies only the allowlisted files into the output directory (`public/`),
   so vault internals (`.sg_vault/`, `.vault/`, host-only `app.json`, …) never
   reach the public site.

The Risk Mandate vault already holds a **fully self-contained** `index.html`
(inline CSS/JS/SVG). Its only runtime dependencies are relative fetches of
`version.json` (footer version) and `CHANGELOG.md` (the `/changelog.html`
page) — both with inline fallbacks. So for this MVP no client-side decryption
is needed: publishing is just a build-time sync of plaintext-in-vault files.

> Future direction: the sgraph.ai library renders content that stays
> **encrypted at rest** by fetching ciphertext and decrypting in the browser
> via the Web Crypto API (AES-256-GCM). This module is the seam where that
> capability would be added when we want it.

## The read key is public by design

`read_key` in `vault.config.json` is a **read-only** key for a **public**
marketing site. Publishing it is intentional (same model as sgraph.ai's
`public-vaults.json`): it grants read access to already-public content only.
Write keys are never stored here.

## Usage

```bash
pip install -r vault_publisher/requirements.txt   # installs the `sgit` CLI
python vault_publisher/publish.py                 # regenerates public/
```

Options:

- `--config PATH` — use a different config file.
- `--keep-clone` — keep the temporary vault clone for inspection.
- `SGIT_BIN=/path/to/sgit` — use a specific `sgit` binary (e.g. from a venv).

## Config

| key          | meaning                                                        |
|--------------|----------------------------------------------------------------|
| `vault_id`   | SG/Vault id to clone.                                           |
| `read_key`   | 64-hex read-only AES key (public, read-only).                  |
| `base_url`   | API base URL; `null` uses the sgit-ai default.                 |
| `output_dir` | Static-site output dir, relative to the repo root.            |
| `publish`    | Allowlist of vault paths copied verbatim into `output_dir`.    |

## Deploying

`public/` is the deploy root — point any static host at it (S3 + CloudFront,
Cloudflare Pages, GitHub Pages, etc.). To refresh after a content change in the
vault, re-run `publish.py` and redeploy `public/`.
