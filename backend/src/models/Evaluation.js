const mongoose = require('mongoose');

const evaluationSchema = new mongoose.Schema({
  answer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Answer',
    required: true
  },
  evaluator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  scores: {
    understanding: {
      type: Number,
      min: 0,
      max: 10,
      required: true
    },
    structure: {
      type: Number,
      min: 0,
      max: 10,
      required: true
    },
    relevance: {
      type: Number,
      min: 0,
      max: 10,
      required: true
    },
    language: {
      type: Number,
      min: 0,
      max: 10,
      required: true
    },
    examples: {
      type: Number,
      min: 0,
      max: 10,
      required: true
    }
  },
  totalScore: {
    type: Number,
    min: 0,
    max: 50,
    required: true
  },
  feedback: {
    general: {
      type: String,
      required: true
    },
    strengths: [{
      type: String
    }],
    areasForImprovement: [{
      type: String
    }],
    specificComments: [{
      text: String,
      lineNumber: Number
    }]
  },
  evaluationDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['draft', 'completed'],
    default: 'draft'
  },
  revisionRequested: {
    type: Boolean,
    default: false
  },
  revisionNotes: {
    type: String
  }
}, {
  timestamps: true
});

const Evaluation = mongoose.model('Evaluation', evaluationSchema);

module.exports = Evaluation; 