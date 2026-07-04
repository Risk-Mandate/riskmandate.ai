# Architecture Brief — Decoupling site structure from content

**Status:** PROPOSED — for review by Dinis + the vault team
**Author:** @website-agent (Claude Code Web session)
**Date:** 2026-07-04
**Companion:** `implementation__scenarios-pilot.md` (the concrete first step)
**Pattern source:** [Building on sgraph.ai](https://sgraph.ai/en-gb/library/building-on-sgraph.md)
(docs 00–05) + the "Hosting a vault on static storage" guide (`SGSend.staticMode`).

---

## TL;DR

Split riskmandate.ai into two planes with different owners, lifecycles, and
quality regimes:

- **Structure** (this repo): HTML shells, shared components, the vault-client
  integration, CI, tests, QA. Changes ship through engineering practice —
  branches, reviews, pipelines, tags.
- **Content** (dedicated SG/Vaults): encrypted at rest, **decrypted in the
  visitor's browser**, published with a `sgit push` — zero CI, zero redeploy,
  zero full-vault clone.

Migrate one content area at a time (strangler pattern), starting with the
**Scenarios** page. Each migrated area needs exactly one change in the website
vault: repoint its menu link to the new repo-owned page.

---

## 1. The problem today

Everything lives in one vault (`7rfetjwz`) and the repo is a dumb mirror:

1. **Structure and content are coupled.** The interactive scenario engine
   (code) and the scenario copy (content) ship in the same build; a copy edit
   and an engine change ride the same release train, gated by the same
   `build.js`, owned by the same team.
2. **The version salad.** The vault now carries the IFD frozen chain, HEAD
   singleton pages, `src/pages/`, `src/data/`, `assets/`, team docs, tests —
   19+ published files per deploy and growing with every design snapshot.
   That chain is *good engineering for design snapshots*, but it forces all
   content through it.
3. **Publish = full re-clone.** Every content change requires CI to clone the
   entire vault and redeploy the whole site. The vault moved 0.4.2 → 0.8.0 in
   ~two days; each sync was a manual dispatch + full rebuild.
4. **Engineering rigor lives in the wrong place.** The repo (where CI, review,
   and tests are cheap) contains almost no code; the vault (where none of that
   exists beyond build gates) contains all of it.
5. **One environment.** No dev/prod split; every deploy is production.

Evidence the current direction already points this way: vault release 0.5.4
externalised library content to runtime loads; the GRC scenarios plan was
explicitly designed so scenario rotation is "a data edit, not a build change";
the vault ships `llms.txt` for agents. The architecture below completes that
motion rather than fighting it.

## 2. Target architecture

```
  CONTENT PLANE                          STRUCTURE PLANE
  (SG/Vaults, one per area)              (this repo — Claude Code Web + CI)
  ─────────────────────────              ────────────────────────────────
  rm-scenarios vault                     /scenarios/ shell page
  rm-library vault (later)               /library/ shell page (later)
  rm-<area> vault (later)                shared: rm-chrome, vault-client glue,
  …                                        sanitizer, tests, CI pipeline
  authored by content/GRC agents         owned by engineering agents
  publish = sgit push                    publish = git push → tag → deploy
       │                                        │
       │            DELIVERY PLANE              │
       │   (GitHub Pages now; S3+CloudFront     │
       │    when edge features are needed)      │
       └──────────────┬─────────────────────────┘
                      ▼
              visitor's browser
       shell (static) + content (fetched → DECRYPTED CLIENT-SIDE → rendered)
```

### The runtime model (per migrated area)

1. The static shell page loads (repo-built, deployed by CI).
2. It imports the vault-client (`importReadKey`, `readObject`, path/ref
   resolution — the same primitives sgraph.ai's shells use).
3. It resolves the area vault's **branch ref → commit → tree → content path**
   and fetches only the objects it needs (a manifest + the content blobs) from
   the vault server (`dev.send.sgraph.ai` today).
4. Objects are **AES-256-GCM ciphertext**; the browser decrypts with the
   area's **public read key** (embedded in the shell — public by design, same
   trust model as sgraph.ai's `public-vaults.json`; write keys never appear
   anywhere in this repo).
5. Content renders through the shell's components, sanitized (DOMPurify) —
   we do not inherit sgraph's known unsanitized-injection gap (their CR-01).

**Consequences:** a content publish is visible on the next page load. No CI.
No clone. No redeploy. And the fetches are per-object — the "full clone to
publish" problem disappears for every migrated area.

### What stays in the website vault

The marketing site's **design-version chain** (the IFD frozen deltas, the
switcher, `frozen.json`) is a genuinely good mechanism for *design snapshots*
and stays where it is. Migration drains the *content areas* out of it one at a
time; the chain keeps shrinking toward what it's actually for. End state: the
website vault holds the versioned marketing designs; everything editorial
lives in per-area content vaults; the repo holds all code.

