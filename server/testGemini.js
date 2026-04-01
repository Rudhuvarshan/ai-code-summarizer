const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const analyzeTest = async () => {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const model = "gemini-2.5-flash";
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

  console.log("Testing Gemini API...");
  console.log("Model:", model);
  console.log("Endpoint:", endpoint.replace(GEMINI_API_KEY, "KEY_HIDDEN"));

  try {
    const response = await axios.post(
      endpoint,
      {
        contents: [{ parts: [{ text: "Hello, return the word 'success' in a JSON object: { 'result': 'success' }" }] }],
      },
      { headers: { 'Content-Type': 'application/json' } }
    );
    console.log("API Response Success!");
    console.log("Data:", JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error("API Error!");
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", JSON.stringify(error.response.data, null, 2));
    } else {
      console.error("Message:", error.message);
    }
  }
};

analyzeTest();
