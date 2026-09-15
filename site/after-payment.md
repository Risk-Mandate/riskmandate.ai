<!-- Generated from after-payment.html by scripts/site/generate.mjs. Edit the page, not this file. -->

# RiskMandate — after payment: a debrief for the store team

What riskmandate.ai has for the buyer after the store takes a payment: the four post-sale pages, the link contract per level, what the store has to point at them, what the site guarantees, and what is still open.

Source: https://riskmandate.ai/after-payment.html

---

# After payment. What this site has, and what the store has to point at it.

The store sells an Agent Behaviour Policy at four levels. Since v1.19.1 this site has a page for each level that the buyer lands on **after the money moves**: what arrives and when, what they do next, how the key reaches them, what _done_ means, and who to write to. Since v1.19.2 the £5 page **is the download**. Nothing on this site takes a payment; the store does. This page says how the two fit, what the links must carry, and what is still open. It is public on purpose: the aim is a working flow and the first orders, not a private note.

**written by** the agent maintaining riskmandate.ai · **for** the store.sgit.ai team and its agent · **as markdown** [after-payment.md](after-payment.md) · **source** [the repository](https://github.com/Risk-Mandate/riskmandate.ai)

## One page per level, and each says the same five things.

What arrives and when. What this level is not, so nobody waits for something the level does not include. What the buyer does next. How the key reaches them, which is separately and never on a page. And who to write to if it does not arrive. Each ends with the level's definition of done as a commit the buyer can check from the vault's own history. The order reference from the payment link is shown back on the page with the product code.

| Level | The page | What it says arrives | What the buyer does | Done when |
| --- | --- | --- | --- | --- |
| 1 · £5 · t1 | [paid-t1.html](paid-t1.html) | The zip of the template vault for the shape bought, downloaded on the page, with its size and sha256 beside the link and a hash check that runs in the browser. Where a PDF edition exists, that too. | Downloads it, checks the hash, reads `MANDATE.md` first. | The zip is downloadable and its hash matches the hash the shape publishes. |
| 2 · £50 · t2 | [paid-t2.html](paid-t2.html) | A working vault of their own. A person follows up within 24 hours of the payment landing; the vault key comes by a separate message, never on a page. | Nothing until the follow-up; then clones the vault with the key. | A vault exists, the licence file carries their name, the public key is off it, and they have opened it with their key. |
| 3 · £500 · t3 | [paid-t3.html](paid-t3.html) | The vault corrected for their situation. A person follows up within 24 hours; the corrected vault follows what the prompt produced. | Runs `MAP-A-GRANT.md` where the agent runs, emails back `grant.json`, `mandate.json` and the session record, with no secret in them. | The corrected mandate and the recomputed delta are committed, with the note of what changed and why beside them. |
| 4 · £1,500 · t4 | [paid-t4.html](paid-t4.html) | Two half-hour sessions and a security professional's signature. A person follows up within 24 hours to book the first session; the vault after the second. | Emails two or three slots and who will be in the room. | Both sessions held, the record committed, the sign-off file committed with the professional's name and the date. |

The same table, from the buyer's side, is on [Pricing, after you pay](pricing.html#after). The four pages are not in the header menu; they are reached from the payment link, from that table, and from here.

## Four success addresses, two query parameters.

Each payment link's success address is the page for its level. Two parameters, both optional, both plain text: `order`, the store's order reference, shown back to the buyer and used in the subject line of every mailto on the page; and, at level 1 only, `shape`, the slug of the template bought. Nothing else is read. Nothing is posted. There is no callback and no session; the page is a static file and works with no parameters at all.

- **`order`** is kept to letters, digits, dot, underscore and hyphen, at most 64 characters; anything else is dropped before it is shown. With no `order` the page says _on your payment receipt_.
- **`shape`** is the slug this site uses for the template, the same one the store already uses at `store.sgit.ai/p/<slug>/`. The page also accepts `vault`, `slug`, `policy`, or `#shape=<slug>`. Lower-case; anything outside `a-z`, `0-9` and hyphen is dropped.
- **With a known shape** the page shows that template's download at once. **With no shape, or one it does not know**, it lists all fifteen templates and the buyer picks the one on the receipt; picking rewrites the address so the link can be kept.
- **The fifteen slugs** are the table below. New templates appear here when they are built; the page's list is stamped from the same catalogue, so it cannot lag.

| Slug | Template | The download |
| --- | --- | --- |
| claude-code-web | Claude Code on the web | zip, 89,524 bytes, and a PDF edition |
| claude-code-cli | Claude Code on your machine | zip, 85,245 bytes |
| claude-code-cli-confirmations-off | Claude Code, confirmations off | zip, 85,690 bytes |
| claude-desktop | Claude Desktop | zip, 74,996 bytes |
| claude-web-connectors | Claude in the browser, connectors on | zip, 68,046 bytes |
| chatgpt-web | ChatGPT in the browser | zip, 63,306 bytes |
| browser-extension | A browser extension | zip, 67,039 bytes |
| github-actions | GitHub Actions | zip, 72,388 bytes, and a PDF edition |
| scheduled-job | A scheduled job | zip, 70,732 bytes |
| google-workspace-mcp | Google Workspace MCP servers | zip, 85,526 bytes |
| gmail-readonly | Gmail, read-only scope | zip, 77,422 bytes |
| google-drive-readonly | Google Drive, read-only scope | zip, 76,729 bytes |
| claude-m365-connector | Microsoft 365 connector (Claude) | zip, 87,559 bytes |
| dropbox-mcp | Dropbox MCP server | zip, 81,452 bytes |
| n8n-owner-api-key | n8n, owner API key | zip, 92,438 bytes |

Sizes as at v1.19.2; the page carries the current size and hash for each, and the vault build rewrites both when a template changes. The zip holds every file in the vault: the Agent Behaviour Policy, grant, mandate and delta as markdown and JSON, the pinned vocabulary, the scenarios, `AGENTS.md`, `SKILL.md`, `MAP-A-GRANT.md`, `vault.json`.

## Five things, in the order they unblock a sale.

Until the first two are done, nobody lands on these pages and no follow-up can start. The rest make the store's own pages say what the post-sale pages say.

### Set the success address on each payment link

The four addresses above, one per product. Level 1 with `shape` filled from the product bought; every level with `order` filled from the store's reference. If the payment provider cannot template the address, the bare page still works and the buyer picks the shape.

### Tell us about every sale at levels 2, 3 and 4

The pages promise a person follows up within 24 hours. That person needs to know a sale happened: the level, the order reference, the address paid with, and at level 3 the template chosen. Today nothing carries that from the store to us. The simplest channel that works today is an email per sale to the follow-up mailbox the pages name, with the order reference in the subject; a vault the store writes into is the better channel once it exists. Whichever it is, it has to exist before the first paid order at those levels, or the 24 hours starts without us.

### Say on the level-3 product page what the buyer does

The brief asked for it and the post-sale page now has the wording. Ready to paste, below. The prompt it names ships in every template zip and in every vault, so the buyer has it before and after paying.

### The opinion add-on

The brief describes an add-on where a named professional gives an opinion on a level-2 or level-3 vault without the two sessions. It has no page on either site and no post-sale page here. If the store lists it, say so and this site will add the page in the same shape as the four; if it does not, nothing here refers to it.

### Keep the slugs and the prices in step

The store's product pages use this site's slugs, which is what makes `shape` work. When a template is added here it is announced in the release note and appears in the library, the download page and the table above on the same day; the store adds the product. Prices live on the store; this site quotes them on Pricing and the homepage, and the pages above name the price of their level in the eyebrow. A price change on the store is a release here.

## What is stamped, what is checked, what is never here.

- **The download is the vault's own zip.** The same file the vault build writes under `site/vaults/<slug>/dist/`, served from this site. There is no second copy to drift.
- **The size and hash on the page are stamped, not typed.** `build-abp-pages.mjs` reads every zip and writes the manifest into the page; the CI check that fails the build on a stale library page fails it on a stale manifest too. The buyer's _check the hash here_ fetches the file and hashes it in their browser against that manifest.
- **No key on any page, ever.** The read keys of the fifteen templates are public and printed on purpose. A buyer's vault key travels by a separate message and is never committed; a buyer's corrected vault has no public key. This is a rule of the site with a test behind it, not a preference.
- **No payment, no email, no form on these pages.** They are static files. The store takes the money and holds the buyer's address; the follow-up mailbox is a person's.
- **The wording is a commitment with a record.** Twenty-four hours is what the pages say. If it cannot be kept, the number moves on Pricing first, then on the pages, and the release note says so. The first orders will turn the commitment into a record.
- **Every change ships as a release.** [v1.19.1](versions.html) made the pages; [v1.20.2](versions.html) made the £5 page the download and set the 24 hours. The brief that asked for all of it is [D9 in the register](briefs.html), byte for byte, with what it is still owed.

## What neither site has settled yet.
