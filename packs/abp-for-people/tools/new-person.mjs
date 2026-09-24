// new-person.mjs — start one person's vault from a deployment shape in the catalogue.
//
//   node tools/new-person.mjs <slug> <shape-slug> --org "Organisation name" [--for "Person name"]
//
// Copies the shape's INPUTS (never its derived files, never its upstream delta) from
// toolkit/site/vaults/<shape-slug>/ into people/<slug>/, sets vault.json for this person as a
// draft, and drops in the person templates (FOR.md, data/for.json). Everything else is
// written by the build. Refuses if people/<slug>/ already exists: one person, one vault, and
// nothing is ever copied from another person's folder.

import { readFileSync, writeFileSync, existsSync, mkdirSync, cpSync, readdirSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const PACK = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const [slug, shape] = process.argv.slice(2);
const arg = (k) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null; };
const org = arg('--org'), person = arg('--for');
const fail = (m) => { console.error(`new-person: ${m}`); process.exit(1); };

if (!slug || !shape || !org) fail('usage: node tools/new-person.mjs <slug> <shape-slug> --org "Organisation" [--for "Person"]');
if (!/^[a-z0-9][a-z0-9-]{1,40}$/.test(slug)) fail('slug: lowercase letters, digits and hyphens, 2 to 41 characters');
const SRC = join(PACK, 'toolkit', 'site', 'vaults', shape);
if (!existsSync(join(SRC, 'data', 'grant.json'))) {
  const shapes = readdirSync(join(PACK, 'toolkit', 'site', 'vaults')).filter((d) => existsSync(join(PACK, 'toolkit', 'site', 'vaults', d, 'data', 'grant.json')));
  fail(`unknown shape "${shape}". Shapes in the catalogue: ${shapes.join(', ')}`);
}
const DST = join(PACK, 'people', slug);
if (existsSync(DST)) fail(`people/${slug} already exists; one person, one vault`);

mkdirSync(join(DST, 'data'), { recursive: true });
for (const f of ['grant.json', 'mandate.json', 'scenarios.json', 'assets.json', 'consequences.json', 'barrier-holders.json'])
  if (existsSync(join(SRC, 'data', f))) cpSync(join(SRC, 'data', f), join(DST, 'data', f));
for (const d of ['vocabulary', 'standards'])
  if (existsSync(join(SRC, 'data', d))) cpSync(join(SRC, 'data', d), join(DST, 'data', d), { recursive: true });
// data/upstream/ is deliberately not copied: it pins the shape's published delta, and this
// person's mandate will differ from it, so the build would refuse.

const cfg = JSON.parse(readFileSync(join(SRC, 'vault.json'), 'utf8'));
const today = new Date().toISOString().slice(0, 10);
const shapeTitle = cfg.title;
Object.assign(cfg, {
  slug,
  title: `${shapeTitle}, for ${org}`,
  status: 'draft',
  organisation: org,
  as_at: today,
  owner: null, issued: null, valid_until: null, reviewed_by: null, signed_off: null,
  copy: 'draft',
  prepared_for: person ? { person, organisation: org } : { organisation: org },
  prepared_by: 'RiskMandate, from public sources, as a starting point to be corrected',
  shape_slug: shape
});
writeFileSync(join(DST, 'vault.json'), JSON.stringify(cfg, null, 2) + '\n');

const fill = (s) => s.replaceAll('{{ORG}}', org).replaceAll('{{PERSON}}', person || org).replaceAll('{{SHAPE}}', shapeTitle)
  .replaceAll('{{SHAPE_SLUG}}', shape).replaceAll('{{DATE}}', today).replaceAll('{{SLUG}}', slug);
writeFileSync(join(DST, 'FOR.md'), fill(readFileSync(join(PACK, 'templates', 'FOR.md'), 'utf8')));
writeFileSync(join(DST, 'data', 'for.json'), fill(readFileSync(join(PACK, 'templates', 'for.json'), 'utf8')));

console.log(`people/${slug}: started from "${shapeTitle}" (${shape}) for ${org}.
Next: research (public sources only) → data/for.json and FOR.md; tailor data/mandate.json and
data/scenarios.json to their business; then build:
  ABP_VAULT_DIR=people/${slug} node toolkit/scripts/site/build-abp-vault.mjs ${slug}
  node tools/check-person.mjs ${slug}`);
