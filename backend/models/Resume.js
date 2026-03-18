const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: String,
  location: String,
  gender: String,
  linkedin: String,
  github: String,
  leetcode: String,
  photo: String, 
  summary: String,
  
  education: [{
    degree: String,
    institution: String,
    location: String,
    cgpa: String,
    startYear: String,
    endYear: String,
  }],
  experience: [{
    role: String,
    company: String,
    location: String,
    startDate: String,
    endDate: String,
    description: String,
  }],
  projects: [{
    title: String,
    description: String,
    techStack: String,
    features: String,
    githubLink: String,
    liveLink: String,
  }],
  skills: {
    languages: [String],
    frameworks: [String],
    tools: [String],
  },
  generatedResume: {
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

module.exports = mongoose.model('Resume', resumeSchema);