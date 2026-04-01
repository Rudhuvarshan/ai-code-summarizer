import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CodeEditor from '../components/CodeEditor';
import AnalysisResults from '../components/AnalysisResults';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Play, Loader2, Save } from 'lucide-react';

const CodeAnalyzer = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [code, setCode] = useState('// Paste your code here\n\nfunction example() {\n  return "Hello World";\n}');
  const [title, setTitle] = useState('Untitled Analysis');
  const [language, setLanguage] = useState('javascript');
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const [error, setError] = useState('');

  // Fetch project data if it's an existing project
  useEffect(() => {
    if (projectId) {
      const fetchProject = async () => {
        try {
          const res = await api.get(`/code/project/${projectId}`);
          setCode(res.data.code);
          setTitle(res.data.title);
          setLanguage(res.data.language);
          setAnalysisData({
            title: res.data.title,
            summary: res.data.summary,
            analysis: res.data.analysis
          });
        } catch (err) {
          setError('Failed to load project.');
        }
      };
      fetchProject();
    }
  }, [projectId]);

  const handleAnalyze = async () => {
    if (!code.trim()) {
      setError('Please entering some code before analyzing.');
      return;
    }

    setIsAnalyzing(true);
    setError('');

    try {
      const res = await api.post('/code/analyze', {
        title,
        code,
        language
      });
      
      setAnalysisData({
        title: res.data.title,
        summary: res.data.summary,
        analysis: res.data.analysis
      });

      // Update URL with newly created project ID without reloading
      if (!projectId) {
        navigate(`/analyze/${res.data._id}`, { replace: true });
      }

    } catch (err) {
      setError(err.response?.data?.message || 'Error occurred during analysis.');
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center p-12 text-center text-xl text-gray-400 h-full">
        Please log in to analyze code.
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col lg:flex-row h-[calc(100vh-64px)] overflow-hidden">
      {/* LEFT PANEL: Editor */}
      <div className="w-full lg:w-1/2 flex flex-col p-4 border-r border-gray-800">
        <div className="flex items-center gap-4 mb-4">
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-transparent text-xl font-bold border-b border-transparent hover:border-gray-700 focus:border-emerald-500 focus:outline-none transition-colors px-1 py-1 flex-grow"
            placeholder="Analysis Title..."
          />
          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-dark-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 text-gray-300"
          >
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>
          <button 
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-700 disabled:opacity-75 disabled:cursor-not-allowed px-5 py-2 rounded-lg text-white font-medium transition-colors shadow-lg shadow-emerald-500/20"
          >
            {isAnalyzing ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing...</>
            ) : (
              <><Play className="w-4 h-4 fill-white text-white" /> Analyze Code</>
            )}
          </button>
        </div>
        
        {error && (
          <div className="mb-4 bg-red-900/30 border border-red-500/50 text-red-200 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="flex-grow">
          <CodeEditor 
            code={code} 
            setCode={setCode} 
            language={language}
            readOnly={isAnalyzing}
          />
        </div>
      </div>

      {/* RIGHT PANEL: Results */}
      <div className="w-full lg:w-1/2 bg-dark-900 p-4 h-full overflow-hidden">
        {isAnalyzing ? (
          <div className="flex flex-col items-center justify-center h-full space-y-6 text-gray-400">
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="relative w-24 h-24 flex items-center justify-center p-4 bg-emerald-500/10 rounded-full"
            >
               <Loader2 className="w-16 h-16 text-emerald-500" />
            </motion.div>
            <div className="space-y-2 text-center">
              <h3 className="text-xl font-bold text-white tracking-wide">AI is analyzing your code</h3>
              <p className="text-sm">Mapping dependencies, extracting functions, and generating summaries...</p>
            </div>
          </div>
        ) : analysisData ? (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="h-full"
          >
            <AnalysisResults analysisData={analysisData} />
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4 border border-dashed border-gray-800 rounded-xl m-2 bg-dark-800/50">
            <div className="p-4 bg-dark-800 rounded-full shadow-inner">
              <Play className="w-12 h-12 text-gray-600 opacity-50 ml-1" />
            </div>
            <p className="text-lg">Click <span className="text-emerald-400 font-medium">Analyze Code</span> to generate insights</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeAnalyzer;
