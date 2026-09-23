import { Link } from 'react-router-dom'
import Badge from '../ui/Badge.jsx'

export default function BlogCard({ post, featured = false }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className={`group glass rounded-2xl overflow-hidden card-hover flex ${
        featured ? 'flex-col lg:flex-row' : 'flex-col'
      }`}
    >
      <div
        className={`relative overflow-hidden ${featured ? 'lg:w-1/2 h-56 lg:h-auto' : 'h-44'}`}
        style={{ background: post.gradient }}
      >
        <div className="absolute inset-0 flex items-center justify-center text-5xl opacity-90">{post.emoji}</div>
      </div>
      <div className={`p-6 flex flex-col ${featured ? 'lg:w-1/2 justify-center' : ''}`}>
        <Badge tone="brand" className="w-fit mb-3">
          {post.category}
        </Badge>
        <h3
          className={`font-display font-semibold text-slate-900 dark:text-white group-hover:text-brand-500 transition-colors ${
            featured ? 'text-2xl' : 'text-lg'
          }`}
        >
          {post.title}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 line-clamp-2">{post.excerpt}</p>
        <div className="flex items-center gap-3 mt-5 text-xs text-slate-500 dark:text-slate-400">
          <span>{post.author}</span>
          <span>&middot;</span>
          <span>{post.date}</span>
          <span>&middot;</span>
          <span>{post.readTime}</span>
        </div>
      </div>
    </Link>
  )
}
