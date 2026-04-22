# AUTOMATED SETUP SCRIPT
# Run this script to quickly set up the project

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "   ENCRYPTED CHAT - AUTOMATED SETUP" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking prerequisites..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "Node.js is installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Host "npm is installed: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: npm is not installed!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "BACKEND SETUP" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

# Navigate to backend directory
Set-Location -Path "$PSScriptRoot\backend"
Write-Host "Current directory: backend\" -ForegroundColor Yellow

# Install backend dependencies
Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "Backend dependencies installed successfully!" -ForegroundColor Green
} else {
    Write-Host "ERROR: Failed to install backend dependencies" -ForegroundColor Red
    exit 1
}

# .env file already created, just verify
if (Test-Path ".env") {
    Write-Host "Backend .env file exists" -ForegroundColor Green
} else {
    Write-Host "WARNING: Backend .env file not found" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "FRONTEND SETUP" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

# Navigate to frontend directory
Set-Location -Path "$PSScriptRoot\frontend"
Write-Host "Current directory: frontend\" -ForegroundColor Yellow

# Install frontend dependencies
Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "Frontend dependencies installed successfully!" -ForegroundColor Green
} else {
    Write-Host "ERROR: Failed to install frontend dependencies" -ForegroundColor Red
    exit 1
}

# .env file already created, just verify
if (Test-Path ".env") {
    Write-Host "Frontend .env file exists" -ForegroundColor Green
} else {
    Write-Host "WARNING: Frontend .env file not found" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "        SETUP COMPLETED!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""

Write-Host "NEXT STEPS:" -ForegroundColor Cyan
Write-Host ""
Write-Host "To start the application, run:" -ForegroundColor Yellow
Write-Host "   .\start.ps1" -ForegroundColor White
Write-Host ""
Write-Host "Or manually start:" -ForegroundColor Yellow
Write-Host "   Backend:  cd backend; npm start" -ForegroundColor White
Write-Host "   Frontend: cd frontend; npm start" -ForegroundColor White
Write-Host ""
Write-Host "The encrypted chat system is ready to use!" -ForegroundColor Green
Write-Host ""

# Return to root directory
Set-Location -Path $PSScriptRoot
