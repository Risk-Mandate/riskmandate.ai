// release.mjs — cut a version of the site.
//
//   node scripts/site/release.mjs 1.0.1 "What changed, in a line"
//
// A release here is not a build artefact, it is a record: a version number, a
// note saying what changed, and the commit it was built from. This writes all
// three and leaves the note for you to fill in.
//
//   1. site/versions/<version>.md      a stub with the title and a TODO
//   2. site/versions/index.json        the new entry, newest first
//   3. site/*.html                     the version shown in every page's chrome
//   4. riskmandate_ai/version          the tag CI reads
//   5. pyproject.toml                  the package version, kept equal to it
//
// Then: write the note, commit, push. CI checks the three agree, tags that
// commit `v<version>`, and deploys. The release's `source` is that tag, which is
// how it names the commit it was built from without anything having to write
// back into the repository after the fact.

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve }                   from 'node:path';
import { fileURLToPath }                            from 'node:url';

const ROOT  = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const SITE  = join(ROOT, 'site');
const INDEX = join(SITE, 'versions/index.json');

const read  = (p) => readFileSync(p, 'utf8');
const index = () => JSON.parse(read(INDEX));

const SEMVER = /^\d+\.\d+\.\d+$/;

// The version shown in every page's chrome. One string, one place per page.
// Includes the pilot under site/scenarios/, which carries its own header.
function setVersionInPages(from, to) {
  let n = 0;
  const html = readdirSync(SITE, { recursive: true }).filter(f => String(f).endsWith('.html'));
  for (const f of html) {
    const path = join(SITE, String(f));
    const was  = read(path);
    const now  = was.replaceAll(`>v${from}</a>`, `>v${to}</a>`)
                    .replaceAll(`title="What shipped in v${from}"`, `title="What shipped in v${to}"`);
    if (now !== was) { writeFileSync(path, now); n++; }
  }
  return n;
}

function cut(version, title) {
  if (!SEMVER.test(version)) { console.error(`not a version: ${version}`); process.exit(1); }
  const data = index();
  if (data.releases.some(r => r.version === version)) { console.error(`v${version} already exists`); process.exit(1); }
  if (!title) { console.error('a release needs a one-line title'); process.exit(1); }

  const notes = `${version}.md`;
  const date  = new Date().toISOString().slice(0, 10);
  writeFileSync(join(SITE, 'versions', notes),
    `## ${title}\n\nTODO: what changed, and why. One bullet per change, the reason first.\n\n- \n`);

  data.releases.unshift({ version, date, title, file: notes, source: `git:v${version}` });
  data.latest = version;
  writeFileSync(INDEX, JSON.stringify(data, null, 2) + '\n');

  const touched = setVersionInPages(index().releases[1].version, version);
  writeFileSync(join(ROOT, 'riskmandate_ai/version'), `v${version}\n`);
  writeFileSync(join(ROOT, 'pyproject.toml'),
    read(join(ROOT, 'pyproject.toml')).replace(/^(version\s*=\s*)"v[\d.]+"/m, `$1"v${version}"`));

  console.log(`v${version} — ${title}`);
  console.log(`  site/versions/${notes}   write the notes here`);
  console.log(`  ${touched} pages restamped, riskmandate_ai/version and pyproject.toml updated`);
  console.log(`  then: node scripts/site/generate.mjs && git commit`);
}

const [version, ...title] = process.argv.slice(2);
if (version) cut(version, title.join(' '));
else {
  console.log(`usage: node scripts/site/release.mjs <version> "<title>"`);
  console.log(`current: v${index().latest}`);
}
