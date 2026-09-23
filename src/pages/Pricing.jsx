import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Badge from '../components/ui/Badge.jsx'
import PricingCard from '../components/ui/PricingCard.jsx'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import FaqAccordion from '../components/ui/FaqAccordion.jsx'
import { pricingPlans, pricingFaq, comparisonRows } from '../data/pricing.js'
import { useToast } from '../context/ToastContext.jsx'

export default function Pricing() {
  const [billing, setBilling] = useState('monthly')
  const toast = useToast()
  const navigate = useNavigate()

  const handleSelect = (plan) => {
    if (plan.id === 'business') {
      navigate('/contact')
      return
    }
    toast.success(`${plan.name} plan selected — redirecting to sign up...`)
    setTimeout(() => navigate('/signup'), 900)
  }

  return (
    <div>
      <section className="relative overflow-hidden bg-grid-glow section pt-24 pb-16">
        <div className="container-page text-center">
          <Badge tone="brand" className="mb-6">
            Pricing
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-slate-900 dark:text-white tracking-tight max-w-2xl mx-auto">
            Simple pricing for every stage
          </h1>
          <p className="mt-5 text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Start free, upgrade when you need more power. Cancel anytime.
          </p>

          <div className="inline-flex items-center gap-1 glass rounded-full p-1 mt-8">
            {['monthly', 'yearly'].map((b) => (
              <button
                key={b}
                onClick={() => setBilling(b)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all capitalize ${
                  billing === b ? 'bg-hero-gradient text-white shadow-glow' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {b}
                {b === 'yearly' && <span className="ml-1.5 text-xs opacity-80">Save 20%</span>}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="container-page grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {pricingPlans.map((plan) => (
            <PricingCard key={plan.id} plan={plan} billing={billing} popular={plan.popular} onSelect={handleSelect} />
          ))}
        </div>
      </section>

      {/* Comparison table */}
      <section className="section bg-slate-50 dark:bg-base-900/50">
        <div className="container-page">
          <SectionHeading eyebrow="Compare" title="Compare plan features" />
          <div className="overflow-x-auto glass rounded-2xl">
            <table className="w-full text-sm min-w-[560px]">
              <thead>
                <tr className="border-b border-slate-200 dark:border-white/10">
                  <th className="text-left px-6 py-4 font-semibold text-slate-700 dark:text-slate-200">Feature</th>
                  <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-200">Free</th>
                  <th className="px-6 py-4 font-semibold text-brand-500">Pro</th>
                  <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-200">Business</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr key={row.feature} className={i % 2 === 0 ? '' : 'bg-slate-500/[0.03]'}>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{row.feature}</td>
                    <td className="px-6 py-4 text-center text-slate-500 dark:text-slate-400">{row.free}</td>
                    <td className="px-6 py-4 text-center text-slate-700 dark:text-slate-200 font-medium">{row.pro}</td>
                    <td className="px-6 py-4 text-center text-slate-500 dark:text-slate-400">{row.business}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-page max-w-3xl">
          <SectionHeading eyebrow="FAQ" title="Pricing questions, answered" />
          <FaqAccordion items={pricingFaq} />
        </div>
      </section>
    </div>
  )
}
