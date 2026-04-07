export interface User {
  id: string;
  email: string;
  role: 'admin' | 'restaurant' | 'customer';
}

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
}
