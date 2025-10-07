# 🚀 Database Migration Quick Start

## Step 1: Set Up MongoDB Atlas

### Option A: Create New Cluster
1. Go to https://cloud.mongodb.com
2. Sign up or log in
3. Click "Build a Database" → "Shared" (Free M0 tier)
4. Choose a cloud provider and region
5. Click "Create Cluster"

### Option B: Use Existing Cluster
Skip to Step 2 if you already have a cluster.

## Step 2: Configure Database Access

1. In Atlas, go to "Security" → "Database Access"
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `hap-admin`
5. Password: Generate a secure password (save it!)
6. Database User Privileges: "Atlas admin"
7. Click "Add User"

## Step 3: Configure Network Access

1. Go to "Security" → "Network Access"
2. Click "Add IP Address"
3. For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
4. For production: Add your server's specific IP
5. Click "Confirm"

## Step 4: Get Connection String

1. Click "Connect" button on your cluster
2. Choose "Connect your application"
3. Driver: Node.js, Version: 5.5 or later
4. Copy the connection string
5. It looks like: `mongodb+srv://hap-admin:<password>@cluster...`

## Step 5: Configure Environment

Create `.env` file in `hap-backend/` directory:

```env
MONGODB_URI=mongodb+srv://hap-admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/hap?retryWrites=true&w=majority
PORT=8000
JWT_SECRET=your_super_secret_jwt_key_here
```

**Important:** Replace:
- `YOUR_PASSWORD` with your actual database password
- `cluster0.xxxxx` with your actual cluster URL
- `JWT_SECRET` with a random secure string

## Step 6: Install Dependencies

```bash
cd hap-backend
npm install
```

## Step 7: Run Migration

```bash
npm run migrate
```

### What This Does:
✅ Connects to your MongoDB Atlas database
✅ Creates the database structure (collections)
✅ Updates any existing data to new format
✅ Creates optimized indexes for fast queries
✅ Shows database statistics

### Expected Output:
```
🚀 Starting Database Migration...
============================================================

📅 Migrating year format...
  ✓ Updated 0 users
  ✓ Updated 0 decks
  ✓ Updated 0 flashcards
  ✓ Updated 0 posts
✅ Year format migration completed

🔧 Creating optimized indexes...
  ✓ User indexes created
  ✓ Flashcard indexes created
  ✓ Deck indexes created
  ✓ Post indexes created
  ✓ Quiz indexes created
  ✓ Analytics indexes created
✅ All indexes created successfully

✔️  Validating data consistency...
  Users: 0/0 have valid year format
  Total Decks: 0
  Total Flashcards: 0
  Total Posts: 0
  Total Quizzes: 0
✅ Data validation completed

📊 Database Statistics:
  [Shows storage stats for each collection]

============================================================
✅ Migration completed successfully!

💡 Next Steps:
1. Check MongoDB Atlas for the changes
2. Verify indexes in the "Indexes" tab
3. Monitor performance in the "Metrics" tab
4. Consider enabling automatic backups
```

## Step 8: Verify in Atlas

1. Go back to MongoDB Atlas
2. Click "Browse Collections"
3. You should see:
   - `users` collection
   - `flashcards` collection
   - `decks` collection
   - `posts` collection
   - `quizzes` collection
   - `analytics` collection

4. Click "Indexes" tab for any collection
5. Verify indexes are created

## Step 9: Start Your Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm run build
npm start
```

Your server should start on http://localhost:8000

## Step 10: Test Connection

Open a browser or use curl:
```bash
curl http://localhost:8000/api/health
```

Should return: `{"status": "ok", "database": "connected"}`

## 🎉 Success!

Your database is now:
- ✅ Connected to MongoDB Atlas
- ✅ Properly structured with optimized schema
- ✅ Indexed for fast queries
- ✅ Ready for production use

## 🔍 Troubleshooting

### Error: "MongoServerError: bad auth"
**Solution:** Check your MongoDB password in `.env` is correct

### Error: "MongoTimeoutError"
**Solutions:**
- Check your internet connection
- Verify IP is whitelisted in Network Access
- Check connection string format

### Error: "Cannot find module"
**Solution:** Run `npm install` to install dependencies

### Migration shows "0 documents updated"
**This is normal!** It means:
- This is your first time running the migration
- Or your data is already in the correct format

### Still having issues?
1. Check `.env` file exists and has correct values
2. Verify MongoDB Atlas cluster is running
3. Check network access allows your IP
4. Review error messages carefully
5. Check `DATABASE_SETUP.md` for detailed troubleshooting

## 📚 Next Steps

1. **Frontend Connection:**
   - Update frontend `.env` with backend URL
   - Test API endpoints

2. **Monitoring:**
   - Set up Atlas alerts
   - Monitor slow queries
   - Check storage usage

3. **Security:**
   - Enable 2FA on Atlas account
   - Rotate credentials regularly
   - Set up backup schedule

4. **Optimization:**
   - Review query performance
   - Add indexes as needed
   - Monitor metrics dashboard

## 🔗 Useful Links

- [Full Documentation](./DATABASE_SETUP.md)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Query Optimization Guide](./src/utils/queryOptimization.ts)

---

**Need Help?** Check `DATABASE_SETUP.md` for comprehensive documentation.

