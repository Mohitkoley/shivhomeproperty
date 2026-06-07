import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { updateBusinessSettings, addAmenity, deleteAmenity } from './actions'
import { Trash2, Plus, Building2, Sparkles } from 'lucide-react'

export const revalidate = 0

export default async function SettingsPage() {
  const settings = await prisma.businessSettings.findFirst()
  const amenities = await prisma.amenity.findMany({
    orderBy: { name: 'asc' }
  })

  return (
    <div className="max-w-4xl space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-2 text-sm">
          Manage your business profile, contact details, and global property amenities.
        </p>
      </div>

      <div className="grid gap-8">
        {/* Business Information Card */}
        <Card className="rounded-xl shadow-sm border-gray-200 overflow-hidden">
          <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-500" />
              <CardTitle className="text-lg">Business Information</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <form action={updateBusinessSettings} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Business Name</label>
                  <input 
                    type="text" 
                    name="businessName" 
                    defaultValue={settings?.businessName || ''} 
                    required 
                    className="w-full rounded-lg border border-slate-300 bg-slate-50/50 px-4 py-2.5 text-sm transition-colors focus:bg-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Owner Name</label>
                  <input 
                    type="text" 
                    name="ownerName" 
                    defaultValue={settings?.ownerName || ''} 
                    className="w-full rounded-lg border border-slate-300 bg-slate-50/50 px-4 py-2.5 text-sm transition-colors focus:bg-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Contact Number</label>
                  <input 
                    type="text" 
                    name="contactNumber" 
                    defaultValue={settings?.contactNumber || ''} 
                    className="w-full rounded-lg border border-slate-300 bg-slate-50/50 px-4 py-2.5 text-sm transition-colors focus:bg-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">WhatsApp Number</label>
                  <input 
                    type="text" 
                    name="whatsappNumber" 
                    defaultValue={settings?.whatsappNumber || ''} 
                    className="w-full rounded-lg border border-slate-300 bg-slate-50/50 px-4 py-2.5 text-sm transition-colors focus:bg-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Email Address</label>
                <input 
                  type="email" 
                  name="email" 
                  defaultValue={settings?.email || ''} 
                  className="w-full rounded-lg border border-slate-300 bg-slate-50/50 px-4 py-2.5 text-sm transition-colors focus:bg-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Business Address</label>
                <textarea 
                  name="address" 
                  defaultValue={settings?.address || ''} 
                  rows={3} 
                  className="w-full rounded-lg border border-slate-300 bg-slate-50/50 px-4 py-2.5 text-sm transition-colors focus:bg-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
                ></textarea>
              </div>
              
              <div className="flex justify-end pt-2">
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all rounded-lg px-6">
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Global Amenities Card */}
        <Card className="rounded-xl shadow-sm border-gray-200 overflow-hidden">
          <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              <CardTitle className="text-lg">Global Amenities</CardTitle>
            </div>
            <p className="text-sm text-slate-500 mt-1.5 font-normal">
              Manage the list of amenities that can be assigned to your properties.
            </p>
          </CardHeader>
          <CardContent className="pt-6">
            <form action={addAmenity} className="flex gap-3 mb-8">
              <div className="relative flex-1">
                <input 
                  type="text" 
                  name="name" 
                  placeholder="e.g. High-Speed WiFi, Gym..." 
                  required 
                  className="w-full rounded-lg border border-slate-300 bg-slate-50/50 px-4 py-2.5 text-sm transition-colors focus:bg-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" 
                />
              </div>
              <Button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white shadow-sm rounded-lg flex items-center gap-2 px-5">
                <Plus className="w-4 h-4" /> Add
              </Button>
            </form>

            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
                {amenities.map(amenity => (
                  <div key={amenity.id} className="group flex justify-between items-center p-4 hover:bg-slate-50 transition-colors">
                    <span className="font-medium text-slate-700 text-sm">{amenity.name}</span>
                    <form>
                      <button 
                        formAction={deleteAmenity.bind(null, amenity.id)} 
                        className="text-slate-400 hover:text-red-600 transition-colors p-1.5 rounded-md hover:bg-red-50"
                        title="Delete amenity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                ))}
                {amenities.length === 0 && (
                  <div className="p-8 text-center text-slate-500 text-sm bg-slate-50/50">
                    No amenities added yet. Start by adding one above.
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
