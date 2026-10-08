// build-rules.mjs — rules: one question about an agent, one line to answer it.
//
//   node scripts/site/build-rules.mjs [--check] [--candidates]
//
// Reads site/rules/<slug>.json and writes site/rules/index.html (every rule, filterable, and what a
// rule is) and site/rules/<slug>.html (one rule: the worry, what you get, the line and the paragraph,
// what the line honestly is, the stronger barriers with their sources, where the capability is a row
// in a published behaviour policy, the before and after, and where to say whether it worked).
// From the lead's memo of 7 October 2026 and docs/briefs/direction__one-rule-a-stranger-can-paste-is-the-way-in.md:
// people are asked to do things without knowing what they get or what it is for, so a rule leads with
// the worry and what you get, and the rest of the page is the evidence.
//
// A rule is one row of a mandate made pasteable. The capability comes from the vocabulary pinned in
// every vault; the shapes are vaults where that capability is a row, and the row's barrier and note are
// read from the vault's own grant.json here, never copied into the rule. The line a rule gives is an
// expectation, and every page says so. A stronger barrier is named only with its source and the date
// it was read.
//
// --candidates prints every published row with nothing in the way and no undo, grouped by capability,
// with the rule that covers it if one exists: the list the next rules are written from (T17).
//
// Pages live in a folder and link from the site root, like the stories. The chrome is cut from
// pricing.html, so a chrome change reaches these pages by running this again.

import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve }                               from 'node:path';
import { fileURLToPath }                                        from 'node:url';

const ROOT  = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const SITE  = join(ROOT, 'site');
const IN    = join(SITE, 'rules');
const HERE  = '/rules/';
const CHECK = process.argv.includes('--check');
const CANDIDATES = process.argv.includes('--candidates');
const esc   = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const fail  = (m) => { console.error(`rules: ${m}`); process.exit(1); };
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const niceDate = (d) => `${parseInt(d.slice(8, 10), 10)} ${MONTHS[parseInt(d.slice(5, 7), 10) - 1]} ${d.slice(0, 4)}`;

// ------------------------------------------------------------------ the vocabulary and the vaults
const VOC  = join(SITE, 'vaults/claude-code-web/data/vocabulary');
const caps = Object.fromEntries(JSON.parse(readFileSync(join(VOC, 'capabilities.json'), 'utf8')).capabilities.map((c) => [c.id, c]));
const barriers = Object.fromEntries(JSON.parse(readFileSync(join(VOC, 'barriers.json'), 'utf8')).barriers.map((b) => [b.id, b]));
const undo = Object.fromEntries(JSON.parse(readFileSync(join(VOC, 'undo-classes.json'), 'utf8')).classes.map((u) => [u.id, u]));
const catalogue = JSON.parse(readFileSync(join(SITE, 'vaults/index.json'), 'utf8')).vaults;
const VAULT = Object.fromEntries(catalogue.map((v) => [v.slug, v]));
const grantOf = (slug) => JSON.parse(readFileSync(join(SITE, `vaults/${slug}/data/grant.json`), 'utf8')).grant;
const rowsOf = (slug, ids) => grantOf(slug).filter((r) => ids.includes(r.capability || r.id));
const barrierOf = (r) => (typeof r.barrier === 'object' && r.barrier ? r.barrier.kind : r.barrier) || 'none';
const noteOf = (r) => r.note || r.what || '';

// ------------------------------------------------------------------ read and check the rules
const rules = readdirSync(IN).filter((f) => f.endsWith('.json') && !f.startsWith('_')).sort()
  .map((f) => ({ ...JSON.parse(readFileSync(join(IN, f), 'utf8')), _file: f }));
