import { Loader2 } from 'lucide-react'

export default function AdminLoading() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] w-full">
      <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
      <p className="text-slate-500 font-medium text-lg">Loading data...</p>
    </div>
  )
}
