// build-team.mjs — the team: who does what, what is public, private and secret, and a behaviour
// policy for each of our own agents, in the grammar the catalogue's vaults use.
//
//   node scripts/site/build-team.mjs [--check]
//
// Reads site/team/team.json (the people, the tiers, the surfaces, the publication workflow, the
// tooling) and site/team/<agent>.json for each agent it names (the grant, the mandate, the
// surfaces, the checks, the session prompt), and writes site/team/index.html and
// site/team/<agent>.html. The delta on each agent page is derived here the way build-abp-vault.mjs
// derives it (abp.delta/v1): excess = grant minus wants, refused = the excess the mandate names,
// unstated = the rest, unbounded = excess whose barrier is not boundary, shortfall = wanted and not
// granted. Nothing is scored: the counts are counts.
//
// The lead's ask, 26 September 2026: policies for the agents that make this site, on the site;
// what is public, what is private, what can be pushed where, and what stands in the way; a role a
// clean session can start from. Pages live in a folder and link from the site root, like stories/.
//
// Refuses: a grant row without a barrier, an evidence tier, an undo class and a note; a capability,
// barrier, tier or undo class the vocabulary does not define; a mandate that wants and refuses the
// same row; the ladder word; the acronym with a D; and anything shaped like a credential.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve }                   from 'node:path';
import { fileURLToPath }                            from 'node:url';

const ROOT  = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const SITE  = join(ROOT, 'site');
const IN    = join(SITE, 'team');
const HERE  = '/team/';
const CHECK = process.argv.includes('--check');
const esc   = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const fail  = (m) => { console.error(`team: ${m}`); process.exit(1); };
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const niceDate = (d) => `${parseInt(d.slice(8, 10), 10)} ${MONTHS[parseInt(d.slice(5, 7), 10) - 1]} ${d.slice(0, 4)}`;

// ------------------------------------------------------------------ the vocabulary, pinned
const VOCAB = JSON.parse(readFileSync(join(SITE, 'vaults/claude-code-web/data/vocabulary/capabilities.json'), 'utf8'));
const CAP   = Object.fromEntries(VOCAB.capabilities.map((c) => [c.id, c]));
const BARRIERS = ['none', 'expectation', 'setting', 'boundary'];
const GLYPH    = { none: '●', expectation: '◉', setting: '◐', boundary: '○' };
const BMEAN    = { none: 'nothing in the way', expectation: 'a rule in prose, enforced by nobody', setting: 'a switch the account can flip', boundary: 'enforced above the grant, out of the agent’s reach: a control' };
const TIERS    = ['derived', 'inferred', 'self-reported', 'documented', 'measured', 'observed'];
const UNDO     = ['no', 'with-effort', 'yes'];
const UNDO_LABEL = { no: 'no undo', 'with-effort': 'undo with effort', yes: 'undo' };
const ITIERS   = { public: 'Public', private: 'Private', secret: 'Secret', 'secret-bearing': 'Secret-bearing' };

// ------------------------------------------------------------------ read and check
const team = JSON.parse(readFileSync(join(IN, 'team.json'), 'utf8'));
const agents = team.agents.map((slug) => JSON.parse(readFileSync(join(IN, `${slug}.json`), 'utf8')));
const forbid = (text, where) => {
  if (/\brungs?\b/i.test(text)) fail(`${where}: says rung`);
  if (/\bADP\b/.test(text)) fail(`${where}: says ADP`);
  if (/sgit_private_|sgit_public_|\b[0-9a-f]{64}\b|BEGIN [A-Z ]*PRIVATE KEY/.test(text)) fail(`${where}: carries something shaped like a credential`);
};
forbid(JSON.stringify(team), 'team.json');
for (const a of agents) {
  const w = a.slug;
  forbid(JSON.stringify(a), `${w}.json`);
  for (const k of ['slug', 'name', 'identity', 'one_line', 'runs_as', 'role', 'grant', 'mandate', 'surfaces', 'session']) if (!a[k]) fail(`${w}: missing ${k}`);
  const seen = new Set();
  for (const r of a.grant) {
    if (!CAP[r.capability]) fail(`${w}: ${r.capability} is not one of the 23`);
    if (seen.has(r.capability)) fail(`${w}: ${r.capability} twice`); seen.add(r.capability);
    if (!BARRIERS.includes(r.barrier)) fail(`${w}: ${r.capability} has barrier ${r.barrier}`);
    if (!TIERS.includes(r.evidence)) fail(`${w}: ${r.capability} has evidence ${r.evidence}`);
    if (!UNDO.includes(r.undo)) fail(`${w}: ${r.capability} has undo ${r.undo}`);
    if (!r.note) fail(`${w}: ${r.capability} has no note`);
    if (r.barrier !== 'none' && !r.control) fail(`${w}: ${r.capability} names a barrier and no control`);
    if (r.undo !== CAP[r.capability].undo) fail(`${w}: ${r.capability} undo ${r.undo}; the vocabulary says ${CAP[r.capability].undo}`);
  }
  for (const c of [...a.mandate.want, ...a.mandate.do_not_want]) if (!CAP[c]) fail(`${w}: mandate names ${c}, not one of the 23`);
  for (const c of a.mandate.want) if (a.mandate.do_not_want.includes(c)) fail(`${w}: mandate wants and refuses ${c}`);
  for (const s of a.surfaces) if (!ITIERS[s.tier]) fail(`${w}: surface "${s.name}" has tier ${s.tier}`);
}
for (const t of team.tiers) if (!ITIERS[t.id]) fail(`team: tier ${t.id}`);
for (const s of team.surfaces) if (!ITIERS[s.tier]) fail(`team: surface "${s.name}" has tier ${s.tier}`);

