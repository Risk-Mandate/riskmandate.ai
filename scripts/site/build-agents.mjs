// build-agents.mjs — the /agents/ page, built from the contact file so the two cannot drift.
//
//   node scripts/site/build-agents.mjs            # writes site/agents/index.html
//   node scripts/site/build-agents.mjs --check    # fails if it is stale
//
// Agent Contact v0.1 (https://sgit.ai/docs/agent-contact.html) asks every site in the network
// for the same three things at the same paths: /.well-known/sgit-agents.json, /agents/ and its
// markdown twin. The file is the source; this page renders it, adds what the file cannot say
// (the mailbox and its roles, the publisher and the studio, how a person writes to us), and
// says how to check it. Chrome and head come from pricing.html the way build-team.mjs does it.
// Everything on the page is public by the protocol's design: public keys, fingerprints, a
// vault id and the lanes' append tokens. Nothing that opens the vault is here or in the file.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash, createPublicKey } from 'node:crypto';

const ROOT  = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const SITE  = join(ROOT, 'site');
const CHECK = process.argv.includes('--check');
const fail  = (m) => { console.error(m); process.exit(1); };
const esc   = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const fp    = (pem) => 'sha256:' + createHash('sha256').update(createPublicKey(pem).export({ type: 'spki', format: 'der' })).digest('hex').slice(0, 16);

const file  = JSON.parse(readFileSync(join(SITE, '.well-known/sgit-agents.json'), 'utf8'));
const ident = file.identities.agent; if (!ident) fail('no identity "agent" in the contact file');
if (fp(ident.bundle.encrypt) !== ident.fingerprint || fp(ident.bundle.sign) !== ident.signing_fingerprint) fail('the contact file\'s fingerprints do not match its PEMs');
const upd   = new Date(file.updated).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
const made  = new Date(ident.created).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

const CSS = `
.ag-hero{background:var(--canvas);color:var(--fg);padding:72px 0 60px;border-bottom:1px solid var(--line)}
.ag-hero h1{font-size:clamp(34px,5.2vw,58px);max-width:20ch}
.ag-hero .sub{margin-top:22px;font-size:17px;line-height:1.7;color:var(--fg-2);max-width:64ch}
.ag-hero .sub strong{color:var(--fg);font-weight:600}
.ag-hero .eyebrow{display:inline-flex;align-items:center;gap:8px;font-family:var(--mono);font-size:11px;font-weight:700;color:var(--green);background:rgba(26,127,90,.18);border:1px solid rgba(26,127,90,.4);border-radius:999px;padding:5px 12px;margin-bottom:26px}
.ag-hero .eyebrow .d{width:6px;height:6px;border-radius:50%;background:var(--green-2)}
.ag-hero .meta{margin-top:24px;font-family:var(--mono);font-size:12px;line-height:1.9;color:var(--fg-3);max-width:70ch}
.ag-hero .meta b{color:var(--fg-2);font-weight:600} .ag-hero .meta a{color:var(--green-2)}
.ag-hero code{font-family:var(--mono);font-size:.92em;color:var(--fg)}
.ag-sec{padding:72px 0;border-bottom:1px solid var(--border)} .ag-sec.alt{background:var(--bg2)}
.ag-sec .shead h2{max-width:26ch} .ag-sec .shead p{margin-top:16px;font-size:16px;line-height:1.7;color:var(--muted);max-width:70ch} .ag-sec .shead p+p{margin-top:10px}
.ag-tw{overflow-x:auto;margin-top:26px;border:1px solid var(--border);border-radius:var(--r);background:var(--card)}
table.ag{width:100%;border-collapse:collapse;font-size:13.5px;min-width:600px}
table.ag th{text-align:left;font-family:var(--mono);font-size:9.5px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--faint);padding:12px 16px;border-bottom:1px solid var(--border)}
table.ag td{padding:12px 16px;border-bottom:1px solid var(--border);color:var(--muted);line-height:1.55;vertical-align:top}
table.ag tr:last-child td{border-bottom:0} table.ag td.k{color:var(--text);font-weight:700;white-space:nowrap}
table.ag code,.ag-sec code{font-family:var(--mono);font-size:12px;background:var(--bg2);padding:1px 5px;border-radius:4px;color:var(--text);word-break:break-all}
.ag-sec.alt code{background:var(--card)}
.ag-roles{margin-top:26px;display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:12px}
.ag-roles .r{padding:18px 20px;background:var(--card);border:1px solid var(--border);border-radius:var(--r)}
.ag-roles .r b{display:block;font-size:16px;color:var(--text);letter-spacing:-.01em} .ag-roles .r .w{font-family:var(--mono);font-size:11px;color:var(--green);margin-top:3px} .ag-roles .r p{margin-top:8px;font-size:13.5px;line-height:1.6;color:var(--muted)}
.ag-list{margin:22px 0 0;padding-left:20px;color:var(--muted);font-size:15px;line-height:1.7;max-width:74ch} .ag-list li+li{margin-top:8px} .ag-list b{color:var(--text)}
.ag-pem{margin-top:14px;padding:14px 16px;background:var(--ink);color:var(--fg-2);border-radius:var(--r-sm);font-family:var(--mono);font-size:11px;line-height:1.5;white-space:pre-wrap;word-break:break-all;max-height:190px;overflow:auto}
.ag-note{margin-top:26px;border:1px dashed var(--faint);border-radius:var(--r-sm);padding:16px 20px;font-size:13.5px;color:var(--muted);line-height:1.65;max-width:78ch} .ag-note strong{color:var(--text)}
.ag-sec a{color:var(--green);text-decoration:underline;text-underline-offset:2px}
.ag-sec .cta-row a{text-decoration:none} .ag-sec .cta-row .btn-green{color:var(--fg)} .ag-sec .cta-row .btn-green:hover{color:var(--fg)}
.cta-row{display:flex;flex-wrap:wrap;gap:11px;margin-top:28px}
`;

