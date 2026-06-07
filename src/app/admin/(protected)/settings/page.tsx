import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { updateBusinessSettings, addAmenity, deleteAmenity } from './actions'

export const revalidate = 0

export default async function SettingsPage() {
  const settings = await prisma.businessSettings.findFirst()
  const amenities = await prisma.amenity.findMany({
    orderBy: { name: 'asc' }
  })

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={updateBusinessSettings} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                <input type="text" name="businessName" defaultValue={settings?.businessName || ''} required className="w-full rounded-md border border-gray-300 px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Owner Name</label>
                <input type="text" name="ownerName" defaultValue={settings?.ownerName || ''} className="w-full rounded-md border border-gray-300 px-3 py-2" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                  <input type="text" name="contactNumber" defaultValue={settings?.contactNumber || ''} className="w-full rounded-md border border-gray-300 px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
                  <input type="text" name="whatsappNumber" defaultValue={settings?.whatsappNumber || ''} className="w-full rounded-md border border-gray-300 px-3 py-2" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" name="email" defaultValue={settings?.email || ''} className="w-full rounded-md border border-gray-300 px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business Address</label>
                <textarea name="address" defaultValue={settings?.address || ''} rows={3} className="w-full rounded-md border border-gray-300 px-3 py-2"></textarea>
              </div>
              
              <Button type="submit">Save Business Information</Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Global Amenities</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={addAmenity} className="flex gap-2 mb-6">
                <input type="text" name="name" placeholder="New amenity name..." required className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm" />
                <Button type="submit" size="sm">Add</Button>
              </form>

              <div className="border rounded-md divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
                {amenities.map(amenity => (
                  <div key={amenity.id} className="flex justify-between items-center p-3 text-sm">
                    <span className="font-medium text-gray-700">{amenity.name}</span>
                    <form>
                      <button formAction={deleteAmenity.bind(null, amenity.id)} className="text-red-500 hover:text-red-700 font-medium text-xs">Delete</button>
                    </form>
                  </div>
                ))}
                {amenities.length === 0 && (
                  <div className="p-4 text-center text-gray-500 text-sm">No amenities added yet.</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
