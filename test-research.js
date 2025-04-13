// Simple script to test the research functionality directly
const GOOGLE_API_KEY = 'AIzaSyDbSREReKGEPlvkgfoYTzXFNxw3WNnVycM';
const TAVILY_API_KEY = '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';

// Function to make a POST request
function makePostRequest(url, headers, body) {
  return new Promise((resolve, reject) => {
    const https = require('https');
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

// Test Tavily API for search
async function searchWithTavily(query) {
  console.log(`\nSearching for: "${query}" using Tavily API...`);
  
  try {
    const url = 'https://api.tavily.com/search';
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TAVILY_API_KEY}`
    };
    const body = {
      query: query,
      search_depth: 'advanced',
      include_answer: true,
      max_results: 5
    };

    const response = await makePostRequest(url, headers, body);
    console.log('Response received from Tavily API');
    
    if (response.error) {
      console.log('Error:', response.error);
      return null;
    } else {
      console.log(`Found ${response.results ? response.results.length : 0} results`);
      console.log('Sample answer:', response.answer ? response.answer.substring(0, 100) + '...' : 'No answer');
      return response;
    }
  } catch (error) {
    console.log('Error searching with Tavily API:', error.message);
    return null;
  }
}

// Test Google API for generating a report
async function generateReportWithGoogle(query, searchResults) {
  console.log(`\nGenerating report for: "${query}" using Google Gemini API...`);
  
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${GOOGLE_API_KEY}`;
    const headers = {
      'Content-Type': 'application/json'
    };
    
    // Create a prompt with the search results
    let prompt = `You are a research assistant. Create a comprehensive research report on the topic: "${query}".\n\n`;
    prompt += "Here are some search results to help you:\n\n";
    
    if (searchResults && searchResults.results) {
      searchResults.results.forEach((result, index) => {
        prompt += `Source ${index + 1}: ${result.title}\n`;
        prompt += `URL: ${result.url}\n`;
        prompt += `Content: ${result.content}\n\n`;
      });
    }
    
    prompt += "Based on these sources, write a detailed, well-structured research report with the following sections:\n";
    prompt += "1. Introduction\n2. Historical Background\n3. Key Developments\n4. Current State\n5. Future Prospects\n6. Conclusion\n\n";
    prompt += "Format the report in Markdown with proper headings, subheadings, and citations.";
    
    const body = {
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 4096
      }
    };

    const response = await makePostRequest(url, headers, body);
    console.log('Response received from Google API');
    
    if (response.error) {
      console.log('Error:', response.error.message);
      return null;
    } else {
      const report = response.candidates[0].content.parts[0].text;
      console.log('Report generated:', report.substring(0, 100) + '...');
      return report;
    }
  } catch (error) {
    console.log('Error generating report with Google API:', error.message);
    return null;
  }
}

// Run the research process
async function runResearch(query) {
  console.log(`Starting research on: "${query}"`);
  
  // Step 1: Search for information
  const searchResults = await searchWithTavily(query);
  
  if (!searchResults) {
    console.log('Search failed, cannot generate report');
    return;
  }
  
  // Step 2: Generate report
  const report = await generateReportWithGoogle(query, searchResults);
  
  if (!report) {
    console.log('Report generation failed');
    return;
  }
  
  console.log('\nFinal Report:');
  console.log('=============');
  console.log(report);
}

// Run the research
const query = 'History of artificial intelligence';
runResearch(query).catch(console.error);