## 3. Environments: content × structure

The two planes version independently, which simplifies environments:

- **Content environments are sgit branches.** The vault already has commits
  and branches; a shell pinned to ref `main` shows prod content, pinned to
  ref `dev` shows staging content. Promotion = a sgit branch operation. No
  deployment involved. (A `?branch=` override in the shell gives free content
  preview on any environment.)
- **Structure environments are deployments.** Only shell/component changes
  need a second deployment target.

### Delivery options for the structure split

| Option | How | Pros | Cons |
|---|---|---|---|
| **A. Single Pages site** (today) | one repo, one site; content envs via branch pinning | zero new infra; enough for the pilot | no structure staging; every shell change is prod |
| **B. Two GitHub repos** | this repo → riskmandate.ai; a `riskmandate.ai-dev` repo → dev.riskmandate.ai (Pages is one site per repo; CI here pushes the artifact to the dev repo via deploy key) | stays on Pages; real structure staging | cross-repo deploy plumbing; two Pages configs; still no edge functions |
| **C. S3 + CloudFront** (the sgraph.ai model) | per-env distributions (dev./www); CF Function for rewrites; optional Lambda@Edge later | matches sgraph exactly; per-env cache control; enables live `.md`/`llms.txt` edge rendering; can serve the encrypted `bare/` tree same-origin (no CORS, no send-server dependency) | AWS account/secrets/infra to stand up and operate |

**Recommendation:** run the pilot on **A** (it's additive — a new page, no risk
to the current site). Move to **C** when either trigger fires: (1) we want live
edge-rendered `.md`/`.llm.json` for agents (the vault's baked `llms.txt` goes
stale between syncs), or (2) we adopt static hosting of the encrypted `bare/`
tree (`SG_STATIC`) and want it same-origin. **B** is the fallback only if AWS
is blocked and structure staging becomes urgent before then.

## 4. Trust & hardening (non-negotiables for every shell)

- Read keys are public **only** for genuinely public content; one key per
  area vault so rotation is area-scoped. Write keys/tokens: never in the repo,
  never in CI — content publishing is decoupled from code deploy *by design*.
- The browser vault-client requires the **base64url** key form; sgit uses hex.
  Both encode the same 32 bytes; the shells embed base64url (converter in the
  implementation brief). This silent-failure gotcha is documented upstream.
- Sanitize all vault-derived HTML/strings (DOMPurify + attribute escaping).
- CORS: shells on riskmandate.ai fetch from `dev.send.sgraph.ai` — permissive
  GET CORS must be confirmed (asked of @main-rm-vault in comms msg 001);
  Option C's same-origin layout removes the dependency entirely.

## 5. Migration strategy (strangler)

1. **Scenarios** (pilot — see the implementation brief): structured JSON
   content, clean logic/data split, GRC already owns the content lifecycle.
2. Statics scenarios, then **Library** (the vault team already externalised
   its loading — it is the most vault-ready area).
3. Each area: create vault → build shell → QA → repoint one menu link in the
   website vault → done. **Rollback is repointing the link back.**
4. Extract the shared chrome (`rm-chrome`: header/menu/footer as a repo
   component fed by a runtime site manifest) after the *second* area proves
   the duplication — not speculatively before.
5. End state: website vault = design snapshots only; repo = all shells and
   components with tests and CI; N content vaults publishing at will.

## 6. Decisions needed

| # | Decision | Owner | Default if unblocked |
|---|---|---|---|
| 1 | Create the `rm-scenarios` vault (id + keys) | Dinis / vault team | new dedicated vault |
| 2 | CORS confirmation on `dev.send.sgraph.ai` | vault/platform team | assumed permissive GET |
| 3 | Who ports the scenario engine JS into the repo | engineering (this agent) | this agent, with tests |
| 4 | dev.riskmandate.ai domain + when to split envs | Dinis | defer past pilot |
| 5 | S3/CloudFront timing | Dinis | on first edge-rendering need |
