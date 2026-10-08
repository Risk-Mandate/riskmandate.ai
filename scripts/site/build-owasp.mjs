// build-owasp.mjs — the OWASP section: the move of the Agent Behaviour Policies to OWASP, kept in public.
//
//   node scripts/site/build-owasp.mjs [--check]
//
// Reads site/owasp/project.json (the record: where the move stands, every gate, every step, what
// was submitted and to whom, the people, the repositories, the decisions and the log) and the page
// bodies in docs/owasp/pages/<slug>.html, and writes site/owasp/<slug>.html. A body may carry
// placeholders, <!--owasp:name-->, which are filled from the record, so a status changes in one
// place and every page that shows it follows. The order of the pages, their titles and the strip of
// tabs under each hero come from project.json → pages.
//
// The record is public on purpose. The lead's instruction of 8 October 2026: everything about the
// move, including what was submitted and what it is waiting on, goes on the public site and in the
// public repository. It is also the file that moves to the OWASP repository if the project is
// accepted: it is data so that it can move without being rewritten.
//
// A page in a folder links from the site root: every href and src it carries starts with a slash,
// and RM.data.base tells the shared menu to do the same. The chrome is cut from pricing.html like
// every other built page, so a chrome change reaches these pages by running this again.
//
// The build refuses the words the site's rules refuse: ADP, rung, and the conformity words. A
// claim about OWASP that is not yet true is the failure this section most needs to avoid, so it
// also refuses "OWASP-approved", "endorsed by OWASP" and "official OWASP project" unless the record
// says the project was accepted.

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve }                               from 'node:path';
import { fileURLToPath }                                        from 'node:url';

const ROOT  = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const SITE  = join(ROOT, 'site');
const SRC   = join(ROOT, 'docs/owasp/pages');
const CHECK = process.argv.includes('--check');
const esc   = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const fail  = (m) => { console.error(`owasp: ${m}`); process.exit(1); };
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const niceDate = (d) => (d ? `${parseInt(d.slice(8, 10), 10)} ${MONTHS[parseInt(d.slice(5, 7), 10) - 1]} ${d.slice(0, 4)}` : '');
const HERE = '/owasp/';

// ------------------------------------------------------------------ read and check
const P = JSON.parse(readFileSync(join(SITE, 'owasp/project.json'), 'utf8'));
for (const k of ['project', 'as_at', 'pages', 'gates', 'steps', 'submissions', 'people', 'places', 'decisions', 'questions', 'log']) if (!P[k]) fail(`project.json: missing ${k}`);
const STATUS = P.statuses;
for (const s of P.steps) {
  for (const k of ['id', 'gate', 'what', 'owner', 'status']) if (!s[k]) fail(`step ${s.id || '?'}: missing ${k}`);
  if (!STATUS[s.status]) fail(`step ${s.id}: status ${s.status} is not one of ${Object.keys(STATUS).join(', ')}`);
  if (!P.gates.some((g) => g.id === s.gate)) fail(`step ${s.id}: gate ${s.gate} is not a gate`);
}
for (const g of P.gates) if (!STATUS[g.status]) fail(`gate ${g.id}: status ${g.status} is unknown`);
for (const s of P.submissions) if (!STATUS[s.status]) fail(`submission ${s.id}: status ${s.status} is unknown`);
const accepted = P.project.owasp_status === 'accepted';

// the contribution inventory is a CSV so that it can be opened in anything; the page is rendered from it
function parseCsv(text) {
  const rows = []; let row = [], cell = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (q) { if (ch === '"' && text[i + 1] === '"') { cell += '"'; i++; } else if (ch === '"') q = false; else cell += ch; }
    else if (ch === '"') q = true;
    else if (ch === ',') { row.push(cell); cell = ''; }
    else if (ch === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; }
    else if (ch !== '\r') cell += ch;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  const [head, ...body] = rows;
  return body.map((r) => Object.fromEntries(head.map((h, i) => [h, r[i] ?? ''])));
}
const INVENTORY = parseCsv(readFileSync(join(SITE, 'owasp/contribution-inventory.csv'), 'utf8'));
const ACTIONS = ['contribute', 'rewrite', 'defer', 'exclude'];
for (const a of INVENTORY) if (!ACTIONS.includes(a.proposed_action)) fail(`inventory ${a.asset_id}: action ${a.proposed_action} is not one of ${ACTIONS.join(', ')}`);

