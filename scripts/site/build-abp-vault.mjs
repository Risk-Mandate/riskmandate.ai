// build-abp-vault.mjs — render one Agent Behaviour Policy vault from its inputs.
//
//   node scripts/site/build-abp-vault.mjs <slug>          # site/vaults/<slug>/
//   node scripts/site/build-abp-vault.mjs <slug> --check  # fail if anything is stale
//
// A vault is a directory. Its inputs are three JSON files and a config:
//
//   vault.json            who this vault is for, and its status (template / draft / corrected)
//   data/grant.json       the deployment shape's profile — MEASURED or derived, never typed here
//   data/mandate.json     what the deployer authorised — ELICITED; the only file a person edits
//   data/vocabulary/*.json the published vocabulary this was computed against, pinned by version
//
// Everything else in the directory is DERIVED from those and rewritten on every run:
//
//   data/delta.json               grant against mandate — never authored, recomputed here
//   data/validity.json            what this describes, as at when, and what would void it
//   AGENT-BEHAVIOUR-POLICY.md     the four objects in one document
//   MANDATE.md  GRANT.md  DELTA.md  LICENCE-TO-OPERATE.md  README.md
//   history/index.json            one entry per recompute whose counts moved
//
// Two files are NOT generated and travel with every vault unchanged: AGENTS.md
// (the generic drop-in that tells an agent how to treat these files) and SKILL.md
// (the same, in the portable agent-skill format). They live in the template and
// are copied in if absent.
//
// The vault app (index.html, app.json) is the template's, copied in on every run with
// this vault's data injected as the FALLBACK, so it renders with no bridge at all.
//
// The delta semantics are abp.delta/v1 as published at abp.sgit.ai: excess is the
// grant minus the mandate's wants, in grant order; refused is the part of the
// excess the mandate names as unwanted; unstated is the rest; unbounded excess is
// the excess whose barrier is anything but a boundary; shortfall is wanted and not
// granted; aligned is granted and wanted. Where data/upstream/delta.json exists the
// recomputation is checked against it row for row and the build refuses to write
// if they disagree — a delta this site cannot reproduce is not one it should ship.
//
// No score, rating, level or traffic light is computed or rendered anywhere here,
// and there is no field for one. That is the rule that makes the document usable.

import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync } from 'node:fs';
import { dirname, join, resolve }                                             from 'node:path';
import { fileURLToPath }                                                      from 'node:url';

// ----------------------------------------------------------------- a deterministic zip
// STORE only, fixed timestamp, entries in path order: the same inputs give the same bytes,
// so --check can compare it like every other derived file. No dependency.
const CRC = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
function crc32(buf) { let c = 0xFFFFFFFF; for (let i = 0; i < buf.length; i++) c = CRC[(c ^ buf[i]) & 0xFF] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; }
function zipStore(entries /* [{name, data:Buffer}] sorted */, dosDate = 0x5D2F /* 2026-09-15 */, dosTime = 0) {
  const locals = [], centrals = []; let offset = 0;
  const u16 = (n) => { const b = Buffer.alloc(2); b.writeUInt16LE(n); return b; }, u32 = (n) => { const b = Buffer.alloc(4); b.writeUInt32LE(n >>> 0); return b; };
  for (const e of entries) {
    const name = Buffer.from(e.name, 'utf8'), crc = crc32(e.data);
    const local = Buffer.concat([u32(0x04034b50), u16(20), u16(0x0800), u16(0), u16(dosTime), u16(dosDate), u32(crc), u32(e.data.length), u32(e.data.length), u16(name.length), u16(0), name, e.data]);
    centrals.push(Buffer.concat([u32(0x02014b50), u16(20), u16(20), u16(0x0800), u16(0), u16(dosTime), u16(dosDate), u32(crc), u32(e.data.length), u32(e.data.length), u16(name.length), u16(0), u16(0), u16(0), u16(0), u32(0), u32(offset), name]));
    locals.push(local); offset += local.length;
  }
  const cd = Buffer.concat(centrals);
  const eocd = Buffer.concat([u32(0x06054b50), u16(0), u16(0), u16(entries.length), u16(entries.length), u32(cd.length), u32(offset), u16(0)]);
  return Buffer.concat([...locals, cd, eocd]);
}

const ROOT     = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const VAULTS   = join(ROOT, 'site', 'vaults');
const TEMPLATE = join(VAULTS, '_template');

const slug  = process.argv[2];
const CHECK = process.argv.includes('--check');
if (!slug) { console.error('usage: build-abp-vault.mjs <slug> [--check]'); process.exit(2); }

