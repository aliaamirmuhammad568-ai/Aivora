import mammoth from 'mammoth'

const DOCX_MIME = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
const TEXT_MIME_PREFIXES = ['text/']

// Gemini natively understands images, video, and PDF via inline data — no
// parsing needed. DOCX and plain-text formats need extraction first since
// Gemini has no native Word-document support.
export function needsTextExtraction(mimeType) {
  return mimeType === DOCX_MIME || TEXT_MIME_PREFIXES.some((p) => mimeType.startsWith(p))
}

export function supportsNativeInline(mimeType) {
  return mimeType.startsWith('image/') || mimeType.startsWith('video/') || mimeType === 'application/pdf'
}

export async function extractText(mimeType, base64) {
  const buffer = Buffer.from(base64, 'base64')

  if (mimeType === DOCX_MIME) {
    const { value } = await mammoth.extractRawText({ buffer })
    return value.trim()
  }

  if (TEXT_MIME_PREFIXES.some((p) => mimeType.startsWith(p))) {
    return buffer.toString('utf-8').trim()
  }

  return null
}
