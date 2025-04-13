#!/usr/bin/env python3
# Minimal example of using the Deep Research API with Python

import requests

# Configuration
API_URL = "https://your-deployment-url.com/api/research/query"
API_KEY = "your-access-password"
RESEARCH_QUERY = "History of cars"

# Function to perform research
def perform_research():
    try:
        print(f'Researching: "{RESEARCH_QUERY}"...')
        
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {API_KEY}"
        }
        
        data = {
            "query": RESEARCH_QUERY
        }
        
        response = requests.post(API_URL, json=data, headers=headers)
        response.raise_for_status()  # Raise exception for HTTP errors
        
        result = response.json()
        print("\n=== RESEARCH REPORT ===\n")
        print(result["report"])
        
    except Exception as e:
        print(f"Error: {e}")

# Run the research
if __name__ == "__main__":
    perform_research()

"""
To use this script:
1. Replace API_URL with your actual deployment URL
2. Replace API_KEY with your access password
3. Replace RESEARCH_QUERY with your research topic
4. Install requests: pip install requests
5. Run the script: python minimal_api_example.py
"""
