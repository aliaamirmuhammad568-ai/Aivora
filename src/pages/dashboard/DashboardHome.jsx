import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import Badge from '../../components/ui/Badge.jsx'
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx'
import { conversations, files, recentActivity } from '../../data/dashboard.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { fetchUsage } from '../../data/usageClient.js'

const quickActions = [
  { icon: '💬', label: 'New chat', to: '/dashboard/chat' },
  { icon: '📁', label: 'Upload file', to: '/dashboard/files' },
  { icon: '📊', label: 'View usage', to: '/dashboard/usage' },
  { icon: '⚙️', label: 'Settings', to: '/dashboard/settings' },
]

export default function DashboardHome() {
  const { user } = useAuth()
  const firstName = user?.name?.split(' ')[0] || 'there'

  const [usage, setUsage] = useState(null)
  const [usageLoading, setUsageLoading] = useState(true)

  useEffect(() => {
    fetchUsage()
      .then(setUsage)
      .catch(() => setUsage(null))
      .finally(() => setUsageLoading(false))
  }, [])

  const maxUsage = Math.max(1, ...(usage?.monthly.map((u) => u.value) || [1]))

  return (
    <div className="space-y-8 pb-8">
      <div>
        <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white">Welcome back, {firstName} 👋</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Here's what's happening in your workspace.</p>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {quickActions.map((a) => (
          <Link key={a.label} to={a.to} className="glass card-hover rounded-2xl p-5 text-center">
            <div className="text-2xl mb-2">{a.icon}</div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{a.label}</p>
          </Link>
        ))}
      </div>

      {/* Stats — real, pulled live from your chat usage */}
      {usageLoading ? (
        <div className="flex justify-center py-10">
          <LoadingSpinner size={24} />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-5">
          <Card>
            <p className="text-sm text-slate-500 dark:text-slate-400">Messages sent (all time)</p>
            <p className="text-3xl font-display font-bold text-slate-900 dark:text-white mt-1">
              {(usage?.messagesUsed ?? 0).toLocaleString()}
            </p>
            <Badge tone="green" className="mt-3">Free plan · Unlimited</Badge>
          </Card>
          <Card>
            <p className="text-sm text-slate-500 dark:text-slate-400">Tokens used (all time)</p>
            <p className="text-3xl font-display font-bold text-slate-900 dark:text-white mt-1">
              {(usage?.tokensUsed ?? 0).toLocaleString()}
            </p>
          </Card>
        </div>
      )}

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Usage chart — real */}
        <Card className="lg:col-span-3">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-semibold text-slate-900 dark:text-white">Messages per month</h3>
            <Link to="/dashboard/usage" className="text-xs text-brand-500 hover:text-brand-600 font-medium">
              View details
            </Link>
          </div>
          {usageLoading ? (
            <div className="flex justify-center h-40 items-center">
              <LoadingSpinner size={24} />
            </div>
          ) : !usage?.monthly.length ? (
            <p className="text-sm text-slate-500 dark:text-slate-400 py-8 text-center">
              No chat activity yet — send a message in AI Chat to see it here.
            </p>
          ) : (
            <div className="flex items-end justify-between gap-3 h-40">
              {usage.monthly.map((m) => (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full rounded-t-lg bg-hero-gradient transition-all"
                    style={{ height: `${(m.value / maxUsage) * 100}%`, minHeight: m.value > 0 ? '4px' : 0 }}
                    title={`${m.value} messages`}
                  />
                  <span className="text-xs text-slate-400">{m.month}</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Recent activity */}
        <Card className="lg:col-span-2">
          <h3 className="font-display font-semibold text-slate-900 dark:text-white mb-5">Recent activity</h3>
          <ul className="space-y-4">
            {recentActivity.map((a) => (
              <li key={a.id} className="flex items-start gap-3">
                <span className="w-8 h-8 rounded-lg bg-brand-500/10 text-brand-500 flex items-center justify-center text-sm shrink-0">
                  {a.type === 'chat' ? '💬' : a.type === 'file' ? '📁' : '⚙️'}
                </span>
                <div>
                  <p className="text-sm text-slate-700 dark:text-slate-200 leading-snug">{a.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{a.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent conversations */}
        <Card>
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display font-semibold text-slate-900 dark:text-white">Recent conversations</h3>
            <Link to="/dashboard/history" className="text-xs text-brand-500 hover:text-brand-600 font-medium">
              View all
            </Link>
          </div>
          <ul className="space-y-1">
            {conversations.slice(0, 4).map((c) => (
              <li key={c.id}>
                <Link to="/dashboard/chat" className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-500/10 transition-colors">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">{c.title}</p>
                    <p className="text-xs text-slate-400 truncate">{c.preview}</p>
                  </div>
                  <span className="text-xs text-slate-400 shrink-0">{c.date}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Card>

        {/* Recent files */}
        <Card>
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display font-semibold text-slate-900 dark:text-white">Recent files</h3>
            <Link to="/dashboard/files" className="text-xs text-brand-500 hover:text-brand-600 font-medium">
              View all
            </Link>
          </div>
          <ul className="space-y-1">
            {files.slice(0, 4).map((f) => (
              <li key={f.id}>
                <Link to="/dashboard/files" className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-500/10 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-lg shrink-0">
                      {f.type === 'pdf' ? '📕' : f.type === 'csv' ? '📊' : f.type === 'doc' ? '📄' : f.type === 'sheet' ? '📈' : '🖼️'}
                    </span>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">{f.name}</p>
                  </div>
                  <span className="text-xs text-slate-400 shrink-0">{f.size}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-display font-semibold text-slate-900 dark:text-white">On the Free plan</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Unlock team collaboration and admin controls with Business.</p>
        </div>
        <Button to="/pricing" variant="secondary">
          Upgrade plan
        </Button>
      </Card>
    </div>
  )
}
