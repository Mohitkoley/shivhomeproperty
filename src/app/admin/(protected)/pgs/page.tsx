import { prisma } from '@/lib/prisma'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { Building, Plus, Trash2, Edit, CheckCircle, XCircle, MapPin, Users, Star, MessageSquare } from 'lucide-react'
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
    <div className="space-y-6 sm:space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Manage Properties</h1>
          <p className="text-slate-500 mt-1 text-sm sm:text-base">Add, update, or remove your PG listings.</p>
        </div>
        <Button href="/admin/pgs/create" className="flex items-center gap-2 rounded-full w-full sm:w-auto shadow-sm">
          <Plus className="w-4 h-4" /> Add New Property
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {pgs.length === 0 && (
          <div className="bg-white rounded-3xl border border-slate-100 border-dashed p-12 text-center text-slate-500 flex flex-col items-center shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              <Building className="w-10 h-10 text-slate-300" />
            </div>
            <p className="text-xl font-bold text-slate-900 mb-2">No properties found</p>
            <p className="mb-8 max-w-sm mx-auto">You haven't added any PG properties yet. Start by creating your first listing.</p>
            <Button href="/admin/pgs/create" className="rounded-full shadow-sm">Create your first PG</Button>
          </div>
        )}

        {pgs.map((pg) => (
          <div key={pg.id} className="bg-white rounded-2xl md:rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-lg transition-shadow">
            <div className="flex flex-col md:flex-row h-full">
              {/* Image Section */}
              <div className="md:w-72 bg-slate-100 h-56 md:h-auto relative shrink-0">
                <img 
                  src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=2069&auto=format&fit=crop" 
                  alt={pg.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  {pg.isActive ? (
                    <Badge variant="success" className="bg-emerald-500 text-white border-none shadow-sm px-3">Active</Badge>
                  ) : (
                    <Badge variant="error" className="bg-red-500 text-white border-none shadow-sm px-3">Inactive</Badge>
                  )}
                </div>
              </div>
              
              {/* Content Section */}
              <div className="p-5 sm:p-6 lg:p-8 flex-1 flex flex-col">
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">{pg.name}</h3>
                      <div className="flex items-center text-slate-500 text-sm mt-2">
                        <MapPin className="w-4 h-4 mr-1.5 shrink-0 text-indigo-500" />
                        <span>{pg.address}</span>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-slate-50 text-slate-600 self-start shrink-0">{pg.pgType} PG</Badge>
                  </div>
                  
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 my-6 lg:my-8">
                    <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-100/50">
                      <div className="flex items-center justify-center mb-1">
                        <Users className="w-4 h-4 text-indigo-400 mr-1.5" />
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Rooms</p>
                      </div>
                      <p className="text-lg font-bold text-slate-900">{pg.roomTypes.length}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-100/50">
                      <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Rent</p>
                      <p className="text-lg font-bold text-slate-900">
                        {pg.roomTypes.length > 0 
                          ? `₹${Math.min(...pg.roomTypes.map(rt => rt.rent)).toLocaleString('en-IN')}` 
                          : 'N/A'}
                      </p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-100/50">
                      <div className="flex items-center justify-center mb-1">
                        <Star className="w-4 h-4 text-amber-400 mr-1.5" />
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Reviews</p>
                      </div>
                      <p className="text-lg font-bold text-slate-900">{pg._count.reviews}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-100/50">
                      <div className="flex items-center justify-center mb-1">
                        <MessageSquare className="w-4 h-4 text-emerald-400 mr-1.5" />
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Inquiries</p>
                      </div>
                      <p className="text-lg font-bold text-slate-900">{pg._count.enquiries}</p>
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-auto pt-5 border-t border-slate-100">
                  <Link href={`/pgs/${pg.id}`} target="_blank" className="w-full sm:w-auto text-center text-sm font-semibold text-slate-600 hover:text-indigo-600 mr-auto py-2 sm:py-0 transition-colors">
                    Preview Listing ↗
                  </Link>
                  
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <form className="inline-block">
                      <button 
                        formAction={togglePgStatus.bind(null, pg.id, pg.isActive)}
                        className={`text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                          pg.isActive ? 'text-amber-700 bg-amber-50 hover:bg-amber-100' : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                        }`}
                      >
                        {pg.isActive ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                        <span className="hidden sm:inline">{pg.isActive ? 'Deactivate' : 'Activate'}</span>
                      </button>
                    </form>
                    
                    <Link 
                      href={`/admin/pgs/${pg.id}/edit`}
                      className="text-sm font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      <span className="hidden sm:inline">Edit</span>
                    </Link>
                    
                    <form className="inline-block">
                      <button 
                        formAction={deletePg.bind(null, pg.id)}
                        className="text-sm font-semibold text-red-700 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
