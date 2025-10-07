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
  validateComment,
  validatePost,
  createPost,
  getPosts,
  getPost,
  togglePostLike,
  addPostComment,
  deletePost,
  searchPosts
} from '../controllers/communityController';
import { authenticateToken, optionalAuth } from '../middleware/authMiddleware';
import { updateDeck, deleteDeck } from '../controllers/communityController';

const router = Router();

// ========== DECK ROUTES ==========
// Public routes
router.get('/decks', browseDecks);
router.get('/decks/search', searchDecks);
router.get('/decks/:id', optionalAuth, getDeck);
router.get('/users/:userId/decks', getUserDecks);

// Protected routes
router.post('/decks', authenticateToken, validateCreateDeck, createDeck);
router.put('/decks/:id/like', authenticateToken, validateDeckId, toggleLike);
router.post('/decks/:id/comment', authenticateToken, validateDeckId, validateComment, addComment);
router.put('/decks/:id', authenticateToken, validateDeckId, updateDeck);
router.delete('/decks/:id', authenticateToken, validateDeckId, deleteDeck);
router.post('/follow/:id', authenticateToken, toggleFollow);

// ========== POST/DISCUSSION ROUTES ==========
// Public routes
router.get('/posts', getPosts);
router.get('/posts/search', searchPosts);
router.get('/posts/:id', getPost);

// Protected routes
router.post('/posts', authenticateToken, validatePost, createPost);
router.put('/posts/:id/like', authenticateToken, togglePostLike);
router.post('/posts/:id/comment', authenticateToken, validateComment, addPostComment);
router.delete('/posts/:id', authenticateToken, deletePost);

export default router;
