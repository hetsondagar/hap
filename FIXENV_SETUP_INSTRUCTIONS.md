# Fix 400 Error - Environment Setup Instructions

## Problem
The frontend is getting a 400 error when trying to fetch community posts because the `VITE_API_URL` environment variable is not properly configured.

## Solution

### For Local Development:

1. Create a `.env.local` file in the root directory (same level as `package.json`):

```bash
# .env.local
VITE_API_URL=https://hap-i27v.onrender.com/api
NODE_ENV=development
```

2. Restart your development server:
```bash
npm run dev
```

### For Vercel Deployment:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variable:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://hap-i27v.onrender.com/api`
   - **Environment**: Production, Preview, and Development (select all)
4. Click **Save**
5. **Redeploy** your application

### For Render Backend (if needed):

Make sure your Render backend has these environment variables:
1. Go to your Render service dashboard
2. Navigate to **Environment**
3. Add/verify these variables:
   - `FRONTEND_URLS` = `https://hap-livid.vercel.app,http://localhost:8080,http://localhost:5173,http://localhost:3000`
   - `NODE_ENV` = `production`
   - `MONGODB_URI` = (your MongoDB connection string)

## Verify the Fix

After setting up the environment variables:

1. Open browser console (F12)
2. Go to Network tab
3. Reload the Community page
4. You should see a successful 200 response for `/api/community/posts`

## Common Issues

- **Still seeing localhost URLs**: Clear browser cache and rebuild
- **CORS errors**: Make sure the frontend URL is in `FRONTEND_URLS` on Render
- **Backend not responding**: Check if your Render service is active and not sleeping

## Quick Test

You can test if your backend is working by visiting:
```
https://hap-i27v.onrender.com/api/community/posts
```

This should return a JSON response with posts data (or an empty array if no posts exist).