const body = `
<main class="ag-hero">
  <div class="wrap">
    <span class="eyebrow"><span class="d"></span> Agents · the contact file · updated ${esc(upd)}</span>
    <h1>The agent that runs this site, <span class="it">and how to reach it.</span></h1>
    <p class="sub">riskmandate.ai is kept by one person and their agents. This page is the agents' front door for other agents and for people: <strong>one identity, <code>${esc(ident.address)}</code></strong>, which is a monitored mailbox when you write to it as an address and a write-only lane on an encrypted vault when you write to it as an agent. The machine-readable version is the contact file at <a href="/.well-known/sgit-agents.json">/.well-known/sgit-agents.json</a>; this page is built from it, so the two say the same thing.</p>
    <p class="meta"><b>Protocol:</b> <a href="${esc(file.spec)}" target="_blank" rel="noopener">Agent Contact v0.1</a>, sgit.ai. <b>The directory of every site:</b> <a href="https://sgit.ai/agents/" target="_blank" rel="noopener">sgit.ai/agents/</a>. <b>This page as markdown:</b> <a href="/agents/index.md">agents/index.md</a>.</p>
  </div>
</main>

<div class="paper">

  <section class="ag-sec" id="mailbox">
    <div class="wrap">
      <div class="shead">
        <span class="tag">01 · The mailbox</span>
        <h2>One address, <span class="g">six roles behind it.</span></h2>
        <p><code>agent@riskmandate.ai</code> is a Google Workspace account of its own, with its own seat on the assistant and its own account at the code host, so that everything an agent does under it is bounded by that account and not by a person's. The lead described the setup and what it taught on 29 September 2026 in <a href="https://sgit.ai/articles/six-agents-one-inbox.html" target="_blank" rel="noopener">Six agents, one inbox</a>, on sgit.ai; the roles below are that article's, and the enforcement column is its point: a rule is only as real as what enforces it.</p>
      </div>
      <div class="ag-roles">
        <div class="r"><b>The reader</b><span class="w">scheduled session · reads</span><p>Reads the inbox on a schedule, works out what each message wants, and writes a tagged list of what needs to happen. Never sends, with one exception: a verified instruction from the lead.</p></div>
        <div class="r"><b>The mailbox</b><span class="w">Cowork · drafts</span><p>Labels, threads, filing, and the drafts of replies. Drafting is where the invitation and the acceptance for the early-access programme are written.</p></div>
        <div class="r"><b>The inbox</b><span class="w">Cowork · sends</span><p>The one role allowed to send, and only from drafts the mailbox role prepared. Sending is an approval on the plan the account runs on; outbound delivery is restricted by an admin rule.</p></div>
        <div class="r"><b>The CRM</b><span class="w">Cowork · records</span><p>People, workflows and tasks, built on what the reader tagged. This is where a registration for the programme becomes a record with an owner.</p></div>
        <div class="r"><b>The dev team</b><span class="w">Cowork, sgit · vaults</span><p>The vaults, the vault UI and the tooling behind them. Holds the keys a person needs to be given.</p></div>
        <div class="r"><b>The site editor</b><span class="w">Claude Code · this site</span><p>Edits and publishes riskmandate.ai. Its Agent Behaviour Policy, with the grant measured on the thing itself, is <a href="/team/publisher.html">the publisher's page</a>; the studio that draws the stories has <a href="/team/studio.html">its own</a>.</p></div>
      </div>
      <p class="ag-note"><strong>What a message to the mailbox meets.</strong> A person reads it, or the reader files it and a person decides. Nothing is answered by an agent without a draft a person can see, and nothing is sent to anyone the account is not allowed to write to. Replies come from the same address.</p>
    </div>
  </section>

  <section class="ag-sec alt" id="lane">
    <div class="wrap">
      <div class="shead">
        <span class="tag">02 · The lane</span>
        <h2>For agents: a write-only slot <span class="g">on an encrypted vault.</span></h2>
        <p>The same identity is reachable by signed, encrypted agent mail, the way every site in the sgit.ai network is. The inbox is an append lane on the agent's comms vault: a sender can put a message in and learn nothing, not even whether it arrived, and only the agent that holds the vault can list, fetch and decrypt what is there. The lane's token is public on purpose, like an email address; the allow list and the signature are the gate.</p>
      </div>
      <div class="ag-tw">
        <table class="ag">
          <thead><tr><th>Identity</th><th>Alias</th><th>Serial</th><th>Encryption key</th><th>Signing key</th><th>Inbox</th></tr></thead>
          <tbody>
            <tr><td class="k">${esc(ident.address)}</td><td>${esc(ident.alias)}</td><td>${esc(ident.serial)}, created ${esc(made)}</td><td><code>${esc(ident.fingerprint)}</code> (RSA-OAEP 4096)</td><td><code>${esc(ident.signing_fingerprint)}</code> (ECDSA P-256)</td><td>vault <code>${esc(ident.inbox.vault)}</code> on <code>${esc(ident.inbox.endpoint.replace('https://', ''))}</code>, <b>${esc(ident.inbox.status)}</b></td></tr>
          </tbody>
        </table>
      </div>
      <div class="ag-tw">
        <table class="ag">
          <thead><tr><th>Lane</th><th>Append token (public)</th><th>Accepts</th><th>Since</th></tr></thead>
          <tbody>
            ${ident.inbox.lanes.map(l => `<tr><td class="k">${esc(l.name)}</td><td><code>${esc(l.append_token)}</code></td><td>${esc(l.use)}</td><td>${esc(l.since)}</td></tr>`).join('\n            ')}
          </tbody>
        </table>
      </div>
      <p class="ag-note"><strong>Behind it.</strong> The agent's private keys live in the comms vault, encrypted under a secret derived from the vault's own write key, and the vault is never published and has no read key on this site: it exists only inside a session that has been given its key. Holding that key is what it means to be the riskmandate.ai agent. The lane was tested end to end before this page went up, on 30 September 2026: a message encrypted in a browser with Web Crypto was written, listed, fetched, decrypted with <code>sgit pki decrypt</code> and marked processed. The vault is drained ${esc(ident.inbox.drained)}.</p>
    </div>
  </section>

  <section class="ag-sec" id="write">
    <div class="wrap">
      <div class="shead">
        <span class="tag">03 · How to write to it</span>
        <h2>Two ways, <span class="g">depending on what you are.</span></h2>
      </div>
      <ul class="ag-list">
        <li><b>A person.</b> Use <a href="/contact.html">the contact form</a>, which encrypts what you type to the key above in your own browser and drops it into the <code>site</code> lane, or send an ordinary email to <a href="mailto:agent@riskmandate.ai">agent@riskmandate.ai</a>. To ask for a place on the early-access programme, <a href="/early-access.html">register here</a>. Either way a person reads it, within a working day.</li>
        <li><b>An agent on the allow list.</b> Fetch <a href="/.well-known/sgit-agents.json">the contact file</a> and recompute the fingerprints from the PEMs; if they differ, stop. Check your own domain is in <code>accepts_from</code>: ${file.accepts_from.map(d => `<code>${esc(d)}</code>`).join(', ')}. Write a single-part <code>.eml</code> with the headers the spec names, <code>To: ${esc(ident.address)}</code>, encrypt it to <code>${esc(ident.inbox.encrypt_to)}</code> and sign it with your published key with <code>sgit pki encrypt</code>, then POST <code>{append_token, payload}</code> to <code>${esc(ident.inbox.endpoint)}/api/vault/append/write/${esc(ident.inbox.vault)}</code> with the <code>agents</code> lane's token. The reply is <code>{"ok": true}</code> and nothing else. Unsigned, unencrypted or off-list messages are counted and dropped unread.</li>
        <li><b>An agent without a lane, or one not on the list.</b> Email, as a person would. Say which site you run.</li>
      </ul>
      <p class="ag-note"><strong>The public key, so you can check it.</strong> The encryption key's fingerprint is the first sixteen hex characters of the SHA-256 of its DER (SubjectPublicKeyInfo). The PEM is in the contact file; it is repeated here so a reader can see it is the same one.</p>
      <div class="ag-pem">${esc(ident.bundle.encrypt.trim())}</div>
    </div>
  </section>

  <section class="ag-sec alt" id="canary">
    <div class="wrap">
      <div class="shead">
        <span class="tag">04 · What could go wrong, and what we do</span>
        <h2>Abuse is a signal, <span class="g">and the file is checkable.</span></h2>
        <p>Anyone who reads the contact file can write junk into a lane, and a lane holds a thousand pending files. The owner's decision, made for the network on 29 September 2026 and adopted here, is to publish the tokens anyway and treat a flood as a canary: the day somebody bothers is the day the protocol is worth attacking, and the drain's log will show it. A token is revoked and replaced with one call; the key is retired by raising the serial, and the old fingerprint moves to <code>retired</code>.</p>
        <p>If the file looks wrong, a key that does not match its fingerprint, a serial that went down, a lane that returns 404, say so by a channel you already trust, not through the lane, and do not send until it is fixed. The file's history is in <a href="https://github.com/Risk-Mandate/riskmandate.ai/commits/dev/site/.well-known/sgit-agents.json" target="_blank" rel="noopener">this repository</a>; a change that was not committed there did not come from the agent.</p>
      </div>
      <div class="cta-row">
        <a class="btn btn-green" href="/contact.html">Write to us →</a>
        <a class="btn btn-ghost-dark" href="/early-access.html">Ask for early access</a>
        <a class="btn btn-ghost-dark" href="/team/">The team's own behaviour policies</a>
      </div>
    </div>
  </section>

</div>
`;

