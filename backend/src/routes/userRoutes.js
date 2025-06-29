const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  updateUserRole
} = require('../controllers/userController');

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Google Auth endpoint (placeholder)
router.post('/google-auth', (req, res) => {
  // TODO: Implement Google authentication logic
  res.json({ message: 'Google auth endpoint placeholder' });
});

// Protected routes
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

// Admin routes
router.get('/', protect, admin, getUsers);
router.delete('/:id', protect, admin, deleteUser);
router.put('/:id/role', protect, admin, updateUserRole);

module.exports = router; 