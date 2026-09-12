// new-page.mjs — scaffold a new page into site/.
//
//   node scripts/site/new-page.mjs <name> --title "…" --desc "…" \
//        [--css page.css] [--body page.html] [--donor partners.html]
//
// Run once per new page. The output is a normal hand-edited page from then on —
// this is a scaffolder, not a build step, and nothing in CI runs it.
//
// What it exists to guarantee: the chrome is identical to every other page. The
// header markup, the mobile drawer, the footer, the design tokens and the four
// shared JS modules (dom, nav, menu, boot) are lifted from a page already in
// site/, so a new page cannot drift from the site it joins. Page-specific CSS
// and markup are yours.
//
// After scaffolding: add the page to site/pages.json, then run
// `node scripts/site/generate.mjs` to inject the menu and write the twin.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve }                  from 'node:path';
import { fileURLToPath }                           from 'node:url';

const ROOT   = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const SITE   = join(ROOT, 'site');
const ORIGIN = 'https://riskmandate.ai';
const SHARED = ['components/dom.js', 'components/nav.js', 'components/menu.js', 'boot.js'];

const arg = (flag, fallback) => {
  const i = process.argv.indexOf(flag);
  return i > 0 ? process.argv[i + 1] : fallback;
};

// Everything a page needs before it says anything of its own: tokens, the
// header, the drawer, the footer, buttons, and the dark-hero / paper-section kit
// the content pages are built from.
const CHROME_CSS = `:root{
  --bg:#F7F6F2; --bg2:#EFEDE7; --card:#FFFFFF; --ink:#0D0D0C; --canvas:#0A0A09;
  --text:#1A1917; --muted:#4A4845; --faint:#8A8780; --border:#E2DFD8;
  --green:#1A7F5A; --green-2:#22c55e; --greenBg:#EBF5F0;
  --gold:#B45309; --red:#C0392B; --blue:#1D4ED8;
  --fg:#F7F6F2; --fg-2:rgba(247,246,242,.55); --fg-3:rgba(247,246,242,.32);
  --line:rgba(247,246,242,.10); --line-2:rgba(247,246,242,.18);
  --sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
  --mono:ui-monospace,"SF Mono","JetBrains Mono","Roboto Mono",Menlo,Consolas,monospace;
  --wrap:1000px; --r:10px; --r-sm:8px;
}
*{box-sizing:border-box}
html{scroll-behavior:smooth} @media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}
body{margin:0;background:var(--bg);color:var(--text);font-family:var(--sans);font-size:16px;line-height:1.65;-webkit-font-smoothing:antialiased}
.wrap{max-width:var(--wrap);margin:0 auto;padding:0 24px}
h1,h2{margin:0;font-weight:800;letter-spacing:-.03em;line-height:1.04}
h2{font-size:clamp(26px,3.6vw,40px);font-weight:700;letter-spacing:-.02em}
p{margin:0}
:focus-visible{outline:2px solid var(--green-2);outline-offset:3px;border-radius:4px}
.tag{display:inline-block;font-family:var(--mono);font-size:10px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:var(--green);margin-bottom:14px}
.g{color:var(--green)} .it{font-style:italic;color:var(--green)}

/* header */
.top{position:sticky;top:0;z-index:60;background:rgba(255,255,255,.92);backdrop-filter:blur(14px);border-bottom:1px solid var(--border)}
.top .wrap{display:flex;align-items:center;gap:22px;height:56px;max-width:1100px}
.brand{display:flex;align-items:center;gap:9px;font-weight:700;font-size:15px;color:var(--text);white-space:nowrap;text-decoration:none}
.rm{width:26px;height:26px;flex:none;display:block}
.rm svg{width:100%;height:100%;display:block}
.navlinks{display:flex;align-items:center;gap:22px;margin-left:auto}
rm-menu{display:contents}
.navlinks a{background:none;border:0;cursor:pointer;color:var(--muted);font-size:13.5px;padding:6px 0;font-family:var(--sans);transition:color .15s;white-space:nowrap;text-decoration:none;display:inline-flex;align-items:center}
.navlinks a:hover{color:var(--text)}
.navlinks a.active{color:var(--text);font-weight:600}
.version{font-family:var(--mono);font-size:12px;color:var(--muted);background:var(--card);border:1px solid var(--border);border-radius:7px;padding:5px 8px;text-decoration:none;white-space:nowrap;transition:color .15s,border-color .15s}
.version:hover{color:var(--text);border-color:var(--faint)}
.demo{background:var(--green);color:#fff;font-weight:600;font-size:13px;border:0;border-radius:8px;padding:8px 16px;cursor:pointer;transition:background .15s;font-family:var(--sans);white-space:nowrap}
.demo:hover{background:#16704f}

/* nav dropdowns */
.navgroup{position:relative;display:inline-flex;align-items:center}
.navgroup::after{content:"";position:absolute;top:100%;left:0;right:0;height:10px}
.navgroup-btn{background:none;border:0;cursor:pointer;color:var(--muted);font-size:13.5px;padding:6px 0;font-family:var(--sans);transition:color .15s;white-space:nowrap;display:inline-flex;align-items:center;gap:5px}
.navgroup-btn:hover,.navgroup:hover .navgroup-btn,.navgroup.open .navgroup-btn,.navgroup.active .navgroup-btn{color:var(--text)}
.navgroup-car{font-size:8px;line-height:1;opacity:.6;transition:transform .15s}
.navgroup:hover .navgroup-car,.navgroup.open .navgroup-car{transform:rotate(180deg)}
.navmenu{position:absolute;top:calc(100% + 8px);left:50%;transform:translateX(-50%);min-width:184px;background:var(--card);border:1px solid var(--border);border-radius:10px;box-shadow:0 10px 34px rgba(13,13,12,.14);padding:6px;display:none;flex-direction:column;gap:2px;z-index:70}
.navgroup:hover .navmenu,.navgroup.open .navmenu{display:flex}
.navmenu .navchild{justify-content:flex-start;text-align:left;width:100%;padding:8px 12px;border-radius:7px;font-size:13.5px;color:var(--muted);white-space:nowrap}
.navmenu .navchild:hover{background:var(--bg2);color:var(--text)}
.navmenu .navchild.active{color:var(--green);font-weight:600;background:var(--greenBg)}

/* mobile drawer — the toggle is injected by nav.js; .top.nav-open opens it */
.navtoggle{display:none;margin-left:auto;flex-direction:column;justify-content:center;gap:5px;width:40px;height:40px;padding:0;background:none;border:0;cursor:pointer}
.navtoggle span{display:block;width:20px;height:2px;margin:0 auto;background:var(--text);border-radius:2px;transition:transform .2s,opacity .2s}
.top.nav-open .navtoggle span:nth-child(1){transform:translateY(7px) rotate(45deg)}
.top.nav-open .navtoggle span:nth-child(2){opacity:0}
.top.nav-open .navtoggle span:nth-child(3){transform:translateY(-7px) rotate(-45deg)}
@media (max-width:980px){
  .navtoggle{display:flex}
  .top .wrap{position:relative}
  .version{display:none}
  .navlinks{display:none;position:absolute;left:0;right:0;top:calc(100% + 1px);flex-direction:column;align-items:stretch;gap:0;margin:0;padding:8px;background:var(--card);border-bottom:1px solid var(--border);box-shadow:0 14px 34px rgba(13,13,12,.14);max-height:calc(100vh - 56px);overflow:auto}
  .top.nav-open .navlinks{display:flex}
  .navlinks a,.navlinks .navgroup-btn{width:100%;text-align:left;justify-content:flex-start;padding:12px 16px;font-size:15px;border-radius:8px}
  .navlinks a:hover{background:var(--bg2)}
  .navgroup{display:block;width:100%;position:static}
  .navgroup::after{display:none}
  .navgroup-btn{display:flex}
  .navgroup-car{margin-left:auto}
  .navmenu{position:static;transform:none;display:flex;flex-direction:column;min-width:0;padding:2px 0 8px 14px;background:transparent;border:0;box-shadow:none}
  .navmenu .navchild{padding:10px 14px;font-size:14px}
}

/* buttons */
.btn{display:inline-flex;align-items:center;gap:8px;font-size:14px;font-weight:600;padding:12px 22px;border-radius:var(--r-sm);cursor:pointer;border:1px solid transparent;font-family:var(--sans);text-decoration:none}
.btn-green{background:var(--green);color:#fff} .btn-green:hover{background:#16704f}
.btn-ghost{background:transparent;color:var(--fg);border-color:var(--line-2)} .btn-ghost:hover{border-color:var(--fg-2)}
.btn-ghost-dark{background:transparent;color:var(--text);border-color:var(--border)} .btn-ghost-dark:hover{border-color:var(--green);color:var(--green)}

/* dark hero */
.phero{background:var(--ink);color:var(--fg);padding:88px 24px 84px}
.phero .wrap{max-width:var(--wrap)}
.eyebrow{display:inline-flex;align-items:center;gap:8px;font-family:var(--mono);font-size:11px;font-weight:700;color:var(--green);background:rgba(26,127,90,.18);border:1px solid rgba(26,127,90,.4);border-radius:999px;padding:5px 12px}
.eyebrow .d{width:6px;height:6px;border-radius:50%;background:var(--green-2)}
.phero h1{font-size:clamp(34px,5.2vw,60px);letter-spacing:-.04em;line-height:1.02;margin:26px 0 0;color:var(--fg);max-width:900px}
.phero .sub{color:var(--fg-2);font-size:17px;line-height:1.7;max-width:640px;margin-top:24px}
.cta-row{display:flex;flex-wrap:wrap;gap:11px;margin-top:30px}

/* paper sections */
.paper{background:var(--bg)}
.psection{padding:80px 0;border-bottom:1px solid var(--border)}
.psection.alt{background:var(--bg2)}
.shead{max-width:680px} .shead.center{max-width:720px;margin:0 auto;text-align:center}
.shead h2{color:var(--text)} .shead p{color:var(--muted);margin-top:16px;font-size:15px;line-height:1.75}

/* closing panel + footer */
.pcta{background:var(--ink);padding:80px 24px;text-align:center}
.pcta .wrap{max-width:720px;padding:0}
.pcta h2{font-size:clamp(28px,4.4vw,48px);color:var(--fg);margin-top:20px;font-weight:700;letter-spacing:-.03em}
.pcta p{color:var(--fg-2);margin-top:16px;font-size:16px;line-height:1.7}
.pcta .cta-row{justify-content:center}
.foot{background:var(--canvas);border-top:1px solid var(--line);padding:32px 24px}
.foot .wrap{display:flex;justify-content:space-between;flex-wrap:wrap;gap:10px;font-family:var(--mono);font-size:10px;color:var(--fg-3);max-width:1100px}
.footlink{background:none;border:0;padding:0;font:inherit;color:inherit;cursor:pointer;text-decoration:underline;text-underline-offset:2px}
.footlink:hover{color:var(--fg-2)}`;

