# System Health Check Script
Write-Host "`n=== SYSTEM HEALTH CHECK ===" -ForegroundColor Cyan

# Check backend files
Write-Host "`n[1] Checking Backend Files..." -ForegroundColor Yellow
$backendFiles = @("main.py", "agent.py", "config.py", "models.py", "database.py", "vector_db.py")
foreach ($file in $backendFiles) {
    if (Test-Path "backend/$file") {
        Write-Host "  OK $file" -ForegroundColor Green
    } else {
        Write-Host "  MISSING $file" -ForegroundColor Red
    }
}

# Check .env
Write-Host "`n[2] Checking Configuration..." -ForegroundColor Yellow
if (Test-Path "backend/.env") {
    Write-Host "  OK .env file exists" -ForegroundColor Green
    $env = Get-Content "backend/.env" -Raw
    if ($env -match "HF_TOKEN=hf_") {
        Write-Host "  OK HuggingFace token configured" -ForegroundColor Green
    } else {
        Write-Host "  WARNING HuggingFace token not set" -ForegroundColor Yellow
    }
} else {
    Write-Host "  ERROR .env file missing" -ForegroundColor Red
}

# Check Docker
Write-Host "`n[3] Checking Docker..." -ForegroundColor Yellow
$docker = docker --version 2>$null
if ($docker) {
    Write-Host "  OK Docker: $docker" -ForegroundColor Green
} else {
    Write-Host "  ERROR Docker not found" -ForegroundColor Red
}

# Check containers
Write-Host "`n[4] Checking Containers..." -ForegroundColor Yellow
$containers = docker ps --format "table {{.Names}}\t{{.Status}}" 2>$null
if ($containers) {
    Write-Host $containers -ForegroundColor Cyan
} else {
    Write-Host "  No containers running" -ForegroundColor Yellow
    Write-Host "  Run: docker-compose up -d" -ForegroundColor Gray
}

# Check ports
Write-Host "`n[5] Checking Ports..." -ForegroundColor Yellow
$ports = @{3000="Frontend"; 8000="Backend"; 27017="MongoDB"; 6333="Qdrant"}
foreach ($port in $ports.Keys) {
    $test = Test-NetConnection -ComputerName localhost -Port $port -WarningAction SilentlyContinue -InformationLevel Quiet
    if ($test) {
        Write-Host "  OK Port $port ($($ports[$port])) is active" -ForegroundColor Green
    } else {
        Write-Host "  -- Port $port ($($ports[$port])) not in use" -ForegroundColor Gray
    }
}

# Test Backend API
Write-Host "`n[6] Testing Backend API..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:8000/api/v1/health" -TimeoutSec 5
    Write-Host "  OK Backend API responding" -ForegroundColor Green
    Write-Host "  Status: $($health.status)" -ForegroundColor Cyan
    Write-Host "  Services:" -ForegroundColor Gray
    Write-Host "    MongoDB: $($health.services.mongodb)" -ForegroundColor Cyan
    Write-Host "    Qdrant: $($health.services.qdrant)" -ForegroundColor Cyan
    Write-Host "    HuggingFace: $($health.services.huggingface)" -ForegroundColor Cyan
    Write-Host "    Agent: $($health.services.agent)" -ForegroundColor Cyan
}
catch {
    Write-Host "  Backend API not responding" -ForegroundColor Yellow
    Write-Host "  Start with: docker-compose up -d" -ForegroundColor Gray
}

Write-Host "`n=== SUMMARY ===" -ForegroundColor Cyan
Write-Host "To start all services:" -ForegroundColor White
Write-Host "  docker-compose up --build -d" -ForegroundColor Gray
Write-Host "`nTo view logs:" -ForegroundColor White
Write-Host "  docker-compose logs -f backend" -ForegroundColor Gray
Write-Host "`nAPI Documentation:" -ForegroundColor White
Write-Host "  http://localhost:8000/docs" -ForegroundColor Gray
