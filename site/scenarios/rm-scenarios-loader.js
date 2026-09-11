// rm-scenarios-loader.js — fetches the scenario content from the rm-scenarios
// SG/Vault and mounts the engine. This is the structure/content seam:
//
//   vault (dm42qcaw)  --ciphertext-->  this module  --decrypt in browser-->
//   RM.data.scenarios --> <rm-scenarios> / <rm-scenarios-record> (engine)
//
// The read key below is PUBLIC BY DESIGN (read-only capability for public
// content; the write key is never in this repo). Objects are AES-256-GCM;
// all decryption happens client-side via the sgraph vault-client (hosted,
// version-pinned). A content publish (`sgit push` to the vault) is live on
// the next page load — no CI, no redeploy.
//
// URL params (for previews and local testing):
//   ?branch=<name>     read a specific vault branch instead of the default ref
//   ?endpoint=<url>    override the vault API base (default dev.send.sgraph.ai)

import {
  importReadKey, deriveFileIdHex, deriveBranchRefFileId, formatFileId,
  walkTree, readFileAsJson, SALT_PREFIX
} from 'https://dev.tools.sgraph.ai/core/vault-client/v1/v1.2/v1.2.2/sg-vault-client.js';

import { validateScenariosData } from './rm-scenarios-schema.js';

const VAULT_ID       = 'dm42qcaw';
const READ_KEY_B64U  = 'zhlwx0cCPoS2UDPsy25EnEEH0pymN87bTBzOFzNpkFU';  // public read key (base64url; sgit's hex form decodes to the same 32 bytes)
const DEFAULT_API    = 'https://dev.send.sgraph.ai';
const CONTENT_PATH   = 'src/data/scenarios.json';

function b64uToBytes(b64u) {
  const b64 = b64u.replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(b64 + '='.repeat((4 - (b64.length % 4)) % 4));
  return Uint8Array.from(bin, c => c.charCodeAt(0));
}

async function resolveRefId(keyBytes, branch) {
  if (branch) return deriveBranchRefFileId(keyBytes, VAULT_ID, branch);
  const hex = await deriveFileIdHex(keyBytes, `${SALT_PREFIX}:file-id:ref:${VAULT_ID}`);
  return formatFileId('ref', 'pid', 'muw', hex);
}

async function loadScenarios() {
  const params   = new URLSearchParams(location.search);
  const branch   = params.get('branch');
  const api      = params.get('endpoint') || DEFAULT_API;
  const keyBytes = b64uToBytes(READ_KEY_B64U);
  if (keyBytes.length !== 32) throw new Error('read key must decode to 32 bytes');

  const cryptoKey = await importReadKey(READ_KEY_B64U);
  const refFileId = await resolveRefId(keyBytes, branch);
  const vault = { keys: { vaultId: VAULT_ID, readKey: cryptoKey, refFileId }, apiBaseUrl: api };

  // ref -> commit -> tree, then walk the path segments to the content blob
  const ref    = await readFileAsJson(vault, refFileId);
  const commit = await readFileAsJson(vault, ref.commit_id || ref.commitId || ref.target);
  let tree     = await walkTree(vault, commit.tree_id || commit.treeId || commit.tree);

  const segments = CONTENT_PATH.split('/');
  let blobId = null;
  for (let i = 0; i < segments.length; i++) {
    const entry = (tree.entries || []).find(e => e.name === segments[i]);
    if (!entry) throw new Error(`vault path not found: ${segments.slice(0, i + 1).join('/')}`);
    if (i < segments.length - 1) tree = await walkTree(vault, entry.tree_id);
    else blobId = entry.blob_id;
  }

  const data = await readFileAsJson(vault, blobId);
  const check = validateScenariosData(data);
  if (!check.ok) throw new Error('scenario data failed validation: ' + check.errors.join('; '));
  return { data, commit, branch };
}

function mount() {
  const scMount  = document.getElementById('scenarios-mount');
  const recMount = document.getElementById('record-mount');
  scMount.textContent = '';
  recMount.textContent = '';
  scMount.appendChild(document.createElement('rm-scenarios'));
  recMount.appendChild(document.createElement('rm-scenarios-record'));
}

function showError(err) {
  const scMount = document.getElementById('scenarios-mount');
  scMount.textContent = '';
  const card = document.createElement('div');
  card.className = 'rm-shell-status err';
  card.textContent = 'The scenarios are temporarily unavailable (could not load content from the vault). Please try again shortly.';
  scMount.appendChild(card);
  console.error('rm-scenarios loader:', err);
}

loadScenarios()
  .then(({ data }) => { RM.data.scenarios = data; mount(); })
  .catch(showError);
