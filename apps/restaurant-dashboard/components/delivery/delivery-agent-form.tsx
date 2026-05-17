import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

function generateUsername(name: string): string {
  const prefix = name.toLowerCase().replace(/[^a-z]/g, "").slice(0, 8);
  const num = Math.floor(100 + Math.random() * 900);
  return `${prefix}_${num}`;
}

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(5, "Phone must be at least 5 characters"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  vehicleType: z.enum(["bike", "scooter", "car"]),
});
type FormData = z.infer<typeof schema>;

interface DeliveryAgentFormProps {
  onSubmit: (data: FormData & { username: string }) => void;
  onCancel: () => void;
  isPending?: boolean;
  error?: string | null;
}

export function DeliveryAgentForm({ onSubmit, onCancel, isPending, error }: DeliveryAgentFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { vehicleType: "scooter" },
  });
  const nameValue = form.watch("name");

  return (
    <form onSubmit={form.handleSubmit((data) => onSubmit({ ...data, username: data.username || generateUsername(data.name) }))} className="elegant-card space-y-3 p-5">
      <p className="text-sm font-bold text-slate-900">Add Driver</p>
      <p className="text-xs text-slate-400">Username will be auto-generated from their name</p>
      <div>
        <input {...form.register("name")} placeholder="Full Name" className="elegant-input w-full" />
        {form.formState.errors.name && <p className="mt-1 text-xs text-red-500">{form.formState.errors.name.message}</p>}
      </div>
      <div>
        <input {...form.register("phone")} placeholder="Phone Number" className="elegant-input w-full" />
        {form.formState.errors.phone && <p className="mt-1 text-xs text-red-500">{form.formState.errors.phone.message}</p>}
      </div>
      <div>
        <input {...form.register("username")} placeholder="Username (or leave blank to auto-generate)" className="elegant-input w-full" />
        {form.formState.errors.username && <p className="mt-1 text-xs text-red-500">{form.formState.errors.username.message}</p>}
      </div>
      <div>
        <select {...form.register("vehicleType")} className="elegant-input w-full">
          <option value="scooter">Scooter</option>
          <option value="bike">Bike</option>
          <option value="car">Car</option>
        </select>
      </div>
      <div>
        <input type="password" {...form.register("password")} placeholder="Set Password (min 6 chars)" className="elegant-input w-full" />
        {form.formState.errors.password && <p className="mt-1 text-xs text-red-500">{form.formState.errors.password.message}</p>}
      </div>
      {nameValue && !form.watch("username") && (
        <p className="text-[10px] text-slate-400 font-mono">Username: {generateUsername(nameValue)}</p>
      )}
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-100 px-3 py-2 text-xs text-red-600">
          {error}
        </div>
      )}
      <div className="flex gap-2 pt-1">
        <button type="button" className="elegant-btn-secondary flex-1" onClick={onCancel}>Cancel</button>
        <button type="submit" className="elegant-btn-primary flex-1" disabled={isPending}>{isPending ? "Adding..." : "Add Driver"}</button>
      </div>
    </form>
  );
}
