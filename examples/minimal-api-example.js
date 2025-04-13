// Minimal example of using the Deep Research API
const fetch = require('node-fetch');

// Configuration
const API_URL = 'https://your-deployment-url.com/api/research/query';
const API_KEY = 'your-access-password';
const RESEARCH_QUERY = 'History of cars';

// Function to perform research
async function performResearch() {
  try {
    console.log(`Researching: "${RESEARCH_QUERY}"...`);
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({ query: RESEARCH_QUERY })
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('\n=== RESEARCH REPORT ===\n');
    console.log(result.report);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run the research
performResearch();

/*
To use this script:
1. Replace API_URL with your actual deployment URL
2. Replace API_KEY with your access password
3. Replace RESEARCH_QUERY with your research topic
4. Install node-fetch: npm install node-fetch
5. Run the script: node minimal-api-example.js
*/
