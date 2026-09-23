import { forwardRef, useState } from 'react'

const Input = forwardRef(function Input(
  { label, error, success, type = 'text', className = '', id, hint, ...props },
  ref,
) {
  const [show, setShow] = useState(false)
  const isPassword = type === 'password'
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          type={isPassword ? (show ? 'text' : 'password') : type}
          className={`w-full px-4 py-2.5 rounded-xl bg-white dark:bg-white/5 border ${
            error
              ? 'border-red-500 focus:ring-red-400'
              : success
              ? 'border-emerald-500 focus:ring-emerald-400'
              : 'border-slate-300 dark:border-white/10 focus:ring-brand-400'
          } text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
            isPassword ? 'pr-11' : ''
          } ${className}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            aria-label={show ? 'Hide password' : 'Show password'}
          >
            {show ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17.94 17.94A10.94 10.94 0 0112 20c-7 0-11-8-11-8a20.6 20.6 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a20.7 20.7 0 01-3.22 4.36M1 1l22 22M9.53 9.53a3 3 0 004.24 4.24" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        )}
      </div>
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
      {!error && hint && <p className="mt-1.5 text-xs text-slate-400">{hint}</p>}
    </div>
  )
})

export default Input
