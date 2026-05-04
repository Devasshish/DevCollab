import { Component } from 'react'
import { AlertTriangle } from 'lucide-react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-dark-bg">
            <div className="text-center p-8 max-w-sm">
              <div className="inline-flex items-center justify-center p-4 bg-red-50 dark:bg-red-900/20 rounded-2xl mb-5">
                <AlertTriangle className="w-10 h-10 text-red-500" />
              </div>
              <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Something went wrong</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                An unexpected error occurred. Please reload the page.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2.5 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors font-semibold text-sm shadow-md shadow-primary-500/25"
              >
                Reload Page
              </button>
            </div>
          </div>
        )
      )
    }
    return this.props.children
  }
}