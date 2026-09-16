# A grant is a union of capabilities; what the reader needs is the consequences — and the assets that make each one real

> Rendered from docs/briefs/direction__consequences-assets-and-the-vault-as-a-website.md in the repository. The text below is that file.
> Source: https://riskmandate.ai/admin/briefs/direction__consequences-assets-and-the-vault-as-a-website/ · noindex · written by scripts/site/build-admin.mjs

**Date:** 2026-09-16 · **Author:** @website-agent
**Trigger:** project lead's voice memo of 16 September, *"notes and material that we need to add to the vault that we're working on, which connects Claude with Gmail"* (Otter transcript, about nine minutes)
**Reads against:** `site/vaults/claude-gmail-connector/data/grant.json` as pushed in `oc433z3m` (six rows, four measured, 16 September); abp.sgit.ai v0.3.0 (the 23 primitives, four barriers, six evidence tiers); `direction__abp-as-a-graph-and-stakeholder-views.md` and its task briefs T02–T04; `direction__mvp-vault-and-the-reading-app.md` (today); `review__first-measured-abp-n8n-owner-key.md` §3

---

## 1. What the memo says, in its own order

1. **Back to first principles on the grant.** *"What is the grant and what can be done"* — and the way to think about it is *"the same way we talk about second-order stories: the side effects of what is possible."* This is the same graph the site is building; the nodes it produces *"will be our primitives, so we get to reuse these across the board."*
2. **Everything in a grant must be explicit, because the reader reads it carefully.** The current vault says the agent can read credentials. *"In a way that's correct, but that's almost the parent node."* The child the reader needs is: *"you can read any credentials that exist in the email, because you can read emails — and this requires that there are credentials in email."* Context matters: *"it's not because you can read an email that you can read all credentials"*; the credential has to be in the mailbox. But *"we can say we're going to assume that credentials exist in email"*, and *"we can check the box"* — the assumption is configurable, and the default is yes.
3. **Chains.** You can read secrets → you can read passwords sent to you → *"more importantly, you can read reset-password links"*. Add the trifecta — read the mail, read the tokens in it, make web requests — and *"I can reset any password for which the user uses the email as the password-reset link."* Take away one leg (an agent that reads mail but cannot act) and the consequence is gone. *"You start to see the granularity here."* This is the distinction the grant does not make today: *"our grant encompasses everything, is the union of everything; we need to distinguish between what is a capability and what is the consequence."*
4. **An assets bucket.** *"Capability connected with the intent, connected with the asset — that's what then gives you the consequence."* The first asset named: *"emails that other people sent you."*
5. **Exfiltration routes, counted.** *"You almost want to be a detective here: how many different ways does the agent have to exfiltrate data?"* Email it out; web requests, GET and POST; encode it. *"There's a lot of ways."*
6. **The authorisation asymmetry.** *"You probably were given explicit or implicit authorisation to read the email, but you did not get implicit authorisation to forward the email."* Not legally tested — *"good to get some evidence on this"* — so link each such fact to evidence, to mini attack trees, and to *"standards like GDPR"*. An employee's inbox is under the company's policy, so this also connects to internal policies.
7. **Harvesting and mass actions.** Harvest addresses and content; *"spam everybody at maximum speed — double check, but I don't think there are limitations."* Two side effects to map: the agent can attack other users and other organisations (malware, payloads, social engineering) from this account; and *"surely there's a moment where Google's own protections kick in"* — the user banned, perhaps the organisation. *"What is the sequence of events that gets a user banned, and an organisation banned?"*
8. **Mass change to the inbox's information design.** *"Most users have a very tight information-design structure"* — unread, labels, folders, notes — *"built on top of Google's inbox capabilities, which I believe we should be able to change all of."* The only known limit is permanent deletion. The checks: change a message's labels; move all messages to a label; archive all; trash all; mark all read; mark as spam. And for each: *"what are the side effects?"*
9. **Then the mandate, with realistic scenarios.** *"We don't want the agent to start attacking the company"* or doing any of the above — the scenarios say so in the deployer's words.
10. **A visualisation of the mandates**, and the vault's built-in connections to standards and documents *"as a graph"*: *"a mini version of GDPR, a mini version of the standards … even the EU AI Act."*
11. **Think of the vault as a website.** Navigate it as one, and carry the store's messaging: *"who are you, and what are the materials available for the audience"* — executive, technical, and so on. Make that clear the moment you get the vault.

## 2. Where we already are

