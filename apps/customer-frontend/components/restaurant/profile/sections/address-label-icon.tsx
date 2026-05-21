import { Briefcase, Home, MapPin } from "lucide-react";
import type { SavedAddress } from "../../use-address-book";

export function AddressLabelIcon({ label }: { label: SavedAddress["label"] }) {
  if (label === "Home") return <Home className="h-6 w-6" />;
  if (label === "Work") return <Briefcase className="h-6 w-6" />;
  return <MapPin className="h-6 w-6" />;
}
