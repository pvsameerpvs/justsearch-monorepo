"use client";

import { useState } from "react";
import { Users, Search, Phone, Mail, MapPin, Trash2 } from "lucide-react";
import { PageHeader } from "@justsearch/ui";

const DEMO_USERS = [
  { id: "1", name: "Amina Hassan", phone: "+971 55 111 2222", email: "amina@email.com", city: "Dubai", orders: 24, status: "active" },
  { id: "2", name: "Khalid Al Mansoori", phone: "+971 50 333 4444", email: "khalid@email.com", city: "Dubai", orders: 18, status: "active" },
  { id: "3", name: "Priya Nair", phone: "+971 52 555 6666", email: "priya@email.com", city: "Dubai", orders: 12, status: "active" },
  { id: "4", name: "Omar Farooq", phone: "+971 56 777 8888", email: "omar@email.com", city: "Abu Dhabi", orders: 8, status: "inactive" },
];

export default function UsersPage() {
  const [users, setUsers] = useState(DEMO_USERS);
  const [search, setSearch] = useState("");

  const filtered = users.filter((u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <PageHeader title="Users" description="Platform user management">
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
          <Search className="h-4 w-4 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..." className="text-sm outline-none w-48" />
        </div>
      </PageHeader>

      <div className="space-y-3">
        {filtered.map((user) => (
          <UserRow key={user.id} user={user} onRemove={() => setUsers(users.filter((u) => u.id !== user.id))} />
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <Users className="mx-auto h-10 w-10 mb-3 opacity-50" />
            <p className="text-sm">No users found</p>
          </div>
        )}
      </div>
    </div>
  );
}

function UserRow({ user, onRemove }: { user: (typeof DEMO_USERS)[number]; onRemove: () => void }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-sm font-bold text-blue-700">
            {user.name.split(" ").map((n) => n[0]).join("")}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-bold text-slate-900">{user.name}</p>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${user.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                {user.status}
              </span>
            </div>
            <div className="flex flex-wrap gap-3 mt-1 text-xs text-slate-500">
              <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {user.phone}</span>
              <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {user.email}</span>
              <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {user.city}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-bold text-slate-700">{user.orders} orders</p>
          </div>
          <button onClick={onRemove} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
