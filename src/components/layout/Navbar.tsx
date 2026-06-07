import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Home } from 'lucide-react'

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Home className="h-6 w-6 text-indigo-600" />
          <span className="font-bold text-xl tracking-tight text-gray-900">Shiv PG</span>
        </Link>
        <nav className="hidden md:flex gap-6">
          <Link href="/" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">Home</Link>
          <Link href="/pgs" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">Our PGs</Link>
          <Link href="/contact" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">Contact</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Button href="/pgs" variant="primary" size="sm">View PGs</Button>
        </div>
      </div>
    </header>
  )
}
