// build-stories.mjs — the stories: a cast, and storyboards told with it.
//
//   node scripts/site/build-stories.mjs [--check]
//
// Reads site/stories/cast.json and site/stories/<slug>.json, and writes site/stories.html (the
// section: what a story is here, the workflow, the cast, the list) and site/story-<slug>.html
// (one storyboard: the truth under it, the panels, the prompt for an image model, and, when it
// has been drawn, the picture with what to correct). The order is the lead's, 26 September 2026:
// story, narrative, punchline, cast, storyboard, and only then an image model. A story is data
// so that it can move to stories.sgit.ai later without being rewritten.
//
// A story page is static. The one script it carries copies the prompt to the clipboard.

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve }                               from 'node:path';
import { fileURLToPath }                                        from 'node:url';

const ROOT  = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const SITE  = join(ROOT, 'site');
const IN    = join(SITE, 'stories');
const CHECK = process.argv.includes('--check');
const esc   = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const fail  = (m) => { console.error(`stories: ${m}`); process.exit(1); };
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const niceDate = (d) => `${parseInt(d.slice(8, 10), 10)} ${MONTHS[parseInt(d.slice(5, 7), 10) - 1]} ${d.slice(0, 4)}`;

// ------------------------------------------------------------------ read and check
const cast = JSON.parse(readFileSync(join(IN, 'cast.json'), 'utf8'));
const CAST = {};
for (const c of [...cast.people, ...cast.things]) CAST[c.id] = c;
const stories = readdirSync(IN).filter((f) => f.endsWith('.json') && f !== 'cast.json' && !f.startsWith('_')).sort()
  .map((f) => JSON.parse(readFileSync(join(IN, f), 'utf8')));
for (const s of stories) {
  for (const k of ['slug', 'title', 'punchline', 'status', 'cast', 'source', 'truth', 'panels', 'prompt']) if (!s[k]) fail(`${s.slug || '?'}: missing ${k}`);
  if (!['drawn', 'storyboard'].includes(s.status)) fail(`${s.slug}: status must be drawn or storyboard`);
  for (const id of s.cast) if (!CAST[id]) fail(`${s.slug}: unknown cast member ${id}`);
  if (!s.panels.length) fail(`${s.slug}: no panels`);
  s.panels.forEach((p, i) => {
    if (p.n !== i + 1) fail(`${s.slug}: panel ${i + 1} is numbered ${p.n}`);
    for (const d of p.dialogue || []) if (!s.cast.includes(d.who)) fail(`${s.slug}: panel ${p.n} has a line for ${d.who}, who is not in the story's cast`);
  });
  if (!s.prompt.shared || (s.prompt.per_panel || []).length !== s.panels.length) fail(`${s.slug}: the prompt needs a shared part and one line per panel`);
  if (s.status === 'drawn') { if (!s.drawn || !s.drawn.image) fail(`${s.slug}: drawn, and no image`); if (!existsSync(join(SITE, s.drawn.image))) fail(`${s.slug}: ${s.drawn.image} is not in site/`); }
  const all = JSON.stringify(s);
  if (/\brungs?\b/i.test(all)) fail(`${s.slug}: says rung`);
  if (/\bADP\b/.test(all)) fail(`${s.slug}: says ADP`);
}
if (!existsSync(join(SITE, cast.drawn.image))) fail(`cast: ${cast.drawn.image} is not in site/`);

