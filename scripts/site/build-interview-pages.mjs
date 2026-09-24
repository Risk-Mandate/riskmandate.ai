// build-interview-pages.mjs — pages that turn twenty minutes of an expert talking into written feedback.
//
//   node scripts/site/build-interview-pages.mjs [--check]
//
// Reads site/interviews/<slug>.json (files beginning with _ are templates) and writes
// site/interview-<slug>.html. The pattern comes from sgit.ai's brief of 24 September 2026: a page
// sent to one kind of person, carrying a prompt they copy into their own assistant, which
// interviews them by voice and writes up a summary they send back. Every page has the same six
// parts in the same order:
//
//   1. who this is for, and why you      4. the prompt, with a copy button
//   2. what we want to learn             5. what happens to your answers
//   3. how it works, in three steps      6. how to send it back
//
// The page is static. It loads nothing from anywhere else and sends nothing anywhere: the copy
// button writes the prompt to the reader's clipboard and that is all the script does. The prompt
// is carried in a hidden textarea so the copy is exact, line breaks included.

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve }                               from 'node:path';
import { fileURLToPath }                                        from 'node:url';

const ROOT  = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const SITE  = join(ROOT, 'site');
const IN    = join(SITE, 'interviews');
const CHECK = process.argv.includes('--check');
const esc   = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const fail  = (m) => { console.error(`interview pages: ${m}`); process.exit(1); };

const pages = readdirSync(IN).filter((f) => f.endsWith('.json') && !f.startsWith('_')).sort()
  .map((f) => JSON.parse(readFileSync(join(IN, f), 'utf8')));
