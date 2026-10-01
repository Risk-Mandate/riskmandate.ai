# The intake: the comms vault, its lanes, and the drain

The riskmandate.ai agent has one identity, `agent@riskmandate.ai`, published in
`site/.well-known/sgit-agents.json` and on `/agents/` (Agent Contact v0.1, sgit.ai). Its inbox is a
pair of append lanes on a private comms vault, `yo706x9q` on `dev.send.sgraph.ai`:

| lane | who writes | what |
|---|---|---|
| `agents` | agents on the allow list, signed with their published key | `agent-message/v1` |
| `site` | the contact and early-access forms on the site, encrypted in the visitor's browser, unsigned | `X-RM-Form: contact` or `early-access` |

Both tokens are public (the protocol's design and the owner's decision of 29 September 2026).
The vault's key is the one secret. It lives in the private keys vault and in the environment of a
session as `COMMS_KEY`; it is never in a file in either tree.

## A drain, per session

```bash
cd "$SCRATCH" && sgit clone "$COMMS_KEY" comms-riskmandate          # or sgit pull in an existing clone
COMMS_KEY="$COMMS_KEY" node "$REPO/scripts/intake/drain.mjs" --vault comms-riskmandate --dry-run   # look first
COMMS_KEY="$COMMS_KEY" node "$REPO/scripts/intake/drain.mjs" --vault comms-riskmandate             # then file
cd comms-riskmandate && sgit commit -m "@Agent drain: <n> accepted, <m> quarantined" && sgit push --token "$SGSEND_TOKEN"
```

What arrives under `agent-contact/accepted/` is a `.eml` and its `.enc`, one pair per message; the
`.eml` is what a person reads. `agent-contact/log.jsonl` has one line per file: lane, result, subject,
the reply-to a form gave. A contact message is answered by email from the mailbox; a registration
becomes a record for the CRM role and a person vault made with `packs/dist/abp-for-people-pack.zip`
(see `docs/programme/early-access-invitations.md` for who does what).

The drain never pushes, never deletes on the host, and never writes a key anywhere. Files it cannot
open or does not trust go to `quarantine/` with the reason in the log, and are still marked processed
on the host so a bad file cannot block the lane.

## The lanes themselves

`configure.mjs` (re)registers the lanes and can purge processed files; it needs the vault key and the
SG/Send account credential as `SGSEND_TOKEN`, because `configure` and `purge` are the owner's calls.
`configure` replaces the anchor list, so it always sends both lanes. To revoke a token: mint a new one,
update `lanes.json` in the clone and the contact file on the site, run `configure.mjs`, release.

```bash
COMMS_KEY=… SGSEND_TOKEN=… node scripts/intake/configure.mjs --vault comms-riskmandate            # from lanes.json + the contact file
COMMS_KEY=… SGSEND_TOKEN=… node scripts/intake/configure.mjs --vault comms-riskmandate --purge     # drop processed files on the host
```

One thing learned on 30 September: `configure` answers 404 on a vault that has never been pushed;
after the first commit and push it answers `configured`.

## The browser side

`site/contact.html` and `site/early-access.html` inline two scripts: `SgEnvelope` (sgit's hybrid
envelope v2 built with Web Crypto: AES-256-GCM, RSA-OAEP SHA-256, `{v,w,i,c}` base64, the `.enc`
text base64'd once more for the lane) and the form logic. The page fetches the contact file at
submit time, checks the key against its fingerprint, encrypts, and POSTs to `append/write`. If
anything fails, the same text becomes a mailto to `agent@riskmandate.ai`. The round trip through
`sgit pki decrypt` was tested on 30 September before the pages went up.
