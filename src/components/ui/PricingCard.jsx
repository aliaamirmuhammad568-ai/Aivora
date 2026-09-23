import Button from './Button.jsx'
import Badge from './Badge.jsx'

export default function PricingCard({ plan, billing, popular, onSelect }) {
  const price = billing === 'yearly' ? plan.priceYearly : plan.priceMonthly
  return (
    <div
      className={`relative rounded-2xl p-8 flex flex-col h-full transition-all duration-300 ${
        popular
          ? 'bg-hero-gradient shadow-glow scale-[1.03] lg:scale-105'
          : 'glass card-hover'
      }`}
    >
      {popular && (
        <Badge tone="neutral" className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-brand-700 border-white">
          Most Popular
        </Badge>
      )}
      <h3 className={`text-lg font-display font-semibold ${popular ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
        {plan.name}
      </h3>
      <p className={`text-sm mt-1 ${popular ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'}`}>
        {plan.description}
      </p>
      <div className="mt-6 flex items-baseline gap-1">
        <span className={`text-4xl font-display font-bold ${popular ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
          {typeof price === 'number' ? `$${price}` : price}
        </span>
        {typeof price === 'number' && (
          <span className={`text-sm ${popular ? 'text-white/70' : 'text-slate-500 dark:text-slate-400'}`}>
            /{billing === 'yearly' ? 'mo, billed yearly' : 'month'}
          </span>
        )}
      </div>
      <Button
        variant={popular ? 'secondary' : 'primary'}
        className={`mt-6 w-full ${popular ? '!bg-white !text-brand-700 hover:!brightness-95' : ''}`}
        onClick={() => onSelect?.(plan)}
      >
        {plan.cta}
      </Button>
      <ul className="mt-8 space-y-3 flex-1">
        {plan.features.map((f) => (
          <li key={f} className={`flex items-start gap-2.5 text-sm ${popular ? 'text-white/90' : 'text-slate-600 dark:text-slate-300'}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="shrink-0 mt-0.5">
              <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {f}
          </li>
        ))}
      </ul>
    </div>
  )
}
