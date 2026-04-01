import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import CodeAnalyzer from './pages/CodeAnalyzer'
import CodeCompare from './pages/CodeCompare'

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-dark-900 text-white font-sans flex flex-col relative overflow-hidden">
          {/* Global Background Glows */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-lime-500/10 blur-[120px] rounded-full"></div>
          </div>
          
          <Navbar />
          <main className="flex-grow flex flex-col pt-16 z-10">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/analyze" element={<CodeAnalyzer />} />
              <Route path="/analyze/:projectId" element={<CodeAnalyzer />} />
              <Route path="/compare" element={<CodeCompare />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  )
}

export default App
