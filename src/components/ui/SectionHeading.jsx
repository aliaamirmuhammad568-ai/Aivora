export default function SectionHeading({ eyebrow, title, description, align = 'center', className = '' }) {
  return (
    <div
      className={`max-w-2xl mb-14 ${align === 'center' ? 'mx-auto text-center' : 'text-left'} ${className}`}
    >
      {eyebrow && (
        <span className="inline-block text-xs font-semibold tracking-widest uppercase text-brand-500 dark:text-brand-400 mb-3">
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
        {title}
      </h2>
      {description && <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400">{description}</p>}
    </div>
  )
}
