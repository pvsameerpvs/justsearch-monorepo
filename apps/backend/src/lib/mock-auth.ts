export const MOCK_AUTH_ENABLED = process.env.MOCK_AUTH === 'true';

export interface MockUser {
  id: string;
  username: string;
  password: string;
  name: string;
  role: string;
  type: 'staff' | 'delivery' | 'super_admin';
  restaurantId?: string;
}

export const MOCK_USERS: MockUser[] = [
  {
    id: 'mock-admin-1',
    username: 'admin',
    password: 'admin123',
    name: 'Platform Admin',
    role: 'super_admin',
    type: 'super_admin',
  },
  {
    id: 'mock-staff-1',
    username: 'owner_mosaic',
    password: 'owner123',
    name: 'Omar Hassan',
    role: 'owner',
    type: 'staff',
    restaurantId: 'mock-rest-1',
  },
  {
    id: 'mock-driver-1',
    username: 'samira_khan',
    password: 'rider123',
    name: 'Samira Khan',
    role: 'driver',
    type: 'delivery',
    restaurantId: 'mock-rest-1',
  },
];

export const MOCK_RESTAURANT = {
  id: 'mock-rest-1',
  slug: 'mosaic-table',
  subdomain: 'mosaic-table',
  schemaName: 'rest_mosaic',
  name: 'Mosaic Table',
  status: 'active',
  settings: '{}',
  theme: JSON.stringify({
    brandColor: '15 118 110',
    brandSoft: '223 247 243',
    accentColor: '245 170 66',
  }),
};

export function findMockUser(
  username: string,
  password: string,
  type: string
): MockUser | null {
  return (
    MOCK_USERS.find(
      (u) =>
        u.username === username && u.password === password && u.type === type
    ) ?? null
  );
}
