"use client";

import { useMemo } from 'react';
import { Surface } from '@/components/shared/surface';
import { useRegistration } from '@/components/auth/registration-context';

function formatVerifiedAt(value: number) {
  try {
    return new Date(value).toLocaleString();
  } catch {
    return '';
  }
}

export function RegistrationSettingsCard() {
  const { user, isRegistered, openModal, clearUser } = useRegistration();

  const verifiedAt = useMemo(() => {
    if (!user?.verifiedAt) return null;
    const formatted = formatVerifiedAt(user.verifiedAt);
    return formatted || null;
  }, [user?.verifiedAt]);

  return (
    <Surface className="rounded-[28px] border-white/70 bg-white/90 p-6">
      <p className="text-sm font-semibold text-[rgb(var(--ink))]">
        Registration
      </p>
      {isRegistered && user ? (
        <div className="mt-2 space-y-1 text-sm text-[rgb(var(--muted))]">
          <div>
            Name: <span className="font-semibold text-[rgb(var(--ink))]">{user.name}</span>
          </div>
          <div>
            Mobile: <span className="font-mono text-[rgb(var(--ink))]">{user.mobile}</span>
          </div>
          {verifiedAt ? <div>Verified: {verifiedAt}</div> : null}
        </div>
      ) : (
        <p className="mt-2 text-sm text-[rgb(var(--muted))]">
          Not verified yet. You need verification to play games.
        </p>
      )}

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        {!isRegistered ? (
          <button
            type="button"
            onClick={openModal}
            className="inline-flex h-11 items-center justify-center rounded-2xl bg-[rgb(var(--brand))] px-5 text-sm font-semibold text-white shadow-[0_14px_36px_rgb(var(--brand)/0.22)] transition-all hover:brightness-110 active:scale-[0.99]"
          >
            Verify mobile
          </button>
        ) : (
          <button
            type="button"
            onClick={openModal}
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-[rgb(var(--border)/0.9)] bg-white px-5 text-sm font-semibold text-[rgb(var(--ink))] transition-all hover:bg-[rgb(var(--card-surface-muted)/0.6)] active:scale-[0.99]"
          >
            Change number
          </button>
        )}

        {isRegistered ? (
          <button
            type="button"
            onClick={clearUser}
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-[rgb(var(--border)/0.9)] bg-white px-5 text-sm font-semibold text-red-600 transition-all hover:bg-red-50 active:scale-[0.99]"
          >
            Clear registration
          </button>
        ) : null}
      </div>
    </Surface>
  );
}