const DIR = join(VAULTS, slug);
const rd  = (p) => JSON.parse(readFileSync(join(DIR, p), 'utf8'));
const cfg     = rd('vault.json');
const grant   = rd('data/grant.json');
const mandate = rd('data/mandate.json');
const caps    = rd('data/vocabulary/capabilities.json');
const bars    = rd('data/vocabulary/barriers.json');
const undo    = rd('data/vocabulary/undo-classes.json');
const tiers   = rd('data/vocabulary/evidence-tiers.json');
const upstreamDelta = existsSync(join(DIR, 'data/upstream/delta.json')) ? rd('data/upstream/delta.json') : null;

// ----------------------------------------------------------------- vocabulary
const CAP    = Object.fromEntries(caps.capabilities.map(c => [c.id, c]));
const GLYPH  = { none: '●', expectation: '◉', setting: '◐', boundary: '○', absent: '·' };
const BAR    = Object.fromEntries(bars.barriers.map(b => [b.id, b]));
const UNDO   = Object.fromEntries(undo.classes.map(u => [u.id, u.published_meaning]));
const TIER   = Object.fromEntries(tiers.tiers.map(t => [t.id, t.published_meaning]));
const MEASURED = new Set(tiers.counted_as_measured);
const undoRank = Object.fromEntries(undo.order.map((u, i) => [u, i]));   // irreversible first
const gloss  = (id) => CAP[id]?.gloss ?? id;
const reach  = (id) => CAP[id]?.reach ?? id.split('.').pop();
const reachName = (id) => grant.reach_names?.[reach(id)] ? `${reach(id)} — ${grant.reach_names[reach(id)]}` : reach(id);

// ----------------------------------------------------------------- the delta
const grantIds = grant.grant.map(r => r.capability);
const rowOf    = Object.fromEntries(grant.grant.map(r => [r.capability, r]));
const want     = new Set(mandate.want);
const refuse   = new Set(mandate.do_not_want);

const excess          = grantIds.filter(id => !want.has(id));
const excess_refused  = excess.filter(id => refuse.has(id));
const excess_unstated = excess.filter(id => !refuse.has(id));
const unbounded       = excess.filter(id => rowOf[id].barrier !== 'boundary');
const shortfall       = mandate.want.filter(id => !rowOf[id]);
const aligned         = grantIds.filter(id => want.has(id));
// Idempotent builds: if the stored delta has the same lists and the same pinned inputs, keep
// its timestamp — a rebuild that changes nothing should write nothing, and the zip stays
// byte-identical so --check can compare it.
const prevDelta = existsSync(join(DIR, 'data/delta.json')) ? rd('data/delta.json') : null;
const sameAsPrev = prevDelta && JSON.stringify([prevDelta.excess, prevDelta.excess_refused, prevDelta.excess_unstated, prevDelta.unbounded_excess, prevDelta.shortfall, prevDelta.aligned, prevDelta.grant_version, prevDelta.mandate_version, prevDelta.vocabulary_version])
  === JSON.stringify([excess, excess_refused, excess_unstated, unbounded, shortfall, aligned, grant.profile_version, mandate.authored, cfg.vocabulary_version]);
const computed_at     = sameAsPrev ? prevDelta.computed_at : new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');

const delta = {
  type: 'abp/delta/v1',
  profile: grant.id,
  mandate: mandate.id,
  grant_version: grant.profile_version,
  mandate_version: mandate.authored,
  vocabulary_version: cfg.vocabulary_version,
  computed_at,
  computed_by: 'riskmandate.ai build-abp-vault.mjs (abp.delta/v1 semantics)',
  excess, excess_refused, excess_unstated,
  unbounded_excess: unbounded,
  shortfall, aligned,
  derived_never_authored: 'No field in this record is writable by a person. The way to change a delta is to change a grant or a mandate, and then recompute.',
  counts: { excess: excess.length, unbounded_excess: unbounded.length, shortfall: shortfall.length, aligned: aligned.length },
  id: `${grant.id.replace(/\//g, '__')}__${mandate.id}`,
};

// Check against the published record, row for row, before writing anything.
let agreement = null;
if (upstreamDelta) {
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  const fields = ['excess', 'excess_refused', 'excess_unstated', 'unbounded_excess', 'shortfall', 'aligned'];
  const bad = fields.filter(f => !same(delta[f], upstreamDelta[f]));
  if (bad.length) {
    console.error(`delta disagrees with data/upstream/delta.json on: ${bad.join(', ')}`);
    process.exit(1);
  }
  agreement = { against: upstreamDelta.id, computed_at_upstream: upstreamDelta.computed_at, computed_by_upstream: upstreamDelta.computed_by, fields_checked: fields };
}

