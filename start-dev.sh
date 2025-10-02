#!/bin/bash

# HAP FlashCard Development Startup Script

echo "🚀 Starting HAP FlashCard Development Environment"
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd hap-backend
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

cd ..

# Check if .env files exist
if [ ! -f ".env" ]; then
    echo "⚠️  Creating .env file from template..."
    cp env.example .env
    echo "📝 Please update .env with your configuration"
fi

if [ ! -f "hap-backend/.env" ]; then
    echo "⚠️  Creating backend .env file..."
    cat > hap-backend/.env << EOF
# Backend Environment Variables
NODE_ENV=development
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173

# Database Configuration (choose one)
# For PostgreSQL (Render)
# DATABASE_URL=postgres://username:password@localhost:5432/hap_flashcard

# For MongoDB (Alternative)
MONGO_URI=mongodb://localhost:27017/hap-flashcard
EOF
    echo "📝 Please update hap-backend/.env with your database configuration"
fi

echo ""
echo "🎉 Setup complete! Starting development servers..."
echo ""
echo "📋 Next steps:"
echo "1. Update .env files with your configuration"
echo "2. Start backend: cd hap-backend && npm run dev"
echo "3. Start frontend: npm run dev"
echo "4. Visit http://localhost:5173"
echo ""
echo "📚 Documentation:"
echo "- Complete Deployment Guide: COMPLETE_DEPLOYMENT_GUIDE.md"
echo "- Development Guide: RENDER_DEVELOPMENT_GUIDE.md"
echo "- Deployment Checklist: DEPLOYMENT_CHECKLIST.md"
echo ""
echo "🚀 Happy coding!"
