import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { Building, Plus, Trash2, Edit, CheckCircle, XCircle } from 'lucide-react'
import { deletePg, togglePgStatus } from './actions'

export const revalidate = 0

export default async function AdminPgsPage() {
  const pgs = await prisma.pgProperty.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      roomTypes: true,
      _count: {
        select: { reviews: true, enquiries: true }
      }
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Manage PG Properties</h1>
        <Button href="/admin/pgs/create" className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add New PG
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {pgs.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center text-gray-500">
              <Building className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium">No properties found</p>
              <p className="mt-2 mb-6">You haven't added any PG properties yet.</p>
              <Button href="/admin/pgs/create">Create your first PG</Button>
            </CardContent>
          </Card>
        )}

        {pgs.map((pg) => (
          <Card key={pg.id} className="overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-64 bg-gray-200 h-48 md:h-auto relative shrink-0">
                <img 
                  src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=2069&auto=format&fit=crop" 
                  alt={pg.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  {pg.isActive ? (
                    <Badge variant="success" className="bg-green-100 text-green-800">Active</Badge>
                  ) : (
                    <Badge variant="error" className="bg-red-100 text-red-800">Inactive</Badge>
                  )}
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{pg.name}</h3>
                      <p className="text-gray-500 text-sm mt-1">{pg.address}</p>
                    </div>
                    <Badge variant="outline">{pg.pgType} PG</Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
                    <div className="bg-gray-50 p-3 rounded-lg text-center border border-gray-100">
                      <p className="text-xs text-gray-500 font-medium">Room Types</p>
                      <p className="text-lg font-bold text-gray-900">{pg.roomTypes.length}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg text-center border border-gray-100">
                      <p className="text-xs text-gray-500 font-medium">Starting Rent</p>
                      <p className="text-lg font-bold text-gray-900">
                        {pg.roomTypes.length > 0 
                          ? `₹${Math.min(...pg.roomTypes.map(rt => rt.rent)).toLocaleString('en-IN')}` 
                          : 'N/A'}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg text-center border border-gray-100">
                      <p className="text-xs text-gray-500 font-medium">Reviews</p>
                      <p className="text-lg font-bold text-gray-900">{pg._count.reviews}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg text-center border border-gray-100">
                      <p className="text-xs text-gray-500 font-medium">Enquiries</p>
                      <p className="text-lg font-bold text-gray-900">{pg._count.enquiries}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
                  <Link href={`/pgs/${pg.id}`} target="_blank" className="text-sm font-medium text-gray-600 hover:text-indigo-600 mr-auto">
                    View on site ↗
                  </Link>
                  
                  <form className="inline-block">
                    <button 
                      formAction={togglePgStatus.bind(null, pg.id, pg.isActive)}
                      className={`text-sm font-medium px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${
                        pg.isActive ? 'text-orange-600 hover:bg-orange-50' : 'text-green-600 hover:bg-green-50'
                      }`}
                    >
                      {pg.isActive ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                      {pg.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </form>
                  
                  <Link 
                    href={`/admin/pgs/${pg.id}/edit`}
                    className="text-sm font-medium text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors"
                  >
                    <Edit className="w-4 h-4" /> Edit
                  </Link>
                  
                  <form className="inline-block">
                    <button 
                      formAction={deletePg.bind(null, pg.id)}
                      className="text-sm font-medium text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
