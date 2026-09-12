// generate.mjs — the derived files under site/, rebuilt from the pages themselves.
//
//   node scripts/site/generate.mjs          write them
//   node scripts/site/generate.mjs --check  fail if what is on disk is stale
//
// Everything here is generated from something else that is already the truth:
// the markdown twins from the pages, the sitemap and llms.txt from the page
// list, versions.md from versions/index.json. Nothing is authored twice. This
// is NOT a build step — site/*.html is what gets deployed, unchanged, and these
// files are committed alongside it. The --check mode runs in CI so a page can
// never ship with a stale twin.

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve }                               from 'node:path';
import { fileURLToPath }                                        from 'node:url';

const ROOT   = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const SITE   = join(ROOT, 'site');
const ORIGIN = 'https://riskmandate.ai';

const read = (f) => readFileSync(join(SITE, f), 'utf8');

// ------------------------------------------------------------- html → markdown

const ENTITIES = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', hellip: '…',
  mdash: '—', ndash: '–', rsquo: '’', lsquo: '‘', ldquo: '“', rdquo: '”',
  times: '×', middot: '·', check: '✓', deg: '°', euro: '€', pound: '£'
};

const decode = (s) => s
  .replace(/&#(\d+);/g,        (_, d) => String.fromCodePoint(+d))
  .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
  .replace(/&(\w+);/g,         (_, n) => ENTITIES[n] ?? `&${n};`);

// Inline markup, innermost first — these never nest more than a level or two in
// these pages, so a repeated pass is enough and a parser is not warranted.
function inline(html, page) {
  let s = html;
  for (let i = 0; i < 4; i++) {
    s = s
      .replace(/<code[^>]*>([\s\S]*?)<\/code>/gi,     (_, t) => '`' + t.replace(/<[^>]+>/g, '') + '`')
      .replace(/<(strong|b)[^>]*>([\s\S]*?)<\/\1>/gi, (_, __, t) => `**${t}**`)
      .replace(/<(em|i)[^>]*>([\s\S]*?)<\/\1>/gi,     (_, __, t) => `_${t}_`)
      .replace(/<a [^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi, (_, href, t) => {
        const text = t.replace(/<[^>]+>/g, '').trim();
        return text ? `[${text}](${href})` : '';
      });
  }
  return decode(s.replace(/<[^>]+>/g, '')).replace(/[ \t\n]+/g, ' ').trim();
}

function rows(table) {
  const out = [];
  for (const [, tr] of table.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)) {
    const cells = [...tr.matchAll(/<(th|td)[^>]*>([\s\S]*?)<\/\1>/gi)].map(m => inline(m[2]));
    if (cells.length) out.push(cells);
  }
  if (!out.length) return '';
  const head = `| ${out[0].join(' | ')} |`;
  const rule = `|${out[0].map(() => ' --- ').join('|')}|`;
  return [head, rule, ...out.slice(1).map(r => `| ${r.join(' | ')} |`)].join('\n');
}

const BLOCKS = 'h1|h2|h3|h4|p|li|blockquote|figcaption|table|pre';
const OPEN   = new RegExp(`<(${BLOCKS})\\b[^>]*>`, 'gi');

// Find the close tag that actually matches an open tag, counting nesting. The
// previous version used a non-greedy regex, which for a list item containing
// its own sub-list stopped at the FIRST </li> — swallowing the item's heading
// and prose into one bullet and then emitting the rest of the sub-list as
// siblings. Anything with nested structure came out scrambled.
function closeOf(html, tag, from) {
  const re = new RegExp(`<(/?)${tag}\\b[^>]*>`, 'gi');
  re.lastIndex = from;
  let depth = 0, m;
  while ((m = re.exec(html)) !== null) {
    if (m[1] === '/') { if (depth === 0) return { inner: [from, m.index], end: re.lastIndex }; depth--; }
    else depth++;
  }
  return { inner: [from, html.length], end: html.length };
}

// Pull the prose out of a page. Anything a component renders at runtime is not
// here — the twin covers what the document actually contains, and says so.
function toMarkdown(html, page) {
  let body = html.slice(html.indexOf('<body'));
  body = body
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi,   '')
    .replace(/<svg[\s\S]*?<\/svg>/gi,       '')
    .replace(/<header[\s\S]*?<\/header>/i,  '')
    // print-only chrome: the PDF cover restates the page's own headline and
    // standfirst, which a twin would otherwise carry twice
    .replace(/<section class="pdfcover">[\s\S]*?<\/section>/i, '')
    .replace(/<!--[\s\S]*?-->/g,            '');

  const blocks = [];
  scan(body, blocks);

  // Walk block elements in document order, descending into any that contain
  // block children of their own rather than flattening them into one line.
  function scan(src, out) {
    OPEN.lastIndex = 0;
    const re = new RegExp(OPEN.source, 'gi');
    let m;
    while ((m = re.exec(src)) !== null) {
      const tag = m[1].toLowerCase();
      const { inner, end } = closeOf(src, tag, re.lastIndex);
      const raw = src.slice(inner[0], inner[1]);
      re.lastIndex = end;

      if (tag === 'table') { const t = rows(raw); if (t) out.push(t); continue; }
      // <pre> is verbatim: it is the one thing on these pages whose whitespace
      // carries meaning (the collaborator prompt is a <pre>), so it becomes a
      // fenced block rather than being collapsed into a paragraph.
      if (tag === 'pre') {
        const txt = decode(raw.replace(/<[^>]+>/g, '')).replace(/^\n+|\s+$/g, '');
        if (txt) out.push('```\n' + txt + '\n```');
        continue;
      }
      // a container rather than a leaf: emit its children, not a squashed line
      if (new RegExp(`<(?:${BLOCKS})\\b`, 'i').test(raw)) { scan(raw, out); continue; }

      const text = inline(raw);
      if (!text) continue;
      switch (tag) {
        case 'h1': out.push(`# ${text}`);          break;
        case 'h2': out.push(`## ${text}`);         break;
        case 'h3': out.push(`### ${text}`);        break;
        case 'h4': out.push(`#### ${text}`);       break;
        case 'li': out.push(`- ${text}`);          break;
        case 'blockquote':  out.push(`> ${text}`); break;
        case 'figcaption':  out.push(`_${text}_`); break;
        default:   out.push(text);
      }
    }
  }

  // consecutive list items belong to one list, with no blank line between them
  const out = [];
  for (const b of blocks) {
    const prev = out[out.length - 1];
    if (b.startsWith('- ') && prev?.startsWith('- ')) out[out.length - 1] = `${prev}\n${b}`;
    else out.push(b);
  }

  const title = decode(html.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? page.file);
  const desc  = decode(html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '');
  return [
    `<!-- Generated from ${page.file} by scripts/site/generate.mjs. Edit the page, not this file. -->`,
    ``,
    `# ${title}`,
    ``,
    desc,
    ``,
    `Source: ${ORIGIN}/${page.file === 'index.html' ? '' : page.file}`,
    ``,
    `---`,
    ``,
    out.join('\n\n'),
    ``
  ].join('\n');
}

