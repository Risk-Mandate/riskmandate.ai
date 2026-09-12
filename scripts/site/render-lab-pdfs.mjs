// render-lab-pdfs.mjs — cut a PDF edition of a Lab page.
//
//   node scripts/site/render-lab-pdfs.mjs                 every entry that has changed
//   node scripts/site/render-lab-pdfs.mjs lab-abp-flow    just that one
//   node scripts/site/render-lab-pdfs.mjs --all            re-cut every entry regardless
//   node scripts/site/render-lab-pdfs.mjs --check          fail if the register does not match the files
//
// Why this exists. A Lab page holds current thinking, and current thinking
// moves: the page that argued something in September will argue something else
// in November, and the earlier reasoning disappears with it. That is a real
// loss, because the journey is the thing a business partner needs to follow —
// not the conclusion, which will be the only thing left on the page.
//
// So every meaningful state of a Lab page is cut as a dated PDF and kept. The
// live page always shows the current thinking AND the list of editions behind
// it. Nothing is rewritten; the record accumulates. And a PDF is a file, which
// is what you can actually put in a WhatsApp message or attach to a LinkedIn
// post — a link would show the reader whatever the page says by the time they
// arrive, which is precisely the failure mode this removes.
//
// An edition is only cut when the page's content hash has changed, so running
// this is idempotent and a cosmetic redeploy does not mint a v4.

import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from 'node:fs';
import { createHash }                                                  from 'node:crypto';
import { spawn }                                                       from 'node:child_process';
import { dirname, join, resolve }                                      from 'node:path';
import { fileURLToPath }                                               from 'node:url';

const ROOT     = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const SITE     = join(ROOT, 'site');
const OUT_DIR  = join(SITE, 'assets/lab');
const REGISTER = join(SITE, 'lab-editions.json');
const PORT     = 8231;
const PLAYWRIGHT = '/opt/node22/lib/node_modules/playwright/index.mjs';

const args  = process.argv.slice(2);
const check = args.includes('--check');
const all   = args.includes('--all');
const only  = args.filter(a => !a.startsWith('--'));

const read = (p) => readFileSync(p, 'utf8');
const sha  = (s) => createHash('sha256').update(s).digest('hex');
const today = () => new Date().toISOString().slice(0, 10);

// The content of a Lab page for hashing purposes: the markup between <body and
// </html>, without the script block or the injected regions. Everything removed
// here moves for reasons unrelated to the thinking — the menu, the version
// chip, the edition list itself, and the shared JS modules, which a
// sync-modules run rewrites on every page at once. Leave any of it in and a
// chrome change mints an edition on all four entries the same afternoon,
// implying four arguments moved when none did.
function contentHash(html) {
  const start = html.indexOf('<body');
  const end   = html.indexOf('</html>');
  return sha(html.slice(start, end < 0 ? undefined : end)
    .replace(/<script[\s\S]*?<\/script>/g, '')
    .replace(/<a class="version"[\s\S]*?<\/a>/, '')
    .replace(/<!-- editions:start -->[\s\S]*?<!-- editions:end -->/, ''));
}

function register() {
  if (existsSync(REGISTER)) return JSON.parse(read(REGISTER));
  return {
    note: 'Every PDF edition ever cut of a Lab page. A Lab page holds current thinking and '
        + 'changes; an edition is a dated, immutable copy of what it said on the day, so the '
        + 'reasoning can be followed and not only its conclusion. Editions are never edited or '
        + 'removed — the list only grows. `content` is the sha256 of the page body the edition '
        + 'was cut from, which is how the renderer knows whether anything actually changed; '
        + '`sha256` is the digest of the PDF itself, so a file somebody was sent can be checked '
        + 'against this list.',
    entries: []
  };
}

// The whole Lab as one file: the index, then every entry in order. Recut
// whenever any entry's current edition changes, because that is exactly when
// "the whole journey so far" is a different document.
async function combine(reg, byName, order) {
  // Reading order, from pages.json — NOT alphabetical. The slugs sort to
  // 02, 03, 01, which would hand somebody the journey back to front.
  const entries = order.filter(slug => slug !== 'lab')
                       .map(slug => byName.get(slug))
                       .filter(Boolean);
  const latest  = entries.map(e => e.editions[e.editions.length - 1]).filter(Boolean);
  if (!entries.length || latest.length !== entries.length) return;

  const hash = sha(latest.map(ed => ed.content).join('|'));
  const self = byName.get('lab');
  const prev = self?.editions?.[self.editions.length - 1];
  if (prev && prev.content === hash && !all) { console.log('  combined edition unchanged'); return; }

  const { PDFDocument } = await import('pdf-lib').catch(() => ({}));
  if (!PDFDocument) { console.log('  (pdf-lib not installed — skipping the combined edition)'); return; }

  const out  = await PDFDocument.create();
  for (const ed of latest) {
    const src = await PDFDocument.load(readFileSync(join(SITE, ed.file)));
    const cp  = await out.copyPages(src, src.getPageIndices());
    cp.forEach(pg => out.addPage(pg));
  }
  const date = today();
  const v    = (prev?.v ?? 0) + 1;
  const name = `lab--the-whole-lab--v${v}--${date}.pdf`;
  writeFileSync(join(OUT_DIR, name), Buffer.from(await out.save()));

  const bytes  = statSync(join(OUT_DIR, name)).size;
  const digest = sha(readFileSync(join(OUT_DIR, name)));
  let entry = byName.get('lab');
  if (!entry) {
    entry = { slug: 'lab', file: 'lab.html', title: 'The Lab — everything so far', editions: [] };
    reg.entries.push(entry); byName.set('lab', entry);
  }
  entry.editions.push({ v, date, file: `assets/lab/${name}`, bytes, sha256: digest,
                        content: hash, pages: out.getPageCount(),
                        combines: latest.map(ed => ed.file) });
  console.log(`  the whole Lab → v${v}  ${(bytes / 1024).toFixed(0)}KB  ${name}`);
}

