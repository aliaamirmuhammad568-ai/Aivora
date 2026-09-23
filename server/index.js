import 'dotenv/config'
import path from 'path'
import { fileURLToPath } from 'url'
import express from 'express'
import cors from 'cors'
import session from 'express-session'
import { GoogleGenerativeAI } from '@google/generative-ai'
import passport from './passport.js'
import authRoutes from './authRoutes.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3001
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173'
const isProduction = process.env.NODE_ENV === 'production'

app.set('trust proxy', 1) // needed for secure cookies behind Render's proxy

app.use(cors({ origin: CLIENT_URL, credentials: true }))
app.use(express.json({ limit: '2mb' }))

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

const apiKey = process.env.GEMINI_API_KEY
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null

const SYSTEM_PROMPT =
  'You are Aivora, a helpful, concise AI assistant embedded in the Aivora SaaS platform. ' +
  'Format responses with markdown (headings, bold, lists, code fences) when useful.'

app.get('/api/health', (req, res) => {
  res.json({ ok: true, configured: Boolean(apiKey) })
})

app.post('/api/chat', async (req, res) => {
  if (!genAI) {
    return res.status(503).json({
      error: 'GEMINI_API_KEY is not configured on the server. Add it to a .env file and restart the server.',
    })
  }

  const { messages } = req.body
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages array is required' })
  }

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-3.6-flash',
      systemInstruction: SYSTEM_PROMPT,
    })

    // Gemini requires the history to start with a 'user' turn and strictly
    // alternate; drop any leading assistant messages (e.g. our fixed intro).
    const trimmed = [...messages]
    while (trimmed.length && trimmed[0].role !== 'user') trimmed.shift()

    const history = trimmed.slice(0, -1).map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }))
    const lastMessage = trimmed[trimmed.length - 1]?.content || ''

    const chat = model.startChat({ history })
    const result = await chat.sendMessage(lastMessage)
    const text = result.response.text()

    res.json({ content: text })
  } catch (err) {
    console.error('Gemini API error:', err.message)
    res.status(500).json({ error: 'The AI request failed. Please try again.' })
  }
})

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
  if (!apiKey) {
    console.warn('⚠️  GEMINI_API_KEY not set — chat will return an error until you add one to .env')
  }
})
