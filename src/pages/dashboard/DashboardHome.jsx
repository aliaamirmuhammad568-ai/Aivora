import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import Badge from '../../components/ui/Badge.jsx'
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { fetchUsage } from '../../data/usageClient.js'
import { listConversations } from '../../data/conversationsClient.js'
import { listFiles } from '../../data/filesClient.js'
import { fetchActivity } from '../../data/activityClient.js'

const quickActions = [
  { icon: '💬', label: 'New chat', to: '/dashboard/chat' },
  { icon: '📁', label: 'Upload file', to: '/dashboard/files' },
  { icon: '📊', label: 'View usage', to: '/dashboard/usage' },
  { icon: '⚙️', label: 'Settings', to: '/dashboard/settings' },
]

function timeAgo(iso) {
  const diffMs = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins} min${mins === 1 ? '' : 's'} ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`
  const days = Math.floor(hours / 24)
  if (days === 1) return 'Yesterday'
  return `${days} days ago`
}

function fileIcon(mimeType) {
  if (mimeType?.startsWith('image/')) return '🖼️'
  if (mimeType?.startsWith('video/')) return '🎞️'
  return '📄'
}

export default function DashboardHome() {
  const { user } = useAuth()
  const firstName = user?.name?.split(' ')[0] || 'there'

  const [usage, setUsage] = useState(null)
  const [usageLoading, setUsageLoading] = useState(true)
  const [conversations, setConversations] = useState([])
  const [files, setFiles] = useState([])
  const [activity, setActivity] = useState([])
  const [sideLoading, setSideLoading] = useState(true)

  useEffect(() => {
    fetchUsage()
      .then(setUsage)
      .catch(() => setUsage(null))
      .finally(() => setUsageLoading(false))

    Promise.all([
      listConversations().catch(() => []),
      listFiles().catch(() => []),
      fetchActivity().catch(() => []),
    ])
      .then(([c, f, a]) => {
        setConversations(c)
        setFiles(f)
        setActivity(a)
      })
      .finally(() => setSideLoading(false))
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

        {/* Recent activity — real */}
        <Card className="lg:col-span-2">
          <h3 className="font-display font-semibold text-slate-900 dark:text-white mb-5">Recent activity</h3>
          {sideLoading ? (
            <div className="flex justify-center py-6">
              <LoadingSpinner size={20} />
            </div>
          ) : activity.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400 py-6 text-center">
              No activity yet — start a chat or upload a file.
            </p>
          ) : (
            <ul className="space-y-4">
              {activity.map((a) => (
                <li key={a.id} className="flex items-start gap-3">
                  <span className="w-8 h-8 rounded-lg bg-brand-500/10 text-brand-500 flex items-center justify-center text-sm shrink-0">
                    {a.type === 'chat' ? '💬' : a.type === 'file' ? '📁' : '⚙️'}
                  </span>
                  <div>
                    <p className="text-sm text-slate-700 dark:text-slate-200 leading-snug">{a.label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{timeAgo(a.createdAt)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent conversations — real */}
        <Card>
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display font-semibold text-slate-900 dark:text-white">Recent conversations</h3>
            <Link to="/dashboard/history" className="text-xs text-brand-500 hover:text-brand-600 font-medium">
              View all
            </Link>
          </div>
          {sideLoading ? (
            <div className="flex justify-center py-6">
              <LoadingSpinner size={20} />
            </div>
          ) : conversations.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400 py-6 text-center">No conversations yet.</p>
          ) : (
            <ul className="space-y-1">
              {conversations.slice(0, 4).map((c) => (
                <li key={c.id}>
                  <Link to={`/dashboard/chat?c=${c.id}`} className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-500/10 transition-colors">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">{c.title}</p>
                      <p className="text-xs text-slate-400 truncate">{c.preview}</p>
                    </div>
                    <span className="text-xs text-slate-400 shrink-0">{timeAgo(c.updatedAt)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Recent files — real */}
        <Card>
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display font-semibold text-slate-900 dark:text-white">Recent files</h3>
            <Link to="/dashboard/files" className="text-xs text-brand-500 hover:text-brand-600 font-medium">
              View all
            </Link>
          </div>
          {sideLoading ? (
            <div className="flex justify-center py-6">
              <LoadingSpinner size={20} />
            </div>
          ) : files.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400 py-6 text-center">No files yet.</p>
          ) : (
            <ul className="space-y-1">
              {files.slice(0, 4).map((f) => (
                <li key={f.id}>
                  <Link to="/dashboard/files" className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-500/10 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-lg shrink-0">{fileIcon(f.mimeType)}</span>
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">{f.name}</p>
                    </div>
                    <span className="text-xs text-slate-400 shrink-0">{timeAgo(f.createdAt)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
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
