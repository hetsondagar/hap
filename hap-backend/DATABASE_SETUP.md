# Database Setup & Optimization Guide

## 🚀 Quick Start

### 1. Prerequisites
- MongoDB Atlas account (or local MongoDB instance)
- Node.js 18+ installed
- Environment variables configured

### 2. Environment Setup

Create a `.env` file in `hap-backend/`:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/hap?retryWrites=true&w=majority
PORT=8000
JWT_SECRET=your_jwt_secret_here
```

### 3. Run Migration

```bash
# Install dependencies
npm install

# Run database migration
npm run migrate

# Start the server
npm run dev
```

## 📊 Database Schema Overview

### Collections

1. **users** - User accounts and authentication
   - Indexes: `username`, `email`
   - Average Size: ~0.5 KB per document
   - Fields: username, email, password, department, year, googleId

2. **flashcards** - Individual flashcard content
   - Indexes: `ownerId + createdAt`, `department + year + public`, `subjectId + ownerId`
   - Average Size: ~0.3 KB per document
   - Fields: front, back, ownerId, department, year, subjectId, public

3. **decks** - Flashcard collections
   - Indexes: `department + year + createdAt`, `creatorId + createdAt`, `public + department + year`, Text search
   - Average Size: ~0.4 KB per document
   - Fields: title, description, flashcards[], creatorId, department, year, public

4. **posts** - Community discussion posts
   - Indexes: `department + year + createdAt`, `userId + createdAt`, Text search
   - Average Size: ~0.6 KB per document
   - Fields: title, content, userId, department, year, tags[], likes[], comments[]

5. **quizzes** - Quiz attempts and results
   - Indexes: `userId + completedAt`, `department + difficulty + score`
   - Average Size: ~0.8 KB per document
   - Fields: userId, questions[], answers[], score, difficulty, department

6. **analytics** - User statistics and progress
   - Indexes: `userId` (unique), `studiedCount + quizAccuracy`, `streaks.current`
   - Average Size: ~1.2 KB per document
   - Fields: userId, studiedCount, quizAccuracy, totalXP, streaks, badges, departmentStats[]

## 🔧 Optimization Strategies

### 1. Schema Design
✅ **Implemented:**
- Lean schemas with only essential fields
- Optional fields to reduce storage
- Embedded documents where appropriate (comments in posts)
- References for frequently changing data (user profiles)

### 2. Indexing Strategy
✅ **Optimized indexes:**
- Compound indexes for common query patterns
- Text indexes for search functionality
- Covered queries where possible
- Sorted indexes for time-series data

### 3. Query Optimization
✅ **Best practices:**
- `.lean()` for read-only operations (70% faster, 50% less memory)
- `.select()` to fetch only needed fields
- Pagination with `.limit()` and `.skip()`
- Aggregation pipelines for complex queries

### 4. Storage Optimization
✅ **Space-saving measures:**
- Short field names where appropriate
- Avoid storing computed values (calculate on-the-fly)
- Use MongoDB compression (WiredTiger)
- Regular cleanup of old/unused data

## 📈 Performance Benchmarks

### Expected Performance (M0 Free Tier)
- User login: < 200ms
- Load flashcards: < 150ms
- Create deck: < 100ms
- Search posts: < 300ms
- Get analytics: < 250ms

### Scaling Recommendations
| Users | Tier | RAM | Storage |
|-------|------|-----|---------|
| 0-1K | M0 (Free) | 512MB | 5GB |
| 1K-10K | M2 | 2GB | 10GB |
| 10K-50K | M5 | 8GB | 50GB |
| 50K+ | M10+ | 16GB+ | 100GB+ |

## 🛠️ Migration Details

### What the Migration Does

1. **Year Format Update**
   - Converts: `'1st'` → `'1st-year'`
   - Updates: Users, Decks, Flashcards, Posts
   - Safe: Uses aggregation pipeline with fallback

2. **Index Creation**
   - Creates all optimized indexes
   - Removes redundant indexes
   - Ensures uniqueness constraints

3. **Data Validation**
   - Counts documents per collection
   - Validates data format
   - Reports inconsistencies

4. **Storage Optimization**
   - Removes null/undefined fields
   - Suggests compaction strategies
   - Shows storage statistics

### Running the Migration

```bash
# Development
npm run migrate

