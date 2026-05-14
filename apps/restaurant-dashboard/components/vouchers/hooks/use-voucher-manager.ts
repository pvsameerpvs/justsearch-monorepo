"use client";

import { useState, useMemo, useCallback } from "react";
import { useVoucherStore } from "@/lib/stores/voucher-store";
import { getVoucherStatus } from "./voucher-status-helpers";
import type { VoucherFormData, VoucherStats } from "../types/voucher.types";

export function useVoucherManager() {
  const { vouchers, addVoucher, updateVoucher, deleteVoucher, toggleActive } = useVoucherStore();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const stats: VoucherStats = useMemo(() => {
    return {
      total: vouchers.length,
      active: vouchers.filter((v) => getVoucherStatus(v) === "active").length,
      expired: vouchers.filter((v) => getVoucherStatus(v) === "expired").length,
      scheduled: vouchers.filter((v) => getVoucherStatus(v) === "scheduled").length,
      usedCount: vouchers.reduce((sum, v) => sum + v.usageCount, 0),
    };
  }, [vouchers]);

  const filteredVouchers = useMemo(() => {
    if (filterStatus === "all") return vouchers;
    return vouchers.filter((v) => getVoucherStatus(v) === filterStatus);
  }, [vouchers, filterStatus]);

  const editingVoucher = useMemo(
    () => (editingId ? vouchers.find((v) => v.id === editingId) ?? null : null),
    [editingId, vouchers]
  );

  const deletingVoucher = useMemo(
    () => (deletingId ? vouchers.find((v) => v.id === deletingId) ?? null : null),
    [deletingId, vouchers]
  );

  const onSave = useCallback(
    (data: VoucherFormData) => {
      if (editingId) {
        updateVoucher(editingId, data);
        setEditingId(null);
      } else {
        addVoucher(data);
        setShowForm(false);
      }
    },
    [editingId, updateVoucher, addVoucher]
  );

  const onDelete = useCallback(() => {
    if (deletingId) {
      deleteVoucher(deletingId);
      setDeletingId(null);
    }
  }, [deletingId, deleteVoucher]);

  return {
    vouchers: filteredVouchers,
    stats,
    filterStatus,
    setFilterStatus,
    showForm,
    setShowForm,
    editingId,
    setEditingId,
    deletingId,
    setDeletingId,
    editingVoucher,
    deletingVoucher,
    onSave,
    onDelete,
    toggleActive,
  };
}
