'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function approveReview(id: string) {
  await prisma.review.update({
    where: { id },
    data: { isApproved: true }
  })
  revalidatePath('/admin/reviews')
  revalidatePath('/admin')
  revalidatePath('/pgs/[id]', 'page')
}

export async function deleteReview(id: string) {
  await prisma.review.delete({
    where: { id }
  })
  revalidatePath('/admin/reviews')
  revalidatePath('/admin')
  revalidatePath('/pgs/[id]', 'page')
}
