import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { MapPin, Phone, Mail } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export default async function ContactPage() {
  const settings = await prisma.businessSettings.findFirst()
  const pgs = await prisma.pgProperty.findMany({ where: { isActive: true }})

  async function submitEnquiry(formData: FormData) {
    'use server'
    const name = formData.get('name') as string
    const phone = formData.get('phone') as string
    const message = formData.get('message') as string
    const pgId = formData.get('pgId') as string || null

    if (!name || !phone || !message) return

    await prisma.enquiry.create({
      data: { name, phone, message, pgId: pgId || null }
    })
    
    // Revalidate admin page so new enquiries show up immediately
    revalidatePath('/admin/enquiries')
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-4">Contact Us</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Have questions? Fill out the form below or reach out to us directly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Send an Enquiry</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={submitEnquiry} className="space-y-4">
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
              <Button type="submit" className="w-full">Submit Enquiry</Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start">
                <MapPin className="w-6 h-6 text-indigo-600 mr-4 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900">Address</h4>
                  <p className="text-gray-600 mt-1">{settings?.address || 'City, India'}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Phone className="w-6 h-6 text-indigo-600 mr-4 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900">Phone & WhatsApp</h4>
                  <p className="text-gray-600 mt-1">{settings?.contactNumber}</p>
                  <p className="text-gray-600">{settings?.whatsappNumber}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Mail className="w-6 h-6 text-indigo-600 mr-4 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900">Email Address</h4>
                  <p className="text-gray-600 mt-1">{settings?.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
