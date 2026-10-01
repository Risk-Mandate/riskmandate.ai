# The encrypted contact form, for another site: what riskmandate.ai built and how to copy it

**Date:** 30 September 2026 · **Author:** @website-agent · **For:** the agent that keeps diniscruz.ai,
and any site in the sgit.ai network that wants the same · **Status:** live here since v1.35.3

## 1. What it is, in one paragraph

A contact form on a static site with no server, no form builder and nothing stored: what the visitor
types is encrypted in their browser to the site agent's public key and dropped, with one POST, into a
write-only *append lane* on the agent's private sgit vault. The vault host sees ciphertext, a size and
a time; only the agent that holds the vault can list, fetch and decrypt. The agent drains the lane at
its next session with a script, files each message as a `.eml` in the vault, and a person replies from
the site's mailbox. If anything fails in the browser, the same text is offered as a `mailto:` link.
Everything a sender needs is public on purpose; nothing that opens the vault is ever on a page.

Live: [riskmandate.ai/contact.html](https://riskmandate.ai/contact.html) ·
[riskmandate.ai/early-access.html](https://riskmandate.ai/early-access.html) (the same mechanism, a
registration) · [riskmandate.ai/agents/](https://riskmandate.ai/agents/) (the page that explains the
agent, built from the contact file) · [riskmandate.ai/.well-known/sgit-agents.json](https://riskmandate.ai/.well-known/sgit-agents.json)
· [privacy](https://riskmandate.ai/privacy.html#forms) (what the vault host sees, said plainly).

It follows two sgit.ai documents to the letter: [Agent Contact v0.1](https://sgit.ai/docs/agent-contact.html)
(the contact file, the comms vault, the drain) and [the append-lanes API](https://sgit.ai/api/append-lanes.html)
(the six endpoints, the double-encoded payload). The browser side is new: sgit's hybrid envelope v2
built with Web Crypto, proven against `sgit pki decrypt`.

## 2. The files to copy, all in the public repository

Repository: [github.com/Risk-Mandate/riskmandate.ai](https://github.com/Risk-Mandate/riskmandate.ai), branch `dev`.

| file | what it is | copy as is? |
|---|---|---|
| `site/contact.html` | the page: the form, the inlined `SgEnvelope` script and the form script, the "what happens to it" section | the two `<script>` blocks yes; the markup and CSS to the site's own chrome |
| `site/.well-known/sgit-agents.json` | the contact file the form reads at submit time: the key, the vault, the lanes | the shape yes; every value is the new site's own |
| `scripts/site/build-agents.mjs` | builds `/agents/` from the contact file, with a `--check` so the page cannot drift | adapt the chrome; keep the fingerprint check |
| `tests/site/test_agents.mjs` | recomputes the fingerprints from the PEMs; refuses anything private in the file | yes |
| `scripts/intake/drain.mjs`, `configure.mjs`, `README.md` | the drain (list, fetch, decrypt, verify, file, log, mark processed) and the lane configurator | yes; `COMMS_KEY` and `SGSEND_TOKEN` from the environment |
| `site/privacy.html` (section `#forms`) | the honest paragraph about what leaves the browser and what the host sees | the substance yes |

The browser script is 40 lines: import the PEM as `RSA-OAEP`/`SHA-256`, make an `AES-GCM` 256 key,
encrypt the message, wrap the key, `{v:2, w, i, c}` with base64 fields, base64 the JSON (that is the
`.enc` text), base64 it once more for the lane payload. Unsigned, because a visitor has no key; the
drain files these as web-form kind on the `site` lane and requires signatures only on the `agents` lane.

## 3. The steps, in order

1. **A comms vault for the site agent.** `sgit create comms-<site> --base-url https://dev.send.sgraph.ai --token <SG/Send credential>`.
   Commit a README and **push once before anything else**: `configure` answers 404 on a vault that has
   never been pushed (learned here on 30 September; sgit.ai's open point 1).
2. **The identity's keys.** `sgit vault derive-keys <vault key>` gives the write key. Derive, in memory,
   the key-store secret `HMAC-SHA256(write_key, "agent-contact/key-pass/<identity>/v1")` and the listing
   key `HMAC-SHA256(write_key, "agent-contact/enum-key/v1")`; then `sgit pki keygen --label <identity>` with the secret in the environment variable sgit reads for it (named in `scripts/intake/README.md`),
   copy `~/.sg-send/keys/<fp>/` into the vault at `agent-contact/keys/store/`, and `sgit pki export <fp>`
   for the public bundle. The private PEMs are encrypted at rest; a read-key holder cannot use them.
3. **Two lanes.** Two tokens, `secrets.token_hex(32)` each; `POST /api/vault/append/configure/<vault>` with
   the write-key header and the host credential header (both named on the API page), body `{append_anchors:[sha256(t1), sha256(t2)], enum_key_hash: sha256(listing key)}`.
   It replaces the list, so always send every lane. `agent-contact/lanes.json` in the vault records name → anchor.
4. **The contact file and the page.** `/.well-known/sgit-agents.json` with `site`, `operator`, `accepts_from`,
   the identity's bundle and fingerprints, the inbox (vault, endpoint, `encrypt_to`, `status`, the lanes with
   their public tokens). Build `/agents/` from it; add the `llms.txt` line; put *Agents* in the menu.
5. **The form.** The page fetches the contact file, checks the key against its fingerprint, encrypts, POSTs
   `{append_token, payload}` to `append/write/<vault>` (the host allows any browser origin), shows the
   done state on `{"ok": true}`, and falls back to `mailto:` on anything else. A honeypot field, a consent
   box, and a `Message-ID` per message so the drain can refuse replays.
6. **The drain.** `COMMS_KEY=… node scripts/intake/drain.mjs --vault <clone> --dry-run`, then without.
   One commit per drain; the vault's history is the record. A schedule is the operator's.
7. **The privacy page** says what changed. **The site's tests** must accept a 64-hex public token and
   refuse anything private; riskmandate.ai's credential test bans the words for the private things, so
   the page and the file say "the vault's own key" and never the banned ones.
8. **Tell the network.** sgit.ai's directory lists each site as *not yet* until its contact file exists; a
   signed message over sgit.ai's `agents` lane is the announcement and the first live send.

## 4. What to keep straight

- The append tokens are public and the vault key is the only secret. Never the write key, the listing key
  or the key-store secret in a file, a commit or a page; derive them from the vault key each session.
- The lane answers `{"ok": true}` and nothing else, by design. The page cannot show a file id; do not try.
- `fetch` works on pending files only: the drain keeps the `.enc` beside the `.eml` so a signature can be
  re-verified later.
- Every claim on the site's pages carries what it can be checked against: the fingerprint's derivation,
  the repository history of the contact file, the date the lane was tested.

## 5. The prompt, ready to paste into the diniscruz.ai agent's session

> Add the same encrypted contact form riskmandate.ai has to diniscruz.ai. Read, in this order:
> https://riskmandate.ai/admin/briefs/handover__the-contact-form-for-another-site/ (this brief),
> https://sgit.ai/docs/agent-contact.html and https://sgit.ai/api/append-lanes.html. Then copy from
> github.com/Risk-Mandate/riskmandate.ai (branch dev): the two script blocks in site/contact.html,
> tests/site/test_agents.mjs, scripts/intake/drain.mjs and configure.mjs, and the shape of
> site/.well-known/sgit-agents.json and scripts/site/build-agents.mjs. Do the eight steps in section 3
> with diniscruz.ai's own values: create the comms vault and push it once before configuring lanes,
> generate the identity's keys and store them in the vault, open an `agents` lane and a `site` lane,
> publish the contact file and an /agents/ page built from it, add /contact.html in this site's chrome,
> update the privacy page, and prove the round trip: a message encrypted in a browser, written to the
> lane, drained with the script and decrypted. Ask me for the SG/Send credential in the session; never
> write it, the vault key or anything derived from them into a file. Record the vault key where this
> site records its keys. Release it, and tell me the vault id, the two lane names and the fingerprint.
