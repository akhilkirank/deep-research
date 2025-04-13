# Deep Research Settings

This directory contains configuration files for customizing the behavior of the Deep Research API. You can modify these settings to control how the search works, how the LLM generates content, and how the API behaves.

## Settings Files

### 1. `app.ts`

Contains general application settings:
- Application name and version
- Default language
- Logging settings
- Caching settings
- Environment settings
- API key configuration

### 2. `api.ts`

Contains API-specific settings:
- API schema definitions
- Response format settings
- Rate limiting settings
- Authentication settings

### 3. `llm.ts`

Contains settings for Language Models:
- Model configurations for different providers (Google, OpenAI, Anthropic)
- Generation parameters (temperature, token limits, etc.)
- Safety settings
- Topic-specific LLM settings

### 4. `search.ts`

Contains settings for web search functionality:
- Search provider configurations
- Search parameters (depth, result count, etc.)
- Domain inclusion/exclusion lists
- Topic-specific search settings

### 5. `prompts.ts`

Contains prompt templates for different types of research:
- Standard research report prompts
- Academic research prompts
- Technical documentation prompts
- News summary prompts
- Functions to select appropriate prompts based on topic

## How to Customize Settings

### Changing Search Behavior

To modify how the search works, edit `search.ts`:

```typescript
// Example: Changing search depth and result count
export const tavilySearchSettings = {
  searchDepth: 'basic',  // Change from 'advanced' to 'basic' for faster results
  maxResults: 15,        // Increase from 10 to 15 for more comprehensive results
  // ... other settings
};

// Example: Focusing on academic sources
export const tavilySearchSettings = {
  // ... other settings
  includeDomains: ['.edu', 'scholar.google.com', 'arxiv.org'],
  excludeDomains: ['pinterest.com', 'quora.com'],
};
```

### Customizing LLM Behavior

To modify how the LLM generates content, edit `llm.ts`:

```typescript
// Example: Adjusting generation parameters
export const geminiSettings = {
  // ... other settings
  generationConfig: {
    temperature: 0.3,       // Increase from 0.1 for more creative output
    maxOutputTokens: 10000, // Increase for longer reports
    // ... other parameters
  }
};

// Example: Changing the default model
export const geminiSettings = {
  defaultModel: 'gemini-1.5-flash', // Change from 'gemini-1.5-pro' for faster responses
  // ... other settings
};
```

### Customizing Prompts

To modify the instructions given to the LLM, edit `prompts.ts`:

```typescript
// Example: Adding a new section to the standard research prompt
export const standardResearchPrompt = {
  // ... other settings
  instructions: `INSTRUCTIONS:
  // ... existing instructions
  4. Create a detailed research report with the following sections:
     // ... existing sections
     - Ethical Considerations: Discuss ethical implications and concerns
     // ... other sections
  `
};

// Example: Creating a new prompt template
export const marketAnalysisPrompt = {
  systemPrompt: `You are a market analyst tasked with creating a comprehensive market analysis report.`,
  // ... other prompt components
};
```

### Adding New API Parameters

To add new parameters to the API, edit `api.ts`:

```typescript
// Example: Adding new parameters to the query schema
export const apiSchemaSettings = {
  querySchema: z.object({
    // ... existing parameters
    depth: z.enum(["basic", "standard", "deep"]).default("standard"),
    format: z.enum(["markdown", "html", "text"]).default("markdown"),
    // ... other parameters
  })
};
```

## Best Practices

1. **Keep Default Settings Reasonable**: When changing defaults, ensure they work well for most use cases.

2. **Document Your Changes**: Add comments explaining why you changed settings, especially if they're significantly different from the defaults.

3. **Test After Changes**: Always test the API after changing settings to ensure it still works as expected.

4. **Consider Performance Implications**: Some settings (like increasing search results or token limits) can impact performance and costs.

5. **Backup Before Major Changes**: Create a backup of the settings files before making major changes.

## Advanced Customization

For more advanced customization, you may need to modify the core implementation files:

- `src/app/api/research/query/route.ts`: The main API endpoint implementation
- `src/utils/api-research.ts`: Core research functionality
- `src/utils/api-web-search.ts`: Web search implementation

However, most customization needs can be addressed through the settings files without modifying the core code.
