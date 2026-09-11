// collapse-to-v1.mjs — the one-off that produced site/ at v1.0.0.
//
// It is kept because v1.0.0's history is RECONSTRUCTED, not recorded: the pages
// under site/ were not authored here, they were lifted out of the SG/Vault
// 7rfetjwz (the site's source up to v0.14.0) and rewritten. This script is the
// statement of exactly what "rewritten" means, and re-running it against a
// fresh clone of that vault reproduces the snapshot byte for byte.
//
// From v1.0.1 onward site/ is edited directly and this script is history. It is
// not part of any build: nothing in CI runs it.
//
//   node scripts/migrate/collapse-to-v1.mjs --from <clone-of-7rfetjwz> [--out site]
//
// What it changes, and why:
//
//   1. The host shell goes.   index.html used to be a 9KB frame that loaded
//      v0/v0.13/v0.13.0/index.html into an <iframe srcdoc>. Every URL on the
//      site was therefore "/" — no deep links, no bookmarks, nothing for a
//      crawler to index. The version page becomes the page.
//   2. Navigation becomes links.   [data-nav] buttons and the rm-nav/rm-back
//      postMessage protocol become <a href>.
//   3. The version dropdown goes.  A switcher that loads other snapshots has
//      nothing to switch to once v0/ is dropped. It is replaced by the current
//      version name, linking to versions.html.
//   4. The v0/ tree goes.         12 frozen snapshots, ~759KB. They stay in the
//      vault, which is the historical record and is not going away.
//      Two of them were doing double duty as content pages and are promoted:
//      v0.10.0 → acceptance.html, v0.11.0 → grant-gap.html.
//   5. dev.html becomes versions.html, reading versions/index.json instead of
//      35 release notes inlined at build time.

import { readFileSync, writeFileSync, mkdirSync, cpSync, rmSync, existsSync, readdirSync } from 'node:fs';
import { createHash }                                                                     from 'node:crypto';
import { dirname, join, resolve }                                                         from 'node:path';
import { fileURLToPath }                                                                  from 'node:url';

const HERE    = dirname(fileURLToPath(import.meta.url));
const MODULES = join(HERE, 'modules');
const VERSION = '1.0.0';
const ORIGIN  = 'https://riskmandate.ai';

// ---------------------------------------------------------------- the pages

// source file in the vault → page in site/. Order is menu order.
const PAGES = [
  { name: 'home',                           src: 'v0/v0.13/v0.13.0/index.html', out: 'index.html',                           menu: false },
  { name: 'plug',                           src: 'plug.html',                           group: 'The problem', label: 'Who can pull the plug' },
  { name: 'acceptable',                     src: 'acceptable.html',                     group: 'The problem', label: 'Accepted is not acceptable' },
  { name: 'acceptance',                     src: 'v0/v0.10/v0.10.0/index.html', out: 'acceptance.html', group: 'The problem', label: 'You own the risk' },
  { name: 'grant-gap',                      src: 'v0/v0.11/v0.11.0/index.html', out: 'grant-gap.html',  group: 'The problem', label: 'The grant is not the mandate' },
  { name: 'how-it-works',                   src: 'how-it-works.html',                   group: 'The model',   label: 'How it works' },
  { name: 'agents',                         src: 'agents.html',                         group: 'The model',   label: 'Agents' },
  { name: 'ramm',                           src: 'ramm.html',                           group: 'The model',   label: 'RAMM — acceptance maturity' },
  { name: 'scenarios',                      src: 'scenarios.html',                      group: 'The model',   label: 'Risk scenarios' },
  { name: 'statics',                        src: 'statics.html',                        group: 'The model',   label: 'Static scenarios' },
  { name: 'demos',                          src: 'demos.html',                          group: 'Live demos',  label: 'All demos' },
  { name: 'demo-licence-to-operate',        src: 'demo-licence-to-operate.html',        group: 'Live demos',  label: 'Licence to Operate' },
  { name: 'demo-risk-graph-explorer',       src: 'demo-risk-graph-explorer.html',       group: 'Live demos',  label: 'RiskGraph Explorer' },
  { name: 'demo-agentic-browser-isolation', src: 'demo-agentic-browser-isolation.html', group: 'Live demos',  label: 'Agentic Browser Isolation' },
  { name: 'demo-risk-mandate-field',        src: 'demo-risk-mandate-field.html',        group: 'Live demos',  label: 'RiskMandate field demo' },
  { name: 'demo-file-security',             src: 'demo-file-security.html',             group: 'Live demos',  label: 'File security walk' },
  { name: 'demo-agent-permission-games',    src: 'demo-agent-permission-games.html',    group: 'Live demos',  label: 'Permission games' },
  { name: 'pricing',                        src: 'pricing.html',                        label: 'Pricing' },
  { name: 'library',                        src: 'library.html',                        label: 'Library' },
  { name: 'partners',                       src: 'partners.html',                       label: 'Partners' },
  { name: 'feedback',                       src: 'feedback.html',                       label: 'Give feedback' },
  { name: 'brand',                          src: 'brand.html',                          label: 'Brand' },
  { name: 'versions',                       src: 'dev.html',            out: 'versions.html',      menu: false },
  { name: 'design-options',                 src: 'design-options.html', menu: false }
];

