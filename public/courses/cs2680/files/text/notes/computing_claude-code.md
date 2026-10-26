---
title: Claude Code
source: https://cs2680.seas.harvard.edu/computing/claude-code.html
fetched: 2026-10-19T16:28:00+00:00
source_kind: harvard-cs2680-official
---

# Claude Code
CS2680 Modern AI Systems — Claude Code

CS2680 Modern AI Systems: Agents and System Optimizations

Claude Code: setup and what you submit

# Claude Code

[Assignment 1](../to_release.html) is done with **Claude Code**
(the CLI, the desktop app, or the VS Code extension, whichever you prefer), and its submission includes your
session files. Every later
[assignment](../assignments/index.html) uses it too, and each submission includes the session
files for that assignment's work. This page is how you get set up and what you hand in. It is one of four environments
under [computing setup](index.html), alongside [model API access](api.html), the
[HPC](cluster.html), and [AWS](aws.html).

# Getting your account

**Harvard FAS provides this, so do not buy a subscription.** Claude Code is included in
the Harvard Claude license, alongside Claude chat and the desktop app, and you sign in with HarvardKey. The
request form for FAS, GSAS and SEAS is on
[HUIT's Claude page](https://www.huit.harvard.edu/anthropic-claude).

**Do this in week one, not the night before Assignment 1 is due.** A license request is a
ticket that a human approves, so it does not clear instantly.

Two things worth knowing before you start. The **free Claude plan does not include Claude Code**
at all, so a free account will not get you through Assignment 1. Claude Code requires a Pro, Max, Team,
Enterprise or Console account, and the Harvard license is how you get one. If you already pay for Claude
personally, you can keep using that account provided you have the quota for it.

# Installing it

Three interfaces, one tool and one account behind all of them. Pick whichever you will actually use; you can
switch, and you can run more than one. Claude Code needs macOS 13+, Windows 10 1809+, or a current Linux, with
4 GB of RAM.

## Terminal (CLI)

The reference interface, and the one this page's commands assume. On macOS, Linux or WSL:

curl -fsSL https://claude.ai/install.sh | bash

On Windows PowerShell:

irm https://claude.ai/install.ps1 | iex

Homebrew (`brew install --cask claude-code`) and npm
(`npm install -g @anthropic-ai/claude-code`, needs Node 22+) also work; the native installer is
the one that auto-updates. Then check it:

claude --version
claude doctor

`claude doctor` prints installation and settings diagnostics without starting a session, and is
the first thing to run when something is wrong, and the first thing to paste when you ask for help.

## Desktop app

A graphical interface, no terminal required. Download it for macOS, Windows or Linux from the
[desktop quickstart](https://code.claude.com/docs/en/desktop-quickstart).

## VS Code extension

Open the Extensions view (`Cmd+Shift+X` on Mac, `Ctrl+Shift+X` otherwise), search for “Claude Code”, and install. It needs VS Code 1.94 or later, and it also
installs in VS Code forks including Cursor. See the
[extension docs](https://code.claude.com/docs/en/vs-code).

One thing to know if you go this route: the export commands below are CLI commands. The extension can open
a terminal session for you, or you can install the CLI alongside it and run them there. Both read
the same session history on your machine.

# Logging in

Run `claude` in a terminal. It opens a browser for you to sign in; use your Harvard account.
If the browser does not open, press `c` to copy the login URL and paste it in yourself. If the
browser shows you a code instead of returning to the terminal (common over SSH, in WSL, and in
containers), paste that code back at the prompt. On success the terminal says
`Login successful`.

Check what you are actually signed in as with `/status`, which shows the login method and the
account. `/login` re-runs the flow and `/logout` signs you out.

# What to submit with each assignment

[Assignment 1](../to_release.html) takes **three artifacts**: your code, the
write-up, and your Claude Code session files.

We collect these to understand how the class works with an agent (where people get stuck,
which habits pay, what the tool is doing badly), so that we can provide feedback and adjust the
course while it is running. **They may also be used in grading**, as the evidence behind the
process claims in your write-up.

Claude Code already keeps every session on disk, so rather than exporting conversations one at a time,
package the directory it keeps them in. Sessions are stored per working directory, under a name that is
your project's path with every non-alphanumeric character replaced by a hyphen, so
`/home/you/cs2680/assignment2` becomes `-home-you-cs2680-assignment2`. From your project directory,
this prints the right path:

echo ~/.claude/projects/$(pwd | sed 's/[^a-zA-Z0-9]/-/g')

Or just look at what is there and pick yours out with `ls ~/.claude/projects/`. Then archive
it, from inside `projects/` so the paths in the archive stay tidy:

cd ~/.claude/projects
tar -czf ~/cs2680/assignment2/a2-sessions.tar.gz ./-home-you-cs2680-assignment2

Use your own project directory and repository path in place of the examples. On Windows PowerShell,
`Compress-Archive -Path $env:USERPROFILE\.claude\projects\<dir> -DestinationPath $env:USERPROFILE\cs2680\assignment2\a2-sessions.zip`
does the same job. Commit the archive under the corresponding `assignmentN/` directory in your shared private course repository, for example `assignment2/a2-sessions.tar.gz`.

**That leading hyphen will bite you.** A project directory for an absolute path starts with
`-`, which `tar`, `zip`, `grep` and `du` all read as
the start of a command-line flag, so `tar -czf out.tar.gz -home-you-cs2680-assignment2` fails with
an unhelpful error. Prefix the name with `./`, as above, and everything works.

Include a directory for each place you did assignment work; if you worked in two repositories, that is two
directories. Inside, you will find one `.jsonl` file per session, a folder of overflow
`tool-results` for the larger ones, and a `memory/` folder of notes the agent kept
for itself. Leave all three in. The transcripts reference the tool results, and the memory notes are
some of the most interesting material in the archive. Expect tens of megabytes per assignment, compressing
to roughly a third of that.

**Your session history expires after 30 days by default.** Claude Code deletes session data
older than `cleanupPeriodDays` at startup, and the [final project](../project.html) runs for over five
weeks, so the sessions from the week you started can be gone by the week you submit. Either export as
you go, or raise the retention now by putting `{ "cleanupPeriodDays": 180 }` in
`~/.claude/settings.json`.

## Keep secrets and private information out of your sessions

You are handing these sessions to us, so treat a Claude Code session as something you will publish to an
audience of one. And note what the archive actually contains: not just what you typed, but every file the
agent read, every command it ran, and everything those commands printed. If Claude ever opened your
`.env`, that file's contents are in the transcript. This is a wider surface than a conversation
you can skim, which is why the scan below matters.

Before you start work, and again before you submit:

* **No credentials.** No passwords, API keys, tokens, SSH keys, HPC credentials or
  connection strings pasted into the chat. Keep them in environment variables or a `.env` file
  that is in your `.gitignore`, and let your code read them, which is what you should be
  doing anyway, and is the habit Assignment 2 will test.
* **No personal information.** Not yours (HUID, address, health or financial details), and in particular not anyone else's. If an Assignment 1 example task is the obvious candidate for
  this, because it touches your own real data, use synthetic or scrubbed records instead.
* **Nothing confidential that is not yours to share.** Unpublished work from a lab, another
  course's solutions, an NDA'd dataset.

**Scan before you archive.** From `~/.claude/projects`, against your own project
directory, noting the `./` again:

grep -rlE 'sk-[A-Za-z0-9\_-]{20,}|ghp\_[A-Za-z0-9]{36}|AKIA[0-9A-Z]{16}|BEGIN [A-Z ]\*PRIVATE KEY' ./-home-you-cs2680-a2

That catches the common shapes (OpenAI and Anthropic-style keys, GitHub tokens, AWS access keys,
PEM private keys) and prints the files containing them. It is a smoke test, not a guarantee: it knows
nothing about your database password or your lab's internal hostnames. Silence means the obvious things are
absent, not that you can skip thinking. The `memory/` folder is the one part short enough to read
properly, so read it.

# Turning on telemetry

Alongside the per-assignment upload, Claude Code can report usage
*metadata* continuously to a course collector. Please switch it on in week one and leave it on for
the semester. It gives me a picture of how the class is getting on while the course is still running rather
than three weeks after each deadline. It does **not** replace the session archive required with
each assignment.

Put this in **`~/.claude/settings.json`**, your user settings rather than a
project's `.claude/settings.json`, which would end up committed to a repo you push:

{
 "env": {
 "CLAUDE\_CODE\_ENABLE\_TELEMETRY": "1",
 "OTEL\_METRICS\_EXPORTER": "otlp",
 "OTEL\_LOGS\_EXPORTER": "otlp",
 "OTEL\_EXPORTER\_OTLP\_PROTOCOL": "http/protobuf",
 "OTEL\_EXPORTER\_OTLP\_ENDPOINT": "https://TBD.example.harvard.edu",
 "OTEL\_EXPORTER\_OTLP\_HEADERS": "Authorization=Bearer TBD",
 "OTEL\_RESOURCE\_ATTRIBUTES": "course=cs2680,term=fall2026"
 }
}

If the file already exists, merge the `env` block into it rather than overwriting the file. Do
this on every machine you work on, the HPC included. A node that cannot reach the endpoint simply reports
nothing.

## What this sends, and what it does not

You should be able to check this rather than take my word for it, so here is the whole of it. Each
request and each tool call produces a record carrying a timestamp, which tool ran, whether it succeeded
and how long it took, token counts, cost, the model, your Harvard email, and ids that group records into
a session.

**No prompt text, no code, and no command strings.** Content logging is off by default and
the course configuration above does not turn it on: the prompt field arrives as the literal string
`<REDACTED>`, and only its length is recorded. Nothing you type, nothing Claude writes,
no file contents, and no Bash commands leave your machine through this channel. That makes it a
*narrower* disclosure than the session archive you upload with each assignment, not a wider one.

See it for yourself before sending anything anywhere. Set
`"OTEL_METRICS_EXPORTER": "console"` and `"OTEL_LOGS_EXPORTER": "console"` instead of `"otlp"`, run a session, and Claude
Code prints its telemetry to your own terminal, exactly the records the collector would receive. The logs exporter is the one that carries the per-event records, so switching only the metrics exporter hides the very fields this section is about.
Switch them both back to `"otlp"` when you are satisfied.

## How it is used

For feedback and for steering the course: which tools the class leans on, where sessions fail, what an
assignment actually costs in tokens. It is **not** an attendance or effort record.
Timestamps show when people work, and I am not grading anyone on working late or on how many prompts they
sent. Prompt counts have no right answer, and a metric that had one would just become a target.
Grades come from the submitted work.

If you would rather not run it, tell me and that is the end of it. It costs you nothing in the
grade, and the per-assignment archive already covers what the assignments are marked on. Do say so
though, because a machine sending nothing looks the same from here as a machine that was never set up.

# Related

* [Computing setup](index.html). The model API, the HPC, and AWS, and which assignment needs
  which.
* [HPC](cluster.html). How to run the agent in an interactive job instead
  of on a login node that will kill it.
* [Assignments](../assignments/index.html). The five specs this applies to.
* [AI use policy](../policy.html#ai-policy). Disclosure, ownership, and this submission
  requirement.
* [Claude Code setup docs](https://code.claude.com/docs/en/setup) and [installation troubleshooting](https://code.claude.com/docs/en/troubleshoot-install). The authoritative versions, kept current.
* [Tracking usage and cost](https://code.claude.com/docs/en/costs). If you want to watch what your own sessions cost.
