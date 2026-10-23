// build.mjs — build site/newsroom.html, the newsroom's thinking on the ABP, from scripts/site/newsroom/items.mjs.
//   node scripts/site/newsroom/build.mjs      then node scripts/site/generate.mjs for the twin
// The page is assembled from the pricing page's chrome by scripts/review/flat-page.py, as a public page.
import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { GROUPS, NEWS } from './items.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const day = (iso) => new Date(iso + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
const CUST = 'https://customers.riskmandate.ai/', LI = 'https://www.linkedin.com/company/riskmandate/';
const btn = (href, label, cls, ext) => `<a class="btn ${cls}" href="${href}"${ext ? ' target="_blank" rel="noopener"' : ''}>${label}</a>`;
const n = GROUPS.reduce((k, g) => k + g.items.length, 0);

const body = `<main class="phero">
  <div class="wrap">
    <span class="eyebrow"><span class="d"></span> Reading · from the newsroom</span>
    <h1>The thinking behind the ABP, <span class="it">as it was written down.</span></h1>
    <p class="sub">Dinis Cruz writes RiskMandate's thinking on <a href="https://newsroom.sgit.ai/">newsroom.sgit.ai</a>, from voice memos, written up and checked by the newsroom's agent. These are the ${n} articles that say most simply what an Agent Behaviour Policy is, where its line sits and where it is going, each retold here in a paragraph, with a line quoted and a link to the whole piece.</p>
    <div class="cta-row">${btn(CUST, 'Rather try it? Five minutes →', 'btn-green')}${btn(LI, 'Follow RiskMandate on LinkedIn ↗', 'btn-ghost', true)}</div>
  </div>
</main>

<div class="paper">
<section class="psection nw-news" id="linkedin">
  <div class="wrap">
    <div class="nw-flash">
      <img src="assets/brand/riskmandate-mark.svg" alt="" width="64" height="64">
      <div><span class="tag">News · 21 October 2026</span>
        <h2>RiskMandate is on LinkedIn.</h2>
        <p>The company page went up on 21 October 2026: <a href="${LI}" target="_blank" rel="noopener">linkedin.com/company/riskmandate</a>. It will carry what we learn from the first customers and the articles behind it, starting with the pieces on this page, retold for LinkedIn. Every one of them ends in the same place: <a href="${CUST}">five minutes on the customers site</a>, putting a behaviour policy on your own assistant.</p>
        <div class="cta-row">${btn(LI, 'Follow the page ↗', 'btn-green', true)}${btn(CUST, 'Try it in five minutes', 'btn-ghost')}</div>
      </div>
    </div>
  </div>
</section>
${GROUPS.map((g, gi) => `
<section class="psection${gi % 2 ? '' : ' alt'}" id="${g.id}">
  <div class="wrap">
    <div class="shead"><span class="tag">0${gi + 1} · ${esc(g.tag)}</span><h2>${esc(g.title)}</h2></div>
    <div class="nw-grid">${g.items.map((it) => `
      <article class="nw-card">
        <p class="nw-date">${day(it.date)}</p>
        <h3><a href="${NEWS(it.slug)}" target="_blank" rel="noopener">${esc(it.title)}</a></h3>
        <p>${esc(it.text)}</p>
        ${it.quote ? `<blockquote>“${esc(it.quote)}”</blockquote>` : ''}
        <p class="nw-go"><a href="${NEWS(it.slug)}" target="_blank" rel="noopener">Read it on the newsroom ↗</a>${it.link ? ` · <a href="${it.link[1]}">${esc(it.link[0])}</a>` : ''}</p>
      </article>`).join('')}
    </div>
  </div>
</section>`).join('')}
<section class="psection" id="credit">
  <div class="wrap">
    <div class="shead"><span class="tag">Where these come from</span><h2>Retold here, written there.</h2>
    <p>Every article above is by Dinis Cruz, on <a href="https://newsroom.sgit.ai/">the SGit Newsroom</a>, written up from his voice memos and checked by the newsroom's agent, under CC BY 4.0. The paragraphs on this page are ours, written on 21 October 2026; the quotes are short and are the articles' own words; the dates are the articles'. Where an article and this site differ, the article was often first: two of them pointed out wording on this site's home page that put RiskMandate in the request path, and the home page was rewritten.</p></div>
  </div>
</section>

<section class="pcta">
  <div class="wrap"><span class="tag">Five minutes</span><h2>Put a behaviour policy on your agent.</h2>
  <p>Ask your assistant to do something. Paste one line that says it must not. Ask again. In Claude or ChatGPT, in your browser, nothing to install.</p>
  <div class="cta-row">${btn(CUST, 'Start with hello world →', 'btn-green')}${btn('articles.html', 'The articles on this site', 'btn-ghost')}</div></div>
</section>
</div>
`;
const css = `
.phero .sub a{color:#7FD1A8}.paper p a:not(.btn){color:var(--green)}
.nw-flash .btn-ghost{color:var(--text);border-color:var(--border)}.nw-flash .btn-ghost:hover{border-color:var(--green)}
.nw-flash{display:grid;grid-template-columns:64px minmax(0,1fr);gap:22px;align-items:start;background:#fff;border:1px solid var(--border);border-left:4px solid var(--green);border-radius:16px;padding:26px 28px}
.nw-flash h2{margin:4px 0 10px}.nw-flash p{color:var(--muted);line-height:1.65;max-width:46em}
.nw-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px;margin-top:8px}
.nw-card{background:#fff;border:1px solid var(--border);border-radius:14px;padding:20px 22px;display:flex;flex-direction:column;gap:10px}
.nw-card h3{margin:0;font-size:19px;line-height:1.3;letter-spacing:-.01em}.nw-card h3 a{color:var(--text);text-decoration:none}.nw-card h3 a:hover{color:var(--green)}
.nw-card p{font-size:14.5px;line-height:1.6;color:var(--muted)}
.nw-date{font:600 11px/1 var(--mono);letter-spacing:.08em;text-transform:uppercase;color:var(--faint)!important}
.nw-card blockquote{margin:0;padding:6px 0 6px 14px;border-left:3px solid var(--green);font-size:14.5px;line-height:1.5;color:var(--text);font-style:italic}
.nw-go{margin-top:auto!important;font-size:13.5px!important}
@media (max-width:640px){.nw-flash{grid-template-columns:minmax(0,1fr);padding:20px}.nw-flash img{width:48px;height:48px}}
`;
mkdirSync(join(ROOT, 'scripts/site/newsroom/out'), { recursive: true });
writeFileSync(join(ROOT, 'scripts/site/newsroom/out/body.html'), body);
writeFileSync(join(ROOT, 'scripts/site/newsroom/out/page.json'), JSON.stringify({ name: 'newsroom', public: true, title: 'RiskMandate — from the newsroom: the thinking behind the ABP',
  desc: `The ${n} articles on the SGit Newsroom that say most simply what an Agent Behaviour Policy is, where its line sits and where it is going, retold in a paragraph each, with a line quoted and a link. And the news that RiskMandate is on LinkedIn.`,
  body: 'scripts/site/newsroom/out/body.html', css }, null, 1));
execFileSync('python3', [join(ROOT, 'scripts/review/flat-page.py'), join(ROOT, 'scripts/site/newsroom/out/page.json')], { cwd: ROOT, stdio: 'inherit' });
