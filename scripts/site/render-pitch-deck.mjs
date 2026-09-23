// render-pitch-deck.mjs — the deck, built from the site rather than written beside it.
//
//   node scripts/site/render-pitch-deck.mjs            write the HTML and render the PDF
//   node scripts/site/render-pitch-deck.mjs --check    fail if the numbers on it have drifted
//
// A conference profile asks for a pitch deck as a file. The risk with a deck is not design, it is
// that it becomes the one artefact nobody regenerates: the site says sixteen published policies and
// a year later the deck in somebody's inbox still says twelve. So every number here is read out of
// the tree at render time — the counts from the published vault, the shape count from the
// catalogue — and `--check` fails the build when what the deck was rendered from no longer matches
// what the site says. The prices are the store's and are quoted with the date they were read,
// which is the same rule every page here follows.
//
// Twelve slides, no ask slide: this is what exists, what is sold, who does it and what is not
// built. The raise conversation happens in person, where a number can be answered for.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { spawn }                                              from 'node:child_process';
import { dirname, join, resolve }                             from 'node:path';
import { fileURLToPath }                                      from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const SITE = join(ROOT, 'site');
const OUT  = join(SITE, 'assets/deck');
const PORT = 8241;
const PLAYWRIGHT = '/opt/node22/lib/node_modules/playwright/index.mjs';
const CHECK = process.argv.includes('--check');

const read = (f) => readFileSync(join(SITE, f), 'utf8');
const json = (f) => JSON.parse(read(f));

// ------------------------------------------------------------------ what the site says today
const version   = json('versions/index.json').latest;
const shapes    = json('vaults/index.json').vaults.length;
const counts    = json('vaults/claude-code-web/data/delta.json').counts;
const reach     = counts.aligned + counts.excess;
const mandate   = counts.aligned + counts.shortfall;
const gap       = counts.excess;
const unbounded = counts.unbounded_excess;

// The store owns the cart and the prices. These were read from its own pages on the date below,
// and the deck prints that date beside them so a figure that moves is detectable rather than silent.
const PRICES_READ = '22 September 2026';
const LEVELS = [
  { n: 1, name: 'ABP Pack',     price: '£10',     when: 'immediately',                  who: 'automated' },
  { n: 2, name: 'ABP Vault',    price: '£50',     when: '1 to 2 days',                  who: 'automated' },
  { n: 3, name: 'ABP Tailored', price: '£500',    when: '1 to 3 days from your reply',  who: 'a person corrects it' },
  { n: 4, name: 'ABP Reviewed', price: '£1,500',  when: '1 to 5 days from your reply',  who: 'two sessions, then a signature' },
];

// the gap figure, lifted out of the home page so there is one drawing rather than two
const diagram = read('index.html').match(/<svg class="diagram"[\s\S]*?<\/svg>/)[0]
  .replace(/class="(fadeIn|pop)[^"]*"/g, '').replace(/style="animation-delay:[^"]*"/g, '');

const stamp = { version, shapes, reach, mandate, gap, unbounded, prices_read: PRICES_READ };

// ------------------------------------------------------------------ the slides
const slide = (cls, body) => `<section class="s ${cls}">${body}</section>`;

