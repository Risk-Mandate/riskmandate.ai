// build-stories.mjs — the stories: a cast, and storyboards told with it.
//
//   node scripts/site/build-stories.mjs [--check]
//
// Reads site/stories/cast.json, site/stories/<slug>.json and site/stories/board.json, and writes
// site/stories/index.html (the section: what a story is here, the workflow, the cast, the list,
// who does what and the board) and site/stories/<slug>.html (one storyboard: the truth under it,
// the panels, the prompt for an image model, and, when it has been drawn, the picture with what
// to correct). The order is the lead's, 26 September 2026: story, narrative, punchline, cast,
// storyboard, and only then an image model. A story is data so that it can move to
// stories.sgit.ai later without being rewritten, and from v1.34.19 everything lives in the one
// folder, served as riskmandate.ai/stories/: the data, the images, the pages and their twins.
//
// A page in a folder links from the site root: every href and src it carries starts with a slash,
// and RM.data.base tells the shared menu to do the same. The chrome is cut from pricing.html like
// every other built page and rewritten that way, so a chrome change reaches these pages by
// running this again after the donor changed.
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
const DATA    = ['cast.json', 'board.json'];   // the two JSON files in the folder that are not stories
const stories = readdirSync(IN).filter((f) => f.endsWith('.json') && !DATA.includes(f) && !f.startsWith('_')).sort()
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
  if (s.status === 'drawn') { if (!s.drawn || !s.drawn.image) fail(`${s.slug}: drawn, and no image`); if (!existsSync(join(IN, s.drawn.image))) fail(`${s.slug}: ${s.drawn.image} is not in site/stories/`); }
  const all = JSON.stringify(s);
  if (/\brungs?\b/i.test(all)) fail(`${s.slug}: says rung`);
  if (/\bADP\b/.test(all)) fail(`${s.slug}: says ADP`);
}
if (!existsSync(join(IN, cast.drawn.image))) fail(`cast: ${cast.drawn.image} is not in site/stories/`);
const board = existsSync(join(IN, 'board.json')) ? JSON.parse(readFileSync(join(IN, 'board.json'), 'utf8')) : { columns: [], cards: [], agents: [] };
for (const c of board.cards) { if (/\brungs?\b/i.test(c.title)) fail(`board: ${c.id} says rung`); }
const HERE = '/stories/';   // where the folder is served from

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
.st-board{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-top:14px}
.st-col{background:var(--bg2);border:1px solid var(--border);border-radius:var(--r);padding:10px;min-height:120px}
.st-col h3{font-family:var(--mono);font-size:10.5px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);margin:2px 4px 10px;display:flex;justify-content:space-between}.st-col h3 b{color:var(--green)}
.st-cardlet{display:flex;flex-direction:column;gap:2px;background:var(--card);border:1px solid var(--border);border-radius:8px;padding:9px 11px;margin-bottom:8px}
.st-cardlet .id{font-family:var(--mono);font-size:10.5px;color:var(--faint)}.st-cardlet .t{font-size:13.5px;font-weight:600;color:var(--text);line-height:1.4}.st-cardlet .who{font-family:var(--mono);font-size:10.5px;color:var(--muted)}
.st-cardlet .on{margin-top:4px;font-size:12px;color:var(--gold);background:var(--goldBg,rgba(180,83,9,.08));border-radius:6px;padding:3px 8px}
.st-cardlet.done .t{color:var(--muted);text-decoration:line-through}.st-cardlet.high{border-left:3px solid var(--green)}
.st-changes{font-size:13.5px}.st-changes .id{font-family:var(--mono);font-size:11px;color:var(--faint)}.st-changes code{font-family:var(--mono);font-size:11.5px;background:var(--bg2);padding:1px 5px;border-radius:4px;color:var(--text)}
@media (max-width:900px){.st-board{grid-template-columns:1fr 1fr}.st-steps{grid-template-columns:1fr 1fr}.st-cards{grid-template-columns:1fr 1fr}.st-r{grid-template-columns:1fr 1fr}.st-r:first-child{display:none}.st-r>span:first-child{grid-column:1 / -1;border-bottom:1px solid var(--border)}.st-r>span:nth-child(2){border-left:0}.st-r>span:nth-child(4){border-left:0}.st-r>span:nth-child(n+4){border-top:1px dashed var(--border)}.st-r>span[data-k]::before{content:attr(data-k);display:block;font-family:var(--mono);font-size:9.5px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--faint);margin-bottom:3px}}
@media (max-width:640px){.st-steps,.st-cards,.st-panels,.st-board{grid-template-columns:1fr}.st-r{grid-template-columns:1fr}.st-r>span+span{border-left:0 !important;border-top:1px dashed var(--border)}.st-r>span:first-child{border-bottom:0}}
`;

const donor = readFileSync(join(SITE, 'pricing.html'), 'utf8');
// every relative href or src becomes root-absolute; anchors, mailto:, data: and full URLs are left
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
    <p class="meta"><b>Where this goes:</b> a site of its own, stories.sgit.ai. Every story here is a data file in the one folder this section is served from, so it can move without being rewritten.</p>
    <p class="meta"><b>How it is made:</b> three parties, one encrypted vault, requests as files, and a board nobody drags. <a href="#made">Section 06</a>.</p>
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
    <figure class="st-fig"><img src="${HERE}${esc(cast.drawn.image)}" width="${cast.drawn.width}" height="${cast.drawn.height}" loading="lazy" alt="${esc(cast.drawn.alt)}"><figcaption>${esc(cast.drawn.title)} · character explorations ${esc(cast.version)} · ${esc(cast.drawn.model)}, ${niceDate(cast.drawn.date)}</figcaption></figure>
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
      ${stories.map((s) => `<a class="st-card" href="${HERE}${esc(s.slug)}.html">${s.status === 'drawn' ? `<img src="${HERE}${esc(s.drawn.image)}" width="${s.drawn.width}" height="${s.drawn.height}" loading="lazy" alt="${esc(s.drawn.alt)}">` : `<div class="board" aria-hidden="true">${s.panels.map((p) => `<span><b>PANEL ${p.n}</b>${esc(((p.dialogue || [])[0] || {}).says ? '“' + short(p.dialogue[0].says, 44) + '”' : short(p.scene, 44))}</span>`).join('')}</div>`}<div class="body"><span class="st-pill${s.status === 'drawn' ? ' drawn' : ''}">${s.status === 'drawn' ? 'Drawn' : 'Storyboard'} · ${esc(s.format || `${s.panels.length} panels`)}</span><h3>${esc(s.title)}</h3><p class="punch">${esc(s.punchline)}</p><p>${s.cast.map(name).join(', ')}.</p></div></a>`).join('\n      ')}
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

<section class="psection alt" id="made">
  <div class="wrap">
    <div class="shead">
      <span class="tag">06 · Who does what</span>
      <h2>Three parties, one vault, <span class="g">and a board nobody drags.</span></h2>
      <p>A story is made by three parties who never sit in the same session. They share one encrypted vault, and they talk through files in it: a request is a message, a deliverable is a file, a task is a file in one of three folders. The protocol is <a href="https://sgraph.ai/en-gb/library/how-it-works/email-fs-lite">Email-FS-lite</a>, sgraph.ai&rsquo;s: no broker, no API, one commit per round of work, and the vault&rsquo;s history is the record of who did what and when.</p>
    </div>
    <div class="st-t" role="table" aria-label="Who does what">
      <div class="st-r" role="row"><span role="columnheader">Who</span><span role="columnheader">Writes in</span><span role="columnheader">Does</span><span role="columnheader">Never</span></div>
      <div class="st-r" role="row"><span role="cell">The lead<span class="id">dinis.human</span></span><span role="cell" class="q" data-k="Writes in">its own folder, and a reply</span><span role="cell" data-k="Does">decides: the cast, which story next, what is published. A request that sits in its mailroom is on the board as waiting until it moves.</span><span role="cell" data-k="Never">edits anybody else&rsquo;s folder</span></div>
      <div class="st-r" role="row"><span role="cell">The studio<span class="id">studio.chatgpt</span></span><span role="cell" class="q" data-k="Writes in">its own folder</span><span role="cell" data-k="Does">writes storyboards in the story file&rsquo;s shape, draws them with whichever image model is being tried, proposes cast, delivers files and says which model drew what and when.</span><span role="cell" data-k="Never">edits the published stories; draws a real product or a real face; scores anything</span></div>
      <div class="st-r" role="row"><span role="cell">The publisher<span class="id">publisher.claude</span></span><span role="cell" class="q" data-k="Writes in">its own folder, and this site</span><span role="cell" data-k="Does">reads the vault, checks a delivered story against the site&rsquo;s rules, publishes it here as a patch release, copies what is live back into the vault, and regenerates the board. The one party that touches both.</span><span role="cell" data-k="Never">publishes what the lead has not accepted; keeps a key in a file</span></div>
    </div>
    <p class="st-note"><b>The loop.</b> Pull the vault; the diff is the inbox. Move new messages from the mailroom into the inbox. Do the work. Update the tasks. Send the replies. Move finished messages to done. One commit, one push, one status check. The publisher runs it by hand today and on a schedule once the key is in its environment; a run is a session, and a session is a commit in the vault&rsquo;s history. The vault was born on 26 September 2026 with the studio&rsquo;s own folders already in it: its artwork, its scripts, its cast file, its decisions; those stay the studio&rsquo;s, and the publisher never writes in them.</p>
    <p class="st-k" style="margin-top:26px">The board</p>
    <p class="st-note" style="margin-top:8px">Derived, not drawn: every task in every party&rsquo;s open, blocked and done folders, and every message still waiting in a mailroom as requested work for its recipient. A card moves because a file moved. ${board.generated ? `Generated ${esc(board.generated.replace('T', ' ').replace('Z', ' UTC'))}.` : ''}</p>
    <div class="st-board">
      ${board.columns.map((c) => { const mine = board.cards.filter((k) => k.state === c); return `<div class="st-col"><h3>${esc(c)} <b>${mine.length}</b></h3>${mine.map((k) => `<div class="st-cardlet${k.state === 'done' ? ' done' : ''}${k.priority === 'high' ? ' high' : ''}"><span class="id">${esc(k.id)}${k.priority && k.priority !== 'normal' ? ' · ' + esc(k.priority) : ''}</span><span class="t">${esc(k.title)}</span><span class="who">${k.state === 'requested' ? 'for ' : ''}${esc(k.owner)}${k.from ? ' · from ' + esc(k.from) : ''}</span>${k.blocked_on ? `<span class="on">waiting on ${esc(k.blocked_on)}</span>` : ''}</div>`).join('')}</div>`; }).join('\n      ')}
    </div>
    ${(board.changes || []).length ? `<p class="st-k" style="margin-top:26px">What moved, revision by revision</p>
    <p class="st-note" style="margin-top:8px">The board is versioned. Every generation that moved a card is a revision; the diff against the one before is kept with the board, and every earlier state is kept in the vault under <code>board/history/</code>. This board is at revision ${board.revision}.</p>
    <ul class="st-list st-changes">
      ${board.changes.slice(0, 10).map((c) => `<li><b>Revision ${c.revision}</b> <span class="id">${esc(c.at.replace('T', ' ').replace('Z', ' UTC'))} · ${esc(c.by)}</span>${c.note ? ` ${esc(c.note)}` : ''}${c.added.length ? `<br>Added: ${c.added.map((k) => `<code>${esc(k.id)}</code> ${esc(k.title)} (${esc(k.state)})`).join('; ')}.` : ''}${c.moved.length ? `<br>Moved: ${c.moved.map((k) => `<code>${esc(k.id)}</code> ${esc(k.from)} → ${esc(k.to)}`).join('; ')}.` : ''}${c.removed.length ? `<br>Removed: ${c.removed.map((k) => `<code>${esc(k.id)}</code> ${esc(k.title)}`).join('; ')}.` : ''}${c.retitled.length ? `<br>Retitled: ${c.retitled.map((k) => `<code>${esc(k.id)}</code> to ${esc(k.title)}`).join('; ')}.` : ''}</li>`).join('\n      ')}
    </ul>` : ''}
    <p class="st-note">The same board is drawn inside the vault by a page that reads the same file, so the studio and the lead see it without this site. The tooling is one script in the repository, <code>scripts/stories/mail.mjs</code>: send, deliver, done, issue, board. Nothing in it talks to the network. A second board is a second folder with the same shape and its own revisions.</p>
  </div>
</section>

<section class="psection">
  <div class="wrap">
    <div class="shead">
      <span class="tag">What is not done</span>
      <h2>What this section does not have yet.</h2>
    </div>
    <ul class="st-list">
      <li><b>The studio has not replied yet.</b> The vault exists, the mailboxes are in it, and the first six messages wait in two mailrooms; nothing has come back, so the board above shows the publisher&rsquo;s side only. A story the studio drew that the site does not have, <em>While I was there</em>, is written up and waiting on the lead&rsquo;s yes.</li>
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
    <div class="cta-row"><a class="btn btn-green" href="/articles.html">The articles</a><a class="btn btn-ghost" href="mailto:dinis.cruz@owasp.org?subject=A%20story">Send a story</a></div>
  </div>
</section>`;
  return cut('stories/index.html', 'stories', 'RiskMandate — Stories: a cast, and storyboards told with it',
    `A cast of nine, a workflow from story to storyboard to image model, ${stories.length} storyboards so far, ${drawn} of them drawn, and the board of who does what. Every scenario is fictionalised and says so on the picture. Nothing is scored.`, body);
}

