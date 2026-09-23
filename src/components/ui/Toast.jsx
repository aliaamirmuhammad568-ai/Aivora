const icons = {
  success: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  error: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
    </svg>
  ),
  info: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" strokeLinecap="round" />
    </svg>
  ),
}

const tones = {
  success: 'border-emerald-500/40 text-emerald-400',
  error: 'border-red-500/40 text-red-400',
  info: 'border-brand-500/40 text-brand-300',
}

export default function Toast({ message, type = 'info', onClose }) {
  return (
    <div
      role="status"
      className={`glass bg-white dark:bg-base-900 rounded-xl px-4 py-3 flex items-center gap-3 shadow-card border animate-fade-up ${tones[type]}`}
    >
      <span className="shrink-0">{icons[type]}</span>
      <p className="text-sm text-slate-700 dark:text-slate-200 flex-1">{message}</p>
      <button onClick={onClose} aria-label="Dismiss" className="text-slate-400 hover:text-slate-700 dark:hover:text-white">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  )
}
