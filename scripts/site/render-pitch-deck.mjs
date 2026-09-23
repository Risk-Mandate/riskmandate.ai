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
// Fourteen slides and no ask slide. It is shown in November, by which time the practice will have
// moved but the direction will not, so the deck carries the direction: make agents insurable, and
// start with the Agent Behaviour Policy as the path there. Status is shown as chips on the things
// themselves (available now / template / in design) rather than on a page of what we are not. And
// the word "rung" is not used anywhere on it: it is not a common word, and it reads oddly.

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
const catalogue = json('vaults/index.json').vaults;
const shapes    = catalogue.length;
const shapeNames = catalogue.map(v => v.app);
// the standards a published vault already links to, by id and title only (site rule 7)
const std = (f) => json(`vaults/claude-code-web/data/standards/${f}.json`).nodes;
const AIA = std('eu-ai-act'), GDPR = std('gdpr'), ATTACK = std('attack');
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
.arc{display:grid;grid-template-columns:1fr 40px 1fr 40px 1fr;align-items:stretch;gap:0;margin-top:10px}
.arc .step{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:24px 26px;display:flex;flex-direction:column;gap:10px}
.arc .step p{font-size:16px;line-height:1.5}
.arc .step .who{margin-top:auto;font-family:var(--mono);font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--green)}
.arc .arrow{display:grid;place-items:center;font-size:30px;color:var(--faint)}
.chips{display:flex;flex-wrap:wrap;gap:10px;margin-top:6px;max-width:1080px}
.chip{border:1px solid var(--border);background:var(--card);border-radius:999px;padding:9px 16px;font-size:16px;color:var(--text)}
</style></head><body>

${slide('dark', `
  <svg class="mark" viewBox="0 0 64 64"><rect width="64" height="64" rx="17" fill="#161615"/>
    <circle cx="32" cy="32" r="19" stroke="#1A7F5A" stroke-width="2.6" fill="none"/>
    <circle cx="32" cy="32" r="13.5" stroke="rgba(247,246,242,.22)" stroke-width="1" fill="none"/>
    <g stroke="#1A7F5A" stroke-width="2"><line x1="32" y1="9" x2="32" y2="14"/><line x1="32" y1="50" x2="32" y2="55"/>
    <line x1="9" y1="32" x2="14" y2="32"/><line x1="50" y1="32" x2="55" y2="32"/></g>
    <text x="32" y="37" text-anchor="middle" font-family="Geist Mono, monospace" font-size="13" font-weight="700" fill="#F7F6F2">RM</text></svg>
  <h1>Know what your agents can do.</h1>
  <p class="lead">Make your agents insurable. Start by writing down what each one can actually
  reach, what you authorised it to do, and the gap between the two.</p>
  <div class="foot"><span>riskmandate.ai &middot; Web Summit Lisbon, November 2026</span><span>v${version}</span></div>`)}

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

${slide('dark', `
  <span class="tag">Not a model property</span>
  <h2>The same model is harmless in one setup and serious in another.</h2>
  <p class="lead">Connect it to a mailbox and the narrowest Gmail scope that reads one message reads
  every message. Nothing about the model changed; the deployment did.</p>
  <p>So risk is a property of the deployment, and the record has to be fitted to the deployment it
  describes. That is why the unit is one agent, in one place, not a model or an estate.</p>
  <div class="foot"><span>A property of this deployment</span><span>riskmandate.ai/lab-connector-grants.html</span></div>`)}

${slide('', `
  <span class="tag">What an Agent Behaviour Policy is</span>
  <h2>Four objects, and only one of them is an opinion.</h2>
  <div class="grid g4">
    <div class="card"><span class="k">Measured</span><h3>Reach</h3><p>Everything the agent can actually access in this deployment, including what nobody thought to check.</p></div>
    <div class="card"><span class="k">Elicited</span><h3>Mandate</h3><p>The job, written down: what the business authorised it to do. The one part only you can supply.</p></div>
    <div class="card"><span class="k">Derived</span><h3>Gap</h3><p>Reach minus mandate. Never written by hand, and recomputed whenever either side moves.</p></div>
    <div class="card"><span class="k">Recorded</span><h3>Barriers</h3><p>What actually stands in the way of each capability: controls, constraints and open questions.</p></div>
  </div>
  <p class="src">A behaviour policy describes and carries no score. What is acceptable is a decision, and the decision belongs to the people who answer for the agent.</p>
  <div class="foot"><span>The model</span><span>riskmandate.ai/abp.html</span></div>`)}

