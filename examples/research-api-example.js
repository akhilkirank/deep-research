/**
 * Deep Research API Example
 * 
 * This example demonstrates how to use the Deep Research API to generate
 * comprehensive research reports on any topic.
 */

// Import required modules
const fetch = require('node-fetch');

// API configuration
const API_URL = 'http://localhost:3000/api/research/query';
const API_KEY = '123'; // Replace with your actual API key

/**
 * Function to perform research using the Deep Research API
 * @param {string} query - The research topic or question
 * @param {Object} options - Additional options for the research
 * @returns {Promise<string>} - The research report
 */
async function performResearch(query, options = {}) {
  console.log(`Starting research on: "${query}"...`);
  
  // Prepare request body
  const requestBody = {
    query,
    language: options.language || 'en-US',
    provider: options.provider || 'google',
    model: options.model || 'gemini-1.5-pro',
    searchProvider: options.searchProvider || 'tavily',
    maxIterations: options.maxIterations || 2
  };
  
  try {
    // Make API request
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify(requestBody)
    });
    
    // Check if request was successful
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }
    
    // Parse response
    const data = await response.json();
    
    // Check if report is available
    if (!data.report) {
      throw new Error('No report returned from API');
    }
    
    console.log('Research completed successfully!');
    return data.report;
  } catch (error) {
    console.error('Error performing research:', error);
    throw error;
  }
}

/**
 * Main function to run the example
 */
async function main() {
  try {
    // Example 1: Basic research query
    const topic = 'History of artificial intelligence';
    const report = await performResearch(topic);
    
    // Print the report
    console.log('\n=== RESEARCH REPORT ===\n');
    console.log(report);
    
    // Example 2: Research with custom options
    // Uncomment to run this example
    /*
    const customTopic = 'Impact of climate change on agriculture';
    const customOptions = {
      language: 'en-US',
      provider: 'google',
      model: 'gemini-1.5-pro',
      searchProvider: 'tavily',
      maxIterations: 3
    };
    const customReport = await performResearch(customTopic, customOptions);
    console.log('\n=== CUSTOM RESEARCH REPORT ===\n');
    console.log(customReport);
    */
  } catch (error) {
    console.error('Example failed:', error);
  }
}

// Run the example
main().catch(console.error);
