const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  generateResume,
  saveResume,
  getUserResumes,
  getResumeById,
  generatePDF,
} = require('../controllers/resumeController');

// Define routes
router.post('/generate', protect, generateResume);
router.post('/save', protect, saveResume);
router.get('/user', protect, getUserResumes);
router.get('/:id', protect, getResumeById);
router.post('/pdf', protect, generatePDF);

console.log('✓ resumeRoutes router created');

module.exports = router;