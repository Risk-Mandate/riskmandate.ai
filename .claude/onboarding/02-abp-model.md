# The Agent Behaviour Policy, condensed

Everything an agent needs to work on this site without reading the five briefs and the model
site. Where this and `https://abp.sgit.ai/` (v0.3.0, pinned in every vault under
`data/vocabulary/`) disagree, the model site is right and this file is stale: fix it.

## What it is

An **Agent Behaviour Policy** (ABP) is a written description, for **one agent in one
deployment**, of everything it can do, what it was authorised to do, the gap between the two,
and what actually stands in the way. It **describes and does not judge**, so it carries no
score. The same ABP is dangerous in one deployment and harmless in another, and nothing about
the document changed; the deployment did. Every ABP carries the validity statement:
*This describes the deployment shape as at this date. If the risk changed, the deployment
changed, not this document.*

It is not a new product. It is the primitive the rest of RiskMandate was made of, now named,
published, and sellable (the store is `store.sgit.ai`; the entry tier is £10).

## Four objects, and the verb on each is the model

| Object | What it is | Verb | Who produces it |
|---|---|---|---|
| **the grant** | everything the agent can do, one row per capability | **measured** (or *documented* from the vendor's pages) | the deployment shape, the account, the credential; never typed |
| **the mandate** | what the agent is authorised and expected to do | **elicited** | the deployer, in their words; the only file a person writes; starts as a draft |
| **the delta** | excess (can, not asked) and shortfall (asked, cannot); the part of the excess nothing bounds | **derived** | the build; recomputed when either input moves; stored with both versions; never edited |
| **the barrier** | what stands between the agent and each capability | **recorded**, one per row (soon: one per path) | whoever measured the row |

Correction made on 14 Sept (v1.11.0): three of the four can be written down by people out of
what they understand today. Only the delta is never authored. The verbs say how each object is
meant to **end up** established, not day one. **A policy is a draft and that is the point**:
it goes to the people who built the agent, own what it touches and are accountable, and each
corrects the part they know. The correction is the elicitation.

## The vocabulary (abp.sgit.ai v0.3.0)

**23 capability primitives**, written `verb.object.reach`. Reach is one of `self`, `project`,
`host`, `tenant`, `world`. A specific path, host or mailbox is an *instance* of a primitive,
never a new one. The list, with reach and undo class:

```
read.file.project (project, yes)         write.file.project (project, with-effort)
read.file.host (host, no)                write.file.host (host, with-effort)
delete.file.host (host, no)              execute.process.host (host, with-effort)
execute.process.self (self, yes)         send.endpoint.allowed (tenant, no)
send.endpoint.world (world, no)          read.credential.host (host, no)
authenticate-as.credential.tenant (tenant, no)   grant.credential.self (self, yes)
send.message.world (world, no)           read.message.tenant (tenant, no)
write.repository.project (project, with-effort)  write.repository.tenant (tenant, with-effort)
authenticate-as.credential.signing (tenant, no)  create.record.world (world, no)
write.budget.tenant (tenant, no)         create.schedule.host (host, yes)
read.record.history (host, no)           create.schedule.tenant (tenant, yes)
read.record.browsing (host, no)
```

Glosses are in `site/vaults/*/data/vocabulary/capabilities.json`. What a consent screen permits
that none of the 23 names goes in the grant's `not_in_grammar` (trash a mail thread, read a
calendar, see every account), so the grant is never silently narrower than the consent.

**4 barriers**, weakest first, and **only the fourth is a control**:

| | Barrier | Meaning | Control? |
|---|---|---|---|
| ● | `none` | nothing in the way | no |
| ◉ | `expectation` | a rule in prose, enforced by nobody (`AGENTS.md`, a system prompt, this file) | no |
| ◐ | `setting` | a switch the agent's own account can flip (a confirmation prompt) | no |
| ○ | `boundary` | enforced above the grant, out of the agent's reach (a token scope, a branch rule, a sandbox, an egress proxy) | **yes** |

**The enforcer test:** *a control bounds a grant only if it is enforced by something the grant
does not include.* Consequences: the credential the agent holds is the grant, not a barrier; a
prohibition rendered without its barrier is a claim we cannot support; for most deployments
today the honest answer is the second row.

**Undo classes** (a property of the action, never a severity; irreversible first on every
rendering): `no`, `with-effort`, `yes`.

**Evidence tiers**, weakest first: `derived`, `inferred`, `self-reported`, `documented`,
`measured`, `observed`. Only the last two count as measured. *Documented* = the vendor's page
says so, quoted with URL and date. *Measured* = a probe on an instance we are entitled to run,
dated, with an evidence file.

**Material** (ours, asked of the model site as Lab 03 request 1): `own`, `organisation`,
`third_party`, `mixed`. A mailbox is mixed. Almost every connector row is mixed.

**Delta semantics** (`abp.delta/v1`): excess = grant minus wants, in grant order; refused = the
excess the mandate names under `do_not_want`; unstated = the rest of the excess; unbounded
excess = excess whose barrier is not `boundary`; shortfall = wanted and not granted; aligned =
granted and wanted. The build refuses to write a delta it cannot reproduce from the inputs.

