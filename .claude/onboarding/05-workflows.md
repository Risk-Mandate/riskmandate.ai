# Workflows

Each recipe ends with `npm run check`. If it is not green, it is not done.

## Add or edit a page

```bash
node scripts/site/new-page.mjs <name> --title "RiskMandate — …" --desc "…" \
     --body /path/to/body.html --css /path/to/page.css --donor work.html --cta "Get in touch"
node scripts/site/add-licence-chrome.mjs         # GitHub link + licence line, if the donor predates them
# add the page to site/pages.json (group or unlisted; at most 7 top-level entries)
node scripts/site/generate.mjs                   # injects the menu, writes the twin, sitemap, llms.txt
npm run check
```

- A page is one self-contained document: its CSS, its markup, its inlined data, the four shared
  modules. Copy classes from a donor (`work.html` has cards, lists, tables, notices, a prompt block).
- Colours are tokens on `:root`. A literal hex outside `:root` is a bug.
- Components never use `innerHTML`; text goes in through `textContent`.
- The voice: plain, sourced, dated. Say what is not built next to what is. British spelling.
- Edit the page, never its `.md` twin. Rerun `generate.mjs` after every edit.
- A renamed page leaves a redirect stub at the old address (see `site/abp-vaults.html`).

## Add a behaviour-policy vault

Inputs are four files; everything else is derived.

```bash
mkdir -p site/vaults/<slug>/data && cp -r site/vaults/gmail-readonly/data/vocabulary site/vaults/<slug>/data/
# write site/vaults/<slug>/vault.json          who, which shape, status "template", renderer version
# write site/vaults/<slug>/data/grant.json     abp/profile/v1 — one row per capability, evidence, barrier, via, material, undo
# write site/vaults/<slug>/data/mandate.json   abp/mandate/v1 — want / do_not_want / unstated over the 23; status starting-point
# write site/vaults/<slug>/data/scenarios.json six scenarios: three normal, three advanced; each wants and refuses primitives
node scripts/site/build-abp-vault.mjs <slug>          # derives the documents, delta, validity, zip, loader, history
node scripts/site/build-abp-vault.mjs <slug> --check
# add the vault to site/vaults/index.json (slug, app, title, shape, family, blurb, logo, brand, group; vid + key once pushed)
node scripts/site/build-abp-pages.mjs                 # the library page and abp-vault-<slug>.html
node scripts/site/generate.mjs && npm run check
```

- **A grant is measured or documented, never typed.** Measured needs a system we are entitled
  to run and the evidence file in `history/`. Documented quotes the vendor's page, with URL
  and date read, in each row's `note`. Anything unsettled goes in `research_needed`;
  disagreements between the vendor's own pages go in `contradictions`, unresolved; permissions
  the grammar cannot name go in `not_in_grammar`.
- `material` on every row: `own`, `organisation`, `third_party`, `mixed`.
- The credential is the grant, not a barrier. A key that permits a thing is not what stops it.
- Note the door: the same capability through two paths is one row with two `via` entries.
- No score field exists and none is added.
- The vault id and the read key come from the push; until the lead pushes it, leave `vid` and
  `key` out of the catalogue entry so the tile lists as *asked for, not built*, and say so in
  your work file. `site/vaults/index.json`'s note explains the fields.
- The PDF in `dist/` is `render-abp-vault-pdf.mjs` (Playwright); the zip is deterministic and
  checked by CI.

## Correct a mandate or answer an open question

Edit `data/mandate.json` (move rows between `want`, `do_not_want`, `unstated`) or
`data/grant.json` (move a row's `evidence`, put the quote in `note`, delete the entry from
`research_needed`). Rebuild, `--check`, and the history records whether the counts moved.

## Cut a release

```bash
git fetch origin dev && git merge origin/dev            # first; see the rules of engagement
node scripts/site/release.mjs 1.17.0 "What changed, in a line"
# write site/versions/1.17.0.md — what changed, why, what was not changed and why not
node scripts/site/generate.mjs && npm run check
git commit -am "v1.17.0 — what changed, in a line"
```

Notes are prose, in the voice of `site/versions/1.15.0.md`: bold lead phrases, links to the
pages, a paragraph on what was deliberately not done. The number is claimed at merge time; if
`dev` took it, run `release.mjs` again with the next one. CI tags the commit; nothing else to do.

**Which number moves.** The third, by default: `1.19.0` → `1.19.1`. A fix, a page edit, a new
vault, a new brief, an every-page chrome change, a restructured page: all patches. The second
number is for a release that changes what the site is or what it sells: a new section in the
menu, a new product on the pricing page, a page family rebuilt around a new idea. Two agents
merging in one day should produce `1.19.1` and `1.19.2`, not `1.20.0` and `1.21.0`. The first
number is the lead's to move.

## Cut a Lab edition

A Lab page's content hash moved → `node scripts/site/render-lab-pdfs.mjs <slug>` (Playwright;
serves the site on a local port). It appends to `lab-editions.json` with the digest; add a
`note` to the entry saying what separates this edition from the last. Then `generate.mjs` lists
it on the page. Never edit or remove an edition.

## Add an interview page

A page sent to one kind of person (a founder, an investor, a CISO, an insurer), carrying a prompt
they paste into their own assistant, which interviews them by voice and writes a summary they send
back. The pattern is sgit.ai's brief of 24 September 2026 (D19).