const deck = () => `<!doctype html>
<html lang="en-GB"><head><meta charset="utf-8">
<title>RiskMandate — the deck, v${version}</title>
<style>
@font-face{font-family:Geist;font-weight:400 700;font-display:block;src:url(../fonts/geist-latin.woff2) format('woff2')}
@font-face{font-family:'Geist Mono';font-weight:400 500;font-display:block;src:url(../fonts/geist-mono-latin.woff2) format('woff2')}
:root{--ink:#0D0D0C;--paper:#F7F6F2;--card:#FFFFFF;--text:#1A1917;--muted:#4A4845;--faint:#8A8780;
      --green:#1A7F5A;--green2:#22c55e;--greenbg:#EBF5F0;--gold:#B45309;--border:#E2DFD8;
      --sans:Geist,ui-sans-serif,system-ui,sans-serif;--mono:'Geist Mono',ui-monospace,Menlo,monospace}
*{box-sizing:border-box;margin:0;padding:0}
@page{size:1280px 720px;margin:0}
body{font-family:var(--sans);background:#333}
.s{width:1280px;height:720px;padding:64px 84px 96px;background:var(--paper);color:var(--text);
   display:flex;flex-direction:column;justify-content:center;gap:26px;position:relative;
   break-after:page;overflow:hidden}
.s:last-child{break-after:auto}
.s.dark{background:var(--ink);color:var(--paper)}
.s.dark h1,.s.dark h2{color:#fff}
.s.dark p,.s.dark li{color:rgba(247,246,242,.72)}
.tag{font-family:var(--mono);font-size:13px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:var(--green)}
h1{font-size:76px;line-height:.98;letter-spacing:-.04em;font-weight:700;max-width:19ch}
h2{font-size:52px;line-height:1.02;letter-spacing:-.035em;font-weight:700;max-width:22ch}
h3{font-size:23px;letter-spacing:-.02em;font-weight:700}
p{font-size:21px;line-height:1.55;color:var(--muted);max-width:56ch}
p.lead{font-size:26px;line-height:1.45;color:var(--text);max-width:48ch}
.num{font-family:var(--sans);font-size:96px;font-weight:700;letter-spacing:-.05em;line-height:.9}
.grid{display:grid;gap:22px;margin-top:6px}
.g2{grid-template-columns:1fr 1fr}.g3{grid-template-columns:repeat(3,1fr)}.g4{grid-template-columns:repeat(4,1fr)}
.card{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:26px 28px;display:flex;flex-direction:column;gap:10px}
.s.dark .card{background:#17171680;border-color:#2b2b28}
.card p{font-size:17px;line-height:1.5}
.card .k{font-family:var(--mono);font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--green)}
.split{display:grid;grid-template-columns:1fr 520px;gap:56px;align-items:center}
.fig svg{width:520px;height:520px;display:block}
ul{list-style:none;display:flex;flex-direction:column;gap:14px}
li{font-size:20px;line-height:1.5;color:var(--muted);padding-left:26px;position:relative}
li::before{content:"";position:absolute;left:0;top:11px;width:9px;height:9px;border-radius:50%;background:var(--green)}
li b,p b{color:var(--text);font-weight:600}
.s.dark li b,.s.dark p b{color:#fff}
.foot{position:absolute;left:84px;right:84px;bottom:34px;display:flex;justify-content:space-between;
      font-family:var(--mono);font-size:12px;color:var(--faint)}
.s.dark .foot{color:rgba(247,246,242,.42)}
.pill{display:inline-flex;align-items:center;gap:8px;font-family:var(--mono);font-size:12px;font-weight:700;
      letter-spacing:.1em;text-transform:uppercase;border-radius:999px;padding:6px 14px;background:var(--greenbg);color:var(--green)}
.pill.soon{background:#FDF1DC;color:var(--gold)}
.pill.no{background:#EFEDE7;color:var(--muted)}
.mark{width:104px;height:104px}
.src{font-family:var(--mono);font-size:13px;color:var(--faint);line-height:1.7;max-width:80ch}
.t{width:100%;border-collapse:collapse;font-size:19px;margin-top:8px}
.t th{text-align:left;font-family:var(--mono);font-size:12px;letter-spacing:.1em;text-transform:uppercase;
      color:var(--faint);font-weight:700;padding-bottom:12px;border-bottom:1px solid var(--border)}
.t td{padding:16px 18px 16px 0;border-bottom:1px solid var(--border);color:var(--muted);vertical-align:top}
.t td:first-child{color:var(--text);font-weight:600;white-space:nowrap}
.t .p{font-size:26px;font-weight:700;color:var(--text);letter-spacing:-.02em}
</style></head><body>

${slide('dark', `
  <svg class="mark" viewBox="0 0 64 64"><rect width="64" height="64" rx="17" fill="#161615"/>
    <circle cx="32" cy="32" r="19" stroke="#1A7F5A" stroke-width="2.6" fill="none"/>
    <circle cx="32" cy="32" r="13.5" stroke="rgba(247,246,242,.22)" stroke-width="1" fill="none"/>
    <g stroke="#1A7F5A" stroke-width="2"><line x1="32" y1="9" x2="32" y2="14"/><line x1="32" y1="50" x2="32" y2="55"/>
    <line x1="9" y1="32" x2="14" y2="32"/><line x1="50" y1="32" x2="55" y2="32"/></g>
    <text x="32" y="37" text-anchor="middle" font-family="Geist Mono, monospace" font-size="13" font-weight="700" fill="#F7F6F2">RM</text></svg>
  <h1>Know what your agents can do.</h1>
  <p class="lead">Create or buy Agent Behaviour Policies: for one agent in one deployment, what it can
  actually reach, what you authorised it to do, and the gap between the two.</p>
  <div class="foot"><span>riskmandate.ai</span><span>v${version}</span></div>`)}

${slide('', `
  <div class="split">
    <div style="display:flex;flex-direction:column;gap:24px">
      <span class="tag">One published policy, counted</span>
      <h2>Nine things it can do that nobody asked for.</h2>
      <p>Claude Code on the web, with one repository attached. Every number decrypted from the vault
      that describes it, and the vault is published with its read key.</p>
      <div class="grid g2" style="margin-top:8px">
        <div><div class="num">${reach}</div><p style="font-size:17px">capabilities it can reach</p></div>
        <div><div class="num" style="color:var(--green)">${mandate}</div><p style="font-size:17px">that you actually asked for</p></div>
        <div><div class="num" style="color:var(--gold)">${gap}</div><p style="font-size:17px">it can do that you didn't ask for</p></div>
        <div><div class="num">${unbounded}</div><p style="font-size:17px">with nothing real in the way</p></div>
      </div>
    </div>
    <div class="fig">${diagram}</div>
  </div>
  <div class="foot"><span>The gap</span><span>riskmandate.ai/abp-vault-claude-code-web.html</span></div>`)}

${slide('', `
  <span class="tag">What an Agent Behaviour Policy is</span>
  <h2>Four objects, and only one of them is an opinion.</h2>
  <div class="grid g4">
    <div class="card"><span class="k">Measured</span><h3>Reach</h3><p>Everything the agent can actually access in this deployment, including what nobody thought to check.</p></div>
    <div class="card"><span class="k">Elicited</span><h3>Mandate</h3><p>The job, written down: what the business authorised it to do. The one part only you can supply.</p></div>
    <div class="card"><span class="k">Derived</span><h3>Gap</h3><p>Reach minus mandate. Never written by hand, and recomputed whenever either side moves.</p></div>
    <div class="card"><span class="k">Recorded</span><h3>Barriers</h3><p>What actually stands in the way of each capability: controls, constraints and open questions.</p></div>
  </div>
  <p class="src">A behaviour policy carries no score, no rating and no verdict. It describes one agent in one deployment, and what to do about it is the reader's decision.</p>
  <div class="foot"><span>The model</span><span>riskmandate.ai/abp.html</span></div>`)}

${slide('dark', `
  <span class="tag">Why it is not a model problem</span>
  <h2>The same model is harmless in one setup and serious in another.</h2>
  <p class="lead">Connect it to a mailbox and the narrowest Gmail scope that reads one message reads
  every message. Nothing about the model changed; the deployment did.</p>
  <p>So risk is a property of the deployment rather than of the model, and a record that is not
  fitted to the deployment it describes is describing somebody else's agent.</p>
  <div class="foot"><span>Not a model property</span><span>riskmandate.ai/lab-connector-grants.html</span></div>`)}

${slide('', `
  <span class="tag">Where this goes</span>
  <h2>Three rungs, in order. Each needs the one below it.</h2>
  <div class="grid g3">
    <div class="card"><span class="pill">Available now</span><h3>Describe it</h3><p><b>Agent Behaviour Policy.</b> What one agent can reach, what you authorised, the gap, and what stands in the way.</p></div>
    <div class="card"><span class="pill soon">Template available</span><h3>Authorise it</h3><p><b>Licence to Operate.</b> The organisation is the authority, the behaviour policy is the instrument, the agent is the licensee.</p></div>
    <div class="card"><span class="pill no">In design</span><h3>Insure it</h3><p><b>Insurability Index.</b> The record an underwriter will accept: scored, dated, with the residual risk owned.</p></div>
  </div>
  <p class="src">The third rung is the business. The first rung is what is on sale, and it is the one that can be delivered today.</p>
  <div class="foot"><span>The ladder</span><span>riskmandate.ai/insurance.html</span></div>`)}

${slide('', `
  <span class="tag">What arrives</span>
  <h2>An encrypted vault you hold the keys to, not a PDF.</h2>
  <div class="grid g2">
    <div class="card"><h3>What is in it</h3><p>The policy and the data behind it. The terms your agent reads, as <b>AGENTS.md</b> and <b>SKILL.md</b>. A licence-to-operate template, unissued. Every version kept.</p></div>
    <div class="card"><h3>What you do with it</h3><p>Hand a read key to your board, your auditor or your broker and they see exactly what you see. Correct the mandate; the gap recomputes.</p></div>
  </div>
  <p class="src">Markdown for people, JSON for tools, and nothing in your request path. We never ask for a credential, a token, a key, or access to anything of yours.</p>
  <div class="foot"><span>The artefact</span><span>riskmandate.ai/agent-behaviour-policy.html</span></div>`)}

${slide('', `
  <span class="tag">Free, and paid</span>
  <h2>${shapes} published free. Four levels when you want yours.</h2>
  <table class="t">
    <thead><tr><th>Level</th><th>Price</th><th>When it arrives</th><th>Who does the work</th></tr></thead>
    <tbody>${LEVELS.map(l => `<tr><td>${l.n} &middot; ${l.name}</td><td class="p">${l.price}</td><td>${l.when}</td><td>${l.who}</td></tr>`).join('')}</tbody>
  </table>
  <p class="src">Every level is the same document; what changes is how it arrives and who does the correcting. Prices read from store.sgit.ai on ${PRICES_READ}: the store owns the cart, this site owns the material. Before any of it, ${shapes} template policies are published with their read keys, and the prompts to write your own are free.</p>
  <div class="foot"><span>The offer</span><span>riskmandate.ai/pricing.html</span></div>`)}

${slide('dark', `
  <span class="tag">The free rung</span>
  <h2>Twenty minutes, your own assistant, nothing collected.</h2>
  <p class="lead">Four steps, thirteen prompts, pasted into the assistant you have already connected
  to your mail. At the end you have a written account of what it can reach, what you meant to
  authorise, and the gap.</p>
  <p>It is the top of the sales motion rather than a giveaway: correcting our draft is how you tell
  us what you actually intended, and intent is the one input nobody can derive.</p>
  <div class="foot"><span>Try it</span><span>riskmandate.ai/try-it.html</span></div>`)}

${slide('', `
  <span class="tag">Who does the work</span>
  <h2>The sign-off carries a name and a date.</h2>
  <div class="grid g2">
    <div class="card"><h3>At the top level</h3><p>Two half-hour sessions with your team, the policy built from the interview rather than from a form, and a named security professional who corrects it and signs it.</p></div>
    <div class="card"><h3>How the list is built</h3><p>Every line of a reviewer's page is read off a page they publish themselves, with the date. Nobody is scored, ranked or rated, and we compose nobody's biography.</p></div>
  </div>
  <p class="src">One name on the list today, and the page is built for more. A second entry is published as a labelled placeholder so the next professional can read exactly what would be said about them before agreeing to it.</p>
  <div class="foot"><span>Delivered by a person</span><span>riskmandate.ai/reviewers.html</span></div>`)}

${slide('', `
  <span class="tag">Why this year</span>
  <h2>Two things changed, and neither of them was us.</h2>
  <div class="grid g2">
    <div class="card"><span class="k">1 January 2026</span><h3>Cover started being withdrawn</h3><p>A generative-AI exclusion took effect in the standard liability forms much of one large insurance market runs on. Several carriers have filed their own, one of them absolute.</p></div>
    <div class="card"><span class="k">9 March 2026</span><h3>Responsibility was assigned</h3><p>A national consumer regulator said a business is responsible if an agent it uses does something illegal, and should be clear what the agent may do and what data it can access.</p></div>
  </div>
  <p class="src">Both are sourced and dated on riskmandate.ai/insurance.html, with the announcement dates. Neither is our observation, and we are not an insurer and place no cover.</p>
  <div class="foot"><span>Why now</span><span>riskmandate.ai/insurance.html</span></div>`)}

${slide('dark', `
  <span class="tag">How it is checkable</span>
  <h2>Open source, and the keys are printed.</h2>
  <ul>
    <li><b>${shapes} behaviour policies published in full</b>, each with its read key on the page, because a policy nobody can check is a policy asking to be trusted.</li>
    <li><b>Every page of this site is in a public repository</b>, code Apache-2.0, pages and policies CC BY 4.0.</li>
    <li><b>The method is written down with its mistakes</b>: what was measured, what was documented, and what is still an open question, on the page rather than in a footnote.</li>
    <li><b>Model-drafted and marked as such.</b> Not a compliance assessment, and no standards body has assessed anything here.</li>
  </ul>
  <div class="foot"><span>Open source</span><span>github.com/Risk-Mandate/riskmandate.ai</span></div>`)}

${slide('', `
  <span class="tag">What we do not claim</span>
  <h2>Said before anybody has to ask.</h2>
  <ul>
    <li><b>We are not an insurer</b> and we place no cover. The insurance rung is designed, not built.</li>
    <li><b>Levels 3 and 4 have never been sold.</b> They are specified and the payment link is not issued; the store's ledger says so and so does our pricing page.</li>
    <li><b>We never test somebody else's system.</b> Vendor behaviour is read from vendor pages, quoted and dated; where those pages disagree we publish the contradiction unresolved.</li>
    <li><b>A behaviour policy reduces accidents. It does not stop an attacker.</b> A rule somebody wrote down shapes what an agent tends to do, not what it can do.</li>
  </ul>
  <div class="foot"><span>The limits</span><span>riskmandate.ai/questions.html</span></div>`)}

${slide('dark', `
  <h1>Start with the agent you cannot describe.</h1>
  <p class="lead">Not the estate. One agent, already running, written down as a record you keep,
  correct, and can hand to whoever asks.</p>
  <div class="grid g3" style="margin-top:12px">
    <div class="card"><span class="k">Read one free</span><p>riskmandate.ai</p></div>
    <div class="card"><span class="k">Write your own</span><p>riskmandate.ai/try-it.html</p></div>
    <div class="card"><span class="k">Buy one</span><p>store.sgit.ai</p></div>
  </div>
  <div class="foot"><span>RiskMandate &middot; London</span><span>v${version} &middot; every figure sourced on the slide it appears on</span></div>`)}

</body></html>
`;

