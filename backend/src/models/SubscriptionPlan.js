const mongoose = require('mongoose');

const subscriptionPlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Plan name is required'],
    trim: true,
    unique: true
  },
  description: {
    type: String,
    required: [true, 'Plan description is required']
  },
  monthlyPrice: {
    type: Number,
    required: [true, 'Monthly price is required'],
    min: 0
  },
  annualPrice: {
    type: Number,
    required: [true, 'Annual price is required'],
    min: 0
  },
  features: [{
    type: String,
    required: true
  }],
  evaluationsPerMonth: {
    type: Number,
    required: true,
    min: 0
  },
  accessToResources: {
    type: Boolean,
    default: false
  },
  accessToVideos: {
    type: Boolean,
    default: false
  },
  personalizedFeedback: {
    type: Boolean,
    default: false
  },
  mentorshipSessions: {
    type: Number,
    default: 0
  },
  mockInterviews: {
    type: Number,
    default: 0
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const SubscriptionPlan = mongoose.model('SubscriptionPlan', subscriptionPlanSchema);

module.exports = SubscriptionPlan; 