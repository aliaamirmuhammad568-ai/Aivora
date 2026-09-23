import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { authenticator } from 'otplib'
import QRCode from 'qrcode'
import passport, { googleEnabled, githubEnabled } from './passport.js'
import {
  dbEnabled,
  findByEmail,
  findById,
  createLocalUser,
  toPublicUser,
  createResetToken,
  consumeResetToken,
  updatePassword,
  setPendingTwoFactorSecret,
  enableTwoFactor,
  disableTwoFactor,
} from './userStore.js'
import { createPendingLogin, getPendingLogin, deletePendingLogin } from './twoFactorStore.js'
import { emailEnabled, sendPasswordResetEmail } from './email.js'

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173'

const router = Router()

function requireDb(req, res, next) {
  if (!dbEnabled) {
    return res.status(503).json({ error: 'The database is not configured on the server yet.' })
  }
  next()
}

function requireAuth(req, res, next) {
  if (!req.isAuthenticated?.() || !req.user) {
    return res.status(401).json({ error: 'You must be logged in.' })
  }
  next()
}

function applyRememberMe(req, remember) {
  if (remember) {
    req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000
  } else {
    req.session.cookie.expires = false
  }
}

router.get('/providers', (req, res) => {
  res.json({ google: googleEnabled, github: githubEnabled })
})

router.get('/me', (req, res) => {
  if (req.isAuthenticated?.() && req.user) {
    return res.json({ user: toPublicUser(req.user) })
  }
  res.status(401).json({ user: null })
})

router.post('/logout', (req, res) => {
  req.logout?.(() => {
    req.session?.destroy(() => {
      res.clearCookie('connect.sid')
      res.json({ ok: true })
    })
  })
})

router.post('/signup', requireDb, async (req, res) => {
  const { name, email, password } = req.body || {}

  if (!name?.trim() || !email?.trim() || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required.' })
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ error: 'Enter a valid email address.' })
  }
  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters.' })
  }
  if (await findByEmail(email)) {
    return res.status(409).json({ error: 'An account with this email already exists.' })
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const user = await createLocalUser({ name: name.trim(), email: email.trim(), passwordHash })

  req.login(user, (err) => {
    if (err) return res.status(500).json({ error: 'Account created, but sign-in failed. Please log in.' })
    res.json({ user: toPublicUser(user) })
  })
})

router.post('/login', requireDb, async (req, res) => {
  const { email, password, remember } = req.body || {}

  if (!email?.trim() || !password) {
    return res.status(400).json({ error: 'Email and password are required.' })
  }

  const user = await findByEmail(email)
  if (!user || !user.passwordHash) {
    return res.status(401).json({ error: 'Incorrect email or password.' })
  }

  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) {
    return res.status(401).json({ error: 'Incorrect email or password.' })
  }

  if (user.twoFactorEnabled) {
    const tempToken = await createPendingLogin(user.id, remember)
    return res.json({ requiresTwoFactor: true, tempToken })
  }

  req.login(user, (err) => {
    if (err) return res.status(500).json({ error: 'Sign-in failed. Please try again.' })
    applyRememberMe(req, remember)
    res.json({ user: toPublicUser(user) })
  })
})

router.post('/2fa/login-verify', requireDb, async (req, res) => {
  const { tempToken, code } = req.body || {}
  if (!tempToken || !code) {
    return res.status(400).json({ error: 'A verification code is required.' })
  }

  const pending = await getPendingLogin(tempToken)
  if (!pending) {
    return res.status(400).json({ error: 'This login attempt has expired. Please log in again.' })
  }

  const user = await findById(pending.userId)
  if (!user?.twoFactorSecret) {
    return res.status(400).json({ error: 'Two-factor authentication is not set up for this account.' })
  }

  const valid = authenticator.verify({ token: code.trim(), secret: user.twoFactorSecret })
  if (!valid) {
    return res.status(401).json({ error: 'Invalid code. Please try again.' })
  }

  await deletePendingLogin(tempToken)

  req.login(user, (err) => {
    if (err) return res.status(500).json({ error: 'Sign-in failed. Please try again.' })
    applyRememberMe(req, pending.remember)
    res.json({ user: toPublicUser(user) })
  })
})