// ----------------------------------------------------------------- validity
const validity = {
  type: 'riskmandate/abp-validity/v1',
  describes: `${grant.product} — deployment shape ${grant.id}, grant version ${grant.profile_version}`,
  mandate: `${mandate.id}, ${mandate.status}, authored ${mandate.authored}`,
  vocabulary: `abp.sgit.ai ${cfg.vocabulary_version}`,
  as_at: cfg.as_at,
  statement: 'This describes the deployment shape as at this date. If the risk changed, the deployment changed — not this document.',
  void_when: [
    'the grant version changes — a product release, a setting, a connector enabled or removed',
    'the mandate changes — the deployer authorises more or less',
    'the vocabulary version changes — a primitive is added, split or renamed',
    'a barrier moves — a setting becomes a boundary, or a boundary is removed',
  ],
  no_score: 'No score, rating, level or traffic light appears in this vault or in its data, and none will. The behaviour policy describes; it does not judge.',
};

// ----------------------------------------------------------------- rendering helpers
const nl = (...lines) => lines.flat().join('\n') + '\n';
const measuredCount = grant.grant.filter(r => MEASURED.has(r.evidence)).length;
const sortRows = (ids) => [...ids].sort((a, b) => (undoRank[rowOf[a].undo] - undoRank[rowOf[b].undo]) || grantIds.indexOf(a) - grantIds.indexOf(b));
const status = (id) => want.has(id) ? 'want' : refuse.has(id) ? 'do not want' : 'unstated';
const statusOf = { want: 'in the mandate', 'do not want': 'refused by the mandate', unstated: 'unstated by the mandate' };
const isTemplate = cfg.status === 'template';
const who = {
  organisation: cfg.organisation || (isTemplate ? '— not yet issued to anyone —' : ''),
  agent: cfg.agent || grant.product,
  owner: cfg.owner || (isTemplate ? '— unassigned —' : ''),
};
const head = (title, blurb) => nl(
  `# ${title}`, '',
  `> ${blurb}`, '',
  `**Vault** \`${slug}\` · **status** ${cfg.status} · **shape** \`${grant.id}\` · **grant** ${grant.profile_version} · **mandate** ${mandate.authored} · **vocabulary** abp.sgit.ai ${cfg.vocabulary_version} · **as at** ${cfg.as_at}`, '',
  '---', '');
const foot = () => nl('', '---', '',
  `_${validity.statement}_ `,
  `${validity.no_score} `,
  `Generated by \`scripts/site/build-abp-vault.mjs\` from \`data/grant.json\`, \`data/mandate.json\` and the pinned vocabulary; \`data/mandate.json\` is the only file a person writes. Licence: CC BY 4.0.`);

const rowLine = (id) => {
  const r = rowOf[id];
  return `| \`${id}\` | ${gloss(id)} | ${GLYPH[r.barrier]} ${r.barrier} | ${r.undo} | ${r.evidence}${MEASURED.has(r.evidence) ? ' ✓' : ''} | ${statusOf[status(id)]} |`;
};
const rowTable = (ids) => nl(
  '| Capability | What it is | Barrier | Undo | Evidence | Mandate |',
  '| --- | --- | --- | --- | --- | --- |',
  ids.map(rowLine));