// ------------------------------------------------------------------ the delta, derived
function delta(a) {
  const G = a.grant.map((r) => r.capability), W = a.mandate.want, R = a.mandate.do_not_want;
  const excess    = G.filter((c) => !W.includes(c));
  const refused   = excess.filter((c) => R.includes(c));
  const unstated  = excess.filter((c) => !R.includes(c));
  const unbounded = excess.filter((c) => a.grant.find((r) => r.capability === c).barrier !== 'boundary');
  const shortfall = W.filter((c) => !G.includes(c));
  const aligned   = G.filter((c) => W.includes(c));
  return { grant: G.length, mandate: W.length, excess, refused, unstated, unbounded, shortfall, aligned };
}

// ------------------------------------------------------------------ the page kit
const CSS = `
/* team — who does what, what is public, private and secret, and one behaviour policy per agent */
.phero .meta{font-family:var(--mono);font-size:12px;color:rgba(255,255,255,.6);line-height:1.7;margin-top:6px;max-width:820px}
.phero .meta b{color:rgba(255,255,255,.85)}.phero .meta a{color:inherit}
.tm-note{font-size:15px;line-height:1.75;color:var(--muted);max-width:880px;margin-top:16px}
.tm-note b,.tm-note em{color:var(--text)}.tm-note a,.tm-t a,.tm-card a,.tm-steps a{color:var(--green)}
.tm-k{font-family:var(--mono);font-size:10.5px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--faint)}
.tm-counts{display:flex;flex-wrap:wrap;gap:10px;margin-top:22px}
.tm-count{border:1px solid var(--border);border-radius:var(--r);background:var(--card);padding:12px 16px;min-width:130px}
.tm-count b{display:block;font-size:26px;font-weight:800;letter-spacing:-.02em;color:var(--text);line-height:1.1}
.tm-count.red b{color:var(--red,#C0392B)}.tm-count.green b{color:var(--green)}
.tm-count span{display:block;font-family:var(--mono);font-size:10.5px;letter-spacing:.08em;text-transform:uppercase;color:var(--faint);margin-top:4px}
.tm-t{margin-top:22px;border:1px solid var(--border);border-radius:var(--r);background:var(--card);overflow:hidden}
.tm-r{display:grid;border-top:1px solid var(--border)}
.tm-r:first-child{border-top:0;background:var(--bg2)}
.tm-r>span{padding:11px 14px;font-size:13.5px;line-height:1.6;color:var(--muted)}.tm-r>span+span{border-left:1px solid var(--border)}
.tm-r:first-child>span{font-family:var(--mono);font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--text)}
.tm-r>span:first-child{color:var(--text);font-weight:600}.tm-r .id{font-family:var(--mono);font-size:11px;color:var(--faint);display:block;font-weight:400}
.tm-r code{font-family:var(--mono);font-size:12px;color:var(--text);background:var(--bg2);padding:1px 5px;border-radius:4px}
.tm-t.who .tm-r{grid-template-columns:minmax(0,1fr) minmax(0,1.6fr) minmax(0,1.6fr)}
.tm-t.grant .tm-r{grid-template-columns:minmax(0,1.25fr) minmax(0,.8fr) minmax(0,.6fr) minmax(0,2.4fr)}
.tm-t.surf .tm-r{grid-template-columns:minmax(0,1.3fr) minmax(0,.6fr) minmax(0,1fr) minmax(0,1.2fr) minmax(0,1.6fr)}
.tm-t.surf4 .tm-r{grid-template-columns:minmax(0,1.3fr) minmax(0,.6fr) minmax(0,1.2fr) minmax(0,1.2fr)}
.tm-t.tool .tm-r{grid-template-columns:minmax(0,1.1fr) minmax(0,2.2fr) minmax(0,.9fr)}
.tm-t.bound .tm-r{grid-template-columns:minmax(0,1.2fr) minmax(0,1.4fr) minmax(0,.8fr) minmax(0,1.6fr)}
.tm-t.reads .tm-r{grid-template-columns:minmax(0,1.2fr) minmax(0,1.8fr)}
.tm-b{display:inline-block;font-family:var(--mono);font-size:11px;white-space:nowrap}
.tm-b.boundary{color:var(--green)}.tm-b.none{color:var(--red,#C0392B)}.tm-b.setting,.tm-b.expectation{color:var(--gold)}
.tm-tier{display:inline-block;font-family:var(--mono);font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;border-radius:999px;padding:3px 9px;white-space:nowrap}
.tm-tier.public{background:var(--greenBg);color:var(--green)}.tm-tier.private{background:var(--goldBg,rgba(180,83,9,.1));color:var(--gold)}
.tm-tier.secret,.tm-tier.secret-bearing{background:rgba(192,57,43,.09);color:var(--red,#C0392B)}
.tm-cards{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;margin-top:26px}
.tm-card{border:1px solid var(--border);border-radius:var(--r);background:var(--card);padding:20px 20px 18px;border-top:4px solid var(--border)}
.tm-card.public{border-top-color:var(--green)}.tm-card.private{border-top-color:var(--gold)}.tm-card.secret{border-top-color:var(--red,#C0392B)}
.tm-card h3{font-size:18px;color:var(--text);margin:0 0 8px;letter-spacing:-.01em}
.tm-card p{font-size:13.5px;line-height:1.65;color:var(--muted);margin:0 0 8px}.tm-card p b{color:var(--text)}
.tm-card ul{margin:8px 0 0;padding-left:18px;font-size:13px;line-height:1.6;color:var(--muted)}
.tm-steps{counter-reset:s;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;margin-top:26px}
.tm-step{position:relative;border:1px solid var(--border);border-radius:var(--r);background:var(--card);padding:18px 18px 16px}
.tm-step::before{counter-increment:s;content:counter(s,decimal-leading-zero);font-family:var(--mono);font-size:12px;font-weight:700;color:var(--green)}
.tm-step h3{font-size:15px;color:var(--text);margin:8px 0 4px}.tm-step .who{font-family:var(--mono);font-size:10.5px;letter-spacing:.08em;text-transform:uppercase;color:var(--faint)}
.tm-step p{font-size:13.5px;line-height:1.6;color:var(--muted);margin-top:6px}.tm-step .ev{font-family:var(--mono);font-size:11px;color:var(--faint);border-top:1px dashed var(--border);margin-top:10px;padding-top:8px;line-height:1.6}
.tm-fig{margin:26px 0 0;max-width:980px}.tm-fig svg{display:block;width:100%;height:auto;border:1px solid var(--border);border-radius:var(--r);background:var(--card)}
.tm-fig figcaption{margin-top:10px;font-family:var(--mono);font-size:11px;line-height:1.7;color:var(--faint)}
.tm-list{margin:18px 0 0;padding-left:20px;max-width:880px;font-size:14.5px;line-height:1.7;color:var(--muted)}.tm-list li+li{margin-top:6px}.tm-list b{color:var(--text)}
.tm-caps{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}.tm-caps code{font-family:var(--mono);font-size:11.5px;background:var(--bg2);border:1px solid var(--border);border-radius:6px;padding:3px 8px;color:var(--text)}
.tm-caps code.red{border-color:rgba(192,57,43,.4);color:var(--red,#C0392B)}.tm-caps code.green{border-color:rgba(26,127,90,.4);color:var(--green)}
.tm-box{margin-top:22px;border:1px solid var(--border);border-radius:var(--r);background:var(--card);overflow:hidden;max-width:960px}
.tm-bar{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 14px;background:var(--bg2);border-bottom:1px solid var(--border);font-family:var(--mono);font-size:11px;color:var(--muted)}
.tm-copy{font-family:var(--sans);font-size:13px;font-weight:600;padding:8px 13px;border-radius:var(--r-sm);border:1px solid var(--green);background:var(--green);color:var(--card);cursor:pointer}
.tm-prompt{margin:0;padding:18px 20px;font-family:var(--mono);font-size:12.5px;line-height:1.7;color:var(--text);white-space:pre-wrap;overflow-wrap:anywhere}
.tm-src{position:absolute;left:-9999px;top:0;width:1px;height:1px;opacity:0}
.tm-agents{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:26px}
.tm-agent{border:1px solid var(--border);border-radius:var(--r);background:var(--card);padding:20px;text-decoration:none;color:inherit;display:block}
.tm-agent:hover{border-color:var(--green)}.tm-agent *{text-decoration:none}
.tm-agent h3{font-size:19px;color:var(--text);margin:4px 0 6px}.tm-agent .id{font-family:var(--mono);font-size:11px;color:var(--faint)}.tm-agent p{font-size:13.5px;line-height:1.65;color:var(--muted)}
.tm-agent .nums{display:flex;gap:14px;margin-top:12px;flex-wrap:wrap}.tm-agent .nums span{font-family:var(--mono);font-size:11px;color:var(--muted)}.tm-agent .nums b{color:var(--text);font-size:15px;margin-right:4px}
@media (max-width:900px){.tm-cards,.tm-steps{grid-template-columns:1fr 1fr}.tm-t .tm-r{grid-template-columns:1fr 1fr !important}.tm-r:first-child{display:none}.tm-r>span:first-child{grid-column:1 / -1;border-bottom:1px solid var(--border)}.tm-r>span:nth-child(2){border-left:0}.tm-r>span:nth-child(even){border-left:0}.tm-r>span:nth-child(n+4){border-top:1px dashed var(--border)}.tm-r>span[data-k]::before{content:attr(data-k);display:block;font-family:var(--mono);font-size:9.5px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--faint);margin-bottom:3px}}
@media (max-width:640px){.tm-cards,.tm-steps,.tm-agents{grid-template-columns:1fr}.tm-t .tm-r{grid-template-columns:1fr !important}.tm-r>span+span{border-left:0 !important;border-top:1px dashed var(--border)}.tm-r>span:first-child{border-bottom:0}}
`;