const out     = (p) => p.out || p.src;
const MENU    = PAGES.filter(p => p.menu !== false)
                     .map(p => ({ name: p.name, label: p.label, file: out(p), ...(p.group ? { group: p.group } : {}) }));
const BY_SRC  = new Map(PAGES.map(p => [p.src, out(p)]));

// files that ship beside the pages, copied from the vault verbatim
const ASSETS  = ['assets', '.well-known', 'llms-full.txt'];

// ------------------------------------------------------------- the rewrites

const readModule = (n) => readFileSync(join(MODULES, n), 'utf8').trimEnd() + '\n\n\n';

// Split a built page's single <script> into its concatenated source modules.
// Each begins with `'use strict';\n// <name> — …` at column 0.
const MODULE_HEAD = /^(?='use strict';\n\/\/ [\w/.\-]+ )/m;
const moduleName  = (block) => block.match(/^'use strict';\n\/\/ ([\w/.\-]+) /)?.[1];

function replaceModules(html, { drop = [], swap = {} }) {
  const parts = html.split(MODULE_HEAD);
  const kept  = [parts[0]];
  for (const block of parts.slice(1)) {
    const name = moduleName(block);
    if (drop.includes(name)) continue;
    kept.push(swap[name] ?? block);
  }
  return kept.join('');
}

// <button class="x" data-nav="f.html">text</button> → <a class="x" href="f.html">text</a>
// Buttons never nest, so the first </button> after the open tag closes it.
function linkifyNav(html) {
  return html.replace(
    /<button([^>]*?)\sdata-nav="([^"]+)"([^>]*)>([\s\S]*?)<\/button>/g,
    (_, before, file, after, text) => `<a${before}${after} href="${BY_SRC.get(file) ?? file}">${text}</a>`
  );
}

// [data-back] asked the host to reload the last version page — i.e. the homepage.
function linkifyBack(html) {
  return html
    .replace(/<a class="brand" data-back>/g, '<a class="brand" href="index.html">')
    .replace(/<button([^>]*?)\sdata-back([^>]*)>([\s\S]*?)<\/button>/g,
             (_, before, after, text) => `<a${before}${after} href="index.html">${text}</a>`);
}

const VERSION_LINK =
  `<a class="version" href="versions.html" title="What shipped in v${VERSION}">v${VERSION}</a>`;

// Header rules were written for <button>; the menu emits <a> now. Plus the
// version link that replaced the switcher.
const CSS_PATCH = `
/* v1.0.0 — navigation is real links now, so the header rules that targeted
   <button> have to reach <a> too, and the version switcher is a link. */
.brand{text-decoration:none}
.navlinks a{background:none;border:0;cursor:pointer;color:var(--muted);font-size:13.5px;padding:6px 0;font-family:var(--sans);transition:color .15s;white-space:nowrap;text-decoration:none;display:inline-flex;align-items:center}
.navlinks a:hover{color:var(--text)}
.navlinks a.active{color:var(--text);font-weight:600}
.version{font-family:var(--mono);font-size:12px;color:var(--muted);background:var(--card);border:1px solid var(--border);border-radius:7px;padding:5px 8px;text-decoration:none;white-space:nowrap;transition:color .15s,border-color .15s}
.version:hover{color:var(--text);border-color:var(--faint)}
a.btn{text-decoration:none}
a.ds{display:block;text-decoration:none;color:inherit}
@media (max-width:880px){
  .version{display:none}
  .navlinks a{width:100%;text-align:left;justify-content:flex-start;padding:12px 16px;font-size:15px;border-radius:8px}
  .navlinks a:hover{background:var(--bg2,#EFEDE7)}
}
`;

