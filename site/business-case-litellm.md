<!-- Generated from business-case-litellm.html by scripts/site/generate.mjs. Edit the page, not this file. -->

# RiskMandate — the business case for LiteLLM

LiteLLM (BerriAI (company-maintained)), by the risk it changes: the register for a stated agent deployment without it and with it, computed from a public model, from the operator to the board.

Source: https://riskmandate.ai/business-case-litellm.html

---

# LiteLLM, by the risk it changes

An open-source gateway in front of model providers and MCP servers. Its documentation describes access control on MCP tools: when a client lists or calls tools, the gateway enforces the permissions configured for it. Written as an answer, an agent granted read tools only can read and not change.

**Open source:** MIT, except the enterprise directory · BerriAI (company-maintained) · [get involved](https://docs.litellm.ai/)

**The deployment:** The model's typical deployment, with the answers this project addresses stated as they are without it: can read and change the data in its reach.

**The model:** the RiskGraph Explorer's 49 facts, 49 risks and 10 roles, copied into this site with its provenance; the register below is computed, not written. [How](business-cases.html#method).

## In its own words, and nothing more.

- Access control on listing and calling MCP tools. “When a client attempts to list or call tools, LiteLLM enforces access controls based on configured permissions.” · [docs.litellm.ai](https://docs.litellm.ai/docs/mcp_control), read 24 September 2026

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

## Switch its changes on, and watch the register move.

The same picture as [the risk propagation visualiser](article-risk-propagation-visualiser.html), drawn for this case. The model’s ten roles up to the board; every risk that holds for the deployment above, placed with the roles the model assigns it to; and, at the bottom, each answer the product changes, as a switch. The page carries the model and the engine, so a switch recomputes the register here exactly as it was computed for the tables above. Red is a risk that holds; faded is one the product retired; amber is one it brought. Click a role, a risk, a change or the product to see only what it touches. Nothing is scored.

## Every product is also a new thing in the estate.

It sits in the request path and holds the provider keys. On rate limits, its page states that servers without an entry are uncapped.

## What adopting it takes, before any of this is true.

An open-source project costs nothing to download and something to adopt. Every change above depends on the work below, and most of it is customisation to your own deployment.

- Give every agent its own key with an explicit tool grant.
- Remove the agent's direct credentials for the MCP servers.

## Published unresolved, for BerriAI (company-maintained) to settle.

Each pair was read on the same day. We have not tested which is true, because that would mean testing somebody else’s system.

- **restriction by default.** The page says access control ensures that only authorised entities can discover and use MCP tools, and also that an empty grant list means no restriction. [mcp_control](https://docs.litellm.ai/docs/mcp_control)

## The limits of the case, stated by the case.

- That it was tested. Nothing was installed or run; every change rests on the documentation quoted beside it.
- That the register is complete. It is one model, for one stated deployment. A different deployment changes the answers, and so the case.

**Next.** Published, and sent to the project's maintainers at the same time. If a change is wrong, or another answer should move, the case changes with the date they said so.

## Make the case in the register’s own terms.

If you build a security product for agents, the case for it can be written the same way: what it does in your own words, the answers it changes, and the register before and after. If a case here is wrong about you, tell us and it changes with a date.