// ------------------------------------------------------------------ the page kit
const CSS = `
/* stories — a cast, and storyboards told with it */
.phero .meta{font-family:var(--mono);font-size:12px;color:rgba(255,255,255,.6);line-height:1.7;margin-top:6px;max-width:820px}
.phero .meta b{color:rgba(255,255,255,.85)}.phero .meta a{color:inherit}
.st-note{font-size:15px;line-height:1.75;color:var(--muted);max-width:880px;margin-top:16px}
.st-note b,.st-note em{color:var(--text)}.st-note a,.st-card a,.st-t a,.st-panel a{color:var(--green)}
.st-k{font-family:var(--mono);font-size:10.5px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--faint)}
.st-fig{margin:26px 0 0;max-width:820px}
.st-fig img{display:block;width:100%;height:auto;border:1px solid var(--border);border-radius:var(--r);background:var(--card)}
.st-fig figcaption{margin-top:10px;font-family:var(--mono);font-size:11px;line-height:1.7;color:var(--faint)}
.st-steps{counter-reset:s;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;margin-top:26px}
.st-step{position:relative;border:1px solid var(--border);border-radius:var(--r);background:var(--card);padding:18px 18px 16px 18px}
.st-step::before{counter-increment:s;content:counter(s,decimal-leading-zero);font-family:var(--mono);font-size:12px;font-weight:700;color:var(--green)}
.st-step h3{font-size:15px;color:var(--text);margin:8px 0 6px;letter-spacing:-.01em}
.st-step p{font-size:13.5px;line-height:1.65;color:var(--muted)}
.st-t{margin-top:26px;border:1px solid var(--border);border-radius:var(--r);background:var(--card);overflow:hidden}
.st-r{display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1fr) minmax(0,1.8fr) minmax(0,1.4fr);border-top:1px solid var(--border)}
.st-r:first-child{border-top:0;background:var(--bg2)}
.st-r>span{padding:11px 14px;font-size:13.5px;line-height:1.6;color:var(--muted)}.st-r>span+span{border-left:1px solid var(--border)}
.st-r:first-child>span{font-family:var(--mono);font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--text)}
.st-r>span:first-child{color:var(--text);font-weight:600}.st-r .q{font-style:italic;color:var(--text)}.st-r .id{font-family:var(--mono);font-size:11px;color:var(--faint);display:block}
.st-r.proposed>span{color:var(--gold)}
.st-cards{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;margin-top:26px}
.st-card{border:1px solid var(--border);border-radius:var(--r);background:var(--card);overflow:hidden;display:flex;flex-direction:column;text-decoration:none;color:inherit}
.st-card:hover{border-color:var(--green)}.st-card *{text-decoration:none}
.st-card img{display:block;width:100%;height:auto;border-bottom:1px solid var(--border)}
.st-card .board{aspect-ratio:1/1;background:var(--bg2);border-bottom:1px solid var(--border);display:grid;grid-template-columns:1fr 1fr;gap:6px;padding:12px}
.st-card .board span{border:1px dashed var(--border);border-radius:6px;font-size:10.5px;line-height:1.4;color:var(--muted);padding:8px;display:flex;flex-direction:column;justify-content:flex-end;gap:4px;overflow:hidden}
.st-card .board b{font-family:var(--mono);font-size:9.5px;font-weight:700;letter-spacing:.1em;color:var(--green)}
.st-card .body{padding:16px 18px 18px}
.st-card h3{font-size:16.5px;color:var(--text);margin:6px 0 6px;letter-spacing:-.01em}
.st-card p{font-size:13.5px;line-height:1.65;color:var(--muted)}
.st-card .punch,.st-card h3{color:var(--text)}
.st-card .punch{font-style:italic;color:var(--text)}
.st-pill{display:inline-block;font-family:var(--mono);font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;border-radius:999px;padding:3px 9px;background:var(--bg2);color:var(--muted)}
.st-pill.drawn{background:var(--greenBg);color:var(--green)}
.st-panels{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:26px;max-width:960px}
.st-panel{border:1px solid var(--border);border-radius:var(--r);background:var(--card);padding:18px 20px;display:flex;flex-direction:column;gap:10px}
.st-panel .n{font-family:var(--mono);font-size:11px;font-weight:700;letter-spacing:.12em;color:var(--green)}
.st-panel .scene{font-size:14px;line-height:1.65;color:var(--muted)}.st-panel .scene b{color:var(--text)}
.st-bubble{border:1.5px solid var(--text);border-radius:14px;padding:8px 12px;font-size:14px;line-height:1.5;color:var(--text);max-width:88%;align-self:flex-start;position:relative}
.st-bubble.thing{align-self:flex-end;background:var(--bg2)}
.st-bubble .who{display:block;font-family:var(--mono);font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--faint);margin-bottom:2px}
.st-panel .cap{font-family:var(--mono);font-size:11px;line-height:1.6;color:var(--faint);border-top:1px dashed var(--border);padding-top:8px}
.st-box{margin-top:22px;border:1px solid var(--border);border-radius:var(--r);background:var(--card);overflow:hidden;max-width:960px}
.st-bar{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 14px;background:var(--bg2);border-bottom:1px solid var(--border);font-family:var(--mono);font-size:11px;color:var(--muted)}
.st-copy{font-family:var(--sans);font-size:13px;font-weight:600;padding:8px 13px;border-radius:var(--r-sm);border:1px solid var(--green);background:var(--green);color:var(--card);cursor:pointer}
.st-prompt{margin:0;padding:18px 20px;font-family:var(--mono);font-size:12.5px;line-height:1.7;color:var(--text);white-space:pre-wrap;overflow-wrap:anywhere}
.st-src{position:absolute;left:-9999px;top:0;width:1px;height:1px;opacity:0}
.st-list{margin:22px 0 0;padding-left:20px;max-width:880px;font-size:14.5px;line-height:1.7;color:var(--muted)}
.st-list li+li{margin-top:6px}.st-list b{color:var(--text)}
@media (max-width:900px){.st-steps{grid-template-columns:1fr 1fr}.st-cards{grid-template-columns:1fr 1fr}.st-r{grid-template-columns:1fr 1fr}.st-r:first-child{display:none}.st-r>span:first-child{grid-column:1 / -1;border-bottom:1px solid var(--border)}.st-r>span:nth-child(2){border-left:0}.st-r>span:nth-child(4){border-left:0}.st-r>span:nth-child(n+4){border-top:1px dashed var(--border)}.st-r>span[data-k]::before{content:attr(data-k);display:block;font-family:var(--mono);font-size:9.5px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--faint);margin-bottom:3px}}
@media (max-width:640px){.st-steps,.st-cards,.st-panels{grid-template-columns:1fr}.st-r{grid-template-columns:1fr}.st-r>span+span{border-left:0 !important;border-top:1px dashed var(--border)}.st-r>span:first-child{border-bottom:0}}
`;

