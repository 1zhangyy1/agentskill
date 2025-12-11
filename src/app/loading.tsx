export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="animate-pulse">
        {/* Hero Skeleton */}
        <div className="text-center mb-12">
          <div className="h-10 w-48 bg-[#E5E7EB] rounded mx-auto mb-4"></div>
          <div className="h-6 w-96 bg-[#E5E7EB] rounded mx-auto"></div>
        </div>

        {/* Search Skeleton */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="h-12 bg-[#E5E7EB] rounded-xl"></div>
        </div>

        {/* Filter Skeleton */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-8 w-20 bg-[#E5E7EB] rounded-full"></div>
          ))}
        </div>

        {/* Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-[#E5E5E5] p-4">
              <div className="h-6 w-32 bg-[#E5E7EB] rounded mb-2"></div>
              <div className="h-4 w-full bg-[#E5E7EB] rounded mb-2"></div>
              <div className="h-4 w-3/4 bg-[#E5E7EB] rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
