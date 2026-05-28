'use client'

export function SkeletonLoader() {
  return (
    <div className="space-y-4">
      {/* Sidebar skeleton */}
      <div className="hidden md:block w-48 space-y-2">
        <div className="h-8 bg-gray-800 rounded animate-pulse" />
        <div className="h-10 bg-gray-800 rounded animate-pulse" />
        <div className="h-10 bg-gray-800 rounded animate-pulse" />
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-48 bg-gray-800 rounded-lg animate-pulse"
          />
        ))}
      </div>
    </div>
  )
}
