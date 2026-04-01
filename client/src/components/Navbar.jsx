import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Code2, LogOut, User, GitCompare } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 w-full z-50 glass border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <Code2 className="h-8 w-8 text-emerald-500 group-hover:text-emerald-400 transition-colors" />
              <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-lime-500">
                CodeAI
              </span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-300 hover:text-white px-3 py-2 rounded-md transition-colors font-medium">
                  Dashboard
                </Link>
                <Link to="/compare" className="flex items-center gap-1.5 text-gray-300 hover:text-white px-3 py-2 rounded-md transition-colors font-medium">
                  <GitCompare className="w-4 h-4" /> Compare
                </Link>
                <Link to="/analyze" className="bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-md font-medium transition-colors">
                  New Analysis
                </Link>
                <div className="flex items-center gap-4 ml-4 pl-4 border-l border-gray-700">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <User className="h-4 w-4" />
                    <span>{user.name}</span>
                  </div>
                  <button onClick={handleLogout} className="text-gray-400 hover:text-red-400 transition-colors" title="Logout">
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/auth" className="text-gray-300 hover:text-white px-3 py-2 rounded-md font-medium transition-colors">
                  Login
                </Link>
                <Link to="/auth?mode=register" className="bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-md font-medium transition-colors shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
