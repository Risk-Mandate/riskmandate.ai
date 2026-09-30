#!/usr/bin/env node
// configure.mjs — (re)register the comms vault's append lanes, or purge processed files.
//
//   COMMS_KEY=<vault key> SGSEND_TOKEN=<the host's account credential> \
//     node scripts/intake/configure.mjs --vault <clone> [--purge]
//
// The lane list is read from two places that must agree: the clone's agent-contact/lanes.json
// (name → sha256 of the token, which the drain uses to name a lane) and the site's contact file
// (name → the public token, which senders use). `configure` REPLACES the anchor list on the host,
// so this always sends every lane; dropping one from both files and re-running is how a token is
// revoked. The listing key is derived from the write key here, in memory, as the drain does.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createHmac, createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';

const arg = (f, d) => { const i = process.argv.indexOf(f); return i > 0 ? process.argv[i + 1] : d; };
const VAULT = arg('--vault', 'comms-riskmandate'), PURGE = process.argv.includes('--purge');
const KEY = process.env.COMMS_KEY, TOKEN = process.env.SGSEND_TOKEN;
if (!KEY || !TOKEN) { console.error('COMMS_KEY and SGSEND_TOKEN are both needed'); process.exit(2); }
const ENDPOINT = process.env.COMMS_ENDPOINT || 'https://dev.send.sgraph.ai';
const contactPath = arg('--contact', new URL('../../site/.well-known/sgit-agents.json', import.meta.url).pathname);

const derived = execFileSync(process.env.SGIT || 'sgit', ['vault', 'derive-keys', KEY], { encoding: 'utf8' });
const vaultId = /vault_id:\s+(\S+)/.exec(derived)[1], writeKey = /write_key:\s+([0-9a-f]+)/.exec(derived)[1];
const sha = (s) => createHash('sha256').update(s).digest('hex');
const enumKey = createHmac('sha256', Buffer.from(writeKey, 'hex')).update('agent-contact/enum-key/v1').digest('hex');

const lanes = JSON.parse(readFileSync(join(VAULT, 'agent-contact/lanes.json'), 'utf8')).lanes;
const ident = JSON.parse(readFileSync(contactPath, 'utf8')).identities.agent;
if (ident.inbox.vault !== vaultId) { console.error(`the contact file names vault ${ident.inbox.vault}, the key opens ${vaultId}`); process.exit(2); }
const anchors = [];
for (const l of ident.inbox.lanes) {
  if (!lanes[l.name]) { console.error(`lane ${l.name} is in the contact file and not in lanes.json`); process.exit(2); }
  if (lanes[l.name].anchor !== sha(l.append_token)) { console.error(`lane ${l.name}: the token in the contact file does not hash to the anchor in lanes.json`); process.exit(2); }
  anchors.push(sha(l.append_token));
}
for (const n of Object.keys(lanes)) if (!ident.inbox.lanes.some(l => l.name === n)) { console.error(`lane ${n} is in lanes.json and not in the contact file`); process.exit(2); }

const owner = { 'Content-Type': 'application/json', 'x-sgraph-vault-write-key': writeKey, 'x-sgraph-access-token': TOKEN };
async function call(path, body) {
  const r = await fetch(`${ENDPOINT}/api/vault/append/${path}/${vaultId}`, { method: 'POST', headers: owner, body: JSON.stringify(body) });
  const t = await r.text(); if (!r.ok) throw new Error(`${path} → ${r.status} ${t.slice(0, 80).replace(/\s+/g, ' ')}`); return JSON.parse(t);
}
if (PURGE) {
  for (const l of ident.inbox.lanes) console.log(l.name, await call('purge', { inbox: l.append_token, folder: 'processed' }));
} else {
  console.log(await call('configure', { append_anchors: anchors, enum_key_hash: sha(enumKey) }), `${anchors.length} lane(s)`);
}
