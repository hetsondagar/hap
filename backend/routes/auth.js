const express = require('express');
const { protect } = require('../middleware/auth');
const { validateUserRegistration, validateUserLogin } = require('../middleware/validation');
const {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  refreshToken
} = require('../controllers/authController');

const router = express.Router();

// Public routes
router.post('/register', validateUserRegistration, register);
router.post('/login', validateUserLogin, login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/refresh-token', refreshToken);

// Protected routes
router.use(protect); // All routes below this middleware are protected

router.get('/me', getMe);
router.post('/logout', logout);
router.patch('/update-profile', updateProfile);
router.patch('/change-password', changePassword);

module.exports = router;
