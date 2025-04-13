// Example API client for Deep Research API
const API_BASE_URL = 'http://localhost:3000/api/research';
const API_KEY = 'your-api-key';

// Helper function to make API requests
async function callApi(endpoint, data) {
  const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`API error: ${error.message}`);
  }
  
  return response.json();
}

// Example usage
async function runResearch(topic) {
  try {
    console.log(`Starting research on: ${topic}`);
    
    // Step 1: Start research and get search queries
    const startResult = await callApi('start', { topic });
    console.log('Generated search queries:', startResult.queries);
    
    // Step 2: Run search tasks
    const searchResult = await callApi('search', { 
      queries: startResult.queries,
      searchProvider: 'tavily',
      searchMaxResult: 3
    });
    console.log('Search results:', searchResult.results);
    
    // Extract learnings from search results
    const learnings = searchResult.results.map(result => result.learning);
    
    // Step 3: Review search results and get additional queries
    const reviewResult = await callApi('review', {
      topic,
      learnings,
      suggestion: 'Focus on recent developments'
    });
    console.log('Additional queries:', reviewResult.additionalQueries);
    
    // Step 4: Run additional searches if needed
    if (reviewResult.additionalQueries && reviewResult.additionalQueries.length > 0) {
      const additionalSearchResult = await callApi('search', {
        queries: reviewResult.additionalQueries,
        searchProvider: 'tavily',
        searchMaxResult: 3
      });
      
      // Add new learnings
      additionalSearchResult.results.forEach(result => {
        learnings.push(result.learning);
      });
    }
    
    // Step 5: Generate final report
    const reportResult = await callApi('report', {
      topic,
      learnings
    });
    
    console.log('Final Report:');
    console.log(reportResult.report);
    
    return reportResult.report;
  } catch (error) {
    console.error('Error running research:', error);
    throw error;
  }
}

// Run an example research
runResearch('Quantum computing applications in healthcare')
  .then(report => {
    console.log('Research completed successfully!');
  })
  .catch(error => {
    console.error('Research failed:', error);
  });
