import 'dotenv/config'
import path from 'path'
import { fileURLToPath } from 'url'
import express from 'express'
import cors from 'cors'
import session from 'express-session'
import passport from './passport.js'
import authRoutes from './authRoutes.js'
import apiRoutes from './apiRoutes.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3001
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173'
const isProduction = process.env.NODE_ENV === 'production'

app.set('trust proxy', 1) // needed for secure cookies behind Render's proxy

app.use(cors({ origin: CLIENT_URL, credentials: true }))
app.use(express.json({ limit: '15mb' })) // headroom for base64-encoded image/video attachments

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'aivora-dev-secret-change-me',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: isProduction,
      sameSite: 'lax',
    },
  }),
)
app.use(passport.initialize())
app.use(passport.session())
app.use('/api/auth', authRoutes)
app.use('/api', apiRoutes)

// Serve the built frontend (dist/) from this same server, so one deployed
// service handles both the site and the API. In local dev, `dist` won't
// exist yet (run `npm run dev` for the frontend instead) — that's fine,
// these routes simply won't match anything until you build.
const distPath = path.join(__dirname, '..', 'dist')
app.use(express.static(distPath))
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) res.status(404).send('Not found. Run `npm run build` to generate the frontend.')
  })
})

app.listen(PORT, () => {
  console.log(`Aivora server running on http://localhost:${PORT}`)
  if (!process.env.GEMINI_API_KEY) {
    console.warn('⚠️  GEMINI_API_KEY not set — chat will return an error until you add one to .env')
  }
})
