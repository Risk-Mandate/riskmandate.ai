# Instances — a customer's copy of a template, built here and never deployed

A template vault under `site/vaults/` is the draft for a deployment shape, public, with a
published read key. An **instance** is one organisation's copy of it: `status` moves from
`template` to `draft` when the copy is made, and to `corrected` when the mandate has been
elicited from the deployer and a named owner has signed the licence. An instance is delivered
as a private vault with no public key. It is not served from this site.

This folder holds instances built with the same generator, so the derivation is checked the same
way, without putting them under `site/`:

```
ABP_VAULT_DIR=vaults-instances/<slug> node scripts/site/build-abp-vault.mjs <slug>
ABP_VAULT_DIR=vaults-instances/<slug> node scripts/site/build-abp-vault.mjs <slug> --check
```

The template, the vocabulary, the catalogue and the app vault are still read from
`site/vaults/`; only the vault directory moves. CI does not build this folder. The push to a
private vault needs a write key the lead holds; the folder is what gets pushed.

**What may be committed here.** Only an instance with the organisation's name withheld and no
customer words in it beyond what the deployer has agreed to publish. A real customer's corrected
mandate is theirs; it goes into their vault and not into this repository. The instance below is
the draft *before* correction, which is why it can be here: it is what the customer receives to
correct, and the point of publishing it is to show the workflow.

| Instance | Template | Status | What it is |
|---|---|---|---|
| `claude-gmail-connector--customer-draft` | `claude-gmail-connector` | draft | the copy made for one customer after the call of 16 September: Claude in the browser, the Gmail connector, one mailbox. The mandate is the draft they correct; the questions to ask them are in `data/mandate.json` → `notes` |
