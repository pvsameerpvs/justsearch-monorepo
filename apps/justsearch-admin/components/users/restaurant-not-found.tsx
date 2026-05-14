import { ArrowLeft } from "lucide-react";

interface RestaurantNotFoundProps {
  onBack: () => void;
}

export function RestaurantNotFound({ onBack }: RestaurantNotFoundProps) {
  return (
    <div className="py-10 text-center">
      <p className="text-sm font-bold text-slate-700">Restaurant not found</p>
      <button
        onClick={onBack}
        className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:underline"
      >
        <ArrowLeft className="h-3 w-3" />
        Back to Restaurants
      </button>
    </div>
  );
}
