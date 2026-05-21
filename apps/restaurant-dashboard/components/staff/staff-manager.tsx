"use client";

import { useState } from "react";
import { useStaffQuery, useCreateStaffMutation, useUpdateStaffMutation, useDeleteStaffMutation, type StaffMember } from "@/lib/hooks/use-staff-query";
import { useDashboardAuth } from "@/lib/auth-context";
import { isRoleAtLeast } from "@/lib/utils/role-guards";
import { StaffHeader } from "./staff-header";
import { StaffList } from "./staff-list";
import { StaffEmpty } from "./staff-empty";
import { StaffForm } from "./staff-form";
import { StaffEditForm } from "./staff-edit-form";
import { ConfirmDeleteDialog } from "../shared/confirm-delete-dialog";

export function StaffManager() {
  const { data, isLoading, error, refetch } = useStaffQuery();
  const createMutation = useCreateStaffMutation();
  const updateMutation = useUpdateStaffMutation();
  const deleteMutation = useDeleteStaffMutation();
  const { user } = useDashboardAuth();
  const canManage = isRoleAtLeast(user?.role ?? "", "manager");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingMember, setDeletingMember] = useState<StaffMember | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-slate-200 rounded animate-pulse" />
        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-slate-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="flex flex-col items-center gap-4 py-12"><p className="text-red-500">{error.message}</p><button onClick={() => refetch()} className="elegant-btn-primary">Retry</button></div>;
  }

  const members = data?.staff ?? [];
  const editingMember = members.find((m) => m.id === editingId) ?? null;

  return (
    <div className="space-y-5">
      {members.length === 0 ? (
        <StaffEmpty onAdd={() => { createMutation.reset(); setShowForm(true); }} canManage={canManage} />
      ) : (
        <>
          <StaffHeader total={members.length} onAdd={() => { createMutation.reset(); setShowForm(true); }} canManage={canManage} />
          <StaffList
            members={members}
            onEdit={(id) => {
              if (!canManage) return;
              updateMutation.reset();
              setEditingId(id);
            }}
            onRemove={(id) => {
              if (!canManage) return;
              const member = members.find((m) => m.id === id);
              if (member) setDeletingMember(member);
            }}
            canManage={canManage}
          />
        </>
      )}

      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md">
            <StaffForm
              onSubmit={(data: Record<string, unknown>) => createMutation.mutate(data, { onSuccess: () => setShowForm(false) })}
              onCancel={() => { createMutation.reset(); setShowForm(false); }}
              isPending={createMutation.isPending}
              error={createMutation.error instanceof Error ? createMutation.error.message : null}
            />
          </div>
        </div>
      )}

      {editingMember && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md">
            <StaffEditForm
              member={editingMember}
              onSave={(data: Record<string, unknown>) => updateMutation.mutate({ id: editingMember.id, data }, { onSuccess: () => setEditingId(null) })}
              onCancel={() => { updateMutation.reset(); setEditingId(null); }}
              isPending={updateMutation.isPending}
              error={updateMutation.error instanceof Error ? updateMutation.error.message : null}
            />
          </div>
        </div>
      )}

      {deletingMember && (
        <ConfirmDeleteDialog
          title="Delete Staff Member?"
          itemName={deletingMember.name}
          onConfirm={() => {
            deleteMutation.mutate(deletingMember.id, {
              onSuccess: () => setDeletingMember(null),
              onError: () => setDeletingMember(null),
            });
          }}
          onCancel={() => setDeletingMember(null)}
          isPending={deleteMutation.isPending}
        />
      )}
    </div>
  );
}
