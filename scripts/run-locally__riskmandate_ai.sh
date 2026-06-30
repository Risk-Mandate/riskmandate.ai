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
# NOTE: if your `sgit` is a shell ALIAS/function (e.g. it runs inside a
# container), this script cannot see it — those aren't exported to scripts.
# Pass the underlying command via SGIT instead, e.g.:
#   SGIT='container run --rm -v "$(pwd):/vault" -v /tmp:/tmp <image>' \
#     bash scripts/run-locally__riskmandate_ai.sh

# The provisioned venv needs osbot-utils >= 3.75.0 (earlier versions break
# read-only clones on Python 3.14 — fixed upstream). Reject a stale venv so it
# gets rebuilt with the fix.
venv_osbot_ok() {
    "$1/bin/python" - <<'PY' 2>/dev/null
import sys
try:
    import importlib.metadata as m
    a, b = (int(x) for x in m.version("osbot-utils").split(".")[:2])
except Exception:
    sys.exit(1)
sys.exit(0 if (a, b) >= (3, 75) else 1)
PY
}

if [ -n "${SGIT:-}" ]; then
    export SGIT
    echo "  sgit: (SGIT) $SGIT"
elif [ -n "${SGIT_BIN:-}" ] && [ -x "${SGIT_BIN:-}" ]; then
    echo "  sgit: $SGIT_BIN"
elif command -v sgit >/dev/null 2>&1; then
    export SGIT_BIN="$(command -v sgit)"
    echo "  sgit: $SGIT_BIN"
elif [ -x "$REPO_ROOT/.venv/bin/sgit" ] && venv_osbot_ok "$REPO_ROOT/.venv"; then
    export SGIT_BIN="$REPO_ROOT/.venv/bin/sgit"
    echo "  sgit: $SGIT_BIN"
else
    echo "sgit not found (or existing .venv has an outdated osbot-utils)."
    echo "  If you run sgit via an alias/container, re-run with SGIT set, e.g.:"
    echo "    SGIT='container run --rm -v \"\$(pwd):/vault\" -v /tmp:/tmp <image>' $0"
    echo "  Otherwise provisioning a local copy into $REPO_ROOT/.venv (one-off) ..."
    rm -rf "$REPO_ROOT/.venv"          # clear any previous (possibly stale) venv
    python3 -m venv "$REPO_ROOT/.venv"
    "$REPO_ROOT/.venv/bin/pip" install -q --upgrade pip
    "$REPO_ROOT/.venv/bin/pip" install -q -r "$REPO_ROOT/vault_publisher/requirements.txt"
    export SGIT_BIN="$REPO_ROOT/.venv/bin/sgit"
    echo "  sgit: $SGIT_BIN ($("$REPO_ROOT/.venv/bin/python" --version 2>&1))"
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
