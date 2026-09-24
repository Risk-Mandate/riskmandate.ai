<!-- Generated from business-case-open-policy-agent.html by scripts/site/generate.mjs. Edit the page, not this file. -->

# RiskMandate — the business case for Open Policy Agent

Open Policy Agent (CNCF (graduated)), by the risk it changes: the register for a stated agent deployment without it and with it, computed from a public model, from the operator to the board.

Source: https://riskmandate.ai/business-case-open-policy-agent.html

---

# Open Policy Agent, by the risk it changes

A general-purpose policy engine: an application or a proxy asks it whether a request is allowed and enforces the answer. Its documentation is explicit that it decides and does not enforce, so the case holds only where something the agent cannot bypass, such as an Envoy proxy, asks it and obeys. Written as answers, that is read-only access where the policy says so, and a log of every decision.

**Open source:** Apache-2.0 · CNCF (graduated) · [get involved](https://www.openpolicyagent.org/community)

**The deployment:** The model's typical deployment, with the answers this project addresses stated as they are without it: can read and change the data in its reach; what it did cannot be reconstructed.

**The model:** the RiskGraph Explorer's 49 facts, 49 risks and 10 roles, copied into this site with its provenance; the register below is computed, not written. [How](business-cases.html#method).

## In its own words, and nothing more.

- Allow and deny decisions, enforced by a proxy such as Envoy. “Guests have read-only access to the /people endpoint, admins can create users too as long as the name is not the same as the admin's name.” · [www.openpolicyagent.org](https://www.openpolicyagent.org/docs/envoy/tutorial-standalone-envoy), read 24 September 2026
- Decision logs, one event per decision. “Each event includes the policy that was queried, the input to the query, bundle metadata, and other information that enables auditing and offline debugging of policy decisions.” · [www.openpolicyagent.org](https://www.openpolicyagent.org/docs/management-decision-logs), read 24 September 2026

## Same deployment, different answers.

The model asks sixteen questions about an agent deployment. A product’s effect is written as the answers it changes, and each change says what kind of change it is: a statement of what is true, an expectation the agent is asked to meet, a setting, or a boundary enforced by something the agent’s grant does not include.

## 5 retired, 1 new, 22 unchanged.

Computed from the model for the deployment above: every risk that holds without it, and every risk that holds with it. A new entry is either one the change brought to light, where an answer replaced a don’t know, or a narrower risk in place of a wider one, where the answer moved from no to partly. Either way the register is more exact, and a register that grows because something was found is working.

Retired

New

## Who carries less, and who carries the same.

Each risk is assigned to the roles it belongs to, and each role reports to another until the board. The count beside each role is the entries it holds without the product and with it.

### Operators

### Owners

### Executives

### The board

At the board: the corporate register

Corporate risks have no facts of their own. They hold while any risk that leads into them holds, so a single product rarely retires one. What it changes is how many reasons the board is being given.

## Every product is also a new thing in the estate.

It adds a decision point in the request path, and its decision logs store the request input. Whether it fails open is the enforcement point's choice: Envoy's external authorisation filter has a setting that accepts the request when the authorisation service fails, which defaults to false, and OPA's Envoy plugin has a dry-run mode that allows every request.

## What adopting it takes, before any of this is true.

An open-source project costs nothing to download and something to adopt. Every change above depends on the work below, and most of it is customisation to your own deployment.

- Put the enforcement point where the agent cannot route around it, and keep the policy bundle out of the agent's grant.
- Write the policy in Rego for your own resources, which is the customisation the whole case depends on.
- Decide where decision logs go and how long they are kept.

## Published unresolved, for CNCF (graduated) to settle.

Each pair was read on the same day. We have not tested which is true, because that would mean testing somebody else’s system.

- **enforcement.** The same documentation describes an engine that unifies policy enforcement across the stack, and says OPA decouples policy decision-making from policy enforcement. [docs](https://www.openpolicyagent.org/docs)

## The limits of the case, stated by the case.

- That OPA enforces anything by itself. Its own documentation says it decides.
- That it was tested. Nothing was installed or run; every change rests on the documentation quoted beside it.
- That the register is complete. It is one model, for one stated deployment. A different deployment changes the answers, and so the case.

**Next.** Published, and sent to the project's maintainers at the same time. If a change is wrong, or another answer should move, the case changes with the date they said so.

## Make the case in the register’s own terms.

If you build a security product for agents, the case for it can be written the same way: what it does in your own words, the answers it changes, and the register before and after. If a case here is wrong about you, tell us and it changes with a date.
