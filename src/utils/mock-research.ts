export function mockResearch(topic: string) {
  return {
    report: `# ${topic}

## Introduction
${topic} is a rapidly evolving field with significant implications for various industries and scientific domains. This report provides a comprehensive overview of the current state, historical development, and future prospects of ${topic}.

## Historical Development
The concept of ${topic} originated in the early 20th century with theoretical foundations laid by pioneers in the field. Over the decades, significant milestones have marked its evolution from theoretical concept to practical implementation.

## Current State
Today, ${topic} represents a vibrant area of research and development with numerous applications across industries. Recent breakthroughs have accelerated progress and opened new possibilities for innovation.

## Future Trends
Experts predict continued growth and innovation in ${topic}, with emerging technologies and methodologies poised to transform the landscape further. Key areas to watch include integration with artificial intelligence, enhanced computational capabilities, and novel application domains.

## Conclusion
${topic} stands at the intersection of multiple disciplines and offers tremendous potential for addressing complex challenges. As research continues and technologies mature, we can expect to see increasingly sophisticated applications and broader adoption across sectors.
`,
    learnings: [
      `${topic} has a rich history dating back to the early 20th century, with significant theoretical and practical developments over the decades.`,
      `Current applications of ${topic} span multiple industries including healthcare, finance, and technology, with recent breakthroughs accelerating adoption.`,
      `Future trends in ${topic} suggest continued innovation, particularly in areas of AI integration, computational efficiency, and novel application domains.`
    ]
  };
}