const VERSIONS_CSS_PATCH = `
/* v1.0.0 — the release log reads versions/index.json and fetches each note, so
   entries collapse and each one names the file it came from. */
rm-versions{display:block;margin:34px 0 96px}
.rel-status{font-family:var(--mono);font-size:13px;color:var(--fg-3)}
.rel{padding:0}
.rel-head{cursor:pointer;list-style:none;padding:20px 26px;margin:0;border-bottom:0;flex-wrap:wrap}
.rel-head::-webkit-details-marker{display:none}
.rel-head::before{content:"▸";font-size:11px;color:var(--fg-3);transition:transform .15s}
.rel[open] .rel-head::before{transform:rotate(90deg)}
.rel[open] .rel-head{border-bottom:1px solid var(--line)}
.rel-title{font-family:var(--sans);font-size:13.5px;color:var(--fg-2);flex:1 1 100%}
.rel-meta{display:flex;flex-wrap:wrap;gap:12px;padding:13px 26px 0;font-family:var(--mono);font-size:11.5px}
.rel-src{color:var(--green-2);text-decoration:underline;text-underline-offset:2px}
.rel-commit{color:var(--fg-3)}
.rel-flag{color:var(--gold,#B45309)}
.rel-body{padding:0 26px 24px}
.rel-body a{color:var(--green-2);text-decoration:underline;text-underline-offset:2px}
`;

function patchCss(html, patch) {
  const i = html.indexOf('</style>');
  return html.slice(0, i) + patch + html.slice(i);
}

// Comments that described the host frame, in components that are otherwise
// unchanged. A stale comment is worse than no comment — it tells the next
// reader to look for machinery that is not there.
const STALE = [
  [/rm-version-switcher\{[^}]*\}\n?/g, ''],
  [/ \* through RM\.services\.siteIo, which reaches the vault from inside the host's\n\/\/ srcdoc frame \(direct bridge where reachable, otherwise a read RPC to the host\)\./g, ''],
  [/through RM\.services\.siteIo, which reaches the vault from inside the host's\n\/\/ srcdoc frame \(direct bridge where reachable, otherwise a read RPC to the host\)\./g,
   'through RM.services.siteIo, which fetches them from the same origin as the page.'],
  [/from vault content \(assets\/library\/library\.json \+ one webp per article\),/g,
   'from assets\/library\/library.json plus one webp per article,'],
  [/\/\/     A blob-URL <iframe> relies on the browser's PDF viewer being available\n\/\/     inside a sandboxed srcdoc frame, and it is not — it renders as a broken\n\/\/     document\. Slides are rasterised at build time and loaded through\n\/\/     RM\.services\.siteIo like any other vault image, which is the path already\n\/\/     proven to work in all three contexts\. The original PDF stays one click\n\/\/     away for anyone who wants the file itself\./g,
   '//     A blob-URL <iframe> relies on the browser\'s PDF viewer, which is not\n//     dependable and renders as a broken document where it is missing. Slides\n//     are pre-rasterised and loaded through RM.services.siteIo like any other\n//     image. The original PDF stays one click away for anyone who wants the\n//     file itself.'],
  [/and the content agent can update assets\/library\/ without a rebuild\./g,
   'and assets\/library\/ can be updated on its own.'],
  // ramm-figure.js resolved its image through the SG bridge with a same-origin
  // fallback. Only the fallback can ever run now, so only the fallback remains.
  [/\/\/ Loads the RAMM infographic at RUNTIME through the SG bridge \(sg\.vfs\), exactly\n\/\/ like the library images, so the artwork is never inlined into ramm\.html and\n\/\/ the content agent can drop it in without a rebuild\. Stays hidden until the\n\/\/ asset actually resolves, so the page is clean while the image is pending\./g,
   '// Loads the RAMM infographic at RUNTIME from the path in its src attribute, so\n// the artwork is never inlined into ramm.html and can be dropped in on its own.\n// Stays hidden until the asset resolves, so the page is clean while it pends.'],
  [/  function sg\(\) \{\n(?:.*\n)*?  \}\n  var abs = function \(p\) \{ return '\/' \+ String\(p\)\.replace\(\/\^\\\/\/, ''\); \};\n  var rel = function \(p\) \{ return String\(p\)\.replace\(\/\^\\\/\/, ''\); \};\n  function imageUrl\(path\) \{\n(?:.*\n)*?  \}\n/,
   "  function imageUrl(path) { return Promise.resolve(String(path).replace(/^\\//, '')); }\n"]
];

