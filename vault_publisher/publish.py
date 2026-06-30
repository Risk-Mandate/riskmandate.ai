#!/usr/bin/env python3
"""
vault_publisher — pull published content out of an SG/Vault into a static site.

MVP scope: the vault already holds self-contained, ready-to-serve HTML (inline
CSS/JS/SVG). This module performs a read-only clone of the vault via `sgit-ai`
and copies an *allowlisted* set of files into the output directory, so the
result is a clean, deployable static site with no vault internals leaking out.

This is intentionally generic — point `vault.config.json` at a different vault
to reuse it in another project. Later versions can grow client-side decryption
(the sgraph.ai library pattern) for content that should stay encrypted at rest;
for now the published HTML is plaintext in the vault, so a build-time sync is
all that is needed.

Usage:
    python vault_publisher/publish.py [--config PATH] [--keep-clone]

Requirements:
    pip install sgit-ai          (provides the `sgit` CLI)

The `sgit` binary is discovered on PATH, or via the SGIT_BIN env var.
"""
from __future__ import annotations

import argparse
import json
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

MODULE_DIR = Path(__file__).resolve().parent
REPO_ROOT = MODULE_DIR.parent


def load_config(path: Path) -> dict:
    with path.open(encoding="utf-8") as fh:
        cfg = json.load(fh)
    for key in ("vault_id", "read_key", "output_dir", "publish"):
        if not cfg.get(key):
            sys.exit(f"error: '{key}' missing from {path}")
    return cfg


def sgit_bin() -> str:
    return os.environ.get("SGIT_BIN") or shutil.which("sgit") or "sgit"


def clone_vault(cfg: dict, dest: Path) -> None:
    """Read-only clone of the vault into `dest` using sgit-ai."""
    vault_key = f"{cfg['read_key']}:{cfg['vault_id']}"
    cmd = [sgit_bin(), "clone", vault_key, str(dest), "--force"]
    if cfg.get("base_url"):
        cmd += ["--base-url", cfg["base_url"]]
    print(f"  ▸ cloning vault {cfg['vault_id']} (read-only)")
    try:
        subprocess.run(cmd, check=True)
    except FileNotFoundError:
        sys.exit(
            "error: `sgit` not found. Install it with `pip install sgit-ai`, "
            "or set SGIT_BIN to its path."
        )
    except subprocess.CalledProcessError as exc:
        sys.exit(f"error: sgit clone failed (exit {exc.returncode})")


def publish(cfg: dict, clone_dir: Path) -> Path:
    out_dir = Path(cfg["output_dir"])
    if not out_dir.is_absolute():
        out_dir = REPO_ROOT / out_dir
    out_dir.mkdir(parents=True, exist_ok=True)

    copied = []
    for rel in cfg["publish"]:
        src = clone_dir / rel
        if not src.is_file():
            sys.exit(f"error: '{rel}' is in the allowlist but not present in the vault")
        dst = out_dir / rel
        dst.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src, dst)
        copied.append(rel)

    print(f"  ▸ published {len(copied)} file(s) to {out_dir.relative_to(REPO_ROOT)}/")
    for rel in copied:
        print(f"      • {rel}")
    return out_dir


def main() -> None:
    ap = argparse.ArgumentParser(description="Publish an SG/Vault to a static site directory.")
    ap.add_argument("--config", default=str(MODULE_DIR / "vault.config.json"),
                    help="path to vault.config.json")
    ap.add_argument("--keep-clone", action="store_true",
                    help="keep the temporary vault clone instead of deleting it")
    args = ap.parse_args()

    cfg = load_config(Path(args.config))
    print(f"Publishing: {cfg.get('vault_name', cfg['vault_id'])}")

    tmp = Path(tempfile.mkdtemp(prefix="vault-clone-"))
    clone_dir = tmp / cfg["vault_id"]
    try:
        clone_vault(cfg, clone_dir)
        out_dir = publish(cfg, clone_dir)
    finally:
        if args.keep_clone:
            print(f"  ▸ clone kept at {clone_dir}")
        else:
            shutil.rmtree(tmp, ignore_errors=True)

    print(f"Done. Deploy root: {out_dir}")


if __name__ == "__main__":
    main()
