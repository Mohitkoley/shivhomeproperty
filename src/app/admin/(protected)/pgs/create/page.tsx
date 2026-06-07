import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { createPg } from '../actions'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function CreatePgPage() {
  const amenities = await prisma.amenity.findMany({ orderBy: { name: 'asc' } })

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex items-center gap-4">
        <Link href="/admin/pgs" className="p-2 hover:bg-gray-200 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Add New PG Property</h1>
      </div>

      <form action={createPg} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">PG Name <span className="text-red-500">*</span></label>
              <input type="text" name="name" required className="w-full rounded-md border border-gray-300 px-3 py-2" placeholder="e.g. Shiv Boys PG" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">PG Type <span className="text-red-500">*</span></label>
                <select name="pgType" required className="w-full rounded-md border border-gray-300 px-3 py-2 bg-white">
                  <option value="Boys">Boys</option>
                  <option value="Girls">Girls</option>
                  <option value="Co-living">Co-living</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Area / Locality <span className="text-gray-400 text-xs">(e.g. Malad, Andheri)</span></label>
                <input type="text" name="area" className="w-full rounded-md border border-gray-300 px-3 py-2" placeholder="e.g. Andheri East" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Address <span className="text-red-500">*</span></label>
              <textarea name="address" required rows={2} className="w-full rounded-md border border-gray-300 px-3 py-2" placeholder="Complete address of the property"></textarea>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Google Maps Link</label>
              <input type="url" name="mapsLink" className="w-full rounded-md border border-gray-300 px-3 py-2" placeholder="https://goo.gl/maps/..." />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Owner Contact Number</label>
                <input type="tel" name="ownerContact" className="w-full rounded-md border border-gray-300 px-3 py-2" placeholder="e.g. 9876543210" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
                <input type="tel" name="whatsappContact" className="w-full rounded-md border border-gray-300 px-3 py-2" placeholder="e.g. 9876543210" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea name="description" rows={4} className="w-full rounded-md border border-gray-300 px-3 py-2" placeholder="Write a compelling description for this PG..."></textarea>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rules</label>
              <textarea name="rules" rows={3} className="w-full rounded-md border border-gray-300 px-3 py-2" placeholder="e.g. Entry till 10 PM. Outside food allowed."></textarea>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Room Types & Pricing</CardTitle>
            <p className="text-sm text-gray-500">Fill out rent for the room types available in this PG. Leave empty if not applicable.</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {['Single', '2 Sharing', '3 Sharing', '4 Sharing'].map((type) => (
              <div key={type} className="border border-gray-200 rounded-lg p-4 bg-gray-50 flex flex-col md:flex-row gap-4 md:items-center justify-between">
                <div className="font-medium text-gray-900 min-w-[120px]">{type} Room</div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 flex-1">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Monthly Rent (₹)</label>
                    <input type="number" name={`rent_${type}`} min="0" className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm" placeholder="e.g. 8000" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Security Deposit (₹)</label>
                    <input type="number" name={`deposit_${type}`} min="0" className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm" placeholder="e.g. 8000" />
                  </div>
                  <div className="flex items-center col-span-2 md:col-span-1 md:justify-center">
                    <label className="flex items-center gap-2 text-sm cursor-pointer mt-5">
                      <input type="checkbox" name={`available_${type}`} defaultChecked className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500" />
                      <span className="text-gray-700">Currently Available</span>
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Amenities</CardTitle>
            <p className="text-sm text-gray-500">Select all amenities available in this PG.</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {amenities.map(amenity => (
                <label key={amenity.id} className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input type="checkbox" name={`amenity_${amenity.id}`} className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500" />
                  <span className="text-sm font-medium text-gray-700">{amenity.name}</span>
                </label>
              ))}
              {amenities.length === 0 && (
                <div className="col-span-full text-sm text-gray-500">No amenities defined. Go to Settings to add amenities first.</div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button href="/admin/pgs" variant="outline" type="button">Cancel</Button>
          <Button type="submit">Create Property</Button>
        </div>
      </form>
    </div>
  )
}
