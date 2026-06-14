import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { MapPin, Phone, MessageCircle, Info, Star, CheckCircle2 } from 'lucide-react'

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
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=2069&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1502672260266-1c1e5250a256?q=80&w=2064&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop"
      ];

  const mainImage = images[0]
  const galleryImages = images.slice(1, 5)

  // Use business settings contact if pg specific is missing
  const settings = await prisma.businessSettings.findFirst()
  const contactNumber = pg.ownerContact || settings?.contactNumber || ''
  const whatsappNumber = pg.whatsappContact || settings?.whatsappNumber || contactNumber
  
  let formattedWhatsapp = whatsappNumber?.replace(/\D/g, '') || ''
  if (formattedWhatsapp.length === 10) {
    formattedWhatsapp = '91' + formattedWhatsapp
  }

  // Calculate stats
  const averageRating = pg.reviews.length > 0 
    ? (pg.reviews.reduce((acc, curr) => acc + curr.rating, 0) / pg.reviews.length).toFixed(1)
    : 'New'
  const lowestRent = pg.roomTypes.length > 0 ? Math.min(...pg.roomTypes.map(rt => rt.rent)) : null

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Full-width Photo Gallery Header */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight">{pg.name}</h1>
            <div className="flex items-center text-gray-600 mt-2">
              <MapPin className="w-5 h-5 mr-1.5 shrink-0 text-indigo-600" />
              <span className="text-lg font-medium">{pg.address}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="default" className="text-sm px-4 py-1.5 bg-indigo-100 text-indigo-800 border-none shadow-sm">{pg.pgType} PG</Badge>
            {pg.roomTypes.some(rt => rt.isAvailable) ? (
              <Badge variant="success" className="text-sm px-4 py-1.5 border-none shadow-sm">Rooms Available</Badge>
            ) : (
              <Badge variant="error" className="text-sm px-4 py-1.5 border-none shadow-sm">Currently Full</Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 h-[40vh] md:h-[60vh] rounded-3xl overflow-hidden shadow-2xl relative">
          <div className="md:col-span-2 h-full relative group">
            <img src={mainImage} alt={pg.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
          </div>
          <div className="hidden md:grid grid-cols-2 grid-rows-2 col-span-2 gap-3 h-full">
            {galleryImages.map((img, i) => (
              <div key={i} className="h-full relative group overflow-hidden rounded-xl">
                <img src={img} alt={`${pg.name} ${i+2}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
            ))}
            {galleryImages.length === 0 && (
              <div className="h-full bg-gray-100 flex items-center justify-center rounded-xl">
                <span className="text-gray-400 font-medium">No more photos</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left Column: Details */}
          <div className="lg:col-span-2 space-y-16">
            
            {/* Quick Stats Banner */}
            <div className="flex flex-wrap items-center justify-around gap-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="text-center">
                <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold mb-1">Rating</p>
                <div className="flex items-center justify-center text-2xl font-bold text-gray-900">
                  <Star className="w-6 h-6 text-yellow-400 fill-current mr-2" />
                  {averageRating}
                </div>
              </div>
              <div className="w-px h-12 bg-gray-200 hidden sm:block"></div>
              <div className="text-center">
                <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold mb-1">Reviews</p>
                <div className="text-2xl font-bold text-gray-900">{pg.reviews.length}</div>
              </div>
              <div className="w-px h-12 bg-gray-200 hidden sm:block"></div>
              <div className="text-center">
                <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold mb-1">Amenities</p>
                <div className="text-2xl font-bold text-gray-900">{pg.amenities.length}</div>
              </div>
            </div>

            {/* About */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">About this Property</h2>
              <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed">
                <p className="whitespace-pre-wrap">{pg.description || 'Welcome to our premium PG accommodation. Enjoy a comfortable and secure stay with us.'}</p>
              </div>
            </section>

            {/* Amenities Grid */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">What this place offers</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {pg.amenities.map((pa) => (
                  <div key={pa.amenity.id} className="flex items-center text-gray-700 bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:border-indigo-200 transition-colors">
                    <CheckCircle2 className="w-6 h-6 text-indigo-500 mr-3 shrink-0" />
                    <span className="font-medium">{pa.amenity.name}</span>
                  </div>
                ))}
                {pg.amenities.length === 0 && <p className="text-gray-500 col-span-3">No amenities listed yet.</p>}
              </div>
            </section>

            {/* Rules */}
            {pg.rules && (
              <section className="bg-gradient-to-br from-orange-50 to-red-50 p-8 rounded-3xl border border-orange-100/50 shadow-inner">
                <h2 className="text-2xl font-bold text-orange-900 mb-4 flex items-center">
                  <Info className="w-6 h-6 mr-3 text-orange-600" /> House Rules
                </h2>
                <p className="whitespace-pre-wrap text-orange-800/90 text-lg leading-relaxed">{pg.rules}</p>
              </section>
            )}

            {/* Location / Map */}
            <section>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900">Location</h2>
                <Button 
                  href={pg.mapsLink || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pg.address)}`} 
                  target="_blank" 
                  variant="outline"
                  className="hidden sm:flex"
                >
                  <MapPin className="w-4 h-4 mr-2" /> Get Directions
                </Button>
              </div>
              <div className="w-full h-[300px] md:h-[400px] rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-gray-200">
                <iframe
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(pg.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                ></iframe>
              </div>
              <div className="mt-4 sm:hidden">
                <Button 
                  href={pg.mapsLink || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pg.address)}`} 
                  target="_blank" 
                  variant="outline"
                  className="w-full"
                >
                  <MapPin className="w-4 h-4 mr-2" /> Get Directions
                </Button>
              </div>
            </section>

            {/* Reviews */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Student Reviews</h2>
              {pg.reviews.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
                  <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No reviews yet. Be the first to leave a review!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {pg.reviews.map((review) => (
                    <Card key={review.id} className="bg-white border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex text-yellow-400 mb-3">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-200'}`} />
                          ))}
                        </div>
                        <p className="text-gray-700 mb-4 line-clamp-4 leading-relaxed">{review.message}</p>
                        <div className="flex items-center justify-between mt-auto">
                          <span className="font-bold text-gray-900">{review.name}</span>
                          <span className="text-sm text-gray-400 font-medium">{review.createdAt.toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Right Column: Sticky Booking / Pricing Widget */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="border-0 shadow-2xl rounded-3xl overflow-hidden bg-white">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
                  <p className="text-indigo-100 font-medium mb-1">Starting from</p>
                  <div className="flex items-end">
                    <span className="text-4xl font-extrabold">₹{lowestRent ? lowestRent.toLocaleString('en-IN') : '--'}</span>
                    <span className="text-indigo-100 ml-2 mb-1">/ month</span>
                  </div>
                </div>
                
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Room Pricing</h3>
                  <ul className="space-y-4 mb-8">
                    {pg.roomTypes.map((room) => (
                      <li key={room.id} className="group p-4 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{room.sharingType}</span>
                          <span className="font-bold text-indigo-600">₹{room.rent.toLocaleString('en-IN')}</span>
                        </div>
                        {room.deposit ? (
                          <div className="text-sm text-gray-500">Security Deposit: ₹{room.deposit.toLocaleString('en-IN')}</div>
                        ) : null}
                        {!room.isAvailable && (
                          <div className="mt-2 text-xs font-bold text-red-500 bg-red-50 inline-block px-2 py-1 rounded">Currently Full</div>
                        )}
                      </li>
                    ))}
                    {pg.roomTypes.length === 0 && (
                      <li className="text-center text-gray-500 py-4">Pricing details not available</li>
                    )}
                  </ul>

                  <div className="space-y-4 pt-6 border-t border-gray-100">
                    <Button 
                      href={`tel:${contactNumber}`} 
                      className="w-full h-14 text-lg font-bold shadow-lg shadow-indigo-200"
                    >
                      <Phone className="w-5 h-5 mr-2" /> Call Owner
                    </Button>
                    <Button 
                      href={`https://wa.me/${formattedWhatsapp}`} 
                      target="_blank"
                      className="w-full h-14 text-lg font-bold bg-[#25D366] hover:bg-[#1ebd5b] text-white border-0 shadow-lg shadow-green-200"
                    >
                      <MessageCircle className="w-5 h-5 mr-2" /> WhatsApp Now
                    </Button>
                    <Button 
                      href="/contact" 
                      variant="outline" 
                      className="w-full h-14 text-lg font-bold border-2"
                    >
                      Send Enquiry
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

