import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import DashboardHeader from './DashboardHeader.jsx'

const titles = {
  '/dashboard': 'Overview',
  '/dashboard/chat': 'AI Chat',
  '/dashboard/history': 'Conversation History',
  '/dashboard/files': 'Files',
  '/dashboard/usage': 'Usage & Billing',
  '/dashboard/settings': 'Settings',
}

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { pathname } = useLocation()
  const title = titles[pathname] || 'Dashboard'
  const isChat = pathname === '/dashboard/chat'

  return (
    <div className="h-screen flex bg-slate-50 dark:bg-base-950 overflow-hidden">
      <aside className="hidden lg:block w-64 shrink-0">
        <Sidebar />
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 animate-fade-up">
            <Sidebar onNavigate={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader onMenuClick={() => setSidebarOpen(true)} title={title} />
        <div className={`flex-1 min-h-0 ${isChat ? '' : 'overflow-y-auto'}`}>
          <div className={isChat ? 'h-full' : 'p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full'}>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