const donor = readFileSync(join(SITE, 'pricing.html'), 'utf8');
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

const name = (id) => CAST[id] ? CAST[id].name : id;
const short = (t, n) => (t.length > n ? t.slice(0, n - 1).replace(/\s+\S*$/, '') + '…' : t);
const isThing = (id) => cast.things.some((t) => t.id === id);
const castRow = (c, proposed) => `<div class="st-r${proposed ? ' proposed' : ''}" role="row"><span role="cell">${esc(c.name)}<span class="id">${esc(c.id)} · ${esc(c.role)}</span></span><span role="cell" class="q" data-k="Their line">&ldquo;${esc(c.line)}&rdquo;</span><span role="cell" data-k="Stands for">${esc(c.stands_for || c.why || '')}${c.note ? ` <em>${esc(c.note)}</em>` : ''}</span><span role="cell" data-k="Looks like">${esc(c.look || '')}</span></div>`;
const fullPrompt = (s) => `${s.prompt.shared}\n\n${s.prompt.per_panel.map((p) => p).join('\n\n')}\n\nThe cast, for reference: ${s.cast.map((id) => `${name(id)} (${CAST[id].role.toLowerCase()}): ${CAST[id].look}`).join(' · ')}\n\nStyle: ${cast.style}`;

// ------------------------------------------------------------------ the section page
function indexPage() {
  const drawn = stories.filter((s) => s.status === 'drawn').length;
  const body = `<main class="phero">
  <div class="wrap">
    <span class="eyebrow"><span class="d"></span> Stories</span>
    <h1>The same people, <span class="it">every time.</span></h1>
    <p class="sub" style="margin-bottom:20px">Most of what this site says is an argument. Some of it is a story, and a story with a cast is remembered where an argument is filed. This is where the stories are kept: a cast of nine, a workflow that starts with the narrative and ends with an image model, and ${stories.length} storyboards so far, ${drawn} of them drawn.</p>
    <p class="meta"><b>Where this goes:</b> a site of its own, stories.sgit.ai. Every story here is a data file, so it can move without being rewritten.</p>
    <p class="meta"><b>The rule:</b> every scenario is fictionalised and says so on the picture. Nobody's product is drawn, nobody's face, and nothing is scored.</p>
  </div>
</main>

<div class="paper">

<section class="psection">
  <div class="wrap">
    <div class="shead">
      <span class="tag">01 · Why stories</span>
      <h2>An argument is filed. <span class="g">A story is remembered.</span></h2>
      <p>The articles on this site carry stories already: a rep who asked for a draft and got a sent email; a pilot that worked until somebody asked what else it could do; a calendar tidied into a mess with no undo; a risk that sat on a desk for a week and moved up on its own. Told with the same cast each time, they become one world a reader can walk into, and each new story costs less to tell than the last.</p>
    </div>
    <p class="st-note">The order matters. The lead&rsquo;s instruction is the film industry&rsquo;s: <b>story first, then the narrative, then the punchline, then the cast, then the storyboard</b>. The image models come last, and there are several to try, not one. A storyboard is the artefact that makes that possible: panel by panel, who is in it, what they say, what the caption carries, and the prompt each panel becomes. It can be handed to any model, and it is the thing to argue about before anything is drawn.</p>
  </div>
</section>

<section class="psection alt">
  <div class="wrap">
    <div class="shead">
      <span class="tag">02 · The workflow</span>
      <h2>Seven steps, <span class="g">and the picture is the last.</span></h2>
    </div>
    <div class="st-steps">
      <div class="st-step"><h3>The story</h3><p>One thing that happens to somebody. Usually it is already in an article, as an example.</p></div>
      <div class="st-step"><h3>The narrative</h3><p>The order it is told in, and the moment the reader learns what the character learns.</p></div>
      <div class="st-step"><h3>The punchline</h3><p>One line, true and dry, that the reader would repeat. It goes under the strip.</p></div>
      <div class="st-step"><h3>The cast</h3><p>Who is in it, from the nine below. A new character is a decision, not a convenience.</p></div>
      <div class="st-step"><h3>The storyboard</h3><p>Panels: scene, action, dialogue, caption. Written here, as data, and read against the site&rsquo;s rules.</p></div>
      <div class="st-step"><h3>The prompts</h3><p>One prompt per story, one line per panel, in the cast&rsquo;s style, for whichever image model is being tried.</p></div>
      <div class="st-step"><h3>The picture, reviewed</h3><p>Drawn, then checked against the storyboard and the rules, with what to correct written beside it.</p></div>
      <div class="st-step"><h3>Published</h3><p>On the story&rsquo;s page, in the article it came from, and, one panel at a time, on a shirt.</p></div>
    </div>
  </div>
</section>

<section class="psection">
  <div class="wrap">
    <div class="shead">
      <span class="tag">03 · The cast</span>
      <h2>Six people, three things, <span class="g">one proposed.</span></h2>
      <p>Version ${esc(cast.version)}, drawn by ${esc(cast.drawn.model)} on ${niceDate(cast.drawn.date)} from the lead&rsquo;s prompt. The names, roles and lines are as drawn; what each one stands for is ours, so that a story can be written against the model on this site rather than against a picture.</p>
    </div>
    <figure class="st-fig"><img src="${esc(cast.drawn.image)}" width="${cast.drawn.width}" height="${cast.drawn.height}" loading="lazy" alt="${esc(cast.drawn.alt)}"><figcaption>${esc(cast.drawn.title)} · character explorations ${esc(cast.version)} · ${esc(cast.drawn.model)}, ${niceDate(cast.drawn.date)}</figcaption></figure>
    <p class="st-k" style="margin-top:26px">The people</p>
    <div class="st-t" role="table" aria-label="The people in the cast">
      <div class="st-r" role="row"><span role="columnheader">Who</span><span role="columnheader">Their line</span><span role="columnheader">Stands for</span><span role="columnheader">Looks like</span></div>
      ${cast.people.map((c) => castRow(c)).join('\n      ')}
    </div>
    <p class="st-k" style="margin-top:26px">The things</p>
    <div class="st-t" role="table" aria-label="The things in the cast">
      <div class="st-r" role="row"><span role="columnheader">What</span><span role="columnheader">Its line</span><span role="columnheader">Stands for</span><span role="columnheader">Looks like</span></div>
      ${cast.things.map((c) => castRow(c)).join('\n      ')}
    </div>
    ${cast.proposed && cast.proposed.length ? `<p class="st-k" style="margin-top:26px">Proposed, not drawn</p>
    <div class="st-t" role="table" aria-label="Proposed cast members">
      <div class="st-r" role="row"><span role="columnheader">Who</span><span role="columnheader">Their line</span><span role="columnheader">Why</span><span role="columnheader"></span></div>
      ${cast.proposed.map((c) => castRow(c, true)).join('\n      ')}
    </div>` : ''}
    <p class="st-note"><b>The style</b>, for any model: ${esc(cast.style)}</p>
  </div>
</section>

<section class="psection alt">
  <div class="wrap">
    <div class="shead">
      <span class="tag">04 · The stories</span>
      <h2>${stories.length} so far, <span class="g">${drawn} drawn.</span></h2>
      <p>Each has its page: the truth under it, the storyboard panel by panel, the prompt for an image model, and, where a model has drawn it, the picture and what to correct.</p>
    </div>
    <div class="st-cards">
      ${stories.map((s) => `<a class="st-card" href="story-${esc(s.slug)}.html">${s.status === 'drawn' ? `<img src="${esc(s.drawn.image)}" width="${s.drawn.width}" height="${s.drawn.height}" loading="lazy" alt="${esc(s.drawn.alt)}">` : `<div class="board" aria-hidden="true">${s.panels.map((p) => `<span><b>PANEL ${p.n}</b>${esc(((p.dialogue || [])[0] || {}).says ? '“' + short(p.dialogue[0].says, 44) + '”' : short(p.scene, 44))}</span>`).join('')}</div>`}<div class="body"><span class="st-pill${s.status === 'drawn' ? ' drawn' : ''}">${s.status === 'drawn' ? 'Drawn' : 'Storyboard'} · ${esc(s.format || `${s.panels.length} panels`)}</span><h3>${esc(s.title)}</h3><p class="punch">${esc(s.punchline)}</p><p>${s.cast.map(name).join(', ')}.</p></div></a>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="psection">
  <div class="wrap">
    <div class="shead">
      <span class="tag">05 · The rules for a story</span>
      <h2>The site&rsquo;s rules, <span class="g">in pictures.</span></h2>
    </div>
    <ul class="st-list">
      <li><b>Fictionalised, and it says so.</b> Every picture carries a line: <em>Illustrative scenario</em> or <em>Fictionalised scenario</em>. Nobody&rsquo;s product, interface, logo or face is drawn; a screen is a generic screen.</li>
      <li><b>The truth under the joke is one the site states.</b> A story page names the article or the record it comes from, and the storyboard is read against it before it is drawn.</li>
      <li><b>No score.</b> A count is fine. A grade, a level, a traffic light or a verdict is not, on a shirt or in a panel.</li>
      <li><b>The words are the site&rsquo;s.</b> Agent Behaviour Policy, the behaviour policy, the ABP, never ADP and never the policy alone. Mandate, grant, boundary, expectation. British spelling. A ladder has steps, and the build refuses the other word for them.</li>
      <li><b>The cast is the cast.</b> A new character is added to the cast file with what they stand for, then used. A story does not invent one.</li>
      <li><b>What a model got wrong is written down, not painted over.</b> A drawn story carries its notes: what to correct, and why.</li>
    </ul>
  </div>
</section>

<section class="psection alt">
  <div class="wrap">
    <div class="shead">
      <span class="tag">What is not done</span>
      <h2>What this section does not have yet.</h2>
    </div>
    <ul class="st-list">
      <li><b>Models other than ChatGPT&rsquo;s.</b> The three drawn pieces are from one model. The storyboards are written so that the same prompt can go to another; none has yet.</li>
      <li><b>The one who signs.</b> The site&rsquo;s main idea, accepting a risk for a stated interval, has no character. One is proposed above.</li>
      <li><b>A story with the two questions asked at the board.</b> <em>Nobody decided</em> ends there; a story that starts there is not written.</li>
      <li><b>Voice.</b> A storyboard could be read aloud by a voice model; nothing here is recorded.</li>
    </ul>
  </div>
</section>

</div>

<section class="pcta">
  <div class="wrap">
    <span class="eyebrow"><span class="d"></span> Tell one</span>
    <h2>Every story here started <span class="it">as an example in an article.</span></h2>
    <p>If one of yours has a rep, a founder, a risk owner and an agent in it, it is a storyboard already. Send the story and the punchline; the cast will do the rest.</p>
    <div class="cta-row"><a class="btn btn-green" href="articles.html">The articles</a><a class="btn btn-ghost" href="mailto:dinis.cruz@owasp.org?subject=A%20story">Send a story</a></div>
  </div>
</section>`;
  return cut('stories', 'RiskMandate — Stories: a cast, and storyboards told with it',
    `A cast of nine, a workflow from story to storyboard to image model, and ${stories.length} storyboards so far, ${drawn} of them drawn. Every scenario is fictionalised and says so on the picture. Nothing is scored.`, body);
}

// ------------------------------------------------------------------ a story page
function storyPage(s) {
  const nameOf = `story-${s.slug}`;
  const prompt = fullPrompt(s);
  const body = `<main class="phero">
  <div class="wrap">
    <span class="eyebrow"><span class="d"></span> Story · ${s.status === 'drawn' ? 'drawn' : 'storyboard'} · ${esc(s.format || `${s.panels.length} panels`)}</span>
    <h1>${esc(s.title)}</h1>
    <p class="sub" style="margin-bottom:20px"><em>${esc(s.punchline)}</em> With ${s.cast.map((id) => `${name(id)}, ${CAST[id].role.toLowerCase()}`).join('; ')}.</p>
    <p class="meta"><b>Where it comes from:</b> ${esc(s.source.what)} <a href="${esc(s.source.url)}">${esc(s.source.url)}</a>${(s.source.also || []).map((a) => ` · <a href="${esc(a.url)}">${esc(a.label)}</a>`).join('')}</p>
    <p class="meta"><b>Fictionalised.</b> Nobody&rsquo;s product is drawn and nobody&rsquo;s system was tested. The truth under the story is the site&rsquo;s, and it is stated below.</p>
    <p class="meta"><b>This page as markdown:</b> <a href="${nameOf}.md">${nameOf}.md</a></p>
  </div>
</main>

<div class="paper">

${s.status === 'drawn' ? `<section class="psection">
  <div class="wrap">
    <div class="shead">
      <span class="tag">As drawn</span>
      <h2>By ${esc(s.drawn.model)}, <span class="g">${niceDate(s.drawn.date)}.</span></h2>
    </div>
    <figure class="st-fig"><img src="${esc(s.drawn.image)}" width="${s.drawn.width}" height="${s.drawn.height}" alt="${esc(s.drawn.alt)}"><figcaption>${esc(s.title)} · ${esc(s.punchline)} · ${esc(s.drawn.model)}, ${niceDate(s.drawn.date)}</figcaption></figure>
    ${(s.drawn.notes || []).length ? `<p class="st-k" style="margin-top:22px">What to correct</p><ul class="st-list" style="margin-top:10px">${s.drawn.notes.map((n) => `<li>${esc(n)}</li>`).join('')}</ul>` : ''}
  </div>
</section>` : ''}

<section class="psection${s.status === 'drawn' ? ' alt' : ''}">
  <div class="wrap">
    <div class="shead">
      <span class="tag">01 · The truth under it</span>
      <h2>What the story says <span class="g">that the site also says.</span></h2>
      <p>${esc(s.truth)}</p>
    </div>
  </div>
</section>

<section class="psection${s.status === 'drawn' ? '' : ' alt'}">
  <div class="wrap">
    <div class="shead">
      <span class="tag">02 · The storyboard</span>
      <h2>${s.panels.length} panels, <span class="g">in order.</span></h2>
      <p>Scene, action, what is said, and what the caption carries. This is the thing to argue about before anything is drawn.</p>
    </div>
    <div class="st-panels">
      ${s.panels.map((p) => `<div class="st-panel"><span class="n">PANEL ${p.n}</span><p class="scene"><b>Scene.</b> ${esc(p.scene)}${p.action ? ` <b>Action.</b> ${esc(p.action)}` : ''}</p>${(p.dialogue || []).map((d) => `<div class="st-bubble${isThing(d.who) ? ' thing' : ''}"><span class="who">${esc(name(d.who))}</span>${esc(d.says)}</div>`).join('')}${p.caption ? `<p class="cap">${esc(p.caption)}</p>` : ''}</div>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="psection${s.status === 'drawn' ? ' alt' : ''}">
  <div class="wrap">
    <div class="shead">
      <span class="tag">03 · The prompt</span>
      <h2>For an image model, <span class="g">any of them.</span></h2>
      <p>The shared part, one line per panel, the cast&rsquo;s looks and the style. Copy it whole and paste it as the first message.</p>
    </div>
    <div class="st-box">
      <div class="st-bar"><span>The whole prompt</span><button class="st-copy" id="st-copy" type="button">Copy the prompt</button></div>
      <pre class="st-prompt">${esc(prompt)}</pre>
    </div>
    <textarea class="st-src" id="st-src" readonly tabindex="-1" aria-hidden="true">${esc(prompt)}</textarea>
  </div>
</section>

${(s.for_merch || []).length ? `<section class="psection${s.status === 'drawn' ? '' : ' alt'}">
  <div class="wrap">
    <div class="shead">
      <span class="tag">04 · One panel, on a shirt</span>
      <h2>What of it <span class="g">would sell on its own.</span></h2>
    </div>
    <ul class="st-list">${s.for_merch.map((m) => `<li>${esc(m)}</li>`).join('')}</ul>
    <p class="st-note">The brief for that is <a href="admin/briefs/merch__funny-designs-for-people-who-hold-the-risk/index.html">on the console</a>.</p>
  </div>
</section>` : ''}

</div>

<section class="pcta">
  <div class="wrap">
    <span class="eyebrow"><span class="d"></span> The cast</span>
    <h2>Same people, <span class="it">next story.</span></h2>
    <p>${s.cast.map(name).join(', ')} and the rest are on the stories page, with what each one stands for, and the workflow every story goes through before it is drawn.</p>
    <div class="cta-row"><a class="btn btn-green" href="stories.html">All the stories</a><a class="btn btn-ghost" href="${esc(s.source.url)}">The article it came from</a></div>
  </div>
</section>
<script>
(function () {
  'use strict';
  var b = document.getElementById('st-copy'), src = document.getElementById('st-src');
  if (!b || !src) return;
  b.addEventListener('click', function () {
    var text = src.value, done = function () { b.textContent = 'Copied'; setTimeout(function () { b.textContent = 'Copy the prompt'; }, 2000); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, function () { src.select(); document.execCommand('copy'); done(); });
    else { src.select(); document.execCommand('copy'); done(); }
  });
})();
</script>`;
  return cut(nameOf, `RiskMandate — ${s.title} ${s.punchline}`,
    `A story told with the cast: ${s.punchline} ${s.status === 'drawn' ? 'Drawn, with what to correct.' : 'A storyboard, not yet drawn.'} The truth under it, the panels, and the prompt for an image model. Fictionalised; nobody's product is drawn.`, body);
}

// ------------------------------------------------------------------ write, or check
const outputs = { 'stories.html': indexPage() };
for (const s of stories) outputs[`story-${s.slug}.html`] = storyPage(s);
const stale = [];
for (const [file, want] of Object.entries(outputs)) {
  const path = join(SITE, file);
  const have = existsSync(path) ? readFileSync(path, 'utf8') : null;
  if (have === want) continue;
  if (CHECK) stale.push(file); else writeFileSync(path, want);
}
if (CHECK) { if (stale.length) fail(`stale: ${stale.join(', ')} — run build-stories.mjs`); console.log(`stories: ${Object.keys(outputs).length} pages up to date`); }
else console.log(`stories: wrote ${Object.keys(outputs).length} pages (${stories.length} stories, ${cast.people.length + cast.things.length} in the cast)`);
