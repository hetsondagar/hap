import { Router } from 'express';
import {
  getDashboardData,
  changePassword,
  changeUsername,
  toggleLikeFlashcard,
  toggleLikeDeck,
  getLikedFlashcards,
  getLikedDecks,
  validatePasswordChange,
  validateUsernameChange
} from '../controllers/dashboardController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// All dashboard routes require authentication
router.use(authenticateToken);

// Dashboard data
router.get('/', getDashboardData);

// User management
router.post('/change-password', validatePasswordChange, changePassword);
router.post('/change-username', validateUsernameChange, changeUsername);

// Likes
router.post('/like/flashcard/:flashcardId', toggleLikeFlashcard);
router.post('/like/deck/:deckId', toggleLikeDeck);
router.get('/liked/flashcards', getLikedFlashcards);
router.get('/liked/decks', getLikedDecks);

export default router;

