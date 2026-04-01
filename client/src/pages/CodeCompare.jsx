import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import CodeEditor from '../components/CodeEditor';
import { GitCompare, Loader2, ChevronRight, Trophy, Star } from 'lucide-react';

const CodeCompare = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [codeA, setCodeA] = useState('// Paste Code A here...');
  const [codeB, setCodeB] = useState('// Paste Code B here...');
  const [language, setLanguage] = useState('javascript');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!user) {
    navigate('/auth');
    return null;
  }

  const languages = ['javascript', 'python', 'java', 'c', 'cpp', 'typescript', 'go', 'rust'];

  const handleCompare = async () => {
    if (!codeA.trim() || !codeB.trim()) {
      setError('Please provide both Code A and Code B.');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await api.post('/ai/compare', { codeA, codeB });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Comparison failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <GitCompare className="text-emerald-400" /> Code Comparison
          </h1>
          <p className="text-gray-400 mt-1">Paste two code snippets and AI will tell you which is better.</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-400">Language:</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-dark-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
          >
            {languages.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* EDITORS SPLIT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
            <h2 className="font-semibold text-emerald-300">Code A</h2>
          </div>
          <CodeEditor code={codeA} setCode={setCodeA} language={language} />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 bg-lime-500 rounded-full"></div>
            <h2 className="font-semibold text-lime-300">Code B</h2>
          </div>
          <CodeEditor code={codeB} setCode={setCodeB} language={language} />
        </div>
      </div>

      {/* COMPARE BUTTON */}
      <div className="flex justify-center mb-10">
        <button
          onClick={handleCompare}
          disabled={loading}
          className="flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-lime-500 hover:opacity-90 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
        >
          {loading ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Comparing...</>
          ) : (
            <><GitCompare className="w-5 h-5" /> Compare with AI</>
          )}
        </button>
      </div>

      {/* RESULTS */}
      {result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* WINNER */}
          <div className={`glass p-6 rounded-2xl border-2 ${result.betterCode === 'Code A' ? 'border-emerald-500/50' : result.betterCode === 'Code B' ? 'border-lime-500/50' : 'border-gray-600'}`}>
            <div className="flex items-center gap-3 mb-4">
              <Trophy className={`w-8 h-8 ${result.betterCode === 'Code A' ? 'text-emerald-400' : result.betterCode === 'Code B' ? 'text-lime-400' : 'text-gray-400'}`} />
              <div>
                <p className="text-sm text-gray-400 uppercase tracking-wider font-bold">Winner</p>
                <h2 className={`text-2xl font-black ${result.betterCode === 'Code A' ? 'text-emerald-300' : result.betterCode === 'Code B' ? 'text-lime-300' : 'text-gray-300'}`}>
                  {result.betterCode}
                </h2>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed bg-dark-800 p-4 rounded-lg border border-gray-700">
              <span className="font-medium text-white">Why?</span> {result.reason}
            </p>
          </div>

          {/* DIFFERENCES */}
          {result.differences && (
            <div className="glass p-6 rounded-2xl">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" /> Key Differences
              </h3>
              <p className="text-gray-300 leading-relaxed">{result.differences}</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default CodeCompare;
