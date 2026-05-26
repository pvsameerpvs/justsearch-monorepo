"use client";

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

const POLL_INTERVAL_MS = 5000;
const STALE_TIME = 30000;

export interface ApiAssignment {
  assignment_id: string;
  order_id: string;
  agent_id: string;
  assignment_status: string;
  assigned_at: string;
  picked_up_at: string | null;
  delivered_at: string | null;
  code: string;
  order_status: string;
  customer_name: string;
  customer_phone: string;
  subtotal: string;
  delivery_fee: string;
  tax: string;
  total: string;
  delivery_address: string | null;
  lat: string | null;
  lng: string | null;
  notes: string | null;
  payment_method: string | null;
  payment_status: string;
  eta_minutes: number | null;
  created_at: string;
  items: Array<{
    name: string;
    quantity: number;
    price: string;
    currency: string;
  }>;
}

interface AssignmentsResponse {
  assignments: ApiAssignment[];
}

async function fetchAssignments(agentId: string): Promise<AssignmentsResponse> {
  return apiClient(`/delivery-assignments?agentId=${encodeURIComponent(agentId)}`);
}

export function useDriverOrdersQuery(driverId: string | null) {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['driverAssignments', driverId],
    queryFn: () => {
      if (!driverId) return Promise.resolve({ assignments: [] });
      return fetchAssignments(driverId);
    },
    enabled: Boolean(driverId),
    refetchInterval: POLL_INTERVAL_MS,
    staleTime: STALE_TIME,
  });

  return {
    assignments: data?.assignments ?? [],
    isLoading,
    refetch,
  };
}
