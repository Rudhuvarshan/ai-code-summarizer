const axios = require('axios');

exports.compareCode = async (req, res) => {
  try {
    const { codeA, codeB } = req.body;

    if (!codeA || !codeB) {
      return res.status(400).json({ message: 'Both Code A and Code B are required for comparison' });
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    const prompt = `
You are an expert software engineer. I will provide you with two code snippets: Code A and Code B.
Please compare them based on performance, complexity, and readability.
Return a JSON object containing the exact following structure EXACTLY, with NO markdown blocks around it, just raw JSON:

{
  "differences": "A brief summary of the main logical approaches or algorithmic differences between the two codes.",
  "betterCode": "Code A" (or "Code B", or "Tie"),
  "reason": "Why the chosen code is better (efficiency, readability, complexity, etc)."
}

Here is Code A:
\n${codeA}\n

Here is Code B:
\n${codeB}\n
`;

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

    let text = response.data.candidates[0].content.parts[0].text;
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const comparisonResult = JSON.parse(text);

    res.status(200).json(comparisonResult);
  } catch (error) {
    console.error('Gemini Comparison Error:', error.response?.data || error.message);
    res.status(500).json({ message: error.message || 'Server error during comparison' });
  }
};
