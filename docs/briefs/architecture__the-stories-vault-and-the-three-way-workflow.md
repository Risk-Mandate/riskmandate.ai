# The stories vault: how the lead, a studio model, this site's agent and the site work together

**Date:** 26 September 2026 · **Author:** @website-agent · **Status:** designed and seeded; the vault is not born

**Trigger:** the lead, 26 September 2026, after v1.34.18 shipped: *"refactor all this so that it's in a folder called stories … a link from … one of the top menus … we're going to start creating a vault for this … once you get the vault ID … add Email-FS-lite to that so you guys can communicate … the architecture is going to be that you are the one that can connect the dots between the vault and the live website … you are the one that reads the information from the vault and put it there … start sending messages to the other vault … explore … running that on a schedule so that we can start to issue requests that eventually get created … you create the plans, you create the mapping, and then you need to have a Kanban board … the next time the ChatGPT run, which probably should be a session … maybe project item or even visualization … let's start to map out how we're going to work between you, me, ChatGPT, which can read the vault, and then the website."*

**Reads against:** sgraph.ai's Email-FS-lite pages (`/en-gb/library/how-it-works/email-fs-lite` and its seven diagrams, read 26 September 2026); the sgit skill (sgit-ai 0.16.0 installed here); the vault-app authoring contract (vault-html-app skill, verified against app-shell 0.2.3); `CLAUDE.md`; `.claude/onboarding/04-rules-of-engagement.md` §4 on external state; the stories section as shipped in v1.34.18 and moved in v1.34.19.

---

## 1. The four parties, and the one that touches two things

| Party | Name in the vault | Holds | Reads | Writes |
|---|---|---|---|---|
| The lead | `dinis.human` (@Dinis) | the decisions, the vault key, the push token | everything | its own folder; a reply, by hand or dictated |
| The studio | `studio.chatgpt` (@Studio) | the image models, the drafts | everything | its own folder: storyboards, drawn panels, proposals |
| The publisher | `publisher.claude` (@Publisher), the agent in this repository | the site's rules and its build | the vault, the repository | its own folder in the vault; `site/stories/` in the repository; the board |
| The site | riskmandate.ai/stories/ | what was accepted | — | nobody: it is deployed from `dev` |

The publisher is the only party that reads the vault and writes the site, and the only one that reads the site and writes the vault. That is the "connect the dots" role the lead described, and it is deliberately narrow: it moves accepted work in one direction and the published record in the other, and it keeps the board honest. It does not decide.

## 2. The vault

