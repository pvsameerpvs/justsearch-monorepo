type DriverOrderNotesProps = {
  notes: string;
};

export function DriverOrderNotes({ notes }: DriverOrderNotesProps) {
  return (
    <div className="rounded-[22px] border border-orange-100 bg-orange-50/80 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-700 mb-1">
        Customer note
      </p>
      <p className="text-sm text-slate-700">{notes}</p>
    </div>
  );
}
