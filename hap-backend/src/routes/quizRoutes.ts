import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { generateQuiz, submitQuiz } from '../controllers/quizController';

const router = Router();

// Generate quiz for a specific subject
router.get('/generate/:subjectId', authenticateToken, generateQuiz);

// Submit quiz answers and get results
router.post('/submit', authenticateToken, submitQuiz);

export default router;