# The stories vault, as it starts

`seed/` is the content the stories vault is born with: the Email-FS-lite folders for three
parties, one brief each, the publisher's first messages and tasks, and the board that draws
them. It carries no credential. The vault itself is external state (rules of engagement §4):
the lead creates it and gives the key and a push token in a session, never in a file.

The design is in `docs/briefs/architecture__the-stories-vault-and-the-three-way-workflow.md`.
The tooling is `scripts/stories/mail.mjs`; run it with no arguments for the commands.

## The birth

```bash
cd "$SCRATCH" && sgit clone "<key>" stories-vault
cp -r "$REPO/stories-vault/seed/." stories-vault/
mkdir -p stories-vault/published && cp "$REPO"/site/stories/*.json stories-vault/published/ && cp -r "$REPO/site/stories/images" stories-vault/published/
node "$REPO/scripts/stories/mail.mjs" board --vault stories-vault
cd stories-vault && sgit commit "@Publisher check-in: …" && sgit push --token "<token>" && sgit status
```

## A check-in, afterwards

```bash
cd "$SCRATCH/stories-vault" && sgit pull
node "$REPO/scripts/stories/mail.mjs" deliver --vault . && node "$REPO/scripts/stories/mail.mjs" status --vault .
# read mail/publisher.claude/inbox/; act; publish through the usual merge if the lead accepted something
node "$REPO/scripts/stories/mail.mjs" board --site --vault .      # then build-stories.mjs in the repository
sgit commit "@Publisher check-in: …" && sgit push --token "$STORIES_TOKEN" && sgit status
```

After the birth the vault is the source and `seed/` is not updated; it is what the vault
started as.
