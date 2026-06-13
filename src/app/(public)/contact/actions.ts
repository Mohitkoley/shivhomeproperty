'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function submitEnquiry(data: { name: string, phone: string, message: string, pgId: string | null }) {
  if (!data.name || !data.phone || !data.message) {
    return { success: false, error: 'Missing required fields' }
  }

  try {
    await prisma.enquiry.create({
      data: { 
        name: data.name, 
        phone: data.phone, 
        message: data.message, 
        pgId: data.pgId || null 
      }
    })
    
    // Revalidate admin page so new enquiries show up immediately
    revalidatePath('/admin/enquiries')
    return { success: true }
  } catch (error) {
    console.error('Failed to submit enquiry:', error)
    return { success: false, error: 'Internal server error' }
  }
}
