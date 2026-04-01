import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const isRegisterParam = searchParams.get('mode') === 'register';
  
  const [isRegister, setIsRegister] = useState(isRegisterParam);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  
  const { login, register, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isRegister) {
        await register(formData.name, formData.email, formData.password);
      } else {
        await login(formData.email, formData.password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md glass p-8 rounded-2xl border border-gray-800 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-lime-500"></div>
        <h2 className="text-3xl font-bold mb-6 text-center">
          {isRegister ? 'Create an Account' : 'Welcome Back'}
        </h2>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
              <input 
                type="text" 
                required
                className="w-full bg-dark-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full bg-dark-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-primary-500 transition-colors"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
            <input 
              type="password" 
              required
              className="w-full bg-dark-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-primary-500 transition-colors"
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-lg font-semibold transition-colors mt-6"
          >
            {isRegister ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button 
            onClick={() => setIsRegister(!isRegister)} 
            className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
          >
            {isRegister ? 'Login' : 'Sign up'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
