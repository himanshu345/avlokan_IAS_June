const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: function() {
      return !this.googleId && !this.phone; // Email is optional for Google/phone auth accounts
    },
    unique: true,
    sparse: true,
    lowercase: true
  },
  password: {
    type: String,
    required: function() {
      return !this.googleId && !this.phone; // Password is required only for email/password auth
    }
  },
  googleId: {
    type: String,
    sparse: true,
    unique: true
  },
  phone: {
    type: String,
    sparse: true,
    unique: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  role: {
    type: String,
    enum: ['user', 'evaluator', 'admin'],
    default: 'user'
  },
  subscriptionPlan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubscriptionPlan'
  },
  subscriptionExpiry: {
    type: Date
  },
  evaluationsRemaining: {
    type: Number,
    default: 0
  },
  evaluationsUsed: {
    type: Number,
    default: 0
  },
  profilePicture: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    trim: true
  },
  preferences: {
    emailNotifications: {
      type: Boolean,
      default: true
    },
    darkMode: {
      type: Boolean,
      default: false
    }
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Encrypt password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Match password
UserSchema.methods.matchPassword = async function(enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema); 