import { apiClient } from "@/lib/api-client";

export function useDeleteRestaurant(refetch: () => void) {
  return async (id: string, username: string, password: string) => {
    await apiClient(`/restaurants/${id}`, {
      method: "DELETE",
      body: JSON.stringify({ username, password }),
    });
    refetch();
  };
}
