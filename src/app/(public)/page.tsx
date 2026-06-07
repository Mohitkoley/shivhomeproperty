import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { prisma } from '@/lib/prisma'
import { MapPin, Wifi, CheckCircle, ShieldCheck, Home, ArrowRight, Star } from 'lucide-react'

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
    <div className="flex flex-col gap-24 pb-24">
      {/* Modern Split Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24 lg:pt-40 lg:pb-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Text Content */}
            <div className="max-w-2xl">
              <Badge variant="default" className="mb-6 px-4 py-1.5 text-sm font-medium bg-indigo-50 text-indigo-700 border-indigo-100 rounded-full">
                Premium Co-living Spaces
              </Badge>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 leading-[1.1]">
                Find your perfect <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">home away from home.</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed max-w-xl">
                Experience comfortable, secure, and fully-furnished living spaces designed for students and professionals. All modern amenities included.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button href="/pgs" size="lg" className="h-14 px-8 text-base bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5">
                  Explore Properties
                </Button>
                <Button href="/contact" variant="outline" size="lg" className="h-14 px-8 text-base rounded-full border-slate-200 hover:bg-slate-50 transition-all">
                  Book a Visit
                </Button>
              </div>
              
              <div className="mt-12 flex items-center gap-4 text-sm text-slate-500 font-medium">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <img key={i} className="w-10 h-10 rounded-full border-2 border-white object-cover" src={`https://i.pravatar.cc/100?img=${i+10}`} alt="Resident" />
                  ))}
                </div>
                <div>
                  <div className="flex items-center text-amber-500">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                  <span className="text-slate-600">Trusted by 500+ happy residents</span>
                </div>
              </div>
            </div>
            
            {/* Image Layout */}
            <div className="relative lg:ml-10">
              <div className="relative w-full aspect-[4/3] sm:aspect-[3/2] lg:aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop" 
                  alt="Modern PG Room" 
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
              {/* Decorative Floating Card */}
              <div className="absolute -bottom-6 -left-6 sm:bottom-10 sm:-left-10 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/20 hidden sm:block">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                    <Wifi className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">High-Speed WiFi</p>
                    <p className="text-sm text-slate-500">Included in all properties</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Designed for modern living</h2>
          <p className="text-lg text-slate-600">We provide everything you need for a comfortable stay so you can focus on what matters most.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { title: "Fully Furnished", desc: "Premium beds, spacious wardrobes, and dedicated study desks.", icon: <Home className="w-6 h-6 text-indigo-600" /> },
            { title: "High-Speed WiFi", desc: "Uninterrupted gigabit internet access for work and play.", icon: <Wifi className="w-6 h-6 text-indigo-600" /> },
            { title: "Safe & Secure", desc: "24/7 CCTV surveillance, biometric entry, and security guards.", icon: <ShieldCheck className="w-6 h-6 text-indigo-600" /> },
            { title: "All-Inclusive Rent", desc: "No hidden costs. Electricity, water, and maintenance included.", icon: <CheckCircle className="w-6 h-6 text-indigo-600" /> },
          ].map((feature, i) => (
            <div key={i} className="group bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-indigo-100 transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured PGs Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Our Featured Properties</h2>
            <p className="text-lg text-slate-600">Handpicked co-living spaces in the best neighborhoods.</p>
          </div>
          <Link href="/pgs" className="group flex items-center text-indigo-600 font-semibold hover:text-indigo-700 transition-colors">
            View all properties <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

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
                      <span className="line-clamp-1">{pg.address}</span>
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
          
          {pgs.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 px-4 bg-slate-50 rounded-3xl border border-slate-100 border-dashed">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                <Home className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No properties found</h3>
              <p className="text-slate-500 text-center max-w-md">We are currently updating our listings. Please check back later for exciting new co-living spaces.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[2.5rem] p-8 md:p-16 lg:p-20 text-center overflow-hidden bg-slate-900">
          {/* Advanced Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/90 via-slate-900 to-purple-900/80"></div>
          
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-indigo-500/20 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-purple-500/20 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2"></div>

          <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
            <Badge className="bg-white/10 text-white border-white/20 mb-8 backdrop-blur-md px-4 py-1.5">Get Started Today</Badge>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Ready to experience modern co-living?
            </h2>
            <p className="text-indigo-100/80 mb-10 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
              Schedule a visit or get in touch with our team. We're here to help you find the perfect space tailored to your lifestyle.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Button href="/contact" size="lg" variant="secondary" className="h-14 px-8 text-base rounded-full font-semibold transition-transform hover:scale-105 w-full sm:w-auto border-none shadow-lg text-slate-900 bg-white hover:bg-slate-50">
                Schedule a Visit
              </Button>
              <Button href="/pgs" size="lg" variant="outline" className="h-14 px-8 text-base bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-md rounded-full font-semibold transition-colors w-full sm:w-auto">
                Browse Properties
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
