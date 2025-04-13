// Simple script to directly test the API keys
require('dotenv').config();
const fetch = require('node-fetch');

async function testGoogleAPI() {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  console.log('Testing Google Generative AI API...');
  console.log('API Key:', apiKey ? '[Set]' : '[Not Set]');
  
  if (!apiKey) {
    console.log('Warning: Google API Key is not set.');
    return;
  }
  
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: "Hello, can you give me a brief response to test the API?"
              }
            ]
          }
        ]
      })
    });
    
    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('API working:', data.candidates ? 'Yes' : 'No');
    if (data.error) {
      console.log('Error:', data.error.message);
    }
  } catch (error) {
    console.log('Error testing Google API:', error.message);
  }
}

async function testTavilyAPI() {
  const apiKey = process.env.TAVILY_API_KEY;
  console.log('\nTesting Tavily API...');
  console.log('API Key:', apiKey ? '[Set]' : '[Not Set]');
  
  if (!apiKey) {
    console.log('Warning: Tavily API Key is not set.');
    return;
  }
  
  try {
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        query: 'What is artificial intelligence?',
        search_depth: 'basic',
        include_answer: true,
        max_results: 3
      })
    });
    
    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('API working:', data.results ? 'Yes' : 'No');
    if (data.error) {
      console.log('Error:', data.error);
    }
  } catch (error) {
    console.log('Error testing Tavily API:', error.message);
  }
}

async function main() {
  await testGoogleAPI();
  await testTavilyAPI();
}

main().catch(console.error);
