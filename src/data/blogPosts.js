export const categories = ['All', 'Product', 'Engineering', 'AI Research', 'Company', 'Guides']

export const blogPosts = [
  {
    slug: 'introducing-aivora-2-0',
    title: 'Introducing Aivora 2.0: Faster, smarter, more capable',
    excerpt: 'Our biggest platform update yet brings a new reasoning engine, document analysis 2x faster, and a redesigned chat experience.',
    category: 'Product',
    author: 'Maya Chen',
    date: 'Sep 12, 2026',
    readTime: '6 min read',
    emoji: '🚀',
    gradient: 'linear-gradient(135deg, #7c4dff, #22b8f2)',
    featured: true,
    content: [
      'Today we are launching Aivora 2.0, the largest update to our platform since launch. This release focuses on three things our users have asked for most: speed, accuracy, and a more intuitive interface.',
      'The new reasoning engine at the core of Aivora 2.0 handles multi-step problems with significantly better accuracy, particularly for tasks that require holding context across a long conversation. In our internal benchmarks, complex reasoning tasks saw a 34% improvement in first-response accuracy.',
      'Document analysis is now twice as fast, thanks to a rebuilt ingestion pipeline that processes PDFs, spreadsheets, and presentations in parallel rather than sequentially. Large documents that used to take 45 seconds now complete in under 20.',
      'We have also redesigned the chat experience from the ground up. Conversations are easier to navigate, responses render markdown and code more cleanly, and you can now regenerate or edit any message in a thread without losing context.',
      'This is just the beginning. Over the next few months we will be rolling out team-wide knowledge bases, deeper integrations, and expanded language support. Thank you for building with us.',
    ],
  },
  {
    slug: 'how-we-built-real-time-reasoning',
    title: 'How we built real-time reasoning at scale',
    excerpt: 'A behind-the-scenes look at the infrastructure decisions that let Aivora respond in under a second, even under heavy load.',
    category: 'Engineering',
    author: 'Daniel Osei',
    date: 'Sep 3, 2026',
    readTime: '9 min read',
    emoji: '⚙️',
    gradient: 'linear-gradient(135deg, #22b8f2, #7c4dff)',
    content: [
      'When we set out to build Aivora, one non-negotiable requirement was speed. Users do not want to wait several seconds for a response — they want the AI to feel like a real conversation partner.',
      'Achieving sub-second response times at scale required rethinking our entire request pipeline. We moved from a synchronous request-response model to a streaming architecture where tokens are delivered to the client as soon as they are generated.',
      'On the infrastructure side, we built a custom request router that intelligently distributes load across regions based on real-time latency measurements, rather than static geographic rules.',
      'We also invested heavily in caching common reasoning patterns without sacrificing response quality — a delicate balance that took several iterations to get right.',
      'The result is a system that maintains consistent sub-second latency even during peak traffic, which we consider one of our proudest engineering achievements.',
    ],
  },
  {
    slug: 'the-future-of-ai-assisted-work',
    title: 'The future of AI-assisted work',
    excerpt: 'AI is not replacing knowledge work — it is changing the shape of it. Here is what we are seeing across thousands of Aivora workspaces.',
    category: 'AI Research',
    author: 'Dr. Priya Nair',
    date: 'Aug 22, 2026',
    readTime: '7 min read',
    emoji: '🔮',
    gradient: 'linear-gradient(135deg, #4fd1ff, #7c4dff)',
    content: [
      'Over the past year, we have had a front-row seat to how AI is reshaping daily work across thousands of teams using Aivora. The patterns are consistent, and they tell a clear story.',
      'The biggest shift is not in what work gets done, but in where time goes. Teams are spending less time on first drafts, initial research, and repetitive analysis — and more time on judgment, refinement, and decision-making.',
      'We are also seeing AI become a genuine collaborator rather than just a tool. Users increasingly treat Aivora as a thinking partner, asking it to challenge assumptions or offer alternative approaches, not just execute tasks.',
      'This shift has implications for how teams are structured and how skills are valued. The ability to ask good questions and evaluate AI output critically is becoming as important as the ability to produce work from scratch.',
      'We believe this is only the beginning of a broader transformation in knowledge work, and we are committed to building tools that make that transition empowering rather than disruptive.',
    ],
  },
  {
    slug: 'aivora-raises-series-b',
    title: 'Aivora raises $42M Series B to accelerate platform growth',
    excerpt: 'We are thrilled to announce our Series B funding round, led by Horizon Ventures, to expand our team and platform capabilities.',
    category: 'Company',
    author: 'Jonas Weber',
    date: 'Aug 10, 2026',
    readTime: '4 min read',
    emoji: '📣',
    gradient: 'linear-gradient(135deg, #7c4dff, #4fd1ff)',
    content: [
      'We are excited to share that Aivora has raised $42M in Series B funding, led by Horizon Ventures with participation from existing investors.',
      'This funding will accelerate our product roadmap, expand our engineering and research teams, and deepen our investment in enterprise-grade security and compliance.',
      'Since our last round, Aivora has grown to serve teams across 60+ countries, processing millions of AI interactions every month. This milestone reflects the trust our users place in us every day.',
      'We remain focused on our founding mission: building AI tools that genuinely make people more capable, not just more automated. This funding lets us pursue that mission with even greater ambition.',
    ],
  },
  {
    slug: 'prompting-guide-for-better-results',
    title: 'A practical guide to getting better results from Aivora',
    excerpt: 'Small changes to how you prompt can dramatically improve response quality. Here are the techniques our power users swear by.',
    category: 'Guides',
    author: 'Sara Ibrahim',
    date: 'Jul 29, 2026',
    readTime: '8 min read',
    emoji: '🧭',
    gradient: 'linear-gradient(135deg, #6a2df0, #22b8f2)',
    content: [
      'Getting great results from any AI system comes down to how clearly you communicate what you need. Here are the techniques we see power users apply consistently.',
      'First, be specific about the output format you want. Instead of asking Aivora to "write about our product," specify "write a 3-paragraph product announcement for a technical audience, focused on the new API."',
      'Second, provide context up front rather than after the fact. Sharing relevant background in your first message produces better results than a generic question followed by corrections.',
      'Third, use follow-up messages to refine rather than restart. Aivora maintains context across a conversation, so building on a response is more efficient than starting a new thread.',
      'Finally, do not be afraid to ask Aivora to critique its own output. Asking "what would make this stronger?" often surfaces improvements you would not have thought to request directly.',
    ],
  },
  {
    slug: 'securing-ai-workflows-for-enterprise',
    title: 'Securing AI workflows for the enterprise',
    excerpt: 'What SOC 2 compliance, encryption, and data governance actually mean for teams evaluating AI tools at scale.',
    category: 'Engineering',
    author: 'Daniel Osei',
    date: 'Jul 15, 2026',
    readTime: '10 min read',
    emoji: '🔐',
    gradient: 'linear-gradient(135deg, #22b8f2, #4fd1ff)',
    content: [
      'As AI tools move from experimentation to core infrastructure, security and compliance become non-negotiable. Here is how we think about it at Aivora.',
      'SOC 2 Type II compliance means our security controls have been independently audited over a sustained period, not just verified at a single point in time. This covers access control, encryption, monitoring, and incident response.',
      'All data is encrypted in transit using TLS 1.3 and at rest using AES-256. Business plan customers can additionally configure customer-managed encryption keys for an extra layer of control.',
      'Data governance is equally important. We give administrators granular control over data retention, and conversations are never used to train models without explicit, opt-in consent.',
      'For teams evaluating AI tools, we recommend asking vendors directly about audit history, data residency options, and incident response commitments — not just feature lists.',
    ],
  },
]

export function getPostBySlug(slug) {
  return blogPosts.find((p) => p.slug === slug)
}

export function getRelatedPosts(slug, count = 3) {
  const current = getPostBySlug(slug)
  if (!current) return blogPosts.slice(0, count)
  return blogPosts.filter((p) => p.slug !== slug && p.category === current.category).slice(0, count).length
    ? blogPosts.filter((p) => p.slug !== slug && p.category === current.category).slice(0, count)
    : blogPosts.filter((p) => p.slug !== slug).slice(0, count)
}
