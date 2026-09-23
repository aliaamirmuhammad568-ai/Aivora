import { Link } from 'react-router-dom'
import Logo from './Logo.jsx'

const columns = [
  {
    title: 'Product',
    links: [
      { label: 'Features', to: '/features' },
      { label: 'Solutions', to: '/solutions' },
      { label: 'Pricing', to: '/pricing' },
      { label: 'Dashboard', to: '/dashboard' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', to: '/about' },
      { label: 'Blog', to: '/blog' },
      { label: 'Contact', to: '/contact' },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'Log in', to: '/login' },
      { label: 'Sign up', to: '/signup' },
      { label: 'Forgot password', to: '/forgot-password' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-white/10 mt-auto">
      <div className="container-page py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          <div className="col-span-2">
            <Logo />
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400 max-w-xs">
              AI that works at the speed of your ideas. Built for individuals and teams who move fast.
            </p>
            <div className="flex gap-3 mt-5">
              {['X', 'in', 'gh'].map((s) => (
                <a
                  key={s}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  aria-label={s}
                  className="w-9 h-9 rounded-lg glass flex items-center justify-center text-xs font-semibold text-slate-500 dark:text-slate-300 hover:text-brand-500 hover:border-brand-400/50 transition-colors"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      className="text-sm text-slate-500 dark:text-slate-400 hover:text-brand-500 dark:hover:text-brand-300 transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 pt-8 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 dark:text-slate-500">&copy; {new Date().getFullYear()} Aivora, Inc. All rights reserved.</p>
          <div className="flex gap-6 text-xs text-slate-500 dark:text-slate-500">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Security</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
