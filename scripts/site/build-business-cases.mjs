// build-business-cases.mjs — the business case for a security product, by the risk it changes.
//
//   node scripts/site/build-business-cases.mjs [--check]
//
// Reads   site/business-case/model/        the RiskGraph Explorer's model, copied (PROVENANCE.md)
//         site/business-case/cases/*.json   one product each: a stated deployment, and the answers
//                                           the product changes, each backed by its own words
//         site/business-case/categories.json   the same, for kinds of product rather than products
// Writes  site/business-cases.html          the section: the method, the cases, the categories
//         site/business-case-<slug>.html    one page per case
//
// The principle is the lead's: the register with the product in place should be smaller than
// the register without it, at every altitude from the operator to the board, and that difference
// is the business case. Nothing here is asserted by hand. The register before and after is
// computed by the same three rules the Explorer runs (scripts/site/business-case/engine.mjs), so a
// vendor who disagrees can check the arithmetic and argue with the answers, which is the only
// thing worth arguing with.
//
// Refusals: a change with no basis; a basis that is a vendor's words without a URL and a date; a
// case whose status is not published or draft; a reduction that claims to retire anything. A
// draft is built but kept out of the menu and the index until the lead publishes it.

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve }                               from 'node:path';
import { fileURLToPath }                                        from 'node:url';
import { loadModel, compute }                                   from './business-case/engine.mjs';

const ROOT  = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const SITE  = join(ROOT, 'site');
const DIR   = join(SITE, 'business-case');
const CHECK = process.argv.includes('--check');
const M     = loadModel(join(DIR, 'model'));

// The model is a copy of a vault's data. PROVENANCE.md records each file's digest at the time
// of copying; a file that no longer matches has drifted from the vault it claims to be.
{
  const { createHash } = await import('node:crypto');
  const prov = readFileSync(join(DIR, 'model', 'PROVENANCE.md'), 'utf8');
  for (const [, file, want] of prov.matchAll(/- `([a-z]+\.json)` ([0-9a-f]{64})/g)) {
    const have = createHash('sha256').update(readFileSync(join(DIR, 'model', file))).digest('hex');
    if (have !== want) { console.error(`business cases: model/${file} does not match its digest in PROVENANCE.md — re-copy it from the vault, or update the note with the vault version it came from`); process.exit(1); }
  }
}
const esc   = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const txt   = (s) => esc(s).replace(/\*([^*]+)\*/g, '<em>$1</em>');
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const niceDate = (d) => `${parseInt(d.slice(8, 10), 10)} ${MONTHS[parseInt(d.slice(5, 7), 10) - 1]} ${d.slice(0, 4)}`;
const fail = (m) => { console.error(`business cases: ${m}`); process.exit(1); };

const Q    = Object.fromEntries(M.questions.map((q) => [q.id, q]));
const RISK = Object.fromEntries(M.risks.map((r) => [r.ref, r]));
const ROLE = Object.fromEntries(M.roles.map((r) => [r.id, r]));
const opt  = (q, i) => Q[q].options[i][0];

// Four altitudes, from the person paged to the people who answer for the organisation.
const ALTITUDES = [
  { id: 'operator',  label: 'Operators',  roles: ['RO-sre', 'RO-service'],               note: 'who run it, and are paged when it goes wrong' },
  { id: 'owner',     label: 'Owners',     roles: ['RO-platform', 'RO-ciso', 'RO-dpo'],    note: 'who own what it may touch, and can say what happened' },
  { id: 'executive', label: 'Executives', roles: ['RO-cto', 'RO-cpo', 'RO-cfo', 'RO-ceo'], note: 'who answer for speed, product, cost and the whole' },
  { id: 'board',     label: 'The board',  roles: ['RO-board'],                            note: 'who must be able to defend how it is run' }
];
const CHANGE_KIND = { states: 'states the answer', expectation: 'an expectation', setting: 'a setting', boundary: 'a boundary' };

