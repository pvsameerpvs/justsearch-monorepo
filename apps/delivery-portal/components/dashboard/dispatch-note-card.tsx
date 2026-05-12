import { Card, CardContent, CardHeader, CardTitle } from '@justsearch/ui';
import { AlertTriangle } from 'lucide-react';

export function DispatchNoteCard({ notice }: { notice: string }) {
  return (
    <Card className="rounded-3xl border border-amber-200 bg-amber-50/90 shadow-[0_24px_70px_-38px_rgba(15,23,42,0.38)]">
      <CardHeader className="space-y-2">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <CardTitle className="text-xl text-slate-950">Dispatch note</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-slate-700">{notice}</p>
        <div className="rounded-2xl border border-amber-200 bg-white/80 px-4 py-3 text-xs text-slate-600">
          Prioritize rush orders first, then group nearby standard stops to keep
          average route time low.
        </div>
      </CardContent>
    </Card>
  );
}
