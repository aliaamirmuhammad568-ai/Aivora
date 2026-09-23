import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import Badge from '../components/ui/Badge.jsx'
import BlogCard from '../components/blog/BlogCard.jsx'
import Button from '../components/ui/Button.jsx'
import NotFound from './NotFound.jsx'
import { getPostBySlug, getRelatedPosts } from '../data/blogPosts.js'

export default function BlogPost() {
  const { slug } = useParams()
  const post = getPostBySlug(slug)

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [slug])

  if (!post) return <NotFound />

  const related = getRelatedPosts(slug)

  return (
    <article>
      <section className="relative overflow-hidden bg-grid-glow pt-20 pb-12">
        <div className="container-page max-w-3xl">
          <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm text-brand-500 hover:text-brand-600 mb-8">
            ← Back to blog
          </Link>
          <Badge tone="brand" className="mb-5">
            {post.category}
          </Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center gap-3 mt-6">
            <div className="w-10 h-10 rounded-full bg-hero-gradient flex items-center justify-center text-white text-sm font-semibold">
              {post.author.split(' ').map((n) => n[0]).join('')}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-white">{post.author}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {post.date} &middot; {post.readTime}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="container-page max-w-3xl pb-8">
        <div
          className="w-full aspect-[16/7] rounded-2xl flex items-center justify-center text-7xl"
          style={{ background: post.gradient }}
        >
          {post.emoji}
        </div>
      </div>

      <section className="container-page max-w-3xl pb-20">
        <div className="prose-aivora">
          {post.content.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </section>

      {related.length > 0 && (
        <section className="section bg-slate-50 dark:bg-base-900/50">
          <div className="container-page">
            <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-8">Related articles</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((p) => (
                <BlogCard key={p.slug} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-20">
        <div className="container-page text-center">
          <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-4">Enjoyed this article?</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-7">Try Aivora free and see what it can do for your workflow.</p>
          <Button to="/signup">Get started for free</Button>
        </div>
      </section>
    </article>
  )
}
