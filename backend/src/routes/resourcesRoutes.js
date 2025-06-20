const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const { 
  getResources, 
  getResourceById, 
  createResource, 
  updateResource, 
  deleteResource 
} = require('../controllers/resourceController');

const router = express.Router();

// Public routes
router.get('/', getResources);
router.get('/:id', getResourceById);

// Protected admin routes
router.post('/', protect, admin, createResource);
router.put('/:id', protect, admin, updateResource);
router.delete('/:id', protect, admin, deleteResource);

module.exports = router; 