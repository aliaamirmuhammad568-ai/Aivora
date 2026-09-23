const providers = [
  { name: 'Google', icon: 'G', href: '/api/auth/google' },
  { name: 'GitHub', icon: '⌥', href: '/api/auth/github' },
]

export default function SocialLoginButtons() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {providers.map((p) => (
        <a
          key={p.name}
          href={p.href}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-white/5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors"
        >
          <span className="font-bold">{p.icon}</span>
          {p.name}
        </a>
      ))}
    </div>
  )
}