const donor = readFileSync(join(SITE, 'pricing.html'), 'utf8');
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

const tier   = (t) => `<span class="tm-tier ${esc(t)}">${esc(ITIERS[t] || t)}</span>`;
const bpill  = (b) => `<span class="tm-b ${b}">${GLYPH[b]} ${esc(b)}</span>`;
const capsOf = (list, cls) => `<div class="tm-caps">${list.length ? list.map((c) => `<code${cls ? ` class="${cls}"` : ''} title="${esc(CAP[c].gloss)}">${esc(c)}</code>`).join('') : '<code>none</code>'}</div>`;
const copyScript = (btn, src, label) => `<script>
(function () {
  'use strict';
  var b = document.getElementById('${btn}'), src = document.getElementById('${src}');
  if (!b || !src) return;
  b.addEventListener('click', function () {
    var text = src.value, done = function () { b.textContent = 'Copied'; setTimeout(function () { b.textContent = '${label}'; }, 2000); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, function () { src.select(); document.execCommand('copy'); done(); });
    else { src.select(); document.execCommand('copy'); done(); }
  });
})();
</script>`;

// ------------------------------------------------------------------ the figure: what flows where
// Three tiers, three places, one party that touches two of them. Static SVG, the site's tokens.
function flowsFigure() {
  const G = '#1A7F5A', GOLD = '#B45309', RED = '#C0392B', INK = '#0D0D0C', MUTED = '#6b6a66', BORDER = '#dcdad4', PAPER = '#F7F6F2';
  const box = (x, y, w, h, stroke, fill, label, sub, dash) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="${fill}" stroke="${stroke}" stroke-width="1.6"${dash ? ' stroke-dasharray="6 4"' : ''}/><text x="${x + 14}" y="${y + 24}" font-family="ui-sans-serif,system-ui,sans-serif" font-size="14" font-weight="700" fill="${INK}">${esc(label)}</text>${sub ? sub.map((s, i) => `<text x="${x + 14}" y="${y + 44 + i * 16}" font-family="ui-monospace,Menlo,monospace" font-size="10.5" fill="${MUTED}">${esc(s)}</text>`).join('') : ''}`;
  // a label sits beside a vertical arrow and above a horizontal one, on a paper-coloured pad
  const arrow = (x1, y1, x2, y2, color, label, dash, lx, ly) => {
    const vertical = Math.abs(x2 - x1) < Math.abs(y2 - y1), placed = lx !== undefined;
    const tx = lx ?? (vertical ? Math.max(x1, x2) + 8 : (x1 + x2) / 2), ty = ly ?? (vertical ? (y1 + y2) / 2 + 4 : (y1 + y2) / 2 - 8);
    const w = label ? label.length * 6.1 + 8 : 0, start = vertical || placed, px = start ? tx - 4 : tx - w / 2;
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="1.8"${dash ? ' stroke-dasharray="5 4"' : ''} marker-end="url(#a-${color.slice(1)})"/>${label ? `<rect x="${px}" y="${ty - 10}" width="${w}" height="14" rx="3" fill="${PAPER}" opacity=".92"/><text x="${tx}" y="${ty}" text-anchor="${start ? 'start' : 'middle'}" font-family="ui-monospace,Menlo,monospace" font-size="10" fill="${color}">${esc(label)}</text>` : ''}`;
  };
  const chip = (x, y, color, text) => `<rect x="${x}" y="${y}" width="${text.length * 6.6 + 16}" height="18" rx="9" fill="${color}" opacity=".12"/><text x="${x + 8}" y="${y + 12.5}" font-family="ui-monospace,Menlo,monospace" font-size="10" font-weight="700" fill="${color}">${esc(text)}</text>`;
  return `<svg viewBox="0 0 980 470" role="img" aria-label="What flows where: the lead hands keys to two agents in a session; the designer writes into its own folders of the private vault; the publisher pulls the vault, writes the repository, and a push to dev deploys the public site after the check; secrets never cross into the public tree.">
  <defs>${[G, GOLD, RED, MUTED].map((c) => `<marker id="a-${c.slice(1)}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="${c}"/></marker>`).join('')}</defs>
  <rect x="0" y="0" width="980" height="470" fill="${PAPER}"/>
  ${chip(24, 20, RED, 'SECRET')}${chip(24, 150, GOLD, 'PRIVATE')}${chip(24, 300, G, 'PUBLIC')}
  <line x1="20" y1="140" x2="960" y2="140" stroke="${BORDER}" stroke-dasharray="3 5"/><line x1="20" y1="290" x2="960" y2="290" stroke="${RED}" stroke-width="1.6" stroke-dasharray="4 4"/><text x="956" y="284" text-anchor="end" font-family="ui-monospace,Menlo,monospace" font-size="10" font-weight="700" fill="${RED}">no secret crosses this line</text>
  ${box(120, 30, 200, 84, RED, '#fff', 'The lead', ['decides; holds every key', 'hands a key in a session', 'never in a file'])}
  ${box(380, 30, 230, 84, RED, '#fff', 'The designer’s conversation', ['the vendor keeps it', 'the token was pasted here', 'secret-bearing'])}
  ${box(670, 30, 250, 84, RED, '#fff', 'The publisher’s session', ['the platform keeps the transcript', 'key and token arrive here, one session', 'secret-bearing'])}
  ${box(120, 160, 490, 112, GOLD, '#fff', 'The stories vault (encrypted)', ['designer’s folders: artwork/ stories/ cast/ decisions/', 'mail/: one folder per party, a mailroom each, immutable messages', 'published/: the mirror of what is live · board/: derived'])}
  ${box(670, 160, 250, 112, GOLD, '#fff', 'The publisher (publisher.claude)', ['pulls the vault, reads everything', 'writes only its own folder, the mailrooms,', 'published/ and board/', 'checks against the rules; asks; publishes'])}
  ${box(120, 310, 250, 120, G, '#fff', 'The repository', ['site/ docs/ .claude/ · open source', 'the publisher’s branch, then dev', 'no branch rule at the host'])}
  ${box(420, 310, 220, 120, G, '#fff', 'CI', ['40 tests, every --check', 'the credential test on site/', 'deploy needs the check green', '(a setting: the workflow is in the tree)'])}
  ${box(690, 310, 230, 120, G, '#fff', 'riskmandate.ai', ['served from site/ on dev', '/team/ · /stories/ · /admin/', 'the board: ids and titles, no bodies'])}
  ${arrow(220, 114, 220, 160, RED, 'read key, by hand')}
  ${arrow(320, 72, 380, 72, RED, 'token', false, 330, 62)}
  ${arrow(610, 72, 670, 72, RED, 'key + token', false, 606, 62)}
  ${arrow(495, 114, 495, 160, GOLD, 'the designer: files, messages')}
  ${arrow(795, 114, 795, 160, RED, 'one session')}
  ${arrow(670, 216, 610, 216, GOLD, 'pull · push', false, 614, 206)}
  ${arrow(700, 272, 245, 310, G, 'its branch; then dev, after the check', false, 380, 300)}
  ${arrow(370, 370, 420, 370, G, 'push to dev', false, 356, 358)}
  ${arrow(640, 370, 690, 370, G, 'deploy', false, 646, 358)}
  <text x="24" y="452" font-family="ui-monospace,Menlo,monospace" font-size="10" fill="${MUTED}">By the enforcer test: the proxy and the token scope are boundaries; the merge command, CI and the tests are settings; the rest is prose.</text>
  <text x="24" y="466" font-family="ui-monospace,Menlo,monospace" font-size="10" fill="${MUTED}">After a publish the publisher copies what is live back into published/, on the pull · push arrow.</text>
