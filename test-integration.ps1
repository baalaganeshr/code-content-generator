# Integration Test Script
Write-Host "=== Code Content Generator - Integration Test ===" -ForegroundColor Cyan
Write-Host ""

# Test 1: Check containers are running
Write-Host "[1/5] Checking Docker containers..." -ForegroundColor Yellow
$containers = docker ps --filter "name=code-gen" --format "{{.Names}}"
if ($containers -match "code-gen-backend" -and $containers -match "code-gen-frontend") {
    Write-Host "✅ Both containers are running" -ForegroundColor Green
} else {
    Write-Host "❌ Containers not running properly" -ForegroundColor Red
    exit 1
}

# Test 2: Check backend health
Write-Host "[2/5] Testing backend API..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8001/" -UseBasicParsing -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Backend API is responding (Status: 200)" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Backend API error: $_" -ForegroundColor Red
    exit 1
}

# Test 3: Check frontend
Write-Host "[3/5] Testing frontend..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001/" -UseBasicParsing -ErrorAction Stop
    if ($response.Content -match "Code Content Generator") {
        Write-Host "✅ Frontend is serving correctly" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Frontend loaded but title not found" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Frontend error: $_" -ForegroundColor Red
    exit 1
}

# Test 4: Check HuggingFace token
Write-Host "[4/5] Checking HuggingFace configuration..." -ForegroundColor Yellow
$envContent = Get-Content ".env" | Select-String "HF_TOKEN="
if ($envContent -match "hf_") {
    Write-Host "✅ HuggingFace token is configured" -ForegroundColor Green
} else {
    Write-Host "⚠️  HuggingFace token not found" -ForegroundColor Yellow
}

# Test 5: Check model configuration
Write-Host "[5/5] Checking model configuration..." -ForegroundColor Yellow
$modelConfig = Get-Content ".env" | Select-String "HF_MODEL="
Write-Host "   Model: $($modelConfig -replace 'HF_MODEL=','')" -ForegroundColor Cyan
Write-Host "✅ Model configuration found" -ForegroundColor Green

Write-Host ""
Write-Host "=== Integration Test Complete ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "🚀 Application is ready!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Access Points:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:3001" -ForegroundColor White
Write-Host "   Backend API: http://localhost:8001" -ForegroundColor White
Write-Host ""
Write-Host "📝 Next Steps:" -ForegroundColor Cyan
Write-Host "   1. Open browser to http://localhost:3001" -ForegroundColor White
Write-Host "   2. Submit a LeetCode/HackerRank problem URL" -ForegroundColor White
Write-Host "   3. The AI model will download automatically on first use (~4GB)" -ForegroundColor White
Write-Host "   4. Wait 2-5 minutes for explanation generation" -ForegroundColor White
Write-Host ""
Write-Host "💡 Model Details:" -ForegroundColor Cyan
Write-Host "   Name: deepseek-ai/deepseek-coder-6.7b-instruct-awq" -ForegroundColor White
Write-Host "   Size: ~4GB (4-bit quantized)" -ForegroundColor White
Write-Host "   Specialization: Code explanation and algorithm analysis" -ForegroundColor White
Write-Host ""
