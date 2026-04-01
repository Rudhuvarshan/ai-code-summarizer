const express = require('express');
const router = express.Router();
const { uploadAndAnalyze, getUserProjects, getProjectById, deleteProject } = require('../controllers/codeController');
const auth = require('../middleware/authMiddleware');

router.post('/analyze', auth, uploadAndAnalyze);
router.get('/projects', auth, getUserProjects);
router.get('/project/:id', auth, getProjectById);
router.delete('/project/:id', auth, deleteProject);

module.exports = router;
