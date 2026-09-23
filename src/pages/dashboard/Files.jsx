import { useEffect, useRef, useState } from 'react'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx'
import { listFiles, uploadFile, deleteFile } from '../../data/filesClient.js'
import { useToast } from '../../context/ToastContext.jsx'

const MAX_FILE_BYTES = 8 * 1024 * 1024

function iconFor(mimeType, name) {
  if (mimeType?.startsWith('image/')) return '🖼️'
  if (mimeType?.startsWith('video/')) return '🎞️'
  const ext = name.split('.').pop()?.toLowerCase()
  if (ext === 'pdf') return '📕'
  if (ext === 'csv') return '📊'
  if (['xlsx', 'xls'].includes(ext)) return '📈'
  return '📄'
}

function formatSize(bytes) {
  if (bytes > 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${Math.ceil(bytes / 1024)} KB`
}

function formatDate(iso) {
  const d = new Date(iso)
  const now = new Date()
  if (d.toDateString() === now.toDateString()) return 'Today'
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

export default function Files() {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef(null)
  const toast = useToast()

  useEffect(() => {
    listFiles()
      .then(setFiles)
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false))
  }, [])

  const addFile = async (fileList) => {
    const file = fileList?.[0]
    if (!file) return
    if (file.size > MAX_FILE_BYTES) {
      toast.error(`File is too large — max ${MAX_FILE_BYTES / (1024 * 1024)}MB.`)
      return
    }

    setUploading({ name: file.name, progress: 10 })
    const progressTimer = setInterval(() => {
      setUploading((u) => (u && u.progress < 85 ? { ...u, progress: u.progress + Math.random() * 20 } : u))
    }, 200)

    try {
      const uploaded = await uploadFile(file)
      clearInterval(progressTimer)
      setUploading((u) => (u ? { ...u, progress: 100 } : u))
      setTimeout(() => {
        setFiles((fs) => [uploaded, ...fs])
        setUploading(null)
        toast.success(`${file.name} uploaded successfully`)
      }, 300)
    } catch (err) {
      clearInterval(progressTimer)
      setUploading(null)
      toast.error(err.message)
    }
  }

  const handleDelete = async (id, name) => {
    try {
      await deleteFile(id)
      setFiles((fs) => fs.filter((f) => f.id !== id))
      toast.info(`Deleted ${name}`)
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white">Files</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Upload and manage your files.</p>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragOver(false)
          addFile(e.dataTransfer.files)
        }}
        className={`glass rounded-2xl border-2 border-dashed p-10 text-center transition-colors ${
          dragOver ? 'border-brand-500 bg-brand-500/5' : 'border-slate-300 dark:border-white/15'
        }`}
      >
        <div className="text-4xl mb-3">📤</div>
        <p className="font-medium text-slate-700 dark:text-slate-200 mb-1">Drag & drop a file, or click to browse</p>
        <p className="text-sm text-slate-400 mb-5">Up to {MAX_FILE_BYTES / (1024 * 1024)}MB per file</p>
        <input ref={inputRef} type="file" className="hidden" onChange={(e) => addFile(e.target.files)} />
        <Button variant="secondary" onClick={() => inputRef.current?.click()} disabled={!!uploading}>
          Choose file
        </Button>
      </div>

      {uploading && (
        <Card hover={false}>
          <div className="flex items-center gap-3">
            <span className="text-xl">📄</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800 dark:text-white truncate">{uploading.name}</p>
              <div className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-hero-gradient transition-all duration-200" style={{ width: `${uploading.progress}%` }} />
              </div>
            </div>
            <span className="text-xs text-slate-400 shrink-0">{Math.round(uploading.progress)}%</span>
          </div>
        </Card>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <LoadingSpinner size={28} />
        </div>
      ) : files.length === 0 && !uploading ? (
        <EmptyState icon={<span className="text-2xl">📁</span>} title="No files yet" description="Upload a file to get started." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {files.map((f) => (
            <Card key={f.id} hover={false} className="flex items-start gap-3">
              <span className="text-2xl shrink-0">{iconFor(f.mimeType, f.name)}</span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-800 dark:text-white truncate">{f.name}</p>
                <p className="text-xs text-slate-400 mt-1">
                  {formatSize(f.size)} &middot; {formatDate(f.createdAt)}
                </p>
              </div>
              <button
                onClick={() => handleDelete(f.id, f.name)}
                aria-label={`Delete ${f.name}`}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-500/10 shrink-0"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
