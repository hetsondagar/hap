# 🔧 Render Deployment Fix Guide

## 🚨 Issue: Missing Script "start"

The error occurs because Render is trying to run `npm start` from the root directory, but the start script is in the `hap-backend` directory.

## ✅ Solutions Applied

### 1. Updated Render Configuration
Updated `hap-backend/render.yaml` to specify the correct root directory:

```yaml
services:
  - type: web
    name: hap-backend
    env: node
    plan: free
    rootDir: hap-backend  # ← This tells Render to use hap-backend directory
    buildCommand: npm install && npm run build
    startCommand: npm start
```

### 2. Added Convenience Scripts
Updated root `package.json` with helpful scripts:

```json
{
  "scripts": {
    "start": "npm run dev",
    "backend:dev": "cd hap-backend && npm run dev",
    "backend:build": "cd hap-backend && npm run build",
    "backend:start": "cd hap-backend && npm start",
    "setup": "npm install && cd hap-backend && npm install"
  }
}
```

## 🚀 How to Fix Your Render Deployment

### Option 1: Update Render Service Settings (Recommended)

1. **Go to your Render Dashboard**
2. **Click on your service**
3. **Go to "Settings" tab**
4. **Update these settings:**
   - **Root Directory**: `hap-backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. **Save and redeploy**

### Option 2: Use Render.yaml Configuration

1. **Push the updated `hap-backend/render.yaml` to GitHub**
2. **In Render Dashboard:**
   - Go to your service
   - Click "Settings"
   - Enable "Auto-Deploy" if not already enabled
3. **Render will automatically use the render.yaml configuration**

### Option 3: Manual Configuration in Render Dashboard

If you prefer to configure manually in the Render dashboard:

1. **Root Directory**: `hap-backend`
2. **Build Command**: `npm install && npm run build`
3. **Start Command**: `npm start`
4. **Environment**: `Node`
5. **Plan**: `Free` (or your preferred plan)

## 🔧 Environment Variables Setup

Make sure these environment variables are set in your Render service:

### Required Variables
```
NODE_ENV=production
PORT=10000
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://your-vercel-app.vercel.app
```

### Database Variables (Choose One)

**For PostgreSQL (Render):**
```
DATABASE_URL=postgres://username:password@host:port/database
```

**For MongoDB Atlas:**
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/hap-flashcard
```

## 🧪 Testing Your Fix

### 1. Check Build Logs
- Go to your Render service
- Click on "Logs" tab
- Look for successful build messages

### 2. Test Health Endpoint
```bash
curl https://your-render-url.onrender.com/health
```

Expected response:
```json
{
  "success": true,
  "message": "HAP FlashCard API is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "production"
}
```

### 3. Test API Endpoints
```bash
# Test signup
curl -X POST https://your-render-url.onrender.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "SecurePass123"
  }'
```

## 🚨 Common Issues and Solutions

### Issue 1: "Cannot find module" errors
**Solution**: Ensure all dependencies are in `package.json` and run `npm install`

### Issue 2: Database connection errors
**Solution**: Check your database connection string and ensure the database is accessible

### Issue 3: CORS errors
**Solution**: Update `FRONTEND_URL` environment variable with your Vercel URL

### Issue 4: Build failures
**Solution**: Check that TypeScript compiles successfully locally first

## 📋 Deployment Checklist

- [ ] Root directory set to `hap-backend`
- [ ] Build command: `npm install && npm run build`
- [ ] Start command: `npm start`
- [ ] Environment variables configured
- [ ] Database connection string set
- [ ] CORS URL updated
- [ ] Service is running and healthy

## 🔄 Redeploy Process

1. **Make sure your changes are pushed to GitHub**
2. **Go to Render Dashboard**
3. **Click "Manual Deploy" or wait for auto-deploy**
4. **Monitor the logs for any errors**
5. **Test the health endpoint**

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [Node.js Deployment Guide](https://render.com/docs/deploy-node-express-app)
- [Environment Variables](https://render.com/docs/environment-variables)
- [Troubleshooting Deploys](https://render.com/docs/troubleshooting-deploys)

---

**🎉 Once fixed, your HAP FlashCard backend will be running successfully on Render!**
