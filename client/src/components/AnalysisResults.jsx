import React, { useState } from 'react';
import { Download, AlertCircle, ShieldCheck, Gauge, Bug, BookOpen, BrainCircuit, Activity, CheckCircle2, GitBranch, Lightbulb, Code } from 'lucide-react';
import DependencyGraph from './DependencyGraph';
import FlowChart from './FlowChart';
import html2pdf from 'html2pdf.js';

const AnalysisResults = ({ analysisData }) => {
  const [isEli5, setIsEli5] = useState(false);

  if (!analysisData) return null;

  const { title, summary, analysis } = analysisData;
  const { functions, dependencies, eli5Explanation, complexity, bugs, quality, flowchart, optimizedCode } = analysis || {};

  const handleExportPDF = async () => {
    const element = document.getElementById('report-content');
    if (!element) return;

    // Temporarily remove scroll + height constraints so ALL content is captured
    const prevMaxH = element.style.maxHeight;
    const prevOverflow = element.style.overflow;
    element.style.maxHeight = 'none';
    element.style.overflow = 'visible';

    // Small delay to allow re-render
    await new Promise(r => setTimeout(r, 300));

    const safeTitle = (title || 'Report').replace(/[^a-zA-Z0-9_\-]/g, '_');
    const opt = {
      margin: [10, 10, 10, 10],
      filename: safeTitle + '_Analysis.pdf',
      image: { type: 'jpeg', quality: 0.95 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        scrollX: 0,
        scrollY: 0,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
        logging: false,
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
      await html2pdf().set(opt).from(element).save();
    } finally {
      // Restore original styles
      element.style.maxHeight = prevMaxH;
      element.style.overflow = prevOverflow;
    }
  };

  const scoreColor = quality?.score > 80 ? 'text-green-400' : quality?.score > 60 ? 'text-yellow-400' : 'text-red-400';

  return (
    <div className="flex flex-col h-full bg-dark-900 border border-gray-800 rounded-xl overflow-hidden shadow-xl">
      <div className="flex justify-between items-center p-4 border-b border-gray-800 bg-dark-800/80">
        <h2 className="font-bold text-lg text-white flex items-center gap-2">
          <BrainCircuit className="text-emerald-400" /> AI Report
        </h2>
        <button 
          onClick={handleExportPDF}
          className="flex items-center gap-2 bg-dark-700 hover:bg-emerald-600 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
        >
          <Download className="w-4 h-4" /> Export PDF
        </button>
      </div>

      <div className="p-6 overflow-y-auto w-full custom-scrollbar" id="report-content" style={{ maxHeight: '750px' }}>
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-2xl font-bold text-emerald-400">{title}</h1>
          
          {quality && (
             <div className="flex items-center gap-4 bg-dark-800 p-3 rounded-xl border border-gray-700">
               <div className="text-center">
                 <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Quality Score</p>
                 <div className={`text-2xl font-black ${scoreColor}`}>{quality.score}<span className="text-sm text-gray-600">/100</span></div>
               </div>
               <div className="h-10 w-px bg-gray-700"></div>
               <div>
                  <div className="flex items-center gap-1">
                    {quality.score > 80 ? <ShieldCheck className="w-4 h-4 text-green-400" /> : <AlertCircle className="w-4 h-4 text-yellow-400" />}
                    <span className="font-medium text-gray-200">{quality.level}</span>
                  </div>
                  <p className="text-xs text-gray-400 max-w-[150px] truncate" title={quality.feedback}>{quality.feedback}</p>
               </div>
             </div>
          )}
        </div>

        {/* SUMMARY SECTION */}
        <div className="mb-8">
          <div className="flex justify-between items-ends mb-3 border-b border-gray-700 pb-2">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-lime-400" /> Code Summary
            </h3>
            
            {eli5Explanation && (
              <div className="flex bg-dark-800 rounded-lg p-1">
                <button 
                  onClick={() => setIsEli5(false)} 
                  className={`text-xs px-3 py-1 rounded-md transition-all ${!isEli5 ? 'bg-emerald-500 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  Technical
                </button>
                <button 
                  onClick={() => setIsEli5(true)} 
                  className={`text-xs px-3 py-1 rounded-md transition-all ${isEli5 ? 'bg-lime-500 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  Explain Simply (ELI5)
                </button>
              </div>
            )}
          </div>
          
          <div className="text-gray-300 leading-relaxed bg-dark-800 p-5 rounded-lg border-l-4 border-emerald-500">
            {isEli5 ? eli5Explanation : summary}
          </div>
        </div>

        {/* COMPLEXITY METRICS */}
        {complexity && (
          <div className="mb-8">
             <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2 flex items-center gap-2">
               <Activity className="w-5 h-5 text-emerald-400" /> Complexity Analysis
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-dark-800 p-4 rounded-xl border border-gray-700 flex flex-col justify-center items-center">
                  <span className="text-xs text-gray-500 font-bold uppercase mb-1">Time Complexity</span>
                  <span className="text-2xl font-mono text-emerald-400 font-bold">{complexity.timeComplexity}</span>
                </div>
                <div className="bg-dark-800 p-4 rounded-xl border border-gray-700 flex flex-col justify-center items-center">
                  <span className="text-xs text-gray-500 font-bold uppercase mb-1">Space Complexity</span>
                  <span className="text-2xl font-mono text-lime-400 font-bold">{complexity.spaceComplexity}</span>
                </div>
                <div className="bg-dark-800 p-4 rounded-xl border border-gray-700 flex flex-col justify-center">
                  <span className="text-xs text-gray-500 font-bold uppercase mb-1">Bottleneck / Reason</span>
                  <span className="text-sm text-gray-300">{complexity.reason}</span>
                </div>
             </div>
          </div>
        )}

        {/* AI BUG DETECTOR */}
        {bugs && bugs.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2 flex items-center gap-2">
              <Bug className="w-5 h-5 text-red-500" /> AI Issue Detector
            </h3>
            <div className="space-y-3">
              {bugs.map((bug, idx) => (
                <div key={idx} className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg flex gap-4 items-start">
                  <div className="bg-red-500/20 text-red-400 px-2 py-1 rounded font-mono text-xs font-bold whitespace-nowrap">
                    Line {bug.line || '?'}
                  </div>
                  <div>
                    <h4 className="text-red-300 font-medium">{bug.issue}</h4>
                    <p className="text-gray-400 text-sm mt-1"><span className="text-green-400 font-medium">Fix:</span> {bug.fix}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {bugs && bugs.length === 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" /> AI Issue Detector
            </h3>
            <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-lg flex items-center gap-3">
              <p className="text-green-400 font-medium">No pressing bugs or logic errors detected in this scan.</p>
            </div>
          </div>
        )}

        {/* FUNCTIONS */}
        {functions && functions.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Functions Analyzed</h3>
            <div className="space-y-3">
              {functions.map((fn, idx) => (
                <div key={idx} className="bg-dark-800 p-4 rounded-lg border border-gray-700/50">
                  <span className="font-mono text-lime-400 font-bold mb-1 block">{fn.name}()</span>
                  <p className="text-gray-400 text-sm">{fn.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FLOWCHART */}
        {flowchart && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2 flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-teal-400" /> Code Execution Flowchart
            </h3>
            <FlowChart chart={flowchart} />
          </div>
        )}

        {/* OPTIMIZED CODE */}
        {optimizedCode && optimizedCode.code && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-400" /> Optimized Code Suggestion
            </h3>
            {optimizedCode.improvements && optimizedCode.improvements.length > 0 && (
              <div className="mb-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                <p className="text-yellow-300 font-medium mb-2 text-sm">Improvements made:</p>
                <ul className="space-y-1">
                  {optimizedCode.improvements.map((imp, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                      <span className="text-yellow-400 mt-0.5">✓</span> {imp}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="relative">
              <div className="absolute top-3 right-3 flex items-center gap-1 text-xs text-gray-500">
                <Code className="w-3 h-3" /> Optimized
              </div>
              <pre className="bg-dark-900 border border-gray-700 rounded-xl p-5 overflow-x-auto text-sm text-gray-300 font-mono leading-relaxed">
                <code>{optimizedCode.code}</code>
              </pre>
            </div>
          </div>
        )}

        {/* INTERACTIVE GRAPH */}
        {dependencies && dependencies.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2 flex items-center gap-2">
              <Gauge className="w-5 h-5 text-green-400" /> Dependency Graph
            </h3>
            <p className="text-sm text-gray-500 mb-4">Interactive diagram showing function calls and structure.</p>
            <div className="pdf-avoid-break">
               <DependencyGraph dependencies={dependencies} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisResults;