const MARK = '<svg viewBox="0 0 64 64"><rect width="64" height="64" rx="17" fill="#161615"/><circle cx="32" cy="32" r="19" stroke="#1A7F5A" stroke-width="2.6" fill="none"/><circle cx="32" cy="32" r="13.5" stroke="rgba(247,246,242,.22)" stroke-width="1" fill="none"/><g stroke="#1A7F5A" stroke-width="2"><line x1="32" y1="9" x2="32" y2="14"/><line x1="32" y1="50" x2="32" y2="55"/><line x1="9" y1="32" x2="14" y2="32"/><line x1="50" y1="32" x2="55" y2="32"/></g><text x="32" y="37" text-anchor="middle" font-family="ui-monospace,SF Mono,Menlo,monospace" font-size="13" font-weight="700" fill="#F7F6F2" letter-spacing="-0.5">RM</text></svg>';

const header = (cta) => `<header class="top">
  <div class="wrap">
    <a class="brand" href="index.html"><span class="rm" aria-hidden="true">${MARK}</span> RiskMandate</a>
    <nav class="navlinks"><rm-menu></rm-menu></nav>
    <a class="version" href="versions.html" title="What shipped in vVERSION">vVERSION</a>
    <button class="demo" data-demo>${cta}</button>
  </div>
</header>`;

