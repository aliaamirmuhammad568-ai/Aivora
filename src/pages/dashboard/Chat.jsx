import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ChatMessage from '../../components/chat/ChatMessage.jsx'
import ChatInput from '../../components/chat/ChatInput.jsx'
import TypingIndicator from '../../components/chat/TypingIndicator.jsx'
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx'
import { sendChatMessage, regenerateLastMessage } from '../../data/aiClient.js'
import { listConversations, getConversationMessages } from '../../data/conversationsClient.js'
import { useToast } from '../../context/ToastContext.jsx'

const introMessage = { id: 'intro', role: 'assistant', content: "Hi! I'm Aivora. Ask me anything — I can help with writing, code, analysis, and more." }

export default function Chat() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [conversations, setConversations] = useState([])
  const [conversationsLoading, setConversationsLoading] = useState(true)
  const [activeId, setActiveId] = useState(searchParams.get('c') || null)
  const [messages, setMessages] = useState([introMessage])
  const [messagesLoading, setMessagesLoading] = useState(false)
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef(null)
  const toast = useToast()

  const refreshConversations = () => listConversations().then(setConversations).catch(() => {})

  useEffect(() => {
    refreshConversations().finally(() => setConversationsLoading(false))
  }, [])

  useEffect(() => {
    if (!activeId) {
      setMessages([introMessage])
      return
    }
    setMessagesLoading(true)
    getConversationMessages(activeId)
      .then((loaded) =>
        loaded.map((m) => ({
          ...m,
          media: m.media
            ? {
                ...m.media,
                dataUrl: `data:${m.media.mimeType};base64,${m.media.base64}`,
                kind: m.media.mimeType.startsWith('image/') ? 'image' : m.media.mimeType.startsWith('video/') ? 'video' : 'document',
              }
            : null,
        })),
      )
      .then(setMessages)
      .catch((err) => toast.error(err.message))
      .finally(() => setMessagesLoading(false))
  }, [activeId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  const selectConversation = (id) => {
    setActiveId(id)
    setSearchParams(id ? { c: id } : {})
    setSidebarOpen(false)
  }

  const defaultMessageFor = (media) => {
    if (media?.kind === 'image') return 'Describe this image.'
    if (media?.kind === 'video') return 'Describe this video.'
    if (media?.kind === 'document') return 'Summarize this document.'
    return ''
  }

  const handleSend = async (text, media) => {
    if (!text && !media) return
    const finalText = text || defaultMessageFor(media)
    const userMsg = { id: `local-${Date.now()}`, role: 'user', content: finalText, media }
    setMessages((m) => [...m, userMsg])
    setTyping(true)
    try {
      const { conversationId, content } = await sendChatMessage({ conversationId: activeId, message: finalText, media })
      setMessages((m) => [...m, { id: `local-${Date.now()}-r`, role: 'assistant', content }])
      if (!activeId) {
        setActiveId(conversationId)
        setSearchParams({ c: conversationId })
      }
      refreshConversations()
    } catch (err) {
      setMessages((m) => [
        ...m,
        {
          id: `local-${Date.now()}-e`,
          role: 'assistant',
          content: `⚠️ ${err.message}`,
        },
      ])
    } finally {
      setTyping(false)
    }
  }

  const handleRegenerate = async () => {
    if (!activeId) return
    setTyping(true)
    setMessages((m) => m.slice(0, -1))
    try {
      const { content } = await regenerateLastMessage(activeId)
      setMessages((m) => [...m, { id: `local-${Date.now()}-r`, role: 'assistant', content }])
    } catch (err) {
      toast.error(err.message)
    } finally {
      setTyping(false)
    }
  }

  const handleNewChat = () => {
    setActiveId(null)
    setSearchParams({})
    setMessages([introMessage])
    setSidebarOpen(false)
  }

  const lastAssistantId = [...messages].reverse().find((m) => m.role === 'assistant')?.id

  const conversationList = (onSelect) => (
    <>
      {conversationsLoading ? (
        <div className="flex justify-center py-6">
          <LoadingSpinner size={20} />
        </div>
      ) : conversations.length === 0 ? (
        <p className="text-xs text-slate-400 px-3 py-4 text-center">No conversations yet — send a message to start one.</p>
      ) : (
        conversations.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            className={`w-full text-left px-3 py-2.5 rounded-xl transition-colors ${
              String(activeId) === String(c.id) ? 'bg-brand-500/10 text-brand-600 dark:text-brand-300' : 'hover:bg-slate-500/10 text-slate-600 dark:text-slate-300'
            }`}
          >
            <p className="text-sm font-medium truncate">{c.title}</p>
            <p className="text-xs text-slate-400 truncate mt-0.5">{c.preview}</p>
          </button>
        ))
      )}
    </>
  )

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
        <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-1">{conversationList(selectConversation)}</div>
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

        {messagesLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <LoadingSpinner size={28} />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-6">
            {messages.map((m) => (
              <ChatMessage
                key={m.id}
                role={m.role}
                content={m.content}
                media={m.media}
                isLast={m.role === 'assistant' && m.id === lastAssistantId}
                onRegenerate={activeId ? handleRegenerate : undefined}
              />
            ))}
            {typing && <TypingIndicator />}
            <div ref={bottomRef} />
          </div>
        )}

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
            <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1">{conversationList(selectConversation)}</div>
          </div>
        </div>
      )}
    </div>
  )
}
