# Test the Code Content Generator API

$apiUrl = "http://localhost:8001/api/v1/generate"

$body = @{
    input_type = "problem"
    content = "Write a function to find the two numbers in an array that add up to a target sum"
    language = "python"
    difficulty = "medium"
} | ConvertTo-Json

Write-Host "Testing Code Content Generator API..." -ForegroundColor Cyan
Write-Host "Endpoint: $apiUrl" -ForegroundColor Gray
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri $apiUrl -Method Post -Body $body -ContentType "application/json"
    
    Write-Host "✓ API Response Received!" -ForegroundColor Green
    Write-Host ""
    
    # Check for all required output fields
    $requiredFields = @(
        "overview",
        "concepts",
        "naive_approach",
        "optimal_approach",
        "worked_example",
        "complexity_analysis",
        "pitfalls",
        "edge_cases",
        "test_cases",
        "related_problems"
    )
    
    Write-Host "Checking Output Format:" -ForegroundColor Yellow
    foreach ($field in $requiredFields) {
        if ($response.PSObject.Properties.Name -contains $field) {
            Write-Host "  ✓ $field" -ForegroundColor Green
        } else {
            Write-Host "  ✗ $field (MISSING)" -ForegroundColor Red
        }
    }
    
    Write-Host ""
    Write-Host "Sample Output:" -ForegroundColor Cyan
    Write-Host "============================================" -ForegroundColor Gray
    Write-Host "Overview: $($response.overview.Substring(0, [Math]::Min(100, $response.overview.Length)))..." -ForegroundColor White
    Write-Host ""
    Write-Host "Concepts: $($response.concepts -join ', ')" -ForegroundColor White
    Write-Host ""
    Write-Host "Naive Approach:" -ForegroundColor White
    Write-Host $response.naive_approach.description.Substring(0, [Math]::Min(150, $response.naive_approach.description.Length)) -ForegroundColor Gray
    Write-Host ""
    Write-Host "✓ Full API Test Passed!" -ForegroundColor Green
    
} catch {
    Write-Host "✗ API Test Failed!" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "Status Code: $statusCode" -ForegroundColor Yellow
    }
}
