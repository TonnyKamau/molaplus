<#
.SYNOPSIS
  Build the MolaPlus static site and upload it to Bluehost over SSH.

.DESCRIPTION
  1. npm run build            -> static export in .\out
  2. pack .\out into site.tgz
  3. scp site.tgz to the server
  4. on the server: back up public_html, then unpack the new build over it
     (api/, .htaccess, uploads/ and config files are left untouched)

  -Backend also uploads backend\public_html (the PHP API + .htaccess).
  -SkipBuild re-uses the existing .\out folder.

  Your key is passphrase-protected: ssh/scp will ask for the passphrase.
  Run `ssh-add` first (with the ssh-agent service running) to type it once.

.EXAMPLE
  .\scripts\deploy.ps1
  .\scripts\deploy.ps1 -Backend
  .\scripts\deploy.ps1 -SkipBuild -SshHost sh01126.bluehost.com -User zhlojtmy
#>
param(
  [string]$SshHost = "sh01126.bluehost.com",
  [string]$User = "zhlojtmy",
  [int]$Port = 22,
  [string]$Key = "C:\Users\USER\Downloads\id_rsa",
  [string]$RemoteRoot = "public_html",
  [switch]$Backend,
  [switch]$SkipBuild
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

foreach ($tool in "ssh", "scp", "tar") {
  if (-not (Get-Command $tool -ErrorAction SilentlyContinue)) {
    throw "$tool not found. Install the Windows 'OpenSSH Client' optional feature."
  }
}

# OpenSSH refuses keys other users can read. Keep a private copy in ~/.ssh.
if (-not (Test-Path $Key)) { throw "SSH key not found: $Key" }
$sshDir = Join-Path $HOME ".ssh"
New-Item -ItemType Directory -Force $sshDir | Out-Null
$keyCopy = Join-Path $sshDir "molaplus_rsa"
$sameKey = (Test-Path $keyCopy) -and
  ((Get-FileHash $Key).Hash -eq (Get-FileHash $keyCopy).Hash)
if (-not $sameKey) {
  if (Test-Path $keyCopy) {
    # The copy is locked read-only from a previous run; unlock it to replace it.
    icacls $keyCopy /grant:r "$($env:USERNAME):(F)" | Out-Null
  }
  Copy-Item $Key $keyCopy -Force
  icacls $keyCopy /inheritance:r /grant:r "$($env:USERNAME):(R)" | Out-Null
}

$target = "$User@$SshHost"
$sshOpts = @("-i", $keyCopy, "-p", "$Port", "-o", "StrictHostKeyChecking=accept-new")
$scpOpts = @("-i", $keyCopy, "-P", "$Port", "-o", "StrictHostKeyChecking=accept-new")

function Invoke-Remote([string]$command) {
  & ssh @sshOpts $target $command
  if ($LASTEXITCODE -ne 0) { throw "Remote command failed ($LASTEXITCODE)." }
}

function Send-File([string]$local, [string]$remote) {
  & scp @scpOpts $local "${target}:$remote"
  if ($LASTEXITCODE -ne 0) { throw "Upload failed ($LASTEXITCODE)." }
}

# 1. Build
if (-not $SkipBuild) {
  Write-Host "==> Building static site" -ForegroundColor Cyan
  npm run build
  if ($LASTEXITCODE -ne 0) { throw "Build failed." }
}
if (-not (Test-Path "out\index.html")) { throw "out\index.html missing - build first." }

# 2. Pack
$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$tmp = Join-Path $env:TEMP "molaplus-deploy-$stamp"
New-Item -ItemType Directory -Force $tmp | Out-Null
$siteTgz = Join-Path $tmp "site.tgz"
Write-Host "==> Packing out\ -> $siteTgz" -ForegroundColor Cyan
tar -czf $siteTgz -C out .
if ($LASTEXITCODE -ne 0) { throw "tar failed." }

$uploads = @("site.tgz")
if ($Backend) {
  $apiTgz = Join-Path $tmp "api.tgz"
  Write-Host "==> Packing backend\public_html -> $apiTgz" -ForegroundColor Cyan
  # setup-admin.php is a one-off installer; never redeploy it.
  tar -czf $apiTgz -C backend\public_html --exclude=setup-admin.php .
  if ($LASTEXITCODE -ne 0) { throw "tar failed." }
  $uploads += "api.tgz"
}

# 3. Upload
Write-Host "==> Uploading to $target" -ForegroundColor Cyan
Invoke-Remote "mkdir -p ~/deploy ~/backups"
Send-File $siteTgz "deploy/site.tgz"
if ($Backend) { Send-File $apiTgz "deploy/api.tgz" }

# 4. Back up + unpack on the server
Write-Host "==> Backing up ~/$RemoteRoot and unpacking" -ForegroundColor Cyan
$remote = @"
set -e
cd ~/$RemoteRoot
tar -czf ~/backups/$RemoteRoot-$stamp.tgz --exclude=./uploads .
tar -xzf ~/deploy/site.tgz -C ~/$RemoteRoot
if [ -f ~/deploy/api.tgz ]; then tar -xzf ~/deploy/api.tgz -C ~/$RemoteRoot; fi
find ~/$RemoteRoot -path ~/$RemoteRoot/uploads -prune -o -type d -exec chmod 755 {} +
find ~/$RemoteRoot -path ~/$RemoteRoot/uploads -prune -o -type f -exec chmod 644 {} +
rm -f ~/deploy/site.tgz ~/deploy/api.tgz
ls -t ~/backups/$RemoteRoot-*.tgz | tail -n +6 | xargs -r rm -f
echo "Deployed $stamp. Backup: ~/backups/$RemoteRoot-$stamp.tgz"
"@ -replace "`r", ""
Invoke-Remote $remote

Remove-Item -Recurse -Force $tmp

Write-Host "==> Done. Rollback: .\scripts\rollback.ps1 -Stamp $stamp" -ForegroundColor Green
