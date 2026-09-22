// build-reviewer-pages.mjs — the people who run the £1,500 review, from their own files.
//
//   node scripts/site/build-reviewer-pages.mjs [--check]
//
// Inputs:  site/reviewers/<slug>.json — one per reviewer, hand-written, the source of truth.
// Outputs: site/reviewer-<slug>.html  — one page per reviewer
//          site/reviewers.html        — the list, and how somebody gets on it
//          site/reviewers.json        — the same data as a manifest, for store.sgit.ai
//
// Why a generator for two pages: because the second site reads this. store.sgit.ai owns the cart
// and the chooser at checkout; riskmandate.ai owns the material, and a biography about a real
// person is material. One source here, published as a manifest, is the only arrangement in which
// two sites cannot end up saying different things about the same person.
//
// The rule every profile is held to, and the reason this file exists: nothing is composed here.
// Every row of a record names the source it was read off and the date it was read. A person with
// no published page gets no rows — we do not write somebody a biography and then stand a £1,500
// price beside it.

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve }                               from 'node:path';
import { fileURLToPath }                                        from 'node:url';

const ROOT   = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const SITE   = join(ROOT, 'site');
const IN     = join(SITE, 'reviewers');
const CHECK  = process.argv.includes('--check');
const ORIGIN = 'https://riskmandate.ai';
const STORE  = 'https://store.sgit.ai';
const esc    = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const niceDate = (d) => {
  const M = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return `${parseInt(d.slice(8, 10), 10)} ${M[parseInt(d.slice(5, 7), 10) - 1]} ${d.slice(0, 4)}`;
};

const donor = readFileSync(join(SITE, 'pricing.html'), 'utf8');
const slugs = readdirSync(IN).filter(f => f.endsWith('.json')).map(f => f.replace(/\.json$/, '')).sort();
const people = slugs.map(s => ({ ...JSON.parse(readFileSync(join(IN, `${s}.json`), 'utf8')), slug: s }));
// people first, the placeholder last: a list of reviewers should not open on the one
// entry that is not a reviewer, whatever the slugs sort to.
people.sort((a, b) => (a.kind === 'placeholder') - (b.kind === 'placeholder')
                   || a.listed_since.localeCompare(b.listed_since)
                   || a.name.localeCompare(b.name));

for (const p of people) {
  const ids = new Set(p.sources.map(s => s.id));
  for (const r of [...p.record, ...(p.writing || []), ...(p.languages || [])])
    if (!ids.has(r.source)) { console.error(`${p.slug}: "${r.what}" cites source "${r.source}", which is not in sources`); process.exit(1); }
}

// ------------------------------------------------------------------ this family's own CSS
const CSS = `
/* reviewers — the people who run the review */
.rv-note{background:#FDF6E7;border:1px solid #E7CE9A;border-radius:var(--r);padding:18px 22px;margin-bottom:34px;font-size:15px;line-height:1.7;color:var(--text)}
.rv-note b{color:var(--gold)}
.rv-src{display:flex;flex-direction:column;gap:14px;margin-top:26px;max-width:860px}
.rv-src a{color:var(--green);word-break:break-all}
.rv-src .rv-read{display:block;font-family:var(--mono);font-size:11.5px;color:var(--faint);margin-top:3px}
.rv-rows{display:flex;flex-direction:column;gap:0;margin-top:30px;max-width:860px}
.rv-row{display:grid;grid-template-columns:minmax(200px,1fr) minmax(0,2fr);gap:6px 28px;padding:20px 0;border-top:1px solid var(--border)}
.rv-row:last-child{border-bottom:1px solid var(--border)}
.rv-row b{font-size:16px;color:var(--text)}
.rv-row p{font-size:15px;line-height:1.7;color:var(--muted)}
.rv-row .rv-from{display:block;font-family:var(--mono);font-size:11px;color:var(--faint);margin-top:8px}
.rv-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:18px;margin-top:34px}
.rv-card{background:var(--card);border:1px solid var(--border);border-radius:var(--r);padding:26px 28px;display:flex;flex-direction:column;gap:12px}
.rv-card.ph{border-style:dashed;background:transparent}
.rv-card h3{font-size:21px;letter-spacing:-.02em;color:var(--text);margin:0}
.rv-card p{font-size:15px;line-height:1.7;color:var(--muted);margin:0}
.rv-card .rv-meta{font-family:var(--mono);font-size:11.5px;color:var(--faint);display:flex;flex-wrap:wrap;gap:4px 14px}
.rv-card a.rv-open{margin-top:auto;color:var(--green);font-weight:600;font-size:15px;text-decoration:none}
.rv-card a.rv-open:hover{text-decoration:underline}
.rv-pill{display:inline-flex;align-items:center;gap:6px;font-family:var(--mono);font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;border-radius:999px;padding:4px 10px}
.rv-pill.on{background:var(--greenBg);color:var(--green)}
.rv-pill.off{background:var(--bg2);color:var(--muted)}
.rv-pill.ph{background:#FDF1DC;color:var(--gold)}
@media (max-width:640px){.rv-row{grid-template-columns:minmax(0,1fr)}}
`;

