import { useState } from 'react'
import MarkdownContent from './MarkdownContent.jsx'
import { useToast } from '../../context/ToastContext.jsx'

export default function ChatMessage({ role, content, media, onRegenerate, isLast }) {
  const [copied, setCopied] = useState(false)
  const toast = useToast()
  const isUser = role === 'user'

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      toast.error('Could not copy to clipboard')
    }
  }

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="bg-hero-gradient text-white text-sm rounded-2xl rounded-tr-sm px-4 py-3 max-w-[85%] sm:max-w-md shadow-glow">
          {media && (
            <div className="mb-2">
              {media.kind === 'image' ? (
                <img src={media.dataUrl} alt={media.name} className="max-h-48 rounded-xl border border-white/20" />
              ) : (
                <video src={media.dataUrl} controls className="max-h-48 rounded-xl border border-white/20" />
              )}
            </div>
          )}
          {content}
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-3 max-w-[90%] sm:max-w-2xl">
      <div className="w-8 h-8 rounded-lg bg-hero-gradient flex items-center justify-center text-white text-xs font-bold shrink-0 mt-1">
        A
      </div>
      <div className="flex-1 min-w-0">
        <div className="glass rounded-2xl rounded-tl-sm px-4 py-3 text-slate-700 dark:text-slate-200">
          <MarkdownContent text={content} />
        </div>
        <div className="flex items-center gap-1 mt-2 ml-1">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-brand-500 px-2 py-1 rounded-lg hover:bg-slate-500/10 transition-colors"
          >
            {copied ? (
              <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Copied
              </>
            ) : (
              <>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" />
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                </svg>
                Copy
              </>
            )}
          </button>
          {isLast && onRegenerate && (
            <button
              onClick={onRegenerate}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-brand-500 px-2 py-1 rounded-lg hover:bg-slate-500/10 transition-colors"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Regenerate
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
