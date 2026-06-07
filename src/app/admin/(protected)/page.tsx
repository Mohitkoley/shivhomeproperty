import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Building, MessageSquare, Star, Users } from 'lucide-react'
import Link from 'next/link'

export const revalidate = 0 // Admin dashboard should always be fresh

export default async function AdminDashboard() {
  const [pgCount, unreadEnquiriesCount, pendingReviewsCount, roomCount] = await Promise.all([
    prisma.pgProperty.count(),
    prisma.enquiry.count({ where: { isContacted: false } }),
    prisma.review.count({ where: { isApproved: false } }),
    prisma.roomType.count()
  ])

  const stats = [
    { name: 'Total PGs', value: pgCount, icon: Building, href: '/admin/pgs', color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Total Room Types', value: roomCount, icon: Users, href: '/admin/pgs', color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { name: 'Pending Reviews', value: pendingReviewsCount, icon: Star, href: '/admin/reviews', color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { name: 'Unread Enquiries', value: unreadEnquiriesCount, icon: MessageSquare, href: '/admin/enquiries', color: 'text-green-600', bg: 'bg-green-100' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.name} href={stat.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardContent className="p-6 flex items-center space-x-4">
                  <div className={`p-3 rounded-full ${stat.bg}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Enquiries</CardTitle>
          </CardHeader>
          <CardContent>
            {unreadEnquiriesCount === 0 ? (
              <p className="text-gray-500">No unread enquiries.</p>
            ) : (
              <p className="text-gray-600">You have {unreadEnquiriesCount} unread enquiries waiting for a response.</p>
            )}
            <Link href="/admin/enquiries" className="text-indigo-600 text-sm mt-4 inline-block font-medium hover:underline">
              View all enquiries →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            {pendingReviewsCount === 0 ? (
              <p className="text-gray-500">No pending reviews.</p>
            ) : (
              <p className="text-gray-600">You have {pendingReviewsCount} reviews waiting for approval.</p>
            )}
            <Link href="/admin/reviews" className="text-indigo-600 text-sm mt-4 inline-block font-medium hover:underline">
              Manage reviews →
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
