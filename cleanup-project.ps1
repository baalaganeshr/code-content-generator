# Cleanup Script - Reorganize Project Structure
# This will remove old folders and rename new ones

Write-Host "🧹 Cleaning up project structure..." -ForegroundColor Cyan

# Stop any running containers
Write-Host "`n📦 Stopping old containers..." -ForegroundColor Yellow
docker-compose down 2>$null

# Create backup folder
$backupFolder = "old-backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
Write-Host "`n💾 Creating backup: $backupFolder" -ForegroundColor Yellow
New-Item -ItemType Directory -Path $backupFolder -Force | Out-Null

# Move old folders to backup
if (Test-Path "backend") {
    Write-Host "  Moving old backend to backup..." -ForegroundColor Gray
    Move-Item -Path "backend" -Destination "$backupFolder/backend" -Force
}

if (Test-Path "frontend") {
    Write-Host "  Moving old frontend to backup..." -ForegroundColor Gray
    Move-Item -Path "frontend" -Destination "$backupFolder/frontend" -Force
}

# Rename new folders
Write-Host "`n📝 Renaming new folders..." -ForegroundColor Yellow

if (Test-Path "backend-new") {
    Write-Host "  Renaming backend-new → backend" -ForegroundColor Gray
    Rename-Item -Path "backend-new" -NewName "backend" -Force
}

if (Test-Path "frontend-next") {
    Write-Host "  Renaming frontend-next → frontend" -ForegroundColor Gray
    Rename-Item -Path "frontend-next" -NewName "frontend" -Force
}

# Rename docker-compose.new.yml to docker-compose.yml
if (Test-Path "docker-compose.yml") {
    Write-Host "  Moving old docker-compose.yml to backup..." -ForegroundColor Gray
    Move-Item -Path "docker-compose.yml" -Destination "$backupFolder/docker-compose.yml" -Force
}

if (Test-Path "docker-compose.new.yml") {
    Write-Host "  Renaming docker-compose.new.yml → docker-compose.yml" -ForegroundColor Gray
    Rename-Item -Path "docker-compose.new.yml" -NewName "docker-compose.yml" -Force
}

Write-Host "`n✅ Cleanup complete!" -ForegroundColor Green
Write-Host "`n📂 New structure:" -ForegroundColor Cyan
Get-ChildItem -Directory | Select-Object Name | Format-Table

Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "  1. Check that backend/ and frontend/ folders exist" -ForegroundColor White
Write-Host "  2. Run: docker-compose up --build" -ForegroundColor White
Write-Host "  3. Old files are backed up in: $backupFolder" -ForegroundColor White

Write-Host "`nOld backup location: .\$backupFolder" -ForegroundColor Magenta