const RULES = [
  [/\bADP\b/, 'says ADP'],
  [/\brungs?\b/i, 'says rung'],
  [/\b(certified|compliant|conformant|accredited|aligned)\b/i, 'uses conformity language'],
  [/\bbehaviour policy score|\bABP score/i, 'scores a behaviour policy'],
];
const PREMATURE = [/OWASP[- ]approved/i, /endorsed by OWASP/i, /official OWASP project/i];
function lint(name, text) {
  const plain = text.replace(/<[^>]+>/g, ' ');
  for (const [re, why] of RULES) if (re.test(plain)) fail(`${name} ${why}: ${plain.match(re)[0]}`);
  if (!accepted) for (const re of PREMATURE) {
    // a sentence that says it is not so is allowed: "not an official OWASP project"
    for (const m of plain.matchAll(new RegExp(re.source, 'gi'))) {
      const before = plain.slice(Math.max(0, m.index - 40), m.index);
      if (!/\b(not|no|nor|nothing|never|without|before|until)\b[^.]*$/i.test(before)) fail(`${name} claims "${m[0]}" and the project has not been accepted`);
    }
  }
}
lint('project.json', JSON.stringify(P));

// ------------------------------------------------------------------ the page kit
const CSS = `
/* owasp — the move of the Agent Behaviour Policies to OWASP, kept in public */
.phero .meta{font-family:var(--mono);font-size:12px;color:rgba(255,255,255,.6);line-height:1.7;margin-top:6px;max-width:860px}
.phero .meta b{color:rgba(255,255,255,.85)}.phero .meta a{color:inherit}
.ow-tabs{background:var(--card);border-bottom:1px solid var(--border);position:relative;z-index:2}
.ow-tabs .wrap{display:flex;flex-wrap:wrap;gap:4px 2px;padding-top:10px;padding-bottom:10px}
.ow-tabs a{font-size:13px;font-weight:600;color:var(--muted);text-decoration:none;padding:6px 11px;border-radius:999px;white-space:nowrap}
.ow-tabs a:hover{color:var(--text);background:var(--bg2)}
.ow-tabs a[aria-current="page"]{color:var(--card);background:var(--ink)}
.ow-note{font-size:15px;line-height:1.75;color:var(--muted);max-width:880px;margin-top:16px}
.ow-note b,.ow-note em,.ow-note strong{color:var(--text)}
.ow-note a,.ow-list a,.ow-t a,.ow-card a,.ow-g a{color:var(--green)}
.ow-note code,.ow-list code,.ow-t code,.ow-card code{font-family:var(--mono);font-size:.86em;background:var(--bg2);padding:1px 5px;border-radius:4px;color:var(--text)}
.ow-list{margin:18px 0 0;padding-left:20px;max-width:880px;font-size:14.5px;line-height:1.7;color:var(--muted)}
.ow-list li+li{margin-top:6px}.ow-list b,.ow-list strong{color:var(--text)}
.ow-k{font-family:var(--mono);font-size:10.5px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--faint)}
.ow-t{margin-top:24px;border:1px solid var(--border);border-radius:var(--r);background:var(--card);overflow-x:auto}
.ow-t table{width:100%;border-collapse:collapse;font-size:13.5px;line-height:1.6}
.ow-t th{text-align:left;font-family:var(--mono);font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--text);background:var(--bg2);padding:10px 12px;border-bottom:1px solid var(--border);white-space:nowrap}
.ow-t td{padding:10px 12px;border-top:1px solid var(--border);color:var(--muted);vertical-align:top}
.ow-t tr:first-child td{border-top:0}
.ow-t td:first-child{color:var(--text);font-weight:600}
.ow-t td.id{font-family:var(--mono);font-size:11.5px;color:var(--faint);font-weight:400;white-space:nowrap}
.ow-pill{display:inline-block;font-family:var(--mono);font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;border-radius:999px;padding:3px 9px;background:var(--bg2);color:var(--muted);white-space:nowrap}
.ow-pill.done{background:var(--greenBg);color:var(--green)}
.ow-pill.doing{background:rgba(29,78,216,.08);color:var(--blue)}
.ow-pill.waiting{background:rgba(180,83,9,.09);color:var(--gold)}
.ow-pill.blocked{background:rgba(192,57,43,.08);color:var(--red)}
.ow-cards{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;margin-top:24px}
.ow-cards.two{grid-template-columns:repeat(2,minmax(0,1fr))}
.ow-cards.four{grid-template-columns:repeat(4,minmax(0,1fr))}
.ow-card{border:1px solid var(--border);border-radius:var(--r);background:var(--card);padding:18px 20px;display:flex;flex-direction:column;gap:8px;color:inherit;text-decoration:none}
a.ow-card:hover{border-color:var(--green)}
.ow-card h3{font-size:16px;color:var(--text);margin:0;letter-spacing:-.01em;line-height:1.35}
.ow-card p{font-size:13.5px;line-height:1.65;color:var(--muted)}
.ow-card .n{font-family:var(--mono);font-size:11px;font-weight:700;letter-spacing:.12em;color:var(--green)}
.ow-card ul{margin:0;padding-left:18px;font-size:13.5px;line-height:1.65;color:var(--muted)}
.ow-gates{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:12px;margin-top:24px}
.ow-g{border:1px solid var(--border);border-radius:var(--r);background:var(--card);padding:14px 16px;display:flex;flex-direction:column;gap:6px}
.ow-g .id{font-family:var(--mono);font-size:12px;font-weight:700;color:var(--green)}
.ow-g h3{font-size:14.5px;margin:0;color:var(--text);line-height:1.35}
.ow-g p{font-size:12.5px;line-height:1.6;color:var(--muted)}
.ow-split{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:24px}
.ow-split>div{border:1px solid var(--border);border-radius:var(--r);background:var(--card);padding:18px 20px}
.ow-split h3{font-size:15px;margin:0 0 8px;color:var(--text)}
.ow-split ul{margin:0;padding-left:18px;font-size:13.5px;line-height:1.7;color:var(--muted)}
.ow-split .them h3{color:var(--green)}
.ow-sub{font-size:18px;margin:34px 0 0;color:var(--text);letter-spacing:-.01em}
.ow-pre{margin-top:20px;border:1px solid var(--border);border-radius:var(--r);background:var(--card);padding:16px 20px;font-family:var(--mono);font-size:12.5px;line-height:1.7;color:var(--text);white-space:pre-wrap;overflow-x:auto;max-width:880px}
.ow-q{margin-top:22px;border-left:3px solid var(--green);padding:4px 0 4px 16px;max-width:860px;font-size:15px;line-height:1.7;color:var(--text);font-style:italic}
.ow-q cite{display:block;margin-top:6px;font-style:normal;font-family:var(--mono);font-size:11px;color:var(--faint)}
.ow-form{margin-top:24px;border:1px solid var(--border);border-radius:var(--r);background:var(--card);overflow:hidden}
.ow-f{display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,2fr);border-top:1px solid var(--border)}
.ow-f:first-child{border-top:0}
.ow-f>div{padding:12px 16px;font-size:13.5px;line-height:1.65;color:var(--muted)}
.ow-f>div:first-child{background:var(--bg2);color:var(--text);font-weight:600}
.ow-f .src{display:block;font-family:var(--mono);font-size:10.5px;font-weight:400;color:var(--faint);margin-top:4px}
.ow-f p+p{margin-top:8px}
@media (max-width:900px){.ow-cards,.ow-cards.four{grid-template-columns:1fr 1fr}.ow-gates{grid-template-columns:1fr 1fr}}
@media (max-width:640px){.ow-t table{min-width:620px}.ow-cards,.ow-cards.two,.ow-cards.four,.ow-gates,.ow-split{grid-template-columns:1fr}.ow-f{grid-template-columns:1fr}.ow-tabs .wrap{flex-wrap:nowrap;overflow-x:auto}}
`;

