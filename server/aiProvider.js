import { GoogleGenerativeAI } from '@google/generative-ai'
import Groq from 'groq-sdk'
import {
  supportsNativeInline,
  needsTextExtraction,
  needsTextExtractionForGroq,
  isVideo,
  isImage,
  extractText,
} from './documentParser.js'

const SYSTEM_PROMPT =
  'You are Aivora, a helpful, concise AI assistant embedded in the Aivora SaaS platform. ' +
  'Format responses with markdown (headings, bold, lists, code fences) when useful.'

const MAX_EXTRACTED_CHARS = 12000

const geminiKey = process.env.GEMINI_API_KEY
const genAI = geminiKey ? new GoogleGenerativeAI(geminiKey) : null

const groqKey = process.env.GROQ_API_KEY
const groq = groqKey ? new Groq({ apiKey: groqKey }) : null

const GROQ_TEXT_MODEL = 'openai/gpt-oss-120b'
const GROQ_VISION_MODEL = 'qwen/qwen3.8-27b'

export const aiConfigured = Boolean(genAI || groq)

function truncate(text) {
  if (!text) return null
  return text.length > MAX_EXTRACTED_CHARS ? `${text.slice(0, MAX_EXTRACTED_CHARS)}\n...[truncated]` : text
}

// --- Gemini path (video turns only) ---

async function buildGeminiParts(text, media) {
  const parts = [{ text: text || '' }]
  if (!media?.base64 || !media?.mimeType) return parts

  if (supportsNativeInline(media.mimeType)) {
    parts.push({ inlineData: { mimeType: media.mimeType, data: media.base64 } })
  } else if (needsTextExtraction(media.mimeType)) {
    let extracted = null
    try {
      extracted = await extractText(media.mimeType, media.base64)
    } catch (err) {
      console.error('Document extraction error:', err.message)
    }
    parts[0].text = `${parts[0].text}\n\n[Content of attached document "${media.name || 'document'}"]:\n${
      truncate(extracted) || '(no extractable text found in this document)'
    }`
  }
  return parts
}

async function runGemini(history, lastText, media) {
  if (!genAI) throw new Error('Video analysis requires GEMINI_API_KEY, which is not configured on the server.')

  const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash', systemInstruction: SYSTEM_PROMPT })
  const geminiHistory = []
  for (const m of history) {
    geminiHistory.push({ role: m.role === 'assistant' ? 'model' : 'user', parts: await buildGeminiParts(m.content, m.media) })
  }

  const lastParts = await buildGeminiParts(lastText, media)
  const chat = model.startChat({ history: geminiHistory })
  const result = await chat.sendMessage(lastParts)
  const usage = result.response.usageMetadata || {}

  return {
    text: result.response.text(),
    usage: {
      promptTokens: usage.promptTokenCount || 0,
      completionTokens: usage.candidatesTokenCount || 0,
      totalTokens: usage.totalTokenCount || 0,
    },
  }
}

// --- Groq path (default: text, images, PDF/DOCX/text documents) ---

async function buildGroqContent(text, media) {
  if (!media?.base64 || !media?.mimeType) return text || ''

  if (isImage(media.mimeType)) {
    return [
      { type: 'text', text: text || '' },
      { type: 'image_url', image_url: { url: `data:${media.mimeType};base64,${media.base64}` } },
    ]
  }

  if (needsTextExtractionForGroq(media.mimeType)) {
    let extracted = null
    try {
      extracted = await extractText(media.mimeType, media.base64)
    } catch (err) {
      console.error('Document extraction error:', err.message)
    }
    return `${text || ''}\n\n[Content of attached document "${media.name || 'document'}"]:\n${
      truncate(extracted) || '(no extractable text found in this document)'
    }`
  }

  return text || ''
}

function hasImage(history, media) {
  return Boolean(media?.mimeType && isImage(media.mimeType)) || history.some((m) => m.media?.mimeType && isImage(m.media.mimeType))
}

async function runGroq(history, lastText, media) {
  if (!groq) throw new Error('GROQ_API_KEY is not configured on the server.')

  const model = hasImage(history, media) ? GROQ_VISION_MODEL : GROQ_TEXT_MODEL

  const messages = [{ role: 'system', content: SYSTEM_PROMPT }]
  for (const m of history) {
    messages.push({ role: m.role === 'assistant' ? 'assistant' : 'user', content: await buildGroqContent(m.content, m.media) })
  }
  messages.push({ role: 'user', content: await buildGroqContent(lastText, media) })

  const completion = await groq.chat.completions.create({ model, messages })
  const usage = completion.usage || {}

  return {
    text: completion.choices[0]?.message?.content || '',
    usage: {
      promptTokens: usage.prompt_tokens || 0,
      completionTokens: usage.completion_tokens || 0,
      totalTokens: usage.total_tokens || 0,
    },
  }
}

// --- Dispatcher ---

export async function runAI(history, lastText, media) {
  if (media?.mimeType && isVideo(media.mimeType)) {
    return runGemini(history, lastText, media)
  }
  if (groq) {
    return runGroq(history, lastText, media)
  }
  // No Groq key configured — fall back to Gemini for everything.
  return runGemini(history, lastText, media)
}
