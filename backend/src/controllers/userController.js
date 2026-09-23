const User = require('../models/User');
const SubscriptionPlan = require('../models/SubscriptionPlan');
const Order = require('../models/Order');
const jwt = require('jsonwebtoken');
const AWS = require('aws-sdk');
const crypto = require('crypto');
const { verifyFirebaseIdToken } = require('../utils/firebaseAdmin');
const { sendEmail } = require('../utils/sendEmail');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret_key_for_development', {
    expiresIn: '30d'
  });
};

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

/**
 * @desc    Register a new user
 * @route   POST /api/users/register
 * @access  Public
 */
const registerUser = async (req, res) => {
  try {
    const { name, password } = req.body;
    const email = (req.body.email || '').toLowerCase().trim();

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password
    });

    if (user) {
      res.status(201).json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid user data'
      });
    }
  } catch (error) {
    console.error('Error in registerUser:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Login user
 * @route   POST /api/users/login
 * @access  Public
 */
const loginUser = async (req, res) => {
  try {
    const { password } = req.body;
    const email = (req.body.email || '').toLowerCase().trim();

    // Check for user email
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
  } catch (error) {
    console.error('Error in loginUser:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Login or register a user via a verified Firebase phone-auth ID token
 * @route   POST /api/users/phone-auth
 * @access  Public
 */
const phoneAuth = async (req, res) => {
  try {
    const { idToken, name } = req.body;

    if (!idToken) {
      return res.status(400).json({ success: false, message: 'Missing idToken' });
    }

    let decoded;
    try {
      decoded = await verifyFirebaseIdToken(idToken);
    } catch (verifyErr) {
      return res.status(401).json({ success: false, message: 'Invalid or expired phone verification' });
    }

    const phone = decoded.phone_number;
    if (!phone) {
      return res.status(400).json({ success: false, message: 'No verified phone number on this token' });
    }

    let user = await User.findOne({ phone });
    if (!user) {
      user = await User.create({
        name: name || phone,
        phone
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profilePicture: user.profilePicture
      }
    });
  } catch (err) {
    console.error('Phone auth failed:', err.message);
    res.status(500).json({ success: false, message: 'Phone authentication failed', error: err.message });
  }
};

/**
 * @desc    Get user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('subscriptionPlan');

    if (user) {
      res.json({
        success: true,
        user
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.profilePicture = req.body.profilePicture || user.profilePicture;
      user.bio = req.body.bio || user.bio;
      
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        success: true,
        user: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          profilePicture: updatedUser.profilePicture,
          bio: updatedUser.bio
        },
        token: generateToken(updatedUser._id)
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
  } catch (error) {
    console.error('Error in updateUserProfile:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Change the logged-in user's password
 * @route   PUT /api/users/change-password
 * @access  Private
 */
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your current password and a new password'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long'
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error in changePassword:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Request a password reset link by email
 * @route   POST /api/users/forgot-password
 * @access  Public
 */
const forgotPassword = async (req, res) => {
  try {
    const email = (req.body.email || '').toLowerCase().trim();
    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide your email address' });
    }

    // Always respond the same way, whether or not the account exists, so this
    // endpoint can't be used to check which emails are registered.
    const genericResponse = {
      success: true,
      message: "If an account exists for that email, we've sent a password reset link."
    };

    const user = await User.findOne({ email });
    if (!user || !user.password) {
      // No account, or an account that only signs in via Google/phone (nothing to reset).
      return res.json(genericResponse);
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(rawToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL || 'https://avlokanias.com'}/reset-password?token=${rawToken}`;

    try {
      await sendEmail({
        to: user.email,
        subject: 'Reset your Avlokan IAS password',
        html: `
          <p>Hi ${user.name || 'there'},</p>
          <p>We received a request to reset your password. This link is valid for 1 hour:</p>
          <p><a href="${resetUrl}">Reset your password</a></p>
          <p>If you didn't request this, you can safely ignore this email.</p>
          <p>Regards,<br/>Avlokan IAS</p>
        `
      });
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      return res.status(500).json({ success: false, message: 'Failed to send reset email. Please try again later.' });
    }

    res.json(genericResponse);
  } catch (error) {
    console.error('Error in forgotPassword:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Reset password using a token from the forgot-password email
 * @route   POST /api/users/reset-password
 * @access  Public
 */
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ success: false, message: 'Missing token or new password' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters long' });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'This reset link is invalid or has expired' });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error in resetPassword:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Get all users
 * @route   GET /api/users
 * @access  Private/Admin
 */
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').populate('subscriptionPlan', 'name');
    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    console.error('Error in getUsers:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Delete user
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
 */
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      await user.deleteOne();
      res.json({
        success: true,
        message: 'User removed'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
  } catch (error) {
    console.error('Error in deleteUser:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Update user role
 * @route   PUT /api/users/:id/role
 * @access  Private/Admin
 */
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!role || !['user', 'evaluator', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid role (user, evaluator, or admin)'
      });
    }

    const user = await User.findById(req.params.id);

    if (user) {
      user.role = role;
      const updatedUser = await user.save();

      res.json({
        success: true,
        user: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role
        }
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
  } catch (error) {
    console.error('Error in updateUserRole:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Grant/extend a user's subscription plan (e.g. for an offline/manual payment)
 * @route   PUT /api/users/:id/subscription
 * @access  Private/Admin
 */
const assignSubscription = async (req, res) => {
  try {
    const { planId, durationInMonths } = req.body;

    if (!planId) {
      return res.status(400).json({ success: false, message: 'Please provide a planId' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const plan = await SubscriptionPlan.findById(planId);
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }

    const now = new Date();
    let expiry = now;
    if (user.subscriptionExpiry && user.subscriptionExpiry > now) {
      // Extend the current subscription rather than overwriting it
      expiry = new Date(user.subscriptionExpiry);
    }
    expiry.setMonth(expiry.getMonth() + (durationInMonths || 1));

    user.subscriptionPlan = plan._id;
    user.subscriptionExpiry = expiry;
    await user.save();

    const timestamp = Date.now();
    await Order.create({
      user: user._id,
      plan: plan._id,
      amount: plan.monthlyPrice,
      paymentId: `MANUAL-${timestamp}`,
      orderId: `MANUAL-${timestamp}`,
      status: 'paid'
    });

    res.json({
      success: true,
      message: 'Subscription assigned',
      user: {
        _id: user._id,
        subscriptionPlan: { _id: plan._id, name: plan.name },
        subscriptionExpiry: expiry
      }
    });
  } catch (error) {
    console.error('Error in assignSubscription:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Upload user profile picture
 * @route   POST /api/users/profile-picture
 * @access  Private
 */
const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    // Upload image to S3
    const s3Result = await s3.upload({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: `profile-pictures/${Date.now()}_${req.file.originalname}`,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    }).promise();
    user.profilePicture = s3Result.Location;
    await user.save();
    res.json({ success: true, profilePicture: s3Result.Location });
  } catch (error) {
    console.error('Error in uploadProfilePicture:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  phoneAuth,
  getUsers,
  deleteUser,
  updateUserRole,
  assignSubscription,
  uploadProfilePicture
}; 