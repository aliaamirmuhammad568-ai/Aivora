import { useState } from 'react'
import { Link } from 'react-router-dom'
import AuthLayout from '../components/layout/AuthLayout.jsx'
import Input from '../components/ui/Input.jsx'
import Button from '../components/ui/Button.jsx'
import { forgotPassword } from '../data/authClient.js'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [devResetLink, setDevResetLink] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim()) return setError('Email is required')
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError('Enter a valid email address')
    setError('')
    setLoading(true)
    try {
      const data = await forgotPassword({ email })
      setDevResetLink(data.devResetLink || null)
      setSent(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Reset your password" subtitle="We'll email you a link to reset your password">
      {sent ? (
        <div className="text-center py-4">
          <div className="w-14 h-14 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center mx-auto mb-5">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M4 4h16v16H4z" opacity="0" />
              <path d="M22 6l-10 7L2 6" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="2" y="4" width="20" height="16" rx="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h3 className="text-lg font-display font-semibold text-slate-900 dark:text-white mb-2">Check your inbox</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            If an account exists for <span className="font-medium text-slate-700 dark:text-slate-300">{email}</span>, you'll receive a
            password reset link shortly.
          </p>
          {devResetLink && (
            <div className="text-left mb-6 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
              <p className="text-xs font-semibold text-amber-500 mb-1.5">
                Dev mode — no email provider configured
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                This link would normally be emailed. For local testing, use it directly:
              </p>
              <Link to={devResetLink.replace(window.location.origin, '')} className="text-xs text-brand-500 hover:text-brand-600 break-all font-mono">
                {devResetLink}
              </Link>
            </div>
          )}
          <Button to="/login" variant="secondary" className="w-full">
            Back to log in
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <Input
            label="Email"
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error}
          />
          <Button type="submit" size="lg" className="w-full" loading={loading}>
            {loading ? 'Sending link...' : 'Send reset link'}
          </Button>
        </form>
      )}

      <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-7">
        Remembered your password?{' '}
        <Link to="/login" className="text-brand-500 hover:text-brand-600 font-semibold">
          Log in
        </Link>
      </p>
    </AuthLayout>
  )
}