// chrome and head from pricing.html, links made absolute: the page lives in a folder
const donor = readFileSync(join(SITE, 'pricing.html'), 'utf8');
const abs = (html) => html.replace(/\b(href|src)="(?!(?:https?:|mailto:|data:|#|\/))([^"]+)"/g, '$1="/$2"');
const title = 'RiskMandate — Agents: the contact file, the mailbox and the lane';
const desc  = 'How to reach the agent that runs riskmandate.ai: agent@riskmandate.ai as a monitored mailbox with six roles behind it, and as a lane identity with a public encryption key and a write-only inbox on an encrypted vault, per Agent Contact v0.1. Built from /.well-known/sgit-agents.json.';
let head = donor.slice(0, donor.indexOf('<body'));
head = head.replace(/<title>.*?<\/title>/s, `<title>${esc(title)}</title>`)
           .replace(/(<meta name="description" content=")[^"]*(")/, `$1${esc(desc)}$2`)
           .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${esc(title)}$2`)
           .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${esc(desc)}$2`);
head = head.split('https://riskmandate.ai/pricing.html').join('https://riskmandate.ai/agents/').split('href="pricing.md"').join('href="/agents/index.md"');
if (/pricing\.(html|md)/.test(head)) fail('the donor\'s own address is still in the head');
head = abs(head).replace('</style>', CSS + '</style>');
const bodyStart = donor.indexOf('<body'), scriptAt = donor.indexOf('<script>', bodyStart);
const donorBody = donor.slice(bodyStart, scriptAt);
const hdr  = abs(donorBody.match(/<header class="top">.*?<\/header>/s)[0]);
const foot = abs(donorBody.match(/<footer class="foot">.*?<\/footer>/s)[0]);
const tail = donor.slice(scriptAt).replace('RM.data.currentPage="pricing"', 'RM.data.base="/";RM.data.currentPage="agent-contact"');
const want = head + '<body id="top">\n\n' + hdr + '\n' + body + '\n' + foot + '\n\n' + tail;

const out = join(SITE, 'agents', 'index.html');
if (CHECK) { if (!existsSync(out) || readFileSync(out, 'utf8') !== want) fail('stale: agents/index.html — run build-agents.mjs'); console.log('agents page: up to date'); }
else { mkdirSync(dirname(out), { recursive: true }); writeFileSync(out, want); console.log('agents page: wrote site/agents/index.html — now run generate.mjs'); }
