import mammoth from 'mammoth'
import { PDFParse } from 'pdf-parse'

const DOCX_MIME = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
const TEXT_MIME_PREFIXES = ['text/']

// Gemini (used only for video turns) natively understands images, video,
// and PDF via inline data.
export function supportsNativeInline(mimeType) {
  return mimeType.startsWith('image/') || mimeType.startsWith('video/') || mimeType === 'application/pdf'
}

// DOCX and plain-text formats have no native Gemini support, so their
// text is extracted and folded into the prompt instead. (PDF is excluded
// here since Gemini reads it natively — see supportsNativeInline.)
export function needsTextExtraction(mimeType) {
  return mimeType === DOCX_MIME || TEXT_MIME_PREFIXES.some((p) => mimeType.startsWith(p))
}

export function isVideo(mimeType) {
  return mimeType.startsWith('video/')
}

export function isImage(mimeType) {
  return mimeType.startsWith('image/')
}

// Groq has no native document support at all, so PDF joins DOCX/text as
// something that must always be extracted before it reaches the model.
export function needsTextExtractionForGroq(mimeType) {
  return needsTextExtraction(mimeType) || mimeType === 'application/pdf'
}

export async function extractText(mimeType, base64) {
  const buffer = Buffer.from(base64, 'base64')

  if (mimeType === DOCX_MIME) {
    const { value } = await mammoth.extractRawText({ buffer })
    return value.trim()
  }

  if (mimeType === 'application/pdf') {
    const parser = new PDFParse({ data: buffer })
    const result = await parser.getText()
    return result.text.trim()
  }

  if (TEXT_MIME_PREFIXES.some((p) => mimeType.startsWith(p))) {
    return buffer.toString('utf-8').trim()
  }

  return null
}
