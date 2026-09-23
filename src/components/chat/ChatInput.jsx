import { useRef, useState } from 'react'
import { useToast } from '../../context/ToastContext.jsx'

export default function ChatInput({ onSend, disabled }) {
  const [value, setValue] = useState('')
  const [attachment, setAttachment] = useState(null)
  const fileRef = useRef(null)
  const toast = useToast()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!value.trim() && !attachment) return
    onSend(value.trim(), attachment)
    setValue('')
    setAttachment(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleFile = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setAttachment(file)
      toast.info(`Attached ${file.name}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 sm:p-5 border-t border-slate-200 dark:border-white/10 bg-white dark:bg-base-900">
      {attachment && (
        <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-300 text-sm w-fit">
          📎 {attachment.name}
          <button type="button" onClick={() => setAttachment(null)} aria-label="Remove attachment" className="ml-1 hover:text-red-400">
            ×
          </button>
        </div>
      )}
      <div className="flex items-end gap-2 glass rounded-2xl p-2">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-brand-500 hover:bg-slate-500/10 shrink-0"
          aria-label="Attach file"
        >
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <input ref={fileRef} type="file" className="hidden" onChange={handleFile} />
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
          disabled={disabled || (!value.trim() && !attachment)}
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
