import { Router } from 'express';
import {
  createFlashcard,
  getFlashcardsByDepartment,
  getUserFlashcards,
  getFlashcard,
  updateFlashcard,
  deleteFlashcard,
  searchFlashcards,
  validateCreateFlashcard,
  validateFlashcardId
} from '../controllers/flashcardController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Protected routes
router.post('/', authenticateToken, validateCreateFlashcard, createFlashcard);
router.get('/user', authenticateToken, getUserFlashcards);
router.get('/search', authenticateToken, searchFlashcards);
router.get('/:id', authenticateToken, validateFlashcardId, getFlashcard);
router.put('/:id', authenticateToken, validateFlashcardId, updateFlashcard);
router.delete('/:id', authenticateToken, validateFlashcardId, deleteFlashcard);

// Public routes
router.get('/department/:dept', getFlashcardsByDepartment);

export default router;
