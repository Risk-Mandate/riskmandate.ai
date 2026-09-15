<!-- Generated from abp-vaults.html by scripts/site/generate.mjs. Edit the page, not this file. -->

# RiskMandate — Agent Behaviour Policies, delivered as vaults

The behaviour-policy template vaults, one per deployment shape, read live in the browser from the encrypted vault with a published read key: the four counts, every row with its barrier, the vault’s own app, and the files you hand the agent.

Source: https://riskmandate.ai/abp-vaults.html

---

# The behaviour policy as a vault.

What a buyer receives is not a document but a vault: eight files derived from a measured grant, an elicited mandate and a pinned vocabulary, with its own app, its own history, and a read key that can be handed to anyone who asks how you govern your agents. The ones below are the **templates** — one per deployment shape, free, public, and read live from the encrypted vault by this page. A buyer's own vault is the same thing with the mandate corrected, a name on the licence, and no public key.

## One per deployment shape. Derived, never authored, and the numbers below are live.

Each card is rendered from the vault's own files — the grant, the mandate and the stored delta — fetched as ciphertext from the vault host and decrypted here with the read key printed on the vault's page. If the vault cannot be reached, the card says so and falls back to the copy served from this site.

### Claude Code on the web, with one repository attached

The shape this site is maintained from, which is why the grant could be measured rather than derived: thirteen of twenty rows were observed on the thing itself. Fifteen capabilities, six wanted, nine excess, seven of them with nothing but a setting or a sentence in the way. The mandate is the starting point the model site published, written to be argued with.

- **The next shapes are asked for, not invented.** The mailbox, the shared drive, the automation platform and the desktop app are the vaults a stranger recognises, and each needs a measured or documented grant first — [Lab 03](lab-abp-requests.html), request 2. They will appear here as they are published, derived, and not before.
- **Mandates are per product, not per agent — to begin with.** The mandate in a template is really the mandate for a resource: a repository attached to a coding agent, a mailbox connected to an assistant. That is what makes the shape library reusable: the second vault of a shape costs the length of the conversation that corrects the mandate.
- **A template carries no score, and neither will a corrected one.** Four counts, a barrier per row, and whose material each row touches. The number a buyer can move is the unbounded excess, and only a real control moves it.

## The same vault, at four altitudes.

Not every reader needs the tables. Each vault renders the same files at four levels of detail, and every level is derived from the same bytes — so the card on a home page and the row in an underwriter's spreadsheet cannot disagree.

### Four counts, no score

Grant, mandate, excess, unbounded — and the excess split by barrier. The shape of the Index card on the home page, with the one number that is not allowed removed. Above.

### Every row, with its barrier

The grant irreversible-first, the delta in its three lists, the licence's conditions next to what enforces each. On the vault's page, rendered live.

### The vault's own interface

A self-contained page inside the vault: the views above plus a correction screen that recomputes the delta as you move rows, and exports the corrected mandate. Embedded on the vault's page in a sandboxed frame, or opened in the vault browser.

### The bytes themselves

Markdown for people, JSON for machines, the pinned vocabulary, the history, and the two files you hand the agent. Cloned with one command from the read key.

## Ciphertext in, decrypted here, and always the current commit.

The vault API answers plain cross-origin GETs with no auth header, because what it returns is ciphertext under a key the server has never held. This page derives the vault's HEAD address from the read key, fetches the ref, the commit, the trees and the blobs it needs, and decrypts them in your browser. A push to the vault is live on the next page load — no rebuild of this site, no redeploy.

- **The viewer is the site's. The data is the vault's.** Every string from the vault is rendered as text, never as markup. The vault's own app runs only inside a sandboxed frame with an opaque origin, and is served its reads over a message channel. A vault can change what is shown on this page; it can never change what the page does.
- **Immutable objects are cached; the ref never is.** A stale ref would render an older commit from perfectly valid ciphertext and nothing would error, so the page fetches it fresh every time.
- **The read key is printed, on purpose.** It is derived one-way from the vault's write key and cannot be turned back into it. Anyone can clone the vault with it and check what this page says against what is there — which is the whole point of publishing it. No write credential is anywhere in this site, and a test fails the build if one lands.
- **The reader is copied, not fetched.** It is sgit.ai's house reader, about ninety lines, in this page's own source — the brief that documents it says to copy it rather than load it across origins at runtime, and we did.

The mechanism is written up at [sgit.ai — reading one file out of a vault](https://sgit.ai/docs/vault/reading-a-vault-file.html) and the rules for a site page at [reading a vault from a site page](https://sgit.ai/docs/briefs/sgit-ai-site-pages.html). The template and the generator that produced every vault here are in this site's repository; [Lab 07](lab-vault-delivered.html) is the record of the first one.

## Pick the shape closest to yours. Then correct the mandate.

Everything else in the vault is derived. The correction is the elicitation, and the corrected vault — with a name on the licence and no public key — is what is sold.
