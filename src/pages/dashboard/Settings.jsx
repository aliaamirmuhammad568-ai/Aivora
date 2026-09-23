import { useEffect, useState } from 'react'
import Card from '../../components/ui/Card.jsx'
import Input from '../../components/ui/Input.jsx'
import Button from '../../components/ui/Button.jsx'
import Badge from '../../components/ui/Badge.jsx'
import Modal from '../../components/ui/Modal.jsx'
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx'
import { useTheme } from '../../context/ThemeContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { getNotificationPreferences, updateNotificationPreferences } from '../../data/settingsClient.js'
import { changePassword, setupTwoFactor, confirmTwoFactor, disableTwoFactor } from '../../data/authClient.js'

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
  const { user, refresh } = useAuth()

  const [profile, setProfile] = useState({ name: 'Ahmad Khan', email: 'ahmad@aivora.ai', bio: 'Building things with AI.' })
  const [accentDensity, setAccentDensity] = useState('comfortable')

  const [notifs, setNotifs] = useState(null)
  const [notifsSaving, setNotifsSaving] = useState(false)

  const [passwordForm, setPasswordForm] = useState({ current: '', next: '', confirm: '' })
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [passwordError, setPasswordError] = useState('')

  const [setupData, setSetupData] = useState(null) // { secret, qrCode }
  const [setupCode, setSetupCode] = useState('')
  const [setupError, setSetupError] = useState('')
  const [setupLoading, setSetupLoading] = useState(false)

  const [disableOpen, setDisableOpen] = useState(false)
  const [disableValue, setDisableValue] = useState('')
  const [disableError, setDisableError] = useState('')
  const [disableLoading, setDisableLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setProfile((p) => ({ ...p, name: user.name || p.name, email: user.email || p.email }))
    }
  }, [user])

  useEffect(() => {
    if (tab === 'notifications' && !notifs) {
      getNotificationPreferences()
        .then(setNotifs)
        .catch((err) => toast.error(err.message))
    }
  }, [tab])

  const saveProfile = (e) => {
    e.preventDefault()
    toast.success('Profile updated')
  }

  const saveNotifications = async () => {
    setNotifsSaving(true)
    try {
      await updateNotificationPreferences(notifs)
      toast.success('Notification preferences saved')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setNotifsSaving(false)
    }
  }

  const submitPasswordChange = async (e) => {
    e.preventDefault()
    setPasswordError('')
    if (passwordForm.next.length < 8) return setPasswordError('New password must be at least 8 characters.')
    if (passwordForm.next !== passwordForm.confirm) return setPasswordError('New passwords do not match.')

    setPasswordSaving(true)
    try {
      await changePassword({ currentPassword: passwordForm.current, newPassword: passwordForm.next })
      toast.success('Password updated')
      setPasswordForm({ current: '', next: '', confirm: '' })
    } catch (err) {
      setPasswordError(err.message)
    } finally {
      setPasswordSaving(false)
    }
  }

  const startTwoFactorSetup = async () => {
    setSetupError('')
    try {
      const data = await setupTwoFactor()
      setSetupData(data)
    } catch (err) {
      toast.error(err.message)
    }
  }

  const confirmSetup = async (e) => {
    e.preventDefault()
    setSetupError('')
    setSetupLoading(true)
    try {
      await confirmTwoFactor(setupCode.trim())
      await refresh()
      setSetupData(null)
      setSetupCode('')
      toast.success('Two-factor authentication enabled')
    } catch (err) {
      setSetupError(err.message)
    } finally {
      setSetupLoading(false)
    }
  }

  const submitDisable = async (e) => {
    e.preventDefault()
    setDisableError('')
    setDisableLoading(true)
    try {
      const payload = user?.provider === 'local' ? { password: disableValue } : { code: disableValue }
      await disableTwoFactor(payload)
      await refresh()
      setDisableOpen(false)
      setDisableValue('')
      toast.success('Two-factor authentication disabled')
    } catch (err) {
      setDisableError(err.message)
    } finally {
      setDisableLoading(false)
    }
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
                  {(profile.name || 'A').split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
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
              {!notifs ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner size={24} />
                </div>
              ) : (
                <>
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
                  <Button className="mt-5" onClick={saveNotifications} loading={notifsSaving}>
                    Save preferences
                  </Button>
                </>
              )}
            </Card>
          )}

          {tab === 'security' && (
            <div className="space-y-6">
              {user?.provider === 'local' ? (
                <Card hover={false}>
                  <h3 className="font-display font-semibold text-lg text-slate-900 dark:text-white mb-5">Change password</h3>
                  <form onSubmit={submitPasswordChange} className="space-y-5 max-w-md">
                    {passwordError && (
                      <div className="px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">
                        {passwordError}
                      </div>
                    )}
                    <Input
                      label="Current password"
                      type="password"
                      placeholder="••••••••"
                      value={passwordForm.current}
                      onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                    />
                    <Input
                      label="New password"
                      type="password"
                      placeholder="••••••••"
                      value={passwordForm.next}
                      onChange={(e) => setPasswordForm({ ...passwordForm, next: e.target.value })}
                    />
                    <Input
                      label="Confirm new password"
                      type="password"
                      placeholder="••••••••"
                      value={passwordForm.confirm}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                    />
                    <Button type="submit" loading={passwordSaving}>Update password</Button>
                  </form>
                </Card>
              ) : (
                <Card hover={false}>
                  <h3 className="font-display font-semibold text-lg text-slate-900 dark:text-white mb-2">Password</h3>
                  <p className="text-sm text-slate-400">
                    You signed in with {user?.provider}, so there's no Aivora password to change.
                  </p>
                </Card>
              )}

              <Card hover={false}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display font-semibold text-slate-900 dark:text-white">Two-factor authentication</h3>
                    <p className="text-sm text-slate-400 mt-1">Add an extra layer of security to your account</p>
                  </div>
                  <Badge tone={user?.twoFactorEnabled ? 'green' : 'amber'}>
                    {user?.twoFactorEnabled ? 'Enabled' : 'Not enabled'}
                  </Badge>
                </div>
                {user?.twoFactorEnabled ? (
                  <Button variant="secondary" size="sm" className="mt-4" onClick={() => setDisableOpen(true)}>
                    Disable 2FA
                  </Button>
                ) : (
                  <Button variant="secondary" size="sm" className="mt-4" onClick={startTwoFactorSetup}>
                    Enable 2FA
                  </Button>
                )}
              </Card>
            </div>
          )}

          {tab === 'billing' && (
            <div className="space-y-6">
              <Card hover={false} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-semibold text-lg text-slate-900 dark:text-white">Free plan</h3>
                    <Badge tone="brand">Active</Badge>
                  </div>
                  <p className="text-sm text-slate-400 mt-1">No payment on file — upgrades coming soon.</p>
                </div>
                <Button to="/pricing" variant="secondary">View plans</Button>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* 2FA setup modal */}
      <Modal
        open={!!setupData}
        onClose={() => {
          setSetupData(null)
          setSetupCode('')
          setSetupError('')
        }}
        title="Set up two-factor authentication"
      >
        {setupData && (
          <form onSubmit={confirmSetup} className="space-y-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Scan this QR code with Google Authenticator, Authy, or any TOTP app.
            </p>
            <div className="flex justify-center">
              <img src={setupData.qrCode} alt="2FA QR code" className="rounded-xl border border-slate-200 dark:border-white/10" />
            </div>
            <p className="text-xs text-slate-400 text-center">
              Or enter this key manually: <span className="font-mono text-slate-600 dark:text-slate-300">{setupData.secret}</span>
            </p>
            {setupError && (
              <div className="px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">{setupError}</div>
            )}
            <Input
              label="Enter the 6-digit code to confirm"
              placeholder="123456"
              value={setupCode}
              onChange={(e) => setSetupCode(e.target.value)}
              inputMode="numeric"
              maxLength={6}
            />
            <Button type="submit" className="w-full" loading={setupLoading}>
              Confirm & enable
            </Button>
          </form>
        )}
      </Modal>

      {/* 2FA disable modal */}
      <Modal
        open={disableOpen}
        onClose={() => {
          setDisableOpen(false)
          setDisableValue('')
          setDisableError('')
        }}
        title="Disable two-factor authentication"
      >
        <form onSubmit={submitDisable} className="space-y-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {user?.provider === 'local'
              ? 'Enter your password to confirm.'
              : 'Enter a current code from your authenticator app to confirm.'}
          </p>
          {disableError && (
            <div className="px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">{disableError}</div>
          )}
          <Input
            label={user?.provider === 'local' ? 'Password' : 'Verification code'}
            type={user?.provider === 'local' ? 'password' : 'text'}
            value={disableValue}
            onChange={(e) => setDisableValue(e.target.value)}
          />
          <Button type="submit" variant="danger" className="w-full" loading={disableLoading}>
            Disable 2FA
          </Button>
        </form>
      </Modal>
    </div>
  )
}
