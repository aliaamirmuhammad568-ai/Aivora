import Button from '../components/ui/Button.jsx'

export default function NotFound({ dashboard = false }) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-5 bg-grid-glow">
      <div className="text-center max-w-md">
        <p className="text-7xl font-display font-bold text-gradient mb-4">404</p>
        <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-3">
          This page took a wrong turn.
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8">
          The page you're looking for doesn't exist or may have been moved. Let's get you back on track.
        </p>
        <div className="flex justify-center gap-3">
          <Button to={dashboard ? '/dashboard' : '/'} variant="primary">
            {dashboard ? 'Back to dashboard' : 'Back to home'}
          </Button>
          <Button to="/contact" variant="secondary">
            Contact support
          </Button>
        </div>
      </div>
    </div>
  )
}
