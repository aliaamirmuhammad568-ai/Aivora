import Card from './Card.jsx'

export default function TestimonialCard({ quote, name, role, avatar }) {
  return (
    <Card className="h-full flex flex-col">
      <div className="flex gap-1 text-amber-400 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z" />
          </svg>
        ))}
      </div>
      <p className="text-slate-700 dark:text-slate-300 leading-relaxed flex-1">&ldquo;{quote}&rdquo;</p>
      <div className="flex items-center gap-3 mt-6">
        <div
          className="w-10 h-10 rounded-full bg-hero-gradient flex items-center justify-center text-white font-semibold text-sm shrink-0"
        >
          {avatar}
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">{name}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{role}</p>
        </div>
      </div>
    </Card>
  )
}
