// add-licence-chrome.mjs — the GitHub link in the header and the licence line in the footer, on
// every page. Idempotent: a page that already carries them is left alone. Run after new-page.mjs
// or build-abp-pages.mjs cut a page from a donor that predates this, then generate.mjs.
//
//   node scripts/site/add-licence-chrome.mjs [--check]
//
// The site is open source and the strategy behind that is open-source.sgit.ai's: the code is
// Apache-2.0 (LICENSE at the repository root), the pages and the policies are CC BY 4.0, and the
// point of saying so on every page is that anyone can take it — which is the pitch, not a risk.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve }                   from 'node:path';
import { fileURLToPath }                            from 'node:url';
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const SITE = join(ROOT, 'site');
const CHECK = process.argv.includes('--check');
const REPO = 'https://github.com/Risk-Mandate/riskmandate.ai';
const GH = `<a class="ghlink" href="${REPO}" target="_blank" rel="noopener" aria-label="The source, on GitHub" title="Open source · Apache-2.0 code · CC BY 4.0 pages"><svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path></svg></a>`;
const LIC = `<span class="footlic"><a href="${REPO}" target="_blank" rel="noopener">Open source on GitHub</a> · code Apache-2.0 · pages and policies <a rel="license" href="https://creativecommons.org/licenses/by/4.0/" target="_blank" title="Creative Commons Attribution 4.0 — take it, credit it"><svg class="ccicon" width="38" height="16" viewBox="0 0 76 32" aria-hidden="true"><circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" stroke-width="2.5"></circle><text x="16" y="21" text-anchor="middle" font-family="ui-sans-serif,system-ui,sans-serif" font-size="14" font-weight="800" fill="currentColor">CC</text><circle cx="60" cy="16" r="14" fill="none" stroke="currentColor" stroke-width="2.5"></circle><text x="60" y="21" text-anchor="middle" font-family="ui-sans-serif,system-ui,sans-serif" font-size="14" font-weight="800" fill="currentColor">BY</text></svg> CC BY 4.0</a> · <a href="https://open-source.sgit.ai/" target="_blank" rel="noopener">why</a></span>`;
const CSS = `.ghlink{display:inline-grid;place-items:center;width:34px;height:34px;border-radius:8px;color:var(--muted);border:1px solid transparent}.ghlink:hover{color:var(--text);border-color:var(--border)}\n.footlic{display:inline-flex;align-items:center;gap:6px;flex-wrap:wrap}.footlic a{color:inherit}.ccicon{vertical-align:-3px;margin:0 2px}`;
// the header is full at eight menu entries on a laptop: below 1400px the GitHub link lives in the footer only
const MQ = `@media (max-width:1400px) and (min-width:901px){.ghlink,header.top a.version{display:none}header.top .wrap{gap:14px}}`;
let changed = 0, stale = [];
for (const f of readdirSync(SITE).filter(f => f.endsWith('.html'))) {
  const p = join(SITE, f); let s = readFileSync(p, 'utf8'); const before = s;
  if (/<meta http-equiv="refresh"/i.test(s)) continue;                    // a redirect stub has no chrome
  if (!s.includes('<header class="top">')) continue;                    // 404 and the like carry no site chrome
  if (!s.includes('class="ghlink"')) {
    // the header: before the version chip when there is one, else before the primary button
    if (/<a class="version"[^>]*>/.test(s)) s = s.replace(/(<a class="version"[^>]*>)/, GH + '\n      $1');
    else if (/<a class="btn btn-green"[^>]*>[^<]*<\/a>\s*<\/div>\s*<\/header>/.test(s)) s = s.replace(/(<a class="btn btn-green"[^>]*>[^<]*<\/a>\s*<\/div>\s*<\/header>)/, GH + '\n      $1');
  }
  if (!s.includes('class="footlic"') && /<footer class="foot">[\s\S]*?<\/footer>/.test(s)) {
    s = s.replace(/(<footer class="foot">[\s\S]*?)(\n\s*<\/div>\s*<\/footer>)/, (m, a, b) => a + '\n    ' + LIC + b);
  }
  if (!s.includes('.ghlink{') && s.includes('</style>')) s = s.replace('</style>', '\n' + CSS + '</style>');
  // the laptop-width rule: exactly one copy, whichever earlier form the page carried
  const MQ_FORMS = ['@media (max-width:1400px) and (min-width:901px){.ghlink{display:none}}', '@media (max-width:1400px) and (min-width:901px){.ghlink{display:none}header.top .wrap{gap:14px}}', MQ];
  if (s.includes('</style>') && s.split(MQ).length !== 2) { for (const f of MQ_FORMS) s = s.split('\n' + f).join('').split(f).join(''); s = s.replace('</style>', '\n' + MQ + '</style>'); }   // a page cut from a donor already carries it, wherever the donor put it
  if (s !== before) { if (CHECK) stale.push(f); else { writeFileSync(p, s); changed++; } }
}
if (CHECK) { if (stale.length) { console.error(`licence chrome missing on: ${stale.join(', ')} — run add-licence-chrome.mjs`); process.exit(1); } console.log('  every page carries the GitHub link and the licence line'); }
else console.log(`  licence chrome: ${changed} pages changed`);