// ----------------------------------------------------------------- README.md
const readme = nl(
  head(`${cfg.title} — an Agent Behaviour Policy, as a vault`,
       `${isTemplate ? 'This is the template vault for one deployment shape: the draft a buyer corrects. ' : 'This is one deployment, described. '}Everything in it is derived from three inputs, and one of them is yours.`),
  '## What is in here', '',
  '| File | What it is | Who writes it |',
  '| --- | --- | --- |',
  '| `AGENT-BEHAVIOUR-POLICY.md` | The four objects in one document: grant, mandate, delta, barrier | derived |',
  '| `MANDATE.md` · `data/mandate.json` | What the agent is authorised and expected to do | **you** — the only authored file |',
  '| `GRANT.md` · `data/grant.json` | Everything the agent can do, one row per capability, with what stands in the way of each | measured from the shape; never typed |',
  '| `DELTA.md` · `data/delta.json` | Excess, shortfall, and the part of the excess nothing bounds | derived, never authored, recomputed on every build |',
  '| `LICENCE-TO-OPERATE.md` | The organisation authorises the agent to operate under this behaviour policy, for an interval, with conditions | derived from the mandate; signed by a named person when issued |',
  '| `AGENTS.md` | Drop this into the agent\'s own context — `CLAUDE.md`, `AGENTS.md`, a `ROLE.md`, a skill — so it knows how to treat the rest | generic; travels unchanged |',
  '| `SKILL.md` | The same, in the portable agent-skill format | generic; travels unchanged |',
  '| `data/validity.json` | What this describes, as at when, and what would void it | derived |',
  '| `data/vocabulary/` | The 23 capability primitives, 4 barriers, 3 undo classes and evidence tiers this was computed against, pinned | copied from abp.sgit.ai, versioned |',
  '| `history/` | One entry per recompute whose counts moved | derived |', '',
  '## How to read it', '',
  '1. **`MANDATE.md` first**, because it is the one thing you already know. If it is wrong, it is wrong upward — most people authorised less than the draft assumes.',
  '2. **`GRANT.md` second.** Every row says how it is known (measured or derived), what stands in the way (one of four barriers), and whether the effect can be undone.',
  '3. **`DELTA.md` third.** The list of what it can do and you did not ask for, split into the part you refused, the part you never mentioned, and the part nothing bounds.',
  '4. **`LICENCE-TO-OPERATE.md` last.** What the organisation is actually authorising, for how long, on what conditions, and who signs.', '',
  '## How to correct it', '',
  'Edit `data/mandate.json` — move a capability between `want`, `do_not_want` and `unstated` — and rebuild:', '',
  '```',
  `node scripts/site/build-abp-vault.mjs ${slug}`,
  '```', '',
  'The delta is recomputed and the documents are rewritten. Nothing else in this vault is edited by hand, and a hand-edited delta would be detected: the build recomputes it from the inputs every time.', '',
  '## How to give it to the agent', '',
  'Copy `AGENTS.md` into the agent\'s working context (or append it to the file the agent already reads — `CLAUDE.md`, `AGENTS.md`, `ROLE.md`, a `SKILL.md`), and put `MANDATE.md`, `GRANT.md` and `AGENT-BEHAVIOUR-POLICY.md` beside it. `AGENTS.md` tells the agent what each file is, what to do with it, and — in its own words — what a file like that cannot do.', '',
  '## What this is not', '',
  '- Not a risk assessment. It has no assets in it and no consequences; it is the input to one.',
  '- Not a compliance assessment, a certification, an audit or a security review of any named product.',
  '- Not a guardrail. The barrier column in `GRANT.md` says which rows are bounded by something and which are only asked.',
  '- Not scored. A behaviour policy cannot be dangerous; a deployment can.',
  foot());

// ----------------------------------------------------------------- MANDATE.md
const mandateMd = nl(
  head('MANDATE — what the agent is authorised and expected to do',
       isTemplate
         ? 'A starting point, not a survey. It is written to be argued with, and the correction is usually upward: read it and tell us where it is wrong.'
         : 'Elicited from the deployer. This is the only authored file in the vault.'),
  `**Mandate id** \`${mandate.id}\` · **status** ${mandate.status} · **authored** ${mandate.authored} by ${mandate.authored_by}`, '',
  '## In one paragraph', '',
  mandate.description, '',
  `## What is wanted (${mandate.want.length})`, '',
  '| Capability | What it is | Reach |',
  '| --- | --- | --- |',
  mandate.want.map(id => `| \`${id}\` | ${gloss(id)} | ${reachName(id)} |`), '',
  `## What is explicitly not wanted (${mandate.do_not_want.length})`, '',
  '| Capability | What it is | Reach |',
  '| --- | --- | --- |',
  mandate.do_not_want.map(id => `| \`${id}\` | ${gloss(id)} | ${reachName(id)} |`), '',
  `## Unstated (${mandate.unstated.length})`, '',
  'Named neither way. For the ones that are in the grant, this is authority nobody scoped — see `DELTA.md`.', '',
  '| Capability | What it is | In the grant | Note |',
  '| --- | --- | --- | --- |',
  mandate.unstated.map(id => `| \`${id}\` | ${gloss(id)} | ${rowOf[id] ? 'yes' : 'no'} | ${mandate.notes?.[id] ?? ''} |`), '',
  '## Correct it', '',
  'Move any capability between the three lists in `data/mandate.json` and rebuild. Three questions settle most rows:', '',
  '- **Did you ask for this?** Then it is a want.',
  '- **Would you object if it happened?** Then it is a do-not-want — and the barrier column in `GRANT.md` says whether anything actually stops it.',
  '- **Neither?** Leave it unstated. Unstated rows in the grant are the ones that turn up in an incident report as "nobody said it couldn\'t".',
  foot());

