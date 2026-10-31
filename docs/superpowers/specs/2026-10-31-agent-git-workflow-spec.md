# Agent Git Workflow — SDD 与 issue→PR→worktree 流程（提炼自 DOOM3_AINative）

Date: 2026-10-31
Status: Draft for review
Author: Hang Yu
Refs: [#1](https://github.com/yhyu13/yhyu13.github.io/issues/1)
Source: `C:\Git-repo-AI\8_Game\DOOM3_AINative` — `docs/GIT_WORKFLOW.md`, `AGENTS.md` §11, `scripts/new-worktree.ps1`

## Problem

This repo already produces specs the SDD way — `docs/superpowers/specs/*.md` plus
`docs/superpowers/plans/*.md` — but nothing governs *how work moves*: there is no
issue contract, no branch isolation for parallel agent sessions, no separation
between "the design" and "the code that implements it", and no evidence gate
before merge. A single checkout on `master` is the whole workflow. That works for
one agent and breaks the moment two sessions run in parallel or a claim of
"done" has to be checked.

The DOOM3_AINative repository solved exactly this with an agent-driven loop:
**issue → spec PR → worktree → implementation PR → independent review → squash
merge**. The question is what survives the trip into a repo that is one Vite +
React site with no submodules, no game data, and a Pages deploy on every push to
`master`.

## Decision

Install the loop, scaled to this repo, in three parts:

1. **A spec-first dual-PR structure.** One issue = one `docs/<N>-<slug>` PR that
   publishes the spec/plan under `docs/superpowers/`, plus one
   `feat|fix|chore/<N>-<slug>` implementation PR. The spec merges (or is at least
   open and reviewable) before the implementation branch is cut, so the
   implementation is reviewed against a fixed design, not a moving one. This
   reuses the repo's existing spec/plan convention — it adds the *ordering and
   review* around it, not a new format.
2. **Worktree isolation, scripted.** A ported `scripts/new-worktree.ps1` creates
   `.kilo/worktrees/<kind>-<N>-<slug>` from `origin/<base>` with slug validation
   and collision checks; `list-worktrees.ps1` and `remove-worktree.ps1` round it
   out. One issue = one branch = one worktree = one writer. The DOOM3 submodule
   init and port-hashing steps are dropped — this repo has neither submodules
   nor fixed ports.
3. **An operating manual, `docs/GIT_WORKFLOW.md`.** The issue-contract template
   (every acceptance criterion checkable: command + exit code, byte count, file
   listing, or screenshot), the conflict/failure protocol, the merge policy
   (independent review that reruns verification and records `APPROVED` with the
   reviewed SHA; the PR head must still equal that SHA at merge; evidence block
   required; `Refs #N`, never `Closes #N` without the user's approval; squash
   only), and a red-lines checklist.

### Adopted / adapted / dropped

| From DOOM3_AINative | Verdict here |
|---|---|
| Issue contract with mechanically checkable acceptance criteria, in/out-of-scope paths, one verification command | **Adopted verbatim** |
| One issue = spec PR + implementation PR; specs merge before the worktree is cut | **Adopted** (this PR is the first instance) |
| Worktree scripts (`new` / `list` / `remove`), branch naming `kind/N-slug`, `.kilo/worktrees/` git-ignored | **Adopted**, submodule step removed |
| Independent review: reviewer ≠ author, reruns verification, verdict + reviewed SHA recorded verbatim; head must equal reviewed SHA at merge; merge-base check against `origin/master` | **Adopted** (a fresh agent session may serve as reviewer, as in the source) |
| Evidence block in every PR body; draft until verification passes; "mostly green" never merges | **Adopted**; the verification gate is `npm run build` |
| `Refs #N`, never `Closes`/`Fixes`/`Resolves` without the user's explicit approval; the user closes issues | **Adopted verbatim** |
| Squash merge only; rebase in the worktree; `--force-with-lease` on your own branch only; revert via a new PR, no history rewrite | **Adopted** (`main` → `master`) |
| No `git stash`; one writer per file split by ownership; never force-push the trunk | **Adopted verbatim** |
| Submodule hygiene, target copies, fork-branch engine changes, owner sign-off for bumps | **Dropped** — no submodules here |
| Port/build-dir hashing from `WORKTREE_PATH` | **Dropped** — no fixed ports; `npm run dev` takes `--port` ad hoc |
| spec-kit CLI (`.specify/`, `/speckit.*`) | **Not installed** — the existing `docs/superpowers/` convention fills the same slot; real spec-kit is a possible follow-up, out of scope for #1 |

## Consequences

- Two PRs per issue instead of one: slightly more ceremony, in exchange for
  designs that are reviewed before code exists and implementations that are
  reviewed against a fixed spec.
- Parallel agent sessions become safe by default: each session works in its own
  worktree with its own `node_modules` and `dist/`, and cannot see or dirty
  another's files.
- Every merge carries an evidence block, so "done" is a quoted command output,
  not a claim. This includes workflow/docs changes — this repository's docs are
  load-bearing for agents, so they get reviewed too.
- Deploy note: merging to `master` triggers the Pages deploy. The merge
  checklist treats "deploy went green" as part of risk/rollback, and rollback is
  `git revert` of the squash commit via a new PR.
