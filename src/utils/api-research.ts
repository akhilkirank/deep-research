import { z } from "zod";
import { shuffle } from "radash";
import { parsePartialJson } from "@ai-sdk/ui-utils";
import { streamText, smoothStream } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createDeepSeek } from "@ai-sdk/deepseek";
import { createXai } from "@ai-sdk/xai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { createOllama } from "ollama-ai-provider";
import {
  getSystemPrompt,
  getOutputGuidelinesPrompt,
  generateQuestionsPrompt,
  generateSerpQueriesPrompt,
  processResultPrompt,
  reviewSerpQueriesPrompt,
  writeFinalReportPrompt,
  getSERPQuerySchema,
} from "@/utils/deep-research";
import { completePath } from "@/utils/url";
import {
  GEMINI_BASE_URL,
  OPENROUTER_BASE_URL,
  OPENAI_BASE_URL,
  ANTHROPIC_BASE_URL,
  DEEPSEEK_BASE_URL,
  XAI_BASE_URL,
  OLLAMA_BASE_URL,
} from "@/constants/urls";

// Define types locally to avoid import issues
type Source = {
  title: string;
  url: string;
  content: string;
  sourceType?: string;
  id?: string;
  [key: string]: any; // Allow additional properties
};

type SearchTask = {
  query: string;
  researchGoal: string;
};

// Types for API requests and responses
export const ResearchStartSchema = z.object({
  topic: z.string().min(1),
  language: z.string().default("en-US"),
  provider: z.string().default("google"),
  model: z.string().optional(),
});

export const ResearchQuestionsSchema = z.object({
  topic: z.string().min(1),
  language: z.string().default("en-US"),
  provider: z.string().default("google"),
  model: z.string().optional(),
});

export const ResearchSearchSchema = z.object({
  queries: z.array(
    z.object({
      query: z.string(),
      researchGoal: z.string(),
    })
  ),
  language: z.string().default("en-US"),
  provider: z.string().default("google"),
  model: z.string().optional(),
  enableSearch: z.boolean().default(true),
  searchProvider: z.string().default("tavily"),
  parallelSearch: z.number().default(3),
  searchMaxResult: z.number().default(5),
});

export const ResearchReviewSchema = z.object({
  topic: z.string().min(1),
  learnings: z.array(z.string()),
  suggestion: z.string().default(""),
  language: z.string().default("en-US"),
  provider: z.string().default("google"),
  model: z.string().optional(),
});

export const ResearchReportSchema = z.object({
  topic: z.string().min(1),
  learnings: z.array(z.string()),
  language: z.string().default("en-US"),
  provider: z.string().default("google"),
  model: z.string().optional(),
});

