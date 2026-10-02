# The early-adopters thank you: two groups, one offer, thirty days, and the words that go out

**Date:** 2 October 2026 · **Author:** @website-agent · **For:** the lead, and the mailbox and inbox roles on `agent@riskmandate.ai` · **Status:** the page is live at `/early-adopters.html`; the sends wait on the two lists

**Trigger:** the lead, 2 October 2026, by voice memo: *"create a programme for the early users, early adopter users that I had from the cyber boardroom … thank you for being a cyber boardroom early user and spending five pounds buying credits … the cyber boardroom is actually the legal company behind Risk Mandate … we are giving them a customised agent behaviour policy, which we currently sell for 500 quid … asking them to work with us, i.e. the agent, in the creation of these policies, for one of the use cases that they have … two groups … one group already did the purchase for five quid, and it didn't use it a lot … they're hot leads … we have all their emails … a page that rewards … our early customers … time limited … 30 days to collect it … a page that we can explain to the agent that is going to send the emails what's going on."*

**Reads against:** `docs/briefs/programme__early-access-and-the-first-batch.md` and `docs/programme/early-access-invitations.md` (30 September: the programme, the form, the comms vault, the six roles, the invitation and the reply); `site/pricing.html` and `site/paid-t3.html` (what level 3 is and delivers); `direction__the-next-phase-is-users.md` (the measure is users who run the prompts).

---

## 1. What it is, in one paragraph

A thank you to two groups who put something in early, carried by one offer: an Agent Behaviour Policy for one agent they run, **corrected for their situation with them**, the level the store sells for £500, at no cost, to be collected within thirty days of the email. The first group is the early users of The Cyber Boardroom, who bought £5 of credits and, by the logs, used little of them. The second is the early adopters of RiskMandate, the design partners of the early-access programme, who were offered a vault made from their public pages and now get it corrected. The Cyber Boardroom is the company behind RiskMandate; the page says so, with its mark beside ours. The public page is `/early-adopters.html`; the registration route is the existing early-access form with a code.

## 2. How it differs from the early-access programme of 30 September

| | early access (30 Sept) | the thank you (2 Oct) |
|---|---|---|
| who | people the lead invites, one by one | two lists the lead already holds, with WhatsApp groups behind them |
| what | a vault made from their public pages (the people pack); they correct it | the same, then **corrected with them** against their use case: level 3, the £500 level |
| why | feedback from people the lead can talk to | a thank you for money or time put in early; the same feedback |
| window | open | thirty days from the email |
| code | `EA-` + four characters | `CB-` + four for Cyber Boardroom users; `EA-` + four for RiskMandate early adopters |
| route | `/early-access.html` | the same form; the code says which list |

Everything in the earlier file still applies: the form encrypts to the agent's key and lands in the comms vault's `site` lane; the drain files it; the six roles do what they do; nothing is sent without a draft a person can see.

## 3. The lists

Two CSVs, held by the lead, never committed and never in a vault with a public read key. The columns are the earlier file's, with two more:

| column | required | used for |
|---|---|---|
| `email`, `first_name` | yes | the To and the greeting |
| `organisation` | no | the one line that says why them |
| `agent` | no | the agent they run, in their words; names the shape the vault starts from |
| `context` | no | one sentence the lead writes; the second sentence of the email, so no two are the same |
| `group` | yes | `CB` (bought credits in The Cyber Boardroom) or `EA` (early adopter of RiskMandate) |
| `credits_bought`, `credits_used` | CB only, optional | from the logs; never quoted back to the person as a number, only as "most of them are still there" |
| `invite_code` | yes | `CB-` or `EA-` + four characters, one per person, made by the lead |
| `sent`, `expires`, `replied`, `registered`, `vault`, `corrected` | filled in as it happens | the register; `expires` is `sent` + 30 days |

## 4. The email to the Cyber Boardroom group

Subject: **Thank you for the five pounds. Here is what it turned into.**

