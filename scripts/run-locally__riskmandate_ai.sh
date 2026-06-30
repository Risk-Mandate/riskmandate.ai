#!/bin/bash
# ---------------------------------------------------------------------------
# Local dev server for riskmandate.ai
#
# Simulates the GitHub Pages deploy locally:
#   1. runs vault_publisher/publish.py  → clones the website vault (read-only)
#      and writes the deploy tree to ./.public-generated-files  (what CI ships)
#   2. serves ./.public-generated-files with a no-cache static server on localhost
#
# The /app/ host page embeds the SG vault app, which decrypts content with the
# Web Crypto API (AES-256-GCM). Web Crypto only runs in a secure context, so use
#   http://localhost:PORT      ✅  (localhost is treated as secure)
#   http://127.0.0.1:PORT      ❌  (not a secure context — Web Crypto disabled)
#
# Requires: python3, and `sgit` (pip install sgit-ai). sgit is resolved as:
#   $SGIT      a full command (use this for an alias / container wrapper), or
#   $SGIT_BIN  a path to the binary, or
#   sgit       on PATH, or
#   a local ./.venv this script auto-provisions as a last resort.
#
# Usage:
#   bash scripts/run-locally__riskmandate_ai.sh [PORT]      # default PORT 10070
#   SGIT="container exec sgit-box sgit" bash scripts/run-locally__riskmandate_ai.sh
# ---------------------------------------------------------------------------
set -euo pipefail

PORT="${1:-10070}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"
SERVE_DIR="$REPO_ROOT/.public-generated-files"

# ─── Resolve sgit (publish.py shells out to it) ────────────────────────────
# Precedence: $SGIT (full command — e.g. a container/alias wrapper) > $SGIT_BIN
# (path) > sgit on PATH > a repo-local ./.venv (auto-provisioned, last resort).
#
# NOTE: if your `sgit` is a shell ALIAS (e.g. it runs inside a container), this
# script cannot see it — aliases aren't exported to scripts. Pass the underlying
# command via SGIT instead, e.g.:
#   SGIT="container exec sgit-box sgit" bash scripts/run-locally__riskmandate_ai.sh

# A Python is OK for sgit-ai iff it isn't 3.14+ (those misparse the clone args:
# the directory positional is consumed as the key -> "non-hexadecimal ...
# fromhex" + a stray "None" folder).
py_ok() {
    local v
    v="$("$1" -c 'import sys;print("%d.%d"%sys.version_info[:2])' 2>/dev/null)" || return 1
    case "$v" in 3.14|3.15|3.16|"") return 1 ;; *) return 0 ;; esac
}

if [ -n "${SGIT:-}" ]; then
    export SGIT
    echo "  sgit: (SGIT) $SGIT"
elif [ -n "${SGIT_BIN:-}" ] && [ -x "${SGIT_BIN:-}" ]; then
    echo "  sgit: $SGIT_BIN"
elif command -v sgit >/dev/null 2>&1; then
    export SGIT_BIN="$(command -v sgit)"
    echo "  sgit: $SGIT_BIN"
elif [ -x "$REPO_ROOT/.venv/bin/sgit" ] && py_ok "$REPO_ROOT/.venv/bin/python"; then
    export SGIT_BIN="$REPO_ROOT/.venv/bin/sgit"
    echo "  sgit: $SGIT_BIN"
else
    echo "sgit not found (or existing .venv uses an incompatible Python)."
    echo "  If you run sgit via an alias/container, re-run with SGIT set, e.g.:"
    echo "    SGIT=\"container exec sgit-box sgit\" $0"
    echo "  Otherwise provisioning a local copy into $REPO_ROOT/.venv (one-off) ..."

    # Pick a known-good Python for the venv (avoid 3.14+; see py_ok above).
    VENV_PY=""
    for cand in python3.12 python3.11 python3.13 python3.10 python3; do
        command -v "$cand" >/dev/null 2>&1 || continue
        if py_ok "$cand"; then VENV_PY="$cand"; break; fi
    done
    if [ -z "$VENV_PY" ]; then
        echo ""
        echo "ERROR: no Python 3.11–3.13 found, and sgit-ai 0.14.27's read-only"
        echo "clone is broken on Python 3.14 (an sgit-ai bug — it calls"
        echo "fromhex(\"None\") internally; that's also the stray 'None/' folder)."
        echo ""
        echo "Pick one:"
        echo "  1. Install a 3.11–3.13 Python, then re-run. e.g.:"
        echo "       brew install python@3.12"
        echo "  2. Use your own sgit (e.g. a container), which runs a compatible"
        echo "     Python. Pass it via SGIT (single-quoted). A container wrapper"
        echo "     that mounts the repo works — \$(pwd) is evaluated at the repo"
        echo "     root and the clone dest is repo-relative. Drop -it (no TTY):"
        echo "       SGIT='container run --rm -v \"\$(pwd):/vault\" -v /tmp:/tmp <your-sgit-image>' \\"
        echo "         $0"
        echo "     (run 'type sgit' to see the image + flags your alias uses)"
        exit 1
    fi
    echo "  using $VENV_PY ($("$VENV_PY" --version 2>&1)) for the venv"
    rm -rf "$REPO_ROOT/.venv"          # clear any previous (possibly bad) venv
    "$VENV_PY" -m venv "$REPO_ROOT/.venv"
    "$REPO_ROOT/.venv/bin/pip" install -q --upgrade pip
    "$REPO_ROOT/.venv/bin/pip" install -q -r "$REPO_ROOT/vault_publisher/requirements.txt"
    export SGIT_BIN="$REPO_ROOT/.venv/bin/sgit"
    echo "  sgit: $SGIT_BIN"
fi

# ─── Generate the static tree (the CI build, locally) ──────────────────────
echo "Generating static site → $SERVE_DIR ..."
rm -rf "$SERVE_DIR"
python3 "$REPO_ROOT/vault_publisher/publish.py" || {
    echo ""
    echo "ERROR: publish.py failed — server not started."
    exit 1
}

# ─── Serve ─────────────────────────────────────────────────────────────────
echo ""
echo "Starting riskmandate.ai local server..."
echo "  Root: $SERVE_DIR"
echo ""
echo "  URLs:"
echo "    Site (home):    http://localhost:$PORT/"
echo "    Vault app MVP:  http://localhost:$PORT/app/"
echo ""
echo "  IMPORTANT: use 'localhost', not '127.0.0.1' — the /app/ vault app needs a"
echo "  secure context for Web Crypto."
echo ""

PORT="$PORT" SERVE_DIR="$SERVE_DIR" python3 << 'PYEOF'
import http.server, os
PORT = int(os.environ['PORT'])
SERVE_DIR = os.environ['SERVE_DIR']

class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Always serve fresh JS/content during local dev
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        super().end_headers()

os.chdir(SERVE_DIR)
print(f"Serving {SERVE_DIR} at http://localhost:{PORT}/  (Ctrl+C to stop)")
http.server.HTTPServer(('localhost', PORT), NoCacheHandler).serve_forever()
PYEOF
