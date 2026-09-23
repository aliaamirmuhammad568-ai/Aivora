import { Link } from 'react-router-dom'
import Button from '../components/ui/Button.jsx'
import Badge from '../components/ui/Badge.jsx'
import Card from '../components/ui/Card.jsx'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import FeatureCard from '../components/ui/FeatureCard.jsx'
import TestimonialCard from '../components/ui/TestimonialCard.jsx'
import PricingCard from '../components/ui/PricingCard.jsx'
import FaqAccordion from '../components/ui/FaqAccordion.jsx'
import { features, howItWorks, capabilities, useCases } from '../data/features.js'
import { testimonials, trustedBy } from '../data/testimonials.js'
import { pricingPlans } from '../data/pricing.js'
import { homeFaq } from '../data/faq.js'

export default function Home() {
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-grid-glow">
        <div className="container-page pt-20 pb-24 sm:pt-28 sm:pb-32">
          <div className="max-w-3xl mx-auto text-center">
            <Badge tone="brand" className="mb-6 animate-fade-up">
              ✨ Introducing Aivora 2.0
            </Badge>
            <h1 className="text-4xl sm:text-6xl font-display font-bold tracking-tight text-slate-900 dark:text-white animate-fade-up" style={{ animationDelay: '0.05s' }}>
              AI that works at the <span className="text-gradient">speed of your ideas.</span>
            </h1>
            <p className="mt-6 text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto animate-fade-up" style={{ animationDelay: '0.1s' }}>
              Chat, analyze documents, generate content, and write code — all in one intelligent workspace built for individuals and teams who move fast.
            </p>
            <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: '0.15s' }}>
              <Button to="/signup" size="lg">
                Start for free
              </Button>
              <Button
                to="/dashboard/chat"
                variant="secondary"
                size="lg"
                icon={
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                }
              >
                Start chat
              </Button>
              <Button to="/features" variant="ghost" size="lg">
                See how it works
              </Button>
            </div>
            <p className="mt-5 text-xs text-slate-400 dark:text-slate-500 animate-fade-up" style={{ animationDelay: '0.2s' }}>
              No credit card required &middot; Free forever plan available
            </p>
          </div>

          {/* Animated AI visual */}
          <div className="relative mt-16 sm:mt-20 max-w-4xl mx-auto animate-fade-up" style={{ animationDelay: '0.25s' }}>
            <div className="absolute -inset-8 bg-hero-gradient opacity-20 blur-3xl rounded-full animate-pulse-slow" />
            <Card hover={false} className="relative p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-4 px-2">
                <span className="w-3 h-3 rounded-full bg-red-400/70" />
                <span className="w-3 h-3 rounded-full bg-amber-400/70" />
                <span className="w-3 h-3 rounded-full bg-emerald-400/70" />
                <span className="ml-3 text-xs text-slate-400">Aivora Chat</span>
              </div>
              <div className="space-y-4 px-2 pb-2">
                <div className="flex justify-end">
                  <div className="bg-hero-gradient text-white text-sm rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-xs shadow-glow">
                    Summarize our Q3 investor deck in 3 bullet points.
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="glass text-sm rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-md text-slate-700 dark:text-slate-200">
                    <p className="mb-1">✦ Revenue up 38% QoQ, driven by Pro plan upgrades</p>
                    <p className="mb-1">✦ Enterprise pipeline grew to $2.1M ARR</p>
                    <p>✦ Churn reduced from 4.1% to 2.6% after onboarding revamp</p>
                  </div>
                </div>
                <div className="flex justify-start items-center gap-2 glass w-fit rounded-2xl px-4 py-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-400 typing-dot" />
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-400 typing-dot" />
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-400 typing-dot" />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* TRUSTED BY */}
      <section className="pb-20">
        <div className="container-page">
          <p className="text-center text-xs font-semibold tracking-widest uppercase text-slate-400 mb-8">
            Trusted by fast-moving teams
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-70">
            {trustedBy.map((name) => (
              <span key={name} className="text-lg font-display font-bold text-slate-400 dark:text-slate-600">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="section">
        <div className="container-page">
          <SectionHeading
            eyebrow="Features"
            title="Everything you need, in one workspace"
            description="Aivora combines the AI capabilities your team actually uses into a single, polished platform."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.slice(0, 4).map((f) => (
              <FeatureCard key={f.id} icon={f.icon} title={f.title} description={f.description} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Button to="/features" variant="secondary">
              Explore all features
            </Button>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section bg-slate-50 dark:bg-base-900/50">
        <div className="container-page">
          <SectionHeading eyebrow="How it works" title="From question to answer in three steps" />
          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((step) => (
              <div key={step.step} className="text-center">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-hero-gradient flex items-center justify-center text-white font-display font-bold text-xl shadow-glow mb-5">
                  {step.step}
                </div>
                <h3 className="text-lg font-display font-semibold text-slate-900 dark:text-white mb-2">{step.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xs mx-auto">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CAPABILITIES */}
      <section className="section">
        <div className="container-page">
          <SectionHeading eyebrow="Capabilities" title="Built for speed, depth, and trust" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {capabilities.map((c) => (
              <Card key={c.title} className="text-center">
                <div className="text-3xl mb-3">{c.icon}</div>
                <h3 className="font-display font-semibold text-slate-900 dark:text-white mb-1.5">{c.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{c.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* USE CASES */}
      <section className="section bg-slate-50 dark:bg-base-900/50">
        <div className="container-page">
          <SectionHeading eyebrow="Use cases" title="Built for every kind of team" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((u) => (
              <Card key={u.title}>
                <div className="text-3xl mb-3">{u.icon}</div>
                <h3 className="font-display font-semibold text-slate-900 dark:text-white mb-1.5">{u.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{u.description}</p>
              </Card>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button to="/solutions" variant="secondary">
              See solutions by role
            </Button>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section">
        <div className="container-page">
          <SectionHeading eyebrow="Testimonials" title="Loved by teams around the world" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.slice(0, 3).map((t) => (
              <TestimonialCard key={t.name} {...t} />
            ))}
          </div>
        </div>
      </section>

      {/* PRICING PREVIEW */}
      <section className="section bg-slate-50 dark:bg-base-900/50">
        <div className="container-page">
          <SectionHeading eyebrow="Pricing" title="Simple, transparent pricing" description="Start free. Upgrade when you're ready." />
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan) => (
              <PricingCard key={plan.id} plan={plan} billing="monthly" popular={plan.popular} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/pricing" className="text-sm font-semibold text-brand-500 hover:text-brand-600">
              Compare all plan features &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section">
        <div className="container-page max-w-3xl">
          <SectionHeading eyebrow="FAQ" title="Frequently asked questions" />
          <FaqAccordion items={homeFaq} />
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="pb-24">
        <div className="container-page">
          <div className="relative rounded-3xl overflow-hidden bg-hero-gradient px-8 py-16 sm:py-20 text-center shadow-glow">
            <div className="relative max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
                Ready to think faster?
              </h2>
              <p className="text-white/80 text-lg mb-8">
                Join thousands of teams already building with Aivora. Get started in under a minute.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button to="/signup" variant="secondary" size="lg" className="!bg-white !text-brand-700 hover:!brightness-95">
                  Get started for free
                </Button>
                <Button to="/contact" variant="secondary" size="lg" className="!bg-white/10 !text-white !border-white/30 hover:!bg-white/20">
                  Talk to sales
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