async function main() {
  const pages  = JSON.parse(read(join(SITE, 'pages.json'))).pages;
  // The index is not an entry. Its edition is the COMBINED document — the index
  // followed by every entry, in one file — because that is the artefact somebody
  // actually wants to send: the whole journey rather than one stop on it.
  const labs   = pages.filter(p => p.name.startsWith('lab-'))
                      .filter(p => !only.length || only.includes(p.name));
  if (!labs.length) { console.error(`no Lab page matched ${only.join(', ')}`); process.exit(1); }

  const reg = register();
  const byName = new Map(reg.entries.map(e => [e.slug, e]));

  // what needs cutting?
  const jobs = [];
  for (const p of labs) {
    const html  = read(join(SITE, p.file));
    const hash  = contentHash(html);
    const entry = byName.get(p.name);
    const latest = entry?.editions?.[entry.editions.length - 1];
    if (!all && latest && latest.content === hash) continue;
    jobs.push({ ...p, hash, next: (latest?.v ?? 0) + 1,
                title: read(join(SITE, p.file)).match(/<title>([\s\S]*?)<\/title>/)[1].trim() });
  }

  if (check) {
    const problems = [];
    for (const e of reg.entries) for (const ed of e.editions) {
      const path = join(SITE, ed.file);
      if (!existsSync(path)) { problems.push(`${ed.file} is in the register and not on disk`); continue; }
      const got = sha(readFileSync(path));
      if (got !== ed.sha256) problems.push(`${ed.file} does not match its recorded digest`);
    }
    for (const j of jobs) problems.push(`${j.name} has changed since v${j.next - 1} — cut a new edition`);
    if (problems.length) { console.error('lab editions:\n  ' + problems.join('\n  ')); process.exit(1); }
    console.log(`  ${reg.entries.reduce((n, e) => n + e.editions.length, 0)} editions, all present and matching`);
    return;
  }

  if (!jobs.length) console.log('  no Lab page has changed');

  mkdirSync(OUT_DIR, { recursive: true });
  const server = jobs.length
    ? spawn('python3', ['-m', 'http.server', String(PORT), '--bind', '127.0.0.1'], { cwd: SITE, stdio: 'ignore' })
    : null;
  if (server) await new Promise(r => setTimeout(r, 1200));
  const browser = jobs.length
    ? await (await import(PLAYWRIGHT)).chromium.launch({ args: ['--no-sandbox'] })
    : null;

  try {
    for (const j of jobs) {
      const date = today();
      const name = `${j.name}--v${j.next}--${date}.pdf`;
      const page = await browser.newPage();
      await page.goto(`http://127.0.0.1:${PORT}/${j.file}`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1800);        // let the menu and any components render
      await page.emulateMedia({ media: 'print' });

      // The cover carries the edition it is part of. It cannot be generated into
      // the live page instead: the page is stamped with the edition AFTER this
      // runs, so a generated cover would always name the previous one.
      const human = new Date(date + 'T00:00:00Z')
        .toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
      await page.evaluate(([v, d]) => {
        const el = document.querySelector('.pc-edition');
        if (el) el.textContent = `v${v} · ${d}`;
      }, [j.next, human]);

      // the same stamp lives in the running footer, so it is on every page
      const stamp = `${j.name} · edition v${j.next} · ${date}`;
      await page.pdf({
        path: join(OUT_DIR, name),
        format: 'A4',
        printBackground: true,
        margin: { top: '14mm', bottom: '16mm', left: '14mm', right: '14mm' },
        displayHeaderFooter: true,
        headerTemplate: '<div></div>',
        footerTemplate: `<div style="width:100%;padding:0 14mm;font:8pt ui-monospace,Menlo,monospace;
          color:#8A8780;display:flex;justify-content:space-between;align-items:baseline">
          <span>riskmandate.ai/${j.file}</span>
          <span>${stamp}</span>
          <span><span class="pageNumber"></span>/<span class="totalPages"></span></span></div>`
      });
      await page.close();

      const bytes = statSync(join(OUT_DIR, name)).size;
      const digest = sha(readFileSync(join(OUT_DIR, name)));
      let entry = byName.get(j.name);
      if (!entry) {
        entry = { slug: j.name, file: j.file, title: j.title, editions: [] };
        reg.entries.push(entry); byName.set(j.name, entry);
      }
      entry.title = j.title;
      entry.editions.push({ v: j.next, date, file: `assets/lab/${name}`,
                            bytes, sha256: digest, content: j.hash });
      console.log(`  ${j.name} → v${j.next}  ${(bytes / 1024).toFixed(0)}KB  ${name}`);
    }
  } finally {
    if (browser) await browser.close();
    if (server)  server.kill();
  }

  await combine(reg, byName, pages.filter(p => p.name.startsWith('lab')).map(p => p.name));

  reg.entries.sort((a, b) => a.slug.localeCompare(b.slug));
  writeFileSync(REGISTER, JSON.stringify(reg, null, 2) + '\n');
  console.log(`  register updated — ${reg.entries.reduce((n, e) => n + e.editions.length, 0)} editions total`);
  console.log(`  then: node scripts/site/generate.mjs   (to put them on the pages)`);
}

await main();
