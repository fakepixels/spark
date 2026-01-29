export const CONTENT_DISCOVERY_PROMPTS = {
  initial: `Hello! I'm Spark, your AI presentation assistant. I'm excited to help you create a beautiful presentation!

To get started, I'd like to understand what you're building. What kind of presentation is this for?`,

  questions: {
    purpose: {
      question: 'What is this presentation for?',
      options: [
        {
          value: 'pitch',
          label: 'Pitch Deck',
          description: 'Raising funds, pitching to investors or stakeholders',
        },
        {
          value: 'teaching',
          label: 'Teaching/Education',
          description: 'Educational content, lectures, or tutorials',
        },
        {
          value: 'conference',
          label: 'Conference Talk',
          description: 'Public speaking, conference presentations',
        },
        {
          value: 'internal',
          label: 'Internal Meeting',
          description: 'Company updates, team presentations, reports',
        },
      ],
    },
    length: {
      question: 'Approximately how many slides do you need?',
      options: [
        {
          value: 'short',
          label: 'Short (5-10 slides)',
          description: 'Quick pitch or brief overview',
        },
        {
          value: 'medium',
          label: 'Medium (10-20 slides)',
          description: 'Standard presentation length',
        },
        {
          value: 'long',
          label: 'Long (20+ slides)',
          description: 'Comprehensive deck with detailed content',
        },
      ],
    },
    contentReadiness: {
      question: 'How ready is your content?',
      options: [
        {
          value: 'ready',
          label: 'Content is ready',
          description: 'I have all the text and content prepared',
        },
        {
          value: 'notes',
          label: 'I have notes',
          description: 'I have rough notes or an outline',
        },
        {
          value: 'topic',
          label: 'Just a topic',
          description: 'I have a topic but need help with content',
        },
      ],
    },
  },
};

export function getContentDiscoveryResponse(answeredQuestions: number): string {
  switch (answeredQuestions) {
    case 0:
      return CONTENT_DISCOVERY_PROMPTS.initial;
    case 1:
      return "Great! Now, let's talk about the scope of your presentation.";
    case 2:
      return 'Perfect! One more thing before we move forward.';
    case 3:
      return "Excellent! I have everything I need. Now let's choose a visual style for your presentation. I'll generate 3 unique style options for you to preview.";
    default:
      return '';
  }
}
