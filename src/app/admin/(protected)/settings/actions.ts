'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function updateBusinessSettings(formData: FormData) {
  const businessName = formData.get('businessName') as string
  const ownerName = formData.get('ownerName') as string
  const contactNumber = formData.get('contactNumber') as string
  const whatsappNumber = formData.get('whatsappNumber') as string
  const email = formData.get('email') as string
  const address = formData.get('address') as string

  const settings = await prisma.businessSettings.findFirst()
  
  if (settings) {
    await prisma.businessSettings.update({
      where: { id: settings.id },
      data: { businessName, ownerName, contactNumber, whatsappNumber, email, address }
    })
  } else {
    await prisma.businessSettings.create({
      data: { businessName, ownerName, contactNumber, whatsappNumber, email, address }
    })
  }
  
  revalidatePath('/admin/settings')
  revalidatePath('/contact')
}

export async function addAmenity(formData: FormData) {
  const name = formData.get('name') as string
  const icon = formData.get('icon') as string

  if (!name) return

  await prisma.amenity.create({
    data: { name, icon: icon || null }
  })
  
  revalidatePath('/admin/settings')
}

export async function deleteAmenity(id: string) {
  await prisma.amenity.delete({
    where: { id }
  })
  revalidatePath('/admin/settings')
}
