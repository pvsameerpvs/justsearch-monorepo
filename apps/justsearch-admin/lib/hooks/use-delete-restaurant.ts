import { apiClient } from "@/lib/api-client";

export function useDeleteRestaurant(refetch: () => void) {
  return async (id: string, username: string, password: string): Promise<{ backup?: string }> => {
    const result = await apiClient<{ backup?: string }>(`/restaurants/${id}`, {
      method: "DELETE",
      body: JSON.stringify({ username, password }),
    });
    refetch();
    return result ?? {};
  };
}
