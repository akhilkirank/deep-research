// Simple script to directly test the API keys with fetch
const https = require('https');

const GOOGLE_API_KEY = 'AIzaSyDbSREReKGEPlvkgfoYTzXFNxw3WNnVycM';
const TAVILY_API_KEY = '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';

console.log('Testing API keys with direct fetch...');
console.log('Google API Key:', GOOGLE_API_KEY ? '[Set]' : '[Not Set]');
console.log('Tavily API Key:', TAVILY_API_KEY ? '[Set]' : '[Not Set]');

// Function to make a POST request
function makePostRequest(url, headers, body) {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'POST',
      headers: headers
    };

    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        console.log(`Status Code: ${res.statusCode}`);
        try {
          const jsonData = JSON.parse(data);
          resolve(jsonData);
        } catch (e) {
          resolve(data);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(JSON.stringify(body));
    req.end();
  });
}

// Test Google API
async function testGoogleAPI() {
  console.log('\nTesting Google Generative AI API...');
  
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GOOGLE_API_KEY}`;
    const headers = {
      'Content-Type': 'application/json'
    };
    const body = {
      contents: [
        {
          parts: [
            {
              text: "Hello, can you give me a brief response to test the API?"
            }
          ]
        }
      ]
    };

    const response = await makePostRequest(url, headers, body);
    console.log('Response received from Google API');
    console.log('API working:', response.candidates ? 'Yes' : 'No');
    if (response.error) {
      console.log('Error:', response.error.message);
    } else {
      console.log('Sample response:', response.candidates ? response.candidates[0].content.parts[0].text.substring(0, 50) + '...' : 'No response');
    }
  } catch (error) {
    console.log('Error testing Google API:', error.message);
  }
}

// Test Tavily API
async function testTavilyAPI() {
  console.log('\nTesting Tavily API...');
  
  try {
    const url = 'https://api.tavily.com/search';
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TAVILY_API_KEY}`
    };
    const body = {
      query: 'What is artificial intelligence?',
      search_depth: 'basic',
      include_answer: true,
      max_results: 3
    };

    const response = await makePostRequest(url, headers, body);
    console.log('Response received from Tavily API');
    console.log('API working:', response.results ? 'Yes' : 'No');
    if (response.error) {
      console.log('Error:', response.error);
    } else {
      console.log('Sample response:', response.answer ? response.answer.substring(0, 50) + '...' : 'No answer');
    }
  } catch (error) {
    console.log('Error testing Tavily API:', error.message);
  }
}

// Run tests
async function main() {
  await testGoogleAPI();
  await testTavilyAPI();
  console.log('\nDone testing API keys.');
}

main().catch(console.error);