// --------------------------------------------------------------- the page list

// site/pages.json is the site's own list of its pages, and the only place it
// lives. Until v1.0.1 the menu was inlined in all 24 pages with nothing keeping
// them in step — a test could see them disagree but nothing could fix it, and
// adding a page meant editing every page. Now the JSON is the source and the
// inlined copy is injected from it.
function pages() {
  const listed = JSON.parse(read('pages.json')).pages;
  for (const p of listed) {
    if (!existsSync(join(SITE, p.file))) throw new Error(`pages.json names a missing page: ${p.file}`);
  }
  return listed.map(p => ({ ...p, html: read(p.file) }))
    .map(p => ({ ...p, title: decode(p.html.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? p.file),
                       desc : decode(p.html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '') }));
}

// ------------------------------------------------------------- lab editions
//
// A Lab page holds current thinking and changes; every meaningful state of it
// is cut as a dated PDF and kept, so the reasoning can be followed and not only
// its conclusion. The list of those editions belongs ON the page — that is what
// tells a reader the page has moved and where the earlier version went — and it
// is generated from the register rather than maintained by hand.

const editions = () => existsSync(join(SITE, 'lab-editions.json'))
  ? JSON.parse(read('lab-editions.json')).entries
  : [];

const kb = (n) => `${Math.round(n / 1024)}KB`;

