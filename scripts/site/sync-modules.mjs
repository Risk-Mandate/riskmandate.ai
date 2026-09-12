// sync-modules.mjs — push a change to a shared JS module into every page that
// carries it.
//
//   node scripts/site/sync-modules.mjs [--check]
//
// Each page inlines its own copy of the modules it uses, which is the price of
// having no build step: a page is one file and it works from `file://`. The cost
// is that fixing `dom.js` means fixing it in 30 places. This does that, from one
// source per module in scripts/site/modules/, and `--check` fails if any page
// has drifted — so CI notices a hand-edit that was only applied to one page.
//
// Only modules with a file in scripts/site/modules/ are synced. Everything else
// in a page — its own CSS, its own markup, its page-specific components — is
// hand-authored and never touched.

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve }                               from 'node:path';
import { fileURLToPath }                                        from 'node:url';

const ROOT    = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const SITE    = join(ROOT, 'site');
const MODULES = join(ROOT, 'scripts/site/modules');

// module name as it appears in the page → file in scripts/site/modules/
const OWNED = {
  'components/dom.js' : 'dom.js',
  'components/nav.js' : 'nav.js',
  'components/menu.js': 'menu.js',
  'components/io.js'  : 'io.js',
  'core/markdown.js'  : 'markdown.js'
};

const HEAD = /^(?='use strict';\n\/\/ [\w/.\-]+ )/m;
const nameOf = (block) => block.match(/^'use strict';\n\/\/ ([\w/.\-]+) /)?.[1];

function sync(html) {
  const parts = html.split(HEAD);
  let changed = 0;
  const out = [parts[0]];
  for (const block of parts.slice(1)) {
    const name = nameOf(block);
    const file = OWNED[name] && join(MODULES, OWNED[name]);
    if (!file || !existsSync(file)) { out.push(block); continue; }
    const want = readFileSync(file, 'utf8').trimEnd() + '\n\n\n';
    if (block === want) { out.push(block); continue; }
    out.push(want);
    changed++;
  }
  return { html: out.join(''), changed };
}

function main() {
  const check = process.argv.includes('--check');
  const stale = [];
  let touched = 0, replacements = 0;

  for (const f of readdirSync(SITE).filter(f => f.endsWith('.html'))) {
    const path = join(SITE, f);
    const was  = readFileSync(path, 'utf8');
    const { html, changed } = sync(was);
    if (!changed) continue;
    if (check) { stale.push(`${f} (${changed} module${changed > 1 ? 's' : ''})`); continue; }
    writeFileSync(path, html);
    touched++; replacements += changed;
    console.log(`  ${f} — ${changed} module${changed > 1 ? 's' : ''}`);
  }

  if (check && stale.length) {
    console.error(`shared modules have drifted — run: node scripts/site/sync-modules.mjs\n  ${stale.join('\n  ')}`);
    process.exit(1);
  }
  console.log(check ? '  every page carries the current shared modules'
                    : `  ${replacements} replacements across ${touched} pages`);
}

main();
