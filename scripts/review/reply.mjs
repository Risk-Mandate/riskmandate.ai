// reply.mjs — write a note that only one reader's browser can read, for the review pages to show it.
//
//   node scripts/review/reply.mjs --vault <clone of the review vault> --to <browser id> --text "..." [--about hero] [--from "Dinis Cruz, RiskMandate"]
//   node scripts/review/reply.mjs --box-pub <pem file> --to <browser id> --text "..."       (without the vault, for a test)
//
// Each review page's browser makes its own keys (site/assets/review/identity.js) and sends its public reply key,
// signed, with every send. read-feedback.mjs verifies the signature and pins the keys in the vault at
// review-lane/browsers/<browser id>.json. This script reads that pin, encrypts the note to the browser's key in
// sgit's v2 envelope (AES-256-GCM, the key wrapped with RSA-OAEP SHA-256), adds it to
// site/assets/review/replies/<browser id>.json and counts it in replies/index.json. The page reads the index when
// it opens, fetches its own file if it is named, and decrypts it in the browser. The file is public and holds no secret: anyone can download it, only that browser can read it.
// No key is needed to write a reply. Commit, release and merge as for any site change; it is live when dev deploys.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createPublicKey, publicEncrypt, randomBytes, createCipheriv, createHash, constants } from 'node:crypto';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const arg = (f, d) => { const i = process.argv.indexOf(f); return i > 0 ? process.argv[i + 1] : d; };
const to = arg('--to'), text = arg('--text'), about = arg('--about'), from = arg('--from', 'RiskMandate');
if (!/^b[0-9a-f]{16}$/.test(to || '') || !text) { console.error('usage: --to <browser id, b + 16 hex> --text "..." and --vault <clone> or --box-pub <pem>'); process.exit(2); }

const fp = (pem) => 'sha256:' + createHash('sha256').update(createPublicKey(pem).export({ type: 'spki', format: 'der' })).digest('hex').slice(0, 16);
let boxPub, boxFp;
if (arg('--box-pub')) { boxPub = readFileSync(arg('--box-pub'), 'utf8'); boxFp = fp(boxPub); }
else {
  const pin = join(arg('--vault', 'review-feedback'), 'review-lane/browsers', `${to}.json`);
  if (!existsSync(pin)) { console.error(`no pinned keys for ${to}: run read-feedback.mjs first, or check the id`); process.exit(2); }
  const p = JSON.parse(readFileSync(pin, 'utf8'));
  boxPub = p.box_pub; boxFp = p.box_fp;
  if (fp(boxPub) !== boxFp) { console.error(`the pinned reply key does not hash to ${boxFp}; not writing`); process.exit(2); }
}

function seal(pem, plaintext) {
  const key = randomBytes(32), iv = randomBytes(12), c = createCipheriv('aes-256-gcm', key, iv);
  const ct = Buffer.concat([c.update(plaintext, 'utf8'), c.final(), c.getAuthTag()]);
  const w = publicEncrypt({ key: pem, padding: constants.RSA_PKCS1_OAEP_PADDING, oaepHash: 'sha256' }, key);
  return Buffer.from(JSON.stringify({ v: 2, w: w.toString('base64'), i: iv.toString('base64'), c: ct.toString('base64') })).toString('base64');
}

const dir = join(ROOT, 'site/assets/review/replies'); mkdirSync(dir, { recursive: true });
const file = join(dir, `${to}.json`);
const doc = existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : { type: 'riskmandate/review-replies/v1', to, box_fp: boxFp, note: 'Notes for one browser, each encrypted to its own reply key. Only that browser can read them.', messages: [] };
if (doc.box_fp !== boxFp) { console.error(`${file} is for reply key ${doc.box_fp}, the browser now has ${boxFp}; not mixing them`); process.exit(2); }
const at = new Date().toISOString(), id = `r${doc.messages.length + 1}`;
doc.messages.push({ id, at, enc: seal(boxPub, JSON.stringify({ from, text, ...(about ? { about } : {}), at })) });
writeFileSync(file, JSON.stringify(doc, null, 1) + '\n');
const ixf = join(dir, 'index.json'), ix = JSON.parse(readFileSync(ixf, 'utf8'));
ix.browsers[to] = doc.messages.length; writeFileSync(ixf, JSON.stringify(ix, null, 1) + '\n');
console.log(`${id} for ${to}, encrypted to ${boxFp}: site/assets/review/replies/${to}.json (${doc.messages.length} in all)`);
