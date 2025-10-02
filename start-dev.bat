@echo off
REM HAP FlashCard Development Startup Script for Windows

echo 🚀 Starting HAP FlashCard Development Environment
echo ==================================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Node.js and npm are installed

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd hap-backend
npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)

cd ..

REM Check if .env files exist
if not exist ".env" (
    echo ⚠️  Creating .env file from template...
    copy env.example .env
    echo 📝 Please update .env with your configuration
)

if not exist "hap-backend\.env" (
    echo ⚠️  Creating backend .env file...
    (
        echo # Backend Environment Variables
        echo NODE_ENV=development
        echo PORT=5000
        echo JWT_SECRET=your-super-secret-jwt-key-here
        echo JWT_EXPIRES_IN=7d
        echo FRONTEND_URL=http://localhost:5173
        echo.
        echo # Database Configuration ^(choose one^)
        echo # For PostgreSQL ^(Render^)
        echo # DATABASE_URL=postgres://username:password@localhost:5432/hap_flashcard
        echo.
        echo # For MongoDB ^(Alternative^)
        echo MONGO_URI=mongodb://localhost:27017/hap-flashcard
    ) > hap-backend\.env
    echo 📝 Please update hap-backend\.env with your database configuration
)

echo.
echo 🎉 Setup complete! Starting development servers...
echo.
echo 📋 Next steps:
echo 1. Update .env files with your configuration
echo 2. Start backend: cd hap-backend ^&^& npm run dev
echo 3. Start frontend: npm run dev
echo 4. Visit http://localhost:5173
echo.
echo 📚 Documentation:
echo - Complete Deployment Guide: COMPLETE_DEPLOYMENT_GUIDE.md
echo - Development Guide: RENDER_DEVELOPMENT_GUIDE.md
echo - Deployment Checklist: DEPLOYMENT_CHECKLIST.md
echo.
echo 🚀 Happy coding!
pause