// ------------------------------------------------------------------ a story page
function storyPage(s) {
  const nameOf = `stories-${s.slug}`;
  const prompt = fullPrompt(s);
  const body = `<main class="phero">
  <div class="wrap">
    <span class="eyebrow"><span class="d"></span> Story · ${s.status === 'drawn' ? 'drawn' : 'storyboard'} · ${esc(s.format || `${s.panels.length} panels`)}</span>
    <h1>${esc(s.title)}</h1>
    <p class="sub" style="margin-bottom:20px"><em>${esc(s.punchline)}</em> With ${s.cast.map((id) => `${name(id)}, ${CAST[id].role.toLowerCase()}`).join('; ')}.</p>
    <p class="meta"><b>Where it comes from:</b> ${esc(s.source.what)} <a href="/${esc(s.source.url)}">${esc(s.source.url)}</a>${(s.source.also || []).map((a) => ` · <a href="/${esc(a.url)}">${esc(a.label)}</a>`).join('')}</p>
    <p class="meta"><b>Fictionalised.</b> Nobody&rsquo;s product is drawn and nobody&rsquo;s system was tested. The truth under the story is the site&rsquo;s, and it is stated below.</p>
    <p class="meta"><b>This page as markdown:</b> <a href="${HERE}${esc(s.slug)}.md">${esc(s.slug)}.md</a></p>
  </div>
</main>

<div class="paper">

${s.status === 'drawn' ? `<section class="psection">
  <div class="wrap">
    <div class="shead">
      <span class="tag">As drawn</span>
      <h2>By ${esc(s.drawn.model)}, <span class="g">${niceDate(s.drawn.date)}.</span></h2>
    </div>
    <figure class="st-fig"><img src="${HERE}${esc(s.drawn.image)}" width="${s.drawn.width}" height="${s.drawn.height}" alt="${esc(s.drawn.alt)}"><figcaption>${esc(s.title)} · ${esc(s.punchline)} · ${esc(s.drawn.model)}, ${niceDate(s.drawn.date)}</figcaption></figure>
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
    <p class="st-note">The brief for that is <a href="/admin/briefs/merch__funny-designs-for-people-who-hold-the-risk/index.html">on the console</a>.</p>
  </div>
</section>` : ''}

</div>

<section class="pcta">
  <div class="wrap">
    <span class="eyebrow"><span class="d"></span> The cast</span>
    <h2>Same people, <span class="it">next story.</span></h2>
    <p>${s.cast.map(name).join(', ')} and the rest are on the stories page, with what each one stands for, and the workflow every story goes through before it is drawn.</p>
    <div class="cta-row"><a class="btn btn-green" href="${HERE}">All the stories</a><a class="btn btn-ghost" href="/${esc(s.source.url)}">The article it came from</a></div>
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
  return cut(`stories/${s.slug}.html`, nameOf, `RiskMandate — ${s.title} ${s.punchline}`,
    `A story told with the cast: ${s.punchline} ${s.status === 'drawn' ? 'Drawn, with what to correct.' : 'A storyboard, not yet drawn.'} The truth under it, the panels, and the prompt for an image model. Fictionalised; nobody's product is drawn.`, body);
}

// ------------------------------------------------------------------ write, or check
const outputs = { 'stories/index.html': indexPage() };
for (const s of stories) outputs[`stories/${s.slug}.html`] = storyPage(s);
const stale = [];
for (const [file, want] of Object.entries(outputs)) {
  const path = join(SITE, file);
  const have = existsSync(path) ? readFileSync(path, 'utf8') : null;
  if (have === want) continue;
  if (CHECK) stale.push(file); else writeFileSync(path, want);
}
if (CHECK) { if (stale.length) fail(`stale: ${stale.join(', ')} — run build-stories.mjs`); console.log(`stories: ${Object.keys(outputs).length} pages up to date`); }
else console.log(`stories: wrote ${Object.keys(outputs).length} pages (${stories.length} stories, ${cast.people.length + cast.things.length} in the cast)`);
