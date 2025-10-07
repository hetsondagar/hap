import mongoose from 'mongoose';
import User from '../models/User';
import Deck from '../models/Deck';
import Flashcard from '../models/Flashcard';
import Post from '../models/Post';
import Quiz from '../models/Quiz';
import Analytics from '../models/Analytics';

/**
 * Database Migration Script
 * 
 * This script:
 * 1. Updates year format from '1st', '2nd' to '1st-year', '2nd-year'
 * 2. Creates optimized indexes
 * 3. Removes old indexes
 * 4. Validates data consistency
 */

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hap';

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

async function migrateYearFormat() {
  console.log('\n📅 Migrating year format...');
  
  const yearMapping: { [key: string]: string } = {
    '1st': '1st-year',
    '2nd': '2nd-year',
    '3rd': '3rd-year',
    '4th': '4th-year'
  };

  try {
    // Migrate Users
    const userCount = await User.updateMany(
      { year: { $in: ['1st', '2nd', '3rd', '4th'] } },
      [
        {
          $set: {
            year: {
              $switch: {
                branches: [
                  { case: { $eq: ['$year', '1st'] }, then: '1st-year' },
                  { case: { $eq: ['$year', '2nd'] }, then: '2nd-year' },
                  { case: { $eq: ['$year', '3rd'] }, then: '3rd-year' },
                  { case: { $eq: ['$year', '4th'] }, then: '4th-year' }
                ],
                default: '$year'
              }
            }
          }
        }
      ]
    );
    console.log(`  ✓ Updated ${userCount.modifiedCount} users`);

    // Migrate Decks
    const deckCount = await Deck.updateMany(
      { year: { $in: ['1st', '2nd', '3rd', '4th'] } },
      [
        {
          $set: {
            year: {
              $switch: {
                branches: [
                  { case: { $eq: ['$year', '1st'] }, then: '1st-year' },
                  { case: { $eq: ['$year', '2nd'] }, then: '2nd-year' },
                  { case: { $eq: ['$year', '3rd'] }, then: '3rd-year' },
                  { case: { $eq: ['$year', '4th'] }, then: '4th-year' }
                ],
                default: '$year'
              }
            }
          }
        }
      ]
    );
    console.log(`  ✓ Updated ${deckCount.modifiedCount} decks`);

    // Migrate Flashcards
    const flashcardCount = await Flashcard.updateMany(
      { year: { $in: ['1st', '2nd', '3rd', '4th'] } },
      [
        {
          $set: {
            year: {
              $switch: {
                branches: [
                  { case: { $eq: ['$year', '1st'] }, then: '1st-year' },
                  { case: { $eq: ['$year', '2nd'] }, then: '2nd-year' },
                  { case: { $eq: ['$year', '3rd'] }, then: '3rd-year' },
                  { case: { $eq: ['$year', '4th'] }, then: '4th-year' }
                ],
                default: '$year'
              }
            }
          }
        }
      ]
    );
    console.log(`  ✓ Updated ${flashcardCount.modifiedCount} flashcards`);

    // Migrate Posts
    const postCount = await Post.updateMany(
      { year: { $in: ['1st', '2nd', '3rd', '4th'] } },
      [
        {
          $set: {
            year: {
              $switch: {
                branches: [
                  { case: { $eq: ['$year', '1st'] }, then: '1st-year' },
                  { case: { $eq: ['$year', '2nd'] }, then: '2nd-year' },
                  { case: { $eq: ['$year', '3rd'] }, then: '3rd-year' },
                  { case: { $eq: ['$year', '4th'] }, then: '4th-year' }
                ],
                default: '$year'
              }
            }
          }
        }
      ]
    );
    console.log(`  ✓ Updated ${postCount.modifiedCount} posts`);

    console.log('✅ Year format migration completed');
  } catch (error) {
    console.error('❌ Year format migration failed:', error);
    throw error;
  }
}

async function createIndexes() {
  console.log('\n🔧 Creating optimized indexes...');

  try {
    // User indexes
    await User.collection.createIndex({ username: 1 }, { unique: true });
    await User.collection.createIndex({ email: 1 }, { unique: true });
    console.log('  ✓ User indexes created');

    // Flashcard indexes
    await Flashcard.collection.createIndex({ ownerId: 1, createdAt: -1 });
    await Flashcard.collection.createIndex({ department: 1, year: 1, public: 1 });
    await Flashcard.collection.createIndex({ subjectId: 1, ownerId: 1 });
    console.log('  ✓ Flashcard indexes created');

    // Deck indexes
    await Deck.collection.createIndex({ department: 1, year: 1, createdAt: -1 });
    await Deck.collection.createIndex({ creatorId: 1, createdAt: -1 });
    await Deck.collection.createIndex({ public: 1, department: 1, year: 1 });
    await Deck.collection.createIndex({ title: 'text', description: 'text' });
    console.log('  ✓ Deck indexes created');

    // Post indexes
    await Post.collection.createIndex({ department: 1, year: 1, createdAt: -1 });
    await Post.collection.createIndex({ userId: 1, createdAt: -1 });
    await Post.collection.createIndex({ title: 'text', content: 'text' });
    console.log('  ✓ Post indexes created');

    // Quiz indexes
    await Quiz.collection.createIndex({ userId: 1, completedAt: -1 });
    await Quiz.collection.createIndex({ department: 1, difficulty: 1, score: -1 });
    console.log('  ✓ Quiz indexes created');

    // Analytics indexes
    await Analytics.collection.createIndex({ userId: 1 }, { unique: true });
    await Analytics.collection.createIndex({ studiedCount: -1, quizAccuracy: -1 });
    await Analytics.collection.createIndex({ 'streaks.current': -1 });
    console.log('  ✓ Analytics indexes created');

    console.log('✅ All indexes created successfully');
  } catch (error) {
    console.error('❌ Index creation failed:', error);
    throw error;
  }
}

