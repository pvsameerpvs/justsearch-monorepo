"use client";

import { useState, useMemo, useCallback } from "react";
import { useVouchersQuery, useCreateVoucherMutation, useUpdateVoucherMutation, useDeleteVoucherMutation } from "@/lib/hooks/use-vouchers-query";
import { getVoucherStatus } from "./voucher-status-helpers";
import type { VoucherFormData } from "@/lib/validations/dashboard.schema";
import type { VoucherStats } from "../types/voucher.types";

export function useVoucherManager() {
  const { data, isLoading, error, refetch } = useVouchersQuery();
  const createMutation = useCreateVoucherMutation();
  const updateMutation = useUpdateVoucherMutation();
  const deleteMutation = useDeleteVoucherMutation();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [justCreatedCode, setJustCreatedCode] = useState<string | null>(null);
  const vouchers = data?.vouchers ?? [];
  const stats: VoucherStats = useMemo(() => ({
    total: vouchers.length,
    active: vouchers.filter((v) => getVoucherStatus(v) === "active").length,
    expired: vouchers.filter((v) => getVoucherStatus(v) === "expired").length,
    scheduled: vouchers.filter((v) => getVoucherStatus(v) === "scheduled").length,
    usedCount: vouchers.reduce((sum, v) => sum + v.usageCount, 0),
  }), [vouchers]);
  const filteredVouchers = useMemo(() => {
    if (filterStatus === "all") return vouchers;
    return vouchers.filter((v) => getVoucherStatus(v) === filterStatus);
  }, [vouchers, filterStatus]);
  const editingVoucher = useMemo(() => (editingId ? vouchers.find((v) => v.id === editingId) ?? null : null), [editingId, vouchers]);
  const deletingVoucher = useMemo(() => (deletingId ? vouchers.find((v) => v.id === deletingId) ?? null : null), [deletingId, vouchers]);
  const onSave = useCallback((data: VoucherFormData) => {
    if (editingId) {
      updateMutation.mutate({ id: editingId, data }, { onSuccess: () => setEditingId(null) });
    } else {
      createMutation.mutate(data, { onSuccess: () => { setShowForm(false); setJustCreatedCode(data.code); }, onError: (error: any) => { alert(error?.message || 'Failed to create voucher'); } });
    }
  }, [editingId, updateMutation, createMutation]);
  const onDelete = useCallback(() => {
    if (deletingId) {
      deleteMutation.mutate(deletingId, { onSuccess: () => setDeletingId(null) });
    }
  }, [deletingId, deleteMutation]);
  const toggleActive = useCallback((id: string) => {
    const voucher = vouchers.find((v) => v.id === id);
    if (!voucher) return;
    updateMutation.mutate({
      id,
      data: { code: voucher.code, title: voucher.title, description: voucher.description, type: voucher.type, value: voucher.value, minOrderValue: voucher.minOrderValue, maxDiscount: voucher.maxDiscount, usageLimit: voucher.usageLimit, startDate: voucher.startDate, endDate: voucher.endDate, isActive: !voucher.isActive },
    });
  }, [vouchers, updateMutation]);
  return {
    vouchers: filteredVouchers, stats, isLoading, error, refetch,
    filterStatus, setFilterStatus, showForm, setShowForm,
    editingId, setEditingId, deletingId, setDeletingId,
    editingVoucher, deletingVoucher, onSave, onDelete, toggleActive,
    justCreatedCode, setJustCreatedCode,
  };
}
