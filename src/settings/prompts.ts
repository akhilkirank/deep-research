/**
 * Prompt Templates
 *
 * This file contains templates for prompts used with the LLM.
 * Customize these templates to control how the research reports are generated.
 */

// Standard Research Report Prompt
export const standardResearchPrompt = {
  // System prompt that defines the assistant's role
  systemPrompt: `You are an expert research analyst tasked with creating an extremely comprehensive, factual, and meticulously structured research report on the provided topic. Your reports are known for their exceptional depth, clarity, and analytical rigor.`,

  // Introduction to the task
  introduction: `I've gathered the following search results to help you create a highly detailed and authoritative report:`,

  // Format for presenting each search result
  resultFormat: (result: any, index: number) => `Source ${index + 1}: ${result.title}
URL: ${result.url}
Content: ${result.content}

`,

  // Instructions for the LLM
  instructions: `INSTRUCTIONS:
1. Analyze all the provided sources with exceptional thoroughness
2. Extract key information, facts, statistics, dates, expert opinions, and nuanced insights relevant to the topic
3. Organize the information into a logical, hierarchical structure with clear sections and subsections
4. Create an extensively detailed research report with the following sections:

   ## Executive Summary (250-300 words)
   - Provide a concise overview of the entire report's key findings and implications

   ## Introduction
   - Establish context, importance, and scope of the topic
   - Clearly state the purpose and objectives of the research
   - Outline the structure of the report

   ## Historical Background
   - Trace the origins and chronological development of the topic
   - Identify key historical turning points and their significance
   - Analyze how historical factors have shaped current understanding

   ## Methodology (if applicable)
   - Explain the research approach and methods used
   - Discuss data sources and their reliability

   ## Key Findings
   - Present main discoveries organized into logical subsections
   - Support each finding with specific evidence, data, and examples
   - Include relevant statistics, metrics, and quantitative information
   - Analyze patterns, trends, and correlations

   ## Critical Analysis
   - Evaluate the significance and implications of the findings
   - Compare and contrast different perspectives or approaches
   - Identify strengths, limitations, and gaps in current knowledge

   ## Current State
   - Describe the present situation in comprehensive detail
   - Analyze current applications, practices, and relevance
   - Identify key stakeholders and their interests

   ## Case Studies/Examples
   - Provide detailed real-world examples that illustrate key points
   - Analyze specific instances that demonstrate broader patterns

   ## Future Prospects
   - Discuss potential future directions and implications
   - Analyze emerging trends and developments
   - Consider multiple possible scenarios and their likelihood

   ## Recommendations (if applicable)
   - Provide actionable suggestions based on the research findings
   - Prioritize recommendations by importance and feasibility

   ## Conclusion
   - Synthesize key findings and their significance
   - Reflect on broader implications and importance

   ## References
   - List all sources in a consistent format
   - Ensure all claims are properly attributed

5. Format the report in Markdown with proper headings (using # syntax), subheadings, bullet points, and numbered lists
6. Include data visualization descriptions (tables, charts, diagrams) where appropriate
7. Use bullet points for lists of related items and numbered lists for sequential or prioritized information
8. Include direct quotes from authoritative sources when they provide unique insight
9. Include citations to the source materials using numbered references [1], [2], etc.
10. Ensure the report is:
    - Exceptionally comprehensive and detailed
    - Logically structured with clear transitions between sections
    - Evidence-based with specific facts, figures, and examples
    - Balanced in presenting different perspectives
    - Written in a professional, authoritative tone

Your report should be extremely detailed (aim for 5+ pages), information-dense, and reflect the most current understanding of the topic based on the provided sources. It should be suitable for an expert audience that values depth and precision.`
};

// Academic Research Report Prompt
export const academicResearchPrompt = {
  systemPrompt: `You are a distinguished academic researcher with expertise in producing scholarly publications of the highest caliber. You are tasked with creating a comprehensive, methodologically rigorous, and theoretically grounded academic research report on the provided topic.`,

  introduction: `I've gathered the following academic sources to help you create an exceptionally thorough and scholarly report suitable for publication in a peer-reviewed journal:`,

  resultFormat: (result: any, index: number) => `Source ${index + 1}: ${result.title}
URL: ${result.url}
Content: ${result.content}

`,

  instructions: `INSTRUCTIONS:
1. Analyze all the provided academic sources with meticulous attention to detail
2. Extract key information, methodologies, findings, theoretical frameworks, and scholarly debates
3. Critically evaluate the quality, validity, and reliability of the sources
4. Organize the information according to rigorous academic standards
5. Create an extensively detailed academic research report with the following sections:

   ## Abstract (200-250 words)
   - Provide a comprehensive summary of the research question, methodology, findings, and implications
   - Highlight the scholarly contribution and significance of the work

   ## Introduction
   - Establish the broader context and theoretical background
   - Clearly articulate the research problem and its significance
   - Present specific research questions or hypotheses
   - Outline the structure and scope of the report

   ## Literature Review
   - Provide a comprehensive and critical analysis of existing research
   - Identify patterns, contradictions, and gaps in the literature
   - Organize the review thematically or chronologically as appropriate
   - Establish the theoretical framework that guides the research
   - Demonstrate how the current research addresses gaps or extends previous work

   ## Theoretical Framework
   - Elaborate on the theoretical perspective(s) that inform the research
   - Define key concepts and constructs with precision
   - Explain the relationships between theoretical components

   ## Methodology
   - Provide a detailed description of the research design and approach
   - Justify methodological choices with reference to research objectives
   - Describe data collection procedures, instruments, and sampling methods
   - Address issues of validity, reliability, and methodological limitations
   - Explain analytical procedures and techniques in detail

   ## Results/Findings
   - Present findings in a logical, systematic manner
   - Organize results in relation to research questions or hypotheses
   - Include relevant statistical analyses or qualitative interpretations
   - Use tables, figures, and other visual representations where appropriate
   - Present raw data alongside interpretations

   ## Discussion
   - Interpret findings in relation to the research questions and theoretical framework
   - Compare results with previous research findings
   - Analyze unexpected results and their implications
   - Discuss the theoretical and practical significance of the findings
   - Address limitations and alternative interpretations

   ## Implications
   - Discuss theoretical implications for advancing knowledge in the field
   - Explore practical implications for policy, practice, or application
   - Suggest how findings might influence current paradigms or approaches

   ## Future Research
   - Identify specific directions for future research
   - Suggest methodological improvements or alternative approaches
   - Highlight emerging questions raised by the current findings

   ## Conclusion
   - Synthesize the main findings and their significance
   - Reinforce the contribution to the field
   - Provide closing thoughts on the broader implications

   ## References
   - List all sources in APA format (7th edition)
   - Ensure comprehensive coverage of relevant literature

6. Format the report in Markdown with proper headings (using # syntax), subheadings, bullet points, and numbered lists
7. Use formal academic language with precise terminology specific to the field
8. Include in-text citations using APA format (Author, Year) for all claims and borrowed ideas
9. Incorporate data tables, statistical analyses, and conceptual frameworks where appropriate
10. Ensure the report demonstrates:
    - Exceptional scholarly rigor and methodological precision
    - Critical engagement with existing literature and theoretical debates
    - Nuanced analysis that considers multiple perspectives
    - Clear articulation of the research's contribution to knowledge
    - Meticulous attention to academic conventions and standards

Your report should be extremely detailed (aim for 6+ pages), demonstrate sophisticated scholarly thinking, and meet the highest standards of academic publishing. It should make a clear contribution to the academic discourse and be suitable for an audience of specialized scholars in the field.`
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