> Hi {first_name},
>
> {context}
>
> A while ago you bought credits in The Cyber Boardroom, early, when there was not much to see. Thank you. Most of those credits are still unused, and that is on us: the product moved. The question people kept asking was narrower than "what is our cyber risk". It was "what can this agent we just connected actually do, and who said it could?" RiskMandate is the answer to that, from the same company and the same person, and the Agent Behaviour Policy is the document it produces: for one agent, everything it can reach, what it was authorised to do, the gap, and what stands in the way.
>
> As a thank you I would like to make one for an agent you run, corrected for your situation with you. It is the level we sell for £500; for you it costs nothing, for the next thirty days. You name the agent and the use case, run a prompt that measures what it can reach, tell us what it is for in your words, and get back an encrypted vault you hold the keys to, with the mandate corrected and a note of what changed and why.
>
> What I ask in return: work on it with us, and tell us where it is wrong.
>
> To collect it, register here with the code {invite_code}: https://riskmandate.ai/early-access.html
> What it is, and why, is on one page: https://riskmandate.ai/early-adopters.html
>
> Dinis

## 5. The email to the RiskMandate early adopters

Subject: **Your early-access vault, corrected with you**

> Hi {first_name},
>
> {context}
>
> You said yes to the early-access programme: a behaviour-policy vault for one agent you run, made from your public pages, free, in exchange for telling us where it is wrong. Thank you for that. As an early adopter you are a design partner, and I would like to give design partners the next level: the same vault, then corrected with you for your situation. It is the level we sell for £500; for you it costs nothing, for the next thirty days.
>
> What changes: after the vault arrives, we work through the mandate together, by email or on a call, against your industry, your use case and your words; the gap is recomputed; a note of what changed and why is committed beside it, and a person reviews the note before it reaches you.
>
> If you have already registered, reply to this and say "yes, correct it", and nothing else is needed. If you have not, register here with the code {invite_code}: https://riskmandate.ai/early-access.html
> The page that explains the offer: https://riskmandate.ai/early-adopters.html
>
> Dinis

## 6. The reply when they register

The earlier file's reply applies, with one paragraph added after "Here is what happens now":

> Because you are on the thank-you list, your vault comes with the correction included: once it arrives, we will ask you one question, what the agent is for in your words, and work the mandate through with you from there. Nothing to pay, and the thirty days only ever applied to registering.

## 7. The reminder, once, after twenty days

Subject: **Ten days left on the behaviour policy**

> Hi {first_name},
>
> A short one: the thank-you offer, a behaviour policy for one agent you run, corrected with you, closes on {expires}. If you want it, register with the code {invite_code} at https://riskmandate.ai/early-access.html, or reply to this with the name of the agent and I will take it from there. If not, no reply needed, and thank you again for having been early.
>
> Dinis

## 8. Who does what

The six roles as in the earlier file. The additions: the CRM role keeps `expires` and sends nothing after it; the mailbox role drafts from the two templates above and never from memory; the inbox role sends only from a draft a person has seen; the site agent, this one, builds and corrects the vaults and answers the one question with the person, which is level 3's work and the part the offer is for. The WhatsApp groups are the lead's: a message there may point at the page, but the invitation and the code go by email, so the register is one list.

## 9. What needs the lead

1. The two lists, with `group`, `context` and a code per person.
2. The send date, which starts the thirty days; the register's `expires` is computed from it.
3. Whether the Cyber Boardroom group hears first, as the warmer list, or both go together.
4. The sender: from `agent@riskmandate.ai` signed by the lead, as the earlier file assumes.
5. The legal name of the company, if the page should carry it. The page says "the company behind RiskMandate" and nothing more precise.

## 10. What this does not do

It does not send email; no session of this agent has a mail connector. It does not check codes; the code labels a list. It does not touch anybody's credits in The Cyber Boardroom. It does not quote a person's usage back to them. It does not promise a security assessment or anything about an agent's behaviour: a policy describes, and the correction is the product.
