# The first measured behaviour policy: an owner API key on a self-hosted n8n, read against the model

**Date:** 2026-09-15 · **Author:** @website-agent
**Trigger:** project lead's note of 15 September — *"look at this ABP (previous version) review of n8n … done by one of our early beta users that gave our policy to one of its agents that was connected to n8n"*
**Reads against:** the five-page write-up dated 13 September 2026 (held by RiskMandate, not published); abp.sgit.ai v0.3.0; the fourteen vaults on the site

---

## 1. What it is

An agent holding an owner-scoped API key on a self-hosted workflow-automation platform was given
the earlier, prose version of the policy and asked to find the edges of what the key could do. It
did it the right way: built and ran one real AI-agent workflow against a real model credential,
created and deleted one obviously named test workflow to measure create-change-delete and
activation, probed the rest, moved no secret, and wrote down what it did not test. Five pages,
dated, with a mandate elicited from the deployer in the deployer's words.

**It is the first grant this site holds that was measured on a live instance rather than read
from a page.** Every connector vault published today stands at *documented*; this one stands at
*measured* on seven of eight rows. It is now the vault `n8n-owner-api-key`, translated row for
row into the v0.3.0 vocabulary, published as the template for that shape rather than as that
deployment, and without the write-up itself or its author's name — both are the project lead's
to publish, not this site's.

## 2. What it found, in the model's terms

| Found | Row | Barrier |
|---|---|---|
| full create-change-delete over workflows | `write.file.project` | none |
| activate a workflow; refused only when it has no trigger (a check on shape, not on risk) | `create.schedule.tenant` | none |
| an outbound node accepted with no restriction on target host; execution against a non-public target not tested | `send.endpoint.world` | none |
| credential metadata readable through the MCP interface, blocked on the REST path — by the *measuring* environment's gateway, not the platform | `read.credential.host` | none |
| owner level, on the account's project; the key held for the session only | `authenticate-as.credential.tenant` | none |
| a real model call through the workflow, against the deployer's credential | `write.budget.tenant` | none |
| execution records | `read.record.history` | none |
| a Code node would run on the platform's server — not tested | `execute.process.host` | none, *derived* |
| every account on the instance visible; instance health | *not in the grammar* | — |

Mandate: a sandbox, one AI-agent workflow, nothing else. Delta: four excess rows, all four
unbounded. The write-up's own summary — *"almost the whole grant is currently unused, authorised
capability"* — survives translation exactly.

## 3. Where the write-up and the model disagree, and who is right

**The API key as a barrier.** The write-up classes the key as a *setting* barrier: *"the API key
itself is the technical gate: broad, but a real gate, not a prose rule."* The vocabulary's
enforcer test says a control bounds a grant only if it is enforced by something the grant does
not include. The key *is* the grant. So in the vault every row the key permits stands at *none*,
and the disagreement is recorded in the vault's contradictions table, unresolved, because the
write-up is making a real point: a gate that is broad but real is different from a rule in prose,
and the four barriers do not have a word for that difference. That is feedback for the model
site, not something to paper over.

**Barrier class is not a property of a capability.** The write-up's sharpest finding: *"the same
operation (read credential metadata) was setting-barred through one access path and unbarred
through another, on the same account, in the same session."* The vault records it as one row with
two `via` entries and two outcomes, and `MAP-A-GRANT.md` now carries it as rule 4: *note the
door*. The model's grammar assumes one barrier per row. It should probably be one per path.

**"Access denied" is a symptom.** Several exchanges chased a permissions hypothesis for what was
an ambiguous-name bug — two credentials of the same type, the platform resolving the name to the
wrong one silently. Rule 5 in the prompt.

**The measuring tool has its own grant.** The credential path was blocked by the investigator's
own egress gateway, not the platform, and the write-up said so rather than recording a barrier
that was not there. Most measured policies will be run through a tool with limits of its own; the
evidence file has to say which side each limit is on.

## 4. What it gives us

- **A shape the summit audience recognises immediately** — an automation platform with an owner
  key is the deployment most companies actually have — with a measured grant, which none of the
  documented ones can claim.
- **The prompt.** `MAP-A-GRANT.md` now travels in every vault: give it to an agent that holds a
  credential and it measures its own grant, drafts the mandate from the deployer's words, and
  leaves the deployment as it found it. The rules in it are the ones this write-up followed and
  the ones it wished it had.
- **Two asks for the model site**, to add to Lab 03: a barrier per path rather than per row, and a
  word for a gate that is real but broad.

## 5. What it does not settle

Three open questions carried in the vault's `RESEARCH-NEEDED.md`: what the platform's own server
can reach on the network (an outbound node was accepted, none executed against a non-public
target); whether a Code node runs arbitrary code on the server and as whom; and whether the owner
key can create, change, delete or export credentials — the write-up stopped at metadata on
purpose. And one decision that is the deployer's: whether the gateway rule that blocks paths
naming *credentials* should be extended to MCP-tunnelled requests, now that the bypass is
confirmed.