// ----------------------------------------------------------------- GRANT.md
const notReach = (grant.not_reachable || []).map(n => `| ${n.what} | ${n.why} | ${n.source} |`);
const grantMd = nl(
  head('GRANT — everything the agent can do',
       'Measured from the deployment shape, not from your account and not by you. Every row says how it is known, what stands in the way, and whether it can be undone. Irreversible rows first.'),
  `**Shape** ${grant.product} (${grant.vendor}) · **surface** ${grant.surface} · **grant version** ${grant.profile_version} · **rows** ${grant.grant.length}, of which **${measuredCount} measured** and ${grant.grant.length - measuredCount} derived · **widest reach** ${grant.widest_reach}`, '',
  '## What the words mean here', '',
  grant.description, '',
  '| Reach | In this shape means |',
  '| --- | --- |',
  Object.entries(grant.reach_names || {}).map(([k, v]) => `| ${k} | ${v} |`), '',
  '## The rows', '',
  '| Capability | What it is | Barrier | Undo | Evidence | Via | What stands in the way |',
  '| --- | --- | --- | --- | --- | --- | --- |',
  sortRows(grantIds).map(id => {
    const r = rowOf[id];
    return `| \`${id}\` | ${gloss(id)} | ${GLYPH[r.barrier]} ${r.barrier} | ${r.undo} | ${r.evidence}${MEASURED.has(r.evidence) ? ' ✓' : ''} | ${r.via.join(', ')} | ${r.control ?? '—'} |`;
  }), '',
  '## The notes behind the rows', '',
  sortRows(grantIds).map(id => `- **\`${id}\`** — ${rowOf[id].note}`), '',
  '## Not reachable from this shape', '',
  '| What | Why | Source |',
  '| --- | --- | --- |',
  notReach, '',
  '## The four barriers, and the test', '',
  '| | Barrier | What stands in the way | Is it a control |',
  '| --- | --- | --- | --- |',
  bars.barriers.map(b => `| ${GLYPH[b.id]} | ${b.id} | ${b.published_meaning} | ${b.is_control ? '**yes**' : 'no'} |`), '',
  `> ${bars.enforcer_test}`, '',
  'A setting the agent\'s own account can change is not a control, because the grant includes the ability to remove the bound. A boundary enforced above it is one, because it does not.', '',
  '## Evidence tiers', '',
  '| Tier | Means |',
  '| --- | --- |',
  tiers.order.map(t => `| ${t}${MEASURED.has(t) ? ' ✓' : ''} | ${TIER[t]} |`), '',
  '✓ marks the tiers this vault counts as measured. Nothing here was obtained by probing anybody else\'s system: a row is measured only from a system we are entitled to run, or from the vendor\'s own published documentation.', '',
  '## Ask the agent to check it', '',
  'The agent is running in the deployment this file describes, so it can look. What it reports is a claim until a log held outside it agrees — but a claim from inside the deployment is a better starting point than a template. Paste this into a session running in the shape above:', '',
  '```',
  'You are running inside the deployment described in GRANT.md. Compare each row with what you',
  'can actually reach from here, and report — do not change any file except the one named below.',
  '',
  'For every row: PRESENT, ABSENT or CANNOT TELL; which tool reaches it; one line of evidence',
  '(a command\'s output, a tool\'s own description, a documentation sentence with its URL).',
  'Never exercise a capability whose undo class is "no" to prove it exists: presence of a',
  'credential file is evidence; using it is not permitted.',
  'Add a row for anything you can reach that is not listed, in verb.object.reach form, using',
  'only the 23 primitives in data/vocabulary/capabilities.json. A new path, host or mailbox is',
  'an instance of an existing primitive, not a new one.',
  'Do not touch MANDATE.md or data/mandate.json — that file is the deployer\'s, not yours.',
  'Write the result to history/grant-check--<today>.md with the date and the tool versions',
  'you can see. Everything in it is self-report; say so at the top.',
  '```',
  foot());

