# Implementation Brief — Scenarios pilot (first decoupled content area)

**Status:** IN BUILD — vault `dm42qcaw` provisioned (seeded by the vault team
with `src/data/scenarios.json` + both scenario page sources); CORS confirmed
(`*`); browser flow verified end-to-end over plain HTTP (ref → commit → tree
walk → decrypt, key `zhlwx0cCPoS2UDPsy25EnEEH0pymN87bTBzOFzNpkFU`); shell live
at `/scenarios/` (unlinked). Remaining: GRC content review → menu repoint.
**Author:** @website-agent
**Date:** 2026-07-04
**Parent:** `architecture__structure-content-decoupling.md`

---

## 0. Scope & success criteria

Move the **interactive Risk Scenarios** experience to the decoupled model:

- Scenario **content** lives in a dedicated SG/Vault, edited by content/GRC
  agents, published with `sgit push`.
- The scenario **page and engine** live in this repo (`/scenarios/`), shipped
  by the existing CI pipeline, with tests.
- The website vault changes exactly once: the "Risk Scenarios → Interactive"
  menu entry points at `/scenarios/` instead of `scenarios.html`.

**Done means:** a GRC agent edits a scenario (or flips a `live` flag) in the
content vault, pushes, and the change is on riskmandate.ai/scenarios/ on the
next page load — **no CI run, no vault re-clone, no repo commit**. Rollback at
any moment = repoint the menu link back to `scenarios.html`.

## 1. Current state (verified against vault v0.8.0)

- `scenarios.html` — built top-level page; data **inlined at build time**
  (`RM.data.scenarios`).