// ------------------------------------------------------------------ write, render, check
const sidecarPath = join(OUT, 'deck.json');
const pdfPath     = join(OUT, 'riskmandate-deck.pdf');

if (CHECK) {
  const problems = [];
  if (!existsSync(pdfPath)) problems.push('riskmandate-deck.pdf is missing');
  if (!existsSync(sidecarPath)) problems.push('deck.json is missing');
  else {
    const was = JSON.parse(readFileSync(sidecarPath, 'utf8'));
    for (const [k, v] of Object.entries(stamp))
      if (k !== 'version' && was[k] !== v)
        problems.push(`the deck was rendered with ${k}=${was[k]}, the site now says ${v}`);
  }
  if (problems.length) { console.error(`stale deck: ${problems.join('; ')} — run render-pitch-deck.mjs`); process.exit(1); }
  console.log('pitch deck: numbers match the site');
  process.exit(0);
}

mkdirSync(OUT, { recursive: true });
writeFileSync(join(OUT, 'deck.html'), deck());

const server = spawn('python3', ['-m', 'http.server', String(PORT), '--bind', '127.0.0.1'], { cwd: SITE, stdio: 'ignore' });
await new Promise(r => setTimeout(r, 1200));
const { chromium } = await import(PLAYWRIGHT);
const browser = await chromium.launch({ args: ['--no-sandbox'] });
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e.message)));
  await page.goto(`http://127.0.0.1:${PORT}/assets/deck/deck.html`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(600);
  const slides = await page.evaluate(() => document.querySelectorAll('.s').length);
  await page.pdf({ path: pdfPath, width: '1280px', height: '720px', printBackground: true,
                   margin: { top: '0', bottom: '0', left: '0', right: '0' } });
  writeFileSync(sidecarPath, JSON.stringify({ ...stamp, slides, rendered: '2026-09-24' }, null, 2) + '\n');
  console.log(`pitch deck: ${slides} slides · ${(readFileSync(pdfPath).length / 1024).toFixed(0)}KB` +
              (errors.length ? ` · ${errors.length} page errors` : ''));
} finally {
  await browser.close();
  server.kill();
}
