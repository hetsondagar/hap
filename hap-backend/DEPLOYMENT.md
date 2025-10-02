# 🚀 HAP FlashCard Backend Deployment Guide

This guide will help you deploy the HAP FlashCard backend API to Railway with MongoDB Atlas.

## 📋 Prerequisites

- GitHub account
- Railway account (sign up at [railway.app](https://railway.app))
- MongoDB Atlas account (sign up at [cloud.mongodb.com](https://cloud.mongodb.com))
- Node.js installed locally (for testing)

## 🗄️ Step 1: MongoDB Atlas Setup

### 1.1 Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Sign up for a free account
3. Create a new project (e.g., "HAP FlashCard")

### 1.2 Create Database Cluster
1. Click "Build a Database"
2. Choose "FREE" tier (M0 Sandbox)
3. Select a region close to your users
4. Name your cluster (e.g., "hap-flashcard-cluster")
5. Click "Create"

### 1.3 Configure Database Access
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create a strong password (save it!)
5. Set privileges to "Read and write to any database"
6. Click "Add User"

### 1.4 Configure Network Access
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

### 1.5 Get Connection String
1. Go to "Database" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Select "Node.js" and version "4.1 or later"
5. Copy the connection string
6. Replace `<password>` with your database user password
7. Replace `<dbname>` with `hap-flashcard`

**Example connection string:**
```
mongodb+srv://username:password@hap-flashcard-cluster.xxxxx.mongodb.net/hap-flashcard?retryWrites=true&w=majority
```

## 🚂 Step 2: Railway Deployment

### 2.1 Prepare GitHub Repository
1. Create a new repository on GitHub (e.g., `hap-backend`)
2. Push your backend code to the repository:

```bash
# In your hap-backend directory
git init
git add .
git commit -m "Initial commit: HAP FlashCard Backend API"
git branch -M main
git remote add origin https://github.com/yourusername/hap-backend.git
git push -u origin main
```

### 2.2 Create Railway Project
1. Go to [Railway](https://railway.app)
2. Sign up/login with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your `hap-backend` repository
6. Click "Deploy Now"

### 2.3 Configure Environment Variables
In your Railway project dashboard:

1. Go to your deployed service
2. Click on "Variables" tab
3. Add the following environment variables:

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/hap-flashcard?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-vercel-app.vercel.app
```

**Important Notes:**
- Replace the `MONGO_URI` with your actual MongoDB Atlas connection string
- Generate a strong `JWT_SECRET` (at least 32 characters)
- Update `FRONTEND_URL` with your actual Vercel deployment URL

### 2.4 Deploy and Test
1. Railway will automatically build and deploy your application
2. Wait for the deployment to complete (usually 2-3 minutes)
3. Click on your service to get the deployment URL
4. Test the health endpoint: `https://your-app.railway.app/health`

## 🔧 Step 3: Frontend Configuration

### 3.1 Update Frontend API Base URL
In your React frontend, update the API base URL to point to your Railway deployment:

```typescript
// In your frontend code
const API_BASE_URL = 'https://your-app.railway.app/api';
```

### 3.2 Update CORS Settings
The backend is already configured to accept requests from your Vercel frontend URL.

## 🧪 Step 4: Testing the Deployment

### 4.1 Health Check
```bash
curl https://your-app.railway.app/health
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

### 4.2 Test Authentication
```bash
# Test signup
curl -X POST https://your-app.railway.app/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "SecurePass123"
  }'
```

### 4.3 Test Database Connection
The application will automatically connect to MongoDB Atlas when it starts. Check the Railway logs to ensure the connection is successful.

## 📊 Step 5: Monitoring and Maintenance

### 5.1 Railway Dashboard
- Monitor your application in the Railway dashboard
- Check logs for any errors
- Monitor resource usage

### 5.2 MongoDB Atlas Monitoring
- Monitor your database in MongoDB Atlas
- Set up alerts for unusual activity
- Monitor storage usage (free tier has 512MB limit)

### 5.3 Environment Variables Management
- Keep your environment variables secure
- Rotate JWT secrets periodically
- Never commit sensitive data to version control

## 🔒 Security Best Practices

### 5.1 Database Security
- Use strong passwords for database users
- Regularly rotate database passwords
- Monitor database access logs

### 5.2 Application Security
- Use strong JWT secrets
- Implement rate limiting (already configured)
- Keep dependencies updated
- Monitor for security vulnerabilities

### 5.3 CORS Configuration
- Only allow your frontend domain
- Never use wildcard (*) in production

## 🚨 Troubleshooting

### Common Issues

#### 1. Database Connection Failed
- Check your MongoDB Atlas connection string
- Verify network access is configured (0.0.0.0/0)
- Ensure database user has correct permissions

#### 2. CORS Errors
- Verify `FRONTEND_URL` environment variable
- Check that your frontend is using the correct API URL

#### 3. Build Failures
- Check Railway build logs
- Ensure all dependencies are in `package.json`
- Verify TypeScript compilation

#### 4. Runtime Errors
- Check Railway application logs
- Verify all environment variables are set
- Test locally first

### Getting Help
- Check Railway documentation: [docs.railway.app](https://docs.railway.app)
- MongoDB Atlas documentation: [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)
- Check application logs in Railway dashboard

## 🎉 Success!

Once deployed, your HAP FlashCard backend API will be available at:
`https://your-app.railway.app`

Your frontend can now make API calls to this URL, and users can:
- Register and login
- Create and manage flashcards
- Take quizzes
- Participate in the community
- Track their learning analytics

## 📈 Next Steps

1. **Set up monitoring**: Consider adding application monitoring
2. **Backup strategy**: Set up regular database backups
3. **Performance optimization**: Monitor and optimize as your user base grows
4. **Scaling**: Railway will automatically handle basic scaling, but monitor usage
5. **Security updates**: Regularly update dependencies and security patches

## 🔄 Updates and Maintenance

### Updating the Application
1. Make changes to your code
2. Commit and push to GitHub
3. Railway will automatically redeploy
4. Monitor the deployment in Railway dashboard

### Database Maintenance
- Monitor storage usage in MongoDB Atlas
- Set up alerts for approaching limits
- Consider upgrading to paid tiers as you grow

---

**🎊 Congratulations! Your HAP FlashCard backend is now live and ready to serve your frontend application!**
