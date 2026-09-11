// rm-scenarios-schema.js — pure validator for the rm-scenarios content vault
// data (src/data/scenarios.json). Shared by the browser loader and the node
// test suite; no DOM, no IO. The shape is the contract with the content team:
//   { series: { title, buttons{no,yes,deflect,admit}, intervals[]{id,sev,tone,desc} },
//     scenarios: [ { id, n, live, domain, title, hook, escape, act, reveal } ] }

export function validateScenariosData(d) {
  const errors = [];
  const need = (cond, msg) => { if (!cond) errors.push(msg); };

  need(d && typeof d === 'object', 'root: not an object');
  if (errors.length) return { ok: false, errors };

  const s = d.series;
  need(s && typeof s === 'object', 'series: missing');
  if (s) {
    need(typeof s.title === 'string' && s.title.length > 0, 'series.title: missing');
    const b = s.buttons || {};
    for (const k of ['no', 'yes', 'deflect', 'admit'])
      need(typeof b[k] === 'string' && b[k].length > 0, `series.buttons.${k}: missing`);
    need(Array.isArray(s.intervals) && s.intervals.length > 0, 'series.intervals: empty');
    (s.intervals || []).forEach((w, i) => {
      for (const k of ['id', 'sev', 'tone', 'desc'])
        need(typeof w[k] === 'string' && w[k].length > 0, `series.intervals[${i}].${k}: missing`);
    });
  }

  need(Array.isArray(d.scenarios) && d.scenarios.length > 0, 'scenarios: empty');
  (d.scenarios || []).forEach((sc, i) => {
    for (const k of ['id', 'domain', 'title', 'hook', 'escape', 'act', 'reveal'])
      need(typeof sc[k] === 'string' && sc[k].length > 0, `scenarios[${i}].${k}: missing`);
    need(typeof sc.n === 'number', `scenarios[${i}].n: not a number`);
    need(typeof sc.live === 'boolean', `scenarios[${i}].live: not a boolean`);
  });
  need((d.scenarios || []).some(sc => sc.live === true), 'scenarios: none are live');

  return { ok: errors.length === 0, errors };
}
