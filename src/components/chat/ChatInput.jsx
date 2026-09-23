import { useRef, useState } from 'react'
import { useToast } from '../../context/ToastContext.jsx'

const MAX_FILE_BYTES = 8 * 1024 * 1024 // 8MB

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

    const isImage = file.type.startsWith('image/')
    const isVideo = file.type.startsWith('video/')
    if (!isImage && !isVideo) {
      toast.error('Only images and videos are supported.')
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
      setMedia({ name: file.name, mimeType: file.type, dataUrl, base64, kind: isImage ? 'image' : 'video' })
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
          {media.kind === 'image' ? (
            <img src={media.dataUrl} alt={media.name} className="h-20 w-20 object-cover rounded-xl border border-slate-200 dark:border-white/10" />
          ) : (
            <video src={media.dataUrl} className="h-20 w-20 object-cover rounded-xl border border-slate-200 dark:border-white/10" muted />
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
          aria-label="Add photo or video"
          title="Add a photo or video"
        >
          {encoding ? (
            <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
          ) : (
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
        <input ref={fileRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleFile} />
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