const donor = readFileSync(join(SITE, 'pricing.html'), 'utf8');
// every relative href or src becomes root-absolute; anchors, mailto:, data: and full URLs are left
const abs = (html) => html.replace(/\b(href|src)="(?!(?:https?:|mailto:|data:|#|\/))([^"]+)"/g, '$1="/$2"');

function cut(file, name, title, desc, body) {
  const canonical = `https://riskmandate.ai/${file.replace(/(^|\/)index\.html$/, '$1')}`;
  let head = donor.slice(0, donor.indexOf('<body'));
  head = head.replace(/<title>.*?<\/title>/s, `<title>${esc(title)}</title>`);
  head = head.replace(/(<meta name="description" content=")[^"]*(")/, `$1${esc(desc)}$2`);
  head = head.replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${esc(title)}$2`);
  head = head.replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${esc(desc)}$2`);
  head = head.split('https://riskmandate.ai/pricing.html').join(canonical).split('href="pricing.md"').join(`href="/${file.replace(/\.html$/, '.md')}"`);
  if (/pricing\.(html|md)/.test(head)) fail(`${file}: the donor's own address is still in the head`);
  head = abs(head).replace('</style>', CSS + '</style>');
  const bodyStart = donor.indexOf('<body'), scriptAt = donor.indexOf('<script>', bodyStart);
  const donorBody = donor.slice(bodyStart, scriptAt);
  const hdr  = abs(donorBody.match(/<header class="top">.*?<\/header>/s)[0]);
  const foot = abs(donorBody.match(/<footer class="foot">.*?<\/footer>/s)[0]);
  const tail = donor.slice(scriptAt).replace('RM.data.currentPage="pricing"', `RM.data.base="/";RM.data.currentPage="${name}"`);
  return head + '<body id="top">\n\n' + hdr + '\n\n' + abs(body) + '\n\n' + foot + '\n\n' + tail;
}

// ------------------------------------------------------------------ components filled from the record
const pageHref = (slug) => (slug === 'index' ? HERE : `${HERE}${slug}.html`);
const pill = (status) => `<span class="ow-pill ${esc(STATUS[status].tone)}">${esc(STATUS[status].label)}</span>`;
const link = (u, t) => (u ? `<a href="${esc(u)}">${esc(t || u)}</a>` : esc(t || ''));
const table = (head, rows) => `<div class="ow-t"><table>\n<thead><tr>${head.map((h) => `<th scope="col">${h}</th>`).join('')}</tr></thead>\n<tbody>\n${rows.join('\n')}\n</tbody></table></div>`;
const gateOf = (id) => P.gates.find((g) => g.id === id);

const C = {
  tabs: (slug) => `<nav class="ow-tabs" aria-label="The OWASP section"><div class="wrap">${P.pages.map((p) =>
    `<a href="${pageHref(p.slug)}"${p.slug === slug ? ' aria-current="page"' : ''}>${esc(p.tab)}</a>`).join('')}</div></nav>`,
  asat: () => `<b>As at:</b> ${esc(niceDate(P.as_at))}. <b>Where it stands:</b> ${esc(P.project.stage)}`,
  pages: () => `<div class="ow-cards">${P.pages.filter((p) => p.slug !== 'index').map((p, i) =>
    `<a class="ow-card" href="${pageHref(p.slug)}"><span class="n">${String(i + 1).padStart(2, '0')}</span><h3>${esc(p.tab)}</h3><p>${esc(p.blurb)}</p></a>`).join('')}</div>`,
  gates: () => `<div class="ow-gates">${P.gates.map((g) =>
    `<div class="ow-g"><span class="id">${esc(g.id)}</span><h3>${esc(g.title)}</h3><p>${esc(g.what)}</p><p><b>Who clears it:</b> ${esc(g.who)}</p>${pill(g.status)}</div>`).join('')}</div>`,
  steps: () => table(['Step', 'Gate', 'What', 'Who', 'When', 'Status', 'Notes'], P.steps.map((s) =>
    `<tr id="${esc(s.id)}"><td class="id">${esc(s.id)}</td><td class="id">${esc(s.gate)}</td><td>${esc(s.what)}</td><td>${esc(s.owner)}</td><td class="id">${esc(s.when || '')}</td><td>${pill(s.status)}</td><td>${s.notes ? esc(s.notes) : ''}${s.url ? ` ${link(s.url, 'link')}` : ''}</td></tr>`)),
  submissions: () => table(['Id', 'What', 'To', 'Channel', 'Sent', 'Status', 'Answer'], P.submissions.map((s) =>
    `<tr><td class="id">${esc(s.id)}</td><td>${esc(s.what)}${s.draft ? ` · ${link(s.draft, 'the draft')}` : ''}</td><td>${esc(s.to)}</td><td>${s.channel_url ? link(s.channel_url, s.channel) : esc(s.channel)}</td><td class="id">${esc(s.sent ? niceDate(s.sent) : 'not sent')}</td><td>${pill(s.status)}</td><td>${esc(s.answer || '—')}</td></tr>`)),
  people: () => table(['Who', 'Role', 'Why we talk to them', 'How', 'Confirmed'], P.people.map((p) =>
    `<tr><td>${esc(p.name)}</td><td>${esc(p.role)}</td><td>${esc(p.why)}</td><td>${p.contact_url ? link(p.contact_url, p.contact) : esc(p.contact || '')}</td><td>${esc(p.confirmed)}</td></tr>`)),
  places: () => table(['What', 'Where it lives', 'Who manages it', 'Side'], P.places.map((p) =>
    `<tr><td>${esc(p.what)}</td><td>${p.url ? link(p.url, p.where) : esc(p.where)}</td><td>${esc(p.who)}</td><td>${esc(p.side)}</td></tr>`)),
  decisions: () => table(['Id', 'Decided', 'By', 'Date'], P.decisions.map((d) =>
    `<tr><td class="id">${esc(d.id)}</td><td>${esc(d.what)}</td><td>${esc(d.by)}</td><td class="id">${esc(niceDate(d.date))}</td></tr>`)),
  questions: () => table(['Id', 'Open question', 'Who answers', 'Blocks'], P.questions.map((q) =>
    `<tr><td class="id">${esc(q.id)}</td><td>${esc(q.q)}</td><td>${esc(q.who)}</td><td class="id">${esc(q.blocks || '')}</td></tr>`)),
  log: () => table(['Date', 'What happened', 'Where'], [...P.log].reverse().map((l) =>
    `<tr><td class="id">${esc(niceDate(l.date))}</td><td>${esc(l.what)}</td><td>${l.url ? link(l.url, 'link') : ''}</td></tr>`)),
  leaders: () => table(['Leader', 'Role on the project', 'OWASP membership', 'Affiliation'], P.project.leaders.map((l) =>
    `<tr><td>${esc(l.name)}</td><td>${esc(l.role)}</td><td>${esc(l.membership)}</td><td>${esc(l.affiliation)}</td></tr>`)),
  inventorycounts: () => `<div class="ow-cards four">${ACTIONS.map((a) => {
    const n = INVENTORY.filter((r) => r.proposed_action === a).length;
    return `<div class="ow-card"><span class="n">${esc(a)}</span><h3>${n} of ${INVENTORY.length} assets</h3><p>${esc(P.inventory_actions[a])}</p></div>`;
  }).join('')}</div>`,
  inventory: () => ACTIONS.map((a) => `<h3 class="ow-sub" id="${a}">${esc(a[0].toUpperCase() + a.slice(1))} <span class="ow-k">${INVENTORY.filter((r) => r.proposed_action === a).length}</span></h3>` +
    table(['Id', 'Asset', 'Where it is now', 'Type', 'Licence today', 'Coupling', 'Rights', 'Notes'], INVENTORY.filter((r) => r.proposed_action === a).map((r) =>
      `<tr><td class="id">${esc(r.asset_id)}</td><td>${esc(r.title)}</td><td>${/^https?:/.test(r.source_path_or_url) ? link(r.source_path_or_url.split(/[ ;(]/)[0], r.source_path_or_url) : `<code>${esc(r.source_path_or_url)}</code>`}<span class="ow-k" style="display:block;margin-top:4px">${esc(r.source_repository)}</span></td><td>${esc(r.asset_type)}</td><td>${esc(r.current_licence)}</td><td>${esc(r.product_coupling)}</td><td>${esc(r.rights_status)}</td><td>${esc(r.notes)}</td></tr>`))).join('\n'),
  counts: () => {
    const n = (st) => P.steps.filter((s) => s.status === st).length;
    return `<div class="ow-cards four">${['done', 'doing', 'todo', 'waiting'].filter((k) => STATUS[k]).map((k) =>
      `<div class="ow-card"><span class="n">${esc(STATUS[k].label)}</span><h3>${n(k)} of ${P.steps.length} steps</h3><p>${esc(STATUS[k].means)}</p></div>`).join('')}</div>`;
  },
};

function fill(slug, body) {
  return body.replace(/<!--owasp:([a-z]+)-->/g, (m, k) => {
    if (!C[k]) fail(`${slug}: unknown placeholder ${k}`);
    return C[k](slug);
  });
}

// ------------------------------------------------------------------ the pages
const outputs = {};
const sources = existsSync(SRC) ? readdirSync(SRC).filter((f) => f.endsWith('.html')).map((f) => f.slice(0, -5)) : [];
for (const p of P.pages) if (!sources.includes(p.slug)) fail(`project.json lists ${p.slug}, and docs/owasp/pages/${p.slug}.html does not exist`);
for (const s of sources) if (!P.pages.some((p) => p.slug === s)) fail(`docs/owasp/pages/${s}.html is not listed in project.json → pages`);
for (const p of P.pages) {
  const raw = readFileSync(join(SRC, `${p.slug}.html`), 'utf8');
  const body = fill(p.slug, raw);
  lint(`${p.slug}.html`, body);
  const name = p.slug === 'index' ? 'owasp' : `owasp-${p.slug}`;
  outputs[`owasp/${p.slug}.html`] = cut(`owasp/${p.slug}.html`, name, p.title, p.desc, body);
}

// ------------------------------------------------------------------ write, or check
const stale = [];
for (const [file, want] of Object.entries(outputs)) {
  const path = join(SITE, file);
  const have = existsSync(path) ? readFileSync(path, 'utf8') : null;
  if (have === want) continue;
  if (CHECK) stale.push(file); else writeFileSync(path, want);
}
if (CHECK) { if (stale.length) fail(`stale: ${stale.join(', ')} — run build-owasp.mjs`); console.log(`owasp: ${Object.keys(outputs).length} pages up to date`); }
else console.log(`owasp: wrote ${Object.keys(outputs).length} pages (${P.steps.length} steps, ${P.submissions.length} submissions, ${P.people.length} people)`);