function editionsBlock(page, all, listed) {
  // Reading order from pages.json. The register sorts by slug, which puts
  // entry 02 first and would hand a reader the journey out of sequence.
  const rank = new Map(listed.map((p, i) => [p.name, i]));
  all = all.slice().sort((a, b) => (rank.get(a.slug) ?? 99) - (rank.get(b.slug) ?? 99));
  const mine = all.find(e => e.slug === page.name);
  // An edition may carry a `note` saying what separates it from the one before.
  // Two editions a day apart otherwise read as two states of the argument, and
  // sometimes one of them is only a repair.
  const rows = (eds, slug) => eds.slice().reverse().map((ed, i) => `
        <a class="ed" href="${ed.file}">
          <span class="ed-v">v${ed.v}${i === 0 ? ' · current' : ''}</span>
          <span class="ed-d">${ed.date}</span>
          <span class="ed-s">PDF · ${kb(ed.bytes)}</span>${ed.note ? `
          <span class="ed-n">${ed.note}</span>` : ''}
        </a>`).join('');

  // The index leads with the combined edition — the whole Lab in one file, which
  // is the artefact somebody actually sends — then lists each entry's own.
  const whole = all.find(e => e.slug === 'lab');
  const wholeEd = whole?.editions?.[whole.editions.length - 1];
  const wholePages = wholeEd?.pages ? `${wholeEd.pages}` : '';
  const body = page.name === 'lab'
    ? (whole ? `
      <div class="edwhole">
        <span class="ed-t">Everything, in one file</span>
        <p class="ed-p">All ${all.length - 1} entries, in reading order, as a single PDF${wholePages ? `, ${wholePages} pages` : ''}.
        This is the one to attach when you want somebody to follow the whole journey rather than
        land in the middle of it.</p>
        <div class="edlist">${rows(whole.editions, 'lab')}</div>
      </div>` : '') + all.filter(e => e.slug !== 'lab').map(e => `
      <div class="edgroup">
        <span class="ed-t">${e.title.replace(/ — RiskMandate Lab \d+$/, '')}</span>
        <div class="edlist">${rows(e.editions, e.slug)}</div>
      </div>`).join('')
    : (mine ? `<div class="edlist">${rows(mine.editions, mine.slug)}</div>` : '');

  if (!body.trim()) return '';
  const lede = page.name === 'lab'
    ? `Every entry is also cut as a dated PDF, and the old ones are kept. Send the file rather
       than the link when what matters is what we thought <em>then</em> — a link shows the reader
       whatever the page says by the time they arrive.`
    : `This page holds current thinking, and it will change. Each edition below is a dated,
       immutable copy of what it said on the day, with its own digest. Nothing is rewritten;
       the list only grows.`;

  return `
  <section class="psection editions">
    <div class="wrap">
      <div class="shead">
        <span class="tag">Editions</span>
        <h2>The journey, <span class="g">kept as files.</span></h2>
        <p>${lede}</p>
      </div>
      ${body}
      <p class="src">Digests for every edition are in <a href="lab-editions.json">lab-editions.json</a>,
      so a PDF somebody was sent can be checked against this list.</p>
    </div>
  </section>`;
}

// The regions of a page that are injected rather than authored: the menu data,
// the name the menu marks active, and the Lab edition list. Everything else in
// site/*.html is written by hand and left alone.
function withMenu(page, listed) {
  const menu = listed.filter(p => !p.unlisted)
                     .map(p => ({ name: p.name, label: p.label, file: p.file, ...(p.group ? { group: p.group } : {}) }));
  const current = page.name === 'home' ? '' : `RM.data.currentPage=${JSON.stringify(page.name)};`;
  let html = page.html
    .replace(/RM\.data\.currentPage="[^"]*";/, '')
    .replace(/RM\.data\.pages=\[[\s\S]*?\];/, current + `RM.data.pages=${JSON.stringify(menu)};`);
  if (html.includes('<!-- editions:start -->')) {
    html = html.replace(/<!-- editions:start -->[\s\S]*?<!-- editions:end -->/,
      `<!-- editions:start -->${editionsBlock(page, editions(), listed)}<!-- editions:end -->`);
  }
  return html;
}

