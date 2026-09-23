import Logo from './Logo.jsx'

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen bg-grid-glow bg-white dark:bg-base-950 flex items-center justify-center px-5 py-12">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Logo />
        </div>
        <div className="glass rounded-2xl p-8 shadow-card">
          <div className="text-center mb-7">
            <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white">{title}</h1>
            {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{subtitle}</p>}
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
