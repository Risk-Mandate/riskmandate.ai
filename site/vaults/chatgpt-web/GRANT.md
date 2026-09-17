# GRANT — everything the agent can do

> Measured from the deployment shape, not from your account and not by you. Every row says how it is known, what stands in the way, and whether it can be undone. Irreversible rows first.

**Vault** `chatgpt-web` · **status** template · **shape** `openai/chatgpt-web/default` · **grant** 2026-09-05 · **mandate** 2026-09-09 · **vocabulary** abp.sgit.ai v0.3.0 · **as at** 2026-09-15

---


**Shape** ChatGPT (in the browser, no connectors) (OpenAI) · **surface** web · **grant version** 2026-09-05 · **rows** 1, of which **0 measured** and 1 derived · **widest reach** project

## What the words mean here

An assistant in the vendor's environment. It reaches what you paste or upload and nothing on your machine: the vendor's environment is a boundary you did not build. DERIVED from the assess library's web tree. Browsing, if on, is the vendor's egress, not yours.

| Reach | In this shape means |
| --- | --- |
| host | the vendor's environment; not your machine |
| tenant | nothing of yours |
| world | the vendor's egress, if browsing is on |

## The rows

| Capability | What it is | Barrier | Undo | Evidence | Via | What stands in the way |
| --- | --- | --- | --- | --- | --- | --- |
| `read.file.project` | Read the project it is working on | ● none | yes | derived | conversation and uploads | — |

## The notes behind the rows

- **`read.file.project`** — what you paste or upload — and a record once read is exposure that cannot be unread, on the vendor's side

## Permitted, and blocked

The grant above is what the agent can do **after** the blocks. This is what something withholds. A block is not a property of the credential: some of these are the credential's own ceiling, and some are a vendor choosing not to ship a tool the credential would authorise. Each one names what blocks it, because those two are not the same object and a reader who is shown them under one heading has been told something this document cannot support.

| What | Blocked by | Who holds the block | Why | Source |
| --- | --- | --- | --- | --- |
| your machine's files | the vendor's hosted environment — a browser tab reaches OpenAI's servers, and no local path is exposed to it | _not yet recorded_ | the vendor's environment is a boundary you did not build | assess/library.json (web: home) |
| your accounts | the connector toggles, all of them off in this shape | _not yet recorded_ | no connectors are on | assess/library.json (web: connect) |

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
Generated by `scripts/site/build-abp-vault.mjs` from `data/grant.json`, `data/mandate.json` and the pinned vocabulary; `data/mandate.json` is the only file a person writes. Licence: the published template is CC BY 4.0; a paid copy carries a commercial licence to the buyer. See LICENCE.md.