const fixStaleComments = (html) => STALE.reduce((s, [re, to]) => s.replace(re, to), html);

// RM.data is inlined at the top of every page. Rewrite it for v1: the page list
// points at real files, and the version lists that fed the switcher are gone.
// The homepage deliberately has no currentPage — that is what tells the menu its
// section links scroll rather than navigate.
function patchData(html, page) {
  const current = page.name === 'home' ? '' : `RM.data.currentPage=${JSON.stringify(page.name)};`;
  return html
    .replace(/RM\.data\.versions=\[[\s\S]*?\];/,    '')
    .replace(/RM\.data\.current="[^"]*";/,          '')
    .replace(/RM\.data\.currentPage="[^"]*";/,      '')
    .replace(/RM\.data\.releases=\[[\s\S]*?\];\n?/, '')
    .replace(/RM\.data\.pages=\[[\s\S]*?\];/,       current + `RM.data.pages=${JSON.stringify(MENU)};`);
}

function patchHead(html, page, provenance) {
  const file = out(page);
  const slug = file.replace(/\.html$/, '');
  const canonical = file === 'index.html' ? ORIGIN + '/' : `${ORIGIN}/${file}`;
  const title = html.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? 'RiskMandate';
  const desc  = html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '';
  const head  = [
    `<link rel="canonical" href="${canonical}">`,
    `<link rel="alternate" type="text/markdown" href="${slug}.md" title="This page as markdown">`,
    `<link rel="icon" href="assets/brand/riskmandate-favicon-32.png" sizes="32x32">`,
    `<link rel="icon" href="assets/brand/riskmandate-mark.svg" type="image/svg+xml">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="RiskMandate">`,
    `<meta property="og:url" content="${canonical}">`,
    `<meta property="og:title" content="${title}">`,
    `<meta property="og:description" content="${desc}">`,
    `<meta property="og:image" content="${ORIGIN}/assets/brand/riskmandate-lockup-light.png">`,
    `<meta name="twitter:card" content="summary_large_image">`
  ].join('\n');
  return html.replace(
    /<!-- Built file\. Do not edit by hand[^>]*-->/,
    `${head}\n<!-- v${VERSION}. Reconstructed from SG/Vault ${provenance.vault} at v${provenance.sourceVersion};\n     see versions/1.0.0.md. Edited directly from here on — there is no build step. -->`
  );
}

// ------------------------------------------------------------------- driver

function transform(src, page, provenance) {
  let html = src;
  html = patchHead(html, page, provenance);
  html = patchData(html, page);
  html = replaceModules(html, {
    drop: ['components/version-switcher.js'],
    swap: {
      'components/dom.js' : readModule('dom.js'),
      'components/nav.js' : readModule('nav.js'),
      'components/menu.js': readModule('menu.js'),
      'components/io.js'  : readModule('io.js'),
      'core/markdown.js'  : readModule('markdown.js')
    }
  });
  html = html.replaceAll('RM.services.vaultIo', 'RM.services.siteIo');
  html = linkifyNav(html);
  html = linkifyBack(html);
  html = html.replace(/<rm-version-switcher><\/rm-version-switcher>/g, VERSION_LINK);
  html = html.replace(/(<a class="footlink" href="versions\.html">)Internal(<\/a>)/g, '$1Versions$2');
  html = fixStaleComments(html);
  html = patchCss(html, CSS_PATCH);
  if (page.name === 'versions') html = toVersionsPage(html);
  return html;
}

