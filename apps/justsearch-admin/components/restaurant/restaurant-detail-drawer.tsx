"use client";

import { useState } from "react";
import { X, Globe, ExternalLink, Pencil, Check, ImageIcon, Calendar, Lock, UserCircle, Copy, CheckCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { AdminRestaurant } from "@/lib/stores/restaurant-store";
import { RestaurantDetailForm } from "./restaurant-detail-form";
import { RestaurantDetailQr } from "./restaurant-detail-qr";
import { RestaurantDetailLicense } from "./restaurant-detail-license";
import { RestaurantPhotoUpload } from "./restaurant-photo-upload";

interface RestaurantDetailDrawerProps {
  restaurant: AdminRestaurant;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updates: Partial<AdminRestaurant>) => void;
  onRemove: () => void;
}

export function RestaurantDetailDrawer({ restaurant, isOpen, onClose, onUpdate, onRemove }: RestaurantDetailDrawerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<Partial<AdminRestaurant>>({});

  if (!isOpen) return null;

  const handleSave = () => {
    onUpdate(form);
    setIsEditing(false);
    setForm({});
  };

  const handleEdit = () => {
    setForm({ ...restaurant });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setForm({});
  };

  const handleChange = (field: keyof AdminRestaurant, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative h-full w-full max-w-xl overflow-y-auto bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-slate-100 bg-white/95 backdrop-blur px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">{restaurant.name}</h2>
              <StatusBadge status={restaurant.status} />
            </div>
            <div className="flex items-center gap-1">
              {isEditing ? (
                <>
                  <button onClick={handleCancel} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"><X className="h-4 w-4" /></button>
                  <button onClick={handleSave} className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-white hover:bg-emerald-600"><Check className="h-4 w-4" /></button>
                </>
              ) : (
                <button onClick={handleEdit} className="flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-200">
                  <Pencil className="h-3 w-3" /> Edit
                </button>
              )}
              <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 ml-1"><X className="h-4 w-4" /></button>
            </div>
          </div>
        </div>

        <div className="p-5 space-y-6">
          {/* Meta */}
          <div className="flex items-center gap-2 text-[10px] text-slate-400">
            <Calendar className="h-3 w-3" />
            <span>Created on {restaurant.createdAt}</span>
          </div>

          {/* Domains */}
          <div className="flex gap-2">
            <DomainLink label="Customer Site" url={`https://${restaurant.subdomain}.js-restorant.com`} icon={Globe} />
            <DomainLink label="Dashboard" url={`https://admin-${restaurant.subdomain}.js-restorant.com`} icon={ExternalLink} />
          </div>

          {/* Form */}
          <RestaurantDetailForm
            restaurant={restaurant}
            isEditing={isEditing}
            form={form}
            onChange={handleChange}
          />

          {/* Dashboard Credentials */}
          <DashboardCredentialsCard restaurant={restaurant} />

          {/* Photos */}
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
              <ImageIcon className="h-4 w-4 text-rose-500" />
              Restaurant Photos
            </h3>
            <RestaurantPhotoUpload
              photos={(form.photos !== undefined ? form.photos : restaurant.photos) || []}
              onChange={(p) => {
                setForm((prev) => ({ ...prev, photos: p }));
                if (!isEditing) onUpdate({ photos: p });
              }}
            />
          </div>

          {/* QR Code */}
          <RestaurantDetailQr subdomain={restaurant.subdomain} />

          {/* License */}
          <RestaurantDetailLicense
            restaurant={restaurant}
            isEditing={isEditing}
            form={form}
            onChange={handleChange}
            onUpdate={onUpdate}
          />

          {/* Delete */}
          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={() => { onRemove(); onClose(); }}
              className="w-full rounded-xl bg-red-50 px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-100 transition-colors"
            >
              Delete Restaurant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
      {status}
    </span>
  );
}

function DashboardCredentialsCard({ restaurant }: { restaurant: AdminRestaurant }) {
  const [copiedUser, setCopiedUser] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);

  const username = restaurant.dashboardUsername || "";
  const password = restaurant.dashboardPassword || "";

  if (!username && !password) return null;

  const copyToClipboard = async (text: string, type: "user" | "pass") => {
    await navigator.clipboard.writeText(text);
    if (type === "user") {
      setCopiedUser(true);
      setTimeout(() => setCopiedUser(false), 2000);
    } else {
      setCopiedPass(true);
      setTimeout(() => setCopiedPass(false), 2000);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
        <Lock className="h-4 w-4 text-indigo-600" />
        Dashboard Login Credentials
      </h3>
      <div className="space-y-3">
        {username && (
          <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3">
            <div className="flex items-center gap-2">
              <UserCircle className="h-4 w-4 text-slate-400" />
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Username</p>
                <p className="text-sm font-medium text-slate-700">{username}</p>
              </div>
            </div>
            <button
              onClick={() => copyToClipboard(username, "user")}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-white hover:text-slate-600 transition-colors"
              title="Copy username"
            >
              {copiedUser ? <CheckCheck className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
          </div>
        )}
        {password && (
          <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-slate-400" />
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Password</p>
                <p className="text-sm font-medium text-slate-700">{"•".repeat(password.length)}</p>
              </div>
            </div>
            <button
              onClick={() => copyToClipboard(password, "pass")}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-white hover:text-slate-600 transition-colors"
              title="Copy password"
            >
              {copiedPass ? <CheckCheck className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function DomainLink({ label, url, icon: Icon }: { label: string; url: string; icon: LucideIcon }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </a>
  );
}
