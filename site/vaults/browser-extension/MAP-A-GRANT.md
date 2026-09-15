# MAP-A-GRANT.md — a prompt for an agent that holds a connector or a credential

> Give this to an agent that already holds something — an API key, a connector, a token, a
> bot account — and ask it to measure its own grant and write the first draft of an Agent
> Behaviour Policy. It travels with every vault unchanged. The output is two JSON files the
> generator turns into everything else; a person then corrects the mandate.

## The prompt

Paste everything below the line into the agent's session, with the credential already in
place. Do not paste the credential into the prompt.

---

You hold a credential or a connector. Your task is to measure what it lets you do — not what the
documentation says, what it actually does when asked — and to write it down in a fixed
vocabulary so that a person can say which of it they wanted. This is an **Agent Behaviour
Policy**: four objects, and the verb on each is the whole model.

| Object | Verb | Who produces it |
| --- | --- | --- |
| the grant — everything you can do | **measured** | you, now |
| the mandate — what you were authorised to do | **elicited** | the person who gave you the credential; you write the first draft and mark it as such |
| the delta — excess and shortfall | **derived** | a build script; never typed |
| the barrier — what stands in the way of each row | **recorded** | you, one per row |

### The vocabulary

Fetch `https://abp.sgit.ai/data/index.json` and pin the version it names. From it take:

- **23 capabilities**, each `verb.object.reach` — `read.file.host`, `send.message.world`,
  `authenticate-as.credential.tenant`, `create.schedule.tenant` and so on — with a gloss, a
  reach (`project` · `host` · `tenant` · `world` · `self`) and an undo class (`yes` ·
  `with-effort` · `no`). A row is one of these and nothing else. If what you can do has no
  primitive, record it under `not_in_grammar` with what it is and why no row fits.
- **4 barriers**: `none` (nothing in the way) · `expectation` (a rule in prose) · `setting`
  (a switch your own account can flip) · `boundary` (enforced above the grant, out of your
  reach). **Only a boundary is a control.** The test: *a control bounds a grant only if it is
  enforced by something the grant does not include.* The credential you hold is the grant,
  not a barrier: a key that permits a thing is not what stops it.
- **Evidence tiers**, weakest first: `derived` · `inferred` · `self-reported` · `documented` ·
  `measured` · `observed`. `measured` means a probe you ran, dated, with the evidence kept.
  `observed` means you saw it on the thing itself. Anything you did not try is `derived` or
  `documented`, and says so.
- **Whose material** the row reaches: `own` · `organisation` · `third_party` · `mixed`. A
  mailbox is mixed. A shared drive is mixed. Your own scratch folder is own.

### The rules of measurement

1. **Measure only what you are entitled to run.** The credential was given to you for this
   system; probe this system and nothing beyond it. Never probe another party's system to see
   what it does, and never use what you can reach to reach further.
2. **Reversible probes only, and clean up.** To test *create*, create one obviously named test
   artefact and delete it. To test *delete*, delete only the artefact you created. To test
   *send*, send only to an address the deployer named for the purpose, or record `not tested`.
   Never test *delete* on anything that existed before you did.
3. **Never move a credential.** If you can read credentials, record that you can, with the
   metadata that proves it (name, type, count) and nothing else. Do not print, copy, forward
   or store a secret. Do not test whether a credential works elsewhere.
4. **Note the door.** The same operation can be barred through one path and open through
   another — a REST route blocked by a gateway and the identical call open through an MCP
   tunnel. Record each path you tried as its own `via`, with its own barrier.
5. **An error is a symptom, not a barrier.** *Access denied* can be a wrong reference, a
   stale version or an ambiguous name. Trace it before you record it as a bound.
6. **Say what you did not test.** A row you did not try is not absent; it is `derived` with a
   note, or it goes in `research_needed` with how it would be settled.
7. **Leave the deployment as you found it**, and list every artefact you made and removed.

### What to write

**`data/grant.json`** — `abp/profile/v1`. One row per capability you hold:

```json
{ "capability": "write.file.project", "barrier": "none", "evidence": "measured",
  "via": ["POST /api/v1/workflows"], "control": null,
  "note": "created, deactivated and deleted one test workflow named ABP-PROBE-<date>",
  "undo": "with-effort", "is_bounded": false, "material": "organisation" }
```

Plus: `id` (vendor/product/variant), `vendor`, `product`, `surface`, `profile_version` (today),
a `description` in one paragraph of what this deployment is, `reach_names` (what `host`,
`tenant` and `world` mean here), `not_reachable` (what you confirmed you cannot do, and how you
know), `tools` (the surfaces you used), `widest_reach`, and where they apply
`not_in_grammar`, `contradictions` (where the vendor's pages and the measurement disagree —
publish unresolved) and `research_needed` (what you could not settle, and how it would be).

**`data/mandate.json`** — `abp/mandate/v1`, status `starting-point`. Ask the person who gave
you the credential what they wanted you to do, in their words, and sort every one of the 23
primitives into `want`, `do_not_want` or `unstated`. If nobody can be asked, write the draft
from what you were told when you were set up, and mark `authored_by` as a draft to be argued
with. Most people authorised less than an agent assumes and never mentioned the rest.

**A record of the session** — what you probed, in what order, what you created and removed,
what failed and why, what you did not test. Dated. This is the evidence file the `measured`
tier requires.

### What happens next

The build script (`scripts/site/build-abp-vault.mjs <slug>` in the riskmandate.ai repository)
computes the delta — excess, refused, unstated, unbounded, shortfall, aligned — and writes
`GRANT.md`, `MANDATE.md`, `DELTA.md`, `LICENCE-TO-OPERATE.md` and the rest. It carries no
score. The person then corrects the mandate; the delta is recomputed; nothing in it is ever
edited by hand.

Report when you are done with: the row count, how many rows are `measured`, how many stand
at `none`, and the list of artefacts you created and removed.

---

## Why this file exists

The first measured behaviour policy this site received was produced exactly this way: an agent
holding an owner-scoped API key on a workflow-automation platform, asked to find the edges of
what it could do. It found full create-change-delete over automations, an outbound node with no
restriction on target host, every account on the instance visible, and credential metadata
readable through one door and not another — and it left one test workflow created and deleted,
nothing else. The rules above are the ones it followed, and the ones it wished it had.
