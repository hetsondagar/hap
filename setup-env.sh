#!/bin/bash

# HAP FlashCard Environment Setup Script

echo "🔧 Setting up environment files for HAP FlashCard"
echo "================================================="

# Create frontend .env file
echo "📝 Creating frontend .env file..."
cat > .env << 'EOF'
# HAP FlashCard Frontend Environment Variables

# API Configuration
VITE_API_URL=http://localhost:5000/api

# Development Settings
NODE_ENV=development
EOF

echo "✅ Frontend .env file created"

# Create backend .env file
echo "📝 Creating backend .env file..."
cat > hap-backend/.env << 'EOF'
# HAP FlashCard Backend Environment Variables

# Server Configuration
NODE_ENV=development
PORT=5000

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-make-it-at-least-32-characters-long
JWT_EXPIRES_IN=7d

# CORS Configuration
FRONTEND_URL=http://localhost:5173

# Database Configuration (choose one)

# Option 1: PostgreSQL (Render) - Recommended
# DATABASE_URL=postgres://username:password@localhost:5432/hap_flashcard

# Option 2: MongoDB (Alternative)
MONGO_URI=mongodb://localhost:27017/hap-flashcard

# For production deployment, use these instead:
# DATABASE_URL=postgres://username:password@host:port/database
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/hap-flashcard
EOF

echo "✅ Backend .env file created"

echo ""
echo "🎉 Environment files created successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Update the database configuration in hap-backend/.env"
echo "2. Generate a strong JWT_SECRET for production"
echo "3. Start your development servers:"
echo "   - Backend: cd hap-backend && npm run dev"
echo "   - Frontend: npm run dev"
echo ""
echo "🔒 Security Note:"
echo "- Never commit .env files to version control"
echo "- Use different secrets for development and production"
echo "- Keep your JWT_SECRET secure and unique"
