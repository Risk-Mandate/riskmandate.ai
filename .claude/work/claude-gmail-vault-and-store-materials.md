# claude/gmail-vault-and-store-materials

**Started:** 2026-09-16 · **Task brief:** ad hoc — "a) a specific vault example: Claude chat
connected to a Gmail inbox; b) better materials and screenshots for the product page at
store.sgit.ai/lab/product/"

## Scope
(a) A new documented-tier vault, `claude-gmail-connector`: Claude.ai chat with the official
Gmail connector enabled (not the raw `gmail.readonly` OAuth scope already covered by
`gmail-readonly`, not the generic `claude-web-connectors` shape). Researched from Anthropic's
own connector documentation, dated, quoted. Moves `claude-google-workspace-connector` in
`asked_for` — or adds a narrower sibling — per what the vendor page actually documents.

(b) Screenshots and copy for store.sgit.ai's product lab page. The store is a separate site
maintained by a different agent; this branch produces the material (screenshots of the new
vault and the library, copy blocks) rather than editing that repository, unless it turns out
to be in GitHub scope and the lead wants direct edits.

## Files and surfaces I expect to touch
- `site/vaults/claude-gmail-connector/` (new)
- `site/vaults/index.json` (new vault entry; possibly split/rename the `claude-google-workspace-connector` asked_for row)
- generated: `site/agent-behaviour-policy.html`, `site/abp-vault-claude-gmail-connector.html`, twins, sitemap, llms.txt
- no price anywhere (the store owns prices as of v1.22.0 — the boundary)
- scratchpad only for the store materials, unless told to push into the store's repo

## External state
- Vaults pushed by this branch with the session token: `claude-gmail-connector` → `oc433z3m` (public, read key in the catalogue); the customer instance → `xjir6m0c` (private; vault key handed to the lead in the session, nowhere in the repository)
- Releases: v1.22.1 (merged); v1.23.0 (the console)

## Status
- [x] researched: Anthropic's help article, Google's MCP reference and configure guide, Google's scope list; the lead's twelve screens and the sent message's .eml
- [x] template vault `claude-gmail-connector` built and checked — 6 rows, 4 measured, 5 contradictions, 6 open questions, `evidence/` with the screens transcribed and the .eml redacted; on the *next* page as built, awaiting a push
- [x] instance `vaults-instances/claude-gmail-connector--customer-draft/` built with `ABP_VAULT_DIR` (one-line change to the build script); status draft; a question on every mandate line
- [x] the workflow brief `docs/briefs/workflow__buying-a-policy-for-claude-on-gmail.md`; register I6; admin link; map and state
- [x] store materials: two real captures for the empty slots (App Mode, History) plus three extras and a handover note, in the scratchpad, sent to the lead
- [x] release v1.22.1 + merge to dev
- [x] both pushes made from the session (`oc433z3m` public, `xjir6m0c` private); catalogue entry moved to `vaults`; page and tile live
- [x] the admin console: `scripts/site/build-admin.mjs`, `site/admin/**`, `tests/site/test_admin.mjs`, a `link` entry in `pages.json`, `admin.html` a redirect; CLAUDE.md, map, rules, workflows, state, how-the-website-works updated; release v1.23.0
- [ ] owed by the lead: the screenshots as files for redaction into `evidence/`; the customer's correction call

## Notes for whoever merges after me
`ABP_VAULT_DIR` is new in `build-abp-vault.mjs`: unset, nothing changes. `vaults-instances/` is not
deployed and not built by CI. The Gmail vault sits in `asked_for` with `note` saying it is built —
the next-page tile still says *not yet researched* because `nextTile()` ignores the note; a
one-word fix (`x.note || kind`) I did not make, because the sibling agent owns that page's copy
this week. Done: the entry is in `vaults` with `vid` and `key`.