// Helper function to create a provider based on the provider name and model
function createProvider(provider: string, model: string, options: any = {}, apiKeys: Record<string, string> = {}, apiProxies: Record<string, string> = {}, mode: string = "local", accessPassword: string = "", enableWebSearch: boolean = false) {
  const settings = { ...options };

  switch (provider) {
    case "google":
      const googleApiKey = apiKeys.apiKey || process.env.GOOGLE_GENERATIVE_AI_API_KEY || "";
      const googleApiKeys = shuffle(googleApiKey.split(","));
      const google = createGoogleGenerativeAI(
        mode === "local"
          ? {
              baseURL: completePath(apiProxies.apiProxy || GEMINI_BASE_URL, "/v1beta"),
              apiKey: googleApiKeys[0],
            }
          : {
              baseURL: "/api/ai/google/v1beta",
              apiKey: accessPassword,
            }
      );

      // Enable web search for Gemini if searchProvider is 'model'
      if (enableWebSearch) {
        return google(model, {
          ...settings,
          tools: [{
            googleSearchRetrieval: {}
          }]
        });
      }

      return google(model, settings);

    case "openai":
      const openAIApiKey = apiKeys.openAIApiKey || process.env.OPENAI_API_KEY || "";
      const openAIApiKeys = shuffle(openAIApiKey.split(","));
      const openai = createOpenAI(
        mode === "local"
          ? {
              baseURL: completePath(apiProxies.openAIApiProxy || OPENAI_BASE_URL, "/v1"),
              apiKey: openAIApiKeys[0],
            }
          : {
              baseURL: "/api/ai/openai/v1",
              apiKey: accessPassword,
            }
      );
      return model.startsWith("gpt-4o")
        ? openai.responses(model)
        : openai(model, settings);

    case "anthropic":
      const anthropicApiKey = apiKeys.anthropicApiKey || process.env.ANTHROPIC_API_KEY || "";
      const anthropicApiKeys = shuffle(anthropicApiKey.split(","));
      const anthropic = createAnthropic(
        mode === "local"
          ? {
              baseURL: completePath(apiProxies.anthropicApiProxy || ANTHROPIC_BASE_URL, "/v1"),
              apiKey: anthropicApiKeys[0],
            }
          : {
              baseURL: "/api/ai/anthropic/v1",
              apiKey: accessPassword,
            }
      );
      return anthropic(model, settings);

    case "deepseek":
      const deepseekApiKey = apiKeys.deepseekApiKey || process.env.DEEPSEEK_API_KEY || "";
      const deepseekApiKeys = shuffle(deepseekApiKey.split(","));
      const deepseek = createDeepSeek(
        mode === "local"
          ? {
              baseURL: completePath(apiProxies.deepseekApiProxy || DEEPSEEK_BASE_URL, "/v1"),
              apiKey: deepseekApiKeys[0],
            }
          : {
              baseURL: "/api/ai/deepseek/v1",
              apiKey: accessPassword,
            }
      );
      return deepseek(model, settings);

    case "xai":
      const xAIApiKey = apiKeys.xAIApiKey || process.env.XAI_API_KEY || "";
      const xAIApiKeys = shuffle(xAIApiKey.split(","));
      const xai = createXai(
        mode === "local"
          ? {
              baseURL: completePath(apiProxies.xAIApiProxy || XAI_BASE_URL, "/v1"),
              apiKey: xAIApiKeys[0],
            }
          : {
              baseURL: "/api/ai/xai/v1",
              apiKey: accessPassword,
            }
      );
      return xai(model, settings);

    case "openrouter":
      const openRouterApiKey = apiKeys.openRouterApiKey || process.env.OPENROUTER_API_KEY || "";
      const openRouterApiKeys = shuffle(openRouterApiKey.split(","));
      const openrouter = createOpenRouter(
        mode === "local"
          ? {
              baseURL: completePath(apiProxies.openRouterApiProxy || OPENROUTER_BASE_URL, "/api/v1"),
              apiKey: openRouterApiKeys[0],
            }
          : {
              baseURL: "/api/ai/openrouter/api/v1",
              apiKey: accessPassword,
            }
      );
      return openrouter(model, settings);

    case "openaicompatible":
      const openAICompatibleApiKey = apiKeys.openAICompatibleApiKey || process.env.OPENAI_COMPATIBLE_API_KEY || "";
      const openAICompatibleApiKeys = shuffle(openAICompatibleApiKey.split(","));
      const openaicompatible = createOpenAI(
        mode === "local"
          ? {
              baseURL: completePath(apiProxies.openAICompatibleApiProxy || OPENAI_BASE_URL, "/v1"),
              apiKey: openAICompatibleApiKeys[0],
            }
          : {
              baseURL: "/api/ai/openaicompatible/v1",
              apiKey: accessPassword
            }
      );
      return openaicompatible(model, settings);

    case "ollama":
      const headers: Record<string, string> = {};
      if (mode === "proxy")
        headers["Authorization"] = `Bearer ${accessPassword}`;
      const ollama = createOllama({
        baseURL:
          mode === "local"
            ? completePath(apiProxies.ollamaApiProxy || OLLAMA_BASE_URL, "/api")
            : "/api/ai/ollama/api",
        headers,
      });
      return ollama(model, settings);

    default:
      throw new Error("Unsupported Provider: " + provider);
  }
}

// Helper function to get the appropriate model based on the task
function getModel(provider: string, requestedModel?: string) {
  switch (provider) {
    case "google":
      return {
        thinkingModel: requestedModel || "gemini-2.0-flash-thinking-exp",
        networkingModel: requestedModel || "gemini-2.0-flash-exp",
        reportModel: requestedModel || "gemini-2.0-flash-thinking-exp",
      };
    case "openai":
      return {
        thinkingModel: requestedModel || "gpt-4o",
        networkingModel: requestedModel || "gpt-4o-mini",
        reportModel: requestedModel || "gpt-4o",
      };
    case "anthropic":
      return {
        thinkingModel: requestedModel || "claude-3-opus-20240229",
        networkingModel: requestedModel || "claude-3-sonnet-20240229",
        reportModel: requestedModel || "claude-3-opus-20240229",
      };
    case "deepseek":
      return {
        thinkingModel: requestedModel || "deepseek-reasoner",
        networkingModel: requestedModel || "deepseek-chat",
        reportModel: requestedModel || "deepseek-reasoner",
      };
    case "xai":
      return {
        thinkingModel: requestedModel || "grok-1",
        networkingModel: requestedModel || "grok-1",
        reportModel: requestedModel || "grok-1",
      };
    case "openrouter":
      return {
        thinkingModel: requestedModel || "anthropic/claude-3-opus",
        networkingModel: requestedModel || "anthropic/claude-3-sonnet",
        reportModel: requestedModel || "anthropic/claude-3-opus",
      };
    case "openaicompatible":
      return {
        thinkingModel: requestedModel || "gpt-4",
        networkingModel: requestedModel || "gpt-3.5-turbo",
        reportModel: requestedModel || "gpt-4",
      };
    case "ollama":
      return {
        thinkingModel: requestedModel || "llama3",
        networkingModel: requestedModel || "llama3",
        reportModel: requestedModel || "llama3",
      };
    default:
      throw new Error("Unsupported Provider: " + provider);
  }
}

