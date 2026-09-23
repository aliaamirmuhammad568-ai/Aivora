import Button from '../components/ui/Button.jsx'
import Badge from '../components/ui/Badge.jsx'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import { features } from '../data/features.js'

export default function Features() {
  return (
    <div>
      <section className="relative overflow-hidden bg-grid-glow section pt-24">
        <div className="container-page text-center">
          <Badge tone="brand" className="mb-6">
            Features
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-slate-900 dark:text-white tracking-tight max-w-2xl mx-auto">
            Every AI capability your team needs, in one place
          </h1>
          <p className="mt-5 text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Aivora unifies chat, analysis, generation, and collaboration so you never have to switch tools.
          </p>
        </div>
      </section>

      <section className="section pt-0">
        <div className="container-page space-y-20">
          {features.map((f, i) => (
            <div
              key={f.id}
              className={`grid lg:grid-cols-2 gap-10 lg:gap-16 items-center ${
                i % 2 === 1 ? 'lg:[direction:rtl]' : ''
              }`}
            >
              <div className="lg:[direction:ltr]">
                <div className="w-14 h-14 rounded-2xl bg-hero-gradient flex items-center justify-center text-2xl text-white shadow-glow mb-6">
                  {f.icon}
                </div>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 dark:text-white mb-4">
                  {f.title}
                </h2>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">{f.description}</p>
                <ul className="space-y-3">
                  {f.highlights.map((h) => (
                    <li key={h} className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-brand-500 shrink-0">
                        <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="lg:[direction:ltr]">
                <div className="relative aspect-[4/3] rounded-2xl glass flex items-center justify-center overflow-hidden">
                  <div className="absolute -inset-10 bg-hero-gradient opacity-20 blur-3xl" />
                  <span className="relative text-8xl">{f.icon}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="pb-24">
        <div className="container-page">
          <div className="rounded-3xl bg-hero-gradient px-8 py-16 text-center shadow-glow">
            <h2 className="text-3xl font-display font-bold text-white mb-4">See it all in action</h2>
            <p className="text-white/80 mb-8 max-w-md mx-auto">
              Try every feature free — no credit card required.
            </p>
            <Button to="/signup" variant="secondary" size="lg" className="!bg-white !text-brand-700">
              Start for free
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
