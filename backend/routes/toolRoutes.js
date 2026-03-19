const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { usageMiddleware } = require('../middleware/usageMiddleware');
const {
  codeExplainer,
  sqlGenerator,
  regexGenerator,
  codeReviewer,
  interviewGenerator,
  getToolHistory,
} = require('../controllers/toolsController');

// Define routes
router.post('/code-explainer', protect, usageMiddleware, codeExplainer);
router.post('/sql-generator', protect, usageMiddleware, sqlGenerator);
router.post('/regex-generator', protect, usageMiddleware, regexGenerator);
router.post('/code-reviewer', protect, usageMiddleware, codeReviewer);
router.post('/interview', protect, usageMiddleware, interviewGenerator);
router.get('/history', protect, getToolHistory);

console.log('✓ toolRoutes router created');

module.exports = router;