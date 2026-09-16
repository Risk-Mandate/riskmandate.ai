#!/usr/bin/env node
// build-admin.mjs — the admin console under site/admin/, read off the repository.
//
//   node scripts/site/build-admin.mjs            # write site/admin/
//   node scripts/site/build-admin.mjs --check    # exit 1 if site/admin/ is stale (CI)
//
// The console is the operations surface behind the site: what needs the lead, what is in flight,
// every memo and brief and what became of it, the board, the vaults, the records, the tooling,
// and the agents' front door — the same files an agent reads from `.claude/`, rendered as pages.
// Nothing here is authored twice. Every count is read off a file in this repository and every
// document page is the markdown it is generated from, so the console cannot disagree with the
// repository it describes. Add a brief under docs/briefs/ and rerun: it has a page.
//
// The architecture is adopted from the console at store.sgit.ai/admin/ and the one it was in
// turn adopted from at pt.newsroom.sgit.ai/newsroom/ (both read 16 September 2026): a persistent
// dark rail that groups and carries counts, a shell grid, a page head that names the place, a
// four-rank status scale of which only one rank is filled, and pages that are public but not
// advertised (noindex, out of the sitemap, out of llms.txt, with a markdown twin each).
//
// What the ranks mean HERE — the scale is about what a number costs, not what it is about:
//   r1  needs the lead: a decision, a credential or a call only the project lead holds. The only
//       filled rank, because it is the only thing on this console nobody else can move.
//   r2  waiting on somebody outside this repository: the store's agent, the model site, a vendor.
//   r3  open or in flight: claimable by the next agent, or on a branch now.
//   r4  done, and checked by the gate (npm run check, and merged into dev).
//
// site/admin/ is not in pages.json on purpose: pages.json is the published site, and generate.mjs
// derives the sitemap, llms.txt and the 404 list from it. The console is neither listed nor
// advertised, and this script writes its own twins. tests/site/test_admin.mjs holds it together.

import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync, rmSync, statSync } from 'node:fs';
import { join, dirname, resolve, relative, posix } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT  = join(dirname(fileURLToPath(import.meta.url)), '../..');
const SITE  = join(ROOT, 'site');
const OUT   = 'admin';                                  // under site/
const GH    = 'https://github.com/Risk-Mandate/riskmandate.ai/blob/dev/';
const GHT   = 'https://github.com/Risk-Mandate/riskmandate.ai/tree/dev/';
const HOST  = 'https://dev.vault.sgraph.ai';
const check = process.argv.includes('--check');

const read  = (p) => readFileSync(join(ROOT, p), 'utf8');
const json  = (p) => JSON.parse(read(p));
const ls    = (dir, re = /\.md$/) => existsSync(join(ROOT, dir))
  ? readdirSync(join(ROOT, dir)).filter(f => re.test(f)).sort().map(f => posix.join(dir, f)) : [];
const walk  = (dir) => readdirSync(join(ROOT, dir), { withFileTypes: true }).flatMap(d =>
  d.isDirectory() ? walk(posix.join(dir, d.name)) : d.name.endsWith('.md') ? [posix.join(dir, d.name)] : []).sort();
