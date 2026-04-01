const express = require('express');
const router = express.Router();
const { analyzeCodeWithGemini } = require('../services/geminiService');
const auth = require('../middleware/authMiddleware');

// Endpoint specifically for just summarization without saving
router.post('/summarize', auth, async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ message: 'Code is required' });
    
    const result = await analyzeCodeWithGemini(code);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'AI processing failed' });
  }
});

module.exports = router;
