export default function Loading() {
  return (
    <div className="space-y-4 p-4">
      <div className="animate-pulse bg-gray-200 rounded h-8 w-48" />
      <div className="space-y-2">
        <div className="animate-pulse bg-gray-200 rounded h-24 w-full" />
        <div className="animate-pulse bg-gray-200 rounded h-24 w-full" />
        <div className="animate-pulse bg-gray-200 rounded h-24 w-full" />
      </div>
    </div>
  );
}
