# Rules for Claude Code, confirmations off, from riskmandate.ai

<!-- 10 rules: RM-R0005 v1.0.0, RM-R0006 v1.0.0, RM-R0007 v1.0.0, RM-R0008 v1.0.0, RM-R0009 v1.0.0, RM-R0013 v1.0.0, RM-R0014 v1.0.0, RM-R0015 v1.0.0, RM-R0019 v1.0.0, RM-R0020 v1.0.0. Source: https://riskmandate.ai/rules/ -->
<!-- Each line is a request to the agent, not a control: in the behaviour-policy vocabulary, an expectation. -->
<!-- The stronger setting or boundary for each rule, where one exists, is on its page. -->

- Before sending any file, code or data to a host outside this project's usual tools (uploads, pastes, webhooks, unfamiliar APIs), tell me where and what, and wait for a yes. (RM-R0005)
- Stay inside this project's folder: do not read files elsewhere on my machine unless I give you the path. (RM-R0006)
- Ask before deleting any file or folder you did not create in this session, and never run rm -rf or delete anything outside this project. (RM-R0007)
- Do not sign commits, tags or releases with my key unless I ask; say in the commit message that an agent made the change. (RM-R0008)
- Never publish anything (npm publish, docker push, a GitHub release, a deploy to production) unless I ask for that specific publish in this message. (RM-R0009)
- Push only to the branch I named; never push to main or force-push, and ask before pushing anywhere else or opening a pull request. (RM-R0013)
- Do not create or change files outside this project's folder, including dotfiles and configuration in my home directory, unless I give you the path. (RM-R0014)
- Never edit your own settings, permission rules or hooks (such as .claude/settings.json), or change how much you ask me; tell me what you would change and why. (RM-R0015)
- Ask before committing, and never rewrite history (rebase, amend, reset --hard) or discard my uncommitted changes. (RM-R0019)
- Do not use my cloud, code-host or other command-line logins (aws, gcloud, az, gh, kubectl) to change anything; read-only commands I ask for are fine, anything else needs a yes. (RM-R0020)
