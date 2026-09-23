import Badge from '../components/ui/Badge.jsx'
import Card from '../components/ui/Card.jsx'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import Button from '../components/ui/Button.jsx'

const stats = [
  { value: '2.4M+', label: 'Conversations per month' },
  { value: '60+', label: 'Countries served' },
  { value: '99.98%', label: 'Uptime SLA' },
  { value: '4.9/5', label: 'Average user rating' },
]

const team = [
  { name: 'Elena Marquez', role: 'CEO & Co-founder', initials: 'EM' },
  { name: 'Marcus Webb', role: 'CTO & Co-founder', initials: 'MW' },
  { name: 'Dr. Priya Nair', role: 'Head of AI Research', initials: 'PN' },
  { name: 'Daniel Osei', role: 'VP of Engineering', initials: 'DO' },
  { name: 'Maya Chen', role: 'Head of Marketing', initials: 'MC' },
  { name: 'Sara Ibrahim', role: 'VP of Operations', initials: 'SI' },
]

const timeline = [
  { year: '2023', title: 'Aivora founded', description: 'Elena and Marcus started Aivora out of a shared frustration with fragmented AI tools.' },
  { year: '2024', title: 'Public launch', description: 'Aivora launched to the public with AI chat and document analysis.' },
  { year: '2025', title: '100,000 users', description: 'Crossed 100K users and launched team collaboration features.' },
  { year: '2026', title: 'Series B & Aivora 2.0', description: 'Raised $42M Series B and shipped our biggest platform update yet.' },
]

export default function About() {
  return (
    <div>
      <section className="relative overflow-hidden bg-grid-glow section pt-24 pb-16">
        <div className="container-page text-center">
          <Badge tone="brand" className="mb-6">
            About Aivora
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-slate-900 dark:text-white tracking-tight max-w-2xl mx-auto">
            We believe AI should amplify human thinking, not replace it
          </h1>
          <p className="mt-5 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Aivora started as a simple idea: what if the best AI tools didn't require ten different subscriptions?
            Today, we're building the platform we always wished existed.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="section pt-0">
        <div className="container-page grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-5">Our story</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Aivora was founded in 2023 by Elena Marquez and Marcus Webb, two engineers who spent years watching
              their own teams juggle a patchwork of AI tools — one for chat, another for document review, a third
              for code review, and none of them talking to each other.
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              What started as an internal tool for their own team grew into a platform used by thousands of
              companies worldwide. Today, Aivora is built by a distributed team obsessed with making AI feel less
              like software and more like a genuine collaborator.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-5">
            {stats.map((s) => (
              <Card key={s.label} className="text-center">
                <p className="text-3xl font-display font-bold text-gradient">{s.value}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{s.label}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission / Vision */}
      <section className="section bg-slate-50 dark:bg-base-900/50">
        <div className="container-page grid md:grid-cols-2 gap-6">
          <Card>
            <div className="text-3xl mb-4">🎯</div>
            <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white mb-3">Our mission</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              To give every person and team access to AI that genuinely accelerates their best thinking — without
              complexity, without friction, and without compromise on trust.
            </p>
          </Card>
          <Card>
            <div className="text-3xl mb-4">🔭</div>
            <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white mb-3">Our vision</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              A world where the gap between having an idea and acting on it is as small as possible — where AI
              handles the busywork so people can focus on judgment, creativity, and connection.
            </p>
          </Card>
        </div>
      </section>

      {/* Timeline */}
      <section className="section">
        <div className="container-page max-w-3xl">
          <SectionHeading eyebrow="Timeline" title="Our journey so far" />
          <div className="relative border-l-2 border-brand-500/30 pl-8 space-y-10">
            {timeline.map((t) => (
              <div key={t.year} className="relative">
                <span className="absolute -left-[41px] top-0 w-5 h-5 rounded-full bg-hero-gradient shadow-glow" />
                <Badge tone="brand" className="mb-2">
                  {t.year}
                </Badge>
                <h3 className="text-lg font-display font-semibold text-slate-900 dark:text-white mb-1">{t.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{t.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section bg-slate-50 dark:bg-base-900/50">
        <div className="container-page">
          <SectionHeading eyebrow="Team" title="Meet the people building Aivora" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((m) => (
              <Card key={m.name} className="text-center">
                <div className="w-16 h-16 rounded-full bg-hero-gradient flex items-center justify-center text-white font-display font-bold text-lg mx-auto mb-4 shadow-glow">
                  {m.initials}
                </div>
                <h3 className="font-display font-semibold text-slate-900 dark:text-white">{m.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{m.role}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="container-page">
          <div className="rounded-3xl bg-hero-gradient px-8 py-16 text-center shadow-glow">
            <h2 className="text-3xl font-display font-bold text-white mb-4">Come build the future with us</h2>
            <p className="text-white/80 mb-8 max-w-md mx-auto">
              We're always looking for curious, driven people to join the team.
            </p>
            <Button to="/contact" variant="secondary" size="lg" className="!bg-white !text-brand-700">
              Get in touch
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
