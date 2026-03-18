const mongoose = require('mongoose');

const toolHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  toolName: {
    type: String,
    enum: ['code-explainer', 'sql-generator', 'regex-generator', 'code-reviewer', 'interview', 'resume-builder'],
    required: true,
  },
  inputPrompt: {
    type: String,
    required: true,
  },
  outputResult: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Index for faster queries
toolHistorySchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('ToolHistory', toolHistorySchema);