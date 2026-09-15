// render-abp-vault-pdf.mjs — print one behaviour-policy vault's app to a PDF.
//
//   node scripts/site/render-abp-vault-pdf.mjs <slug>
//
// Serves site/ locally, opens site/vaults/<slug>/index.html (the static copy of the
// vault app, which renders every view under print media), and prints it to
// site/vaults/<slug>/dist/<slug>.pdf with a dated footer. Then re-run
// build-abp-vault.mjs so the app's dist manifest lists the PDF.
//
// A PDF is binary and carries the render date, so it is NOT part of --check; it is
// cut deliberately, like a Lab edition, and pushed with the vault.

import { existsSync, mkdirSync, statSync } from 'node:fs';
import { dirname, join, resolve }         from 'node:path';
import { fileURLToPath }                  from 'node:url';
import { createServer }                   from 'node:http';
import { readFile }                       from 'node:fs/promises';
import { createRequire }                  from 'node:module';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const SITE = join(ROOT, 'site');
const slug = process.argv[2];
if (!slug || !existsSync(join(SITE, 'vaults', slug, 'index.html'))) { console.error('usage: render-abp-vault-pdf.mjs <slug>  (site/vaults/<slug>/index.html must exist)'); process.exit(2); }

// Playwright: the repo's own if installed, else a global one.
let chromium;
try { ({ chromium } = await import('playwright')); }
catch { const req = createRequire(import.meta.url); ({ chromium } = req('/opt/node22/lib/node_modules/playwright')); }

const MIME = { html: 'text/html; charset=utf-8', json: 'application/json', md: 'text/markdown; charset=utf-8', css: 'text/css', js: 'text/javascript', zip: 'application/zip', pdf: 'application/pdf', png: 'image/png', svg: 'image/svg+xml' };
const server = createServer(async (req, res) => {
  try {
    const p = join(SITE, decodeURIComponent(req.url.split('?')[0]).replace(/^\//, ''));
    const body = await readFile(p);
    res.writeHead(200, { 'content-type': MIME[p.split('.').pop()] || 'application/octet-stream' });
    res.end(body);
  } catch { res.writeHead(404); res.end(); }
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const port = server.address().port;

const browser = await chromium.launch(existsSync('/opt/pw-browsers/chromium') ? { executablePath: '/opt/pw-browsers/chromium' } : {});
const page = await browser.newPage();
await page.emulateMedia({ media: 'print' });
await page.goto(`http://127.0.0.1:${port}/vaults/${slug}/index.html`, { waitUntil: 'networkidle' });
await page.waitForFunction(() => !document.getElementById('loading'));
await page.waitForTimeout(400);
const out = join(SITE, 'vaults', slug, 'dist', `${slug}.pdf`);
mkdirSync(dirname(out), { recursive: true });
const date = new Date().toISOString().slice(0, 10);
await page.pdf({
  path: out, format: 'A4', printBackground: true, margin: { top: '16mm', bottom: '18mm', left: '14mm', right: '14mm' },
  displayHeaderFooter: true, headerTemplate: '<span></span>',
  footerTemplate: `<div style="width:100%;font-family:ui-monospace,Menlo,monospace;font-size:8px;color:#8A8780;padding:0 14mm;display:flex;justify-content:space-between"><span>RiskMandate · Agent Behaviour Policy · ${slug} · rendered ${date} · no score</span><span class="pageNumber"></span></div>`,
});
await browser.close();
server.close();
console.log(`${out} — ${(statSync(out).size / 1024).toFixed(0)} KB · now run: node scripts/site/build-abp-vault.mjs ${slug}`);
