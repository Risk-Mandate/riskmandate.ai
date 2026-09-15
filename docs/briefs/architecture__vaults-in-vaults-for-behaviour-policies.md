# Vaults in vaults: the application vault is data, the renderer lives once

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

## 3. What is not settled, honestly

1. **The sub-vault link file itself is not written yet.** The doc's example is
   `{ "vault_id", "ref_id": "lk-…", "label" }` and the derivation of `ref_id` is not
   published; a malformed link would render as a broken folder in the vault browser. The
   loader is written to use the link when it exists (route 1) and does not need it (route 2),
   so the vaults ship without it. **Ask:** the `ref_id` rule, and whether sgit can write
   the owner record `.vault/owner/ro-links.json` — the doc says sub-vault access from the
   CLI is proposed, not shipped.
2. **Route 2 inside the SG/Vault host is untested.** It needs `fetch` to the vault API from
   inside the app sandbox; the authoring contract forbids *declared* external resources and
   is silent on a runtime fetch. If the host's CSP blocks it, route 1 (once the link exists)
   is the only in-host path, and the loader's error screen says which routes failed and why.
3. **Static hosting.** `SG_STATIC` vaults have no backend; route 2 would fail and route 3
   needs the app copied beside the vault. Not our case today.
4. **The renderer's file links** (`AGENTS.md` and so on) open in the host's viewer inside a
   vault host; in the site embed they open the copy this site serves. Inside the loader route
   there is no difference: the renderer runs in the application vault's window.

## 4. The rule that made this easy

The renderer was already forbidden from carrying the vault's data as anything but a
fallback, and every read already went through one function. Removing the fallback and
moving the file was the whole change; the loader is the reader we already had on the site,
copied one more time, which is what its brief says to do.
