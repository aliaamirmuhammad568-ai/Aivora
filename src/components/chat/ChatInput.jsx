import { useRef, useState } from 'react'
import { useToast } from '../../context/ToastContext.jsx'

const MAX_FILE_BYTES = 8 * 1024 * 1024 // 8MB

const DOCX_MIME = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
const ACCEPTED_DOC_TYPES = [DOCX_MIME, 'application/pdf', 'text/plain', 'text/csv', 'text/markdown']

function kindFor(file) {
  if (file.type.startsWith('image/')) return 'image'
  if (file.type.startsWith('video/')) return 'video'
  if (ACCEPTED_DOC_TYPES.includes(file.type)) return 'document'
  // Some browsers don't set a MIME type for .md/.csv — fall back to extension.
  const ext = file.name.split('.').pop()?.toLowerCase()
  if (['pdf', 'docx', 'doc', 'txt', 'csv', 'md'].includes(ext)) return 'document'
  return null
}

function readAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function ChatInput({ onSend, disabled }) {
  const [value, setValue] = useState('')
  const [media, setMedia] = useState(null) // { name, mimeType, dataUrl, base64, kind }
  const [encoding, setEncoding] = useState(false)
  const fileRef = useRef(null)
  const toast = useToast()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!value.trim() && !media) return
    onSend(value.trim(), media)
    setValue('')
    setMedia(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const kind = kindFor(file)
    if (!kind) {
      toast.error('Only images, videos, PDFs, Word docs, and text/CSV files are supported.')
      return
    }
    if (file.size > MAX_FILE_BYTES) {
      toast.error(`File is too large — max ${MAX_FILE_BYTES / (1024 * 1024)}MB.`)
      return
    }

    setEncoding(true)
    try {
      const dataUrl = await readAsDataUrl(file)
      const base64 = dataUrl.split(',')[1]
      setMedia({ name: file.name, mimeType: file.type || 'application/octet-stream', dataUrl, base64, kind })
    } catch {
      toast.error('Could not read that file.')
    } finally {
      setEncoding(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 sm:p-5 border-t border-slate-200 dark:border-white/10 bg-white dark:bg-base-900">
      {media && (
        <div className="relative inline-block mb-3">
          {media.kind === 'image' && (
            <img src={media.dataUrl} alt={media.name} className="h-20 w-20 object-cover rounded-xl border border-slate-200 dark:border-white/10" />
          )}
          {media.kind === 'video' && (
            <video src={media.dataUrl} className="h-20 w-20 object-cover rounded-xl border border-slate-200 dark:border-white/10" muted />
          )}
          {media.kind === 'document' && (
            <div className="h-20 w-40 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 flex items-center gap-2 px-3">
              <span className="text-2xl">📄</span>
              <span className="text-xs text-slate-600 dark:text-slate-300 truncate">{media.name}</span>
            </div>
          )}
          <button
            type="button"
            onClick={() => setMedia(null)}
            aria-label="Remove attachment"
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs hover:bg-red-500 transition-colors"
          >
            ×
          </button>
        </div>
      )}
      <div className="flex items-end gap-2 glass rounded-2xl p-2">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={encoding}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-brand-500 hover:bg-slate-500/10 shrink-0 disabled:opacity-50"
          aria-label="Add a file"
          title="Add a photo, video, PDF, Word doc, or text file"
        >
          {encoding ? (
            <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
          ) : (
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*,video/*,application/pdf,.pdf,.docx,.doc,.txt,.csv,.md"
          className="hidden"
          onChange={handleFile}
        />
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder="Message Aivora..."
          disabled={disabled}
          className="flex-1 resize-none bg-transparent px-1 py-2 text-sm text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none max-h-32"
        />
        <button
          type="submit"
          disabled={disabled || encoding || (!value.trim() && !media)}
          aria-label="Send message"
          className="w-10 h-10 rounded-xl bg-hero-gradient text-white flex items-center justify-center shrink-0 disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 transition-all"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
      <p className="text-xs text-slate-400 text-center mt-2">Aivora can make mistakes. Verify important information.</p>
    </form>
  )
}
