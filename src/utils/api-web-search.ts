import { pick, shuffle } from "radash";
import { completePath } from "@/utils/url";
import {
  TAVILY_BASE_URL,
  FIRECRAWL_BASE_URL,
  EXA_BASE_URL,
  BOCHA_BASE_URL,
  SEARXNG_BASE_URL,
} from "@/constants/urls";
import { Source } from "@/types.d";

type TavilySearchOptions = {
  searchDepth?: "basic" | "advanced";
  topic?: "general" | "news" | "finance";
  days?: number;
  maxResults?: number;
  includeImages?: boolean;
  includeImageDescriptions?: boolean;
  includeAnswer?: boolean;
  includeRawContent?: boolean;
  includeDomains?: undefined | Array<string>;
  excludeDomains?: undefined | Array<string>;
  maxTokens?: undefined | number;
  timeRange?: "year" | "month" | "week" | "day" | "y" | "m" | "w" | "d";
  chunksPerSource?: undefined | number;
  timeout?: number;
  [key: string]: any;
};

type TavilySearchResult = {
  title: string;
  url: string;
  content: string;
  rawContent?: string;
  score: number;
  publishedDate: string;
};

interface FirecrawlSearchOptions {
  limit?: number;
  tbs?: string;
  filter?: string;
  lang?: string;
  country?: string;
  location?: string;
  origin?: string;
  timeout?: number;
  scrapeOptions?: { formats: ("markdown" | "html" | "rawHtml" | "text")[] };
}

interface FirecrawlDocument<T = unknown> {
  url?: string;
  markdown?: string;
  html?: string;
  rawHtml?: string;
  links?: string[];
  extract?: T;
  json?: T;
  screenshot?: string;
  compare?: {
    previousScrapeAt: string | null;
    changeStatus: "new" | "same" | "changed" | "removed";
    visibility: "visible" | "hidden";
  };
  // v1 search only
  title?: string;
  description?: string;
}

type ExaSearchOptions = {
  useAutoprompt?: boolean;
  type?: "keyword" | "neural" | "auto";
  category?:
    | "company"
    | "research paper"
    | "news"
    | "pdf"
    | "github"
    | "tweet"
    | "personal site"
    | "linkedin profile"
    | "financial report";
  numResults?: number;
  includeDomains?: string[];
  excludeDomains?: string[];
  startCrawlDate?: string;
  endCrawlDate?: string;
  startPublishedDate?: string;
  endPublishedDate?: string;
  includeText?: string[];
  excludeText?: string[];
  contents?: {
    text?:
      | boolean
      | {
          maxCharacters?: number;
          includeHtmlTags?: boolean;
        };
    highlights?: {
      numSentences?: number;
      highlightsPerUrl?: number;
      query?: string;
    };
  };
};

type BochaSearchOptions = {
  freshness?: "day" | "week" | "month" | "year" | "noLimit";
  count?: number;
  summary?: boolean;
};

type SearxngSearchOptions = {
  categories?: string[];
  engines?: string[];
  lang?: string;
  format?: string;
  autocomplete?: string;
  [key: string]: any;
};

type SearxngSearchResult = {
  url: string;
  title: string;
  content?: string;
  engine: string;
  parsed_url: string[];
  template: "default.html" | "videos.html" | "images.html";
  engines: string[];
  positions: number[];
  publishedDate?: Date | null;
  thumbnail?: null | string;
  is_onion?: boolean;
  score: number;
  category: string;
  length?: null | string;
  duration?: null | string;
  iframe_src?: string;
  source?: string;
  metadata?: string;
  resolution?: null | string;
  img_src?: string;
  thumbnail_src?: string;
  img_format?: "jpeg" | "Culture Snaxx" | "png";
};

export async function tavily(
  query: string, 
  options: TavilySearchOptions = {},
  apiKeys: Record<string, string> = {},
  apiProxies: Record<string, string> = {},
  mode: string = "local",
  accessPassword: string = "",
  searchMaxResult: number = 5
) {
  const tavilyApiKey = apiKeys.tavilyApiKey || process.env.TAVILY_API_KEY || "";
  const tavilyApiKeys = shuffle(tavilyApiKey.split(","));
  
  const response = await fetch(
    mode === "local"
      ? `${completePath(apiProxies.tavilyApiProxy || TAVILY_BASE_URL)}/search`
      : "/api/search/tavily/search",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          mode === "local" ? tavilyApiKeys[0] : accessPassword
        }`,
      },
      body: JSON.stringify({
        query,
        searchDepth: "basic",
        topic: "general",
        days: 3,
        maxResults: Number(searchMaxResult),
        includeImages: false,
        includeImageDescriptions: false,
        includeAnswer: false,
        includeRawContent: false,
        chunksPerSource: 3,
        ...options,
      }),
    }
  );
  
  const { results } = await response.json();
  return (results as TavilySearchResult[])
    .filter((item) => item.content && item.url)
    .map((result) => pick(result, ["title", "content", "url"])) as Source[];
}

export async function firecrawl(
  query: string,
  options: FirecrawlSearchOptions = {},
  apiKeys: Record<string, string> = {},
  apiProxies: Record<string, string> = {},
  mode: string = "local",
  accessPassword: string = "",
  language: string = "en-US",
  searchMaxResult: number = 5
) {
  const firecrawlApiKey = apiKeys.firecrawlApiKey || process.env.FIRECRAWL_API_KEY || "";
  const firecrawlApiKeys = shuffle(firecrawlApiKey.split(","));
  
  const languageMeta = language.split("-");
  const response = await fetch(
    mode === "local"
      ? `${completePath(
          apiProxies.firecrawlApiProxy || FIRECRAWL_BASE_URL,
          "/v1"
        )}/search`
      : "/api/search/firecrawl/v1/search",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          mode === "local" ? firecrawlApiKeys[0] : accessPassword
        }`,
      },
      body: JSON.stringify({
        query,
        lang: languageMeta[0].toLowerCase(),
        country: languageMeta[1].toLowerCase(),
        limit: searchMaxResult,
        origin: "api",
        scrapeOptions: {
          formats: ["markdown"],
        },
        timeout: 60000,
        ...options,
      }),
    }
  );
  
  const { documents = [] } = await response.json();
  return (documents as FirecrawlDocument[])
    .filter((item) => item.markdown && item.url)
    .map((document) => ({
      title: document.title || "",
      content: document.markdown || "",
      url: document.url || "",
    })) as Source[];
}

