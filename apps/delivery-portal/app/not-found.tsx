import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@justsearch/ui';

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white/95 shadow-xl">
        <CardHeader>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-orange-500">
            Delivery Portal
          </p>
          <CardTitle className="text-3xl text-slate-950">
            We could not find that delivery record.
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-slate-600">
          <p>
            The order or tenant context may be missing. Return to the main queue and
            confirm you are on the correct delivery portal subdomain.
          </p>
          <Link
            href="/"
            className="inline-flex rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Back to delivery queue
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}
