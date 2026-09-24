<!-- Generated from business-case-agentgateway.html by scripts/site/generate.mjs. Edit the page, not this file. -->

# RiskMandate — the business case for agentgateway

agentgateway (Linux Foundation (Agentic AI Foundation)), by the risk it changes: the register for a stated agent deployment without it and with it, computed from a public model, from the operator to the board.

Source: https://riskmandate.ai/business-case-agentgateway.html

---

# agentgateway, by the risk it changes

An open-source proxy for agent traffic, run by the deployer. Its documentation describes three things an agent deployment would feel: outbound destinations allowed only by route, MCP tools filtered by policy so an agent never sees the ones it is not allowed, and access logs kept in a database. Its documentation also says where it fails closed and where it fails open, which is part of the case.

**Open source:** Apache-2.0 · Linux Foundation (Agentic AI Foundation) · [get involved](https://discord.gg/y9efgEmppm)

**The deployment:** The model's typical deployment, with the answers this project addresses stated as they are without it: can reach the general internet; can read and change the data in its reach; what it did cannot be reconstructed.

**The model:** the RiskGraph Explorer's 49 facts, 49 risks and 10 roles, copied into this site with its provenance; the register below is computed, not written. [How](business-cases.html#method).

## In its own words, and nothing more.

- An egress proxy that decides where outbound traffic may go. “The destinations that clients are allowed to reach. A destination that matches no entry has no route.” · [agentgateway.dev](https://agentgateway.dev/docs/standalone/latest/documentation/configuration/egress-proxy/), read 24 September 2026
- Authorisation on MCP tool calls, with disallowed tools removed from what the agent is shown. “If a tool or other resource is not allowed, the gateway automatically filters it from the list response, so unauthorized clients never see it.” · [agentgateway.dev](https://agentgateway.dev/docs/standalone/latest/documentation/configuration/security/mcp-authz/), read 24 September 2026
- Access logs, to stdout by default and to a database when configured. “If neither config.logging.database nor config.database is set, no database log store is initialized and access logs are written to stdout only.” · [agentgateway.dev](https://agentgateway.dev/docs/standalone/latest/documentation/observability/access-logs/database/), read 24 September 2026

## Same deployment, different answers.

The model asks sixteen questions about an agent deployment. A product’s effect is written as the answers it changes, and each change says what kind of change it is: a statement of what is true, an expectation the agent is asked to meet, a setting, or a boundary enforced by something the agent’s grant does not include.

## 7 retired, 1 new, 22 unchanged.

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

By design it is a proxy in the request path. For guardrails its pages state _failClosed (default): Deny the request… failOpen: Allow the request._ For HTTP authorisation rules they state both: a require expression that errors denies, and a deny expression that errors does not deny. No page read says what happens to agent traffic when the gateway itself is down.

## What adopting it takes, before any of this is true.

An open-source project costs nothing to download and something to adopt. Every change above depends on the work below, and most of it is customisation to your own deployment.

- Route the agent's model, tool and outbound traffic through it, and block the routes around it.
- Write the MCP authorisation rules for the tools you actually expose.
- Configure the log database, and decide who reads it.

## Published unresolved, for Linux Foundation (Agentic AI Foundation) to settle.

Each pair was read on the same day. We have not tested which is true, because that would mean testing somebody else’s system.

- **binds or gateways.** The configuration overview says binds is the deprecated predecessor to gateways; the egress-proxy page's examples are written with binds. [overview](https://agentgateway.dev/docs/standalone/latest/documentation/configuration/overview/) · [egress-proxy](https://agentgateway.dev/docs/standalone/latest/documentation/configuration/egress-proxy/)

## The limits of the case, stated by the case.

- That it can stop an agent. No page presents a feature as a way to stop one, so the stopping questions are left as they were.
- Anything about Solo.io's commercial products, which are not this case.
- That it was tested. Nothing was installed or run; every change rests on the documentation quoted beside it.
- That the register is complete. It is one model, for one stated deployment. A different deployment changes the answers, and so the case.

**Next.** Published, and sent to the project's maintainers at the same time. If a change is wrong, or another answer should move, the case changes with the date they said so.

## Make the case in the register’s own terms.

If you build a security product for agents, the case for it can be written the same way: what it does in your own words, the answers it changes, and the register before and after. If a case here is wrong about you, tell us and it changes with a date.
