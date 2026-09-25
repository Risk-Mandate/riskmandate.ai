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
  head = head.replace('</style>', CSS + '</style>');
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

  ${(c.reduces || []).length ? `<section class="psection">
    <div class="wrap">
      <div class="shead">
        <span class="tag">05 · Reduced, not retired</span>
        <h2>What it asks the agent to do, <span class="g">and why that is hope.</span></h2>
      </div>
      <div class="bc-exp">${c.reduces.map((r) => `<div><q>${esc(r.instruction)}</q><span>an expectation · less likely: ${r.risks.map((x) => `${esc(x)} ${esc(RISK[x].statement.toLowerCase())}`).join('; ')}</span></div>`).join('\n        ')}</div>
      ${c.reduces_note ? `<p class="bc-note">${txt(c.reduces_note)} <a href="https://nhi.sgit.ai/hope/" target="_blank" rel="noopener">Hope is not a control</a>.</p>` : ''}
    </div>
  </section>` : ''}

  ${(c.adds || []).length || c.adds_note ? `<section class="psection alt">
    <div class="wrap">
      <div class="shead">
        <span class="tag">06 · What it adds</span>
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
        <span class="tag">Taking it to market</span>
        <h2>Notes on commercialising it, <span class="g">with nothing closed.</span></h2>
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