// Helper function to get response language prompt
function getResponseLanguagePrompt(lang: string) {
  return `**Respond in ${lang}**`;
}

// Helper function to remove JSON markdown
function removeJsonMarkdown(text: string) {
  text = text.trim();
  if (text.startsWith("```json")) {
    text = text.slice(7);
  } else if (text.startsWith("json")) {
    text = text.slice(4);
  } else if (text.startsWith("```")) {
    text = text.slice(3);
  }
  if (text.endsWith("```")) {
    text = text.slice(0, -3);
  }
  return text.trim();
}

// Import the web search functions
import { performSearch } from "./api-web-search";

// Function to generate research questions
export async function generateQuestions(
  topic: string,
  language: string = "en-US",
  provider: string = "google",
  requestedModel?: string,
  apiKeys: Record<string, string> = {},
  apiProxies: Record<string, string> = {},
  mode: string = "local",
  accessPassword: string = ""
) {
  const { thinkingModel } = getModel(provider, requestedModel);

  try {
    const result = await streamText({
      model: createProvider(provider, thinkingModel, {}, apiKeys, apiProxies, mode, accessPassword, false),
      system: getSystemPrompt(),
      prompt: [
        generateQuestionsPrompt(topic),
        getResponseLanguagePrompt(language),
      ].join("\n\n"),
      experimental_transform: smoothStream({ delayInMs: 0 }),
    });

    let content = "";
    for await (const textPart of result.textStream) {
      content += textPart;
    }

    // Extract questions from the content
    const questions = content
      .split("\n")
      .filter(line => line.trim().startsWith("- ") || line.trim().startsWith("* ") || /^\d+\./.test(line.trim()))
      .map(line => line.replace(/^-\s*|^\*\s*|^\d+\.\s*/, "").trim())
      .filter(question => question.length > 0);

    return {
      questions: questions.length > 0 ? questions : [
        "What is the history of " + topic + "?",
        "What are the current trends in " + topic + "?",
        "Who are the key players in " + topic + "?",
        "What are the main challenges related to " + topic + "?",
        "How has " + topic + " evolved over time?"
      ]
    };
  } catch (error) {
    console.error("Error generating questions:", error);
    throw error;
  }
}

// Function to generate search queries
export async function generateSearchQueries(
  topic: string,
  language: string = "en-US",
  provider: string = "google",
  requestedModel?: string,
  apiKeys: Record<string, string> = {},
  apiProxies: Record<string, string> = {},
  mode: string = "local",
  accessPassword: string = ""
) {
  const { thinkingModel } = getModel(provider, requestedModel);

  try {
    const result = await streamText({
      model: createProvider(provider, thinkingModel, {}, apiKeys, apiProxies, mode, accessPassword, false),
      system: getSystemPrompt(),
      prompt: [
        generateSerpQueriesPrompt(topic),
        getResponseLanguagePrompt(language),
      ].join("\n\n"),
      experimental_transform: smoothStream({ delayInMs: 0 }),
    });

    const querySchema = getSERPQuerySchema();
    let content = "";
    let queries: SearchTask[] = [];

    for await (const textPart of result.textStream) {
      content += textPart;
      const data = parsePartialJson(removeJsonMarkdown(content));
      if (
        querySchema.safeParse(data.value) &&
        (data.state === "successful-parse" || data.state === "repaired-parse")
      ) {
        if (data.value && Array.isArray(data.value)) {
          queries = data.value as SearchTask[];
        }
      }
    }

    // If no valid queries were generated, create default ones
    if (queries.length === 0) {
      queries = [
        {
          query: "Latest research on " + topic,
          researchGoal: "Find the most recent studies and papers on " + topic,
        },
        {
          query: "History of " + topic,
          researchGoal: "Understand the historical context and evolution of " + topic,
        },
        {
          query: "Future trends in " + topic,
          researchGoal: "Identify emerging trends and future directions for " + topic,
        },
      ];
    }

    return { queries };
  } catch (error) {
    console.error("Error generating search queries:", error);
    throw error;
  }
}

