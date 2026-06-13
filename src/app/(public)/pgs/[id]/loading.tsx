export default function Loading() {
  return (
    <div className="bg-gray-50 min-h-screen pb-20 animate-pulse">
      {/* Full-width Photo Gallery Header Skeleton */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="space-y-3 w-full md:w-1/2">
            <div className="h-12 bg-slate-200 rounded-lg w-3/4"></div>
            <div className="h-6 bg-slate-200 rounded-lg w-1/2"></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-8 w-24 bg-slate-200 rounded-full"></div>
            <div className="h-8 w-32 bg-slate-200 rounded-full"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 h-[40vh] md:h-[60vh] rounded-3xl overflow-hidden shadow-2xl relative">
          <div className="md:col-span-2 h-full bg-slate-200"></div>
          <div className="hidden md:grid grid-cols-2 grid-rows-2 col-span-2 gap-3 h-full">
            <div className="h-full bg-slate-200 rounded-xl"></div>
            <div className="h-full bg-slate-200 rounded-xl"></div>
            <div className="h-full bg-slate-200 rounded-xl"></div>
            <div className="h-full bg-slate-200 rounded-xl"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left Column Skeleton */}
          <div className="lg:col-span-2 space-y-16">
            <div className="h-24 bg-slate-200 rounded-2xl w-full"></div>
            
            <div className="space-y-4">
              <div className="h-10 bg-slate-200 rounded w-1/3 mb-6"></div>
              <div className="h-4 bg-slate-200 rounded w-full"></div>
              <div className="h-4 bg-slate-200 rounded w-full"></div>
              <div className="h-4 bg-slate-200 rounded w-5/6"></div>
              <div className="h-4 bg-slate-200 rounded w-4/6"></div>
            </div>

            <div className="space-y-4">
              <div className="h-10 bg-slate-200 rounded w-1/3 mb-6"></div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="h-16 bg-slate-200 rounded-xl w-full"></div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="h-10 bg-slate-200 rounded w-1/3 mb-6"></div>
              <div className="h-[300px] md:h-[400px] bg-slate-200 rounded-2xl w-full"></div>
            </div>
          </div>

          {/* Right Column Skeleton */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="h-[500px] bg-slate-200 rounded-3xl w-full shadow-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
