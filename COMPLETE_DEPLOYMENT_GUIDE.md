# 🚀 Complete Deployment Guide: HAP FlashCard App

This guide will walk you through deploying your HAP FlashCard application with:
- **Backend API** → Railway
- **Frontend React App** → Vercel
- **Database** → MongoDB Atlas

## 📋 Prerequisites

Before starting, ensure you have:
- [ ] GitHub account
- [ ] Railway account (sign up at [railway.app](https://railway.app))
- [ ] Vercel account (sign up at [vercel.com](https://vercel.com))
- [ ] MongoDB Atlas account (sign up at [cloud.mongodb.com](https://cloud.mongodb.com))
- [ ] Git installed locally
- [ ] Node.js installed locally

---

## 🗄️ Part 1: MongoDB Atlas Setup

### Step 1.1: Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Click "Try Free" and create an account
3. Verify your email address

### Step 1.2: Create a New Project
1. Click "New Project"
2. Name it "HAP FlashCard"
3. Click "Next"
4. Click "Create Project"

### Step 1.3: Build a Database
1. Click "Build a Database"
2. Choose "FREE" tier (M0 Sandbox)
3. Select a region close to your users (e.g., US East)
4. Name your cluster: `hap-flashcard-cluster`
5. Click "Create"

### Step 1.4: Create Database User
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create a username: `hap-user`
5. Generate a strong password (save it!)
6. Set privileges to "Read and write to any database"
7. Click "Add User"

### Step 1.5: Configure Network Access
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Add a comment: "Railway deployment"
5. Click "Confirm"

### Step 1.6: Get Connection String
1. Go to "Database" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Select "Node.js" and version "4.1 or later"
5. Copy the connection string
6. Replace `<password>` with your database user password
7. Replace `<dbname>` with `hap-flashcard`

**Your connection string should look like:**
```
mongodb+srv://hap-user:your-password@hap-flashcard-cluster.xxxxx.mongodb.net/hap-flashcard?retryWrites=true&w=majority
```

---

## 🚂 Part 2: Backend Deployment on Railway

### Step 2.1: Prepare Backend Repository
1. Open terminal in your project directory
2. Navigate to the backend folder:
   ```bash
   cd hap-backend
   ```

3. Initialize git if not already done:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: HAP FlashCard Backend API"
   ```

4. Create a new repository on GitHub:
   - Go to [GitHub](https://github.com)
   - Click "New repository"
   - Name it `hap-backend`
   - Make it public
   - Don't initialize with README
   - Click "Create repository"

5. Connect and push to GitHub:
   ```bash
   git remote add origin https://github.com/yourusername/hap-backend.git
   git branch -M main
   git push -u origin main
   ```

### Step 2.2: Deploy to Railway
1. Go to [Railway](https://railway.app)
2. Sign up/login with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your `hap-backend` repository
6. Click "Deploy Now"
7. Wait for the initial deployment (2-3 minutes)

### Step 2.3: Configure Environment Variables
1. In your Railway project dashboard, click on your deployed service
2. Go to the "Variables" tab
3. Add the following environment variables:

```
MONGO_URI=mongodb+srv://hap-user:your-password@hap-flashcard-cluster.xxxxx.mongodb.net/hap-flashcard?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-here-make-it-at-least-32-characters-long
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-vercel-app.vercel.app
```

**Important Notes:**
- Replace `MONGO_URI` with your actual MongoDB connection string
- Generate a strong `JWT_SECRET` (at least 32 characters)
- We'll update `FRONTEND_URL` after deploying the frontend

### Step 2.4: Test Backend Deployment
1. Wait for Railway to redeploy with the new environment variables
2. Click on your service to get the deployment URL (e.g., `https://hap-backend-production.up.railway.app`)
3. Test the health endpoint:
   ```
   https://your-railway-url.railway.app/health
   ```

4. You should see:
   ```json
   {
     "success": true,
     "message": "HAP FlashCard API is running",
     "timestamp": "2024-01-01T00:00:00.000Z",
     "environment": "production"
   }
   ```

**Save your Railway URL - you'll need it for the frontend!**

---

## ⚡ Part 3: Frontend Deployment on Vercel

### Step 3.1: Prepare Frontend for Deployment
1. In your main project directory (not hap-backend), create a `vercel.json` file:
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "framework": "vite",
     "rewrites": [
       {
         "source": "/(.*)",
         "destination": "/index.html"
       }
     ]
   }
   ```

2. Update your frontend to use the Railway API URL. Create or update your API configuration file:
   ```typescript
   // src/lib/api.ts or src/config/api.ts
   const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://your-railway-url.railway.app/api';
   
   export default API_BASE_URL;
   ```

3. Create a `.env` file in your frontend root directory:
   ```
   VITE_API_URL=https://your-railway-url.railway.app/api
   ```

4. Update your API calls to use the environment variable:
   ```typescript
   // Example in your API service files
   const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
     },
     body: JSON.stringify(loginData),
   });
   ```

### Step 3.2: Deploy to Vercel
1. Go to [Vercel](https://vercel.com)
2. Sign up/login with GitHub
3. Click "New Project"
4. Import your GitHub repository (the main one with your React app)
5. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (or leave empty)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Add environment variables:
   - `VITE_API_URL` = `https://your-railway-url.railway.app/api`
7. Click "Deploy"

### Step 3.3: Update Backend CORS
1. Go back to your Railway dashboard
2. Update the `FRONTEND_URL` environment variable:
   ```
   FRONTEND_URL=https://your-vercel-app.vercel.app
   ```
3. Railway will automatically redeploy with the new CORS settings

---

## 🔧 Part 4: Final Configuration

### Step 4.1: Test Full Integration
1. **Test Backend Health:**
   ```bash
   curl https://your-railway-url.railway.app/health
   ```

2. **Test Frontend:**
   - Visit your Vercel URL
   - Try to register a new user
   - Check browser network tab for API calls

3. **Test API Endpoints:**
   ```bash
   # Test signup
   curl -X POST https://your-railway-url.railway.app/api/auth/signup \
     -H "Content-Type: application/json" \
     -d '{
       "username": "testuser",
       "email": "test@example.com",
       "password": "SecurePass123"
     }'
   ```

### Step 4.2: Update Frontend API Configuration
Make sure all your API calls in the frontend use the environment variable:

```typescript
// Example API service
const API_BASE_URL = import.meta.env.VITE_API_URL;

export const authAPI = {
  login: async (credentials: LoginCredentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return response.json();
  },
  
  signup: async (userData: SignupData) => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return response.json();
  },
};
```

---

## 🧪 Part 5: Testing Your Deployment

### Step 5.1: Backend Tests
Test these endpoints to ensure your backend is working:

1. **Health Check:**
   ```
   GET https://your-railway-url.railway.app/health
   ```

2. **User Registration:**
   ```
   POST https://your-railway-url.railway.app/api/auth/signup
   Content-Type: application/json
   
   {
     "username": "testuser",
     "email": "test@example.com",
     "password": "SecurePass123"
   }
   ```

3. **User Login:**
   ```
   POST https://your-railway-url.railway.app/api/auth/login
   Content-Type: application/json
   
   {
     "email": "test@example.com",
     "password": "SecurePass123"
   }
   ```

### Step 5.2: Frontend Tests
1. Visit your Vercel URL
2. Try to register a new account
3. Try to login
4. Test creating flashcards
5. Test taking quizzes
6. Check browser console for any errors

### Step 5.3: Database Verification
1. Go to MongoDB Atlas
2. Click "Browse Collections"
3. You should see your database with collections:
   - `users`
   - `flashcards`
   - `decks`
   - `quizzes`
   - `analytics`

---

## 🔒 Part 6: Security & Production Checklist

### Step 6.1: Environment Variables Security
- ✅ JWT_SECRET is strong and unique
- ✅ MongoDB password is secure
- ✅ No sensitive data in code
- ✅ CORS is properly configured

### Step 6.2: Database Security
- ✅ Database user has minimal required permissions
- ✅ Network access is properly configured
- ✅ Regular backups (MongoDB Atlas handles this)

### Step 6.3: Application Security
- ✅ Rate limiting is enabled
- ✅ Input validation is in place
- ✅ Error handling doesn't expose sensitive info
- ✅ HTTPS is enforced

---

## 📊 Part 7: Monitoring & Maintenance

### Step 7.1: Railway Monitoring
1. **Check Railway Dashboard:**
   - Monitor resource usage
   - Check deployment logs
   - Set up alerts for failures

2. **Monitor Performance:**
   - Check response times
   - Monitor error rates
   - Watch memory usage

### Step 7.2: Vercel Monitoring
1. **Check Vercel Dashboard:**
   - Monitor build status
   - Check deployment logs
   - Monitor bandwidth usage

2. **Performance Monitoring:**
   - Check Core Web Vitals
   - Monitor build times
   - Watch for build failures

### Step 7.3: MongoDB Atlas Monitoring
1. **Database Monitoring:**
   - Monitor storage usage
   - Check connection count
   - Watch query performance

2. **Set Up Alerts:**
   - Storage approaching limit
   - Unusual activity
   - Connection issues

---

## 🚨 Troubleshooting Common Issues

### Issue 1: CORS Errors
**Symptoms:** Frontend can't connect to backend
**Solution:**
1. Check `FRONTEND_URL` in Railway environment variables
2. Ensure it matches your Vercel URL exactly
3. Redeploy Railway after updating

### Issue 2: Database Connection Failed
**Symptoms:** Backend logs show MongoDB connection errors
**Solution:**
1. Verify MongoDB Atlas connection string
2. Check network access (0.0.0.0/0)
3. Verify database user permissions

### Issue 3: Build Failures
**Symptoms:** Vercel deployment fails
**Solution:**
1. Check build logs in Vercel dashboard
2. Ensure all dependencies are in package.json
3. Verify Node.js version compatibility

### Issue 4: Environment Variables Not Working
**Symptoms:** Frontend can't access API
**Solution:**
1. Check Vercel environment variables
2. Ensure variables start with `VITE_`
3. Redeploy after adding variables

---

## 🎉 Success! Your App is Live

Once everything is deployed and working:

### Your URLs:
- **Frontend:** `https://your-app.vercel.app`
- **Backend API:** `https://your-app.railway.app`
- **Health Check:** `https://your-app.railway.app/health`

### What You Can Do Now:
- ✅ Users can register and login
- ✅ Create and manage flashcards
- ✅ Take quizzes and track progress
- ✅ Share decks with the community
- ✅ View analytics and leaderboards

### Next Steps:
1. **Custom Domain:** Add a custom domain to Vercel
2. **Monitoring:** Set up proper monitoring and alerts
3. **Backups:** Configure regular database backups
4. **Scaling:** Monitor usage and scale as needed
5. **Updates:** Keep dependencies updated

---

## 📞 Support & Resources

### Documentation:
- [Railway Docs](https://docs.railway.app)
- [Vercel Docs](https://vercel.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com)

### Getting Help:
- Check deployment logs in respective dashboards
- Use browser developer tools for frontend issues
- Monitor network requests for API issues

---

**🎊 Congratulations! Your HAP FlashCard application is now fully deployed and ready for users!**
