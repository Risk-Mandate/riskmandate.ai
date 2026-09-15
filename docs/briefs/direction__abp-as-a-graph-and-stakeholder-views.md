# The policy is a graph, and every stakeholder gets a projection of it

**Date:** 2026-09-15 · **Author:** @website-agent
**Trigger:** project lead's voice debrief of 15 September, *"ABP Graph and Stakeholder Views"* (Otter transcript, four minutes)
**Reads against:** the fifteen vaults in the library; abp.sgit.ai v0.3.0; the library page as built today

---

## 1. What the debrief says, in its own order

1. **Behaviours are standalone, addressable items.** Each has an id you can hyperlink and
   cross-reference: remote code execution, network access, changing data, acting
   independently — *"all those primitives that you can do"*. Controls are behaviours too, *"a
   control is still a behaviour … it is preventing the behaviour"*.
2. **They connect outward.** To a MITRE ATT&CK-style tree, to other standards, to GDPR and its
   neighbours — *"that's a great centre node"*.
3. **The graph is navigated in several directions.** *Which policies impact command execution?
   Which impact data deletion or corruption? Which agents allow automation, or a large number of
   actions at speed?* — the calendar with five thousand entries added or deleted, and what
   backups exist. Each behaviour carries metrics: *fast, small, a lot, medium*.
4. **The ABP is a semantic graph** — nodes and edges that *are* the policy; the documents are
   what is produced from it.
5. **Multiple audiences.** CEO, CFO, CTO; and investor, buyer, operator, engineer, project
   manager. Each is a filtered view of the same data, and the view is content that lives in the
   vault — which is why data management and reuse of building blocks matter as the vault count
   grows.
6. **Projections are reproducible.** The prose a stakeholder reads is generated from a prompt
   over the data, the graph and the evidence. Ship the prompt and the script with the vault, so
   the customer can regenerate it — *"a selling point … fifty quid is not an expensive way of
   learning how all this is done"*.

## 2. Where we already are

More of this exists than it looks, because the model site made the primitives into ids on day one:

- **The 23 capabilities are the behaviour nodes.** `execute.process.host` *is* "remote code
  execution as the account"; `delete.file.host` *is* "data deletion"; `send.endpoint.world` *is*
  "network access"; `create.schedule.tenant` *is* "acting independently". Every vault's grant is
  a set of edges from the policy to those nodes, each edge carrying a barrier, an evidence tier,
  an undo class, a `via` (the door), a `material` and a note.
- **"Which policies impact X" is already a query.** The library's search matches capability ids,
  so typing `delete.file.host` lists every policy that can delete. The list view sorts by what
  is unbounded. What is missing is the *facet* — a first-class "by behaviour" filter with the
  glosses — and the reverse page: one page per behaviour, listing the policies and the barriers.
- **Controls are recorded, not modelled.** The barrier column says *what stands in the way*
  per edge; it is a property of the edge, not a node. The n8n check showed the same behaviour
  barred through one door and open through another — so the barrier belongs on the *path*, which
  the graph model handles naturally and the flat table does not.
- **Scenarios are the first "views".** Six mandates per vault, each a projection of the same
  grant for a different purpose. Audiences are the next axis of the same idea.

## 3. The vault structure this asks for

Proposed additions, all derived except the two authored ones, all inside the vault so they travel with it:

```
data/
  behaviours/            one node per behaviour used by this vault — id, gloss, reach, undo,
                         metrics {speed, volume, blast}, links {mitre[], standards[], gdpr[]}
                         (the 23 from the vocabulary, pinned; extensions declared as such)
  edges.json             the grant as edges: policy → behaviour, with barrier, via (the door),
                         evidence, material, undo — one edge PER PATH, not per row
  scenarios.json         alternative mandates (exists)
  views/
    ceo.json · cfo.json · cto.json · investor.json · buyer.json · operator.json ·
    engineer.json · project-manager.json
                         what each audience sees: which behaviours, which counts, which
                         evidence, what is hidden and why — a filter over the graph, authored
prompts/
  <audience>.md          the prompt that turns the graph + evidence into that audience's prose
  build.sh               the script that ran it — model, version, date; reproducible
projections/
  <audience>.md          the generated prose, dated, with the prompt's hash in its footer
```

Two things are authored: the views (a person decides what an investor sees) and the prompts.
Everything else is derived, and the build refuses to write a projection whose prompt hash does
not match the prompt beside it — the same discipline the delta already has.

## 4. What to build next, in order

1. **The behaviour facet on the library** — a "by behaviour" filter listing the 23 with their
   glosses; one click answers *which policies can delete files*. Small, and it is the graph's
   first visible edge. (Done in v1.16.0 alongside this brief.)
2. **One page per behaviour** — `behaviour-<id>.html`: the gloss, the reach and undo class, the
   metrics, the outward links, and every policy that has the edge with its barrier and door.
   Generated from the catalogue like the vault pages are.
3. **`data/edges.json` per path** — the n8n lesson made structural: barrier per door.
4. **Metrics on behaviours** — speed, volume, blast radius as coarse ordinals (`fast/slow`,
   `one/some/many`), authored once in the vocabulary extension, asked of the model site.
5. **Outward links** — ATT&CK technique ids and GDPR articles per behaviour, in the vocabulary
   extension, cited.
6. **Views and projections** — the eight audiences as filters, the prompt and the script in the
   vault, the projection regenerated by the build and refused when stale.

## 5. Two asks for the model site, added to Lab 03

- A barrier per path rather than per row (the n8n check).
- Metrics and outward links as properties on the 23 primitives, or a sanctioned extension
  namespace so a policy can carry them without forking the grammar.
