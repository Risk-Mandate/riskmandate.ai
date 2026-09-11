# riskmandate.ai

The public marketing website for **Risk Mandate.ai**, served at **riskmandate.ai**.

Since **v1.0.0** the site lives here. `site/` is the deployed tree: what is in
that directory is what GitHub Pages serves, byte for byte. There is no build
step, no framework, and nothing to install to work on it — open a page in a
browser and it works.

Before v1.0.0 the content lived in an SG/Vault (`7rfetjwz`) and this repo held
the tooling that published it. That vault is frozen and kept as the historical
record, including the twelve design snapshots the site used to serve at once.
[`site/versions/1.0.0.md`](site/versions/1.0.0.md) says exactly what changed and
[`site/versions/source-snapshot.json`](site/versions/source-snapshot.json) carries
a SHA-256 digest of every file the snapshot was taken from, so the copy is
checkable against a fresh clone of the vault.

## Layout

```
site/                    The deployed tree. One HTML document per page, each with
                         its own URL, its own inline CSS and JS, and a markdown twin.
site/versions/           The version record: index.json plus one note per release.
site/scenarios/          The decoupled-content pilot — reads SG/Vault `dm42qcaw`
                         in the browser (see docs/briefs/).
site/assets/             Images, the library data, the proposition deck.
scripts/site/            generate.mjs (derived files) and release.mjs (cut a version).
scripts/migrate/         The one-off that produced v1.0.0 from the vault. History.
tests/site/              Structural checks over site/. Run with `node --test`.
```

## Quick start

```bash
bash scripts/run-locally__riskmandate_ai.sh        # → http://localhost:10070/
```

Use `localhost`, not `127.0.0.1` — `/scenarios/` decrypts vault content with the
Web Crypto API, which needs a secure context.

## Making a change

1. Edit the page in `site/`. It is a plain HTML document; there is nothing to rebuild.
2. `node scripts/site/generate.mjs` — refreshes the derived files (each page's
   markdown twin, `sitemap.xml`, `robots.txt`, `llms.txt`, `404.html`).
3. `node --test tests/site/*.mjs` — structural checks.
4. Cutting a release: `node scripts/site/release.mjs 1.0.1 "What changed, in a line"`,
   then write the notes it stubs out at `site/versions/1.0.1.md`.

CI runs steps 2 and 3 as gates, tags the commit with the version declared in
`site/versions/index.json`, and deploys `site/`. Nothing bumps the version for
you: a release is a note somebody wrote.

## Docs

- [`docs/how-the-website-works.md`](docs/how-the-website-works.md) — **start
  here**: how a page is put together, how the shared header is built, and what
  each component does.
- [`docs/briefs/`](docs/briefs/) — the structure/content decoupling brief and the
  scenarios pilot it produced.
