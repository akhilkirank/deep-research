#!/bin/bash

GOOGLE_API_KEY="AIzaSyDbSREReKGEPlvkgfoYTzXFNxw3WNnVycM"
TAVILY_API_KEY="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"

echo "Testing API keys with curl..."
echo "Google API Key: [Set]"
echo "Tavily API Key: [Set]"

echo -e "\nTesting Google Generative AI API..."
curl -s -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=$GOOGLE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [
      {
        "parts": [
          {
            "text": "Hello, can you give me a brief response to test the API?"
          }
        ]
      }
    ]
  }' | grep -q "candidates" && echo "API working: Yes" || echo "API working: No"

echo -e "\nTesting Tavily API..."
curl -s -X POST "https://api.tavily.com/search" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TAVILY_API_KEY" \
  -d '{
    "query": "What is artificial intelligence?",
    "search_depth": "basic",
    "include_answer": true,
    "max_results": 3
  }' | grep -q "results" && echo "API working: Yes" || echo "API working: No"

echo -e "\nDone testing API keys."
