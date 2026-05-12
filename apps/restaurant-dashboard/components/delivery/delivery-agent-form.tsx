import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2),
  phone: z.string().min(5),
  email: z.string().email(),
});

type Form = z.infer<typeof schema>;

export function DeliveryAgentForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (data: Form) => void;
  onCancel: () => void;
}) {
  const form = useForm<Form>({ resolver: zodResolver(schema) });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="elegant-card space-y-3 p-5">
      <p className="text-sm font-semibold text-slate-900">Add Agent</p>
      <input {...form.register("name")} placeholder="Name" className="elegant-input w-full" />
      <input {...form.register("phone")} placeholder="Phone" className="elegant-input w-full" />
      <input {...form.register("email")} placeholder="Email" className="elegant-input w-full" />
      <div className="flex gap-2">
        <button type="button" className="elegant-btn-secondary flex-1" onClick={onCancel}>Cancel</button>
        <button type="submit" className="elegant-btn-primary flex-1">Add</button>
      </div>
    </form>
  );
}
