// add-licence-chrome.mjs — the licence line and the site line in the footer, on every page, and a
// header with no icon links in it. Idempotent: a page that already carries them is left alone.
// Until v1.40.3 the header carried GitHub and LinkedIn icons; a partner's review on 3 November 2026
// kept the header to three menu entries and one button, so the code on GitHub is now an entry in
// the Open source menu and in this licence line, and LinkedIn, the newsroom and contact are in the
// site line below it. Run after new-page.mjs
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
const LIC = `<span class="footlic"><a href="${REPO}" target="_blank" rel="noopener">Open source on GitHub</a> · code Apache-2.0 · pages and policies <a rel="license" href="https://creativecommons.org/licenses/by/4.0/" target="_blank" title="Creative Commons Attribution 4.0 — take it, credit it"><svg class="ccicon" width="38" height="16" viewBox="0 0 76 32" aria-hidden="true"><circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" stroke-width="2.5"></circle><text x="16" y="21" text-anchor="middle" font-family="ui-sans-serif,system-ui,sans-serif" font-size="14" font-weight="800" fill="currentColor">CC</text><circle cx="60" cy="16" r="14" fill="none" stroke="currentColor" stroke-width="2.5"></circle><text x="60" y="21" text-anchor="middle" font-family="ui-sans-serif,system-ui,sans-serif" font-size="14" font-weight="800" fill="currentColor">BY</text></svg> CC BY 4.0</a> · <a href="https://open-source.sgit.ai/" target="_blank" rel="noopener">why</a></span>`;
const SITELINE = `<span class="footsite"><a href="about.html">About</a> · <a href="contact.html">Contact</a> · <a href="privacy.html">Privacy</a> · <a href="newsroom.html">From the newsroom</a> · <a href="https://www.linkedin.com/company/riskmandate/" target="_blank" rel="noopener">RiskMandate on LinkedIn</a></span>`;
const ICON = /\n?\s*<a class="ghlink" href="[^"]*"[^>]*>[\s\S]*?<\/svg><\/a>/g;   // a header icon link, GitHub's or LinkedIn's
const CSS = `.ghlink{display:inline-grid;place-items:center;width:34px;height:34px;border-radius:8px;color:var(--muted);border:1px solid transparent}.ghlink:hover{color:var(--text);border-color:var(--border)}\n.footlic,.footsite{display:inline-flex;align-items:center;gap:6px;flex-wrap:wrap}.footsite a{color:inherit}.footlic a{color:inherit}.ccicon{vertical-align:-3px;margin:0 2px}`;
// the header is full at eight menu entries on a laptop: below 1400px the GitHub link lives in the
// footer only. The version chip stays: it is how anyone confirms which version they are looking
// at, and below the drawer breakpoint nav.js carries it into the drawer instead.
const MQ = `@media (max-width:1400px) and (min-width:901px){.ghlink{display:none}header.top .wrap{gap:14px}}`;
let changed = 0, stale = [];
for (const f of readdirSync(SITE).filter(f => f.endsWith('.html'))) {
  const p = join(SITE, f); let s = readFileSync(p, 'utf8'); const before = s;
  if (/<meta http-equiv="refresh"/i.test(s)) continue;                    // a redirect stub has no chrome
  if (!s.includes('<header class="top">')) continue;                    // 404 and the like carry no site chrome
  { const h = s.match(/<header class="top">[\s\S]*?<\/header>/); if (h && ICON.test(h[0])) s = s.replace(h[0], h[0].replace(ICON, '')); ICON.lastIndex = 0; }   // the header: no icons
  if (!s.includes('class="footlic"') && /<footer class="foot">[\s\S]*?<\/footer>/.test(s)) {
    s = s.replace(/(<footer class="foot">[\s\S]*?)(\n\s*<\/div>\s*<\/footer>)/, (m, a, b) => a + '\n    ' + LIC + b);
  }
  if (s.includes('class="footlic"') && !s.includes('class="footsite"')) s = s.replace(/(<span class="footlic">[\s\S]*?<\/span>)(?![\s\S]*<span class="footlic">)/, (m) => m + '\n    ' + SITELINE);
  if (!s.includes('.ghlink{') && s.includes('</style>')) s = s.replace('</style>', '\n' + CSS + '</style>');
  if (!s.includes('.footsite{') && s.includes('</style>')) s = s.replace('</style>', '\n.footsite{display:inline-flex;align-items:center;gap:6px;flex-wrap:wrap}.footsite a{color:inherit}</style>');
  // the laptop-width rule: exactly one copy, whichever earlier form the page carried
  const MQ_FORMS = ['@media (max-width:1400px) and (min-width:901px){.ghlink{display:none}}', '@media (max-width:1400px) and (min-width:901px){.ghlink,header.top a.version{display:none}header.top .wrap{gap:14px}}', MQ];
  if (s.includes('</style>') && s.split(MQ).length !== 2) { for (const f of MQ_FORMS) s = s.split('\n' + f).join('').split(f).join(''); s = s.replace('</style>', '\n' + MQ + '</style>'); }   // a page cut from a donor already carries it, wherever the donor put it
  if (s !== before) { if (CHECK) stale.push(f); else { writeFileSync(p, s); changed++; } }
}
if (CHECK) { if (stale.length) { console.error(`licence chrome missing on: ${stale.join(', ')} — run add-licence-chrome.mjs`); process.exit(1); } console.log('  every page carries the licence line and the site line, and no header icons'); }
else console.log(`  licence chrome: ${changed} pages changed`);