const FOOTER = `<footer class="foot">
  <div class="wrap">
    <span>© 2026 RiskMandate · Autonomous Risk Management</span>
    <span>The insurability layer for agentic AI. · <a class="footlink" href="versions.html">Versions</a></span>
  </div>
</footer>`;

// The four modules every page shares, taken verbatim from a page already in
// site/ so a new page cannot carry an older copy of them.
function sharedModules(donor) {
  const src   = readFileSync(join(SITE, donor), 'utf8');
  const parts = src.split(/^(?='use strict';\n\/\/ [\w/.\-]+ )/m);
  const byName = new Map();
  for (const block of parts.slice(1)) {
    byName.set(block.match(/^'use strict';\n\/\/ ([\w/.\-]+) /)[1], block.trimEnd() + '\n\n\n');
  }
  const missing = SHARED.filter(n => !byName.has(n));
  if (missing.length) throw new Error(`${donor} is missing ${missing.join(', ')}`);
  return SHARED.map(n => byName.get(n)).join('');
}

function main() {
  const name = process.argv[2];
  if (!name || name.startsWith('--')) {
    console.error('usage: new-page.mjs <name> --title "…" --desc "…" [--css f] [--body f] [--donor partners.html]');
    process.exit(1);
  }
  const file = `${name}.html`;
  if (existsSync(join(SITE, file))) { console.error(`site/${file} already exists — edit it instead`); process.exit(1); }

  const version = JSON.parse(readFileSync(join(SITE, 'versions/index.json'), 'utf8')).latest;
  const title   = arg('--title', `RiskMandate — ${name}`);
  const desc    = arg('--desc', '');
  const cta     = arg('--cta', 'Book a demo');
  const css     = arg('--css')  ? readFileSync(resolve(arg('--css')),  'utf8') : `\n/* ${name}.css */\n`;
  const body    = arg('--body') ? readFileSync(resolve(arg('--body')), 'utf8')
                                : `<main class="phero"><div class="wrap"><h1>${name}</h1></div></main>`;

  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${ORIGIN}/${file}">
<link rel="alternate" type="text/markdown" href="${name}.md" title="This page as markdown">
<link rel="icon" href="assets/brand/riskmandate-favicon-32.png" sizes="32x32">
<link rel="icon" href="assets/brand/riskmandate-mark.svg" type="image/svg+xml">
<meta property="og:type" content="website">
<meta property="og:site_name" content="RiskMandate">
<meta property="og:url" content="${ORIGIN}/${file}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${ORIGIN}/assets/brand/riskmandate-lockup-light.png">
<meta name="twitter:card" content="summary_large_image">
<!-- Scaffolded by scripts/site/new-page.mjs. Hand-edited from here on — there is no build step. -->
<style>
/* ${name}.css — self-contained: the shared chrome, then this page's own. */
${CHROME_CSS}
${css.trim()}
</style>
</head>
<body id="top">

${header(cta).replaceAll('VERSION', version)}

${body.trim()}

${FOOTER}

<script>
(function(){
'use strict';
var RM={core:{},services:{},components:{},data:{}};
RM.data.pages=[];RM.data.sections=[];

${sharedModules(arg('--donor', 'partners.html'))}})();
</script>
</body>
</html>
`;
  writeFileSync(join(SITE, file), page);
  console.log(`wrote site/${file} — ${(page.length / 1024).toFixed(1)}KB`);
  console.log(`next: add it to site/pages.json, then node scripts/site/generate.mjs`);
}

main();
