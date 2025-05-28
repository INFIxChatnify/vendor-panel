# Railway Deployment Script for Vendor Panel (PowerShell)

Write-Host "🚀 Preparing for Railway deployment..." -ForegroundColor Green

# Check if railway CLI is installed
try {
    railway --version | Out-Null
    Write-Host "✅ Railway CLI found" -ForegroundColor Green
} catch {
    Write-Host "❌ Railway CLI not found. Please install it first:" -ForegroundColor Red
    Write-Host "npm install -g @railway/cli" -ForegroundColor Yellow
    exit 1
}

# Login to Railway (if not already logged in)
Write-Host "🔐 Checking Railway authentication..." -ForegroundColor Blue
try {
    railway whoami | Out-Null
    Write-Host "✅ Already authenticated" -ForegroundColor Green
} catch {
    Write-Host "Please login to Railway..." -ForegroundColor Yellow
    railway login
}

# Create new project or link existing one
Write-Host "📋 Railway project setup..." -ForegroundColor Blue
Write-Host "1. Create new project"
Write-Host "2. Link existing project"
$choice = Read-Host "Choose option (1 or 2)"

if ($choice -eq "1") {
    railway init
} else {
    railway link
}

# Set environment variables
Write-Host "🔧 Setting up environment variables..." -ForegroundColor Blue
Write-Host "Please set the following environment variables in Railway dashboard:" -ForegroundColor Yellow
Write-Host "- VITE_MEDUSA_BACKEND_URL" -ForegroundColor Cyan
Write-Host "- VITE_MEDUSA_STOREFRONT_URL" -ForegroundColor Cyan
Write-Host "- VITE_PUBLISHABLE_API_KEY" -ForegroundColor Cyan
Write-Host "- VITE_TALK_JS_APP_ID" -ForegroundColor Cyan
Write-Host "- VITE_DISABLE_SELLERS_REGISTRATION" -ForegroundColor Cyan
Write-Host "- NODE_ENV=production" -ForegroundColor Cyan

Read-Host "Press Enter when you've set the environment variables..."

# Deploy
Write-Host "🚀 Deploying to Railway..." -ForegroundColor Green
railway up

Write-Host "✅ Deployment completed!" -ForegroundColor Green
Write-Host "🌐 Your app should be available at the Railway-provided URL" -ForegroundColor Blue