router.post('/forgot-password', requireDb, async (req, res) => {
  const { email } = req.body || {}
  const user = email ? await findByEmail(email) : null
  const response = { ok: true }

  // Always respond the same way whether or not the account exists, so this
  // endpoint can't be used to enumerate registered emails.
  if (user && user.provider === 'local') {
    const token = await createResetToken(user.id)
    const resetLink = `${CLIENT_URL}/reset-password?token=${token}`

    if (emailEnabled) {
      try {
        await sendPasswordResetEmail(user.email, resetLink)
      } catch (err) {
        console.error('Failed to send reset email:', err.message)
        // Fall through and still log the link, so the request isn't a dead end.
        console.log(`   Reset link (valid 1 hour): ${resetLink}`)
      }
    } else {
      // No email provider configured — log the link for local testing.
      console.log(`\n🔑 Password reset requested for ${user.email}`)
      console.log(`   Reset link (valid 1 hour): ${resetLink}\n`)

      if (process.env.NODE_ENV !== 'production') {
        // Dev convenience only: surface the link in the API response so it
        // can be tested without an email provider configured.
        response.devResetLink = resetLink
      }
    }
  }

  res.json(response)
})

router.post('/reset-password', requireDb, async (req, res) => {
  const { token, password } = req.body || {}

  if (!token || !password) {
    return res.status(400).json({ error: 'Token and new password are required.' })
  }
  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters.' })
  }

  const user = await consumeResetToken(token)
  if (!user) {
    return res.status(400).json({ error: 'This reset link is invalid or has expired. Request a new one.' })
  }

  const passwordHash = await bcrypt.hash(password, 10)
  await updatePassword(user.id, passwordHash)
  res.json({ ok: true })
})

// --- Account security (requires an active session) ---

router.post('/change-password', requireDb, requireAuth, async (req, res) => {
  const { currentPassword, newPassword } = req.body || {}
  const user = req.user

  if (user.provider !== 'local') {
    return res.status(400).json({ error: `Your account uses ${user.provider} sign-in and has no password to change.` })
  }
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current and new password are required.' })
  }
  if (newPassword.length < 8) {
    return res.status(400).json({ error: 'New password must be at least 8 characters.' })
  }

  const valid = await bcrypt.compare(currentPassword, user.passwordHash)
  if (!valid) {
    return res.status(401).json({ error: 'Current password is incorrect.' })
  }

  const passwordHash = await bcrypt.hash(newPassword, 10)
  await updatePassword(user.id, passwordHash)
  res.json({ ok: true })
})

router.post('/2fa/setup', requireDb, requireAuth, async (req, res) => {
  const secret = authenticator.generateSecret()
  await setPendingTwoFactorSecret(req.user.id, secret)

  const label = req.user.email || req.user.name || req.user.id
  const otpauth = authenticator.keyuri(label, 'Aivora', secret)
  const qrCode = await QRCode.toDataURL(otpauth)

  res.json({ secret, qrCode })
})

router.post('/2fa/confirm', requireDb, requireAuth, async (req, res) => {
  const { code } = req.body || {}
  const user = await findById(req.user.id) // fresh copy, has the just-set pending secret
  if (!user?.twoFactorSecret) {
    return res.status(400).json({ error: 'Start setup first by requesting a QR code.' })
  }
  if (!code || !authenticator.verify({ token: code.trim(), secret: user.twoFactorSecret })) {
    return res.status(400).json({ error: 'Invalid code. Check your authenticator app and try again.' })
  }

  await enableTwoFactor(user.id)
  res.json({ ok: true })
})

router.post('/2fa/disable', requireDb, requireAuth, async (req, res) => {
  const { password, code } = req.body || {}
  const user = await findById(req.user.id)

  if (user.provider === 'local') {
    if (!password || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: 'Incorrect password.' })
    }
  } else if (!code || !authenticator.verify({ token: code.trim(), secret: user.twoFactorSecret })) {
    return res.status(401).json({ error: 'Invalid verification code.' })
  }

  await disableTwoFactor(user.id)
  res.json({ ok: true })
})

if (googleEnabled) {
  router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))
  router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: `${CLIENT_URL}/login?error=google` }),
    (req, res) => res.redirect(`${CLIENT_URL}/dashboard`),
  )
} else {
  router.get('/google', (req, res) =>
    res.redirect(`${CLIENT_URL}/login?error=google_not_configured`),
  )
}

if (githubEnabled) {
  router.get('/github', passport.authenticate('github', { scope: ['user:email'] }))
  router.get(
    '/github/callback',
    passport.authenticate('github', { failureRedirect: `${CLIENT_URL}/login?error=github` }),
    (req, res) => res.redirect(`${CLIENT_URL}/dashboard`),
  )
} else {
  router.get('/github', (req, res) =>
    res.redirect(`${CLIENT_URL}/login?error=github_not_configured`),
  )
}

export default router
