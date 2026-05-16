import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { DeliveryAgent } from "@/lib/hooks/use-delivery-agents-query";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(5, "Phone must be at least 5 characters"),
  email: z.string().email("Invalid email"),
  location: z.string().min(1, "Location is required"),
  vehicleType: z.enum(["bike", "scooter", "car"]),
  password: z.string().optional().or(z.literal("")),
});
type FormData = z.infer<typeof schema>;

interface DriverEditFormProps {
  agent: DeliveryAgent;
  onSave: (data: Partial<FormData>) => void;
  onCancel: () => void;
  isPending?: boolean;
}

export function DriverEditForm({ agent, onSave, onCancel, isPending }: DriverEditFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: agent.name, phone: agent.phone, email: agent.email,
      location: agent.location, vehicleType: agent.vehicleType as "bike" | "scooter" | "car" || "scooter",
      password: "",
    },
  });

  const handleSubmit = (data: FormData) => {
    const payload: Partial<FormData> = { name: data.name, phone: data.phone, email: data.email, location: data.location, vehicleType: data.vehicleType };
    if (data.password) payload.password = data.password;
    onSave(payload);
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="elegant-card space-y-3 p-5">
      <p className="text-sm font-bold text-slate-900">Edit Driver</p>
      <div className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-2">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Username (Login ID)</p>
        <p className="text-sm font-mono font-bold text-slate-900">{agent.username}</p>
      </div>
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
        <select {...form.register("vehicleType")} className="elegant-input w-full">
          <option value="scooter">Scooter</option>
          <option value="bike">Bike</option>
          <option value="car">Car</option>
        </select>
      </div>
      <div>
        <input type="password" {...form.register("password")} placeholder="New Password (leave empty to keep current)" className="elegant-input w-full" />
        {form.formState.errors.password && <p className="mt-1 text-xs text-red-500">{form.formState.errors.password.message}</p>}
      </div>
      <div className="flex gap-2 pt-1">
        <button type="button" className="elegant-btn-secondary flex-1" onClick={onCancel}>Cancel</button>
        <button type="submit" className="elegant-btn-primary flex-1" disabled={isPending}>{isPending ? "Saving..." : "Save Changes"}</button>
      </div>
    </form>
  );
}
