export const pricingPlans = [
  {
    id: 'free',
    name: 'Free',
    description: 'For getting started with AI.',
    priceMonthly: 0,
    priceYearly: 0,
    cta: 'Get started',
    features: [
      '50 messages / month',
      'Basic AI chat',
      'Document analysis (5/mo)',
      'Community support',
      '1 workspace',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For individuals who want more power.',
    priceMonthly: 24,
    priceYearly: 19,
    cta: 'Start free trial',
    popular: true,
    features: [
      'Unlimited messages',
      'Advanced AI chat & reasoning',
      'Unlimited document analysis',
      'Code assistance & data analysis',
      'Priority support',
      '5 workspaces',
      'Conversation history & export',
    ],
  },
  {
    id: 'business',
    name: 'Business',
    description: 'For teams that need to scale.',
    priceMonthly: 59,
    priceYearly: 49,
    cta: 'Contact sales',
    features: [
      'Everything in Pro',
      'Team collaboration & shared workspaces',
      'Admin controls & role permissions',
      'SSO & advanced security',
      'Dedicated account manager',
      'Unlimited workspaces',
      'Usage analytics dashboard',
    ],
  },
]

export const pricingFaq = [
  {
    q: 'Can I switch plans at any time?',
    a: 'Yes. You can upgrade, downgrade, or cancel your plan at any time from your account settings. Changes take effect immediately, and billing is prorated.',
  },
  {
    q: 'Is there a free trial for Pro?',
    a: 'Yes, Pro comes with a 14-day free trial with no credit card required. You can cancel anytime before the trial ends.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major credit cards, as well as invoicing for Business plans with annual commitments.',
  },
  {
    q: 'Do unused messages roll over?',
    a: 'Pro and Business plans include unlimited messages, so this only applies to the Free plan — unused messages do not roll over month to month.',
  },
  {
    q: 'Can I get a refund?',
    a: 'We offer a 30-day money-back guarantee on all paid plans, no questions asked.',
  },
]

export const comparisonRows = [
  { feature: 'Monthly messages', free: '50', pro: 'Unlimited', business: 'Unlimited' },
  { feature: 'Document analysis', free: '5 / month', pro: 'Unlimited', business: 'Unlimited' },
  { feature: 'Code assistance', free: '—', pro: '✓', business: '✓' },
  { feature: 'Data analysis', free: '—', pro: '✓', business: '✓' },
  { feature: 'Team workspaces', free: '1', pro: '5', business: 'Unlimited' },
  { feature: 'Admin & role controls', free: '—', pro: '—', business: '✓' },
  { feature: 'SSO', free: '—', pro: '—', business: '✓' },
  { feature: 'Priority support', free: '—', pro: '✓', business: '✓' },
  { feature: 'Dedicated account manager', free: '—', pro: '—', business: '✓' },
]
