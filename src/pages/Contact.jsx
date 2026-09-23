import { useState } from 'react'
import Badge from '../components/ui/Badge.jsx'
import Card from '../components/ui/Card.jsx'
import Input from '../components/ui/Input.jsx'
import Textarea from '../components/ui/Textarea.jsx'
import Button from '../components/ui/Button.jsx'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import FaqAccordion from '../components/ui/FaqAccordion.jsx'
import { useToast } from '../context/ToastContext.jsx'

const contactFaq = [
  { q: 'How fast will I get a response?', a: 'We typically respond within 1 business day for general inquiries, and within a few hours for sales questions.' },
  { q: 'Do you offer phone support?', a: 'Phone support is available for Business plan customers with a dedicated account manager. Everyone else can reach us via chat and email.' },
  { q: 'Can I schedule a demo?', a: 'Yes — select "Sales" as your subject and mention you\'d like a demo, and our team will follow up to find a time.' },
]

const info = [
  { icon: '📧', label: 'Email us', value: 'hello@aivora.ai' },
  { icon: '💬', label: 'Live chat', value: 'Available 9am–6pm ET' },
  { icon: '📍', label: 'Headquarters', value: 'San Francisco, CA' },
]

export default function Contact() {
  const toast = useToast()
  const [form, setForm] = useState({ name: '', email: '', subject: 'General', message: '' })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.email.trim()) errs.email = 'Email is required'
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email address'
    if (!form.message.trim()) errs.message = 'Message is required'
    else if (form.message.trim().length < 10) errs.message = 'Message should be at least 10 characters'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
      toast.success('Message sent — we\'ll be in touch soon.')
    }, 1100)
  }

  return (
    <div>
      <section className="relative overflow-hidden bg-grid-glow section pt-24 pb-16">
        <div className="container-page text-center">
          <Badge tone="brand" className="mb-6">
            Contact
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-slate-900 dark:text-white tracking-tight max-w-2xl mx-auto">
            Let's talk
          </h1>
          <p className="mt-5 text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Questions, feedback, or partnership ideas — our team would love to hear from you.
          </p>
        </div>
      </section>

      <section className="container-page pb-24 grid lg:grid-cols-5 gap-10">
        <div className="lg:col-span-3">
          <Card hover={false}>
            {submitted ? (
              <div className="text-center py-10">
                <div className="w-14 h-14 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center mx-auto mb-5">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white mb-2">Message sent!</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-6">
                  Thanks for reaching out. Our team will get back to you within 1 business day.
                </p>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setSubmitted(false)
                    setForm({ name: '', email: '', subject: 'General', message: '' })
                  }}
                >
                  Send another message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <Input label="Name" placeholder="Jane Doe" value={form.name} onChange={update('name')} error={errors.name} />
                  <Input label="Email" type="email" placeholder="jane@company.com" value={form.email} onChange={update('email')} error={errors.email} />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">
                    Subject
                  </label>
                  <select
                    id="subject"
                    value={form.subject}
                    onChange={update('subject')}
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-400"
                  >
                    <option>General</option>
                    <option>Sales</option>
                    <option>Support</option>
                    <option>Partnerships</option>
                    <option>Press</option>
                  </select>
                </div>
                <Textarea
                  label="Message"
                  placeholder="Tell us how we can help..."
                  value={form.message}
                  onChange={update('message')}
                  error={errors.message}
                />
                <Button type="submit" size="lg" className="w-full" loading={loading}>
                  {loading ? 'Sending...' : 'Send message'}
                </Button>
              </form>
            )}
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-5">
          {info.map((i) => (
            <Card key={i.label} className="flex items-start gap-4">
              <div className="text-2xl">{i.icon}</div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">{i.label}</p>
                <p className="font-semibold text-slate-900 dark:text-white">{i.value}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="section bg-slate-50 dark:bg-base-900/50">
        <div className="container-page max-w-3xl">
          <SectionHeading eyebrow="FAQ" title="Common questions" />
          <FaqAccordion items={contactFaq} />
        </div>
      </section>
    </div>
  )
}
