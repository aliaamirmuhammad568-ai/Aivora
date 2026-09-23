import { dbEnabled } from './userStore.js'

export function requireAuth(req, res, next) {
  if (!req.isAuthenticated?.() || !req.user) {
    return res.status(401).json({ error: 'You must be logged in.' })
  }
  next()
}

export function requireDb(req, res, next) {
  if (!dbEnabled) {
    return res.status(503).json({ error: 'The database is not configured on the server yet.' })
  }
  next()
}
