---
description: End the session cleanly — checks green, work file current, onboarding docs not stale, a final message the next agent can start from
---

Close out this session.

1. `npm run check`. If red, fix it or say exactly what is red and why in the final message.
2. `git status` clean, everything committed and pushed to this branch with `git push -u origin <branch>`.
3. `.claude/work/<branch>.md`: current. If the branch merged, delete it. If not, it says what is
   done, what is not, which vaults are built and unpushed, and what the next agent should do first.
4. Anything you changed that `.claude/onboarding/` describes: the description updated in the
   same push. `03-state-and-next.md` if the state moved.
5. Final message, in this order: what shipped (with page names and the version if one was cut),
   what was not done and why, what needs the lead (keys, decisions, pushes to vaults), and the
   one thing the next agent should read first.
