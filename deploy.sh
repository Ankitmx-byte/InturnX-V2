#!/bin/bash

# InturnX V2 - Vercel Production Deployment Script
# This script helps deploy InturnX V2 to Vercel with production environment

set -e

echo "🚀 InturnX V2 - Vercel Production Deployment"
echo "=============================================="
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed."
    echo "Install it with: npm install -g vercel"
    exit 1
fi

# Check if git is clean
if ! git diff-index --quiet HEAD --; then
    echo "⚠️  You have uncommitted changes. Please commit them first."
    echo "Run: git add . && git commit -m 'Your message'"
    exit 1
fi

echo "✅ Prerequisites check passed"
echo ""

# Step 1: Build client
echo "📦 Building client..."
cd client
npm run build
cd ..
echo "✅ Client built successfully"
echo ""

# Step 2: Install dependencies
echo "📦 Installing dependencies..."
npm install
npm install --prefix server
npm install --prefix client
echo "✅ Dependencies installed"
echo ""

# Step 3: Deploy to Vercel
echo "🚀 Deploying to Vercel..."
echo ""
echo "⚠️  Make sure you have set the following environment variables in Vercel dashboard:"
echo "   - MONGODB_URI: Your MongoDB Atlas connection string"
echo "   - JWT_SECRET: Your generated JWT secret"
echo "   - CLIENT_URL: Your Vercel domain"
echo "   - AI_SERVICE_URL: Your AI service URL"
echo "   - NODE_ENV: production"
echo ""
read -p "Press Enter to continue with deployment..."
echo ""

vercel --prod

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Verify your deployment at https://your-domain.vercel.app"
echo "2. Check API health at https://your-domain.vercel.app/api/health"
echo "3. Deploy AI service separately (Hugging Face Spaces or Railway)"
echo "4. Update AI_SERVICE_URL in Vercel environment variables"
echo ""

