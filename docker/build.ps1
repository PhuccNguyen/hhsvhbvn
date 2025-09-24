# HHSV Docker Build & Deploy Script for Windows
# Run with: powershell -ExecutionPolicy Bypass -File build.ps1

Write-Host "🚀 HHSV Docker Build & Deploy Script" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan

function Write-Status {
    param($Message)
    Write-Host "[INFO] $Message" -ForegroundColor Blue
}

function Write-Success {
    param($Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green
}

function Write-Warning {
    param($Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param($Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

# Check if .env.local exists
if (!(Test-Path "../.env.local")) {
    Write-Warning ".env.local file not found!"
    Write-Status "Creating .env.local template..."
    
    $envContent = @"
# Google Sheets Configuration
GOOGLE_PROJECT_ID=your-project-id
GOOGLE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_SHEET_ID=your-google-sheet-id
GOOGLE_PRIVATE_KEY_B64=your-base64-private-key

# Next.js Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3301
"@
    
    $envContent | Out-File -FilePath "../.env.local" -Encoding UTF8
    Write-Warning "Please update .env.local with your actual values before building!"
    exit 1
}

try {
    Write-Status "Building Docker images..."
    docker-compose build --no-cache
    
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Docker build failed!"
        exit 1
    }
    
    Write-Status "Starting services..."
    docker-compose up -d
    
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to start services!"
        exit 1
    }
    
    Write-Status "Waiting for services to be healthy..."
    Start-Sleep -Seconds 10
    
    # Check if services are running
    $runningServices = docker-compose ps --filter "status=running"
    
    if ($runningServices -match "Up") {
        Write-Success "Services are running!"
        Write-Status "Application URLs:"
        Write-Host "  • Direct access: http://localhost:3301" -ForegroundColor White
        Write-Host "  • Through Nginx: http://localhost" -ForegroundColor White
        Write-Host ""
        Write-Status "Useful commands:"
        Write-Host "  • View logs: docker-compose logs -f" -ForegroundColor White
        Write-Host "  • Stop services: docker-compose down" -ForegroundColor White
        Write-Host "  • Restart: docker-compose restart" -ForegroundColor White
        Write-Host "  • View status: docker-compose ps" -ForegroundColor White
    } else {
        Write-Error "Services failed to start!"
        Write-Status "Checking logs..."
        docker-compose logs
        exit 1
    }
    
} catch {
    Write-Error "An error occurred: $($_.Exception.Message)"
    docker-compose logs
    exit 1
}