import express, { Application, Request, Response, NextFunction } from 'express';
import cors, { CorsOptions } from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/authRoutes';
import flashcardRoutes from './routes/flashcardRoutes';
import quizRoutes from './routes/quizRoutes';
import communityRoutes from './routes/communityRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import subjectRoutes from './routes/subjectRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import gamificationRoutes from './routes/gamificationRoutes';
import quizRoutes from './routes/quizRoutes';

// Load environment variables
dotenv.config();

const app: Application = express();

// Trust proxy - Required for Render, Heroku, and other cloud platforms
// This allows Express to correctly identify client IPs behind reverse proxies
app.set('trust proxy', 1);

// CORS configuration (supports multiple comma-separated origins)
const allowedOrigins = (process.env.FRONTEND_URLS || process.env.FRONTEND_URL || 'http://localhost:5173,http://localhost:3000')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

const corsConfig: CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // In development, allow localhost
    if (process.env.NODE_ENV === 'development' && origin.includes('localhost')) {
      return callback(null, true);
    }
    
    // Allow if origin is in the allowed list or wildcard is set
    if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // Allow any Vercel deployment URLs in production
    if (origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    
    console.log(`CORS blocked for origin: ${origin}`);
    console.log(`Allowed origins: ${allowedOrigins.join(', ')}`);
    return callback(new Error(`CORS blocked for origin ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'X-Request-Id'],
  optionsSuccessStatus: 204
};

app.use(cors(corsConfig));
app.options('*', cors(corsConfig));

// Security middleware (after CORS to avoid interfering with preflight)
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'HAP FlashCard API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/flashcards', flashcardRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/gamification', gamificationRoutes);
app.use('/api/quiz', quizRoutes);

// 404 handler
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Global error handler
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Global error handler:', error);

  // Mongoose validation error
  if (error.name === 'ValidationError') {
    const errors = Object.values((error as any).errors).map((err: any) => ({
      field: err.path,
      message: err.message
    }));

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  // Mongoose duplicate key error
  if ((error as any).code === 11000) {
    const field = Object.keys((error as any).keyPattern)[0];
    return res.status(400).json({
      success: false,
      message: `${field} already exists`
    });
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired'
    });
  }

  // Default error
  return res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : error.message
  });
});

export default app;
