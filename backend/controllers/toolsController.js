const AIService = require('../services/aiService');
const ToolHistory = require('../models/ToolHistory');

// Helper function to handle tool requests
const handleToolRequest = async (req, res, toolName) => {
  try {
    const { prompt, level, language } = req.body;

    if (!prompt) {
      return res.status(400).json({ 
        success: false, 
        message: 'Prompt is required' 
      });
    }

   

const aiResponse = await AIService.generateResponse(prompt, toolName, level, language);

    // Save to history
    await ToolHistory.create({
      userId: req.user._id,
      toolName,
      inputPrompt: prompt,
      outputResult: aiResponse,
    });

    // Increment usage
    req.user.usageCount += 1;
    await req.user.save();

    res.json({
      success: true,
      data: {
        result: aiResponse,
        toolName,
      },
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Code Explainer
// @route   POST /api/tools/code-explainer
const codeExplainer = (req, res) => handleToolRequest(req, res, 'code-explainer');

// @desc    SQL Generator
// @route   POST /api/tools/sql-generator
const sqlGenerator = (req, res) => handleToolRequest(req, res, 'sql-generator');

// @desc    Regex Generator
// @route   POST /api/tools/regex-generator
const regexGenerator = (req, res) => handleToolRequest(req, res, 'regex-generator');

// @desc    Code Reviewer
// @route   POST /api/tools/code-reviewer
const codeReviewer = (req, res) => handleToolRequest(req, res, 'code-reviewer');

// @desc    Interview Question Generator
// @route   POST /api/tools/interview
const interviewGenerator = (req, res) => handleToolRequest(req, res, 'interview');

// @desc    Get user's tool history
// @route   GET /api/tools/history
const getToolHistory = async (req, res) => {
  try {
    const history = await ToolHistory.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      data: history,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

module.exports = {
  codeExplainer,
  sqlGenerator,
  regexGenerator,
  codeReviewer,
  interviewGenerator,
  getToolHistory,
};