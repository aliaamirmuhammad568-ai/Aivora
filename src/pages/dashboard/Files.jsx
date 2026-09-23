import { useRef, useState } from 'react'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import EmptyState from '../../components/ui/EmptyState.jsx'
import { files as initialFiles } from '../../data/dashboard.js'
import { useToast } from '../../context/ToastContext.jsx'

const typeIcon = { pdf: '📕', csv: '📊', doc: '📄', image: '🖼️', sheet: '📈' }

export default function Files() {
  const [files, setFiles] = useState(initialFiles)
  const [uploading, setUploading] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef(null)
  const toast = useToast()

  const addFile = (fileList) => {
    const file = fileList?.[0]
    if (!file) return
    const id = `f-${Date.now()}`
    const ext = file.name.split('.').pop().toLowerCase()
    const type = ['png', 'jpg', 'jpeg', 'gif', 'svg'].includes(ext)
      ? 'image'
      : ext === 'csv'
      ? 'csv'
      : ['xlsx', 'xls'].includes(ext)
      ? 'sheet'
      : ext === 'pdf'
      ? 'pdf'
      : 'doc'
    const sizeKb = file.size / 1024
    const size = sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb.toFixed(0)} KB`

    setUploading({ id, name: file.name, size, type, progress: 0 })
    const interval = setInterval(() => {
      setUploading((u) => {
        if (!u) return u
        const next = Math.min(100, u.progress + 15 + Math.random() * 15)
        if (next >= 100) {
          clearInterval(interval)
          setFiles((fs) => [{ id, name: file.name, size, type, date: 'Just now', progress: 100 }, ...fs])
          toast.success(`${file.name} uploaded successfully`)
          return null
        }
        return { ...u, progress: next }
      })
    }, 250)
  }

  const handleDelete = (id, name) => {
    setFiles((fs) => fs.filter((f) => f.id !== id))
    toast.info(`Deleted ${name}`)
  }

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white">Files</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Upload and manage documents Aivora can analyze.</p>
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
        <p className="text-sm text-slate-400 mb-5">Supports PDF, DOCX, CSV, XLSX, PNG, JPG up to 25MB</p>
        <input ref={inputRef} type="file" className="hidden" onChange={(e) => addFile(e.target.files)} />
        <Button variant="secondary" onClick={() => inputRef.current?.click()}>
          Choose file
        </Button>
      </div>

      {uploading && (
        <Card hover={false}>
          <div className="flex items-center gap-3">
            <span className="text-xl">{typeIcon[uploading.type]}</span>
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

      {files.length === 0 && !uploading ? (
        <EmptyState icon={<span className="text-2xl">📁</span>} title="No files yet" description="Upload a file to get started." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {files.map((f) => (
            <Card key={f.id} hover={false} className="flex items-start gap-3">
              <span className="text-2xl shrink-0">{typeIcon[f.type]}</span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-800 dark:text-white truncate">{f.name}</p>
                <p className="text-xs text-slate-400 mt-1">
                  {f.size} &middot; {f.date}
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
