const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  type: {
    type: String,
    enum: ['notes', 'videos', 'pyqs', 'toppers', 'current', 'syllabus'],
    required: [true, 'Resource type is required']
  },
  subject: {
    type: String,
    trim: true
  },
  author: {
    type: String,
    trim: true
  },
  authorRole: {
    type: String,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  thumbnail: {
    type: String,
    default: ''
  },
  content: {
    type: String
  },
  fileUrl: {
    type: String
  },
  videoUrl: {
    type: String
  },
  duration: {
    type: String
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }],
  viewCount: {
    type: Number,
    default: 0
  },
  downloadCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Add a text index for searching
resourceSchema.index({ 
  title: 'text', 
  description: 'text', 
  subject: 'text', 
  author: 'text',
  tags: 'text'
});

const Resource = mongoose.model('Resource', resourceSchema);

module.exports = Resource; 