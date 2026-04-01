const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    default: 'Untitled Analysis',
  },
  language: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
  },
  analysis: {
    type: Object, // Structured analysis from Gemini (functions, dependencies)
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Project', ProjectSchema);
