# Requires: Docker Desktop, pnpm, docker compose (postgres + redis)
# Usage: powershell -ExecutionPolicy Bypass -File scripts/docker-api.ps1

$ErrorActionPreference = "Stop"
$RootDir = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $RootDir

$ImageRepo = "mankhb2k/aucobot-api"
$Version = (Get-Content "docker/api.version" -Raw).Trim()
$TestEnvFile = "docker/api.test.env"
$TestContainer = "aucobot-api-test"
$ApiPort = if ($env:API_PORT) { $env:API_PORT } else { "8387" }

if (-not $Version) { throw "docker/api.version is empty" }
if (-not (Test-Path $TestEnvFile)) {
  throw "$TestEnvFile not found — copy docker/api.test.env.example"
}

Write-Host "==> Ensuring postgres + redis are up"
docker compose up -d postgres redis

Write-Host "==> Loading env for migrate deploy"
Get-Content $TestEnvFile | ForEach-Object {
  if ($_ -match '^\s*#' -or $_ -match '^\s*$') { return }
  $parts = $_ -split '=', 2
  if ($parts.Count -eq 2) {
    $key = $parts[0].Trim()
    $value = $parts[1].Trim().Trim('"')
    if ($key -eq "DATABASE_URL") {
      $env:DATABASE_URL = $value -replace "host\.docker\.internal", "localhost"
    }
  }
}

if (-not $env:DATABASE_URL) { throw "DATABASE_URL missing in $TestEnvFile" }

Write-Host "==> Running prisma migrate deploy"
pnpm --filter @aucobot/database exec prisma migrate deploy

Write-Host "==> Building $ImageRepo`:$Version and :latest"
docker build `
  --build-arg IMAGE_VERSION=$Version `
  -t "$ImageRepo`:$Version" `
  -t "$ImageRepo`:latest" `
  .

docker rm -f $TestContainer 2>$null | Out-Null

Write-Host "==> Starting smoke test container on port $ApiPort"
docker run -d `
  --name $TestContainer `
  --env-file $TestEnvFile `
  -e "API_PORT=$ApiPort" `
  -p "${ApiPort}:${ApiPort}" `
  "$ImageRepo`:$Version"

try {
  Write-Host "==> Waiting for /api/health"
  $ok = $false
  for ($i = 0; $i -lt 30; $i++) {
    try {
      $health = Invoke-RestMethod -Uri "http://localhost:${ApiPort}/api/health" -TimeoutSec 5
      if ($health.status -eq "ok" -and $health.database -eq "connected") {
        $health | ConvertTo-Json -Compress
        $ok = $true
        break
      }
    } catch {}
    Start-Sleep -Seconds 2
  }

  if (-not $ok) {
    docker logs $TestContainer
    throw "Health check failed"
  }

  Write-Host "==> Smoke test passed"
  Write-Host "==> Pushing $ImageRepo`:$Version"
  docker push "$ImageRepo`:$Version"
  Write-Host "==> Pushing $ImageRepo`:latest"
  docker push "$ImageRepo`:latest"
  Write-Host "==> Done: $ImageRepo`:$Version and :latest"
}
finally {
  docker rm -f $TestContainer 2>$null | Out-Null
}
