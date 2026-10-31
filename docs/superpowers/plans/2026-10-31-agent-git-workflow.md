# Agent Git Workflow Implementation Plan

**Goal:** Install the distilled DOOM3_AINative loop — issue contract → spec PR →
worktree → implementation PR → independent review → squash merge — as docs plus
three PowerShell scripts, adapted to this repo (`master`, no submodules,
`npm run build` as the gate).

**Architecture:** One operating manual (`docs/GIT_WORKFLOW.md`) holds the rules;
three scripts hold the mechanics (`new-worktree.ps1`, `list-worktrees.ps1`,
`remove-worktree.ps1` under `scripts/`); `AGENTS.md` points at both;
`.kilo/worktrees/` is git-ignored. Spec artifacts for this change are the two
`docs/superpowers/` files this plan belongs to, published by the `docs/1-sdd-workflow-spec`
PR before the implementation branch is cut (dogfooding the workflow itself).

**Spec:** [2026-10-31-agent-git-workflow-spec.md](2026-10-31-agent-git-workflow-spec.md) · **Issue:** [#1](https://github.com/yhyu13/yhyu13.github.io/issues/1)

**Stack note:** scripts are PowerShell 5.1 (this host has no `&&`; the DOOM3
originals are the 5.1-compatible model). No Node changes; `npm run build` is the
verification gate and needs `npm install` inside a fresh worktree.

---

## Tasks

Implementation branch: `feat/1-sdd-workflow`, cut from the spec branch via the
ported script itself.

- [ ] 1. Write `scripts/new-worktree.ps1` — ported from DOOM3_AINative, minus the
      submodule init and port hint: validate kebab-case slug (≤40 chars), refuse
      existing branch/path, `git fetch origin --prune`, verify `origin/<base>`,
      `git worktree add -b <kind>/<N>-<slug>` from `origin/<base>`, print path +
      branch + next steps. Exit 0 / 1.
- [ ] 2. Write `scripts/list-worktrees.ps1` (thin `git worktree list` wrapper) and
      `scripts/remove-worktree.ps1` (clean-tree guard, `-Force` override, `remove`
      + `prune`; branch deletion only when merged).
- [ ] 3. Write `docs/GIT_WORKFLOW.md` — the operating manual: provenance, model
      (dual PR, trunk = `master`), issue contract template, worktree lifecycle,
      parallelism rules, conflict/failure protocol, merge policy with the
      evidence-block template, red lines, start/finish checklists.
- [ ] 4. Add `.kilo/worktrees/` to `.gitignore`; point `AGENTS.md` at
      `docs/GIT_WORKFLOW.md` and the scripts.
- [ ] 5. Verify in the implementation worktree: `npm install` then `npm run build`
      exits 0; worktree roundtrip (create via the new script, remove via the new
      script) exits 0 on both. Paste real output into the PR evidence block.

## Definition of done

Every issue #1 acceptance criterion is checked by a command whose output is
quoted in the implementation PR body; the spec PR merges to `master` first; the
implementation PR is reviewed by a session that is not the author's, reruns the
verification, and records `APPROVED` with the reviewed SHA.
