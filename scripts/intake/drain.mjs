#!/usr/bin/env node
// drain.mjs — empty the comms vault's append lanes into its clone, one file at a time.
//
//   COMMS_KEY=<the comms vault's key> node scripts/intake/drain.mjs --vault <path to the clone> [--dry-run] [--purge]
//
// What it does, per pending file (Agent Contact v0.1 §7, https://sgit.ai/docs/agent-contact.html):
//   list (metadata only) → fetch → double-decode → decrypt with the identity's private key →
//   check the headers → file under agent-contact/accepted/ (or quarantine/) → log → mark processed.
// The `site` lane carries the website's forms: encrypted in the browser, unsigned (a person has no
// key), X-RM-Form contact|early-access. The `agents` lane carries signed agent mail; this drain
// verifies the signature against the sender's published contact file when one is present and
// quarantines the rest, with the reason.
//
// Secrets: the vault key comes from the environment and is never written anywhere. The write key,
// the listing key and the key-store secret are derived from it here, in memory, the way the vault
// was set up (HMAC-SHA256 over the write key with the labels below). The identity's private keys
// are read from the clone at agent-contact/keys/store/<fp>/, where they are encrypted at rest.
// After a run: `sgit commit` and `sgit push` the clone yourself; this script never pushes.
import { readFileSync, writeFileSync, mkdirSync, existsSync, appendFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { createHmac, createHash, createPrivateKey, createPublicKey, privateDecrypt, createDecipheriv, createVerify, constants } from 'node:crypto';
import { execFileSync } from 'node:child_process';

const arg = (f, d) => { const i = process.argv.indexOf(f); return i > 0 ? process.argv[i + 1] : d; };
const DRY = process.argv.includes('--dry-run'), PURGE = process.argv.includes('--purge');
const VAULT = arg('--vault', 'comms-riskmandate');
const KEY = process.env.COMMS_KEY; if (!KEY) { console.error('COMMS_KEY is not set'); process.exit(2); }
const ENDPOINT = process.env.COMMS_ENDPOINT || 'https://dev.send.sgraph.ai';
const SGIT = process.env.SGIT || 'sgit';

// --- keys derived from the vault key, never stored -------------------------------------------
const derived = execFileSync(SGIT, ['vault', 'derive-keys', KEY], { encoding: 'utf8' });
const vaultId  = /vault_id:\s+(\S+)/.exec(derived)[1];
const writeKey = /write_key:\s+([0-9a-f]+)/.exec(derived)[1];
const hm = (label) => createHmac('sha256', Buffer.from(writeKey, 'hex')).update(label).digest('hex');
const enumKey  = hm('agent-contact/enum-key/v1');
const keyPass  = hm('agent-contact/key-pass/agent/v1');

// --- the identity's keys, from the clone -----------------------------------------------------
const storeDir = join(VAULT, 'agent-contact/keys/store');
const fpDir = readdirSync(storeDir).find(d => d.startsWith('sha256_')); if (!fpDir) { console.error('no key store in the clone'); process.exit(2); }
const priv = createPrivateKey({ key: readFileSync(join(storeDir, fpDir, 'private_key.pem')), passphrase: keyPass });
const myFp = 'sha256:' + createHash('sha256').update(createPublicKey(priv).export({ type: 'spki', format: 'der' })).digest('hex').slice(0, 16);
const lanes = JSON.parse(readFileSync(join(VAULT, 'agent-contact/lanes.json'), 'utf8')).lanes;
const laneOf = (token) => Object.entries(lanes).find(([, l]) => l.anchor === createHash('sha256').update(token).digest('hex'))?.[0];
// our own contact file, for the allow list: the repository's copy by default, or --contact <path>
const contactPath = arg('--contact', new URL('../../site/.well-known/sgit-agents.json', import.meta.url).pathname);
const contact = existsSync(contactPath) ? JSON.parse(readFileSync(contactPath, 'utf8')) : null;
if (!contact) console.error(`no contact file at ${contactPath}: the allow list is empty, so every agents-lane message is quarantined`);

// --- the API ----------------------------------------------------------------------------------
async function api(path, body, headers) {
  const r = await fetch(`${ENDPOINT}/api/vault/append/${path}/${vaultId}`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body) });
  const text = await r.text();
  if (!r.ok) throw new Error(`${path} → ${r.status} ${text.slice(0, 80).replace(/\s+/g, ' ')}`);
  return JSON.parse(text);
}
const listing = (h) => api('list', { include_content: false, ...h }, { 'x-sgraph-vault-enum-key': enumKey });

// --- the envelope -----------------------------------------------------------------------------
function open(content) {
  const encText = Buffer.from(content, 'base64').toString('utf8');            // the .enc text
  const env = JSON.parse(Buffer.from(encText, 'base64').toString('utf8'));    // {v,w,i,c,f?,s?}
  if (env.v !== 2) throw new Error(`envelope v${env.v}`);
  const aes = privateDecrypt({ key: priv, padding: constants.RSA_PKCS1_OAEP_PADDING, oaepHash: 'sha256' }, Buffer.from(env.w, 'base64'));
  const c = Buffer.from(env.c, 'base64'), tag = c.subarray(c.length - 16), body = c.subarray(0, c.length - 16);
  const d = createDecipheriv('aes-256-gcm', aes, Buffer.from(env.i, 'base64')); d.setAuthTag(tag);
  const eml = Buffer.concat([d.update(body), d.final()]).toString('utf8');
  return { eml, env, encText };
}
const header = (eml, name) => (new RegExp(`^${name}:\\s*(.*)$`, 'mi').exec(eml.split(/\r?\n\r?\n/)[0]) || [])[1]?.trim() || '';
const domainOf = (addr) => (/@([a-z0-9.-]+)>?$/i.exec(addr) || [])[1]?.toLowerCase() || '';
const allowed = (dom) => (contact?.accepts_from || []).some(p => p.startsWith('*.') ? dom.endsWith(p.slice(1)) || dom === p.slice(2) : dom === p);

