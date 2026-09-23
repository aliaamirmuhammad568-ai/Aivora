import { NavLink } from 'react-router-dom'
import Logo from '../layout/Logo.jsx'

const navItems = [
  { to: '/dashboard', label: 'Overview', icon: '🏠', end: true },
  { to: '/dashboard/chat', label: 'AI Chat', icon: '💬' },
  { to: '/dashboard/history', label: 'History', icon: '🕘' },
  { to: '/dashboard/files', label: 'Files', icon: '📁' },
  { to: '/dashboard/usage', label: 'Usage', icon: '📊' },
  { to: '/dashboard/settings', label: 'Settings', icon: '⚙️' },
]

export default function Sidebar({ onNavigate }) {
  return (
    <div className="h-full flex flex-col bg-white dark:bg-base-900 border-r border-slate-200 dark:border-white/10">
      <div className="h-16 flex items-center px-5 border-b border-slate-200 dark:border-white/10">
        <Logo />
      </div>
      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-hero-gradient text-white shadow-glow'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-500/10'
              }`
            }
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-200 dark:border-white/10">
        <NavLink
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-500/10"
        >
          <span>↩</span> Back to site
        </NavLink>
      </div>
    </div>
  )
}
