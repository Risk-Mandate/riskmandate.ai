// check-person.mjs — the gate before a person's vault is pushed. Exit 0 or it does not go.
//
//   node tools/check-person.mjs <slug> [--keys <path to the keys-vault clone>]   (default: ./keys)
//
// A person's vault is written as if it will be public one day, even though it is shared only
// by link. So it may hold only: the shape's documented grant, a mandate and scenarios drafted
// for their business, and what their own public pages say, with the page and the date. It may
// NOT hold anybody else's anything, a key other than the app vault's public read key, the
// lead's private notes, or personal contact details.

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const PACK = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const slug = process.argv[2];
const ki = process.argv.indexOf('--keys');
const KEYS = resolve(ki > 0 ? process.argv[ki + 1] : join(PACK, 'keys'));
if (!slug) { console.error('usage: node tools/check-person.mjs <slug> [--keys <dir>]'); process.exit(2); }
const DIR = join(PACK, 'people', slug);
const problems = [], notes = [];
const bad = (m) => problems.push(m), note = (m) => notes.push(m);
if (!existsSync(DIR)) { console.error(`no people/${slug}`); process.exit(2); }

const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const files = walk(DIR).filter((p) => !p.includes(`${'/'}.sg_vault`));
const text = (p) => /\.(json|md|html|txt|csv)$/.test(p) ? readFileSync(p, 'utf8') : null;
const rel = (p) => relative(DIR, p);

// 1. it is built, and it is this person's draft
for (const f of ['vault.json', 'FOR.md', 'data/for.json', 'data/grant.json', 'data/mandate.json', 'data/scenarios.json', 'data/delta.json', 'AGENT-BEHAVIOUR-POLICY.md', 'index.html'])
  if (!existsSync(join(DIR, f))) bad(`missing ${f}${['data/delta.json', 'AGENT-BEHAVIOUR-POLICY.md', 'index.html'].includes(f) ? ' — run the build first' : ''}`);
const cfg = existsSync(join(DIR, 'vault.json')) ? JSON.parse(readFileSync(join(DIR, 'vault.json'), 'utf8')) : {};
if (cfg.slug !== slug) bad(`vault.json slug is "${cfg.slug}", folder is "${slug}"`);
if (cfg.status !== 'draft') bad(`vault.json status is "${cfg.status}"; a person's vault is a draft until they correct it`);
if (!cfg.organisation) bad('vault.json has no organisation');