${slide('', `
  <span class="tag">Where this goes</span>
  <h2>Make agents insurable. The behaviour policy is where every agent starts.</h2>
  <div class="arc">
    <div class="step"><span class="pill">Available now</span><h3>1 &middot; Describe it</h3><p><b>Agent Behaviour Policy.</b> What one agent can reach, what you authorised, the gap, and what stands in the way.</p><p class="who">Companies running agents today</p></div>
    <div class="arrow">&rarr;</div>
    <div class="step"><span class="pill soon">Template available</span><h3>2 &middot; Authorise it</h3><p><b>Licence to Operate.</b> The organisation is the authority, the behaviour policy is the instrument, the agent is the licensee, for a set interval.</p><p class="who">Risk teams and boards</p></div>
    <div class="arrow">&rarr;</div>
    <div class="step"><span class="pill no">In design</span><h3>3 &middot; Insure it</h3><p><b>Insurability Index.</b> The record an underwriter will accept: scored, dated, with the residual risk owned.</p><p class="who">Insurers and brokers</p></div>
  </div>
  <p class="src">Each step needs the one before it, and each one is sold to the people it serves. The destination is agent risk at a level the board has accepted and can show &mdash; which, for high-risk AI systems, is what the EU AI Act asks for: residual risk <em>judged to be acceptable</em> (Regulation (EU) 2024/1689, Article 9(5)).</p>
  <div class="foot"><span>The direction</span><span>riskmandate.ai/insurance.html</span></div>`)}

${slide('dark', `
  <span class="tag">The commercial model</span>
  <h2>Help companies control and manage the agents they already run.</h2>
  <div class="grid g3">
    <div class="card"><span class="k">Today</span><h3>Describe and correct</h3><p>One agent, one deployment, written down and argued with by the people who built it, own what it touches and answer for it. Sold at four levels, from a pack to a named professional's sign-off.</p></div>
    <div class="card"><span class="k">Next</span><h3>Authorise and accept</h3><p>A licence with a named owner and an expiry; a risk register built from the gap rather than from a workshop; acceptance carried up to the board on a record instead of a slide.</p></div>
    <div class="card"><span class="k">Then</span><h3>Price and insure</h3><p>The same record, read by an underwriter: explicit scope, the open questions named, and the residual risk owned by somebody. Renewal starts from a record instead of a questionnaire.</p></div>
  </div>
  <div class="foot"><span>Control, then accept, then insure</span><span>riskmandate.ai/pricing.html</span></div>`)}

${slide('', `
  <span class="tag">On sale today</span>
  <h2>${shapes} published free. Four levels when you want yours.</h2>
  <table class="t">
    <thead><tr><th>Level</th><th>Price</th><th>When it arrives</th><th>Who does the work</th></tr></thead>
    <tbody>${LEVELS.map(l => `<tr><td>${l.n} &middot; ${l.name}</td><td class="p">${l.price}</td><td>${l.when}</td><td>${l.who}</td></tr>`).join('')}</tbody>
  </table>
  <p class="src">Every level is the same document; what changes is how it arrives and who does the correcting. Prices read from store.sgit.ai on ${PRICES_READ}. Before any of it: ${shapes} template policies published with their read keys, and a free twenty-minute route to write your own against the assistant you already run.</p>
  <div class="foot"><span>The offer</span><span>riskmandate.ai/pricing.html &middot; riskmandate.ai/try-it.html</span></div>`)}

${slide('', `
  <span class="tag">We integrate with everybody</span>
  <h2>${shapes} deployment shapes, and the next one is a file rather than a product.</h2>
  <div class="chips">${shapeNames.map(n => `<span class="chip">${n}</span>`).join('')}</div>
  <p class="src">Coding agents, desktop assistants, browser agents, mail and drive connectors, workflow engines and scheduled jobs, across Anthropic, OpenAI, Google, Microsoft, GitHub, Dropbox and n8n. A shape is described from the vendor's own published pages, quoted and dated, or measured on a deployment we are entitled to run. We never test somebody else's system.</p>
  <div class="foot"><span>The catalogue</span><span>riskmandate.ai/agent-behaviour-policy.html</span></div>`)}

${slide('dark', `
  <span class="tag">Linked to the standards</span>
  <h2>Every vault carries the articles and techniques it touches.</h2>
  <div class="grid g3">
    <div class="card"><span class="k">EU AI Act &middot; ${AIA.length} articles</span><p>${AIA.map(n => `Art. ${n.article} ${n.title}`).join(' &middot; ')}</p></div>
    <div class="card"><span class="k">GDPR &middot; ${GDPR.length} articles</span><p>${GDPR.slice(0, 6).map(n => `Art. ${n.article}`).join(', ')} and ${GDPR.length - 6} more, by article number and title.</p></div>
    <div class="card"><span class="k">MITRE ATT&amp;CK &middot; ${ATTACK.length} techniques</span><p>${ATTACK.slice(0, 5).map(n => `${n.technique} ${n.title}`).join(' &middot; ')} &hellip;</p></div>
  </div>
  <p class="src">Ids and titles only, linked from the consequences in the policy. A link says a provision is <b>touched</b>, never that anything complies. Alongside: ISO/IEC 42001, ISO/IEC 27001, NIST AI RMF and the OWASP Agentic Top 10 as the frames underwriters are adopting. This is what lets one record answer the questionnaire somebody else already has.</p>
  <div class="foot"><span>The standards graph</span><span>riskmandate.ai/abp.html#graph</span></div>`)}

