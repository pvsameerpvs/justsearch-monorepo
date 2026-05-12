import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus } from "lucide-react";

const schema = z.object({
  name: z.string().min(2),
  description: z.string(),
  price: z.coerce.number().min(1),
});

type Form = z.infer<typeof schema>;

export function AddMenuItemForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (data: Form) => void;
  onCancel: () => void;
}) {
  const form = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", description: "", price: 0 },
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="elegant-card space-y-3 p-5">
      <p className="text-sm font-semibold text-slate-900">Add Menu Item</p>
      <input {...form.register("name")} placeholder="Item name" className="elegant-input w-full" />
      <input {...form.register("description")} placeholder="Description" className="elegant-input w-full" />
      <input type="number" {...form.register("price")} placeholder="Price (AED)" className="elegant-input w-full" />
      <div className="flex gap-2">
        <button type="button" className="elegant-btn-secondary flex-1" onClick={onCancel}>Cancel</button>
        <button type="submit" className="elegant-btn-primary flex-1">Add Item</button>
      </div>
    </form>
  );
}

export function AddMenuItemButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-xl border-2 border-dashed border-slate-200 py-3 text-sm font-medium text-slate-400 transition-all hover:border-slate-300 hover:text-slate-600"
    >
      <Plus className="mx-auto mb-1 h-5 w-5" />
      Add Menu Item
    </button>
  );
}
