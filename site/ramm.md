<!-- Generated from ramm.html by scripts/site/generate.mjs. Edit the page, not this file. -->

# RiskMandate — RAMM, the Risk Acceptance Maturity Model

RAMM is a graph-native maturity model for risk acceptance. It models acceptance as a durable decision node linked to evidence, ownership, authority, appetite, and review — so maturity is computed from the graph, not asserted in a questionnaire. Five levels, each a testable path-pattern.

Source: https://riskmandate.ai/ramm.html

---

# Maturity you compute, not claim.

RAMM treats risk acceptance not as a free-text exception but as a durable decision node — linked to the risk, the scoring, the owner, the approving authority, the appetite and tolerance, the compensating controls, the evidence, and the review, expiry, and reassessment lifecycle. Because it's a graph, an organisation's maturity can be derived from evidence rather than asserted in a questionnaire.

## The whole model, on one canvas.

## Acceptance is grounded inward by evidence, outward by governance and appetite.

The acceptance decision is the hub. Its edges are directed: every acceptance has an inward path that grounds it in evidence, and an outward path that ties it to authority and appetite. These are the same directed patterns the corpus already uses, applied to acceptance.

## Each level is a Node Type Formula — a path-pattern a query can test.

A level is not a narrative claim; it's a required pattern of typed, directed paths over the acceptance graph. An organisation is at a level when its acceptance nodes satisfy that level's pattern, and not before. Try it: toggle the edges on the sample acceptance node and watch the level recompute.

Level 3 is not a claim that acceptance is "defined." It is the query: do all acceptance nodes have the five required edges, returning true? Change the graph and the level changes with it — computed, not asserted.

## Five layers, each mapping to something the corpus already has.

Provenance spans all of them — carried as PKI attribution and a commit log recording which standard, tool, or assessment produced each linked artifact.

- **RiskItem** — the risk node, scoped by the union of possible authorization
- **RiskAssessment** — scoring, plus confidence band and margin of error
- **RiskTreatmentDecision** — mitigate, transfer, avoid, or accept (OWASP TAME)
- **RiskAcceptanceDecision** — no-deny, accept-in-a-direction, for-an-interval
- **RiskOwner · DecisionAuthority** — the technical/business split and the underwriting chain
- **RiskAppetiteStatement · RiskToleranceThreshold** — the revealed appetite band and Goldilocks zone
- **CompensatingControl** — the controls that justify residual exposure
- **ReviewEvent · ExpiryEvent · ReassessmentTrigger** — the interval mechanic and air-gap reassessment
- **EvidenceArtifact** — the grounding ladder: evidence, measure, twin, reality
- **FrameworkReference** — the bridge nodes of the ontologies-of-ontologies model
- PKI attribution and a commit log on every linked artifact — which standard, tool, or assessment produced it

## Maturity computed, not asserted.

A questionnaire asks an organisation to rate itself. A graph lets the rating be derived from evidence — which is the whole differentiator.

## An overlay on the base model — because agents bring new risk and new capability.

The agentic variation extends, rather than forks, the base. It adds four entities and tightens each level's criteria for agent acceptances.

## Bridges, not merges.

RAMM overlays existing standards and links to them at declared points — each framework kept as its own owned ontology. This first pass fixes the bridging approach; the per-control crosswalk is the next, super-detailed pass.

Do this in RAMM **→** satisfy a requirement in framework X.

## Each query is both an assurance check and a maturity probe.

### Using RiskMandate raises your RAMM level.

RiskMandate is the graph-native acceptance workflow, so it produces exactly the owned, evidenced, interval-bound, appetite-linked, board-propagated acceptance nodes that the higher levels require. Adopting the product isn't a claim of maturity — it's a mechanism for it. RAMM is the standard the improvement is measured against.

## A first draft, to be refined into normative statements.

## Turn acceptance from an exception into a graph decision.

RAMM turns risk acceptance from a free-text exception into a computable, governed, evidence-backed graph decision — and RiskMandate is how you get there.