// ------------------------------------------------------------------ read and check the inputs
const baselineOf = (b) => {
  const preset = M.presets.find((p) => p.id === (b.preset || 'typical'));
  if (!preset) fail(`unknown preset ${b.preset}`);
  const out = { ...preset.answers, ...(b.overrides || {}) };
  for (const [q, i] of Object.entries(out)) if (!Q[q] || !Q[q].options[i]) fail(`baseline answer ${q}=${i} is not in the model`);
  return out;
};
const checkChanges = (where, list, needBasis) => {
  for (const c of list) {
    if (!Q[c.q] || !Q[c.q].options[c.to]) fail(`${where}: change ${c.q}→${c.to} is not in the model`);
    if (!CHANGE_KIND[c.kind]) fail(`${where}: change kind "${c.kind}" is not one of ${Object.keys(CHANGE_KIND).join(', ')}`);
    if (needBasis && !(c.why || c.basis)) fail(`${where}: change ${c.q} has no basis`);
    if (c.basis && (!/^https:\/\//.test(c.basis.url || '') || !c.basis.read || !c.basis.quote))
      fail(`${where}: a basis in somebody else's words needs quote, url and read date`);
  }
};

const cases = readdirSync(join(DIR, 'cases')).filter((f) => f.endsWith('.json')).sort()
  .map((f) => JSON.parse(readFileSync(join(DIR, 'cases', f), 'utf8')));
for (const c of cases) {
  if (!['published', 'draft'].includes(c.status)) fail(`${c.slug}: status must be published or draft`);
  checkChanges(c.slug, [...c.changes, ...(c.adds || [])], true);
  for (const r of c.reduces || []) {
    if (r.barrier !== 'expectation') fail(`${c.slug}: a reduction is an expectation; anything stronger is a change`);
    for (const ref of r.risks) if (!RISK[ref]) fail(`${c.slug}: reduces unknown risk ${ref}`);
  }
  c.base = baselineOf(c.baseline);
  c.result = compute(M, c.base, [...c.changes, ...(c.adds || [])]);
}
const categories = existsSync(join(DIR, 'categories.json')) ? JSON.parse(readFileSync(join(DIR, 'categories.json'), 'utf8')) : { items: [] };
for (const k of categories.items) {
  checkChanges(`category ${k.id}`, [...k.changes, ...(k.adds || [])], false);
  k.base = baselineOf(k.baseline || {});
  k.result = compute(M, k.base, [...k.changes, ...(k.adds || [])]);
}
const published = cases.filter((c) => c.status === 'published');

// ------------------------------------------------------------------ the page's own CSS
const CSS = `
/* business cases — the register with a product and without it, from operator to board */
.bc-meta{font-family:var(--mono);font-size:12px;color:rgba(255,255,255,.6);line-height:1.7;margin-top:6px;max-width:840px}
.bc-meta b{color:rgba(255,255,255,.85)}
.bc-meta a{color:inherit}
.bc-note{font-size:15px;line-height:1.75;color:var(--muted);max-width:880px;margin-top:16px}
.bc-note b{color:var(--text)}
.bc-note a,.bc-card a,.bc-t a{color:var(--green)}
.bc-three{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;margin-top:28px}
.bc-card{background:var(--card);border:1px solid var(--border);border-radius:var(--r);padding:22px 24px}
.bc-card .k{font-family:var(--mono);font-size:10.5px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--green)}
.bc-card h3{font-size:17px;color:var(--text);margin:8px 0 8px;letter-spacing:-.01em}
.bc-card p{font-size:14.5px;line-height:1.7;color:var(--muted)}
.bc-steps{counter-reset:s;margin-top:26px;max-width:940px;display:flex;flex-direction:column}
.bc-steps li{counter-increment:s;list-style:none;display:grid;grid-template-columns:34px minmax(0,1fr);gap:0 16px;padding:16px 0;border-top:1px solid var(--border)}
.bc-steps li:last-child{border-bottom:1px solid var(--border)}
.bc-steps li::before{content:counter(s);font-family:var(--mono);font-size:12px;font-weight:700;color:var(--green);background:var(--greenBg);border-radius:8px;width:30px;height:30px;display:grid;place-items:center}
.bc-steps b{color:var(--text)}
.bc-steps span{font-size:15px;line-height:1.7;color:var(--muted)}
.bc-t{margin-top:24px;border:1px solid var(--border);border-radius:var(--r);background:var(--card);overflow:hidden}
.bc-tr{display:grid;border-top:1px solid var(--border)}
.bc-tr:first-child{border-top:0;background:var(--bg2)}
.bc-tr>span{padding:12px 16px;font-size:14px;line-height:1.6;color:var(--muted);min-width:0;overflow-wrap:anywhere}
.bc-tr:first-child>span{font-family:var(--mono);font-size:10.5px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--text)}
.bc-tr>span:first-child{color:var(--text);font-weight:600}
.bc-t.ch .bc-tr{grid-template-columns:minmax(0,1.3fr) minmax(0,1fr) minmax(0,1fr) minmax(0,1.6fr)}
.bc-t.cat .bc-tr{grid-template-columns:minmax(0,1.2fr) minmax(0,1.6fr) minmax(0,1.4fr) minmax(0,1.3fr)}\n.bc-t.cs .bc-tr{grid-template-columns:minmax(0,1.1fr) minmax(0,.9fr) minmax(0,2.2fr) minmax(0,.7fr)}\n.bc-t.co .bc-tr{grid-template-columns:minmax(0,.8fr) minmax(0,1fr) minmax(0,2.2fr)}\n.bc-t+.bc-h{margin-top:30px}
.bc-was{color:#96442C}
.bc-now{color:var(--green);font-weight:600}
.bc-src{display:block;font-family:var(--mono);font-size:10.5px;color:var(--faint);margin-top:6px;overflow-wrap:anywhere}
.bc-src a{color:inherit}
.bc-sum{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;margin-top:26px}
.bc-sum>div{border:1px solid var(--border);border-radius:var(--r);background:var(--card);padding:18px 20px}
.bc-sum .n{font-size:30px;font-weight:700;color:var(--text);letter-spacing:-.02em}
.bc-sum .l{font-family:var(--mono);font-size:10.5px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--faint);margin-top:4px;display:block}
.bc-sum .off .n{color:var(--green)}
.bc-sum .new .n{color:var(--gold)}
.bc-risks{margin-top:14px;display:flex;flex-direction:column;gap:8px;max-width:960px}
.bc-risk{display:grid;grid-template-columns:86px minmax(0,1fr);gap:0 14px;padding:12px 16px;border:1px solid var(--border);border-radius:10px;background:var(--card)}
.bc-risk .ref{font-family:var(--mono);font-size:11.5px;font-weight:700;color:var(--muted);padding-top:2px}
.bc-risk b{display:block;font-size:14.5px;color:var(--text);font-weight:600}
.bc-risk span{font-size:13px;color:var(--faint);line-height:1.6}
.bc-risk.off{border-color:var(--green)}
.bc-risk.off .ref{color:var(--green)}
.bc-risk.new{border-color:#E6C98F}
.bc-risk.new .ref{color:var(--gold)}
.bc-h{font-family:var(--mono);font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--text);margin-top:28px}
.bc-alt{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-top:26px}
.bc-a{border:1px solid var(--border);border-radius:var(--r);background:var(--card);padding:18px 18px;display:flex;flex-direction:column;gap:10px}
.bc-a h3{font-size:16px;color:var(--text)}
.bc-a .why{font-size:12.5px;color:var(--faint);line-height:1.55}
.bc-role{border-top:1px solid var(--border);padding-top:10px}
.bc-role b{display:block;font-size:13.5px;color:var(--text)}
.bc-role .c{font-family:var(--mono);font-size:12px;color:var(--muted)}
.bc-role .c .d{color:var(--green);font-weight:700}
.bc-role .refs{display:block;font-family:var(--mono);font-size:10.5px;color:var(--faint);margin-top:3px}
.bc-exp{margin-top:22px;display:flex;flex-direction:column;gap:10px;max-width:960px}
.bc-exp>div{border:1px dashed var(--border);border-radius:10px;padding:14px 18px;background:transparent}
.bc-exp q{display:block;font-style:italic;color:var(--text);font-size:15px;quotes:"\\201C" "\\201D"}
.bc-exp span{display:block;font-family:var(--mono);font-size:11px;color:var(--faint);margin-top:6px}
.bc-list{margin-top:18px;max-width:900px}
.bc-list li{font-size:14.5px;line-height:1.75;color:var(--muted);margin:6px 0 0 18px}
.bc-list b{color:var(--text)}
.bc-pill{display:inline-block;font-family:var(--mono);font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;border-radius:999px;padding:3px 9px;background:var(--greenBg);color:var(--green);margin-right:6px}
.bc-pill.draft{background:#FDF1DC;color:var(--gold)}
.bc-pill.ours{background:var(--bg2);color:var(--muted)}
.bc-cases{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin-top:26px}
@media (max-width:980px){.bc-alt{grid-template-columns:1fr 1fr}}
@media (max-width:900px){.bc-three,.bc-cases{grid-template-columns:1fr}.bc-t .bc-tr:first-child{display:none}.bc-t.ch .bc-tr,.bc-t.cat .bc-tr,.bc-t.cs .bc-tr,.bc-t.co .bc-tr,.bc-t.feed .bc-tr{grid-template-columns:1fr 1fr}.bc-tr>span:first-child{grid-column:1 / -1;padding-bottom:2px}.bc-tr>span[data-k]::before{content:attr(data-k);display:block;font-family:var(--mono);font-size:9.5px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--faint);margin-bottom:2px}}
.bc-t.feed .bc-tr{grid-template-columns:minmax(0,.8fr) minmax(0,1.1fr) minmax(0,1.6fr) minmax(0,1.1fr)}
.bc-points,.bc-ideas{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:26px}
.bc-points>div,.bc-ideas>div{border:1px solid var(--border);border-radius:var(--r);background:var(--card);padding:18px 20px}
.bc-points h3,.bc-ideas h3{font-size:15.5px;color:var(--text);margin:0 0 6px;letter-spacing:-.01em}
.bc-points p,.bc-ideas p{font-size:14px;line-height:1.7;color:var(--muted)}
.bcf{margin:26px 0 0;max-width:1000px}
.bcf svg{width:100%;height:auto;display:block;border:1px solid var(--border);border-radius:var(--r);background:var(--card);font-family:var(--sans)}
.bcf figcaption{margin-top:10px;font-family:var(--mono);font-size:11px;line-height:1.7;color:var(--faint)}
.bcf-title{font-size:15px;font-weight:700;fill:var(--text)}
.bcf-box{fill:var(--bg2);stroke:var(--border);stroke-width:1.2}
.bcf-reader{fill:var(--greenBg);stroke:var(--green);stroke-width:1.2}
.bcf-k{font-family:var(--mono);font-size:10px;font-weight:700;letter-spacing:.12em;fill:var(--green)}
.bcf-t{font-size:13.5px;font-weight:700;fill:var(--text)}
.bcf-who{font-size:13px;font-weight:700;fill:var(--text)}
.bcf-d{font-size:11px;fill:var(--muted)}
.bcf-arrow{stroke:var(--faint);stroke-width:1.6;fill:none}.bcf-mk{fill:var(--faint)}
@media (max-width:900px){.bc-points,.bc-ideas{grid-template-columns:1fr}.bcf{overflow-x:auto}.bcf svg{min-width:760px}}
@media (max-width:640px){.bc-alt,.bc-sum{grid-template-columns:1fr}.bc-t.ch .bc-tr,.bc-t.cat .bc-tr,.bc-t.cs .bc-tr,.bc-t.co .bc-tr,.bc-t.feed .bc-tr{grid-template-columns:1fr}.bc-risk{grid-template-columns:1fr}}
`;

// ------------------------------------------------------------------ cut a page from the donor
const donor = readFileSync(join(SITE, 'pricing.html'), 'utf8');
function cut(name, title, desc, body, noindex = false) {
  let head = donor.slice(0, donor.indexOf('<body'));
  if (noindex) head = head.replace(/<\/title>/, '</title>\n<meta name="robots" content="noindex,nofollow">');
  head = head.replace(/<title>.*?<\/title>/s, `<title>${esc(title)}</title>`);
  head = head.replace(/(<meta name="description" content=")[^"]*(")/, `$1${esc(desc)}$2`);
  head = head.replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${esc(title)}$2`);
  head = head.replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${esc(desc)}$2`);
  head = head.split('pricing.html').join(`${name}.html`).split('href="pricing.md"').join(`href="${name}.md"`);
  if (noindex) head = head.replace(/<link rel="alternate" type="text\/markdown"[^>]*>\n?/, '');   // a draft has no twin
  head = head.replace('</style>', CSS + LIVE_CSS + '</style>');
  const bodyStart = donor.indexOf('<body'), scriptAt = donor.indexOf('<script>', bodyStart);
  const donorBody = donor.slice(bodyStart, scriptAt);
  const hdr  = donorBody.match(/<header class="top">.*?<\/header>/s)[0];
  const foot = donorBody.match(/<footer class="foot">.*?<\/footer>/s)[0];
  const tail = donor.slice(scriptAt).replace('RM.data.currentPage="pricing"', `RM.data.currentPage="${name}"`);
  return head + '<body id="top">\n\n' + hdr + '\n\n' + body + '\n\n' + foot + '\n\n' + tail;
}

// ------------------------------------------------------------------ pieces
const riskRow = (r, cls) => `<div class="bc-risk ${cls}"><span class="ref">${esc(r.ref)}</span><div><b>${esc(r.statement)}</b><span>${esc(r.layer)} · ${(r.assigned_to || []).map((id) => esc(ROLE[id].label)).join(', ')}</span></div></div>`;

const changeTable = (base, list) => `<div class="bc-t ch" role="table">
      <div class="bc-tr" role="row"><span role="columnheader">The question</span><span role="columnheader">Without it</span><span role="columnheader">With it</span><span role="columnheader">How, and who holds it</span></div>
      ${list.map((c) => `<div class="bc-tr" role="row"><span role="cell">${esc(Q[c.q].text)}</span><span role="cell" data-k="Without it" class="bc-was">${esc(opt(c.q, base[c.q]))}</span><span role="cell" data-k="With it" class="bc-now">${esc(opt(c.q, c.to))}</span><span role="cell" data-k="How">${esc(CHANGE_KIND[c.kind])}, held by ${esc(c.holder || 'not stated')}.${c.why ? ' ' + txt(c.why) : ''}${c.basis ? ` <span class="bc-src">&ldquo;${esc(c.basis.quote)}&rdquo; · <a href="${esc(c.basis.url)}" target="_blank" rel="noopener">${esc(new URL(c.basis.url).hostname)}</a>, read ${esc(niceDate(c.basis.read))}</span>` : ''}</span></div>`).join('\n      ')}
    </div>`;

const altitudes = (res) => `<div class="bc-alt">${ALTITUDES.map((a) => `
      <div class="bc-a"><h3>${esc(a.label)}</h3><span class="why">${esc(a.note)}</span>${a.roles.map((id) => {
        const r = res.byRole.find((x) => x.role.id === id);
        const d = r.before.length - r.after.length;
        return `<div class="bc-role"><b>${esc(ROLE[id].label)}</b><span class="c">${r.before.length} → ${r.after.length}${d > 0 ? ` <span class="d">−${d}</span>` : d < 0 ? ` +${-d}` : ''}</span>${r.retired.length || r.added.length ? `<span class="refs">${r.retired.length ? 'retired ' + r.retired.join(', ') : ''}${r.retired.length && r.added.length ? ' · ' : ''}${r.added.length ? 'new ' + r.added.join(', ') : ''}</span>` : ''}</div>`;
      }).join('')}</div>`).join('')}
    </div>`;

const corporate = (res) => {
  const corp = M.risks.filter((r) => r.layer === 'corporate');
  const feeds = (set, ref) => M.risks.filter((x) => set.has(x.ref) && x.leads_to.some((l) => l.ref === ref)).length;
  return corp.filter((r) => res.before.has(r.ref) || res.afterRisks.has(r.ref)).map((r) =>
    `<div class="bc-risk${res.afterRisks.has(r.ref) ? '' : ' off'}"><span class="ref">${esc(r.ref)}</span><div><b>${esc(r.statement)}</b><span>${res.afterRisks.has(r.ref) ? 'still holds' : 'retired'} · risks leading into it: ${feeds(res.before, r.ref)} before, ${feeds(res.afterRisks, r.ref)} after</span></div></div>`).join('\n      ');
};

// ------------------------------------------------------------------ one page per case
// ------------------------------------------------------------------ the register, played live
// The same figure as the role-ownership article's blast radius, for a business case: the model's
// ten roles up to the board, every risk that holds for the stated deployment, and the product's
// changes as switches. The page carries the model and the engine, so switching a change recomputes
// the register in the browser exactly as the build computed it above. Every string reaches the
// page through textContent.
const liveModel = () => ({
  questions: M.questions.map((q) => ({ id: q.id, text: q.text, options: q.options.map((o) => [o[0], o[1]]) })),
  facts: Object.values(M.facts).map((f) => ({ id: f.id, subject: f.subject, predicate: f.predicate, object: f.object })),
  twins: Object.values(M.twins).map((t) => ({ id: t.id, label: t.label, exists_facts: t.exists_facts || null, presence_facts: t.presence_facts || null, depends_on: t.depends_on || null })),
  risks: M.risks.map((r) => ({ ref: r.ref, layer: r.layer, statement: r.statement, why: r.why || '', needs: r.needs || [], needs_any: r.needs_any || [], ceases_on: r.ceases_on || [], leads_to: (r.leads_to || []).map((l) => l.ref), assigned_to: r.assigned_to || [] })),
  roles: M.roles.map((r) => ({ id: r.id, label: r.label, reports_to: r.reports_to, lens: r.lens || '' }))
});
const jsonForScript = (o) => JSON.stringify(o).replace(/<\//g, '<\\/').replace(/<!--/g, '<\\!--');

function liveFigure(c) {
  const changes = [...c.changes.map((x) => ({ ...x, adds: false })), ...(c.adds || []).map((x) => ({ ...x, adds: true }))];
  const data = {
    product: c.product, baseline: c.base,
    changes: changes.map((x, i) => ({ id: 'c' + i, q: x.q, to: x.to, from: c.base[x.q], kind: x.kind, holder: x.holder || '', why: x.why || '', adds: x.adds }))
  };
  return `<section class="psection">
    <div class="wrap">
      <div class="shead">
        <span class="tag">05 · The register, played live</span>
        <h2>Switch its changes on, <span class="g">and watch the register move.</span></h2>
        <p>The same picture as <a href="article-risk-propagation-visualiser.html">the risk propagation visualiser</a>, drawn for this case. The model&rsquo;s ten roles up to the board; every risk that holds for the deployment above, placed with the roles the model assigns it to; and, at the bottom, each answer the product changes, as a switch. The page carries the model and the engine, so a switch recomputes the register here exactly as it was computed for the tables above. Red is a risk that holds; faded is one the product retired; amber is one it brought. Click a role, a risk, a change or the product to see only what it touches. Nothing is scored.</p>
      </div>
      <div class="bl-ctl">
        <div class="bl-ctl-g"><span class="bl-k">The product</span><div class="bl-btns"><button type="button" class="bl-btn" id="bl-b-all">With ${esc(c.product)}</button><button type="button" class="bl-btn ghost" id="bl-b-none">Without it</button></div></div>
        <div class="bl-ctl-g" id="bl-switches"><span class="bl-k">The answers it changes${(c.adds || []).length ? ', and what it adds' : ''}</span></div>
      </div>
      <div class="bl-status"><b id="bl-title"></b><span id="bl-note"></span></div>
      <div class="bl-scroll"><div id="bl-fig" class="bl-canvas"></div></div>
      <div class="bl-panel" id="bl-panel" aria-live="polite"></div>
      <div class="bl-counts" aria-label="The register, recomputed">
        <div><b id="bl-c-before">0</b><span>entries without it</span></div>
        <div><b id="bl-c-now">0</b><span>entries now</span></div>
        <div><b id="bl-c-retired">0</b><span>retired</span></div>
        <div><b id="bl-c-added">0</b><span>brought by it</span></div>
        <div><b id="bl-c-board">0</b><span>reasons the board is given</span></div>
      </div>
      <div class="bl-legend">
        <span><i class="bl-lg hold"></i> holds</span><span><i class="bl-lg gone"></i> retired by the product</span><span><i class="bl-lg new"></i> brought by the product</span><span><i class="bl-lg corp"></i> a corporate risk, at the board</span><span><i class="bl-lg badge">3</i> risks a role holds now</span><span><i class="bl-lg badge off">−2</i> risks it no longer holds</span><span><i class="bl-lg sw"></i> a change, on</span>
      </div>
      <div class="bl-list-wrap"><span class="bl-k">Every risk on the register now</span><div class="bl-list" id="bl-list"></div></div>
    </div>
  </section>
<script>
(function () {
'use strict';
var MODEL = ${jsonForScript(liveModel())};
var CASE = ${jsonForScript(data)};
${LIVE_SCRIPT}
})();
</script>`;
}

const LIVE_SCRIPT = String.raw`var NS = 'http://www.w3.org/2000/svg';
var REDUCED = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
function sv(tag, attrs, parent) { var n = document.createElementNS(NS, tag); if (attrs) Object.keys(attrs).forEach(function (k) { if (attrs[k] != null) n.setAttribute(k, attrs[k]); }); if (parent) parent.appendChild(n); return n; }
function stext(x, y, s, cls, parent, anchor) { var t = sv('text', { x: x, y: y, 'class': cls, 'text-anchor': anchor || 'middle' }, parent); t.textContent = s; return t; }
function ht(tag, cls, text, parent) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; if (parent) parent.appendChild(n); return n; }
function byId(id) { return document.getElementById(id); }
function clear(n) { while (n.firstChild) n.removeChild(n.firstChild); }
var host = byId('bl-fig'); if (!host) return;

/* ---- the engine, as the build ran it ---- */
var FACT = {}, TWIN = {}, RISK = {}, ROLE = {}, Q = {};
MODEL.facts.forEach(function (f) { FACT[f.id] = f; }); MODEL.twins.forEach(function (t) { TWIN[t.id] = t; });
MODEL.risks.forEach(function (r) { RISK[r.ref] = r; }); MODEL.roles.forEach(function (r) { ROLE[r.id] = r; }); MODEL.questions.forEach(function (q) { Q[q.id] = q; });
function inEstate(twinId, raw) { var tw = TWIN[twinId]; if (!tw) return true; if (tw.exists_facts && !tw.exists_facts.some(function (x) { return raw[x]; })) return false; return tw.depends_on ? inEstate(tw.depends_on, raw) : true; }
function factsFor(answers) {
  var raw = {}; MODEL.questions.forEach(function (q) { var i = answers[q.id]; if (i == null) return; q.options[i][1].forEach(function (f) { raw[f] = true; }); });
  var out = {};
  Object.keys(raw).forEach(function (id) { var f = FACT[id], tw = TWIN[f.subject]; if (tw && (tw.presence_facts || tw.exists_facts || []).indexOf(id) >= 0) { out[id] = true; return; } if (!inEstate(f.subject, raw) || !inEstate(f.object, raw)) return; out[id] = true; });
  return out;
}
function risksFor(facts) {
  var refs = {};
  MODEL.risks.forEach(function (r) { if (r.layer === 'corporate') return; if (!r.needs.every(function (f) { return facts[f]; })) return; if (r.needs_any.length && !r.needs_any.some(function (f) { return facts[f]; })) return; if (r.ceases_on.some(function (f) { return facts[f]; })) return; refs[r.ref] = true; });
  var grew = true;
  while (grew) { grew = false; MODEL.risks.forEach(function (r) { if (refs[r.ref] || r.layer !== 'corporate') return; if (MODEL.risks.some(function (x) { return refs[x.ref] && x.leads_to.indexOf(r.ref) >= 0; })) { refs[r.ref] = true; grew = true; } }); }
  return refs;
}
function chain(roleId) { var out = []; for (var r = ROLE[roleId]; r; r = r.reports_to ? ROLE[r.reports_to] : null) out.push(r.id); return out; }
function answersWith(on) { var a = {}; Object.keys(CASE.baseline).forEach(function (k) { a[k] = CASE.baseline[k]; }); CASE.changes.forEach(function (c) { if (on[c.id]) a[c.q] = c.to; }); return a; }
function factText(id) { var f = FACT[id]; if (!f) return id; var s = TWIN[f.subject] ? TWIN[f.subject].label : f.subject, o = TWIN[f.object] ? TWIN[f.object].label : f.object; return s + ' ' + f.predicate.replace(/-/g, ' ') + ' ' + o; }

/* ---- state ---- */
var on = {}; CASE.changes.forEach(function (c) { on[c.id] = true; });
var sel = null, hover = null;
var before = risksFor(factsFor(answersWith({})));
var allOn = {}; CASE.changes.forEach(function (c) { allOn[c.id] = true; });
var withAll = risksFor(factsFor(answersWith(allOn)));
var shown = MODEL.risks.filter(function (r) { return before[r.ref] || withAll[r.ref]; });
var oper = shown.filter(function (r) { return r.layer !== 'corporate'; }), corp = shown.filter(function (r) { return r.layer === 'corporate'; });

/* ---- layout ---- */
var POS = { 'RO-board': [500, 40], 'RO-ceo': [500, 112], 'RO-cto': [290, 190], 'RO-cpo': [560, 190], 'RO-cfo': [810, 190], 'RO-platform': [170, 268], 'RO-ciso': [400, 268], 'RO-service': [620, 268], 'RO-dpo': [810, 268], 'RO-sre': [170, 346] };
var CORP_Y = 428, RISK_Y = 516, CH_Y = 622, PROD_Y = 686, W = 1000;
function depth(id) { return chain(id).length; }
function homeRole(r) { var best = null; r.assigned_to.forEach(function (id) { if (!POS[id]) return; if (!best || depth(id) > depth(best)) best = id; }); return best || 'RO-board'; }
oper.sort(function (a, b) { var pa = POS[homeRole(a)], pb = POS[homeRole(b)]; return (pa[0] - pb[0]) || (pb[1] - pa[1]) || (parseInt(a.ref.replace(/\D/g, ''), 10) - parseInt(b.ref.replace(/\D/g, ''), 10)); });
function spread(list, y, x0, x1) { var n = list.length, out = {}; list.forEach(function (r, i) { out[r.ref] = [n === 1 ? (x0 + x1) / 2 : x0 + (x1 - x0) * i / (n - 1), y]; }); return out; }
var RP = spread(oper, RISK_Y, 60, 940); var CP = spread(corp, CORP_Y, 140, 860);
var nCh = CASE.changes.length, chW = Math.min(180, (W - 150 - 12 * (nCh - 1)) / nCh); // the band label needs the left edge
var CHP = {}; CASE.changes.forEach(function (c, i) { var total = nCh * chW + 12 * (nCh - 1); CHP[c.id] = [130 + (W - 140 - total) / 2 + i * (chW + 12) + chW / 2, CH_Y]; });
function short(s, n) { return s.length > n ? s.slice(0, n - 1).replace(/\s+\S*$/, '') + '…' : s; }

/* ---- draw once ---- */
var svg = sv('svg', { viewBox: '0 0 ' + W + ' 720', 'class': 'bl-svg', role: 'img', 'aria-label': 'The register for this case, as a picture: the product at the bottom, its changes, the risks, and the roles up to the board' }, host);
var gHalo = sv('g', null, svg), gChart = sv('g', null, svg), gEdges = sv('g', null, svg), gNodes = sv('g', null, svg);
[['BOARD', 40], ['ROLES', 190], ['CORPORATE', CORP_Y], ['RISKS', RISK_Y], ['CHANGES', CH_Y], ['THE PRODUCT', PROD_Y]].forEach(function (b) { stext(12, b[1] + 4, b[0], 'bl-band', gChart, 'start'); });
var orgE = {}, halo = {}, roleG = {}, badge = {}, badgeT = {};
MODEL.roles.forEach(function (r) { if (r.reports_to && POS[r.id] && POS[r.reports_to]) orgE[r.id] = sv('line', { x1: POS[r.id][0], y1: POS[r.id][1] - 14, x2: POS[r.reports_to][0], y2: POS[r.reports_to][1] + 14, 'class': 'bl-org' }, gChart); });
function wire(g, type, id) {
  g.addEventListener('click', function (e) { e.stopPropagation(); sel = (sel && sel.type === type && sel.id === id) ? null : { type: type, id: id }; hover = null; paint(); });
  g.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); g.dispatchEvent(new Event('click')); } });
  var pv = function () { if (!sel) { hover = { type: type, id: id }; showPanel(); } };
  g.addEventListener('mouseenter', pv); g.addEventListener('focus', pv);
}
svg.addEventListener('click', function () { if (sel) { sel = null; paint(); } });
MODEL.roles.forEach(function (r) {
  var p = POS[r.id]; if (!p) return;
  halo[r.id] = sv('circle', { cx: p[0], cy: p[1], r: 30, 'class': 'bl-halo' }, gHalo);
  var g = sv('g', { 'class': 'bl-role', tabindex: '0', role: 'button', 'aria-label': r.label }, gNodes);
  sv('rect', { x: p[0] - 64, y: p[1] - 14, width: 128, height: 28, rx: 14 }, g);
  stext(p[0], p[1] + 4, short(r.label, 24), 'bl-role-t', g);
  badge[r.id] = {}; badgeT[r.id] = {};
  [['hot', 0], ['off', 22]].forEach(function (k) { var bg = sv('g', { 'class': 'bl-badge ' + k[0] + ' hidden', transform: 'translate(' + k[1] + ' 0)' }, g); sv('circle', { cx: p[0] + 62, cy: p[1] - 12, r: 10 }, bg); badge[r.id][k[0]] = bg; badgeT[r.id][k[0]] = stext(p[0] + 62, p[1] - 8.5, '', 'bl-badge-t', bg); });
  wire(g, 'role', r.id); roleG[r.id] = g;
});
var prod = sv('g', { 'class': 'bl-prod', tabindex: '0', role: 'button', 'aria-label': CASE.product }, gNodes);
sv('rect', { x: 500 - 90, y: PROD_Y - 16, width: 180, height: 32, rx: 8 }, prod); stext(500, PROD_Y + 5, short(CASE.product, 26), 'bl-prod-t', prod); wire(prod, 'product', 'product');
var chG = {}, chE = {}, riskG = {}, riskE = {}, chRiskE = {}, corpE = {};
CASE.changes.forEach(function (c) {
  var p = CHP[c.id]; chE[c.id] = sv('line', { x1: 500, y1: PROD_Y - 16, x2: p[0], y2: p[1] + 18, 'class': 'bl-e bl-e-prod' }, gEdges);
  var g = sv('g', { 'class': 'bl-ch', tabindex: '0', role: 'button', 'aria-label': Q[c.q].text }, gNodes);
  sv('rect', { x: p[0] - chW / 2, y: p[1] - 18, width: chW, height: 36, rx: 8 }, g);
  stext(p[0], p[1] - 3, short(c.q + ' · ' + Q[c.q].options[c.to][0], Math.floor(chW / 6.2)), 'bl-ch-t', g);
  stext(p[0], p[1] + 11, c.kind === 'states' ? 'states the answer' : c.kind === 'expectation' ? 'an expectation' : c.kind === 'setting' ? 'a setting' : 'a boundary', 'bl-ch-k', g);
  wire(g, 'change', c.id); chG[c.id] = g;
});
shown.forEach(function (r) {
  var p = r.layer === 'corporate' ? CP[r.ref] : RP[r.ref];
  riskE[r.ref] = {}; r.assigned_to.forEach(function (id) { if (POS[id]) riskE[r.ref][id] = sv('line', { x1: p[0], y1: p[1] - 12, x2: POS[id][0], y2: POS[id][1] + 14, 'class': 'bl-e bl-e-held' }, gEdges); });
  if (r.layer !== 'corporate') { chRiskE[r.ref] = {}; CASE.changes.forEach(function (c) { chRiskE[r.ref][c.id] = sv('line', { x1: CHP[c.id][0], y1: CH_Y - 18, x2: p[0], y2: p[1] + 12, 'class': 'bl-e bl-e-ch' }, gEdges); });
    corpE[r.ref] = {}; r.leads_to.forEach(function (ref) { if (CP[ref]) corpE[r.ref][ref] = sv('line', { x1: p[0], y1: p[1] - 12, x2: CP[ref][0], y2: CP[ref][1] + 12, 'class': 'bl-e bl-e-corp' }, gEdges); }); }
  var g = sv('g', { 'class': 'bl-risk', tabindex: '0', role: 'button', 'aria-label': r.ref + ': ' + r.statement, transform: 'translate(' + p[0] + ' ' + p[1] + ')' }, gNodes);
  sv('circle', { r: r.layer === 'corporate' ? 13 : 11, 'class': 'bl-risk-core' }, g);
  stext(0, 3.5, r.ref.replace('RISK-', '').replace('CORP-', 'C'), 'bl-risk-t', g);
  wire(g, 'risk', r.ref); riskG[r.ref] = g;
});

/* ---- the switches ---- */
var swHost = byId('bl-switches');
CASE.changes.forEach(function (c) {
  var l = ht('label', 'bl-sw' + (c.adds ? ' adds' : ''), null, swHost), i = ht('input', null, null, l); i.type = 'checkbox'; i.checked = true; i.id = 'bl-t-' + c.id;
  l.appendChild(document.createTextNode(' ' + Q[c.q].text + ' '));
  ht('em', null, Q[c.q].options[c.from][0] + ' → ' + Q[c.q].options[c.to][0], l);
  i.addEventListener('change', function () { on[c.id] = i.checked; sel = null; paint(); });
});
byId('bl-b-all').addEventListener('click', function () { CASE.changes.forEach(function (c) { on[c.id] = true; }); sel = null; paint(); });
byId('bl-b-none').addEventListener('click', function () { CASE.changes.forEach(function (c) { on[c.id] = false; }); sel = null; paint(); });

/* ---- compute and paint ---- */
var cur = {}, marg = {};
function compute() {
  cur = risksFor(factsFor(answersWith(on)));
  // what each switch that is on does at the margin: the risks it retires or brings, given the others
  marg = {};
  CASE.changes.forEach(function (c) { if (!on[c.id]) { marg[c.id] = { retires: {}, brings: {} }; return; } var off = {}; Object.keys(on).forEach(function (k) { off[k] = on[k]; }); off[c.id] = false; var without = risksFor(factsFor(answersWith(off))); var m = { retires: {}, brings: {} }; Object.keys(without).forEach(function (ref) { if (!cur[ref]) m.retires[ref] = true; }); Object.keys(cur).forEach(function (ref) { if (!without[ref]) m.brings[ref] = true; }); marg[c.id] = m; });
}
function state(ref) { if (cur[ref]) return before[ref] ? 'hold' : 'new'; return before[ref] ? 'gone' : 'absent'; }
function loads() {
  var L = {}; MODEL.roles.forEach(function (r) { L[r.id] = { holds: [], gone: [], carries: [] }; });
  shown.forEach(function (r) { var s = state(r.ref); r.assigned_to.forEach(function (id) { if (!L[id]) return; if (s === 'hold' || s === 'new') L[id].holds.push(r.ref); else if (s === 'gone') L[id].gone.push(r.ref); }); });
  shown.forEach(function (r) { var s = state(r.ref); if (s !== 'hold' && s !== 'new') return; var touched = {}; r.assigned_to.forEach(function (id) { chain(id).forEach(function (x) { touched[x] = true; }); }); Object.keys(touched).forEach(function (id) { if (L[id] && r.assigned_to.indexOf(id) < 0 && L[id].carries.indexOf(r.ref) < 0) L[id].carries.push(r.ref); }); });
  return L;
}
/* the walk goes one way per hop: product → changes → risks → roles up; role → risks it holds → changes that touch them */
function focusSet() {
  if (!sel) return null;
  var F = { roles: {}, risks: {}, changes: {}, product: false };
  function riskUp(ref) { F.risks[ref] = true; var r = RISK[ref]; r.assigned_to.forEach(function (id) { chain(id).forEach(function (x) { F.roles[x] = true; }); }); r.leads_to.forEach(function (c2) { if (cur[c2] || before[c2]) { F.risks[c2] = true; RISK[c2].assigned_to.forEach(function (id) { chain(id).forEach(function (x) { F.roles[x] = true; }); }); } }); }
  function riskDown(ref) { F.risks[ref] = true; CASE.changes.forEach(function (c) { if (marg[c.id].retires[ref] || marg[c.id].brings[ref]) { F.changes[c.id] = true; F.product = true; } }); }
  if (sel.type === 'product') { F.product = true; CASE.changes.forEach(function (c) { if (on[c.id]) { F.changes[c.id] = true; Object.keys(marg[c.id].retires).concat(Object.keys(marg[c.id].brings)).forEach(riskUp); } }); }
  else if (sel.type === 'change') { F.product = true; F.changes[sel.id] = true; Object.keys(marg[sel.id].retires).concat(Object.keys(marg[sel.id].brings)).forEach(riskUp); }
  else if (sel.type === 'risk') { riskUp(sel.id); riskDown(sel.id); var r = RISK[sel.id]; if (r.layer === 'corporate') shown.forEach(function (x) { if (x.leads_to.indexOf(sel.id) >= 0 && (cur[x.ref] || before[x.ref])) { F.risks[x.ref] = true; riskDown(x.ref); } }); }
  else if (sel.type === 'role') { chain(sel.id).forEach(function (x) { F.roles[x] = true; }); shown.forEach(function (r) { var s = state(r.ref); if (s === 'absent') return; var reaches = r.assigned_to.some(function (id) { return chain(id).indexOf(sel.id) >= 0; }); if (reaches) { F.risks[r.ref] = true; r.assigned_to.forEach(function (id) { chain(id).forEach(function (x) { F.roles[x] = true; }); }); riskDown(r.ref); } }); }
  return F;
}
function cls(el, base, extra) { el.setAttribute('class', base + (extra ? ' ' + extra : '')); }
var panel = byId('bl-panel'), list = byId('bl-list');
function showPanel() {
  clear(panel); var v = sel || hover; if (!v) return;
  var ul, li;
  if (v.type === 'risk') { var r = RISK[v.id], s = state(v.id);
    ht('b', null, r.ref + ' · ' + r.statement, panel); ht('span', 'bl-v', ' ' + (s === 'hold' ? 'Holds, with and without the product.' : s === 'new' ? 'Brought by the product: it holds only with the changes on.' : s === 'gone' ? 'Retired by the product.' : 'Does not hold for this deployment.'), panel);
    ul = ht('ul', null, null, panel);
    if (r.why) { li = ht('li', null, null, ul); ht('b', null, 'Why it is on the register: ', li); li.appendChild(document.createTextNode(r.why)); }
    if (r.layer === 'corporate') { li = ht('li', null, null, ul); ht('b', null, 'A corporate risk: ', li); li.appendChild(document.createTextNode('no facts of its own; it holds while any risk that leads into it holds. Leading in now: ' + (shown.filter(function (x) { return x.leads_to.indexOf(r.ref) >= 0 && cur[x.ref]; }).map(function (x) { return x.ref; }).join(', ') || 'none') + '.')); }
    else { li = ht('li', null, null, ul); ht('b', null, 'Established by: ', li); li.appendChild(document.createTextNode((r.needs.map(factText).concat(r.needs_any.length ? ['any of: ' + r.needs_any.map(factText).join(' / ')] : []).join('; ') || 'nothing in particular') + '.'));
      li = ht('li', null, null, ul); ht('b', null, 'Ends when: ', li); li.appendChild(document.createTextNode(r.ceases_on.length ? r.ceases_on.map(factText).join('; ') + '.' : 'no fact in the model ends it; only its needs going away.'));
      var touch = CASE.changes.filter(function (c) { return marg[c.id].retires[r.ref] || marg[c.id].brings[r.ref]; }); li = ht('li', null, null, ul); ht('b', null, 'Changed by: ', li); li.appendChild(document.createTextNode(touch.length ? touch.map(function (c) { return Q[c.q].text + ' → ' + Q[c.q].options[c.to][0] + (marg[c.id].retires[r.ref] ? ' (retires it)' : ' (brings it)'); }).join('; ') : 'none of the product’s changes, as switched.')); }
    li = ht('li', null, null, ul); ht('b', null, 'Assigned to: ', li); li.appendChild(document.createTextNode(r.assigned_to.map(function (id) { return ROLE[id] ? ROLE[id].label : id; }).join(', ') + '.'));
  } else if (v.type === 'role') { var ro = ROLE[v.id], L = loads()[v.id];
    ht('b', null, ro.label, panel); if (ro.lens) ht('span', 'bl-v', ' Lens: ' + ro.lens + '.', panel);
    ul = ht('ul', null, null, panel);
    [['Holds now:', L.holds], ['No longer holds, with the product:', L.gone], ['Carries from below:', L.carries]].forEach(function (x) { li = ht('li', null, null, ul); ht('b', null, x[0] + ' ', li); li.appendChild(document.createTextNode(x[1].length ? x[1].map(function (ref) { return ref + ' ' + short(RISK[ref].statement, 60); }).join(' · ') : 'nothing')); });
  } else if (v.type === 'change') { var c = CASE.changes.filter(function (x) { return x.id === v.id; })[0];
    ht('b', null, Q[c.q].text, panel); ht('span', 'bl-v', ' ' + Q[c.q].options[c.from][0] + ' → ' + Q[c.q].options[c.to][0] + '. ' + (c.kind === 'states' ? 'It states the answer.' : c.kind === 'expectation' ? 'An expectation: the agent is asked, and nothing enforces it.' : c.kind === 'setting' ? 'A setting: a switch somebody holds.' : 'A boundary: enforced by something the agent’s grant does not include.') + (c.holder ? ' Held by ' + c.holder + '.' : ''), panel);
    ul = ht('ul', null, null, panel);
    if (c.why) { li = ht('li', null, null, ul); ht('b', null, 'How, and how far: ', li); li.appendChild(document.createTextNode(c.why)); }
    li = ht('li', null, null, ul); ht('b', null, (on[c.id] ? 'Retires, as switched: ' : 'Switched off. Would retire: '), li); var rt = Object.keys(marg[c.id].retires); if (!on[c.id]) { var only = {}; only[c.id] = true; var alone = risksFor(factsFor(answersWith(only))); rt = Object.keys(before).filter(function (ref) { return !alone[ref]; }); } li.appendChild(document.createTextNode(rt.length ? rt.join(', ') : 'nothing on its own'));
    var br = Object.keys(marg[c.id].brings); if (br.length) { li = ht('li', null, null, ul); ht('b', null, 'Brings: ', li); li.appendChild(document.createTextNode(br.join(', '))); }
  } else { ht('b', null, CASE.product, panel); ht('span', 'bl-v', ' ' + CASE.changes.filter(function (c) { return on[c.id]; }).length + ' of ' + CASE.changes.length + ' changes on. Retired: ' + Object.keys(before).filter(function (ref) { return !cur[ref]; }).length + '. Brought: ' + Object.keys(cur).filter(function (ref) { return !before[ref]; }).length + '. Click a change to see what it alone does.', panel); }
  if (sel) ht('p', 'bl-hint', 'Selected. Click it again, or the background, to see everything.', panel);
}
function showList(F) {
  clear(list);
  var rows = shown.filter(function (r) { return cur[r.ref]; });
  if (!rows.length) { ht('p', 'bl-empty', 'Nothing on the register: every risk’s facts have gone.', list); return; }
  var head = ht('div', 'bl-lr head', null, list); ['Risk', 'State', 'Assigned to', 'Layer'].forEach(function (h) { ht('span', null, h, head); });
  rows.forEach(function (r) { var s = state(r.ref), row = ht('div', 'bl-lr s-' + s + (F && !F.risks[r.ref] ? ' dim' : ''), null, list); ht('span', 'k', r.ref + ' · ' + r.statement, row); ht('span', null, s === 'new' ? 'brought by the product' : 'holds', row); ht('span', null, r.assigned_to.map(function (id) { return ROLE[id] ? ROLE[id].label : id; }).join(', '), row); ht('span', 'mono', r.layer, row); });
}
function paint() {
  compute();
  var F = focusSet(), L = loads();
  var nOn = CASE.changes.filter(function (c) { return on[c.id]; }).length;
  byId('bl-title').textContent = nOn === 0 ? 'Without ' + CASE.product + '.' : nOn === CASE.changes.length ? 'With ' + CASE.product + ': every change on.' : nOn + ' of ' + CASE.changes.length + ' changes on.';
  byId('bl-note').textContent = ' ' + Object.keys(cur).length + ' entries on the register; ' + Object.keys(before).filter(function (ref) { return !cur[ref]; }).length + ' retired, ' + Object.keys(cur).filter(function (ref) { return !before[ref]; }).length + ' brought.';
  CASE.changes.forEach(function (c) { var e = byId('bl-t-' + c.id); if (e) e.checked = !!on[c.id]; cls(chG[c.id], 'bl-ch', (on[c.id] ? 'on' : 'off') + (F && !F.changes[c.id] ? ' dim' : '') + (sel && sel.type === 'change' && sel.id === c.id ? ' sel' : '')); cls(chE[c.id], 'bl-e bl-e-prod', (on[c.id] ? 'on' : '') + (F && !(F.changes[c.id] && F.product) ? ' dim' : '')); });
  cls(prod, 'bl-prod', (nOn ? 'on' : '') + (F && !F.product ? ' dim' : '') + (sel && sel.type === 'product' ? ' sel' : ''));
  shown.forEach(function (r) {
    var s = state(r.ref), d = F && !F.risks[r.ref];
    cls(riskG[r.ref], 'bl-risk s-' + s, (r.layer === 'corporate' ? 'corp' : '') + (d ? ' dim' : '') + (sel && sel.type === 'risk' && sel.id === r.ref ? ' sel' : ''));
    Object.keys(riskE[r.ref]).forEach(function (id) { cls(riskE[r.ref][id], 'bl-e bl-e-held', (s === 'hold' || s === 'new' ? 'on s-' + s : s === 'gone' ? 'gone' : '') + (F && !(F.risks[r.ref] && F.roles[id]) ? ' dim' : '')); });
    if (chRiskE[r.ref]) Object.keys(chRiskE[r.ref]).forEach(function (cid) { var m = marg[cid]; cls(chRiskE[r.ref][cid], 'bl-e bl-e-ch', (m.retires[r.ref] ? 'retires' : m.brings[r.ref] ? 'brings' : '') + (F && !(F.risks[r.ref] && F.changes[cid]) ? ' dim' : '')); });
    if (corpE[r.ref]) Object.keys(corpE[r.ref]).forEach(function (ref) { cls(corpE[r.ref][ref], 'bl-e bl-e-corp', (cur[r.ref] && cur[ref] ? 'on' : '') + (F && !(F.risks[r.ref] && F.risks[ref]) ? ' dim' : '')); });
  });
  MODEL.roles.forEach(function (r) { if (!POS[r.id]) return; var l = L[r.id], d = F && !F.roles[r.id];
    cls(halo[r.id], 'bl-halo', (l.holds.length ? 'hot' : l.carries.length ? 'carries' : l.gone.length ? 'cleared' : '') + (d ? ' dim' : ''));
    cls(roleG[r.id], 'bl-role', (d ? 'dim' : '') + (sel && sel.type === 'role' && sel.id === r.id ? ' sel' : ''));
    if (orgE[r.id]) cls(orgE[r.id], 'bl-org', ((l.holds.length || l.carries.length) ? 'on' : '') + (F && !(F.roles[r.id] && F.roles[r.reports_to]) ? ' dim' : ''));
    cls(badge[r.id].hot, 'bl-badge hot', (l.holds.length ? '' : 'hidden') + (d ? ' dim' : '')); badgeT[r.id].hot.textContent = l.holds.length ? String(l.holds.length) : '';
    cls(badge[r.id].off, 'bl-badge off', (l.gone.length ? '' : 'hidden') + (d ? ' dim' : '')); badgeT[r.id].off.textContent = l.gone.length ? '−' + l.gone.length : '';
    badge[r.id].off.setAttribute('transform', l.holds.length ? 'translate(22 0)' : '');
  });
  byId('bl-c-before').textContent = String(Object.keys(before).length); byId('bl-c-now').textContent = String(Object.keys(cur).length);
  byId('bl-c-retired').textContent = String(Object.keys(before).filter(function (ref) { return !cur[ref]; }).length); byId('bl-c-added').textContent = String(Object.keys(cur).filter(function (ref) { return !before[ref]; }).length);
  byId('bl-c-board').textContent = String(shown.filter(function (r) { return cur[r.ref] && r.assigned_to.indexOf('RO-board') >= 0; }).length);
  showPanel(); showList(F);
}
paint();`;

const LIVE_CSS = `
/* the register, played live */
:root{--bl-hot:rgba(192,57,43,.16);--bl-warm:rgba(26,127,90,.16);--bl-faint:rgba(26,25,23,.07);--bl-red-soft:#E8C4BE;--bl-gold-soft:#F3DDB5;--bl-green-soft:#BFE3D3}
.bl-ctl{display:grid;grid-template-columns:.7fr 1.6fr;gap:14px 18px;margin-top:22px}
.bl-ctl-g{display:flex;flex-direction:column;gap:6px}
.bl-k{font-family:var(--mono);font-size:10.5px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--faint);margin-bottom:2px}
.bl-btns{display:flex;flex-wrap:wrap;gap:6px}
.bl-btn{font-family:var(--sans);font-size:13px;font-weight:600;padding:8px 13px;border-radius:var(--r-sm);border:1px solid var(--green);background:var(--green);color:var(--card);cursor:pointer}
.bl-btn.ghost{background:transparent;color:var(--text);border-color:var(--border)}.bl-btn.ghost:hover{border-color:var(--green);color:var(--green)}
.bl-sw{font-size:13.5px;line-height:1.45;color:var(--text);display:flex;gap:8px;align-items:flex-start;cursor:pointer}
.bl-sw input{margin:3px 0 0;accent-color:var(--green);flex:none}.bl-sw em{color:var(--muted);font-style:normal;font-family:var(--mono);font-size:11.5px}
.bl-sw.adds{color:var(--gold)}
.bl-status{margin-top:16px;padding:12px 14px;border-radius:var(--r-sm);background:var(--bg2);font-size:14px;line-height:1.6;color:var(--muted)}
.bl-status b{color:var(--text)}
.bl-scroll{overflow-x:auto;margin-top:18px;-webkit-overflow-scrolling:touch}.bl-canvas{min-width:760px}.bl-canvas svg{aspect-ratio:1000/720}
.bl-svg{width:100%;height:auto;display:block;font-family:var(--sans)}
.bl-band{font-family:var(--mono);font-size:9.5px;font-weight:700;letter-spacing:.12em;fill:var(--faint)}
.bl-org{stroke:var(--border);stroke-width:1.5;transition:opacity .35s}.bl-org.on{stroke:var(--red);stroke-width:2;opacity:.7}.bl-org.dim{opacity:.2}
.bl-halo{fill:transparent;transition:fill .5s,opacity .35s}.bl-halo.hot{fill:var(--bl-hot);r:42}.bl-halo.carries{fill:var(--bl-hot);r:34;opacity:.55}.bl-halo.cleared{fill:var(--bl-warm)}.bl-halo.dim{opacity:.12}
.bl-role{cursor:pointer;outline:none;transition:opacity .35s}.bl-role rect{fill:var(--card);stroke:var(--border);stroke-width:1.4}.bl-role:hover rect,.bl-role:focus rect{stroke:var(--green)}.bl-role.sel rect{stroke:var(--text);stroke-width:2.6}.bl-role.dim{opacity:.22}
.bl-role-t{font-size:12px;font-weight:600;fill:var(--text)}
.bl-badge circle{fill:var(--red)}.bl-badge.off circle{fill:var(--faint)}.bl-badge.hidden{display:none}.bl-badge.dim{opacity:.2}.bl-badge-t{font-family:var(--mono);font-size:10px;font-weight:700;fill:var(--card)}
.bl-prod{cursor:pointer;outline:none;transition:opacity .35s}.bl-prod rect{fill:var(--bg2);stroke:var(--border);stroke-width:1.4}.bl-prod.on rect{fill:var(--greenBg);stroke:var(--green)}.bl-prod.sel rect{stroke:var(--text);stroke-width:2.6}.bl-prod.dim{opacity:.3}
.bl-prod-t{font-size:12.5px;font-weight:700;fill:var(--text)}
.bl-ch{cursor:pointer;outline:none;transition:opacity .35s}.bl-ch rect{fill:var(--card);stroke:var(--border);stroke-width:1.4;transition:fill .3s,stroke .3s}.bl-ch.on rect{fill:var(--greenBg);stroke:var(--green)}.bl-ch.sel rect{stroke:var(--text);stroke-width:2.6}.bl-ch.dim{opacity:.22}
.bl-ch-t{font-size:10.5px;font-weight:600;fill:var(--text)}.bl-ch-k{font-family:var(--mono);font-size:9px;fill:var(--faint)}.bl-ch.off .bl-ch-t{fill:var(--faint)}
.bl-e{fill:none;stroke-width:1.4;transition:opacity .45s;opacity:0}
.bl-e-prod{stroke:var(--green)}.bl-e-prod.on{opacity:.45}
.bl-e-held{stroke:var(--red);stroke-width:1.6}.bl-e-held.on{opacity:.55}.bl-e-held.on.s-new{stroke:var(--gold)}.bl-e-held.gone{opacity:.12;stroke-dasharray:3 3}
.bl-e-ch{stroke:var(--green);stroke-dasharray:4 3}.bl-e-ch.retires{opacity:.5}.bl-e-ch.brings{opacity:.5;stroke:var(--gold)}
.bl-e-corp{stroke:var(--faint)}.bl-e-corp.on{opacity:.45}
.bl-e.dim{opacity:.04}
.bl-risk{cursor:pointer;outline:none;transition:opacity .45s}.bl-risk-core{fill:var(--card);stroke:var(--faint);stroke-width:2}
.bl-risk.s-hold .bl-risk-core{fill:var(--bl-red-soft);stroke:var(--red)}.bl-risk.s-new .bl-risk-core{fill:var(--bl-gold-soft);stroke:var(--gold)}
.bl-risk.s-gone{opacity:.28}.bl-risk.s-gone .bl-risk-core{fill:var(--bg2);stroke:var(--faint);stroke-dasharray:2 2}.bl-risk.s-absent{opacity:0;pointer-events:none}
.bl-risk.corp .bl-risk-core{stroke-width:2.5}.bl-risk.sel .bl-risk-core{stroke:var(--text);stroke-width:3}.bl-risk.dim:not(.s-absent){opacity:.1}
.bl-risk-t{font-family:var(--mono);font-size:9.5px;font-weight:700;fill:var(--text)}
.bl-panel{margin-top:10px;font-size:13.5px;line-height:1.6;color:var(--muted);min-height:1.6em}.bl-panel b{color:var(--text)}.bl-panel .bl-v{font-style:italic}.bl-panel ul{margin:6px 0 0;padding-left:18px}.bl-hint{margin-top:6px;font-size:12px;color:var(--faint)}
.bl-counts{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:12px;margin-top:14px}
.bl-counts>div{border:1px solid var(--border);border-radius:var(--r);background:var(--card);padding:10px 12px}.bl-counts b{display:block;font-size:22px;font-weight:800;letter-spacing:-.03em;color:var(--text);line-height:1.1}.bl-counts span{display:block;font-size:11.5px;line-height:1.5;color:var(--muted);margin-top:4px}
.bl-legend{display:flex;flex-wrap:wrap;gap:6px 18px;margin-top:14px;font-size:12.5px;color:var(--muted)}.bl-legend span{display:inline-flex;align-items:center;gap:7px}
.bl-lg{display:inline-block;width:14px;height:14px;border-radius:50%;border:2px solid var(--border);background:var(--card);flex:none}
.bl-lg.hold{background:var(--bl-red-soft);border-color:var(--red)}.bl-lg.gone{border-color:var(--faint);border-style:dashed;opacity:.6}.bl-lg.new{background:var(--bl-gold-soft);border-color:var(--gold)}.bl-lg.corp{border-color:var(--red);border-width:3px}
.bl-lg.badge{background:var(--red);border-color:var(--red);color:var(--card);font-family:var(--mono);font-size:9px;font-weight:700;font-style:normal;display:inline-grid;place-items:center;width:18px;height:16px;border-radius:999px}.bl-lg.badge.off{background:var(--faint);border-color:var(--faint)}
.bl-lg.sw{border-radius:4px;background:var(--greenBg);border-color:var(--green)}
.bl-list-wrap{margin-top:16px}.bl-list{margin-top:8px;border:1px solid var(--border);border-radius:var(--r-sm);overflow:hidden;background:var(--card)}
.bl-lr{display:grid;grid-template-columns:minmax(0,2.2fr) minmax(0,.8fr) minmax(0,1.4fr) minmax(0,.6fr);border-top:1px solid var(--border)}.bl-lr:first-child{border-top:0}.bl-lr.head{background:var(--bg2)}
.bl-lr>span{padding:8px 10px;font-size:12.5px;line-height:1.5;color:var(--muted)}.bl-lr>span+span{border-left:1px solid var(--border)}
.bl-lr.head>span{font-family:var(--mono);font-size:9.5px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--text)}
.bl-lr .k{color:var(--text);font-weight:600}.bl-lr .mono{font-family:var(--mono);font-size:11px}.bl-lr.s-new .k{color:var(--gold)}.bl-lr.dim{opacity:.35}.bl-empty{padding:10px 12px;font-size:13px;color:var(--muted)}
@media (max-width:900px){.bl-ctl{grid-template-columns:1fr}.bl-counts{grid-template-columns:repeat(3,minmax(0,1fr))}.bl-lr{grid-template-columns:1fr 1fr}.bl-lr.head{display:none}.bl-lr>span:first-child{grid-column:1 / -1}.bl-lr>span:nth-child(2){border-left:0}.bl-lr>span:nth-child(n+4){border-top:1px dashed var(--border)}.bl-lr>span:nth-child(4){border-left:0}}
@media (max-width:640px){.bl-counts{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (prefers-reduced-motion:reduce){.bl-org,.bl-halo,.bl-role,.bl-prod,.bl-ch,.bl-e,.bl-risk{transition:none}}
`;

// A buyer's figure: numbered steps left to right, then who reads what. Drawn from the case's data;
// every string goes through esc, and the widths come from the count of steps.
function flowFigure(f) {
  const n = f.steps.length, W = 1000, pad = 20, gap = 14, bw = (W - pad * 2 - gap * (n - 1)) / n, bh = 200, y0 = 54;
  const wrap = (t, max) => { const words = String(t).split(' '), lines = []; let cur = ''; for (const w of words) { if ((cur + ' ' + w).trim().length > max) { lines.push(cur.trim()); cur = w; } else cur += ' ' + w; } if (cur.trim()) lines.push(cur.trim()); return lines; };
  const steps = f.steps.map((st, i) => {
    const x = pad + i * (bw + gap), tl = wrap(st.t, Math.floor((bw - 28) / 8.2)).slice(0, 2), lines = wrap(st.d, Math.floor((bw - 28) / 5.9)), dy = y0 + 50 + (tl.length - 1) * 17;
    return `<g><rect x="${x}" y="${y0}" width="${bw}" height="${bh}" rx="10" class="bcf-box"/>
      <text x="${x + 14}" y="${y0 + 24}" class="bcf-k">${esc(st.k)}</text>
      ${tl.map((l, j) => `<text x="${x + 14}" y="${y0 + 46 + j * 17}" class="bcf-t">${esc(l)}</text>`).join('')}
      ${lines.slice(0, 8).map((l, j) => `<text x="${x + 14}" y="${dy + 16 + j * 14}" class="bcf-d">${esc(l)}</text>`).join('')}
      ${i < n - 1 ? `<path d="M${x + bw + 2} ${y0 + bh / 2} l${gap - 4} 0" class="bcf-arrow" marker-end="url(#bcf-m)"/>` : ''}</g>`;
  }).join('\n    ');
  const ry = y0 + bh + 34, rn = f.readers.length, rw = (W - pad * 2 - gap * (rn - 1)) / rn;
  const readers = f.readers.map((r, i) => {
    const x = pad + i * (rw + gap), lines = wrap(r.gets, Math.floor((rw - 28) / 5.9));
    return `<g><rect x="${x}" y="${ry}" width="${rw}" height="${104}" rx="10" class="bcf-reader"/>
      <text x="${x + 14}" y="${ry + 24}" class="bcf-who">${esc(r.who)}</text>
      ${lines.slice(0, 5).map((l, j) => `<text x="${x + 14}" y="${ry + 44 + j * 14}" class="bcf-d">${esc(l)}</text>`).join('')}</g>`;
  }).join('\n    ');
  const H = ry + 104 + 20;
  return `<figure class="bcf"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(f.title)}"><defs><marker id="bcf-m" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 z" class="bcf-mk"/></marker></defs>
    <text x="${pad}" y="28" class="bcf-title">${esc(f.title)}</text>
    ${steps}
    <text x="${pad}" y="${ry - 12}" class="bcf-k">WHO READS IT</text>
    ${readers}
  </svg><figcaption>Drawn from the product&rsquo;s own pages, read on the date at the top of this case. Nothing was run.</figcaption></figure>`;
}

function casePage(c) {
  const R = c.result;
  const name = `business-case-${c.slug}`;
  const title = `RiskMandate — the business case for ${c.product}`;
  const desc = `${c.product}${c.vendor ? ` (${c.vendor})` : ''}, by the risk it changes: the register for a stated agent deployment without it and with it, computed from a public model, from the operator to the board.`;
  const body = `<main class="phero">
  <div class="wrap">
    <span class="eyebrow"><span class="d"></span> The business case · ${esc(c.category)}</span>
    <h1>${esc(c.title)}</h1>
    <p class="sub" style="margin-bottom:20px">${txt(c.summary)}</p>
    ${c.disclosure ? `<p class="bc-meta"><b>Disclosure:</b> ${txt(c.disclosure)}</p>` : ''}
    ${c.licence ? `<p class="bc-meta"><b>Open source:</b> ${esc(c.licence)} · ${esc(c.vendor)}${c.involve ? ` · <a href="${esc(c.involve)}" target="_blank" rel="noopener">get involved</a>` : ''}</p>` : ''}
    <p class="bc-meta"><b>The deployment:</b> ${txt(c.baseline.why)}</p>
    <p class="bc-meta"><b>The model:</b> the RiskGraph Explorer's ${M.facts ? Object.keys(M.facts).length : ''} facts, ${M.risks.length} risks and ${M.roles.length} roles, copied into this site with its provenance; the register below is computed, not written. <a href="business-cases.html#method">How</a>.</p>
    ${c.status === 'draft' ? `<p class="bc-meta"><b>Status:</b> a draft, not yet sent to ${esc(c.vendor)} and not listed on the site. It may be wrong; it is here to be corrected.</p>` : ''}
  </div>
</main>

<div class="paper">

  <section class="psection">
    <div class="wrap">
      <div class="shead">
        <span class="tag">01 · What it does</span>
        <h2>In ${c.kind === 'ours' ? 'our' : 'its'} own words, <span class="g">and nothing more.</span></h2>
      </div>
      <ul class="bc-list">${c.does.map((d) => `<li>${txt(d.text)}${d.link ? ` <a href="${esc(d.link)}">${d.link.startsWith('http') ? esc(new URL(d.link).hostname) : 'more'}</a>` : ''}${d.url ? ` <span class="bc-src">&ldquo;${esc(d.quote)}&rdquo; · <a href="${esc(d.url)}" target="_blank" rel="noopener">${esc(new URL(d.url).hostname)}</a>, read ${esc(niceDate(d.read))}</span>` : ''}</li>`).join('')}
      </ul>
    </div>
  </section>

  <section class="psection alt">
    <div class="wrap">
      <div class="shead">
        <span class="tag">02 · The answers it changes</span>
        <h2>Same deployment, <span class="g">different answers.</span></h2>
        <p>The model asks sixteen questions about an agent deployment. A product&rsquo;s effect is written as the answers it changes, and each change says what kind of change it is: a statement of what is true, an expectation the agent is asked to meet, a setting, or a boundary enforced by something the agent&rsquo;s grant does not include.</p>
      </div>
      ${changeTable(c.base, c.changes)}
    </div>
  </section>

  <section class="psection">
    <div class="wrap">
      <div class="shead">
        <span class="tag">03 · The register, before and after</span>
        <h2>${R.retired.length} retired${R.added.length ? `, ${R.added.length} new` : ''}, <span class="g">${R.kept.length} unchanged.</span></h2>
        <p>Computed from the model for the deployment above: every risk that holds without it, and every risk that holds with it.${R.added.length ? ' A new entry is either one the change brought to light, where an answer replaced a don&rsquo;t know, or a narrower risk in place of a wider one, where the answer moved from no to partly. Either way the register is more exact, and a register that grows because something was found is working.' : ''}</p>
      </div>
      <div class="bc-sum"><div class="off"><span class="n">${R.retired.length}</span><span class="l">retired</span></div><div class="new"><span class="n">${R.added.length}</span><span class="l">new</span></div><div><span class="n">${R.before.size} → ${R.afterRisks.size}</span><span class="l">entries on the register</span></div></div>
      ${R.retired.length ? `<p class="bc-h">Retired</p><div class="bc-risks">${R.retired.map((r) => riskRow(r, 'off')).join('\n      ')}</div>` : ''}
      ${R.added.length ? `<p class="bc-h">New</p><div class="bc-risks">${R.added.map((r) => riskRow(r, 'new')).join('\n      ')}</div>` : ''}
    </div>
  </section>

  <section class="psection alt">
    <div class="wrap">
      <div class="shead">
        <span class="tag">04 · From the operator to the board</span>
        <h2>Who carries less, <span class="g">and who carries the same.</span></h2>
        <p>Each risk is assigned to the roles it belongs to, and each role reports to another until the board. The count beside each role is the entries it holds without the product and with it.</p>
      </div>
      ${altitudes(R)}
      <p class="bc-h">At the board: the corporate register</p>
      <p class="bc-note">Corporate risks have no facts of their own. They hold while any risk that leads into them holds, so a single product rarely retires one. What it changes is how many reasons the board is being given.</p>
      <div class="bc-risks">${corporate(R)}</div>
    </div>
  </section>

  ${liveFigure(c)}

  ${(c.reduces || []).length ? `<section class="psection">
    <div class="wrap">
      <div class="shead">
        <span class="tag">06 · Reduced, not retired</span>
        <h2>What it asks the agent to do, <span class="g">and why that is hope.</span></h2>
      </div>
      <div class="bc-exp">${c.reduces.map((r) => `<div><q>${esc(r.instruction)}</q><span>an expectation · less likely: ${r.risks.map((x) => `${esc(x)} ${esc(RISK[x].statement.toLowerCase())}`).join('; ')}</span></div>`).join('\n        ')}</div>
      ${c.reduces_note ? `<p class="bc-note">${txt(c.reduces_note)} <a href="https://nhi.sgit.ai/hope/" target="_blank" rel="noopener">Hope is not a control</a>.</p>` : ''}
    </div>
  </section>` : ''}

  ${(c.adds || []).length || c.adds_note ? `<section class="psection alt">
    <div class="wrap">
      <div class="shead">
        <span class="tag">07 · What it adds</span>
        <h2>Every product is also a new thing in the estate.</h2>
      </div>
      ${(c.adds || []).length ? changeTable(c.base, c.adds) : ''}
      ${c.adds_note ? `<p class="bc-note">${txt(c.adds_note)}</p>` : ''}
    </div>
  </section>` : ''}

  ${(c.adoption || []).length ? `<section class="psection alt">
    <div class="wrap">
      <div class="shead">
        <span class="tag">Free, but not free</span>
        <h2>What adopting it takes, <span class="g">before any of this is true.</span></h2>
        <p>An open-source project costs nothing to download and something to adopt. Every change above depends on the work below, and most of it is customisation to your own deployment.</p>
      </div>
      <ul class="bc-list">${c.adoption.map((a) => `<li>${txt(a)}</li>`).join('')}</ul>
    </div>
  </section>` : ''}

  ${(c.contradictions || []).length ? `<section class="psection">
    <div class="wrap">
      <div class="shead">
        <span class="tag">Where its pages disagree</span>
        <h2>Published unresolved, <span class="g">for ${esc(c.vendor)} to settle.</span></h2>
        <p>Each pair was read on the same day. We have not tested which is true, because that would mean testing somebody else&rsquo;s system.</p>
      </div>
      <ul class="bc-list">${c.contradictions.map((x) => `<li><b>${esc(x.topic)}.</b> ${txt(x.text)}${x.urls ? ` <span class="bc-src">${x.urls.map((u) => `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(new URL(u).pathname.split('/').filter(Boolean).pop() || new URL(u).hostname)}</a>`).join(' · ')}</span>` : ''}</li>`).join('')}
      </ul>
    </div>
  </section>` : ''}

  ${c.abp_feed ? `<section class="psection alt">
    <div class="wrap">
      <div class="shead">
        <span class="tag">What it gives an Agent Behaviour Policy</span>
        <h2>Four objects, <span class="g">and which of them a run fills.</span></h2>
        <p>${txt(c.abp_feed.intro)}</p>
      </div>
      <div class="bc-t feed" role="table" aria-label="What a run of the product gives each object of an Agent Behaviour Policy">
        <div class="bc-tr" role="row"><span role="columnheader">The ABP object</span><span role="columnheader">What the product supplies</span><span role="columnheader">How it becomes the ABP</span><span role="columnheader">What stays open</span></div>
        ${c.abp_feed.rows.map((r) => `<div class="bc-tr" role="row"><span role="cell">${esc(r.abp)}</span><span role="cell" data-k="Supplies">${txt(r.from)}</span><span role="cell" data-k="Becomes">${txt(r.how)}</span><span role="cell" data-k="Open">${txt(r.gap)}</span></div>`).join('\n        ')}
      </div>
      ${c.abp_feed.note ? `<p class="bc-note">${txt(c.abp_feed.note)}</p>` : ''}
    </div>
  </section>` : ''}

  ${c.explainer ? `<section class="psection">
    <div class="wrap">
      <div class="shead">
        <span class="tag">From the buyer&rsquo;s desk</span>
        <h2>What it does, <span class="g">for the person who signs.</span></h2>
        <p>${txt(c.explainer.intro)}</p>
      </div>
      ${c.explainer.figure ? flowFigure(c.explainer.figure) : ''}
      <div class="bc-points">${(c.explainer.points || []).map((x) => `<div><h3>${esc(x.h)}</h3><p>${txt(x.p)}</p></div>`).join('\n        ')}</div>
    </div>
  </section>` : ''}

  ${c.commercialise ? `<section class="psection alt">
    <div class="wrap">
      <div class="shead">
        <span class="tag">${esc(c.commercialise.tag || 'Taking it to market')}</span>
        <h2>${c.commercialise.h2 ? esc(c.commercialise.h2) : 'Notes on commercialising it, <span class="g">with nothing closed.</span>'}</h2>
        <p>${txt(c.commercialise.intro)}</p>
      </div>
      <div class="bc-ideas">${(c.commercialise.ideas || []).map((x) => `<div><h3>${esc(x.h)}</h3><p>${txt(x.p)}</p></div>`).join('\n        ')}</div>
      <p class="bc-note">The position these rest on is published at <a href="https://open-source.sgit.ai/" target="_blank" rel="noopener">open-source.sgit.ai</a>, with its counter-cases; the vault pattern is the one this site&rsquo;s own behaviour policies use, described on <a href="how-it-works.html">how it works</a>.</p>
    </div>
  </section>` : ''}

  <section class="psection">
    <div class="wrap">
      <div class="shead">
        <span class="tag">What this does not claim</span>
        <h2>The limits of the case, <span class="g">stated by the case.</span></h2>
      </div>
      <ul class="bc-list">${c.does_not_claim.map((d) => `<li>${txt(d)}</li>`).join('')}
        <li>That the register is complete. It is one model, for one stated deployment. A different deployment changes the answers, and so the case.</li>
      </ul>
      ${c.next ? `<p class="bc-note"><b>Next.</b> ${txt(c.next)}</p>` : ''}
    </div>
  </section>

</div>

<section class="pcta">
  <div class="wrap">
    <span class="eyebrow"><span class="d"></span> The same method, for your product</span>
    <h2>Make the case <span class="it">in the register&rsquo;s own terms.</span></h2>
    <p>If you build a security product for agents, the case for it can be written the same way: what it does in your own words, the answers it changes, and the register before and after. If a case here is wrong about you, tell us and it changes with a date.</p>
    <div class="cta-row"><a class="btn btn-green" href="business-cases.html">All the cases</a><a class="btn btn-ghost" href="mailto:dinis.cruz@owasp.org?subject=Business%20case%20%C2%B7%20${encodeURIComponent(c.product)}">Write to us</a></div>
  </div>
</section>`;
  return cut(name, title, desc, body, c.status === 'draft');
}

// ------------------------------------------------------------------ the section page
function indexPage() {
  const catRows = categories.items.map((k) => {
    const R = k.result;
    return `<div class="bc-tr" role="row"><span role="cell">${esc(k.name)}<span class="bc-src">${esc(k.what)}</span></span><span role="cell" data-k="Answers it changes">${k.changes.map((c) => `${esc(Q[c.q].text)} <span class="bc-was">${esc(opt(c.q, k.base[c.q]))}</span> → <span class="bc-now">${esc(opt(c.q, c.to))}</span>`).join('<br>')}</span><span role="cell" data-k="Retired">${R.retired.length ? R.retired.map((r) => `${esc(r.ref)} ${esc(r.statement.toLowerCase())}`).join('; ') : 'none, for this deployment'}${R.added.length ? `<span class="bc-src">new: ${R.added.map((r) => esc(r.ref)).join(', ')}</span>` : ''}</span><span role="cell" data-k="What it adds">${txt(k.adds_text || 'not stated')}${(k.examples || []).length ? `<span class="bc-src">for example: ${k.examples.map((e) => `<a href="${esc(e.url)}" target="_blank" rel="noopener">${esc(e.name)}</a>`).join(', ')}</span>` : ''}</span></div>`;
  }).join('\n      ');
  const caseRow = (c) => `<div class="bc-tr" role="row"><span role="cell"><a href="business-case-${esc(c.slug)}.html">${esc(c.product)}</a><span class="bc-src">${esc(c.vendor)}${c.licence ? ' · ' + esc(c.licence) : ''}</span></span><span role="cell" data-k="Kind">${esc(c.category)}</span><span role="cell" data-k="Answers it changes">${c.changes.map((x) => `${esc(Q[x.q].text)} <span class="bc-was">${esc(opt(x.q, c.base[x.q]))}</span> → <span class="bc-now">${esc(opt(x.q, x.to))}</span> <span class="bc-src" style="display:inline">${esc(CHANGE_KIND[x.kind])}</span>`).join('<br>')}</span><span role="cell" data-k="Register">${c.result.retired.length} retired${c.result.added.length ? `, ${c.result.added.length} new` : ''}</span></div>`;
  const caseTable = (list) => `<div class="bc-t cs" role="table"><div class="bc-tr" role="row"><span role="columnheader">Project</span><span role="columnheader">Kind</span><span role="columnheader">Answers it changes</span><span role="columnheader">Register</span></div>
      ${list.map(caseRow).join('\n      ')}</div>`;
  const ours = published.filter((c) => c.kind === 'ours'), open = published.filter((c) => c.kind === 'open-source').sort((a, b) => (!a.vendor.startsWith('OWASP')) - (!b.vendor.startsWith('OWASP')) || a.product.localeCompare(b.product)),
        vendors = published.filter((c) => c.kind === 'vendor');
  const companies = existsSync(join(DIR, 'companies.json')) ? JSON.parse(readFileSync(join(DIR, 'companies.json'), 'utf8')) : { items: [] };
  const compRows = companies.items.map((k) => `<div class="bc-tr" role="row"><span role="cell"><a href="${esc(k.url)}" target="_blank" rel="noopener">${esc(k.company)}</a></span><span role="cell" data-k="Open project">${esc(k.project)}<span class="bc-src">${esc(k.home)}</span></span><span role="cell" data-k="What it sells on top">${txt(k.sells)}${k.quote ? `<span class="bc-src">&ldquo;${esc(k.quote)}&rdquo; · <a href="${esc(k.quote_url)}" target="_blank" rel="noopener">${esc(new URL(k.quote_url).hostname)}</a></span>` : ''}</span></div>`).join('\n      ');

  const body = `<main class="phero">
  <div class="wrap">
    <span class="eyebrow"><span class="d"></span> Business cases, by the risk they change</span>
    <h1>A security product is worth <span class="it">the risks it retires.</span></h1>
    <p class="sub">The business case for a security product is a difference: the risk register for an agent deployment without it, and the register with it, from the operator who is paged to the board that has to defend it. This section writes that difference down, computed from a public model, for our own product first and then for others&rsquo;, in their own words.</p>
    <div class="cta-row"><a class="btn btn-green" href="business-case-riskmandate-abp.html">The first case: ours</a><a class="btn btn-ghost" href="#method">How it is computed</a></div>
  </div>
</main>

<div class="paper">

  <section class="psection">
    <div class="wrap">
      <div class="shead">
        <span class="tag">Who it is for</span>
        <h2>Three readers, <span class="g">one register.</span></h2>
      </div>
      <div class="bc-three">
        <div class="bc-card"><span class="k">If you buy security</span><h3>A case in your own terms.</h3><p>Not a feature list: which entries leave your register, whose they were, and what reaches the board. And which ones a product only makes less likely, said as that.</p></div>
        <div class="bc-card"><span class="k">If you build it</span><h3>A case you did not have to write.</h3><p>Many security products are sold on capability. This maps the capability to the risks it changes, at every altitude, in terms a CFO and a board can read. If it is wrong about you, it changes.</p></div>
        <div class="bc-card"><span class="k">And us</span><h3>Every case starts with a map.</h3><p>No case can be computed until somebody has answered the questions truthfully about one agent in one deployment. That answer is what an Agent Behaviour Policy produces.</p></div>
      </div>
    </div>
  </section>

  <section class="psection alt" id="method">
    <div class="wrap">
      <div class="shead">
        <span class="tag">How it is computed</span>
        <h2>Five steps, <span class="g">none of them by hand.</span></h2>
      </div>
      <ol class="bc-steps">
        <li><span><b>State the deployment.</b> Sixteen questions about one agent: where it runs, what data it can reach, whether it can change production, whether anybody can stop it, and whether what it changes can be undone. Every case says which answers it starts from.</span></li>
        <li><span><b>Write what the product does, in its own words.</b> From the vendor&rsquo;s documentation, quoted and dated. Never from testing their product: we do not test somebody else&rsquo;s system.</span></li>
        <li><span><b>Write the answers it changes.</b> Each change says what kind it is: stating what is true, an expectation the agent is asked to meet, a setting, or a boundary the agent&rsquo;s grant does not include. An expectation never retires a risk; it is listed as a reduction.</span></li>
        <li><span><b>Compute both registers.</b> The model&rsquo;s ${Object.keys(M.facts).length} facts establish or retire its ${M.risks.length} risks by fixed rules, and corporate risks roll up from the ones that lead into them.</span></li>
        <li><span><b>Read it by altitude.</b> Each risk belongs to named roles, and each role reports up to the board. The case is the difference at each level.</span></li>
      </ol>
      <p class="bc-note">The model is the RiskGraph Explorer&rsquo;s, from one of our <a href="demos.html">live demos</a>, copied into this site with its provenance. It is small on purpose: sixteen questions, readable in one sitting, so an argument about a case is an argument about an answer, not about a formula. Nothing on these pages is a score, and no case is a statement that a product works; it is a statement of what changes in the register if it does what its documentation says.</p>
    </div>
  </section>

  <section class="psection" id="cases">
    <div class="wrap">
      <div class="shead">
        <span class="tag">The cases</span>
        <h2>${published.length} written so far, <span class="g">ours first.</span></h2>
        <p>Our own product first, so the method is tested on us. Then open-source projects, OWASP&rsquo;s first, which anybody can deploy and nobody has to pay for, but which cost something to adopt and more to customise; each case says what. Cases about commercial products are drafted from their own documentation and sent to the company before they are listed.</p>
      </div>
      <p class="bc-h">Our own</p>
      ${caseTable(ours)}
      <p class="bc-h">Open source</p>
      ${caseTable(open)}
      ${vendors.length ? `<p class="bc-h">Commercial</p>${caseTable(vendors)}` : ''}
      <p class="bc-note">Across the open-source projects, the answers that move are egress, access to data, the record, the account, stopping and undoing. None of them moves who owns the stop, the side effects of stopping, the procedure after it, or the class of data in reach. Those are decisions and documents, not software, which is where a behaviour policy and a <a href="licence-to-operate.html">licence to operate</a> come in. How OWASP&rsquo;s own projects relate to each other, and to these answers, is mapped in <a href="owasp-graph.html">OWASP, as a graph</a>.</p>
    </div>
  </section>

  ${companies.items.length ? `<section class="psection alt" id="built-on-open-source">
    <div class="wrap">
      <div class="shead">
        <span class="tag">Built on open source</span>
        <h2>Companies that work the way we do, <span class="g">and whose projects are here.</span></h2>
        <p>${txt(companies.intro || '')}</p>
      </div>
      <div class="bc-t co" role="table"><div class="bc-tr" role="row"><span role="columnheader">Company</span><span role="columnheader">Open project</span><span role="columnheader">What it sells on top</span></div>
      ${compRows}
      </div>
      ${companies.note ? `<p class="bc-note">${txt(companies.note)}</p>` : ''}
    </div>
  </section>` : ''}

  ${categories.items.length ? `<section class="psection alt" id="categories">
    <div class="wrap">
      <div class="shead">
        <span class="tag">Kinds of product</span>
        <h2>${categories.items.length} categories, <span class="g">computed the same way.</span></h2>
        <p>${txt(categories.intro || '')}</p>
      </div>
      <div class="bc-t cat" role="table">
      <div class="bc-tr" role="row"><span role="columnheader">Category</span><span role="columnheader">Answers it changes</span><span role="columnheader">Retired, for the stated deployment</span><span role="columnheader">What it adds</span></div>
      ${catRows}
      </div>
      ${categories.note ? `<p class="bc-note">${txt(categories.note)}</p>` : ''}
    </div>
  </section>` : ''}

  <section class="psection">
    <div class="wrap">
      <div class="shead">
        <span class="tag">The rules</span>
        <h2>What a case will and will not say.</h2>
      </div>
      <ul class="bc-list">
        <li><b>The vendor&rsquo;s words, quoted and dated,</b> for anything a product does. Where their pages disagree, both are shown.</li>
        <li><b>No verdict on any product</b> and no ranking of one against another. The case says what changes if the documentation is right.</li>
        <li><b>No conformity language.</b> A product that touches an article of a regulation is shown as touching it, never as meeting it.</li>
        <li><b>What it adds is part of the case.</b> A product in the request path is also something that can fail, and something that has to be stopped.</li>
        <li><b>Open source is published; commercial is sent first.</b> A case about an open-source project is published and sent to its maintainers at the same time. A case about a commercial product is sent to the company before it is listed. Either changes with a date when they correct it.</li>
      </ul>
    </div>
  </section>

</div>

<section class="pcta">
  <div class="wrap">
    <span class="eyebrow"><span class="d"></span> Build or buy security for agents?</span>
    <h2>Ask for a case, <span class="it">or correct one.</span></h2>
    <p>If you build a product for agent security and would like its case written, or you have read a case about your product and it is wrong, write to us. If you run agents, the case for anything starts with a map of one of them.</p>
    <div class="cta-row"><a class="btn btn-green" href="mailto:dinis.cruz@owasp.org?subject=A%20business%20case">Write to us</a><a class="btn btn-ghost" href="try-it.html">Map one agent, free</a></div>
  </div>
</section>`;
  return cut('business-cases', 'RiskMandate — business cases, by the risk they change',
    'The business case for a security product is the difference between the risk register without it and with it, from the operator to the board. Computed from a public model, our own product first, then others in their own words.', body);
}

// ------------------------------------------------------------------ OWASP, as a graph
const GRAPH = existsSync(join(DIR, 'owasp', 'graph.json')) ? JSON.parse(readFileSync(join(DIR, 'owasp', 'graph.json'), 'utf8')) : null;
if (GRAPH) {
  const ids = new Set(GRAPH.nodes.map((n) => n.id));
  for (const e of GRAPH.edges) if (!ids.has(e.from) || !ids.has(e.to)) fail(`owasp graph: edge ${e.from} → ${e.to} names a node that does not exist`);
  for (const n of GRAPH.nodes) if (n.parent && !ids.has(n.parent)) fail(`owasp graph: ${n.id} has unknown parent ${n.parent}`);
  for (const b of GRAPH.bridge) { if (!ids.has(b.item)) fail(`owasp graph: bridge names unknown item ${b.item}`);
    for (const q of b.questions) if (!Q[q]) fail(`owasp graph: bridge names unknown question ${q}`);
    for (const r of b.risks) if (!RISK[r]) fail(`owasp graph: bridge names unknown risk ${r}`); }
}
const OG_CSS = `
.og-zoom{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:10px;margin-top:26px}
.og-z{border:1px solid var(--border);border-radius:var(--r);background:var(--card);padding:16px 18px}
.og-z .n{font-size:28px;font-weight:700;color:var(--text);letter-spacing:-.02em}
.og-z .l{display:block;font-family:var(--mono);font-size:10.5px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--faint);margin-top:4px}
.og-z p{font-size:13px;color:var(--muted);line-height:1.55;margin-top:6px}
.og-rows{display:flex;flex-direction:column;margin-top:24px}
.og-row{display:grid;grid-template-columns:minmax(0,1.3fr) minmax(0,2fr);gap:6px 26px;padding:18px 0;border-top:1px solid var(--border)}
.og-row:last-child{border-bottom:1px solid var(--border)}
.og-row h3{font-size:16px;line-height:1.4;letter-spacing:-.01em}
.og-row h3 a{color:var(--text);text-decoration:none;border-bottom:1px solid var(--border)}
.og-meta{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}
.og-b{font-family:var(--mono);font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;border-radius:999px;padding:3px 9px;background:var(--bg2);color:var(--muted)}
.og-b.lv{background:var(--greenBg);color:var(--green)}
.og-b.dp{background:#FDF1DC;color:var(--gold)}
.og-b.cs{background:var(--text);color:var(--bg)}
.og-b.cs a{color:inherit;text-decoration:none}
.og-row p{font-size:14.5px;line-height:1.7;color:var(--muted)}
.og-rel{margin-top:8px;font-size:13px;line-height:1.7;color:var(--muted)}
.og-rel b{color:var(--text);font-weight:600}
.og-rel a{color:var(--green)}
.og-rel q{font-style:italic;quotes:"\\201C" "\\201D"}
.og-row details{margin-top:10px}
.og-row summary{cursor:pointer;font-family:var(--mono);font-size:11.5px;font-weight:700;color:var(--green)}
.og-row ol{margin:8px 0 0 18px}
.og-row ol li{font-size:13.5px;line-height:1.7;color:var(--muted)}
.og-row ol li a{color:var(--muted)}
.og-bridge .bc-tr{grid-template-columns:minmax(0,1fr) minmax(0,1.3fr) minmax(0,1.2fr) minmax(0,1.3fr)}
@media (max-width:900px){.og-zoom{grid-template-columns:1fr 1fr}.og-row{grid-template-columns:minmax(0,1fr)}.og-bridge .bc-tr{grid-template-columns:1fr 1fr}}
@media (max-width:640px){.og-zoom,.og-bridge .bc-tr{grid-template-columns:1fr}}
`;
const aid = (id) => 'n-' + id.replace(/[^a-z0-9]+/gi, '-').toLowerCase();
function owaspPage() {
  const G = GRAPH, byId = Object.fromEntries(G.nodes.map((n) => [n.id, n]));
  const kids = (id) => G.nodes.filter((n) => n.parent === id);
  const out = (id) => G.edges.filter((e) => e.from === id), inn = (id) => G.edges.filter((e) => e.to === id);
  const nm = (id) => byId[id].kind === 'item' ? byId[id].name : byId[id].name;
  const link = (id) => { const n = byId[id]; const tgt = n.kind === 'item' ? aid(n.parent) : aid(id); return `<a href="#${tgt}">${esc(nm(id))}</a>`; };
  const rel = (id) => {
    const o = out(id).map((e) => `<b>${esc(e.rel)}</b> ${link(e.to)}${e.quote ? ` <q>${esc(e.quote)}</q>` : ''}`);
    const i = inn(id).map((e) => `${link(e.from)} <b>${esc(e.rel)}</b> this`);
    const itemLinks = kids(id).flatMap((k) => [...out(k.id).map((e) => `${esc(k.name.split(' ')[0])} <b>${esc(e.rel)}</b> ${link(e.to)}${e.quote ? ` <q>${esc(e.quote)}</q>` : ''}`)]);
    const all = [...o, ...itemLinks, ...i];
    return all.length ? `<div class="og-rel">${all.join('<br>')}</div>` : '';
  };
  const casesBySlug = Object.fromEntries(published.map((c) => [c.slug, c]));
  const row = (n) => { const items = kids(n.id).filter((k) => k.kind === 'item');
    return `<div class="og-row" id="${aid(n.id)}"><div><h3>${n.url ? `<a href="${esc(n.url)}" target="_blank" rel="noopener">${esc(n.name)}</a>` : esc(n.name)}</h3><div class="og-meta">${n.level ? `<span class="og-b lv">${esc(n.level)}</span>` : ''}${n.disputed ? '<span class="og-b dp">level disputed</span>' : ''}${n.type ? `<span class="og-b">${esc(n.type)}</span>` : ''}${n.kind === 'document' ? '<span class="og-b">document</span>' : ''}${n.version ? `<span class="og-b">${esc(n.version)}</span>` : ''}${n.case && casesBySlug[n.case] ? `<span class="og-b cs"><a href="business-case-${esc(n.case)}.html">business case</a></span>` : ''}</div></div>
      <div><p>${txt(n.what || '')}</p>${rel(n.id)}${items.length ? `<details><summary>${items.length} items, titles only</summary><ol>${items.map((k) => `<li>${esc(k.name)}</li>`).join('')}</ol></details>` : ''}</div></div>`; };
  const fam = G.nodes.filter((n) => n.kind === 'group');
  const count = (k) => G.nodes.filter((n) => n.kind === k).length;
  const casesFor = (qs) => published.filter((c) => c.kind !== 'ours' && c.changes.some((x) => qs.includes(x.q)));
  const bridgeRows = G.bridge.map((b) => `<div class="bc-tr" role="row"><span role="cell">${esc(byId[b.item].name)}</span><span role="cell" data-k="The answers that bound it">${b.questions.length ? b.questions.map((q) => esc(Q[q].text)).join('<br>') : '<span class="bc-was">not in the model</span>'}<span class="bc-src">${txt(b.why)}</span></span><span role="cell" data-k="Model risks">${b.risks.map((r) => `${esc(r)} ${esc(RISK[r].statement.toLowerCase())}`).join('<br>') || '–'}</span><span role="cell" data-k="Open-source cases that change those answers">${b.questions.length ? (casesFor(b.questions).map((c) => `<a href="business-case-${esc(c.slug)}.html">${esc(c.product)}</a>`).join(', ') || 'none yet') : '–'}</span></div>`).join('\n      ');
  const ext = G.nodes.filter((n) => n.kind === 'external');
  const body = `<main class="phero">
  <div class="wrap">
    <span class="eyebrow"><span class="d"></span> OWASP, as a graph</span>
    <h1>Every OWASP document has its own ontology. <span class="it">Here they are joined.</span></h1>
    <p class="sub">OWASP is a foundation of projects, each project a set of documents or tools, each document a list of numbered items with its own vocabulary, and each of those pointing at the others and at frameworks outside. This page is that structure as one graph you can zoom through, from the foundation to a single item, with every relationship taken from OWASP&rsquo;s own pages. Then it joins the graph to the risk model the rest of this section runs on.</p>
    <p class="bc-meta"><b>Read:</b> OWASP&rsquo;s own pages, 24 September 2026. Items are titles only. Levels are the live project pages&rsquo;, and disputed ones are marked.</p>
    <p class="bc-meta"><b>The data:</b> <a href="business-case/owasp/graph.json">graph.json</a>, offered to OWASP to take, correct and keep. The bridge to our model is our reading, not OWASP&rsquo;s.</p>
  </div>
</main>

<div class="paper">

  <section class="psection">
    <div class="wrap">
      <div class="shead">
        <span class="tag">Zoom</span>
        <h2>Five levels, <span class="g">one graph.</span></h2>
        <p>The fractal part is that each level has the same shape as the one above it: a thing, its parts, and the edges to other things. A reader can stop at any level and still be holding something whole.</p>
      </div>
      <div class="og-zoom">
        <div class="og-z"><span class="n">1</span><span class="l">Foundation</span><p>OWASP itself.</p></div>
        <div class="og-z"><span class="n">${fam.length}</span><span class="l">Families</span><p>How this page groups the projects.</p></div>
        <div class="og-z"><span class="n">${count('project') + count('document')}</span><span class="l">Projects and documents</span><p>Each with its level, type and date.</p></div>
        <div class="og-z"><span class="n">${count('item')}</span><span class="l">Items</span><p>The numbered entries of ${new Set(G.nodes.filter((n) => n.kind === 'item').map((n) => n.parent)).size} lists.</p></div>
        <div class="og-z"><span class="n">${G.edges.length}</span><span class="l">Relationships</span><p>Stated by OWASP, including ${ext.length} frameworks outside it.</p></div>
      </div>
    </div>
  </section>

  ${fam.map((f, i) => `<section class="psection${i % 2 === 0 ? ' alt' : ''}" id="${aid(f.id)}">
    <div class="wrap">
      <div class="shead">
        <span class="tag">Family ${i + 1} of ${fam.length}</span>
        <h2>${esc(f.name)}</h2>
        <p>${txt(f.what)}${f.level ? ` The project is ${esc(f.level)} on its live page.` : ''}</p>
      </div>
      <div class="og-rows">${kids(f.id).map(row).join('\n      ')}</div>
    </div>
  </section>`).join('\n\n  ')}

  <section class="psection${fam.length % 2 === 0 ? ' alt' : ''}" id="outside">
    <div class="wrap">
      <div class="shead">
        <span class="tag">Outside OWASP</span>
        <h2>The frameworks OWASP maps to, <span class="g">titles only.</span></h2>
      </div>
      <div class="og-rows">${ext.map((n) => `<div class="og-row" id="${aid(n.id)}"><div><h3>${esc(n.name)}</h3></div><div>${rel(n.id)}</div></div>`).join('\n      ')}</div>
    </div>
  </section>

  <section class="psection${fam.length % 2 === 1 ? ' alt' : ''}" id="bridge">
    <div class="wrap">
      <div class="shead">
        <span class="tag">Where OWASP meets our model</span>
        <h2>The Agentic Top 10, <span class="g">joined to the register.</span></h2>
        <p>For each item, the answers in our model that bound it, the risks those answers establish, and the open-source cases on this site that change those answers. This is our reading, stated as ours. Three items touch nothing in the model; that is a finding about the model, and it says where the model has to grow.</p>
      </div>
      <div class="bc-t og-bridge" role="table"><div class="bc-tr" role="row"><span role="columnheader">Item</span><span role="columnheader">The answers that bound it</span><span role="columnheader">Model risks</span><span role="columnheader">Cases that change those answers</span></div>
      ${bridgeRows}
      </div>
    </div>
  </section>

  <section class="psection" id="disagree">
    <div class="wrap">
      <div class="shead">
        <span class="tag">Where OWASP&rsquo;s pages disagree</span>
        <h2>Published unresolved, <span class="g">for the projects to settle.</span></h2>
      </div>
      <ul class="bc-list">${G.contradictions.map((x) => `<li><b>${esc(x.topic)}.</b> ${txt(x.text)} <span class="bc-src">${x.urls.map((u) => `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(u.replace(/^https:\/\//, ''))}</a>`).join(' · ')}</span></li>`).join('')}</ul>
    </div>
  </section>

  <section class="psection alt" id="involve">
    <div class="wrap">
      <div class="shead">
        <span class="tag">Why this is here, and where it should live</span>
        <h2>A graph OWASP does not have yet, <span class="g">offered to OWASP.</span></h2>
        <p>The lead is closely involved with OWASP, and the intent is to offer this graph, and in time the Agent Behaviour Policy format, to OWASP rather than keep them here. Until then the data is published so anybody can take it, and it changes with a date when a project corrects it.</p>
      </div>
      <ul class="bc-list">${G.involve.map((x) => `<li><a href="${esc(x.url)}" target="_blank" rel="noopener">${esc(x.name)}</a></li>`).join('')}</ul>
    </div>
  </section>

</div>

<section class="pcta">
  <div class="wrap">
    <span class="eyebrow"><span class="d"></span> From a list to a register</span>
    <h2>An item names a risk. <span class="it">A behaviour policy says whether yours has it.</span></h2>
    <p>The Top 10s say what can go wrong with agents in general. What goes wrong with yours depends on what it can reach, which is what a behaviour policy writes down, and which projects change it, which is what the business cases compute.</p>
    <div class="cta-row"><a class="btn btn-green" href="business-cases.html">The business cases</a><a class="btn btn-ghost" href="try-it.html">Map one agent, free</a></div>
  </div>
</section>`;
  const html = cut('owasp-graph', 'RiskMandate — OWASP, as a graph',
    'A semantic graph of OWASP: the foundation, its AI and agent projects, the standards and tools an agent deployment touches, the items of eleven lists by title, and the relationships OWASP states between them, joined to the risk model behind the business cases.', body);
  return html.replace('</style>', OG_CSS + '</style>');
}

// ------------------------------------------------------------------ write, or check
const outputs = { 'business-cases.html': indexPage() };
for (const c of cases) outputs[`business-case-${c.slug}.html`] = casePage(c);
if (GRAPH) outputs['owasp-graph.html'] = owaspPage();
const stale = [];
for (const [file, want] of Object.entries(outputs)) {
  const path = join(SITE, file);
  const have = existsSync(path) ? readFileSync(path, 'utf8') : null;
  if (have === want) continue;
  if (CHECK) stale.push(file); else writeFileSync(path, want);
}
if (CHECK) {
  if (stale.length) fail(`stale: ${stale.join(', ')} — run build-business-cases.mjs`);
  console.log(`business cases: ${Object.keys(outputs).length} pages up to date`);
} else console.log(`business cases: wrote ${Object.keys(outputs).length} pages (${cases.length} case${cases.length === 1 ? '' : 's'}, ${categories.items.length} categories)`);
