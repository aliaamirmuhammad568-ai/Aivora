import { Link } from 'react-router-dom'

export default function Logo({ className = '' }) {
  return (
    <Link to="/" className={`flex items-center gap-2 font-display font-bold text-xl ${className}`}>
      <span className="w-8 h-8 rounded-lg bg-hero-gradient flex items-center justify-center text-white text-sm shadow-glow">
        A
      </span>
      <span className="text-slate-900 dark:text-white">Aivora</span>
    </Link>
  )
}
