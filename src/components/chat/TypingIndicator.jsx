export default function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-lg bg-hero-gradient flex items-center justify-center text-white text-xs font-bold shrink-0">
        A
      </div>
      <div className="glass rounded-2xl rounded-tl-sm px-4 py-3.5 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-brand-400 typing-dot" />
        <span className="w-1.5 h-1.5 rounded-full bg-brand-400 typing-dot" />
        <span className="w-1.5 h-1.5 rounded-full bg-brand-400 typing-dot" />
      </div>
    </div>
  )
}
