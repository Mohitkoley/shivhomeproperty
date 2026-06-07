import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { MapPin, Home } from 'lucide-react'
import Link from 'next/link'

export const revalidate = 0; // Better to avoid caching if we use searchParams dynamically

export default async function PgsPage({ searchParams }: { searchParams: { area?: string } }) {
  const resolvedSearchParams = await searchParams;
  const currentArea = resolvedSearchParams.area || 'All';

  // Find all active PGs
  const whereClause = { isActive: true, ...(currentArea !== 'All' ? { area: currentArea } : {}) };

  const pgs = await prisma.pgProperty.findMany({
    where: whereClause,
    include: {
      roomTypes: true,
      amenities: {
        include: { amenity: true }
      }
    }
  })

  // Fetch unique areas for tabs
  const allActivePgs = await prisma.pgProperty.findMany({
    where: { isActive: true },
    select: { area: true }
  });
  
  const uniqueAreas = Array.from(new Set(allActivePgs.map(p => p.area).filter(Boolean))) as string[];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6">Our Premium PGs</h1>
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
          Explore our range of fully-furnished and secure accommodations designed for your comfort. Filter by your preferred location below.
        </p>
      </div>

      {uniqueAreas.length > 0 && (
        <div className="mb-12">
          {/* Scrollable Tabs Container */}
          <div className="flex overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 hide-scrollbar justify-start sm:justify-center">
            <div className="flex gap-3 p-1.5 bg-slate-100/80 backdrop-blur-sm rounded-full border border-slate-200 shadow-inner">
              <Link 
                href="/pgs" 
                className={`relative px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 whitespace-nowrap ${
                  currentArea === 'All' 
                    ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/50' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                All Locations
              </Link>
              {uniqueAreas.map(area => (
                <Link 
                  key={area}
                  href={`/pgs?area=${encodeURIComponent(area)}`}
                  className={`relative flex items-center px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 whitespace-nowrap ${
                    currentArea === area 
                      ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/50' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  <MapPin className={`w-4 h-4 mr-2 ${currentArea === area ? 'text-indigo-500' : 'text-slate-400'}`} />
                  {area}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {pgs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 bg-slate-50 rounded-3xl border border-slate-100 border-dashed">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
            <Home className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No properties found</h3>
          <p className="text-slate-500 text-center max-w-md">We couldn't find any properties in this area. Try selecting a different location or check back later.</p>
          <Button href="/pgs" variant="outline" className="mt-6 rounded-full">
            View All Locations
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {pgs.map((pg) => {
            const lowestRent = pg.roomTypes.length > 0 
              ? Math.min(...pg.roomTypes.map(rt => rt.rent)) 
              : 0;

            return (
              <div key={pg.id} className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                {/* Image Container */}
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                  <img 
                    src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=2069&auto=format&fit=crop" 
                    alt={pg.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge variant="default" className="bg-white text-slate-900 font-semibold px-3 py-1 shadow-sm backdrop-blur-md border-none">{pg.pgType} PG</Badge>
                  </div>
                </div>
                
                {/* Content */}
                <div className="flex flex-col flex-1 p-6 sm:p-8">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-slate-900 mb-2 line-clamp-1">{pg.name}</h3>
                    <div className="flex items-center text-slate-500 text-sm mb-6">
                      <MapPin className="w-4 h-4 mr-1.5 shrink-0 text-indigo-500" />
                      <span className="line-clamp-1">{pg.area ? `${pg.area} • ` : ''}{pg.address}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-8">
                      {pg.amenities.slice(0, 3).map((pa) => (
                        <div key={pa.amenity.id} className="px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg text-sm font-medium border border-slate-100">
                          {pa.amenity.name}
                        </div>
                      ))}
                      {pg.amenities.length > 3 && (
                        <div className="px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg text-sm font-medium border border-slate-100">
                          +{pg.amenities.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                    <div>
                      <p className="text-sm text-slate-500 font-medium mb-0.5">Starts from</p>
                      <div className="text-2xl font-bold text-indigo-600">
                        ₹{lowestRent.toLocaleString('en-IN')}
                        <span className="text-sm text-slate-500 font-normal">/mo</span>
                      </div>
                    </div>
                    <Button href={`/pgs/${pg.id}`} className="rounded-full bg-slate-900 hover:bg-slate-800 text-white px-6">
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
