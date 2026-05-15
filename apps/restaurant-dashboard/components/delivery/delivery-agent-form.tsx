import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(5, "Phone must be at least 5 characters"),
  email: z.string().email("Invalid email"),
  location: z.string().min(1, "Location is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type FormData = z.infer<typeof schema>;

interface DeliveryAgentFormProps {
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
  isPending?: boolean;
}

export function DeliveryAgentForm({ onSubmit, onCancel, isPending }: DeliveryAgentFormProps) {
  const form = useForm<FormData>({ resolver: zodResolver(schema) });
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="elegant-card space-y-3 p-5">
      <p className="text-sm font-bold text-slate-900">Add Driver</p>
      <p className="text-xs text-slate-400">Username will be auto-generated from driver ID</p>
      <div>
        <input {...form.register("name")} placeholder="Full Name" className="elegant-input w-full" />
        {form.formState.errors.name && <p className="mt-1 text-xs text-red-500">{form.formState.errors.name.message}</p>}
      </div>
      <div>
        <input {...form.register("phone")} placeholder="Phone Number" className="elegant-input w-full" />
        {form.formState.errors.phone && <p className="mt-1 text-xs text-red-500">{form.formState.errors.phone.message}</p>}
      </div>
      <div>
        <input {...form.register("email")} placeholder="Email Address" className="elegant-input w-full" />
        {form.formState.errors.email && <p className="mt-1 text-xs text-red-500">{form.formState.errors.email.message}</p>}
      </div>
      <div>
        <input {...form.register("location")} placeholder="Base Location (e.g. Marina, JLT)" className="elegant-input w-full" />
        {form.formState.errors.location && <p className="mt-1 text-xs text-red-500">{form.formState.errors.location.message}</p>}
      </div>
      <div>
        <input type="password" {...form.register("password")} placeholder="Set Password (min 6 chars)" className="elegant-input w-full" />
        {form.formState.errors.password && <p className="mt-1 text-xs text-red-500">{form.formState.errors.password.message}</p>}
      </div>
      <div className="flex gap-2 pt-1">
        <button type="button" className="elegant-btn-secondary flex-1" onClick={onCancel}>Cancel</button>
        <button type="submit" className="elegant-btn-primary flex-1" disabled={isPending}>{isPending ? "Adding..." : "Add Driver"}</button>
      </div>
    </form>
  );
}
