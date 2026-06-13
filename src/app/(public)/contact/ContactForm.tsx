'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { submitEnquiry } from './actions'

type PgProperty = {
  id: string
  name: string
}

export function ContactForm({ pgs, whatsappNumber }: { pgs: PgProperty[], whatsappNumber?: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const phone = formData.get('phone') as string
    const message = formData.get('message') as string
    const pgId = formData.get('pgId') as string || null

    const result = await submitEnquiry({ name, phone, message, pgId })

    setIsSubmitting(false)

    if (result.success) {
      alert('Your enquiry has been submitted successfully!')
      
      // WhatsApp deep linking for mobile devices
      if (whatsappNumber) {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
        
        if (isMobile) {
          const pgName = pgId ? pgs.find(p => p.id === pgId)?.name : 'Not sure'
          const text = `Hello! I have an enquiry:\n*Name:* ${name}\n*Phone:* ${phone}\n*Preferred PG:* ${pgName}\n*Message:* ${message}`
          const encodedText = encodeURIComponent(text)
          const number = whatsappNumber.replace(/\D/g, '')
          
          window.location.href = `https://wa.me/${number}?text=${encodedText}`
        }
      }
      
      e.currentTarget.reset()
    } else {
      alert('Failed to submit enquiry. Please try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
        <input type="text" name="name" required className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
        <input type="tel" name="phone" required className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Preferred PG (Optional)</label>
        <select name="pgId" className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
          <option value="">I am not sure yet</option>
          {pgs.map(pg => (
            <option key={pg.id} value={pg.id}>{pg.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
        <textarea name="message" required rows={4} className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit Enquiry'}
      </Button>
    </form>
  )
}
