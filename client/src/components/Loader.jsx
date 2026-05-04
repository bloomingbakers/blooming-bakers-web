export default function Loader({ size = 'md' }) {
  const sizes = { sm: 'w-6 h-6', md: 'w-10 h-10', lg: 'w-16 h-16' };
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className={`${sizes[size]} relative animate-spin-slow`}>
        <span className="text-4xl">🧁</span>
      </div>
      <p className="text-mocha text-sm animate-pulse-soft">Loading deliciousness...</p>
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <Loader size="lg" />
    </div>
  );
}

export function ProductSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-soft animate-pulse">
      <div className="aspect-square bg-primary-50" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-primary-50 rounded w-1/3" />
        <div className="h-5 bg-primary-50 rounded w-3/4" />
        <div className="h-4 bg-primary-50 rounded w-1/2" />
        <div className="h-6 bg-primary-50 rounded w-1/4" />
      </div>
    </div>
  );
}
