const Project = require('../models/Project');
const { analyzeCodeWithGemini } = require('../services/geminiService');

exports.uploadAndAnalyze = async (req, res) => {
  try {
    const { code, language, title } = req.body;

    if (!code) {
      return res.status(400).json({ message: 'Code is required' });
    }

    // Call Gemini Service
    const aiResult = await analyzeCodeWithGemini(code);

    // Save to Database
    const project = new Project({
      userId: req.user.id,
      title: title || 'Untitled Analysis',
      language: language || 'javascript',
      code,
      summary: aiResult.summary,
      analysis: {
        functions: aiResult.functions,
        dependencies: aiResult.dependencies,
        eli5Explanation: aiResult.eli5Explanation,
        complexity: aiResult.complexity,
        bugs: aiResult.bugs,
        quality: aiResult.quality,
        flowchart: aiResult.flowchart,
        optimizedCode: aiResult.optimizedCode
      }
    });

    await project.save();

    res.status(201).json(project);
  } catch (error) {
    console.error('Analysis Controller Error:', error.message);
    res.status(500).json({ message: error.message || 'Server error during analysis' });
  }
};

exports.getUserProjects = async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching projects' });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Validate user owns project
    if (project.userId.toString() !== req.user.id) {
       return res.status(401).json({ message: 'Not authorized' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching project' });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    if (project.userId.toString() !== req.user.id) {
       return res.status(401).json({ message: 'Not authorized' });
    }
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting project' });
  }
};
