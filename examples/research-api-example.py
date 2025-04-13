#!/usr/bin/env python3
"""
Deep Research API Example

This example demonstrates how to use the Deep Research API to generate
comprehensive research reports on any topic.
"""

import requests
import json

# API configuration
API_URL = 'http://localhost:3000/api/research/query'
API_KEY = '123'  # Replace with your actual API key

def perform_research(query, **options):
    """
    Function to perform research using the Deep Research API
    
    Args:
        query (str): The research topic or question
        **options: Additional options for the research
            - language (str): The language for the response (default: 'en-US')
            - provider (str): The AI provider to use (default: 'google')
            - model (str): The specific model to use (default: 'gemini-1.5-pro')
            - searchProvider (str): The search provider to use (default: 'tavily')
            - maxIterations (int): Maximum number of search iterations (default: 2)
    
    Returns:
        str: The research report
    """
    print(f'Starting research on: "{query}"...')
    
    # Prepare request body
    request_body = {
        'query': query,
        'language': options.get('language', 'en-US'),
        'provider': options.get('provider', 'google'),
        'model': options.get('model', 'gemini-1.5-pro'),
        'searchProvider': options.get('searchProvider', 'tavily'),
        'maxIterations': options.get('maxIterations', 2)
    }
    
    # Make API request
    try:
        response = requests.post(
            API_URL,
            headers={
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {API_KEY}'
            },
            json=request_body
        )
        
        # Check if request was successful
        response.raise_for_status()
        
        # Parse response
        data = response.json()
        
        # Check if report is available
        if 'report' not in data:
            raise Exception('No report returned from API')
        
        print('Research completed successfully!')
        return data['report']
    
    except requests.exceptions.RequestException as e:
        print(f'Error performing research: {e}')
        if hasattr(e, 'response') and e.response is not None:
            print(f'Response status: {e.response.status_code}')
            print(f'Response body: {e.response.text}')
        raise
    except Exception as e:
        print(f'Error: {e}')
        raise

def main():
    """Main function to run the example"""
    try:
        # Example 1: Basic research query
        topic = 'History of artificial intelligence'
        report = perform_research(topic)
        
        # Print the report
        print('\n=== RESEARCH REPORT ===\n')
        print(report)
        
        # Example 2: Research with custom options
        # Uncomment to run this example
        """
        custom_topic = 'Impact of climate change on agriculture'
        custom_options = {
            'language': 'en-US',
            'provider': 'google',
            'model': 'gemini-1.5-pro',
            'searchProvider': 'tavily',
            'maxIterations': 3
        }
        custom_report = perform_research(custom_topic, **custom_options)
        print('\n=== CUSTOM RESEARCH REPORT ===\n')
        print(custom_report)
        """
    
    except Exception as e:
        print(f'Example failed: {e}')

if __name__ == '__main__':
    main()
