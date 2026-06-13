import { Home } from 'lucide-react'

export default function Loading() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <div className="mb-12 text-center">
        <div className="h-12 w-64 bg-slate-200 animate-pulse rounded-lg mx-auto mb-6"></div>
        <div className="h-6 w-full max-w-2xl bg-slate-200 animate-pulse rounded-lg mx-auto"></div>
      </div>

      <div className="mb-12">
        <div className="flex justify-center">
          <div className="flex gap-3 p-1.5 bg-slate-100 rounded-full border border-slate-200 shadow-inner">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-10 w-28 bg-slate-200 animate-pulse rounded-full"></div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100">
            {/* Image Skeleton */}
            <div className="w-full aspect-[4/3] bg-slate-200 animate-pulse"></div>
            
            {/* Content Skeleton */}
            <div className="flex flex-col flex-1 p-6 sm:p-8 space-y-4">
              <div className="h-8 bg-slate-200 animate-pulse rounded w-3/4"></div>
              <div className="h-4 bg-slate-200 animate-pulse rounded w-1/2"></div>
              
              <div className="flex gap-2 py-4">
                <div className="h-8 w-20 bg-slate-200 animate-pulse rounded-lg"></div>
                <div className="h-8 w-20 bg-slate-200 animate-pulse rounded-lg"></div>
                <div className="h-8 w-20 bg-slate-200 animate-pulse rounded-lg"></div>
              </div>
              
              <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="h-4 bg-slate-200 animate-pulse rounded w-16 mb-2"></div>
                  <div className="h-8 bg-slate-200 animate-pulse rounded w-24"></div>
                </div>
                <div className="h-10 bg-slate-200 animate-pulse rounded-full w-32"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
