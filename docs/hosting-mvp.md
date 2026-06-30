# Hosting the website vault app on riskmandate.ai — MVP

Goal: serve the Risk Mandate website **vault app** (vault `7rfetjwz`) from
riskmandate.ai with **no code changes to the vault app**. The app only talks to
`window.sg`; the SG app-shell injects that bridge and decrypts everything in the
browser. Reference: the vault team's "Hosting a vault on static storage —
GitHub Pages / S3" guide (`SGSend.staticMode`).

## Two steps

- **Step 1 — MVP (this change).** A host page at **`/app/`** embeds the proven SG
  app-shell (`https://dev.vault.sgraph.ai/en-gb/app/`), opening the vault
  **read-only** (read key only, no access token → `sg.app.writable === false`).
  All encrypted objects are read from the live dev API **`dev.send.sgraph.ai`**
  and decrypted client-side. The page holds only the **public read key**;
  the bytes on the wire are ciphertext.
  - Source: `web_overlay/app/index.html` (deployed to `public/app/` by the
    publisher's overlay step; see `vault_publisher/`).
  - Lives at a subpath so the existing root (the plaintext-extracted site) keeps
    working while we verify the vault-hosted path.

- **Step 2 — full static host (later).** Export the vault's encrypted `bare/`
  tree to GitHub Pages at `/api/vault/read/<vaultId>/bare/...` and set
  `window.SG_STATIC = true` so there is **no backend at all** (paths must mirror
  the API GET paths exactly). Tracked separately.

## Verified

- ✅ Vault `7rfetjwz` reads from `dev.send.sgraph.ai` (read-only `sgit clone`
  against that base URL succeeds).
- ✅ `https://dev.vault.sgraph.ai/en-gb/app/` is the canonical host: it boots
  `sg-send` + the `app-shell` kernel, which opens the vault and runs its
  `index.html` (the vault's `app.json` has `auto_open: true`).
- ✅ That host sends no `X-Frame-Options` / CSP `frame-ancestors`, so embedding
  from riskmandate.ai is not blocked.
- ✅ Publisher produces root site **+** `/app/` without breaking either.

## Pending verification / open questions

- ⏳ **Live render not verified in-sandbox.** The dev environment's egress proxy
  blocks headless Chromium (even `example.com` → `ERR_CONNECTION_CLOSED`), so the
  end-to-end render of `/app/` could not be confirmed here. **Verify on the live
  domain** (`https://riskmandate.ai/app/`) after deploy.
- ⏳ **Read-key format.** The app-shell may expect the read key as **hex**
  (as supplied) or **base64url** (`kr1vp-R9NpLnMAzXRB3UeMnNKPhx-QQa0oxVwiL8sr0`).
  The host page defaults to hex with the base64url form noted inline — swap if
  the vault doesn't open.
- ⏳ **Canonical direct-embed.** The MVP iframes the app-shell. The "true" model
  has riskmandate.ai load the host + transport directly. Requested the canonical
  read-only boot snippet from the vault team (Email-FS-lite msg `001`).
- ⏳ **CORS for Step 2** — confirm `dev.send.sgraph.ai` (and later the static
  host) returns permissive `Access-Control-Allow-Origin` for cross-origin reads.