# Production (with specific MongoDB URI)
MONGODB_URI=your_atlas_uri npm run migrate
```

## 📱 MongoDB Atlas Setup

### Step 1: Create Cluster
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Click "Create" → "Shared" (Free M0)
3. Choose region closest to your users
4. Name: `hap-cluster`

### Step 2: Configure Security
1. **Database Access:**
   - Username: `hap-admin`
   - Password: Generate secure password
   - Role: `Atlas admin` or `Read and write to any database`

2. **Network Access:**
   - Add IP: `0.0.0.0/0` (Allow from anywhere)
   - Or add specific IPs for production

### Step 3: Get Connection String
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy connection string
4. Replace `<password>` with your password
5. Add database name: `/hap`

### Step 4: Run Migration
```bash
# Set connection string
export MONGODB_URI="mongodb+srv://..."

# Run migration
npm run migrate
```

### Step 5: Verify in Atlas
1. Go to "Collections" tab
2. Check all 6 collections exist
3. Go to "Indexes" tab
4. Verify indexes are created
5. Go to "Metrics" tab
6. Monitor performance

## 🔍 Monitoring & Maintenance

### Daily Checks
- Monitor query performance in Atlas Metrics
- Check slow queries in Profiler
- Review error logs

### Weekly Maintenance
- Check storage usage
- Review index usage
- Optimize underperforming queries

### Monthly Tasks
- Archive old data (quizzes > 6 months)
- Update indexes based on usage patterns
- Review and optimize large collections

## 🚨 Troubleshooting

### Issue: Slow Queries
**Solution:**
1. Enable profiler in Atlas
2. Check missing indexes
3. Use `.explain()` on slow queries
4. Add appropriate indexes

### Issue: High Storage Usage
**Solution:**
1. Run migration script to see stats
2. Enable compression in Atlas
3. Archive old data
4. Use TTL indexes for temporary data

### Issue: Connection Timeouts
**Solution:**
1. Check network access whitelist
2. Verify connection string
3. Increase `serverSelectionTimeoutMS`
4. Check Atlas status page

### Issue: Migration Fails
**Solution:**
1. Check MongoDB URI is correct
2. Ensure user has write permissions
3. Check network connectivity
4. Review error logs

## 📚 Query Examples

### Efficient Queries

```typescript
// ✅ Good - Uses lean() and select()
const users = await User.find({ department: 'cse' })
  .select('username email department')
  .lean()
  .limit(20);

// ❌ Bad - Fetches all fields, heavy Mongoose documents
const users = await User.find({ department: 'cse' });

// ✅ Good - Uses indexes
const decks = await Deck.find({ 
  department: 'cse', 
  year: '1st-year',
  public: true 
})
  .sort({ createdAt: -1 })
  .lean();

// ❌ Bad - No indexes, sorts after fetch
const decks = await Deck.find({ public: true })
  .lean()
  .then(d => d.filter(x => x.department === 'cse'));

// ✅ Good - Text search with filters
const posts = await Post.find({
  $text: { $search: 'javascript' },
  department: 'cse'
})
  .select('title content likes')
  .limit(10)
  .lean();

// ✅ Good - Aggregation for stats
const stats = await Analytics.aggregate([
  { $match: { userId: id } },
  { $project: { totalXP: 1, studiedCount: 1 } }
]);
```

## 🎯 Best Practices

### DO ✅
- Use `.lean()` for read operations
- Add indexes for frequent queries
- Paginate large result sets
- Use projection to limit fields
- Batch bulk operations
- Monitor slow queries
- Enable compression

### DON'T ❌
- Store computed values
- Create too many indexes
- Fetch all documents at once
- Ignore error handling
- Skip data validation
- Use inefficient regex queries
- Store sensitive data unencrypted

## 🔐 Security Checklist

- [ ] Use environment variables for credentials
- [ ] Enable authentication on MongoDB
- [ ] Whitelist only necessary IPs
- [ ] Use TLS/SSL for connections
- [ ] Hash passwords (bcrypt)
- [ ] Sanitize user inputs
- [ ] Rate limit API endpoints
- [ ] Regular security audits
- [ ] Keep dependencies updated

## 📞 Support Resources

- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Mongoose Docs](https://mongoosejs.com/docs/)
- [MongoDB Performance](https://docs.mongodb.com/manual/administration/analyzing-mongodb-performance/)
- [Index Strategies](https://docs.mongodb.com/manual/applications/indexes/)

---

**Last Updated:** October 2025
**Database Version:** MongoDB 6.0+
**Schema Version:** 1.0.0