for (const p of pages) {
  for (const k of ['slug', 'audience', 'title', 'who', 'why_you', 'learn', 'prompt', 'send']) if (!p[k]) fail(`${p.slug || '?'}: missing ${k}`);
  if (p.learn.length < 3 || p.learn.length > 6) fail(`${p.slug}: three to six things to learn, not ${p.learn.length}`);
  if (/\{\{|<[a-z]/i.test(p.prompt)) fail(`${p.slug}: the prompt has a placeholder or markup in it`);
  if (/\bADP\b/.test(p.prompt)) fail(`${p.slug}: the prompt says ADP`);
}

const CSS = `
/* interview pages — six parts, in order, and a prompt that copies exactly */
.iv-learn{margin-top:22px;max-width:860px;display:flex;flex-direction:column}
.iv-learn li{list-style:none;font-size:16px;line-height:1.6;color:var(--text);padding:12px 0 12px 30px;border-top:1px solid var(--border);position:relative}
.iv-learn li:last-child{border-bottom:1px solid var(--border)}
.iv-learn li::before{content:"?";position:absolute;left:4px;top:12px;font-family:var(--mono);font-weight:700;color:var(--green)}
.iv-steps{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;margin-top:24px}
.iv-step{background:var(--card);border:1px solid var(--border);border-radius:var(--r);padding:20px 22px}
.iv-step .n{font-family:var(--mono);font-size:12px;font-weight:700;color:var(--green);background:var(--greenBg);border-radius:8px;width:30px;height:30px;display:grid;place-items:center}
.iv-step h3{font-size:16.5px;color:var(--text);margin:12px 0 6px}
.iv-step p{font-size:14.5px;line-height:1.65;color:var(--muted)}
.iv-box{margin-top:24px;border:1px solid var(--border);border-radius:var(--r);background:var(--card);overflow:hidden;max-width:900px}
.iv-bar{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 16px;border-bottom:1px solid var(--border);background:var(--bg2)}
.iv-bar span{font-family:var(--mono);font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--muted)}
.iv-copy{font:inherit;font-size:14px;font-weight:700;color:#fff;background:var(--green);border:0;border-radius:999px;padding:9px 18px;cursor:pointer}
.iv-copy:focus-visible{outline:2px solid var(--text);outline-offset:2px}
.iv-prompt{margin:0;padding:18px 20px;max-height:460px;overflow:auto;white-space:pre-wrap;overflow-wrap:anywhere;font-family:var(--mono);font-size:12.5px;line-height:1.7;color:var(--text)}
.iv-src{position:absolute;left:-9999px;width:1px;height:1px;opacity:0}
.iv-note{font-size:14.5px;line-height:1.75;color:var(--muted);max-width:880px;margin-top:14px}
.iv-note b{color:var(--text)}
.iv-note a{color:var(--green)}
.iv-safe{margin-top:22px;max-width:880px}
.iv-safe li{font-size:15px;line-height:1.75;color:var(--muted);margin:6px 0 0 18px}
.iv-safe b{color:var(--text)}
@media (max-width:760px){.iv-steps{grid-template-columns:1fr}.iv-bar{flex-wrap:wrap}}
`;

const COPY_JS = `<script>
(function () {
  var btn = document.getElementById('iv-copy'), src = document.getElementById('iv-src');
  if (!btn || !src) return;
  function done(ok) { btn.textContent = ok ? 'Copied' : 'Select and copy it'; setTimeout(function () { btn.textContent = 'Copy the prompt'; }, 2400); }
  btn.addEventListener('click', function () {
    var text = src.value;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { done(true); }, fallback);
    } else fallback();
    function fallback() {
      src.style.position = 'fixed'; src.style.left = '0'; src.select();
      var ok = false; try { ok = document.execCommand('copy'); } catch (e) {}
      src.style.position = ''; src.style.left = ''; done(ok);
    }
  });
})();
</script>`;

// ------------------------------------------------------------------ cut a page from the donor
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
  return head + '<body id="top">\n\n' + hdr + '\n\n' + body + '\n\n' + foot + '\n\n' + COPY_JS + '\n' + tail;
}

function page(p) {
  const name = `interview-${p.slug}`;
  const mail = `mailto:${p.send.email}?subject=${encodeURIComponent(p.send.subject)}`;
  const body = `<main class="phero">
  <div class="wrap">
    <span class="eyebrow"><span class="d"></span> An interview · ${esc(p.audience)}</span>
    <h1>${esc(p.title)}</h1>
    <p class="sub">${esc(p.who)} ${esc(p.why_you)}</p>
    <div class="cta-row"><a class="btn btn-green" href="#prompt">Get the prompt</a><a class="btn btn-ghost" href="#learn">What we want to learn</a></div>
  </div>
</main>

<div class="paper">

  <section class="psection" id="learn">
    <div class="wrap">
      <div class="shead">
        <span class="tag">What we want to learn</span>
        <h2>The questions, <span class="g">before you agree to answer them.</span></h2>
      </div>
      <ul class="iv-learn">${p.learn.map((l) => `<li>${esc(l)}</li>`).join('')}</ul>
    </div>
  </section>

  <section class="psection alt" id="how">
    <div class="wrap">
      <div class="shead">
        <span class="tag">How it works</span>
        <h2>Three steps, <span class="g">about ${p.minutes || 20} minutes.</span></h2>
      </div>
      <div class="iv-steps">
        <div class="iv-step"><span class="n">1</span><h3>Copy the prompt</h3><p>The button below copies all of it, exactly.</p></div>
        <div class="iv-step"><span class="n">2</span><h3>Paste it into a new ${esc(p.assistant || 'ChatGPT')} chat, and switch to voice</h3><p>It will introduce RiskMandate in a paragraph, then ask you one question at a time.</p></div>
        <div class="iv-step"><span class="n">3</span><h3>Talk, then send us the summary</h3><p>Say &ldquo;skip&rdquo; to move on or &ldquo;wrap up&rdquo; to finish early. At the end it writes a summary; copy it and send it back.</p></div>
      </div>
    </div>
  </section>

  <section class="psection" id="prompt">
    <div class="wrap">
      <div class="shead">
        <span class="tag">The prompt</span>
        <h2>Paste it as the first message <span class="g">in a new chat.</span></h2>
      </div>
      <div class="iv-box">
        <div class="iv-bar"><span>The whole prompt</span><button class="iv-copy" id="iv-copy" type="button">Copy the prompt</button></div>
        <pre class="iv-prompt">${esc(p.prompt)}</pre>
      </div>
      <textarea class="iv-src" id="iv-src" readonly tabindex="-1" aria-hidden="true">${esc(p.prompt)}</textarea>
      <p class="iv-note"><b>It also works typed</b>, and in another assistant such as Claude or Gemini: paste the same text. Voice is only faster.</p>
    </div>
  </section>

  <section class="psection alt" id="answers">
    <div class="wrap">
      <div class="shead">
        <span class="tag">What happens to your answers</span>
        <h2>Nothing leaves your hands <span class="g">until you send it.</span></h2>
      </div>
      <ul class="iv-safe">
        <li><b>This page sends nothing anywhere.</b> It is a static page with no tracking. The copy button puts the prompt on your clipboard and does nothing else.</li>
        <li><b>The conversation stays in your own ${esc(p.assistant || 'ChatGPT')} account</b>, under its settings, until you choose to send us the summary.</li>
        <li><b>Please do not share anything confidential</b> about your own company or your clients. We are asking for your judgement, not their details.</li>
        <li><b>You decide</b> whether the summary is shared, and you can edit it before you send it.</li>
      </ul>
    </div>
  </section>

  <section class="psection" id="send">
    <div class="wrap">
      <div class="shead">
        <span class="tag">Send it back</span>
        <h2>One email, <span class="g">with the summary pasted in.</span></h2>
        <p>Copy the summary the assistant writes at the end, and paste it into an email. Thank you: this is the most useful twenty minutes anybody can give RiskMandate right now.</p>
      </div>
      <div class="cta-row"><a class="btn btn-green" href="${esc(mail)}">Email the summary</a><a class="btn btn-ghost" href="index.html">What RiskMandate is</a></div>
    </div>
  </section>

</div>`;
  return cut(name, `RiskMandate — ${p.title}`,
    `${p.who} A prompt you copy into your own assistant, which interviews you by voice for about twenty minutes and writes up a summary you send back. Nothing is sent by this page.`, body);
}

const outputs = Object.fromEntries(pages.map((p) => [`interview-${p.slug}.html`, page(p)]));
const stale = [];
for (const [file, want] of Object.entries(outputs)) {
  const path = join(SITE, file);
  const have = existsSync(path) ? readFileSync(path, 'utf8') : null;
  if (have === want) continue;
  if (CHECK) stale.push(file); else writeFileSync(path, want);
}
if (CHECK) { if (stale.length) fail(`stale: ${stale.join(', ')} — run build-interview-pages.mjs`); console.log(`interview pages: ${pages.length} up to date`); }
else console.log(`interview pages: wrote ${pages.length}`);
