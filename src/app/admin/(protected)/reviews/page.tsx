import { prisma } from '@/lib/prisma'
import { Badge } from '@/components/ui/Badge'
import { approveReview, deleteReview } from './actions'
import { Star } from 'lucide-react'

export const revalidate = 0

export default async function ReviewsPage() {
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      pg: { select: { name: true } }
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Manage Reviews</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-500">
                <th className="p-4 w-32">Date</th>
                <th className="p-4 w-48">Name</th>
                <th className="p-4 w-32">Rating</th>
                <th className="p-4">Property</th>
                <th className="p-4">Message</th>
                <th className="p-4 w-24">Status</th>
                <th className="p-4 w-48 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm">
              {reviews.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500">
                    No reviews found.
                  </td>
                </tr>
              )}
              {reviews.map((review) => (
                <tr key={review.id} className="hover:bg-gray-50">
                  <td className="p-4 whitespace-nowrap text-gray-500">
                    {review.createdAt.toLocaleDateString()}
                  </td>
                  <td className="p-4 font-medium text-gray-900">{review.name}</td>
                  <td className="p-4">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} />
                      ))}
                    </div>
                  </td>
                  <td className="p-4 text-gray-600">{review.pg?.name || 'Unknown'}</td>
                  <td className="p-4 text-gray-600 max-w-xs truncate" title={review.message}>{review.message}</td>
                  <td className="p-4">
                    {review.isApproved ? (
                      <Badge variant="success">Approved</Badge>
                    ) : (
                      <Badge variant="warning">Pending</Badge>
                    )}
                  </td>
                  <td className="p-4 text-right whitespace-nowrap">
                    <form className="inline-flex gap-3">
                      {!review.isApproved && (
                        <button 
                          formAction={approveReview.bind(null, review.id)}
                          className="text-indigo-600 hover:text-indigo-900 font-medium"
                        >
                          Approve
                        </button>
                      )}
                      <button 
                        formAction={deleteReview.bind(null, review.id)}
                        className="text-red-600 hover:text-red-900 font-medium"
                      >
                        Delete
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
