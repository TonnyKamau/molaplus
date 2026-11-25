<#
.SYNOPSIS
  Restore public_html on Bluehost from a backup made by deploy.ps1.

.EXAMPLE
  .\scripts\rollback.ps1              # lists available backups
  .\scripts\rollback.ps1 -Stamp 20261125-101500
#>
param(
  [string]$Stamp,
  [string]$SshHost = "sh01126.bluehost.com",
  [string]$User = "zhlojtmy",
  [int]$Port = 22,
  [string]$RemoteRoot = "public_html"
)

$ErrorActionPreference = "Stop"
$keyCopy = Join-Path $HOME ".ssh\molaplus_rsa"
if (-not (Test-Path $keyCopy)) { throw "Run deploy.ps1 once first (it installs the key at $keyCopy)." }
$sshOpts = @("-i", $keyCopy, "-p", "$Port")
$target = "$User@$SshHost"

if (-not $Stamp) {
  & ssh @sshOpts $target "ls -1t ~/backups/$RemoteRoot-*.tgz"
  Write-Host "Re-run with -Stamp <yyyyMMdd-HHmmss> from the list above."
  exit 0
}

& ssh @sshOpts $target "set -e; tar -xzf ~/backups/$RemoteRoot-$Stamp.tgz -C ~/$RemoteRoot && echo Restored $Stamp"
if ($LASTEXITCODE -ne 0) { throw "Rollback failed." }