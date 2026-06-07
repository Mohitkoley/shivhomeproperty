import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Building, MessageSquare, Star, Users, ArrowRight } from 'lucide-react'
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
    { name: 'Total Properties', value: pgCount, icon: Building, href: '/admin/pgs', color: 'text-blue-600', bg: 'bg-blue-50', border: 'hover:border-blue-200' },
    { name: 'Total Rooms', value: roomCount, icon: Users, href: '/admin/pgs', color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'hover:border-indigo-200' },
    { name: 'Pending Reviews', value: pendingReviewsCount, icon: Star, href: '/admin/reviews', color: 'text-amber-600', bg: 'bg-amber-50', border: 'hover:border-amber-200' },
    { name: 'New Enquiries', value: unreadEnquiriesCount, icon: MessageSquare, href: '/admin/enquiries', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'hover:border-emerald-200' },
  ]

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-500 mt-1 text-sm sm:text-base">Welcome back! Here's what's happening with your properties today.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.name} href={stat.href} className="group outline-none">
              <div className={`bg-white p-6 rounded-2xl shadow-sm border border-slate-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${stat.border}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.bg} group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-slate-500 transition-colors opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0" />
                </div>
                <div>
                  <p className="text-4xl font-bold text-slate-900 mb-1">{stat.value}</p>
                  <p className="text-sm font-medium text-slate-500">{stat.name}</p>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mt-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-500" /> Recent Enquiries
            </h2>
          </div>
          <div className="p-6 flex-1 flex flex-col justify-center items-center text-center bg-slate-50/50">
            {unreadEnquiriesCount === 0 ? (
              <>
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                  <MessageSquare className="w-8 h-8 text-emerald-300" />
                </div>
                <p className="text-slate-500 font-medium">You're all caught up!</p>
                <p className="text-sm text-slate-400 mt-1">No unread enquiries.</p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-emerald-600">{unreadEnquiriesCount}</span>
                </div>
                <p className="text-slate-900 font-bold text-lg">New Enquiries</p>
                <p className="text-sm text-slate-500 mt-1 mb-6">You have unread messages waiting for a response.</p>
                <Link href="/admin/enquiries" className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-full font-medium transition-colors text-sm w-full sm:w-auto shadow-sm">
                  Review Enquiries
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500" /> Pending Reviews
            </h2>
          </div>
          <div className="p-6 flex-1 flex flex-col justify-center items-center text-center bg-slate-50/50">
            {pendingReviewsCount === 0 ? (
              <>
                <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mb-4">
                  <Star className="w-8 h-8 text-amber-300" />
                </div>
                <p className="text-slate-500 font-medium">No reviews pending.</p>
                <p className="text-sm text-slate-400 mt-1">All reviews are approved or deleted.</p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-amber-600">{pendingReviewsCount}</span>
                </div>
                <p className="text-slate-900 font-bold text-lg">Reviews to Moderate</p>
                <p className="text-sm text-slate-500 mt-1 mb-6">New reviews from residents need your approval.</p>
                <Link href="/admin/reviews" className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2.5 rounded-full font-medium transition-colors text-sm w-full sm:w-auto shadow-sm">
                  Manage Reviews
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
