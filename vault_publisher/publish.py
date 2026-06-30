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
    SGIT="<command>"   — a full command, e.g. a container wrapper:
                         SGIT='container run --rm -v "$(pwd):/vault" -v /tmp:/tmp diniscruz/sgit-ai:latest'
    SGIT_BIN=<path>    — a path to the sgit binary
    sgit on PATH       — the default

This matters when your `sgit` is a shell alias/function (those are NOT visible
to scripts) — set SGIT to the underlying command instead.

When SGIT is set it is run THROUGH A SHELL with cwd = the repo root, so a
container wrapper's `$(pwd)` mount resolves to the repo and the clone dest is
passed repo-relative — i.e. `-v "$(pwd):/vault"` maps the clone back to
./.vault-clone/ here. Drop any `-it` from the wrapper (no TTY in a script).
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
    # Clear the target ourselves and clone into a guaranteed-fresh path. We do
    # NOT use sgit's --force: its "delete existing dir" step has been seen to
    # fail with "Directory is not empty" on a leftover clone (e.g. from an
    # earlier aborted run, or files written by a containerised sgit).
    clone_root = dest.parent
    clone_root.mkdir(parents=True, exist_ok=True)
    if dest.exists():
        shutil.rmtree(dest, ignore_errors=True)
    if dest.exists():
        sys.exit(
            f"error: could not clear the existing clone dir {dest} "
            "(a permission issue — e.g. files written by a containerised sgit "
            "under a different uid). Remove it manually and retry."
        )

    # Clone with the "<read_key_hex>:<vault_id>" shorthand positional plus a
    # destination path.
    vault_key = f"{cfg['read_key']}:{cfg['vault_id']}"
    base_url = cfg.get("base_url")

    if os.environ.get("SGIT"):
        # $SGIT is a (possibly containerised) wrapper, e.g.
        #   container run --rm -v "$(pwd):/vault" ... diniscruz/sgit-ai:latest
        # Run it through a SHELL so constructs like $(pwd) resolve, with
        # cwd = repo root (the mount source), and pass a repo-RELATIVE dest so a
        # "-v $(pwd):/vault" mount maps it to the same files we read back here.
        try:
            dest_arg = str(dest.relative_to(REPO_ROOT))
        except ValueError:
            dest_arg = str(dest)   # clone dir outside the repo — won't map into a mount
        parts = [os.environ["SGIT"], "clone", shlex.quote(vault_key), shlex.quote(dest_arg)]
        if base_url:
            parts += ["--base-url", shlex.quote(base_url)]
        cmd, run_kw = " ".join(parts), dict(shell=True, cwd=str(REPO_ROOT))
        shown = os.environ["SGIT"]
    else:
        # Plain binary on PATH / $SGIT_BIN. Absolute dest; run from clone_root so
        # any stray relative artifact a buggy sgit writes (e.g. a literal "None"
        # dir from the Python-3.14 read-only-clone bug) lands inside .vault-clone
        # and gets cleaned up — not in the repo root.
        cmd = sgit_cmd() + ["clone", vault_key, str(dest)]
        if base_url:
            cmd += ["--base-url", base_url]
        run_kw = dict(cwd=str(clone_root))
        shown = " ".join(shlex.quote(c) for c in sgit_cmd())

    print(f"  ▸ cloning vault {cfg['vault_id']} (read-only) → {dest}")
    print(f"    using: {shown}")
    try:
        subprocess.run(cmd, check=True, **run_kw)
    except FileNotFoundError:
        sys.exit(
            f"error: sgit not found (tried: {' '.join(sgit_cmd())}). Install it with "
            "`pip install sgit-ai`, set SGIT_BIN to its path, or set SGIT to a "
            "command (e.g. a container wrapper)."
        )
    except subprocess.CalledProcessError as exc:
        sys.exit(f"error: sgit clone failed (exit {exc.returncode})")

    # Guard against the "None"-folder misparse: confirm the clone landed at dest.
    if not dest.is_dir():
        stray = clone_root / "None"
        hint = f" (found a stray '{stray}' instead)" if stray.exists() else ""
        sys.exit(
            f"error: sgit did not create {dest}{hint}. This usually means the "
            "installed sgit-ai misparsed the clone arguments (seen on some "
            "Python 3.14 builds). Use a working sgit via SGIT=... (e.g. your "
            "container wrapper), or a Python 3.11/3.12 venv."
        )


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
    ap.add_argument("--from-clone", metavar="DIR",
                    help="publish from an EXISTING vault clone at DIR; skip the "
                         "clone step entirely and never delete DIR. Use this when "
                         "you cloned the vault yourself (e.g. with a container "
                         "sgit) and just want to build the site from it.")
    ap.add_argument("--keep-clone", action="store_true",
                    help="keep the vault clone instead of deleting it after publish")
    args = ap.parse_args()

    cfg = load_config(Path(args.config))
    print(f"Publishing: {cfg.get('vault_name', cfg['vault_id'])}")

    # --- publish from an existing clone the caller manages (no clone, no delete)
    if args.from_clone:
        clone_dir = Path(args.from_clone)
        if not clone_dir.is_absolute():
            clone_dir = Path.cwd() / clone_dir
        if not clone_dir.is_dir():
            sys.exit(f"error: --from-clone dir not found: {clone_dir}")
        print(f"  ▸ using existing clone at {clone_dir} (skipping clone; will not delete it)")
        out_dir = publish(cfg, clone_dir)
        print(f"Done. Deploy root: {out_dir}")
        return

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
