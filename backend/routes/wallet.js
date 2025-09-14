const express = require('express');
const { protect, checkOwnership } = require('../middleware/auth');
const { validateObjectId, validatePagination } = require('../middleware/validation');
const {
  getWallet,
  getTransactionHistory,
  addPoints,
  transferPoints,
  getWalletStats,
  getMonthlySummary
} = require('../controllers/walletController');

const router = express.Router();

// All routes are protected
router.use(protect);

// Wallet management
router.get('/:userId', validateObjectId('userId'), checkOwnership(), getWallet);
router.get('/:userId/transactions', validateObjectId('userId'), checkOwnership(), validatePagination, getTransactionHistory);
router.get('/:userId/stats', validateObjectId('userId'), checkOwnership(), getWalletStats);
router.get('/:userId/monthly', validateObjectId('userId'), checkOwnership(), getMonthlySummary);

// Point operations
router.post('/:userId/add', validateObjectId('userId'), checkOwnership(), addPoints);
router.post('/:userId/transfer', validateObjectId('userId'), checkOwnership(), transferPoints);

module.exports = router;
