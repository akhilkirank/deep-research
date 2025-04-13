# Deep Research API Documentation

This API allows you to programmatically access the Deep Research functionality to generate comprehensive, well-researched reports on any topic. The API uses Tavily for web search and Google Gemini for report generation.

## Authentication

All API endpoints require authentication. You can authenticate using one of the following methods:

1. **API Key**: Include your API key in the `Authorization` header as a Bearer token:

   ```
   Authorization: Bearer your-api-key
   ```

2. **Access Password**: If you're using the proxy mode, include your access password in the `Authorization` header:
   ```
   Authorization: Bearer your-access-password
   ```

## API Endpoints

### Research Query (Simplified API)

This endpoint provides a simplified API that handles the entire research process in a single request and returns a comprehensive research report. The API performs web searches using Tavily and generates a detailed report using Google Gemini.

**Endpoint**: `POST /api/research/query`

**Request Body**:

```json
{
  "query": "History of artificial intelligence",
  "language": "en-US",
  "provider": "google",
  "model": "gemini-1.5-pro",
  "searchProvider": "tavily",
  "maxIterations": 2
}
```

**Parameters**:

- `query` (required): The research topic or question
- `language` (optional): The language for the response (default: "en-US")
- `provider` (optional): The AI provider to use (default: "google" for Gemini)
- `model` (optional): The specific model to use (default: "gemini-1.5-pro")
- `searchProvider` (optional): The search provider to use (default: "tavily")
- `maxIterations` (optional): Maximum number of search iterations to perform (default: 2)

**Response**:

```json
{
  "report": "# History of Artificial Intelligence\n\n## Introduction\n\nArtificial intelligence (AI) has captivated human imagination for centuries...\n\n## Historical Background\n\nThe roots of AI can be traced back to antiquity, with myths and stories of artificial beings..."
}
```

**Report Format**:

The report is returned in Markdown format with the following sections:

1. Introduction
2. Historical Background
3. Key Developments
4. Current State
5. Future Prospects
6. Conclusion
7. References

### Start Research

Initiates a new research session and generates search queries based on a topic.

**Endpoint**: `POST /api/research/start`

**Request Body**:

```json
{
  "topic": "Quantum computing applications in healthcare",
  "language": "en-US",
  "provider": "google",
  "model": "gemini-1.5-pro"
}
```

**Parameters**:

- `topic` (required): The research topic
- `language` (optional): The language for the response (default: "en-US")
- `provider` (optional): The AI provider to use (default: "google")
- `model` (optional): The specific model to use (if not provided, a default model will be selected based on the provider)

**Response**:

```json
{
  "queries": [
    {
      "query": "Latest quantum computing applications in healthcare",
      "researchGoal": "Find the most recent applications of quantum computing in healthcare, focusing on clinical trials and real-world implementations."
    },
    {
      "query": "Quantum computing drug discovery healthcare",
      "researchGoal": "Explore how quantum computing is being used to accelerate drug discovery and development in the healthcare industry."
    }
  ]
}
```

### Generate Questions

Generates research questions for a given topic.

**Endpoint**: `POST /api/research/questions`

**Request Body**:

```json
{
  "topic": "Quantum computing applications in healthcare",
  "language": "en-US",
  "provider": "google",
  "model": "gemini-1.5-pro"
}
```

**Parameters**:

- `topic` (required): The research topic
- `language` (optional): The language for the response (default: "en-US")
- `provider` (optional): The AI provider to use (default: "google")
- `model` (optional): The specific model to use (if not provided, a default model will be selected based on the provider)

**Response**:

```json
{
  "questions": [
    "What are the current applications of quantum computing in healthcare?",
    "How is quantum computing being used in drug discovery?",
    "What are the challenges of implementing quantum computing in healthcare?"
  ]
}
```

### Run Search

Executes search tasks for the generated queries.

**Endpoint**: `POST /api/research/search`

**Request Body**:

```json
{
  "queries": [
    {
      "query": "Latest quantum computing applications in healthcare",
      "researchGoal": "Find the most recent applications of quantum computing in healthcare, focusing on clinical trials and real-world implementations."
    }
  ],
  "language": "en-US",
  "provider": "google",
  "model": "gemini-1.5-flash",
  "enableSearch": true,
  "searchProvider": "tavily",
  "parallelSearch": 3,
  "searchMaxResult": 5
}
```

**Parameters**:

- `queries` (required): Array of query objects, each containing:
  - `query`: The search query
  - `researchGoal`: The goal of the research for this query
- `language` (optional): The language for the response (default: "en-US")
- `provider` (optional): The AI provider to use (default: "google")
- `model` (optional): The specific model to use (if not provided, a default model will be selected based on the provider)
- `enableSearch` (optional): Whether to enable search (default: true)
- `searchProvider` (optional): The search provider to use (default: "tavily")
- `parallelSearch` (optional): The number of parallel search tasks (default: 3)
- `searchMaxResult` (optional): The maximum number of search results per query (default: 5)