const esc   = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const slug  = (s) => String(s).toLowerCase().replace(/<[^>]+>/g, '').replace(/&[a-z]+;/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const plural = (n, one, many = one + 's') => `${n} ${n === 1 ? one : many}`;

// ------------------------------------------------------------------ the routes
//
// One console page per document, at a stable address derived from its repository path. Links
// between documents are rewritten to these; a document nobody renders links to GitHub instead.

const ROUTES = [
  [/^docs\/briefs\/(.+)\.md$/,            (m) => `briefs/${m[1]}/`],
  [/^docs\/(.+)\.md$/,                    (m) => `briefs/${m[1].replace(/\//g, '--')}/`],
  [/^\.claude\/briefs\/(T\d+)-.+\.md$/,   (m) => `work/${m[1]}/`],
  [/^\.claude\/briefs\/README\.md$/,      ()  => `work/about-task-briefs/`],
  [/^\.claude\/work\/README\.md$/,        ()  => `work/about-work-files/`],
  [/^\.claude\/work\/(.+)\.md$/,          (m) => `work/branches/${m[1]}/`],
  [/^\.claude\/onboarding\/(.+)\.md$/,    (m) => `agents/${m[1]}/`],
  [/^\.claude\/commands\/(.+)\.md$/,      (m) => `agents/commands/${m[1]}/`],
  [/^CLAUDE\.md$/,                        ()  => `agents/claude-md/`],
];
function route(repoPath) {
  for (const [re, to] of ROUTES) { const m = repoPath.match(re); if (m) return `${OUT}/${to(m)}`; }
  return null;
}

// ---------------------------------------------------------------- the sources

const docs       = walk('docs');
const taskBriefs = ls('.claude/briefs').filter(f => /\/T\d+-/.test(f));
const onboarding = ls('.claude/onboarding');
const commands   = ls('.claude/commands');
const workFiles  = ls('.claude/work').filter(f => !f.endsWith('README.md'));
const register   = json('site/briefs-register.json');
const catalogue  = json('site/vaults/index.json');
const versions   = json('site/versions/index.json');
const editions   = existsSync(join(SITE, 'lab-editions.json')) ? json('site/lab-editions.json').entries : [];
const stateDoc   = read('.claude/onboarding/03-state-and-next.md');
const briefsIdx  = read('.claude/briefs/README.md');

const allDocs = [...docs, ...taskBriefs, '.claude/briefs/README.md', '.claude/work/README.md', ...workFiles, ...onboarding, ...commands, 'CLAUDE.md'];

// ------------------------------------------------------------ document metadata

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
function dateOf(src) {
  const head = src.split('\n').slice(0, 14).join('\n');
  const iso  = head.match(/\b(20\d\d)-(\d\d)-(\d\d)\b/);
  if (iso) return iso[0];
  const long = head.match(/\b(\d{1,2}) (January|February|March|April|May|June|July|August|September|October|November|December)(?: (20\d\d))?\b/);
  if (long) return `${long[3] ?? '2026'}-${String(MONTHS.indexOf(long[2]) + 1).padStart(2, '0')}-${long[1].padStart(2, '0')}`;
  return null;
}
const niceDate = (d) => d ? `${parseInt(d.slice(8, 10), 10)} ${MONTHS[parseInt(d.slice(5, 7), 10) - 1]} ${d.slice(0, 4)}` : '';

function metaOf(repoPath) {
  const src   = read(repoPath);
  const lines = src.split('\n');
  const h1    = lines.find(l => /^# /.test(l));
  const title = h1 ? h1.replace(/^# /, '').trim() : posix.basename(repoPath, '.md');
  // the summary: the first paragraph that is prose rather than a metadata line, a quote,
  // a table row, a heading or a list — the same rule for every document, so no file is special
  const paras = src.split(/\n\s*\n/).map(p => p.trim());
  const start = paras.findIndex(p => p.startsWith('# '));
  const prose = paras.slice(start + 1).find(p => p && !/^(\*\*|>|\||#|-|\d+\.|```|<!--|\[)/.test(p) && p.length > 40);
  const summary = prose ? inline(prose.replace(/\s+/g, ' ')).replace(/<[^>]+>/g, '') : '';
  const kind  = repoPath.startsWith('docs/briefs/') ? posix.basename(repoPath).split('__')[0]
              : repoPath.startsWith('docs/') ? 'document'
              : /\.claude\/briefs\/T/.test(repoPath) ? 'task'
              : repoPath.startsWith('.claude/work/') ? 'branch'
              : repoPath.startsWith('.claude/onboarding/') ? 'onboarding'
              : repoPath.startsWith('.claude/commands/') ? 'prompt' : 'rules';
  return { repoPath, title, date: dateOf(src), summary: summary.length > 260 ? summary.slice(0, 257).replace(/\s\S*$/, '') + '…' : summary, kind, src, url: route(repoPath) };
}
const META = new Map(allDocs.map(p => [p, metaOf(p)]));

// ------------------------------------------------------------- markdown → html
//
// A small renderer for the markdown these documents actually use: ATX headings, paragraphs,
// nested lists, GFM tables, fenced code, quotes, rules; inline code, bold, italic, links and
// bare URLs. Everything is escaped; a document cannot inject markup into the console.

let LINK = (href) => href;   // set per document before rendering
function inline(s) {
  const codes = [];
  s = s.replace(/`([^`]+)`/g, (_, c) => { codes.push(`<code>${esc(c)}</code>`); return `\u0000${codes.length - 1}\u0000`; });
  s = esc(s);
  s = s.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (_, alt, src) => `<img alt="${alt}" src="${esc(LINK(src))}">`);
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, href) => {
    const u = LINK(href); const ext = /^https?:/.test(u) ? ' target="_blank" rel="noopener"' : '';
    return `<a href="${esc(u)}"${ext}>${t}</a>`;
  });
  s = s.replace(/&lt;(https?:\/\/[^&\s]+)&gt;/g, (_, u) => `<a href="${u}" target="_blank" rel="noopener">${u}</a>`);
  s = s.replace(/(^|[\s(])(https?:\/\/[^\s<)]+[^\s<).,;:])/g, (_, pre, u) => `${pre}<a href="${u}" target="_blank" rel="noopener">${u}</a>`);
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/(^|[\s(>\u0001])\*([^*\n]+)\*(?=[\s.,;:)!?<\u0001]|$)/g, '$1<em>$2</em>');
  s = s.replace(/(^|[\s(>\u0001])_([^_\n]+)_(?=[\s.,;:)!?<\u0001]|$)/g, '$1<em>$2</em>');
  return s.replace(/\u0000(\d+)\u0000/g, (_, i) => codes[i]);
}

function blocks(lines) {
  const out = []; let i = 0;
  const isTableStart = (k) => /^\s*\|/.test(lines[k] ?? '') && /^\s*\|?\s*:?-{3,}/.test(lines[k + 1] ?? '');
  const listRe = /^(\s*)([-*+]|\d+[.)])\s+(.*)$/;
  while (i < lines.length) {
    const l = lines[i];
    if (!l.trim()) { i++; continue; }
    if (/^```/.test(l)) {
      const lang = l.slice(3).trim(); const buf = []; i++;
      while (i < lines.length && !/^```/.test(lines[i])) buf.push(lines[i++]);
      i++; out.push(`<pre><code${lang ? ` class="lang-${esc(lang)}"` : ''}>${esc(buf.join('\n'))}</code></pre>`); continue;
    }
    if (/^<!--/.test(l)) { while (i < lines.length && !/-->/.test(lines[i])) i++; i++; continue; }
    const h = l.match(/^(#{1,6})\s+(.*?)\s*#*\s*$/);
    if (h) { const n = h[1].length; out.push(`<h${n} id="${slug(h[2])}">${inline(h[2])}</h${n}>`); i++; continue; }
    if (/^\s*([-*_])\s*\1\s*\1[\s\1]*$/.test(l)) { out.push('<hr>'); i++; continue; }
    if (isTableStart(i)) {
      const rows = []; while (i < lines.length && /^\s*\|/.test(lines[i])) rows.push(lines[i++]);
      const cells = (r) => r.trim().replace(/^\|/, '').replace(/\|$/, '').split(/(?<!\\)\|/).map(c => inline(c.trim().replace(/\\\|/g, '|')));
      const head = cells(rows[0]); const body = rows.slice(2).map(cells);
      out.push(`<div class="tablewrap"><table><thead><tr>${head.map(c => `<th>${c}</th>`).join('')}</tr></thead><tbody>${body.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`);
      continue;
    }
    if (/^>/.test(l)) {
      const buf = []; while (i < lines.length && /^>/.test(lines[i])) buf.push(lines[i++].replace(/^>\s?/, ''));
      out.push(`<blockquote>${blocks(buf).join('')}</blockquote>`); continue;
    }
    const lm = l.match(listRe);
    if (lm) {
      const indent = lm[1].length; const ordered = /\d/.test(lm[2]); const items = [];
      while (i < lines.length) {
        const m = lines[i].match(listRe);
        if (m && m[1].length === indent) { items.push([m[3]]); i++; continue; }
        if (m && m[1].length < indent) break;
        if (lines[i].trim() === '') { // a blank line ends the list unless the next line is still inside it
          const nxt = lines[i + 1] ?? ''; const nm = nxt.match(listRe);
          if ((nm && nm[1].length >= indent) || (/^\s+/.test(nxt) && nxt.search(/\S/) > indent)) { items[items.length - 1].push(''); i++; continue; }
          break;
        }
        if (lines[i].search(/\S/) > indent) { items[items.length - 1].push(lines[i].slice(indent + 2)); i++; continue; }
        break;
      }
      const li = items.map(it => {
        const [first, ...rest] = it;
        const inner = rest.length && rest.some(r => r.trim()) ? blocks(rest).join('') : '';
        return `<li>${inline(first)}${inner}</li>`;
      });
      out.push(`<${ordered ? 'ol' : 'ul'}>${li.join('')}</${ordered ? 'ol' : 'ul'}>`); continue;
    }
    const buf = [];
    while (i < lines.length && lines[i].trim() && !/^(#{1,6}\s|```|>|\s*\|)/.test(lines[i]) && !listRe.test(lines[i]) && !isTableStart(i)) buf.push(lines[i++]);
    out.push(`<p>${inline(buf.join('\n').replace(/\s*\n\s*(?=\*\*[A-Z][^*\n]{1,40}:\*\*)/g, '\u0001').replace(/\s*\n\s*/g, ' ')).replace(/\u0001/g, '<br>')}</p>`);
  }
  return out;
}

function renderDoc(meta, pagePath) {
  const rel  = relTo(pagePath);
  const here = posix.dirname(meta.repoPath);
  LINK = (href) => {
    if (/^(https?:|mailto:|#)/.test(href)) return href;
    const clean = href.split('#')[0]; const hash = href.includes('#') ? '#' + href.split('#')[1] : '';
    const repoPath = posix.normalize(posix.join(here, clean)).replace(/^\.\//, '');
    if (/\.md$/.test(repoPath)) {
      const r = route(repoPath);
      if (r && META.has(repoPath)) return `${rel}${r}${hash}`;
      if (repoPath.startsWith('site/')) return `${rel}${existsSync(join(ROOT, repoPath)) ? repoPath.slice(5) : repoPath.slice(5).replace(/\.md$/, '.html')}${hash}`;
      return `${GH}${repoPath}${hash}`;
    }
    if (repoPath.startsWith('site/')) return `${rel}${repoPath.slice(5)}${hash}`;
    if (/\.(html|json|txt|xml|png|svg|pdf)$/.test(repoPath) && existsSync(join(SITE, repoPath))) return `${rel}${repoPath}${hash}`;
    if (existsSync(join(ROOT, repoPath))) return `${(statSync(join(ROOT, repoPath)).isDirectory() ? GHT : GH)}${repoPath}${hash}`;
    return href;
  };
  // the body without its H1: the page head carries the title
  const lines = meta.src.split('\n'); const h1 = lines.findIndex(l => /^# /.test(l));
  if (h1 >= 0) lines.splice(h1, 1);
  const html = blocks(lines).join('\n');
  LINK = (h) => h;
  return html;
}

// --------------------------------------------------------- the queue and board
//
// The queue is the table in 03-state-and-next.md; a row's column is read off its status word.
// A row is "in flight" when a work file in .claude/work/ names its brief. Nothing is dragged.

function parseTable(md, headerRe) {
  const lines = md.split('\n'); const start = lines.findIndex(l => headerRe.test(l));
  if (start < 0) return [];
  const rows = []; for (let i = start + 2; i < lines.length && /^\|/.test(lines[i]); i++) {
    rows.push(lines[i].replace(/^\|/, '').replace(/\|$/, '').split(/(?<!\\)\|/).map(c => c.trim()));
  }
  return rows;
}
const queueRows = parseTable(stateDoc, /^\|\s*#\s*\|\s*Task\s*\|/).map(([n, task, brief, size, status]) => {
  const briefId = (brief.match(/T\d+/) || [null])[0];
  const claimed = workFiles.filter(f => briefId && new RegExp(`\\b${briefId}\\b`).test(read(f)));
  const s = status.toLowerCase();
  const col = /\bdone\b/.test(s) ? 'done' : /waiting on the lead|\bthe lead\b/.test(s) ? 'lead' : /waiting|blocked/.test(s) ? 'outside' : claimed.length ? 'flight' : 'open';
  return { n, task, briefId, size, status: status.replace(/\*\*/g, ''), col, claimed };
});
const decisions = (() => {
  const m = stateDoc.match(/## Decisions the lead owns[^\n]*\n([\s\S]*?)(?=\n## |\s*$)/);
  return m ? m[1].split('\n').filter(l => /^- /.test(l)).map(l => l.replace(/^- /, '').replace(/\s*\n\s*/g, ' ')) : [];
})();
const briefTable = parseTable(briefsIdx, /^\|\s*Brief\s*\|/).map(([file, task, touches, size]) => ({ file: file.replace(/`/g, ''), task, touches, size, id: (file.match(/T\d+/) || [''])[0] }));

const inflight = workFiles.map(f => {
  const m = META.get(f); const src = m.src;
  const started = (src.match(/\*\*Started:\*\*\s*([0-9-]+)/) || [])[1] ?? null;
  const brief   = (src.match(/\*\*Task brief:\*\*\s*([^\n]+)/) || [])[1]?.replace(/\*\*/g, '').trim() ?? '';
  const scope   = (src.match(/## Scope\s*\n+([\s\S]*?)(?=\n## |\s*$)/) || [])[1]?.split(/\n\s*\n/)[0]?.replace(/\s*\n\s*/g, ' ') ?? '';
  const status  = (src.match(/## Status\s*\n+([\s\S]*?)(?=\n## |\s*$)/) || [])[1]?.trim() ?? '';
  const external = (src.match(/## External state\s*\n+([\s\S]*?)(?=\n## |\s*$)/) || [])[1]?.trim() ?? '';
  return { repoPath: f, branch: m.title.replace(/^#\s*/, ''), started, brief, scope, status, external, url: m.url };
});

// ------------------------------------------------------------------- the vaults

const vaults = catalogue.vaults.map(v => {
  const dir = `site/vaults/${v.slug}`;
  const vj  = existsSync(join(ROOT, dir, 'vault.json')) ? json(`${dir}/vault.json`) : {};
  const g   = existsSync(join(ROOT, dir, 'data/grant.json')) ? json(`${dir}/data/grant.json`) : {};
  const sc  = existsSync(join(ROOT, dir, 'data/scenarios.json')) ? json(`${dir}/data/scenarios.json`).scenarios?.length ?? 0 : 0;
  // measured is read off the rows themselves: how many carry evidence we ran, over how many there are
  const rows = g.grant ?? []; const measuredRows = rows.filter(r => /^(measured|observed)$/.test(r.evidence ?? '')).length;
  return { ...v, status: vj.status ?? '', measured: measuredRows ? `${measuredRows} of ${rows.length}` : null, as_at: vj.as_at ?? '', rows: rows.length,
           open: (g.research_needed ?? []).length, contradictions: (g.contradictions ?? []).length, scenarios: sc,
           page: `abp-vault-${v.slug}.html`, host: `${HOST}/en-gb/#${v.key}:${v.vid}` };
});
const openQuestions = vaults.reduce((a, v) => a + v.open, 0);

// ------------------------------------------------------------------ the memos

const memoItems = [
  ...register.documents.map(d => ({ ...d, kind: 'document', label: d.title, how: d.type })),
  ...register.informal.map(i => ({ ...i, kind: 'informal', label: i.what, how: i.how })),
].sort((a, b) => (b.dated ?? '').localeCompare(a.dated ?? '') || a.id.localeCompare(b.id));
const memoRank = { processed: 4, partly: 3, received: 2, superseded: 3 };
const memosOpen = memoItems.filter(m => m.status !== 'processed' && m.status !== 'superseded').length;

// ------------------------------------------------------------------ the counts

const counts = {
  lead:      queueRows.filter(r => r.col === 'lead').length + decisions.length,
  outside:   queueRows.filter(r => r.col === 'outside').length,
  open:      queueRows.filter(r => r.col === 'open').length,
  flight:    queueRows.filter(r => r.col === 'flight').length,
  done:      queueRows.filter(r => r.col === 'done').length,
  branches:  inflight.length,
  memos:     memoItems.length,
  memosOpen,
  briefs:    docs.length,
  tasks:     taskBriefs.length,
  vaults:    vaults.length,
  measured:  vaults.filter(v => v.measured).length,
  askedFor:  (catalogue.asked_for ?? []).length + (catalogue.functions ?? []).length,
  releases:  (versions.releases ?? []).length,
  editions:  editions.length,
  openQuestions,
};

// ----------------------------------------------------------------- the shell

const relTo = (pagePath) => '../'.repeat(pagePath.split('/').length - 1);   // page path → site root

const RAIL = [
  { h: 'Where it stands', items: [
    { label: 'The console',          to: `${OUT}/` },
    { label: 'Needs the lead',       to: `${OUT}/work/#lead`, count: counts.lead, r1: true },
    { label: 'State and next',       to: route('.claude/onboarding/03-state-and-next.md') },
    { label: 'The vaults',           to: `${OUT}/vaults/`, count: counts.vaults },
    { label: 'How the site reads',   to: 'synthetic-users.html', out: true },
  ]},
  { h: 'The work', items: [
    { label: 'The board',            to: `${OUT}/work/`, count: counts.open + counts.flight },
    { label: 'In flight',            to: `${OUT}/work/#branches`, count: counts.branches },
    { label: 'The memo queue',       to: `${OUT}/memos/`, count: counts.memosOpen },
    { label: 'Briefs written here',  to: `${OUT}/briefs/`, count: counts.briefs },
  ]},
  { h: 'For agents', items: [
    { label: 'The front door',       to: `${OUT}/agents/` },
    { label: 'CLAUDE.md',            to: route('CLAUDE.md') },
    { label: 'Rules of engagement',  to: route('.claude/onboarding/04-rules-of-engagement.md') },
    { label: 'Workflows',            to: route('.claude/onboarding/05-workflows.md') },
    { label: 'The map',              to: route('.claude/onboarding/01-map.md') },
  ]},
  { h: 'The record', items: [
    { label: 'The records',          to: `${OUT}/records/` },
    { label: 'Tooling and the gate', to: `${OUT}/tooling/` },
    { label: 'Versions',             to: 'versions.html', out: true },
    { label: 'Brief register',       to: 'briefs.html', out: true },
    { label: 'The library',          to: 'agent-behaviour-policy.html', out: true },
    { label: 'The repository',       to: 'https://github.com/Risk-Mandate/riskmandate.ai', out: true },
  ]},
];

function href(pagePath, to) {
  if (/^https?:/.test(to)) return to;
  return relTo(pagePath) + to;
}
function rail(pagePath) {
  const me = pagePath.replace(/index\.html$/, '');
  const groups = RAIL.map(g => `
    <div class="rail__group"><h3>${g.h}</h3>${g.items.map(it => {
      const cur = it.to === me ? ' aria-current="page"' : '';
      const ext = /^https?:/.test(it.to);
      return `<a class="nav" href="${esc(href(pagePath, it.to))}"${cur}${ext ? ' target="_blank" rel="noopener"' : ''}>${esc(it.label)}${it.out ? ' <span class="out">↗</span>' : ''}${it.count != null ? `<span class="count${it.r1 && it.count ? ' r1' : ''}">${it.count}</span>` : ''}</a>`;
    }).join('')}</div>`).join('');
  return `<nav class="rail" aria-label="Console">
    <a class="rail__brand" href="${relTo(pagePath)}${OUT}/"><b>Risk<i>Mandate</i></b><span>admin console · <span data-version>v…</span></span></a>${groups}
    <p class="rail__note"><b>Public, and not advertised.</b> Every page here is noindex, out of <code>sitemap.xml</code> and out of <code>llms.txt</code>. Anybody handed the address reads every word. <a href="${relTo(pagePath)}">Back to the site</a>.</p>
  </nav>`;
}

function shell({ path, title, crumb, h1, lede, body, twin, description }) {
  const rel = relTo(path);
  const crumbs = crumb.map(([t, to], i) => i === crumb.length - 1 ? esc(t) : `<a href="${esc(href(path, to))}">${esc(t)}</a>`).join(' / ');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)} · RiskMandate admin</title>
<meta name="description" content="${esc(description)}">
<meta name="robots" content="noindex,follow">
<link rel="canonical" href="https://riskmandate.ai/${path.replace(/index\.html$/, '')}">
<link rel="alternate" type="text/markdown" href="index.md" title="This page as markdown">
<link rel="icon" href="${rel}assets/brand/riskmandate-favicon-32.png" sizes="32x32">
<link rel="icon" href="${rel}assets/brand/riskmandate-mark.svg" type="image/svg+xml">
<link rel="stylesheet" href="${rel}${OUT}/console.css">
<!-- Written by scripts/site/build-admin.mjs from the files it names. Do not edit: rerun the script. -->
</head>
<body class="console">
<div class="c-strip"><div class="row"><b>riskmandate.ai</b><span class="c-sep">/</span><a href="${rel}${OUT}/">admin</a><span class="c-sep">·</span><a href="${rel}">the site</a><span class="c-sep">·</span><a href="${rel}agent-behaviour-policy.html">the library</a><span class="c-sep">·</span><a href="index.md">this page as markdown</a><span class="c-noindex">noindex · not in the sitemap</span></div></div>
<div class="c-disc"><div class="row">Written by the agents that maintain this site and read by a person before it merges. Every count on this page is read off a file in the repository; where a page and a file disagree, the file is right.</div></div>
<div class="shell">
${rail(path)}
<main class="main">
<p class="crumb">${crumbs}</p>
<div class="page-head"><div><h1>${h1}</h1>${lede ? `<p>${lede}</p>` : ''}</div></div>
${body}
<div class="c-foot"><b>An operations surface</b> for the people and agents building this site, public because every page here is. It is not a selling page and nothing on it is for sale. <a href="${rel}">The site</a> · <a href="${rel}agent-behaviour-policy.html">the library</a> · <a href="${rel}versions.html">every release</a> · <a href="${GHT}">the repository</a> · <a href="${GH}scripts/site/build-admin.mjs">the script that wrote this page</a>.</div>
</main>
</div>
<script>
(function(){var el=document.querySelector('[data-version]');if(!el)return;fetch('${rel}versions/index.json',{cache:'no-store'}).then(function(r){return r.json()}).then(function(j){el.textContent='v'+j.latest}).catch(function(){el.textContent='';});})();
</script>
</body>
</html>
`;
}

// a console page's twin: the markdown of its main column, for something reading rather than rendering
function htmlToMd(html) {
  let s = html;
  s = s.replace(/<pre><code[^>]*>([\s\S]*?)<\/code><\/pre>/g, (_, c) => `\n\n\`\`\`\n${c}\n\`\`\`\n\n`);
  s = s.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/g, '\n\n# $1\n\n').replace(/<h2[^>]*>([\s\S]*?)<\/h2>/g, '\n\n## $1\n\n').replace(/<h3[^>]*>([\s\S]*?)<\/h3>/g, '\n\n### $1\n\n').replace(/<h4[^>]*>([\s\S]*?)<\/h4>/g, '\n\n#### $1\n\n');
  s = s.replace(/<thead>[\s\S]*?<tr>([\s\S]*?)<\/tr>[\s\S]*?<\/thead>/g, (_, r) => { const cells = [...r.matchAll(/<th[^>]*>([\s\S]*?)<\/th>/g)].map(m => m[1]); return `\n| ${cells.join(' | ')} |\n|${cells.map(() => '---').join('|')}|\n`; });
  s = s.replace(/<tr[^>]*>([\s\S]*?)<\/tr>/g, (_, r) => `| ${[...r.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map(m => m[1].replace(/\s*\n\s*/g, ' ')).join(' | ')} |\n`);
  s = s.replace(/<li[^>]*>([\s\S]*?)<\/li>/g, (_, c) => `\n- ${c.replace(/\s*\n\s*/g, ' ')}`);
  s = s.replace(/<(?:p|div|blockquote|ul|ol|section|article|table|tbody)[^>]*>/g, '\n\n').replace(/<br\s*\/?>/g, '\n');
  s = s.replace(/<a [^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g, (_, h, t) => t.trim() ? `[${t.replace(/\s*\n\s*/g, ' ')}](${h})` : '');
  s = s.replace(/<(?:b|strong)>([\s\S]*?)<\/(?:b|strong)>/g, '**$1**').replace(/<(?:i|em)>([\s\S]*?)<\/(?:i|em)>/g, '*$1*').replace(/<code>([\s\S]*?)<\/code>/g, '`$1`');
  s = s.replace(/<[^>]+>/g, '');
  s = s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&nearr;/g, '↗');
  return s.split('\n').map(l => l.replace(/[ \t]+$/, '')).join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
}
const twinHead = (title, path, note) => `# ${title}\n\n> ${note}\n> Source: https://riskmandate.ai/${path.replace(/index\.html$/, '')} · noindex · written by scripts/site/build-admin.mjs\n\n`;

// ----------------------------------------------------------------- components

const st = (rank, text) => `<span class="st st--${rank}">${esc(text)}</span>`;
const colRank = { lead: 1, outside: 2, flight: 3, open: 3, done: 4 };
const colName = { lead: 'needs the lead', outside: 'waiting outside', flight: 'in flight', open: 'open', done: 'done' };
const tile = (n, what, sub, r) => `<div class="tile${r ? ` r${r}` : ''}"><b>${n}</b><span>${what}</span>${sub ? `<em>${sub}</em>` : ''}</div>`;
const row2 = (main, side) => `<div class="row2"><div>${main}</div>${side ?? ''}</div>`;
const docRow = (m, pagePath) => row2(
  `<b><a href="${href(pagePath, m.url)}">${inline(m.title)}</a></b>${m.summary ? `<p>${m.summary}</p>` : ''}`,
  `<span class="meta">${m.date ? niceDate(m.date) : ''}${m.kind && m.kind !== 'document' ? ` · ${esc(m.kind)}` : ''}</span>`);

// --------------------------------------------------------------------- pages

const pages = new Map();   // site-relative path → html
const twins = new Map();   // site-relative path → markdown
function page(path, def) {
  const html = shell({ path, ...def });
  pages.set(path, html);
  twins.set(path.replace(/index\.html$/, 'index.md'), def.twin ?? twinHead(def.title, path, def.description) + htmlToMd(def.body.replace(/<h1[\s\S]*?<\/h1>/, '')));
}

// --- one page per document
for (const m of META.values()) {
  const path = `${m.url}index.html`;
  const body = renderDoc(m, path);
  const crumb = m.repoPath.startsWith('docs/') ? [['admin', `${OUT}/`], ['briefs', `${OUT}/briefs/`], [m.repoPath.replace(/^docs\//, '')]]
              : m.repoPath.startsWith('.claude/work/') || /\.claude\/briefs\//.test(m.repoPath) ? [['admin', `${OUT}/`], ['work', `${OUT}/work/`], [m.repoPath.replace(/^\.claude\//, '')]]
              : [['admin', `${OUT}/`], ['agents', `${OUT}/agents/`], [m.repoPath.replace(/^\.claude\//, '')]];
  const kindLabel = { direction: 'a direction brief', review: 'a review', workflow: 'a workflow', architecture: 'an architecture brief', research: 'a research brief', process: 'a process brief', summit: 'a summit brief', vaults: 'a vault brief', implementation: 'an implementation brief', document: 'a document', task: 'a task brief, sized for one agent', branch: 'a work file: one branch, in flight', onboarding: 'an onboarding document, read by every agent', prompt: 'a prompt for a common job; a slash command in Claude Code', rules: 'the rules that are not optional, read automatically by Claude Code' }[m.kind] ?? 'a document';
  page(path, {
    title: m.title.replace(/[*_`]/g, ''), crumb, h1: inline(m.title),
    lede: `${kindLabel[0].toUpperCase() + kindLabel.slice(1)}${m.date ? `, dated ${niceDate(m.date)}` : ''}. The source is <a href="${GH}${m.repoPath}" target="_blank" rel="noopener"><code>${esc(m.repoPath)}</code></a>; this page is that file, rendered.`,
    description: m.summary || `${m.repoPath}, rendered as a console page.`,
    body: `<article class="doc">${body}</article>`,
    twin: twinHead(m.title.replace(/[*_`]/g, ''), path, `Rendered from ${m.repoPath} in the repository. The text below is that file.`) + m.src.replace(/^# .*\n/, '').trim() + '\n',
  });
}

// --- the console index
{
  const path = `${OUT}/index.html`;
  const lead = queueRows.filter(r => r.col === 'lead');
  const body = `
<div class="tiles">
  ${tile(counts.lead, 'need the lead', `${plural(lead.length, 'queue row')}, ${plural(decisions.length, 'decision')}`, 1)}
  ${tile(counts.outside, 'waiting on somebody outside', 'the store\'s agent, the model site', 2)}
  ${tile(counts.branches, 'branches in flight', 'one work file each', 3)}
  ${tile(counts.open, 'open tasks', `of ${queueRows.length} in the queue · ${counts.done} done`, 3)}
  ${tile(counts.memosOpen, 'memos not fully worked', `of ${counts.memos} received`, 3)}
  ${tile(counts.briefs, 'briefs written here', 'one page each', 4)}
  ${tile(counts.vaults, 'vaults built and pushed', `${counts.measured} measured · ${counts.askedFor} asked for`, 4)}
  ${tile(counts.releases, 'releases', `${counts.editions} Lab editions`, 4)}
</div>

<h2 id="lead">Needs the lead — ${counts.lead}</h2>
<p>The only filled rank on this console: a decision, a credential or a call nobody else holds. Read off <a href="${href(path, route('.claude/onboarding/03-state-and-next.md'))}">the state file</a>.</p>
<div class="rows">
${lead.map(r => row2(`<b>${inline(r.task)}</b><p>${esc(r.status)}${r.briefId ? ` · brief <a href="${href(path, `${OUT}/work/${r.briefId}/`)}">${r.briefId}</a>` : ''}</p>`, st(1, `#${r.n}`))).join('')}
${decisions.map((d, i) => row2(`<b>${inline(d)}</b><p>a decision the lead owns, open</p>`, st(1, `D${i + 1}`))).join('')}
</div>

<h2 id="flight">In flight — ${plural(counts.branches, 'branch', 'branches')}</h2>
<p>One file per branch under <code>.claude/work/</code>, written before the work starts and deleted when it merges. Read every one before claiming a task.</p>
<div class="rows">
${inflight.map(w => row2(`<b><a href="${href(path, w.url)}">${esc(w.branch)}</a></b><p>${inline(w.scope)}</p>`, st(3, w.started ? `since ${niceDate(w.started)}` : 'in flight'))).join('') || row2('<b>Nothing in flight.</b><p>No work file under .claude/work/.</p>')}
</div>

<h2>How work gets here</h2>
<p><strong><a href="${href(path, `${OUT}/memos/`)}">The memo queue →</a></strong> — a document or a memo from the project lead arrives, is archived byte for byte and registered by digest, and is read into a brief. What was said and what we made of it are two objects, and only one of them is allowed to be wrong.</p>
<p><strong><a href="${href(path, `${OUT}/briefs/`)}">The briefs →</a></strong> — what was decided and why, written here against a named source, one page each. A brief is broken into task briefs sized for one agent.</p>
<p><strong><a href="${href(path, `${OUT}/work/`)}">The board →</a></strong> — the queue, in four columns. A row moves because its status in the state file moved or because a branch claimed its brief; nothing is dragged.</p>

<h2>Where things are</h2>
<div class="rows">
${row2(`<b><a href="${href(path, `${OUT}/vaults/`)}">The vaults</a></b><p>${counts.vaults} behaviour-policy vaults, each with its id, its public read key, how many rows are measured and how many questions are open.</p>`, st(4, `${counts.openQuestions} open`))}
${row2(`<b><a href="${href(path, `${OUT}/agents/`)}">The agents' front door</a></b><p>CLAUDE.md, the six onboarding documents and the prompts, rendered here so an agent — or a person — can read them without the repository.</p>`, st(3, `${onboarding.length + commands.length + 1} files`))}
${row2(`<b><a href="${href(path, `${OUT}/records/`)}">The records</a></b><p>Every append-only file the site keeps and the page that renders it: versions, the brief register, the Lab editions, the catalogue, the machine-readable indexes.</p>`, st(4, 'append-only'))}
${row2(`<b><a href="${href(path, `${OUT}/tooling/`)}">Tooling and the gate</a></b><p>The scripts under scripts/site/, which of them run in CI, and the five steps a change takes from a branch to the live site.</p>`, st(4, 'npm run check'))}
</div>`;
  page(path, { title: 'The console', crumb: [['admin', `${OUT}/`], ['The console']], h1: 'The console',
    lede: `<strong>Everything here is public</strong>, because every page on this site is — no login, no account, nothing gated. What is different is that it is not <em>advertised</em>: noindex, out of the sitemap, out of <code>llms.txt</code>. Anybody handed the address reads every word.`,
    description: 'The operations console behind riskmandate.ai: what needs the lead, what is in flight, every memo and brief, the board, the vaults, the records and the tooling — every count read off a file in the repository.', body });
}

// --- the board
{
  const path = `${OUT}/work/index.html`;
  const cols = [['open', 'Open', '#545b67'], ['flight', 'In flight', '#1d4ed8'], ['lead', 'Waiting on a ruling', '#95230f'], ['done', 'Done', '#2f6b4f']];
  const inCol = (c) => c === 'lead' ? queueRows.filter(r => r.col === 'lead' || r.col === 'outside') : queueRows.filter(r => r.col === c);
  const card = (r) => {
    const inner = `<span class="tid">#${esc(r.n)}${r.briefId ? ` · ${r.briefId}` : ''} · ${esc(r.size)}</span><b>${inline(r.task)}</b>${r.col === 'lead' || r.col === 'outside' ? `<span class="blocked">${esc(r.status)}</span>` : r.col === 'done' ? `<p>${esc(r.status)}</p>` : ''}${r.claimed.length ? `<span class="who">${r.claimed.map(f => esc(META.get(f).title)).join(', ')}</span>` : ''}`;
    return r.briefId && route(taskBriefs.find(f => f.includes(`/${r.briefId}-`)) ?? '') ? `<a class="bcard" style="--ws:${colRank[r.col] === 1 ? '#95230f' : colRank[r.col] === 2 ? '#8a4b06' : '#b8c0cb'}" href="${href(path, route(taskBriefs.find(f => f.includes(`/${r.briefId}-`))))}">${inner}</a>` : `<div class="bcard" style="--ws:${r.col === 'lead' ? '#95230f' : r.col === 'outside' ? '#8a4b06' : '#b8c0cb'}">${inner}</div>`;
  };
  const body = `
<div class="board">
${cols.map(([c, name, colour]) => `<div class="bcol" style="--col:${colour}"><h3><span class="dot"></span>${name}<span class="n">${inCol(c).length}</span></h3>${inCol(c).map(card).join('') || '<p class="empty">nothing here</p>'}</div>`).join('')}
</div>
<p>The four columns are read off the status column of the queue in <a href="${href(path, route('.claude/onboarding/03-state-and-next.md'))}">the state file</a>: <em>done</em> is done; <em>waiting on the lead</em> is ${st(1, 'needs the lead')}; any other <em>waiting</em> is ${st(2, 'waiting outside')}; a row whose brief a work file names is in flight; the rest are open and claimable. Nothing is dragged, so the board cannot say something the file does not.</p>

<h2 id="lead">Waiting on a ruling — ${counts.lead + counts.outside}, counting the decisions the lead owns</h2>
<div class="rows">
${queueRows.filter(r => r.col === 'lead' || r.col === 'outside').map(r => row2(`<b>${inline(r.task)}</b><p>${esc(r.status)}</p>`, st(colRank[r.col], colName[r.col]))).join('')}
${decisions.map((d, i) => row2(`<b>${inline(d)}</b><p>a decision the lead owns, listed in the state file</p>`, st(1, 'needs the lead'))).join('')}
</div>

<h2 id="branches">In flight — ${plural(counts.branches, 'branch', 'branches')}</h2>
<p>One file per branch under <code>.claude/work/</code>. <a href="${href(path, route('.claude/work/README.md'))}">How a work file is written</a>.</p>
${inflight.map(w => `<div class="panel"><h3><a href="${href(path, w.url)}">${esc(w.branch)}</a></h3><p class="meta">${w.started ? `started ${niceDate(w.started)}` : ''}${w.brief ? ` · task brief: ${inline(w.brief)}` : ''}</p><p>${inline(w.scope)}</p>${w.external ? `<p><strong>External state.</strong> ${inline(w.external.split('\n').map(l => l.replace(/^- /, '')).join(' · '))}</p>` : ''}${w.status ? `<p><strong>Status.</strong> ${inline(w.status.split('\n').filter(l => l.trim()).slice(0, 3).map(l => l.replace(/^- /, '')).join(' · '))}</p>` : ''}</div>`).join('') || '<div class="panel"><p>Nothing in flight.</p></div>'}

<h2 id="briefs">Task briefs — ${counts.tasks}</h2>
<p>Each is a unit of work sized for one branch, with the files it touches named so two agents can see whether they would collide. <a href="${href(path, route('.claude/briefs/README.md'))}">How a task brief is written and claimed</a>.</p>
<div class="kvwrap"><table class="kv"><thead><tr><th>Brief</th><th>Task</th><th>Touches</th><th>Size</th><th>State</th></tr></thead><tbody>
${briefTable.map(b => { const f = taskBriefs.find(t => t.includes(`/${b.id}-`)); const rows = queueRows.filter(r => r.briefId === b.id); const col = rows.some(r => r.col === 'flight') ? 'flight' : rows.every(r => r.col === 'done') && rows.length ? 'done' : rows.some(r => r.col === 'lead') ? 'lead' : rows.some(r => r.col === 'outside') ? 'outside' : 'open';
  return `<tr><td>${f ? `<a href="${href(path, route(f))}">${b.id}</a>` : esc(b.id)}</td><td>${inline(b.task)}</td><td>${inline(b.touches)}</td><td>${esc(b.size)}</td><td>${st(colRank[col], colName[col])}</td></tr>`; }).join('')}
</tbody></table></div>`;
  page(path, { title: 'The board', crumb: [['admin', `${OUT}/`], ['The board']], h1: 'The work',
    lede: `<strong>${queueRows.length} rows in the queue · ${counts.open} open · ${counts.flight} in flight · ${queueRows.filter(r => r.col === 'lead' || r.col === 'outside').length} waiting on a ruling · ${counts.done} done.</strong> Every card is read off one file, and a card moves only because the file did.`,
    description: 'The queue of work on riskmandate.ai as a board: open, in flight, waiting on a ruling, done — read off the state file, the task briefs and the work files.', body });
}

// --- the memo queue
{
  const path = `${OUT}/memos/index.html`;
  const byStatus = (s) => memoItems.filter(m => m.status === s).length;
  const item = (m) => {
    const produced = (m.produced ?? []).map(p => `<a href="${/^https?:/.test(p.url) ? p.url : relTo(path) + p.url}"${/^https?:/.test(p.url) ? ' target="_blank" rel="noopener"' : ''}>${inline(p.what)}</a>`).join(' · ');
    const notDone  = (m.not_done ?? []).map(n => `<li>${inline(n)}</li>`).join('');
    const file = m.file ? `<a href="${relTo(path)}${esc(m.file)}">the file as received</a> · <code>${esc(m.sha256.slice(0, 12))}…</code> · ${Math.round(m.bytes / 1024)} KB` : `<em>${esc(m.how)}</em> — no digest; given as speech, chat text or a link`;
    return `<div class="memo-block" id="${esc(m.id)}"><div class="page-head"><div><p class="crumb">${esc(m.id)} · ${esc(m.kind === 'document' ? m.how : m.how)} · ${niceDate(m.dated)}</p><h2>${inline(m.label)}</h2></div><div>${st(memoRank[m.status] ?? 3, m.status)}</div></div>
      <p class="memo-out">${file}${m.version ? ` · ${esc(m.version)}` : ''}</p>
      ${produced ? `<p><strong>Produced.</strong> ${produced}</p>` : ''}
      ${notDone ? `<p><strong>Not done.</strong></p><ul>${notDone}</ul>` : ''}
      ${m.notes ? `<p><strong>Notes.</strong> ${inline(m.notes)}</p>` : ''}</div>`;
  };
  const body = `
<div class="tiles">
  ${tile(byStatus('received'), 'received, nothing built yet', register.statuses.received, 2)}
  ${tile(byStatus('partly'), 'partly worked', 'read in full; a named part is not built', 3)}
  ${tile(byStatus('processed'), 'processed', 'something on the site exists because of it', 4)}
  ${tile(byStatus('superseded'), 'superseded', 'kept because the reasoning is the record', 3)}
</div>
<p class="lead">The queue. A document or a memo from the project lead arrives — a dev brief as a file, a voice memo as a transcript, an instruction in the thread — and is archived exactly as received: files by SHA-256 in <a href="${relTo(path)}briefs-register.json">the register</a>, so an identical file arriving again is recognised before anybody reads it; speech and chat as an entry with no digest. Then it is read into <a href="${relTo(path)}${OUT}/briefs/">a brief</a>, and the brief is broken into <a href="${relTo(path)}${OUT}/work/">units of work</a>. What was said and what we made of it are kept apart on purpose.</p>
<div class="rows">
${memoItems.map(m => row2(`<b><a href="#${esc(m.id)}">${inline(m.label)}</a></b><p>${esc(m.how)} · ${(m.produced ?? []).length} produced · ${(m.not_done ?? []).length} not done</p>`, st(memoRank[m.status] ?? 3, `${niceDate(m.dated)} · ${m.status}`))).join('')}
</div>

<h2>The four steps</h2>
<ol class="steps">
  <li><b>1 · Capture</b><p>The file goes into <code>site/assets/briefs/</code> byte for byte and its digest into <code>briefs-register.json</code> the moment it arrives. Speech is transcribed and archived the same way; nothing is trimmed.</p></li>
  <li><b>2 · Read</b><p>A brief under <code>docs/briefs/</code>: what was asked, what it changes, what it contradicts, and what is not yet decidable. One page each, <a href="${relTo(path)}${OUT}/briefs/">here</a>.</p></li>
  <li><b>3 · Break</b><p>Task briefs under <code>.claude/briefs/</code>, each sized for one agent and naming the files it touches, and a row in the queue.</p></li>
  <li><b>4 · Track</b><p>The row moves on <a href="${relTo(path)}${OUT}/work/">the board</a>; the register's <em>status</em> and <em>not done</em> say what the memo still owes.</p></li>
</ol>

<h2>What happened to each of them</h2>
${memoItems.map(item).join('')}`;
  page(path, { title: 'The memo queue', crumb: [['admin', `${OUT}/`], ['The memo queue']], h1: 'The memo queue',
    lede: `<strong>${plural(counts.memos, 'item')}: ${register.documents.length} files registered by digest, ${register.informal.length} given as speech or chat.</strong> The public page is <a href="${relTo(path)}briefs.html">the brief register</a>; this is the same record with what each item still owes.`,
    description: 'Every document, memo and instruction riskmandate.ai was built from, in the order it arrived, with what it produced and what it still owes — read off briefs-register.json.', body });
}

// --- the briefs written here
{
  const path = `${OUT}/briefs/index.html`;
  const KINDS = [['direction', 'Direction', 'where the site and the product are going, and why'], ['workflow', 'Workflows', 'a process run once, written down so it can be run again'], ['review', 'Reviews', 'something read against a named source'], ['research', 'Research', 'questions written to be handed to an agent'], ['architecture', 'Architecture', 'how the pieces fit'], ['process', 'Process', 'how the work is done'], ['vaults', 'Vaults', 'which vaults belong here'], ['summit', 'Summit', 'Lisbon 2026'], ['implementation', 'Implementation', 'a first step, built'], ['document', 'Other documents', 'how the site works, and the marketing copy']];
  const metas = docs.map(f => META.get(f)).sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''));
  const body = `
<div class="tiles">
  ${tile(counts.briefs, 'documents under docs/', 'one page each, rendered from the file', 4)}
  ${tile(metas.filter(m => m.kind === 'direction').length, 'direction briefs', 'the product and the site', 3)}
  ${tile(metas.filter(m => m.kind === 'review').length, 'reviews', 'read against a named source', 3)}
  ${tile(metas.filter(m => m.kind === 'workflow').length, 'workflows', 'run once, written to run again', 3)}
</div>
<p class="lead">These were written here, by the agent maintaining the site, in response to <a href="${relTo(path)}${OUT}/memos/">the memos and documents that arrived</a>. Each is read against a named source and dated. Add a file under <code>docs/</code> and rerun <code>build-admin.mjs</code>: it has a page here and a test fails until it does.</p>
<h2>Newest first</h2>
<div class="rows">${metas.map(m => docRow(m, path)).join('')}</div>
${KINDS.filter(([k]) => metas.some(m => m.kind === k)).map(([k, name, what]) => `<h2 id="${k}">${name} <span class="meta">· ${what}</span></h2><div class="rows">${metas.filter(m => m.kind === k).map(m => docRow(m, path)).join('')}</div>`).join('')}`;
  page(path, { title: 'Briefs written here', crumb: [['admin', `${OUT}/`], ['Briefs written here']], h1: 'Briefs written here',
    lede: `<strong>${plural(counts.briefs, 'document')} under <code>docs/</code>, one page each.</strong> The direction, the architecture, the reviews and the workflows, written against a named source. The briefs that arrived from outside are <a href="${relTo(path)}${OUT}/memos/">a different list</a>.`,
    description: 'Every document under docs/ on riskmandate.ai, rendered as a page: direction briefs, reviews, workflows, architecture and research, newest first.', body });
}

// --- the agents' front door
{
  const path = `${OUT}/agents/index.html`;
  const ob = (name) => META.get(onboarding.find(f => f.includes(name)));
  const first = [['CLAUDE.md', META.get('CLAUDE.md'), 'required', 'Read automatically by Claude Code. The ten rules that are not optional, the mechanics in one screen, and the short form of working alongside other agents.'],
                 ['00-start-here', ob('00-start-here'), 'required', 'The reading order by task. Ten minutes to being useful.'],
                 ['02-abp-model', ob('02-abp-model'), 'required', 'The Agent Behaviour Policy condensed: four objects, four barriers, the 23 primitives, the evidence tiers, the vault, the graph.'],
                 ['04-rules', ob('04-rules-of-engagement'), 'required', 'Parallel agents, branches, what conflicts and what to do about it, external state, ownership by surface.']];
  const then  = [[ob('01-map'), 'reference', 'Every document, page family, script, test and register, one line each.'],
                 [ob('03-state-and-next'), 'reference', 'Where the site is and the ordered queue of what is next, with the decisions the lead owns.'],
                 [ob('05-workflows'), 'reference', 'Recipes: add a page, add a vault, cut a release, cut a Lab edition, write a brief, register a document, merge a branch.'],
                 [META.get('.claude/briefs/README.md'), 'work', 'Task briefs sized for one agent each, with the files each touches.'],
                 [META.get('.claude/work/README.md'), 'live', 'One file per in-flight branch. Read before claiming a task; delete on merge.']];
  const body = `
<div class="tiles">
  ${tile(onboarding.length, 'onboarding documents', 'ten minutes, in order', 4)}
  ${tile(counts.tasks, 'task briefs', 'sized for one agent each', 3)}
  ${tile(commands.length, 'prompts', 'slash commands in Claude Code', 4)}
  ${tile(counts.branches, 'branches in flight', 'one work file each', 3)}
</div>
<p class="lead">Most of the work on this site is done by agents, several at a time, on branches that merge into <code>dev</code>. Each one used to read the whole repository to learn it. Now there is a folder written for them, kept current in the same commit as whatever it describes, and rendered here so it can be read without the repository.</p>
<h2>Read first</h2>
<div class="rows">${first.map(([, m, tag, why]) => row2(`<b><a href="${href(path, m.url)}">${esc(m.repoPath)}</a></b><p>${why}</p>`, st(1, tag))).join('')}</div>
<h2>Then, as needed</h2>
<div class="rows">${then.filter(([m]) => m).map(([m, tag, why]) => row2(`<b><a href="${href(path, m.url)}">${esc(m.repoPath)}</a></b><p>${why}</p>`, st(3, tag))).join('')}</div>
<h2>Prompts for the common jobs</h2>
<p>Under <code>.claude/commands/</code>; in Claude Code each is a slash command. They start a job the way the workflows say it should be started.</p>
<div class="rows">${commands.map(f => META.get(f)).map(m => row2(`<b><a href="${href(path, m.url)}">/${esc(posix.basename(m.repoPath, '.md'))}</a></b><p>${m.summary || inline(m.title)}</p>`, st(4, 'prompt'))).join('')}</div>
<div class="panel"><p><strong>A rule in prose bounds nothing.</strong> These files work because every agent reads them first. That is the same sentence every behaviour-policy vault says about its own <code>AGENTS.md</code>, and it is as true here. The tests and the CI checks are the boundaries; the folder is the telling. People collaborating with us start at <a href="${relTo(path)}work.html">Working with us</a> instead.</p></div>`;
  page(path, { title: "The agents' front door", crumb: [['admin', `${OUT}/`], ["The agents' front door"]], h1: 'The front door, so the next agent reads less',
    lede: `<strong>CLAUDE.md, ${onboarding.length} onboarding documents, ${counts.tasks} task briefs, ${commands.length} prompts.</strong> Written for the agent that arrives next; the most honest description of how this site is actually run.`,
    description: "The agents' front door on riskmandate.ai: CLAUDE.md, the onboarding documents, the task briefs and the prompts, rendered as pages.", body });
}

// --- the vaults
{
  const path = `${OUT}/vaults/index.html`;
  const groups = [...new Set(vaults.map(v => v.group ?? 'Other'))];
  const body = `
<div class="tiles">
  ${tile(counts.vaults, 'vaults built and pushed', 'public read key, printed on purpose', 4)}
  ${tile(counts.measured, 'measured on the thing itself', 'at least one row run by us', 4)}
  ${tile(counts.openQuestions, 'open research questions', 'across every grant', 3)}
  ${tile(counts.askedFor, 'asked for, not built', `${(catalogue.asked_for ?? []).length} connectors · ${(catalogue.functions ?? []).length} functions`, 3)}
</div>
<p class="lead">Read off <a href="${relTo(path)}vaults/index.json">the catalogue</a> and each vault's <code>vault.json</code> and <code>data/grant.json</code>. <em>Measured</em> counts rows run on a system we are entitled to run; everything else is documented from the vendor's pages, dated and quoted. No row here is a score: the number of open questions is how much the grant still does not know about itself.</p>
${groups.map(g => `<h2>${esc(g)}</h2><div class="kvwrap"><table class="kv"><thead><tr><th>Vault</th><th>Shape</th><th>Rows</th><th>Measured</th><th>Open</th><th>As at</th><th>Id</th><th></th></tr></thead><tbody>
${vaults.filter(v => (v.group ?? 'Other') === g).map(v => `<tr><td><a href="${relTo(path)}${v.page}">${esc(v.app)}</a><br><span class="meta">${esc(v.title)}</span></td><td><code>${esc(v.shape)}</code></td><td>${v.rows}</td><td>${v.measured ? st(4, v.measured) : st(3, 'documented')}</td><td>${v.open ? st(3, `${v.open} open`) : st(4, 'none')}${v.contradictions ? ` <span class="meta">${plural(v.contradictions, 'contradiction')}</span>` : ''}</td><td>${esc(v.as_at)}</td><td><code>${esc(v.vid)}</code></td><td><a href="${v.host}" target="_blank" rel="noopener">host ↗</a></td></tr>`).join('')}
</tbody></table></div>`).join('')}
<h2>Asked for, not built</h2>
<div class="rows">${[...(catalogue.asked_for ?? []), ...(catalogue.functions ?? [])].map(a => row2(`<b>${esc(a.app)}</b><p>${esc(a.blurb ?? '')}</p>`, st(3, a.note ? a.note.split(' — ')[0] : 'asked for'))).join('')}</div>
<p>The public page for these is <a href="${relTo(path)}agent-behaviour-policy-next.html">what is next</a>, with a vote and a suggestion form.</p>`;
  page(path, { title: 'The vaults', crumb: [['admin', `${OUT}/`], ['The vaults']], h1: 'The vaults',
    lede: `<strong>${counts.vaults} behaviour-policy vaults, ${counts.measured} of them measured, ${counts.openQuestions} open questions between them.</strong> Every one is a public vault with a read key printed on its page; the write key is never here.`,
    description: 'Every behaviour-policy vault on riskmandate.ai with its id, shape, measured rows and open questions, read off the catalogue and each vault\'s data.', body });
}

// --- the records
{
  const path = `${OUT}/records/index.html`; const r = relTo(path);
  const rec = (name, url, kind, why, ext) => row2(`<b><a href="${url}"${ext ? ' target="_blank" rel="noopener"' : ''}>${esc(name)}</a></b><p>${why}</p>`, st(4, kind));
  const body = `
<p class="lead">Each of these is a file a program can fetch, rendered by a page a person can read. Where the two disagree, the file is right and the page is stale. None of them is rewritten: they only grow.</p>
<h2>Versions</h2><div class="rows">
${rec('versions.html', `${r}versions.html`, 'page', 'Every release since the site began, newest first, with the note somebody wrote for it. A release is declared, never incremented; CI tags the commit it names.')}
${rec('versions/index.json', `${r}versions/index.json`, 'file', 'The index the page renders, and the number every page\'s header shows. The single place the current version lives.')}
</div>
<h2>How the site reads to somebody new</h2><div class="rows">
${rec('synthetic-users.html', `${r}synthetic-users.html`, 'page', 'Five invented readers walked through this site one screenshot at a time and interviewed at the end. Everybody in it is invented and the page says so.')}
</div>
<h2>Briefs received</h2><div class="rows">
${rec('briefs.html', `${r}briefs.html`, 'page', 'Every document this site was built from, what it produced and what it did not, with the SHA-256 of each file as received.')}
${rec('briefs-register.json', `${r}briefs-register.json`, 'file', 'The register itself. Hash the brief you sent and look for it here.')}
${rec('the memo queue', `${r}${OUT}/memos/`, 'console', 'The same register, with what each item still owes.')}
</div>
<h2>The Lab's editions</h2><div class="rows">
${rec('lab-editions.json', `${r}lab-editions.json`, 'file', `Every dated PDF ever cut of a Lab page, with its digest — ${counts.editions} so far. A page holds current thinking and changes; an edition is what it said on the day, and is never removed. <a href="${r}lab.html">The Lab</a> lists them.`)}
</div>
<h2>The behaviour-policy vaults</h2><div class="rows">
${rec('vaults/index.json', `${r}vaults/index.json`, 'file', 'The catalogue: every template vault, its vault id and its public read key, the applications asked for and not yet built, and the app vault the renderer lives in.')}
${rec('the vaults', `${r}${OUT}/vaults/`, 'console', 'The catalogue with each vault\'s measured rows and open questions.')}
</div>
<h2>Machine-readable</h2><div class="rows">
${rec('llms.txt', `${r}llms.txt`, 'file', 'The index for an agent: every published page with its title, description and markdown twin. The console is not in it.')}
${rec('llms-full.txt', `${r}llms-full.txt`, 'file', 'The whole published site as one markdown document.')}
${rec('.well-known/agent-content.json', `${r}.well-known/agent-content.json`, 'file', `The structured manifest. <a href="${r}agents.html">The agents page</a> explains all three.`)}
${rec('sitemap.xml', `${r}sitemap.xml`, 'file', 'Every published page and nothing that is not one; a test says so.')}
</div>`;
  page(path, { title: 'The records', crumb: [['admin', `${OUT}/`], ['The records']], h1: 'Everything the site keeps, and where it is kept',
    lede: `<strong>${counts.releases} releases, ${counts.memos} registered items, ${counts.editions} Lab editions, ${counts.vaults} vaults.</strong> Append-only, every one.`,
    description: 'The append-only records riskmandate.ai keeps — versions, the brief register, the Lab editions, the vault catalogue, the machine-readable indexes — and where each lives.', body });
}

// --- tooling and the gate
{
  const path = `${OUT}/tooling/index.html`;
  const scripts = [
    ['generate.mjs', 'The markdown twin of every page, <code>sitemap.xml</code>, <code>llms.txt</code>, <code>robots.txt</code>, <code>404.html</code>, <code>versions.md</code>; injects the menu from <code>pages.json</code>', 'yes'],
    ['build-admin.mjs', 'This console: every page under <code>site/admin/</code> and its twin, read off the repository', 'yes'],
    ['release.mjs', 'Cuts a version: the notes stub, the index entry, the version chip on every page, the package version', 'no'],
    ['new-page.mjs', 'Scaffolds a page with the current chrome copied from a donor page, so a new page cannot drift from the site it joins', 'no'],
    ['build-abp-vault.mjs', 'Derives one behaviour-policy vault from its inputs: the documents, the delta, the validity statement, a deterministic zip, the loader, the history. Refuses to write a delta it cannot reproduce', 'yes, every vault'],
    ['build-abp-pages.mjs', 'The library page and one page per vault, from the catalogue and each vault\'s data; stamps the download manifest', 'yes'],
    ['render-lab-pdfs.mjs', 'Cuts a dated PDF edition of a Lab page when its content moved, and registers its digest', 'check only'],
    ['add-licence-chrome.mjs', 'The GitHub link in every header and the licence line in every footer', 'yes'],
    ['sync-modules.mjs', 'Pushes a change to a shared JS module into every page that inlines it', 'yes'],
    ['render-abp-vault-pdf.mjs, render-booth-panel.mjs, render-business-card.mjs, render-brand-exports.mjs', 'Print and download assets, rendered from the pages with a headless browser', 'no'],
  ];
  const body = `
<p class="lead"><code>site/</code> is what is served, byte for byte. The scripts under <code>scripts/site/</code> derive the files that must agree with the pages, and every one with a <code>--check</code> runs in CI so a page cannot ship with a stale twin, a hand-edited delta or a missing licence line.</p>
<div class="kvwrap"><table class="kv"><thead><tr><th>Script</th><th>Does</th><th>In CI</th></tr></thead><tbody>
${scripts.map(([s, d, ci]) => `<tr><td><code>${esc(s)}</code></td><td>${d}</td><td>${esc(ci)}</td></tr>`).join('')}
</tbody></table></div>
<h2>The gate</h2>
<ul>
  <li><strong>The tests</strong> are <code>node --test tests/site/*.mjs</code>: whole documents, every internal link and anchor, one version and one menu everywhere, the sitemap, the registers against their digests, no read key on a mockup, no write credential anywhere, every document under <code>docs/</code> rendered here.</li>
  <li><strong>The pipeline</strong> is <code>.github/workflows/ci-pipeline.yml</code>: on a push to <code>dev</code>, <code>qa</code> or <code>main</code> it runs the checks, tags the commit with the version the record declares, and deploys <code>site/</code> to GitHub Pages. Any of the three deploys the one live site.</li>
  <li><strong>Locally</strong>, <code>bash scripts/run-locally__riskmandate_ai.sh</code> serves the site on <code>localhost</code>, which matters: the vault pages decrypt in the browser and need a secure context.</li>
  <li><strong>Everything CI runs</strong> is one command, <code>npm run check</code>. If it is not green, the change is not done.</li>
</ul>
<h2>How a change ships</h2>
<ol class="steps">
  <li><b>Branch from <code>dev</code>, and say what you are doing</b><p>One file in <code>.claude/work/</code> names the branch, its scope, the files it will touch and the vaults it will push. Other agents read it before they start.</p></li>
  <li><b>Edit the page, then regenerate</b><p>The page is the source; its twin, the sitemap and the index are derived. Generated files are never hand-edited and never hand-merged.</p></li>
  <li><b>Check</b><p><code>npm run check</code> is the gate, locally and in CI.</p></li>
  <li><b>Merge <code>dev</code> in, then cut the release last</b><p>The version restamps every page, so it is the final commit before the merge and the number is claimed at merge time. Move the third number by default. The note says what changed, why, and what was deliberately not done.</p></li>
  <li><b>Merge into <code>dev</code>, which is live</b><p>CI checks, tags <code>v&lt;version&gt;</code>, and deploys. A wrong deploy is fixed forward with the next release; nothing is force-pushed.</p></li>
</ol>`;
  page(path, { title: 'Tooling and the gate', crumb: [['admin', `${OUT}/`], ['Tooling and the gate']], h1: 'No build step, and a few scripts that keep it honest',
    lede: `<strong>${scripts.length} scripts, one gate.</strong> Everything CI runs is <code>npm run check</code>.`,
    description: 'The maintenance scripts behind riskmandate.ai, which of them run in CI, and the five steps a change takes from a branch to the live site.', body });
}

// ------------------------------------------------------------------- write

const files = new Map([...pages, ...twins]);
const expected = new Set([...files.keys(), `${OUT}/console.css`]);
const existing = existsSync(join(SITE, OUT)) ? readdirSync(join(SITE, OUT), { recursive: true }).map(String).map(f => posix.join(OUT, f.split('\\').join('/'))).filter(f => !statSync(join(SITE, f)).isDirectory()) : [];
const orphans = existing.filter(f => !expected.has(f));

const stale = [];
for (const [name, body] of files) {
  const path = join(SITE, name);
  const now  = existsSync(path) ? readFileSync(path, 'utf8') : null;
  if (now === body) continue;
  if (check) { stale.push(name); continue; }
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, body);
  console.log(`  ${now === null ? 'new  ' : 'wrote'} site/${name}`);
}
for (const o of orphans) {
  if (check) { stale.push(`${o} (orphan)`); continue; }
  rmSync(join(SITE, o)); console.log(`  removed site/${o}`);
}
if (!existsSync(join(SITE, OUT, 'console.css'))) stale.push(`${OUT}/console.css (missing — it is authored, not generated)`);
if (check && stale.length) { console.error(`site/${OUT}/ is stale — run: node scripts/site/build-admin.mjs\n  ${stale.join('\n  ')}`); process.exit(1); }
console.log(check ? `  admin console: ${files.size} files are current` : `  admin console: ${files.size} files — ${plural(pages.size, 'page')}, ${counts.lead} need the lead`);
