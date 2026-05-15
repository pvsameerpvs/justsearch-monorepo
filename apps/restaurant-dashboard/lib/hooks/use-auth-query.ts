import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

interface AuthMeResponse {
  id: string;
  name: string;
  role: string;
  type: string;
  restaurantId?: string;
}

interface LoginBody {
  username: string;
  password: string;
  type: string;
}

interface LoginResponse {
  token: string;
  user: AuthMeResponse;
}

async function fetchMe(): Promise<AuthMeResponse> {
  return apiClient<AuthMeResponse>('/auth/me');
}

async function login(body: LoginBody): Promise<LoginResponse> {
  return apiClient<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function useAuthMeQuery() {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: fetchMe,
    retry: false,
  });
}

export function useLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });
}
