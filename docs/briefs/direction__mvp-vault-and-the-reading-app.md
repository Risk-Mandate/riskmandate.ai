# The first MVP vault: `oc433z3m` becomes the product, and the reading app is rebuilt around it

**Date:** 2026-09-16 · **Author:** @website-agent
**Trigger:** project lead, 16 September — *"let's focus on making this oc433z3m vault our first MVP vault with a solid end-to-end experience for users and the design template that we will reuse … it is ok for you to make global changes to the code vault … don't buy tech debt trying to be backwards compatible … look at the design and layout (with left navigation) of the vault in this design mock-up of the store home page … the nice positioning of the vault … the attached PDF lists the features the vault needs to have, including the dual licence."*
**Reads against:** the store's V3 marketplace exploration at `abp-marketplace-v3.diniscruz.chatgpt.site` (index, *Vault first*, *Read an example*, the product lab, the design notes; read 16 September); the store's comparison table *What each level actually gets you* (PDF, store v0.3.12, 16 September); `store.sgit.ai/d/t2/` and the ledger claims *entry-level-dual-licence* and *abp-vault-build-exists* (16 September); the renderer as it runs today in app vault `fl3i7lu4` (v2), opened on `oc433z3m`; `docs/briefs/review__vault-pages-vs-the-vault.md` and `architecture__vaults-in-vaults-for-behaviour-policies.md`.

> The mock-up sells the vault with one sentence: **the ABP is the record; the vault makes it usable.** Everything below is that sentence turned into a file list, a screen and a licence.

---

## 1. What the mock-up says about the vault, and what to take from it

The store's exploration has three emphases on one shopping model — *ABP first*, *Vault first*, *Use it* — and the vault appears the same way in all three: a panel titled **Inside an ABP vault**, with a left navigation of eight entries and a reading pane on the right.

| Left navigation (mock-up) | File it points at | What the pane says |
|---|---|---|
| The ABP | `AGENT-BEHAVIOUR-POLICY.md` | *One agent, written down.* Grant, mandate, delta and barriers in one readable document; it carries no risk score |
| Customise | `MANDATE.md` | *The mandate you correct.* The editable input is `data/mandate.json`; derived documents are rebuilt from it |
| Evidence | `GRANT.md` | *What the agent can reach.* A barrier and evidence per row; reach is capability, not permission |
| The gap | `DELTA.md` | *The difference, derived.* Excess, shortfall, and the part of the excess with no boundary |
| Use it | `AGENTS.md` + `SKILL.md` | *Instructions the agent can read.* Instructions communicate the mandate; enforcement depends on the recorded barriers |
| Build it | `MAP-A-GRANT.md` | *A prompt to map the grant.* Run it where the agent runs |
| Read it | `index.html` | *The vault's reading app.* The app and the file tree are two views of the same record |
| Keep it | `history/` + `data/` | *A record that can evolve.* Inputs, pinned vocabulary, validity, the history of recomputes |

Under the panel, three claims: **Your keys** (a working copy you control), **Multiple formats** (markdown for people, JSON for tools), **Version history** (keep the basis of each revision). Above it, the hero: *Open the vault. See what you get.* — with the caption `Reading app · files · keys · history`.

Three things to take, and one not to:

1. **The left navigation is organised by what the reader does, not by object.** Today's renderer has nine top tabs named after the objects (*Grant*, *Mandate — correct it*, *Delta*, *Licence to Operate*, …). The mock-up's eight entries are verbs and roles — *Customise*, *Evidence*, *Use it*, *Build it*, *Keep it* — and each names the file it opens. That is the better shape for somebody who was handed the vault: it answers *what do I do with this* before *what is this*. The redesign keeps the mock-up's eight, adds **Start here** above them and **Licence** and **Your keys** below, and drops the horizontal tab bar.
2. **The file is always visible.** Every nav entry shows the filename in mono under the label. The reader learns the record's shape by navigating it, which is the point of shipping the record as files.
3. **Two views of one record.** *Read it* and the vault browser's file tree are the same bytes; the mock-up says so and so should the app. The vault page on this site already shows both frames (v1.19.0); the app should say it about itself.
4. **Not to take: the illustrations and the store's palette.** The mock-up is the store's home page — navy, pale blue, amber, generated artwork of leather binders. The reading app is RiskMandate's artefact, opened inside somebody's vault, often years after purchase. It keeps the site's paper-and-green, system fonts and no images; the mock-up's *layout* travels, its *skin* does not. (A decision for the lead, §6.)

