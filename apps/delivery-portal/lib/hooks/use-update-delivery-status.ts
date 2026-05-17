import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

interface UpdateAssignmentVars {
  assignmentId: string;
  status: string;
}

async function updateAssignmentStatus({ assignmentId, status }: UpdateAssignmentVars) {
  return apiClient(`/delivery-assignments/${assignmentId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export function useUpdateDeliveryStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAssignmentStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['driverAssignments'] });
    },
  });
}
