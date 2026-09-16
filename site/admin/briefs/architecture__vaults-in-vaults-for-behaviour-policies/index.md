# Vaults in vaults: the application vault is data, the renderer lives once

> Rendered from docs/briefs/architecture__vaults-in-vaults-for-behaviour-policies.md in the repository. The text below is that file.
> Source: https://riskmandate.ai/admin/briefs/architecture__vaults-in-vaults-for-behaviour-policies/ · noindex · written by scripts/site/build-admin.mjs

**Date:** 2026-09-15 · **Author:** @website-agent
**Trigger:** project lead's note of 15 September — *"organise these ABP-specific vaults to use other ABP template vaults so that, out of the box, there is no code on the main ABP-specific vault apart from a loader index.html"*
**Reads against:** sgit.ai `docs/vault/sub-vaults`, `docs/vault/sg-bridge`, `docs/briefs/sgit-ai-site-pages` (all read 15 September); the nine application vaults and the app vault `fl3i7lu4`

---

## 1. The shape, as built

```
 app vault  fl3i7lu4  (public read key)        application vault, e.g. ruj286tr  (public read key)
 ├── index.html    the renderer, once          ├── index.html      the LOADER — same bytes in every vault
 ├── loader.html   the loader's source         ├── app.json        entry: index.html, read only, HUD minimal
 ├── app.json                                  ├── vault.json      who, which shape, status
 ├── README.md                                 ├── data/           grant · mandate · delta · validity · app · vocabulary/
 └── versions/index.json                       ├── *.md            MANDATE · GRANT · DELTA · LICENCE-TO-OPERATE · ABP · README · AGENTS · SKILL
                                               ├── dist/           the zip, the PDF
                                               └── history/        one entry per recompute; the grant check
```

**The loader is about a hundred lines and identical everywhere.** On open it fetches the
renderer and boots it in place, against the vault it is running in, trying three routes in
order and naming the one that answered in the renderer's top bar:

| | Route | When it works | Mechanism |
|---|---|---|---|
| 1 | `sg.vfs.readText('app/index.html')` | inside a vault host that resolves a **sub-vault link** at `app/` | the platform's own cross-vault read: the link file plus an owner record holding the app vault's read key, and the read auto-opens the child read-only ([sub-vaults](https://sgit.ai/docs/vault/sub-vaults.html)) |
| 2 | the app vault, read directly | anywhere with Web Crypto and a network — a browser, an embed | the house reader in the loader: derive the ref id from the app vault's public read key, fetch ciphertext over CORS, decrypt, walk to `index.html` |
| 3 | `../_app/index.html` | the copy served from riskmandate.ai under `site/vaults/` | a same-origin fetch |

The renderer never sees which route ran. Its reads for data go through the same bridge or
same-origin fetch the loader has, so `data/grant.json` resolves in **this** vault, not in the
app vault. Booting is: parse the fetched document, move its styles into the head, its markup
into the body, and append its script as a new script element — the `window.sg` bridge the
host installed on the loader's window is the one the renderer then uses.

**On riskmandate.ai**, the vault pages' embed host does what route 1 expects of a vault host:
a read of `app/<path>` from inside the sandboxed frame is served from the app vault by a
second reader, everything else from the application vault. So the loader takes route 1 there.

## 2. What this buys

- **One renderer, versioned once.** A fix to the app reaches every policy on its next load;
  `versions/index.json` in the app vault names each version's commit.
- **An application vault is data.** Its history is the history of the mandate, the grant and
  the derived documents — the record an underwriter wants — and nothing else moves in it.
- **The generator got smaller.** It no longer injects the data into a copy of the app; it
  writes the loader with the app vault's address, `data/app.json` for what the renderer
  cannot derive (which `dist/` files exist, which app vault), and the documents.
- **A buyer's private vault works the same way.** It carries the same loader; the app vault
  stays public and read-only; no code is copied into the thing that is sold.

## 3. What was not settled, and how it was settled

The first cut shipped without the sub-vault link because the link's format was not
published. The project lead opened `exsaxrfr` (browser extension) in the vault host: no `app`
folder in the tree, no `.vault/` folder, and the app screen showing the loader's error with all
three routes failed — the host blocks a runtime `fetch` from the app sandbox (route 2 is
"Failed to fetch" there, which also answers item 2 below), and the static copy is not beside
the vault inside the host (route 3). Only route 1 works in the host, and route 1 needs the link.

The format is in the host's own source, which it serves unminified
(`dev.vault.sgraph.ai/_common/js/lib/links/vault-links.js`, `components/app-shell/declared-mounts.js`,
`adapters/composite-data-source.js`, and the *Add link* handler in `vault-browse-edit.js`):

| File | Shape | Who reads it |
|---|---|---|
| `app.link.json` | `{ "vault_id": "fl3i7lu4", "ref_id": "lk-…", "label": "app" }` — a dumb pointer; the `.link.json` suffix is the whole signal; **no key may live here** | the tree (renders as the folder `app/`), the composite data source, the kernel's declared-mounts scan |
| `.vault/owner/ro-links.json` | `{ "<ref_id>": { "type": "vault", "label", "pin": {"mode":"latest"}, "vault_id", "read_key": <base64 of the 32 key bytes>, "ref_file_id": "ref-pid-muw-…" } }` | `VaultLinks.resolveRef` → `SGVault.openReadOnly(vault_id, read_key, ref_file_id)`: the child opens read-only with no prompt, on any device that has the parent |

Three facts that made it writable from the generator rather than by hand in the host:

1. **`ref_id` is opaque.** The host generates `'lk-' + 6 random bytes` when a person adds a
   link; the parser only requires a string, and the record is looked up by it. The generator
   derives it (`lk-` + 12 hex of SHA-256 over a fixed label and the app vault's id) so a rebuild
   is byte-identical and `--check` can compare it.
2. **`ref_file_id` is the app vault's named ref**, `ref-pid-muw-` + 12 hex of
   HMAC-SHA256(read key, `sg-vault-v1:file-id:ref:<vault_id>`) — the same derivation the
   house reader already used to read the app vault on the site, so the generator computes it.
3. **The record is read-key tier.** It is an ordinary vault file, readable by any holder of
   the parent's read key, and it carries the *child's read key* — public by design for the app
   vault, which is on this site. The owner tier (`.vault/owner/secrets/<ref>`, sealed with a
   key derived from the write key) is for a *writable* child and is not needed: the app vault
   is read-only from every application vault, which is the point. `.vault/**` is beneath the
   host's permission floor, so the renderer never sees the record either way.

sgit commits `.vault/` (its always-ignored set is `.sg_vault`, `.git`, tool caches and the
`.env*` family; `.vault` is not in it), so the two files ride the same push as the rest of the
vault. Verified with the host's own library code run in Node: from the record in `exsaxrfr`,
`DeclaredMounts.resolveCredentials` yields the read credential and `SGVault.openReadOnly`
opens `fl3i7lu4` at its v3 head.

**Still open.** Nothing in the loader changed. Route 2 stays for embeds outside the host; the
site's vault pages still serve `app/…` from their own second reader. Static (`SG_STATIC`)
hosting is unchanged: route 3 needs the app copied beside the vault, which is not our case.

## 4. The rule that made this easy

The renderer was already forbidden from carrying the vault's data as anything but a
fallback, and every read already went through one function. Removing the fallback and
moving the file was the whole change; the loader is the reader we already had on the site,
copied one more time, which is what its brief says to do.
