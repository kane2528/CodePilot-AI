const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  codeExplainer,
  sqlGenerator,
  regexGenerator,
  codeReviewer,
  interviewGenerator,
  getToolHistory,
} = require('../controllers/toolsController');

// Define routes
router.post('/code-explainer', protect, codeExplainer);
router.post('/sql-generator', protect, sqlGenerator);
router.post('/regex-generator', protect, regexGenerator);
router.post('/code-reviewer', protect, codeReviewer);
router.post('/interview', protect, interviewGenerator);
router.get('/history', protect, getToolHistory);

console.log('✓ toolRoutes router created');

module.exports = router;