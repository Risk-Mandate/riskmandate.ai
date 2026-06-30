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
    python vault_publisher/publish.py [--config PATH] [--clone-dir DIR] [--keep-clone]

Requirements:
    pip install sgit-ai          (provides the `sgit` CLI)

Choosing which sgit to run (first match wins):
    SGIT="<command>"   — a full command, e.g. an alias/container wrapper:
                         SGIT="container exec sgit-box sgit"
    SGIT_BIN=<path>    — a path to the sgit binary
    sgit on PATH       — the default

This matters when your `sgit` is a shell alias (aliases are NOT visible to
scripts) — set SGIT to the underlying command instead.
"""
from __future__ import annotations

import argparse
import json
import os
import shlex
import shutil
import subprocess
import sys
from pathlib import Path

MODULE_DIR = Path(__file__).resolve().parent
REPO_ROOT = MODULE_DIR.parent
DEFAULT_CLONE_DIR = REPO_ROOT / ".vault-clone"


def load_config(path: Path) -> dict:
    with path.open(encoding="utf-8") as fh:
        cfg = json.load(fh)
    for key in ("vault_id", "read_key", "output_dir", "publish"):
        if not cfg.get(key):
            sys.exit(f"error: '{key}' missing from {path}")
    return cfg


def sgit_cmd() -> list[str]:
    """The sgit invocation as a token list.

    Supports a multi-token command via $SGIT (for aliases / container wrappers),
    a binary path via $SGIT_BIN, or plain `sgit` on PATH.
    """
    cmd = os.environ.get("SGIT")
    if cmd:
        return shlex.split(cmd)
    return [os.environ.get("SGIT_BIN") or shutil.which("sgit") or "sgit"]


def clone_vault(cfg: dict, dest: Path) -> None:
    """Read-only clone of the vault into `dest` using sgit-ai.

    Uses the explicit `--read-key` form (vault id positional + key flag) rather
    than the `<key>:<id>` shorthand — it's unambiguous and stable across
    sgit-ai versions.
    """
    cmd = sgit_cmd() + [
        "clone", cfg["vault_id"], str(dest),
        "--read-key", cfg["read_key"], "--force",
    ]
    if cfg.get("base_url"):
        cmd += ["--base-url", cfg["base_url"]]
    print(f"  ▸ cloning vault {cfg['vault_id']} (read-only) → {dest}")
    print(f"    using: {' '.join(shlex.quote(c) for c in sgit_cmd())}")
    try:
        subprocess.run(cmd, check=True)
    except FileNotFoundError:
        sys.exit(
            f"error: sgit not found (tried: {' '.join(sgit_cmd())}). Install it with "
            "`pip install sgit-ai`, set SGIT_BIN to its path, or set SGIT to a "
            "command (e.g. a container wrapper)."
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
        dst = out_dir / rel
        if src.is_dir():
            # Allowlisted directory → copy the whole subtree (e.g. dev/ release notes).
            if dst.exists():
                shutil.rmtree(dst)
            shutil.copytree(src, dst)
            copied.append(rel + "/")
        elif src.is_file():
            dst.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(src, dst)
            copied.append(rel)
        else:
            sys.exit(f"error: '{rel}' is in the allowlist but not present in the vault")

    print(f"  ▸ published {len(copied)} entr(y/ies) to {out_dir.relative_to(REPO_ROOT)}/")
    for rel in copied:
        print(f"      • {rel}")

    # Optional repo-held overlay (host pages, etc.) copied on top of the vault
    # output. Repo files win on conflict. Used for the static-vault-hosting host
    # page at /app/, which lives in the repo (not the vault).
    overlay = cfg.get("overlay_dir")
    if overlay:
        overlay_path = Path(overlay)
        if not overlay_path.is_absolute():
            overlay_path = REPO_ROOT / overlay_path
        if overlay_path.is_dir():
            shutil.copytree(overlay_path, out_dir, dirs_exist_ok=True)
            n = sum(1 for _ in overlay_path.rglob("*") if _.is_file())
            print(f"  ▸ overlaid {n} file(s) from {overlay}/")
        else:
            print(f"  ▸ overlay_dir '{overlay}' not found — skipping")

    return out_dir


def main() -> None:
    ap = argparse.ArgumentParser(description="Publish an SG/Vault to a static site directory.")
    ap.add_argument("--config", default=str(MODULE_DIR / "vault.config.json"),
                    help="path to vault.config.json")
    ap.add_argument("--clone-dir",
                    help="where to clone the vault (default: ./.vault-clone, or "
                         "'clone_dir' in the config). A predictable, repo-local "
                         "path so a containerised sgit can mount it.")
    ap.add_argument("--keep-clone", action="store_true",
                    help="keep the vault clone instead of deleting it after publish")
    args = ap.parse_args()

    cfg = load_config(Path(args.config))
    print(f"Publishing: {cfg.get('vault_name', cfg['vault_id'])}")

    # Clone into a predictable, repo-local dir (not system temp): findable, and
    # a containerised/aliased sgit can mount the repo to reach it.
    clone_root = args.clone_dir or cfg.get("clone_dir") or DEFAULT_CLONE_DIR
    clone_root = Path(clone_root)
    if not clone_root.is_absolute():
        clone_root = REPO_ROOT / clone_root
    clone_dir = clone_root / cfg["vault_id"]

    try:
        clone_vault(cfg, clone_dir)
        out_dir = publish(cfg, clone_dir)
    finally:
        if args.keep_clone:
            print(f"  ▸ clone kept at {clone_dir}")
        else:
            shutil.rmtree(clone_root, ignore_errors=True)

    print(f"Done. Deploy root: {out_dir}")


if __name__ == "__main__":
    main()
