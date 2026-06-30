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
# Requires: python3, and `sgit` (pip install sgit-ai). If sgit isn't on PATH or
# in $SGIT_BIN, this script provisions it into a local ./.venv automatically.
#
# Usage:
#   bash scripts/run-locally__riskmandate_ai.sh [PORT]      # default PORT 10070
# ---------------------------------------------------------------------------
set -euo pipefail

PORT="${1:-10070}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"
SERVE_DIR="$REPO_ROOT/.public-generated-files"

# ─── Resolve sgit (publish.py shells out to it) ────────────────────────────
if [ -n "${SGIT_BIN:-}" ] && [ -x "${SGIT_BIN:-}" ]; then
    :
elif command -v sgit >/dev/null 2>&1; then
    export SGIT_BIN="$(command -v sgit)"
elif [ -x "$REPO_ROOT/.venv/bin/sgit" ]; then
    export SGIT_BIN="$REPO_ROOT/.venv/bin/sgit"
else
    echo "sgit not found — provisioning into $REPO_ROOT/.venv (one-off) ..."
    python3 -m venv "$REPO_ROOT/.venv"
    "$REPO_ROOT/.venv/bin/pip" install -q --upgrade pip
    "$REPO_ROOT/.venv/bin/pip" install -q -r "$REPO_ROOT/vault_publisher/requirements.txt"
    export SGIT_BIN="$REPO_ROOT/.venv/bin/sgit"
fi
echo "  sgit: $SGIT_BIN"

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
