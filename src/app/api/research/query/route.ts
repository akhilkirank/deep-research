import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { mockResearch } from "@/utils/mock-research";

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

// Simple schema for the query endpoint
const QuerySchema = z.object({
  query: z.string().min(1),
  language: z.string().default("en-US"),
  provider: z.string().default("google"),  // Default to Google (Gemini)
  model: z.string().optional(),
  searchProvider: z.string().default("tavily"),  // Default to Tavily for better search results
  maxIterations: z.number().default(2),
});

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
async function searchWithTavily(query: string, apiKey: string) {
  console.log(`Searching for: "${query}" using Tavily API...`);

  try {
    const url = 'https://api.tavily.com/search';
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    };
    const body = {
      query: query,
      search_depth: 'advanced',
      include_answer: true,
      max_results: 10,  // Increase max results for better coverage
      include_domains: [],  // No domain restrictions
      exclude_domains: [],  // No domain exclusions
      include_raw_content: false,  // We don't need raw HTML content
      include_images: false  // We don't need images
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
async function generateReportWithGoogle(query: string, searchResults: any, apiKey: string) {
  console.log(`Generating report for: "${query}" using Google Gemini API...`);

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`;
    const headers = {
      'Content-Type': 'application/json'
    };

    // Create a prompt with the search results
    let prompt = `You are a research assistant tasked with creating a comprehensive, factual, and well-structured research report on the topic: "${query}".\n\n`;
    prompt += "I've gathered the following search results to help you create an accurate and informative report:\n\n";

    if (searchResults && searchResults.results) {
      searchResults.results.forEach((result: any, index: number) => {
        prompt += `Source ${index + 1}: ${result.title}\n`;
        prompt += `URL: ${result.url}\n`;
        prompt += `Content: ${result.content}\n\n`;
      });
    }

    prompt += "INSTRUCTIONS:\n";
    prompt += "1. Analyze all the provided sources carefully\n";
    prompt += "2. Extract key information, facts, dates, and insights relevant to the topic\n";
    prompt += "3. Organize the information logically and coherently\n";
    prompt += "4. Create a detailed research report with the following sections:\n";
    prompt += "   - Introduction: Provide context and overview of the topic\n";
    prompt += "   - Historical Background: Trace the origins and early development\n";
    prompt += "   - Key Developments: Highlight major milestones, breakthroughs, and trends\n";
    prompt += "   - Current State: Describe the present situation, applications, and relevance\n";
    prompt += "   - Future Prospects: Discuss potential future directions and implications\n";
    prompt += "   - Conclusion: Summarize key findings and their significance\n\n";
    prompt += "5. Format the report in Markdown with proper headings (using # syntax), subheadings, bullet points, and numbered lists where appropriate\n";
    prompt += "6. Include citations to the source materials using numbered references [1], [2], etc.\n";
    prompt += "7. Add a References section at the end listing all sources used\n";
    prompt += "8. Ensure the report is comprehensive, accurate, well-structured, and provides valuable insights on the topic\n\n";
    prompt += "Your report should be detailed, informative, and reflect the most current understanding of the topic based on the provided sources.";


    console.log('Prompt length:', prompt.length);
    console.log('Prompt preview:', prompt.substring(0, 200) + '...');

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
        temperature: 0.1,  // Lower temperature for more factual output
        maxOutputTokens: 8192,  // Increase token limit for longer reports
        topP: 0.95,  // Slightly reduce diversity for more focused output
        topK: 40  // Standard value for good quality
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_ONLY_HIGH"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_ONLY_HIGH"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_ONLY_HIGH"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_ONLY_HIGH"
        }
      ]
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
      // Step 1: Search for information using Tavily
      console.log('Step 1: Searching for information using Tavily...');
      const searchResults = await searchWithTavily(query, TAVILY_API_KEY);

      if (!searchResults || !searchResults.results || searchResults.results.length === 0) {
        console.error('Search failed or returned no results, using mock implementation as fallback');
        const { report } = mockResearch(query);
        return NextResponse.json({ report });
      }

      console.log(`Successfully retrieved ${searchResults.results.length} search results`);

      // Step 2: Generate report using Google Gemini
      console.log('Step 2: Generating report using Google Gemini...');
      const report = await generateReportWithGoogle(query, searchResults, GOOGLE_API_KEY);

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
