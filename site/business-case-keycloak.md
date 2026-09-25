<!-- Generated from business-case-keycloak.html by scripts/site/generate.mjs. Edit the page, not this file. -->

# RiskMandate — the business case for Keycloak

Keycloak (CNCF (incubating)), by the risk it changes: the register for a stated agent deployment without it and with it, computed from a public model, from the operator to the board.

Source: https://riskmandate.ai/business-case-keycloak.html

---

# Keycloak, by the risk it changes

An identity and access management server. Its standard token exchange lets a client exchange a token issued for one client for a token aimed at another, carrying the identity of the party on whose behalf the request is made. Written as an answer, an agent acting on a token that starts from a named person's login acts as that person, not as an ownerless service account.

**Open source:** Apache-2.0 · CNCF (incubating) · [get involved](https://www.keycloak.org/community)

**The deployment:** The model's typical deployment, with the answers this project addresses stated as they are without it: it acts under a service account nobody owns.

**The model:** the RiskGraph Explorer's 49 facts, 49 risks and 10 roles, copied into this site with its provenance; the register below is computed, not written. [How](business-cases.html#method).

## In its own words, and nothing more.

- Standard token exchange within a realm. “A client can exchange an existing Keycloak token created for a specific client for a new token targeted to a different client in the same realm.” · [www.keycloak.org](https://www.keycloak.org/securing-apps/token-exchange), read 24 September 2026

## Same deployment, different answers.

The model asks sixteen questions about an agent deployment. A product’s effect is written as the answers it changes, and each change says what kind of change it is: a statement of what is true, an expectation the agent is asked to meet, a setting, or a boundary enforced by something the agent’s grant does not include.

## 1 retired, 22 unchanged.

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

## Switch its changes on, and watch the register move.

The same picture as [the risk propagation visualiser](article-risk-propagation-visualiser.html), drawn for this case. The model’s ten roles up to the board; every risk that holds for the deployment above, placed with the roles the model assigns it to; and, at the bottom, each answer the product changes, as a switch. The page carries the model and the engine, so a switch recomputes the register here exactly as it was computed for the tables above. Red is a risk that holds; faded is one the product retired; amber is one it brought. Click a role, a risk, a change or the product to see only what it touches. Nothing is scored.

## Every product is also a new thing in the estate.

It sits in the authentication path and holds the realm's users and sessions. Its page also says the exchanged tokens in a chain should be revoked, which is a job somebody has to own.

## What adopting it takes, before any of this is true.

An open-source project costs nothing to download and something to adopt. Every change above depends on the work below, and most of it is customisation to your own deployment.

- Set up the realm, the clients and the exchange permissions.
- Decide which person each agent acts for, and how that is recorded.
- Keep delegation off until it is no longer marked experimental, as the page advises.

## Published unresolved, for CNCF (incubating) to settle.

Each pair was read on the same day. We have not tested which is true, because that would mean testing somebody else’s system.

- **impersonation and delegation.** The capability list includes impersonating a user, while the same page says standard exchange supports only the first use case, calls delegation experimental and not for production, and describes the legacy exchange as a very loose implementation of the specification. [token-exchange](https://www.keycloak.org/securing-apps/token-exchange)

## The limits of the case, stated by the case.

- That it was tested. Nothing was installed or run; every change rests on the documentation quoted beside it.
- That the register is complete. It is one model, for one stated deployment. A different deployment changes the answers, and so the case.

**Next.** Published, and sent to the project's maintainers at the same time. If a change is wrong, or another answer should move, the case changes with the date they said so.

## Make the case in the register’s own terms.

If you build a security product for agents, the case for it can be written the same way: what it does in your own words, the answers it changes, and the register before and after. If a case here is wrong about you, tell us and it changes with a date.
