import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BrainCircuit, Code, GitMerge, FileText, ChevronRight } from 'lucide-react';

const Landing = () => {
  return (
    <div className="flex flex-col items-center justify-center pt-20 pb-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl text-center"
      >
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
          Understand Code <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-lime-500">
            Summarizer for Legacy Software Systems
          </span>
        </h1>
        <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
          Upload your source code and instantly get intelligent summaries, file dependence graphs, and comprehensive code explanations.
        </p>

        <div className="flex gap-4 justify-center">
          <Link to="/auth?mode=register" className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-full font-semibold text-lg transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)]">
            Start Analyzing <ChevronRight className="w-5 h-5" />
          </Link>
          <a href="#features" className="flex items-center gap-2 bg-dark-800 hover:bg-dark-700 text-white px-8 py-3 rounded-full font-semibold text-lg transition-colors border border-gray-700">
            Learn More
          </a>
        </div>
      </motion.div>

      <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mt-32 px-4">
        {[
          { icon: BrainCircuit, title: 'AI Code Summary', desc: 'Get instantaneous plain-english explanations of complex functions.' },
          { icon: GitMerge, title: 'Dependency Graphs', desc: 'Visualize function call hierarchies and data flow using interactive D3 charts.' },
          { icon: FileText, title: 'Export Reports', desc: 'Download comprehensive PDF reports containing the summary and architecture diagrams.' }
        ].map((feat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2, duration: 0.5 }}
            viewport={{ once: true }}
          >
            <feat.icon className="w-12 h-12 text-lime-400 mb-6" />
            <h3 className="text-xl font-bold mb-3">{feat.title}</h3>
            <p className="text-gray-400 leading-relaxed">{feat.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Landing;
