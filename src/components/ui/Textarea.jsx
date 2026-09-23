import { forwardRef } from 'react'

const Textarea = forwardRef(function Textarea(
  { label, error, className = '', id, rows = 5, ...props },
  ref,
) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={inputId}
        rows={rows}
        className={`w-full px-4 py-2.5 rounded-xl bg-white dark:bg-white/5 border ${
          error ? 'border-red-500 focus:ring-red-400' : 'border-slate-300 dark:border-white/10 focus:ring-brand-400'
        } text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors resize-none ${className}`}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  )
})

export default Textarea