// Function to run search tasks
export async function runSearchTasks(
  queries: SearchTask[],
  language: string = "en-US",
  provider: string = "google",
  requestedModel?: string,
  enableSearch: boolean = true,
  searchProvider: string = "tavily",
  searchMaxResult: number = 5,
  apiKeys: Record<string, string> = {},
  apiProxies: Record<string, string> = {},
  mode: string = "local",
  accessPassword: string = ""
) {
  const { networkingModel } = getModel(provider, requestedModel);
  const results = [];

  try {
    // Process each query
    for (const query of queries) {
      let sources: Source[] = [];

      // Perform web search if enabled
      if (enableSearch && searchProvider !== "model") {
        try {
          sources = await performSearch(
            query.query,
            searchProvider,
            apiKeys,
            apiProxies,
            mode,
            accessPassword,
            language,
            searchMaxResult
          );
        } catch (err) {
          console.error(`Search error with ${searchProvider}:`, err);
          // Continue with empty sources if search fails
        }
      }

      // Process the search results or generate content without search
      let prompt;
      if (sources.length > 0) {
        // Convert sources to a string format that can be included in the prompt
        const sourcesText = sources.map(source => {
          return `Source: ${source.title || 'Untitled'}
URL: ${source.url || 'No URL'}
Content: ${source.content || 'No content'}`;
        }).join('\n\n');

        prompt = [
          `Query: ${query.query}\nResearch Goal: ${query.researchGoal}\n\nSearch Results:\n${sourcesText}\n\nBased on these search results, provide a comprehensive summary of what you've learned about the topic.`,
          getResponseLanguagePrompt(language),
        ].join("\n\n");
      } else {
        prompt = [
          processResultPrompt(query.query, query.researchGoal),
          getResponseLanguagePrompt(language),
        ].join("\n\n");
      }

      // Get AI to process the results
      const searchResult = await streamText({
        model: createProvider(provider, networkingModel, {}, apiKeys, apiProxies, mode, accessPassword, searchProvider === "model"),
        system: getSystemPrompt(),
        prompt: prompt,
        experimental_transform: smoothStream({ delayInMs: 0 }),
      });

      let content = "";
      for await (const part of searchResult.textStream) {
        content += part;
      }

      results.push({
        query: query.query,
        learning: content,
        sources: sources
      });
    }

    return { results };
  } catch (error) {
    console.error("Error running search tasks:", error);
    throw error;
  }
}

// Function to review search results
export async function reviewSearchResults(
  topic: string,
  learnings: string[],
  suggestion: string = "",
  language: string = "en-US",
  provider: string = "google",
  requestedModel?: string,
  apiKeys: Record<string, string> = {},
  apiProxies: Record<string, string> = {},
  mode: string = "local",
  accessPassword: string = ""
) {
  const { thinkingModel } = getModel(provider, requestedModel);

  try {
    const result = await streamText({
      model: createProvider(provider, thinkingModel, {}, apiKeys, apiProxies, mode, accessPassword, false),
      system: getSystemPrompt(),
      prompt: [
        reviewSerpQueriesPrompt(topic, learnings, suggestion),
        getResponseLanguagePrompt(language),
      ].join("\n\n"),
      experimental_transform: smoothStream({ delayInMs: 0 }),
    });

    const querySchema = getSERPQuerySchema();
    let content = "";
    let additionalQueries: SearchTask[] = [];

    for await (const textPart of result.textStream) {
      content += textPart;
      const data = parsePartialJson(removeJsonMarkdown(content));
      if (
        querySchema.safeParse(data.value) &&
        (data.state === "successful-parse" || data.state === "repaired-parse")
      ) {
        if (data.value && Array.isArray(data.value)) {
          additionalQueries = data.value as SearchTask[];
        }
      }
    }

    return { additionalQueries };
  } catch (error) {
    console.error("Error reviewing search results:", error);
    throw error;
  }
}

// Function to write a final report
export async function writeFinalReport(
  topic: string,
  learnings: string[],
  language: string = "en-US",
  provider: string = "google",
  requestedModel?: string,
  apiKeys: Record<string, string> = {},
  apiProxies: Record<string, string> = {},
  mode: string = "local",
  accessPassword: string = "",
  requirement: string = ""
) {
  const { reportModel } = getModel(provider, requestedModel);

  try {
    const result = await streamText({
      model: createProvider(provider, reportModel, {}, apiKeys, apiProxies, mode, accessPassword, false),
      system: [getSystemPrompt(), getOutputGuidelinesPrompt()].join("\n\n"),
      prompt: [
        writeFinalReportPrompt(topic, learnings, requirement),
        getResponseLanguagePrompt(language),
      ].join("\n\n"),
      experimental_transform: smoothStream({ delayInMs: 0 }),
    });

    let report = "";
    for await (const textPart of result.textStream) {
      report += textPart;
    }

    return { report };
  } catch (error) {
    console.error("Error writing final report:", error);
    throw error;
  }
}
