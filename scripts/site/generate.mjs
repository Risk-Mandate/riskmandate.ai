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

// Pull the prose out of a page. Anything a component renders at runtime is not
// here — the twin covers what the document actually contains, and says so.
function toMarkdown(html, page) {
  let body = html.slice(html.indexOf('<body'));
  body = body
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi,   '')
    .replace(/<svg[\s\S]*?<\/svg>/gi,       '')
    .replace(/<header[\s\S]*?<\/header>/i,  '')
    .replace(/<!--[\s\S]*?-->/g,            '');

  const blocks = [];
  const re = /<(h1|h2|h3|h4|p|li|blockquote|figcaption|table)\b[^>]*>([\s\S]*?)<\/\1>/gi;
  for (const m of body.matchAll(re)) {
    const [, tag, raw] = m;
    if (tag.toLowerCase() === 'table') { const t = rows(raw); if (t) blocks.push(t); continue; }
    const text = inline(raw);
    if (!text) continue;
    switch (tag.toLowerCase()) {
      case 'h1': blocks.push(`# ${text}`);          break;
      case 'h2': blocks.push(`## ${text}`);         break;
      case 'h3': blocks.push(`### ${text}`);        break;
      case 'h4': blocks.push(`#### ${text}`);       break;
      case 'li': blocks.push(`- ${text}`);          break;
      case 'blockquote':  blocks.push(`> ${text}`); break;
      case 'figcaption':  blocks.push(`_${text}_`); break;
      default:   blocks.push(text);
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

// The menu is the site's own list of its pages, inlined in every page. Read it
// back rather than keeping a second copy here.
function pages() {
  const home = readFileSync(join(SITE, 'index.html'), 'utf8');
  const menu = JSON.parse(home.match(/RM\.data\.pages=(\[[\s\S]*?\]);/)[1]);
  const extra = ['versions.html', 'design-options.html']
    .filter(f => existsSync(join(SITE, f)))
    .map(f => ({ name: f.replace(/\.html$/, ''), label: null, file: f }));
  return [{ name: 'home', label: 'Home', file: 'index.html' }, ...menu, ...extra]
    .map(p => ({ ...p, html: readFileSync(join(SITE, p.file), 'utf8') }))
    .map(p => ({ ...p, title: decode(p.html.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? p.file),
                       desc : decode(p.html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '') }));
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

const robots = () => [
  `# riskmandate.ai — everything here is public.`,
  `User-agent: *`,
  `Allow: /`,
  ``,
  `Sitemap: ${ORIGIN}/sitemap.xml`,
  ``
].join('\n');

// llms.txt: the same list, for something reading rather than rendering. Each
// page's markdown twin is what we point at, not the page.
const llms = (ps, latest) => [
  `# RiskMandate`,
  ``,
  `> ${ps[0].desc}`,
  ``,
  `The insurability layer for agentic AI. Site version v${latest}; the full version`,
  `record is at ${ORIGIN}/versions.html, and its index at ${ORIGIN}/versions/index.json.`,
  ``,
  `Every page below is a plain HTML document served at its own URL. The \`.md\` link`,
  `is that page's markdown twin — the same prose, without the markup. Anything a`,
  `page renders at runtime from data (the demo cards, the library, the scenarios)`,
  `is in the page, not the twin.`,
  ``,
  `## Pages`,
  ``,
  ...ps.map(p => `- [${p.title}](${url(p.file)}): ${p.desc || 'No description.'} — markdown: ${ORIGIN}/${p.file.replace(/\.html$/, '.md')}`),
  ``,
  `## Longer form`,
  ``,
  `- [Full site text](${ORIGIN}/llms-full.txt): every page's prose in one file.`,
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
  for (const p of ps) files.set(p.file.replace(/\.html$/, '.md'), toMarkdown(p.html, p));
  files.set('sitemap.xml', sitemap(ps));
  files.set('robots.txt',  robots());
  files.set('llms.txt',    llms(ps, index.latest));
  files.set('404.html',    notFound(ps));
  files.set('versions.md', versionsMd(index));
  files.set('llms-full.txt',                  fullText(index.latest));
  files.set('.well-known/agent-content.json', agentManifest(ps, index.latest));

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
