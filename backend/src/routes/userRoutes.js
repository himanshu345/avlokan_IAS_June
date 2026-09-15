const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  updateUserRole,
  uploadProfilePicture,
  changePassword
} = require('../controllers/userController');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Google Auth endpoint (implementation)
router.post('/google-auth', async (req, res) => {
  const { name, googleId, picture } = req.body;
  const email = (req.body.email || '').toLowerCase().trim();

  try {
    // Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      try {
        user = await User.create({
          name: name || email.split('@')[0],
          email,
          googleId,
          profilePicture: picture || ''
        });
      } catch (createErr) {
        // Duplicate email/googleId means a concurrent request (e.g. a double-click) already
        // created/linked this account - fetch it instead of failing.
        if (createErr.code === 11000) {
          user = await User.findOne({ email });
        } else {
          throw createErr;
        }
      }
    } else if (!user.googleId) {
      // Link Google ID if not already linked
      user.googleId = googleId;
      if (picture && !user.profilePicture) user.profilePicture = picture;
      await user.save();
    }

    if (!user) {
      throw new Error('User lookup failed after create/link');
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture
      }
    });
  } catch (err) {
    console.error('Google auth failed:', { email, googleId, error: err.message });
    res.status(500).json({ success: false, message: 'Google authentication failed', error: err.message });
  }
});

// Protected routes
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.put('/change-password', protect, changePassword);
router.post('/profile-picture', protect, upload.single('profilePicture'), uploadProfilePicture);

// Admin routes
router.get('/', protect, admin, getUsers);
router.delete('/:id', protect, admin, deleteUser);
router.put('/:id/role', protect, admin, updateUserRole);

module.exports = router; 