import { Router } from 'express'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { requireAuth, requireDb } from './middleware.js'
import { logUsage, getUsageStats } from './usageStore.js'
import {
  listConversations,
  createConversation,
  getConversationOwner,
  getMessages,
  addMessage,
  deleteLastAssistantMessage,
  renameConversation,
  deleteConversation,
} from './conversationStore.js'
import { listFiles, createFile, getFileOwner, deleteFile } from './fileStore.js'
import { logActivity, listActivity } from './activityStore.js'

const router = Router()

const MAX_FILE_BYTES = 8 * 1024 * 1024 // 8MB, matches the chat attachment cap

const apiKey = process.env.GEMINI_API_KEY
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null

const SYSTEM_PROMPT =
  'You are Aivora, a helpful, concise AI assistant embedded in the Aivora SaaS platform. ' +
  'Format responses with markdown (headings, bold, lists, code fences) when useful.'

router.get('/health', (req, res) => {
  res.json({ ok: true, configured: Boolean(apiKey) })
})

// --- Chat (persisted) ---

async function runGemini(history, lastText, media) {
  const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash', systemInstruction: SYSTEM_PROMPT })
  const geminiHistory = history.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: m.media?.base64
      ? [{ text: m.content }, { inlineData: { mimeType: m.media.mimeType, data: m.media.base64 } }]
      : [{ text: m.content }],
  }))

  const lastParts = [{ text: lastText || '' }]
  if (media?.base64 && media?.mimeType) {
    lastParts.push({ inlineData: { mimeType: media.mimeType, data: media.base64 } })
  }

  const chat = model.startChat({ history: geminiHistory })
  const result = await chat.sendMessage(lastParts)
  return { text: result.response.text(), usage: result.response.usageMetadata || {} }
}

router.post('/chat', requireAuth, requireDb, async (req, res) => {
  if (!genAI) {
    return res.status(503).json({
      error: 'GEMINI_API_KEY is not configured on the server. Add it to a .env file and restart the server.',
    })
  }

  const { conversationId, message, media } = req.body
  if (!message?.trim() && !media) {
    return res.status(400).json({ error: 'message or media is required' })
  }

  try {
    let convoId = conversationId
    let isNewConversation = false

    if (convoId) {
      const owner = await getConversationOwner(convoId)
      if (owner !== req.user.id) {
        return res.status(404).json({ error: 'Conversation not found.' })
      }
    } else {
      const convo = await createConversation(req.user.id, message)
      convoId = convo.id
      isNewConversation = true
    }

    const history = isNewConversation ? [] : await getMessages(convoId)

    const { text, usage } = await runGemini(history, message, media)

    await addMessage(convoId, { role: 'user', content: message || '', media })
    await addMessage(convoId, { role: 'assistant', content: text })

    await logUsage(req.user.id, {
      promptTokens: usage.promptTokenCount || 0,
      completionTokens: usage.candidatesTokenCount || 0,
      totalTokens: usage.totalTokenCount || 0,
    })

    if (isNewConversation) {
      await logActivity(req.user.id, 'chat', `New conversation: "${(message || 'Untitled').slice(0, 60)}"`)
    }

    res.json({ conversationId: convoId, content: text })
  } catch (err) {
    console.error('Gemini API error:', err.message)
    res.status(500).json({ error: 'The AI request failed. Please try again.' })
  }
})

router.post('/chat/regenerate', requireAuth, requireDb, async (req, res) => {
  if (!genAI) {
    return res.status(503).json({ error: 'GEMINI_API_KEY is not configured on the server.' })
  }
  const { conversationId } = req.body
  if (!conversationId) return res.status(400).json({ error: 'conversationId is required' })

  const owner = await getConversationOwner(conversationId)
  if (owner !== req.user.id) return res.status(404).json({ error: 'Conversation not found.' })

  try {
    const messages = await getMessages(conversationId)
    const lastUserIndex = [...messages].reverse().findIndex((m) => m.role === 'user')
    if (lastUserIndex === -1) return res.status(400).json({ error: 'No message to regenerate.' })

    const lastUser = [...messages].reverse()[lastUserIndex]
    const history = messages.filter((m) => m.id < lastUser.id)

    await deleteLastAssistantMessage(conversationId)

    const { text, usage } = await runGemini(history, lastUser.content, lastUser.media)
    await addMessage(conversationId, { role: 'assistant', content: text })
    await logUsage(req.user.id, {
      promptTokens: usage.promptTokenCount || 0,
      completionTokens: usage.candidatesTokenCount || 0,
      totalTokens: usage.totalTokenCount || 0,
    })

    res.json({ conversationId, content: text })
  } catch (err) {
    console.error('Gemini regenerate error:', err.message)
    res.status(500).json({ error: 'The AI request failed. Please try again.' })
  }
})

// --- Conversations ---

router.get('/conversations', requireAuth, requireDb, async (req, res) => {
  res.json({ conversations: await listConversations(req.user.id) })
})

router.get('/conversations/:id/messages', requireAuth, requireDb, async (req, res) => {
  const owner = await getConversationOwner(req.params.id)
  if (owner !== req.user.id) return res.status(404).json({ error: 'Conversation not found.' })
  res.json({ messages: await getMessages(req.params.id) })
})

router.patch('/conversations/:id', requireAuth, requireDb, async (req, res) => {
  const owner = await getConversationOwner(req.params.id)
  if (owner !== req.user.id) return res.status(404).json({ error: 'Conversation not found.' })
  const { title } = req.body
  if (!title?.trim()) return res.status(400).json({ error: 'Title is required.' })
  await renameConversation(req.params.id, title)
  res.json({ ok: true })
})

router.delete('/conversations/:id', requireAuth, requireDb, async (req, res) => {
  const owner = await getConversationOwner(req.params.id)
  if (owner !== req.user.id) return res.status(404).json({ error: 'Conversation not found.' })
  await deleteConversation(req.params.id)
  res.json({ ok: true })
})

// --- Files ---

router.get('/files', requireAuth, requireDb, async (req, res) => {
  res.json({ files: await listFiles(req.user.id) })
})

router.post('/files', requireAuth, requireDb, async (req, res) => {
  const { name, mimeType, base64 } = req.body
  if (!name || !mimeType || !base64) {
    return res.status(400).json({ error: 'name, mimeType, and base64 are required.' })
  }
  const size = Math.ceil((base64.length * 3) / 4)
  if (size > MAX_FILE_BYTES) {
    return res.status(413).json({ error: `File is too large — max ${MAX_FILE_BYTES / (1024 * 1024)}MB.` })
  }

  const file = await createFile(req.user.id, { name, mimeType, size, data: base64 })
  await logActivity(req.user.id, 'file', `Uploaded ${name}`)
  res.json({ file })
})

router.delete('/files/:id', requireAuth, requireDb, async (req, res) => {
  const owner = await getFileOwner(req.params.id)
  if (owner !== req.user.id) return res.status(404).json({ error: 'File not found.' })
  await deleteFile(req.params.id)
  res.json({ ok: true })
})

// --- Activity ---

router.get('/activity', requireAuth, requireDb, async (req, res) => {
  res.json({ activity: await listActivity(req.user.id) })
})

// --- Usage ---

router.get('/usage', requireAuth, requireDb, async (req, res) => {
  res.json(await getUsageStats(req.user.id))
})

export default router
