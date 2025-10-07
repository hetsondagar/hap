import { Router } from 'express';
import {
  browseDecks,
  createDeck,
  getDeck,
  toggleLike,
  addComment,
  toggleFollow,
  getUserDecks,
  searchDecks,
  validateCreateDeck,
  validateDeckId,
  validateComment
} from '../controllers/communityController';
import { authenticateToken, optionalAuth } from '../middleware/authMiddleware';

const router = Router();

// Public routes
router.get('/decks', browseDecks);
router.get('/decks/search', searchDecks);
router.get('/decks/:id', optionalAuth, getDeck);
router.get('/users/:userId/decks', getUserDecks);

// Protected routes
router.post('/decks', authenticateToken, validateCreateDeck, createDeck);
router.put('/decks/:id/like', authenticateToken, validateDeckId, toggleLike);
router.post('/decks/:id/comment', authenticateToken, validateDeckId, validateComment, addComment);
router.put('/decks/:id', authenticateToken, validateDeckId, require('../controllers/communityController').updateDeck);
router.delete('/decks/:id', authenticateToken, validateDeckId, require('../controllers/communityController').deleteDeck);
router.post('/follow/:id', authenticateToken, toggleFollow);

export default router;
