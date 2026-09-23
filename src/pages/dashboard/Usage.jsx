import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import Badge from '../../components/ui/Badge.jsx'
import { usageMonthly, usageStats } from '../../data/dashboard.js'

const maxUsage = Math.max(...usageMonthly.map((u) => u.value))

export default function Usage() {
  const tokenPct = Math.round((usageStats.tokensUsed / usageStats.tokensLimit) * 100)

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white">Usage & Billing</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Track your token usage and current plan details.</p>
      </div>

      <Card className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-display font-semibold text-lg text-slate-900 dark:text-white">Current plan</h3>
            <Badge tone="brand">{usageStats.plan}</Badge>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {usageStats.daysRemaining} days remaining in this billing cycle
          </p>
        </div>
        <Button to="/pricing" variant="secondary">
          Upgrade plan
        </Button>
      </Card>

      <div className="grid sm:grid-cols-3 gap-5">
        <Card>
          <p className="text-sm text-slate-500 dark:text-slate-400">Tokens used</p>
          <p className="text-2xl font-display font-bold text-slate-900 dark:text-white mt-1">
            {usageStats.tokensUsed.toLocaleString()}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">of {usageStats.tokensLimit.toLocaleString()} limit</p>
          <div className="w-full h-2 bg-slate-200 dark:bg-white/10 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-hero-gradient rounded-full" style={{ width: `${tokenPct}%` }} />
          </div>
          <p className="text-xs text-slate-400 mt-1.5">{tokenPct}% used</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500 dark:text-slate-400">Messages sent</p>
          <p className="text-2xl font-display font-bold text-slate-900 dark:text-white mt-1">
            {usageStats.messagesUsed.toLocaleString()}
          </p>
          <Badge tone="green" className="mt-3">Unlimited on Pro</Badge>
        </Card>
        <Card>
          <p className="text-sm text-slate-500 dark:text-slate-400">Files analyzed</p>
          <p className="text-2xl font-display font-bold text-slate-900 dark:text-white mt-1">{usageStats.filesAnalyzed}</p>
          <Badge tone="green" className="mt-3">Unlimited on Pro</Badge>
        </Card>
      </div>

      <Card>
        <h3 className="font-display font-semibold text-slate-900 dark:text-white mb-6">Monthly usage trend</h3>
        <div className="flex items-end justify-between gap-4 h-48">
          {usageMonthly.map((m) => (
            <div key={m.month} className="flex-1 flex flex-col items-center gap-2 group">
              <span className="text-xs text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">{m.value}</span>
              <div
                className="w-full rounded-t-lg bg-hero-gradient transition-all hover:brightness-110"
                style={{ height: `${(m.value / maxUsage) * 100}%` }}
              />
              <span className="text-xs text-slate-400">{m.month}</span>
            </div>
          ))}
        </div>
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