**Response**:

```json
{
  "results": [
    {
      "query": "Latest quantum computing applications in healthcare",
      "learning": "Quantum computing is being used to simulate molecular structures for drug discovery, significantly reducing the time required for identifying potential drug candidates. Recent studies have shown a 100x speedup in certain computational chemistry tasks.",
      "sources": [
        {
          "title": "Quantum Computing in Healthcare: A Review",
          "url": "https://example.com/quantum-healthcare",
          "content": "Excerpt from the source..."
        }
      ]
    }
  ]
}
```

### Review Search Results

Reviews search results and generates follow-up queries.

**Endpoint**: `POST /api/research/review`

**Request Body**:

```json
{
  "topic": "Quantum computing applications in healthcare",
  "learnings": [
    "Quantum computing is being used to simulate molecular structures for drug discovery, significantly reducing the time required for identifying potential drug candidates.",
    "IBM and Pfizer have partnered to use quantum computing for drug discovery, focusing on early-stage drug discovery and development."
  ],
  "suggestion": "Focus more on patient diagnosis applications",
  "language": "en-US",
  "provider": "google",
  "model": "gemini-1.5-pro"
}
```

**Parameters**:

- `topic` (required): The research topic
- `learnings` (required): Array of learning statements from previous research
- `suggestion` (optional): User suggestion for research direction
- `language` (optional): The language for the response (default: "en-US")
- `provider` (optional): The AI provider to use (default: "google")
- `model` (optional): The specific model to use (if not provided, a default model will be selected based on the provider)

**Response**:

```json
{
  "additionalQueries": [
    {
      "query": "Quantum computing patient diagnosis healthcare",
      "researchGoal": "Investigate how quantum computing is being applied to improve patient diagnosis, including medical imaging analysis and pattern recognition in healthcare data."
    }
  ]
}
```

### Generate Final Report

Generates a final research report based on all findings.

**Endpoint**: `POST /api/research/report`

**Request Body**:

```json
{
  "topic": "Quantum computing applications in healthcare",
  "learnings": [
    "Quantum computing is being used to simulate molecular structures for drug discovery, significantly reducing the time required for identifying potential drug candidates.",
    "IBM and Pfizer have partnered to use quantum computing for drug discovery, focusing on early-stage drug discovery and development.",
    "Quantum machine learning algorithms are being developed to analyze medical imaging data with higher accuracy than traditional methods."
  ],
  "language": "en-US",
  "provider": "google",
  "model": "gemini-1.5-pro"
}
```

**Parameters**:

- `topic` (required): The research topic
- `learnings` (required): Array of learning statements from all research
- `language` (optional): The language for the response (default: "en-US")
- `provider` (optional): The AI provider to use (default: "google")
- `model` (optional): The specific model to use (if not provided, a default model will be selected based on the provider)

**Response**:

```json
{
  "report": "# Quantum Computing Applications in Healthcare\n\n## Introduction\n\nQuantum computing represents a paradigm shift in computational capabilities, offering unprecedented processing power for complex problems. In healthcare, this technology is beginning to transform various domains, from drug discovery to patient diagnosis.\n\n## Key Findings\n\n### Drug Discovery and Development\n\n- Quantum computing is being used to simulate molecular structures for drug discovery, significantly reducing the time required for identifying potential drug candidates.\n- IBM and Pfizer have partnered to use quantum computing for drug discovery, focusing on early-stage drug discovery and development.\n\n### Medical Imaging and Diagnosis\n\n- Quantum machine learning algorithms are being developed to analyze medical imaging data with higher accuracy than traditional methods.\n\n## Conclusion\n\nWhile quantum computing in healthcare is still in its early stages, the potential impact is substantial. As quantum hardware continues to advance, we can expect more breakthroughs in healthcare applications, ultimately leading to better patient outcomes and more efficient healthcare systems."
}
```

## Error Handling

All API endpoints return standard HTTP status codes:

- `200 OK`: The request was successful
- `400 Bad Request`: The request was invalid (e.g., missing required parameters)
- `401 Unauthorized`: Authentication failed
- `500 Internal Server Error`: An error occurred on the server

Error responses include a JSON object with the following structure:

```json
{
  "code": 400,
  "message": "Invalid request body",
  "errors": [
    {
      "code": "invalid_type",
      "expected": "string",
      "received": "undefined",
      "path": ["topic"],
      "message": "Required"
    }
  ]
}
```

## Rate Limiting

API requests are subject to rate limiting. The current limits are:

- 10 requests per minute
- 100 requests per day

If you exceed these limits, you will receive a `429 Too Many Requests` response.
