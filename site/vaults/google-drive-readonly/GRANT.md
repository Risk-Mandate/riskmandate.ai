# GRANT — everything the agent can do

> Measured from the deployment shape, not from your account and not by you. Every row says how it is known, what stands in the way, and whether it can be undone. Irreversible rows first.

**Vault** `google-drive-readonly` · **status** template · **shape** `google/drive/readonly-connector` · **grant** 2026-09-15 · **mandate** 2026-09-15 · **vocabulary** abp.sgit.ai v0.3.0 · **as at** 2026-09-15

---


**Shape** An assistant connected to a personal Google Drive with drive.readonly (Google (the scope); the assistant's vendor holds the token) · **surface** connector · **grant version** 2026-09-15 · **rows** 3, of which **0 measured** and 3 derived · **widest reach** host

## What the words mean here

Any assistant a person connects to their own Drive with the read-only scope. Google classes drive.readonly as a restricted scope — "View and download all your Drive files" — and the per-file alternative, drive.file, reaches only files the user opened with the app. An assistant that searches needs the restricted one. The corpus it then searches defaults to the user corpus: files owned by or shared to the user.

| Reach | In this shape means |
| --- | --- |
| host | the Drive as a store: every file owned by or shared to the user |
| tenant | the Google account the consent was given for |
| world | not granted by this scope |

## The rows

| Capability | What it is | Barrier | Undo | Evidence | Via | What stands in the way | Whose material |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `read.file.host` | Read any file the account can reach | ○ boundary | no | documented | drive.readonly | the OAuth scope — restricted in Google's classification, so the assistant's vendor had to pass restricted-scope verification | mixed |
| `authenticate-as.credential.tenant` | Act in accounts with the credentials it holds | ○ boundary | no | documented | the OAuth consent | Google's consent screen; the assistant's vendor holds the refresh token | own |
| `read.credential.host` | Read credentials stored where it runs | ● none | no | inferred | drive.readonly | — | own |

**Whose material** is not in the published grammar. It is the property Lab 01 found a connector shape needs — `own`, `organisation`, `third_party` or `mixed` — and is asked of the model site as Lab 03 request 1. `mixed` is the finding: no setting any of these vendors offers makes it `own`.

## The notes behind the rows

- **`read.file.host`** — drive.readonly — "View and download all your Drive files." The default corpus of a listing is "files owned by or shared to the user"; whether shared drives are included is open, below.
- **`authenticate-as.credential.tenant`** — the connector acts as the account holder
- **`read.credential.host`** — drives hold exported keys, service-account files, .env backups and password exports beside everything else. Reading all files reads those. Inferred, not documented.

## Not reachable from this shape

| What | Why | Source |
| --- | --- | --- |
| writing, moving, sharing or deleting files | drive.readonly is "View and download"; drive and drive.file are separate scopes and are not in this grant | https://developers.google.com/workspace/drive/api/guides/api-specific-auth |
| your machine | a drive connector reaches a drive, not a disk | https://developers.google.com/workspace/drive/api/guides/api-specific-auth |

## Where the vendor's own pages disagree

Advertised in one place, permitted in another, and the two do not match. Published unresolved on purpose: settling any of these by connecting an assistant and trying would mean probing somebody else's system, which is out of bounds here. If the vendor says which page is right, this table changes and says so.

| What is advertised | What the grant permits | State |
| --- | --- | --- |
| "search your files" (the shape, as assistants describe it) | drive.readonly over the user corpus; whether the assistant sets includeItemsFromAllDrives, and so whether shared drives are searched, is not stated on either page | **undocumented** |

Sources: <https://developers.google.com/workspace/drive/api/reference/rest/v3/files/list> · <https://developers.google.com/workspace/drive/api/guides/enable-shareddrives>

## Open questions

**3** things this grant cannot settle from the pages it was read from. Each is in `RESEARCH-NEEDED.md` with how to settle it, and can be handed to a separate agent. Until it is answered, the row it belongs to stands at the evidence tier shown.

## The four barriers, and the test

| | Barrier | What stands in the way | Is it a control |
| --- | --- | --- | --- |
| ● | none | nothing in the way | no |
| ◉ | expectation | a rule in prose, enforced by nobody | no |
| ◐ | setting | a switch the agent's own account can flip | no |
| ○ | boundary | enforced above the grant, out of the agent's reach | **yes** |

> A control bounds a grant only if it is enforced by something the grant does not include.

A setting the agent's own account can change is not a control, because the grant includes the ability to remove the bound. A boundary enforced above it is one, because it does not.

## Evidence tiers

| Tier | Means |
| --- | --- |
| derived | from what the thing architecturally is; a claim until somebody runs the probes |
| inferred | from another row or another profile, by reasoning rather than by observation |
| self-reported | reported by the operator, the harness or the tool itself, without an independent probe |
| documented | the vendor, or a published tool, says so |
| measured ✓ | a probe run on an instance, dated, with an evidence file |
| observed ✓ | seen directly, on the thing itself, by the thing itself |

✓ marks the tiers this vault counts as measured. Nothing here was obtained by probing anybody else's system: a row is measured only from a system we are entitled to run, or from the vendor's own published documentation.

## Ask the agent to check it

The agent is running in the deployment this file describes, so it can look. What it reports is a claim until a log held outside it agrees — but a claim from inside the deployment is a better starting point than a template. Paste this into a session running in the shape above:

```
You are running inside the deployment described in GRANT.md. Compare each row with what you
can actually reach from here, and report — do not change any file except the one named below.

For every row: PRESENT, ABSENT or CANNOT TELL; which tool reaches it; one line of evidence
(a command's output, a tool's own description, a documentation sentence with its URL).
Never exercise a capability whose undo class is "no" to prove it exists: presence of a
credential file is evidence; using it is not permitted.
Add a row for anything you can reach that is not listed, in verb.object.reach form, using
only the 23 primitives in data/vocabulary/capabilities.json. A new path, host or mailbox is
an instance of an existing primitive, not a new one.
Do not touch MANDATE.md or data/mandate.json — that file is the deployer's, not yours.
Write the result to history/grant-check--<today>.md with the date and the tool versions
you can see. Everything in it is self-report; say so at the top.
```

---

_This describes the deployment shape as at this date. If the risk changed, the deployment changed — not this document._ 
No score, rating, level or traffic light appears in this vault or in its data, and none will. The behaviour policy describes; it does not judge. 
Generated by `scripts/site/build-abp-vault.mjs` from `data/grant.json`, `data/mandate.json` and the pinned vocabulary; `data/mandate.json` is the only file a person writes. Licence: CC BY 4.0.

