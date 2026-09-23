import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import AuthLayout from '../components/layout/AuthLayout.jsx'
import Input from '../components/ui/Input.jsx'
import Button from '../components/ui/Button.jsx'
import SocialLoginButtons from '../components/ui/SocialLoginButtons.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { login } from '../data/authClient.js'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [remember, setRemember] = useState(true)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const toast = useToast()
  const { refresh } = useAuth()
  const redirectTo = location.state?.from || '/dashboard'

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const validate = () => {
    const errs = {}
    if (!form.email.trim()) errs.email = 'Email is required'
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email address'
    if (!form.password) errs.password = 'Password is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await login({ email: form.email, password: form.password, remember })
      await refresh()
      toast.success('Welcome back!')
      navigate(redirectTo)
    } catch (err) {
      setErrors({ form: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to continue to your workspace">
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {errors.form && (
          <div className="px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">
            {errors.form}
          </div>
        )}
        <Input label="Email" type="email" placeholder="you@company.com" value={form.email} onChange={update('email')} error={errors.email} />
        <Input label="Password" type="password" placeholder="••••••••" value={form.password} onChange={update('password')} error={errors.password} />
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-slate-600 dark:text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="w-4 h-4 rounded accent-brand-500"
            />
            Remember me
          </label>
          <Link to="/forgot-password" className="text-brand-500 hover:text-brand-600 font-medium">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" size="lg" className="w-full" loading={loading}>
          {loading ? 'Logging in...' : 'Log in'}
        </Button>
      </form>

      <div className="flex items-center gap-3 my-6">
        <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
        <span className="text-xs text-slate-400">or continue with</span>
        <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
      </div>

      <SocialLoginButtons />

      <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-7">
        Don't have an account?{' '}
        <Link to="/signup" className="text-brand-500 hover:text-brand-600 font-semibold">
          Sign up
        </Link>
      </p>
    </AuthLayout>
  )
}
