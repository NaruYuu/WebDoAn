$ErrorActionPreference = "Stop"

Set-Location $PSScriptRoot

function Get-NodeVersion {
    $nodeCommand = Get-Command node -ErrorAction SilentlyContinue
    if (-not $nodeCommand) {
        return $null
    }

    $versionText = (& node --version).Trim().TrimStart("v")
    try {
        return [version]$versionText
    }
    catch {
        return $null
    }
}

$nodeVersion = Get-NodeVersion
if (-not $nodeVersion -or $nodeVersion -lt [version]"20.9.0") {
    $winget = Get-Command winget -ErrorAction SilentlyContinue
    if (-not $winget) {
        throw "Can Node.js 20.9+ va winget. Cai Node.js tu https://nodejs.org/ roi chay lai script."
    }

    Write-Host "Dang cai Node.js LTS..."
    & winget install --id OpenJS.NodeJS.LTS --exact --accept-package-agreements --accept-source-agreements
    if ($LASTEXITCODE -ne 0) {
        throw "Cai Node.js that bai. Hay cai Node.js 20.9+ va chay lai script."
    }

    $env:Path = [Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [Environment]::GetEnvironmentVariable("Path", "User")
    $nodeVersion = Get-NodeVersion
    if (-not $nodeVersion -or $nodeVersion -lt [version]"20.9.0") {
        throw "Node.js da duoc cai dat nhung chua co trong PATH. Hay dong mo PowerShell roi chay lai install.ps1."
    }
}

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    throw "Khong tim thay npm. Hay cai lai Node.js LTS va chay lai script."
}

if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "Da tao .env tu .env.example."
}

Write-Host "Node.js $nodeVersion da san sang. Dang cai thu vien..."
& npm ci
if ($LASTEXITCODE -ne 0) {
    throw "npm ci that bai. Kiem tra ket noi mang va chay lai script."
}

Write-Host "Dang tao/cap nhat co so du lieu SQLite..."
& npm run db:push
if ($LASTEXITCODE -ne 0) {
    throw "Khong the cap nhat co so du lieu. Kiem tra DATABASE_URL trong .env."
}

Write-Host "Dang nap du lieu mau..."
& npm run db:seed
if ($LASTEXITCODE -ne 0) {
    throw "Nap du lieu mau that bai."
}

Write-Host "Cai dat hoan tat. Chay 'npm run dev' de khoi dong website tai http://localhost:3000."