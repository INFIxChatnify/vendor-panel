#!/bin/bash

# Railway Deployment Script for Vendor Panel

echo "🚀 Preparing for Railway deployment..."

# Check if railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Please install it first:"
    echo "npm install -g @railway/cli"
    exit 1
fi

# Login to Railway (if not already logged in)
echo "🔐 Checking Railway authentication..."
railway whoami || railway login

# Create new project or link existing one
echo "📋 Railway project setup..."
echo "1. Create new project"
echo "2. Link existing project"
read -p "Choose option (1 or 2): " choice

if [ "$choice" = "1" ]; then
    railway init
else
    railway link
fi

# Set environment variables
echo "🔧 Setting up environment variables..."
echo "Please set the following environment variables in Railway dashboard:"
echo "- VITE_MEDUSA_BACKEND_URL"
echo "- VITE_MEDUSA_STOREFRONT_URL" 
echo "- VITE_PUBLISHABLE_API_KEY"
echo "- VITE_TALK_JS_APP_ID"
echo "- VITE_DISABLE_SELLERS_REGISTRATION"
echo "- NODE_ENV=production"

read -p "Press Enter when you've set the environment variables..."

# Deploy
echo "🚀 Deploying to Railway..."
railway up

echo "✅ Deployment completed!"
echo "🌐 Your app should be available at the Railway-provided URL"
