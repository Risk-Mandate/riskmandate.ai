# The early-access programme: invite only, a vault each, and the first batch by hand

> Rendered from docs/briefs/programme__early-access-and-the-first-batch.md in the repository. The text below is that file.
> Source: https://riskmandate.ai/admin/briefs/programme__early-access-and-the-first-batch/ · noindex · written by scripts/site/build-admin.mjs

**Date:** 30 September 2026 · **Author:** @website-agent
**Trigger:** the lead, 30 September: *"now that we have our agent for RiskMandate working, we need to
create that program and start emailing our first batch of users (which I already have a good list)"*;
and, in the same message, a contact form and a registration form on the site that work through vault
append messages.
**Reads against:** `direction__the-next-phase-is-users.md` (21 September: the measure is users who run
the prompts); `workflow__abp-vaults-for-people-we-know.md` (24 September: a person vault from a zip, the
keys vault, the controls); sgit.ai's *Agent Contact v0.1* and *Append-lane messaging* (29 and 26
September); *Six agents, one inbox* (29 September).

---

## 1. What the programme is

An invitation to a small group of people who already run an agent with real access. Each member gets
a behaviour-policy vault made for their organisation and their agent, holds its keys, and is asked to
correct it. The correction is the product's first action and the programme's data. It is free. It is
invite only because every vault is made by hand from the people pack and because the point is
feedback from people the lead can talk to, not volume.

**What a member gets**

1. One Agent Behaviour Policy for one agent they run, as an encrypted vault with the reading app
   inside: the grant documented from the vendor's pages, a mandate drafted for them, six scenarios,
   the delta derived, a barrier on every row. Made with `packs/dist/abp-for-people-pack.zip`.
2. The vault key, by a separate message. A read key they may hand to anyone.
3. The prompt workflow, `MAP-A-GRANT.md`, to measure their own grant and replace the documented one.
4. A direct line: `agent@riskmandate.ai`, read by a person within a working day, and the contact
   form on the site, which reaches the same agent through its vault.
5. The first look at what comes next (volume and instances on the consequence layer, the session
   mandate), and a say in it.

**What we ask**

- Run it against the real agent; tell us where the mandate is wrong; say what you would do with it.
- Twenty minutes for the prompts, and a reply. Half an hour on a call if they would rather show us.
- Permission to count them, and, separately, permission to publish their vault (default no).

## 2. How a registration travels

```
person ── /early-access.html ──► browser encrypts to the agent's key ──► append lane `site` on the comms vault yo706x9q
                                                                                         │
                site agent, each session: drain ─► decrypt ─► agent-contact/accepted/ ─► the CRM role's list ─► person vault
                                                                                         │
                                                       the mailbox role drafts the acceptance ─► the inbox role sends it
```

The vault host sees ciphertext, a size and a time. The site stores nothing. The comms vault is
private, never published, and drained by the site agent; the drain is `scripts/intake/drain.mjs`.
A registration that arrives by email instead goes the same way from the mailbox.

## 3. What was built, 30 September

| piece | where | state |
|---|---|---|
| the comms vault, keys and two lanes | vault `yo706x9q`; key in the private keys vault | live, tested end to end |
| the contact file and the agents page | `/.well-known/sgit-agents.json`, `/agents/` | live; riskmandate.ai moves from *not yet* to *published* in sgit.ai's directory once it is told |
| the contact form and the registration form | `/contact.html`, `/early-access.html` | live; encrypt in the browser; fall back to email |
| the drain | `scripts/intake/drain.mjs`, `configure.mjs` | run by the site agent with the vault key in the environment |
| the invitation, the acceptance, the reminder, the roles | `docs/programme/early-access-invitations.md` | ready; waits on the list |
| the privacy page | `/privacy.html` | says the two forms post ciphertext to the vault host, and what that host sees |

## 4. What needs the lead

1. **The list.** Where the mailbox role can read it, with the columns in the invitations file, and an
   invite code per person. Then "go".
2. **The sender.** From `agent@riskmandate.ai` in the lead's name, or from the lead's own address. The
   drafts assume the first.
3. **The schedule for the drain.** Today the `site` lane is drained when a session of the site agent
   runs. A registration can wait a day; a contact message should not wait a week. A routine once a
   weekday morning is the recommendation, with `COMMS_KEY` in the environment.
4. **Telling sgit.ai.** Its directory lists riskmandate.ai as *not yet*. One message over its
   `agents` lane, signed with the new key, moves it; that is also the first live test of sending.
5. **The address on the site.** Every address on riskmandate.ai now points at `agent@riskmandate.ai`,
   the decision made for sgit.ai on 29 September applied here. If the lead wants a personal address
   anywhere, say where.

## 5. What this does not do

- It does not send email. No session of this agent has a mail connector, by the six-roles design;
  the drafts are written for the roles that do.
- It does not check invite codes. The code is a label for matching, not a gate; the gate is that
  every vault is made by hand.
- It does not count. The measure the user memo asks for is registrations, then people who ran the
  prompts; the register in the invitations file is where that number comes from until something
  better exists.
- One observation for sgit.ai's open point 1: `configure` on a vault returned 404 until the vault
  had its first push; after one commit and push it returned `configured`. Worth adding to the API page.