One sgit vault, created by the lead (the studio's session is making it as this is written). Zero-knowledge: the server never sees plaintext. Its layout is Email-FS-lite's, plus two folders of ours:

```
README.md                                the one rule, the message shape, the check-in
mail/
  mailroom/<recipient>/                  transit: senders create, the recipient moves
  <agent>/inbox/  done/  outbox/<to>/    the agent's own zone
  <agent>/issues/open|blocked|done/      the agent's own tasks, markdown with front matter
  <agent>/files/<story-slug>/            deliverables: a drawn panel, a revised story file
  sessions/<agent>/brief.md  notes.md    the standing brief; the append-only log
stories/                                 the published data, mirrored from site/stories/
board/board.json  board/index.html       derived; drawn inside the vault
```

**Single-writer.** Every path has one owner. The mailroom is the one place an agent writes for somebody else, and only the recipient moves a message out of it. This is what lets three parties who never share a session work in one vault without merge conflicts, and it is why the board can be derived rather than maintained.

**Immutable messages.** A message is an RFC 2822 `.eml` file, numbered globally (`NNN-subject.eml`, the next number after the highest anywhere under `mail/`), written twice: to the recipient's mailroom and to the sender's outbox. It is never edited. It moves: mailroom → inbox (delivered) → done (the work it asked for is finished). Three folders, three observable states, no read receipt needed: when the mailroom copy is gone, it was delivered.

**One commit per check-in.** A round of work is one commit whose message starts `@Alias check-in:`. `sgit history log` is then the record of who did what and when, which is the property the lead asked for when he said each run should be its own session: a session is a commit.

## 3. The tooling, and where the key lives

`scripts/stories/mail.mjs` is the protocol in one file with no dependencies: `init`, `send`, `deliver`, `done`, `issue open|block|unblock|close`, `board`, `status`. It takes `--vault <clone>` or `STORIES_VAULT`, and `--me` or `STORIES_ME` (default `publisher.claude`). Nothing in it talks to the network; `sgit pull`, `commit` and `push` are run around it. The board command derives `board/board.json` from every agent's issues and every message still in a mailroom, re-inlines it into `board/index.html` so the vault app renders without a readable path, and with `--site` writes `site/stories/board.json` for the stories page.

The vault key, the secret and the vault id together, and the push token are credentials. They live in the chat where the lead gives them and in the environment where a scheduled run needs them (`STORIES_KEY`, `STORIES_TOKEN`), and nowhere in a file. Rule 10 of `CLAUDE.md` is tested on `site/`; the same rule is kept by hand for the rest of the tree. `stories-vault/seed/` in this repository is the vault's content at birth and carries no credential; the clone the publisher works in lives outside the repository.

## 4. The seed: what is already written

The vault does not exist yet, so its first content was written here, under `stories-vault/seed/`, ready to copy in:

- the vault's `README.md`, and one brief per party under `mail/sessions/`;
- five messages from the publisher, in its outbox and in the recipients' mailrooms: to the studio, *How we work in this vault*, *Just a little research: panel 3, the key not the padlock*, *Tidy my calendar: the first storyboard to draw*, *The one who signs: propose three, and two names for Dev*; to the lead, *Two decisions: a name for Dev, and who signs*;
- five tasks in the publisher's issues: S01 the move under `/stories/` (done), S02 the vault's mailboxes (blocked on the key), S03 publish what the studio sends (open), S04 the check-in on a schedule (blocked on the key and a token in the environment), S05 stories.sgit.ai (open, low);
- the board, derived from those, and the page that draws it.

The stories page's section 06 renders the same board, so the lead can read it on the site before the vault exists. It says so.

## 5. The birth, in commands

When the lead gives the vault key and the token (in the chat, not a file):

```bash
cd "$SCRATCH" && sgit clone "<key>" stories-vault             # outside the repository
cp -r "$REPO/stories-vault/seed/." stories-vault/                     # folders, briefs, messages, issues, board
mkdir -p stories-vault/stories && cp "$REPO"/site/stories/*.json stories-vault/stories/ && cp -r "$REPO/site/stories/images" stories-vault/stories/
node "$REPO/scripts/stories/mail.mjs" board --vault stories-vault
cd stories-vault && sgit commit "@Publisher check-in: the mailboxes, the briefs, five messages, five tasks, the published stories, the board" && sgit push --token "<token>" && sgit status
```

Then S02 closes, and the publisher's work file says which vault was pushed and why (rule of engagement §4). If the studio's session has already put content in the vault, the seed is copied beside it, not over it: the only shared paths are `README.md`, which is merged by hand, and the mailroom, which is append-only.

## 6. The check-in, and the schedule

The publisher's check-in is in its brief (`mail/sessions/publisher.claude/brief.md`), as commands. By hand it is one session: pull, deliver, read, act, publish if something was accepted, reply, board, commit, push, status.

On a schedule it is a Routine in this environment that starts a fresh session with a standalone prompt: clone the vault with the key from the environment, run the check-in, and if a story or a panel was accepted by the lead, publish it as a patch release through the merge workflow. The first cadence to try is once a day on weekdays; the interval is the lead's, and a run that finds nothing new should commit nothing and say nothing. Two things have to be true first: the key and the token are in the environment's secrets, and the lead has said which decisions the routine may act on alone (publishing what he accepted by message) and which it may not (adding to the cast, changing a punchline). Until then, S04 stays blocked and the check-in is run by hand at the start of a session.

## 7. The board as the plan

The lead asked for a Kanban board and for the next set of tasks to be defined before each studio run. In this protocol the board is not a thing anybody edits: it is the union of every party's `issues/` folders in their three states, plus every message still waiting in a mailroom as *requested* work for its recipient. Four columns, requested → open → blocked → done. A card moves because a file moved. The studio's next set of tasks is therefore whatever is in its mailroom and its open folder when its session starts, and the publisher's job before each run is to make sure that is exactly what should be there.

Two views of the same file: `board/index.html` inside the vault (the visualisation the lead mentioned, rendered from `board.json` with an inlined copy for the vault's preview), and section 06 of the stories page, regenerated by the site build. Neither is hand-drawn.

## 8. What this does not settle

- **How the studio writes.** The lead said ChatGPT can read the vault. Whether its session can commit and push, or whether the lead relays its files, decides whether `studio.chatgpt` is an agent or a mailbox the lead operates. The seed works either way; the brief for the studio is written for the first case.
- **Who pushes.** The rules of engagement say vault pushes need the lead's key. For this vault the publisher pushes on the lead's behalf with a token given in the session; that is the same arrangement as the ABP vaults, stated here so it is not a surprise.
- **The interval and the authority of the scheduled run** (§6).
- **stories.sgit.ai.** The data files are shaped for it; nothing else is started.
- **The seed's future.** After the birth, the vault is the source and `stories-vault/seed/` is a record of what it started as. Whether to keep mirroring the publisher's zone back into the repository, for the console to render, is a later call.
