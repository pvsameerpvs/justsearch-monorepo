export default function Loading() {
  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <div className="animate-pulse bg-gray-200 rounded h-8 w-32" />
        <div className="animate-pulse bg-gray-200 rounded h-10 w-24" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="animate-pulse bg-gray-200 rounded h-40" />
        <div className="animate-pulse bg-gray-200 rounded h-40" />
        <div className="animate-pulse bg-gray-200 rounded h-40" />
      </div>
    </div>
  );
}
