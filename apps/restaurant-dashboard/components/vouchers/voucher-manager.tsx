"use client";

import { PageHeader } from "@justsearch/ui";
import { useVoucherManager } from "./hooks/use-voucher-manager";
import { VoucherHeader } from "./voucher-header";
import { VoucherStatsCards } from "./voucher-stats-cards";
import { VoucherList, VoucherEmpty } from "./voucher-list";
import { VoucherFormModal } from "./voucher-form-modal";
import { VoucherDeleteModal } from "./voucher-delete-modal";

export function VoucherManager() {
  const {
    vouchers,
    stats,
    filterStatus,
    setFilterStatus,
    showForm,
    setShowForm,
    editingId,
    setEditingId,
    setDeletingId,
    editingVoucher,
    deletingVoucher,
    onSave,
    onDelete,
    toggleActive,
  } = useVoucherManager();

  return (
    <div className="space-y-5">
      <PageHeader
        title="Vouchers"
        description="Create, manage, and track promotional vouchers and discounts"
      />

      <VoucherStatsCards stats={stats} />

      <VoucherHeader
        filter={filterStatus}
        onFilterChange={setFilterStatus}
        onAdd={() => setShowForm(true)}
      />

      {vouchers.length === 0 ? (
        <VoucherEmpty onAdd={() => setShowForm(true)} />
      ) : (
        <VoucherList
          vouchers={vouchers}
          onEdit={setEditingId}
          onDelete={setDeletingId}
          onToggle={toggleActive}
        />
      )}

      {(showForm || editingId) && (
        <VoucherFormModal
          voucher={editingVoucher}
          onSave={onSave}
          onCancel={() => {
            setShowForm(false);
            setEditingId(null);
          }}
        />
      )}

      {deletingVoucher && (
        <VoucherDeleteModal
          voucher={deletingVoucher}
          onConfirm={onDelete}
          onCancel={() => setDeletingId(null)}
        />
      )}
    </div>
  );
}
