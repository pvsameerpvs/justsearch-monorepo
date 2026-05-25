import { useEffect } from 'react';
import { apiClient } from '@/lib/api/client';
import { useRegistration } from '@/components/auth/registration-context';
import type { RegisteredUser } from '@/components/auth/registered-user';

export function useAuthMe() {
  const { user, setUser, clearUser, openModal } = useRegistration();
  const token = user?.token;

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    async function verify() {
      try {
        const data = await apiClient<{
          id: string;
          name: string | null;
          phone: string | null;
          email: string | null;
          role: string;
          restaurantId: string;
          type: string;
          points?: number;
        }>('/auth/me');

        if (cancelled) return;

        const nextUser: RegisteredUser = {
          id: data.id,
          name: data.name || user?.name || '',
          mobile: data.phone || user?.mobile || '',
          verifiedAt: user?.verifiedAt ?? Date.now(),
          token: token!,
        };

        setUser(nextUser);
      } catch (error) {
        if (cancelled) return;
        // Token expired or invalid — clear session
        clearUser();
        openModal();
      }
    }

    verify();

    return () => {
      cancelled = true;
    };
  }, [token, setUser, clearUser, openModal, user?.name, user?.mobile, user?.verifiedAt]);
}
