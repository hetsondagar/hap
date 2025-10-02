# 🔧 HAP FlashCard Environment Variables Guide

## 📁 Environment Files Created

✅ **Frontend `.env`** - Created in root directory
✅ **Backend `.env`** - Created in `hap-backend/` directory

## 🎯 Frontend Environment Variables

### `.env` (Root Directory)
```env
# HAP FlashCard Frontend Environment Variables

# API Configuration
VITE_API_URL=http://localhost:5000/api

# Development Settings
NODE_ENV=development
```

### For Production (Vercel)
```env
VITE_API_URL=https://your-render-url.onrender.com/api
```

## 🎯 Backend Environment Variables

### `.env` (hap-backend/ Directory)
```env
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
```

### For Production (Render)
```env
NODE_ENV=production
PORT=10000
JWT_SECRET=your-production-jwt-secret-here
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://your-vercel-app.vercel.app

# For PostgreSQL (Render)
DATABASE_URL=postgres://username:password@host:port/database

# For MongoDB (Atlas)
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/hap-flashcard
```

## 🔧 Configuration Steps

### 1. Database Setup
Choose one database option:

#### Option A: PostgreSQL (Render - Recommended)
1. Create Render PostgreSQL database
2. Copy the connection string
3. Update `hap-backend/.env`:
   ```env
   DATABASE_URL=postgres://username:password@host:port/database
   ```

#### Option B: MongoDB Atlas
1. Create MongoDB Atlas cluster
2. Get connection string
3. Update `hap-backend/.env`:
   ```env
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/hap-flashcard
   ```

### 2. JWT Secret
Generate a strong JWT secret:
```bash
# Generate a random secret (32+ characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Development vs Production
- **Development**: Use local database and localhost URLs
- **Production**: Use cloud database and deployment URLs

## 🚀 Quick Start Commands

### Start Development Servers
```bash
# Terminal 1 - Backend
cd hap-backend
npm run dev

# Terminal 2 - Frontend
npm run dev
```

### Test Your Setup
```bash
# Test backend health
curl http://localhost:5000/health

# Test API endpoint
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"password123"}'
```

## 🔒 Security Best Practices

### Environment Variables
- ✅ Never commit `.env` files to version control
- ✅ Use different secrets for development and production
- ✅ Keep JWT secrets strong and unique
- ✅ Rotate secrets regularly

### Database Security
- ✅ Use strong database passwords
- ✅ Limit network access appropriately
- ✅ Regular backups
- ✅ Monitor access logs

## 📋 Environment Variables Reference

### Frontend Variables
| Variable | Description | Development | Production |
|----------|-------------|-------------|------------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000/api` | `https://your-render-url.onrender.com/api` |
| `NODE_ENV` | Environment | `development` | `production` |

### Backend Variables
| Variable | Description | Development | Production |
|----------|-------------|-------------|------------|
| `NODE_ENV` | Environment | `development` | `production` |
| `PORT` | Server port | `5000` | `10000` |
| `JWT_SECRET` | JWT signing secret | `your-dev-secret` | `your-prod-secret` |
| `JWT_EXPIRES_IN` | Token expiration | `7d` | `7d` |
| `FRONTEND_URL` | CORS origin | `http://localhost:5173` | `https://your-vercel-app.vercel.app` |
| `DATABASE_URL` | PostgreSQL URL | `postgres://...` | `postgres://...` |
| `MONGO_URI` | MongoDB URL | `mongodb://...` | `mongodb+srv://...` |

## 🚨 Troubleshooting

### Common Issues
1. **Database Connection Failed**
   - Check connection string format
   - Verify database is running
   - Check network access

2. **CORS Errors**
   - Verify `FRONTEND_URL` matches your frontend URL
   - Check for typos in URLs

3. **JWT Errors**
   - Ensure JWT_SECRET is set
   - Check secret is strong enough
   - Verify token expiration

4. **API Not Found**
   - Check `VITE_API_URL` is correct
   - Verify backend is running
   - Check port numbers

### Debug Steps
1. Check environment variables are loaded
2. Verify database connection
3. Test API endpoints individually
4. Check browser console for errors
5. Review server logs

## 📚 Next Steps

1. **Update Database Configuration**
   - Choose PostgreSQL or MongoDB
   - Update connection string in `hap-backend/.env`

2. **Generate Strong JWT Secret**
   - Use a secure random generator
   - Update `JWT_SECRET` in `hap-backend/.env`

3. **Start Development**
   - Run backend: `cd hap-backend && npm run dev`
   - Run frontend: `npm run dev`

4. **Test Everything**
   - Visit `http://localhost:5173`
   - Try to register a new user
   - Check browser console for errors

---

**🎉 Your environment is now configured and ready for development!**
