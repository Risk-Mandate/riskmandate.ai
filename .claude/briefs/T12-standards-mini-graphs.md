# T12 — The standards mini-graphs inside the vault: GDPR, the EU AI Act and ATT&CK as nodes to link to

**From:** `docs/briefs/direction__consequences-assets-and-the-vault-as-a-website.md` §3 and §5 item 3; the graph brief §3 (`links {mitre[], standards[], gdpr[]}`) and T03. **Size:** a day, alongside T03. **Touches:** `site/vaults/_template/data/standards/` (new: `gdpr.json`, `eu-ai-act.json`, `attack.json`, copied into every vault by the build), `data/consequences.json` and the behaviours extension (the `links` they point at), `site/vaults/_app/index.html` (a link renders as title + id, opening the source), `scripts/site/build-abp-vault.mjs` (validates every link resolves to a node).

## The task
A consequence that says *you can forward any message* should link, inside the vault, to the GDPR
article titles it touches, the EU AI Act article titles where they apply, and the ATT&CK technique
names — so a reader clicks from the consequence to the standard without leaving the vault and
without the vault reproducing a standard's text. Build the three mini-graphs as data: one node per
article or technique with its number or id, its **title**, and the link to the source. Make the
build refuse a `links` entry that names a node the mini-graph does not have.

## Constraints
- **Titles only** (rule 7). Never the body text of a standard. The EU regulation may be quoted;
  the default is still the title.
- **No conformity language** (rule 6). A link says *touches* or *is named by*; never
  *complies with*, *aligned with*, *covered by*.
- Only the nodes a vault's consequences and behaviours actually link to are copied into that
  vault; the template holds the full mini-graph.
- ATT&CK: technique id and name from the public matrix, with the URL; the version read and the
  date, in the file's provenance.
- Where a link is a judgement (which article a consequence touches), the entry carries
  `authored_by` and a one-line reason.

## Done means
- The three files exist under `_template/data/standards/` with provenance and dates.
- `oc433z3m` carries the subset its links use; every link in `consequences.json` and the
  behaviours extension resolves; the build fails on one that does not.
- The app renders a link as *title · id ↗*; no standard's text appears anywhere in the vault.
- The ask to the model site — a sanctioned `links` property, or an extension namespace — is on
  Lab 03 (`site/lab-abp-requests.html`) with a date.
- `npm run check` green.
