import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import AuthLayout from '../components/layout/AuthLayout.jsx'
import Input from '../components/ui/Input.jsx'
import Button from '../components/ui/Button.jsx'
import SocialLoginButtons from '../components/ui/SocialLoginButtons.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { signup } from '../data/authClient.js'

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [agree, setAgree] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const toast = useToast()
  const { refresh } = useAuth()

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const passwordStrength = () => {
    const p = form.password
    if (!p) return 0
    let score = 0
    if (p.length >= 8) score++
    if (/[A-Z]/.test(p)) score++
    if (/[0-9]/.test(p)) score++
    if (/[^A-Za-z0-9]/.test(p)) score++
    return score
  }

  const strength = passwordStrength()
  const strengthLabel = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'][strength]
  const strengthColor = ['bg-red-500', 'bg-red-400', 'bg-amber-400', 'bg-emerald-400', 'bg-emerald-500'][strength]

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.email.trim()) errs.email = 'Email is required'
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email address'
    if (!form.password) errs.password = 'Password is required'
    else if (form.password.length < 8) errs.password = 'Password must be at least 8 characters'
    if (!agree) errs.agree = 'You must accept the terms to continue'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await signup({ name: form.name, email: form.email, password: form.password })
      await refresh()
      toast.success('Account created — welcome to Aivora!')
      navigate('/dashboard')
    } catch (err) {
      setErrors({ form: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Create your account" subtitle="Start using Aivora free — no credit card required">
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {errors.form && (
          <div className="px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">
            {errors.form}
          </div>
        )}
        <Input label="Full name" placeholder="Jane Doe" value={form.name} onChange={update('name')} error={errors.name} />
        <Input label="Email" type="email" placeholder="you@company.com" value={form.email} onChange={update('email')} error={errors.email} />
        <div>
          <Input label="Password" type="password" placeholder="At least 8 characters" value={form.password} onChange={update('password')} error={errors.password} />
          {form.password && (
            <div className="mt-2">
              <div className="flex gap-1">
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className={`h-1.5 flex-1 rounded-full transition-colors ${i < strength ? strengthColor : 'bg-slate-200 dark:bg-white/10'}`}
                  />
                ))}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{strengthLabel}</p>
            </div>
          )}
        </div>
        <div>
          <label className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="w-4 h-4 rounded accent-brand-500 mt-0.5"
            />
            I agree to the <span className="text-brand-500 font-medium">Terms of Service</span> and{' '}
            <span className="text-brand-500 font-medium">Privacy Policy</span>
          </label>
          {errors.agree && <p className="mt-1.5 text-xs text-red-400">{errors.agree}</p>}
        </div>
        <Button type="submit" size="lg" className="w-full" loading={loading}>
          {loading ? 'Creating account...' : 'Create account'}
        </Button>
      </form>

      <div className="flex items-center gap-3 my-6">
        <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
        <span className="text-xs text-slate-400">or continue with</span>
        <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
      </div>

      <SocialLoginButtons />

      <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-7">
        Already have an account?{' '}
        <Link to="/login" className="text-brand-500 hover:text-brand-600 font-semibold">
          Log in
        </Link>
      </p>
    </AuthLayout>
  )
}
