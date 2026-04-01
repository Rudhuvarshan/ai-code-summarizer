import React from 'react';
import Editor, { loader } from '@monaco-editor/react';

loader.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.43.0/min/vs' } });

const CodeEditor = ({ code, setCode, language, readOnly }) => {
  return (
    <div className="rounded-xl overflow-hidden border border-gray-700 bg-dark-800 shadow-lg" style={{ height: '600px' }}>
      <Editor
        height="100%"
        width="100%"
        language={language}
        theme="vs-dark"
        value={code}
        onChange={(val) => setCode(val)}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          padding: { top: 16 },
          readOnly,
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace"
        }}
        loading={
          <div className="h-full flex items-center justify-center text-gray-400">
            Loading Editor...
          </div>
        }
      />
    </div>
  );
};

export default CodeEditor;
