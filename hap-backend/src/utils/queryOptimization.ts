import { Query } from 'mongoose';

/**
 * Query Optimization Utilities
 * 
 * These utilities help reduce memory usage and improve performance:
 * 1. lean() - Returns plain JavaScript objects instead of Mongoose documents
 * 2. select() - Fetches only required fields
 * 3. limit() and skip() - Pagination support
 */

/**
 * User projection - Only fetch necessary fields
 * Excludes sensitive data and reduces document size
 */
export const userProjection = {
  password: 0,  // Never send password
  googleId: 0,  // Internal OAuth data
  otp: 0,       // Security sensitive
  otpExpiry: 0  // Security sensitive
};

/**
 * Public user projection for community features
 * Even more limited fields for public display
 */
export const publicUserProjection = {
  _id: 1,
  username: 1,
  department: 1,
  year: 1,
  avatar: 1
};

/**
 * Flashcard projection - Exclude unnecessary metadata
 */
export const flashcardProjection = {
  __v: 0  // Mongoose version key
};

/**
 * Deck projection with creator info
 */
export const deckProjection = {
  __v: 0
};

/**
 * Post projection
 */
export const postProjection = {
  __v: 0
};

/**
 * Apply lean to query for better performance
 * Use this when you don't need Mongoose document methods
 */
export function applyLean<T>(query: Query<T, any>): Query<T, any> {
  return query.lean();
}

/**
 * Apply pagination to query
 */
export function applyPagination<T>(
  query: Query<T, any>,
  page: number = 1,
  limit: number = 20
): Query<T, any> {
  const skip = (page - 1) * limit;
  return query.skip(skip).limit(limit);
}

/**
 * Apply sorting by creation date (newest first)
 */
export function applySortByNewest<T>(query: Query<T, any>): Query<T, any> {
  return query.sort({ createdAt: -1 });
}

/**
 * Apply sorting by popularity (likes, views, etc.)
 */
export function applySortByPopularity<T>(
  query: Query<T, any>,
  field: string = 'likes'
): Query<T, any> {
  return query.sort({ [field]: -1, createdAt: -1 });
}

/**
 * Standard query options for optimal performance
 */
export const optimizedQueryOptions = {
  lean: true,
  limit: 50,
  sort: { createdAt: -1 }
};

/**
 * Build efficient query for public decks
 */
export function buildPublicDeckQuery(department?: string, year?: string) {
  const query: any = { public: true };
  
  if (department) {
    query.department = department;
  }
  
  if (year) {
    query.year = year;
  }
  
  return query;
}

/**
 * Build efficient query for user's own content
 */
export function buildUserContentQuery(userId: string, includePrivate: boolean = true) {
  const query: any = { ownerId: userId };
  
  if (!includePrivate) {
    query.public = true;
  }
  
  return query;
}

/**
 * Sanitize search text to prevent injection
 */
export function sanitizeSearchText(text: string): string {
  return text
    .replace(/[<>]/g, '')  // Remove HTML-like characters
    .trim()
    .slice(0, 100);  // Limit length
}

/**
 * Build text search query
 */
export function buildTextSearchQuery(searchText: string, additionalFilters?: any) {
  const sanitized = sanitizeSearchText(searchText);
  
  return {
    $text: { $search: sanitized },
    ...additionalFilters
  };
}

/**
 * Optimize aggregation pipeline for statistics
 */
export function buildStatsAggregation(userId: string) {
  return [
    { $match: { userId } },
    {
      $project: {
        _id: 1,
        studiedCount: 1,
        quizAccuracy: 1,
        totalXP: 1,
        streaks: 1,
        badges: 1,
        lastStudied: 1
      }
    }
  ];
}

/**
 * Database connection optimization settings
 */
export const dbOptimizationConfig = {
  // Connection pool settings
  maxPoolSize: 10,
  minPoolSize: 2,
  maxIdleTimeMS: 30000,
  
  // Query settings
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  
  // Compression for network traffic
  compressors: ['zlib'],
  zlibCompressionLevel: 6
};

/**
 * Batch operation utilities
 */
export class BatchOperations {
  /**
   * Process items in batches to avoid memory issues
   */
  static async processBatch<T>(
    items: T[],
    batchSize: number,
    processor: (batch: T[]) => Promise<void>
  ): Promise<void> {
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      await processor(batch);
    }
  }

  /**
   * Bulk insert with validation
   */
  static async bulkInsert<T>(
    model: any,
    documents: T[],
    batchSize: number = 100
  ): Promise<void> {
    await this.processBatch(documents, batchSize, async (batch) => {
      await model.insertMany(batch, { ordered: false });
    });
  }
}

/**
 * Cache key generators for Redis/Memory caching
 */
export const CacheKeys = {
  userProfile: (userId: string) => `user:${userId}`,
  userDecks: (userId: string, page: number) => `decks:user:${userId}:${page}`,
  publicDecks: (dept: string, year: string, page: number) => `decks:public:${dept}:${year}:${page}`,
  userStats: (userId: string) => `stats:${userId}`,
  leaderboard: (scope: string) => `leaderboard:${scope}`,
  
  // TTL suggestions (in seconds)
  TTL: {
    userProfile: 300,      // 5 minutes
    decks: 60,            // 1 minute
    stats: 120,           // 2 minutes
    leaderboard: 180      // 3 minutes
  }
};