export async function exa(
  query: string,
  options: ExaSearchOptions = {},
  apiKeys: Record<string, string> = {},
  apiProxies: Record<string, string> = {},
  mode: string = "local",
  accessPassword: string = "",
  searchMaxResult: number = 5
) {
  const exaApiKey = apiKeys.exaApiKey || process.env.EXA_API_KEY || "";
  const exaApiKeys = shuffle(exaApiKey.split(","));
  
  const response = await fetch(
    mode === "local"
      ? `${completePath(apiProxies.exaApiProxy || EXA_BASE_URL)}/search`
      : "/api/search/exa/search",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          mode === "local" ? exaApiKeys[0] : accessPassword
        }`,
      },
      body: JSON.stringify({
        query,
        category: "research paper",
        contents: {
          text: true,
          numResults: Number(searchMaxResult) * 5,
          livecrawl: "auto",
        },
        ...options,
      }),
    }
  );
  
  const { results = [] } = await response.json();
  return results
    .filter((item: any) => item.text && item.url)
    .map((result: any) => ({
      title: result.title || "",
      content: result.text || "",
      url: result.url || "",
    })) as Source[];
}

export async function bocha(
  query: string,
  options: BochaSearchOptions = {},
  apiKeys: Record<string, string> = {},
  apiProxies: Record<string, string> = {},
  mode: string = "local",
  accessPassword: string = "",
  searchMaxResult: number = 5
) {
  const bochaApiKey = apiKeys.bochaApiKey || process.env.BOCHA_API_KEY || "";
  const bochaApiKeys = shuffle(bochaApiKey.split(","));
  
  const response = await fetch(
    mode === "local"
      ? `${completePath(apiProxies.bochaApiProxy || BOCHA_BASE_URL, "/v1")}/web-search`
      : "/api/search/bocha/v1/web-search",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          mode === "local" ? bochaApiKeys[0] : accessPassword
        }`,
      },
      body: JSON.stringify({
        query,
        freshness: "noLimit",
        summary: true,
        count: searchMaxResult,
        ...options,
      }),
    }
  );
  
  const { results = [] } = await response.json();
  return results
    .filter((item: any) => item.summary && item.url)
    .map((result: any) => ({
      title: result.title || "",
      content: result.summary || "",
      url: result.url || "",
    })) as Source[];
}

export async function searxng(
  query: string,
  options: SearxngSearchOptions = {},
  apiProxies: Record<string, string> = {},
  mode: string = "local",
  accessPassword: string = "",
  searchMaxResult: number = 5
) {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessPassword}`,
  };
  
  const params = {
    q: query,
    categories: ["general", "web"],
    engines: ["google", "bing", "duckduckgo", "brave", "arxiv"],
    lang: "auto",
    format: "json",
    autocomplete: "google",
    ...options,
  };
  
  const searchQuery = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    searchQuery.append(key, value.toString());
  }

  const response = await fetch(
    `${
      mode === "proxy"
        ? "/api/search/searxng/search"
        : `${completePath(apiProxies.searxngApiProxy || SEARXNG_BASE_URL)}/search`
    }?${searchQuery.toString()}`,
    mode === "proxy" ? { method: "POST", headers } : undefined
  );
  
  const { results = [] } = await response.json();
  return (results as SearxngSearchResult[])
    .filter(
      (item, idx) =>
        item.content &&
        item.url &&
        idx < searchMaxResult * 5 &&
        item.score >= 0.5
    )
    .map((result) => pick(result, ["title", "content", "url"])) as Source[];
}

// Function to perform a search using the specified provider
export async function performSearch(
  query: string,
  searchProvider: string,
  apiKeys: Record<string, string> = {},
  apiProxies: Record<string, string> = {},
  mode: string = "local",
  accessPassword: string = "",
  language: string = "en-US",
  searchMaxResult: number = 5
): Promise<Source[]> {
  try {
    switch (searchProvider) {
      case "tavily":
        return await tavily(
          query, 
          {}, 
          apiKeys, 
          apiProxies, 
          mode, 
          accessPassword, 
          searchMaxResult
        );
      case "firecrawl":
        return await firecrawl(
          query, 
          {}, 
          apiKeys, 
          apiProxies, 
          mode, 
          accessPassword, 
          language, 
          searchMaxResult
        );
      case "exa":
        return await exa(
          query, 
          {}, 
          apiKeys, 
          apiProxies, 
          mode, 
          accessPassword, 
          searchMaxResult
        );
      case "bocha":
        return await bocha(
          query, 
          {}, 
          apiKeys, 
          apiProxies, 
          mode, 
          accessPassword, 
          searchMaxResult
        );
      case "searxng":
        return await searxng(
          query, 
          {}, 
          apiProxies, 
          mode, 
          accessPassword, 
          searchMaxResult
        );
      default:
        throw new Error(`Unsupported search provider: ${searchProvider}`);
    }
  } catch (error) {
    console.error(`Error in ${searchProvider} search:`, error);
    throw error;
  }
}