// ------------------------------------------------------------------ cut a page from the donor
function cut(name, title, desc, body) {
  let head = donor.slice(0, donor.indexOf('<body'));
  head = head.replace(/<title>.*?<\/title>/s, `<title>${esc(title)}</title>`);
  head = head.replace(/(<meta name="description" content=")[^"]*(")/, `$1${esc(desc)}$2`);
  head = head.replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${esc(title)}$2`);
  head = head.replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${esc(desc)}$2`);
  head = head.split('pricing.html').join(`${name}.html`).split('href="pricing.md"').join(`href="${name}.md"`);
  head = head.replace('</style>', CSS + '</style>');
  const bodyStart = donor.indexOf('<body'), scriptAt = donor.indexOf('<script>', bodyStart);
  const donorBody = donor.slice(bodyStart, scriptAt);
  const hdr  = donorBody.match(/<header class="top">.*?<\/header>/s)[0];
  const foot = donorBody.match(/<footer class="foot">.*?<\/footer>/s)[0];
  const tail = donor.slice(scriptAt).replace('RM.data.currentPage="pricing"', `RM.data.currentPage="${name}"`);
  return head + '<body id="top">\n\n' + hdr + '\n\n' + body + '\n\n' + foot + '\n\n' + tail;
}

const pill = (p) => p.kind === 'placeholder'
  ? '<span class="rv-pill ph">a placeholder, not a person</span>'
  : p.status.taking_work ? '<span class="rv-pill on">taking work</span>'
                         : '<span class="rv-pill off">not taking work</span>';

const sourceOf = (p, id) => p.sources.find(s => s.id === id);
const rows = (p, list) => list.map(r => `<div class="rv-row"><div><b>${esc(r.what)}</b></div><div><p>${esc(r.detail)}</p>
      <span class="rv-from">read off ${esc(sourceOf(p, r.source).url)} · ${esc(niceDate(sourceOf(p, r.source).read))}</span></div></div>`).join('\n    ');

// ------------------------------------------------------------------ one page per reviewer
function reviewerPage(p) {
  const ph = p.kind === 'placeholder';
  const title = ph ? `RiskMandate — ${p.name}: the shape of a reviewer page`
                   : `RiskMandate — ${p.name}, who runs the review`;
  const desc  = ph ? 'A placeholder page, labelled as one: the shape a reviewer profile takes on riskmandate.ai, so that somebody being asked can see exactly what would be published about them.'
                   : `${p.name} runs the reviewed level of an Agent Behaviour Policy: two sessions with your team and a sign-off. Every line on this page is read off a page they publish themselves, with the date it was read.`;
  const body = `<main class="phero">
  <div class="wrap">
    <span class="eyebrow"><span class="d"></span> ${ph ? 'A placeholder · the shape of the page' : 'Delivered by a person · who runs the review'}</span>
    <h1>${esc(p.name)}</h1>
    <p class="sub">${esc(p.one_line)}</p>
    <div class="cta-row">
      ${ph ? `<a class="btn btn-green" href="reviewers.html">Who actually runs it &rarr;</a>`
           : `<a class="btn btn-green" href="${STORE}/d/t4/" target="_blank" rel="noopener">The offer, at the store &nearr;</a>`}
      <a class="btn btn-ghost" href="abp-reviewed.html">What the review is</a>
    </div>
  </div>
</main>

<div class="paper">

  <section class="psection">
    <div class="wrap">
      ${ph ? `<div class="rv-note"><b>Nobody is described on this page.</b> ${esc(p._what_this_is)}</div>` : ''}
      <div class="shead">
        <span class="tag">Where this comes from</span>
        <h2>Every line below <span class="g">is read off a published page.</span></h2>
        <p>Nothing here was written from what somebody told us in conversation, and nothing here was composed by this site. A biography we wrote ourselves is the last thing that should stand beside a price this size, so the sources are named and dated and you can check them before you decide.</p>
      </div>
      <div class="rv-src">
        ${p.sources.map(s => `<div><a href="${esc(s.url)}"${ph ? '' : ' target="_blank" rel="noopener"'}>${esc(s.url)}</a> &mdash; ${esc(s.what)}<span class="rv-read">read ${esc(niceDate(s.read))}</span></div>`).join('\n        ')}
      </div>
    </div>
  </section>

  <section class="psection alt">
    <div class="wrap">
      <div class="shead">
        <span class="tag">The record</span>
        <h2>What they have <span class="g">actually done.</span></h2>
        ${p.why_them ? `<p>${esc(p.why_them)}</p>` : ''}
      </div>
      <div class="rv-rows">
    ${rows(p, p.record)}
      </div>
    </div>
  </section>

  ${(p.languages || []).length ? `<section class="psection">
    <div class="wrap">
      <div class="shead">
        <span class="tag">The sessions</span>
        <h2>What the two half-hours <span class="g">can be held in.</span></h2>
        <p>A session is a conversation rather than a document, so the language it runs in is a real difference between one reviewer and another.</p>
      </div>
      <div class="rv-rows">
    ${rows(p, p.languages)}
      </div>
    </div>
  </section>` : ''}

  ${(p.writing || []).length ? `<section class="psection alt">
    <div class="wrap">
      <div class="shead">
        <span class="tag">Where they write</span>
        <h2>Read them <span class="g">before you book them.</span></h2>
      </div>
      <div class="rv-rows">
    ${rows(p, p.writing)}
      </div>
    </div>
  </section>` : ''}

  <section class="psection">
    <div class="wrap">
      <div class="shead">
        <span class="tag">Interests declared</span>
        <h2>What you should know <span class="g">before you weigh the review.</span></h2>
      </div>
      <p class="pnote">${esc(p.interests_declared)}</p>
      <p class="src">Availability: ${esc(p.status.note)} <b>Confirmed ${esc(niceDate(p.status.confirmed))}</b>, and stated as a date rather than a calendar because a calendar on a page is stale the moment somebody books.${p.kind === 'placeholder' ? '' : ` On this list since ${esc(niceDate(p.listed_since))}.`}</p>
    </div>
  </section>

</div>

<section class="pcta" id="demo">
  <div class="wrap">
    <span class="eyebrow"><span class="d"></span> One name today, and the list is built for more</span>
    <h2>${ph ? 'This page is a shape, <span class="it">waiting for a person.</span>' : 'The sign-off carries <span class="it">a name and a date.</span>'}</h2>
    <p>${ph ? 'If you review agent deployments for a living and would put your name on one of these, the page you are reading is exactly what would be published about you &mdash; your own published words, your own sources, your own declaration of interests, and nothing we made up.'
            : 'Not an organisation and not a logo: the file committed to your vault at the end of the reviewed level names the professional who signed it and the day they did.'}</p>
    <div class="cta-row"><a class="btn btn-green" href="reviewers.html">Everybody who runs a review</a><a class="btn btn-ghost" href="abp-reviewed.html">What the review is</a></div>
  </div>
</section>`;
  return cut(`reviewer-${p.slug}`, title, desc, body);
}

// ------------------------------------------------------------------ the list
function indexPage() {
  const real = people.filter(p => p.kind !== 'placeholder');
  const body = `<main class="phero">
  <div class="wrap">
    <span class="eyebrow"><span class="d"></span> Delivered by a person</span>
    <h1>Who runs <span class="it">your review.</span></h1>
    <p class="sub">The reviewed level is somebody's time rather than a pipeline: two half-hour sessions with your team, a behaviour policy built from what they hear, and a sign-off file committed with their name and the date. This is who does it, what they have done, and where every line of that comes from.</p>
    <div class="cta-row">
      <a class="btn btn-green" href="abp-reviewed.html">What the review is &rarr;</a>
      <a class="btn btn-ghost" href="${STORE}/d/t4/" target="_blank" rel="noopener">The offer, at the store &nearr;</a>
    </div>
  </div>
</main>

<div class="paper">

  <section class="psection">
    <div class="wrap">
      <div class="shead">
        <span class="tag">The list</span>
        <h2>${real.length === 1 ? 'One name today,' : `${real.length} names today,`} <span class="g">and the list is built for more.</span></h2>
        <p>Choosing the reviewer is part of buying the reviewed level, and the choice is made on facts rather than on a rating. Nobody here is scored, ranked or starred: what is published is what each of them has done, where they write, what languages they can hold the sessions in, and what they want you to know about their own interests before you weigh what they say.</p>
      </div>
      <div class="rv-cards">
        ${people.map(p => `<article class="rv-card${p.kind === 'placeholder' ? ' ph' : ''}">
          ${pill(p)}
          <h3>${esc(p.name)}</h3>
          <p>${esc(p.one_line)}</p>
          <span class="rv-meta"><span>runs ${p.runs.map(r => r === 't4' ? 'the reviewed level' : r).join(', ')}</span>${p.kind !== 'placeholder' && (p.languages || []).length ? `<span>${p.languages.map(l => esc(l.what)).join(' · ')}</span>` : ''}<span>${p.kind === 'placeholder' ? 'the shape only' : `listed ${esc(niceDate(p.listed_since))}`}</span></span>
          <a class="rv-open" href="reviewer-${p.slug}.html">${p.kind === 'placeholder' ? 'Read the shape' : `The record behind ${esc(p.name.split(' ')[0])}`} &rarr;</a>
        </article>`).join('\n        ')}
      </div>
    </div>
  </section>

  <section class="psection alt">
    <div class="wrap">
      <div class="shead">
        <span class="tag">The rule</span>
        <h2>Nothing on a reviewer's page <span class="g">is written by us.</span></h2>
        <p>Every row of every record names the page it was read off and the date it was read, and a reviewer with no published page gets no rows. There are no testimonials on this site yet, because there is no real one to publish: a quote we composed, beside a &pound;1,500 price, would cost more than it could ever earn. When there is one, it will carry a name, a date and permission.</p>
      </div>
      <ul class="plist">
        <li><strong>What gets published:</strong> what the person has published themselves, cited and dated; and anything they write for us and sign off, marked as theirs.</li>
        <li><strong>What does not:</strong> a biography we composed, a score, a ranking, a star rating, a queue position, or a claim about somebody else's work.</li>
        <li><strong>How somebody joins:</strong> they send the page they already publish, the sentence they want at the top in their own words, the languages they can run a session in, and their declaration of interests. We build the page, they correct it, and it goes up when they say so &mdash; which is what the placeholder entry on this list is for.</li>
      </ul>
      <p class="src">This list is the source of truth for the person who does the work. <a href="reviewers.json">reviewers.json</a> publishes the same data as a manifest, so the store can build its chooser from it rather than keeping a second copy of a real person's biography. Generated from <code>site/reviewers/&lt;slug&gt;.json</code> by <code>scripts/site/build-reviewer-pages.mjs</code>.</p>
    </div>
  </section>

</div>

<section class="pcta" id="demo">
  <div class="wrap">
    <span class="eyebrow"><span class="d"></span> For security professionals</span>
    <h2>Would you put your name <span class="it">on one of these?</span></h2>
    <p>The work is two half-hours and a review: an hour with a team that is trying to write down what one agent can actually reach, and your signature on what comes back. If that is a thing you would do, the page above is exactly what would be published about you.</p>
    <div class="cta-row"><a class="btn btn-green" href="feedback.html">Tell us &rarr;</a><a class="btn btn-ghost" href="reviewer-ciso-xyz.html">See the shape of the page</a></div>
  </div>
</section>`;
  return cut('reviewers', 'RiskMandate — who runs your review',
    'The people who run the reviewed level of an Agent Behaviour Policy: two sessions with your team and a sign-off with a name and a date. Every line of every record is read off a published page, with the date it was read.', body);
}

// ------------------------------------------------------------------ the manifest the store reads
function manifest() {
  return {
    _what_this_is: 'The people who run the reviewed level of an Agent Behaviour Policy, as data. riskmandate.ai is the source of truth for who they are; store.sgit.ai owns the cart and the chooser at checkout and can build it from this file rather than keeping a second copy of a real person\'s biography.',
    _the_rule: 'Every line about a person is read off a page that person publishes, or written by them and signed off. Nothing is composed. No reviewer is scored, ranked or rated here, and none will be.',
    source: `${ORIGIN}/reviewers.json`,
    page: `${ORIGIN}/reviewers.html`,
    generated_from: 'site/reviewers/<slug>.json',
    level: { id: 't4', what: 'Two half-hour sessions with your team, the behaviour policy built from the interview, and a security professional\'s review and sign-off.', bought_at: `${STORE}/d/t4/` },
    reviewers: people.map(p => ({
      slug: p.slug,
      name: p.name,
      kind: p.kind,
      page: `${ORIGIN}/reviewer-${p.slug}.html`,
      one_line: p.one_line,
      runs: p.runs,
      taking_work: p.status.taking_work,
      status_note: p.status.note,
      status_confirmed: p.status.confirmed,
      languages: (p.languages || []).map(l => l.what),
      listed_since: p.listed_since,
      sources: p.sources.map(s => ({ url: s.url, read: s.read })),
    })),
  };
}

// ------------------------------------------------------------------ write, or check
const outputs = { 'reviewers.html': indexPage(), 'reviewers.json': JSON.stringify(manifest(), null, 2) + '\n' };
for (const p of people) outputs[`reviewer-${p.slug}.html`] = reviewerPage(p);

const stale = [];
for (const [file, want] of Object.entries(outputs)) {
  const path = join(SITE, file);
  const have = existsSync(path) ? readFileSync(path, 'utf8') : null;
  if (have === want) continue;
  if (CHECK) stale.push(file); else writeFileSync(path, want);
}

if (CHECK) {
  if (stale.length) { console.error(`stale: ${stale.join(', ')} — run build-reviewer-pages.mjs`); process.exit(1); }
  console.log(`reviewer pages: ${Object.keys(outputs).length} up to date`);
} else {
  console.log(`reviewer pages: wrote ${Object.keys(outputs).length} (${people.length} reviewer${people.length === 1 ? '' : 's'}) — now run generate.mjs`);
}