// ----------------------------------------------------------------- DELTA.md
const deltaMd = nl(
  head('DELTA — what it can do that you did not ask for',
       'Derived from the grant and the mandate, never authored. Recomputed on every build, with both inputs pinned. If this file looks wrong, one of the two inputs is.'),
  `**Grant** ${grant.profile_version} · **mandate** ${mandate.authored} · **computed** ${computed_at}${agreement ? ` · **agrees row for row with** the published record \`${agreement.against}\` (${agreement.computed_at_upstream})` : ''}`, '',
  '## Four counts, and none of them is a score', '',
  '| | Count | Meaning |',
  '| --- | --- | --- |',
  `| Grant | ${grantIds.length} | capabilities the deployment reaches |`,
  `| Mandate | ${mandate.want.length} | capabilities the deployer wanted |`,
  `| Excess | ${excess.length} | in the grant and not wanted |`,
  `| **Unbounded excess** | **${unbounded.length}** | excess with no boundary in the way — the only number anybody can move |`,
  `| Shortfall | ${shortfall.length} | wanted and not in the grant |`,
  `| Aligned | ${aligned.length} | wanted and granted |`, '',
  `## Excess you refused (${excess_refused.length})`, '',
  'You said no. Each row says what, if anything, enforces the no.', '',
  excess_refused.length ? rowTable(sortRows(excess_refused)) : '_none_', '',
  `## Excess you never mentioned (${excess_unstated.length})`, '',
  'Authority nobody scoped. Not wrong — unstated. These are the rows to read twice.', '',
  excess_unstated.length ? rowTable(sortRows(excess_unstated)) : '_none_', '',
  `## Unbounded excess (${unbounded.length})`, '',
  'The excess whose barrier is anything but a boundary. Every real control moves one of these rows into the fourth barrier and this list gets shorter; nothing else does.', '',
  unbounded.length ? nl(unbounded.map(id => `- \`${id}\` — ${gloss(id)} — ${GLYPH[rowOf[id].barrier]} ${rowOf[id].barrier}${rowOf[id].control ? ` — ${rowOf[id].control}` : ''}`)) : '_none_', '',
  `## Shortfall (${shortfall.length})`, '',
  shortfall.length ? nl(shortfall.map(id => `- \`${id}\` — ${gloss(id)} — wanted, and not in this grant`)) : '_none — everything wanted is granted._', '',
  `## Aligned (${aligned.length})`, '',
  rowTable(sortRows(aligned)),
  foot());

// ----------------------------------------------------------------- LICENCE-TO-OPERATE.md
const conditions = sortRows(excess);
const ltoMd = nl(
  head('LICENCE TO OPERATE — the organisation authorises the agent, under this behaviour policy, for an interval',
       'The organisation is the authority, the behaviour policy is the instrument, and the agent is the licensee. Self-issued, witnessed, and dated — which is how most assurance works.'),
  '| | |',
  '| --- | --- |',
  `| **Licensee** | ${who.agent} — deployment shape \`${grant.id}\`, grant version ${grant.profile_version} |`,
  `| **Authority** | ${who.organisation} |`,
  `| **Accountable owner** | ${who.owner} |`,
  `| **Instrument** | This behaviour policy: mandate \`${mandate.id}\` (${mandate.authored}), delta \`${delta.id}\` (${computed_at}), vocabulary abp.sgit.ai ${cfg.vocabulary_version} |`,
  `| **Issued** | ${cfg.issued ?? (isTemplate ? '— not issued: this is a template —' : '—')} |`,
  `| **Valid until** | ${cfg.valid_until ?? '— an interval is set when it is issued; a licence with no expiry is not a decision —'} |`, '',
  `## Scope — what the licensee is authorised to do (${mandate.want.length})`, '',
  mandate.want.map(id => `- \`${id}\` — ${gloss(id)}`), '',
  `## Conditions — what the licensee is asked not to do, and what enforces each (${conditions.length})`, '',
  'A condition is only as good as the thing in its last column. Conditions with ● or ◉ beside them are asked, not enforced; the organisation issuing this licence is accepting that, for the interval above, with its eyes open.', '',
  '| Condition | Asked because | Barrier | Enforced by |',
  '| --- | --- | --- | --- |',
  conditions.map(id => {
    const r = rowOf[id];
    return `| Do not \`${id}\` (${gloss(id).toLowerCase()}) | ${refuse.has(id) ? 'the mandate refuses it' : 'the mandate never authorised it'} | ${GLYPH[r.barrier]} ${r.barrier} | ${r.control ?? '**nothing** — a line in prose'} |`;
  }), '',
  '## Void when', '',
  validity.void_when.map(v => `- ${v}`), '',
  'When any of those happens the deployment changed, not this document. Rebuild, re-read the delta, and re-issue.', '',
  '## Signature', '',
  isTemplate
    ? 'Unsigned. A template is not issued to anybody. When this vault is customised for one organisation, a named person signs here, with the date and the interval, and the same person owns the review when the interval ends.'
    : `Signed by the accountable owner named above on ${cfg.issued ?? '—'}, for the interval stated. The same person owns the review when it ends.`,
  foot());

