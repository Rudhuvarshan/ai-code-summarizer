import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Plus, Code2, Clock, ChevronRight, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleDeleteProject = async (id, e) => {
    e.stopPropagation(); // prevent navigation
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    
    try {
      await api.delete("/code/project/" + id);
      setProjects(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      console.error("Failed to delete project", err);
      alert("Failed to delete project");
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const fetchProjects = async () => {
      try {
        const res = await api.get('/code/projects');
        setProjects(res.data);
      } catch (err) {
        console.error("Failed to fetch projects", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}</h1>
          <p className="text-gray-400">Manage your past analyses and start new ones.</p>
        </div>
        <Link 
          to="/analyze" 
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg shadow-emerald-500/20"
        >
          <Plus className="w-5 h-5" /> New Analysis
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(n => (
            <div key={n} className="h-48 glass rounded-xl animate-pulse bg-gray-800/50"></div>
          ))}
        </div>
      ) : projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={project._id} 
              onClick={() => navigate(`/analyze/${project._id}`)}
              className="glass p-6 rounded-xl hover:border-emerald-500/50 cursor-pointer transition-all group flex flex-col justify-between h-48"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-dark-800 rounded-lg text-emerald-400">
                    <Code2 className="w-6 h-6" />
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={(e) => handleDeleteProject(project._id, e)}
                      className="text-gray-500 hover:text-red-400 transition-colors p-1"
                      title="Delete Project"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-emerald-400 transition-colors" />
                  </div>
                </div>
                <h3 className="font-semibold text-lg line-clamp-1">
                  {project.title || 'Untitled Sandbox'}
                </h3>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>{new Date(project.createdAt).toLocaleDateString()}</span>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 glass rounded-2xl border-dashed border-2 border-gray-700">
          <Code2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-300 mb-2">No projects yet</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">You haven't analyzed any code yet. Click the button above to get started with your first code analysis.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
