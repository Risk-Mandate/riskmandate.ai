// mail.mjs — Email-FS-lite for the stories vault, in one file and no dependencies.
//
//   node scripts/stories/mail.mjs <command> [options]     (--vault <dir> or STORIES_VAULT=<dir>)
//
// The protocol is sgraph.ai's Email-FS-lite (https://sgraph.ai/en-gb/library/how-it-works/email-fs-lite):
// agents exchange RFC 2822 .eml files through folders in a shared sgit vault. No broker, no API.
// Everything here is a file operation, and one check-in is one sgit commit.
//
//   mail/mailroom/<recipient>/       the transit zone: senders create, recipients move
//   mail/<agent>/inbox/              delivered, open work            (only <agent> writes here)
//   mail/<agent>/done/               handled
//   mail/<agent>/outbox/<recipient>/ the sender's copy of what it sent
//   mail/<agent>/issues/{open,blocked,done}/   the agent's own tasks, as markdown with front matter
//   mail/<agent>/files/              deliverables too big for a message body (a drawn panel)
//   mail/sessions/<agent>/brief.md   written once; notes.md is the append-only log
//   board/board.json                 derived: every issue and every undelivered message, one list
//
// Identities: publisher.claude (this repository's agent: reads the vault, publishes to the site),
// studio.chatgpt (writes and draws), dinis.human (the lead). Only your own folder is yours to
// write in; the mailroom is the one place you write for somebody else.
//
// Commands
//   init                       lay the folders out for every agent named in --agents (idempotent)
//   send --to <agent> --subject "…" (--body "…" | --body-file <f>) [--reply-to <message-id>]
//   deliver                    move everything in mail/mailroom/<me>/ into my inbox
//   done <file>                move an inbox message to done/
//   issue open <id> --title "…" [--body "…"|--body-file f] [--source path] [--priority p]
//   issue block <id> --on "…"  |  issue unblock <id>  |  issue close <id>
//   board [--site]             derive board/board.json; --site also writes site/stories/board.json
//   status                     what is in my mailroom, inbox and issues
//
// Nothing here talks to the network: sgit pull / commit / push are run around it, by hand or by
// the check-in routine, and the token never comes near this file.

import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync, renameSync, statSync, unlinkSync } from 'node:fs';
import { dirname, join, resolve, basename }                                                    from 'node:path';
import { fileURLToPath }                                                                        from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const args = process.argv.slice(2);
const opt  = (name, dflt) => { const i = args.indexOf(`--${name}`); return i >= 0 && args[i + 1] !== undefined && !args[i + 1].startsWith('--') ? args[i + 1] : (i >= 0 ? true : dflt); };
const positional = args.filter((a, i) => !a.startsWith('--') && !(i > 0 && args[i - 1].startsWith('--') && !['site'].includes(args[i - 1].slice(2))));
const cmd  = positional[0];
const ME   = opt('me', process.env.STORIES_ME || 'publisher.claude');
const VAULT = resolve(opt('vault', process.env.STORIES_VAULT || join(ROOT, 'stories-vault/seed')));
const DOMAIN = 'stories.vault';
const fail = (m) => { console.error(`mail: ${m}`); process.exit(1); };
const v    = (...p) => join(VAULT, ...p);
const ls   = (d) => existsSync(d) ? readdirSync(d).filter((f) => !f.startsWith('.')).sort() : [];
const mk   = (d) => mkdirSync(d, { recursive: true });
const now  = () => new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
const rfcDate = () => new Date().toUTCString().replace('GMT', '+0000');
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').replace(/^(.{0,64})(?:-.*)?$/, '$1');   // whole words, up to 64 chars
const body = () => opt('body-file') ? readFileSync(resolve(opt('body-file')), 'utf8') : (opt('body') || '');

if (!existsSync(VAULT)) fail(`no vault at ${VAULT} (--vault <dir> or STORIES_VAULT)`);

// ------------------------------------------------------------------ the folders
function init() {
  const agents = (opt('agents') || 'publisher.claude,studio.chatgpt,dinis.human').split(',');
  for (const a of agents) {
    for (const d of ['inbox', 'done', 'files', 'issues/open', 'issues/blocked', 'issues/done']) keep(v('mail', a, d));
    for (const b of agents) if (b !== a) keep(v('mail', a, 'outbox', b));
    keep(v('mail', 'mailroom', a));
    mk(v('mail', 'sessions', a));
  }
  mk(v('board'));
  console.log(`mail: folders for ${agents.join(', ')} under ${VAULT}`);
}
function keep(d) { mk(d); const k = join(d, '.keep'); if (!existsSync(k)) writeFileSync(k, ''); }

