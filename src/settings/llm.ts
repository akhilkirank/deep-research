/**
 * LLM Settings
 *
 * This file contains settings related to the Language Model functionality.
 * Customize these settings to control how the LLM generates content.
 */

// Google Gemini Settings
export const geminiSettings = {
  // Default model to use
  defaultModel: 'gemini-2.0-flash-thinking-exp',

  // Available models
  availableModels: [
    'gemini-2.0-flash-thinking-exp',  // Recommended for thinking tasks
    'gemini-2.0-flash-exp',           // Recommended for networking tasks
  ],

  // Generation configuration
  generationConfig: {
    // Temperature controls randomness (0.0 = deterministic, 1.0 = creative)
    temperature: 0.2,

    // Maximum number of tokens to generate
    maxOutputTokens: 16384,

    // Top-p (nucleus sampling) parameter
    topP: 0.95,

    // Top-k sampling parameter
    topK: 40
  },

  // Safety settings
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

// OpenAI Settings (for future implementation)
export const openaiSettings = {
  defaultModel: 'gpt-4o',
  availableModels: [
    'gpt-4o',
    'gpt-4-turbo',
    'gpt-3.5-turbo'
  ],
  generationConfig: {
    temperature: 0.1,
    max_tokens: 4000,
    top_p: 0.95,
    frequency_penalty: 0,
    presence_penalty: 0
  }
};

// Anthropic Settings (for future implementation)
export const anthropicSettings = {
  defaultModel: 'claude-3-opus',
  availableModels: [
    'claude-3-opus',
    'claude-3-sonnet',
    'claude-3-haiku'
  ],
  generationConfig: {
    temperature: 0.1,
    max_tokens: 4000,
    top_p: 0.95,
    top_k: 40
  }
};

// LLM Provider Settings
export const llmProviderSettings = {
  // Default provider to use
  defaultProvider: 'google',

  // Available providers
  availableProviders: ['google', 'openai', 'anthropic']
};

// Topic-specific LLM settings
export const topicSpecificLLMSettings = {
  // Academic research settings
  academic: {
    temperature: 0.15,
    maxOutputTokens: 20000,
    topP: 0.92,
    topK: 30
  },

  // Creative writing settings
  creative: {
    temperature: 0.7,
    maxOutputTokens: 8192,
    topP: 0.98,
    topK: 50
  },

  // Technical documentation settings
  technical: {
    temperature: 0.1,
    maxOutputTokens: 8192,
    topP: 0.92,
    topK: 40
  }
};
