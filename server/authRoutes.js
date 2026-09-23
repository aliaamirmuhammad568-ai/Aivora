import { Router } from 'express'
import bcrypt from 'bcryptjs'
import passport, { googleEnabled, githubEnabled } from './passport.js'
import {
  dbEnabled,
  findByEmail,
  createLocalUser,
  toPublicUser,
  createResetToken,
  consumeResetToken,
  updatePassword,
} from './userStore.js'
import { emailEnabled, sendPasswordResetEmail } from './email.js'

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173'

const router = Router()

function requireDb(req, res, next) {
  if (!dbEnabled) {
    return res.status(503).json({ error: 'The database is not configured on the server yet.' })
  }
  next()
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
  const { email, password } = req.body || {}

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

  req.login(user, (err) => {
    if (err) return res.status(500).json({ error: 'Sign-in failed. Please try again.' })
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
