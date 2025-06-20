const Resource = require('../models/Resource');

/**
 * @desc    Get all resources with filtering
 * @route   GET /api/resources
 * @access  Public
 */
const getResources = async (req, res) => {
  try {
    const { 
      type,
      subject,
      isPremium,
      search,
      sortBy = 'date',
      sortOrder = 'desc',
      page = 1,
      limit = 10
    } = req.query;

    // Build filter query
    const filter = {};
    if (type) filter.type = type;
    if (subject) filter.subject = subject;
    if (isPremium !== undefined) filter.isPremium = isPremium === 'true';
    
    // Build search query
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    // Only include active resources
    filter.isActive = true;

    // Build sort options
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute query with pagination
    const resources = await Resource.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count for pagination
    const total = await Resource.countDocuments(filter);
    
    res.json({
      success: true,
      count: resources.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      resources
    });
  } catch (error) {
    console.error('Error in getResources:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

/**
 * @desc    Get resource by ID
 * @route   GET /api/resources/:id
 * @access  Public
 */
const getResourceById = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    
    if (!resource) {
      return res.status(404).json({ 
        success: false, 
        message: 'Resource not found' 
      });
    }

    // Increment view count
    resource.viewCount += 1;
    await resource.save();
    
    res.json({
      success: true,
      resource
    });
  } catch (error) {
    console.error('Error in getResourceById:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

/**
 * @desc    Create new resource
 * @route   POST /api/resources
 * @access  Admin
 */
const createResource = async (req, res) => {
  try {
    const {
      title,
      description,
      type,
      subject,
      author,
      authorRole,
      content,
      fileUrl,
      videoUrl,
      thumbnail,
      duration,
      isPremium,
      tags
    } = req.body;

    // Validate required fields
    if (!title || !description || !type) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description and type'
      });
    }

    // Create resource
    const resource = await Resource.create({
      title,
      description,
      type,
      subject,
      author,
      authorRole,
      content,
      fileUrl,
      videoUrl,
      thumbnail,
      duration,
      isPremium,
      tags,
      createdBy: req.user._id
    });
    
    res.status(201).json({
      success: true,
      message: 'Resource created successfully',
      resource
    });
  } catch (error) {
    console.error('Error in createResource:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

/**
 * @desc    Update resource
 * @route   PUT /api/resources/:id
 * @access  Admin
 */
const updateResource = async (req, res) => {
  try {
    let resource = await Resource.findById(req.params.id);
    
    if (!resource) {
      return res.status(404).json({ 
        success: false, 
        message: 'Resource not found' 
      });
    }

    // Update resource
    resource = await Resource.findByIdAndUpdate(
      req.params.id, 
      { $set: req.body },
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      message: 'Resource updated successfully',
      resource
    });
  } catch (error) {
    console.error('Error in updateResource:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

/**
 * @desc    Delete resource
 * @route   DELETE /api/resources/:id
 * @access  Admin
 */
const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    
    if (!resource) {
      return res.status(404).json({ 
        success: false, 
        message: 'Resource not found' 
      });
    }

    // Soft delete by marking as inactive
    resource.isActive = false;
    await resource.save();
    
    res.json({
      success: true,
      message: 'Resource deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteResource:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

module.exports = {
  getResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource
}; 