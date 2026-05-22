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
  accessToken?: string;
  refreshToken?: string;
  user: AuthMeResponse;
}

function saveTokens(res: LoginResponse) {
  const access = res.accessToken ?? res.token;
  const refresh = res.refreshToken;
  if (access && refresh) {
    window.localStorage.setItem('justsearch:accessToken', access);
    window.localStorage.setItem('justsearch:refreshToken', refresh);
    window.sessionStorage.setItem('justsearch:accessToken', access);
    window.sessionStorage.setItem('justsearch:refreshToken', refresh);
  }
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
    onSuccess: (res) => {
      saveTokens(res);
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });
}
