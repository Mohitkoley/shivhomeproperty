import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { prisma } from '@/lib/prisma'
import { MapPin, Wifi, CheckCircle, ShieldCheck, Home } from 'lucide-react'

// Revalidate this page every 60 seconds or make it dynamic if preferred
export const revalidate = 60;

export default async function HomePage() {
  const pgs = await prisma.pgProperty.findMany({
    where: { isActive: true },
    take: 3,
    include: {
      roomTypes: true,
      amenities: {
        include: { amenity: true }
      }
    }
  })

  return (
    <div className="flex flex-col gap-16 pb-16">
      {/* Hero Section */}
      <section className="relative bg-indigo-900 text-white overflow-hidden py-24 sm:py-32">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
        <div className="container relative mx-auto px-4 text-center z-10">
          <Badge variant="default" className="mb-6">Premium PG Accommodations</Badge>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            Find Your Perfect <span className="text-indigo-400">Home Away From Home</span>
          </h1>
          <p className="mt-4 text-xl text-indigo-100 max-w-2xl mx-auto mb-10">
            Comfortable, secure, and fully-furnished PGs for students and professionals. Experience the best living with all modern amenities included.
          </p>
          <div className="flex justify-center gap-4">
            <Button href="/pgs" size="lg" variant="secondary">
              View Available PGs
            </Button>
            <Button href="/contact" variant="outline" size="lg" className="border-indigo-400 text-white hover:bg-indigo-800">
              Contact Owner
            </Button>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Shiv PG?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">We provide everything you need for a comfortable stay so you can focus on your studies or career.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { title: "Fully Furnished", desc: "Comfortable beds, almirahs, and study tables in every room.", icon: <Home className="w-8 h-8 text-indigo-600" /> },
            { title: "High-Speed WiFi", desc: "Stay connected with uninterrupted internet access.", icon: <Wifi className="w-8 h-8 text-indigo-600" /> },
            { title: "Safe & Secure", desc: "24/7 CCTV surveillance and secure entry for your peace of mind.", icon: <ShieldCheck className="w-8 h-8 text-indigo-600" /> },
            { title: "Affordable Rent", desc: "Quality living at prices that won't break the bank.", icon: <CheckCircle className="w-8 h-8 text-indigo-600" /> },
          ].map((feature, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
              <div className="mx-auto w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured PGs Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Properties</h2>
              <p className="text-gray-600">Discover our top-rated PG locations.</p>
            </div>
            <Link href="/pgs" className="text-indigo-600 font-medium hover:underline hidden sm:block">
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pgs.map((pg) => {
              const lowestRent = pg.roomTypes.length > 0 
                ? Math.min(...pg.roomTypes.map(rt => rt.rent)) 
                : 0;

              return (
                <Card key={pg.id} className="hover:shadow-lg transition-shadow">
                  <div className="h-48 bg-gray-200 relative overflow-hidden">
                    {/* Placeholder image if no images available */}
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
            
            {pgs.length === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">No properties available at the moment.</p>
              </div>
            )}
          </div>
          
          <div className="mt-8 text-center sm:hidden">
            <Button href="/pgs" variant="outline">View All Properties</Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4">
        <div className="bg-indigo-600 rounded-3xl p-8 md:p-16 text-center text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to move in?</h2>
            <p className="text-indigo-100 mb-8 max-w-2xl mx-auto text-lg">
              Contact us today to schedule a visit or ask any questions. We are here to help you find the best living space.
            </p>
            <Button href="/contact" size="lg" variant="secondary" className="border-none">
              Get in Touch
            </Button>
          </div>
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white opacity-10"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-white opacity-10"></div>
        </div>
      </section>
    </div>
  )
}
