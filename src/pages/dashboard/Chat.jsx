import { useEffect, useRef, useState } from 'react'
import ChatMessage from '../../components/chat/ChatMessage.jsx'
import ChatInput from '../../components/chat/ChatInput.jsx'
import TypingIndicator from '../../components/chat/TypingIndicator.jsx'
import { conversations as mockConversations } from '../../data/dashboard.js'
import { sendChatMessage } from '../../data/aiClient.js'

const initialMessages = [
  { id: 1, role: 'assistant', content: "Hi! I'm Aivora. Ask me anything — I can help with writing, code, analysis, and more." },
]

export default function Chat() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeId, setActiveId] = useState(mockConversations[0].id)
  const [messages, setMessages] = useState(initialMessages)
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const requestReply = async (history) => {
    setTyping(true)
    try {
      const content = await sendChatMessage(history)
      setMessages((m) => [...m, { id: Date.now() + 1, role: 'assistant', content }])
    } catch (err) {
      setMessages((m) => [
        ...m,
        {
          id: Date.now() + 1,
          role: 'assistant',
          content: `⚠️ ${err.message}\n\nMake sure the API server is running (\`npm run server\`) and \`ANTHROPIC_API_KEY\` is set in your \`.env\` file.`,
        },
      ])
    } finally {
      setTyping(false)
    }
  }

  const handleSend = (text, attachment) => {
    if (!text && !attachment) return
    const userMsg = {
      id: Date.now(),
      role: 'user',
      content: attachment ? `${text || 'Sent a file'} 📎 ${attachment.name}` : text,
    }
    const nextHistory = [...messages, userMsg]
    setMessages(nextHistory)
    requestReply(nextHistory)
  }

  const handleRegenerate = () => {
    const withoutLast = messages.slice(0, -1)
    setMessages(withoutLast)
    requestReply(withoutLast)
  }

  const handleNewChat = () => {
    setMessages(initialMessages)
    setSidebarOpen(false)
  }

  const lastAssistantId = [...messages].reverse().find((m) => m.role === 'assistant')?.id

  return (
    <div className="h-full flex">
      {/* Conversation sidebar */}
      <div className="hidden md:flex w-72 shrink-0 flex-col border-r border-slate-200 dark:border-white/10 bg-white dark:bg-base-900">
        <div className="p-4">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-hero-gradient text-white text-sm font-semibold shadow-glow hover:brightness-110 transition-all"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12h14" strokeLinecap="round" />
            </svg>
            New chat
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-1">
          {mockConversations.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveId(c.id)}
              className={`w-full text-left px-3 py-2.5 rounded-xl transition-colors ${
                activeId === c.id ? 'bg-brand-500/10 text-brand-600 dark:text-brand-300' : 'hover:bg-slate-500/10 text-slate-600 dark:text-slate-300'
              }`}
            >
              <p className="text-sm font-medium truncate">{c.title}</p>
              <p className="text-xs text-slate-400 truncate mt-0.5">{c.preview}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="md:hidden flex items-center justify-between p-3 border-b border-slate-200 dark:border-white/10">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-lg hover:bg-slate-500/10"
          >
            🕘 Conversations
          </button>
          <button onClick={handleNewChat} className="text-sm font-semibold text-brand-500">
            + New chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-6">
          {messages.map((m) => (
            <ChatMessage
              key={m.id}
              role={m.role}
              content={m.content}
              isLast={m.role === 'assistant' && m.id === lastAssistantId}
              onRegenerate={handleRegenerate}
            />
          ))}
          {typing && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>

        <ChatInput onSend={handleSend} disabled={typing} />
      </div>

      {/* Mobile conversation drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 bg-white dark:bg-base-900 flex flex-col animate-fade-up">
            <div className="p-4 flex items-center justify-between border-b border-slate-200 dark:border-white/10">
              <span className="font-display font-semibold text-slate-900 dark:text-white">Conversations</span>
              <button onClick={() => setSidebarOpen(false)} aria-label="Close">
                ×
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
              {mockConversations.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setActiveId(c.id)
                    setSidebarOpen(false)
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-500/10"
                >
                  <p className="text-sm font-medium truncate text-slate-700 dark:text-slate-200">{c.title}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
