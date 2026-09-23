export const features = [
  {
    id: 'chat',
    icon: '💬',
    title: 'AI Chat',
    description:
      'Have natural, context-aware conversations with Aivora. Ask questions, brainstorm ideas, or get instant answers with a model that remembers the thread.',
    highlights: ['Multi-turn memory', 'Instant responses', 'Follow-up aware'],
  },
  {
    id: 'documents',
    icon: '📄',
    title: 'Document Analysis',
    description:
      'Upload contracts, reports, or research papers and get instant summaries, key insights, and answers grounded in your documents.',
    highlights: ['PDF & DOCX support', 'Smart summaries', 'Citation-backed answers'],
  },
  {
    id: 'content',
    icon: '✍️',
    title: 'Content Generation',
    description:
      'Generate blog posts, marketing copy, emails, and social content that sounds like you — trained on tone, structure, and brand voice.',
    highlights: ['Tone matching', 'SEO-aware drafts', 'Multi-format output'],
  },
  {
    id: 'code',
    icon: '⌨️',
    title: 'Code Assistance',
    description:
      'Write, debug, and refactor code across 30+ languages. Get explanations, test generation, and architecture suggestions in seconds.',
    highlights: ['30+ languages', 'Inline explanations', 'Test generation'],
  },
  {
    id: 'data',
    icon: '📊',
    title: 'Data Analysis',
    description:
      'Turn spreadsheets and raw data into clear insights. Ask questions in plain English and get charts, trends, and summaries back.',
    highlights: ['Natural language queries', 'Auto-generated charts', 'Trend detection'],
  },
  {
    id: 'image',
    icon: '🖼️',
    title: 'Image Understanding',
    description:
      'Upload screenshots, diagrams, or photos and let Aivora describe, extract text, or reason about what it sees.',
    highlights: ['OCR built-in', 'Diagram reasoning', 'Visual Q&A'],
  },
  {
    id: 'history',
    icon: '🕘',
    title: 'Conversation History',
    description:
      'Every conversation is saved, searchable, and organized automatically so you never lose an important thread of thought.',
    highlights: ['Full-text search', 'Auto-organization', 'Exportable threads'],
  },
  {
    id: 'collaboration',
    icon: '👥',
    title: 'Team Collaboration',
    description:
      'Share chats, files, and workflows with your team. Manage seats, permissions, and usage from a single workspace.',
    highlights: ['Shared workspaces', 'Role-based access', 'Usage insights'],
  },
]

export const capabilities = [
  { icon: '⚡', title: 'Real-time responses', description: 'Sub-second latency for most queries, even at scale.' },
  { icon: '🧠', title: 'Deep reasoning', description: 'Multi-step logic for complex, ambiguous problems.' },
  { icon: '🔒', title: 'Enterprise security', description: 'SOC 2 Type II, encryption at rest and in transit.' },
  { icon: '🌐', title: '40+ languages', description: 'Fluent, natural output across major world languages.' },
]

export const howItWorks = [
  { step: '01', title: 'Ask anything', description: 'Type a question, upload a file, or paste code — Aivora understands context instantly.' },
  { step: '02', title: 'Aivora thinks', description: 'Our models reason through the problem, pulling in relevant context and knowledge.' },
  { step: '03', title: 'Get results', description: 'Receive clear, actionable answers — refine with follow-ups until it is exactly right.' },
]

export const useCases = [
  { icon: '🚀', title: 'Product teams', description: 'Draft specs, summarize feedback, and prioritize roadmaps faster.' },
  { icon: '📈', title: 'Marketing', description: 'Generate campaigns, ad copy, and content calendars in minutes.' },
  { icon: '🧑‍💻', title: 'Engineering', description: 'Ship features faster with AI pair-programming and code review.' },
  { icon: '🎓', title: 'Education', description: 'Explain complex topics and generate study materials on demand.' },
]
