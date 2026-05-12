export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function SlugPreview({ slug }: { slug: string }) {
  if (!slug) return null;
  return (
    <div className="rounded-lg bg-slate-50 p-3">
      <p className="text-xs text-slate-500">Auto-generated domains:</p>
      <p className="mt-1 text-xs font-mono text-slate-700">
        {slug}.js-restorant.com
      </p>
      <p className="text-xs font-mono text-slate-700">
        {slug}-booking.js-restorant.com
      </p>
    </div>
  );
}
