const express = require('express');
const { protect, evaluator, admin } = require('../middleware/authMiddleware');
const { 
  submitAnswer,
  getMySubmissions,
  getSubmissionById,
  getPendingSubmissions,
  submitEvaluation,
  updateEvaluation,
  getEvaluationStats,
  getAllSubmissions,
  getSignedDownloadUrl
} = require('../controllers/evaluationController');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const evaluatedPdfUpload = multer({ storage: multer.memoryStorage() });

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
router.post('/evaluate/:id/evaluated-pdf', protect, evaluator, evaluatedPdfUpload.single('evaluatedPdf'), require('../controllers/evaluationController').uploadEvaluatedPdf);

// Admin route to get all submissions
router.get('/', protect, admin, getAllSubmissions);
// Add this route for admin download
router.get('/download', protect, getSignedDownloadUrl);

module.exports = router; 