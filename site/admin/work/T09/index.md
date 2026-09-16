# T09 — Stop deploying the vault: inputs in the repository, the product in the vault

> Rendered from .claude/briefs/T09-stop-deploying-the-vault.md in the repository. The text below is that file.
> Source: https://riskmandate.ai/admin/work/T09/ · noindex · written by scripts/site/build-admin.mjs

**From:** `docs/briefs/review__vault-pages-vs-the-vault.md` §4. **Size:** half a day.
**Touches:** `scripts/site/build-abp-vault.mjs`, `scripts/site/build-abp-pages.mjs`,
`scripts/site/abp/abp-vaults.js`, `site/vaults/<slug>/` (derived files removed from `site/`),
`.gitignore`, `tests/site/test_pages.mjs`, `.github/workflows/ci-pipeline.yml`.

## The task
The application vaults' derived files, zip, PDF, loader, history and `.vault/` link are committed
under `site/vaults/<slug>/` and deployed, so the site carries a second copy of the product and
the pages fall back to it. Move the build output out of `site/` (a build directory, git-ignored,
or a root-level `vaults/` that is not deployed), keep the four input files where they are, keep
`--check` deriving and comparing, and make the pages read the vault or say they cannot.

## Steps
1. `build-abp-vault.mjs` writes to `OUT = <root>/build/vaults/<slug>/` (inputs read from
   `site/vaults/<slug>/`); `--check` compares against `OUT`. CI runs the build before the check.
2. `build-abp-pages.mjs` reads derived data (delta counts, tiers) from `OUT`.
3. `abp-vaults.js` `load()` drops the snapshot fallback: `source` is `live` or the page shows
   `.ab-fail` with the key and the open-in-tab link. `rm-abp-files` links each file into the
   vault browser if the host supports a path in the fragment; otherwise to nothing, listing only.
4. Remove `site/vaults/<slug>/` derived files from git and add the ignore; keep the inputs.
   Decide what happens to `site/vaults/_app/` (the page needs the renderer version, not bytes).
5. Tests: the write-credential test still scans `site/`; the vault derivation check moves to
   `build/`. The test that pages.json accounts for every page is unaffected.
6. Tell the store agent where the level-1 zip is built from now.

## Constraints
- The push to sgit still needs the write keys the lead holds; the build directory is what gets
  pushed. Say so in the work file.
- Nothing about the derivation, the delta semantics or the no-score rule changes.
- The page must be honest when the vault is unreachable: a failure with the key, never a
  stale copy presented as live.

## Done means
- `git ls-files site/vaults/` shows inputs only; `npm run check` green; a vault page renders
  from the vault, and renders a visible failure with the endpoint blocked.
