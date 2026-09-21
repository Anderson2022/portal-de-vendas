$ErrorActionPreference = 'Stop'
$poolFrontend = Split-Path $PSScriptRoot -Parent
$poolBackend = [IO.Path]::GetFullPath((Join-Path $poolFrontend '..\poolcontrol-backend'))
$poolLocal = Join-Path $poolFrontend '.local'
New-Item -ItemType Directory -Path $poolLocal -Force | Out-Null
$poolSecretPath = Join-Path $poolLocal 'backend-secret.txt'
if (-not (Test-Path -LiteralPath $poolSecretPath)) {
  $poolRandom = [Security.Cryptography.RandomNumberGenerator]::Create()
  $poolBytes = New-Object byte[] 48
  $poolRandom.GetBytes($poolBytes)
  [IO.File]::WriteAllText($poolSecretPath, [Convert]::ToBase64String($poolBytes))
  $poolRandom.Dispose()
}
$env:DB_URL = 'jdbc:postgresql://127.0.0.1:5433/poolcontrol_numerico2'
$env:DB_USER = 'pool_local'
$env:DB_PASSWORD = ''
$env:JWT_SECRET = [IO.File]::ReadAllText($poolSecretPath)
$env:PORT = '8081'
$poolJar = Join-Path $poolBackend 'target\poolcontrol-backend-0.1.0-SNAPSHOT.jar'
if (-not (Test-Path -LiteralPath $poolJar)) { throw 'Compile o backend antes de iniciar.' }
$poolProcess = Start-Process -FilePath (Get-Command java.exe).Source -ArgumentList '-jar', ('"' + $poolJar + '"') -WorkingDirectory $poolBackend -WindowStyle Hidden -RedirectStandardOutput (Join-Path $poolFrontend 'pool-api.log') -RedirectStandardError (Join-Path $poolFrontend 'pool-api-error.log') -PassThru
$poolProcess.Id | Set-Content (Join-Path $poolLocal 'backend.pid')
Write-Output "Backend iniciado, PID $($poolProcess.Id), banco PoolControl na porta 5433."
