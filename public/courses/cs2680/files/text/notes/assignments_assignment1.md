---
title: Assignment 1 — Experience a coding agent (10%)
source: https://cs2680.seas.harvard.edu/assignments/assignment1.html
fetched: 2026-10-19T16:28:00+00:00
source_kind: harvard-cs2680-official
---

# Assignment 1 — Experience a coding agent (10%)
CS2680 Modern AI Systems — Assignment 1: Experience a coding agent

CS2680 Modern AI Systems: Agents and System Optimizations

Assignment 1 — Experience a coding agent

# Assignment 1 — Experience a coding agent (10%)

**Out** Wed Sep 2 · **due** Sun Sep 20, 11:59pm · individual ·
[all five assignments](index.html)

Build a web page that drives [Claude Code](../computing/claude-code.html): you type
a request, the agent works on a directory of your choice, and the page shows you what it is doing while it
does it.

The assignment is deliberately small, and it is the one assignment nothing later in the course is measured
against. Serving it on your own machine is enough. This is a creative task. Part 2 fixes what the page must do; how it looks and how it works are yours to
design, and the interesting decisions (what a run in progress should look like, how much of a tool result to
show, how a failure should read) are exactly the ones the spec leaves open.

All five assignments submit code through one private GitHub repository shared with the teaching fellows;
this assignment lives in its `assignment1/` directory. See
[Deliverables](#deliverables).

**Build the frontend with Claude Code too.** It is the fastest way to get a working page, and
watching the agent build it teaches you what the page should show.

## Learning goals

* Use Claude Code to build working software.
* Drive an agent programmatically (headless mode and its event stream) rather than only interactively.
* Watch a trajectory as it happens: what the agent reads, what it runs, and what that costs.

## Part 1 — Drive Claude Code from a terminal

**Headless mode.** Claude Code runs non-interactively when invoked with `-p`, and
with `--output-format stream-json` it prints one JSON event per line as the run proceeds (in
print mode, this output format also requires `--verbose`). The stream is an init event, then
assistant messages and tool calls and their results, then a final result event carrying
`total_cost_usd`, `duration_ms`, `num_turns`, and the
`session_id`. A minimal run, with the events trimmed to their load-bearing fields:

```
$ claude -p "Say hello in one short sentence." --output-format stream-json --verbose
{"type":"system","subtype":"init","session_id":"fe891e8a-…","cwd":"…","model":"…","tools":[…],…}
{"type":"assistant","message":{"role":"assistant","content":[{"type":"text","text":"Hello! How can I help you today?"}],…},…}
{"type":"result","subtype":"success","num_turns":1,"duration_ms":4333,"total_cost_usd":0.137852,"session_id":"fe891e8a-…",…}
```

A prompt that makes the agent work (e.g. “read main.py and add a `--help` flag”)
interleaves more assistant events whose content is `tool_use` blocks, and user events carrying the
matching `tool_result`; those are what your page will render. Passing the result event's
session id back (`claude -p --resume <session-id> "<follow-up>" …`) continues the
conversation. See the
[headless mode documentation](https://code.claude.com/docs/en/headless).

Before writing any web code, run this in a terminal against a scratch directory and read the events it
prints, because the frontend you build in Part 2 is a renderer for exactly this stream. Then save one
complete run to a file
(`claude -p "<prompt>" --output-format stream-json --verbose > events.jsonl`); it becomes
your test input in Part 2.

**Turn on auto-accept so runs are not stopped by permission prompts.** By default, Claude Code
asks before editing a file or running a command. In an interactive session, press Shift+Tab to switch into
auto-accept mode. In a headless run there is nobody to ask, so requests that need approval are refused
instead: start the run with `--dangerously-skip-permissions` to auto-approve everything (the
right choice against a scratch directory), or with `--allowedTools` (e.g.
`--allowedTools "Edit" "Bash(pytest:*)"`) to auto-approve only the named tools, and pass the
same flag when your Part 2 server spawns the agent.

**Authenticate with your Harvard login, and do not use the Agent SDK or an API key.** Headless
mode reads the same stored credential as interactive Claude Code, so the
[Harvard login](../computing/claude-code.html) you already have is the whole setup. The Agent SDK
is the wrong tool here for two reasons. First, Anthropic's
[usage policy](https://code.claude.com/docs/en/legal-and-compliance)
directs SDK use to API keys from Claude Console, which the course does not provide. Second, an exported
`ANTHROPIC_API_KEY` takes precedence over your Harvard login, so setting one silently bills your
own account.

## Part 2 — The frontend

Now put a web page in front of what you just ran: your server spawns the Part 1 command as a subprocess,
forwards its events to the browser, and keeps the session id so a follow-up prompt can resume. The page needs
seven features. Each is stated as what the page must
do; how it does it is yours to decide. The sketch under each feature shows the behavior it requires, not a
design you must copy.

1. **Submit a prompt.** A text box sends your request to Claude Code, which runs against a
   working directory you choose, and the page can start another run when the first finishes.

   working directory

   ~/scratch/demo-repo

   find the bug that makes test\_parse fail and fix it

   Run
2. **Show the trajectory live.** The trajectory is what the agent did, event by event: the
   assistant's text, and every tool call with its name and input (reading `parser.py`, running
   `pytest`, editing a file). Render each event when it arrives, not after the run ends. The
   assistant's text is usually markdown, so render it as formatting rather than showing the raw markup.

   running
   The test expects a trailing newline. I will read the parser first.

   Read
   tests/test\_parse.py
   ✓

   Bash
   pytest -x
   ✓

   Edit
   src/parser.py

   pending
3. **Show tool results.** Each tool call's result appears with it, and long ones are cut down
   deliberately (a test log can run thousands of lines, and a page it buries is a page nobody reads). How much
   to show and how to fold the rest is a design decision you should make.

   Bash
   pytest -x
   ✓

   FAILED tests/test\_parse.py::test\_parse
   ValueError: unexpected token ')'
   ▸ 87 more lines, folded
4. **Show status, per tool call and per run.** Status lives at two levels, and the page shows
   both, the way the Claude Code terminal does. (1) Per tool call: a call is pending from the moment its
   `tool_use` block arrives until the matching `tool_result` attaches (the two share
   the call's id), and a result that reports an error is visibly one. (2) Per run: the agent works
   autonomously until the final result event ends the round, so show whether the run is in progress,
   finished, or failed, and a failing run (a bad directory, an agent error) produces a visible error rather
   than a page that waits forever.

   during the run · per tool call

   Bash
   pytest -x
   ✓

   Edit
   src/parser.py

   pending

   the round ends · per run
   All 12 tests pass.
   ✓ finished

   a failing run

   You
   start a run in /bad/path
   ✕ failed

   Error: /bad/path is not a directory (exit 1)
5. **Continue the conversation.** A follow-up prompt resumes the same session, so the agent
   keeps its context from the previous turn.

   You
   add a --json flag to the CLI
   ▸ 23 events, folded
   Added the --json flag and updated the tests.
   ✓ finished
   $0.58 · 42 s · 12 turns · session\_id fe891e8a-…

   You
   now update the README for it

   running
   resumed session fe891e8a-…
6. **Show the run's numbers.** When a run finishes, display its cost in dollars, its wall-clock
   duration, and its number of turns. Claude Code reports all three in its final result event, so this is a
   display feature, not a measurement exercise.

   Added the --json flag and updated the tests.
   ✓ finished
   $0.58 · 42 s · 12 turns · session\_id fe891e8a-…
7. **Show the trajectory as a tree.** The event sequence you rendered in feature 2 is not
   always flat: Claude Code can delegate work to subagents, and every event a subagent emits carries a
   `parent_tool_use_id` naming the tool call that spawned it (events from the main agent carry
   `null` there). Nest each subagent's events under that tool call, collapsible so a long subagent
   run does not bury the main agent's events, and keep a run with no subagents rendering as the flat list of
   feature 2. In addition, show an outline of the whole trajectory beside the dialogue, just the call names,
   like a table of contents, so the reader can survey the run and jump to a call. Whenever the window is
   wide enough, the outline is displayed alongside the dialogue rather than as a strip fixed to the top of
   the page; on a narrow window it may fold away. Beyond
   these two views, you are welcome to design a better visualization of the trajectory.
   Subagents appear only when a run uses one,
   so demonstrate this with a prompt that asks for one (“use a subagent to survey this
   directory”).

   Bash
   pytest -x
   ✓

   Tasks

   Task
   survey this directory

   Read
   src/parser.py
   ✓

   Grep
   "TODO"
   ✓
   A small parser package with one failing test.

   Task
   summarize the README
   · 4 events collapsed

   Edit
   src/parser.py
   ✓

   outline

   Bash

   Task

   Task

   Read

   Grep

   Edit

**Put together, the seven features are one page.** The sketch below shows one possible whole:
a first run that finished with its numbers, a second run resumed from the same session and still in
progress, one tool result expanded and folded, and a subagent nested under its Task call. It shows the
behavior, not a design you must copy.

outline

Read

Read

Grep

Edit

Bash

Read

Edit

Bash

Edit

Bash

Bash

You

Read

Task

Task

Read

Glob

Grep

Read

Edit
working directory

~/scratch/demo-repo

You
add a --json flag to the CLI
▸ 23 events, folded
Added the --json flag and updated the tests.
✓ finished
$0.58 · 42 s · 12 turns · session\_id fe891e8a-…

You
use subagents to survey the repo, then update the README

running
resumed session fe891e8a-…
I will run two surveys, then edit the README.

Read
README.md
✓

# demo-cli
A small CLI for parsing logs.
▸ 34 more lines, folded

Tasks

Task
survey the code

Read
src/cli.py
✓

Grep
"--json"
✓
cli.py implements --json.

Task
survey the docs
· 5 events collapsed

Edit
README.md

pending

type a follow-up…

Run

**Try to improve beyond the required features.** An agent usually does the minimal job that
meets the expectation of your prompt, so the first working version of your frontend will probably not be
friendly to use. The seven features are just the basic requirement, but you can be more creative: make the
page more intuitive, make what you are looking for easier to find, and make a run in progress easier to
follow. Use the page yourself, notice where it annoys you, and fix that. Much of the
enjoyment of this assignment is watching your frontend grow friendlier to a human with each change, and
the writeup's first section asks for the improvements you made.

**Give the agent something to work on.** Your page drives Claude Code against a working
directory, and a demo on an empty one shows nothing worth watching, so keep a small real codebase around for
the agent (separate from the frontend's own repository is simplest). Any project with a few files and a test
suite works: an old class project, a small open-source tool you use, or a copy of the frontend you are
building itself. Tasks that demo well are concrete and multi-step (“find the bug that makes
`test_parse` fail and fix it”, “add a `--json` flag and update the
README”), because they make the agent read, run, and edit, which is exactly what features 2 and 3
display.

**Test efficiently by replaying a recorded stream.** Develop the rendering against a saved
`events.jsonl`, by giving your server a replay mode that reads the file instead of spawning the
agent. A live run
takes a minute or more and spends real usage, while replaying a recorded stream is instant and free, so it is
the difference between a ten-second edit-test loop and a one-minute one. Test against live runs at the end,
because two things only they can exercise: the events must render *as they arrive* rather than after
the run ends, and session resume needs a real session id. For the tree view, save a second
`events.jsonl` from a run that spawns a subagent, so that rendering too can be developed in
replay.

Any language and any web stack are fine. However, do not use an agent framework or reimplement the agent
loop (that is Assignment 2).

**Where to run it.** Your own machine is enough, and grading does not require a public URL.
If you want the page reachable from other devices, a [CloudLab](../computing/cloudlab.html) or
AWS machine works too; in that case put a random access token in front of it (e.g.
`openssl rand -hex 16`, kept out of the repository) and reject every request without it, because
a public page here is a remote control for a process that reads files and runs commands on that machine.
Either way, point the agent at a scratch directory rather than at your home directory: your page, your
screenshot, and your demo show everything it reads. If you have trouble getting set up on your own laptop,
feel free to reach out to the teaching fellows for help.

## Part 3 — Writeup

Markdown or PDF, committed to the repository as `assignment1/writeup.md` or
`assignment1/writeup.pdf`. There is no page limit, and do not pad:
a brief writeup that makes every point clearly is enough. **Write the prose yourself.** The writeup reports
what you observed and learned, so a writeup generated entirely by AI defeats that purpose and will incur a
penalty. The writeup includes three sections:

1. **What you built.** One paragraph and one screenshot of what the frontend does, plus the
   improvements you made beyond the seven required features, as a bullet list or folded into the paragraph
   if the list is too long.
2. **What you learned.** Three observations are required, each tied to a specific moment in a
   session. (1) How the agent works: where it spent more time than you expected, what it read that you
   would not have read, or how it approached the task differently than you would have. (2) A pitfall: what
   went wrong or surprised you, how you noticed, and what you would warn a classmate about. (3) A lesson:
   what you would do differently the next time you use an agent, how you would prompt, scope, or supervise
   it better, and what in the session taught you that. Beyond these three, you are welcome to add more:
   insights, or new tools, skills, and plugins you picked up along the way.
3. **One thing you would change.** If you could change one thing about how Claude Code works
   (not about your frontend), what would it be, and what did you see that makes you want it?

## If you want more

None of the following is required or graded, but each is a real feature of the tool you have just built, and
the students who enjoy this assignment tend to keep using their frontend all semester: a stop button that
cancels a running agent, approve or deny buttons for permission prompts, a diff view of the files the agent
changed, and several sessions running in parallel tabs.

## Deliverables

One repository serves the whole course: all five assignments submit their code, writeup, and session
files through a single **private GitHub repository**, shared with the instructor and the
teaching fellows and nobody else. Only the demo video is uploaded to Canvas. Create it once, put this assignment in an `assignment1/` directory, and later assignments
go in `assignment2/`, `assignment3/`, and so on. Invite the instructor and the four TFs,
GitHub usernames [`1a1a11a`](https://github.com/1a1a11a), [`LauYeeYu`](https://github.com/LauYeeYu), [`SeverinaZheng`](https://github.com/SeverinaZheng), [`G6KlayWang`](https://github.com/G6KlayWang), and [`AdvaithRavishankar`](https://github.com/AdvaithRavishankar).

1. Your **code**, in `assignment1/` of the shared repository, with a README saying
   how to start the server.
2. The **writeup**, at `assignment1/writeup.md` or
   `assignment1/writeup.pdf` in the repository.
3. A **demo video** (2–3 minutes), uploaded to Canvas, of the frontend handling a real
   multi-turn task, with the agent's tool calls visibly streaming while it works. The video must show every
   one of the seven features, including a failing run and a run that spawns a subagent. In addition, you may
   sign up to present your frontend live at the sharing session on Sep 21 (the sign-up link will be released
   on Canvas). The live presentation is optional and can earn up to four bonus percentage points under the
   [presentation feedback criteria](../discussion.html#presentation-feedback).
4. Your **Claude Code session files**, archived as described in
   [What to submit with each assignment](../computing/claude-code.html#export) and committed to
   `assignment1/` of the repository. Check that your `.gitignore` does not exclude
   the archive. As on every assignment, they carry no separate points; they are the record behind the
   write-up's claims.

## Grading

| Weight | Component |
| --- | --- |
| **70%** | The seven required features, 10% each, graded working / partially working / absent from your demo video, with the repository as supporting evidence |
| **20%** | Writeup: section 2 carries most of it, and specific, session-anchored observations earn what generic praise does not |
| **10%** | Visual design: layout and readability |

## Features

Judged from your demo video: 10% for the behavior below, partial credit for a partial implementation, zero if
never demonstrated.

| Feature | Full credit |
| --- | --- |
| **Submit a prompt** | Submitting from the page starts a run against a working directory you choose, and a second run can be started from the same page after the first finishes. |
| **Show the trajectory live** | Assistant text and every tool call (name and input) appear in order *while the run is in progress*, and markdown in the assistant's text renders as formatting, not raw markup. |
| **Show tool results** | Every tool call's result is visible with it, and long outputs are deliberately cut down or folded so the page stays readable. |
| **Show status, per tool call and per run** | A tool call is visibly pending until its result arrives and visibly an error when the result reports one; the run's in progress, finished, and failed states are distinguishable; and the demonstration shows one failing run (e.g. a bad working directory) producing a visible error. |
| **Continue the conversation** | A follow-up prompt resumes the same session, and the demonstration shows the carried context (e.g. a follow-up that only makes sense given the previous turn, answered correctly). |
| **Show the run's numbers** | Cost in dollars, wall-clock duration, and turn count from the result event are displayed for each finished run. |
| **Show the trajectory as a tree** | A run that spawns a subagent shows which events belong to which subagent (nested under the spawning call, or an equivalent visualization of your own design), an outline of just the call names sits beside the dialogue on a wide window, long subagent runs can be folded away, and a run with no subagents still renders correctly. |

[Assignment 2 — Build an agent harness →](assignment2.html)
