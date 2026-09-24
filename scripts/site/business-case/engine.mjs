// engine.mjs — the risk derivation the business cases run on.
//
// It is the RiskGraph Explorer's model, not a new one: site/business-case/model/ is a copy of
// that vault's data (see PROVENANCE.md there), and the three rules below are the rules in its
// app/src/20-graph.js, reproduced so a case can be computed at build time with no browser.
//
//   1. answers → facts     each question option switches facts on; a fact about something that
//                          is not in the estate (no agent, so no agent's log) does not hold.
//   2. facts → risks       an operational or inherent risk holds when every fact it needs is in
//                          evidence, at least one of its needs_any is (if it has any), and none
//                          of the facts that retire it is.
//   3. risks → corporate   a corporate risk has no facts of its own. It holds when a risk that
//                          holds leads into it, and corporate risks may feed each other.
//
// A product's business case is then a difference: the register for a stated deployment, and the
// register for the same deployment with the answers the product changes. Nothing is scored.

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export function loadModel(dir) {
  const read = (f) => JSON.parse(readFileSync(join(dir, f), 'utf8'));
  const items = (x) => (Array.isArray(x) ? x : x.items);
  const facts = Object.fromEntries(items(read('facts.json')).map((f) => [f.id, f]));
  const twins = Object.fromEntries(items(read('twins.json')).map((t) => [t.id, t]));
  const instruments = Object.fromEntries(
    Object.entries((() => { const i = read('instruments.json'); const l = items(i) ?? i;
      return Array.isArray(l) ? Object.fromEntries(l.map((x) => [x.id, x])) : l; })()));
  return {
    facts, twins, instruments,
    questions: items(read('questions.json')),
    risks: items(read('risks.json')),
    roles: items(read('roles.json')),
    presets: items(read('presets.json'))
  };
}

function inEstate(M, twinId, raw) {
  const tw = M.twins[twinId];
  if (!tw) return true;
  if (tw.exists_facts && !tw.exists_facts.some((x) => raw.has(x))) return false;
  return tw.depends_on ? inEstate(M, tw.depends_on, raw) : true;
}

export function factsFor(M, answers) {
  const raw = new Set();
  for (const q of M.questions) {
    const i = answers[q.id];
    if (i == null) continue;
    q.options[i][1].forEach((f) => raw.add(f));
  }
  const out = new Set();
  for (const id of raw) {
    const f = M.facts[id];
    const tw = M.twins[f.subject];
    if (tw && (tw.presence_facts || tw.exists_facts || []).includes(id)) { out.add(id); continue; }
    if (!inEstate(M, f.subject, raw) || !inEstate(M, f.object, raw)) continue;
    out.add(id);
  }
  return out;
}

export function risksFor(M, facts) {
  const live = M.risks.filter((r) => r.layer !== 'corporate'
    && r.needs.every((f) => facts.has(f))
    && (!(r.needs_any || []).length || r.needs_any.some((f) => facts.has(f)))
    && !r.ceases_on.some((f) => facts.has(f)));
  const refs = new Set(live.map((r) => r.ref));
  let grew = true;
  while (grew) {
    grew = false;
    for (const r of M.risks) {
      if (refs.has(r.ref) || r.layer !== 'corporate') continue;
      if (M.risks.some((x) => refs.has(x.ref) && x.leads_to.some((l) => l.ref === r.ref))) { refs.add(r.ref); grew = true; }
    }
  }
  return refs;
}

// The chain a role's risks climb until somebody accepts them: sre → platform → cto → ceo → board.
export function chain(M, roleId) {
  const byId = Object.fromEntries(M.roles.map((r) => [r.id, r]));
  const out = [];
  for (let r = byId[roleId]; r; r = byId[r.reports_to]) out.push(r.id);
  return out;
}

// One case: a baseline answer set, and the answers a product changes. Returns both registers
// and the difference, by risk and by role.
export function compute(M, baseline, changes) {
  const after = { ...baseline };
  for (const c of changes) after[c.q] = c.to;
  const fB = factsFor(M, baseline), fA = factsFor(M, after);
  const rB = risksFor(M, fB), rA = risksFor(M, fA);
  const risk = Object.fromEntries(M.risks.map((r) => [r.ref, r]));
  const retired = [...rB].filter((x) => !rA.has(x)).map((x) => risk[x]);
  const added = [...rA].filter((x) => !rB.has(x)).map((x) => risk[x]);
  const kept = [...rA].filter((x) => rB.has(x)).map((x) => risk[x]);
  const byRole = M.roles.map((ro) => {
    const mine = (set) => [...set].filter((x) => (risk[x].assigned_to || []).includes(ro.id));
    return { role: ro, before: mine(rB), after: mine(rA),
      retired: retired.filter((r) => (r.assigned_to || []).includes(ro.id)).map((r) => r.ref),
      added: added.filter((r) => (r.assigned_to || []).includes(ro.id)).map((r) => r.ref) };
  });
  return { baseline, after, factsBefore: fB, factsAfter: fA, before: rB, afterRisks: rA, retired, added, kept, byRole };
}
