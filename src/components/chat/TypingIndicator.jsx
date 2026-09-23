import { useEffect, useState } from 'react'

const phrases = ['Thinking...', 'Reading your message...', 'Working on it...', 'Putting a response together...', 'Almost there...']

export default function TypingIndicator() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % phrases.length)
    }, 1800)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-lg bg-hero-gradient flex items-center justify-center text-white text-xs font-bold shrink-0">
        A
      </div>
      <div className="glass rounded-2xl rounded-tl-sm px-4 py-3.5 flex items-center gap-2.5">
        <span className="flex items-center gap-1.5 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 typing-dot" />
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 typing-dot" />
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 typing-dot" />
        </span>
        <span key={index} className="text-sm text-slate-500 dark:text-slate-400 animate-fade-up">
          {phrases[index]}
        </span>
      </div>
    </div>
  )
}
