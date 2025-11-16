# Ghana Post - Installation Script
# This script sets up and runs the entire application

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Ghana Post Application Setup" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking for Node.js..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
if ($nodeVersion) {
    Write-Host "✓ Node.js found: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "✗ Node.js is not installed. Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Installing dependencies..." -ForegroundColor Yellow
Write-Host ""

# Install root dependencies
Write-Host "1. Installing root dependencies..." -ForegroundColor Cyan
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to install root dependencies" -ForegroundColor Red
    exit 1
}

# Install server dependencies
Write-Host ""
Write-Host "2. Installing server dependencies..." -ForegroundColor Cyan
cd server
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to install server dependencies" -ForegroundColor Red
    exit 1
}
cd ..

# Install client dependencies
Write-Host ""
Write-Host "3. Installing client dependencies..." -ForegroundColor Cyan
cd client
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to install client dependencies" -ForegroundColor Red
    exit 1
}
cd ..

Write-Host ""
Write-Host "=====================================" -ForegroundColor Green
Write-Host "✓ Installation Complete!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Open two terminals" -ForegroundColor White
Write-Host ""
Write-Host "Terminal 1 (Backend):" -ForegroundColor Yellow
Write-Host "  cd server" -ForegroundColor White
Write-Host "  npm start" -ForegroundColor White
Write-Host ""
Write-Host "Terminal 2 (Frontend):" -ForegroundColor Yellow
Write-Host "  cd client" -ForegroundColor White
Write-Host "  npm start" -ForegroundColor White
Write-Host ""
Write-Host "Or run both together:" -ForegroundColor Yellow
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Admin Credentials:" -ForegroundColor Cyan
Write-Host "  Username: admin" -ForegroundColor White
Write-Host "  Password: ghanapost2024" -ForegroundColor White
Write-Host ""
Write-Host "For more information, see SETUP.md or README.md" -ForegroundColor Cyan
Write-Host ""