// ------------------------------------------------------------------ messages
// A message number is global to the vault: the next after the highest seen anywhere, so that
// ids stay unique without a counter file that two agents would both write.
function nextNumber() {
  let n = 0;
  const walk = (d) => { for (const f of ls(d)) { const p = join(d, f); if (statSync(p).isDirectory()) walk(p); else { const m = f.match(/^(\d{3})-/); if (m) n = Math.max(n, +m[1]); } } };
  walk(v('mail'));
  return String(n + 1).padStart(3, '0');
}
function headers(raw) {
  const h = {}; const head = raw.split(/\r?\n\r?\n/)[0];
  for (const line of head.split(/\r?\n/)) { const m = line.match(/^([\w-]+):\s*(.*)$/); if (m) h[m[1].toLowerCase()] = m[2]; }
  return h;
}
function send() {
  const to = opt('to'), subject = opt('subject'); const text = body();
  if (!to || !subject || !text) fail('send needs --to, --subject and --body or --body-file');
  const n = nextNumber(), file = `${n}-${slug(subject)}.eml`, id = `<${n}-${slug(subject)}@${DOMAIN}>`;
  const lines = [
    `From: ${ME} <${ME}@${DOMAIN}>`, `To: ${to} <${to}@${DOMAIN}>`, `Subject: ${subject}`, `Date: ${rfcDate()}`, `Message-ID: ${id}`,
    ...(opt('reply-to') ? [`In-Reply-To: ${opt('reply-to')}`, `References: ${opt('reply-to')}`] : []),
    'MIME-Version: 1.0', 'Content-Type: text/plain; charset=utf-8', '', text.trimEnd(), ''
  ];
  const eml = lines.join('\n');
  mk(v('mail', 'mailroom', to)); mk(v('mail', ME, 'outbox', to));
  writeFileSync(v('mail', 'mailroom', to, file), eml);
  writeFileSync(v('mail', ME, 'outbox', to, file), eml);
  console.log(`mail: sent ${file} to ${to} (mailroom + outbox)`);
}
function deliver() {
  const room = v('mail', 'mailroom', ME); let n = 0;
  for (const f of ls(room).filter((f) => f.endsWith('.eml'))) { renameSync(join(room, f), v('mail', ME, 'inbox', f)); n++; console.log(`mail: delivered ${f}`); }
  if (!n) console.log('mail: nothing in the mailroom');
}
function done() {
  const f = positional[1]; if (!f) fail('done <file>');
  const from = v('mail', ME, 'inbox', basename(f)); if (!existsSync(from)) fail(`${f} is not in my inbox`);
  renameSync(from, v('mail', ME, 'done', basename(f))); console.log(`mail: ${basename(f)} done`);
}

// ------------------------------------------------------------------ issues
const issueDirs = ['open', 'blocked', 'done'];
function findIssue(id) {
  for (const d of issueDirs) for (const f of ls(v('mail', ME, 'issues', d))) if (f.startsWith(`${id}-`) || f === `${id}.md`) return { dir: d, file: f, path: v('mail', ME, 'issues', d, f) };
  return null;
}
function parseIssue(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/); const meta = {};
  if (m) for (const line of m[1].split('\n')) { const k = line.match(/^([\w_]+):\s*(.*)$/); if (k) meta[k[1]] = k[2]; }
  const rest = m ? m[2] : raw;
  const title = rest.match(/^#\s+(.+)$/m)?.[1] || '';
  return { meta, title, text: rest };
}
function writeIssue(path, meta, text) {
  writeFileSync(path, `---\n${Object.entries(meta).filter(([, val]) => val !== undefined && val !== '').map(([k, val]) => `${k}: ${val}`).join('\n')}\n---\n${text.trimEnd()}\n`);
}
function issue() {
  const sub = positional[1], id = positional[2]; if (!sub || !id) fail('issue open|block|unblock|close <id>');
  const have = findIssue(id);
  if (sub === 'open') {
    if (have) fail(`${id} exists in ${have.dir}/`);
    const title = opt('title'); if (!title) fail('issue open needs --title');
    const meta = { created: now(), owner: ME, source: opt('source') || '', priority: opt('priority') || 'normal', for: opt('for') || '' };
    writeIssue(v('mail', ME, 'issues', 'open', `${id}-${slug(title)}.md`), meta, `# ${title}\n\n${body() || ''}`);
    console.log(`mail: opened ${id}`); return;
  }
  if (!have) fail(`no issue ${id}`);
  const { meta, text } = parseIssue(readFileSync(have.path, 'utf8'));
  const move = (to, extra) => {
    const p = v('mail', ME, 'issues', to, have.file);
    writeIssue(p, { ...meta, ...extra }, text);
    if (p !== have.path) unlinkSync(have.path);
    console.log(`mail: ${id} → ${to}/`);
  };
  if (sub === 'block')   { const on = opt('on'); if (!on) fail('block needs --on'); return move('blocked', { blocked_on: on, blocked_at: now() }); }
  if (sub === 'unblock') return move('open', { blocked_on: '', unblocked_at: now() });
  if (sub === 'close')   return move('done', { closed: now() });
  fail(`unknown issue command ${sub}`);
}

