// Simple test script for the Deep Research API
const fetch = require('node-fetch');

// Configuration
const API_BASE_URL = 'http://localhost:3000/api/research';
const API_KEY = 'your-api-key'; // Replace with your actual API key

// Helper function to make API requests
async function callApi(endpoint, data) {
  console.log(`Calling ${endpoint} API...`);
  
  try {
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
      throw new Error(`API error (${response.status}): ${error.message}`);
    }
    
    const result = await response.json();
    console.log(`${endpoint} API call successful!`);
    return result;
  } catch (error) {
    console.error(`Error calling ${endpoint} API:`, error.message);
    throw error;
  }
}

// Test the start API
async function testStartApi() {
  const data = {
    topic: "Quantum computing applications in healthcare",
    language: "en-US",
    provider: "google"
  };
  
  console.log("Testing /start API with data:", data);
  const result = await callApi('start', data);
  console.log("Result:", JSON.stringify(result, null, 2));
  return result;
}

// Test the questions API
async function testQuestionsApi() {
  const data = {
    topic: "Quantum computing applications in healthcare",
    language: "en-US",
    provider: "google"
  };
  
  console.log("Testing /questions API with data:", data);
  const result = await callApi('questions', data);
  console.log("Result:", JSON.stringify(result, null, 2));
  return result;
}

// Test the search API
async function testSearchApi(queries) {
  const data = {
    queries: queries || [
      {
        query: "Latest quantum computing applications in healthcare",
        researchGoal: "Find the most recent applications of quantum computing in healthcare"
      }
    ],
    language: "en-US",
    provider: "google",
    searchProvider: "tavily"
  };
  
  console.log("Testing /search API with data:", data);
  const result = await callApi('search', data);
  console.log("Result:", JSON.stringify(result, null, 2));
  return result;
}

// Test the review API
async function testReviewApi(topic, learnings) {
  const data = {
    topic: topic || "Quantum computing applications in healthcare",
    learnings: learnings || [
      "Quantum computing is being used to simulate molecular structures for drug discovery",
      "IBM and Pfizer have partnered to use quantum computing for drug discovery"
    ],
    suggestion: "Focus more on patient diagnosis applications",
    language: "en-US",
    provider: "google"
  };
  
  console.log("Testing /review API with data:", data);
  const result = await callApi('review', data);
  console.log("Result:", JSON.stringify(result, null, 2));
  return result;
}

// Test the report API
async function testReportApi(topic, learnings) {
  const data = {
    topic: topic || "Quantum computing applications in healthcare",
    learnings: learnings || [
      "Quantum computing is being used to simulate molecular structures for drug discovery",
      "IBM and Pfizer have partnered to use quantum computing for drug discovery",
      "Quantum machine learning algorithms are being developed to analyze medical imaging data"
    ],
    language: "en-US",
    provider: "google"
  };
  
  console.log("Testing /report API with data:", data);
  const result = await callApi('report', data);
  console.log("Result:", JSON.stringify(result, null, 2));
  return result;
}

// Run all tests
async function runAllTests() {
  try {
    console.log("=== Starting API Tests ===");
    
    // Test start API
    const startResult = await testStartApi();
    
    // Test questions API
    await testQuestionsApi();
    
    // Test search API with queries from start API
    const searchResult = await testSearchApi(startResult.queries);
    
    // Extract learnings from search results
    const learnings = searchResult.results.map(result => result.learning);
    
    // Test review API with learnings from search API
    const reviewResult = await testReviewApi("Quantum computing applications in healthcare", learnings);
    
    // Test report API with all learnings
    await testReportApi("Quantum computing applications in healthcare", learnings);
    
    console.log("=== All API Tests Completed Successfully ===");
  } catch (error) {
    console.error("Test failed:", error.message);
  }
}

// Run a single test
async function runSingleTest() {
  try {
    await testStartApi();
  } catch (error) {
    console.error("Test failed:", error.message);
  }
}

// Uncomment one of these to run tests
// runAllTests();
// runSingleTest();

// Export functions for use in other scripts
module.exports = {
  testStartApi,
  testQuestionsApi,
  testSearchApi,
  testReviewApi,
  testReportApi,
  runAllTests
};
