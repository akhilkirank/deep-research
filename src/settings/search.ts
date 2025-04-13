/**
 * Search Settings
 * 
 * This file contains settings related to web search functionality.
 * Customize these settings to control how the search works.
 */

// Tavily Search Settings
export const tavilySearchSettings = {
  // Search depth: 'basic' (faster) or 'advanced' (more thorough)
  searchDepth: 'advanced',
  
  // Include an AI-generated answer summary with search results
  includeAnswer: true,
  
  // Maximum number of search results to return
  maxResults: 10,
  
  // Domains to include in search results (empty array = no restrictions)
  // Example: ['wikipedia.org', 'britannica.com', '.edu', '.gov']
  includeDomains: [],
  
  // Domains to exclude from search results
  // Example: ['pinterest.com', 'quora.com']
  excludeDomains: [],
  
  // Whether to include raw HTML content in the results
  includeRawContent: false,
  
  // Whether to include images in the results
  includeImages: false
};

// Search Provider Settings
export const searchProviderSettings = {
  // Default search provider to use
  defaultProvider: 'tavily',
  
  // Available search providers
  availableProviders: ['tavily', 'model'],
  
  // Maximum number of search iterations for research
  maxIterations: 2
};

// Topic-specific search settings
// You can define custom search settings for specific topics or domains
export const topicSpecificSearchSettings = {
  // Academic research settings
  academic: {
    searchDepth: 'advanced',
    maxResults: 15,
    includeDomains: ['scholar.google.com', '.edu', '.gov', 'arxiv.org', 'researchgate.net'],
    excludeDomains: ['pinterest.com', 'quora.com', 'reddit.com']
  },
  
  // News and current events settings
  news: {
    searchDepth: 'basic',
    maxResults: 10,
    includeDomains: ['.news', 'nytimes.com', 'bbc.com', 'reuters.com', 'apnews.com'],
    excludeDomains: []
  },
  
  // Technical documentation settings
  technical: {
    searchDepth: 'advanced',
    maxResults: 12,
    includeDomains: ['docs.', '.io', 'github.com', 'stackoverflow.com', 'developer.'],
    excludeDomains: []
  }
};
