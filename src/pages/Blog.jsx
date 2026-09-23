import { useMemo, useState } from 'react'
import Badge from '../components/ui/Badge.jsx'
import BlogCard from '../components/blog/BlogCard.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import { blogPosts, categories } from '../data/blogPosts.js'

const PAGE_SIZE = 6

export default function Blog() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [page, setPage] = useState(1)

  const featured = blogPosts.find((p) => p.featured)

  const filtered = useMemo(() => {
    return blogPosts.filter((p) => {
      const matchesQuery =
        p.title.toLowerCase().includes(query.toLowerCase()) || p.excerpt.toLowerCase().includes(query.toLowerCase())
      const matchesCategory = category === 'All' || p.category === category
      return matchesQuery && matchesCategory && (query || category !== 'All' ? true : p.slug !== featured?.slug)
    })
  }, [query, category, featured])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div>
      <section className="relative overflow-hidden bg-grid-glow section pt-24 pb-14">
        <div className="container-page text-center">
          <Badge tone="brand" className="mb-6">
            Blog
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-slate-900 dark:text-white tracking-tight max-w-2xl mx-auto">
            Insights on AI, product, and the future of work
          </h1>
          <p className="mt-5 text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Updates from the Aivora team on product, engineering, and AI research.
          </p>
        </div>
      </section>

      <section className="container-page pb-14">
        <div className="relative max-w-lg mx-auto">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
          </svg>
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setPage(1)
            }}
            placeholder="Search articles..."
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-400"
          />
        </div>
        <div className="flex flex-wrap justify-center gap-2 mt-6">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => {
                setCategory(c)
                setPage(1)
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                category === c ? 'bg-hero-gradient text-white shadow-glow' : 'glass text-slate-600 dark:text-slate-300'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      {featured && !query && category === 'All' && (
        <section className="container-page pb-14">
          <BlogCard post={featured} featured />
        </section>
      )}

      <section className="container-page pb-24">
        {paged.length === 0 ? (
          <EmptyState
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
              </svg>
            }
            title="No articles found"
            description="Try a different search term or category."
          />
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paged.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="w-9 h-9 rounded-lg glass flex items-center justify-center text-slate-500 dark:text-slate-300 disabled:opacity-40"
                  aria-label="Previous page"
                >
                  ‹
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${
                      page === i + 1 ? 'bg-hero-gradient text-white shadow-glow' : 'glass text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="w-9 h-9 rounded-lg glass flex items-center justify-center text-slate-500 dark:text-slate-300 disabled:opacity-40"
                  aria-label="Next page"
                >
                  ›
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  )
}
