// build-uk-support.mjs — render the UK support register into its page.
//
//   node scripts/site/build-uk-support.mjs [--check]
//
// site/uk-support.json is the register: every programme, event, scheme and network a
// London-based UK startup could use to get in front of users, each with the official page
// it was read from, the date it was read, and what that page said about whether it is open.
// site/uk-support.html is the page; everything between the register markers is written from
// the JSON, so an addition somebody sends is one object in one file.
//
// Why data and not prose. The page exists to be forwarded and corrected: the lead sends it
// to people and asks what is missing, other founders use it, and we write down what happened
// when we tried each door. Programmes open, close and get renamed every quarter, so a row
// without a source and a date is a rumour. The script refuses one.
//
// `--check` fails if the page does not match the register (CI runs it).

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve }      from 'node:path';
import { fileURLToPath }               from 'node:url';

const ROOT  = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const SITE  = join(ROOT, 'site');
const CHECK = process.argv.includes('--check');

const DATA = JSON.parse(readFileSync(join(SITE, 'uk-support.json'), 'utf8'));
const PAGE = join(SITE, 'uk-support.html');

const STATUS = {
  open:    'Open',
  rolling: 'Rolling',
  dated:   'Dated',
  closed:  'Closed',
  unclear: 'Unclear'
};
const OURS = {
  'not-started': 'Not started',
  'looking':     'Reading the terms',
  'applied':     'Applied',
  'in':          'In it',
  'done':        'Done',
  'declined':    'Not for us'
};

// ------------------------------------------------------------------ validate
const fail = (m) => { console.error(`uk-support.json: ${m}`); process.exit(1); };
const isDate = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s);
if (!isDate(DATA.read)) fail('`read` must be a date, YYYY-MM-DD');
const seen = new Set();
for (const s of DATA.sections) {
  if (!s.id || !s.title) fail('every section needs an id and a title');
  for (const r of s.rows) {
    const where = `${s.id} › ${r.name ?? '(no name)'}`;
    for (const k of ['name', 'by', 'url', 'gives', 'who', 'status', 'fit', 'ours'])
      if (!r[k]) fail(`${where}: missing ${k}`);
    if (!/^https:\/\//.test(r.url)) fail(`${where}: url must be https, the official page it was read from`);
    if (!STATUS[r.status]) fail(`${where}: status "${r.status}" is not one of ${Object.keys(STATUS).join(', ')}`);
    if (!OURS[r.ours]) fail(`${where}: ours "${r.ours}" is not one of ${Object.keys(OURS).join(', ')}`);
    if (r.read && !isDate(r.read)) fail(`${where}: read must be YYYY-MM-DD`);
    if (r.status !== 'unclear' && !r.evidence) fail(`${where}: a status other than unclear needs the phrase from the page that shows it`);
    if (seen.has(r.name)) fail(`${where}: listed twice`);
    seen.add(r.name);
  }
}

// ------------------------------------------------------------------ render
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// the register's prose may carry *emphasis*; nothing else is interpreted
const txt = (s) => esc(s).replace(/\*([^*]+)\*/g, '<em>$1</em>');
const fmt = (d) => new Date(d + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
const host = (u) => new URL(u).hostname.replace(/^www\./, '');

const row = (r) => `
          <article class="us-row" data-status="${r.status}" data-ours="${r.ours}">
            <div class="us-name">
              <h3><a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.name)}</a></h3>
              <span class="us-by">${esc(r.by)}</span>
            </div>
            <div class="us-body">
              <p class="us-gives">${txt(r.gives)}</p>
              <p class="us-who"><b>Who it is for.</b> ${txt(r.who)}</p>
              <p class="us-fit"><b>For us.</b> ${txt(r.fit)}</p>
              ${r.next ? `<p class="us-next"><b>Next.</b> ${txt(r.next)}</p>` : ''}
            </div>
            <div class="us-state">
              <span class="us-chip s-${r.status}">${STATUS[r.status]}</span>
              <span class="us-chip o-${r.ours}">${OURS[r.ours]}</span>
              <span class="us-src">${r.evidence ? `&ldquo;${esc(r.evidence)}&rdquo; &middot; ` : ''}${esc(host(r.url))}, read ${fmt(r.read || DATA.read)}</span>
            </div>
          </article>`;

const section = (s) => `
      <section class="psection${s.alt ? ' alt' : ''} us-sec" id="${esc(s.id)}">
        <div class="wrap">
          <div class="shead">
            <span class="tag">${esc(s.tag || s.title)}</span>
            <h2>${txt(s.title)}${s.title_g ? ` <span class="g">${txt(s.title_g)}</span>` : ''}</h2>
            ${s.intro ? `<p>${txt(s.intro)}</p>` : ''}
          </div>
          <div class="us-rows">${s.rows.map(row).join('')}
          </div>
        </div>
      </section>`;

const count = DATA.sections.reduce((n, s) => n + s.rows.length, 0);
const byStatus = (k) => DATA.sections.reduce((n, s) => n + s.rows.filter(r => r.status === k).length, 0);
const toc = `
      <nav class="us-toc" aria-label="Sections">${DATA.sections.map(s => `<a href="#${esc(s.id)}">${esc(s.tag || s.title)} <span>${s.rows.length}</span></a>`).join('')}</nav>
      <p class="us-tally">${count} entries, read ${fmt(DATA.read)}: ${byStatus('open')} open, ${byStatus('rolling')} rolling, ${byStatus('dated')} with a date, ${byStatus('unclear')} unclear, ${byStatus('closed')} closed and kept so nobody spends an afternoon on them.</p>`;

const html = readFileSync(PAGE, 'utf8');
const put = (src, name, body) => {
  const re = new RegExp(`(<!-- ${name}:start -->)[\\s\\S]*?(\\s*<!-- ${name}:end -->)`);
  if (!re.test(src)) fail(`uk-support.html has no ${name} markers`);
  return src.replace(re, (_, a, b) => a + body + b);
};
let want = put(html, 'toc', toc);
want = put(want, 'register', DATA.sections.map(section).join(''));

if (want === html) { console.log(`  uk-support.html: up to date (${count} entries)`); process.exit(0); }
if (CHECK) { console.error('stale: uk-support.html — run node scripts/site/build-uk-support.mjs'); process.exit(1); }
writeFileSync(PAGE, want);
console.log(`  uk-support.html: ${count} entries written`);
