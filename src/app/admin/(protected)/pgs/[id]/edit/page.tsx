import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { SubmitButton } from '@/components/ui/SubmitButton'
import { deletePg, deletePgImage } from '../../actions' // Import from parent route actions
import { revalidatePath } from 'next/cache'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function EditPgPage({ params }: { params: { id: string } }) {
  const resolvedParams = await params
  
  const pg = await prisma.pgProperty.findUnique({
    where: { id: resolvedParams.id },
    include: {
      roomTypes: true,
      amenities: true,
      images: true
    }
  })

  if (!pg) notFound()

  const amenities = await prisma.amenity.findMany({ orderBy: { name: 'asc' } })
  
  // Helper to check if amenity is selected
  const hasAmenity = (id: string) => pg.amenities.some(a => a.amenityId === id)

  // Quick edit action inline for simplicity (in real app, move to actions.ts)
  async function updatePg(formData: FormData) {
    'use server'
    const name = formData.get('name') as string
    const address = formData.get('address') as string
    const pgType = formData.get('pgType') as string
    const area = formData.get('area') as string
    const mapsLink = formData.get('mapsLink') as string
    const ownerContact = formData.get('ownerContact') as string
    const whatsappContact = formData.get('whatsappContact') as string
    const description = formData.get('description') as string
    const rules = formData.get('rules') as string
    
    if (!name || !address || !pgType) throw new Error('Missing required fields')

    // Extract amenities
    const allAmenities = await prisma.amenity.findMany()
    const selectedAmenityIds = allAmenities
      .filter(a => formData.get(`amenity_${a.id}`) === 'on')
      .map(a => a.id)

    // Handle new images upload
    const imageFiles = formData.getAll('images') as File[]
    const uploadedImages = []
    
    if (imageFiles && imageFiles.length > 0) {
      for (const file of imageFiles) {
        if (file.size > 0) {
          const fileExt = file.name.split('.').pop()
          // eslint-disable-next-line react-hooks/purity
          const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
          
          const { supabase } = await import('@/lib/supabase')
          const { error } = await supabase.storage
            .from('pg-images')
            .upload(fileName, file, { cacheControl: '3600', upsert: false })
            
          if (error) {
            console.error("Error uploading image:", error)
            continue
          }
          
          const { data: publicUrlData } = supabase.storage
            .from('pg-images')
            .getPublicUrl(fileName)
            
          if (publicUrlData?.publicUrl) {
            uploadedImages.push({ url: publicUrlData.publicUrl })
          }
        }
      }
    }

    await prisma.pgProperty.update({
      where: { id: pg?.id },
      data: {
        name,
        address,
        pgType,
        area: area || null,
        mapsLink: mapsLink || null,
        ownerContact: ownerContact || null,
        whatsappContact: whatsappContact || null,
        description: description || null,
        rules: rules || null,
        // Update amenities: clear existing, add new
        amenities: {
          deleteMany: {},
          create: selectedAmenityIds.map(id => ({
            amenity: { connect: { id } }
          }))
        },
        images: uploadedImages.length > 0 ? {
          create: uploadedImages.map((img, index) => ({
            url: img.url,
            isMain: (pg?.images?.length ?? 0) === 0 && index === 0
          }))
        } : undefined
      }
    })

    // Update Room Types (simplified: delete all and recreate)
    await prisma.roomType.deleteMany({ where: { pgId: pg?.id } })
    
    const baseRoomTypesList = ['Single', '2 Sharing', '3 Sharing', '4 Sharing']
    for (const base of baseRoomTypesList) {
      const suffixes = ['(Non-AC)', '(AC)']
      for (const suffix of suffixes) {
        const typeStr = `${base} ${suffix}`
        const rent = formData.get(`rent_${typeStr}`)
        const deposit = formData.get(`deposit_${typeStr}`)
        
        if (rent && Number(rent) > 0) {
          await prisma.roomType.create({
            data: {
              pgId: pg!.id,
              sharingType: typeStr,
              rent: Number(rent),
              deposit: deposit ? Number(deposit) : null,
              isAvailable: formData.get(`available_${typeStr}`) === 'on'
            }
          })
        }
      }
    }

    revalidatePath('/admin/pgs')
    revalidatePath('/pgs')
    revalidatePath(`/pgs/${pg?.id}`)
    redirect('/admin/pgs')
  }

  // Get existing room data
  const getRoom = (type: string) => pg.roomTypes.find(r => r.sharingType === type)

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex items-center gap-4">
        <Link href="/admin/pgs" className="p-2 hover:bg-gray-200 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Property: {pg.name}</h1>
      </div>

      <form action={updatePg} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">PG Name <span className="text-red-500">*</span></label>
              <input type="text" name="name" defaultValue={pg.name} required className="w-full rounded-md border border-gray-300 px-3 py-2" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">PG Type <span className="text-red-500">*</span></label>
                <select name="pgType" defaultValue={pg.pgType} required className="w-full rounded-md border border-gray-300 px-3 py-2 bg-white">
                  <option value="Boys">Boys</option>
                  <option value="Girls">Girls</option>
                  <option value="Co-living">Co-living</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Area / Locality <span className="text-gray-400 text-xs">(e.g. Malad, Andheri)</span></label>
                <input type="text" name="area" defaultValue={pg.area || ''} className="w-full rounded-md border border-gray-300 px-3 py-2" placeholder="e.g. Andheri East" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Address <span className="text-red-500">*</span></label>
              <textarea name="address" defaultValue={pg.address} required rows={2} className="w-full rounded-md border border-gray-300 px-3 py-2"></textarea>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Google Maps Link</label>
              <input type="url" name="mapsLink" defaultValue={pg.mapsLink || ''} className="w-full rounded-md border border-gray-300 px-3 py-2" placeholder="https://goo.gl/maps/..." />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Owner Contact Number</label>
                <input type="tel" name="ownerContact" defaultValue={pg.ownerContact || ''} className="w-full rounded-md border border-gray-300 px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
                <input type="tel" name="whatsappContact" defaultValue={pg.whatsappContact || ''} className="w-full rounded-md border border-gray-300 px-3 py-2" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea name="description" defaultValue={pg.description || ''} rows={4} className="w-full rounded-md border border-gray-300 px-3 py-2"></textarea>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rules</label>
              <textarea name="rules" defaultValue={pg.rules || ''} rows={3} className="w-full rounded-md border border-gray-300 px-3 py-2"></textarea>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Property Images</label>
              {pg.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {pg.images.map(img => (
                    <div key={img.id} className="relative group rounded-lg overflow-hidden border border-gray-200">
                      <img src={img.url} alt="PG Image" className="w-full h-32 object-cover" />
                      <button 
                        formAction={deletePgImage.bind(null, img.id, pg.id)}
                        className="absolute top-2 right-2 p-1.5 bg-red-600/80 hover:bg-red-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete image"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <input type="file" name="images" multiple accept="image/*" className="w-full rounded-md border border-gray-300 px-3 py-2 bg-white" />
              <p className="text-xs text-gray-500 mt-1">Select new images to add to the property gallery.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Room Types & Pricing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {['Single', '2 Sharing', '3 Sharing', '4 Sharing'].map((type) => {
              // Gracefully handle legacy room types (without AC/Non-AC suffix)
              const getSpecificRoom = (suffix: string) => {
                let room = pg.roomTypes.find(r => r.sharingType === `${type} ${suffix}`)
                if (!room && suffix === '(Non-AC)') {
                  // Fallback for legacy records that don't have a suffix
                  room = pg.roomTypes.find(r => r.sharingType === type)
                }
                return room
              }

              const nonAcRoom = getSpecificRoom('(Non-AC)')
              const acRoom = getSpecificRoom('(AC)')

              return (
                <div key={type} className="border border-gray-200 rounded-lg p-4 bg-gray-50 flex flex-col gap-4">
                  <div className="font-medium text-gray-900 border-b border-gray-200 pb-2">{type} Room</div>
                  
                  {/* Non-AC */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
                    <div className="font-medium text-sm text-gray-700">Non-AC</div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Monthly Rent (₹)</label>
                      <input type="number" name={`rent_${type} (Non-AC)`} defaultValue={nonAcRoom?.rent || ''} min="0" className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm" placeholder="e.g. 8000" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Security Deposit (₹)</label>
                      <input type="number" name={`deposit_${type} (Non-AC)`} defaultValue={nonAcRoom?.deposit || ''} min="0" className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm" placeholder="e.g. 8000" />
                    </div>
                    <div className="flex items-center">
                      <label className="flex items-center gap-2 text-sm cursor-pointer pb-1.5">
                        <input type="checkbox" name={`available_${type} (Non-AC)`} defaultChecked={nonAcRoom ? nonAcRoom.isAvailable : true} className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500" />
                        <span className="text-gray-700">Available</span>
                      </label>
                    </div>
                  </div>

                  {/* AC */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
                    <div className="font-medium text-sm text-gray-700">AC</div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Monthly Rent (₹)</label>
                      <input type="number" name={`rent_${type} (AC)`} defaultValue={acRoom?.rent || ''} min="0" className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm" placeholder="e.g. 10000" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Security Deposit (₹)</label>
                      <input type="number" name={`deposit_${type} (AC)`} defaultValue={acRoom?.deposit || ''} min="0" className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm" placeholder="e.g. 10000" />
                    </div>
                    <div className="flex items-center">
                      <label className="flex items-center gap-2 text-sm cursor-pointer pb-1.5">
                        <input type="checkbox" name={`available_${type} (AC)`} defaultChecked={acRoom ? acRoom.isAvailable : true} className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500" />
                        <span className="text-gray-700">Available</span>
                      </label>
                    </div>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Amenities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {amenities.map(amenity => (
                <label key={amenity.id} className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input type="checkbox" name={`amenity_${amenity.id}`} defaultChecked={hasAmenity(amenity.id)} className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500" />
                  <span className="text-sm font-medium text-gray-700">{amenity.name}</span>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between gap-4">
          <Button formAction={deletePg.bind(null, pg.id)} variant="outline" className="text-red-600 hover:bg-red-50 border-red-200">
            Delete Property
          </Button>
          <div className="flex justify-end gap-4">
            <Button href="/admin/pgs" variant="outline" type="button">Cancel</Button>
            <SubmitButton loadingText="Updating Property...">Update Property</SubmitButton>
          </div>
        </div>
      </form>
    </div>
  )
}
