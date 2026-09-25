<!-- Generated from business-case-cloudgeni.html by scripts/site/generate.mjs. Edit the page, not this file. -->

# RiskMandate — the business case for Cloudgeni, on Opengeni

Cloudgeni, on Opengeni (Cloudgeni (Oslo)), by the risk it changes: the register for a stated agent deployment without it and with it, computed from a public model, from the operator to the board.

Source: https://riskmandate.ai/business-case-cloudgeni.html

---

# Cloudgeni and Opengeni, by the risk they change

Cloudgeni runs AI agents against cloud infrastructure and delivers every change as a pull request; its documentation says agents do not deploy, cloud access is read-first, and runs are scoped. It runs on Opengeni, an open-source harness whose README describes durable sessions, tool approvals that pause a run for a person, a replayable event log of every step, and execution in a managed sandbox or on a machine you own. For RiskMandate the case is the harness: put an agent with a behaviour policy inside it and the rows that today rest on an instruction or a setting gain a boundary the agent cannot reach. The published Gmail ABP is the worked example.

**Disclosure:** RiskMandate's lead spoke with one of Cloudgeni's founders on 25 September 2026, and the two companies are setting up a pilot: running the agents behind RiskMandate's Gmail and Calendar behaviour policies inside Opengeni. This case was written before the pilot, from Cloudgeni's and Opengeni's public pages only, read on that date. Nothing from the conversation is on this page; when the pilot produces a measured result, the case changes with the date.

