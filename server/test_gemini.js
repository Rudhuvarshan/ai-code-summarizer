require('dotenv').config();
const axios = require('axios');

async function test() {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const endpoint = \`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=\${GEMINI_API_KEY}\`;

  const prompt = "Can you return a valid JSON object?";
  
  try {
    const response = await axios.post(
      \`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=\${GEMINI_API_KEY}\`,
      { contents: [{ parts: [{ text: prompt }] }] },
      { headers: { 'Content-Type': 'application/json' } }
    );
    console.log("SUCCESS:", response.data.candidates[0].content.parts[0].text);
  } catch (error) {
    console.error("ERROR:");
    if (error.response) {
       console.error(JSON.stringify(error.response.data, null, 2));
    } else {
       console.error(error.message);
    }
  }
}

test();
