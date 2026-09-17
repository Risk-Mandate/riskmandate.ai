// test_vault_app.mjs — boot the vault reading app against a real vault, in a fake DOM, and
// build every view. Two renderer bugs have shipped from this file (a builder returning an
// array inside an array; a builder returning null where a node was expected), and neither
// was catchable by reading the diff. This catches that class: if a view throws, or renders
// nothing, or renders a word this site does not allow, the build fails.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const ROOT  = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const APP   = join(ROOT, 'site/vaults/_app/index.html');
const VAULT = join(ROOT, 'site/vaults/claude-gmail-connector');

// ---- the smallest DOM this renderer needs -------------------------------------------------
function makeEl(tag) {
  const el = {
    tagName: tag, children: [], attrs: {}, _text: '', className: '', dataset: {}, style: {},
    classList: { add() {}, remove() {}, toggle() {} },
    setAttribute(k, v) { el.attrs[k] = v; if (k.startsWith('data-')) el.dataset[k.slice(5)] = v; },
    appendChild(node) {
      assert.ok(node && typeof node === 'object' && 'tagName' in node,
        `appendChild got ${Object.prototype.toString.call(node)} — a builder returned something that is not a node`);
      el.children.push(node); return node;
    },
    append(...nodes) { for (const n of nodes) if (n != null) el.appendChild(n); },
    addEventListener() {}, focus() {}, select() {},
    get innerHTML() { return el._text; }, set innerHTML(v) { el._text = String(v); },
    get textContent() { return el._text + el.children.map(c => c.textContent).join(''); },
    set textContent(v) { el._text = String(v); el.children.length = 0; },
  };
  return el;
}
const textNode = (s) => { const n = makeEl('#text'); n._text = String(s); return n; };

test('every view in the vault reading app builds against a real vault', async () => {
  const html = readFileSync(APP, 'utf8');
  const script = html.slice(html.lastIndexOf('<script>') + 8, html.lastIndexOf('</script>'));

  const ids = {};
  const doc = {
    createElement: makeEl, createElementNS: (_ns, tag) => makeEl(tag), createTextNode: textNode,
    getElementById: (id) => (ids[id] ||= makeEl('div')),
    querySelectorAll: () => [], addEventListener() {}, execCommand: () => true,
  };
  const ctx = {
    document: doc, console,
    navigator: { clipboard: { writeText: async () => {} } },
    window: { addEventListener() {}, scrollTo() {}, parent: null },
    fetch: async (path) => {
      const p = join(VAULT, path);
      if (!existsSync(p)) return { ok: false, status: 404, text: async () => '' };
      return { ok: true, status: 200, text: async () => readFileSync(p, 'utf8') };
    },
  };
  ctx.window.document = doc; ctx.globalThis = ctx; ctx.self = ctx;
  vm.createContext(ctx);
  vm.runInContext(script, ctx, { filename: 'site/vaults/_app/index.html' });

  // load() is async; the file's own boot promise resolves before we poke at it.
  await vm.runInContext('load().then(d => { D = d; CAP = Object.fromEntries(D.capabilities.capabilities.map(c => [c.id, c])); UNDO_RANK = Object.fromEntries(D.undo.order.map((u, i) => [u, i])); MEASURED = new Set(D.tiers.counted_as_measured); MANDATE = JSON.parse(JSON.stringify(D.mandate)); STD = {}; for (const k of ["gdpr","euaiact","attack"]) { const g = D[k]; if (g) for (const n of g.nodes || []) STD[n.id] = n; } HOLDERS = Object.fromEntries((((D.holders || {}).holders) || []).map(x => [x.id, x])); });', ctx);

  const seen = {};
  const views = vm.runInContext('Object.keys(BUILDERS)', ctx);
  assert.ok(views.length >= 12, 'the app should carry every view');
  for (const name of views) {
    const el = makeEl('div');
    ids.view = el;
    vm.runInContext(`render(${JSON.stringify(name)})`, ctx);   // throws if a builder is broken
    const text = ids.view.textContent;
    assert.ok(text.length > 40, `view "${name}" rendered almost nothing`);
    assert.doesNotMatch(text, /\|,\|/, `view "${name}" has a comma-joined table — a builder returned a nested array`);
    assert.doesNotMatch(text, /\bundefined\b/, `view "${name}" printed "undefined"`);
    assert.doesNotMatch(text, /\[object Object\]/, `view "${name}" printed an object`);
    seen[name] = text;
  }
  // the views this vault must actually carry, by something only they say
  assert.match(seen.holds, /Who holds what stands in the way/);
  assert.match(seen.holds, /a vendor, as a product decision/);
  assert.match(seen.grant, /Everything the agent can do/);
  assert.match(seen.consequences, /The routes out/);
});

test('the app carries no rating of a control, anywhere', () => {
  const html = readFileSync(APP, 'utf8');
  // Rule 1 is about the policy; the same discipline applies to the barriers on it. A control
  // is described here by who holds it and what moves it, never by an adjective that ranks it.
  for (const word of ['a strong control', 'a weak control', 'credible control', 'robust control']) {
    assert.ok(!html.toLowerCase().includes(word), `the app grades a control: "${word}"`);
  }
});

test('every barrier holder the vaults use is a class the vocabulary defines', () => {
  const vocab = JSON.parse(readFileSync(join(ROOT, 'site/vaults/_template/data/barrier-holders.json'), 'utf8'));
  const classes = new Set(vocab.holders.map(h => h.id));
  const answers = vocab.answers;
  for (const slug of readdirSync(join(ROOT, 'site/vaults'))) {
    const p = join(ROOT, 'site/vaults', slug, 'data/grant.json');
    if (!existsSync(p)) continue;
    const g = JSON.parse(readFileSync(p, 'utf8'));
    assert.ok(!g.not_reachable, `${slug}: not_reachable was renamed to blocked, and every entry names its blocker`);
    for (const b of g.blocked || []) assert.ok(b.blocked_by, `${slug}: blocked entry "${b.what}" does not say what blocks it`);
    for (const hd of [...(g.blocked || []), ...g.grant].map(x => x.holder).filter(Boolean)) {
      assert.ok(classes.has(hd.held_by), `${slug}: held_by "${hd.held_by}" is not a holder class`);
      for (const [k, allowed] of Object.entries(answers)) assert.ok(allowed.includes(hd[k]), `${slug}: ${k} is "${hd[k]}"`);
    }
  }
});
