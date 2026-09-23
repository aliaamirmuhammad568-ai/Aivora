import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import Logo from './Logo.jsx'
import ThemeToggle from './ThemeToggle.jsx'
import Button from '../ui/Button.jsx'

const links = [
  { to: '/features', label: 'Features' },
  { to: '/solutions', label: 'Solutions' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/blog', label: 'Blog' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass shadow-card' : 'bg-transparent border-b border-transparent'
      }`}
    >
      <nav className="container-page flex items-center justify-between h-16 sm:h-18" aria-label="Main navigation">
        <Logo />

        <div className="hidden lg:flex items-center gap-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-brand-500 dark:text-brand-300'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-2">
          <ThemeToggle />
          <Button to="/login" variant="ghost" size="sm">
            Log in
          </Button>
          <Button to="/signup" variant="primary" size="sm">
            Get started
          </Button>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-700 dark:text-white hover:bg-slate-500/10"
          >
            {open ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {open && (
        <div className="lg:hidden glass border-t border-slate-200 dark:border-white/10 px-5 py-5 flex flex-col gap-1 animate-fade-up">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive ? 'text-brand-500 bg-brand-500/10' : 'text-slate-600 dark:text-slate-300'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <div className="flex gap-2 mt-3">
            <Button to="/login" variant="secondary" size="sm" className="flex-1" onClick={() => setOpen(false)}>
              Log in
            </Button>
            <Button to="/signup" variant="primary" size="sm" className="flex-1" onClick={() => setOpen(false)}>
              Get started
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