## 2. What the comparison table says the vault must carry

The store's table (PDF) is read off `data/offers.yml` and rulings, and it is the feature list. Each row, and whether the vault already carries it:

| Row (store's words) | Level | In `oc433z3m` today | What the MVP needs |
|---|---|---|---|
| The behaviour policy, the grant, the mandate and the delta | all | yes — the four documents plus the licence to operate, `AGENTS.md`, `SKILL.md`, `MAP-A-GRANT.md` | keep; put them behind the eight-entry navigation |
| Packaged as a download, with its size and sha256 beside it | £10+ | `dist/<slug>.zip` exists; size and hash are stamped on `paid-t1.html`, not shown in the app | the app shows the zip, its bytes and its sha256, and hashes the download in the browser |
| A vault you hold the keys to, with its own app | £50+ | yes — this is what `oc433z3m` is | say it on the first screen: this is a vault, here is its id, here is who holds which key |
| Your own history, and a read key you can hand on | £50+ | `history/index.json` is the build's recompute log; the vault's commit history is in the host, not in the app | a **Keep it** view: the recompute history *and* the vault's commits (over `sg.vfs` where the bridge exposes them), and a **Your keys** view that explains read key vs write key and how to hand the read key on |
| The public key taken off it | £50+ | the template's read key is public by design; a bought copy is a new vault with a new key | `vault.json` records `copy: template | licensed`; the app says which this is and, for a licensed copy, that no public key exists for it |
| The mandate corrected against your situation | £500+ | the correction UI exists (move a capability, recompute, paste `mandate.json` back) | keep; **Customise** is the view; make the paste-back a first-class step with the file name and the path |
| A named security professional does the work; reviewed and signed off | £500 / £1,500 | `vault.json` has `owner`, `issued`, `valid_until` (all null on a template) | add `reviewed_by` and `signed_off` (name, date) — shown only when present, never implied |
| **Licence: CC BY for the published files; a commercial licence to the buyer at every paid level; your name on the licence from the vault level** | all | the vault says *CC BY 4.0* in `README.md` and every derived file's provenance; there is no licence file and no licensee field | **the dual licence, §3** |
| Use it in client work without crediting us | £10+ | — | follows from the commercial licence; the app states it in those words, quoting the store |
| Delivery, payment | — | not the vault's business | the app links the store's level page for the level this copy was bought at, and holds no price |

Everything in the first seven rows is a presentation gap, not a data gap: the vault already has the material and the build already derives it. The licence is a real gap, and it is the one the lead named.

## 3. The dual licence

What the store has ruled (ledger, 16 September): the published template is **CC BY 4.0**, which obliges anybody using it to attribute; every paid level replaces that with **a commercial licence to the buyer over the same material**, grantable because the copyright in the pack is RiskMandate's; **the wording is not drafted**, and the ledger says so rather than implying otherwise; from the vault level **the licence names the buyer**, because there is an artefact for it to sit in.

The vault carries that as one file and one block of data:

- **`LICENCE.md`** (new, derived by the build). Two sections, in this order, and the top of the file says which one applies to *this copy*:
  1. *This copy.* Either: "This is the published template. It is licensed CC BY 4.0: copy, share and adapt it, including commercially, with attribution, a licence link and an indication of changes." Or: "This copy is licensed to **<licensee>** under RiskMandate's commercial licence for Agent Behaviour Policy packs, order **<ref>**, level **<n>**, issued **<date>**. It may be used in the licensee's own and client work without attribution." Followed, until the wording exists, by the store's own sentence: *the wording of the commercial licence is not yet drafted; the ledger says what is intended rather than what is signed*, with the ledger link. Rule 8: the file carries what is true and dated, not what is hoped.
  2. *The published material.* The CC BY 4.0 grant over the template this copy was built from, with the template's vault id, so a licensed copy still says where it came from.
- **`vault.json`** gains a `licence` block: `{ "kind": "cc-by-4.0" | "commercial", "licensee": null | "…", "order": null | "…", "level": null | 1..4, "issued": null | "YYYY-MM-DD", "wording": "https://store.sgit.ai/ledger/#claim-entry-level-dual-licence" }`. The template has `kind: cc-by-4.0` and nulls; the build refuses `kind: commercial` without a licensee, an order and a level.
- **The app** shows a **Licence** view built from that block and the file, and puts one line on *Start here*: *Published template, CC BY 4.0* or *Licensed to <licensee>, order <ref>*. The Licence to Operate — the organisation authorising the agent — stays a separate view; the two are different instruments and the site's rule 3 is why they must not share a name. In the navigation: **Licence** (the copyright licence over the files) and **Authorise it** (`LICENCE-TO-OPERATE.md`).
- **Every derived file's provenance line** reads the block, so a licensed copy's `GRANT.md` no longer says CC BY 4.0 at the bottom.

## 4. The redesign of the reading app

One file, nothing external, `window.sg` bridge or same-origin fetch, no score anywhere — the authoring contract does not change. What changes is the shape.

```
┌ top bar: RiskMandate · Agent Behaviour Policy · vault <id> · v3 · live from the vault ──────────┐
│                                                                                                 │
│  ┌ left navigation ─────────┐  ┌ reading pane ────────────────────────────────────────────────┐ │
│  │ Start here               │  │  THE ABP                                                     │ │
│  │                          │  │  One agent, written down.                                    │ │
│  │ THE RECORD               │  │  <the document, rendered; or the view built from its data>   │ │
│  │ The ABP  AGENT-BEHAV….md │  │                                                              │ │
│  │ Evidence GRANT.md        │  │  ┌ this file ──────────────────────────────────────────────┐  │ │
│  │ The gap  DELTA.md        │  │  │ AGENT-BEHAVIOUR-POLICY.md · 14 KB · open raw · copy      │  │ │
│  │                          │  │  └─────────────────────────────────────────────────────────┘  │ │
│  │ WHAT YOU DO              │  └──────────────────────────────────────────────────────────────┘ │
│  │ Customise MANDATE.md     │                                                                   │
│  │ Use it   AGENTS.md+SKILL │                                                                   │
│  │ Build it MAP-A-GRANT.md  │                                                                   │
│  │ Authorise it LICENCE-TO… │                                                                   │
│  │                          │                                                                   │
│  │ WHAT YOU HOLD            │                                                                   │
│  │ Licence   LICENCE.md     │                                                                   │
│  │ Your keys                │                                                                   │
│  │ Keep it   history/ data/ │                                                                   │
│  │ Download  dist/          │                                                                   │
│  └──────────────────────────┘                                                                   │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘
```

- **Start here** is the mock-up's hero for a reader: *Open the vault. See what you get* becomes *You have been handed a vault. Here is what is in it* — the id, whether it is the published template or a licensed copy, the four counts (it can do / wanted / not / measured), the three things to do (read and correct the mandate; give it to your agent; have somebody sign the licence to operate), and the eight-file map. The file map is the navigation, drawn again as a picture.
- **Every document view carries its file.** Title, the one-sentence gloss from the mock-up, the rendered content or the data view, and a *this file* strip: name, size, open raw, copy. *Read it* in the mock-up is the app itself, so it is not a nav entry here; the strip on every view does its job.
- **Your keys** is new and is the vault's whole argument in one screen: the vault id; that there are two keys, one that reads and one that writes; that the person handed this vault has the read key (and that for the published template everybody does); that handing the read key on shows the reader exactly this; that the write key never leaves its holder; what *clone, change, commit* means for the record; and where the vault host's own controls are. No key material is ever rendered by the app.
- **Keep it** shows two histories: the build's recompute log (`history/index.json`, which already records whether the counts moved) and, where the bridge exposes it, the vault's own commits. When it cannot see the commits it says so and points at the vault browser.
- **Download** is the £10 row on the table: the zip, its size, its sha256, hashed again in the browser after download so the reader can compare; and the PDF when the build has rendered one.
- **Customise** keeps the correction: move a capability between want / do not want / unstated, the delta recomputes with the build's semantics, and the result is a `mandate.json` to paste back — with the path (`data/mandate.json`) and the sentence *commit it and the derived files rebuild*. The Licence to Operate's conditions follow the correction, as now.
- **Gone:** the horizontal tab bar; the *What is this?* tab as a peer of the record (it becomes a link on *Start here* and a footer, not a room of its own); the duplicated *Overview* (its card and do/don't table move to *Start here* and *The gap*).
- **Phone:** the navigation collapses to a select at the top of the pane; the frames on the site's vault page are already tall enough.

## 5. What changes globally, and what does not

The lead's instruction is explicit: global changes to the code vault are fine, and backwards compatibility with vaults nobody is using is not worth buying. So:

- **The renderer becomes v3 and moves to a new app vault.** The current app vault `fl3i7lu4` is written by RiskMandate's key, which this session does not hold; the session does hold the shared token, so the v3 renderer is pushed as a **new** app vault from `site/vaults/_app/`, and `site/vaults/index.json` `app_vault` points at it. `oc433z3m` is rebuilt with the new sub-vault link and re-pushed from the session (its key is held here). The other fifteen keep loading v2 from `fl3i7lu4` until each is re-pushed, which is somebody else's day and not this brief's.
- **The build (`build-abp-vault.mjs`) derives two more things:** `LICENCE.md` and the provenance line from the `licence` block; and refuses a commercial licence with a missing field. `vault.json`'s shape grows by `licence`, `copy`, `reviewed_by`, `signed_off`. Every template gets the CC BY block by default at its next build, so the sixteen stay consistent without anybody editing sixteen files.
- **The site's vault page** (`build-abp-pages.mjs`) takes the mock-up's positioning for its hero and its *01 · See it live* section: *Open the vault. See what you get* / *Reading app · files · keys · history*, and the three claims (your keys, multiple formats, version history) as the caption under the two frames. Still no price on this site; the buy link still goes to the store's level page.
- **What does not change:** the four inputs a person writes; the delta semantics; the vocabulary pin; the zip determinism check; the no-score rule; the authoring contract for a vault app; the host embed handshake on the site's pages.

## 6. Decisions for the lead

1. **Skin.** Recommendation: the app keeps RiskMandate's paper-and-green and system fonts, takes only the mock-up's layout. The alternative — the store's navy and amber inside the vault — makes the artefact look like the shop that sold it.
2. **Names.** The mock-up's *ABP Pack / Vault / Tailored / Reviewed* are "proposed merchandising names" by its own notes. The vault should not carry them until the store rules; the app says *level 1–4* and links the store's level page. Recommendation: wait for the store.
3. **The commercial licence text.** The vault can only carry the store's sentence that the wording is not drafted. When the lead has wording, it goes into `LICENCE.md` §1 from one place (`site/vaults/_template/LICENCE.template.md`) and every licensed copy rebuilds. Recommendation: build the file now with the honest placeholder; do not wait for the wording to ship the MVP.
4. **Who writes `licensee`.** The store owns the order; the vault owns the licence file. The store's after-payment page already hands us `?order=` and `?shape=`. Recommendation: the level-2 build takes `--licensee "<name>" --order <ref> --level 2` and the person doing the build types what the order says; no automation across the boundary yet.

## 7. Plan and size

| Step | What | Size |
|---|---|---|
| 1 | `vault.json` shape (+ `licence`, `copy`, `reviewed_by`, `signed_off`); build derives `LICENCE.md` and provenance; refusals; rebuild sixteen; `--check` green | half a day |
| 2 | Renderer v3: left navigation, Start here, file strip on every view, Licence, Your keys, Keep it (two histories), Download with sha256; phone layout | a day and a half |
| 3 | New app vault pushed; catalogue `app_vault` repointed; `oc433z3m` rebuilt and re-pushed; the site's vault page repositioned; screenshots on the vault page and for the store's slot | half a day |
| 4 | The workflow brief's step table and the console updated; release `1.24.0` (a page family rebuilt: the app) | an hour |

**Done means:** `oc433z3m` opens in the host on the v3 app with the left navigation; every one of the eight files is reachable in two clicks and shows its name, size and raw; `LICENCE.md` exists in the vault and says CC BY 4.0 for this copy with the store's sentence about the paid wording; *Your keys* and *Keep it* exist and say nothing untrue about what the bridge exposes; the zip's sha256 on the app matches `paid-t1.html`; no price, no score, no key material anywhere in the app; `npm run check` green; the sixteen templates rebuilt with the CC BY block and unchanged otherwise.
