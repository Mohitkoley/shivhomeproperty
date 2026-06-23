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

  // Handle Images Upload
  const imageFiles = formData.getAll('images') as File[]
  const uploadedImages = []
  
  if (imageFiles && imageFiles.length > 0) {
    for (const file of imageFiles) {
      if (file.size > 0) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
        
        // Use the supabase client
        const { supabase } = await import('@/lib/supabase')
        const { data, error } = await supabase.storage
          .from('pg-images')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          })
          
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
      },
      images: {
        create: uploadedImages.map((img, index) => ({
          url: img.url,
          isMain: index === 0
        }))
      }
    }
  })

  // Room Types
  const baseRoomTypes = ['Single', '2 Sharing', '3 Sharing', '4 Sharing']
  for (const base of baseRoomTypes) {
    const suffixes = ['(Non-AC)', '(AC)']
    for (const suffix of suffixes) {
      const typeStr = `${base} ${suffix}`
      const rent = formData.get(`rent_${typeStr}`)
      const deposit = formData.get(`deposit_${typeStr}`)
      
      if (rent && Number(rent) > 0) {
        await prisma.roomType.create({
          data: {
            pgId: pg.id,
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
  redirect('/admin/pgs')
}

export async function deletePgImage(imageId: string, pgId: string) {
  const image = await prisma.pgImage.findUnique({ where: { id: imageId } })
  if (!image) return
  
  // Try to delete from supabase storage
  // Public URL is like: https://[project].supabase.co/storage/v1/object/public/pg-images/filename.ext
  const urlParts = image.url.split('/pg-images/')
  if (urlParts.length > 1) {
    const fileName = urlParts[1]
    const { supabase } = await import('@/lib/supabase')
    await supabase.storage.from('pg-images').remove([fileName])
  }
  
  await prisma.pgImage.delete({ where: { id: imageId } })
  
  revalidatePath(`/admin/pgs/${pgId}/edit`)
  revalidatePath(`/pgs/${pgId}`)
  revalidatePath('/pgs')
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
