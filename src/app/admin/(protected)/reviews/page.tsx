import { prisma } from '@/lib/prisma'
import { Badge } from '@/components/ui/Badge'
import { approveReview, deleteReview } from './actions'
import { Star, Building, Calendar, CheckCircle, Trash2, MessageSquare } from 'lucide-react'

export const revalidate = 0

export default async function ReviewsPage() {
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      pg: { select: { name: true } }
    }
  })

  return (
    <div className="space-y-6 sm:space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Manage Reviews</h1>
          <p className="text-slate-500 mt-1 text-sm sm:text-base">Review and approve tenant feedback before it goes public.</p>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-100 border-dashed p-12 text-center text-slate-500 flex flex-col items-center shadow-sm">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
            <Star className="w-10 h-10 text-slate-300" />
          </div>
          <p className="text-xl font-bold text-slate-900 mb-2">No reviews yet</p>
          <p className="max-w-sm mx-auto text-slate-500">When tenants leave reviews for your properties, they will appear here for moderation.</p>
        </div>
      ) : (
        <>
          {/* Mobile View: Cards */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">{review.name}</h3>
                    <div className="flex text-amber-400 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-current' : 'text-slate-200'}`} />
                      ))}
                    </div>
                  </div>
                  {review.isApproved ? (
                    <Badge variant="success" className="bg-emerald-50 text-emerald-700">Approved</Badge>
                  ) : (
                    <Badge variant="warning" className="bg-amber-50 text-amber-700">Pending</Badge>
                  )}
                </div>
                
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100/50">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" /> Feedback
                  </p>
                  <p className="text-sm text-slate-700 italic">"{review.message}"</p>
                </div>
                
                <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1"><Building className="w-3 h-3" /> {review.pg?.name || 'Unknown'}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {review.createdAt.toLocaleDateString()}</span>
                </div>
                
                <div className="pt-4 border-t border-slate-100 flex items-center gap-2 mt-2">
                  <form className="flex-1 flex gap-2">
                    {!review.isApproved && (
                      <button 
                        formAction={approveReview.bind(null, review.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" /> Approve
                      </button>
                    )}
                    <button 
                      formAction={deleteReview.bind(null, review.id)}
                      className={`flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-700 py-2.5 rounded-xl text-sm font-semibold transition-colors ${review.isApproved ? 'flex-1' : 'px-4'}`}
                    >
                      <Trash2 className="w-4 h-4" /> {review.isApproved && 'Delete'}
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop View: Table */}
          <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-200 text-xs uppercase tracking-wider font-semibold text-slate-500">
                    <th className="p-5 w-32">Date</th>
                    <th className="p-5 w-48">Reviewer</th>
                    <th className="p-5 w-32">Rating</th>
                    <th className="p-5">Property</th>
                    <th className="p-5">Feedback</th>
                    <th className="p-5 w-24">Status</th>
                    <th className="p-5 text-right w-40">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {reviews.map((review) => (
                    <tr key={review.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-5 whitespace-nowrap text-slate-500 font-medium">
                        {review.createdAt.toLocaleDateString()}
                      </td>
                      <td className="p-5 font-bold text-slate-900">{review.name}</td>
                      <td className="p-5">
                        <div className="flex text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-slate-200'}`} />
                          ))}
                        </div>
                      </td>
                      <td className="p-5 text-slate-600 font-medium">{review.pg?.name || 'Unknown'}</td>
                      <td className="p-5 text-slate-600 max-w-xs truncate" title={review.message}>{review.message}</td>
                      <td className="p-5">
                        {review.isApproved ? (
                          <Badge variant="success" className="bg-emerald-50 text-emerald-700 border-emerald-200">Approved</Badge>
                        ) : (
                          <Badge variant="warning" className="bg-amber-50 text-amber-700 border-amber-200">Pending</Badge>
                        )}
                      </td>
                      <td className="p-5 text-right whitespace-nowrap">
                        <form className="inline-flex items-center justify-end gap-3">
                          {!review.isApproved && (
                            <button 
                              formAction={approveReview.bind(null, review.id)}
                              className="text-indigo-600 hover:text-indigo-800 font-semibold transition-colors flex items-center gap-1"
                            >
                              <CheckCircle className="w-4 h-4" /> Approve
                            </button>
                          )}
                          <button 
                            formAction={deleteReview.bind(null, review.id)}
                            className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-full hover:bg-red-50"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
