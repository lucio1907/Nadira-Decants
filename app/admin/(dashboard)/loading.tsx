export default function AdminLoading() {
  return (
    <div className="w-full h-full min-h-[400px] flex flex-col gap-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center mb-8">
        <div className="h-10 w-48 nd-skeleton rounded-lg"></div>
        <div className="h-10 w-32 nd-skeleton rounded-lg"></div>
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="nd-card !p-0 rounded-xl overflow-hidden">
            <div className="aspect-[4/5] nd-skeleton"></div>
            <div className="p-4 space-y-3">
              <div className="h-3 w-1/3 nd-skeleton rounded"></div>
              <div className="h-5 w-full nd-skeleton rounded"></div>
              <div className="h-4 w-2/3 nd-skeleton rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
