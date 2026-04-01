const axios = require('axios');

exports.analyzeCodeWithGemini = async (code) => {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  const prompt = `
You are an expert code analyst. I will provide you with a block of code. Analyze it and return a JSON object with the following structure EXACTLY. Return ONLY raw JSON with NO markdown code blocks:

{
  "summary": "A comprehensive technical summary of what the code does.",
  "eli5Explanation": "Explain the code in very simple terms like explaining to a beginner.",
  "functions": [
    { "name": "functionName", "description": "What this function does" }
  ],
  "dependencies": [
    { "source": "callerFunction", "target": "calleeFunction", "type": "function_call" }
  ],
  "complexity": {
    "timeComplexity": "O(n^2)",
    "spaceComplexity": "O(n)",
    "reason": "Nested loops detected"
  },
  "bugs": [
    { "issue": "Unused variable x", "line": 14, "fix": "Remove the variable or use it." }
  ],
  "quality": {
    "score": 78,
    "level": "Good",
    "feedback": "Improve variable naming and reduce nested loops"
  },
  "flowchart": {
    "nodes": [
      { "id": "A", "label": "Start", "type": "start" },
      { "id": "B", "label": "Read Input", "type": "process" },
      { "id": "C", "label": "Check Condition", "type": "decision" },
      { "id": "D", "label": "Process Data", "type": "process" },
      { "id": "E", "label": "End", "type": "end" }
    ],
    "edges": [
      { "from": "A", "to": "B" },
      { "from": "B", "to": "C" },
      { "from": "C", "to": "D", "label": "Yes" },
      { "from": "D", "to": "E" }
    ]
  },
  "optimizedCode": {
    "code": "// Optimized version of the original code here",
    "improvements": ["Improvement 1", "Improvement 2", "Improvement 3"]
  }
}

RULES:
- "flowchart.nodes": Array of steps. Each node has "id" (short alphanum like A,B,C), "label" (max 4 words, plain text only, NO quotes/colons/parens), and "type" (one of: start, end, process, decision, io).
- "flowchart.edges": Array of connections. "from" and "to" match node "id" values. Optional "label" (Yes/No/etc).
- "optimizedCode.code": Refactored, more efficient version in the same language.
- "optimizedCode.improvements": List of short strings describing what changed.
- Return empty arrays for dependencies, bugs, functions if none found.

Here is the code:
\n${code}`;

  try {
    const response = await axios.post(
      endpoint,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    // Parse the response
    let text = response.data.candidates[0].content.parts[0].text;
    
    // Clean markdown if Gemini accidentally included it
    text = text.replace(/```json/g, '').replace(/```/g, '').replace(/^```\w*/g, '').trim();
    
    try {
      return JSON.parse(text);
    } catch (parseError) {
      console.error('Gemini JSON Parse Error. Raw text:', text);
      throw new Error('AI returned an invalid response format. Please try again.');
    }
  } catch (error) {
    const status = error.response?.status;
    const data = error.response?.data?.[0]?.error || error.response?.data?.error || {};
    const message = data.message || error.message;

    console.error(`Gemini API Error [${status || 'No Status'}]:`, message);

    if (status === 429) {
      throw new Error('Gemini API quota exceeded. Please wait about 60 seconds and try again.');
    } else if (status === 401) {
      throw new Error('Invalid Gemini API key. Please verify the GEMINI_API_KEY in your .env file.');
    } else if (status === 404) {
      throw new Error(`Gemini model not found. Current model: ${process.env.GEMINI_MODEL || 'gemini-1.5-flash'}`);
    } else if (status === 400) {
      throw new Error(`Gemini API Bad Request: ${message}`);
    }

    throw new Error(message || 'Failed to analyze code with Gemini API');
  }
};
