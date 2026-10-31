#Requires -Version 5.1
<#
.SYNOPSIS
  List the repo's git worktrees.
.EXAMPLE
  .\scripts\list-worktrees.ps1
#>
$ErrorActionPreference = 'Stop'
& git worktree list
exit $LASTEXITCODE