// --------------------------------------------------------------- the artefacts

const url = (file) => `${ORIGIN}/${file === 'index.html' ? '' : file}`;

const sitemap = (ps) => [
  `<?xml version="1.0" encoding="UTF-8"?>`,
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
  ...ps.map(p => `  <url><loc>${url(p.file)}</loc><priority>${p.file === 'index.html' ? '1.0' : '0.7'}</priority></url>`),
  `</urlset>`,
  ``
].join('\n');

const robots = (ps) => [
  `# riskmandate.ai — everything here is public except the working pages below,`,
  `# which are ours rather than yours and carry noindex as well.`,
  `User-agent: *`,
  ...ps.filter(p => p.private).map(p => `Disallow: /${p.file}`),
  `Allow: /`,
  ``,
  `Sitemap: ${ORIGIN}/sitemap.xml`,
  ``
].join('\n');

// llms.txt: the site for something reading rather than rendering. The summary
// and the concepts come from the agent-content manifest so the two cannot
// disagree; the page list comes from the pages.
const llms = (ps, latest, manifest) => [
  `# RiskMandate — ${manifest.site.oneLine}`,
  ``,
  `> ${manifest.site.tagline}`,
  ``,
  manifest.site.summary,
  ``,
  `Site version v${latest}. The version record is at ${ORIGIN}/versions.html and its`,
  `index at ${ORIGIN}/versions/index.json.`,
  ``,
  `## Core concepts`,
  ``,
  ...manifest.concepts.map(c => `- **${c.title}**: ${c.blurb}`),
  ``,
  `## Pages`,
  ``,
  `Each is a plain HTML document at its own URL, with a markdown twin at the same`,
  `path. Anything a page renders at runtime from data — the demo cards, the`,
  `library, the scenarios — is in the page, not the twin.`,
  ``,
  ...ps.map(p => `- [${p.title}](${url(p.file)}) · [md](${ORIGIN}/${p.file.replace(/\.html$/, '.md')}): ${p.desc || 'No description.'}`),
  ``,
  `## Machine-readable`,
  ``,
  `- [Full text](${ORIGIN}/llms-full.txt): the entire site as one markdown document`,
  `- [Content manifest](${ORIGIN}/.well-known/agent-content.json): structured JSON`,
  `- [Version index](${ORIGIN}/versions/index.json): every release, and the file its notes live in`,
  ``
].join('\n');

const notFound = (ps) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>RiskMandate — page not found</title>
<meta name="robots" content="noindex">
<!-- Generated by scripts/site/generate.mjs from the page list. -->
<style>
:root{
  --bg:#F7F6F2; --card:#FFFFFF; --text:#1A1917; --muted:#4A4845; --border:#E2DFD8;
  --green:#1A7F5A;
  --sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
  --mono:ui-monospace,"SF Mono","JetBrains Mono","Roboto Mono",Menlo,Consolas,monospace;
}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--text);font-family:var(--sans);font-size:16px;line-height:1.65}
.wrap{max-width:720px;margin:0 auto;padding:88px 24px 96px}
.tag{font-family:var(--mono);font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--green)}
h1{font-size:30px;letter-spacing:-.02em;margin:10px 0 12px}
p{color:var(--muted);font-size:15px;margin:0 0 24px}
ul{list-style:none;padding:0;margin:0;display:grid;gap:2px}
li a{display:block;padding:11px 14px;border:1px solid var(--border);border-radius:8px;background:var(--card);color:var(--text);text-decoration:none;font-size:14.5px}
li a:hover{border-color:var(--green);color:var(--green)}
</style>
</head>
<body>
<div class="wrap">
  <span class="tag">404</span>
  <h1>That page is not here.</h1>
  <p>It may have moved in v1.0.0, when the site stopped serving every page from a single URL. Everything the site has is listed below.</p>
  <ul>
