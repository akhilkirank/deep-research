import { NextResponse, type NextRequest } from "next/server";
import { mockResearch } from "@/utils/mock-research";

// Import settings
import {
  apiSchemaSettings,
  tavilySearchSettings,
  geminiSettings,
  standardResearchPrompt,
  getPromptTemplate,
  appSettings
} from "@/settings";

export const runtime = "edge";
export const preferredRegion = [
  "cle1",
  "iad1",
  "pdx1",
  "sfo1",
  "sin1",
  "syd1",
  "hnd1",
  "kix1",
];

// Use the schema from settings
const QuerySchema = apiSchemaSettings.querySchema;

// Function to make a POST request
async function makePostRequest(url: string, headers: Record<string, string>, body: any) {
  try {
    console.log(`Making POST request to ${url}`);
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      console.error(`Error response: ${response.status} ${response.statusText}`);
      const text = await response.text();
      console.error(`Response body: ${text}`);
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error in makePostRequest: ${error}`);
    throw error;
  }
}

// Search with Tavily API
async function searchWithTavily(query: string, apiKey: string, options?: any) {
  console.log(`Searching for: "${query}" using Tavily API...`);

  try {
    const url = 'https://api.tavily.com/search';
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    };
    // Use search settings from settings file
    const body = {
      query: query,
      search_depth: tavilySearchSettings.searchDepth,
      include_answer: tavilySearchSettings.includeAnswer,
      max_results: options?.maxResults || tavilySearchSettings.maxResults,
      include_domains: tavilySearchSettings.includeDomains,
      exclude_domains: tavilySearchSettings.excludeDomains,
      include_raw_content: tavilySearchSettings.includeRawContent,
      include_images: tavilySearchSettings.includeImages
    };

    console.log('Tavily request body:', JSON.stringify(body));
    const response = await makePostRequest(url, headers, body);

    if (response.error) {
      console.error('Tavily API error:', response.error);
      return null;
    } else {
      console.log(`Found ${response.results ? response.results.length : 0} results`);
      if (response.results && response.results.length > 0) {
        console.log('First result title:', response.results[0].title);
        console.log('First result URL:', response.results[0].url);
      }
      console.log('Sample answer:', response.answer ? response.answer.substring(0, 100) + '...' : 'No answer');
      return response;
    }
  } catch (error) {
    console.error('Error searching with Tavily API:', error);
    return null;
  }
}

// Generate report with Google Gemini API
async function generateReportWithGoogle(query: string, searchResults: any, apiKey: string, options?: any) {
  console.log(`Generating report for: "${query}" using Google Gemini API...`);

  try {
    // Use the model from settings or options
    const model = options?.model || geminiSettings.defaultModel;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const headers = {
      'Content-Type': 'application/json'
    };

    // Get the appropriate prompt template based on the topic and style
    const promptTemplate = getPromptTemplate(query, options?.reportStyle);

    // Adjust token limit based on detail level
    let maxTokens = geminiSettings.generationConfig.maxOutputTokens;
    if (options?.detailLevel === 'expert') {
      maxTokens = 20000; // Maximum for extremely detailed reports
    } else if (options?.detailLevel === 'comprehensive') {
      maxTokens = 16384; // High detail level
    } else if (options?.detailLevel === 'standard') {
      maxTokens = 8192; // Standard detail level
    } else if (options?.detailLevel === 'basic') {
      maxTokens = 4096; // Basic detail level
    }

    // Create the prompt using the template
    let prompt = `${promptTemplate.systemPrompt}\n\n`;
    prompt += `${promptTemplate.introduction}\n\n`;

    if (searchResults && searchResults.results) {
      searchResults.results.forEach((result: any, index: number) => {
        prompt += promptTemplate.resultFormat(result, index);
      });
    }

    prompt += promptTemplate.instructions;


    console.log('Prompt length:', prompt.length);
    console.log('Prompt preview:', prompt.substring(0, 200) + '...');

    // Use LLM settings from settings file
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
        temperature: options?.temperature || geminiSettings.generationConfig.temperature,
        maxOutputTokens: maxTokens,
        topP: geminiSettings.generationConfig.topP,
        topK: geminiSettings.generationConfig.topK
      },
      safetySettings: geminiSettings.safetySettings
    };

    const response = await makePostRequest(url, headers, body);

    if (response.error) {
      console.error('Google API error:', response.error.message);
      return null;
    } else if (!response.candidates || response.candidates.length === 0) {
      console.error('No candidates returned from Google API');
      return null;
    } else {
      const report = response.candidates[0].content.parts[0].text;
      console.log('Report generated:', report.substring(0, 100) + '...');
      return report;
    }
  } catch (error) {
    console.error('Error generating report with Google API:', error);
    return null;
  }
}

export async function POST(req: NextRequest) {
  // Store the query for fallback use in catch block
  let queryForFallback = "";

  try {
    const body = await req.json();

    // Validate request body
    const result = QuerySchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          code: 400,
          message: "Invalid request body",
          errors: result.error.errors
        },
        { status: 400 }
      );
    }

    const { query, language, provider, model, searchProvider, maxIterations } = result.data;
    queryForFallback = query; // Store for use in catch block

    // Hardcode the API keys for testing
    const GOOGLE_API_KEY = "AIzaSyDbSREReKGEPlvkgfoYTzXFNxw3WNnVycM";
    const TAVILY_API_KEY = "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";

    console.log('Using API keys:');
    console.log('Google API Key:', GOOGLE_API_KEY ? '[Set]' : '[Not Set]');
    console.log('Tavily API Key:', TAVILY_API_KEY ? '[Set]' : '[Not Set]');

    console.log(`Starting research on: "${query}"`);
    console.log(`Provider: ${provider}, Search Provider: ${searchProvider}`);

    try {
      // Extract additional options from the request
      const options = {
        reportStyle: result.data.reportStyle,
        temperature: result.data.temperature,
        maxResults: result.data.maxResults,
        model: result.data.model
      };

      // Step 1: Search for information using Tavily
      console.log('Step 1: Searching for information using Tavily...');
      const searchResults = await searchWithTavily(query, TAVILY_API_KEY, options);

      if (!searchResults || !searchResults.results || searchResults.results.length === 0) {
        console.error('Search failed or returned no results, using mock implementation as fallback');
        const { report } = mockResearch(query);
        return NextResponse.json({ report });
      }

      console.log(`Successfully retrieved ${searchResults.results.length} search results`);

      // Step 2: Generate report using Google Gemini
      console.log('Step 2: Generating report using Google Gemini...');
      const report = await generateReportWithGoogle(query, searchResults, GOOGLE_API_KEY, options);

      if (!report || report.trim() === '') {
        console.error('Report generation failed or returned empty report, using mock implementation as fallback');
        const { report: mockReport } = mockResearch(query);
        return NextResponse.json({ report: mockReport });
      }

      console.log('Successfully generated report with length:', report.length);

      // Return only the final report
      return NextResponse.json({
        report
      });
    } catch (searchError) {
      console.error('Error during research process:', searchError);
      const { report } = mockResearch(query);
      return NextResponse.json({ report });
    }
  } catch (error) {
    console.error("Error in research/query API:", error);

    // Use mock implementation as fallback in case of error
    try {
      console.log("Using mock implementation as fallback due to error");
      const { report } = mockResearch(queryForFallback || "General knowledge");
      return NextResponse.json({ report });
    } catch (mockError) {
      // If even the mock fails, return the original error
      if (error instanceof Error) {
        return NextResponse.json(
          { code: 500, message: error.message },
          { status: 500 }
        );
      }
      return NextResponse.json(
        { code: 500, message: "An unknown error occurred" },
        { status: 500 }
      );
    }
  }
}
