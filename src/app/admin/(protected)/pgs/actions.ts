'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createPg(formData: FormData) {
  const name = formData.get('name') as string
  const address = formData.get('address') as string
  const pgType = formData.get('pgType') as string
  const area = formData.get('area') as string
  const mapsLink = formData.get('mapsLink') as string
  const ownerContact = formData.get('ownerContact') as string
  const whatsappContact = formData.get('whatsappContact') as string
  const description = formData.get('description') as string
  const rules = formData.get('rules') as string
  
  // Basic validation
  if (!name || !address || !pgType) throw new Error('Missing required fields')

  // Extract amenities from form
  const allAmenities = await prisma.amenity.findMany()
  const selectedAmenityIds = allAmenities
    .filter(a => formData.get(`amenity_${a.id}`) === 'on')
    .map(a => a.id)

  const pg = await prisma.pgProperty.create({
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
      amenities: {
        create: selectedAmenityIds.map(id => ({
          amenity: { connect: { id } }
        }))
      }
    }
  })

  // Room Types
  const roomTypes = ['Single', '2 Sharing', '3 Sharing', '4 Sharing']
  for (const rt of roomTypes) {
    const rent = formData.get(`rent_${rt}`)
    const deposit = formData.get(`deposit_${rt}`)
    
    if (rent && Number(rent) > 0) {
      await prisma.roomType.create({
        data: {
          pgId: pg.id,
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
  redirect('/admin/pgs')
}

export async function deletePg(id: string) {
  await prisma.pgProperty.delete({
    where: { id }
  })
  revalidatePath('/admin/pgs')
  revalidatePath('/pgs')
  revalidatePath('/admin')
}

export async function togglePgStatus(id: string, currentStatus: boolean) {
  await prisma.pgProperty.update({
    where: { id },
    data: { isActive: !currentStatus }
  })
  revalidatePath('/admin/pgs')
  revalidatePath('/pgs')
}
