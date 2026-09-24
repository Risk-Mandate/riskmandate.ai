<!-- Generated from business-case-cedar.html by scripts/site/generate.mjs. Edit the page, not this file. -->

# RiskMandate — the business case for Cedar

Cedar (CNCF (sandbox)), by the risk it changes: the register for a stated agent deployment without it and with it, computed from a public model, from the operator to the board.

Source: https://riskmandate.ai/business-case-cedar.html

---

# Cedar, by the risk it changes

A policy language and engine whose decisions default to deny: if no policy permits a request, the answer is no. Written as an answer, that is read-only access where only reading is permitted and the application holding the data enforces the decision.

**Open source:** Apache-2.0 · CNCF (sandbox) · [get involved](https://github.com/cedar-policy/cedar)

**The deployment:** The model's typical deployment, with the answers this project addresses stated as they are without it: can read and change the data in its reach.

**The model:** the RiskGraph Explorer's 49 facts, 49 risks and 10 roles, copied into this site with its provenance; the register below is computed, not written. [How](business-cases.html#method).

## In its own words, and nothing more.

- Authorisation decisions that deny when nothing permits. “Otherwise (i.e., no policy is satisfied), the final result is Deny.” · [docs.cedarpolicy.com](https://docs.cedarpolicy.com/auth/authorization.html), read 24 September 2026

## Same deployment, different answers.

The model asks sixteen questions about an agent deployment. A product’s effect is written as the answers it changes, and each change says what kind of change it is: a statement of what is true, an expectation the agent is asked to meet, a setting, or a boundary enforced by something the agent’s grant does not include.

## 2 retired, 23 unchanged.

Computed from the model for the deployment above: every risk that holds without it, and every risk that holds with it.

Retired

## Who carries less, and who carries the same.

Each risk is assigned to the roles it belongs to, and each role reports to another until the board. The count beside each role is the entries it holds without the product and with it.

### Operators

### Owners

### Executives

### The board

At the board: the corporate register

Corporate risks have no facts of their own. They hold while any risk that leads into them holds, so a single product rarely retires one. What it changes is how many reasons the board is being given.

## Every product is also a new thing in the estate.

Its documentation states that a policy whose evaluation errors is skipped: _if a policy's evaluation returns error, the policy does not factor into the authorization response_. A forbid policy that errors therefore does not deny.

## What adopting it takes, before any of this is true.

An open-source project costs nothing to download and something to adopt. Every change above depends on the work below, and most of it is customisation to your own deployment.

- Write the policies for your own resources and actions.
- Test the forbid policies for errors, because an erroring forbid is skipped.
- Enforce in the application that holds the data.

## The limits of the case, stated by the case.

- That it was tested. Nothing was installed or run; every change rests on the documentation quoted beside it.
- That the register is complete. It is one model, for one stated deployment. A different deployment changes the answers, and so the case.

**Next.** Published, and sent to the project's maintainers at the same time. If a change is wrong, or another answer should move, the case changes with the date they said so.

## Make the case in the register’s own terms.

If you build a security product for agents, the case for it can be written the same way: what it does in your own words, the answers it changes, and the register before and after. If a case here is wrong about you, tell us and it changes with a date.
