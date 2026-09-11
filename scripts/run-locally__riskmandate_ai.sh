#!/bin/bash
# ---------------------------------------------------------------------------
# Local dev server for riskmandate.ai
#
# Serves ./site — the same tree CI uploads to GitHub Pages, byte for byte.
# Since v1.0.0 there is no build step and no vault to clone: what you see here
# is what ships. The only thing this script does before serving is refresh the
# generated files (markdown twins, sitemap, llms.txt, 404), so a page you just
# edited shows up with its twin in step.
#
# /scenarios/ reads an SG/Vault in the browser and decrypts with the Web Crypto
# API, which only runs in a secure context. Use:
#   http://localhost:PORT      ✅  (localhost is treated as secure)
#   http://127.0.0.1:PORT      ❌  (not a secure context — Web Crypto disabled)
#
# Requires: python3, node (for the generator; skipped with --no-generate).
#
# Usage:
#   bash scripts/run-locally__riskmandate_ai.sh [PORT] [--no-generate]
# ---------------------------------------------------------------------------
set -euo pipefail

PORT="10070"
GENERATE="yes"
for arg in "$@"; do
    case "$arg" in
        --no-generate) GENERATE="no" ;;
        *[!0-9]*)      echo "unknown argument: $arg" >&2; exit 2 ;;
        *)             PORT="$arg" ;;
    esac
done

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"
SERVE_DIR="$REPO_ROOT/site"

if [ "$GENERATE" = "yes" ]; then
    if command -v node >/dev/null 2>&1; then
        echo "Refreshing generated files ..."
        node "$REPO_ROOT/scripts/site/generate.mjs"
    else
        echo "node not found — serving site/ as it stands (run with --no-generate to silence)."
    fi
fi

echo ""
echo "Starting riskmandate.ai local server..."
echo "  Root: $SERVE_DIR"
echo ""
echo "  URLs:"
echo "    Site (home):     http://localhost:$PORT/"
echo "    Version record:  http://localhost:$PORT/versions.html"
echo "    Scenarios pilot: http://localhost:$PORT/scenarios/"
echo ""
echo "  IMPORTANT: use 'localhost', not '127.0.0.1' — /scenarios/ needs a secure"
echo "  context for Web Crypto."
echo ""

PORT="$PORT" SERVE_DIR="$SERVE_DIR" python3 << 'PYEOF'
import http.server, os
PORT      = int(os.environ['PORT'])
SERVE_DIR = os.environ['SERVE_DIR']

class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Always serve fresh JS/content during local dev
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        super().end_headers()

    # GitHub Pages serves 404.html for anything missing; match that locally so a
    # broken link looks the same here as it will in production.
    def send_error(self, code, message=None, explain=None):
        page = os.path.join(SERVE_DIR, '404.html')
        if code != 404 or not os.path.exists(page):
            return super().send_error(code, message, explain)
        body = open(page, 'rb').read()
        self.send_response(404, message)
        self.send_header('Content-Type', 'text/html;charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        if self.command != 'HEAD':
            self.wfile.write(body)

os.chdir(SERVE_DIR)
print(f"Serving {SERVE_DIR} at http://localhost:{PORT}/  (Ctrl+C to stop)")
http.server.HTTPServer(('localhost', PORT), NoCacheHandler).serve_forever()
PYEOF
