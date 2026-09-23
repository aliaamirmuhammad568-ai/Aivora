import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../../components/ui/Card.jsx'
import Modal from '../../components/ui/Modal.jsx'
import Button from '../../components/ui/Button.jsx'
import Input from '../../components/ui/Input.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx'
import { listConversations, renameConversation, deleteConversation } from '../../data/conversationsClient.js'
import { useToast } from '../../context/ToastContext.jsx'

function formatDate(iso) {
  const d = new Date(iso)
  const now = new Date()
  const isToday = d.toDateString() === now.toDateString()
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  const isYesterday = d.toDateString() === yesterday.toDateString()

  if (isToday) return `Today, ${d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`
  if (isYesterday) return 'Yesterday'
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

export default function History() {
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('recent')
  const [renaming, setRenaming] = useState(null)
  const [renameValue, setRenameValue] = useState('')
  const [deleting, setDeleting] = useState(null)
  const toast = useToast()
  const navigate = useNavigate()

  const load = () => listConversations().then(setConversations).catch((err) => toast.error(err.message))

  useEffect(() => {
    load().finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    let list = conversations.filter((c) => c.title.toLowerCase().includes(query.toLowerCase()))
    if (sort === 'messages') list = [...list].sort((a, b) => b.messageCount - a.messageCount)
    if (sort === 'az') list = [...list].sort((a, b) => a.title.localeCompare(b.title))
    return list
  }, [conversations, query, sort])

  const confirmDelete = async () => {
    try {
      await deleteConversation(deleting.id)
      setConversations((cs) => cs.filter((c) => c.id !== deleting.id))
      toast.success(`Deleted "${deleting.title}"`)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setDeleting(null)
    }
  }

  const confirmRename = async () => {
    try {
      await renameConversation(renaming.id, renameValue)
      setConversations((cs) => cs.map((c) => (c.id === renaming.id ? { ...c, title: renameValue } : c)))
      toast.success('Conversation renamed')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setRenaming(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <LoadingSpinner size={28} />
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white">Conversation History</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">{conversations.length} conversations total</p>
        </div>
        <Button to="/dashboard/chat" size="sm">
          + New chat
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search conversations..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 text-sm text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-400"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-400"
        >
          <option value="recent">Most recent</option>
          <option value="messages">Most messages</option>
          <option value="az">A–Z</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<span className="text-2xl">🕘</span>}
          title={conversations.length === 0 ? 'No conversations yet' : 'No conversations found'}
          description={conversations.length === 0 ? 'Start chatting and your conversations will show up here.' : 'Try a different search term.'}
          action={<Button to="/dashboard/chat">Start a new chat</Button>}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((c) => (
            <Card key={c.id} hover={false} className="flex items-center justify-between gap-4">
              <button onClick={() => navigate(`/dashboard/chat?c=${c.id}`)} className="text-left min-w-0 flex-1">
                <p className="font-medium text-slate-800 dark:text-white truncate">{c.title}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 truncate mt-0.5">{c.preview}</p>
                <p className="text-xs text-slate-400 mt-1.5">
                  {formatDate(c.updatedAt)} &middot; {c.messageCount} messages
                </p>
              </button>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => {
                    setRenaming(c)
                    setRenameValue(c.title)
                  }}
                  aria-label="Rename"
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-brand-500 hover:bg-slate-500/10"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 3a2.85 2.83 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  onClick={() => setDeleting(c)}
                  aria-label="Delete"
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-500/10"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={!!renaming} onClose={() => setRenaming(null)} title="Rename conversation" footer={
        <>
          <Button variant="secondary" onClick={() => setRenaming(null)}>Cancel</Button>
          <Button onClick={confirmRename}>Save</Button>
        </>
      }>
        <Input label="Title" value={renameValue} onChange={(e) => setRenameValue(e.target.value)} />
      </Modal>

      <Modal open={!!deleting} onClose={() => setDeleting(null)} title="Delete conversation" footer={
        <>
          <Button variant="secondary" onClick={() => setDeleting(null)}>Cancel</Button>
          <Button variant="danger" onClick={confirmDelete}>Delete</Button>
        </>
      }>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Are you sure you want to delete "{deleting?.title}"? This action cannot be undone.
        </p>
      </Modal>
    </div>
  )
}
