import { useEffect, useState } from 'react'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import Badge from '../../components/ui/Badge.jsx'
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx'
import { fetchUsage } from '../../data/usageClient.js'

export default function Usage() {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsage()
      .then(setStats)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <LoadingSpinner size={28} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="pb-8">
        <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-2">Usage & Billing</h2>
        <p className="text-sm text-red-400">{error}</p>
      </div>
    )
  }

  const maxUsage = Math.max(1, ...stats.monthly.map((m) => m.value))

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white">Usage & Billing</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Your real usage of Aivora's AI chat, pulled live from your account.
        </p>
      </div>

      <Card className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-display font-semibold text-lg text-slate-900 dark:text-white">Current plan</h3>
            <Badge tone="brand">Free</Badge>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Unlimited messages while Aivora is in free preview.
          </p>
        </div>
        <Button to="/pricing" variant="secondary">
          View plans
        </Button>
      </Card>

      <div className="grid sm:grid-cols-2 gap-5">
        <Card>
          <p className="text-sm text-slate-500 dark:text-slate-400">Tokens used (all time)</p>
          <p className="text-3xl font-display font-bold text-slate-900 dark:text-white mt-1">
            {stats.tokensUsed.toLocaleString()}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500 dark:text-slate-400">Messages sent (all time)</p>
          <p className="text-3xl font-display font-bold text-slate-900 dark:text-white mt-1">
            {stats.messagesUsed.toLocaleString()}
          </p>
        </Card>
      </div>

      <Card>
        <h3 className="font-display font-semibold text-slate-900 dark:text-white mb-6">Messages per month</h3>
        {stats.monthly.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400 py-8 text-center">
            No chat activity yet — send a message in AI Chat to see your usage here.
          </p>
        ) : (
          <div className="flex items-end justify-between gap-4 h-48">
            {stats.monthly.map((m) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-2 group">
                <span className="text-xs text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">{m.value}</span>
                <div
                  className="w-full rounded-t-lg bg-hero-gradient transition-all hover:brightness-110"
                  style={{ height: `${(m.value / maxUsage) * 100}%`, minHeight: m.value > 0 ? '4px' : 0 }}
                />
                <span className="text-xs text-slate-400">{m.month}</span>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-display font-semibold text-slate-900 dark:text-white">Need more capacity?</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Business plans include unlimited tokens and team-wide usage analytics.
          </p>
        </div>
        <Button to="/pricing" variant="primary">
          View Business plan
        </Button>
      </Card>
    </div>
  )
}
