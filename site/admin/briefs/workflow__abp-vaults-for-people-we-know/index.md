# A behaviour policy for everybody the lead talks to, made by an agent from a zip

> Rendered from docs/briefs/workflow__abp-vaults-for-people-we-know.md in the repository. The text below is that file.
> Source: https://riskmandate.ai/admin/briefs/workflow__abp-vaults-for-people-we-know/ · noindex · written by scripts/site/build-admin.mjs

**Date:** 24 September 2026 · **Author:** @website-agent · **Status:** ready to hand over

**Trigger:** the lead, 24 September 2026 (D18): *"I have a conversation with somebody and I
literally should go to this agent, give it a zip file … a URL and maybe a small description or
even a LinkedIn reference … the agent should then just go do some research and then create an
example of a policy so that I can send to them so they can see and they can beta test it …
our OKRs at the moment are all about getting users"*; and *"you need a vault to manage all the
keys … a vault to be the UI vault so we can reuse things … a data vault for each one … put some
controls in place so we don't leak things across … make the company vault in a way that we could
make it public."*

**Reads against:** `scripts/site/build-abp-vault.mjs` (the builder, which already takes a vault
directory from `ABP_VAULT_DIR`); `site/vaults/_app/` and the app vault `vbhmlulo` (v5); the
sixteen catalogue vaults in `site/vaults/index.json`; `docs/briefs/architecture__vaults-in-vaults-for-behaviour-policies.md`;
sgit's own help for `create`, `init`, `clone`, `vault show-key` and `vault derive-keys`, read
24 September 2026.

---

## 1. What this is for

Users. The product is ready and the objective this quarter is people trying it. A behaviour
policy about *someone else's* example deployment is a demo; one about *their* organisation, sent
the day after a conversation, is an invitation to correct it, which is the product's first
action. Every vault made this way is also a data point about what a person's vault should look
like, which nobody knows yet.

## 2. Three vaults, and why three

| Vault | Holds | Readable by | Changes |
|---|---|---|---|
| App vault `vbhmlulo` | The renderer. Already built, already loaded by every ABP vault through its loader | anyone, public read key | not by this work |
| Keys vault | `registry.json`: every person vault, its vault key (the write credential), read key, link, and what happened after it was sent; `people/<slug>/intake.md`: the lead's private notes | the lead, and an agent for one session | every session |
| Person vault | One ABP: one deployment's grant, a mandate and scenarios drafted for their business, `FOR.md`, `data/for.json` with every public source | whoever has the link | once, then as they correct it |

The UI the lead asked for already exists: it is the app vault. A data vault carries no renderer,
only a loader that fetches it, so a better UI reaches every person's vault on their next load
without touching any of them. That is also why the feedback loop in §6 can change the UI freely.

## 3. The controls that stop things leaking across

1. **One person, one folder, one vault.** `tools/new-person.mjs` copies a catalogue deployment's
   inputs, never another person's folder, and refuses a slug that exists.
2. **Private material has one home.** The lead's notes go to the keys vault's `intake.md`. They
   are never an input to the person's vault.
3. **A gate before every push.** `tools/check-person.mjs` fails if the vault names another
   person's slug, organisation or name; contains any key from the registry or another person's
   read key; contains anything shaped like a vault or write key, or any 64-hex string that is not
   the app vault's public read key; contains a line from the private intake; contains an email
   address or a personal LinkedIn link; or relies on a source without a URL and a date.
4. **Written as if public.** Everything about the person comes from their own public pages,
   dated. That is what makes publishing one later a decision, not a clean-up.
5. **Keys only in chat and in the keys vault.** The sgit token and the keys vault's key are given
   by the lead per session and held in environment variables. They are never written to a file,
   a commit or a person's vault.

## 4. The workflow, in one line per step

Intake to the keys vault → thirty minutes of public research → choose one of the sixteen
deployments, by evidence first and function second → `new-person` → tailor the mandate, six
scenarios, `FOR.md` and `for.json` → build and `--check` → `check-person` → push → register the
keys → hand the lead a link, a draft message and the three assumptions most likely to be wrong.
The commands are in the pack's `CLAUDE.md`.

The grant is never edited. It is the documented capability of the deployment, the same for
everybody who runs it, quoted from the vendor and dated. What is tailored is the mandate: what
this organisation would want the agent to do. That is also the part that is most likely wrong,
and the part the person is asked to correct.

## 5. The pack

`packs/dist/abp-for-people-pack.zip`, built by `scripts/packs/build-abp-people-pack.mjs` from
`packs/abp-for-people/` and from this repository's own builder, template, loader and the
catalogue deployments' inputs, so the agent runs exactly the code the site runs. The zip is
deterministic and CI fails if it is stale. It carries one fictional example, built and checked,
and no credential of any kind.

## 6. What we are trying to learn

Each registry entry records: sent, opened, replied, corrections, feedback, and whether it may be
published. Read across twenty of them, the questions are:

- **Does the reader start where we think?** `FOR.md`, the renderer's *Start here*, the mandate?
- **Is the mandate the right thing to ask them to correct,** or do they want to argue with the
  grant?
- **Is one deployment enough?** Or do people answer "we run three of these"?
- **Who do they forward it to?** Security, risk, the board. That says who the buyer is.
- **What gets in the way:** the vault app, the link, the vocabulary, the length.
- **What turns a reader into a user:** the store, a call, a corrected mandate.

The renderer lives in the app vault, so the answers can change it for everybody at once.

## 7. What this does not settle

- **Which host the links should use.** The pack uses `dev.vault.sgraph.ai`, as the site does.
- **Whether a person's vault may ever be listed on riskmandate.ai.** The registry records
  `publish`; the decision is the lead's, per vault, with the person's agreement.
- **How corrections come back.** Today, by reply to the lead, who pastes them to the agent. A
  form inside the vault is the obvious next step, and a question for the app vault.
- **More than one deployment per person.** One vault is one agent in one deployment, which is
  the ABP's definition. If people run several, a person may get several vaults; the registry
  already allows it.

## Decisions for the lead

1. **Create the keys vault** in the first session (the agent does it and gives you its key), or
   create it yourself beforehand. Recommended: let the first session do it, so the steps are
   exercised once with you watching.
2. **Who the draft message comes from.** The template leaves the sender blank.
