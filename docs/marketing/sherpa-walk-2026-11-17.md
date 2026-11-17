# Sherpa walk — the live site, 17 November 2026

**Who walked:** the sherpa (rm-sherpa), for backlog item 8 of `.claude/briefs/T18-the-hourly-loop.md`
**What was walked:** https://riskmandate.ai, live, v1.41.19, read 17 Nov 2026 with curl and a headless browser at 1280.
Read-only: no form submitted, no store checkout opened, nothing sent. The store (store.sgit.ai) and the customers
site (customers.riskmandate.ai) were read only where the site links them.
**The stranger:** runs a few AI agents; one worry, "can these people control my agents, and how do I start?"

## The path

1. **Home.** The message lands in one line ("We can control your agents."), the four counts carry links, the
   situations are real and sourced, the ladder is shown with "today every one starts with a conversation". Two
   buttons: *Talk to us about your agents* (/contact.html) and *See sixteen free examples*. Good first screen.
2. **The menu.** Three drop-downs (Product, How it works, Open source) and one button, *Try it free*. The menu
   does not contain the home page's proof: no Web Summit record, no situations, no developers page, no archive.
   Product still leads with the insurance-era pages and "Early access, invite only".
3. **Try it free** leaves the site for customers.riskmandate.ai (v0.2.6, its own design and menu, an "account"
   costed in pence).
4. **Pricing.** The ladder, correctly stated, then *Buy at the store*, *store page*, "Buy the £500 policy" and
   "Buy a policy", on the same page that says no payment link is issued.
5. **The store** (one click from pricing) still sells the £10 pack and £50 vault and describes the £500 level
   differently from pricing.
6. **Contact.** Works as a page; it leads with the cryptography, not with the reader's agents. "A person reads it
   within a working day"; pricing promises "a follow-up from a person within 24 hours".
7. **Back** via the menu: How it works says "we never enforce"; the reviewed level and early adopters number the
   levels on the old ladder; the persona pages still describe the £10 download; /summit.html is the September
   event in the future tense with no archive note.
8. **/developers.html**: the best page for this stranger; linked only from the home page's hooks card ("How to add
   one"), the 404 page, the sitemap and llms.txt (checked in `origin/dev:site/`, 17 Nov). Nothing in the menu,
   How it works, Try it or SHarness leads to it.
9. **/web-summit-2026/situations.html**: reachable from home, pricing and insurance only; not in the menu.
10. **/archive/**: lists three items and promises a dated note on each; two of them carry none.

## The first ten breaks, in the order a stranger meets them

1. **The menu** (every page). The proof is not in it: no "Web Summit 2026", no "Situations", no "For developers", no
   "Archive"; Product opens on "Licence to Operate", "The Insurability Index", "RAMM" and "Early access, invite only".
   *Fix:* a first menu group "What we did" (the summit record, situations) and "Start" (pricing, contact, developers
   once the lead says yes); move the insurance pages under "Where this goes".
2. **The menu button** (every page): "Try it free" → customers.riskmandate.ai, which says "Your account: of credit
   for reading, not money … this page costs 1p … each example's own page … costs 50p. Nothing is billed." The home
   page's ask is "Talk to us about your agents". *Fix:* make the button "Talk to us" → /contact.html; keep Try it free
   as a menu link, labelled as a separate site.
3. **pricing.html**: hero button "Buy at the store ↗", per level "store page ↗", step 1 "Buy the £500 policy for the
   application closest to yours … You get an order reference", and the close "Read one first. Then buy yours." /
   "Buy a policy ↗" — while the same page says "Today every way in starts with a conversation". *Fix:* replace every
   buy button with "Talk to us"; step 1 becomes "Write to us"; keep one line saying the store page exists, unissued.
4. **store.sgit.ai/policies/** (linked from pricing; the store team's): "Buy this policy at £10 ABP Pack £50 ABP
   Vault £500 ABP Tailored £1,500 ABP Reviewed"; "15 published shapes" (the site says sixteen); /d/t3/ says the
   £500 level is "delivered by a person … Done by a named security professional", £100 on order and £400 on delivery,
   where pricing says "Run by our own agents … agents, a person reviews" and names no split. *Fix:* the store team
   retires t1/t2 and matches t3's words to pricing; until then pricing drops the store links (item 3).
5. **/web-summit-2026/** (home says "Every figure on this page is on the summit record"): "Every agent on that team
   had an Agent Behaviour Policy (ABP)". Home says "most with an Agent Behaviour Policy … 94 of the 109". *Fix:*
   "Most agents on that team had …", with 94 of 109 and its source.
6. **how-it-works.html** (menu): "We read; we never enforce." and "Nothing we build sits between an agent and what
   it is doing. There is no enforcement point". Home: "put something in the way of the difference"; hooks; SHarness.
   *Fix:* rewrite that step: the ABP reads; hooks and SHarness are the enforcement we fit when you want it.
7. **abp-reviewed.html** (menu "The reviewed level"): "Level 4 · delivered by a person … An hour of somebody's time"
   and "What the top level adds"; pricing has the £1,500 as level 2 with "two meetings", and two levels above it.
   Same old numbering in how-it-works ("PER ENGAGEMENT · LEVELS 3 AND 4 … Corrected at level 3 by a person, and in
   the room at level 4") and early-adopters ("The store sells an Agent Behaviour Policy at four levels. The third,
   corrected for your situation" = the £500, now level 1). *Fix:* name levels by price everywhere, on the new ladder.
8. **for-corporate, for-founders, for-startups, licence-to-operate**: "Buy at the store ↗ … The store takes the order
   and hands you back here: one page per level, and at level one that page is the download — the zip, its size, its
   sha256" — the retired £10 pack. *Fix:* "Talk to us" and drop the download sentence.
9. **uk-support.html**: "the first two (£500 and £1,500) can be bought from the store today". Pricing: the payment
   link "has not been issued yet". *Fix:* "every way in starts with a conversation (pricing, read 17 Nov)".
10. **/archive/**: "each keeps its address and gets a dated note" — but /summit.html opens "We will be at Startup
    Summit in Lisbon for two days" with a "Book a slot" button, and /paid-t1.html opens "Thank you … Download it now"
    for the £10 pack; neither carries a note. *Fix:* a dated archive banner on summit.html, summit-booth.html,
    paid-t1.html, paid-t2.html, archive/home-2026-11-16.html.

## Further, below the ten

- situations.html, the 29 Oct card "The sandbox refused two installs": "What the ABP said." is empty. Fill it or
  say "the ABP said nothing on installs; the sandbox did".
- contact.html "A person reads it within a working day" vs pricing "a follow-up from a person within 24 hours":
  pick one. The contact page could also ask "how many agents, and which" above the message field.
- agents/ ends "Ask for early access" (an invite-only programme) where the home page asks for a conversation.
- Home footer "The insurability layer for agentic AI." under a page whose message is control.

## What was not done

No form submitted, no store checkout opened, nothing sent; pages at 390 not checked on this walk. The reading paths
by reader were not compared against the newsroom map this turn. No page edited.
