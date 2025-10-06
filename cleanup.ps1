# Simple Cleanup Script
Write-Host "Cleaning up project structure..." -ForegroundColor Cyan

# Stop containers
Write-Host "Stopping containers..." -ForegroundColor Yellow
docker-compose down 2>$null

# Create backup
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backupFolder = "old-backup-$timestamp"
Write-Host "Creating backup: $backupFolder" -ForegroundColor Yellow
New-Item -ItemType Directory -Path $backupFolder -Force | Out-Null

# Backup old folders
if (Test-Path "backend") {
    Write-Host "Backing up old backend..." -ForegroundColor Gray
    Move-Item -Path "backend" -Destination "$backupFolder/backend" -Force
}

if (Test-Path "frontend") {
    Write-Host "Backing up old frontend..." -ForegroundColor Gray
    Move-Item -Path "frontend" -Destination "$backupFolder/frontend" -Force
}

if (Test-Path "docker-compose.yml") {
    Write-Host "Backing up old docker-compose.yml..." -ForegroundColor Gray
    Move-Item -Path "docker-compose.yml" -Destination "$backupFolder/docker-compose.yml" -Force
}

# Rename new folders
Write-Host "Renaming new folders..." -ForegroundColor Yellow

if (Test-Path "backend-new") {
    Rename-Item -Path "backend-new" -NewName "backend" -Force
    Write-Host "  backend-new -> backend" -ForegroundColor Green
}

if (Test-Path "frontend-next") {
    Rename-Item -Path "frontend-next" -NewName "frontend" -Force
    Write-Host "  frontend-next -> frontend" -ForegroundColor Green
}

if (Test-Path "docker-compose.new.yml") {
    Rename-Item -Path "docker-compose.new.yml" -NewName "docker-compose.yml" -Force
    Write-Host "  docker-compose.new.yml -> docker-compose.yml" -ForegroundColor Green
}

Write-Host "`nCleanup complete!" -ForegroundColor Green
Write-Host "Current structure:" -ForegroundColor Cyan
Get-ChildItem -Directory | Select-Object Name | Format-Table

Write-Host "Old files backed up to: $backupFolder" -ForegroundColor Magenta
