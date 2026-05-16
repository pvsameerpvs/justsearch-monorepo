import { useQuery } from '@tanstack/react-query';
import { fetchMenu } from '@/lib/api/menu.api';

const STALE_TIME = 5 * 60 * 1000;

export function useMenuQuery(host?: string) {
  return useQuery({
    queryKey: ['menu', host],
    queryFn: () => fetchMenu(host ?? ''),
    staleTime: STALE_TIME,
    enabled: Boolean(host),
  });
}