- **The parent node the memo describes is exactly one row.** `read.credential.host` in the Gmail grant: barrier *none*, evidence *inferred*, note *"password resets, one-time codes, invitations and account-recovery mail arrive in a mailbox; reading messages reads those. Inferred, not documented — no tool or scope on either vendor's page separates them."* The row is right and it is the parent. The children — secrets, passwords, reset links, and what follows from each — have nowhere to live: the vocabulary has 23 capabilities and no object for a consequence, an asset or a route.
- **The trifecta is on the library preview, not in the data.** `agent-behaviour-policy.html` shows *the lethal trifecta* per policy as a derived badge over three capability ids. The memo's point is that the trifecta is a *consequence with a precondition* — and in this shape the third leg is not in the grant: the Gmail vault has no `send.endpoint.*` row, because Gmail alone does not fetch URLs. Whether Claude's own web tools count as that leg is a question about the deployment, not about the connector, and today no file asks it.
- **The measured run already touched half the list.** Send worked (measured, one message, no client trace in its headers); trash worked; permanent deletion was refused by the scope. Labels were read (`read.record.history`, measured). Nothing was tried for *change labels*, *archive all*, *mark read*, *mark spam*, *mass send* — and two of those must never be tried on a live account, because provoking Google's protections is testing somebody else's system (rule 4). They are documented from Google's pages or they stay open.
- **`create.schedule.tenant` is the standing-rule route.** A filter that forwards is exfiltration that outlives the session. The row exists (setting, documented); the consequence does not.
- **The graph brief already asked for behaviours as nodes with `links {mitre[], standards[], gdpr[]}` and edges per path** (T02, T03), and **views per audience** (T04). This memo adds two node kinds to that graph — consequences and assets — and says what the audience view should open with. It refines those briefs; it does not replace them.
- **The MVP brief of today** redraws the reading app with a left navigation of record / do / hold. *"Who are you"* is not on it yet.

## 3. The structure this asks for

A **consequence layer** beside the grant: derived where it can be, authored where it must be, evidence-tiered like everything else, and never a score.

```
data/
  assets.json          what is in this deployment for the grant to act on
                       id asset.<slug> · statement (in the deployment's own words) ·
                       present: assumed | confirmed | absent · configurable: true (the tick box) ·
                       rights: who else holds rights over it (the sender, the employer) · source
  consequences.json    what follows when a capability meets an asset
                       id consequence.<slug> · statement — explicit, second person, in the
                       mailbox's own words ("you can read any password-reset link that arrives
                       in this mailbox") · requires { capabilities[], assets[], consequences[] } ·
                       kind: read | act | exfiltrate | disrupt | impersonate | outlive ·
                       route (for exfiltration: the door out) · undo class · barrier (inherited
                       from the weakest required capability's path, derived) · evidence tier +
                       source + date · links { attack[], gdpr[], eu_ai_act[], internal[] } ·
                       questions[] (what is not known, in the same file, not in a footnote)
  standards/           the mini graphs — titles and ids only, never the body text (rule 7)
    gdpr.json          article number · title · link
    eu-ai-act.json     article number · title · link (the regulation may be quoted)
    attack.json        technique id · name · link
```

**The triple.** `capability × asset → consequence`; intent sits on the other side as the mandate. The delta gains a derived view: *which consequences are open*, meaning every required capability is in the excess or unstated and every required asset is present or assumed. A consequence whose capability is *told not to* but whose barrier is a setting stays open in the table, with the barrier beside it — the barrier is what the reader is deciding about.

**Explicitness as a rule.** Every grant row gets at least one child consequence in the deployment's own words, or a line saying none was found. A row cannot be the parent of nothing without saying so.

**The detective's table.** One derived table: routes out of the deployment, one row per `kind: exfiltrate` consequence — the door, the barrier on it, whether it outlives the session, whether the deployer told the agent not to. That is *"how many ways to exfiltrate"* answered with a count that carries its provenance.

**The first consequences for `oc433z3m`**, drafted to be argued with. Evidence and dates go in the file, not here; every one is a claim about the shape, none about Google.