## MVP vault (16 Sept, second wave)
- [x] The lead's seven decisions answered; the MVP brief and the consequences/assets brief written (I8, I9)
- [x] The consequence layer in the build: assets.json, consequences.json, data/standards/ (GDPR, EU AI Act, ATT&CK), CONSEQUENCES.md derived, routes-out table, barrier derived per consequence, orphan/score refusals (T11, T12)
- [x] The dual licence: `licence` block in vault.json, LICENCE.template.md, LICENCE.md derived, commercial-copy field refusal, licence footer on every derived file
- [x] Renderer v5 (`site/vaults/_app/index.html`): left navigation, Start here + Who are you, What follows, Your keys, Keep it (commit log via sg.history), Download (zip bytes + sha256), Licence
- [x] Pushed: new app vault **vbhmlulo** (v5 renderer); oc433z3m rebuilt and re-pushed so its live view loads v5. fl3i7lu4 (v4) still serves the other fifteen.
- [x] Vault page repositioned (Open the vault. See what you get; the three claims); release v1.24.0
- [x] oc433z3m's live host frame renders the v5 app (verified 16 Sept). The mount had failed because a clone refresh excluded `.vault/`, leaving ro-links on the old app vault while app.link pointed at the new one; fixed by re-pushing the corrected ro-links.
- [ ] **Owed:** The research list (Google's sending limits, suspension, the modify tools) is open (T05). The other fifteen vaults re-pushed to v5 when someone gets to them. Authored per-audience views + projections (T04). The twelve screenshots as files for evidence/.

## External state (updated)
- Vaults pushed from the session: oc433z3m (public, in the catalogue), xjir6m0c (private instance), **vbhmlulo (public — the v5 app vault, in the catalogue as app_vault)**. No write key in the repo.

## Who holds the barrier (17 Sept, third wave) — v1.25.0
- [x] `data/barrier-holders.json` — six holder classes, the seven questions, travels with every vault, offered to the model site as an extension (not invented into the pinned vocabulary)
- [x] `not_reachable` → `blocked` in all sixteen vaults; `blocked_by` required by the build; thirty-four entries authored
- [x] The seven properties on grant rows and on blocks, validated in the build: enum answers, no unknown keys, no holder on a `none` barrier, and **any grading adjective fails the build**
- [x] Authored for `claude-gmail-connector`: four blocks, four barriers. The finding: the one block held as a product decision is the one holding back a capability the consent screen already granted
- [x] Rendered — GRANT.md (two sections), AGENT-BEHAVIOUR-POLICY.md, the licence-to-operate conditions, the reading app's **What holds** view, and the generated vault pages
- [x] `nl()` now flattens all the way down; two tables that had been rendering `|,|` since the consequence layer are fixed
- [x] `tests/site/test_vault_app.mjs` — the reading app booted against a real vault in a fake DOM, every view built, every holder answer checked against the vocabulary
- [ ] **Owed, still:** storey one (`permitted.json`: scopes → methods, `permitted_by` per row); the audience spine; the storeys drawn. All three are in the brief's §4 and named as not done in the release note.

**Not pushed to sgit this wave.** The renderer changed (a new view) and the Gmail vault's data changed,
so `vbhmlulo` and `oc433z3m` are both behind what is in the repo until someone re-pushes them. The
static copies on the site are current; the live vault view is not. Whoever pushes: copy `.vault/`
across when refreshing a clone, or the app mount breaks (see 16 Sept).

## Writing — the article family (19 Sept, fourth wave)
- [x] `articles.html` (*Writing*, under **More**) and `article-approval-prompts.html` (unlisted, group *Writing*), scaffolded from `insure-a-program.html`
- [x] **An approval prompt is not a human in the loop** — the lead's thesis, built on the Gmail vault's own record: the three buttons, the seven things the screen does not say, the consent underneath it that had already authorised the action, the barrier's seven holder answers, and where the accountability lands
- [x] Capture 13 in the vault's `evidence/` — the *Add labels to message* prompt, unredacted because the screen carries nothing to redact
- [x] The index lists five more, each marked **not written**, each with a record already behind it
- The lead's "90% if not 99% of users have no idea" is **not** published as a number. Nobody has measured it; it is an open question on the article with how it would be settled. The same goes for "everyone ends up pressing Always allow" — what is published is that the off switch is one click, held by the account the prompt protects, and that its pressing leaves no record.

## THE RELEASE OWED AT MERGE
Two page additions and the whole barrier-holder wave are unreleased. **Cut one release as the last
commit before the merge** — `1.27.0`, because a new section (*Writing*) is what the second number is
for. The note for the barrier-holder half is drafted and must not be lost; it was cut as `1.25.0`
before dev shipped its own `1.25.0`, and the merge kept dev's. The draft is below — add the Writing
paragraph to it and ship it under the new number.

<details><summary>Drafted release note (was 1.25.0)</summary>

## A barrier gains a holder, and a block names its blocker

The barrier column has always said *what* stands in the way of a capability: nothing, a rule in
prose, a setting, or a boundary enforced by something the grant does not include. It has never said
**who holds the thing in the way** — and two barriers that pass the same test can be nothing alike.

The worked example is on [Claude's Gmail connector](abp-vault-claude-gmail-connector.html). Attachment
content was filed as *not reachable*, beside permanent deletion of mail. Both are out of reach and
they are not the same object. Permanent deletion needs the `https://mail.google.com/` scope, which
the consent screen never asked for; widening that means a screen with *"permanently delete all your
email"* on it, which somebody has to tick. Attachment content is out of reach because a client does
not offer a tool for it — while Google's own reference says the method *"Requires one of the
following OAuth scopes: `https://mail.google.com/`, `gmail.modify`, `gmail.readonly`"*, two of which
were consented. That block moves in a release. No screen, no new scope, nothing for anyone to click.
Printed under one heading, the two read as equal assurance. That is what this release stops.

**`not_reachable` is gone.** Every vault now carries a **blocked** list, and the build refuses an
entry that does not name what blocks it. All sixteen shapes migrated; thirty-four entries, each one
read and given its blocker.

**Seven answers, and not one of them is a grade.** Every barrier and every block may now carry:
who holds it · what it is made of · can it move without you · would you be told · can you check it
is still there · what would take it away · if it went, what is behind it. Six holder classes —
you, an owner above you, a vendor against a consent you gave, a vendor as a product decision, the
agent itself, the environment it runs in — travel with every vault in `data/barrier-holders.json`,
pinned like the vocabulary and offered to the model site as an extension rather than invented into
it. The seven are authored for the Gmail shape: four blocks, and the four barriers that are not
*none*. A row whose barrier is *none* may not carry a holder, because nothing is in the way and so
nobody holds it.

**No adjective survives the build.** A holder record that calls a control strong, weak, credible,
robust, adequate, effective or reliable — or their negatives — fails the build, in data as in prose.
The reason is the one that keeps a score off a behaviour policy: how much a barrier is worth depends
on the deployment it is in. The only judgment this record makes is the delta, and the delta is
derived rather than given.

They are rendered in `GRANT.md` (two new sections, one of them the seven answers per row), in
`AGENT-BEHAVIOUR-POLICY.md`, in the licence-to-operate conditions — where a condition now names who
holds the thing enforcing it, because signing over a bound a supplier can withdraw is a different
undertaking — in the reading app as a **What holds** view, and on every generated vault page.

**A test boots the reading app.** Two renderer bugs have shipped from that file, and neither was
visible in a diff. The app is now booted against a real vault in a fake DOM and every view is built:
a view that throws, renders nothing, prints `undefined`, or leaves a comma-joined table behind now
fails the build. Two tables that had been rendering `|,|` since the consequence layer landed are
fixed, and the cause — a builder returning an array inside an array — cannot come back.

**And the label panel stops saying it four times.** The mark beside each side effect on
[the library](agent-behaviour-policy.html) read *told not to — and only told*. Half of that was
news; the other half was the third time the same panel had said it. The counter above reads *not
asked for, nothing in the way*, the heading reads *side effects — not asked for, and nothing real
stops it*, and then each line said it again. The mark now says only what the mandate said —
**refused in words**, or **never mentioned** — and the enforcement is stated once, where it belongs,
at the top. The summary line under the list lost the same repetition.

**Not changed.** What the credential permits, as data, is still not recorded: the blocked list names
the blocker in prose and there is no `permitted.json` behind it yet. The audiences still signpost
rather than organise. Both are in the brief, and neither is claimed here.

</details>