</svg>`;
}

// ------------------------------------------------------------------ the section page
function indexPage() {
  const A = Object.fromEntries(agents.map((a) => [a.slug, { ...a, d: delta(a) }]));
  const body = `<main class="phero">
  <div class="wrap">
    <span class="eyebrow"><span class="d"></span> The team</span>
    <h1>Who does what, <span class="it">and what stands in the way.</span></h1>
    <p class="sub" style="margin-bottom:20px">This site is made by one person and two agents. The agents are described the way the site describes any agent: an Agent Behaviour Policy each, in the same grammar as the catalogue, with the grant measured on the thing itself, the mandate in the lead&rsquo;s words, the gap derived, and a barrier on every row. Around them, three tiers of information and the workflow that moves a story from private to public.</p>
    <p class="meta"><b>Nothing here is scored.</b> A count is a count; a barrier is what it is. Where the honest answer is a rule in prose, the page says so.</p>
    <p class="meta"><b>As at</b> ${niceDate(team.as_at)}. If the deployment changes, this page changes; the vaults and the tests that hold it true are listed in section 06.</p>
  </div>
</main>

<div class="paper">

<section class="psection">
  <div class="wrap">
    <div class="shead">
      <span class="tag">01 · Who</span>
      <h2>One person, <span class="g">two agents.</span></h2>
    </div>
    <div class="tm-t who" role="table" aria-label="The people">
      <div class="tm-r" role="row"><span role="columnheader">Who</span><span role="columnheader">Does</span><span role="columnheader">Holds</span></div>
      ${team.people.map((p) => `<div class="tm-r" role="row"><span role="cell">${esc(p.name)}<span class="id">${esc(p.identity)} · ${esc(p.alias)}</span></span><span role="cell" data-k="Does">${esc(p.does)} <em>${esc(p.note)}</em></span><span role="cell" data-k="Holds">${p.holds.map(esc).join('; ')}.</span></div>`).join('\n      ')}
    </div>
    <div class="tm-agents">
      ${agents.map((a) => { const d = A[a.slug].d; return `<a class="tm-agent" href="${HERE}${esc(a.slug)}.html"><span class="id">${esc(a.identity)} · ${esc(a.alias)} · ${esc(a.shape.label)}</span><h3>${esc(a.name)}</h3><p>${esc(a.one_line)}</p><div class="nums"><span><b>${d.grant}</b>grant</span><span><b>${d.mandate}</b>mandate</span><span><b>${d.excess.length}</b>excess</span><span><b>${d.unbounded.length}</b>unbounded</span><span><b>${d.shortfall.length}</b>shortfall</span></div></a>`; }).join('\n      ')}
    </div>
  </div>
