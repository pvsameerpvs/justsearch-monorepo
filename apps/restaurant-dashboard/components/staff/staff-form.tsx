import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["manager", "cashier", "kitchen_staff"]),
});

type FormData = z.infer<typeof schema>;

interface StaffFormProps {
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
  isPending?: boolean;
  error?: string | null;
}

export function StaffForm({ onSubmit, onCancel, isPending, error }: StaffFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: "cashier" },
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="elegant-card space-y-3 p-5">
      <p className="text-sm font-bold text-slate-900">Add Staff</p>
      <div>
        <input {...form.register("name")} placeholder="Full Name" className="elegant-input w-full" />
        {form.formState.errors.name && <p className="mt-1 text-xs text-red-500">{form.formState.errors.name.message}</p>}
      </div>
      <div>
        <input {...form.register("username")} placeholder="Username" className="elegant-input w-full" />
        {form.formState.errors.username && <p className="mt-1 text-xs text-red-500">{form.formState.errors.username.message}</p>}
      </div>
      <div>
        <input type="password" {...form.register("password")} placeholder="Password" className="elegant-input w-full" />
        {form.formState.errors.password && <p className="mt-1 text-xs text-red-500">{form.formState.errors.password.message}</p>}
      </div>
      <div>
        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Role</label>
        <select {...form.register("role")} className="elegant-input w-full mt-1">
          <option value="manager">Manager</option>
          <option value="cashier">Cashier</option>
          <option value="kitchen_staff">Kitchen Staff</option>
        </select>
      </div>
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-100 px-3 py-2 text-xs text-red-600">
          {error}
        </div>
      )}
      <div className="flex gap-2 pt-1">
        <button type="button" className="elegant-btn-secondary flex-1" onClick={onCancel}>Cancel</button>
        <button type="submit" className="elegant-btn-primary flex-1" disabled={isPending}>{isPending ? "Saving..." : "Add Member"}</button>
      </div>
    </form>
  );
}