// ----------------------------------------------------------------- AGENT-BEHAVIOUR-POLICY.md
const abpMd = nl(
  head(`AGENT BEHAVIOUR POLICY — ${cfg.title}`,
       'For one agent in one deployment: everything it can do, what you authorised, the gap between the two, and what actually stands in the way. It describes and it does not judge, so it carries no score.'),
  '## Four objects, and the verb attached to each', '',
  '| Object | What it is | How it is obtained | Here |',
  '| --- | --- | --- | --- |',
  `| The mandate | What the agent is authorised and expected to do | **Elicited** — you already know it | \`MANDATE.md\` — ${mandate.want.length} wanted, ${mandate.do_not_want.length} refused, ${mandate.unstated.length} unstated |`,
  `| The grant | Everything the agent can do | **Measured** — from the shape, the account, the credentials | \`GRANT.md\` — ${grantIds.length} capabilities, ${measuredCount} measured |`,
  `| The delta | Excess and shortfall | **Derived** — recomputed whenever either input moves, never edited | \`DELTA.md\` — ${excess.length} excess, ${unbounded.length} unbounded, ${shortfall.length} shortfall |`,
  `| The barrier | What stands between the agent and each capability | **Recorded** per row, one of four kinds | the third column of every table |`, '',
  '## The deployment', '',
  `**${grant.product}**, ${grant.vendor}. ${grant.description}`, '',
  '## The mandate, in one paragraph', '',
  mandate.description, '',
  '## The whole grant, with the mandate beside it', '',
  'Irreversible rows first. ✓ marks a measured row.', '',
  rowTable(sortRows(grantIds)),
  '## The delta', '',
  `**${excess.length} in the grant that the mandate did not ask for.** ${excess_refused.length} of those it refused; ${excess_unstated.length} it never mentioned. **${unbounded.length} have nothing but a setting, a sentence or nothing at all in the way.** ${shortfall.length ? `${shortfall.length} wanted and not granted.` : 'Nothing wanted is missing.'}`, '',
  unbounded.length ? nl('Unbounded excess:', '', unbounded.map(id => `- \`${id}\` — ${gloss(id)} — ${GLYPH[rowOf[id].barrier]} ${rowOf[id].barrier}`)) : '', '',
  '## Prohibitions, each with its barrier', '',
  'Every line an agent is asked to observe, next to what enforces it. A prohibition shown without its barrier is a claim this document cannot support.', '',
  '| Line | Barrier | Enforced by |',
  '| --- | --- | --- |',
  conditions.map(id => `| Do not \`${id}\` — ${gloss(id).toLowerCase()} | ${GLYPH[rowOf[id].barrier]} ${rowOf[id].barrier} | ${rowOf[id].control ?? '**nothing**'} |`),
  '| Stop and report if a task needs anything above | ◉ expectation | **nothing** — and this is the line that makes the rest useful |', '',
  '## What is not reachable', '',
  (grant.not_reachable || []).map(n => `- **${n.what}** — ${n.why} _(${n.source})_`), '',
  '## Validity', '',
  `${validity.statement} As at **${cfg.as_at}**, against grant ${grant.profile_version}, mandate ${mandate.authored}, vocabulary ${cfg.vocabulary_version}. Void when: ${validity.void_when.join('; ')}.`, '',
  '## Where a score would live, and why it is not here', '',
  'The same behaviour policy is dangerous in one deployment and harmless in another, and nothing about the document changed. A score needs the assets and the consequences, and this document has neither. That is not a preference; it is where the information is.',
  foot());

// ----------------------------------------------------------------- history
const histPath = join(DIR, 'history', 'index.json');
mkdirSync(join(DIR, 'history'), { recursive: true });
const hist = existsSync(histPath) ? JSON.parse(readFileSync(histPath, 'utf8')) : { note: 'One entry per recompute whose counts moved. The delta is derived; this is its record.', entries: [] };
const last = hist.entries[hist.entries.length - 1];
if (!last || JSON.stringify(last.counts) !== JSON.stringify(delta.counts) || last.grant_version !== delta.grant_version || last.mandate_version !== delta.mandate_version) {
  hist.entries.push({ v: hist.entries.length + 1, computed_at, grant_version: delta.grant_version, mandate_version: delta.mandate_version, vocabulary_version: cfg.vocabulary_version, counts: delta.counts });
}

