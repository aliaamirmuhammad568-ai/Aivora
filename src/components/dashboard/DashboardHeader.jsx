import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ThemeToggle from '../layout/ThemeToggle.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

export default function DashboardHeader({ onMenuClick, title = 'Dashboard' }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const displayName = user?.name || 'Ahmad Khan'
  const displayEmail = user?.email || 'ahmad@aivora.ai'
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <header className="h-16 flex items-center justify-between px-4 sm:px-6 border-b border-slate-200 dark:border-white/10 bg-white/80 dark:bg-base-900/80 backdrop-blur-lg sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-500/10"
          aria-label="Open sidebar"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
          </svg>
        </button>
        <h1 className="font-display font-semibold text-slate-900 dark:text-white text-base sm:text-lg">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        <button
          className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-300 hover:bg-slate-500/10 relative"
          aria-label="Notifications"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-500" />
        </button>
        <div className="relative">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="w-9 h-9 rounded-full bg-hero-gradient flex items-center justify-center text-white text-sm font-semibold overflow-hidden"
            aria-label="Account menu"
            aria-expanded={menuOpen}
          >
            {user?.avatar ? <img src={user.avatar} alt="" className="w-full h-full object-cover" /> : initials}
          </button>
          {menuOpen && (
            <div
              className="absolute right-0 mt-2 w-48 glass bg-white dark:bg-base-900 rounded-xl shadow-card py-2 animate-fade-up"
              onMouseLeave={() => setMenuOpen(false)}
            >
              <div className="px-4 py-2 border-b border-slate-200 dark:border-white/10">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{displayName}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{displayEmail}</p>
              </div>
              <Link to="/dashboard/settings" className="block px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-500/10">
                Settings
              </Link>
              <Link to="/dashboard/usage" className="block px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-500/10">
                Usage & Billing
              </Link>
              <button onClick={handleLogout} className="w-full text-left block px-4 py-2 text-sm text-red-500 hover:bg-red-500/10">
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