// ------------------------------------------------------------------ the board
// Derived, never edited: every agent's issues in their three states, plus every message still in
// a mailroom as "requested" work for its recipient. Single-writer holds: the board is a view.
function board() {
  const agents = ls(v('mail')).filter((a) => !['mailroom', 'sessions'].includes(a) && statSync(v('mail', a)).isDirectory());
  const cards = [];
  for (const a of agents) for (const d of issueDirs) for (const f of ls(v('mail', a, 'issues', d)).filter((f) => f.endsWith('.md'))) {
    const { meta, title } = parseIssue(readFileSync(v('mail', a, 'issues', d, f), 'utf8'));
    cards.push({ id: f.replace(/-.*$/, '').replace(/\.md$/, ''), title, owner: a, state: d, created: meta.created || '', priority: meta.priority || 'normal', for: meta.for || '', source: meta.source || '', blocked_on: meta.blocked_on || '', closed: meta.closed || '', path: `mail/${a}/issues/${d}/${f}` });
  }
  for (const a of ls(v('mail', 'mailroom'))) for (const f of ls(v('mail', 'mailroom', a)).filter((f) => f.endsWith('.eml'))) {
    const h = headers(readFileSync(v('mail', 'mailroom', a, f), 'utf8'));
    cards.push({ id: f.slice(0, 3), title: h.subject || f, owner: a, state: 'requested', created: h.date ? new Date(h.date).toISOString().replace(/\.\d{3}Z$/, 'Z') : '', from: (h.from || '').replace(/\s*<.*$/, ''), path: `mail/mailroom/${a}/${f}` });
  }
  const order = { requested: 0, open: 1, blocked: 2, done: 3 };
  cards.sort((x, y) => order[x.state] - order[y.state] || x.id.localeCompare(y.id));
  const out = { generated: now(), vault: 'stories', note: 'Derived by scripts/stories/mail.mjs board from every agent\'s issues and every message still in a mailroom. Edit the issues, not this file.', agents, columns: ['requested', 'open', 'blocked', 'done'], cards };
  mk(v('board'));
  const json = JSON.stringify(out, null, 2) + '\n';
  writeFileSync(v('board', 'board.json'), json);
  // the app that draws it carries an inline copy, so it renders where a vault path cannot be read
  const app = v('board', 'index.html');
  if (existsSync(app)) writeFileSync(app, readFileSync(app, 'utf8').replace(/const FALLBACK = \/\*__DATA__\*\/.*;/, `const FALLBACK = /*__DATA__*/${JSON.stringify(out)};`));
  console.log(`mail: board has ${cards.length} cards (${agents.join(', ')})`);
  if (opt('site')) { writeFileSync(join(ROOT, 'site/stories/board.json'), json); console.log('mail: site/stories/board.json written — run build-stories.mjs'); }
}

function status() {
  console.log(`vault: ${VAULT}\nme: ${ME}`);
  console.log(`mailroom: ${ls(v('mail', 'mailroom', ME)).filter((f) => f.endsWith('.eml')).join(', ') || 'empty'}`);
  console.log(`inbox: ${ls(v('mail', ME, 'inbox')).filter((f) => f.endsWith('.eml')).join(', ') || 'empty'}`);
  for (const d of issueDirs) console.log(`issues/${d}: ${ls(v('mail', ME, 'issues', d)).filter((f) => f.endsWith('.md')).join(', ') || 'none'}`);
}

({ init, send, deliver, done, issue, board, status }[cmd] || (() => fail(`unknown command ${cmd || ''}; see the header of this file`)))();