const VERSIONS_LEDE =
  '<p>Every change to this site ships as a versioned release. The index is ' +
  '<a class="rel-src" href="versions/index.json">versions/index.json</a> and each release\'s notes ' +
  'are one markdown file beside it — this page renders those files and nothing else, and every ' +
  'entry links to the bytes it was rendered from. Releases up to v0.14.0 were authored in the ' +
  'SG/Vault this site used to be published from; they are carried here as a record and marked as ' +
  'reconstructed, because the builds they describe no longer exist in this repository.</p>';

// dev.html was the release log with all 35 notes inlined at build time. It keeps
// its layout and loses its data: <rm-versions> fetches the record instead.
function toVersionsPage(html) {
  const withCss = patchCss(html, VERSIONS_CSS_PATCH)
    .replace(/<title>[\s\S]*?<\/title>/, '<title>RiskMandate — version record</title>')
    .replace(/<meta name="description" content="[^"]*"/,
             '<meta name="description" content="Every version of the RiskMandate site, what changed in it, and the file that record lives in."')
    .replace(/<span class="tag">Dev<\/span>/, '<span class="tag">Versions</span>')
    .replace(/<h1>[\s\S]*?<\/h1>/,
             '<h1>Version record. <span class="g">Every change, and the file it lives in.</span></h1>')
    .replace(/<p>Every change to this site ships[\s\S]*?<\/p>/, VERSIONS_LEDE)
    .replace(/<rm-dev-releases><\/rm-dev-releases>/, '<rm-versions></rm-versions>')
    .replace(/rm-dev-releases\{[^}]*\}\n?/, '');
  return replaceModules(withCss, { drop: ['components/dev-releases.js'] })
    .replace("'use strict';\n// boot.js", readModule('io.js') + readModule('versions.js') + "'use strict';\n// boot.js");
}

// ------------------------------------------------------------ the record
//
// versions/index.json plus one markdown file per version, each naming what it
// was built from. Releases up to v0.14.0 were written in the vault against
// builds that no longer exist here, so they are flagged `reconstructed` and
// their source names the vault rather than a commit in this repository.

function writeVersionRecord(from, outDir, provenance) {
  const dir = join(outDir, 'versions');
  mkdirSync(dir, { recursive: true });
  for (const f of readdirSync(join(from, 'dev/releases'))) {
    cpSync(join(from, 'dev/releases', f), join(dir, f));
  }

  const prior = JSON.parse(readFileSync(join(from, 'dev/releases.json'), 'utf8')).releases;
  const index = {
    latest: VERSION,
    note: 'One entry per release, newest first. `file` is that release\'s notes, beside this file. '
        + '`source` names what the release was built from: a commit in this repository from v1.0.0 '
        + 'onward, and the SG/Vault it was published from before that. `reconstructed: true` means '
        + 'the notes were carried over from that vault and the build they describe is not in this '
        + 'repository — read them as a record, not as something you can check out.',
    releases: [
      {
        version: VERSION,
        date   : provenance.snapshotDate,
        title  : 'The site becomes the repository: one document per page, real links, no host frame',
        file   : `${VERSION}.md`,
        source : `sgit://${provenance.vault}@v${provenance.sourceVersion}`
      },
      ...prior.map(r => ({ ...r, source: `sgit://${provenance.vault}/dev/releases/${r.file}`, reconstructed: true }))
    ]
  };
  writeFileSync(join(dir, 'index.json'),           JSON.stringify(index, null, 2) + '\n');
  writeFileSync(join(dir, 'source-snapshot.json'), JSON.stringify(provenance, null, 2) + '\n');
  writeFileSync(join(dir, `${VERSION}.md`),        releaseNotes(provenance));
  console.log(`  versions/index.json  —  ${index.releases.length} releases (${prior.length} reconstructed)`);
}

