# The vault pages, read against the vault: show the thing, and stop copying it

> Rendered from docs/briefs/review__vault-pages-vs-the-vault.md in the repository. The text below is that file.
> Source: https://riskmandate.ai/admin/briefs/review__vault-pages-vs-the-vault/ · noindex · written by scripts/site/build-admin.mjs

**Date:** 2026-09-15 · **Author:** @website-agent
**Trigger:** project lead's review of 15 September — *"review the UX and experience of abp-vault-claude-code-web.html and vaults/claude-code-web/index.html since that is actually quite confusing … we should be using the data that is in the vault, not on the website, which I think is a mistake to have the full vault on the github site … look at how sgit does it"*, with the sgit Licence to Operate demo page as the reference
**Reads against:** `abp-vault-claude-code-web.html` and `vaults/claude-code-web/index.html` at v1.18.0; `sgit.ai/demos/vaults/licence-to-operate/`; sgit's `vault-ui-embed.js`; the site's own demo pages (`demo-*.html`, which already embed the host); `architecture__vaults-in-vaults-for-behaviour-policies.md`

---

## 1. What was confusing, specifically

**Two pages, three renderings, and none of them was the product.** A reader who arrived at
the vault page met a hero, then five sections of tables rendered by this site's components,
then a section titled *the app* containing the vault's renderer booted inside a `srcdoc` frame
with a shim, then a file list whose links opened copies on this site, then the key. A button
sent them to `vaults/<slug>/index.html`, which is the loader: a page that fetches the renderer
from the app vault and, on this site, takes the static route and says so in a monospace bar
(*static copy · … · app via a static copy beside this vault*). Nothing on either page was the
vault as a buyer would receive it. The reader saw our tables, our sandbox and our loader, and
had to take the sentence *every number on this page is decrypted from the vault as you read it*
on trust.

**The section numbers said 01, 02, 02, 02, 02, 03, 04.** Small, and a tell: the page had
grown by accretion.

**The site carried the whole vault.** Every application vault's derived documents, its zip,
its PDF, its history and its loader are committed under `site/vaults/<slug>/` and deployed.
That is what let the page fall back to a snapshot when the vault could not be read, and it is
what the loader's third route needs. It is also a second copy of the product on a public web
root, one commit behind the vault at best, and it invites exactly the reading the lead gave
it: if the site has the files, why is there a vault?

## 2. What the sgit page does that ours did not

The Licence to Operate demo page opens with **the product itself, twice**: the vault's app in
App Mode, and beneath it the vault browser with the file tree on the left and the same app
running under `index.html`. Both are the official SG/Vault interface, opened read-only over the
embed handshake with the key printed on the page. The page's own prose comes after, and it
reads the decks *out of the vault* rather than out of the page. A visitor sees the thing in
action and the thing's contents in the same scroll, and understands what a vault is without
being told.

We already had the mechanism. The six demo pages have embedded the host over the same protocol
since v1.0.0 (`registry.js`: `?embed=1`, `vault-embed-ready`, `vault-open` with the key, mode
`auto`). The vault pages simply did not use it; they used a house reader and a sandbox instead,
built when the sub-vault link was not yet writable and the host could not open an application
vault's app. That reason is gone since v1.13.0.

## 3. What changed in v1.19.0

- **Section 01 is now *See it live*: two host frames.** App Mode first (what whoever is handed
  the policy sees), the vault browser second (every file, the history, the app under
  `index.html`), both opened read-only by the host with the key handed over the handshake and
  never in a URL. One new component, `rm-abp-host`, forty lines, the demo pages' engine with
  the host's `mode: 'app' | 'vault'` instead of `auto`.
- **The `srcdoc` app section is gone from the page**, and so is the button to the loader. The
  loader and the static copy of the renderer stay where they are for the vault's own route 3
  and for the zip; nothing on the page advertises them.
- **The sections are numbered once**, 01 to 08, alternating backgrounds restored.
- **Every vault page sells.** *Buy this policy, from £5* in the hero and the closing panel, to
  the store's page for the same slug (the store uses our slugs).

## 4. What should change next, and it is a task brief (T09)

**Stop deploying the vault.** The inputs (`vault.json`, `data/grant.json`, `data/mandate.json`,
`data/scenarios.json`, `data/vocabulary/`) stay in the repository: they are what the build
derives from and what CI checks. The derived files, the zip, the PDF, the loader, the history
and the `.vault/` link are the vault's, and the vault is where they should live. Concretely:

1. The build writes derived output to a directory outside `site/` (say `vaults/<slug>/` at the
   repository root, or a build directory that is git-ignored), and the push to sgit takes it
   from there. `--check` still derives and compares; nothing about the derivation changes.
2. The site's components lose the snapshot fallback. A vault that cannot be read renders the
   failure, with the key and the *open in its own tab* link, not a stale copy. The page already
   says *read live*; it should be true without a hedge.
3. The file list links into the vault browser (a path in the fragment the host understands, or
   the browser frame scrolled to the file) rather than to `site/vaults/<slug>/<file>`.
4. The catalogue keeps `vid` and `key`; the page generator keeps reading the derived data for
   the static tile text at build time from the build directory, not from `site/`.
5. `vaults/<slug>/index.html` on this site goes away with the rest; the app vault's loader is
   the vault's `index.html`, and the host opens it.

What this costs: a vault's page cannot render while the vault endpoint is down. What it buys:
the site holds one copy of nothing, the sentence *every number on this page is decrypted from
the vault as you read it* is the whole truth, and the lead's objection is answered in the
architecture rather than in the copy. Half a day; the tests that reference `site/vaults/` move
with it.

## 5. What this does not settle

- Whether the host's vault-browser embed can be told which file to open. sgit's page does not
  do it; the host may not support it yet. Item 3 above depends on it or on a fragment convention.
- Whether the app vault `fl3i7lu4` should also stop being mirrored at `site/vaults/_app/`. The
  page generator needs the renderer's version number, not its bytes; the catalogue carries it.
- The zip at level 1 of the store is built by this generator. When the derived output moves,
  the store's pack has to be built from the vault or from the build directory, and the store
  agent needs to know which.
