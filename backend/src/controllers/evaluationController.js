const Answer = require('../models/Answer');
const Evaluation = require('../models/Evaluation');
const User = require('../models/User');
const AWS = require('aws-sdk');
const multer = require('multer');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const upload = multer({ storage: multer.memoryStorage() });

/**
 * @desc    Submit a new answer for evaluation
 * @route   POST /api/evaluations/submit-answer
 * @access  Private
 */
const submitAnswer = async (req, res) => {
  try {
    const { subject } = req.body;

    // Validate required fields
    if (!subject) {
      return res.status(400).json({
        success: false,
        message: 'Please provide subject'
      });
    }
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a PDF file'
      });
    }

    // Check if user has available evaluations or allow 2 free uploads
    const user = await User.findById(req.user._id).populate('subscriptionPlan');
    if (!user.subscriptionPlan) {
      // Count user's total submissions
      const freeUploads = await Answer.countDocuments({ user: req.user._id });
      if (freeUploads >= 2) {
        return res.status(400).json({
          success: false,
          message: 'You have used your 2 free uploads. Please subscribe to continue submitting answers.'
        });
      }
    } else {
      // Enforce monthly and daily evaluation limits
      const plan = user.subscriptionPlan;
      // Monthly limit
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      const monthlyUploads = await Answer.countDocuments({
        user: req.user._id,
        submissionDate: { $gte: startOfMonth }
      });
      if (plan.evaluationsPerMonth && monthlyUploads >= plan.evaluationsPerMonth) {
        return res.status(400).json({
          success: false,
          message: `You have reached your monthly evaluation limit (${plan.evaluationsPerMonth}) for your plan.`
        });
      }
      // Daily limit
      if (plan.evaluationsPerDay && plan.evaluationsPerDay > 0) {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const dailyUploads = await Answer.countDocuments({
          user: req.user._id,
          submissionDate: { $gte: startOfDay }
        });
        if (dailyUploads >= plan.evaluationsPerDay) {
          return res.status(400).json({
            success: false,
            message: `You have reached your daily evaluation limit (${plan.evaluationsPerDay}) for your plan.`
          });
        }
      }
    }

    // Upload PDF to S3
    let attachments = [];
    try {
      const s3Result = await s3.upload({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: `submitted-answers/${Date.now()}_${req.file.originalname}`,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      }).promise();
      attachments.push({
        url: s3Result.Location,
        key: s3Result.Key,
        mimetype: req.file.mimetype,
        size: req.file.size,
        originalname: req.file.originalname,
        uploadDate: new Date()
      });
      console.log('S3 upload successful (submitAnswer):', s3Result);
    } catch (error) {
      console.error('S3 upload failed (submitAnswer):', error);
      return res.status(500).json({ success: false, message: 'S3 upload failed', error: error.message });
    }

    // Create new answer
    const answer = await Answer.create({
      user: req.user._id,
      subject,
      fileAttachments: attachments,
      submissionDate: new Date(),
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'Answer submitted successfully',
      answer
    });
  } catch (error) {
    console.error('Error in submitAnswer:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

/**
 * @desc    Get all submissions by the logged-in user
 * @route   GET /api/evaluations/my-submissions
 * @access  Private
 */
const getMySubmissions = async (req, res) => {
  try {
    const { 
      status, 
      subject,
      page = 1, 
      limit = 10,
      sortBy = 'submissionDate',
      sortOrder = 'desc'
    } = req.query;
    
    // Build filter
    const filter = { user: req.user._id, isDeleted: false };
    
    if (status) filter.status = status;
    if (subject) filter.subject = subject;
    
    // Build sort options
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get answers with pagination
    const answers = await Answer.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate({
        path: 'evaluation',
        select: 'totalScore evaluationDate status feedback evaluatedPdf'
      });
    
    // Get total count for pagination
    const total = await Answer.countDocuments(filter);
    
    res.json({
      success: true,
      count: answers.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      submissions: answers
    });
  } catch (error) {
    console.error('Error in getMySubmissions:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

/**
 * @desc    Get a specific submission by ID
 * @route   GET /api/evaluations/submission/:id
 * @access  Private
 */
const getSubmissionById = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id)
      .populate({
        path: 'evaluation',
        select: '-revisionNotes'
      })
      .populate({
        path: 'user',
        select: 'name email'
      });
    
    if (!answer) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }
    
    // Check if user is authorized to view this submission
    if (answer.user._id.toString() !== req.user._id.toString() && 
        req.user.role !== 'admin' && 
        req.user.role !== 'evaluator') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this submission'
      });
    }
    
    res.json({
      success: true,
      submission: answer
    });
  } catch (error) {
    console.error('Error in getSubmissionById:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

/**
 * @desc    Get pending submissions for evaluation
 * @route   GET /api/evaluations/pending
 * @access  Evaluator/Admin
 */
const getPendingSubmissions = async (req, res) => {
  try {
    const { 
      subject,
      page = 1, 
      limit = 10
    } = req.query;
    
    // Build filter
    const filter = { 
      status: 'pending',
      isDeleted: false
    };
    
    if (subject) filter.subject = subject;
    
    // Get pending answers with pagination
    const answers = await Answer.find(filter)
      .sort({ submissionDate: 1 }) // Oldest first
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit))
      .populate({
        path: 'user',
        select: 'name email'
      });
    
    // Get total count for pagination
    const total = await Answer.countDocuments(filter);
    
    res.json({
      success: true,
      count: answers.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      pendingSubmissions: answers
    });
  } catch (error) {
    console.error('Error in getPendingSubmissions:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

/**
 * @desc    Submit evaluation for an answer
 * @route   POST /api/evaluations/evaluate/:id
 * @access  Evaluator/Admin
 */
const submitEvaluation = async (req, res) => {
  try {
    const {
      scores,
      totalScore,
      feedback
    } = req.body;
    
    // Validate required fields
    if (!scores || !totalScore || !feedback) {
      console.log('Missing required fields:', { scores, totalScore, feedback });
      return res.status(400).json({
        success: false,
        message: 'Please provide scores, totalScore, and feedback'
      });
    }
    
    // Find the answer
    const answer = await Answer.findById(req.params.id);
    
    if (!answer) {
      console.log('Submission not found for ID:', req.params.id);
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }
    
    // Check if answer is already evaluated
    if (answer.status === 'evaluated') {
      console.log('Answer already evaluated:', answer._id);
      return res.status(400).json({
        success: false,
        message: 'Submission already evaluated'
      });
    }
    
    // Create evaluation
    const evaluation = await Evaluation.create({
      answer: answer._id,
      evaluator: req.user._id,
      scores,
      totalScore,
      feedback,
      evaluationDate: new Date(),
      status: 'completed'
    });
    
    // Update answer status
    answer.status = 'evaluated';
    answer.evaluation = evaluation._id;
    await answer.save();
    
    res.status(201).json({
      success: true,
      message: 'Evaluation submitted successfully',
      evaluation
    });
  } catch (error) {
    console.error('Error in submitEvaluation:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

/**
 * @desc    Update an evaluation
 * @route   PUT /api/evaluations/evaluate/:id
 * @access  Evaluator/Admin
 */
const updateEvaluation = async (req, res) => {
  try {
    // Find the evaluation
    let evaluation = await Evaluation.findById(req.params.id);
    
    if (!evaluation) {
      return res.status(404).json({
        success: false,
        message: 'Evaluation not found'
      });
    }
    
    // Check if user is authorized to update this evaluation
    if (evaluation.evaluator.toString() !== req.user._id.toString() && 
        req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this evaluation'
      });
    }
    
    // Update evaluation
    evaluation = await Evaluation.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      message: 'Evaluation updated successfully',
      evaluation
    });
  } catch (error) {
    console.error('Error in updateEvaluation:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

/**
 * @desc    Get evaluation statistics for user
 * @route   GET /api/evaluations/stats
 * @access  Private
 */
const getEvaluationStats = async (req, res) => {
  try {
    // Count total submissions
    const totalFilter = { user: req.user._id, isDeleted: false };
    const totalSubmissions = await Answer.countDocuments(totalFilter);
    console.log('Total submissions filter:', totalFilter, 'count:', totalSubmissions);
    // Count pending submissions
    const pendingFilter = { user: req.user._id, status: 'pending', isDeleted: false };
    const pendingSubmissions = await Answer.countDocuments(pendingFilter);
    console.log('Pending submissions filter:', pendingFilter, 'count:', pendingSubmissions);
    // Count evaluated submissions
    const evaluatedFilter = { user: req.user._id, status: 'evaluated', isDeleted: false };
    const evaluatedSubmissions = await Answer.countDocuments(evaluatedFilter);
    console.log('Evaluated submissions filter:', evaluatedFilter, 'count:', evaluatedSubmissions);
    
    // Get average score
    const evaluations = await Answer.find({ 
      user: req.user._id,
      status: 'evaluated',
      isDeleted: false
    }).populate('evaluation');
    
    let totalScore = 0;
    let count = 0;
    
    evaluations.forEach(answer => {
      if (answer.evaluation && answer.evaluation.totalScore) {
        totalScore += answer.evaluation.totalScore;
        count++;
      }
    });
    
    const averageScore = count > 0 ? (totalScore / count).toFixed(1) : 0;
    
    // Get subject-wise performance
    const subjects = await Answer.distinct('subject', { 
      user: req.user._id,
      status: 'evaluated',
      isDeleted: false
    });
    
    const subjectPerformance = [];
    
    for (const subject of subjects) {
      const subjectAnswers = await Answer.find({ 
        user: req.user._id,
        subject,
        status: 'evaluated',
        isDeleted: false
      }).populate('evaluation');
      
      let subjectTotalScore = 0;
      let subjectCount = 0;
      
      subjectAnswers.forEach(answer => {
        if (answer.evaluation && answer.evaluation.totalScore) {
          subjectTotalScore += answer.evaluation.totalScore;
          subjectCount++;
        }
      });
      
      const subjectAverageScore = subjectCount > 0 ? (subjectTotalScore / subjectCount).toFixed(1) : 0;
      
      subjectPerformance.push({
        subject,
        averageScore: parseFloat(subjectAverageScore),
        submissionsCount: subjectCount
      });
    }
    
    res.json({
      success: true,
      stats: {
        totalSubmissions,
        pendingSubmissions,
        evaluatedSubmissions,
        averageScore: parseFloat(averageScore),
        subjectPerformance
      }
    });
  } catch (error) {
    console.error('Error in getEvaluationStats:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

/**
 * @desc    Get all submissions (admin only)
 * @route   GET /api/evaluations
 * @access  Private/Admin
 */
const getAllSubmissions = async (req, res) => {
  try {
    const submissions = await Answer.find({ isDeleted: false })
      .populate('user', 'name email')
      .populate({
        path: 'evaluation',
        select: 'totalScore evaluationDate status feedback'
      });
    res.json({ success: true, submissions });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Upload evaluated PDF for an evaluation
 * @route   POST /api/evaluations/:id/evaluated-pdf
 * @access  Evaluator/Admin
 */
const uploadEvaluatedPdf = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    const evaluation = await Evaluation.findById(req.params.id);
    if (!evaluation) {
      return res.status(404).json({ success: false, message: 'Evaluation not found' });
    }
    // Debug log before upload
    console.log('Attempting to upload to S3:', {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: `evaluated-pdfs/${Date.now()}_${req.file.originalname}`,
      FileSize: req.file.size,
      User: req.user ? req.user._id : 'unknown'
    });
    try {
      // Upload to S3
      const s3Result = await s3.upload({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: `evaluated-pdfs/${Date.now()}_${req.file.originalname}`,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      }).promise();
      // Debug log after upload
      console.log('S3 upload successful:', s3Result);
      evaluation.evaluatedPdf = {
        url: s3Result.Location,
        key: s3Result.Key,
        mimetype: req.file.mimetype,
        size: req.file.size,
        uploadDate: new Date()
      };
      await evaluation.save();
      res.json({ success: true, evaluatedPdf: evaluation.evaluatedPdf });
    } catch (error) {
      // Debug log on upload failure
      console.error('S3 upload failed:', error);
      res.status(500).json({ success: false, message: 'S3 upload failed', error: error.message });
    }
  } catch (error) {
    console.error('Error in uploadEvaluatedPdf:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Generate a signed S3 download URL for a given key
const getSignedDownloadUrl = async (req, res) => {
  try {
    const { key } = req.query;
    if (!key) {
      return res.status(400).json({ success: false, message: 'No key provided' });
    }
    const url = s3.getSignedUrl('getObject', {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
      Expires: 60 * 5 // 5 minutes
    });
    res.json({ success: true, url });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error generating signed URL', error: error.message });
  }
};

module.exports = {
  submitAnswer,
  getMySubmissions,
  getSubmissionById,
  getPendingSubmissions,
  submitEvaluation,
  updateEvaluation,
  getEvaluationStats,
  getAllSubmissions,
  uploadEvaluatedPdf,
  getSignedDownloadUrl
}; 