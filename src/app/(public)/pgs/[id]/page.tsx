import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { MapPin, Phone, MessageCircle, Info, Star } from 'lucide-react'

export const revalidate = 60

export default async function PgDetailPage({ params }: { params: { id: string } }) {
  // Await the params object in Next.js 15+ (Next.js 15 requires params to be awaited)
  const resolvedParams = await params;
  
  const pg = await prisma.pgProperty.findUnique({
    where: { id: resolvedParams.id },
    include: {
      roomTypes: true,
      images: true,
      reviews: {
        where: { isApproved: true },
        orderBy: { createdAt: 'desc' }
      },
      amenities: {
        include: { amenity: true }
      }
    }
  })

  if (!pg || !pg.isActive) {
    notFound()
  }

  // Use placeholder images if none exist
  const images = pg.images.length > 0 
    ? pg.images.map(img => img.url)
    : [
        "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=2069&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1502672260266-1c1e5250a256?q=80&w=2064&auto=format&fit=crop"
      ];

  const mainImage = images[0]
  const galleryImages = images.slice(1, 5)

  // Use business settings contact if pg specific is missing
  const settings = await prisma.businessSettings.findFirst()
  const contactNumber = pg.ownerContact || settings?.contactNumber || ''
  const whatsappNumber = pg.whatsappContact || settings?.whatsappNumber || contactNumber

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <Badge variant="default">{pg.pgType} PG</Badge>
          {pg.roomTypes.some(rt => rt.isAvailable) ? (
            <Badge variant="success">Rooms Available</Badge>
          ) : (
            <Badge variant="error">Currently Full</Badge>
          )}
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-2">{pg.name}</h1>
        <div className="flex items-center text-gray-600">
          <MapPin className="w-5 h-5 mr-2 shrink-0 text-indigo-600" />
          <span className="text-lg">{pg.address}</span>
        </div>
      </div>

      {/* Photo Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12 h-auto md:h-[400px]">
        <div className="md:col-span-3 h-64 md:h-full rounded-2xl overflow-hidden bg-gray-200">
          <img src={mainImage} alt={pg.name} className="w-full h-full object-cover" />
        </div>
        <div className="hidden md:grid grid-rows-2 gap-4 h-full">
          {galleryImages.map((img, i) => (
            <div key={i} className="rounded-2xl overflow-hidden bg-gray-200 h-full">
              <img src={img} alt={`${pg.name} ${i+2}`} className="w-full h-full object-cover" />
            </div>
          ))}
          {galleryImages.length === 0 && (
            <div className="rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-500 h-full">
              No more photos
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-10">
          {/* About */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About this PG</h2>
            <div className="prose max-w-none text-gray-600">
              <p className="whitespace-pre-wrap">{pg.description || 'No description provided.'}</p>
            </div>
          </section>

          {/* Amenities */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-2">
              {pg.amenities.map((pa) => (
                <div key={pa.amenity.id} className="flex items-center text-gray-700">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 mr-3"></div>
                  {pa.amenity.name}
                </div>
              ))}
              {pg.amenities.length === 0 && <p className="text-gray-500 col-span-3">No amenities listed.</p>}
            </div>
          </section>

          {/* Rules */}
          {pg.rules && (
            <section className="bg-orange-50 p-6 rounded-xl border border-orange-100">
              <h2 className="text-xl font-bold text-orange-900 mb-3 flex items-center">
                <Info className="w-5 h-5 mr-2" /> PG Rules
              </h2>
              <p className="whitespace-pre-wrap text-orange-800">{pg.rules}</p>
            </section>
          )}

          {/* Reviews */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Student Reviews</h2>
            {pg.reviews.length === 0 ? (
              <p className="text-gray-500">No reviews yet. Be the first to leave a review!</p>
            ) : (
              <div className="space-y-4">
                {pg.reviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-900">{review.name}</span>
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{review.message}</p>
                      <span className="text-xs text-gray-400">{review.createdAt.toLocaleDateString()}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="sticky top-24">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle>Room Pricing</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ul className="divide-y divide-gray-100">
                {pg.roomTypes.map((room) => (
                  <li key={room.id} className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                    <div>
                      <div className="font-medium text-gray-900">{room.sharingType}</div>
                      {room.deposit ? (
                        <div className="text-xs text-gray-500">Dep: ₹{room.deposit.toLocaleString('en-IN')}</div>
                      ) : null}
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-indigo-600 text-lg">₹{room.rent.toLocaleString('en-IN')}</div>
                      <div className="text-xs text-gray-500">per month</div>
                    </div>
                  </li>
                ))}
                {pg.roomTypes.length === 0 && (
                  <li className="p-4 text-center text-gray-500">Pricing not available</li>
                )}
              </ul>
            </CardContent>
            <CardContent className="pt-6 pb-6 border-t border-gray-100">
              <div className="space-y-3">
                <Button 
                  href={`tel:${contactNumber}`} 
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white"
                >
                  <Phone className="w-4 h-4 mr-2" /> Call Owner
                </Button>
                <Button 
                  href={`https://wa.me/${whatsappNumber?.replace(/\D/g,'')}`} 
                  target="_blank"
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  <MessageCircle className="w-4 h-4 mr-2" /> WhatsApp
                </Button>
                <Button 
                  href="/contact" 
                  variant="outline" 
                  className="w-full"
                >
                  Send Enquiry
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