| id | statement | requires | kind |
|---|---|---|---|
| `consequence.read-secrets-in-mail` | you can read any secret that has ever arrived in this mailbox | `read.message.tenant` · `asset.secrets-in-mail` (assumed) | read |
| `consequence.read-reset-links` | you can read every password-reset and one-time-code message, past and future | `read.message.tenant` · `asset.accounts-registered-to-this-address` | read |
| `consequence.reset-passwords` | with a way to open a link, you can take over any account that resets by email to this address | `consequence.read-reset-links` · a `send.endpoint.*` capability **not in this shape** — open question: Claude's own web tools | act |
| `consequence.forward-any-message` | you can send any message in this mailbox to anyone — messages the sender authorised the account holder to read, not to forward | `read.message.tenant` · `send.message.world` · `asset.mail-from-others` | exfiltrate |
| `consequence.harvest-addresses-and-content` | you can collect every address and every body the mailbox holds | `read.message.tenant` · `asset.mail-from-others` | read |
| `consequence.mass-send` | you can send at whatever rate the platform allows, to anyone, as the account holder | `send.message.world` (setting: the approval prompt) | act |
| `consequence.attack-others-from-this-account` | you can send payloads and pretexts to other people and organisations, as the account holder | `consequence.mass-send` | impersonate |
| `consequence.provoke-suspension` | sending enough may have the platform suspend the account, and possibly its organisation | `consequence.mass-send` | disrupt · documented only, never measured |
| `consequence.rearrange-the-inbox` | you can relabel, archive, trash or mark every message, undoing the owner's filing | `read.message.tenant` + the modify scope · `asset.the-owners-filing` | disrupt · six checks, §5 |
| `consequence.standing-forward` | you can create a rule that forwards future mail with nobody present | `create.schedule.tenant` · `send.message.world` | outlive · exfiltrate |
| `consequence.send-without-trace` | mail you send carries nothing that identifies the agent as its author | `send.message.world` · measured 16 Sept (the `.eml`) | impersonate |

And the first assets: `asset.mail-from-others` (present; rights: the senders, and the employer where the mailbox is corporate), `asset.secrets-in-mail` (assumed, configurable), `asset.accounts-registered-to-this-address` (assumed, configurable), `asset.the-owners-filing` (present: the labels measured on 16 September), `asset.contacts` (present).

**The vault as a website.** The reading app's left navigation gains **Who are you?** immediately under *Start here*: executive, technical, risk and governance, buyer, and the agent itself. Each opens the same record filtered — the counts and the consequences that audience decides about, the documents it needs, the questions it is owed — and each is a view file under `data/views/` exactly as T04 already specifies. The standards mini-graphs are what the consequence links point at, so a reader clicks from *forward any message* to the GDPR article title and the ATT&CK technique name without leaving the vault.

## 4. What the memo settles for the MVP brief

- The left navigation of `direction__mvp-vault-and-the-reading-app.md` §4 gains **Who are you?** under *Start here*, and **What follows** (consequences, the routes-out table) under *Evidence*.
- `Keep it` shows the standards mini-graphs as data files, so the *multiple formats* claim covers them.
- The scenarios (`data/scenarios.json`, six today) are the *"realistic scenarios"* the memo asks for on the mandate side; two more are owed in the deployer's words: *the agent must not attack this company* and *the agent must not attack anybody else from this account*, each mapped to the consequences it refuses.

## 5. What to build next, in order

1. **`assets.json` and `consequences.json` for `oc433z3m`** — the eleven above with evidence, tiers, dates and open questions; the build derives `CONSEQUENCES.md` and the routes-out table; the app shows both under *Evidence → What follows*. Every grant row gets a child or a "none found" line. **T11, a day.**
2. **The research list, documented not provoked** — Google's own pages, read and dated: sending limits per account type; what suspends an account and what an organisation; whether the connector's tools cover labels, archive, trash, spam and mark-read (the Google MCP reference lists ten tools; the listing names more); whether Claude's web tools are a second leg in this deployment. Two checks may be measured on the deployer's own account without provoking anything: *change one message's label* and *mark one message read*. Mass send and spam-marking at scale are never run. **`/research-vault` on the Gmail vault, half a day.**
3. **The standards mini-graphs** — `data/standards/gdpr.json`, `eu-ai-act.json`, `attack.json`: ids, titles, links; the vocabulary extension T03 asks for, extended to consequences. Titles only. **T12, a day, alongside T03.**
4. **Who are you?** — the audience entry and the first four views, as T04 specifies, brought forward into the MVP build rather than after it. **Amend T04; part of the MVP build.**
5. **Two more scenarios**, and the consequence view on the delta and on the Licence to Operate's conditions. **Part of T11.**

## 6. What it does not settle, and what needs the lead

- **The forwarding asymmetry is a claim about authorisation, not a legal finding.** The vault records it as a consequence with the asset's `rights` field and links the GDPR article titles; it does not say it is unlawful. If the lead wants a stronger line, that is a ruling and a source, not a sentence an agent writes.
- **Suspension is documented only.** Provoking Google's protections from the deployer's account would be testing Google's system; the sequence is read from Google's pages and dated, and where the pages are silent the row says so.
- **Does the consequence belong in the model site's vocabulary?** Ask Lab 03 for a `consequence` object beside the capability, or a sanctioned extension namespace. Until then it is this site's extension, declared as such in the vault.
- **Default for assumed assets.** The memo says assume present and let the deployer untick. Recommendation: yes, with `present: assumed` shown as its own word in the app, never silently as present.
- **Whether Claude's web tools are a leg of the trifecta in this deployment** is the customer's question in the correction call (§4 of the workflow brief). It is the first item on the call now.
