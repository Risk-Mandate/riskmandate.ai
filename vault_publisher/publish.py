#!/usr/bin/env python3
"""
vault_publisher — pull published content out of an SG/Vault into a static site.

It keeps a read-only working clone of the vault (default ./.vault-clone/<id>),
updating it with `sgit pull` on subsequent runs rather than re-cloning, and
copies the vault's web content into the output dir (default
./.public-generated-files) — everything except build inputs / metadata /
internals (see `exclude` + the built-in skips), plus an optional repo `overlay`.

Point `vault.config.json` at a different vault to reuse it elsewhere.

Usage:
    python vault_publisher/publish.py [--config PATH] [--clone-dir DIR]
                                      [--fresh] [--from-clone DIR]

Requirements:
    pip install -r vault_publisher/requirements.txt   (sgit-ai; osbot-utils>=3.75.0)

Choosing which sgit to run (first match wins):
    SGIT="<command>"   — a full command, e.g. a container wrapper:
                         SGIT='container run --rm -v "$(pwd):/vault" -v /tmp:/tmp diniscruz/sgit-ai:latest'
    SGIT_BIN=<path>    — a path to the sgit binary
    sgit on PATH       — the default

This matters when your `sgit` is a shell alias/function (those are NOT visible
to scripts) — set SGIT to the underlying command instead.

When SGIT is set it is run THROUGH A SHELL with cwd = the mount source (the repo
root for clone, the clone dir for pull), so a container wrapper's `$(pwd)` mount
resolves and any path arg is passed relative to that cwd — i.e.
`-v "$(pwd):/vault"` maps the operation to the right files here.
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

# Never published: sgit/vault internals (also caught by the dotfile skip) and
# the usual build inputs / host metadata. Extend via `exclude` in the config.
ALWAYS_SKIP = {".sg_vault", ".vault"}


def load_config(path: Path) -> dict:
    with path.open(encoding="utf-8") as fh:
        cfg = json.load(fh)
    for key in ("vault_id", "read_key", "output_dir"):
        if not cfg.get(key):
            sys.exit(f"error: '{key}' missing from {path}")
    return cfg


def sgit_cmd() -> list[str]:
    """The sgit invocation as a token list ($SGIT_BIN or `sgit` on PATH)."""
    return [os.environ.get("SGIT_BIN") or shutil.which("sgit") or "sgit"]


def run_sgit(args: list[str], cwd: Path) -> None:
    """Run `sgit <args...>` from `cwd`. Raises CalledProcessError on failure.

    Honours a container-style $SGIT wrapper by running it through a shell (so
    `$(pwd)` resolves to `cwd`). Any path args must therefore be relative to
    `cwd` so a `-v "$(pwd):/vault"` mount maps them correctly.
    """
    sgit = os.environ.get("SGIT")
    try:
        if sgit:
            line = " ".join([sgit] + [shlex.quote(a) for a in args])
            print(f"    using: {sgit}  (cwd: {cwd})")
            subprocess.run(line, shell=True, check=True, cwd=str(cwd))
        else:
            print(f"    using: {' '.join(shlex.quote(c) for c in sgit_cmd())}")
            subprocess.run(sgit_cmd() + args, check=True, cwd=str(cwd))
    except FileNotFoundError:
        sys.exit(
            f"error: sgit not found (tried: {' '.join(sgit_cmd())}). Install it with "
            "`pip install -r vault_publisher/requirements.txt`, set SGIT_BIN to its "
            "path, or set SGIT to a command (e.g. a container wrapper)."
        )


def rel_to_repo(p: Path) -> str:
    try:
        return str(p.relative_to(REPO_ROOT))
    except ValueError:
        return str(p)   # outside the repo — won't map into a container mount


def clone_fresh(cfg: dict, dest: Path) -> None:
    """Read-only clone of the vault into `dest` (clearing it first)."""
    dest.parent.mkdir(parents=True, exist_ok=True)
    if dest.exists():
        shutil.rmtree(dest, ignore_errors=True)
    if dest.exists():
        sys.exit(
            f"error: could not clear the existing clone dir {dest} "
            "(a permission issue — e.g. files written by a containerised sgit "
            "under a different uid). Remove it manually and retry."
        )
    vault_key = f"{cfg['read_key']}:{cfg['vault_id']}"
    args = ["clone", vault_key, rel_to_repo(dest)]
    if cfg.get("base_url"):
        args += ["--base-url", cfg["base_url"]]
    print(f"  ▸ cloning vault {cfg['vault_id']} (read-only) → {dest}")
    try:
        run_sgit(args, cwd=REPO_ROOT)
    except subprocess.CalledProcessError as exc:
        sys.exit(f"error: sgit clone failed (exit {exc.returncode})")
    if not dest.is_dir():
        stray = dest.parent / "None"
        hint = f" (found a stray '{stray}' instead)" if stray.exists() else ""
        sys.exit(
            f"error: sgit did not create {dest}{hint}. If you see a 'None' folder, "
            "your sgit env has osbot-utils < 3.75.0 on Python 3.14 — upgrade it "
            "(`pip install -U 'osbot-utils>=3.75.0'`) or use a working sgit via SGIT=..."
        )


def update_or_clone(cfg: dict, dest: Path, fresh: bool) -> None:
    """Update an existing clone with `sgit pull`; clone fresh the first time
    (or when --fresh, or if pull fails)."""
    if not fresh and (dest / ".sg_vault").is_dir():
        args = ["pull"]
        if cfg.get("base_url"):
            args += ["--base-url", cfg["base_url"]]
        print(f"  ▸ updating existing clone → {dest} (sgit pull)")
        try:
            run_sgit(args, cwd=dest)
            return
        except subprocess.CalledProcessError as exc:
            print(f"  ▸ sgit pull failed (exit {exc.returncode}) — re-cloning fresh")
    clone_fresh(cfg, dest)


def publish(cfg: dict, clone_dir: Path) -> Path:
    out_dir = Path(cfg["output_dir"])
    if not out_dir.is_absolute():
        out_dir = REPO_ROOT / out_dir

    # Start clean so files removed from the vault don't linger in the output.
    if out_dir.exists():
        shutil.rmtree(out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    # Denylist: publish every top-level vault entry except internals (dotfiles,
    # ALWAYS_SKIP) and the configured build inputs / metadata. Robust to the
    # vault being restructured — new content is picked up automatically.
    exclude = set(cfg.get("exclude", [])) | ALWAYS_SKIP
    copied = []
    for entry in sorted(clone_dir.iterdir()):
        name = entry.name
        if name.startswith(".") or name in exclude:
            continue
        dst = out_dir / name
        if entry.is_dir():
            shutil.copytree(entry, dst)
            copied.append(name + "/")
        else:
            shutil.copy2(entry, dst)
            copied.append(name)

    print(f"  ▸ published {len(copied)} entr(y/ies) to {out_dir.relative_to(REPO_ROOT)}/")
    for rel in copied:
        print(f"      • {rel}")

    # Optional repo-held overlay (host pages, etc.) copied on top — repo wins.
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
                    help="where to keep the vault clone (default: ./.vault-clone, or "
                         "'clone_dir' in the config). Persistent + repo-local so a "
                         "containerised sgit can mount it and updates are incremental.")
    ap.add_argument("--fresh", action="store_true",
                    help="delete and re-clone instead of updating an existing clone")
    ap.add_argument("--from-clone", metavar="DIR",
                    help="publish from an EXISTING clone at DIR; skip clone/update "
                         "entirely and never delete DIR (you manage the clone).")
    args = ap.parse_args()

    cfg = load_config(Path(args.config))
    print(f"Publishing: {cfg.get('vault_name', cfg['vault_id'])}")

    # Publish from a caller-managed clone (no clone, no update, no delete).
    if args.from_clone:
        clone_dir = Path(args.from_clone)
        if not clone_dir.is_absolute():
            clone_dir = Path.cwd() / clone_dir
        if not clone_dir.is_dir():
            sys.exit(f"error: --from-clone dir not found: {clone_dir}")
        print(f"  ▸ using existing clone at {clone_dir} (skipping clone/update)")
        out_dir = publish(cfg, clone_dir)
        print(f"Done. Deploy root: {out_dir}")
        return

    # Persistent, repo-local clone: clone once, then `sgit pull` on later runs.
    clone_root = args.clone_dir or cfg.get("clone_dir") or DEFAULT_CLONE_DIR
    clone_root = Path(clone_root)
    if not clone_root.is_absolute():
        clone_root = REPO_ROOT / clone_root
    clone_dir = clone_root / cfg["vault_id"]

    update_or_clone(cfg, clone_dir, args.fresh)
    out_dir = publish(cfg, clone_dir)
    print(f"Done. Deploy root: {out_dir}  (clone kept at {clone_dir})")


if __name__ == "__main__":
    main()
