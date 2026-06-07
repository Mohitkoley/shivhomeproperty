import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { MapPin } from 'lucide-react'

export const revalidate = 60;

export default async function PgsPage() {
  const pgs = await prisma.pgProperty.findMany({
    where: { isActive: true },
    include: {
      roomTypes: true,
      amenities: {
        include: { amenity: true }
      }
    }
  })

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-4">Our Premium PGs</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Explore our range of fully-furnished and secure accommodations designed for your comfort.
        </p>
      </div>

      {pgs.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No properties available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pgs.map((pg) => {
            const lowestRent = pg.roomTypes.length > 0 
              ? Math.min(...pg.roomTypes.map(rt => rt.rent)) 
              : 0;

            return (
              <Card key={pg.id} className="hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gray-200 relative overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=2069&auto=format&fit=crop" 
                    alt={pg.name} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <Badge variant="default" className="bg-white/90 text-indigo-800 backdrop-blur-sm">{pg.pgType} PG</Badge>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-1">{pg.name}</CardTitle>
                  <div className="flex items-center text-gray-500 text-sm mt-2">
                    <MapPin className="w-4 h-4 mr-1 shrink-0" />
                    <span className="line-clamp-1">{pg.address}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {pg.amenities.slice(0, 3).map((pa) => (
                      <Badge key={pa.amenity.id} variant="outline" className="bg-gray-50">
                        {pa.amenity.name}
                      </Badge>
                    ))}
                    {pg.amenities.length > 3 && (
                      <Badge variant="outline" className="bg-gray-50">+{pg.amenities.length - 3} more</Badge>
                    )}
                  </div>
                  <div className="text-2xl font-bold text-indigo-600">
                    ₹{lowestRent.toLocaleString('en-IN')}
                    <span className="text-sm text-gray-500 font-normal"> / month onwards</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button href={`/pgs/${pg.id}`} className="w-full">View Details</Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
