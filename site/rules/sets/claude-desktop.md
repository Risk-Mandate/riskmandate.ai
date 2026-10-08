# Rules for Claude Desktop, from riskmandate.ai

<!-- 7 rules: RM-R0001 v1.0.1, RM-R0002 v1.0.1, RM-R0004 v1.0.0, RM-R0005 v1.0.0, RM-R0012 v1.0.0, RM-R0015 v1.0.0, RM-R0020 v1.0.0. Source: https://riskmandate.ai/rules/ -->
<!-- Each line is a request to the agent, not a control: in the behaviour-policy vocabulary, an expectation. -->
<!-- The stronger setting or boundary for each rule, where one exists, is on its page. -->

- Do not read transcripts, logs or history from other sessions or conversations, including ~/.claude/projects and shell history files, unless I name the session and ask you to. (RM-R0001)
- Do not read, print, copy or use credentials, tokens, keys or .env files unless I ask for that specific one; if a task needs one, stop and tell me which and why. (RM-R0002)
- Before using any connector or connected account (mail, drive, calendar, chat, a code host), tell me which one and what you will do, and wait for a yes. (RM-R0004)
- Before sending any file, code or data to a host outside this project's usual tools (uploads, pastes, webhooks, unfamiliar APIs), tell me where and what, and wait for a yes. (RM-R0005)
- Ask before installing software, running anything downloaded from the internet, or changing system settings; say what it is and where it came from. (RM-R0012)
- Never edit your own settings, permission rules or hooks (such as .claude/settings.json), or change how much you ask me; tell me what you would change and why. (RM-R0015)
- Do not use my cloud, code-host or other command-line logins (aws, gcloud, az, gh, kubectl) to change anything; read-only commands I ask for are fine, anything else needs a yes. (RM-R0020)
