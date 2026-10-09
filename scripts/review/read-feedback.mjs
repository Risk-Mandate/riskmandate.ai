// read-feedback.mjs — read what the private review pages sent, from the review vault's append lane.
//
//   REVIEW_KEY=<vault key> node scripts/review/read-feedback.mjs --vault <clone of the review vault> [--dry-run]
//   then:  cd <clone> && sgit commit -m "@Agent review feedback: <n> received" && sgit push --token <access token>
// It then rebuilds the vault's dashboard (build-dashboard.mjs): index.html, a vault app over everything drained.
//
// The review pages (the first is site/home-diff.html) encrypt each send in the reader's browser to the public
// key published in site/assets/review/lane.json, and append it to the `review` lane of a private vault. This
// script lists the lane with the enum key, fetches each pending file, decrypts it with the private key kept in
// the vault (encrypted at rest with a passphrase derived from the vault's write key), writes the message to
// feedback/<file_id>.eml and its JSON record to feedback/<file_id>.json, appends a line to feedback/log.jsonl,
// and marks the file processed. Screenshots a reader pasted arrive in the record's `shots`; each is written beside
// it as feedback/<file_id>-<shot id>.<webp|jpg|png>, and the JSON keeps the file name in place of the image data.
// Sends from v1.38.5 are signed by the reader's browser (site/assets/review/identity.js): the record carries
// `from` with the browser's public keys, and the X-RM-Signature header an ECDSA P-256 signature over the record.
// The signature is checked here, the browser id is checked against its signing key, and the keys are pinned in
// the vault at review-lane/browsers/<browser id>.json on first sight; reply.mjs encrypts notes to that pin.
// It prints a summary of every answer and comment, newest send last.
//
// Secrets: the vault key comes from the environment and is never written anywhere; everything else is derived
// from it here, in memory, the way the lane was set up. The lane token is public; it can only write.

import { readFileSync, writeFileSync, mkdirSync, existsSync, appendFileSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHmac, createPrivateKey, createPublicKey, privateDecrypt, createDecipheriv, createHash, verify, constants } from 'node:crypto';
import { execFileSync } from 'node:child_process';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const arg = (f, d) => { const i = process.argv.indexOf(f); return i > 0 ? process.argv[i + 1] : d; };
const DRY = process.argv.includes('--dry-run');
const VAULT = arg('--vault', 'review-feedback');
const KEY = process.env.REVIEW_KEY; if (!KEY) { console.error('REVIEW_KEY is not set'); process.exit(2); }
const SGIT = process.env.SGIT || 'sgit';
const lane = JSON.parse(readFileSync(join(ROOT, 'site/assets/review/lane.json'), 'utf8'));

const d = execFileSync(SGIT, ['vault', 'derive-keys', KEY], { encoding: 'utf8' });
const vaultId = /vault_id:\s+(\S+)/.exec(d)[1], writeKey = /write_key:\s+([0-9a-f]+)/.exec(d)[1];
if (vaultId !== lane.vault) { console.error(`the key opens ${vaultId}, the lane file names ${lane.vault}`); process.exit(2); }
const hm = (l) => createHmac('sha256', Buffer.from(writeKey, 'hex')).update(l).digest('hex');
const enumKey = hm('agent-contact/enum-key/v1');
const priv = createPrivateKey({ key: readFileSync(join(VAULT, 'review-lane/keys/review.encrypt.pem')), passphrase: hm('agent-contact/key-pass/review/v1') });