```bash
cp site/interviews/_template.json site/interviews/<slug>.json   # fill every field; the prompt exactly as it is to be copied
node scripts/site/build-interview-pages.mjs                     # writes site/interview-<slug>.html
# add interview-<slug>.html to site/pages.json: group More, unlisted, inside the More run
node scripts/site/generate.mjs && npm run check
```

- Six parts, always in this order: who it is for and why you; what we want to learn (three to six);
  how it works in three steps; the prompt with a copy button; what happens to your answers; send it
  back. The generator enforces the order; do not hand-edit the page.
- The prompt says what RiskMandate is using only what the site claims. Record every change you make
  to a prompt someone else wrote in the JSON's `source.changes`.
- Static, no tracking: the page loads nothing and sends nothing. Before publishing, run the prompt
  once in the assistant it names and check the summary has every section it asks for.

## Add a story

A story is a data file: `site/stories/<slug>.json`, told with the cast in `site/stories/cast.json`.
The order is story, narrative, punchline, cast, storyboard, prompt; the picture is last and comes
from whichever image model is being tried.

```bash
cp site/stories/just-a-draft.json site/stories/<slug>.json    # title, punchline, status, cast, source, truth, panels, prompt, for_merch
node scripts/site/build-stories.mjs                            # writes site/stories.html and site/story-<slug>.html
# add story-<slug>.html to site/pages.json: group More, unlisted, inside the More run
node scripts/site/generate.mjs && npm run check
```

- `status` is `storyboard` until a model has drawn it; then `drawn`, with the picture in
  `site/assets/stories/` as WebP, its alt text, the model, the date, and `notes`: what to correct.
- Every line of dialogue names a cast member in the story's `cast`; the build refuses an unknown one.
  A new character goes into `cast.json` with what they stand for on the model, first.
- The prompt is `shared` plus one line per panel; the page appends the cast's looks and the style.
- The rules are the site's: fictionalised and said so, nobody's product drawn, nothing scored, the
  site's words, and a ladder has steps (the build refuses the other word).

## Write a brief

`docs/briefs/<kind>__<slug>.md`. Header: title as a claim, date, author `@website-agent`,
trigger (what the lead said, quoted), reads against (the sources with versions). Numbered
sections. Tables where a table is honest. End with *what this does not settle* or *decisions I
need*. Then add one line to `.claude/onboarding/01-map.md` and, if it changes the state, to
`03-state-and-next.md`. If the brief arrived as a file from outside, it also goes into the
register: copy it byte for byte to `site/assets/briefs/`, add an entry to
`site/briefs-register.json` with its sha256, size, arrival time and status, and render it on
`site/briefs.html`. The test checks the digest.

## Give a brief, a task or a work file its page on the console

Nothing to do but rerun the build. `node scripts/site/build-admin.mjs` renders every `docs/**/*.md`
under `site/admin/briefs/<slug>/`, every `.claude/briefs/Txx-*.md` under `site/admin/work/Txx/`,
every `.claude/work/<branch>.md` under `site/admin/work/branches/<branch>/`, and the onboarding
files, `CLAUDE.md` and the prompts under `site/admin/agents/`. The counts on the console — what
needs the lead, what is in flight, memos not fully worked — are read off `03-state-and-next.md`
(the queue table and *Decisions the lead owns*), the work files and `briefs-register.json`, so
keeping those true is what keeps the console true. `test_admin.mjs` fails if a document has no
page; `build-admin.mjs --check` fails in CI if the console is stale. Never hand-edit anything
under `site/admin/` except `console.css`.

## Register a document that arrived from outside

See the paragraph above. Statuses: `received`, `partly`, `processed`, `superseded`, and they
only move forward. `produced` names what exists because of it; `not_done` names what does not.

## Touch a shared module

Edit `scripts/site/modules/<name>.js`, run `node scripts/site/sync-modules.mjs`, then
`generate.mjs`. That is an every-page edit: claim it, commit it alone, merge it fast.

## Change the chrome (header, footer, menu)

There is no template. The chrome is copied from a donor when a page is scaffolded, and
`add-licence-chrome.mjs` shows the pattern for retrofitting one element to every page:
an idempotent script with `--check`, run in CI. Do the same for anything new rather than
sed-and-hope; then update `new-page.mjs`'s `FOOTER`/`header` constants so scaffolded pages
carry it too. A behaviour on every page (the drawer, the menu) lives in `scripts/site/modules/`
and is pushed out by `sync-modules.mjs`. After either kind of change, rerun every page builder
(`build-abp-pages`, `build-reviewer-pages`, `build-uk-support`, `build-business-cases`,
`build-interview-pages`) before `npm run check`: the pages they cut from a donor carry the
donor's chrome, and the check compares them byte for byte. The version chip is the example:
v1.34.7 made it visible on a laptop and put it first in the phone drawer.

## Merge a branch into dev

`.claude/commands/merge-to-dev.md` is the checklist. Short form: merge `dev` in, regenerate,
check, release last, check again, `--no-ff` into `dev`, delete your work file, push, watch CI.

## Run it locally

`bash scripts/run-locally__riskmandate_ai.sh` → `http://localhost:10070/`. Use `localhost`:
`/scenarios/` and the vault pages decrypt with Web Crypto, which needs a secure context.
