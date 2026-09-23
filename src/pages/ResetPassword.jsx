import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import AuthLayout from '../components/layout/AuthLayout.jsx'
import Input from '../components/ui/Input.jsx'
import Button from '../components/ui/Button.jsx'
import { resetPassword } from '../data/authClient.js'
import { useToast } from '../context/ToastContext.jsx'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''
  const navigate = useNavigate()
  const toast = useToast()

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const validate = () => {
    const errs = {}
    if (!password) errs.password = 'New password is required'
    else if (password.length < 8) errs.password = 'Password must be at least 8 characters'
    if (confirm !== password) errs.confirm = 'Passwords do not match'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!token) {
      setErrors({ form: 'This reset link is missing its token. Request a new one from the forgot password page.' })
      return
    }
    if (!validate()) return
    setLoading(true)
    try {
      await resetPassword({ token, password })
      setDone(true)
      toast.success('Password updated — you can log in now.')
    } catch (err) {
      setErrors({ form: err.message })
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <AuthLayout title="Invalid reset link" subtitle="This link is missing its token">
        <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-6">
          Please request a new password reset link.
        </p>
        <Button to="/forgot-password" className="w-full">
          Request new link
        </Button>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title="Set a new password" subtitle="Choose a new password for your account">
      {done ? (
        <div className="text-center py-4">
          <div className="w-14 h-14 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center mx-auto mb-5">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h3 className="text-lg font-display font-semibold text-slate-900 dark:text-white mb-2">Password updated</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            Your password has been changed successfully.
          </p>
          <Button onClick={() => navigate('/login')} className="w-full">
            Log in
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {errors.form && (
            <div className="px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">
              {errors.form}
            </div>
          )}
          <Input
            label="New password"
            type="password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />
          <Input
            label="Confirm new password"
            type="password"
            placeholder="Re-enter password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            error={errors.confirm}
          />
          <Button type="submit" size="lg" className="w-full" loading={loading}>
            {loading ? 'Updating...' : 'Update password'}
          </Button>
        </form>
      )}

      <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-7">
        <Link to="/login" className="text-brand-500 hover:text-brand-600 font-semibold">
          Back to log in
        </Link>
      </p>
    </AuthLayout>
  )
}
