// Tests for the scenarios content contract (rm-scenarios-schema.js).
// Run: node --test tests/web/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validateScenariosData } from '../../web_overlay/scenarios/rm-scenarios-schema.js';

const fixture = () => JSON.parse(readFileSync(new URL('./fixture-scenarios.json', import.meta.url)));

test('real vault content passes validation', () => {
  const r = validateScenariosData(fixture());
  assert.deepEqual(r.errors, []);
  assert.equal(r.ok, true);
});

test('fixture invariants: 10 scenarios, at least one live, all reveals present', () => {
  const d = fixture();
  assert.equal(d.scenarios.length, 10);
  assert.ok(d.scenarios.filter(s => s.live).length >= 1);
  for (const s of d.scenarios) assert.ok(s.reveal.length > 0, `reveal missing on ${s.id}`);
});

test('rejects a scenario missing its reveal (GRC contract: mechanism-stated reveal)', () => {
  const d = fixture();
  delete d.scenarios[0].reveal;
  const r = validateScenariosData(d);
  assert.equal(r.ok, false);
  assert.ok(r.errors.some(e => e.includes('scenarios[0].reveal')));
});

test('rejects data with no live scenarios (page would render empty)', () => {
  const d = fixture();
  d.scenarios.forEach(s => { s.live = false; });
  const r = validateScenariosData(d);
  assert.equal(r.ok, false);
  assert.ok(r.errors.some(e => e.includes('none are live')));
});

test('rejects missing interval fields and missing buttons', () => {
  const d1 = fixture();
  delete d1.series.intervals[0].tone;
  assert.equal(validateScenariosData(d1).ok, false);

  const d2 = fixture();
  delete d2.series.buttons.deflect;
  assert.equal(validateScenariosData(d2).ok, false);
});

test('rejects junk roots', () => {
  for (const junk of [null, 42, 'x', [], {}]) {
    assert.equal(validateScenariosData(junk).ok, false);
  }
});
