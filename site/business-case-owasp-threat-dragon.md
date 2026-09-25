<!-- Generated from business-case-owasp-threat-dragon.html by scripts/site/generate.mjs. Edit the page, not this file. -->

# RiskMandate — the business case for OWASP Threat Dragon and pytm

OWASP Threat Dragon and pytm (OWASP), by the risk it changes: the register for a stated agent deployment without it and with it, computed from a public model, from the operator to the board.

Source: https://riskmandate.ai/business-case-owasp-threat-dragon.html

---

# OWASP Threat Dragon and pytm, by the risk it changes

Two OWASP threat-modelling tools: Threat Dragon draws data-flow diagrams with their threats and remediations, and pytm generates them from a description of the system written as code. Like a behaviour policy, a threat model changes nothing about what the agent can reach. It can replace _nobody knows_ with an answer, as far as the people drawing it know the system.

**Open source:** Apache-2.0 (Threat Dragon); MIT (pytm) · OWASP · [get involved](https://owasp.org/www-project-threat-dragon/)

**The deployment:** The model's typical deployment, with the answers this project addresses stated as they are without it: nobody knows what it could reach at full speed.

**The model:** the RiskGraph Explorer's 49 facts, 49 risks and 10 roles, copied into this site with its provenance; the register below is computed, not written. [How](business-cases.html#method).

## In its own words, and nothing more.

- Threat models as data-flow diagrams, with threats and remediations. “Threat Dragon provides an environment to create threat models as data-flow diagrams, along with associated threats and remediations.” · [www.threatdragon.com](https://www.threatdragon.com/docs/), read 24 September 2026

## Same deployment, different answers.

The model asks sixteen questions about an agent deployment. A product’s effect is written as the answers it changes, and each change says what kind of change it is: a statement of what is true, an expectation the agent is asked to meet, a setting, or a boundary enforced by something the agent’s grant does not include.

## 2 retired, 1 new, 22 unchanged.

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

## Switch its changes on, and watch the register move.

The same picture as [the risk propagation visualiser](article-risk-propagation-visualiser.html), drawn for this case. The model’s ten roles up to the board; every risk that holds for the deployment above, placed with the roles the model assigns it to; and, at the bottom, each answer the product changes, as a switch. The page carries the model and the engine, so a switch recomputes the register here exactly as it was computed for the tables above. Red is a risk that holds; faded is one the product retired; amber is one it brought. Click a role, a risk, a change or the product to see only what it touches. Nothing is scored.

## Every product is also a new thing in the estate.

Threat Dragon stores models in a repository or a drive the deployer chooses, so it needs a credential for that store. A threat model is a document: it goes out of date the day the deployment changes unless somebody keeps it.

## What adopting it takes, before any of this is true.

An open-source project costs nothing to download and something to adopt. Every change above depends on the work below, and most of it is customisation to your own deployment.

- Draw one agent in one deployment, not the architecture in general: the tools, the credentials and what each reaches.
- Keep the model beside the deployment and change it when the deployment changes.
- Customise the threat library for agents: the OWASP Top 10 for Agentic Applications is the obvious place to start.

## The limits of the case, stated by the case.

- That a diagram retires a risk by itself. It names reach; it bounds nothing.
- That it was tested. Nothing was installed or run; every change rests on the documentation quoted beside it.
- That the register is complete. It is one model, for one stated deployment. A different deployment changes the answers, and so the case.

**Next.** Published, and sent to the project's maintainers at the same time. If a change is wrong, or another answer should move, the case changes with the date they said so.

## Make the case in the register’s own terms.

If you build a security product for agents, the case for it can be written the same way: what it does in your own words, the answers it changes, and the register before and after. If a case here is wrong about you, tell us and it changes with a date.
