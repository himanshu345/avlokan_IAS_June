const Answer = require('../models/Answer');
const Evaluation = require('../models/Evaluation');
const User = require('../models/User');

/**
 * @desc    Submit a new answer for evaluation
 * @route   POST /api/evaluations/submit-answer
 * @access  Private
 */
const submitAnswer = async (req, res) => {
  try {
    const { 
      subject
    } = req.body;

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
      // Existing subscription logic (if any)
      // You can keep your evaluationsRemaining logic here if needed
    }

    // Handle PDF upload
    let attachments = [];
    if (req.file) {
      attachments.push({
        filename: req.file.filename,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        path: req.file.path
      });
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
        select: 'totalScore evaluationDate status feedback'
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
      return res.status(400).json({
        success: false,
        message: 'Please provide scores, totalScore, and feedback'
      });
    }
    
    // Find the answer
    const answer = await Answer.findById(req.params.id);
    
    if (!answer) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }
    
    // Check if answer is already evaluated
    if (answer.status === 'evaluated') {
      return res.status(400).json({
        success: false,
        message: 'This submission has already been evaluated'
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
    const totalSubmissions = await Answer.countDocuments({ 
      user: req.user._id,
      isDeleted: false
    });
    
    // Count pending submissions
    const pendingSubmissions = await Answer.countDocuments({ 
      user: req.user._id,
      status: 'pending',
      isDeleted: false
    });
    
    // Count evaluated submissions
    const evaluatedSubmissions = await Answer.countDocuments({ 
      user: req.user._id,
      status: 'evaluated',
      isDeleted: false
    });
    
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

module.exports = {
  submitAnswer,
  getMySubmissions,
  getSubmissionById,
  getPendingSubmissions,
  submitEvaluation,
  updateEvaluation,
  getEvaluationStats,
  getAllSubmissions
}; 