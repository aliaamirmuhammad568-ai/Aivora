import Card from './Card.jsx'

export default function FeatureCard({ icon, title, description, className = '' }) {
  return (
    <Card className={`h-full ${className}`}>
      <div className="w-12 h-12 rounded-xl bg-hero-gradient flex items-center justify-center text-white mb-5 shadow-glow">
        {icon}
      </div>
      <h3 className="text-lg font-display font-semibold text-slate-900 dark:text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{description}</p>
    </Card>
  )
}
