import Button from '../components/ui/Button.jsx'
import Badge from '../components/ui/Badge.jsx'
import Card from '../components/ui/Card.jsx'
import { solutions } from '../data/solutions.js'

export default function Solutions() {
  return (
    <div>
      <section className="relative overflow-hidden bg-grid-glow section pt-24">
        <div className="container-page text-center">
          <Badge tone="brand" className="mb-6">
            Solutions
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-slate-900 dark:text-white tracking-tight max-w-2xl mx-auto">
            Built for how your team actually works
          </h1>
          <p className="mt-5 text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Whatever your role, Aivora adapts to fit your workflow — not the other way around.
          </p>
        </div>
      </section>

      <section className="section pt-0">
        <div className="container-page grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {solutions.map((s) => (
            <Card key={s.id} id={s.id} className="flex flex-col">
              <div className="text-4xl mb-4">{s.icon}</div>
              <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white mb-1">{s.title}</h2>
              <p className="text-sm font-medium text-brand-500 dark:text-brand-300 mb-4">{s.tagline}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-5">{s.description}</p>
              <ul className="space-y-2.5 mt-auto">
                {s.benefits.map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-brand-500 shrink-0 mt-0.5">
                      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {b}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </section>

      <section className="pb-24">
        <div className="container-page">
          <div className="rounded-3xl bg-hero-gradient px-8 py-16 text-center shadow-glow">
            <h2 className="text-3xl font-display font-bold text-white mb-4">Find the plan that fits your team</h2>
            <p className="text-white/80 mb-8 max-w-md mx-auto">
              Simple pricing that scales with you, from solo use to full organizations.
            </p>
            <Button to="/pricing" variant="secondary" size="lg" className="!bg-white !text-brand-700">
              View pricing
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