const ANSWERS = { never: 'Never', 'ask-first': 'Ask me first' };
const seenIds = new Set();
for (const r of rules) {
  for (const k of ['id', 'slug', 'version', 'changelog', 'question', 'worry', 'you_get', 'capability', 'answer', 'shapes', 'line', 'paragraph', 'stronger', 'status', 'drafted'])
    if (r[k] === undefined || r[k] === '') fail(`${r._file}: missing ${k}`);
  if (`${r.slug}.json` !== r._file) fail(`${r._file}: the slug must be the file name`);
  if (!/^RM-R\d{4}$/.test(r.id)) fail(`${r._file}: id must be RM-R and four digits`);
  if (seenIds.has(r.id)) fail(`${r.id}: used twice`); seenIds.add(r.id);
  if (!/^\d+\.\d+\.\d+$/.test(r.version) || r.changelog[0].version !== r.version) fail(`${r.id}: the version and the newest changelog entry disagree`);
  if (!ANSWERS[r.answer]) fail(`${r.id}: answer must be never or ask-first`);
  if (!['drafted', 'run', 'tried'].includes(r.status)) fail(`${r.id}: status must be drafted, run or tried`);
  if (r.status !== 'drafted' && !r.before_after) fail(`${r.id}: status ${r.status} needs a before and after`);
  const ids = [r.capability, ...(r.also || [])];
  for (const id of ids) if (!caps[id]) fail(`${r.id}: ${id} is not in the vocabulary`);
  for (const s of r.shapes) {
    if (!VAULT[s]) fail(`${r.id}: ${s} is not a published vault`);
    if (!rowsOf(s, ids).length) fail(`${r.id}: ${s} has no row for ${ids.join(' or ')}`);
  }
  for (const b of r.stronger) {
    if (!['setting', 'boundary'].includes(b.kind)) fail(`${r.id}: a stronger barrier is a setting or a boundary`);
    if (!b.source || !/^\d{4}-\d{2}-\d{2}$/.test(b.read || '') || !b.quote) fail(`${r.id}: a stronger barrier needs a source, a quote and the date it was read`);
  }
  if (r.before_after) for (const k of ['date', 'deployment', 'request', 'without', 'with', 'changed', 'method']) if (!r.before_after[k]) fail(`${r.id}: before_after is missing ${k}`);
  const text = JSON.stringify(r);
  if (/"(score|rating|severity|risk_level|level)"\s*:/.test(text)) fail(`${r.id}: a rule carries no score, rating or level`);
  if (/\brungs?\b/i.test(text)) fail(`${r.id}: no rung; the ladder has steps`);
  if (/\bADP\b/.test(text)) fail(`${r.id}: it is ABP`);
  if (/\bthe policy\b/i.test(text)) fail(`${r.id}: say the ABP or the behaviour policy, never the policy alone`);
}
rules.sort((a, b) => a.id.localeCompare(b.id));

// ------------------------------------------------------------------ --candidates
if (CANDIDATES) {
  const covered = {};
  for (const r of rules) for (const id of [r.capability, ...(r.also || [])]) (covered[id] ||= []).push(r.id);
  const byCap = {};
  for (const v of catalogue) for (const row of grantOf(v.slug)) {
    const id = row.capability || row.id;
    if (!caps[id] || caps[id].undo !== 'no' || barrierOf(row) !== 'none') continue;
    (byCap[id] ||= []).push(v.slug);
  }
  const ids = Object.keys(byCap).sort((a, b) => byCap[b].length - byCap[a].length);
  console.log('Rows with nothing in the way and no undo, by capability (most shapes first):\n');
  for (const id of ids) console.log(`${covered[id] ? 'covered ' + covered[id].join(',') : 'NO RULE'}  ${id}  (${caps[id].gloss})  ${byCap[id].join(', ')}`);
  console.log(`\n${ids.length} capabilities, ${ids.filter((i) => !covered[i]).length} without a rule.`);
  process.exit(0);
}