// 2. every claim about them has a public source and a date
if (existsSync(join(DIR, 'data/for.json'))) {
  const f = JSON.parse(readFileSync(join(DIR, 'data/for.json'), 'utf8'));
  if (!(f.sources || []).length) bad('data/for.json lists no sources');
  for (const s of f.sources || []) {
    if (!/^https:\/\//.test(s.url || '')) bad(`a source has no https URL: ${JSON.stringify(s).slice(0, 80)}`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(s.read || '')) bad(`source ${s.url} has no read date (YYYY-MM-DD)`);
    if (!s.supports) bad(`source ${s.url} does not say what it supports`);
    if (/linkedin\.com\/in\//i.test(s.url || '')) bad(`source ${s.url} is a personal LinkedIn profile; use what the organisation publishes`);
  }
  if (!Array.isArray(f.assumptions)) bad('data/for.json has no assumptions list (an empty list is allowed, a missing one is not)');
  if (!f.shape_why) bad('data/for.json does not say why this shape was chosen');
}

// 3. nothing left unfilled
for (const p of files) { const t = text(p); if (t && /\{\{[A-Z_]+\}\}/.test(t)) bad(`${rel(p)} still has a {{PLACEHOLDER}}`); }

// 4. nobody else's anything
const others = [];
for (const d of existsSync(join(PACK, 'people')) ? readdirSync(join(PACK, 'people')) : []) {
  if (d === slug || !existsSync(join(PACK, 'people', d, 'vault.json'))) continue;
  const o = JSON.parse(readFileSync(join(PACK, 'people', d, 'vault.json'), 'utf8'));
  others.push(d, o.organisation, o.prepared_for?.person);
}
let registry = [];
if (existsSync(join(KEYS, 'registry.json'))) {
  registry = JSON.parse(readFileSync(join(KEYS, 'registry.json'), 'utf8')).people || [];
  for (const r of registry) if (r.slug !== slug) others.push(r.slug, r.organisation, r.person);
} else note(`no keys registry at ${KEYS}/registry.json — cross-person check used people/ only`);
const secretsFromRegistry = registry.flatMap((r) => [r.vault_key, r.write_key]).filter(Boolean);
const readKeysOfOthers = registry.filter((r) => r.slug !== slug).map((r) => r.read_key).filter(Boolean);
const names = [...new Set(others.filter((x) => x && String(x).length >= 4))];

const appKey = (() => { try { return JSON.parse(readFileSync(join(PACK, 'toolkit/site/vaults/index.json'), 'utf8')).app_vault.key; } catch { return null; } })();
let intake = [];
const intakeFile = join(KEYS, 'people', slug, 'intake.md');
const norm = (x) => x.toLowerCase().replace(/\s+/g, ' ').trim();
if (existsSync(intakeFile)) intake = readFileSync(intakeFile, 'utf8').split('\n')
  .map((l) => norm(l.replace(/^\s*([-*+>#]+|\d+[.)])\s*/, '').replace(/\*\*[^*]+\*\*:?/g, ''))).filter((l) => l.length >= 40);
else note(`no private intake at ${intakeFile} — the copied-notes check did not run`);

for (const p of files) {
  const t = text(p); if (!t) continue; const r = rel(p);
  for (const n of names) if (new RegExp(`\\b${String(n).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(t)) bad(`${r} names another person's vault or organisation: "${n}"`);
  for (const s of secretsFromRegistry) if (t.includes(s)) bad(`${r} contains a write key or vault key from the registry`);
  for (const k of readKeysOfOthers) if (t.includes(k)) bad(`${r} contains another person's read key`);
  if (/sgit_private_vault_|sgit_private_write|"write_key"\s*:\s*"[0-9a-f]/.test(t)) bad(`${r} contains something shaped like a vault or write key`);
  if (!/^(history|dist)\//.test(r) && !r.startsWith('.vault/')) {
    // a 64-hex string is a checksum or a key; flag it when the text just before it calls it a key
    for (const m of t.matchAll(/\b[0-9a-f]{64}\b/g)) {
      const before = t.slice(Math.max(0, m.index - 48), m.index);
      if (m[0] !== appKey && /key/i.test(before) && !/sha|digest|hash|checksum/i.test(before)) bad(`${r} contains a key-like 64-hex string that is not the app vault's public read key: ${m[0].slice(0, 12)}…`);
    }
  }
  // any seven consecutive words of a private note, found in the vault, is a copied note
  const words = (x) => norm(x).replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
  const tw = ' ' + words(t) + ' ';
  for (const l of intake) {
    const w = words(l).split(' ');
    for (let i = 0; i + 7 <= w.length; i++) { const run = w.slice(i, i + 7).join(' ');
      if (tw.includes(' ' + run + ' ')) { bad(`${r} repeats the private intake notes: "…${run}…"`); break; } }
  }
  for (const e of t.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g) || []) bad(`${r} contains an email address (${e}); a person's contact details stay out`);
  if (/linkedin\.com\/in\//i.test(t)) bad(`${r} links a personal LinkedIn profile`);
  if (/(\+\d{1,3}[\s-]?)?\(?\d{3,4}\)?[\s-]\d{3,4}[\s-]\d{3,4}\b/.test(t) && !/^(history|dist|data\/vocabulary|data\/standards)\//.test(r)) note(`${r} contains something shaped like a phone number — check it by eye`);
}

for (const n of notes) console.log(`  note: ${n}`);
if (problems.length) { console.error(`people/${slug}: ${problems.length} problem${problems.length > 1 ? 's' : ''} — do not push`); for (const m of problems) console.error(`  ✗ ${m}`); process.exit(1); }
console.log(`people/${slug}: clean — ${files.length} files checked`);
