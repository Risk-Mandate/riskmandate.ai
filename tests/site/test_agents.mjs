// The site agent's contact file (Agent Contact v0.1, https://sgit.ai/docs/agent-contact.html):
// the fingerprints must recompute from the PEMs, the lane tokens must be lane-shaped, and
// nothing private may be in it. The /agents/ page is built from the file, so a stale page
// is caught by build-agents.mjs --check, not here.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash, createPublicKey } from 'node:crypto';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE = join(dirname(fileURLToPath(import.meta.url)), '../../site');
const file = JSON.parse(readFileSync(join(SITE, '.well-known/sgit-agents.json'), 'utf8'));
const fp = (pem) => 'sha256:' + createHash('sha256').update(createPublicKey(pem).export({ type: 'spki', format: 'der' })).digest('hex').slice(0, 16);

test('the contact file is the schema it says, for this site', () => {
  assert.equal(file.schema, 'sgit-agents/v1');
  assert.equal(file.site, 'riskmandate.ai');
  assert.ok(file.accepts_from.includes('sgit.ai'), 'sgit.ai is not on the allow list');
  assert.ok(Object.keys(file.identities).length >= 1, 'no identity');
});

test('every identity\'s fingerprints recompute from its PEMs, and its inbox is well formed', () => {
  for (const [id, ident] of Object.entries(file.identities)) {
    assert.equal(fp(ident.bundle.encrypt), ident.fingerprint, `${id}: encryption fingerprint does not match the PEM`);
    assert.equal(fp(ident.bundle.sign), ident.signing_fingerprint, `${id}: signing fingerprint does not match the PEM`);
    assert.equal(ident.bundle.fingerprint, ident.fingerprint);
    assert.equal(ident.inbox.encrypt_to, ident.fingerprint, `${id}: encrypt_to is not the current key`);
    assert.match(ident.inbox.vault, /^[a-z0-9]{8}$/, `${id}: the inbox vault id is not a vault id`);
    for (const lane of ident.inbox.lanes) assert.match(lane.append_token, /^[0-9a-f]{16,128}$/, `${id}/${lane.name}: not an append token`);
    assert.ok(ident.inbox.lanes.some(l => l.name === 'site'), `${id}: no site lane for the forms`);
  }
});

test('nothing private is in the contact file', () => {
  const s = readFileSync(join(SITE, '.well-known/sgit-agents.json'), 'utf8');
  assert.doesNotMatch(s, /PRIVATE KEY/);
  assert.doesNotMatch(s, /sgit_private_/);
  assert.doesNotMatch(s, /enum/i, 'the listing key, or a word for it, is in the public file');
});
