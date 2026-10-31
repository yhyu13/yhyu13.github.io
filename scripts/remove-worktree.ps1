#Requires -Version 5.1
<#
.SYNOPSIS
  Remove one git worktree and prune its registration.

.DESCRIPTION
  Refuses to remove a dirty worktree unless -Force is passed (which discards
  uncommitted work). Deletes the local branch only after it is merged.
  Run from any checkout of the repo. Exit codes: 0 success, 1 refused/failed.

.EXAMPLE
  .\scripts\remove-worktree.ps1 -Path .kilo\worktrees\feat-1-sdd-workflow
#>
[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$Path,

    [switch]$Force
)

$ErrorActionPreference = 'Stop'

function Fail {
    param([Parameter(Mandatory = $true)][string]$Message)
    Write-Host "ERROR: $Message" -ForegroundColor Red
    exit 1
}

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$probe = & git -C $scriptDir rev-parse --show-toplevel 2>$null
if ($LASTEXITCODE -ne 0) {
    Fail "scripts/remove-worktree.ps1 must live inside a git checkout."
}
$RepoRoot = ($probe | Select-Object -First 1).ToString().Trim() -replace '/', '\'

if (-not (Test-Path -LiteralPath $Path)) {
    # Accept a worktree path relative to the repo root as well as a literal path.
    $candidate = Join-Path $RepoRoot $Path
    if (Test-Path -LiteralPath $candidate) {
        $Path = $candidate
    } else {
        Fail "Worktree path not found: $Path"
    }
}

$resolved = (Resolve-Path -LiteralPath $Path).Path
if ($resolved -eq $RepoRoot) {
    Fail "Refusing to remove the main checkout: $resolved"
}

$status = & git -C $resolved status --porcelain
if ($LASTEXITCODE -ne 0) {
    Fail "'git -C $resolved status' failed; is this a worktree of this repo?"
}
if (-not $Force -and $status) {
    Fail "Worktree is dirty; passing -Force discards uncommitted work. Files:`n$($status | Out-String)"
}

# Capture the branch BEFORE removal — the directory is gone afterwards.
$head = & git -C $resolved rev-parse --abbrev-ref HEAD 2>$null

& git -C $RepoRoot worktree remove "$resolved" $(if ($Force) { '--force' } else { @() })
if ($LASTEXITCODE -ne 0) {
    Fail "git worktree remove failed (exit $LASTEXITCODE)."
}
& git -C $RepoRoot worktree prune

# Report the branch so the caller can decide deletion (only after merge).
Write-Host ""
Write-Host "Removed : $resolved" -ForegroundColor Green
if ($head -and $head -ne 'HEAD') {
    Write-Host "Branch  : $head (delete with: git branch -d `"$head`" — only if merged)"
}
