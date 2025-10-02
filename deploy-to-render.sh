#!/bin/bash

# HAP FlashCard Render Deployment Script

echo "🚀 Deploying HAP FlashCard Backend to Render"
echo "============================================="

# Check if we're in the right directory
if [ ! -d "hap-backend" ]; then
    echo "❌ Error: hap-backend directory not found"
    echo "Please run this script from the root of your HAP FlashCard project"
    exit 1
fi

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Error: Git not initialized"
    echo "Please run: git init && git add . && git commit -m 'Initial commit'"
    exit 1
fi

# Check if backend has been built
echo "🔨 Building backend..."
cd hap-backend

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Build the project
echo "🔨 Building TypeScript..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please check for TypeScript errors"
    exit 1
fi

cd ..

echo "✅ Backend built successfully"

# Check if render.yaml exists
if [ ! -f "hap-backend/render.yaml" ]; then
    echo "⚠️  Warning: render.yaml not found"
    echo "Please ensure you have the render.yaml configuration"
fi

echo ""
echo "🎉 Ready for Render deployment!"
echo ""
echo "📋 Next steps:"
echo "1. Push your code to GitHub:"
echo "   git add ."
echo "   git commit -m 'Prepare for Render deployment'"
echo "   git push origin main"
echo ""
echo "2. Go to Render Dashboard:"
echo "   https://dashboard.render.com"
echo ""
echo "3. Create new Web Service:"
echo "   - Connect your GitHub repository"
echo "   - Set Root Directory: hap-backend"
echo "   - Set Build Command: npm install && npm run build"
echo "   - Set Start Command: npm start"
echo ""
echo "4. Configure environment variables:"
echo "   - NODE_ENV=production"
echo "   - PORT=10000"
echo "   - JWT_SECRET=your-secret-here"
echo "   - JWT_EXPIRES_IN=7d"
echo "   - FRONTEND_URL=https://your-vercel-app.vercel.app"
echo "   - DATABASE_URL=your-database-url"
echo ""
echo "5. Deploy and test:"
echo "   curl https://your-render-url.onrender.com/health"
echo ""
echo "📚 For detailed instructions, see:"
echo "- COMPLETE_DEPLOYMENT_GUIDE.md"
echo "- RENDER_DEPLOYMENT_FIX.md"
