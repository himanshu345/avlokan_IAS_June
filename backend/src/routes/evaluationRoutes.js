const express = require('express');
const { protect, evaluator } = require('../middleware/authMiddleware');
const { 
  submitAnswer,
  getMySubmissions,
  getSubmissionById,
  getPendingSubmissions,
  submitEvaluation,
  updateEvaluation,
  getEvaluationStats 
} = require('../controllers/evaluationController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const router = express.Router();

// User routes
router.post('/submit-answer', protect, upload.single('pdf'), submitAnswer);
router.get('/my-submissions', protect, getMySubmissions);
router.get('/submission/:id', protect, getSubmissionById);
router.get('/stats', protect, getEvaluationStats);

// Evaluator routes
router.get('/pending', protect, evaluator, getPendingSubmissions);
router.post('/evaluate/:id', protect, evaluator, submitEvaluation);
router.put('/evaluate/:id', protect, evaluator, updateEvaluation);

module.exports = router; 