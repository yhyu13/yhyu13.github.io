# Git Workflow — issue → spec PR → worktree → implementation PR → review → merge

Operating manual for humans and AI agent sessions working in this repository.
Distilled from `DOOM3_AINative` (`docs/GIT_WORKFLOW.md`, `AGENTS.md` §11) and
scaled down: default branch is **`master`**, there are **no submodules**, and the
verification gate is **`npm run build`** (typecheck + Vite build + link checker).
Specs follow the existing `docs/superpowers/` convention
([spec](superpowers/specs/2026-10-31-agent-git-workflow-spec.md),
[plan](superpowers/plans/2026-10-31-agent-git-workflow.md)).
PowerShell 5.1 has **no `&&`**; every command below is copy-pasteable.

## 1. Model

- **One issue = one `docs/<N>-<slug>` spec PR plus one `feat|fix|chore/<N>-<slug>`
  implementation PR** (branch, worktree, one writer). No multi-issue branches; no
  second implementation branch for the same issue.
- Trunk-based: `master` is always releasable (a merge triggers the Pages deploy);
  branches are short-lived (target < 2 days).
- Worktrees live in `.kilo/worktrees/<kind>-<N>-<slug>` (git-ignored).
- The **spec PR merges first**; the implementation worktree is cut from a branch
  that already holds the design it implements (cut it from the spec branch if the
  spec PR is still open, and retarget the implementation PR to `master` after the
  spec PR merges — that is how this workflow's own issue #1 was done).
- SDD artifacts are `docs/superpowers/specs/<date>-<slug>-design.md` plus
  `docs/superpowers/plans/<date>-<slug>.md` — written by the spec PR, reviewed
  like any other PR (the reviewer checks the design against the issue contract,
  not the code).

## 2. Issue contract

The issue is the contract; write it before the implementation branch exists:

```markdown
Title: <verb> <object> (<area>)
Context: links to spec/plan/prior PRs; why now
Acceptance criteria (checkable, one per line):
- [ ] `<command>` exits 0
- [ ] `build/foo` exists and is > 1024 bytes
- [ ] screenshot at 1280x720 shows <specific visible state>
In scope: paths the PR may touch (exact directories/files)
Out of scope: paths that must stay untouched
Verification command: the one command the reviewer reruns
Blocking edges: #<issue> (must merge first) | none
```

No acceptance criterion without a command, exit code, byte count, file listing,
or screenshot. If it cannot be checked mechanically, rewrite it until it can.

## 3. Worktree lifecycle

```powershell
# 1. create (fetches origin, branches from origin/<base>)
.\scripts\new-worktree.ps1 -Issue 42 -Slug my-change -Kind feat

# 2. enter and confirm isolation
cd .kilo\worktrees\feat-42-my-change
git status --short; git rev-parse --show-toplevel
npm install                        # fresh worktree has no node_modules

# 3. work, verify (the issue's verification command), then commit
git add <only owned paths>
git commit -m "feat(craft): ... (#42)"

# 4. publish as a draft, then mark ready once verification is green
git push -u origin feat/42-my-change
gh pr create --draft --base master --title "feat(craft): ... (#42)" --body-file "$env:TEMP\pr-42.md"
gh pr ready <PR#>

# 5. review (never the author), then merge
gh pr merge <PR#> --squash

# 6. cleanup from any checkout
.\scripts\remove-worktree.ps1 -Path .kilo\worktrees\feat-42-my-change
```

`new-worktree.ps1` refuses an existing branch/path and a missing
`origin/<base>` (exit 1). `remove-worktree.ps1` refuses a dirty worktree unless
`-Force` is passed; delete the local branch only after the PR is merged.

## 4. Parallelism rules

- Maximum 2–3 concurrent worktrees per machine (review bandwidth is the limit).
- Stabilise shared contracts (route definitions, data shapes, CSS token names) on
  `master` first, then split. Never let two workers discover the same interface
  independently.
- **One branch, one worktree, one writer.** Split by **file ownership**, not by
  task name; two agents must never edit the same file.
- **Never `git stash`** — stashes are shared across worktrees and silently
  corrupt parallel work. Commit to your branch instead.
- Each worktree has its own `node_modules` and `dist/` (both git-ignored). If a
  dev server is needed, pass an explicit `--port`; never share one.

## 5. Conflict and failure protocol

1. Before requesting review: `git fetch origin`, then `git rebase origin/master`
   **inside the worktree**. A late rebase invalidates a prior review — get a new one.
2. Resolve conflicts there, re-run the issue's verification command, then push
   only your own branch: `git push --force-with-lease`. **Never force-push `master`.**
3. Verification fails → the PR stays **draft**; the evidence block records the
   failing command and exit code. Fix or close the PR; do not merge "mostly green".
4. Integration failure after merge → `git revert <sha>` on `master` via a new PR.
   No history rewrite.
5. Blocked > 1 day on another issue → re-slice the issue; do not widen scope silently.

## 6. Merge policy

- **Squash merge only.** No merge commits, no direct commits to `master`.
- The PR body carries `Refs #N` (never `Closes`/`Fixes`/`Resolves #N` unless the
  user explicitly approved closing that issue — a squash commit inherits the
  message, so a closing keyword *is* closing the issue), the evidence block, and
  risk/rollback:

```markdown
## Evidence
- `npm run build` → exit 0, <key output line>
- artifact: <path> <size>
- screenshot: <path or URL>

## Risk / rollback
Risk: <what breaks if wrong>
Rollback: revert this squash commit on master; no data migration
Refs #42
```

- **Independent review before merge.** The reviewer is never the author and does
  not share the author's session or worktree. It reruns the issue's verification
  command (or states exactly what was not rerun and why), keeps the review
  read-only apart from the report, and records its verdict **verbatim** in a PR
  comment with the reviewed SHA — the author must not rewrite or paraphrase it. A
  fresh-context agent session may serve as reviewer. The author may merge after
  that review, provided the PR head still equals the reviewed SHA and the merge
  base of the reviewed SHA and `origin/master` is still current `origin/master`;
  any new commit, rebase, or advance of `master` after the review voids the
  approval and requires a new review.
- Merge gates: verification green · independent `APPROVED` at the reviewed SHA ·
  head == reviewed SHA · `gh pr view <N> --json mergeable,mergeStateStatus`
  reports `MERGEABLE` / `CLEAN` against current `origin/master` · the main
  checkout is clean of files the PR touches (mergeability is computed from the
  remote head and cannot see local dirt) · no out-of-scope paths.
- Deploy note: a merge to `master` triggers the Pages deploy. "Deploy went
  green" belongs in the risk/rollback judgement; rollback is `git revert` of the
  squash commit via a new PR.

## 7. Red lines

1. No direct commits to `master`; no force-push to `master`.
2. One issue per branch; never two agents on one branch or one worktree.
3. Never `git stash`.
4. Never commit `dist/`, `node_modules/`, secrets, or machine-specific absolute paths.
5. Never write outside the issue's in-scope paths.
6. Never let a reviewer review their own diff or share the author's session/worktree;
   an approval must name the reviewed SHA.
7. Never merge with red verification; draft PRs stay draft.
8. Never close an issue (no `gh issue close`, no closing keywords) without the
   user's explicit approval.
9. Never delete another worker's worktree or branch.
10. Never commit generated courseware exports by hand — they arrive via the
    documented export tool (`AGENTS.md` → two-repo contract).

## 8. Checklists

Start (per worker):

- [ ] Issue contract read; acceptance criteria checkable; blocking edges merged.
- [ ] Spec PR open (or merged) and read; implementation branch cut from it or from `origin/master`.
- [ ] `new-worktree.ps1` printed path + branch; `git status --short` clean.
- [ ] `npm install` done; build green before first change (`npm run build`).

Finish (before merge):

- [ ] Verification command rerun in the worktree; output quoted in the PR body.
- [ ] `git fetch origin` + rebase done; `git status` clean.
- [ ] PR has `Refs #N`, evidence block, risk/rollback; independent reviewer
      approved at the reviewed SHA and the head still equals it.
- [ ] `gh pr view <N> --json mergeable,mergeStateStatus` reports `MERGEABLE` / `CLEAN`.
- [ ] After merge: `remove-worktree.ps1`; branch deleted only if merged.
