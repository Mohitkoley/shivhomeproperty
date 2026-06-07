import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { deletePg } from '../actions' // Import from parent route actions
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
      amenities: true
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
    const ownerContact = formData.get('ownerContact') as string
    const whatsappContact = formData.get('whatsappContact') as string
    const description = formData.get('description') as string
    const rules = formData.get('rules') as string
    
    if (!name || !address || !pgType) return

    // Extract amenities
    const allAmenities = await prisma.amenity.findMany()
    const selectedAmenityIds = allAmenities
      .filter(a => formData.get(`amenity_${a.id}`) === 'on')
      .map(a => a.id)

    await prisma.pgProperty.update({
      where: { id: pg?.id },
      data: {
        name,
        address,
        pgType,
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
        }
      }
    })

    // Update Room Types (simplified: delete all and recreate)
    await prisma.roomType.deleteMany({ where: { pgId: pg?.id } })
    
    const roomTypesList = ['Single', '2 Sharing', '3 Sharing', '4 Sharing']
    for (const rt of roomTypesList) {
      const rent = formData.get(`rent_${rt}`)
      const deposit = formData.get(`deposit_${rt}`)
      
      if (rent && Number(rent) > 0) {
        await prisma.roomType.create({
          data: {
            pgId: pg!.id,
            sharingType: rt,
            rent: Number(rent),
            deposit: deposit ? Number(deposit) : null,
            isAvailable: formData.get(`available_${rt}`) === 'on'
          }
        })
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
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Address <span className="text-red-500">*</span></label>
              <textarea name="address" defaultValue={pg.address} required rows={2} className="w-full rounded-md border border-gray-300 px-3 py-2"></textarea>
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Room Types & Pricing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {['Single', '2 Sharing', '3 Sharing', '4 Sharing'].map((type) => {
              const existingRoom = getRoom(type)
              return (
                <div key={type} className="border border-gray-200 rounded-lg p-4 bg-gray-50 flex flex-col md:flex-row gap-4 md:items-center justify-between">
                  <div className="font-medium text-gray-900 min-w-[120px]">{type} Room</div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 flex-1">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Monthly Rent (₹)</label>
                      <input type="number" name={`rent_${type}`} defaultValue={existingRoom?.rent || ''} min="0" className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Security Deposit (₹)</label>
                      <input type="number" name={`deposit_${type}`} defaultValue={existingRoom?.deposit || ''} min="0" className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm" />
                    </div>
                    <div className="flex items-center col-span-2 md:col-span-1 md:justify-center">
                      <label className="flex items-center gap-2 text-sm cursor-pointer mt-5">
                        <input type="checkbox" name={`available_${type}`} defaultChecked={existingRoom ? existingRoom.isAvailable : true} className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500" />
                        <span className="text-gray-700">Currently Available</span>
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
          <div className="flex gap-4">
            <Button href="/admin/pgs" variant="outline" type="button">Cancel</Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </div>
      </form>
    </div>
  )
}