- `src/data/scenarios.json` — the content. Shape:
  - `series`: `{ title, buttons {no, yes, deflect, admit}, intervals[6] {id, sev, tone, desc} }`
  - `scenarios[10]`: `{ id, n, live, domain, title, hook, escape, act, reveal }`
  - 4 of 10 flagged `live` (per the GRC plan's selection; the rest are the bank).
- `src/pages/scenarios/components/scenarios.js` (~190 lines) — the engine.
- `src/pages/scenarios/styles/scenarios.css` (~160 lines).
- `statics.html` — the "Statics" sibling under the same nav dropdown
  (**out of scope** for the pilot; second migration candidate).
- Governance constraint from the GRC plan, inherited as a **content-schema
  invariant**: every `reveal` is mechanism-stated — no unsourced percentages,
  no vendor-absolute claims. This lives with the content, not the code.

## 2. The content vault (`rm-scenarios`)

**Needs from Dinis/vault team:** a new vault + its id, the public read key
(hex), and write access for the content/GRC agents.

Proposed layout (grain: one file per scenario, so edits and diffs are scoped
and two agents can work without colliding):

```
manifest.json                 { schema: "rm-scenarios/v1",
                                series: { title, buttons, intervals[] },
                                live: ["oauth-token","company-card", …],   ← ordered
                                scenarios: ["s01-email", "s04-card", …] }  ← the bank
scenarios/<id>.json           one per scenario: { id, n, domain, title,
                                hook, escape, act, reveal }
```

(`live` moves from a per-item flag to an ordered list in the manifest — the
page fetches the manifest + only the live scenarios: typically 5 small GETs.)

**Branches = environments:** `main` is what production renders; a `dev`
branch is staging. Promotion is a sgit merge. The shell accepts
`?branch=<name>` for previewing any branch on any deployment.

## 3. The repo page (`web_overlay/scenarios/index.html`)

New files, all repo-owned, all testable:

```
web_overlay/scenarios/index.html      the shell (chrome + mount point)
web_overlay/_common/rm-vault-content.js   fetch→decrypt→verify glue (reusable)
web_overlay/_common/rm-scenarios.js       the engine, ported from the vault's
                                          scenarios.js — with unit tests
web_overlay/_common/rm-scenarios.css      ported styles
tests/unit/web/…                          engine + glue tests (node:assert)
```

### Runtime flow

```
load shell → importReadKey(READ_KEY_B64URL)
          → resolve ref(branch) → commit → tree → manifest.json   (vault-client)
          → decrypt manifest → fetch+decrypt live scenarios (parallel GETs)
          → render via rm-scenarios engine (DOMPurify on every content string)
          → failure mode: if the vault is unreachable, render the page chrome
            with a "scenarios are temporarily unavailable" card — never a
            blank page (fail visible, not broken)
```

Vault-client: import the hosted module sgraph's shells use
(`sg-vault-client.js` — `importReadKey`, `readObject`, path resolution) from
`dev.tools.sgraph.ai`, pinned to an exact version in the import map. If we
want zero external script origins, vendor the file into `_common/` instead —
decide at review (vendored copy = we own updates; import = we track theirs).

### The key-format gotcha (do not skip)

sgit uses the **64-hex** read key; the browser client's `importReadKey`
requires **base64url (43 chars)** and fails *silently* on hex. Convert once
when the vault is created and embed the base64url form:

```python
import base64
b64u = base64.urlsafe_b64encode(bytes.fromhex(HEX_KEY)).decode().rstrip("=")
```

### Chrome (nav/header) — pilot approach

The shell carries a **static copy** of the current header/menu (markup +
tokens from the v0.8.x design) so the page is standalone and looks native, per
the plan. Known cost: chrome drift if the vault redesigns. Accepted for one
page; the shared `rm-chrome` component (fed by a runtime site manifest) is
scheduled for when the **second** area migrates — that's when duplication
becomes real rather than speculative.

## 4. QA & engineering practice (the point of the exercise)

- **Unit tests** for the engine (interval/severity logic, live-list ordering,
  button flows) and for the glue (manifest validation against
  `rm-scenarios/v1`, key decode, hex-key rejection with a loud error).
- **Sanitization test**: a scenario containing `<script>`/`onerror` payloads
  renders inert.
- **Smoke**: Playwright/jsdom — shell boots, renders 4 live scenarios from a
  fixture vault response (network mocked; no live dependency in CI).
- **Local dev**: `run-locally` script serves the shell; `?branch=` +
  `?vault-endpoint=` params allow testing against real vault branches.
- CI: **no new workflow** — the shell ships with the existing pipeline
  (tag → build → deploy). Tests hook into the existing (currently empty)
  test job slot.

## 5. Cutover plan

| Step | Actor | Action |
|---|---|---|
| 1 | Dinis/vault team | create `rm-scenarios` vault; hand id + read key (hex); grant content agents write |
| 2 | this agent | seed the vault from `src/data/scenarios.json` (split per §2), on branch `main` |
| 3 | this agent | build shell + engine + tests; deploy via qa lane; verify at `/scenarios/` (unlinked — safe) |
| 4 | GRC/content agent | review content renders correctly; edit-and-reload test (the "done" criterion) |
| 5 | vault team | repoint menu "Risk Scenarios → Interactive" → `/scenarios/` (one line + rebuild) |
| 6 | — | monitor; old `scenarios.html` remains in the vault untouched as instant rollback |

**Rollback:** repoint the link back. Nothing else to undo.

## 6. Explicitly out of scope (follow-ups)

- `statics.html` migration (second candidate, same vault or sibling area).
- Shared `rm-chrome` component + runtime site manifest (after area #2).
- Structure-env split (dev.riskmandate.ai) and the S3/CloudFront move —
  triggers defined in the architecture brief §3.
- Static hosting of the encrypted `bare/` tree (`SG_STATIC`) — removes the
  `dev.send.sgraph.ai` runtime dependency; pairs naturally with the S3 move.
- Live edge-rendered `.md`/`llms.txt` for the scenarios content (needs
  CloudFront Function/Lambda@Edge — S3 path only).

## 7. Open questions

1. Vault granularity: one `rm-scenarios` vault (proposed) vs one shared
   `rm-content` vault with per-area folders? Per-area vaults give scoped keys
   and rotation; shared gives fewer keys to track. Proposal: **per-area**.
2. Vendored vault-client vs hosted import (see §3).
3. Does `dev.send.sgraph.ai` send permissive CORS for browser GETs from
   riskmandate.ai? (Blocking for step 3; already asked in comms msg 001.)
4. Should the statics (LinkedIn share images) live in the same vault as
   binary assets, exercising `vault:` asset fetching in the shell?
