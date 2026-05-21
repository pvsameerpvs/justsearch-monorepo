import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { StaffMember } from "@/lib/hooks/use-staff-query";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().optional().or(z.literal("")),
  role: z.enum(["manager", "cashier", "kitchen_staff"]),
  isActive: z.coerce.boolean(),
});

type FormData = z.infer<typeof schema>;

interface StaffEditFormProps {
  member: StaffMember;
  onSave: (data: Partial<FormData>) => void;
  onCancel: () => void;
  isPending?: boolean;
  error?: string | null;
}

export function StaffEditForm({ member, onSave, onCancel, isPending, error }: StaffEditFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: member.name,
      username: member.username,
      password: "",
      role: (member.role as "manager" | "cashier" | "kitchen_staff") || "cashier",
      isActive: member.isActive,
    },
  });

  const handleSubmit = (data: FormData) => {
    const payload: Partial<FormData> = {
      name: data.name,
      username: data.username,
      role: data.role,
      isActive: data.isActive,
    };
    if (data.password) payload.password = data.password;
    onSave(payload);
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="elegant-card space-y-3 p-5">
      <p className="text-sm font-bold text-slate-900">Edit Staff</p>
      <div className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-2">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Current Role</p>
        <p className="text-sm font-bold text-slate-900 capitalize">{member.role.replace("_", " ")}</p>
      </div>
      <div>
        <input {...form.register("name")} placeholder="Full Name" className="elegant-input w-full" />
        {form.formState.errors.name && <p className="mt-1 text-xs text-red-500">{form.formState.errors.name.message}</p>}
      </div>
      <div>
        <input {...form.register("username")} placeholder="Username" className="elegant-input w-full" />
        {form.formState.errors.username && <p className="mt-1 text-xs text-red-500">{form.formState.errors.username.message}</p>}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Role</label>
          <select {...form.register("role")} className="elegant-input w-full mt-1">
            <option value="manager">Manager</option>
            <option value="cashier">Cashier</option>
            <option value="kitchen_staff">Kitchen Staff</option>
          </select>
        </div>
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Status</label>
          <select {...form.register("isActive")} className="elegant-input w-full mt-1">
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
      </div>
      <div>
        <input type="password" {...form.register("password")} placeholder="New Password (leave empty to keep)" className="elegant-input w-full" />
      </div>
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-100 px-3 py-2 text-xs text-red-600">
          {error}
        </div>
      )}
      <div className="flex gap-2 pt-1">
        <button type="button" className="elegant-btn-secondary flex-1" onClick={onCancel}>Cancel</button>
        <button type="submit" className="elegant-btn-primary flex-1" disabled={isPending}>{isPending ? "Saving..." : "Save Changes"}</button>
      </div>
    </form>
  );
}
