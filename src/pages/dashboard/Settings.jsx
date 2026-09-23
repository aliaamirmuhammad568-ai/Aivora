import { useEffect, useState } from 'react'
import Card from '../../components/ui/Card.jsx'
import Input from '../../components/ui/Input.jsx'
import Button from '../../components/ui/Button.jsx'
import Badge from '../../components/ui/Badge.jsx'
import { useTheme } from '../../context/ThemeContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

const tabs = [
  { id: 'profile', label: 'Profile', icon: '👤' },
  { id: 'appearance', label: 'Appearance', icon: '🎨' },
  { id: 'notifications', label: 'Notifications', icon: '🔔' },
  { id: 'security', label: 'Security', icon: '🔒' },
  { id: 'billing', label: 'Billing', icon: '💳' },
]

function Toggle({ checked, onChange, label, description }) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{label}</p>
        {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        role="switch"
        aria-checked={checked}
        className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${checked ? 'bg-hero-gradient' : 'bg-slate-300 dark:bg-white/15'}`}
      >
        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </button>
    </div>
  )
}

export default function Settings() {
  const [tab, setTab] = useState('profile')
  const { theme, setTheme } = useTheme()
  const toast = useToast()
  const { user } = useAuth()

  const [profile, setProfile] = useState({ name: 'Ahmad Khan', email: 'ahmad@aivora.ai', bio: 'Building things with AI.' })
  const [notifs, setNotifs] = useState({ product: true, security: true, marketing: false, weekly: true })
  const [accentDensity, setAccentDensity] = useState('comfortable')

  useEffect(() => {
    if (user) {
      setProfile((p) => ({ ...p, name: user.name || p.name, email: user.email || p.email }))
    }
  }, [user])

  const saveProfile = (e) => {
    e.preventDefault()
    toast.success('Profile updated')
  }

  return (
    <div className="pb-8">
      <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-6">Settings</h2>

      <div className="flex flex-col lg:flex-row gap-6">
        <nav className="lg:w-56 shrink-0 flex lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                tab === t.id ? 'bg-hero-gradient text-white shadow-glow' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-500/10'
              }`}
            >
              <span>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </nav>

        <div className="flex-1 min-w-0">
          {tab === 'profile' && (
            <Card hover={false}>
              <h3 className="font-display font-semibold text-lg text-slate-900 dark:text-white mb-5">Profile information</h3>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-hero-gradient flex items-center justify-center text-white text-xl font-semibold">
                  AK
                </div>
                <div>
                  <Button variant="secondary" size="sm">Change avatar</Button>
                  <p className="text-xs text-slate-400 mt-1.5">JPG, PNG. 2MB max.</p>
                </div>
              </div>
              <form onSubmit={saveProfile} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <Input label="Full name" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
                  <Input label="Email" type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
                </div>
                <Input label="Bio" value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} />
                <Button type="submit">Save changes</Button>
              </form>
            </Card>
          )}

          {tab === 'appearance' && (
            <Card hover={false}>
              <h3 className="font-display font-semibold text-lg text-slate-900 dark:text-white mb-5">Appearance</h3>
              <div className="mb-6">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Theme</p>
                <div className="grid grid-cols-2 gap-3 max-w-sm">
                  {['dark', 'light'].map((th) => (
                    <button
                      key={th}
                      onClick={() => setTheme(th)}
                      className={`rounded-xl border-2 p-4 text-left transition-colors capitalize ${
                        theme === th ? 'border-brand-500' : 'border-slate-200 dark:border-white/10'
                      }`}
                    >
                      <div className={`w-full h-12 rounded-lg mb-2 ${th === 'dark' ? 'bg-base-900' : 'bg-slate-100 border border-slate-200'}`} />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{th}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Layout density</p>
                <div className="flex gap-2">
                  {['comfortable', 'compact'].map((d) => (
                    <button
                      key={d}
                      onClick={() => setAccentDensity(d)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                        accentDensity === d ? 'bg-hero-gradient text-white' : 'glass text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {tab === 'notifications' && (
            <Card hover={false}>
              <h3 className="font-display font-semibold text-lg text-slate-900 dark:text-white mb-2">Notification preferences</h3>
              <p className="text-sm text-slate-400 mb-3">Choose what you want to be notified about.</p>
              <div className="divide-y divide-slate-200 dark:divide-white/10">
                <Toggle
                  checked={notifs.product}
                  onChange={(v) => setNotifs({ ...notifs, product: v })}
                  label="Product updates"
                  description="New features and platform changes"
                />
                <Toggle
                  checked={notifs.security}
                  onChange={(v) => setNotifs({ ...notifs, security: v })}
                  label="Security alerts"
                  description="Sign-ins from new devices and locations"
                />
                <Toggle
                  checked={notifs.marketing}
                  onChange={(v) => setNotifs({ ...notifs, marketing: v })}
                  label="Marketing emails"
                  description="Tips, offers, and product news"
                />
                <Toggle
                  checked={notifs.weekly}
                  onChange={(v) => setNotifs({ ...notifs, weekly: v })}
                  label="Weekly usage summary"
                  description="A digest of your workspace activity"
                />
              </div>
              <Button className="mt-5" onClick={() => toast.success('Notification preferences saved')}>
                Save preferences
              </Button>
            </Card>
          )}

          {tab === 'security' && (
            <div className="space-y-6">
              <Card hover={false}>
                <h3 className="font-display font-semibold text-lg text-slate-900 dark:text-white mb-5">Change password</h3>
                <div className="space-y-5 max-w-md">
                  <Input label="Current password" type="password" placeholder="••••••••" />
                  <Input label="New password" type="password" placeholder="••••••••" />
                  <Input label="Confirm new password" type="password" placeholder="••••••••" />
                  <Button onClick={() => toast.success('Password updated')}>Update password</Button>
                </div>
              </Card>
              <Card hover={false}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display font-semibold text-slate-900 dark:text-white">Two-factor authentication</h3>
                    <p className="text-sm text-slate-400 mt-1">Add an extra layer of security to your account</p>
                  </div>
                  <Badge tone="amber">Not enabled</Badge>
                </div>
                <Button variant="secondary" size="sm" className="mt-4" onClick={() => toast.info('2FA setup flow would launch here')}>
                  Enable 2FA
                </Button>
              </Card>
            </div>
          )}

          {tab === 'billing' && (
            <div className="space-y-6">
              <Card hover={false} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-semibold text-lg text-slate-900 dark:text-white">Pro plan</h3>
                    <Badge tone="brand">Active</Badge>
                  </div>
                  <p className="text-sm text-slate-400 mt-1">$24/month &middot; Renews Oct 22, 2026</p>
                </div>
                <Button to="/pricing" variant="secondary">Change plan</Button>
              </Card>
              <Card hover={false}>
                <h3 className="font-display font-semibold text-slate-900 dark:text-white mb-4">Payment method</h3>
                <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-white/10">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-7 rounded bg-hero-gradient flex items-center justify-center text-white text-xs font-bold">
                      VISA
                    </span>
                    <div>
                      <p className="text-sm font-medium text-slate-800 dark:text-white">•••• •••• •••• 4242</p>
                      <p className="text-xs text-slate-400">Expires 08/28</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">Update</Button>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
