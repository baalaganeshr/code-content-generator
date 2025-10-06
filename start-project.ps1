# Start Code Content Generator Project
# Stops conflicting containers and starts our services

Write-Host "`n=== CODE CONTENT GENERATOR - STARTUP ===" -ForegroundColor Cyan

# Check current running containers
Write-Host "`n[1] Checking current containers..." -ForegroundColor Yellow
$currentContainers = docker ps --format "{{.Names}}"
if ($currentContainers) {
    Write-Host "Currently running:" -ForegroundColor Gray
    $currentContainers | ForEach-Object { Write-Host "  - $_" -ForegroundColor Cyan }
} else {
    Write-Host "  No containers running" -ForegroundColor Gray
}

# Check port conflicts
Write-Host "`n[2] Checking port conflicts..." -ForegroundColor Yellow
$requiredPorts = @{
    3000 = "Frontend"
    8000 = "Backend" 
    27017 = "MongoDB"
    6333 = "Qdrant"
}

$conflicts = @()
foreach ($port in $requiredPorts.Keys) {
    $test = Test-NetConnection -ComputerName localhost -Port $port -WarningAction SilentlyContinue -InformationLevel Quiet
    if ($test) {
        Write-Host "  Port $port ($($requiredPorts[$port])) is IN USE" -ForegroundColor Red
        $conflicts += $port
    } else {
        Write-Host "  Port $port ($($requiredPorts[$port])) is available" -ForegroundColor Green
    }
}

if ($conflicts.Count -gt 0) {
    Write-Host "`n[!] PORT CONFLICTS DETECTED!" -ForegroundColor Red
    Write-Host "Other projects are using our ports:" -ForegroundColor Yellow
    Write-Host "  - cyberguard-platform (ports 3000, 8010, 6333, 27017)" -ForegroundColor Cyan
    Write-Host "  - stacko-nextjs-app (port 8081)" -ForegroundColor Cyan
    
    Write-Host "`nOptions:" -ForegroundColor Yellow
    Write-Host "  1. Stop other projects and start ours" -ForegroundColor White
    Write-Host "  2. Change our ports to avoid conflicts" -ForegroundColor White
    Write-Host "  3. Cancel" -ForegroundColor White
    
    $choice = Read-Host "`nEnter choice (1/2/3)"
    
    if ($choice -eq "1") {
        Write-Host "`nStopping other projects..." -ForegroundColor Yellow
        
        # Stop cyberguard-platform
        Write-Host "  Stopping cyberguard-platform..." -ForegroundColor Gray
        docker stop cyberguard-platform-frontend-1 cyberguard-platform-backend-1 cyberguard-platform-redis-1 cyberguard-platform-qdrant-1 cyberguard-platform-mongo-1 2>$null
        
        # Stop stacko
        Write-Host "  Stopping stacko-nextjs-app..." -ForegroundColor Gray
        docker stop stacko-nextjs-app 2>$null
        
        Start-Sleep -Seconds 2
        Write-Host "  Other projects stopped" -ForegroundColor Green
    }
    elseif ($choice -eq "2") {
        Write-Host "`nTo change ports, edit docker-compose.yml:" -ForegroundColor Yellow
        Write-Host "  Frontend: 3000 -> 3002" -ForegroundColor Gray
        Write-Host "  Backend: 8000 -> 8001" -ForegroundColor Gray
        Write-Host "Press Enter to exit..." -ForegroundColor Gray
        Read-Host
        exit
    }
    else {
        Write-Host "Cancelled" -ForegroundColor Yellow
        exit
    }
}

# Start our project
Write-Host "`n[3] Starting Code Content Generator..." -ForegroundColor Yellow
Write-Host "Building and starting services..." -ForegroundColor Gray

docker-compose up --build -d

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n=== SERVICES STARTED ===" -ForegroundColor Green
    
    Write-Host "`nWaiting for services to initialize..." -ForegroundColor Yellow
    Start-Sleep -Seconds 10
    
    Write-Host "`nRunning containers:" -ForegroundColor Cyan
    docker-compose ps
    
    Write-Host "`n=== ACCESS POINTS ===" -ForegroundColor Cyan
    Write-Host "Frontend:  http://localhost:3000" -ForegroundColor White
    Write-Host "Backend:   http://localhost:8000" -ForegroundColor White
    Write-Host "API Docs:  http://localhost:8000/docs" -ForegroundColor White
    Write-Host "MongoDB:   localhost:27017" -ForegroundColor White
    Write-Host "Qdrant:    localhost:6333" -ForegroundColor White
    
    Write-Host "`n=== USEFUL COMMANDS ===" -ForegroundColor Cyan
    Write-Host "View logs:     docker-compose logs -f backend" -ForegroundColor Gray
    Write-Host "Stop all:      docker-compose down" -ForegroundColor Gray
    Write-Host "Restart:       docker-compose restart backend" -ForegroundColor Gray
    Write-Host "Health check:  .\check-health.ps1" -ForegroundColor Gray
    
} else {
    Write-Host "`nFailed to start services!" -ForegroundColor Red
    Write-Host "Check logs with: docker-compose logs" -ForegroundColor Gray
}