## The four counts, and the one number anybody can move

A card shows **grant · mandate · excess · unbounded excess** (and shortfall). None is a score.
*Unbounded excess* is the only number a control can move: every real control shifts one row into
the fourth barrier and it falls. The gap between excess and unbounded excess is **the business
case for a control, with no verdict in it**: *this provision requires X; the grant does not
bound X; a control of type Y at layer Z would bound X.* That is the partner motion.

## Where the ABP sits: the label, the record, the prescription

| | Thing | Does | Scored? | Signed? |
|---|---|---|---|---|
| Label | the ABP | describes capability, context-free | **never** | no |
| Patient record | the twin, hooked to the real environment | supplies assets, tools, data, what is connected | no | no |
| Prescription | the Insurability Index + risk acceptance | combines the two, dated, expiring | **yes** | a named person |

riskmandate.ai is the prescription layer commercially and sells the label today. **We are on
rung one** and the homepage says so. The Index's six levels and five dimensions are a published
design, not a running calculation. *Licence to Operate*: the organisation is the authority, the
ABP is the instrument, the agent is the licensee; *mandate to operate* is retired.

## Naming rules

- **ABP**, spelled out *Agent Behaviour Policy* at first use on every surface. Never **ADP**
  (a registered mark of a payroll processor).
- **The ABP** or **the behaviour policy**. Never *the policy* alone: on this site *policy* is
  also the insurance instrument in the Licence to Operate demo.
- *Behaviour*, British, decided by the site's voice; the mark question is the lead's.

## The vault: what a policy is delivered as

A policy is a vault, not a document, because the operator, leadership and security each need a
different altitude of one record. Fifteen template vaults are on the site (`site/vaults/<slug>/`)
and pushed to sgit with public read keys; the library page reads them live.

```
vault.json                 who, which shape, status: template | draft | corrected
data/grant.json            abp/profile/v1 — the grant; rows under "grant"; plus reach_names, not_reachable,
                           tools, widest_reach, not_in_grammar, contradictions, research_needed, sources
data/mandate.json          abp/mandate/v1 — want / do_not_want / unstated; status starting-point   ← the authored file
data/scenarios.json        six alternative mandates for the same grant (3 normal, 3 advanced)     ← authored
data/vocabulary/           the 23, the 4, the 3, the tiers, pinned at v0.3.0 with provenance
data/delta.json  data/validity.json  data/app.json           derived
AGENT-BEHAVIOUR-POLICY.md  MANDATE.md  GRANT.md  DELTA.md  LICENCE-TO-OPERATE.md  README.md    derived
RESEARCH-NEEDED.md         derived from research_needed — the file to hand to a research agent
AGENTS.md  SKILL.md  MAP-A-GRANT.md   generic; travel unchanged; each says in its own words that it is a rule in prose
history/index.json         one entry per recompute whose counts moved (append-only)
dist/                      the zip (deterministic, CI-checked) and the PDF
index.html                 the LOADER (identical in every vault); app.link.json + .vault/owner/ro-links.json point at the app vault
```

The renderer lives once in the app vault `fl3i7lu4` (`site/vaults/_app/`, currently v4); an
application vault is data. `MAP-A-GRANT.md` is the prompt that lets an agent holding a credential
measure its own grant; its seven rules of measurement are the rules for producing any measured row.

A grant row:

```json
{ "capability": "write.file.project", "barrier": "none", "evidence": "measured",
  "via": ["REST API: workflows"], "control": null,
  "note": "what was done, or the vendor's sentence with URL and date",
  "undo": "with-effort", "is_bounded": false, "material": "organisation" }
```

## Where it is going: the graph

The debrief of 15 Sept (`docs/briefs/direction__abp-as-a-graph-and-stakeholder-views.md`):
behaviours are standalone, addressable nodes with outward links (ATT&CK, standards, GDPR) and
coarse metrics (speed, volume, blast); controls are behaviours too; the grant is a set of edges
policy → behaviour, **one edge per path** carrying barrier, via, evidence, material, undo; the
ABP is the semantic graph and the documents are produced from it; each audience (CEO, CFO, CTO,
investor, buyer, operator, engineer, project manager) is a filtered **view**, authored, and its
prose a **projection** regenerated from a prompt and a script that ship in the vault. The 23
primitives already are the nodes; the library's *by behaviour* facet (v1.16.0) is the first
visible edge. The build order is in `03-state-and-next.md`.

## What is honest to say

| Say | Do not say |
|---|---|
| the ABP describes; it does not judge | anything that scores an ABP |
| the delta is derived, stored with its inputs, recomputed | "computed and never stored" |
| this provision requires X; the grant does not bound X; a control of type Y at layer Z would bound X | "then you are in compliance" |
| most barriers today are the second kind, a rule enforced by nobody | a prohibition without its barrier |
| the behaviour policy is on the intake form of the one agent-specific underwriter | that anyone is insured, certified, or endorsed |
| a documented row could be wrong the way documentation is wrong | that a documented row was tested |
