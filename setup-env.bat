@echo off
REM HAP FlashCard Environment Setup Script for Windows

echo 🔧 Setting up environment files for HAP FlashCard
echo =================================================

REM Create frontend .env file
echo 📝 Creating frontend .env file...
(
    echo # HAP FlashCard Frontend Environment Variables
    echo.
    echo # API Configuration
    echo VITE_API_URL=http://localhost:5000/api
    echo.
    echo # Development Settings
    echo NODE_ENV=development
) > .env

echo ✅ Frontend .env file created

REM Create backend .env file
echo 📝 Creating backend .env file...
(
    echo # HAP FlashCard Backend Environment Variables
    echo.
    echo # Server Configuration
    echo NODE_ENV=development
    echo PORT=5000
    echo.
    echo # JWT Configuration
    echo JWT_SECRET=your-super-secret-jwt-key-here-make-it-at-least-32-characters-long
    echo JWT_EXPIRES_IN=7d
    echo.
    echo # CORS Configuration
    echo FRONTEND_URL=http://localhost:5173
    echo.
    echo # Database Configuration ^(choose one^)
    echo.
    echo # Option 1: PostgreSQL ^(Render^) - Recommended
    echo # DATABASE_URL=postgres://username:password@localhost:5432/hap_flashcard
    echo.
    echo # Option 2: MongoDB ^(Alternative^)
    echo MONGO_URI=mongodb://localhost:27017/hap-flashcard
    echo.
    echo # For production deployment, use these instead:
    echo # DATABASE_URL=postgres://username:password@host:port/database
    echo # MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/hap-flashcard
) > hap-backend\.env

echo ✅ Backend .env file created

echo.
echo 🎉 Environment files created successfully!
echo.
echo 📋 Next steps:
echo 1. Update the database configuration in hap-backend\.env
echo 2. Generate a strong JWT_SECRET for production
echo 3. Start your development servers:
echo    - Backend: cd hap-backend ^&^& npm run dev
echo    - Frontend: npm run dev
echo.
echo 🔒 Security Note:
echo - Never commit .env files to version control
echo - Use different secrets for development and production
echo - Keep your JWT_SECRET secure and unique
pause
