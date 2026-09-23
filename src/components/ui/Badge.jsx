const tones = {
  brand: 'bg-brand-500/15 text-brand-300 border-brand-500/30',
  accent: 'bg-accent-500/15 text-accent-400 border-accent-500/30',
  green: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  amber: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  red: 'bg-red-500/15 text-red-400 border-red-500/30',
  neutral: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
}

export default function Badge({ children, tone = 'brand', className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  )
}
