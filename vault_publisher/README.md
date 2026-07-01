# vault_publisher

A small, **standalone** module that pulls published content out of an SG/Vault
and writes a clean, deployable **static site** into `.public-generated-files/`.

It is deliberately self-contained and config-driven so it can be lifted out of
this repo and reused in other projects later — point `vault.config.json` at a
different vault and it works the same way.

## How it works

1. Reads `vault.config.json` (vault id, **read-only** key, `exclude` list).
2. Keeps a **read-only clone** of the vault at `./.vault-clone/<id>` — cloned the
   first time, then updated with `sgit pull` on later runs (not re-cloned).
3. Copies the vault's web content into the output dir
   (`.public-generated-files/`): **everything except** dotfiles/vault internals
   (`.sg_vault/`, `.vault/`) and the configured `exclude` entries (build inputs
   and host metadata). New content the vault team adds is published
   automatically.
4. Overlays the repo's `overlay_dir` on top (repo wins) — see below.

The Risk Mandate vault holds a `src/` → `build.js` → built site (maintained by
the vault team — do not edit the built files by hand). At runtime the pages read
vault files via `content.js`, which uses `sg.vfs.readText` in the SG/App host and
falls back to a **relative `fetch()`** on the static domain — so the same code
runs on the vault and on GitHub Pages with no knowledge of where it is. The
publisher just mirrors the vault's files, so those relative fetches resolve.

> Why a denylist, not an allowlist: the vault has been restructured several
> times (self-contained page → `src/` build → `dev/` → IFD-versioned `v0/…`).
> Publishing everything-except-build-inputs is robust to that churn; an allowlist
> kept 404ing whenever new files appeared. The vault is a public marketing site,
> so there's nothing secret to withhold — only build inputs to trim.

## Overlay (`overlay_dir`)

After the vault files are written, the publisher copies a repo-held
`overlay_dir` (default `web_overlay/`) on top of the output — repo files win on
conflict. This is for static pages that live in the **repo**, not the vault.
Currently it ships the MVP vault-host page at `web_overlay/app/` → `/app/`
(see `../docs/hosting-mvp.md`).

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
python vault_publisher/publish.py                 # regenerates .public-generated-files/
```

Options:

- `--config PATH` — use a different config file.
- `--clone-dir DIR` — where to keep the vault clone (default `./.vault-clone`).
- `--fresh` — delete and re-clone instead of updating an existing clone.
- `--from-clone DIR` — publish from an **existing** clone at `DIR`; skip
  clone/update entirely and never delete it. Use this when you cloned the vault
  yourself (e.g. with a container sgit):

  ```bash
  sgit clone <read_key_hex>:<vault_id> ./myclone
  python vault_publisher/publish.py --from-clone ./myclone
  ```

### Choosing which `sgit` to run (first match wins)

- `SGIT="<command>"` — a **full command**; use this when `sgit` is a shell
  **alias/function** or runs in a **container** (those aren't visible to
  scripts), e.g.
  `SGIT='container run --rm -v "$(pwd):/vault" -v /tmp:/tmp diniscruz/sgit-ai:latest'`.
  A container wrapper is run through a shell with `cwd` set to the mount source,
  so `$(pwd)` resolves and paths are passed relative to it; drop any `-it`
  (no TTY in a script).
- `SGIT_BIN=/path/to/sgit` — a path to the binary.
- `sgit` on `PATH` — the default.

### Where the vault is cloned

Into `./.vault-clone/<vaultId>/` (repo-local and gitignored, **not** system
temp) so a containerised/aliased `sgit` can reach it via the repo mount. It's
**persistent** — updated in place with `sgit pull` each run and kept between
runs. Override the location with `--clone-dir` or `clone_dir` in the config;
force a clean re-clone with `--fresh`.

## Config

| key          | meaning                                                          |
|--------------|------------------------------------------------------------------|
| `vault_id`   | SG/Vault id to clone.                                             |
| `read_key`   | 64-hex read-only AES key (public, read-only).                    |
| `base_url`   | API base URL; `null` uses the sgit-ai default.                   |
| `output_dir` | Static-site output dir, relative to the repo root.               |
| `exclude`    | Top-level vault entries NOT to publish (build inputs, metadata). |
| `overlay_dir`| Optional — repo dir overlaid on the output (default `web_overlay`).|
| `clone_dir`  | Optional — where to keep the clone (default `.vault-clone`).      |

## Deploying

`.public-generated-files/` is the deploy root — point any static host at it
(S3 + CloudFront, Cloudflare Pages, GitHub Pages, etc.). To refresh after a
content change in the vault, re-run `publish.py` and redeploy it.
