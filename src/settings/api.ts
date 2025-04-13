/**
 * API Settings
 * 
 * This file contains settings related to the API configuration.
 * Customize these settings to control how the API behaves.
 */

import { z } from 'zod';

// API Schema Settings
export const apiSchemaSettings = {
  // Schema for the query endpoint
  querySchema: z.object({
    // Required: The research topic or question
    query: z.string().min(1),
    
    // Optional: The language for the response
    language: z.string().default("en-US"),
    
    // Optional: The AI provider to use
    provider: z.string().default("google"),
    
    // Optional: The specific model to use
    model: z.string().optional(),
    
    // Optional: The search provider to use
    searchProvider: z.string().default("tavily"),
    
    // Optional: Maximum number of search iterations
    maxIterations: z.number().default(2),
    
    // Optional: The style of the report
    reportStyle: z.enum(["standard", "academic", "technical", "news"]).default("standard"),
    
    // Optional: Temperature for LLM generation
    temperature: z.number().optional(),
    
    // Optional: Maximum number of search results
    maxResults: z.number().optional(),
    
    // Optional: Whether to include sources in the report
    includeSources: z.boolean().default(true)
  })
};

// API Response Settings
export const apiResponseSettings = {
  // Whether to include metadata in the response
  includeMetadata: false,
  
  // Whether to include intermediate results in the response
  includeIntermediateResults: false,
  
  // Default response format
  defaultResponseFormat: 'markdown',
  
  // Available response formats
  availableResponseFormats: ['markdown', 'html', 'text']
};

// API Rate Limiting Settings
export const apiRateLimitSettings = {
  // Maximum number of requests per minute
  requestsPerMinute: 10,
  
  // Maximum number of requests per hour
  requestsPerHour: 100,
  
  // Maximum number of requests per day
  requestsPerDay: 1000,
  
  // Whether to enable rate limiting
  enableRateLimiting: true
};

// API Authentication Settings
export const apiAuthSettings = {
  // Whether to require authentication
  requireAuth: true,
  
  // Authentication methods
  authMethods: ['bearer', 'api-key'],
  
  // Default authentication method
  defaultAuthMethod: 'bearer'
};
