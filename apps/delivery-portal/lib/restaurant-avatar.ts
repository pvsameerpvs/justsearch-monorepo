// Deterministic color palette for restaurant avatars
const PALETTE = [
  { bg: "bg-emerald-600", text: "text-white", ring: "ring-emerald-200" },
  { bg: "bg-orange-500", text: "text-white", ring: "ring-orange-200" },
  { bg: "bg-blue-600", text: "text-white", ring: "ring-blue-200" },
  { bg: "bg-rose-500", text: "text-white", ring: "ring-rose-200" },
  { bg: "bg-violet-600", text: "text-white", ring: "ring-violet-200" },
  { bg: "bg-amber-500", text: "text-white", ring: "ring-amber-200" },
  { bg: "bg-cyan-600", text: "text-white", ring: "ring-cyan-200" },
  { bg: "bg-pink-500", text: "text-white", ring: "ring-pink-200" },
  { bg: "bg-indigo-600", text: "text-white", ring: "ring-indigo-200" },
  { bg: "bg-teal-500", text: "text-white", ring: "ring-teal-200" },
  { bg: "bg-red-600", text: "text-white", ring: "ring-red-200" },
  { bg: "bg-lime-600", text: "text-white", ring: "ring-lime-200" },
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

export function getRestaurantColor(name: string) {
  const idx = hashString(name.toLowerCase().trim()) % PALETTE.length;
  return PALETTE[idx];
}

export function getRestaurantInitial(name: string): string {
  return name?.charAt(0)?.toUpperCase() ?? "R";
}