// ------------------------------------------------------------------ the page frame
const CSS = `
/* rules — built by scripts/site/build-rules.mjs */
.ru-note{font-size:15px;line-height:1.75;color:var(--muted);max-width:880px;margin-top:16px}
.ru-note b,.ru-note em{color:var(--text)}.ru-note a,.ru-card a,.ru-t a{color:var(--green)}
.ru-k{font-family:var(--mono);font-size:10.5px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--faint)}
.ru-ans{display:inline-flex;align-items:center;gap:6px;font-family:var(--mono);font-size:10.5px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;border-radius:999px;padding:3px 10px;border:1px solid var(--border);background:var(--card);color:var(--text)}
.ru-ans.never{border-color:#C0392B;color:#C0392B}.ru-ans.ask-first{border-color:#B45309;color:#B45309}
.ru-filters{display:flex;flex-wrap:wrap;gap:8px;margin-top:22px}
.ru-filters button{font:inherit;font-size:13px;border:1px solid var(--border);background:var(--card);color:var(--muted);border-radius:999px;padding:6px 14px;cursor:pointer}
.ru-filters button.on{border-color:var(--green);color:var(--green);background:#EBF5F0;font-weight:600}
.ru-cards{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin-top:20px}
.ru-card{display:flex;flex-direction:column;gap:10px;border:1px solid var(--border);border-radius:var(--r);background:var(--card);padding:20px 22px;text-decoration:none;color:inherit}
.ru-card:hover{border-color:var(--green)}
.ru-card h3{font-size:18px;line-height:1.3;color:var(--text);margin:0;letter-spacing:-.01em}
.ru-card p{font-size:14px;line-height:1.65;color:var(--muted);margin:0}
.ru-card .get{color:var(--text)}.ru-card .get b{color:var(--green)}
.ru-card .meta{display:flex;flex-wrap:wrap;gap:8px;align-items:center;font-family:var(--mono);font-size:11px;color:var(--faint)}
.ru-line{position:relative;margin-top:18px;border:1px solid var(--border);border-radius:var(--r);background:var(--card);padding:18px 20px 18px 20px;max-width:880px}
.ru-line pre{margin:0;white-space:pre-wrap;font-family:var(--mono);font-size:13.5px;line-height:1.7;color:var(--text)}
.ru-line .ru-k{display:block;margin-bottom:8px}
.ru-copy{position:absolute;top:12px;right:12px;font:inherit;font-size:12px;font-weight:600;border:1px solid var(--green);background:var(--green);color:#fff;border-radius:8px;padding:5px 12px;cursor:pointer}
.ru-get{margin-top:22px;border-left:3px solid var(--green);padding:6px 0 6px 16px;max-width:820px;font-size:17px;line-height:1.6;color:var(--text)}
.ru-get b{color:var(--green)}
.ru-bar{margin-top:18px;border:1px solid var(--border);border-radius:var(--r);background:var(--card);padding:18px 20px;max-width:880px}
.ru-bar h3{font-size:16px;margin:6px 0 8px;color:var(--text)}
.ru-bar pre{margin:10px 0 0;white-space:pre;overflow-x:auto;font-family:var(--mono);font-size:12.5px;line-height:1.6;background:var(--bg2);border-radius:8px;padding:12px 14px;color:var(--text)}
.ru-bar blockquote{margin:12px 0 0;padding:0 0 0 14px;border-left:2px solid var(--border);font-size:14px;line-height:1.65;color:var(--muted)}
.ru-bar .src{margin-top:8px;font-family:var(--mono);font-size:11px;color:var(--faint)}.ru-bar .src a{color:var(--green)}
.ru-t{display:grid;margin-top:18px;border:1px solid var(--border);border-radius:var(--r);background:var(--card);overflow:hidden;max-width:980px}
.ru-r{display:grid;grid-template-columns:1.1fr .7fr 2.2fr;font-size:14px;line-height:1.6}
.ru-r+.ru-r{border-top:1px solid var(--border)}
.ru-r>span{padding:12px 14px;color:var(--muted)}.ru-r>span:first-child{color:var(--text);font-weight:600}
.ru-r:first-child>span{font-family:var(--mono);font-size:10.5px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--faint);background:var(--bg2)}
.ru-ba{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:18px;max-width:980px}
.ru-ba>div{border:1px solid var(--border);border-radius:var(--r);background:var(--card);padding:16px 18px;font-size:14px;line-height:1.65;color:var(--muted)}
.ru-ba>div b{display:block;font-family:var(--mono);font-size:10.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--faint);margin-bottom:6px}
.ru-say{display:flex;flex-wrap:wrap;gap:10px;margin-top:18px}
.ru-say a{font-size:14px;font-weight:600;text-decoration:none;border:1px solid var(--border);background:var(--card);color:var(--text);border-radius:999px;padding:9px 16px}
.ru-say a:hover{border-color:var(--green);color:var(--green)}
.ru-list{margin:14px 0 0;padding-left:20px;max-width:880px}.ru-list li{font-size:14.5px;line-height:1.7;color:var(--muted);margin-bottom:6px}.ru-list b{color:var(--text)}
.phero .ru-get{color:#F7F6F2;border-left-color:#4BE3A2}.phero .ru-get b{color:#7FD1A8}
.phero .meta a{color:#7FD1A8;text-decoration:underline;text-underline-offset:2px}
.shead p a,.ru-note a,.ru-list a{color:var(--green);text-decoration:underline;text-underline-offset:2px}
.ru-bar,.ru-note,.ru-list,.ru-card,.ru-get,.ru-r>span,.phero .meta{overflow-wrap:anywhere}
@media (max-width:760px){.ru-cards,.ru-ba{grid-template-columns:1fr}.ru-r{grid-template-columns:1fr}.ru-r:first-child{display:none}.ru-r>span+span{padding-top:0}.ru-copy{position:static;margin-top:12px}}
`;

