# ===================================
# 📱 Mobile Access Setup Script
# ===================================
# This script automatically configures your app for mobile access on local network

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   📱 Mobile Access Setup Wizard" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Get Local IP Address
Write-Host "🔍 Step 1: Finding your local IP address..." -ForegroundColor Yellow
Write-Host ""

$localIP = (Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias "Wi-Fi*" | Where-Object {$_.IPAddress -like "192.168.*" -or $_.IPAddress -like "10.*"} | Select-Object -First 1).IPAddress

if (-not $localIP) {
    Write-Host "⚠️  Could not auto-detect WiFi IP. Trying Ethernet..." -ForegroundColor Yellow
    $localIP = (Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias "Ethernet*" | Where-Object {$_.IPAddress -like "192.168.*" -or $_.IPAddress -like "10.*"} | Select-Object -First 1).IPAddress
}

if (-not $localIP) {
    Write-Host "❌ Could not detect your local IP address automatically." -ForegroundColor Red
    Write-Host "Please run 'ipconfig' and enter your IPv4 address manually:" -ForegroundColor Yellow
    $localIP = Read-Host "Enter your IP address"
}

Write-Host "✅ Detected IP Address: $localIP" -ForegroundColor Green
Write-Host ""

# Confirm with user
$confirm = Read-Host "Is this correct? (Y/n)"
if ($confirm -eq "n" -or $confirm -eq "N") {
    $localIP = Read-Host "Enter your correct IP address"
}

Write-Host ""
Write-Host "📝 Using IP Address: $localIP" -ForegroundColor Green
Write-Host ""

# Step 2: Create Backend .env file
Write-Host "🔧 Step 2: Configuring backend..." -ForegroundColor Yellow

$backendEnvPath = ".\backend\.env"
$backendEnvContent = @"
# Backend Configuration for Mobile Access
PORT=5000
FRONTEND_URL=http://${localIP}:3000
NODE_ENV=development

# Add your other environment variables below
# MONGODB_URI=your_mongodb_uri
# JWT_SECRET=your_jwt_secret
"@

$backendEnvContent | Out-File -FilePath $backendEnvPath -Encoding UTF8 -Force
Write-Host "   ✅ Created: backend\.env" -ForegroundColor Green

# Step 3: Create Frontend .env file
Write-Host "🔧 Step 3: Configuring frontend..." -ForegroundColor Yellow

$frontendEnvPath = ".\frontend\.env"
$frontendEnvContent = @"
# Frontend Configuration for Mobile Access
REACT_APP_API_URL=http://${localIP}:5000
REACT_APP_SOCKET_URL=http://${localIP}:5000
"@

$frontendEnvContent | Out-File -FilePath $frontendEnvPath -Encoding UTF8 -Force
Write-Host "   ✅ Created: frontend\.env" -ForegroundColor Green
Write-Host ""

# Step 4: Configure Firewall
Write-Host "🛡️  Step 4: Configuring Windows Firewall..." -ForegroundColor Yellow
Write-Host "   This requires Administrator privileges." -ForegroundColor Gray
Write-Host ""

$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if ($isAdmin) {
    Write-Host "   ✅ Running as Administrator" -ForegroundColor Green
    
    # Check if rules already exist
    $backendRule = Get-NetFirewallRule -DisplayName "Chat App Backend" -ErrorAction SilentlyContinue
    $frontendRule = Get-NetFirewallRule -DisplayName "Chat App Frontend" -ErrorAction SilentlyContinue
    
    # Backend firewall rule
    if ($backendRule) {
        Write-Host "   ⚠️  Firewall rule 'Chat App Backend' already exists" -ForegroundColor Yellow
    } else {
        New-NetFirewallRule -DisplayName "Chat App Backend" -Direction Inbound -LocalPort 5000 -Protocol TCP -Action Allow | Out-Null
        Write-Host "   ✅ Added firewall rule for port 5000 (Backend)" -ForegroundColor Green
    }
    
    # Frontend firewall rule
    if ($frontendRule) {
        Write-Host "   ⚠️  Firewall rule 'Chat App Frontend' already exists" -ForegroundColor Yellow
    } else {
        New-NetFirewallRule -DisplayName "Chat App Frontend" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow | Out-Null
        Write-Host "   ✅ Added firewall rule for port 3000 (Frontend)" -ForegroundColor Green
    }
} else {
    Write-Host "   ⚠️  Not running as Administrator - Skipping firewall configuration" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "   To add firewall rules, run this command as Administrator:" -ForegroundColor Yellow
    Write-Host "   New-NetFirewallRule -DisplayName 'Chat App Backend' -Direction Inbound -LocalPort 5000 -Protocol TCP -Action Allow" -ForegroundColor Gray
    Write-Host "   New-NetFirewallRule -DisplayName 'Chat App Frontend' -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow" -ForegroundColor Gray
    Write-Host ""
    Write-Host "   Or right-click this script and 'Run as Administrator'" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   ✅ Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Display connection info
Write-Host "📱 Mobile Access Information:" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""
Write-Host "   1️⃣  Start your servers:" -ForegroundColor Yellow
Write-Host "      .\start.ps1" -ForegroundColor White
Write-Host ""
Write-Host "   2️⃣  Connect your mobile to the same WiFi network" -ForegroundColor Yellow
Write-Host ""
Write-Host "   3️⃣  Open browser on mobile and visit:" -ForegroundColor Yellow
Write-Host "      http://$localIP:3000" -ForegroundColor Green -BackgroundColor Black
Write-Host ""
Write-Host "   4️⃣  Test backend connection:" -ForegroundColor Yellow
Write-Host "      http://$localIP:5000/health" -ForegroundColor Green -BackgroundColor Black
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

# Save info to file
$infoContent = @"
📱 Mobile Access Information
Generated: $(Get-Date)

Your Computer's IP: $localIP

Access URLs:
• Frontend: http://$localIP:3000
• Backend Health: http://$localIP:5000/health

Files Created:
• backend\.env
• frontend\.env

Next Steps:
1. Run: .\start.ps1
2. Connect mobile to same WiFi
3. Open: http://$localIP:3000 on mobile browser

Troubleshooting:
• If IP changes, run this script again
• Make sure firewall allows ports 3000 and 5000
• Both devices must be on same WiFi network

For detailed guide, see: MOBILE_ACCESS.md
"@

$infoContent | Out-File -FilePath ".\MOBILE_ACCESS_INFO.txt" -Encoding UTF8 -Force
Write-Host "💾 Connection info saved to: MOBILE_ACCESS_INFO.txt" -ForegroundColor Magenta
Write-Host ""

Write-Host "📖 For troubleshooting, see: MOBILE_ACCESS.md" -ForegroundColor Cyan
Write-Host ""
Write-Host "🚀 Ready to start? Run: .\start.ps1" -ForegroundColor Green
Write-Host ""

# Offer to start servers
$startNow = Read-Host "Would you like to start the servers now? (Y/n)"
if ($startNow -ne "n" -and $startNow -ne "N") {
    Write-Host ""
    Write-Host "🚀 Starting servers..." -ForegroundColor Green
    & .\start.ps1
}
