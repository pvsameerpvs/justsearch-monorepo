export default function Loading() {
  return (
    <div className="space-y-4 p-4">
      <div className="animate-pulse bg-gray-200 rounded h-8 w-48" />
      <div className="grid gap-4 md:grid-cols-3">
        <div className="animate-pulse bg-gray-200 rounded h-32" />
        <div className="animate-pulse bg-gray-200 rounded h-32" />
        <div className="animate-pulse bg-gray-200 rounded h-32" />
      </div>
      <div className="animate-pulse bg-gray-200 rounded h-64" />
    </div>
  );
}
