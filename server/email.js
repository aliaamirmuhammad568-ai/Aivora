import { Resend } from 'resend'

const apiKey = process.env.RESEND_API_KEY
const resend = apiKey ? new Resend(apiKey) : null

// Resend's default sandbox sender. Works immediately with no setup, but
// only delivers to the email address you signed up to Resend with, until
// you verify a real domain at resend.com/domains and change this to
// something like "Aivora <noreply@yourdomain.com>".
const FROM_ADDRESS = process.env.RESEND_FROM || 'Aivora <onboarding@resend.dev>'

export const emailEnabled = Boolean(resend)

export async function sendPasswordResetEmail(to, resetLink) {
  if (!resend) {
    throw new Error('Email is not configured (RESEND_API_KEY missing).')
  }

  await resend.emails.send({
    from: FROM_ADDRESS,
    to,
    subject: 'Reset your Aivora password',
    html: `
      <div style="font-family: -apple-system, Segoe UI, Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; color: #1e293b;">
        <div style="width: 40px; height: 40px; border-radius: 10px; background: linear-gradient(135deg, #7c4dff, #22b8f2); color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 18px; margin-bottom: 24px;">A</div>
        <h1 style="font-size: 20px; margin: 0 0 12px;">Reset your password</h1>
        <p style="font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 24px;">
          We received a request to reset the password for your Aivora account. This link is valid for 1 hour.
          If you didn't request this, you can safely ignore this email.
        </p>
        <a href="${resetLink}" style="display: inline-block; background: linear-gradient(135deg, #7c4dff, #22b8f2); color: white; text-decoration: none; font-weight: 600; font-size: 14px; padding: 12px 24px; border-radius: 10px;">
          Reset password
        </a>
        <p style="font-size: 12px; color: #94a3b8; margin-top: 24px; word-break: break-all;">
          Or copy this link: ${resetLink}
        </p>
      </div>
    `,
  })
}
