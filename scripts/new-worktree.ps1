#Requires -Version 5.1
<#
.SYNOPSIS
  Create an isolated worktree + branch for one issue.

.DESCRIPTION
  Branch is <Kind>/<Issue>-<Slug>, created from origin/<Base>.
  Worktree path is <repo>/.kilo/worktrees/<branch with / replaced by ->.
  Refuses to run if the branch or path already exists, or if origin/<Base> is missing.
  Ported from DOOM3_AINative (scripts/new-worktree.ps1); the submodule init and
  port-hint steps are dropped — this repo has no submodules and no fixed ports.
  Exit codes: 0 success, 1 refused/failed.

.EXAMPLE
  .\scripts\new-worktree.ps1 -Issue 1 -Slug sdd-workflow -Kind feat
#>
[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [ValidateRange(1, [int]::MaxValue)]
    [int]$Issue,

    [Parameter(Mandatory = $true)]
    [string]$Slug,

    [string]$Base = 'master',

    [ValidateSet('feat', 'fix', 'chore', 'docs')]
    [string]$Kind = 'feat'
)

$ErrorActionPreference = 'Stop'

function Fail {
    param([Parameter(Mandatory = $true)][string]$Message)
    Write-Host "ERROR: $Message" -ForegroundColor Red
    exit 1
}

function Invoke-Git {
    param(
        [Parameter(Mandatory = $true)][string]$Repo,
        [Parameter(Mandatory = $true)][string[]]$GitArgs,
        [switch]$AllowFail
    )
    $output = & git -C $Repo @GitArgs
    $code = $LASTEXITCODE
    if ($code -ne 0 -and -not $AllowFail) {
        Fail ("git {0} failed in {1} (exit {2})" -f ($GitArgs -join ' '), $Repo, $code)
    }
    return [pscustomobject]@{ Output = @($output); ExitCode = $code }
}

# --- repo root from script location -------------------------------------------------
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$probe = Invoke-Git -Repo $scriptDir -GitArgs @('rev-parse', '--show-toplevel') -AllowFail
if ($probe.ExitCode -ne 0) {
    Fail "scripts/new-worktree.ps1 must live inside a git checkout (could not resolve repo root)."
}
$RepoRoot = ($probe.Output[0]).Trim() -replace '/', '\'

# --- validate inputs ----------------------------------------------------------------
if ($Slug -notmatch '^[a-z0-9]+(-[a-z0-9]+)*$') {
    Fail "Slug '$Slug' is not kebab-case. Use lowercase letters/digits separated by single hyphens (e.g. sdd-workflow)."
}
if ($Slug.Length -gt 40) {
    Fail "Slug '$Slug' is $($Slug.Length) chars; keep it <= 40."
}
if ($Base -notmatch '^[A-Za-z0-9][A-Za-z0-9._/-]*$') {
    Fail "Base '$Base' is not a valid branch name."
}

$Branch = "$Kind/$Issue-$Slug"
$DirName = $Branch -replace '/', '-'
$WorktreesRoot = Join-Path $RepoRoot '.kilo\worktrees'
$WorktreePath = Join-Path $WorktreesRoot $DirName

if (Test-Path -LiteralPath $WorktreePath) {
    Fail "Path already exists: $WorktreePath"
}

$localBranch = Invoke-Git -Repo $RepoRoot -GitArgs @('show-ref', '--verify', '--quiet', "refs/heads/$Branch") -AllowFail
if ($localBranch.ExitCode -eq 0) {
    Fail "Local branch '$Branch' already exists. Pick another issue/slug or finish the existing worktree."
}

# --- remotes and base ---------------------------------------------------------------
$remote = Invoke-Git -Repo $RepoRoot -GitArgs @('remote', 'get-url', 'origin') -AllowFail
if ($remote.ExitCode -ne 0) {
    Fail "No 'origin' remote. Bootstrap first: see docs/GIT_WORKFLOW.md."
}

Write-Host "Fetching origin (prune)..."
$fetch = Invoke-Git -Repo $RepoRoot -GitArgs @('fetch', 'origin', '--prune') -AllowFail
if ($fetch.ExitCode -ne 0) {
    Fail "git fetch origin failed (exit $($fetch.ExitCode)). Check network and 'gh auth status'."
}

$baseRef = Invoke-Git -Repo $RepoRoot -GitArgs @('rev-parse', '--verify', '--quiet', "refs/remotes/origin/$Base") -AllowFail
if ($baseRef.ExitCode -ne 0) {
    Fail "origin/$Base does not exist. Push it first: git push -u origin $Base"
}

$remoteBranch = Invoke-Git -Repo $RepoRoot -GitArgs @('rev-parse', '--verify', '--quiet', "refs/remotes/origin/$Branch") -AllowFail
if ($remoteBranch.ExitCode -eq 0) {
    Fail "Remote branch 'origin/$Branch' already exists. Use a fresh issue/slug or continue that branch instead."
}

# --- create -------------------------------------------------------------------------
if (-not (Test-Path -LiteralPath $WorktreesRoot)) {
    New-Item -ItemType Directory -Path $WorktreesRoot -Force | Out-Null
}

Write-Host "Creating worktree $WorktreePath"
$add = Invoke-Git -Repo $RepoRoot -GitArgs @('worktree', 'add', '-b', $Branch, $WorktreePath, "origin/$Base") -AllowFail
if ($add.ExitCode -ne 0) {
    Fail "git worktree add failed (exit $($add.ExitCode)). No worktree was registered for '$Branch'."
}

Write-Host ""
Write-Host "Worktree : $WorktreePath" -ForegroundColor Green
Write-Host "Branch   : $Branch  (from origin/$Base)" -ForegroundColor Green
Write-Host ""
Write-Host "Next:"
Write-Host "  cd `"$WorktreePath`""
Write-Host "  git status --short"
Write-Host "  npm install        # fresh worktree has no node_modules"
Write-Host "  # implement, verify (npm run build), commit, then: git push -u origin $Branch"
