# How riskmandate.ai actually works

The load sequence, the file layout, and the integration with the SG/Vault.
(Written against vault v0.4.2 — the IFD-versioned host-shell structure. Where
this doc drifts from the vault, the vault wins.)

## The one-paragraph version

The website's **content lives in an SG/Vault** (`7rfetjwz`), not in this repo.
The vault team authors under `src/` and runs `node build.js`, which emits
self-contained HTML pages into the vault. This repo only **publishes** those
pages: CI clones the vault read-only, copies everything except build inputs
into `.public-generated-files/`, and deploys that to GitHub Pages behind
riskmandate.ai. The same vault HTML also runs unmodified inside the SG/App
host and the vault browser preview — it never knows which host it's on.

---

## 1. The three places the same HTML runs

| Context | Served by | How pages read files |
|---|---|---|
| **SG/App host** (`dev.vault.sgraph.ai/#<key>:<id>`) | app-shell kernel, decrypting the encrypted vault in-browser | `window.sg` bridge → `sg.vfs.readText(path)` |
| **Vault browser preview** | send-browse viewer | `fetch()` fallback |
| **riskmandate.ai** (GitHub Pages) | plain static files (this repo's publish) | `fetch()` fallback, relative paths |

The portability trick is one small IO seam, `content.js` (built into the
pages):

```js
function readText(path) {
  if (window.sg && sg.vfs) return sg.vfs.readText(path);   // App Mode
  return fetch(path.replace(/^\//,''), {cache:'no-store'}) // preview / static
         .then(r => r.text());
}
```

Everything above that seam is identical in all three contexts. This is the
core design principle: **the vault app has no knowledge of where it runs.**

## 2. Load sequence on riskmandate.ai (static)

```
browser GET https://riskmandate.ai/
  └─ GitHub Pages serves index.html          ← the HOST SHELL (built file)
       shell = a full-bleed <iframe id="stage"> + ~80 lines of JS
       RM.data.latestFile = "v0/v0.4/v0.4.0/index.html"   (baked in by build.js)

  1. host.js calls content.readText(latestFile)
       → fetch("v0/v0.4/v0.4.0/index.html")               (relative GET)
  2. response HTML is injected into the iframe via `srcdoc`
       → each page runs in its own document with its own custom-element
         registry, so switching versions can never collide
  3. the inner page renders — it is fully SELF-CONTAINED
       (inline CSS/JS/data; it fetches nothing at runtime)
  4. navigation: inner pages post messages to the host —
       {type:'rm-nav', file:'dev.html'}        → host loads that file into the stage
       {type:'rm-nav', file:'partners.html'}   → same mechanism, any top-level page
       {type:'rm-back'}                        → host reloads the last version page
  5. the version switcher in the page header is the same mechanism:
       it rm-nav's to v0/v0.3/v0.3.0/index.html, etc. (registry: versions.json)
  6. host.js posts {type:'sg-app-ready'} to window.parent —
       meaningful in the SG/App host, harmless no-op on the static domain
```

So on the static site only **two GETs** happen for the main page: the shell,
then the selected version page. `dev.html` / `partners.html` load on demand
through the same `readText` seam.

### Files that must exist on the static host (and why)

| Path | Role |
|---|---|
| `index.html` | host shell (iframe + loader + nav message handling) |
| `v0/v0.<maj>/v0.<maj>.<min>/index.html` | the versioned marketing pages (self-contained) |
| `dev.html` | the Dev/release-log page (self-contained; data baked in at build) |
| `partners.html` | example of a top-level page (v0.4.1's "top-level page system") |
| `versions.json` | version registry — `latest` + the switcher's list |
| `version` | bare current version (e.g. `0.4.2`) |
| `dev/releases.json`, `dev/releases/*.md` | release-notes source of truth (authored in the vault) |
| `app/index.html` | repo-owned overlay: the MVP embedded-vault-app page (see §5) |

## 3. Load sequence in the SG/App host (the vault-native path)

```
browser → https://dev.vault.sgraph.ai/#<readKey>:<vaultId>
  1. vault-loader routes the hash → /en-gb/app (the app-shell page)
  2. app-shell boots: sg-send transport + sg-vault crypto (AES-256-GCM,
     content-addressed objects) — all decryption happens IN THE BROWSER;
     the server only ever stores/serves ciphertext
  3. it reads the vault's app.json → { entry: "index.html", auto_open: true }
  4. it injects the `window.sg` bridge and runs the vault's index.html
     in a sandboxed frame
  5. the same host shell runs — but now content.readText goes through
     sg.vfs.readText (decrypted vault reads) instead of fetch
```

Opened without an access token the vault is **read-only**
(`sg.app.writable === false`); with a write token the same app is writable.
Same HTML, two backends.

## 4. The vault itself (SG/Vault `7rfetjwz`)

- A **content-addressed, encrypted, git-like store** ("sgit") served by
  `https://dev.send.sgraph.ai`. Objects are AES-256-GCM blobs named by content
  hash (`obj-cas-imm-…`); refs/commits/trees work like git.
- The **read key is public by design** (it's in `vault_publisher/vault.config.json`
  and in `/app/index.html`): encryption here provides integrity and a uniform
  storage model, not confidentiality — this is a public marketing site. The
  **write key is never in this repo**.
- Inside the vault: `src/` (authoring: core logic, components, styles, page
  sources per version) + `build.js` (assembles, inlines, gates) → the built
  artifacts listed in §2. **Built files are never hand-edited**; the vault
  team owns that loop. `sgit ls` / `sgit cat` / `sgit pull` work read-only.

## 5. How the vault becomes riskmandate.ai (the publish pipeline)

```
SG/Vault 7rfetjwz  ──sgit clone/pull──►  vault_publisher/publish.py
   (encrypted, remote)                      │  keeps a persistent clone in ./.vault-clone/
                                            │  copies EVERYTHING except:
                                            │    dotfiles, .sg_vault/, .vault/   (internals)
                                            │    src/ build.js test/ app.json README.md  (build inputs)
                                            │  then overlays web_overlay/  (repo-owned pages, e.g. /app/)
                                            ▼
                                 .public-generated-files/        (gitignored build artifact)
                                            │
                              GitHub Actions (CI Pipeline)
                                 tag bump → build → deploy
                                            ▼
                              GitHub Pages  →  https://riskmandate.ai/
```

Key properties:

- **Denylist, not allowlist**: new vault pages (e.g. `partners.html` in v0.4.1)
  go live automatically, with no publisher change. The vault has restructured
  several times; this survives it.
- **Sync semantics**: deploys are triggered by **GitHub events** (push to
  `dev`/`main`, or manual `workflow_dispatch`) — *not* by vault pushes. A
  vault-only edit reaches the live site on the next CI run. Every CI run
  rebuilds from the vault's current HEAD, so each deploy is a full re-sync.
- The `/app/` page (from `web_overlay/`) is the exception to "content lives in
  the vault": it's a repo-owned host page that embeds the **SG app-shell**
  read-only, so riskmandate.ai/app serves the *encrypted-at-rest* vault app
  with client-side decryption — the same app as §3, framed. See
  `docs/hosting-mvp.md` for that model (and the future step: hosting the
  encrypted `bare/` tree itself on Pages with `SG_STATIC=true`).

## 6. Local development

```bash
./scripts/run-locally__riskmandate_ai.sh     # → http://localhost:10070/
```

Replicates the CI build locally: resolves an `sgit` (env `SGIT` command /
`SGIT_BIN` path / PATH / auto-provisioned `.venv`), clones-or-pulls the vault
into `./.vault-clone/`, publishes to `./.public-generated-files/`, and serves
it with no-cache headers on **localhost** (not 127.0.0.1 — the `/app/` page
needs a secure context for Web Crypto).

## 7. Related docs

- `vault_publisher/README.md` — the publisher in detail (config, sgit
  resolution, denylist rationale).
- `docs/hosting-mvp.md` — the `/app/` embedded-vault-app MVP and the roadmap
  to fully-static encrypted hosting.
- The vault's own `README.md` (in the vault, not this repo) — the authoring
  and build contract (`src/` → `build.js`, version lockstep gates).
- The sgraph.ai library (`https://sgraph.ai/en-gb/library/building-on-sgraph.md`)
  — the general pattern this site follows.
