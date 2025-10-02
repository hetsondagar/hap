import { Router } from 'express';
import {
  generateQuiz,
  submitQuiz,
  getQuizResults,
  getQuizResult,
  validateSubmitQuiz,
  validateQuizId
} from '../controllers/quizController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Protected routes
router.get('/generate', authenticateToken, generateQuiz);
router.post('/submit', authenticateToken, validateSubmitQuiz, submitQuiz);
router.get('/results/:userId', authenticateToken, getQuizResults);
router.get('/:id', authenticateToken, validateQuizId, getQuizResult);

export default router;