${ps.map(p => `    <li><a href="/${p.file === 'index.html' ? '' : p.file}">${p.title}</a></li>`).join('\n')}
  </ul>
</div>
</body>
</html>
`;

const versionsMd = (index) => [
  `<!-- Generated from site/versions/index.json by scripts/site/generate.mjs. -->`,
  ``,
  `# RiskMandate — version record`,
  ``,
  `Every version of the site, newest first. \`source\` names what each release was`,
  `built from. Releases marked **reconstructed** were authored in the SG/Vault the`,
  `site was published from before v1.0.0; their notes are a record, and the builds`,
  `they describe are not in this repository.`,
  ``,
  `Rendered at ${ORIGIN}/versions.html · index at ${ORIGIN}/versions/index.json`,
  ``,
  ...index.releases.map(r => `- **v${r.version}** · ${r.date} — ${r.title}` +
    `${r.reconstructed ? ' _(reconstructed)_' : ''}\n  Notes: ${ORIGIN}/versions/${r.file} · Source: \`${r.source}\``),
  ``
].join('\n');

// ------------------------------------------------------- the agent manifests
//
// .well-known/agent-content.json and llms-full.txt are mostly hand-written
// prose, so they are not regenerated — only the parts of them that restate
// something the site already knows: the page list and the version. Those went
// stale under the old build (the manifest still pointed two pages at frozen v0
// snapshots), which is exactly the kind of drift a generated field prevents.

function agentManifest(ps, latest) {
  const doc = JSON.parse(read('.well-known/agent-content.json'));
  doc.site.version = latest;
  doc.generated    = `v${latest}`;
  doc.pages        = ps.filter(p => p.label)
                       .map(p => ({ name: p.name, label: p.label, url: url(p.file) }));
  return JSON.stringify(doc, null, 2) + '\n';
}

const fullText = (latest) => read('llms-full.txt')
  .replace(/^> Source: https:\/\/riskmandate\.ai · generated at build \(v[\d.]+\)$/m,
           `> Source: ${ORIGIN} · v${latest}`);

// ---------------------------------------------------------------------- driver

function main() {
  const check = process.argv.includes('--check');
  const ps    = pages();
  const index = JSON.parse(readFileSync(join(SITE, 'versions/index.json'), 'utf8'));

  const files = new Map();
  // the pages first: the injected menu lands before the twins are taken from them
  for (const p of ps) {
    const html = withMenu(p, ps);
    if (html !== p.html) { p.html = html; files.set(p.file, html); }
  }
  // `private` pages are ours to work from, not ours to publish: no twin, and
  // nothing that advertises them. site/ is a public web root, so this makes
  // them unadvertised rather than protected.
  const pub = ps.filter(p => !p.private);
  for (const p of pub) files.set(p.file.replace(/\.html$/, '.md'), toMarkdown(p.html, p));
  const manifest = agentManifest(pub, index.latest);
  files.set('sitemap.xml', sitemap(pub));
  files.set('robots.txt',  robots(ps));
  files.set('llms.txt',    llms(pub, index.latest, JSON.parse(manifest)));
  files.set('404.html',    notFound(pub));
  files.set('versions.md', versionsMd(index));
  files.set('llms-full.txt',                  fullText(index.latest));
  files.set('.well-known/agent-content.json', manifest);

  const stale = [];
  for (const [name, body] of files) {
    const path = join(SITE, name);
    const now  = existsSync(path) ? readFileSync(path, 'utf8') : null;
    if (now === body) continue;
    if (check) { stale.push(name); continue; }
    writeFileSync(path, body);
    console.log(`  ${now === null ? 'new  ' : 'wrote'} site/${name}`);
  }

  if (check && stale.length) {
    console.error(`site/ is stale — run: node scripts/site/generate.mjs\n  ${stale.join('\n  ')}`);
    process.exit(1);
  }
  console.log(check ? `  ${files.size} generated files are current` : `  ${files.size} generated files`);
}

main();
