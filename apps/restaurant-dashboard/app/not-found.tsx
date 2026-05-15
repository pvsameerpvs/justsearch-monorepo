import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
      <h2 className="text-4xl font-bold text-slate-900">404</h2>
      <p className="text-sm text-slate-500">Page not found</p>
      <Link
        href="/"
        className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
      >
        Go home
      </Link>
    </div>
  );
}
