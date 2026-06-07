import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { markAsContacted, deleteEnquiry } from './actions'

export const revalidate = 0

export default async function EnquiriesPage() {
  const enquiries = await prisma.enquiry.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      pg: { select: { name: true } }
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Manage Enquiries</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-500">
                <th className="p-4">Date</th>
                <th className="p-4">Name</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Property</th>
                <th className="p-4">Message</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm">
              {enquiries.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500">
                    No enquiries found.
                  </td>
                </tr>
              )}
              {enquiries.map((enq) => (
                <tr key={enq.id} className="hover:bg-gray-50">
                  <td className="p-4 whitespace-nowrap text-gray-500">
                    {enq.createdAt.toLocaleDateString()}
                  </td>
                  <td className="p-4 font-medium text-gray-900">{enq.name}</td>
                  <td className="p-4 text-gray-600">{enq.phone}</td>
                  <td className="p-4 text-gray-600">{enq.pg?.name || 'Not specified'}</td>
                  <td className="p-4 text-gray-600 max-w-xs truncate" title={enq.message}>{enq.message}</td>
                  <td className="p-4">
                    {enq.isContacted ? (
                      <Badge variant="success">Contacted</Badge>
                    ) : (
                      <Badge variant="warning">Pending</Badge>
                    )}
                  </td>
                  <td className="p-4 text-right whitespace-nowrap">
                    <form className="inline-flex gap-2">
                      {!enq.isContacted && (
                        <button 
                          formAction={markAsContacted.bind(null, enq.id)}
                          className="text-indigo-600 hover:text-indigo-900 font-medium"
                        >
                          Mark Contacted
                        </button>
                      )}
                      <button 
                        formAction={deleteEnquiry.bind(null, enq.id)}
                        className="text-red-600 hover:text-red-900 font-medium ml-2"
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