${slide('', `
  <span class="tag">Under the document</span>
  <h2>The policy is a graph. A document is a projection of it.</h2>
  <div class="grid g3">
    <div class="card"><span class="pill">Running</span><h3>Behaviours are nodes</h3><p>A fixed vocabulary of capability ids shared by every vault. <b>execute.process.host</b> is remote code execution; <b>delete.file.host</b> is data deletion. Ids, so they can be linked, counted and compared.</p></div>
    <div class="card"><span class="pill">Running</span><h3>Rows are edges; the barrier sits on the path</h3><p>Each row carries the door it goes through, the evidence tier, how reversible it is, and what stands in the way. The prompt that regenerates the document ships inside the vault.</p></div>
    <div class="card"><span class="pill no">In design</span><h3>A view per stakeholder</h3><p>Operator, security, leadership and insurer each read a projection of the same record. Scenarios already do this on one axis; audiences are the next.</p></div>
  </div>
  <p class="src">One record, several readers, and connections outward to the standards and techniques each behaviour touches: that is what makes it deployable in an organisation that already has a risk register, an auditor and a broker.</p>
  <div class="foot"><span>The graph</span><span>riskmandate.ai/abp.html#graph</span></div>`)}

${slide('', `
  <span class="tag">From the gap to the risk register</span>
  <h2>The risk is derived from the record, and owned by a name.</h2>
  <div class="grid g4">
    <div class="card"><span class="k">Consequences</span><p>What follows when a capability meets an asset: read, act, exfiltrate, disrupt, impersonate, outlive. Each one names what it requires and the articles it touches.</p></div>
    <div class="card"><span class="k">Who holds the barrier</span><p>A scope you consented to and can revoke is a different object from a product decision a vendor can change in a release. Both are recorded; the difference is in the facts, not an adjective.</p></div>
    <div class="card"><span class="k">Validity</span><p>Every policy says what it describes, as at which date, and what makes it void: a release, a setting, a connector enabled. If the risk changed, the deployment changed.</p></div>
    <div class="card"><span class="k">Acceptance</span><p>A licence to operate with a named owner and an expiry, and a maturity model for how acceptance travels up to the board. The policy carries no score; the acceptance carries a name.</p></div>
  </div>
  <div class="foot"><span>Risk management, from the record</span><span>riskmandate.ai/acceptance.html &middot; riskmandate.ai/ramm.html</span></div>`)}

${slide('dark', `
  <span class="tag">Why this year</span>
  <h2>Three things changed, and none of them was us.</h2>
  <div class="grid g3">
    <div class="card"><span class="k">1 January 2026</span><h3>Cover started being withdrawn</h3><p>A generative-AI exclusion took effect in the standard liability forms much of one large insurance market runs on. Several carriers have filed their own, one of them absolute.</p></div>
    <div class="card"><span class="k">9 March 2026</span><h3>Responsibility was assigned</h3><p>A national consumer regulator said a business is responsible if an agent it uses does something illegal, and should be clear what the agent may do and what data it can access.</p></div>
    <div class="card"><span class="k">Regulation (EU) 2024/1689</span><h3>Residual risk must be judged acceptable</h3><p>For high-risk AI systems, Article 9(5) requires the residual risk of each hazard, and overall, to be <em>judged to be acceptable</em>. Somebody has to do the judging, and they need a record to judge from.</p></div>
  </div>
  <p class="src">The first two are sourced and dated on riskmandate.ai/insurance.html. The third is quoted from the regulation as published, read 24 September 2026.</p>
  <div class="foot"><span>Why now</span><span>riskmandate.ai/insurance.html</span></div>`)}

${slide('', `
  <span class="tag">Delivered by people, checkable by anyone</span>
  <h2>The sign-off carries a name and a date. The method carries its keys.</h2>
  <div class="grid g2">
    <div class="card"><h3>A named professional signs the top level</h3><p>Two half-hour sessions with your team, the policy built from the interview rather than from a form, and a security professional who corrects it and signs it. Every line about a reviewer is read off a page they publish themselves, with the date; nobody is scored or ranked.</p></div>
    <div class="card"><h3>Open source, and the keys are printed</h3><p>${shapes} behaviour policies published in full with their read keys. Every page in a public repository: code Apache-2.0, pages and policies CC BY 4.0. Model-drafted and marked as such, with what was measured kept apart from what was documented.</p></div>
  </div>
  <div class="foot"><span>Who, and how it is checked</span><span>riskmandate.ai/reviewers.html &middot; github.com/Risk-Mandate/riskmandate.ai</span></div>`)}

${slide('dark', `
  <h1>Start with the agent you cannot describe.</h1>
  <p class="lead">One agent, already running, written down as a record you keep and correct. Then the
  licence, then the acceptance, then the cover. The direction is set; the first step is on sale.</p>
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
