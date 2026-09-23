export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      {icon && (
        <div className="w-14 h-14 rounded-2xl bg-brand-500/10 text-brand-400 flex items-center justify-center mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-display font-semibold text-slate-800 dark:text-white mb-1.5">{title}</h3>
      {description && <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-5">{description}</p>}
      {action}
    </div>
  )
}
