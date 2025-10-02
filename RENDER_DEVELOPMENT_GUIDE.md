# 🚀 HAP FlashCard - Render Development Guide

This guide provides detailed instructions for developing and deploying your HAP FlashCard application using Render for the backend and Vercel for the frontend.

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database       │
│   (Vercel)      │◄──►│   (Render)      │◄──►│   (Render PG)   │
│   React + TS    │    │   Node.js + TS  │    │   or MongoDB   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+ installed locally
- Git installed
- GitHub account
- Render account
- Vercel account

### Local Development

#### 1. Clone and Setup
```bash
# Clone your repository
git clone https://github.com/yourusername/hap-flashcard.git
cd hap-flashcard

# Install frontend dependencies
npm install

# Install backend dependencies
cd hap-backend
npm install
cd ..
```

#### 2. Environment Configuration

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:5000/api
```

**Backend (.env in hap-backend/):**
```env
# For PostgreSQL (Render)
DATABASE_URL=postgres://username:password@localhost:5432/hap_flashcard

# For MongoDB (Alternative)
MONGO_URI=mongodb://localhost:27017/hap-flashcard

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

#### 3. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd hap-backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

Your application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- Health Check: http://localhost:5000/health

## 🚀 Render Deployment

### Step 1: Prepare Backend for Render

#### 1.1: Update Backend Configuration
Ensure your backend is configured for Render:

**hap-backend/package.json:**
```json
{
  "scripts": {
    "start": "node dist/server.js",
    "build": "tsc",
    "dev": "nodemon src/server.ts"
  }
}
```

**hap-backend/render.yaml:**
```yaml
services:
  - type: web
    name: hap-backend
    env: node
    plan: free
    buildCommand: npm install && npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
```

#### 1.2: Database Setup Options

**Option A: Render PostgreSQL (Recommended)**
1. Go to Render Dashboard
2. Click "New +" → "PostgreSQL"
3. Configure:
   - Name: `hap-flashcard-db`
   - Database: `hap_flashcard`
   - User: `hap_user`
   - Plan: Free
4. Copy the External Database URL

**Option B: MongoDB Atlas**
1. Create MongoDB Atlas account
2. Create cluster and database
3. Get connection string
4. Configure network access

#### 1.3: Deploy Backend to Render
1. Push backend to GitHub:
   ```bash
   cd hap-backend
   git add .
   git commit -m "Prepare for Render deployment"
   git push origin main
   ```

2. Create Render Web Service:
   - Connect GitHub repository
   - Select `hap-backend` repository
   - Configure build settings
   - Add environment variables
   - Deploy

### Step 2: Deploy Frontend to Vercel

#### 2.1: Update Frontend Configuration
Update your API configuration to use Render URL:

**src/lib/api.ts:**
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://your-render-url.onrender.com/api';
```

#### 2.2: Deploy to Vercel
1. Connect GitHub to Vercel
2. Import your repository
3. Configure build settings
4. Add environment variables:
   - `VITE_API_URL` = `https://your-render-url.onrender.com/api`
5. Deploy

#### 2.3: Update CORS
1. Update `FRONTEND_URL` in Render with your Vercel URL
2. Wait for Render to redeploy

## 🔧 Development Workflow

### Daily Development
1. **Start local servers:**
   ```bash
   # Terminal 1 - Backend
   cd hap-backend && npm run dev
   
   # Terminal 2 - Frontend
   npm run dev
   ```

2. **Make changes and test locally**

3. **Commit and push changes:**
   ```bash
   git add .
   git commit -m "Feature: Add new functionality"
   git push origin main
   ```

4. **Render and Vercel will auto-deploy**

### Testing Deployments
1. **Test backend health:**
   ```bash
   curl https://your-render-url.onrender.com/health
   ```

2. **Test API endpoints:**
   ```bash
   curl -X POST https://your-render-url.onrender.com/api/auth/signup \
     -H "Content-Type: application/json" \
     -d '{"username":"test","email":"test@example.com","password":"password123"}'
   ```

3. **Test frontend:**
   - Visit Vercel URL
   - Check browser console for errors
   - Test user registration/login

## 🐛 Debugging

### Backend Issues
1. **Check Render logs:**
   - Go to Render dashboard
   - Click on your service
   - Check "Logs" tab

2. **Common issues:**
   - Database connection errors
   - Environment variable issues
   - Build failures

### Frontend Issues
1. **Check Vercel logs:**
   - Go to Vercel dashboard
   - Click on your project
   - Check "Functions" tab for logs

2. **Common issues:**
   - Build failures
   - Environment variable issues
   - API connection errors

### Database Issues
1. **PostgreSQL (Render):**
   - Check database status in Render dashboard
   - Verify connection string
   - Check user permissions

2. **MongoDB Atlas:**
   - Check cluster status
   - Verify network access
   - Check connection string

## 📊 Monitoring

### Render Monitoring
- **Service Status**: Check if service is running
- **Logs**: Monitor application logs
- **Metrics**: CPU, memory, response times
- **Alerts**: Set up alerts for failures

### Vercel Monitoring
- **Build Status**: Check build success/failure
- **Deployments**: Monitor deployment history
- **Analytics**: Page views, performance
- **Functions**: Serverless function logs

### Database Monitoring
- **Connection Count**: Monitor active connections
- **Storage Usage**: Track database size
- **Query Performance**: Monitor slow queries
- **Backups**: Verify backup status

## 🔒 Security Best Practices

### Environment Variables
- Use strong, unique secrets
- Never commit .env files
- Rotate secrets regularly
- Use different secrets for dev/prod

### Database Security
- Use strong passwords
- Limit network access
- Regular backups
- Monitor access logs

### Application Security
- Input validation
- Rate limiting
- CORS configuration
- Error handling

## 🚀 Production Optimization

### Performance
- Enable gzip compression
- Optimize database queries
- Use CDN for static assets
- Monitor response times

### Scalability
- Monitor resource usage
- Plan for traffic spikes
- Consider paid plans when needed
- Implement caching strategies

### Reliability
- Set up monitoring alerts
- Regular health checks
- Backup strategies
- Disaster recovery plans

## 💰 Cost Management

### Free Tier Limits
- **Render**: 750 hours/month
- **Vercel**: 100GB bandwidth/month
- **PostgreSQL**: 1GB storage

### When to Upgrade
- **Render**: When you need always-on service
- **Vercel**: When you need team features
- **Database**: When you exceed storage limits

### Cost Optimization
- Monitor usage regularly
- Optimize database queries
- Use efficient caching
- Clean up unused resources

## 📚 Additional Resources

### Documentation
- [Render Docs](https://render.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com)

### Community
- [Render Community](https://community.render.com)
- [Vercel Community](https://github.com/vercel/vercel/discussions)
- [Stack Overflow](https://stackoverflow.com)

### Support
- Check deployment logs first
- Use browser developer tools
- Test API endpoints individually
- Check GitHub issues for common problems

---

**🎉 Happy coding! Your HAP FlashCard app is ready for development and deployment!**
