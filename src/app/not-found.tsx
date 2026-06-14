import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Home, AlertCircle } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
            <AlertCircle className="w-12 h-12 text-indigo-600" />
          </div>
          <h1 className="text-6xl font-extrabold text-slate-900 tracking-tight mb-2">404</h1>
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Page Not Found</h2>
          <p className="text-lg text-slate-500 mb-8 max-w-sm mx-auto">
            Oops! The page you're looking for doesn't exist, has been removed, or is temporarily unavailable.
          </p>
          
          <Button href="/" className="rounded-full px-8 h-12 text-lg font-medium flex items-center gap-2 shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5">
            <Home className="w-5 h-5" />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  )
}
