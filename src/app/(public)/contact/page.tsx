import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { MapPin, Phone, Mail } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

import { ContactForm } from './ContactForm'

export default async function ContactPage() {
  const settings = await prisma.businessSettings.findFirst()
  const pgs = await prisma.pgProperty.findMany({ where: { isActive: true }})

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
            <ContactForm 
              pgs={pgs} 
              whatsappNumber={settings?.whatsappNumber || settings?.contactNumber || undefined} 
            />
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