**Open source:** Apache-2.0 for Opengeni, the harness it runs on; Cloudgeni itself is a hosted service · Cloudgeni (Oslo) · [get involved](https://github.com/Cloudgeni-ai/opengeni)

**The deployment:** The model's typical deployment, moved to what an infrastructure agent usually looks like without a harness: it changes production on its own, what it did cannot be reconstructed, stopping it is possible eventually, nobody knows how long that takes, and nobody can say what it could reach if it misbehaved.

**The model:** the RiskGraph Explorer's 49 facts, 49 risks and 10 roles, copied into this site with its provenance; the register below is computed, not written. [How](business-cases.html#method).

## In its own words, and nothing more.

- Runs agents against cloud infrastructure and delivers the result as a pull request, not a deployment. “Agents do not deploy. No direct apply, deploy, or production cloud mutation. Cloud access is read-first. Inventory, findings, resource context, and validation inputs. Changes land as PRs. Your team reviews, merges, and deploys. Runs are scoped. Selected repositories, integrations, tools, and organization data only.” · [docs.cloudgeni.ai](https://docs.cloudgeni.ai/trust/security-commitment), read 25 September 2026
- Keeps deployment credentials out of the agent's hands by design. “Deployment-grade credentials should stay in customer CI/CD. Cloudgeni can generate and validate the proposed IaC; the final plan/apply or deploy step remains customer-controlled.” · [docs.cloudgeni.ai](https://docs.cloudgeni.ai/trust/security-commitment), read 25 September 2026
- Records what a run did: messages, tool output, credential use and audit events, exportable through the API and the CLI. “Session messages, tool output, scan state, credential usage, audit events, and telemetry are persisted for review.” · [docs.cloudgeni.ai](https://docs.cloudgeni.ai/trust/security-commitment), read 25 September 2026
- Runs on Opengeni, an open-source harness that holds the session, the approvals and the log around any agent. “Opengeni is a production-ready agentic service: it runs AI agents that do real work, keeps a session going for hours or days, records every step in a replayable event log, stops for a human when an action needs approval, and puts each session either in a managed sandbox or directly on a machine you own.” · [github.com](https://github.com/Cloudgeni-ai/opengeni#readme), read 25 September 2026
- Pauses a run for a person before a risky tool call, and resumes the exact call after the answer. “Tool approvals gate risky actions. Agents can ask structured questions and resume the exact tool call after the answer, even across restarts.” · [github.com](https://github.com/Cloudgeni-ai/opengeni#readme), read 25 September 2026
- Stores organisation-specific guidance as versioned policies the agent is given as context: an expectation, in this site's vocabulary, and named as guidance on its own page. “Custom policies are reusable guidance that Cloudgeni applies in analysis and agent workflows.” · [docs.cloudgeni.ai](https://docs.cloudgeni.ai/features/custom-policies), read 25 September 2026

## Same deployment, different answers.

The model asks sixteen questions about an agent deployment. A product’s effect is written as the answers it changes, and each change says what kind of change it is: a statement of what is true, an expectation the agent is asked to meet, a setting, or a boundary enforced by something the agent’s grant does not include.

## 9 retired, 17 unchanged.

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

A control plane holding the run's material: its own page lists _infrastructure metadata, selected repository content, findings, prompts, generated changes, and audit events_, and the privacy policy on cloudgeni.ai says scan data is _typically retained for 2 years_. A cloud read credential per account: on AWS its setup page creates a user with the managed ReadOnlyAccess policy; on Azure the manual setup assigns Reader, Cost Management Reader, Security Reader, Log Analytics Reader and _Storage Account Key Operator Service Role_, the last of which is not a read role by name and is not explained on the page read. The harness's own components, which the README lists for a self-host: Postgres, NATS, Temporal, object storage, the API, workers and the web app. And, in local development, the README's default that the agent runs commands directly on the developer's machine rather than in a container, with the sandbox as an option to turn on.

## What adopting it takes, before any of this is true.

An open-source project costs nothing to download and something to adopt. Every change above depends on the work below, and most of it is customisation to your own deployment.

- Decide the sandbox: a managed sandbox for the run, or a Connected Machine, which is driven directly and reaches what the machine reaches. The boundaries in this case assume the sandbox.
- Write the approval rules: which tool calls pause for a person, and who that person is. An approval is a person clicking, and the residual risk of that is the CISO's to accept.
- Keep deployment credentials in the customer's CI/CD, as the trust page says, and check that no run context carries one.
- Decide who reads the event log, how long it is kept, and what is redacted before it is exported; the log is the evidence and also a copy of what the agent saw.
- Grant the cloud read roles the setup page names and no more; on Azure, ask what the Storage Account Key Operator role is for before assigning it.
- If self-hosting, run the reference deployment and own its components; if using the managed service, read what the control plane holds and where.

## Published unresolved, for Cloudgeni (Oslo) to settle.

Each pair was read on the same day. We have not tested which is true, because that would mean testing somebody else’s system.

- **does a change ever merge on its own.** The marketing site, in its own text, says _Autonomy is a policy — routine changes merge on their own, critical paths wait for review._ The documentation's trust page says _Changes land as PRs. Your team reviews, merges, and deploys_, and the AI DevOps page says the product _is not designed around the agent writing directly to production infrastructure._ Whether a routine change can merge without a person is left to Cloudgeni to state. [cloudgeni.ai](https://cloudgeni.ai/) · [security-commitment](https://docs.cloudgeni.ai/trust/security-commitment)
- **which clouds.** cloudgeni.ai/llms.txt, last updated 15 September 2025 by its own header, lists AWS and Azure. The documentation's FAQ lists AWS, Azure, GCP, Kubernetes, OCI, Exoscale and OpenShift. Both were served on 25 September 2026. [llms.txt](https://cloudgeni.ai/llms.txt) · [faq](https://docs.cloudgeni.ai/faq)

## Four objects, and which of them a run fills.

The pilot's question, stated in the ABP's terms. RiskMandate's published behaviour policy for Claude's Gmail connector has six rows, a mandate of read and draft, never send, and four rows of unbounded excess: four things the agent can do that nobody asked for, with nothing out of its reach in the way. A harness does not change what the connector grants. What it changes is the barrier column. The table takes each Gmail row as it stands today, from the vault, and says what Opengeni's pages would let a run inside it do to that row. Every entry in the third column is a projection from the pages, not a measurement; the pilot is the measurement.

The projection, if the pilot runs in the sandbox and the mailbox is reached only through the harness: the Gmail policy's unbounded excess goes from four to nought, its excess stays at five, and two residual risks appear where none was recorded, the approval that is a person clicking and the log that is a copy of mail. The register above is the model's; these counts are the vault's, and the pilot will replace them with measured ones.

## What it does, for the person who signs.

Cloudgeni's pages are written for the platform engineer. The person who has to sign for an agent that touches production wants three things from a harness: that it cannot deploy, that it stops for a person, and that afterwards somebody can say what it did. This is the run from that desk, in the order the trust page gives it.

_Drawn from the product’s own pages, read on the date at the top of this case. Nothing was run._

### It cannot deploy, because it does not hold the credential.

This is the strongest line on the trust page and the reason the case gives it a boundary rather than a setting. A control that works because the agent's grant does not include the thing is the only kind this site counts as a control.

### The harness is separate from the agent, and open source.

Opengeni's README says it _is not the agent; it is everything the agent needs around it._ That is exactly the shape a behaviour policy wants: the agent's grant on one side, the barriers on the other, held by somebody else.

### An approval is a boundary and a residual risk at once.

The run pauses for a person. The person can be worn down, and the pause is only as good as the rule that decides which calls pause. The case counts the boundary and names the residual.

### The log is the evidence and a copy of what the agent saw.

Replayable history is what makes last Tuesday reconstructable. It is also where a customer's mail or repository content now lives, for as long as the operator keeps it. Both are true; the second belongs to Legal.

### Two ways to run, two different pictures.

In a managed sandbox the reach is what the run was given. On a Connected Machine the reach is the machine's. Every boundary in this case is for the first; a buyer should ask which one they are getting.

## What the two companies can make together

RiskMandate's offer to Cloudgeni, and to every product on this section, is the same: the business case in the register's terms, computed and dated, with the behaviour policy's counts moving as the proof. These are the notes for this one.

### The first deliverable is a measured Gmail ABP inside Opengeni.

Take the published Gmail policy, run its agent in the harness, and recompute the delta from what the harness actually bounded. The projection above says unbounded excess goes from four to nought; the measurement will say what it really does, row by row, with the evidence in the run's own log. That document is the pilot's output and the case's next version.

### The Calendar before-image is the demonstration to lead with.

Google keeps no version of an edited event. A harness that pauses before the edit and keeps the event as it was in its replayable log is a control nobody else on this site has, for a risk that stops calendar agents being adopted at all. It is small, it is specific, and a buyer can see it in one screen.

### Sell the harness by the answers it changes.

Five answers move on this page, each with its kind and its holder. A page like this for each agent shape Cloudgeni's customers run, computed from the same model, is a sales document a CISO can forward to the person who signs. RiskMandate writes them; Cloudgeni corrects them; both carry a date.

### A vault per run, or per agent, as the evidence pack.

Opengeni already keeps a replayable log. An encrypted vault the customer holds the keys to, with the behaviour policy beside the run's log and the delta recomputed per version, is the artefact an auditor or an insurer is handed: a read key, not a login. This site's policies are built that way; the pilot can package its first result the same way.

### Open source the way open-source.sgit.ai describes it.

Opengeni is Apache-2.0 with a managed service on top, which is packaging so long as the self-host and the service run the same code. The test from open-source.sgit.ai is one question, asked at each release: does the managed service contain anything the repository does not? Say the answer on the download page, and the trust page gets stronger.

### What not to claim.

That the harness makes an agent safe. It bounds what the grant gives; it does not narrow the grant. The mail scope still covers the mailbox, the read is still whole, and the instructions are still an expectation. The case is strong because it says which rows move and which do not.

The position these rest on is published at [open-source.sgit.ai](https://open-source.sgit.ai/), with its counter-cases; the vault pattern is the one this site’s own behaviour policies use, described on [how it works](how-it-works.html).

## The limits of the case, stated by the case.

- That it was tested. Nothing was installed or run; every change rests on the pages quoted beside it. The pilot is where a measured result will come from, and it has not started.
- That a Connected Machine is bounded. The README says machines are driven directly; every boundary above is for a run in a managed sandbox, and the case says so on each line.
- That custom policies are a control. Their page calls them guidance; in this site's vocabulary that is an expectation, and it is listed with what the product does rather than with what it changes.
- Anything from the conversation with the founder. The disclosure says it took place and that a pilot is planned; the page uses the public pages only.
- That the register is complete. It is one model, for one stated deployment. A different deployment changes the answers, and so the case.

**Next.** Published, and sent to Cloudgeni the same day. The pilot's first deliverable is the Gmail behaviour policy measured inside Opengeni, with the counts below recomputed from what the harness actually bounded; that result replaces the projection in the ABP section, with its date.

## Make the case in the register’s own terms.

If you build a security product for agents, the case for it can be written the same way: what it does in your own words, the answers it changes, and the register before and after. If a case here is wrong about you, tell us and it changes with a date.
