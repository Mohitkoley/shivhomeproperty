import Link from 'next/link'
import { LayoutDashboard, Building, Star, MessageSquare, Settings, Home } from 'lucide-react'
import { SignOutButton } from '@/components/admin/SignOutButton'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'PGs & Rooms', href: '/admin/pgs', icon: Building },
    { name: 'Reviews', href: '/admin/reviews', icon: Star },
    { name: 'Enquiries', href: '/admin/enquiries', icon: MessageSquare },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ]

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <Link href="/admin" className="flex items-center gap-2 text-indigo-600">
            <LayoutDashboard className="w-6 h-6" />
            <span className="font-bold text-xl tracking-tight text-gray-900">Admin Panel</span>
          </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4 px-3">
          <nav className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
        
        <div className="p-4 border-t border-gray-200 space-y-4">
          <div className="px-3">
            <p className="text-sm font-medium text-gray-900">{session?.user?.name || 'Admin'}</p>
            <p className="text-xs text-gray-500 truncate">{session?.user?.email}</p>
          </div>
          <div className="space-y-1">
            <Link 
              href="/" 
              target="_blank"
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 transition-colors"
            >
              <Home className="w-4 h-4" />
              View Site
            </Link>
            <SignOutButton />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
