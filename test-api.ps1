# Test Script for Code Content Generator API
# Run this to test if the backend is working

Write-Host "🧪 Testing Code Content Generator API..." -ForegroundColor Cyan
Write-Host ""

# Test 1: Health Check
Write-Host "📊 Test 1: Health Check" -ForegroundColor Yellow
try {
    $health = Invoke-WebRequest -Uri "http://localhost:3002/api/health" -Method GET
    $healthData = $health.Content | ConvertFrom-Json
    Write-Host "✅ Backend is healthy!" -ForegroundColor Green
    Write-Host "   Model: $($healthData.model)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Backend health check failed: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Test 2: Simple Generation
Write-Host "📊 Test 2: Generation Test (this may take 60-120 seconds)..." -ForegroundColor Yellow
Write-Host "   Sending request to generate explanation..." -ForegroundColor Gray

$testProblem = @{
    input_type = "text"
    content = "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

Example 1:
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1]."
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3002/api/generate" `
                                  -Method POST `
                                  -Body $testProblem `
                                  -ContentType "application/json" `
                                  -TimeoutSec 300
    
    $result = $response.Content | ConvertFrom-Json
    
    Write-Host "✅ Generation successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📄 Response includes:" -ForegroundColor Cyan
    Write-Host "   - Overview: $($result.overview.Substring(0, [Math]::Min(50, $result.overview.Length)))..." -ForegroundColor Gray
    Write-Host "   - Concepts: $($result.concepts.concepts -join ', ')" -ForegroundColor Gray
    Write-Host "   - Naive Approach: $($result.naive_approach.name)" -ForegroundColor Gray
    Write-Host "   - Optimal Approach: $($result.optimal_approach.name)" -ForegroundColor Gray
    Write-Host "   - Pitfalls Count: $($result.pitfalls.Count)" -ForegroundColor Gray
    Write-Host "   - Edge Cases Count: $($result.edge_cases.Count)" -ForegroundColor Gray
    
    Write-Host ""
    Write-Host "🎉 All tests passed! Your Code Content Generator is working!" -ForegroundColor Green
    Write-Host "   Open http://localhost:3002 in your browser to use the UI" -ForegroundColor Cyan
    
} catch {
    Write-Host "❌ Generation failed: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "📋 Checking backend logs..." -ForegroundColor Yellow
    docker logs code-gen-backend --tail 20
    exit 1
}