const releaseNotes = (p) => `## The site becomes the repository

**Reconstructed release.** Everything before this line was built in the SG/Vault
\`${p.vault}\` and published from there. v1.0.0 is an exact copy of what that vault was
serving at v${p.sourceVersion}, rewritten to stand on its own. Per-file SHA-256 digests of the
${Object.keys(p.files).length} source files are in [versions/source-snapshot.json](versions/source-snapshot.json),
so the copy is checkable against a fresh clone of the vault. The vault is not
deleted — it stays as the historical record, including the twelve design
snapshots dropped here.

- **The host frame is gone.** \`index.html\` used to be a 9KB shell that loaded
  \`v0/v0.13/v0.13.0/index.html\` into an \`<iframe srcdoc>\`. Every page on the site
  therefore had the same URL. Nothing could be deep-linked, bookmarked, opened in a
  new tab or indexed. Each page is now the document the server sends.
- **Navigation is links.** The \`rm-nav\` / \`rm-back\` / \`rm-manifest\` postMessage
  protocol and every \`[data-nav]\` button are now \`<a href>\`. The header menu emits
  anchors; the only \`<button>\` left in it is the dropdown header, which opens a panel
  rather than going anywhere.
- **The version dropdown is a version name.** It linked to twelve frozen snapshots;
  with those dropped there is nothing to switch to. \`v1.0.0\` in the header now links
  to the version record — this page.
- **The v0 tree is dropped**: twelve snapshots, about 759KB. Two of them were doing double
  duty as content pages and are promoted to real ones — v0.10.0 is now
  \`acceptance.html\`, v0.11.0 is now \`grant-gap.html\`.
- **The release log became the version record.** \`dev.html\` inlined all 35 release
  notes at build time. \`versions.html\` reads \`versions/index.json\` and fetches each
  note, so every entry links to the bytes it was rendered from.
- **Dead code removed with the frame.** The three-reader vault IO service
  (\`sg.vfs\` bridge → host RPC → fetch) is a same-origin fetch; \`ramm-figure\` resolves
  its image the same way. Comments describing the frame went with it.
- **Per page: a canonical URL, Open Graph and Twitter cards, a favicon, and a
  markdown twin** at the same path with a \`.md\` extension, linked from \`<head>\`.
  Plus \`robots.txt\`, \`sitemap.xml\` and a \`404.html\` — none of which a single-URL
  site could have had.
- **Publishing changed.** CI deployed by cloning the vault and publishing the result.
  It now deploys \`site/\` straight from the repository; there is no build step and no
  vault in the path. \`vault_publisher/\` and \`web_overlay/\` are gone.
- **Unchanged:** all page content, the design, the scenarios pilot reading vault
  \`dm42qcaw\`, and the live demos, which still open their own vaults with their own
  read keys.
`;

function main() {
  const args   = process.argv.slice(2);
  const from   = resolve(args[args.indexOf('--from') + 1] ?? '');
  const outDir = resolve(args.includes('--out') ? args[args.indexOf('--out') + 1] : 'site');
  if (!existsSync(from)) { console.error('usage: collapse-to-v1.mjs --from <clone-of-7rfetjwz> [--out site]'); process.exit(1); }

  const provenance = {
    vault        : '7rfetjwz',
    branch       : 'current',
    sourceVersion: readFileSync(join(from, 'version'), 'utf8').trim(),
    snapshotDate : new Date().toISOString().slice(0, 10),
    files        : {}
  };

  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });

  for (const page of PAGES) {
    const srcPath = join(from, page.src);
    const src     = readFileSync(srcPath, 'utf8');
    provenance.files[page.src] = createHash('sha256').update(src).digest('hex');
    writeFileSync(join(outDir, out(page)), transform(src, page, provenance));
    console.log(`  ${page.src}  →  ${out(page)}`);
  }

  for (const a of ASSETS) {
    const s = join(from, a);
    if (!existsSync(s)) continue;
    cpSync(s, join(outDir, a), { recursive: true });
    console.log(`  ${a}  →  ${a}`);
  }

  writeVersionRecord(from, outDir, provenance);
  console.log(`\n  ${PAGES.length} pages, snapshot of ${provenance.vault} at v${provenance.sourceVersion}`);
}

main();