async function verifySigned(env, from) {
  // the sender's key is whatever its own site publishes at the standard path, fetched fresh
  const dom = domainOf(from); const id = from.replace(/^.*<|>.*$/g, '').split('@')[0];
  const r = await fetch(`https://${dom}/.well-known/sgit-agents.json`); if (!r.ok) throw new Error(`no contact file at ${dom}`);
  const their = (await r.json()).identities?.[id]; if (!their) throw new Error(`no identity ${id} at ${dom}`);
  const pub = createPublicKey(their.bundle.sign);
  const fp = 'sha256:' + createHash('sha256').update(pub.export({ type: 'spki', format: 'der' })).digest('hex').slice(0, 16);
  if (fp !== their.signing_fingerprint || fp !== env.f) throw new Error(`signer ${env.f} is not ${dom}/${id}'s current key`);
  // sgit signs c only, raw r||s (Web Crypto style), ECDSA P-256 over SHA-256
  const v = createVerify('SHA256'); v.update(Buffer.from(env.c, 'base64'));
  if (!v.verify({ key: pub, dsaEncoding: 'ieee-p1363' }, Buffer.from(env.s, 'base64'))) throw new Error('signature does not verify');
}

// --- the run ----------------------------------------------------------------------------------
const seenPath = join(VAULT, 'agent-contact/seen.json');
const seen = new Set(existsSync(seenPath) ? JSON.parse(readFileSync(seenPath, 'utf8')) : []);
const log = (o) => { console.log(JSON.stringify(o)); if (!DRY) appendFileSync(join(VAULT, 'agent-contact/log.jsonl'), JSON.stringify({ at: new Date().toISOString(), ...o }) + '\n'); };
for (const d of ['accepted', 'quarantine']) mkdirSync(join(VAULT, 'agent-contact', d), { recursive: true });

let after = undefined, total = 0;
for (;;) {
  const page = await listing(after ? { after_file_id: after } : {});
  const entries = page.entries || [];
  for (const e of entries) {
    total++;
    const lane = laneOf(e.inbox);
    const rec = { file: e.file_id, lane: lane || 'unknown', received: new Date(e.received).toISOString() };
    if (!lane) { log({ ...rec, result: 'quarantine', why: 'unknown lane' }); if (!DRY) await api('mark-processed', { inbox: e.inbox, file_ids: [e.file_id] }, { 'x-sgraph-vault-enum-key': enumKey }); continue; }
    let f; try { f = await api('fetch', { inbox: e.inbox, file_ids: [e.file_id] }, { 'x-sgraph-vault-enum-key': enumKey }); } catch (err) { log({ ...rec, result: 'error', why: String(err.message) }); continue; }
    const content = f.files?.[0]?.content;
    let out = 'quarantine', why = '', msg = null;
    try {
      msg = open(content);
      const to = header(msg.eml, 'To'), from = header(msg.eml, 'From'), mid = header(msg.eml, 'Message-ID'), kind = header(msg.eml, 'X-EmailFS-Kind');
      if (Buffer.byteLength(msg.eml) > 256 * 1024) throw new Error('over 256 KB');
      if (!/agent@riskmandate\.ai/.test(to)) throw new Error(`To is not us: ${to}`);
      if (!mid) throw new Error('no Message-ID'); if (seen.has(mid)) throw new Error('replay: seen before');
      if (lane === 'site') {
        if (!/^site@riskmandate\.ai$|<site@riskmandate\.ai>/.test(from)) throw new Error(`site lane with From ${from}`);
        if (!/^(contact|early-access)$/.test(header(msg.eml, 'X-RM-Form'))) throw new Error('site lane without a known X-RM-Form');
      } else {
        if (!allowed(domainOf(from))) throw new Error(`sender domain not allowed: ${domainOf(from)}`);
        if (!msg.env.s || !msg.env.f) throw new Error('unsigned');
        await verifySigned(msg.env, from);
      }
      if (!kind) throw new Error('no X-EmailFS-Kind');
      seen.add(mid); out = 'accepted';
    } catch (err) { why = String(err.message || err); }
    const base = join(VAULT, 'agent-contact', out, e.file_id.replace(/\.enc$/, ''));
    if (!DRY) {
      writeFileSync(base + '.enc', Buffer.from(content, 'base64').toString('utf8'));
      if (msg && (out === 'accepted' || allowed(domainOf(header(msg.eml, 'From'))) || lane === 'site')) writeFileSync(base + '.eml', msg.eml);
      await api('mark-processed', { inbox: e.inbox, file_ids: [e.file_id] }, { 'x-sgraph-vault-enum-key': enumKey });
    }
    log({ ...rec, result: out, ...(why ? { why } : {}), ...(msg ? { subject: header(msg.eml, 'Subject'), form: header(msg.eml, 'X-RM-Form') || undefined, reply_to: header(msg.eml, 'X-RM-Reply-To') || undefined } : {}) });
  }
  if (!page.truncated || !entries.length) break;
  after = entries[entries.length - 1].file_id;
}
if (!DRY) writeFileSync(seenPath, JSON.stringify([...seen], null, 0) + '\n');
if (PURGE) console.error('--purge is configure.mjs\'s job: it needs the owner\'s calls. Nothing purged.');
console.log(`${total} file(s) on the lanes${DRY ? ' (dry run: nothing moved)' : ''}. Identity ${myFp}. Now: sgit commit and sgit push the clone.`);
