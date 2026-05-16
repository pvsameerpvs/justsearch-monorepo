import bcrypt from 'bcrypt';
import { db } from '../index';
import { users, superAdmins } from '../schema';

const DEFAULT_ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || 'admin123';

export async function seedCustomer(restaurantId: string) {
  await db
    .insert(users)
    .values({
      restaurantId,
      phone: '+971501234567',
      name: 'Amina Hassan',
      role: 'customer',
      isActive: true,
    })
    .returning();
}

export async function seedSuperAdmin() {
  await db
    .insert(superAdmins)
    .values({
      name: 'Platform Admin',
      username: 'admin',
      passwordHash: await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, 12),
      email: 'admin@justsearch.com',
      isActive: true,
    })
    .returning();
}
