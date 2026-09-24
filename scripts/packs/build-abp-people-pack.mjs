// build-abp-people-pack.mjs — the zip the lead hands a new agent to make ABP vaults for people.
//
//   node scripts/packs/build-abp-people-pack.mjs            write packs/dist/abp-for-people-pack.zip
//   node scripts/packs/build-abp-people-pack.mjs --check    fail if the zip is stale
//   node scripts/packs/build-abp-people-pack.mjs --out DIR  also assemble it, unzipped, into DIR
//
// The pack is packs/abp-for-people/ (the agent's instructions, templates, tools and a built
// example) plus this repository's own builder, vault template, app loader and the inputs of every
// deployment in the catalogue, laid out as the repository lays them out, so the builder runs in
// the pack unchanged. The brief comes from docs/briefs/. The zip is deterministic (STORE, fixed
// date, sorted), so --check compares bytes, and it refuses to include anything write-shaped.

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const CHECK = process.argv.includes('--check');
const oi = process.argv.indexOf('--out'); const OUT = oi > 0 ? resolve(process.argv[oi + 1]) : null;
const ZIP = join(ROOT, 'packs', 'dist', 'abp-for-people-pack.zip');
const TOP = 'abp-for-people/';

const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const files = new Map();                                  // path in zip → Buffer
const add = (to, from) => files.set(TOP + to, readFileSync(from));
const addTree = (toDir, fromDir, keep = () => true) => { for (const p of walk(fromDir)) { const r = relative(fromDir, p); if (keep(r)) add(join(toDir, r), p); } };

// the pack's own material
addTree('', join(ROOT, 'packs', 'abp-for-people'), (r) => !r.startsWith('people/') || r === 'people/README.md');
add('BRIEF.md', join(ROOT, 'docs', 'briefs', 'workflow__abp-vaults-for-people-we-know.md'));

// the site's builder, template and loader, where the builder expects them
add('toolkit/scripts/site/build-abp-vault.mjs', join(ROOT, 'scripts', 'site', 'build-abp-vault.mjs'));
addTree('toolkit/site/vaults/_template', join(ROOT, 'site', 'vaults', '_template'));
for (const f of ['loader.html', 'index.html', 'README.md', 'app.json']) add(`toolkit/site/vaults/_app/${f}`, join(ROOT, 'site', 'vaults', '_app', f));
const catalogue = JSON.parse(readFileSync(join(ROOT, 'site', 'vaults', 'index.json'), 'utf8'));
add('toolkit/site/vaults/index.json', join(ROOT, 'site', 'vaults', 'index.json'));

// every catalogue deployment's INPUTS — never its derived files, never data/upstream
const INPUTS = ['grant.json', 'mandate.json', 'scenarios.json', 'assets.json', 'consequences.json', 'barrier-holders.json'];
for (const v of catalogue.vaults) {
  const src = join(ROOT, 'site', 'vaults', v.slug);
  add(`toolkit/site/vaults/${v.slug}/vault.json`, join(src, 'vault.json'));
  for (const f of INPUTS) if (existsSync(join(src, 'data', f))) add(`toolkit/site/vaults/${v.slug}/data/${f}`, join(src, 'data', f));
  for (const d of ['vocabulary', 'standards']) if (existsSync(join(src, 'data', d))) addTree(`toolkit/site/vaults/${v.slug}/data/${d}`, join(src, 'data', d));
}

// nothing write-shaped rides along
for (const [name, buf] of files) {
  const t = buf.toString('utf8');
  if (/sgit_private_vault_[a-z0-9]{16,}:[a-z0-9]{8}\b|"write_key"\s*:\s*"[0-9a-f]{32,}"/i.test(t)) { console.error(`pack: ${name} contains something write-shaped`); process.exit(1); }
}

// deterministic zip, as the vault builder writes one
const CRC = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
const crc32 = (b) => { let c = 0xFFFFFFFF; for (let i = 0; i < b.length; i++) c = CRC[(c ^ b[i]) & 0xFF] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; };
function zipStore(entries, dosDate = 0x5D38 /* 2026-09-24 */, dosTime = 0) {
  const locals = [], centrals = []; let offset = 0;
  const u16 = (n) => { const b = Buffer.alloc(2); b.writeUInt16LE(n); return b; }, u32 = (n) => { const b = Buffer.alloc(4); b.writeUInt32LE(n >>> 0); return b; };
  for (const e of entries) {
    const name = Buffer.from(e.name, 'utf8'), crc = crc32(e.data);
    const local = Buffer.concat([u32(0x04034b50), u16(20), u16(0x0800), u16(0), u16(dosTime), u16(dosDate), u32(crc), u32(e.data.length), u32(e.data.length), u16(name.length), u16(0), name, e.data]);
    centrals.push(Buffer.concat([u32(0x02014b50), u16(20), u16(20), u16(0x0800), u16(0), u16(dosTime), u16(dosDate), u32(crc), u32(e.data.length), u32(e.data.length), u16(name.length), u16(0), u16(0), u16(0), u16(0), u32(0), u32(offset), name]));
    locals.push(local); offset += local.length;
  }
  const cd = Buffer.concat(centrals);
  return Buffer.concat([...locals, cd, Buffer.concat([u32(0x06054b50), u16(0), u16(0), u16(entries.length), u16(entries.length), u32(cd.length), u32(offset), u16(0)])]);
}
const entries = [...files.keys()].sort().map((name) => ({ name, data: files.get(name) }));
const zip = zipStore(entries);

if (OUT) for (const e of entries) { const p = join(OUT, e.name); mkdirSync(dirname(p), { recursive: true }); writeFileSync(p, e.data); }
const have = existsSync(ZIP) ? readFileSync(ZIP) : null;
if (have && Buffer.compare(have, zip) === 0) { console.log(`pack: up to date (${entries.length} files, ${(zip.length / 1024).toFixed(0)}KB)`); process.exit(0); }
if (CHECK) { console.error('pack: packs/dist/abp-for-people-pack.zip is stale — run node scripts/packs/build-abp-people-pack.mjs'); process.exit(1); }
writeFileSync(ZIP, zip);
console.log(`pack: wrote packs/dist/abp-for-people-pack.zip (${entries.length} files, ${(zip.length / 1024).toFixed(0)}KB)`);
