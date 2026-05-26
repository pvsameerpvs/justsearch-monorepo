import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings | Delivery Portal",
};

export default function SettingsLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
    </div>
  );
}
