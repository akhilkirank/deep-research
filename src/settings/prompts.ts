/**
 * Prompt Templates
 * 
 * This file contains templates for prompts used with the LLM.
 * Customize these templates to control how the research reports are generated.
 */

// Standard Research Report Prompt
export const standardResearchPrompt = {
  // System prompt that defines the assistant's role
  systemPrompt: `You are a research assistant tasked with creating a comprehensive, factual, and well-structured research report on the provided topic.`,
  
  // Introduction to the task
  introduction: `I've gathered the following search results to help you create an accurate and informative report:`,
  
  // Format for presenting each search result
  resultFormat: (result: any, index: number) => `Source ${index + 1}: ${result.title}
URL: ${result.url}
Content: ${result.content}

`,
  
  // Instructions for the LLM
  instructions: `INSTRUCTIONS:
1. Analyze all the provided sources carefully
2. Extract key information, facts, dates, and insights relevant to the topic
3. Organize the information logically and coherently
4. Create a detailed research report with the following sections:
   - Introduction: Provide context and overview of the topic
   - Historical Background: Trace the origins and early development
   - Key Developments: Highlight major milestones, breakthroughs, and trends
   - Current State: Describe the present situation, applications, and relevance
   - Future Prospects: Discuss potential future directions and implications
   - Conclusion: Summarize key findings and their significance

5. Format the report in Markdown with proper headings (using # syntax), subheadings, bullet points, and numbered lists where appropriate
6. Include citations to the source materials using numbered references [1], [2], etc.
7. Add a References section at the end listing all sources used
8. Ensure the report is comprehensive, accurate, well-structured, and provides valuable insights on the topic

Your report should be detailed, informative, and reflect the most current understanding of the topic based on the provided sources.`
};

// Academic Research Report Prompt
export const academicResearchPrompt = {
  systemPrompt: `You are an academic researcher tasked with creating a scholarly research report on the provided topic.`,
  
  introduction: `I've gathered the following academic sources to help you create a comprehensive scholarly report:`,
  
  resultFormat: (result: any, index: number) => `Source ${index + 1}: ${result.title}
URL: ${result.url}
Content: ${result.content}

`,
  
  instructions: `INSTRUCTIONS:
1. Analyze all the provided academic sources carefully
2. Extract key information, methodologies, findings, and theoretical frameworks
3. Organize the information according to academic standards
4. Create a detailed academic research report with the following sections:
   - Abstract: Summarize the entire report in a short paragraph
   - Introduction: Provide context, research questions, and significance
   - Literature Review: Analyze existing research and identify gaps
   - Methodology: Describe how the research was conducted
   - Findings: Present the main results of the research
   - Discussion: Interpret the findings and their implications
   - Conclusion: Summarize key findings and suggest future research
   - References: List all sources in APA format

5. Format the report in Markdown with proper headings (using # syntax), subheadings, bullet points, and numbered lists where appropriate
6. Use formal academic language and avoid colloquialisms
7. Include in-text citations using APA format (Author, Year)
8. Ensure the report is comprehensive, methodologically sound, and contributes to the academic discourse

Your report should meet the standards of academic publishing and provide valuable insights for scholars in this field.`
};

// Technical Documentation Prompt
export const technicalDocumentationPrompt = {
  systemPrompt: `You are a technical writer tasked with creating comprehensive technical documentation on the provided topic.`,
  
  introduction: `I've gathered the following technical sources to help you create accurate and useful documentation:`,
  
  resultFormat: (result: any, index: number) => `Source ${index + 1}: ${result.title}
URL: ${result.url}
Content: ${result.content}

`,
  
  instructions: `INSTRUCTIONS:
1. Analyze all the provided technical sources carefully
2. Extract key technical information, specifications, code examples, and implementation details
3. Organize the information in a logical, easy-to-follow structure
4. Create detailed technical documentation with the following sections:
   - Overview: Explain what the technology is and its purpose
   - Getting Started: Provide initial setup and configuration steps
   - Core Concepts: Explain fundamental concepts and architecture
   - API Reference: Document functions, methods, parameters, and return values
   - Examples: Provide practical code examples and use cases
   - Troubleshooting: Address common issues and their solutions
   - Advanced Topics: Cover more complex aspects of the technology

5. Format the documentation in Markdown with proper headings, code blocks, tables, and lists
6. Use clear, concise language appropriate for technical audiences
7. Include code snippets with proper syntax highlighting where relevant
8. Ensure the documentation is accurate, comprehensive, and follows best practices for technical writing

Your documentation should be useful for both beginners and experienced users of this technology.`
};

// News Summary Prompt
export const newsSummaryPrompt = {
  systemPrompt: `You are a journalist tasked with creating a comprehensive news summary on the provided topic.`,
  
  introduction: `I've gathered the following news sources to help you create an accurate and balanced summary:`,
  
  resultFormat: (result: any, index: number) => `Source ${index + 1}: ${result.title}
URL: ${result.url}
Content: ${result.content}

`,
  
  instructions: `INSTRUCTIONS:
1. Analyze all the provided news sources carefully
2. Extract key facts, events, quotes, and perspectives
3. Organize the information chronologically or by importance
4. Create a comprehensive news summary with the following sections:
   - Headline: Create a concise, informative headline
   - Summary: Provide a brief overview of the main story
   - Background: Give context and relevant history
   - Key Developments: Detail the main events or announcements
   - Stakeholder Perspectives: Present different viewpoints
   - Analysis: Provide context and implications
   - What's Next: Discuss potential future developments

5. Format the summary in Markdown with proper headings and structure
6. Present information objectively and balance different perspectives
7. Cite sources for all key claims and quotes
8. Ensure the summary is accurate, comprehensive, and follows journalistic standards

Your summary should provide readers with a clear understanding of this news topic and its significance.`
};

// Function to get the appropriate prompt template based on the topic and style
export function getPromptTemplate(topic: string, style: string = 'standard') {
  // Check if the topic contains keywords that suggest a specific style
  const topicLower = topic.toLowerCase();
  
  if (style === 'academic' || topicLower.includes('research') || topicLower.includes('study') || topicLower.includes('theory')) {
    return academicResearchPrompt;
  }
  
  if (style === 'technical' || topicLower.includes('programming') || topicLower.includes('code') || topicLower.includes('software') || topicLower.includes('api')) {
    return technicalDocumentationPrompt;
  }
  
  if (style === 'news' || topicLower.includes('current events') || topicLower.includes('latest') || topicLower.includes('breaking')) {
    return newsSummaryPrompt;
  }
  
  // Default to standard research prompt
  return standardResearchPrompt;
}
