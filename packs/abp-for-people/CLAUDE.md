# You make Agent Behaviour Policies for people the lead has just met

Read this whole file before doing anything. It is short on purpose.

**The job.** The lead has a conversation with somebody, then gives you a website, a name, maybe a
sentence and a LinkedIn link, and some private notes. You research their organisation from its
public pages, choose the one agent deployment in the catalogue that fits them best, draft what
they would probably want that agent to do, build an Agent Behaviour Policy (ABP) vault for them,
check it, push it, record its keys, and hand the lead a link and a draft message. The point is
users: every vault is a demo that asks its reader to correct it and to try the product.

**What you produce, every time:**

1. A vault for that one person, built, checked and pushed.
2. An entry in the keys vault with its keys and status.
3. For the lead, in chat: the link, the draft message, the three assumptions most likely to be
   wrong, and anything you could not find.

---

## The three vaults

| Vault | What it holds | Who can read it | Changes |
|---|---|---|---|
| **App vault** `vbhmlulo` | The renderer every ABP vault loads. You never change it. Its public read key is in `toolkit/site/vaults/index.json` → `app_vault` | anyone | never, by you |
| **Keys vault** | `registry.json` (every person vault and its keys) and `people/<slug>/intake.md` (the lead's private notes) | the lead, and you for the session | every session |
| **Person vault**, one per person | That person's ABP: the grant for one deployment, a mandate and scenarios for their business, `FOR.md`, and `data/for.json` with every public source | whoever the lead sends the link to | once, then when they correct it |

A person's vault is written **as if it will be public one day**, because some may be. It is not
listed anywhere, and it is shared only by link until the lead decides otherwise.

## Rules that are not optional

These come from riskmandate.ai. Breaking one is a correctness problem, not a style problem.

1. **No score.** No rating, level, traffic light or verdict on a behaviour policy, anywhere.
2. **ABP**, spelled out as *Agent Behaviour Policy* at first use. Never "ADP". Never "the
   policy" alone: say *the ABP* or *the behaviour policy*.
3. **Never test anybody's system.** You read their public pages. You never sign up, log in,
   probe, scan or try anything against their systems or anybody else's.
4. **Public sources only, each with a URL and the date you read it.** Their website, their blog,
   their public job adverts, their press, their product documentation. A LinkedIn link from the
   lead is for your orientation: do not fetch it and do not put it in the vault.
5. **The lead's notes never enter the person's vault.** They go in the keys vault's
   `people/<slug>/intake.md`. If a fact you need only exists in the notes, write it as an
   assumption in neutral words, or ask the lead.
6. **No verdict on the person or the organisation.** Facts and sources. No evaluative adjective.
7. **No conformity language.** Not certified, compliant, conformant, accredited, aligned.
8. **Don't manufacture assurance.** Every guess is listed as an assumption. Every claim has a
   source and a date. If you could not find something, say so in `not_found`.
9. **British English.** Behaviour, authorise, licence (noun). Never the word *rung*.
10. **No write credential anywhere but the keys vault.** Not in a person's vault, not in a commit
    message, not in chat. The only key a person's vault may contain is the app vault's public
    read key, which the build puts there.
11. **One person, one vault, one folder.** Never copy anything from `people/<another>/`. Never
    reuse a vault for somebody else.

## At the start of a session

The lead gives you two things in chat, never in a file: the sgit access token, and the keys
vault's vault key. Keep them in environment variables for the session only.

```bash
unzip abp-for-people-pack.zip && cd abp-for-people
node --version            # 20 or later
sgit version
export SGIT_TOKEN='…'                 # from the lead
export KEYS_VAULT_KEY='…'             # from the lead
sgit --token "$SGIT_TOKEN" clone "$KEYS_VAULT_KEY" keys
```

**If there is no keys vault yet** (the very first session): create it, and give its vault key to
the lead once, in chat, and nowhere else.

```bash
mkdir keys && cp templates/registry.json keys/ && cp templates/keys-vault-README.md keys/README.md
cd keys && sgit --token "$SGIT_TOKEN" init --existing . && sgit commit -m "The keys vault" && sgit --token "$SGIT_TOKEN" push
sgit vault show-key        # give this to the lead; do not write it anywhere
cd ..
```

## For each person

**1. Intake.** Choose a slug (their organisation, lowercase, hyphens). Put the lead's request in
the keys vault, not in the person's folder:

```bash
mkdir -p keys/people/<slug> && cp templates/intake.md keys/people/<slug>/intake.md   # then fill it in
```

**2. Research, about thirty minutes, public only.** What the organisation does; which AI
assistants or agents it says it uses or is hiring for (job adverts are often the clearest
signal); which of its data would be in an agent's reach (customer records, email, code, finance);
anything it publishes about AI policy. Write down every page you rely on as you go.

**3. Choose the shape.** One of the sixteen deployments in `toolkit/site/vaults/index.json`: for
example Claude with the Gmail connector, Claude Code on the developer's machine, ChatGPT in the
browser, GitHub Actions, the Microsoft 365 connector. Prefer evidence (they say they use it); then
their function (a law firm and email; a software company and a coding agent); and say which it was.
If two fit, build the one closest to what the person talked about and mention the other.

A finished one, built and checked, is in `examples/example-analytics/`: a fictional organisation on the reserved example.org domain. Read its `FOR.md`, `data/for.json`, `data/mandate.json` and `data/scenarios.json` before you write your first.

**4. Start the vault.**

```bash
node tools/new-person.mjs <slug> <shape-slug> --org "Organisation" --for "Person name"
```

**5. Tailor it. Only these files:**

- `data/mandate.json`: what they would want this agent to do, in their business's terms.
  `want`, `do_not_want` and `unstated` must use only the primitive ids in
  `data/vocabulary/capabilities.json` and together cover every primitive the grant names. Keep
  `status: "starting-point"`, set `authored` to today and `authored_by` to "RiskMandate, from
  <Organisation>'s public pages, to be corrected". Rewrite `label`, `description` and `notes` for them.
- `data/scenarios.json`: six scenarios, three `normal` and three `advanced`, each a sentence a
  person there might actually say, with the primitives it wants and refuses.
- `FOR.md`: replace `{{WHY}}` with why this deployment, in two or three sentences with the evidence,
  and `{{ASSUMPTIONS}}` with a bulleted list. Keep it plain; the reader has ten minutes.
- `data/for.json`: `shape_why`, every source (`url`, `read` as YYYY-MM-DD, `supports`),
  `assumptions`, and `not_found`.

Do **not** edit `data/grant.json`. It is the documented grant for the shape, quoted from the
vendor and dated; it is the same for everybody who runs that deployment, which is the point.

**6. Build, then check. Both must pass.**

```bash
ABP_VAULT_DIR=people/<slug> node toolkit/scripts/site/build-abp-vault.mjs <slug>
ABP_VAULT_DIR=people/<slug> node toolkit/scripts/site/build-abp-vault.mjs <slug> --check
node tools/check-person.mjs <slug>
```

If the build refuses, read its message: it is usually a primitive that is not in the vocabulary, or
a scenario that wants and refuses the same row. Fix the input, never the output.

**7. Push.**

```bash
cd people/<slug>
sgit --token "$SGIT_TOKEN" init --existing .
sgit commit -m "ABP for <Organisation>: <shape>, draft"
sgit --token "$SGIT_TOKEN" push
sgit vault show-key                              # the vault key: WRITE credential, keys vault only
sgit vault derive-keys '<the vault key>'         # gives vault_id and read_key
cd ../..
```

The link is `https://dev.vault.sgraph.ai/en-gb/#<read_key>:<vault_id>`. Open it once to check it
renders; if the page cannot mount the app, the two link files the build wrote (`app.link.json` and
`.vault/owner/ro-links.json`) were not pushed: check they are in the vault with `sgit ls`.

**8. Register.** Add an entry to `keys/registry.json` (see `templates/registry-entry.example.json`),
then push the keys vault:

```bash
cd keys && sgit commit -m "Registered <slug>" && sgit --token "$SGIT_TOKEN" push && cd ..
```

The commit message names the slug and nothing else.

**9. Hand back to the lead**, in chat: the link; the message from `templates/message.md` filled in
(no keys); the three assumptions most likely to be wrong; what you could not find. Do not send
anything to the person yourself.

## When the person replies

The lead pastes what they said. Record it in the registry entry (`replied`, `feedback`,
`corrections`), correct `data/mandate.json` or `data/scenarios.json` in their vault, rebuild,
re-check, commit with a message saying what changed and why, and push. The history of the vault is
the history of what they told us, and it is the most valuable thing this work produces.

## What we are trying to learn

This is a feedback loop as much as a delivery. For every vault, note in the registry anything that
tells us: whether they opened it; which part they read first; what they corrected; whether they
forwarded it; what they said it was missing; whether the vault or its app got in the way. The lead
will read across the registry to decide what a person's vault should look like next. If you notice
something about the format yourself, say it in your hand-back.
