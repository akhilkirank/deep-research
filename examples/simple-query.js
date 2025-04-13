// Simple example of using the Deep Research API with a single query
const fetch = require('node-fetch');

// Configuration
const API_URL = 'http://localhost:3000/api/research/query';
const API_KEY = 'your-api-key'; // Replace with your actual API key

// Function to perform research
async function performResearch(query) {
  console.log(`Starting research on: "${query}"`);
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        query: query,
        language: 'en-US',
        provider: 'google',
        searchProvider: 'tavily',
        maxIterations: 2
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`API error (${response.status}): ${error.message}`);
    }
    
    const result = await response.json();
    console.log('Research completed successfully!');
    
    // Print the report
    console.log('\n=== RESEARCH REPORT ===\n');
    console.log(result.report);
    console.log('\n=== END OF REPORT ===\n');
    
    // Print some metadata
    console.log('Research metadata:');
    console.log(`- Initial queries: ${result.metadata.initialQueries.length}`);
    console.log(`- Total learnings: ${result.metadata.learnings.length}`);
    console.log(`- Iterations performed: ${result.metadata.iterations}`);
    
    return result;
  } catch (error) {
    console.error('Error performing research:', error.message);
    throw error;
  }
}

// Example usage
const query = process.argv[2] || 'History of cars';
performResearch(query)
  .then(() => console.log('Done!'))
  .catch(error => console.error('Failed:', error));

/*
To use this script:
1. Install node-fetch: npm install node-fetch
2. Run the script: node simple-query.js "Your research topic"

For example:
node simple-query.js "History of electric vehicles"
*/