// ----------------------------------------------------------------- write, or check
const outputs = {
  'data/delta.json': JSON.stringify(delta, null, 2) + '\n',
  'data/validity.json': JSON.stringify(validity, null, 2) + '\n',
  'history/index.json': JSON.stringify(hist, null, 2) + '\n',
  'README.md': readme,
  'AGENT-BEHAVIOUR-POLICY.md': abpMd,
  'MANDATE.md': mandateMd,
  'GRANT.md': grantMd,
  'DELTA.md': deltaMd,
  'LICENCE-TO-OPERATE.md': ltoMd,
};
// The vault app: the template's index.html with this vault's data inlined. The app prefers
// live reads over the bridge and falls back to this copy, so the file is derived like the rest.
if (existsSync(join(TEMPLATE, 'index.html'))) {
  const agents = existsSync(join(DIR, 'AGENTS.md')) ? readFileSync(join(DIR, 'AGENTS.md'), 'utf8') : readFileSync(join(TEMPLATE, 'AGENTS.md'), 'utf8');
  const skill  = existsSync(join(DIR, 'SKILL.md'))  ? readFileSync(join(DIR, 'SKILL.md'), 'utf8')  : readFileSync(join(TEMPLATE, 'SKILL.md'), 'utf8');
  const md = (n) => outputs[n];
  const distDir = join(DIR, 'dist');
  mkdirSync(distDir, { recursive: true });
  // the zip: every document and data file, no app — built here so it cannot disagree with them
  const zipEntries = [
    ...Object.entries(outputs).filter(([n]) => /\.(md|json)$/.test(n)).map(([n, c]) => ({ name: n, data: Buffer.from(c, 'utf8') })),
    { name: 'AGENTS.md', data: Buffer.from(agents, 'utf8') }, { name: 'SKILL.md', data: Buffer.from(skill, 'utf8') },
    { name: 'vault.json', data: readFileSync(join(DIR, 'vault.json')) },
    { name: 'data/grant.json', data: readFileSync(join(DIR, 'data/grant.json')) }, { name: 'data/mandate.json', data: readFileSync(join(DIR, 'data/mandate.json')) },
    ...['capabilities', 'barriers', 'undo-classes', 'evidence-tiers'].map(f => ({ name: `data/vocabulary/${f}.json`, data: readFileSync(join(DIR, `data/vocabulary/${f}.json`)) })),
  ].sort((a, b) => a.name < b.name ? -1 : 1);
  const zipName = `${slug}.zip`, pdfName = `${slug}.pdf`;
  outputs[`dist/${zipName}`] = zipStore(zipEntries);
  const dist = { [zipName]: true, ...(existsSync(join(distDir, pdfName)) ? { [pdfName]: true } : {}) };
  const fallback = { vault: cfg, grant, mandate, delta, validity, history: hist, capabilities: caps, barriers: bars, undo, tiers, agents, skill,
                     mandate_md: md('MANDATE.md'), grant_md: md('GRANT.md'), delta_md: md('DELTA.md'), licence_md: md('LICENCE-TO-OPERATE.md'), abp_md: md('AGENT-BEHAVIOUR-POLICY.md'), readme: md('README.md'), dist };
  const compact = JSON.stringify(fallback).replace(/<\//g, '<\\/');
  const tpl = readFileSync(join(TEMPLATE, 'index.html'), 'utf8');
  if (!tpl.includes('/*__DATA__*/{}')) { console.error('template index.html has no /*__DATA__*/{} marker'); process.exit(1); }
  outputs['index.html'] = tpl.replace('const FALLBACK = /*__DATA__*/{};', 'const FALLBACK = /*__DATA__*/' + compact + ';');
  outputs['app.json']   = readFileSync(join(TEMPLATE, 'app.json'), 'utf8').replace('"title": "Agent Behaviour Policy"', '"title": ' + JSON.stringify('ABP — ' + cfg.title));
}
// The computed_at stamp changes every run; --check compares everything but it.
const strip = (s) => s.replace(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z/g, '<ts>');
let stale = [];
for (const [rel, content] of Object.entries(outputs)) {
  const p = join(DIR, rel);
  if (CHECK) {
    if (!existsSync(p)) { stale.push(rel); continue; }
    const same = Buffer.isBuffer(content) ? strip(readFileSync(p).toString('latin1')) === strip(content.toString('latin1')) : strip(readFileSync(p, 'utf8')) === strip(content);
    if (!same) stale.push(rel);
    continue;
  }
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, content);
}
for (const generic of ['AGENTS.md', 'SKILL.md']) {
  const p = join(DIR, generic);
  if (!existsSync(p) && existsSync(join(TEMPLATE, generic)) && !CHECK) copyFileSync(join(TEMPLATE, generic), p);
  if (CHECK && !existsSync(p)) stale.push(generic);
}
if (CHECK) {
  if (stale.length) { console.error(`stale: ${stale.join(', ')} — run build-abp-vault.mjs ${slug}`); process.exit(1); }
  console.log(`${slug}: up to date`);
} else {
  console.log(`${slug}: grant ${grantIds.length} (${measuredCount} measured) · mandate ${mandate.want.length} · excess ${excess.length} · unbounded ${unbounded.length} · shortfall ${shortfall.length} · aligned ${aligned.length}${agreement ? ' · agrees with the published delta' : ''}`);
}