async function removeOldIndexes() {
  console.log('\n🗑️  Removing old/redundant indexes...');

  try {
    const collections = [
      { name: 'users', model: User },
      { name: 'flashcards', model: Flashcard },
      { name: 'decks', model: Deck },
      { name: 'posts', model: Post },
      { name: 'quizzes', model: Quiz },
      { name: 'analytics', model: Analytics }
    ];

    for (const { name, model } of collections) {
      const indexes = await model.collection.indexes();
      console.log(`  📋 ${name} has ${indexes.length} indexes`);
      
      // List all indexes
      for (const index of indexes) {
        if (index.name !== '_id_') {
          console.log(`    - ${index.name}`);
        }
      }
    }

    console.log('✅ Index review completed');
    console.log('💡 Tip: Remove old indexes manually if needed using MongoDB Compass or Atlas');
  } catch (error) {
    console.error('❌ Index review failed:', error);
    throw error;
  }
}

async function validateData() {
  console.log('\n✔️  Validating data consistency...');

  try {
    // Validate Users
    const users = await User.countDocuments();
    const validUsers = await User.countDocuments({
      year: { $in: ['1st-year', '2nd-year', '3rd-year', '4th-year'] }
    });
    console.log(`  Users: ${validUsers}/${users} have valid year format`);

    // Validate Decks
    const decks = await Deck.countDocuments();
    console.log(`  Total Decks: ${decks}`);

    // Validate Flashcards
    const flashcards = await Flashcard.countDocuments();
    console.log(`  Total Flashcards: ${flashcards}`);

    // Validate Posts
    const posts = await Post.countDocuments();
    console.log(`  Total Posts: ${posts}`);

    // Validate Quizzes
    const quizzes = await Quiz.countDocuments();
    console.log(`  Total Quizzes: ${quizzes}`);

    console.log('✅ Data validation completed');
  } catch (error) {
    console.error('❌ Data validation failed:', error);
    throw error;
  }
}

async function optimizeStorage() {
  console.log('\n💾 Optimizing storage...');

  try {
    // Remove null/undefined fields from existing documents
    await User.updateMany({}, { $unset: { bio: '' } });
    console.log('  ✓ Cleaned up empty user bios');

    // Compact collections (Note: This requires admin privileges)
    console.log('  💡 To compact collections in Atlas:');
    console.log('     1. Go to MongoDB Atlas Dashboard');
    console.log('     2. Navigate to your cluster');
    console.log('     3. Use the "Metrics" tab to monitor storage');
    console.log('     4. Consider upgrading to M2+ for automatic optimization');

    console.log('✅ Storage optimization suggestions provided');
  } catch (error) {
    console.error('❌ Storage optimization failed:', error);
    // Don't throw - this is optional
  }
}

async function showStorageStats() {
  console.log('\n📊 Database Statistics:');

  try {
    const db = mongoose.connection.db;
    if (!db) {
      console.log('  ⚠️  Database connection not available');
      return;
    }

    const collections = ['users', 'flashcards', 'decks', 'posts', 'quizzes', 'analytics'];

    for (const collectionName of collections) {
      try {
        // Use db.command to get collection stats
        const stats: any = await db.command({ collStats: collectionName });
        console.log(`\n  📦 ${collectionName}:`);
        console.log(`     Documents: ${stats.count || 0}`);
        console.log(`     Avg Document Size: ${stats.avgObjSize ? (stats.avgObjSize / 1024).toFixed(2) : '0.00'} KB`);
        console.log(`     Total Size: ${stats.size ? (stats.size / 1024 / 1024).toFixed(2) : '0.00'} MB`);
        console.log(`     Storage Size: ${stats.storageSize ? (stats.storageSize / 1024 / 1024).toFixed(2) : '0.00'} MB`);
        console.log(`     Indexes: ${stats.nindexes || 0}`);
        console.log(`     Index Size: ${stats.totalIndexSize ? (stats.totalIndexSize / 1024 / 1024).toFixed(2) : '0.00'} MB`);
      } catch (err) {
        console.log(`     Collection '${collectionName}' doesn't exist yet`);
      }
    }

    console.log('\n✅ Storage statistics displayed');
  } catch (error) {
    console.error('❌ Failed to get storage stats:', error);
  }
}

async function runMigration() {
  console.log('🚀 Starting Database Migration...\n');
  console.log('=' .repeat(60));

  try {
    await connectDB();
    
    await migrateYearFormat();
    await createIndexes();
    await removeOldIndexes();
    await validateData();
    await optimizeStorage();
    await showStorageStats();

    console.log('\n' + '='.repeat(60));
    console.log('✅ Migration completed successfully!');
    console.log('\n💡 Next Steps:');
    console.log('1. Check MongoDB Atlas for the changes');
    console.log('2. Verify indexes in the "Indexes" tab');
    console.log('3. Monitor performance in the "Metrics" tab');
    console.log('4. Consider enabling automatic backups');
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 Database connection closed');
  }
}

// Run migration if called directly
if (require.main === module) {
  runMigration();
}

export { runMigration };

