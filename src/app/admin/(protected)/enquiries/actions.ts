'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function markAsContacted(id: string) {
  await prisma.enquiry.update({
    where: { id },
    data: { isContacted: true }
  })
  revalidatePath('/admin/enquiries')
  revalidatePath('/admin')
}

export async function deleteEnquiry(id: string) {
  await prisma.enquiry.delete({
    where: { id }
  })
  revalidatePath('/admin/enquiries')
  revalidatePath('/admin')
}