</section>

<section class="psection alt">
  <div class="wrap">
    <div class="shead">
      <span class="tag">02 · Three tiers</span>
      <h2>Public, private, <span class="g">secret.</span></h2>
      <p>Everything the team touches is in one of three tiers, and the rule for each is one sentence. The controls under each are named by what they are under the enforcer test: a boundary is enforced by something the agent cannot reach; a setting can be flipped by the account; prose is a rule somebody wrote.</p>
    </div>
    <div class="tm-cards">
      ${team.tiers.map((t) => `<div class="tm-card ${esc(t.id)}"><h3>${esc(t.label)}</h3><p>${esc(t.what)}</p><p><b>Read by</b> ${esc(t.readers)}. <b>Written by</b> ${esc(t.writers)}.</p><p><b>The rule.</b> ${esc(t.rule)}</p><span class="tm-k">What stands in the way</span><ul>${t.controls.map((c) => `<li>${esc(c)}</li>`).join('')}</ul></div>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="psection">
  <div class="wrap">
    <div class="shead">
      <span class="tag">03 · What flows where</span>
      <h2>One party touches two tiers, <span class="g">and nothing crosses the red line.</span></h2>
      <p>The designer writes into its own folders of the private vault. The publisher pulls the vault, writes the repository, and a push to dev is the public site once the check has passed. The lead hands a key in a session and never in a file. The only thing that goes from the vault to the site without the lead&rsquo;s yes is the board, and the board carries no message.</p>
    </div>
    <figure class="tm-fig">${flowsFigure()}<figcaption>Red: secret, handed over in a session and kept by a platform. Gold: private, the encrypted vault. Green: public, the repository, the check and the site. Every arrow is something that happens on a check-in; the mirror back into the vault rides the pull and push arrow.</figcaption></figure>
  </div>
</section>

<section class="psection alt">
  <div class="wrap">
    <div class="shead">
      <span class="tag">04 · The surfaces</span>
      <h2>Every place a thing can live, <span class="g">and its tier.</span></h2>
    </div>
    <div class="tm-t surf4" role="table" aria-label="The surfaces">
      <div class="tm-r" role="row"><span role="columnheader">Surface</span><span role="columnheader">Tier</span><span role="columnheader">Written by</span><span role="columnheader">Read by</span></div>
      ${team.surfaces.map((s) => `<div class="tm-r" role="row"><span role="cell">${esc(s.name)}<span class="id">${esc(s.lives)}</span></span><span role="cell" data-k="Tier">${tier(s.tier)}</span><span role="cell" data-k="Written by">${esc(s.written_by)}</span><span role="cell" data-k="Read by">${esc(s.read_by)}</span></div>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="psection">
  <div class="wrap">
    <div class="shead">
      <span class="tag">05 · From private to public</span>
      <h2>Seven steps, <span class="g">each with its evidence.</span></h2>
      <p>The workflow that makes a story public. The lead accepts; the publisher checks and ships; the designer never publishes. Every step leaves a file somebody else can find.</p>
    </div>
    <div class="tm-steps">
      ${team.workflow.map((w) => `<div class="tm-step"><span class="who">${esc(w.who)}</span><h3>${esc(w.step)}</h3><p>${esc(w.what)}</p><div class="ev">Evidence: ${esc(w.evidence)}</div></div>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="psection alt">
  <div class="wrap">
    <div class="shead">
      <span class="tag">06 · Controls, checks and tooling</span>
      <h2>What is in place, <span class="g">and what is not.</span></h2>
      <p>The site&rsquo;s own line applies to the site: a prohibition carries its barrier. Most of what holds this team to its rules is a setting or a sentence, and the three things that would make boundaries of them are listed as not in place, without a verdict.</p>
    </div>
    <div class="tm-t tool" role="table" aria-label="Tooling">
      <div class="tm-r" role="row"><span role="columnheader">Tool</span><span role="columnheader">Does</span><span role="columnheader">Status</span></div>
      ${team.tooling.map((t) => `<div class="tm-r" role="row"><span role="cell"><code>${esc(t.name)}</code></span><span role="cell" data-k="Does">${esc(t.does)}</span><span role="cell" data-k="Status">${esc(t.kind)}</span></div>`).join('\n      ')}
    </div>
    <p class="tm-note">The checks each agent runs, and what it never does, are on its page. The tests that hold the public tier are the site&rsquo;s own: <code>npm run check</code> before every merge, the same in CI before every deploy.</p>
  </div>
</section>

<section class="psection">
  <div class="wrap">
    <div class="shead">
      <span class="tag">07 · Start a clean session</span>
      <h2>An agent is a role, a list of skills, <span class="g">and its behaviour policy.</span></h2>
      <p>A new session of either agent starts from nothing and reads three things in order: its role, the skills it needs, and its ABP. Then it runs one check-in. The prompt for each is on its page, with a copy button; the publisher&rsquo;s is also <code>.claude/agents/publisher.md</code> in the repository, the form a Claude Code session loads by name.</p>
    </div>
    <ul class="tm-list">
      ${agents.map((a) => `<li><b><a href="${HERE}${esc(a.slug)}.html#session">${esc(a.name)}</a>.</b> ${esc(a.session.how)}</li>`).join('')}
    </ul>
  </div>
</section>

<section class="psection alt">
  <div class="wrap">
    <div class="shead">
      <span class="tag">What is not done</span>
      <h2>What this page does not have yet.</h2>
    </div>
    <ul class="tm-list">
      <li><b>The policies as vaults.</b> Each agent&rsquo;s policy is in the vault grammar and could be built with the catalogue&rsquo;s generator and pushed with a public read key; today it is two JSON files and this page.</li>
      <li><b>A token scoped to one vault.</b> The one control that would bound three rows for both agents; asked of the sgit team, not answered.</li>
      <li><b>The schedule.</b> The publisher&rsquo;s check-in runs by hand until the key and the token are environment secrets and the lead has said what a scheduled run may decide alone.</li>
      <li><b>An infographic of this page</b>, asked of the designer by message.</li>
    </ul>
  </div>
</section>

</div>

<section class="pcta">
  <div class="wrap">
    <span class="eyebrow"><span class="d"></span> The same idea, for your agents</span>
    <h2>This is what an ABP looks like <span class="it">when it is written about ourselves.</span></h2>
    <p>Sixteen template policies for the shapes people run are in the library; this page is the same grammar turned on the two agents that make the site. If yours would look different, that is the point of writing it down.</p>
    <div class="cta-row"><a class="btn btn-green" href="/agent-behaviour-policy.html">The sixteen examples</a><a class="btn btn-ghost" href="/stories/">The stories these agents make</a></div>
  </div>
</section>`;
  return cut('team/index.html', 'team', 'RiskMandate — The team: who does what, and what stands in the way',
    `One person and two agents make this site. An Agent Behaviour Policy for each agent in the catalogue's grammar, three tiers of information (public, private, secret), every surface with its tier, the workflow from private to public, and the controls, checks and tooling in place and not. Nothing is scored.`, body);
}

// ------------------------------------------------------------------ an agent page
function agentPage(a) {
  const d = delta(a);
  const nameOf = `team-${a.slug}`;
  const order = { no: 0, 'with-effort': 1, yes: 2 };
  const rows = [...a.grant].sort((x, y) => order[x.undo] - order[y.undo] || x.capability.localeCompare(y.capability));
  const body = `<main class="phero">
  <div class="wrap">
    <span class="eyebrow"><span class="d"></span> ${esc(a.identity)} · ${esc(a.alias)}</span>
    <h1>${esc(a.name)}</h1>
    <p class="sub" style="margin-bottom:20px">${esc(a.one_line)}</p>
    <p class="meta"><b>Runs as:</b> ${esc(a.runs_as)} <a href="/abp-vault-${esc(a.shape.vault)}.html">The catalogue&rsquo;s template for the shape</a>.</p>
    <p class="meta"><b>Validity:</b> this describes the deployment shape as at ${niceDate(a.as_at)}. If the risk changed, the deployment changed, not this document. <b>Owner:</b> ${esc(a.owner)}.</p>
    <p class="meta"><b>This page as markdown:</b> <a href="${HERE}${esc(a.slug)}.md">${esc(a.slug)}.md</a> · <b>the data:</b> <a href="${HERE}${esc(a.slug)}.json">${esc(a.slug)}.json</a></p>
    <div class="tm-counts">
      <div class="tm-count"><b>${d.grant}</b><span>grant</span></div>
      <div class="tm-count"><b>${d.mandate}</b><span>mandate</span></div>
      <div class="tm-count"><b>${d.excess.length}</b><span>excess</span></div>
      <div class="tm-count red"><b>${d.unbounded.length}</b><span>unbounded excess</span></div>
      <div class="tm-count"><b>${d.shortfall.length}</b><span>shortfall</span></div>
      <div class="tm-count green"><b>${d.aligned.length}</b><span>aligned</span></div>
    </div>
  </div>
</main>

<div class="paper">

<section class="psection">
  <div class="wrap">
    <div class="shead">
      <span class="tag">01 · The role</span>
      <h2>What it is for, <span class="g">and what it reads first.</span></h2>
      <p>${esc(a.role)}</p>
    </div>
    <p class="tm-k" style="margin-top:22px">Reads at the start of every session, in this order</p>
    <div class="tm-t reads" role="table" aria-label="What it reads at start">
      <div class="tm-r" role="row"><span role="columnheader">File</span><span role="columnheader">Why</span></div>
      ${a.reads_at_start.map((r) => `<div class="tm-r" role="row"><span role="cell"><code>${esc(r.path)}</code></span><span role="cell" data-k="Why">${esc(r.why)}</span></div>`).join('\n      ')}
    </div>
    <p class="tm-k" style="margin-top:22px">Skills</p>
    <ul class="tm-list" style="margin-top:8px">${a.skills.map((s) => `<li><b>${esc(s.name)}</b>: ${esc(s.for)}</li>`).join('')}</ul>
    <p class="tm-note"><b>Tools:</b> ${a.tools.map(esc).join(' · ')}. <b>Reach:</b> <em>host</em> is ${esc(a.reach_names.host)}; <em>tenant</em> is ${esc(a.reach_names.tenant)}; <em>world</em> is ${esc(a.reach_names.world)}.</p>
  </div>
</section>

<section class="psection alt">
  <div class="wrap">
    <div class="shead">
      <span class="tag">02 · The grant</span>
      <h2>${d.grant} of the 23, <span class="g">irreversible first.</span></h2>
      <p>${esc(a.shape.note)} Each row: the primitive, what stands in the way, how we know, and what was done or read. A barrier is a control only in the fourth case.</p>
    </div>
    <div class="tm-t grant" role="table" aria-label="The grant">
      <div class="tm-r" role="row"><span role="columnheader">Capability</span><span role="columnheader">Barrier</span><span role="columnheader">Evidence</span><span role="columnheader">Note, and the control if any</span></div>
      ${rows.map((r) => `<div class="tm-r" role="row"><span role="cell"><code>${esc(r.capability)}</code><span class="id">${esc(CAP[r.capability].gloss)} · ${esc(UNDO_LABEL[r.undo])}${r.material ? ' · ' + esc(r.material) : ''}</span></span><span role="cell" data-k="Barrier">${bpill(r.barrier)}<span class="id">${esc(BMEAN[r.barrier])}</span></span><span role="cell" data-k="Evidence">${esc(r.evidence)}<span class="id">via ${r.via.map(esc).join('; ')}</span></span><span role="cell" data-k="Note">${esc(r.note)}${r.control ? ` <em>Control: ${esc(r.control)}</em>` : ''}</span></div>`).join('\n      ')}
    </div>
    ${(a.not_in_grant || []).length ? `<p class="tm-k" style="margin-top:22px">Not in the grant, and why</p><ul class="tm-list" style="margin-top:8px">${a.not_in_grant.map((n) => `<li><code>${esc(n.capability)}</code>: ${esc(n.why)}</li>`).join('')}</ul>` : ''}
    ${(a.not_in_grammar || []).length ? `<p class="tm-note"><b>Not in the grammar:</b> ${a.not_in_grammar.map(esc).join(' ')}</p>` : ''}
  </div>
</section>

<section class="psection">
  <div class="wrap">
    <div class="shead">
      <span class="tag">03 · The mandate</span>
      <h2>${esc(a.mandate.label)}<span class="g">.</span></h2>
      <p>Authored ${niceDate(a.mandate.authored)} by ${esc(a.mandate.authored_by)}.</p>
    </div>
    <p class="tm-k" style="margin-top:22px">Wanted (${a.mandate.want.length})</p>${capsOf(a.mandate.want, 'green')}
    <p class="tm-k" style="margin-top:18px">Refused (${a.mandate.do_not_want.length})</p>${capsOf(a.mandate.do_not_want, 'red')}
    <p class="tm-k" style="margin-top:18px">Unstated (${d.unstated.length})</p>${capsOf(d.unstated)}
    <ul class="tm-list">${Object.entries(a.mandate.notes || {}).map(([c, n]) => `<li><code>${esc(c)}</code>: ${esc(n)}</li>`).join('')}</ul>
  </div>
</section>

<section class="psection alt">
  <div class="wrap">
    <div class="shead">
      <span class="tag">04 · The delta, derived</span>
      <h2>${d.excess.length} in excess, <span class="g">${d.unbounded.length} unbounded.</span></h2>
      <p>Excess is what the grant has and the mandate did not ask for; unbounded excess is the part of it with nothing in the way but a switch or a sentence. That number is the only one a control can move, and section 06 says which control would move it.</p>
    </div>
    <p class="tm-k" style="margin-top:22px">Excess, refused by the mandate (${d.refused.length})</p>${capsOf(d.refused, 'red')}
    <p class="tm-k" style="margin-top:18px">Excess, unstated (${d.unstated.length})</p>${capsOf(d.unstated)}
    <p class="tm-k" style="margin-top:18px">Unbounded excess (${d.unbounded.length})</p>${capsOf(d.unbounded, 'red')}
    <p class="tm-k" style="margin-top:18px">Shortfall (${d.shortfall.length})</p>${capsOf(d.shortfall)}
    <p class="tm-k" style="margin-top:18px">Aligned (${d.aligned.length})</p>${capsOf(d.aligned, 'green')}
  </div>
</section>

<section class="psection">
  <div class="wrap">
    <div class="shead">
      <span class="tag">05 · The surfaces it touches</span>
      <h2>What it reads, what it writes, <span class="g">and the tier of each.</span></h2>
    </div>
    <div class="tm-t surf" role="table" aria-label="Surfaces">
      <div class="tm-r" role="row"><span role="columnheader">Surface</span><span role="columnheader">Tier</span><span role="columnheader">Reads</span><span role="columnheader">Writes</span><span role="columnheader">What stands in the way</span></div>
      ${a.surfaces.map((s) => `<div class="tm-r" role="row"><span role="cell">${esc(s.name)}</span><span role="cell" data-k="Tier">${tier(s.tier)}</span><span role="cell" data-k="Reads">${esc(s.reads)}</span><span role="cell" data-k="Writes">${esc(s.writes)}</span><span role="cell" data-k="Control">${esc(s.control)}</span></div>`).join('\n      ')}
    </div>
    <p class="tm-k" style="margin-top:22px">Checks</p>
    <ul class="tm-list" style="margin-top:8px">${(a.checks || []).map((c) => `<li><b>${esc(c.when)}:</b> ${esc(c.what)} <em>(${esc(c.kind)})</em></li>`).join('')}</ul>
    <p class="tm-k" style="margin-top:22px">Never</p>
    <ul class="tm-list" style="margin-top:8px">${(a.never || []).map((n) => `<li>${esc(n)}</li>`).join('')}</ul>
  </div>
</section>

<section class="psection alt">
  <div class="wrap">
    <div class="shead">
      <span class="tag">06 · What would bound it</span>
      <h2>The business case for a control, <span class="g">with no verdict in it.</span></h2>
      <p>This provision requires X; the grant does not bound X; a control of type Y at layer Z would bound X. Each line moves rows from the unbounded count.</p>
    </div>
    <div class="tm-t bound" role="table" aria-label="What would bound it">
      <div class="tm-r" role="row"><span role="columnheader">Rows</span><span role="columnheader">Control</span><span role="columnheader">Layer</span><span role="columnheader">Why it would be a boundary</span></div>
      ${(a.what_would_bound || []).map((b) => `<div class="tm-r" role="row"><span role="cell"><code>${esc(b.row)}</code></span><span role="cell" data-k="Control">${esc(b.control)}</span><span role="cell" data-k="Layer">${esc(b.layer)}</span><span role="cell" data-k="Why">${esc(b.why)}</span></div>`).join('\n      ')}
    </div>
    ${(a.research_needed || []).length ? `<p class="tm-k" style="margin-top:22px">Research needed</p><ul class="tm-list" style="margin-top:8px">${a.research_needed.map((r) => `<li><b>${esc(r.question)}</b> ${esc(r.why)} <em>Who: ${esc(r.who)}.</em></li>`).join('')}</ul>` : ''}
  </div>
</section>

<section class="psection" id="session">
  <div class="wrap">
    <div class="shead">
      <span class="tag">07 · Start a clean session</span>
      <h2>The role, the skills, the policy, <span class="g">then one check-in.</span></h2>
      <p>${esc(a.session.how)} <b>Schedule:</b> ${esc(a.session.schedule)}</p>
    </div>
    <div class="tm-box">
      <div class="tm-bar"><span>The prompt</span><button class="tm-copy" id="tm-copy" type="button">Copy the prompt</button></div>
      <pre class="tm-prompt">${esc(a.session.prompt)}</pre>
    </div>
    <textarea class="tm-src" id="tm-src" readonly tabindex="-1" aria-hidden="true">${esc(a.session.prompt)}</textarea>
  </div>
</section>

</div>

<section class="pcta">
  <div class="wrap">
    <span class="eyebrow"><span class="d"></span> The team</span>
    <h2>The other agent, <span class="it">and the three tiers.</span></h2>
    <p>Who does what, what is public, private and secret, the workflow from one to the other, and what is in place and not.</p>
    <div class="cta-row"><a class="btn btn-green" href="${HERE}">The team</a>${agents.filter((o) => o.slug !== a.slug).map((o) => `<a class="btn btn-ghost" href="${HERE}${esc(o.slug)}.html">${esc(o.name)}</a>`).join('')}</div>
  </div>
</section>
${copyScript('tm-copy', 'tm-src', 'Copy the prompt')}`;
  return cut(`team/${a.slug}.html`, nameOf, `RiskMandate — ${a.name}: its Agent Behaviour Policy`,
    `${a.one_line} The grant (${d.grant} of the 23, ${a.grant.filter((r) => r.evidence === 'observed' || r.evidence === 'measured').length} observed or measured), the mandate in the lead's words, the delta derived (${d.excess.length} in excess, ${d.unbounded.length} unbounded), every surface with its tier, what it never does, what would bound it, and the prompt a clean session starts from. Nothing is scored.`, body);
}

// ------------------------------------------------------------------ write, or check
const outputs = { 'team/index.html': indexPage() };
for (const a of agents) outputs[`team/${a.slug}.html`] = agentPage(a);
const stale = [];
for (const [file, want] of Object.entries(outputs)) {
  const path = join(SITE, file);
  const have = existsSync(path) ? readFileSync(path, 'utf8') : null;
  if (have === want) continue;
  if (CHECK) stale.push(file); else writeFileSync(path, want);
}
if (CHECK) { if (stale.length) fail(`stale: ${stale.join(', ')} — run build-team.mjs`); console.log(`team: ${Object.keys(outputs).length} pages up to date`); }
else console.log(`team: wrote ${Object.keys(outputs).length} pages (${agents.length} agents, ${agents.map((a) => `${a.slug}: ${delta(a).unbounded.length} unbounded of ${delta(a).excess.length} excess`).join('; ')})`);