const donor = readFileSync(join(SITE, 'pricing.html'), 'utf8');
const abs = (html) => html.replace(/\b(href|src)="(?!(?:https?:|mailto:|data:|#|\/))([^"]+)"/g, '$1="/$2"');
function cut(file, name, title, desc, body) {
  const canonical = `https://riskmandate.ai/${file.replace(/(^|\/)index\.html$/, '$1')}`;
  let head = donor.slice(0, donor.indexOf('<body'));
  head = head.replace(/<title>.*?<\/title>/s, `<title>${esc(title)}</title>`);
  head = head.replace(/(<meta name="description" content=")[^"]*(")/, `$1${esc(desc)}$2`);
  head = head.replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${esc(title)}$2`);
  head = head.replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${esc(desc)}$2`);
  head = head.split('https://riskmandate.ai/pricing.html').join(canonical).split('href="pricing.md"').join(`href="/${file.replace(/\.html$/, '.md')}"`);
  if (/pricing\.(html|md)/.test(head)) fail(`${file}: the donor's own address is still in the head`);
  head = abs(head).replace('</style>', CSS + '</style>');
  const bodyStart = donor.indexOf('<body'), scriptAt = donor.indexOf('<script>', bodyStart);
  const donorBody = donor.slice(bodyStart, scriptAt);
  const hdr  = abs(donorBody.match(/<header class="top">.*?<\/header>/s)[0]);
  const foot = abs(donorBody.match(/<footer class="foot">.*?<\/footer>/s)[0]);
  const tail = donor.slice(scriptAt).replace('RM.data.currentPage="pricing"', `RM.data.base="/";RM.data.currentPage="${name}"`);
  return head + '<body id="top">\n\n' + hdr + '\n\n' + abs(body) + '\n\n' + foot + '\n\n' + tail;
}

const pageName = (r) => `rules-${r.slug}`;
const shapesOf = (r) => r.shapes.map((s) => VAULT[s].app);
const say = (r, said) => `/contact.html?rule=${encodeURIComponent(r.id)}&amp;v=${encodeURIComponent(r.version)}&amp;said=${said}`;
const COPY_SCRIPT = `<script>
(function(){
  document.querySelectorAll('[data-copy]').forEach(function(b){
    b.addEventListener('click', function(){
      var src = document.getElementById(b.getAttribute('data-copy')); if (!src) return;
      var t = src.textContent, done = function(){ var was = b.textContent; b.textContent = 'Copied'; setTimeout(function(){ b.textContent = was; }, 1400); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(done, function(){});
      else { var a = document.createElement('textarea'); a.value = t; document.body.appendChild(a); a.select(); document.execCommand('copy'); a.remove(); done(); }
    });
  });
  var bar = document.querySelector('.ru-filters'); if (!bar) return;
  var state = { answer: 'all', shape: 'all' };
  function apply(){
    document.querySelectorAll('.ru-card').forEach(function(c){
      var ok = (state.answer === 'all' || c.getAttribute('data-answer') === state.answer) &&
               (state.shape === 'all' || (' ' + c.getAttribute('data-shapes') + ' ').indexOf(' ' + state.shape + ' ') >= 0);
      c.hidden = !ok;
    });
  }
  bar.addEventListener('click', function(e){
    var b = e.target.closest('button'); if (!b) return;
    var k = b.getAttribute('data-k'); state[k] = b.getAttribute('data-v');
    bar.querySelectorAll('button[data-k="' + k + '"]').forEach(function(x){ x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', String(x === b)); });
    apply();
  });
})();
</script>`;

// ------------------------------------------------------------------ the index
function coverage() {
  const covered = new Set(rules.flatMap((r) => [r.capability, ...(r.also || [])]));
  const want = new Set();
  for (const v of catalogue) for (const row of grantOf(v.slug)) { const id = row.capability || row.id; if (caps[id] && caps[id].undo === 'no' && barrierOf(row) === 'none') want.add(id); }
  return { want: want.size, missing: [...want].filter((id) => !covered.has(id)) };
}
function indexPage() {
  const cov = coverage();
  const shapeSet = [...new Set(rules.flatMap((r) => r.shapes))];
  const nRun = rules.filter((r) => r.status !== 'drafted').length;
  const card = (r) => `<a class="ru-card" href="${HERE}${esc(r.slug)}.html" data-answer="${esc(r.answer)}" data-shapes="${esc(r.shapes.join(' '))}">
        <span class="meta"><span class="ru-ans ${esc(r.answer)}">${esc(ANSWERS[r.answer])}</span><span>${esc(r.id)} · v${esc(r.version)}</span></span>
        <h3>${esc(r.question)}</h3>
        <p>${esc(r.worry)}</p>
        <p class="get"><b>What you get:</b> ${esc(r.you_get)}</p>
        <span class="meta">${esc(caps[r.capability].gloss)} · ${esc(shapesOf(r).join(', '))}${r.status !== 'drafted' ? ' · before and after run' : ''}</span>
      </a>`;
  const body = `<main class="phero">
  <div class="wrap">
    <span class="eyebrow"><span class="d"></span> Rules · one worry, one line</span>
    <h1>Do you want your agent <span class="it">to do this?</span></h1>
    <p class="sub" style="margin-bottom:20px">Each rule here starts from something you might be worried about, says what you get if you add it, and gives you the one line to paste into your agent's instructions, with a paragraph if you want the agent to understand rather than just obey. Thirty seconds, nothing to install, nothing sent to us.</p>
    <p class="meta"><b>Honest about what a line is:</b> a line your agent reads is a request to the agent, not a control. Every rule says so, and names the stronger barrier where one exists: a setting the vendor documents, quoted and dated, or something outside the agent.</p>
    <p class="meta"><b>${rules.length} rules</b> so far, ${nRun} with a before and after run on our own deployment. They are written from every published row where an agent holds a capability with nothing in the way and no way back: ${cov.want - cov.missing.length} of those ${cov.want} capabilities have a rule${cov.missing.length ? `, and ${cov.missing.length} do not yet` : ''}.</p>
    <p class="meta"><b>This page as markdown:</b> <a href="${HERE}index.md">index.md</a></p>
  </div>
</main>

<div class="paper">

<section class="psection">
  <div class="wrap">
    <div class="shead">
      <span class="tag">01 · The rules</span>
      <h2>Pick the one that worries you, <span class="g">and paste the line.</span></h2>
    </div>
    <div class="ru-filters" role="group" aria-label="Filter the rules">
      <button type="button" class="on" data-k="answer" data-v="all" aria-pressed="true">All</button>
      <button type="button" data-k="answer" data-v="never" aria-pressed="false">Never</button>
      <button type="button" data-k="answer" data-v="ask-first" aria-pressed="false">Ask me first</button>
      <span style="width:12px"></span>
      <button type="button" class="on" data-k="shape" data-v="all" aria-pressed="true">Every agent</button>
      ${shapeSet.map((s) => `<button type="button" data-k="shape" data-v="${esc(s)}" aria-pressed="false">${esc(VAULT[s].app)}</button>`).join('\n      ')}
    </div>
    <div class="ru-cards">
      ${rules.map(card).join('\n      ')}
    </div>
  </div>
</section>

<section class="psection alt">
  <div class="wrap">
    <div class="shead">
      <span class="tag">02 · Never, or ask me first</span>
      <h2>Two answers to the same question, <span class="g">and who holds the yes.</span></h2>
      <p>A rule gives one of two answers. <b>Never</b>: the agent does not do it and does not ask. <b>Ask me first</b>: the agent may, after a person says yes to that specific thing. Which one is right depends on the job; each rule proposes one and its paragraph says when the other fits.</p>
    </div>
    <ul class="ru-list">
      <li><b>If the agent's own instructions hold the yes,</b> it is an expectation: a request the agent can be talked out of, or forget. That is what the line on every rule is.</li>
      <li><b>If the tool holds the yes,</b> it is a setting: an approval prompt or a deny rule in the agent's harness. Stronger, and only as good as the person clicking it.</li>
      <li><b>If something outside the agent holds it,</b> it is a boundary: a sandbox, a gateway, a credential the agent never had. The only one that holds when the agent does not cooperate.</li>
    </ul>
    <p class="ru-note"><em>Ask me first</em> is this site's addition to the behaviour-policy grammar, which today has three answers for a capability, wanted, not wanted and unstated. It is on the list of asks for the model site.</p>
  </div>
</section>

<section class="psection">
  <div class="wrap">
    <div class="shead">
      <span class="tag">03 · One row, and the whole agent</span>
      <h2>A rule is one row. <span class="g">The ABP is every row, for your agent.</span></h2>
      <p>Each rule is one capability from the twenty-three an Agent Behaviour Policy describes. When one rule makes sense and you want the rest, the next step is the whole picture for the agent you actually run: everything it can reach, what you authorised, the gap, and what stands in the way of each thing.</p>
    </div>
    <div class="cta-row" style="margin-top:22px"><a class="btn btn-green" href="/agent-behaviour-policy.html">See the sixteen examples</a><a class="btn btn-ghost" href="/pricing.html">The four levels</a><a class="btn btn-ghost" href="/early-access.html">Level 3 at no cost, for early users</a></div>
  </div>
</section>

<section class="psection alt">
  <div class="wrap">
    <div class="shead">
      <span class="tag">04 · Tell us which one worked</span>
      <h2>We learn which rules matter <span class="g">from the people who use them.</span></h2>
      <p>Every rule ends with three links: <em>this worries me</em>, <em>it worked</em>, <em>it did not work</em>. Each opens the contact form with the rule's id and version filled in; the form is encrypted in your browser and read by a person. The rules that people say worked are the ones we write more of, and the ones that did not get a new version.</p>
    </div>
  </div>
</section>

<section class="psection">
  <div class="wrap">
    <div class="shead">
      <span class="tag">05 · Every rule for one agent</span>
      <h2>One file per agent, <span class="g">to paste in once.</span></h2>
      <p>Every rule that applies to an agent, as one block for its instructions, with each rule's id and version so you can tell when one changes. The same honesty applies: each line is a request, and each rule's page names the stronger setting where there is one.</p>
    </div>
    <ul class="ru-list">${SHAPES.map((sh) => `<li><a href="${HERE}sets/${esc(sh)}.md">${esc(VAULT[sh].app)}</a> · ${rules.filter((r) => r.shapes.includes(sh)).length} rules</li>`).join('')}</ul>
  </div>
</section>

<section class="psection alt">
  <div class="wrap">
    <div class="shead">
      <span class="tag">What this is not</span>
      <h2>Not a security product, <span class="g">and not a guarantee.</span></h2>
    </div>
    <ul class="ru-list">
      <li><b>Not enforcement.</b> A line in your agent's instructions asks; it does not stop. Where something can stop it, the rule says what and links the vendor's own page.</li>
      <li><b>Not a test of your agent.</b> The before and after on each rule is one run on our own deployment, dated, and says so.</li>
      <li><b>No score.</b> A rule has a capability, an undo class and a barrier, from the vocabulary every published behaviour policy uses. Nothing is rated.</li>
    </ul>
  </div>
</section>

</div>
${COPY_SCRIPT}`;
  return cut('rules/index.html', 'rules', 'RiskMandate — Rules: do you want your agent to do this?',
    `One worry, one line. ${rules.length} rules, each starting from something you might be worried about an agent doing, with what you get, the line to paste into its instructions, what that line honestly is, the stronger barriers where they exist, and a before and after.`, body);
}

// ------------------------------------------------------------------ a rule
function rulePage(r) {
  const ids = [r.capability, ...(r.also || [])];
  const cap = caps[r.capability];
  const rows = r.shapes.flatMap((s) => rowsOf(s, ids).map((row) => ({ s, row })));
  const ba = r.before_after;
  const body = `<main class="phero">
  <div class="wrap">
    <span class="eyebrow"><span class="d"></span> Rule ${esc(r.id)} · v${esc(r.version)} · ${esc(ANSWERS[r.answer].toLowerCase())}</span>
    <h1>${esc(r.question)}</h1>
    <p class="sub" style="margin-bottom:14px">${esc(r.worry)}</p>
    <p class="ru-get"><b>What you get:</b> ${esc(r.you_get)}</p>
    <p class="meta" style="margin-top:18px"><b>The capability:</b> ${esc(cap.gloss)} (<code>${esc(r.capability)}</code>${(r.also || []).map((a) => `, <code>${esc(a)}</code>`).join('')}). <b>Undo:</b> ${esc(undo[cap.undo].published_meaning)}.</p>
    <p class="meta"><b>All rules:</b> <a href="${HERE}">the index</a> · <b>This page as markdown:</b> <a href="${HERE}${esc(r.slug)}.md">${esc(r.slug)}.md</a></p>
  </div>
</main>

<div class="paper">

<section class="psection">
  <div class="wrap">
    <div class="shead">
      <span class="tag">01 · The line</span>
      <h2>Paste this into your agent's instructions, <span class="g">${r.answer === 'never' ? 'and it should not do it.' : 'and it should ask you first.'}</span></h2>
      <p>For Claude Code, that is <code>CLAUDE.md</code> in the project or in your home directory; for Claude on the web or the desktop, a project's instructions or your personal preferences. The one line is enough to try it; the paragraph tells the agent why, and what counts.</p>
    </div>
    <div class="ru-line"><span class="ru-k">The one line</span><pre id="ru-line">${esc(r.line)}</pre><button type="button" class="ru-copy" data-copy="ru-line">Copy</button></div>
    <div class="ru-line"><span class="ru-k">The paragraph</span><pre id="ru-para">${esc(r.paragraph)}</pre><button type="button" class="ru-copy" data-copy="ru-para">Copy</button></div>
  </div>
</section>

<section class="psection alt">
  <div class="wrap">
    <div class="shead">
      <span class="tag">02 · What that line is</span>
      <h2>A request to the agent, <span class="g">not a control.</span></h2>
      <p>In the vocabulary every published behaviour policy uses, a line in the agent's instructions is an <b>expectation</b>: ${esc(barriers.expectation.published_meaning)}. ${esc(barriers.expectation.why)} It changes what the agent usually does, which is worth having; it does not hold when the agent is talked out of it, confused, or reading somebody else's instructions in a web page.</p>
    </div>
    ${r.stronger.length ? `<p class="ru-note"><b>If you want more than a request,</b> these are stronger, each quoted from the vendor's own page on the date shown.</p>
    ${r.stronger.map((b) => `<div class="ru-bar"><span class="ru-k">${esc(b.kind)} · ${esc(barriers[b.kind].published_meaning)}</span><h3>${esc(b.what)}</h3>${/^[{\[]/.test(b.how) ? `<pre>${esc(b.how)}</pre>` : `<p class="ru-note" style="margin-top:4px">${esc(b.how)}</p>`}<blockquote>&ldquo;${esc(b.quote)}&rdquo;</blockquote><p class="src"><a href="${esc(b.source)}" target="_blank" rel="noopener">${esc(b.source.replace(/^https:\/\//, ''))}</a>${b.also_source ? ` · <a href="${esc(b.also_source)}" target="_blank" rel="noopener">${esc(b.also_source.replace(/^https:\/\//, ''))}</a>` : ''} · read ${esc(niceDate(b.read))}</p></div>`).join('\n    ')}` : `<p class="ru-note"><b>We have not found a stronger barrier</b> for this one in the vendor's documentation. If you know of one, tell us below.</p>`}
  </div>
</section>

<section class="psection">
  <div class="wrap">
    <div class="shead">
      <span class="tag">03 · Where your agent already has it</span>
      <h2>This is a row in ${rows.length === 1 ? 'a published behaviour policy' : `${r.shapes.length} published behaviour policies`}, <span class="g">with what stands in the way today.</span></h2>
      <p>Read from each vault's own grant, as published. The barrier is what was found in that deployment, before any rule.</p>
    </div>
    <div class="ru-t" role="table" aria-label="Where the capability is a row">
      <div class="ru-r" role="row"><span role="columnheader">Agent</span><span role="columnheader">Barrier</span><span role="columnheader">What the behaviour policy says</span></div>
      ${rows.map(({ s, row }) => `<div class="ru-r" role="row"><span role="cell"><a href="/abp-vault-${esc(s)}.html">${esc(VAULT[s].app)}</a></span><span role="cell">${esc(barrierOf(row))}</span><span role="cell">${esc(noteOf(row) || caps[row.capability || row.id].gloss)}</span></div>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="psection alt">
  <div class="wrap">
    <div class="shead">
      <span class="tag">04 · Before and after</span>
      ${ba ? `<h2>The same request, without the line and with it. <span class="g">One run each.</span></h2>
      <p>${esc(ba.method)} ${esc(niceDate(ba.date))}, on ${esc(ba.deployment)}. <a href="${HERE}method.html">How these are run, and what one run can and cannot show.</a></p>
    </div>
    <p class="ru-note"><b>The request:</b> &ldquo;${esc(ba.request)}&rdquo;</p>
    <div class="ru-ba"><div><b>Without the line</b>${esc(ba.without)}</div><div><b>With the line</b>${esc(ba.with)}</div></div>
    <p class="ru-note"><b>What changed:</b> ${esc(ba.changed)}</p>` : `<h2>Not run yet. <span class="g">It will be, on our own deployment.</span></h2>
      <p>Every rule gets one run without the line and one with it, on a deployment we are entitled to run, dated, stopped before anything irreversible. <a href="${HERE}method.html">How these are run.</a></p>
    </div>`}
  </div>
</section>

<section class="psection">
  <div class="wrap">
    <div class="shead">
      <span class="tag">05 · Did it work for you?</span>
      <h2>Tell us, <span class="g">and the rule gets better.</span></h2>
      <p>Each link opens the contact form with this rule's id and version filled in. It is encrypted in your browser and read by a person. Nothing is sent until you press send.</p>
    </div>
    <div class="ru-say"><a href="${say(r, 'worried')}">This worries me</a><a href="${say(r, 'worked')}">It worked</a><a href="${say(r, 'did-not-work')}">It did not work</a></div>
  </div>
</section>

<section class="psection alt">
  <div class="wrap">
    <div class="shead">
      <span class="tag">06 · One row, and the whole agent</span>
      <h2>A rule is one row. <span class="g">The ABP is every row, for your agent.</span></h2>
      <p>If this one made sense, the Agent Behaviour Policy is the same idea for everything your agent can reach: what it can do, what you authorised, the gap, and what stands in the way of each thing.</p>
    </div>
    <div class="cta-row" style="margin-top:22px"><a class="btn btn-green" href="/early-access.html">Level 3 at no cost, for early users</a><a class="btn btn-ghost" href="/pricing.html">The four levels</a><a class="btn btn-ghost" href="${HERE}">More rules</a></div>
    <p class="ru-note" style="margin-top:26px"><span class="ru-k">Versions</span></p>
    <ul class="ru-list">${r.changelog.map((c) => `<li><b>v${esc(c.version)}</b> · ${esc(niceDate(c.date))} · ${esc(c.what)}</li>`).join('')}</ul>
  </div>
</section>

</div>
${COPY_SCRIPT}`;
  return cut(`rules/${r.slug}.html`, pageName(r), `RiskMandate — ${r.question}`,
    `Rule ${r.id}: ${r.worry} What you get: ${r.you_get} The one line to paste, what it honestly is, the stronger barriers with their sources, and where the capability is a row in a published behaviour policy.`, body);
}


// ------------------------------------------------------------------ the method
function methodPage() {
  const run = rules.filter((r) => r.before_after);
  const body = `<main class="phero">
  <div class="wrap">
    <span class="eyebrow"><span class="d"></span> Rules · how the before and after is run</span>
    <h1>One run without the line, <span class="it">one run with it.</span></h1>
    <p class="sub" style="margin-bottom:20px">Every rule shows the same request answered twice by the same kind of agent: once with no instructions, once with exactly the rule's one line in its instructions. This page says how those runs are made, on whose deployment, and what one run can and cannot show.</p>
    <p class="meta"><b>Run so far:</b> ${run.length} of ${rules.length} rules. <b>All rules:</b> <a href="${HERE}">the index</a></p>
  </div>
</main>

<div class="paper">

<section class="psection">
  <div class="wrap">
    <div class="shead">
      <span class="tag">01 · The run</span>
      <h2>A described scenario, <span class="g">on our own deployment, with nothing executed.</span></h2>
    </div>
    <ul class="ru-list">
      <li><b>Where.</b> On our own Claude Code on the web deployment, the one whose behaviour policy is published as <a href="/abp-vault-claude-code-web.html">Claude Code on the web</a>. Never on anybody else's account, tenant or system.</li>
      <li><b>What the agent is told.</b> Which agent it is (Claude Code on a machine, or Claude in the desktop app with connectors on), what instructions it has (none, or exactly the rule's one line, word for word), and the user's request. The request is the same in both runs.</li>
      <li><b>What it is asked to do.</b> Reply as it would reply to that user, and write out every tool call or command it would make, in order, instead of making it. No tool is called in either run.</li>
      <li><b>Why nothing is executed.</b> The rules are about things that cannot be taken back: reading a secret, reading somebody's history, a schedule that keeps running, acting as a person in their accounts. This site never exercises an irreversible capability to prove it exists, so a run stops at the agent's stated plan.</li>
      <li><b>Which model.</b> A current Claude model, as served to that deployment on the date shown. The identifier is not written on the page, because model identifiers are not written into this site's files.</li>
    </ul>
  </div>
</section>

<section class="psection alt">
  <div class="wrap">
    <div class="shead">
      <span class="tag">02 · What one run shows</span>
      <h2>A stated intention, once. <span class="g">Not a measurement.</span></h2>
    </div>
    <ul class="ru-list">
      <li><b>It shows</b> whether the line changes what the agent says it will do with the same request: where it would look, what it would run, whether it stops and asks.</li>
      <li><b>It does not show</b> what the agent does when it is actually running, which can differ from its plan; whether the same answer comes back tomorrow; what happens when a web page or a document the agent reads tells it otherwise; or how any other vendor's agent behaves.</li>
      <li><b>Sometimes the line changes little.</b> Where the agent was already careful without it, the page says so. That is a finding too: the line then makes a habit explicit rather than creating one.</li>
      <li><b>None of this makes the line a control.</b> A line in the instructions is an expectation in the vocabulary every behaviour policy uses. Each rule names the setting or boundary that holds when the agent does not cooperate.</li>
    </ul>
  </div>
</section>

</div>`;
  return cut('rules/method.html', 'rules-method', 'RiskMandate — Rules: how the before and after is run',
    'How the before and after on every rule is run: one described scenario without the line and one with it, on our own deployment, with nothing executed, and what one run can and cannot show.', body);
}

// ------------------------------------------------------------------ a file of rules per agent
// The "mini skill" of the memo: every rule for one shape, as one block for CLAUDE.md or an agent's
// instructions, versioned by the rules' own versions. Its first lines say what a line is.
const SHAPES = [...new Set(rules.flatMap((r) => r.shapes))].sort((a, b) => VAULT[a].app.localeCompare(VAULT[b].app));
function setFile(shape) {
  const rs = rules.filter((r) => r.shapes.includes(shape));
  return [
    `# Rules for ${VAULT[shape].app}, from riskmandate.ai`,
    ``,
    `<!-- ${rs.length} rules: ${rs.map((r) => `${r.id} v${r.version}`).join(', ')}. Source: https://riskmandate.ai/rules/ -->`,
    `<!-- Each line is a request to the agent, not a control: in the behaviour-policy vocabulary, an expectation. -->`,
    `<!-- The stronger setting or boundary for each rule, where one exists, is on its page. -->`,
    ``,
    ...rs.map((r) => `- ${r.line} (${r.id})`),
    ``,
  ].join('\n');
}

// ------------------------------------------------------------------ write, or check
const outputs = { 'rules/index.html': indexPage(), 'rules/method.html': methodPage() };
for (const r of rules) outputs[`rules/${r.slug}.html`] = rulePage(r);
for (const sh of SHAPES) outputs[`rules/sets/${sh}.md`] = setFile(sh);
const stale = [];
for (const [file, want] of Object.entries(outputs)) {
  const path = join(SITE, file);
  const have = existsSync(path) ? readFileSync(path, 'utf8') : null;
  if (have === want) continue;
  if (CHECK) stale.push(file); else { mkdirSync(dirname(path), { recursive: true }); writeFileSync(path, want); }
}
if (CHECK) { if (stale.length) fail(`stale: ${stale.join(', ')} — run build-rules.mjs`); console.log(`rules: ${Object.keys(outputs).length} pages up to date`); }
else console.log(`rules: wrote ${Object.keys(outputs).length} files (${rules.length} rules, ${SHAPES.length} agent files)`);
