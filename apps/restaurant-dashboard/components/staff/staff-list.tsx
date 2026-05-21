import { StaffCard } from "./staff-card";
import type { StaffMember } from "@/lib/hooks/use-staff-query";

interface StaffListProps {
  members: StaffMember[];
  onEdit: (id: string) => void;
  onRemove: (id: string) => void;
  canManage?: boolean;
}

export function StaffList({ members, onEdit, onRemove, canManage }: StaffListProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {members.map((member) => (
        <StaffCard
          key={member.id}
          member={member}
          onEdit={() => onEdit(member.id)}
          onRemove={() => onRemove(member.id)}
          canManage={canManage}
        />
      ))}
    </div>
  );
}
