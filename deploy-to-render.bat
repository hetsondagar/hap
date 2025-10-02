@echo off
REM HAP FlashCard Render Deployment Script for Windows

echo 🚀 Deploying HAP FlashCard Backend to Render
echo =============================================

REM Check if we're in the right directory
if not exist "hap-backend" (
    echo ❌ Error: hap-backend directory not found
    echo Please run this script from the root of your HAP FlashCard project
    pause
    exit /b 1
)

REM Check if git is initialized
if not exist ".git" (
    echo ❌ Error: Git not initialized
    echo Please run: git init ^&^& git add . ^&^& git commit -m "Initial commit"
    pause
    exit /b 1
)

REM Check if backend has been built
echo 🔨 Building backend...
cd hap-backend

REM Install dependencies
echo 📦 Installing dependencies...
npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

REM Build the project
echo 🔨 Building TypeScript...
npm run build

if %errorlevel% neq 0 (
    echo ❌ Build failed. Please check for TypeScript errors
    pause
    exit /b 1
)

cd ..

echo ✅ Backend built successfully

REM Check if render.yaml exists
if not exist "hap-backend\render.yaml" (
    echo ⚠️  Warning: render.yaml not found
    echo Please ensure you have the render.yaml configuration
)

echo.
echo 🎉 Ready for Render deployment!
echo.
echo 📋 Next steps:
echo 1. Push your code to GitHub:
echo    git add .
echo    git commit -m "Prepare for Render deployment"
echo    git push origin main
echo.
echo 2. Go to Render Dashboard:
echo    https://dashboard.render.com
echo.
echo 3. Create new Web Service:
echo    - Connect your GitHub repository
echo    - Set Root Directory: hap-backend
echo    - Set Build Command: npm install ^&^& npm run build
echo    - Set Start Command: npm start
echo.
echo 4. Configure environment variables:
echo    - NODE_ENV=production
echo    - PORT=10000
echo    - JWT_SECRET=your-secret-here
echo    - JWT_EXPIRES_IN=7d
echo    - FRONTEND_URL=https://your-vercel-app.vercel.app
echo    - DATABASE_URL=your-database-url
echo.
echo 5. Deploy and test:
echo    curl https://your-render-url.onrender.com/health
echo.
echo 📚 For detailed instructions, see:
echo - COMPLETE_DEPLOYMENT_GUIDE.md
echo - RENDER_DEPLOYMENT_FIX.md
pause
