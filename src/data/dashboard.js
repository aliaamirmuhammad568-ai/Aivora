export const conversations = [
  { id: 'c1', title: 'Q3 marketing campaign ideas', preview: 'Can you help me brainstorm a launch campaign for...', date: 'Today, 2:41 PM', messages: 14 },
  { id: 'c2', title: 'Debugging React useEffect loop', preview: 'My component keeps re-rendering infinitely when...', date: 'Today, 11:02 AM', messages: 8 },
  { id: 'c3', title: 'Summarize investor deck feedback', preview: 'Here are the notes from yesterday\'s meeting...', date: 'Yesterday', messages: 21 },
  { id: 'c4', title: 'Python data cleaning script', preview: 'I have a CSV with inconsistent date formats...', date: 'Yesterday', messages: 11 },
  { id: 'c5', title: 'Competitor pricing analysis', preview: 'Compare these three pricing pages and tell me...', date: '2 days ago', messages: 6 },
  { id: 'c6', title: 'Rewrite onboarding email sequence', preview: 'Our current onboarding emails feel too formal...', date: '3 days ago', messages: 17 },
  { id: 'c7', title: 'Explain quarterly revenue chart', preview: 'What trends stand out in this attached spreadsheet?', date: '4 days ago', messages: 9 },
  { id: 'c8', title: 'API documentation draft', preview: 'Help me write docs for the /users endpoint', date: '1 week ago', messages: 13 },
]

export const files = [
  { id: 'f1', name: 'Q3_Investor_Deck.pdf', type: 'pdf', size: '4.2 MB', date: 'Sep 20, 2026', progress: 100 },
  { id: 'f2', name: 'customer_feedback_raw.csv', type: 'csv', size: '1.8 MB', date: 'Sep 19, 2026', progress: 100 },
  { id: 'f3', name: 'brand_guidelines_v3.docx', type: 'doc', size: '6.1 MB', date: 'Sep 18, 2026', progress: 100 },
  { id: 'f4', name: 'product_screenshot.png', type: 'image', size: '890 KB', date: 'Sep 17, 2026', progress: 100 },
  { id: 'f5', name: 'revenue_model_2026.xlsx', type: 'sheet', size: '2.3 MB', date: 'Sep 16, 2026', progress: 100 },
  { id: 'f6', name: 'onboarding_flow_diagram.png', type: 'image', size: '1.1 MB', date: 'Sep 14, 2026', progress: 100 },
  { id: 'f7', name: 'legal_contract_draft.pdf', type: 'pdf', size: '780 KB', date: 'Sep 12, 2026', progress: 100 },
]

export const usageMonthly = [
  { month: 'Apr', value: 4200 },
  { month: 'May', value: 5100 },
  { month: 'Jun', value: 4800 },
  { month: 'Jul', value: 6300 },
  { month: 'Aug', value: 7100 },
  { month: 'Sep', value: 8450 },
]

export const usageStats = {
  plan: 'Pro',
  tokensUsed: 84500,
  tokensLimit: 150000,
  messagesUsed: 1204,
  messagesLimit: null,
  filesAnalyzed: 63,
  daysRemaining: 12,
}

export const recentActivity = [
  { id: 1, type: 'chat', label: 'New conversation: "Q3 marketing campaign ideas"', time: '2 hours ago' },
  { id: 2, type: 'file', label: 'Uploaded Q3_Investor_Deck.pdf', time: '5 hours ago' },
  { id: 3, type: 'chat', label: 'Regenerated response in "Debugging React useEffect loop"', time: '6 hours ago' },
  { id: 4, type: 'file', label: 'Analyzed customer_feedback_raw.csv', time: 'Yesterday' },
  { id: 5, type: 'settings', label: 'Updated notification preferences', time: '2 days ago' },
]