async function api(path, body) {
  const r = await fetch(`${lane.endpoint}/api/vault/append/${path}/${vaultId}`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-sgraph-vault-enum-key': enumKey }, body: JSON.stringify(body) });
  const t = await r.text(); if (!r.ok) throw new Error(`${path} → ${r.status} ${t.slice(0, 80).replace(/\s+/g, ' ')}`); return JSON.parse(t);
}
function open(content) {
  const env = JSON.parse(Buffer.from(Buffer.from(content, 'base64').toString('utf8'), 'base64').toString('utf8'));
  if (env.v !== 2) throw new Error(`envelope v${env.v}`);
  const aes = privateDecrypt({ key: priv, padding: constants.RSA_PKCS1_OAEP_PADDING, oaepHash: 'sha256' }, Buffer.from(env.w, 'base64'));
  const c = Buffer.from(env.c, 'base64'), dc = createDecipheriv('aes-256-gcm', aes, Buffer.from(env.i, 'base64'));
  dc.setAuthTag(c.subarray(c.length - 16));
  return Buffer.concat([dc.update(c.subarray(0, c.length - 16)), dc.final()]).toString('utf8');
}
const spkiFp = (pem) => createHash('sha256').update(createPublicKey(pem).export({ type: 'spki', format: 'der' })).digest('hex').slice(0, 16);
// 'signed' (and the browser it came from), 'unsigned', or why it failed
function checkSig(json, rec, sigHeader) {
  const f = rec?.from; if (!f) return { sig: 'unsigned' };
  const m = /^ecdsa-p256-sha256 (\S+)$/.exec(sigHeader || ''); if (!m) return { sig: 'unsigned', browser: f.browser };
  try {
    if ('b' + spkiFp(f.sign_pub) !== f.browser) return { sig: 'bad: the browser id is not its signing key', browser: f.browser };
    if ('sha256:' + spkiFp(f.box_pub) !== f.box_fp) return { sig: 'bad: the reply key is not its fingerprint', browser: f.browser };
    const ok = verify('sha256', Buffer.from(json, 'utf8'), { key: f.sign_pub, dsaEncoding: 'ieee-p1363' }, Buffer.from(m[1], 'base64'));
    return { sig: ok ? 'signed' : 'bad: the signature does not verify', browser: f.browser };
  } catch (err) { return { sig: `bad: ${err.message}`, browser: f.browser }; }
}
// first sight pins the keys; later sends must carry the same reply key, or they are flagged and the pin is kept
function pin(rec, meta) {
  const f = rec.from, dir = join(VAULT, 'review-lane/browsers'), file = join(dir, `${f.browser}.json`);
  const old = existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : null;
  if (old && old.box_fp !== f.box_fp) { meta.sig += '; the reply key differs from the pin, pin kept'; return; }
  const p = old || { browser: f.browser, sign_fp: f.sign_fp, sign_pub: f.sign_pub, box_fp: f.box_fp, box_pub: f.box_pub, keys_created: f.keys_created, first_seen: meta.received, sends: 0 };
  p.last_seen = meta.received; p.sends++; p.who = rec.who || p.who; p.pages = [...new Set([...(p.pages || []), rec.page])];
  if (!DRY) { mkdirSync(dir, { recursive: true }); writeFileSync(file, JSON.stringify(p, null, 1) + '\n'); }
}
const header = (eml, name) => (new RegExp(`^${name}:\\s*(.*)$`, 'mi').exec(eml.split(/\r?\n\r?\n/)[0]) || [])[1]?.trim() || '';

const out = join(VAULT, 'feedback'); if (!DRY) mkdirSync(out, { recursive: true });
let after, n = 0; const records = [];
for (;;) {
  const page = await api('list', { include_content: false, ...(after ? { after_file_id: after } : {}) });
  const entries = (page.entries || []).filter((e) => e.inbox === lane.append_token);
  for (const e of entries) {
    const f = await api('fetch', { inbox: e.inbox, file_ids: [e.file_id] });
    let eml; try { eml = open(f.files?.[0]?.content); } catch (err) { console.log(`${e.file_id}: could not open (${err.message})`); continue; }
    const json = (eml.split('--- the record, as JSON ---')[1] || '').trim();
    let rec = null; try { rec = JSON.parse(json.replace(/\r\n/g, '\n')); } catch (_) {}
    const meta = { file: e.file_id, received: new Date(e.received).toISOString(), form: header(eml, 'X-RM-Form'), page: header(eml, 'X-RM-Page'), send: header(eml, 'X-RM-Send'), seq: header(eml, 'X-RM-Seq'), subject: header(eml, 'Subject') };
    Object.assign(meta, checkSig(json.replace(/\r\n/g, '\n'), rec, header(eml, 'X-RM-Signature')));
    if (rec?.from && meta.sig.startsWith('signed')) pin(rec, meta);
    const shots = [];
    for (const s of rec?.shots || []) {
      const m = /^data:image\/(webp|jpeg|png);base64,(.+)$/.exec(s.data || ''); if (!m) continue;
      const file = `${e.file_id}-${String(s.id).replace(/[^a-z0-9]/gi, '')}.${m[1] === 'jpeg' ? 'jpg' : m[1]}`;
      if (!DRY) writeFileSync(join(out, file), Buffer.from(m[2], 'base64'));
      delete s.data; s.file = file; shots.push({ on: s.on, file });
    }
    meta.shots = shots;
    if (!DRY) {
      writeFileSync(join(out, `${e.file_id}.eml`), shots.length ? eml.replace(/"data":\s*"data:image\/[^"]+"/g, '"data": "(written to its own file)"') : eml);
      if (rec) writeFileSync(join(out, `${e.file_id}.json`), JSON.stringify(rec, null, 1) + '\n');
      appendFileSync(join(out, 'log.jsonl'), JSON.stringify({ ...meta, who: rec?.who, events: rec?.events?.length }) + '\n');
      await api('mark-processed', { inbox: e.inbox, file_ids: [e.file_id] });
    }
    records.push({ meta, rec }); n++;
  }
  if (!page.next_after_file_id && !(page.has_more)) break;
  after = page.next_after_file_id || entries.at(-1)?.file_id; if (!after) break;
}

// a summary: the latest answer per reader per question, and every comment
const latest = {};
for (const { meta, rec } of records) {
  if (!rec) continue;
  const who = ([rec.who?.name || rec.who?.email, rec.who?.ref].filter(Boolean).join(' · ') || `session ${rec.sid}`) + (meta.browser ? ` · ${meta.browser}` : '');
  latest[who] = { at: meta.received, page: rec.page, sig: meta.sig, answers: rec.answers, comments: rec.comments, events: (latest[who]?.events || 0) + (rec.events?.length || 0), shots: (latest[who]?.shots || []).concat(meta.shots) };
}
console.log(`${n} message(s) ${DRY ? 'read (dry run, nothing written or marked)' : 'received, written to feedback/ and marked processed'}.`);
for (const [who, s] of Object.entries(latest)) {
  console.log(`\n== ${who} · ${s.page} · last send ${s.at} · ${s.events} events · ${s.sig}`);
  for (const [k, v] of Object.entries(s.answers || {})) if (v) console.log(`  ${k}: ${v}`);
  for (const [k, v] of Object.entries(s.comments || {})) if (v) console.log(`  comment ${k}: ${v}`);
  for (const x of s.shots) console.log(`  screenshot on ${x.on}: feedback/${x.file}`);
}

if (!DRY) execFileSync(process.execPath, [join(ROOT, 'scripts/review/build-dashboard.mjs'), '--vault', VAULT], { stdio: 'inherit' });
